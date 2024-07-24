"use client";
import Button from "@/components/Utils/Button";
import Loader from "@/components/Utils/Loader";
import { setReload } from "@/redux/slices/reportSlice";
import { approveReport } from "@/server/actions/reports";
import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Action = () => {
  const { modalState, exitModal } = useModal();
  const dispatch = useDispatch();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalState.id) {
      toast.error("Something went wrong");
      exitModal();
      return;
    }

    execute({ approved: modalState.mode === 3, id: modalState.id });
  };

  useEffect(() => {
    if (status === "hasSucceeded" && result?.data?.success) {
      dispatch(setReload(true));
      exitModal();
    }
  }, [status, exitModal]);

  return (
    <>
      <form className={styles.reportContainerAction} onSubmit={handleSubmit}>
        {status === "executing" && <Loader />}
        {status !== "executing" && (
          <span className={styles.closeIcon}>
            <MdClose
              onClick={() => {
                exitModal();
              }}
            />
          </span>
        )}
        <div className={styles.header}>
          <h2>
            {modalState.mode === 3 ? "Approve" : "Reject"} Report #
            {modalState.id}
          </h2>
        </div>
        <div className={styles.body}>
          <p>
            After <span className={styles.bolden}>reviewing</span> the details
            of this incident, are you sure you want to{" "}
            <span className={styles.bolden}>
              {modalState.mode === 3 ? "approve" : "reject"}
            </span>{" "}
            this <span className={styles.bolden}>report</span>?
          </p>
        </div>
        <div className={styles.navigateButtons}>
          <Button
            disabled={status === "executing"}
            message={"Yes"}
            buttonClass={
              modalState.mode === 3 ? styles.approveButton : styles.rejectButton
            }
          />
        </div>
      </form>
    </>
  );
};

export default Action;
