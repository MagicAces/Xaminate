"use client";

import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";
import Loader from "@/components/Utils/Loader";
import unknown from "@/public/images/unknown_user.png";
import { setReload, setReport } from "@/redux/slices/modalSlice";
import { approveReport } from "@/server/actions/reports";
import { useGetReport } from "@/server/hooks/reports";
import styles from "@/styles/modal.module.scss";
import { ReportInfo } from "@/types";
import { useModal } from "@/utils/context";
import { formatSorRDate } from "@/utils/functs";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdBlock, MdCheck, MdClose, MdInfo } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const View = () => {
  const { exitModal, modalState } = useModal();
  const { report }: { report: ReportInfo } = useSelector(
    (state: any) => state.modal
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const {
    data: reportData,
    isLoading: reportLoading,
    error: reportError,
  } = useGetReport(modalState.id);

  const { execute, result, status } = useAction(approveReport, {
    onSuccess: (data) => {
      if (data?.success) toast.success(data?.success);
      if (data?.error) toast.error(data?.error);
    },
    onError: (error) => {
      console.log(error);
      if (error.serverError) toast.error("Server Error");
    },
  });

  useEffect(() => {
    if (reportError || reportData?.error) {
      console.log(reportError);
      // toast.error(reportData?.error || "Could not fetch report details", {
      //   toastId: "E6",
      // });
      // exitModal();
      // dispatch(closeModal());
    }

    if (!reportLoading && reportData?.success) {
      dispatch(setReload(false));
      dispatch(setReport(reportData?.success));
    }
  }, [reportError, reportData, dispatch]);

  const handleSubmit = (approved: boolean) => {
    execute({ approved, id: modalState.id });
  };

  useEffect(() => {
    if (status === "hasSucceeded" && result?.data?.success) exitModal();
  }, [status, exitModal]);

  return (
    <>
      <div
        className={styles.reportContainerView}
        onClick={(e) => e.stopPropagation()}
      >
        {(status === "executing" || reportLoading) && <Loader />}
        {status !== "executing" && (
          <span className={styles.closeIcon}>
            <MdClose onClick={() => exitModal()} />
          </span>
        )}
        <div className={styles.header}>
          <h2>Report #{modalState.id}</h2>
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
                  src={
                    report?.student?.photo ? report?.student?.photo : unknown
                  }
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
                      {report?.student?.fullName || (
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
                  <div className={styles.programBox}>
                    <span>Program</span>
                    <p>
                      {report?.student?.program && !reportLoading ? (
                        report?.student?.program
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
                <div className={styles.secondRow}>
                  <div className={styles.indexNoBox}>
                    <span>Index Number</span>
                    <p>
                      {report?.student?.index_number || (
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
                      {report?.student?.reference_no || (
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
                  <span>Timestamp</span>
                  <p>
                    {formatSorRDate(report?.timestamp) || (
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
                <div className={styles.sessionIdBox}>
                  <span>Session ID</span>
                  <p
                    onClick={() => {
                      if (report?.session_id) {
                        router.push(`/sessions/${report?.session_id}`);
                        exitModal();
                      }
                    }}
                  >
                    {report?.session_id ? (
                      `#${report?.session_id}`
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
                <div className={styles.descriptionBox}>
                  <span>Description</span>
                  <p>
                    {!reportLoading ? (
                      report?.description.length > 0 ? (
                        report?.description
                      ) : (
                        "N/A"
                      )
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
            <span className={styles.subText}>
              <MdInfo />
              <span>Enter full details mode of report to view snapshots</span>
            </span>
          </div>
        </ColoredScrollbars>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.approveButton}
            onClick={() => handleSubmit(true)}
          >
            <MdCheck />
            <span>Approve</span>
          </button>
          <button
            type="button"
            className={styles.rejectButton}
            onClick={() => handleSubmit(false)}
          >
            <MdBlock />
            <span>Reject</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default View;
