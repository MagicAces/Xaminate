import { ReportQuery } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getReport,
  getReports,
  getReportSummary,
  getStudent,
} from "../actions/reports";

export function useGetReports({
  query,
  status,
}: {
  query: ReportQuery;
  status: "Pending" | "Approved" | "Rejected";
}) {
  return useQuery({
    queryFn: async () => {
      const data = await getReports({ query, status });
      return data.success;
    },
    queryKey: ["reports", { ...query, status }],
    placeholderData: keepPreviousData,
  });
}

// export function useGetTestReports({
//   query,
//   status,
// }: {
//   query: ReportQuery;
//   status: "Pending" | "Approved" | "Rejected";
// }) {
//   return useQuery({
//     queryFn: async () => {
//       const data = await getReportsTest({ query, status });
//       return data.success;
//     },
//     queryKey: ["reports", { ...query, status }],
//     placeholderData: keepPreviousData,
//   });
// }

export function useGetReportSummary(id: number) {
  return useQuery({
    queryFn: async () => {
      const data = await getReportSummary(id);
      return data;
    },
    queryKey: ["report_summary", { id }],
    // placeholderData: keepPreviousData,
  });
}

export function useGetStudent(id: number) {
  return useQuery({
    queryFn: async () => {
      const data = await getStudent(id);
      return data;
    },
    queryKey: ["student", { id }],
    // placeholderData: keepPreviousData,
  });
}

export function useGetReport(id: number) {
  return useQuery({
    queryFn: async () => {
      const data = await getReport(id);
      return data;
    },
    queryKey: ["report", { id }],
    // placeholderData: keepPreviousData,
  });
}
