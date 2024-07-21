"use client";

import styles from "@/styles/report.module.scss";
import { ReportOutput } from "@/types";
import { shimmer, toBase64 } from "@/utils/functs";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Dynamically import ReactCharts with no SSR
const ReactCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Statistics = () => {
  const { report }: { report: ReportOutput } = useSelector(
    (state: any) => state.report
  );

  const [series, setSeries] = useState([
    {
      name: "Total Reports",
      data: report?.last_seven?.map((value) => value.report_count),
    },
  ]);

  useEffect(() => {
    setSeries([
      {
        name: "Total Reports",
        data: report?.last_seven?.map((value) => value.report_count),
      },
    ]);
  }, [report]);

  return (
    <>
      <div className={styles.reportStatistics}>
        <div className={styles.snapshot}>
          <span>Snapshot</span>
          <div className={styles.snapshotBox}>
            <Image
              src={report?.snapshot_url}
              alt="snapshot"
              // width={250}
              // height={200}
              className={styles.snapshotPhoto}
              priority
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(250, 200)
              )}`}
            />
          </div>
        </div>
        <div className={styles.studentStats}>
          <span>Student Stats</span>
          <div className={styles.studentStatsBox}>
            <div className={styles.studentStatsBoxTop}>
              <div className={styles.totalValidReports}>
                <span>Total Approved Reports</span>
                <p>{report?.valid_reports}</p>
              </div>
              <div className={styles.percentReports}>
                <span>% of Reports Approved</span>
                <p>
                  {`${(
                    (report?.valid_reports / report?.total_reports) *
                    100
                  ).toFixed(1)}%`}
                </p>
              </div>
            </div>
            <div className={styles.studentStatsBoxBottom}>
              <span>Reports in Last 7 Sessions</span>
              <div className={styles.studentStatsBoxBottomCharts}>
                {
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
                          tools: {
                            selection: true,
                            zoom: true,
                            pan: true,
                          },
                          export: {
                            csv: {
                              filename:
                                "Reports in Last 7 Sessions" +
                                "_" +
                                report?.status,
                            },
                            svg: {
                              filename:
                                "Reports in Last 7 Sessions" +
                                "_" +
                                report?.status,
                            },
                            png: {
                              filename:
                                "Reports in Last 7 Sessions" +
                                "_" +
                                report?.status,
                            },
                          },
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                      colors:
                        report?.status === "Pending"
                          ? ["#FFC107"]
                          : report?.status === "Approved"
                          ? ["#4CAF50"]
                          : ["#FF5252"],
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
                        categories: report?.last_seven?.map(
                          (value) => `#${value.session_id}`
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
                    height={180}
                    width={"100%"}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;
