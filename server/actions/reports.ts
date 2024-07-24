"use server";

import {
  ReportDisplay,
  ReportInfo,
  ReportOutput,
  ReportQuery,
  ReportRow,
  StudentInfo,
} from "@/types";
import { Prisma, Status } from "@prisma/client";
import prisma from "@/prisma/prisma";
import { reports } from "@/data/reports.test";
import { authAction } from "./actions";
import { addCommentSchema, approveReportSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export const getReports = async ({
  query,
  status,
}: {
  query: ReportQuery;
  status: "Pending" | "Approved" | "Rejected";
}) => {
  try {
    const {
      page = 1,
      limit = 15,
      startTime,
      sort: { field, order },
      endTime,
      search,
    } = query;

    const offset = (page - 1) * limit;

    // Handle search parameter
    let searchFilter: Prisma.ReportWhereInput | undefined = undefined;
    if (search) {
      if (search.startsWith("#") && search.length > 1) {
        const idOrSessionId = parseInt(search.replace("#", ""), 10);
        searchFilter = {
          OR: [
            { id: { equals: idOrSessionId } },
            { session_id: { equals: idOrSessionId } },
          ],
        };
      } else {
        searchFilter = {
          OR: [
            {
              student: {
                first_name: { contains: search, mode: "insensitive" },
              },
            },
            {
              student: { last_name: { contains: search, mode: "insensitive" } },
            },
            {
              student: {
                other_name: { contains: search, mode: "insensitive" },
              },
            },
            {
              student: {
                index_number: { equals: parseInt(search) || undefined },
              },
            },
          ],
        };
      }
    }

    const andConditions: Prisma.ReportWhereInput[] = [
      startTime ? { timestamp: { gte: new Date(startTime) } } : undefined,
      endTime ? { timestamp: { lte: new Date(endTime) } } : undefined,
      searchFilter,
    ].filter((x): x is Prisma.ReportWhereInput => x !== undefined);

    const where: Prisma.ReportWhereInput = {
      AND: andConditions,
      status: status as Status,
    };

    const [reports, totalCount, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        prisma.report.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: {
            [field]: order === "asc" ? "asc" : "desc",
          },
          select: {
            id: true,
            timestamp: true,
            session_id: true,
            status: true,
            student: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                other_name: true,
                image_url: true,
                index_number: true,
              },
            },
          },
        }),
        prisma.report.count({ where }),
        prisma.report.count({
          where: {
            AND: [...(where.AND as []), { status: "Pending" }],
          },
        }),
        prisma.report.count({
          where: {
            AND: [...(where.AND as []), { status: "Approved" }],
          },
        }),
        prisma.report.count({
          where: {
            AND: [...(where.AND as []), { status: "Rejected" }],
          },
        }),
      ]);

    const formattedReports: ReportRow[] = reports.map((report) => {
      const { id, timestamp, session_id, status, student } = report;

      const fullName = student
        ? [student.first_name, student.last_name, student.other_name]
            .filter(Boolean)
            .join(" ")
        : "-";

      return {
        id,
        session_id,
        status,
        timestamp: timestamp.toISOString(),
        student: {
          id: student ? student.id : "-",
          fullName: student ? fullName : "-",
          photo: student ? student.image_url || "" : "",
          index_number: student ? student.index_number : "-",
        },
      };
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      success: {
        reports: formattedReports,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
        pageNumber: page,
        pendingCount,
        approvedCount,
        rejectedCount,
      },
    };
  } catch (error) {
    console.error(error);
    return { error: "Error occured fetching sessions" };
    // throw error;
  }
};

export const getReportSummary = async (id: number) => {
  try {
    if (!id) return { error: "Id not found" };
    const foundReport = await prisma.report.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        timestamp: true,
        session_id: true,
        description: true,
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            other_name: true,
            image_url: true,
            index_number: true,
            reference_no: true,
            program: true,
          },
        },
      },
    });

    if (!foundReport) return { error: "Report not found" };

    const { student } = foundReport;
    const fullName = student
      ? [student.first_name, student.last_name].filter(Boolean).join(" ")
      : "-";

    const formattedReport = {
      ...foundReport,
      student: {
        id: student ? student.id : 0,
        fullName: student ? fullName : "-",
        photo: student ? student.image_url || "" : "",
        index_number: student ? student.index_number : 0,
        reference_no: student ? student.reference_no : 0,
        program: student ? student.program : "",
      },
      timestamp: foundReport.timestamp.toISOString(),
    };

    return { success: formattedReport };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const approveReport = authAction(
  approveReportSchema,
  async ({ id, approved }: { id: number; approved: boolean }, { userId }) => {
    try {
      await prisma.report.update({
        where: { id },
        data: {
          status: approved ? "Approved" : "Rejected",
          last_edited_by: Number(userId),
          status_changed: new Date(),
        },
      });

      revalidatePath("/reports");
      revalidatePath("/reports/" + id.toString());

      return { success: `Report ${approved ? "Approved" : "Rejected"}` };
    } catch (error: any) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  }
);

