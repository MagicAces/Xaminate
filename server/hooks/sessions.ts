import { SessionQuery } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSessions, getSession } from "../actions/sessions";

export function useGetSessions(query: SessionQuery) {
  return useQuery({
    queryFn: async () => {
      const data = await getSessions(query);
      return data.success;
    },
    queryKey: ["sessions", query],
    placeholderData: keepPreviousData,
  });
}

export function useGetSession(id: number) {
  return useQuery({
    queryFn: async () => {
      const data = await getSession(id);
      return data;
    },
    queryKey: ["session", { id }],
    // placeholderData: keepPreviousData,
  });
}
