"use client";
import styles from "@/styles/modal.module.scss";
import Tooltip from "../Utils/Tooltip";

import {
  useGetNotifications,
  useMarkNotificationAsSeen,
  useMarkNotificationsAsSeen,
} from "@/server/hooks/notification";
import { Notification as INotification } from "@/types";
import { useModal } from "@/utils/context";
import { iconDate } from "@/utils/dates";
import { useEffect, useMemo, useState } from "react";
import { CustomScroll } from "react-custom-scroll";
import { IoCheckmarkDone } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { TbReport, TbTimelineEventExclamation } from "react-icons/tb";
import { useInView } from "react-intersection-observer";
import Loader from "../Utils/Loader";

const Notification = () => {
  const [isUnread, setIsUnread] = useState(false);
  const { ref, inView, entry } = useInView({ threshold: 1 });
  const { exitModal } = useModal();

  const { mutate: markAsRead, isPending: onePending } =
    useMarkNotificationAsSeen();
  const { mutate: markAllAsRead, isPending: allPending } =
    useMarkNotificationsAsSeen();

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isFetchingNextPage,
    refetch,
  } = useGetNotifications(isUnread);

  const notifications = useMemo(() => {
    if(isUnread)
  }, [isUnread])
  console.log("inView: " + inView);
  console.log(entry);

  useEffect(() => {
    if (
      data?.pages[data?.pages?.length - 1]?.metaData?.hasNextPage &&
      inView &&
      hasNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage, data]);

  const handleNotificationClick = (notification: INotification) => {
    if (notification.read) return;
    markAsRead(notification.id);
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
        <CustomScroll
          className={styles.scrollContainer}
          allowOuterScroll={true}
          flex={"1"}
          handleClass={styles.scrollbar}
        >
          <div className={styles.scrollContent}>
            {isSuccess &&
              data?.pages.map((page) =>
                page.data.map((notification: INotification, index: number) => {
                  if (page.data.length === index + 1) {
                    return (
                      <div ref={ref} key={index}>
                        <div
                          className={styles.item}
                          onClick={() => handleNotificationClick(notification)}
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
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className={styles.item}
                        onClick={() => handleNotificationClick(notification)}
                        key={index}
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
                    );
                  }
                })
              )}
          </div>
        </CustomScroll>
        {data?.pages[0]?.unreadCount === 0 && isUnread && (
          <div className={styles.noNotifications}>No Unread Notifications</div>
        )}
      </div>
    </>
  );
};

export default Notification;
