"use client";
import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";
import { closeModal, setReload, setReport } from "@/redux/slices/modalSlice";
import { useGetReport } from "@/server/hooks/reports";
import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const View = () => {
  const { exitModal, modalState } = useModal();

  const router = useRouter();
  const dispatch = useDispatch();
  const { data: reportData, isLoading: reportLoading, error: reportError } = useGetReport(modalState.id);

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
            <div className=""></div>
          </div>
        </ColoredScrollbars>
      /</div>
    </>
  );
};

export default View;
