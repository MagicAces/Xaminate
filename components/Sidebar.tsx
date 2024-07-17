"use client";

import logo from "@/public/images/logo.svg";
import { logout } from "@/server/actions/login";
import styles from "@/styles/sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { useModal } from "@/utils/context";
import Modal from "./Modal/Modal";
import { useGetVenues } from "@/server/hooks/venues";
import { useDispatch, useSelector } from "react-redux";
import { setReload, setVenues } from "@/redux/slices/modalSlice";
import { setFullView } from "@/redux/slices/sidebarSlice";

const Sidebar = () => {
  const { fullView } = useSelector((state: any) => state.sidebar);
  const { reload } = useSelector((state: any) => state.modal);
  const pathname = usePathname();
  const { pending } = useFormStatus();
  const [, formAction, isPending] = useFormState(logout, null);
  const { modalState, setState } = useModal();
  const dispatch = useDispatch();
  const { data: venues, error, isLoading } = useGetVenues();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) console.error(error);

    if (Array.isArray(venues) && venues?.length && typeof venues !== "string")
      dispatch(setVenues(venues));
  }, [venues, error, dispatch]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleClick = (e: MouseEvent) => {
    if (divRef?.current && !divRef?.current.contains(e.target as Node)) {
      dispatch(setFullView(false));
    }
  };
  return (
    <>
      {/* {reload && <Loader />} */}
      {modalState.mode > 0 && <Modal />}
      <div
        className={`${
          fullView ? styles.sidebarFullContainer : styles.sidebarContainer
        }`}
        onMouseEnter={() => dispatch(setFullView(true))}
        onMouseLeave={() => dispatch(setFullView(false))}
        ref={divRef}
      >
        {(isPending || pending) && <Loader />}
        <div className={styles.logoContainer}>
          <Image
            src={logo}
            alt="logo.svg"
            className={styles.logoImage}
            width={40}
            height={40}
            priority={true}
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
          <div
            className={styles.addSession}
            onClick={() => setState(0, 1, "session")}
          >
            <span>
              <MdAdd />
            </span>
            <span>Session</span>
          </div>
          <form action={formAction} className={styles.logout}>
            <button type="submit" onClick={() => dispatch(setReload(true))}>
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
