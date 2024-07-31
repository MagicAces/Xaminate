"use client";

// import SessionBack from "@/components/Utils/Dashboard/SessionBack";
import Loader from "@/components/Utils/Loader";
import { setReload, setReportsPerSession } from "@/redux/slices/dashboardSlice";
import { useGetReportsPerSession } from "@/server/hooks/dashboard";
import styles from "@/styles/home.module.scss";
import { DashboardState, ReportsPerSession } from "@/types";
import dynamic from "next/dynamic";
import { relative } from "path";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";

// import ReactCharts with no SSR
const ReactCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => {
    return (
      <>
        <Skeleton
          baseColor="#1E1E1E"
          highlightColor="#505050"
          className={styles.homeContentBottomReportBody}
          containerClassName={styles.flexContainer}
          height={260}
          width={"100%"}
          style={{
            borderRadius: "0.5rem",
            margin: "0 0 1rem 0.5rem",
            // width: "100%",
            padding: "1rem",
            position: "relative",
            left: "0",
          }}
        />
      </>
    );
  },
});
const SessionBack = dynamic(
  () => import("@/components/Utils/Dashboard/SessionBack"),
  {
    ssr: false,
    loading: () => {
      return (
        <>
          <Skeleton
            baseColor="#1E1E1E"
            highlightColor="#505050"
            // className={styles.homeContentBottomReportBody}
            // containerClassName={styles.flexContainer}
            height={20}
            width={50}
            // circle={true}
            style={{
              borderRadius: "0.5rem",
              // margin: "0 0 1rem 0.5rem",
              // // width: "100%",
              // padding: "1rem",
            }}
          />
        </>
      );
    },
  }
);

const Report = () => {
  const { sessionsBack, reportsPerSession, reload }: DashboardState =
    useSelector((state: any) => state.dashboard);
  const dispatch = useDispatch();

  const {
    data: reportsPerSessionData,
    isLoading: reportsPerSessionLoading,
    isFetching: reportsPerSessionFetching,
    error: reportsPerSessionError,
  } = useGetReportsPerSession(sessionsBack);

  const [series, setSeries] = useState([
    {
      name: "Reports Per Session",
      data:
        reportsPerSession.length > 0
          ? reportsPerSession.map(
              (report: ReportsPerSession) => report.reportsCount
            )
          : typeof reportsPerSessionData !== "string" &&
            typeof reportsPerSessionData !== "undefined"
          ? reportsPerSessionData.map(
              (report: ReportsPerSession) => report.reportsCount
            )
          : reportsPerSession.map(
              (report: ReportsPerSession) => report.reportsCount
            ),
    },
  ]);

  useEffect(() => {
    if (
      reportsPerSessionError ||
      typeof reportsPerSessionData === "string" ||
      typeof reportsPerSessionData === "undefined"
    ) {
      console.error(reportsPerSessionError?.message || reportsPerSessionData);
    }

    if (!reportsPerSessionFetching || !reportsPerSessionLoading) {
      dispatch(setReload({ name: "reportsPerSession", value: false }));
    }

    if (
      !reportsPerSessionLoading &&
      reportsPerSessionData &&
      typeof reportsPerSessionData !== "string" &&
      typeof reportsPerSessionData !== "undefined"
    ) {
      dispatch(setReportsPerSession(reportsPerSessionData));
    }
  }, [reportsPerSessionError, reportsPerSessionData, dispatch]);

  useEffect(() => {
    setSeries([
      {
        name: "Reports Per Session",
        data:
          reportsPerSession.length > 0
            ? reportsPerSession.map(
                (report: ReportsPerSession) => report.reportsCount
              )
            : typeof reportsPerSessionData !== "string" &&
              typeof reportsPerSessionData !== "undefined"
            ? reportsPerSessionData.map(
                (report: ReportsPerSession) => report.reportsCount
              )
            : reportsPerSession.map(
                (report: ReportsPerSession) => report.reportsCount
              ),
      },
    ]);
  }, [reportsPerSession, reload, reportsPerSessionData]);

  return (
    <>
      <div className={styles.homeContentBottomReport}>
        {(reload.reportsPerSession || reportsPerSessionLoading) && (
          <Loader curved={true} />
        )}
        <div className={styles.homeContentBottomReportTop}>
          <div className={styles.homeContentBottomReportTopLeft}>
            <span>Reports Per Session</span>{" "}
            <span>| Last {sessionsBack} sessions</span>
          </div>
          <SessionBack />
        </div>
        <div className={styles.homeContentBottomReportBody}>
          <ReactCharts
            options={{
              markers: {
                size: 4,
                strokeWidth: 2,
              },
              chart: {
                type: "area",
                // height: 180,
                toolbar: {
                  show: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
              colors: ["#4CAF50", "#FFC107", "#FF5252"],
              yaxis: {
                labels: {
                  formatter: function (val) {
                    return val.toFixed(0);
                  },
                  style: {
                    colors: "#FFF",
                    fontFamily: "inherit",
                    fontSize: "12px",
                    fontWeight: 200,
                  },
                },
                forceNiceScale: true,
                min: 0,
                // stepSize: 5,
                title: {
                  text: "Reports",
                  style: {
                    color: "#FFF",
                    fontSize: "12px",
                    fontWeight: 300,
                    fontFamily: "inherit",
                  },
                },
                // show: true,
                // axisBorder: {
                //   show: true,
                //   color: "#FFF",
                // },
                // axisTicks: {
                //   show: false,
                // },
              },
              stroke: {
                curve: "straight",
                width: 1,
              },
              fill: {
                type: "gradient",
                gradient: {
                  opacityFrom: 0.7,
                  opacityTo: 0.2,
                },
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return val.toFixed(0);
                  },
                },
                theme: "dark",
                followCursor: true,
                fillSeriesColor: true,
                style: {
                  fontFamily: "inherit",
                },
                onDatasetHover: {
                  highlightDataSeries: true,
                },
                hideEmptySeries: false,
              },
              xaxis: {
                categories:
                  reportsPerSession.length > 0
                    ? reportsPerSession.map(
                        (report: ReportsPerSession) => `${report.sessionId}`
                      )
                    : typeof reportsPerSessionData !== "string" &&
                      typeof reportsPerSessionData !== "undefined"
                    ? reportsPerSessionData.map(
                        (report: ReportsPerSession) => `${report.sessionId}`
                      )
                    : reportsPerSession.map(
                        (report: ReportsPerSession) => `${report.sessionId}`
                      ),
                axisTicks: {
                  show: false,
                },
                labels: {
                  style: {
                    colors: "#FFF",
                    fontFamily: "inherit",
                    fontSize: "12px",
                    fontWeight: 200,
                  },
                },
                title: {
                  text: "Sessions",
                  style: {
                    color: "#FFF",
                    fontSize: "12px",
                    fontWeight: 300,
                    fontFamily: "inherit",
                  },
                },
              },
              grid: {
                borderColor: "#505050",
                yaxis: {
                  lines: {
                    show: true,
                  },
                },
                xaxis: {
                  lines: {
                    show: false,
                  },
                },
              },
            }}
            series={series}
            type="area"
            height={250}
            width={"100%"}
          />
        </div>
      </div>
    </>
  );
};

export default Report;
