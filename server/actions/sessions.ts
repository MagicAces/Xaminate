"use server";

import { authAction } from "./actions";
import {
  SessionInput,
  sessionSchema,
  sessionEditSchema,
  SessionEdit,
  sessionEndSchema,
} from "@/lib/schema";
import prisma from "@/prisma/prisma";
import _ from "lodash";
import { SessionQuery } from "@/types";
import { Prisma, TempStatus } from "@prisma/client";
import { formatDuration, getStatus, getStatusMessage } from "@/utils/functs";
import { format } from "date-fns";
import { isVenueAvailable, revalidateAllPaths } from "@/lib/sessions";

export const createSession = authAction(
  sessionSchema,
  async (session: SessionInput, { userId }) => {
    try {
      if (!session.sessionStart || !session.sessionEnd)
        return { error: "Dates can not be empty" };

      const venue = await prisma.venue.findUnique({
        where: {
          id: session.venue,
        },
      });

      if (!venue) return { error: "Venue not found" };

      const isAvailable = await isVenueAvailable(
        session.venue,
        session.sessionStart,
        session.sessionEnd
      );

      if (!isAvailable) return { error: "Venue is not available" };

      const newSession = await prisma.$transaction(async (prisma) => {
        if (!session.sessionStart || !session.sessionEnd) return null;

        const newSession = await prisma.session.create({
          data: {
            start_time: session.sessionStart,
            end_time: session.sessionEnd,
            created_by: Number(userId),
            course_names: session.courseNames.map((course) =>
              _.startCase(_.lowerCase(course))
            ),
            course_codes: session.courseCodes.map((code) => _.upperCase(code)),
            classes: session.classes.map((classe) => _.upperCase(classe)),
            invigilators: session.invigilators.map((invigilator) =>
              _.startCase(_.lowerCase(invigilator))
            ),
            venue_id: session.venue,
            temp_status:
              session.sessionStart < new Date() ? "pending" : "active",
            actual_end_time: session.sessionEnd,
          },
        });

        await prisma.venueBooking.create({
          data: {
            venue_id: session.venue,
            session_id: newSession.id,
            start_time: session.sessionStart,
            end_time: session.sessionEnd,
          },
        });

        await prisma.notification.create({
          data: {
            category: "Session",
            message: `Session #${newSession.id} has been created. It ${
              getStatusMessage(session.sessionStart, session.sessionEnd) ===
              "pending"
                ? `will start at ${format(
                    new Date(session.sessionStart),
                    "h:mm a"
                  )}`
                : `started at ${format(
                    new Date(session.sessionStart),
                    "h:mm a"
                  )}`
            }`,
            category_id: newSession.id,
          },
        });

        await prisma.attendance.create({
          data: {
            session_id: newSession.id,
          },
        });

        return newSession;
      });

      await revalidateAllPaths();

      if (newSession) return { success: "Session Created" };
      return { error: "Session could not be created" };
    } catch (error) {
      console.error(error);
      return { error: "Something wrong occurred" };
    }
  }
);

