import { toast } from "react-toastify";
import {
  fetchUnread,
  getNotifications,
  markNotificationAsSeen,
  markNotificationsAsSeen,
} from "../actions/notification";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const INDEX_KEY = ["notifications", "unread"];

export function useGetUnread() {
  return useQuery({
    queryFn: async () => {
      const data = await fetchUnread();
      if (data.success) return { ...data.success };
    },
    queryKey: ["unread"],
  });
}

export const useGetNotifications = (isUnread: boolean) =>
  useInfiniteQuery({
    queryFn: async ({ pageParam }) =>
      await getNotifications({ lastCursor: pageParam, isUnread }),
    queryKey: ["notifications", { isUnread }],
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor === 0
        ? null
        : lastPage?.metaData?.lastCursor;
    },
    initialPageParam: 0,
  });

export const useMarkNotificationAsSeen = () => {
  const invalidateNotifications = useInvalidateNotifications();

  return useMutation({
    mutationFn: async (id: number) => await markNotificationAsSeen({ id }),
    onSuccess: () => {
      toast.success("Notification marked as seen");
      invalidateNotifications();
    },
  });
};

export const useMarkNotificationsAsSeen = () => {
  const invalidateNotifications = useInvalidateNotifications();

  return useMutation({
    mutationFn: async () => await markNotificationsAsSeen(),
    onSuccess: () => {
      toast.success("Notifications marked as seen");
      invalidateNotifications();
    },
  });
};

export const useInvalidateNotifications = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: INDEX_KEY,
      refetchType: "all",
    });
};

export const usePrefetchQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["unread"],
      queryFn: async () => {
        const data = await fetchUnread();
        if (data.success) return { ...data.success };
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
        return lastPage?.metaData?.lastCursor === 0
          ? null
          : lastPage?.metaData?.lastCursor;
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
        return lastPage?.metaData?.lastCursor === 0
          ? null
          : lastPage?.metaData?.lastCursor;
      },
      initialPageParam: 0,
    }),
  ]);
};
