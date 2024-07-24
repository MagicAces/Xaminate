"use client";
import Button from "@/components/Utils/Button";
import Loader from "@/components/Utils/Loader";
import { setReload } from "@/redux/slices/reportSlice";
import { addComment } from "@/server/actions/reports";
import styles from "@/styles/modal.module.scss";
import { ReportOutput } from "@/types";
import { useModal } from "@/utils/context";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Comment = () => {
  const { modalState, exitModal } = useModal();
  const { report }: { report: ReportOutput } = useSelector(
    (state: any) => state.report
  );
  const [comments, setComments] = useState(report?.comments || "");
  const dispatch = useDispatch();

  const { execute, result, status } = useAction(addComment, {
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

    execute({ comments, id: modalState.id });
  };

  useEffect(() => {
    if (status === "hasSucceeded" && result?.data?.success) {
      dispatch(setReload(true));
      exitModal();
    }
  }, [status, exitModal]);

  return (
    <>
      <form className={styles.reportContainerComment} onSubmit={handleSubmit}>
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
          <h2>Comments</h2>
        </div>
        <div className={styles.body}>
          <textarea
            value={comments}
            placeholder="Add Comments"
            rows={10}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <div className={styles.navigateButtons}>
          <Button
            disabled={status === "executing"}
            message={"Add"}
            buttonClass={styles.addButton}
          />
        </div>
      </form>
    </>
  );
};

export default Comment;
