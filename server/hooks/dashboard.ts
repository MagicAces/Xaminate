import {
  getDashboardTopRowData,
  getRecentItems,
  getReportsPerSession,
  getReportStats,
  getVenueStats,
} from "../actions/dashboard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetDashboardTopRowData() {
  return useQuery({
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
    placeholderData: keepPreviousData,
  });
}

export function useGetVenueStats(date_filter: string) {
  return useQuery({
    queryFn: async () => {
      try {
        const data = await getVenueStats(date_filter);
        if (data?.success) return data.success;
        return data?.error;
      } catch (error) {
        // return { error: "Server Error" };
        return "Error fetching venue stats";
      }
    },
    queryKey: ["dashboard_middle_venue", { date_filter }],
    placeholderData: keepPreviousData,
  });
}

export function useGetReportStats(date_filter: string) {
  return useQuery({
    queryFn: async () => {
      try {
        const data = await getReportStats(date_filter);
        if (data?.success) return data.success;
        return data?.error;
      } catch (error) {
        // return { error: "Server Error" };
        return "Error fetching report stats";
      }
    },
    queryKey: ["dashboard_middle_report", { date_filter }],
    placeholderData: keepPreviousData,
  });
}

export function useGetReportsPerSession(session_back: number) {
  return useQuery({
    queryFn: async () => {
      try {
        const data = await getReportsPerSession(session_back);
        if (data?.success) return data.success;
        return data?.error;
      } catch (error) {
        // return { error: "Server Error" };
        return "Error fetching report per session";
      }
    },
    queryKey: ["dashboard_bottom_rps", { session_back }],
  });
}

export function useGetRecentItems(category: "session" | "report") {
  return useQuery({
    queryFn: async () => {
      try {
        const data = await getRecentItems(category);
        if (data?.success) return data.success;
        return data?.error;
      } catch (error) {
        // return { error: "Server Error" };
        return { error: "Error fetching report stats" };
      }
    },
    queryKey: ["dashboard_bottom_ri", { category }],
  });
}
