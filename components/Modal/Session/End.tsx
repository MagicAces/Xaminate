"use client";
import Button from "@/components/Utils/Button";
import Loader from "@/components/Utils/Loader";
import { endSession } from "@/server/actions/sessions";
import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const End = () => {
  const { modalState, exitModal } = useModal();
  const dispatch = useDispatch();

  const { execute, status } = useAction(endSession, {
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
    execute({
      id: modalState.id,
    });
  };

  useEffect(() => {
    if (status === "hasSucceeded") {
      exitModal();
    }
  }, [status, exitModal, dispatch]);

  return (
    <>
      <form className={styles.sessionContainerEnd} onSubmit={handleSubmit}>
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
          <h2>End Session #{modalState.id}</h2>
        </div>
        <div className={styles.body}>
          <p>Are you sure you want to end this session?</p>
        </div>
        <div className={styles.navigateButtons}>
          <Button
            disabled={false}
            message={"Yes"}
            buttonClass={styles.yesButton}
          />
          <button
            type="button"
            onClick={() => {
              exitModal();
            }}
            className={styles.noButton}
          >
            No
          </button>
        </div>
      </form>
    </>
  );
};

export default End;
