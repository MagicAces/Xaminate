"use client";

import logo from "@/public/images/logo.svg";
import { logout } from "@/server/actions/login";
import styles from "@/styles/sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { MdAdd } from "react-icons/md";
import {
  TbHome,
  TbLogout,
  TbReport,
  TbSettings,
  TbTimelineEventExclamation,
} from "react-icons/tb";
import Loader from "./Utils/Loader";

const Sidebar = () => {
  const [fullView, setFullView] = useState(false);
  const pathname = usePathname();
  const { pending } = useFormStatus();
  const [, formAction, isPending] = useFormState(logout, null);

  return (
    <>
      <div
        className={`${styles.sidebarContainer} ${
          fullView ? styles.sidebarFullContainer : ""
        }`}
        onMouseEnter={() => setFullView(true)}
        onMouseLeave={() => setFullView(false)}
      >
        {isPending && <Loader />}
        <div className={styles.logoContainer}>
          <Image
            src={logo}
            alt="logo.svg"
            className={styles.logoImage}
            width={40}
            height={40}
          />
          <span>aminate</span>
        </div>
        <div className={styles.routesContainer}>
          <Link
            href={"/"}
            className={pathname.split("/")[1] === "" ? styles.activeLink : ""}
          >
            <span>
              <TbHome />
            </span>
            <span>Home</span>
          </Link>
          <Link
            href={"/sessions"}
            className={
              pathname.split("/")[1] === "sessions" ? styles.activeLink : ""
            }
          >
            <span>
              <TbTimelineEventExclamation />
            </span>
            <span>Sessions</span>
          </Link>
          <Link
            href={"/reports"}
            className={
              pathname.split("/")[1] === "reports" ? styles.activeLink : ""
            }
          >
            <span>
              <TbReport />
            </span>
            <span>Reports</span>
          </Link>
          <Link
            href={"/settings"}
            className={
              pathname.split("/")[1] === "settings" ? styles.activeLink : ""
            }
          >
            <span>
              <TbSettings />
            </span>
            <span>Settings</span>
          </Link>
        </div>
        <div className={styles.lowerContainer}>
          <div className={styles.addSession}>
            <span>
              <MdAdd />
            </span>
            <span>Session</span>
          </div>
          <form action={formAction} className={styles.logout}>
            <button type="submit">
              <span>
                <TbLogout />
              </span>
              <span>Logout</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
