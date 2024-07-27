"use client";

import { setTopRow } from "@/redux/slices/dashboardSlice";
import { useGetDashboardTopRowData } from "@/server/hooks/dashboard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardTopRowData } from "@/types";
import styles from "@/styles/home.module.scss";
import SessionBreakdown from "../Utils/Dashboard/SessionBreakdown";
import ReportBreakdown from "../Utils/Dashboard/ReportBreakdown";
import Skeleton from "react-loading-skeleton";
import CameraBreakdown from "../Utils/Dashboard/CameraBreakdown";

const Top = () => {
  const { topRow }: { topRow: DashboardTopRowData } = useSelector(
    (state: any) => state.dashboard
  );

  const dispatch = useDispatch();
  const { data, error, isFetching, isLoading, isSuccess } =
    useGetDashboardTopRowData();

  useEffect(() => {
    if (error || typeof data === "string" || typeof data === "undefined") {
      console.error(error?.message || data);
    }

    if (
      isSuccess &&
      !isFetching &&
      !isLoading &&
      typeof data !== "string" &&
      typeof data !== "undefined"
    ) {
      dispatch(setTopRow(data));
    }
  }, [isSuccess, isFetching, isLoading, data, error]);

  return (
    <>
      <div className={styles.homeContentTop}>
        {!isLoading ? (
          <div className={styles.sessionBox}>
            <div className={styles.sessionBoxTop}>
              <span>
                Sessions{" "}
                <span className={styles.littlecaption}>| This Month</span>
              </span>
              <SessionBreakdown />
            </div>
            <p>+{topRow.sessions.currentMonth}</p>
            <span className={styles.footerText}>
              {topRow.sessions.percentageChange > 0
                ? `+${topRow.sessions.percentageChange}%`
                : `${topRow.sessions.percentageChange}%`}{" "}
              from last month
            </span>
          </div>
        ) : (
          <Skeleton
            className={styles.sessionBox}
            baseColor="#2C2C2C"
            highlightColor="#505050"
            height={120}
            style={{
              borderRadius: "0.5rem",
              // marginTop: "0.5rem",
              padding: "1rem",
            }}
          />
        )}
        {!isLoading ? (
          <div className={styles.reportBox}>
            <div className={styles.reportBoxTop}>
              <span>
                Reports{" "}
                <span className={styles.littlecaption}>| This Month</span>
              </span>
              <ReportBreakdown />
            </div>
            <p>+{topRow.reports.currentMonth}</p>
            <span className={styles.footerText}>
              {topRow.reports.percentageChange > 0
                ? `+${topRow.reports.percentageChange}%`
                : `${topRow.reports.percentageChange}%`}{" "}
              from last month
            </span>
          </div>
        ) : (
          <Skeleton
            className={styles.reportBox}
            baseColor="#2C2C2C"
            highlightColor="#505050"
            height={120}
            style={{
              borderRadius: "0.5rem",
              // marginTop: "0.5rem",
              padding: "1rem",
            }}
          />
        )}
        {!isLoading ? (
          <div className={styles.cameraBox}>
            <div className={styles.cameraBoxTop}>
              <span>Total Cameras</span>
              <CameraBreakdown />
            </div>
            <p>+{topRow.cameras.total}</p>
            <span className={styles.footerText}>
              {topRow.cameras.percentageChange > 0
                ? `+${topRow.cameras.percentageChange}%`
                : `${topRow.cameras.percentageChange}%`}{" "}
              from last month
            </span>
          </div>
        ) : (
          <Skeleton
            className={styles.cameraBox}
            baseColor="#2C2C2C"
            highlightColor="#505050"
            height={120}
            style={{
              borderRadius: "0.5rem",
              // marginTop: "0.5rem",
              padding: "1rem",
            }}
          />
        )}
        {!isLoading ? (
          <div className={styles.venueBox}>
            <div className={styles.venueBoxTop}>
              <span>Total Venues</span>
            </div>
            <p>+{topRow.venues.total}</p>
            <span className={styles.footerText}>
              {topRow.venues.percentageChange > 0
                ? `+${topRow.venues.percentageChange}%`
                : `${topRow.venues.percentageChange}%`}{" "}
              from last month
            </span>
          </div>
        ) : (
          <Skeleton
            className={styles.venueBox}
            baseColor="#2C2C2C"
            highlightColor="#505050"
            height={120}
            style={{
              borderRadius: "0.5rem",
              // marginTop: "0.5rem",
              padding: "1rem",
            }}
          />
        )}
      </div>
    </>
  );
};

export default Top;