export const getStudent = async (id: number) => {
  try {
    if (!id) return { error: "Id not found" };

    // Fetch student details
    const foundStudent = await prisma.student.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        other_name: true,
        image_url: true,
        index_number: true,
        reference_no: true,
        report: {
          select: {
            id: true,
            session_id: true,
            status: true,
          },
        },
      },
    });

    if (!foundStudent) return { error: "Student not found" };

    // Full name concatenation
    const fullName = [foundStudent.first_name, foundStudent.last_name]
      .filter(Boolean)
      .join(" ");

    // Calculate total and valid reports
    const totalReports = foundStudent.report.length;
    const validReports = foundStudent.report.filter(
      (report) => report.status === "Approved"
    ).length;

    // Get the last seven sessions with report count for this student
    const sessions = await prisma.session.findMany({
      orderBy: {
        id: "desc",
      },
      take: 7,
      select: {
        id: true,
        reports: {
          where: {
            student_id: id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const lastSeven = sessions.reverse().map((session) => ({
      session_id: session.id,
      report_count: session.reports.length,
    }));

    const student: StudentInfo = {
      id: foundStudent.id,
      fullName,
      index_number: foundStudent.index_number,
      reference_no: foundStudent.reference_no,
      valid_reports: validReports,
      total_reports: totalReports,
      photo: foundStudent.image_url || "",
      last_seven: lastSeven,
    };

    return { success: student };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getReport = async (id: number) => {
  try {
    if (!id) return { error: "Id not found" };

    // Fetch report details with related student and editor information
    const foundReport = await prisma.report.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        description: true,
        comments: true,
        snapshot_url: true,
        timestamp: true,
        session_id: true,
        status_changed: true,
        created_on: true,
        updated_at: true,
        student: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            other_name: true,
            image_url: true,
            index_number: true,
            reference_no: true,
            program: true,
            level: true,
            report: {
              select: {
                id: true,
                session_id: true,
                status: true,
              },
            },
          },
        },
        editor: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!foundReport) return { error: "Report not found" };

    const { student, editor, ...rest } = foundReport;

    // Full name concatenation
    const fullName = student
      ? `${student.first_name} ${student.last_name}`
      : "";

    // Calculate total and valid reports
    const totalReports = student ? student.report.length : 0;
    const validReports = student
      ? student.report.filter((report) => report.status === "Approved").length
      : 0;

    // Get the last seven sessions with report count for this student
    const sessions = await prisma.session.findMany({
      orderBy: {
        id: "desc",
      },
      take: 7,
      select: {
        id: true,
        reports: {
          where: {
            student_id: student?.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const lastSeven = sessions.reverse().map((session) => ({
      session_id: session.id,
      report_count: session.reports.length,
    }));

    const reportOutput: ReportOutput = {
      id: rest.id,
      student: {
        id: student ? student.id : 0,
        level: student ? student.level.toString() : "",
        last_name: student ? student.last_name : "",
        first_name: student ? student.first_name : "",
        reference_no: student ? student.reference_no : 0,
        index_number: student ? student.index_number : 0,
        program: student ? student.program : "",
        photo: student ? student.image_url || "" : "",
      },
      status: rest.status,
      description: rest.description,
      comments: rest.comments || null,
      snapshot_url: rest.snapshot_url || "",
      timestamp: rest.timestamp.toISOString(),
      session_id: rest.session_id,
      status_changed: rest.status_changed
        ? rest.status_changed.toISOString()
        : undefined,
      editor: editor
        ? {
            id: editor.id,
            first_name: editor.first_name,
            last_name: editor.last_name,
          }
        : undefined,
      created_on: rest.created_on.toISOString(),
      updated_at: rest.updated_at.toISOString(),
      valid_reports: validReports,
      total_reports: totalReports,
      last_seven: lastSeven,
    };

    return { success: reportOutput };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addComment = authAction(
  addCommentSchema,
  async ({ id, comments }: { id: number; comments: string }, { userId }) => {
    try {
      await prisma.report.update({
        where: { id },
        data: {
          comments,
        },
      });

      revalidatePath("/reports");
      revalidatePath("/reports/" + id.toString());

      return { success: "Successfully Added Comments" };
    } catch (error: any) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  }
);
