"use client";

import styles from "@/styles/report.module.scss";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useDispatch, useSelector } from "react-redux";
import { ReportRow } from "@/types";
import { formatArray, formatSorRDate, shimmer, toBase64 } from "@/utils/functs";
import { capitalize, toUpper } from "lodash";
import ReportScrollbars from "../Utils/Reports/ReportScrollbars";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/navigation";
import { useModal } from "@/utils/context";
import Modal from "../Modal/Modal";
import { setReload, setReport, setStudent } from "@/redux/slices/modalSlice";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import { PiStudent } from "react-icons/pi";
import { FaRegEdit } from "react-icons/fa";
import unknown from "@/public/images/unknown_user.png";
import { toast } from "react-toastify";

const Body = () => {
  const { data, isDisabled } = useSelector((state: any) => state.report);
  const { modalState, setState } = useModal();

  const router = useRouter();
  const dispatch = useDispatch();

  const showModal = (report: ReportRow, type: string) => {
    if (type == "student") {
      if (report.student) {
        setState(report.id, 2, "report");
        // dispatch(setReload(true));
        dispatch(
          setStudent({
            id: Number(report.student.id),
            fullName: report.student.fullName,
            index_number: Number(report.student.index_number),
            reference_no: 0,
            valid_reports: 0,
            total_reports: 0,
            photo: report.student.photo,
            last_seven: [],
          })
        );
      } else {
        toast.info("Student not found");
      }
    } else if (type === "report") {
      setState(report.id, 1, "report");
      // dispatch(setReload(true));
      dispatch(
        setReport({
          id: report.id,
          student: {
            id: Number(report.student.id),
            fullName: report.student.fullName,
            reference_no: 0,
            index_number: Number(report.student.index_number),
            program: "",
            photo: report.student.photo,
          },
          timestamp: report.timestamp,
          session_id: report.session_id,
          description: "",
        })
      );
    }
  };

  return (
    <>
      {modalState.mode > 0 && modalState.id > 0 && <Modal />}
      <ScrollSync>
        <div className={styles.reportContentBody}>
          <div className={styles.reportContentBodyHeader}>
            <ScrollSyncPane>
              <div className={styles.headerContent}>
                <span className={styles.id}>ID</span>
                <span className={styles.photo}>Photo</span>
                <span className={styles.name}>Name</span>
                <span className={styles.indexNo}>Index Number</span>
                <span className={styles.sessionID}>Session ID</span>
                <span className={styles.timestamp}>Timestamp</span>
                <span className={styles.status}>Status</span>
                <span className={styles.actions}>Actions</span>
              </div>
            </ScrollSyncPane>
          </div>
          <ReportScrollbars
            className={styles.bodyContainer}
            autoHeight={true}
            autoHeightMin={350}
            autoHeightMax={"64vh"}
            autoHide={true}
            autoHideTimeout={1000}
          >
            <div className={styles.reportRows}>
              {data?.reports?.length > 0 ? (
                data?.reports?.map((report: ReportRow, index: number) => {
                  router.prefetch(`/sessions/${report.session_id}`);
                  router.prefetch(`/reports/${report.id}`);
                  return (
                    <div
                      className={styles.reportRowOuter}
                      key={index}
                      // style={{
                      //   opacity: 0,
                      //   animation: `slideIn 0.5s ease-out forwards`,
                      //   animationDelay: `${index * 0.2}s`,
                      // }}
                    >
                      <ScrollSyncPane>
                        <div
                          className={`${styles.reportRowInner} hide-scrollbar`}
                        >
                          <span
                            className={styles.id}
                            // onClick={() => router.push(`/reports/${report.id}`)}
                          >
                            #{report.id}
                          </span>
                          <span className={styles.photo}>
                            <Image
                              src={
                                report.student.photo
                                  ? report.student.photo
                                  : unknown
                              }
                              alt="Student's pic"
                              width={35}
                              height={35}
                              className={styles.reportImage}
                              priority
                              // placeholder="blur"
                              // blurDataURL={`data:image/svg+xml;base64,${toBase64(
                              //   shimmer(700, 475)
                              // )}`}
                            />
                          </span>
                          <span className={styles.name}>
                            {report?.student?.fullName}
                          </span>
                          <span className={styles.indexNo}>
                            {report.student.index_number}
                          </span>
                          <span
                            className={styles.sessionID}
                            onClick={() => {
                              router.prefetch(`/sessions/${report.session_id}`);
                              router.push(`/sessions/${report.session_id}`);
                            }}
                          >
                            #{report.session_id}
                          </span>
                          <span className={styles.timestamp}>
                            {formatSorRDate(report.timestamp)}
                          </span>
                          <span className={`${styles.status}`}>
                            <span
                              className={
                                styles[`${report.status.toLowerCase()}`]
                              }
                            >
                              {capitalize(report.status)}
                            </span>
                          </span>
                          <span className={styles.actions}>
                            <div
                              className="viewReport"
                              onClick={() => {
                                router.prefetch(`/reports/${report.id}`);
                                router.push(`/reports/${report.id}`);
                              }}
                            >
                              <FiExternalLink />
                            </div>
                            <div
                              className="studentModal"
                              onClick={() => showModal(report, "student")}
                            >
                              <PiStudent />
                            </div>
                            {report.status === "Pending" && (
                              <div
                                className="reportModal"
                                onClick={() => showModal(report, "report")}
                              >
                                <FaRegEdit />
                              </div>
                            )}
                          </span>
                        </div>
                      </ScrollSyncPane>
                    </div>
                  );
                })
              ) : !data ? (
                new Array(8).fill("").map((_, index) => (
                  <Skeleton
                    key={index}
                    baseColor="#2C2C2C"
                    highlightColor="#505050"
                    className={styles.reportRowOuter}
                    height={20}
                    style={{
                      borderRadius: "0.5rem",
                      marginTop: "0.5rem",
                      padding: "1rem",
                    }}
                  />
                ))
              ) : (
                <div className={styles.noReports}>No reports available</div>
              )}
            </div>
          </ReportScrollbars>
        </div>
      </ScrollSync>
    </>
  );
};

export default Body;
