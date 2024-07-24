"use client";
import styles from "@/styles/modal.module.scss";
import Tooltip from "../../Utils/Tooltip";

import {
  useGetNotifications,
  useMarkNotificationAsSeen,
  useMarkNotificationsAsSeen,
} from "@/server/hooks/notifications";
import { Notification as INotification } from "@/types";
import { useModal } from "@/utils/context";
import { iconDate } from "@/utils/dates";
import { useCallback, useMemo, useRef, useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { TbReport, TbTimelineEventExclamation } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Loader from "../../Utils/Loader";
import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";

const Notification = () => {
  const [isUnread, setIsUnread] = useState(true);
  const { exitModal } = useModal();

  const { mutate: markAsRead, isPending: onePending } =
    useMarkNotificationAsSeen();
  const { mutate: markAllAsRead, isPending: allPending } =
    useMarkNotificationsAsSeen();
  const router = useRouter();
  const observer = useRef<IntersectionObserver>();

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
  } = useGetNotifications(isUnread);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]
  );

  const notifications = useMemo(() => {
    return data?.pages.reduce((acc: any, page: any) => {
      return [...acc, ...page.data];
    }, []);
  }, [data]);

  const handleNotificationClick = (notification: INotification) => {
    if (notification.read) return;

    if (notification?.category_id && notification.category === "Session") {
      router.prefetch(`/sessions/${notification.category_id}`);
      router.push(`/sessions/${notification.category_id}`);
      markAsRead(notification.id);
      exitModal();
    } else if (
      notification?.category_id &&
      notification.category === "Report"
    ) {
      router.prefetch(`/reports/${notification.category_id}`);
      router.push(`/reports/${notification.category_id}`);
      markAsRead(notification.id);
      exitModal();
    }
  };

  return (
    <>
      <div
        className={styles.notificationContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {(isLoading || isFetchingNextPage || onePending || allPending) && (
          <Loader />
        )}
        <span className={styles.closeIcon}>
          <MdClose onClick={() => exitModal()} />
        </span>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h3>Notifications</h3>
          </div>
          <div className={styles.headerRight} onClick={() => markAllAsRead()}>
            <IoCheckmarkDone />
            <span>Mark all as read</span>
          </div>
        </div>
        <div className={styles.tabs}>
          <div className={styles.tabsLeft}>
            <div
              className={isUnread ? styles.active : undefined}
              onClick={() => {
                setIsUnread(true);
              }}
            >
              <span>Unread</span>
              <span className={styles.badge}>
                {data?.pages[0]?.unreadCount || 0}
              </span>
            </div>
            <div
              className={!isUnread ? styles.active : undefined}
              onClick={() => {
                setIsUnread(false);
              }}
            >
              <span>All</span>
              <span className={styles.badge}>
                {data?.pages[0]?.totalCount || 0}
              </span>
            </div>
          </div>
          <div className={styles.tooltipBox}>
            <Tooltip>
              Click on a notification to open it & mark it as read
            </Tooltip>
          </div>
        </div>
        <ColoredScrollbars className={styles.scrollContainer}>
          <div className={styles.scrollContent}>
            {isSuccess &&
              notifications?.map(
                (notification: INotification, index: number) => (
                  <div
                    className={styles.item}
                    onClick={() => handleNotificationClick(notification)}
                    key={index}
                    ref={lastElementRef}
                  >
                    {!notification.read && (
                      <div className={styles.greenCircle}></div>
                    )}
                    <span>
                      {notification.category === "Report" ? (
                        <TbReport />
                      ) : (
                        <TbTimelineEventExclamation />
                      )}
                    </span>
                    <div className={styles.text}>
                      <span>{notification.message}</span>
                      <span>{iconDate(notification.created_on)}</span>
                    </div>
                  </div>
                )
              )}
            {notifications?.length === 0 && isUnread && (
              <div className={styles.noNotifications}>
                No Unread Notifications
              </div>
            )}
            {error && (
              <div className={styles.noNotifications}>
                Something wrong occurred
              </div>
            )}
          </div>
        </ColoredScrollbars>
      </div>
    </>
  );
};

export default Notification;
