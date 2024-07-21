"use client"

import styles from "@/styles/report.module.scss";
import { ReportOutput } from "@/types";
import { useModal } from "@/utils/context";
import { useParams, useRouter } from "next/navigation";
import { FaRegCommentDots } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { MdBlock, MdCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Top = () => {
  const { id }: { id: string } = useParams();
  const { report }: { report: ReportOutput } = useSelector(
    (state: any) => state.report
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { setState } = useModal();

  const showModal = (type: string) => {
    if (type === "approve") {
      setState(report.id, 3, "report");
    } else if (type === "reject") {
      setState(report.id, 4, "report");
    } else if (type === "comment") {
      setState(report.id, 5, "report");
    }
  };

  return (
    <>
      <div className={styles.reportPageTop}>
        <div className={styles.reportPageTopLeft}>
          <IoMdArrowBack onClick={() => router.push("/reports")} />
          <span className={styles.reportId}>
            Report <span>#{id}</span>
          </span>
          <div className={styles[`${report?.status}`]}>
            <div></div>
            <div>{report?.status}</div>
          </div>
        </div>
        <div className={styles.reportPageTopRight}>
          {(report?.status === "Pending" || report?.status === "Rejected") && (
            <button
              type="button"
              className={styles.approveButton}
              onClick={() => showModal("approve")}
            >
              <MdCheck />
              <span>Approve</span>
            </button>
          )}
          {(report?.status === "Pending" || report?.status === "Approved") && (
            <button
              type="button"
              className={styles.rejectButton}
              onClick={() => showModal("approve")}
            >
              <MdBlock />
              <span>Reject</span>
            </button>
          )}
          <button
            type="button"
            className={styles.commentButton}
            onClick={() => showModal("comment")}
          >
            <FaRegCommentDots />
            Comment
          </button>
        </div>
        <div className={`${styles.reportPageTopRight} ${styles.mobileMode}`}>
          {(report?.status === "Pending" || report?.status === "Rejected") && (
            <button
              type="button"
              className={styles.approveButton}
              onClick={() => showModal("approve")}
            >
              <MdCheck />
              <span>Approve</span>
            </button>
          )}
          {(report?.status === "Pending" || report?.status === "Approved") && (
            <button
              type="button"
              className={styles.rejectButton}
              onClick={() => showModal("approve")}
            >
              <MdBlock />
              <span>Reject</span>
            </button>
          )}
          <button
            type="button"
            className={styles.commentButton}
            onClick={() => showModal("comment")}
          >
            <FaRegCommentDots />
            Comment
          </button>
        </div>
      </div>
    </>
  );
};

export default Top;
