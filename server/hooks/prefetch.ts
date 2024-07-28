"use server";

import { fetchUnread, getNotifications } from "../actions/notifications";
import { QueryClient } from "@tanstack/react-query";
import { getVenues } from "../actions/venues";
import { getSession, getSessions } from "../actions/sessions";
import { getReport, getReports } from "../actions/reports";
import { getCameras } from "../actions/cameras";
import {
  getDashboardTopRowData,
  getRecentItems,
  getReportsPerSession,
  getReportStats,
  getVenueStats,
} from "../actions/dashboard";
// import { getReportsTest } from "../actions/reports";

export const usePrefetchQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["unread"],
      queryFn: async () => {
        const data = await fetchUnread();
        if (data.success) return { ...data.success };
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["venues"],
      queryFn: async () => {
        try {
          const data = await getVenues();
          if (data?.success) return data.success;
          return [];
        } catch (error) {
          // return { error: "Server Error" };
          return [];
        }
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ["cameras"],
      queryFn: async () => {
        try {
          const data = await getCameras();
          if (data?.success) return data.success;
          return [];
        } catch (error) {
          // return { error: "Server Error" };
          return [];
        }
      },
    }),
    queryClient.prefetchQuery({
      queryKey: [
        "sessions",
        {
          page: 1,
          limit: 15,
          venue: 0,
          status: "",
          startTime: "",
          endTime: "",
          search: "",
        },
      ],
      queryFn: async () => {
        const data = await getSessions({
          page: 1,
          limit: 15,
          venue: 0,
          status: "",
          startTime: "",
          endTime: "",
          search: "",
        });
        return { ...data.success };
      },
    }),
    queryClient.prefetchQuery({
      queryFn: async () => {
        try {
          const data = await getDashboardTopRowData();
          if (data?.success) return data.success;
          return data?.error;
        } catch (error) {
          // return { error: "Server Error" };
          return "Error fetching dashboard data";
        }
      },
      queryKey: ["dashboard_top"],
    }),
    queryClient.prefetchQuery({
      queryFn: async () => {
        try {
          const data = await getVenueStats("This Month");
          if (data?.success) return data.success;
          return data?.error;
        } catch (error) {
          // return { error: "Server Error" };
          return "Error fetching venue stats";
        }
      },
      queryKey: ["dashboard_middle_venue", { date_filter: "This Month" }],
    }),
    queryClient.prefetchQuery({
      queryFn: async () => {
        try {
          const data = await getReportStats("This Month");
          if (data?.success) return data.success;
          return data?.error;
        } catch (error) {
          // return { error: "Server Error" };
          return "Error fetching report stats";
        }
      },
      queryKey: ["dashboard_middle_report", { date_filter: "This Month" }],
    }),
    queryClient.prefetchQuery({
      queryFn: async () => {
        try {
          const data = await getReportsPerSession(10);
          if (data?.success) return data.success;
          return data?.error;
        } catch (error) {
          // return { error: "Server Error" };
          return "Error fetching report per session";
        }
      },
      queryKey: ["dashboard_bottom_rps", { session_back: 10 }],
    }),
    queryClient.prefetchQuery({
      queryFn: async () => {
        try {
          const data = await getRecentItems("session");
          if (data?.success) return data.success;
          return data?.error;
        } catch (error) {
          // return { error: "Server Error" };
          return "Error fetching report stats";
        }
      },
      queryKey: ["dashboard_bottom_ri", { category: "session" }],
    }),
    queryClient.prefetchQuery({
      queryFn: async () => {
        try {
          const data = await getRecentItems("report");
          if (data?.success) return data.success;
          return data?.error;
        } catch (error) {
          // return { error: "Server Error" };
          return "Error fetching report stats";
        }
      },
      queryKey: ["dashboard_bottom_ri", { category: "report" }],
    }),
    queryClient.prefetchQuery({
      queryKey: [
        "reports",
        {
          page: 1,
          limit: 10,
          startTime: "",
          endTime: "",
          search: "",
          sort: {
            field: "timestamp",
            order: "desc",
          },
          status: "Pending",
        },
      ],
      queryFn: async () => {
        const data = await getReports({
          query: {
            page: 1,
            limit: 10,
            startTime: "",
            endTime: "",
            search: "",
            sort: {
              field: "timestamp",
              order: "desc",
            },
          },
          status: "Pending",
        });
        return { ...data.success };
      },
    }),
    queryClient.prefetchInfiniteQuery({
      queryFn: async ({ pageParam }) =>
        await getNotifications({
          lastCursor: pageParam,
          isUnread: true,
        }),
      queryKey: ["notifications", { isUnread: true }],
      getNextPageParam: (lastPage: any) => {
        return lastPage?.metaData?.hasNextPage
          ? lastPage?.metaData?.lastCursor
          : undefined;
      },
      initialPageParam: 0,
    }),
    queryClient.prefetchInfiniteQuery({
      queryFn: async ({ pageParam }) =>
        await getNotifications({
          lastCursor: pageParam,
          isUnread: false,
        }),
      queryKey: ["notifications", { isUnread: false }],
      getNextPageParam: (lastPage: any) => {
        return lastPage?.metaData?.hasNextPage
          ? lastPage?.metaData?.lastCursor
          : undefined;
      },
      initialPageParam: 0,
    }),
  ]);
};

export const usePrefetchSession = async (
  queryClient: QueryClient,
  id: number
) => {
  await queryClient.prefetchQuery({
    queryKey: ["session", { id }],
    queryFn: async () => {
      const data = await getSession(id);
      if (data.success) return { ...data.success };
      else return data.error;
    },
  });
};

export const usePrefetchReport = async (
  queryClient: QueryClient,
  id: number
) => {
  await queryClient.prefetchQuery({
    queryKey: ["report", { id }],
    queryFn: async () => {
      const data = await getReport(id);
      if (data.success) return { ...data.success };
      else return data.error;
    },
  });
};
