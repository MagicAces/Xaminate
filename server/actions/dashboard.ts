"use server";

import prisma from "@/prisma/prisma";
import {
  DashboardTopRowData,
  VenueStatsResponse,
  ReportStatsResponse,
  ReportsPerSessionResponse,
  RecentItemsResponse,
} from "@/types";
import { getDateRange } from "@/utils/dates";
import { getStatusMessage } from "@/utils/functs";

export const getDashboardTopRowData = async (): Promise<{
  success?: DashboardTopRowData;
  error?: string;
}> => {
  const currentDate = new Date();
  const currentMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const lastMonthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );

  try {
    // Sessions
    const [currentMonthSessions, totalSessions, lastMonthSessions, sessions] =
      await Promise.all([
        prisma.session.count({
          where: {
            created_on: {
              gte: currentMonthStart,
            },
          },
        }),
        prisma.session.count(),
        prisma.session.count({
          where: {
            created_on: {
              gte: lastMonthStart,
              lt: currentMonthStart,
            },
          },
        }),
        prisma.session.findMany({
          where: {
            created_on: {
              gte: currentMonthStart,
            },
          },
          select: {
            start_time: true,
            end_time: true,
            temp_status: true,
          },
        }),
      ]);

    const pendingSessions = sessions.filter(
      (session) =>
        session.temp_status === "pending" ||
        getStatusMessage(session.start_time, session.end_time) === "pending"
    ).length;

    const activeSessions = sessions.filter(
      (session) =>
        session.temp_status === "active" ||
        getStatusMessage(session.start_time, session.end_time) === "active"
    ).length;

    const closedSessions = sessions.filter(
      (session) =>
        session.temp_status === "closed" ||
        getStatusMessage(session.start_time, session.end_time) === "closed"
    ).length;

    const sessionPercentageChange =
      lastMonthSessions === 0
        ? 100
        : ((currentMonthSessions - lastMonthSessions) / lastMonthSessions) *
            100 || 0;

    // Reports
    const [currentMonthReports, totalReports, lastMonthReports] =
      await Promise.all([
        prisma.report.count({
          where: {
            created_on: {
              gte: currentMonthStart,
            },
          },
        }),
        prisma.report.count(),
        prisma.report.count({
          where: {
            created_on: {
              gte: lastMonthStart,
              lt: currentMonthStart,
            },
          },
        }),
      ]);

    const reportStatuses = await prisma.report.groupBy({
      by: ["status"],
      _count: true,
      where: {
        created_on: {
          gte: currentMonthStart,
        },
      },
    });

    const pendingReports =
      reportStatuses.find((status) => status.status === "Pending")?._count || 0;
    const approvedReports =
      reportStatuses.find((status) => status.status === "Approved")?._count ||
      0;
    const rejectedReports =
      reportStatuses.find((status) => status.status === "Rejected")?._count ||
      0;

    const reportPercentageChange =
      lastMonthReports === 0
        ? 100
        : ((currentMonthReports - lastMonthReports) / lastMonthReports) * 100 ||
          0;

    // Venues
    const [totalVenues, currentMonthVenues, lastMonthVenues] =
      await Promise.all([
        prisma.venue.count(),
        prisma.venue.count({
          where: {
            created_on: {
              gte: currentMonthStart,
            },
          },
        }),
        prisma.venue.count({
          where: {
            created_on: {
              gte: lastMonthStart,
              lt: currentMonthStart,
            },
          },
        }),
      ]);

    const venuePercentageChange =
      lastMonthVenues === 0
        ? 100
        : ((currentMonthVenues - lastMonthVenues) / lastMonthVenues) * 100 || 0;

    // Cameras
    const [totalCameras, currentMonthCameras, lastMonthCameras] =
      await Promise.all([
        prisma.camera.count(),
        prisma.camera.count({
          where: {
            created_on: {
              gte: currentMonthStart,
            },
          },
        }),
        prisma.camera.count({
          where: {
            created_on: {
              gte: lastMonthStart,
              lt: currentMonthStart,
            },
          },
        }),
      ]);

    const cameraStatuses = await prisma.camera.groupBy({
      by: ["status"],
      _count: true,
      where: {
        created_on: {
          gte: currentMonthStart,
        },
      },
    });

    const activeCameras =
      cameraStatuses.find((status) => status.status === "Active")?._count || 0;
    const inactiveCameras =
      cameraStatuses.find((status) => status.status === "Inactive")?._count ||
      0;
    const maintenanceCameras =
      cameraStatuses.find((status) => status.status === "Maintenance")
        ?._count || 0;

    const cameraPercentageChange =
      lastMonthCameras === 0
        ? 100
        : ((currentMonthCameras - lastMonthCameras) / lastMonthCameras) * 100 ||
          0;

    return {
      success: {
        sessions: {
          currentMonth: currentMonthSessions,
          total: totalSessions,
          percentageChange: sessionPercentageChange,
          pending: pendingSessions,
          active: activeSessions,
          closed: closedSessions,
        },
        reports: {
          currentMonth: currentMonthReports,
          total: totalReports,
          percentageChange: reportPercentageChange,
          pending: pendingReports,
          approved: approvedReports,
          rejected: rejectedReports,
        },
        venues: {
          total: totalVenues,
          percentageChange: venuePercentageChange,
        },
        cameras: {
          total: totalCameras,
          percentageChange: cameraPercentageChange,
          active: activeCameras,
          inactive: inactiveCameras,
          maintenance: maintenanceCameras,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { error: "Error fetching dashboard data" };
  }
};

export const getVenueStats = async (
  date_filter: string
): Promise<VenueStatsResponse> => {
  const { start, end } = getDateRange(date_filter);

  try {
    const venues = await prisma.venue.findMany({
      include: {
        sessions: {
          where: {
            created_on: {
              gte: start,
              lte: end,
            },
          },
        },
      },
    });

    const reports = await prisma.report.findMany({
      where: {
        created_on: {
          gte: start,
          lte: end,
        },
      },
      include: {
        session: {
          select: {
            venue_id: true,
          },
        },
      },
    });

    const reportCountsByVenue = reports.reduce((acc, report) => {
      const venueId = report.session.venue_id;
      if (!acc[venueId]) {
        acc[venueId] = 0;
      }
      acc[venueId]++;
      return acc;
    }, {} as Record<number, number>);

    const venueStats = venues.map((venue) => ({
      venue: {
        id: venue.id,
        name: venue.name,
      },
      sessions: venue.sessions.length || 0,
      reports: reportCountsByVenue[venue.id] || 0,
    }));

    const topVenues = venueStats
      .sort((a, b) => b.sessions + b.reports - (a.sessions + a.reports))
      .slice(0, 5);

    return { success: topVenues };
  } catch (error) {
    console.error("Error fetching venue stats:", error);
    return { error: "Error fetching venue stats" };
  }
};

export const getReportStats = async (
  date_filter: string
): Promise<ReportStatsResponse> => {
  const { start, end } = getDateRange(date_filter);

  try {
    const reportCounts = await prisma.report.groupBy({
      by: ["status"],
      _count: true,
      where: {
        created_on: {
          gte: start,
          lte: end,
        },
      },
    });

    const pending =
      reportCounts.find((count) => count.status === "Pending")?._count || 0;
    const approved =
      reportCounts.find((count) => count.status === "Approved")?._count || 0;
    const rejected =
      reportCounts.find((count) => count.status === "Rejected")?._count || 0;

    return {
      success: {
        pending,
        approved,
        rejected,
      },
    };
  } catch (error) {
    console.error("Error fetching report stats:", error);
    return { error: "Error fetching report stats" };
  }
};

export const getReportsPerSession = async (
  sessions_back: number
): Promise<ReportsPerSessionResponse> => {
  try {
    // Fetch the most recent sessions
    const recentSessions = await prisma.session.findMany({
      orderBy: {
        created_on: "desc",
      },
      take: sessions_back,
      select: {
        id: true,
      },
    });

    // Reverse the order so the most recent session is at the end
    recentSessions.reverse();

    // Fetch the report count for each session
    const reportsPerSession = await Promise.all(
      recentSessions.map(async (session) => {
        const reportsCount = await prisma.report.count({
          where: {
            session_id: session.id,
          },
        });
        return {
          sessionId: session.id,
          reportsCount,
        };
      })
    );

    return { success: reportsPerSession };
  } catch (error) {
    console.error("Error fetching reports per session:", error);
    return { error: "Error fetching reports per session" };
  }
};

export const getRecentItems = async (
  category: "session" | "report"
): Promise<RecentItemsResponse> => {
  try {
    if (category === "session") {
      const recentSessions = await prisma.session.findMany({
        orderBy: {
          created_on: "desc",
        },
        take: 7,
        include: {
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const sessions = recentSessions.map((session) => ({
        id: session.id,
        start_time: session.start_time.toISOString(),
        end_time: session.end_time.toISOString(),
        venue_id: session.venue.id,
        venue_name: session.venue.name,
        status: getStatusMessage(session.start_time, session.end_time),
      }));

      return { success: { sessions } };
    } else if (category === "report") {
      const recentReports = await prisma.report.findMany({
        orderBy: {
          created_on: "desc",
        },
        take: 7,
        select: {
          id: true,
          status: true,
          student: {
            select: {
              index_number: true,
            },
          },
          created_on: true,
        },
      });

      const reports = recentReports.map((report) => ({
        id: report.id,
        status: report.status,
        student_index_no: report.student?.index_number || 0,
        timestamp: report.created_on.toISOString(),
      }));

      return { success: { reports } };
    } else {
      return { error: "Invalid category" };
    }
  } catch (error) {
    console.error("Error fetching recent items:", error);
    return { error: "Error fetching recent items" };
  }
};
