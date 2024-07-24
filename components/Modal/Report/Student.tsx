"use client";

import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";
import Loader from "@/components/Utils/Loader";
import unknown from "@/public/images/unknown_user.png";
import { setReload, setStudent } from "@/redux/slices/modalSlice";
import { useGetStudent } from "@/server/hooks/reports";
import styles from "@/styles/modal.module.scss";
import { ReportBox, StudentInfo } from "@/types";
import { useModal } from "@/utils/context";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import ReactCharts from "react-apexcharts";
import { FiExternalLink } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";

// Dynamically import ReactCharts with no SSR
const ReactCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Student = () => {
  const { exitModal, modalState } = useModal();
  const { student }: { student: StudentInfo } = useSelector(
    (state: any) => state.modal
  );
  const { reportsBox }: { reportsBox: ReportBox } = useSelector(
    (state: any) => state.report
  );
  const [series, setSeries] = useState([
    {
      name: "Total Reports",
      data: student?.last_seven?.map((value) => value.report_count),
    },
  ]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    data: studentData,
    isLoading: studentLoading,
    error: studentError,
  } = useGetStudent(student?.id);

  useEffect(() => {
    if (studentError || studentData?.error) {
      console.log(studentError);
    }

    if (!studentLoading && studentData?.success) {
      dispatch(setReload(false));
      dispatch(setStudent(studentData?.success));
    }
  }, [studentError, studentData, dispatch]);

  useEffect(() => {
    setSeries([
      {
        name: "Total Reports",
        data: student?.last_seven?.map((value) => value.report_count),
      },
    ]);
  }, [student, studentData]);

  useEffect(() => {
    setIsClient(true);
    router.prefetch(`/reports/${modalState.id}`);
  }, []);

  return (
    <>
      <div
        className={styles.reportContainerStudent}
        onClick={(e) => e.stopPropagation()}
      >
        {studentLoading && <Loader />}

        <span className={styles.closeIcon}>
          <MdClose onClick={() => exitModal()} />
        </span>
        <div className={styles.header}>
          <h2>Student {student.index_number}</h2>
          <FiExternalLink
            onClick={() => {
              router.push(`/reports/${modalState.id}`);
              exitModal();
            }}
          />
        </div>
        <ColoredScrollbars className={styles.scrollContainer}>
          <div className={styles.scrollContent}>
            <div className={styles.infoBox}>
              <div className={styles.firstBox}>
                <Image
                  src={student?.photo ? student?.photo : unknown}
                  alt="student-pic"
                  width={90}
                  height={90}
                  className={styles.studentPhoto}
                  priority
                />
                <div className={styles.firstRow}>
                  <div className={styles.nameBox}>
                    <span>Name</span>
                    <p>
                      {student?.fullName || (
                        <Skeleton
                          baseColor="#2C2C2C"
                          highlightColor="#505050"
                          style={{
                            borderRadius: "0.5rem",
                          }}
                        />
                      )}
                    </p>
                  </div>
                  <div className={styles.referenceNo}>
                    <span>Reference Number</span>
                    <p>
                      {!studentLoading ? (
                        student?.reference_no
                      ) : (
                        <Skeleton
                          baseColor="#2C2C2C"
                          highlightColor="#505050"
                          style={{
                            borderRadius: "0.5rem",
                          }}
                        />
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.secondBox}>
                <div className={styles.timestampBox}>
                  <span>Approved Reports</span>
                  <p>
                    {!studentLoading ? (
                      student?.valid_reports
                    ) : (
                      <Skeleton
                        baseColor="#2C2C2C"
                        highlightColor="#505050"
                        style={{
                          borderRadius: "0.5rem",
                        }}
                      />
                    )}
                  </p>
                </div>
                <div className={styles.percentBox}>
                  <span>Percentage of Reports Approved</span>
                  <p>
                    {!studentLoading ? (
                      `${(
                        (student?.valid_reports / student?.total_reports) *
                        100
                      ).toFixed(1)}%`
                    ) : (
                      <Skeleton
                        baseColor="#2C2C2C"
                        highlightColor="#505050"
                        style={{
                          borderRadius: "0.5rem",
                        }}
                      />
                    )}
                  </p>
                </div>
              </div>
              <div className={styles.thirdBox}>
                <div className={styles.lastSeven}>
                  <span>Reports in Last 7 Sessions</span>
                  <div className={styles.lastSevenCharts}>
                    {isClient ? (
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
                                    reportsBox?.status,
                                },
                                svg: {
                                  filename:
                                    "Reports in Last 7 Sessions" +
                                    "_" +
                                    reportsBox?.status,
                                },
                                png: {
                                  filename:
                                    "Reports in Last 7 Sessions" +
                                    "_" +
                                    reportsBox?.status,
                                },
                              },
                            },
                          },
                          dataLabels: {
                            enabled: false,
                          },
                          colors:
                            reportsBox?.status === "Pending"
                              ? ["#FFC107"]
                              : reportsBox?.status === "Approved"
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
                            categories: student?.last_seven?.map(
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
                    ) : (
                      <Skeleton
                        baseColor="#2C2C2C"
                        highlightColor="#505050"
                        height={180}
                        width={"100%"}
                        style={{
                          borderRadius: "0.5rem",
                          // marginTop: "0.5rem",
                          padding: "1rem",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ColoredScrollbars>
      </div>
    </>
  );
};

export default Student;
