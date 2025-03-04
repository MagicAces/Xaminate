"use client";

import styles from "@/styles/header.module.scss";
import { useModal } from "@/utils/context";
import { Menu, MenuGroup, MenuHeader, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { formatDistance } from "date-fns";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { BsEyeFill } from "react-icons/bs";
import { FaCircle } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import { TbReport, TbTimelineEventExclamation } from "react-icons/tb";
import Modal from "./Modal/Modal";

import logo from "@/public/images/logo.svg";
import {
  markNotificationAsRead,
  markNotificationsAsRead,
} from "@/server/actions/notifications";
import { useCheckStatus, useGetUnread } from "@/server/hooks/notifications";
import { Notification } from "@/types";
import { CustomScroll } from "react-custom-scroll";
import { useAction } from "next-safe-action/hooks";
import Loader from "./Utils/Loader";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { setFullView } from "@/redux/slices/sidebarSlice";
import { useRouter } from "next/navigation";
import { clearSessionsBox, setReload } from "@/redux/slices/sessionSlice";
import {
  clearReportsBox,
  setReload as reportReload,
} from "@/redux/slices/reportSlice";

const Header = () => {
  const pathname = usePathname();
  const [styleMenu, setStyleMenu] = useState(false);
  const { logoutReload } = useSelector((state: any) => state.sidebar);
  const { setState, modalState } = useModal();
  const { data: session } = useSession();
  const { execute: markAsRead } = useAction(markNotificationAsRead);
  const { execute: markAllAsRead } = useAction(markNotificationsAsRead);
  const { data: notifications, error, isLoading } = useGetUnread();
  const {} = useCheckStatus();
  const dispatch = useDispatch();
  const router = useRouter();

  function updateNotification(notification: Notification): void {
    if (notification.read) return;

    if (notification?.category_id && notification.category === "Session") {
      // dispatch(setReload(true));
      // dispatch(clearSessionsBox());
      // router.prefetch(`/sessions/${notification.category_id}`);
      // router.push(`/sessions/${notification.category_id}`);
      markAsRead({ id: notification.id });
    } else if (
      notification?.category_id &&
      notification.category === "Report"
    ) {
      // dispatch(reportReload(true));
      // dispatch(clearReportsBox());
      // router.prefetch(`/reports/${notification.category_id}`);
      // router.push(`/reports/${notification.category_id}`);
      markAsRead({ id: notification.id });
    }
  }

  useEffect(() => {
    if (error) console.error(error);
  }, [notifications, error]);

  return (
    <>
      {modalState.mode > 0 && <Modal />}
      {logoutReload && <Loader curved={false} />}
      <div className={styles.header}>
        <div className={styles.leftSection}>
          <div className={styles.logoContainer}>
            <GiHamburgerMenu onClick={() => dispatch(setFullView(true))} />
            <Image
              src={logo}
              alt="logo.svg"
              className={styles.logoImage}
              width={40}
              height={40}
              priority={true}
            />
          </div>
          {pathname.split("/")[1] === ""
            ? "Home"
            : `${pathname.split("/")[1][0].toUpperCase()}${pathname
                .split("/")[1]
                .slice(1)}`}
        </div>
        <div className={styles.rightSection}>
          <Menu
            menuButton={
              <div
                className={
                  styleMenu
                    ? `${styles.notifications} ${styles.beautify}`
                    : `${styles.notifications}`
                }
                title="Notifications"
              >
                <IoIosNotifications />
                {notifications?.count ? (
                  <div className={styles.greenCircle}></div>
                ) : (
                  ""
                )}
              </div>
            }
            onMenuChange={({ open }) => setStyleMenu(open)}
            transition
            menuClassName={styles.notificationsMenu}
            align={"end"}
            gap={10}
            shift={30}
          >
            <MenuHeader className={styles.notificationsMenuHeader}>
              <span>
                Notifications{" "}
                {notifications?.count ? (
                  <span>({notifications?.count})</span>
                ) : (
                  ""
                )}
              </span>
              {notifications?.count ? (
                <span onClick={() => markAllAsRead({})}>
                  <IoCheckmarkDone title="Mark all as read" />
                </span>
              ) : (
                ""
              )}
            </MenuHeader>
            <MenuGroup>
              {isLoading && <Loader />}
              <CustomScroll
                className={styles.scrollContainer}
                flex={"1"}
                allowOuterScroll={true}
                handleClass={styles.scrollbar}
              >
                <div className={styles.scrollContent}>
                  {notifications?.count && notifications?.count > 0 ? (
                    notifications?.data.map(
                      (notification: any, index: number) => (
                        <MenuItem
                          className={styles.notificationsMenuItem}
                          key={index}
                          onClick={() => updateNotification(notification)}
                        >
                          <>
                            <FaCircle />
                            <div className={styles.itemContent}>
                              <span>
                                {notification.category === "Report" ? (
                                  <TbReport />
                                ) : (
                                  <TbTimelineEventExclamation />
                                )}
                              </span>
                              <div className={styles.itemText}>
                                <span>
                                  {notification.message.length >= 48
                                    ? notification.message.slice(0, 48) + "..."
                                    : notification.message}
                                </span>
                                <span>
                                  {formatDistance(
                                    notification.created_on,
                                    new Date(),
                                    {
                                      addSuffix: true,
                                      includeSeconds: true,
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </>
                        </MenuItem>
                      )
                    )
                  ) : (
                    <MenuItem className={styles.noNotifications} disabled>
                      No Unread Notifications
                    </MenuItem>
                  )}
                </div>
              </CustomScroll>
            </MenuGroup>
            <MenuItem
              className={styles.notificationsFooter}
              onClick={() => setState(0, 1, "notification")}
            >
              <BsEyeFill />
              <span>View All</span>
            </MenuItem>
          </Menu>
          <Avatar
            className={styles.avatar}
            name={
              session?.user?.firstName !== null
                ? `${session?.user?.firstName} ${session?.user?.lastName}`
                : "Still Loading"
            }
            size={"40"}
            round={true}
            maxInitials={1}
            textSizeRatio={0.5}
            textMarginRatio={0.05}
            onClick={() => {
              if (session?.user) setState(0, 1, "profile");
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
