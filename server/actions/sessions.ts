"use server";

import { authAction } from "./actions";
import { SessionInput, sessionSchema } from "@/lib/schema";
import prisma from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import _ from "lodash";
import { SessionQuery } from "@/types";
import { Prisma } from "@prisma/client";
import { formatDuration, getStatus, getStatusMessage } from "@/utils/functs";
import { format } from "date-fns";

export const createSession = authAction(
  sessionSchema,
  async (session: SessionInput, { userId }) => {
    try {
      if (!session.sessionStart || !session.sessionEnd)
        return { error: "Dates can not be empty" };

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
          temp_status: session.sessionStart < new Date() ? "pending" : "active",
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
              : `started at ${format(new Date(session.sessionStart), "h:mm a")}`
          }`,
          category_id: newSession.id,
        },
      });
      revalidatePath("/");

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

    const statusResult = getStatus(status);

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

    const where = {
      AND: [
        venue ? { venue_id: venue } : undefined,
        startTime ? { created_on: { gte: new Date(startTime) } } : undefined,
        endTime ? { created_on: { lte: new Date(endTime) } } : undefined,
        ...statusResult,
        searchFilter,
      ].filter((x) => x !== undefined),
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
          },
        }),
        prisma.session.count({ where }),
        prisma.session.count({
          where: {
            AND: [...where.AND, { start_time: { gt: new Date() } }],
          },
        }),
        prisma.session.count({
          where: {
            AND: [
              ...where.AND,
              { start_time: { lte: new Date() } },
              { end_time: { gte: new Date() } },
            ],
          },
        }),
        prisma.session.count({
          where: {
            AND: [...where.AND, { end_time: { lt: new Date() } }],
          },
        }),
      ]);

    const formattedSessions = sessions.map((session) => {
      const startTime = session.start_time;
      const endTime = session.end_time;

      const { start_time, end_time, _count, venue, ...rest } = session;

      const duration = formatDuration(new Date(startTime), new Date(endTime));
      const status = getStatusMessage(new Date(startTime), new Date(endTime));

      return {
        ...rest,
        reportsCount: _count.reports,
        created_on: session.created_on.toISOString(),
        duration,
        status,
        venue_name: venue.name,
        venue_id: venue.id,
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
