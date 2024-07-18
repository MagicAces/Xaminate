"use server";

import { ReportDisplay, ReportInfo, ReportQuery, ReportRow } from "@/types";
import { Prisma, Status } from "@prisma/client";
import prisma from "@/prisma/prisma";
import { reports } from "@/data/reports.test";
import { authAction } from "./actions";
import { approveReportSchema } from "@/lib/schema";
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
      if (search.startsWith("#")) {
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
    console.log(field);
    console.log(order);

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
    // return { error: "Something wrong occurred"}
    throw error;
  }
};

// Function to get reports for testing
// export const getReportsTest = async ({
//   query,
//   status,
// }: {
//   query: ReportQuery;
//   status: "Pending" | "Approved" | "Rejected";
// }): Promise<{ success: ReportDisplay }> => {
//   try {
//     const {
//       startTime,
//       endTime,
//       search,
//       page = 1,
//       limit = 15,
//       sort: { field, order } = { field: "timestamp", order: "desc" },
//     } = query;

//     const offset = (page - 1) * limit;

//     // Filter reports based on the query parameters
//     let filteredReports = reports.filter((report) => report.status === status);

//     if (startTime) {
//       filteredReports = filteredReports.filter(
//         (report) => new Date(report.timestamp) >= new Date(startTime)
//       );
//     }

//     if (endTime) {
//       filteredReports = filteredReports.filter(
//         (report) => new Date(report.timestamp) <= new Date(endTime)
//       );
//     }

//     if (search) {
//       if (search.startsWith("#")) {
//         const idOrSessionId = parseInt(search.replace("#", ""), 10);
//         filteredReports = filteredReports.filter(
//           (report) =>
//             report.id === idOrSessionId || report.session_id === idOrSessionId
//         );
//       } else {
//         filteredReports = filteredReports.filter((report) => {
//           const student = report.student;
//           if (student) {
//             return (
//               student.first_name.toLowerCase().includes(search.toLowerCase()) ||
//               student.last_name.toLowerCase().includes(search.toLowerCase()) ||
//               (student.other_name &&
//                 student.other_name
//                   .toLowerCase()
//                   .includes(search.toLowerCase())) ||
//               student.index_number.includes(search)
//             );
//           }
//           return false;
//         });
//       }
//     }

//     // Sort the filtered reports
//     filteredReports.sort((a, b) => {
//       const aValue = a[field as keyof Report];
//       const bValue = b[field as keyof Report];

//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return order === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       } else if (typeof aValue === "number" && typeof bValue === "number") {
//         return order === "asc" ? aValue - bValue : bValue - aValue;
//       } else if (aValue instanceof Date && bValue instanceof Date) {
//         return order === "asc"
//           ? aValue.getTime() - bValue.getTime()
//           : bValue.getTime() - aValue.getTime();
//       } else {
//         return 0;
//       }
//     });

//     const paginatedReports = filteredReports.slice(offset, offset + limit);

//     const formattedReports: ReportRow[] = paginatedReports.map((report) => {
//       const { id, timestamp, session_id, status, student } = report;

//       const fullName = student
//         ? [student.first_name, student.last_name, student.other_name]
//             .filter(Boolean)
//             .join(" ")
//         : "-";

//       return {
//         id,
//         session_id,
//         status,
//         timestamp,
//         student: {
//           id: student ? student.id : "-",
//           fullName: student ? fullName : "-",
//           photo: student ? student.image_url || "" : "",
//           index_number: student ? student.index_number : "-",
//         },
//       };
//     });

//     const totalCount = filteredReports.length;
//     const totalPages = Math.ceil(totalCount / limit);
//     const hasNextPage = page < totalPages;
//     const hasPrevPage = page > 1;

//     const pendingCount = reports.filter((r) => r.status === "Pending").length;
//     const approvedCount = reports.filter((r) => r.status === "Approved").length;
//     const rejectedCount = reports.filter((r) => r.status === "Rejected").length;

//     return {
//       success: {
//         reports: formattedReports,
//         totalCount,
//         totalPages,
//         hasNextPage,
//         hasPrevPage,
//         pageNumber: page,
//         pendingCount,
//         approvedCount,
//         rejectedCount,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     // return { error: "Something went wrong" };
//     throw error;
//   }
// };

export const getReport = async (id: number) => {
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

// export const markNotificationAsRead = action(
//   markNotificationAsReadSchema,
//   async ({ id }) => {
//     try {
//       await prisma.notification.update({
//         where: {
//           id: id,
//         },
//         data: {
//           read: true,
//         },
//       });
//       revalidatePath("/");
//       return { success: "Notification marked as read" };
//     } catch (error) {
//       return { error: "Something went wrong" };
//     }
//   }
// );

// export const markNotificationAsSeen = async ({ id }: { id: number }) => {
//   try {
//     await prisma.notification.update({
//       where: {
//         id: id,
//       },
//       data: {
//         read: true,
//       },
//     });
//     return { success: "Notification marked as read" };
//   } catch (error) {
//     return { error: "Something went wrong" };
//   }
// };

export const approveReport = authAction(
  approveReportSchema,
  async ({ id }: { id: number }, { userId }) => {
    try {
      const updatedReport = await prisma.report.update({
        where: { id },
        data: {
          status: "Approved",
          last_edited_by: Number(userId),
          status_changed: new Date(),
        },
      });

      revalidatePath("/reports");
      revalidatePath("/reports/" + id.toString());

      return { success: "Report Approved" };
    } catch (error: any) {
      console.log(error);
      return { error: "Somethig went wrong" };
    }
  }
);
