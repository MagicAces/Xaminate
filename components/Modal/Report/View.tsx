"use client";
import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";
import { closeModal, setReload, setReport } from "@/redux/slices/modalSlice";
import { useGetReport } from "@/server/hooks/reports";
import styles from "@/styles/modal.module.scss";
import { ReportInfo } from "@/types";
import { useModal } from "@/utils/context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import unknown from "@/public/images/unknown_user.png";
import Skeleton from "react-loading-skeleton";
import { IoOpen } from "react-icons/io5";
import Button from "@/components/Utils/Button";

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

  return (
    <>
      <div
        className={styles.reportContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={styles.closeIcon}>
          <MdClose onClick={() => exitModal()} />
        </span>
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
                  width={75}
                  height={75}
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
                        report.student.program
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
                    {report?.timestamp || (
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
                  <p>
                    {report?.session_id ? (
                      <>
                        <span>#{report?.session_id}</span>
                        <IoOpen />
                      </>
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
                    {report?.description && reportLoading ? (
                      report.description
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
              *Enter full details mode of report to view snapshots
            </span>
          </div>
        </ColoredScrollbars>
        <div className={styles.buttons}>
          <Button
            message="Approve"
            buttonClass={styles.approveButton}
            disabled={false}
          />
          <Button
            message="Reject"
            buttonClass={styles.rejectButton}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
};

export default View;