export const getSessions = async (query: SessionQuery) => {
  try {
    const {
      page = 1,
      limit = 15,
      venue,
      startTime,
      status,
      endTime,
      search,
    } = query;

    const offset = (page - 1) * limit;

    const statusResult: {}[] = getStatus(status);

    const searchFilter: Prisma.SessionWhereInput | undefined = search
      ? {
          OR: [
            { course_names: { has: search } }, // Exact match for course_names
            { course_codes: { has: search } }, // Exact match for course_codes
            { id: { equals: parseInt(search) || undefined } },
            { invigilators: { has: search } }, // Exact match for invigilators
            { classes: { has: search } }, // Exact match for classes
            { comments: { contains: search, mode: "insensitive" } }, // Partial match for comments
            { venue: { name: { contains: search, mode: "insensitive" } } }, // Partial match for venue name
          ],
        }
      : undefined;

    const andConditions: Prisma.SessionWhereInput[] = [
      venue ? { venue_id: venue } : undefined,
      startTime ? { created_on: { gte: new Date(startTime) } } : undefined,
      endTime ? { created_on: { lte: new Date(endTime) } } : undefined,
      ...statusResult,
      searchFilter,
    ].filter((x): x is Prisma.SessionWhereInput => x !== undefined);

    const where: Prisma.SessionWhereInput = {
      AND: andConditions,
    };

    const [sessions, totalCount, pendingCount, activeCount, closedCount] =
      await Promise.all([
        prisma.session.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: {
            created_on: "desc",
          },
          select: {
            id: true,
            created_on: true,
            course_codes: true,
            start_time: true,
            end_time: true,
            actual_end_time: true,
            venue: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                reports: true,
              },
            },
            attendance: {
              select: {
                student_count: true,
              },
            },
          },
        }),
        prisma.session.count({ where }),
        prisma.session.count({
          where: {
            AND: [
              ...(where.AND as []),
              { start_time: { gt: new Date() } },
              { temp_status: { not: TempStatus.closed } },
            ],
          },
        }),
        prisma.session.count({
          where: {
            AND: [
              ...(where.AND as []),
              { start_time: { lte: new Date() } },
              { end_time: { gte: new Date() } },
            ],
          },
        }),
        prisma.session.count({
          where: {
            AND: [
              ...(where.AND as []),
              {
                OR: [
                  { end_time: { lt: new Date() } },
                  { temp_status: { equals: TempStatus.closed } },
                ],
              },
            ],
          },
        }),
      ]);

    const formattedSessions = sessions.map((session) => {
      const startTime = session.start_time;
      const endTime = session.end_time;

      const {
        start_time,
        actual_end_time,
        end_time,
        _count,
        venue,
        attendance,
        ...rest
      } = session;

      const duration = actual_end_time
        ? startTime >= actual_end_time
          ? "Terminated"
          : formatDuration(new Date(startTime), new Date(endTime))
        : formatDuration(new Date(startTime), new Date(endTime));

      const status = actual_end_time
        ? startTime >= actual_end_time
          ? "closed"
          : getStatusMessage(new Date(startTime), new Date(endTime))
        : getStatusMessage(new Date(startTime), new Date(endTime));
      return {
        ...rest,
        reportsCount: _count.reports,
        created_on: session.created_on.toISOString(),
        duration,
        status,
        venue_name: venue.name,
        venue_id: venue.id,
        studentCount: attendance?.student_count || 0,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      success: {
        sessions: formattedSessions,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
        pageNumber: page,
        pendingCount,
        activeCount,
        closedCount,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSession = async (id: number) => {
  try {
    if (!id) return { error: "Id not found" };
    const foundSession = await prisma.session.findUnique({
      where: {
        id,
      },
      include: {
        attendance: {
          select: {
            student_count: true,
            id: true,
          },
        },
        venue: {
          select: {
            name: true,
            id: true,
          },
        },
        terminator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        reports: {
          select: {
            id: true,
            status: true,
            description: true,
            created_on: true,
            student: {
              select: {
                index_number: true,
                first_name: true,
                last_name: true,
                program: true,
                image_url: true,
              },
            },
          },
        },
        _count: {
          select: {
            reports: true,
          },
        },
      },
    });

    if (!foundSession) return { error: "Session not found" };

    const startTime = foundSession.start_time;
    const endTime = foundSession.end_time;

    const duration = foundSession?.actual_end_time
      ? startTime >= foundSession.actual_end_time
        ? "Terminated"
        : formatDuration(new Date(startTime), new Date(endTime))
      : formatDuration(new Date(startTime), new Date(endTime));

    const status = foundSession?.actual_end_time
      ? startTime >= foundSession.actual_end_time
        ? "closed"
        : getStatusMessage(new Date(startTime), new Date(endTime))
      : getStatusMessage(new Date(startTime), new Date(endTime));
    const formattedReports = foundSession.reports.map((report) => ({
      ...report,
      created_on: report.created_on.toISOString(),
    }));

    const formattedSession = {
      ...foundSession,
      start_time: foundSession.start_time.toISOString(),
      end_time: foundSession.end_time.toISOString(),
      created_on: foundSession.created_on.toISOString(),
      updated_at: foundSession.updated_at.toISOString(),
      actual_end_time: foundSession?.actual_end_time?.toISOString(),
      actualDuration: foundSession?.actual_end_time
        ? formatDuration(
            new Date(startTime),
            new Date(foundSession?.actual_end_time)
          )
        : undefined,
      duration,
      status,
      reports: formattedReports,
    };
    return { success: formattedSession };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getSessionForEdit = async (id: number) => {
  try {
    if (!id) return { error: "Id not found" };

    const foundSession = await prisma.session.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        course_names: true,
        course_codes: true,
        start_time: true,
        end_time: true,
        classes: true,
        venue: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: true,
        invigilators: true,
      },
    });

    if (!foundSession) return { error: "Session not found" };

    const { start_time, end_time, course_codes, course_names, ...rest } =
      foundSession;

    const formattedSession = {
      ...rest,
      sessionStart: start_time.toISOString(),
      sessionEnd: end_time.toISOString(),
      courseCodes: course_codes,
      courseNames: course_names,
    };

    return { success: formattedSession };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editSession = authAction(
  sessionEditSchema,
  async (session: SessionEdit, { userId }) => {
    try {
      if (!session.sessionStart || !session.sessionEnd)
        return { error: "Dates cannot be empty" };

      const updateStatus = (startTime: Date, endTime: Date): TempStatus => {
        const now = new Date();
        if (endTime < now) return TempStatus.closed;
        if (startTime > now) return TempStatus.pending;
        return TempStatus.active;
      };

      const updatedSession = await prisma.$transaction(async (prisma) => {
        if (!session.sessionStart || !session.sessionEnd)
          return { error: "Dates cannot be empty" };

        const sessionData = await prisma.session.findUnique({
          where: { id: session.id },
        });

        if (!sessionData) return { error: "Session not found" };

        const venueChanged = sessionData.venue_id !== session.venue;
        const timeChanged =
          session.sessionStart.getTime() !== sessionData.start_time.getTime() ||
          session.sessionEnd.getTime() !== sessionData.end_time.getTime();

        if (venueChanged || timeChanged) {
          const isAvailable = await isVenueAvailable(
            session.venue,
            session.sessionStart,
            session.sessionEnd,
            undefined,
            session.id
          );
          
          // if (sessionData.start_time)
          if (!isAvailable) return { error: "Venue is not available" };

          // If the venue is changing, release the previous booking
          // if (venueChanged) {
          await prisma.venueBooking.deleteMany({
            where: { session_id: session.id },
          });
          // }

          // Create a new booking for the new or updated venue/times
          await prisma.venueBooking.create({
            data: {
              venue_id: session.venue,
              session_id: session.id,
              start_time: session.sessionStart,
              end_time: session.sessionEnd,
            },
          });
        }

        const newTempStatus = timeChanged
          ? updateStatus(
              new Date(session.sessionStart),
              new Date(session.sessionEnd)
            )
          : sessionData.temp_status;

        const updatedSession = await prisma.session.update({
          where: { id: session.id },
          data: {
            start_time: session.sessionStart,
            end_time: session.sessionEnd,
            created_by: Number(userId),
            course_names: session.courseNames.map((course) =>
              _.startCase(_.lowerCase(course))
            ),
            course_codes: session.courseCodes.map((code) => _.upperCase(code)),
            classes: session.classes.map((classe) => _.upperCase(classe)),
            invigilators: session.invigilators.map((invigilator) =>
              _.startCase(_.lowerCase(invigilator))
            ),
            venue_id: session.venue,
            comments: session?.comments ? session.comments : "",
            temp_status: newTempStatus,
            actual_end_time: timeChanged
              ? session.sessionEnd
              : sessionData.actual_end_time,
          },
        });

        await prisma.notification.create({
          data: {
            category: "Session",
            message: `Session #${updatedSession.id} has been updated. It ${
              newTempStatus === "pending"
                ? `will start at ${format(
                    new Date(session.sessionStart),
                    "h:mm a"
                  )}`
                : newTempStatus === "active"
                ? `started at ${format(
                    new Date(session.sessionStart),
                    "h:mm a"
                  )}`
                : `ended at ${format(new Date(session.sessionEnd), "h:mm a")}`
            }`,
            category_id: updatedSession.id,
          },
        });

        if (updatedSession) return { success: "Session Updated" };

        return { error: "Session could not be updated" };
      });

      await revalidateAllPaths();

      return updatedSession;
    } catch (error) {
      console.error(error);
      return { error: "Something wrong occurred" };
    }
  }
);

export const endSession = authAction(
  sessionEndSchema,
  async ({ id }: { id: number }, { userId }) => {
    try {
      if (!id) return { error: "Id not found" };

      const endTime = new Date();

      const endedSession = await prisma.$transaction(async (prisma) => {
        const updatedSession = await prisma.session.update({
          where: { id },
          data: {
            actual_end_time: endTime,
            terminated_by: Number(userId),
            temp_status: "closed",
          },
        });

        // Delete the booking for the ended session
        await prisma.venueBooking.deleteMany({
          where: { session_id: id },
        });

        const newStatus = getStatusMessage(
          new Date(updatedSession.start_time),
          endTime
        );
        const notificationMessage =
          newStatus === "closed"
            ? `Session #${id} has been terminated. Status is closed.`
            : `Session #${id} has been terminated. Status changed from ${newStatus} to closed.`;

        await prisma.notification.create({
          data: {
            category: "Session",
            message: notificationMessage,
            category_id: id,
          },
        });

        return updatedSession;
      });

      await revalidateAllPaths();

      if (endedSession) return { success: "Session Ended" };
      return { error: "Session could not be ended" };
    } catch (error) {
      console.error(error);
      return { error: "Something wrong occurred" };
    }
  }
);
