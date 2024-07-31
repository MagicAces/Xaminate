"use client";

import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";
import Loader from "@/components/Utils/Loader";
import ReportScrollbars from "@/components/Utils/Reports/ReportScrollbars";
import { setReload, setSummary } from "@/redux/slices/modalSlice";
import { getSessionPDF } from "@/server/actions/sessions";
import { useGetSessionForSummary } from "@/server/hooks/sessions";
import styles from "@/styles/modal.module.scss";
import { SessionSummary } from "@/types";
import { useModal } from "@/utils/context";
import { capitalize } from "lodash";
import { useAction } from "next-safe-action/hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
import { MdClose, MdDownload } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { toast } from "react-toastify";

// Dynamically import ReactCharts with no SSR
const ReactCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => {
    return (
      <>
        <Skeleton
          baseColor="#1E1E1E"
          highlightColor="#505050"
          className={styles.reportSummaryBox}
          // containerClassName={styles.flexContainer}
          height={175}
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

const Summary = () => {
  const { exitModal, modalState } = useModal();
  const { summary }: { summary: SessionSummary } = useSelector(
    (state: any) => state.modal
  );
  const { execute, result, status } = useAction(getSessionPDF, {
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data?.success);

        const pdfBlob = new Blob([new Uint8Array(data.pdf)], {
          type: "application/pdf",
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(pdfBlob);
        link.download = `Session_${modalState.id}_Summary.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      if (data?.error) toast.error(data?.error);
    },
    onError: (error) => {
      console.log(error);
      if (error.serverError) toast.error("Server Error");
    },
  });

  const [isClient, setClient] = useState(false);
  const dispatch = useDispatch();

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useGetSessionForSummary(modalState.id);

  const [series, setSeries] = useState(Object.values(summary.reports));

  useEffect(() => {
    if (summaryError || summaryData?.error) {
      console.log(summaryError);
      // toast.error(reportData?.error || "Could not fetch report details", {
      //   toastId: "E6",
      // });
      // exitModal();
      // dispatch(closeModal());
    }

    if (!summaryLoading && summaryData?.success) {
      dispatch(setReload(false));
      dispatch(setSummary(summaryData?.success));
    }
  }, [summaryError, summaryData, dispatch, summaryLoading]);

  useEffect(() => {
    setSeries(Object.values(summary.reports));
  }, [summary, summaryData]);

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if (status === "hasSucceeded" && result?.data?.success) exitModal();
  }, [status, exitModal]);

  const handleDownload = () => {
    execute({ id: modalState.id });
  };

  return (
    <>
      <div
        className={styles.sessionContainerSummary}
        onClick={(e) => e.stopPropagation()}
      >
        {(status === "executing" || summaryLoading) && <Loader />}
        {status !== "executing" && (
          <span className={styles.closeIcon}>
            <MdClose onClick={() => exitModal()} />
          </span>
        )}
        <div className={styles.header}>
          <h2>Session Summary</h2>
        </div>
        <ColoredScrollbars className={styles.scrollContainer}>
          <div className={styles.scrollContent}>
            <div className={styles.reportSummaryChart}>
              <span>Report Summary</span>
              <div className={styles.reportSummaryBox}>
                <ReactCharts
                  options={{
                    chart: {
                      type: "donut",
                      height: "170px",
                      toolbar: {
                        show: false,
                      },
                      dropShadow: {
                        enabled: true,
                      },
                    },
                    stroke: {
                      show: false,
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
                      theme: "dark",
                      fillSeriesColor: true,
                    },
                    labels: Object.keys(summary.reports).map((label) =>
                      capitalize(label)
                    ),
                    colors: ["#FFC107", "#4CAF50", "#FF5252"],
                    dataLabels: {
                      enabled: true,
                      style: {
                        fontSize: "12px",
                        fontFamily: "inherit",
                      },
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
                            height: "250px",
                          },
                          plotOptions: {
                            pie: {
                              offsetX: 0,
                              donut: {
                                size: "60%",
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
                            offsetY: 0,
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
                  type={"donut"}
                  height={170}
                  width={"100%"}
                />
              </div>
            </div>
            <div className={styles.reportSummaryStudent}>
              <span>Reports Grouped By Students</span>
              <ScrollSync>
                <div className={styles.reportSummaryTable}>
                  <div className={styles.reportSummaryTableHeader}>
                    <ScrollSyncPane>
                      <div className={styles.headerContent}>
                        <span className={styles.name}>Name</span>
                        <span className={styles.indexNo}>Index No</span>
                        <span className={styles.frequency}>Frequency</span>
                      </div>
                    </ScrollSyncPane>
                  </div>
                  <ReportScrollbars
                    className={styles.bodyContainer}
                    autoHeight={true}
                    autoHeightMin={110}
                    autoHeightMax={110}
                    autoHide={true}
                    autoHideTimeout={1000}
                  >
                    <div className={styles.summaryRows}>
                      {summary?.students?.length > 0 ? (
                        summary?.students?.map(
                          (
                            summaryRow: {
                              fullname: string;
                              index_number: number;
                              frequency: number;
                            },
                            index: number
                          ) => (
                            <div
                              className={styles.summaryRowOuter}
                              key={index}
                              // style={{
                              //   opacity: 0,
                              //   animation: `slideIn 0.5s ease-out forwards`,
                              //   animationDelay: `${index * 0.2}s`,
                              // }}
                            >
                              <ScrollSyncPane>
                                <div
                                  className={`${styles.summaryRowInner} hide-scrollbar`}
                                >
                                  <span className={styles.name}>
                                    {summaryRow.fullname}
                                  </span>
                                  <span className={styles.indexNo}>
                                    {summaryRow.index_number}
                                  </span>
                                  <span className={styles.frequency}>
                                    {summaryRow.frequency}
                                  </span>
                                </div>
                              </ScrollSyncPane>
                            </div>
                          )
                        )
                      ) : (
                        <div className={styles.noSummary}>
                          No reports available
                        </div>
                      )}
                    </div>
                  </ReportScrollbars>
                </div>
              </ScrollSync>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className={styles.downloadButton}
            >
              <MdDownload />
              <span>Download</span>
            </button>
          </div>
        </ColoredScrollbars>
      </div>
    </>
  );
};

export default Summary;
