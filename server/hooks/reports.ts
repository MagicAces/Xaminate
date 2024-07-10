import { ReportQuery } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReports, getReportsTest } from "../actions/reports";

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

export function useGetTestReports({
  query,
  status,
}: {
  query: ReportQuery;
  status: "Pending" | "Approved" | "Rejected";
}) {
  return useQuery({
    queryFn: async () => {
      const data = await getReportsTest({ query, status });
      return data.success;
    },
    queryKey: ["reports", { ...query, status }],
    placeholderData: keepPreviousData,
  });
}
