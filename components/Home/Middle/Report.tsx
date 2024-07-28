"use client";

import DateFilter from "@/components/Utils/Dashboard/DateFilter";
import Loader from "@/components/Utils/Loader";
import { setReload, setReportStats } from "@/redux/slices/dashboardSlice";
import { useGetReportStats } from "@/server/hooks/dashboard";
import styles from "@/styles/home.module.scss";
import { DashboardState, ReportStats } from "@/types";
import { capitalize } from "lodash";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";

// import ReactCharts with no SSR
const ReactCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Report = () => {
  const { dateFilter, reportStats, reload }: DashboardState = useSelector(
    (state: any) => state.dashboard
  );
  const dispatch = useDispatch();

  const {
    data: reportStatsData,
    isLoading: reportStatsLoading,
    isFetching: reportStatsFetching,
    error: reportStatsError,
  } = useGetReportStats(dateFilter.report);

  const [series, setSeries] = useState(Object.values(reportStats));

  useEffect(() => {
    if (
      reportStatsError ||
      typeof reportStatsData === "string" ||
      typeof reportStatsData === "undefined"
    ) {
      console.error(reportStatsError?.message || reportStatsData);
    }

    if (!reportStatsFetching && !reportStatsLoading) {
      dispatch(setReload({ name: "reportStats", value: false }));
    }

    if (
      !reportStatsLoading &&
      reportStatsData &&
      typeof reportStatsData !== "string" &&
      typeof reportStatsData !== "undefined"
    ) {
      dispatch(setReportStats(reportStatsData));
    }
  }, [reportStatsError, reportStatsData, dispatch]);

  useEffect(() => {
    setSeries(Object.values(reportStats));
  }, [reportStats, reload, reportStatsData]);

  return (
    <>
      {!reportStatsLoading ? (
        <div className={styles.homeContentMiddleReport}>
          {reload.reportStats && <Loader curved={true} />}
          <div className={styles.homeContentMiddleReportTop}>
            <div className={styles.homeContentMiddleReportTopLeft}>
              <span>Report Stats</span> <span>| {dateFilter.report}</span>
            </div>
            <DateFilter category="report" />
          </div>
          <div className={styles.homeContentMiddleReportBody}>
            <ReactCharts
              options={{
                chart: {
                  type: "donut",
                  // height: "170px",
                  width: "100%",
                  toolbar: {
                    show: false,
                  },
                  dropShadow: {
                    enabled: true,
                  },
                },
                stroke: {
                  show: false,
                  width: 2,
                  fill: {
                    type: "gradient",
                  },
                  curve: "stepline",
                  colors: ["#2C2C2C"],
                },
                title: {},
                legend: {
                  show: true,
                  position: "right",
                  floating: false,
                  labels: {
                    colors: "#FFF",
                    // useSeriesColors: true,
                  },
                  horizontalAlign: "center",
                  offsetY: 35,
                  offsetX: 50,
                  itemMargin: {
                    vertical: 8,
                  },
                  fontSize: "14px",
                  fontFamily: "inherit",
                  fontWeight: 300,
                  markers: {
                    radius: 10,
                    offsetY: 2,
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
                  enabled: true,
                  style: {
                    fontFamily: "inherit",
                  },
                  onDatasetHover: {
                    highlightDataSeries: true,
                  },
                  hideEmptySeries: false,
                },
                labels: Object.keys(reportStats).map((label) =>
                  capitalize(label)
                ),
                colors: ["#FFC107", "#4CAF50", "#FF5252"],
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: "11px",
                    fontFamily: "inherit",
                  },
                  textAnchor: "middle",
                  distributed: true,
                  // formatter: (val, opts): string | number => {
                  //   const name: string = opts.w.globals.labels[opts.seriesIndex];
                  //   const output: string | number = [
                  //     name,
                  //     Number(val).toFixed(1) + "%",
                  //   ].toString();
                  //   return output;
                  // },
                },
                plotOptions: {
                  pie: {
                    startAngle: 60,
                    endAngle: -300,
                    offsetX: -40,
                    dataLabels: {
                      offset: -3,
                    },
                    expandOnClick: true,
                    donut: {
                      size: "50%",
                      labels: {
                        show: true,
                        name: {
                          show: true,
                          fontSize: "14px",
                          fontFamily: "inherit",
                          fontWeight: 300,
                          color: "#FFF",
                        },
                        value: {
                          color: "#FFF",
                          fontFamily: "inherit",
                        },
                        total: {
                          show: true,
                          showAlways: false,
                          label: "Total",
                          fontFamily: "inherit",
                          fontSize: "11px",
                          color: "#FFF",
                        },
                      },
                    },
                  },
                },
                fill: {
                  type: "gradient",
                  gradient: {
                    opacityFrom: 1,
                    opacityTo: 0.75,
                  },
                },

                responsive: [
                  {
                    breakpoint: 650,
                    options: {
                      chart: {
                        width: "100%",
                        // height: "250px",
                      },
                      plotOptions: {
                        pie: {
                          offsetX: 0,

                          donut: {
                            size: "50%",
                          },
                          labels: {
                            name: {
                              fontSize: "12px",
                            },
                          },
                        },
                      },
                      legend: {
                        position: "bottom",
                        horizontalAlign: "center",
                        offsetY: 15,
                        offsetX: 0,
                        itemMargin: {
                          horizontal: 8,
                        },
                        width: "100%",
                      },
                    },
                  },
                ],
              }}
              series={series}
              type="donut"
              height={250}
              width={"100%"}
            />
          </div>
        </div>
      ) : (
        <Skeleton
          className={styles.homeContentMiddleReport}
          baseColor="#2C2C2C"
          highlightColor="#505050"
          height={315}
          style={{
            borderRadius: "0.5rem",
            // marginTop: "0.5rem",
            padding: "1rem",
          }}
        />
      )}
    </>
  );
};

export default Report;
