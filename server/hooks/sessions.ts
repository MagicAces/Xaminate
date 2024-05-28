import { SessionQuery } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSessions } from "../actions/sessions";

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
