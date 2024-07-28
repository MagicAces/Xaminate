"use client";

import logo from "@/public/images/logo.svg";
// import { logout } from "@/server/actions/user";
import styles from "@/styles/sidebar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// import { useFormState, useFormStatus } from "react-dom";
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
import { setLogoutReload, setFullView } from "@/redux/slices/sidebarSlice";
import { useGetCameras } from "@/server/hooks/cameras";
import { setCameras, setReload, setVenues } from "@/redux/slices/settingSlice";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const { fullView } = useSelector((state: any) => state.sidebar);
  const { reload } = useSelector((state: any) => state.modal);
  const pathname = usePathname();
  // const { pending } = useFormStatus();
  // const [, formAction, isPending] = useFormState(logout, null);
  const { modalState, setState } = useModal();
  const dispatch = useDispatch();
  const {
    data: venues,
    error: venuesError,
    isFetching: venuesFetching,
    isLoading: venuesLoading,
  } = useGetVenues();
  const {
    data: cameras,
    error: camerasError,
    isFetching: camerasFetching,
    isLoading: camerasLoading,
  } = useGetCameras();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (venuesError) console.error(venuesError);

    if (!venuesFetching && !venuesLoading) dispatch(setReload(false));
    if (venues !== undefined && Array.isArray(venues) && venues?.length)
      dispatch(setVenues(typeof venues === "string" ? [] : venues));
  }, [venues, venuesError, dispatch]);

  useEffect(() => {
    if (camerasError) console.error(camerasError);

    if (!camerasFetching && !camerasLoading) dispatch(setReload(false));
    if (cameras !== undefined && Array.isArray(cameras) && cameras?.length)
      dispatch(setCameras(typeof cameras === "string" ? [] : cameras));
  }, [cameras, camerasError, dispatch]);

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
        {/* {(isPending || pending) && <Loader />} */}
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
          <form
            onSubmit={() => {
              dispatch(setLogoutReload(true));
              signOut({ redirect: true, callbackUrl: "/login" });
            }}
            className={styles.logout}
          >
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
