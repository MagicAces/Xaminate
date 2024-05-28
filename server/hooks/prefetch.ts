"use server";

import { fetchUnread, getNotifications } from "../actions/notifications";
import { QueryClient } from "@tanstack/react-query";
import { getVenues } from "../actions/venues";
import { getSessions } from "../actions/sessions";

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
        const data = await getVenues();
        if (data.success) return data.success;
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
