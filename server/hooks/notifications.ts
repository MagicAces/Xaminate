import { toast } from "react-toastify";
import {
  fetchUnread,
  getNotifications,
  markNotificationAsSeen,
  markNotificationsAsSeen,
} from "../actions/notifications";
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
     return { ...data.success };
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
      return lastPage?.metaData?.hasNextPage
        ? lastPage?.metaData?.lastCursor
        : undefined;
    },
    initialPageParam: 0,
  });

export const useMarkNotificationAsSeen = () => {
  const invalidateNotifications = useInvalidateNotifications();

  return useMutation({
    mutationFn: async (id: number) => await markNotificationAsSeen({ id }),
    onSuccess: (data) => {
      if (data?.success) toast.success(data?.success);
      if (data?.error) toast.error(data?.error);
      invalidateNotifications();
    },
  });
};

export const useMarkNotificationsAsSeen = () => {
  const invalidateNotifications = useInvalidateNotifications();

  return useMutation({
    mutationFn: async () => await markNotificationsAsSeen(),
    onSuccess: (data) => {
      if (data?.success) toast.success(data?.success);
      if (data?.error) toast.error(data?.error);
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

