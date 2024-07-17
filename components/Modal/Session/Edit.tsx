"use client";
import { useEffect, useState } from "react";
import styles from "@/styles/modal.module.scss";
import { MdClose } from "react-icons/md";
import { useModal } from "@/utils/context";
import { SessionInput } from "@/lib/schema";
import { SessionEdit, SessionWarn } from "@/types";
import { toast } from "react-toastify";
import Loader from "@/components/Utils/Loader";
import Page1 from "./Edit/Page1";
import Page2 from "./Edit/Page2";
import { useGetSessionForEdit } from "@/server/hooks/sessions";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, setReload, setSession } from "@/redux/slices/modalSlice";
import { editSession } from "@/server/actions/sessions";
import { useAction } from "next-safe-action/hooks";
import { isEqual } from "lodash";

const Edit = () => {
  const [page, setPage] = useState(1);
  const { exitModal, modalState } = useModal();
  const dispatch = useDispatch();
  const { reload, session } = useSelector((state: any) => state.modal);
  const { data, isLoading, error } = useGetSessionForEdit(modalState.id);
  const [sessionValue, setSessionValue] = useState<SessionEdit>({ ...session });

  useEffect(() => {
    if (error || data?.error) {
      console.log(error);
      toast.error(data?.error || "Could not fetch session details", {
        toastId: "E5",
      });
      exitModal();
      dispatch(closeModal());
    }

    if (!isLoading && data?.success) {
      dispatch(setReload(false));
      dispatch(setSession(data?.success));
      setSessionValue(data?.success);
    }
  }, [error, data, dispatch]);

  const { execute, status, result } = useAction(editSession, {
    onSuccess: (data: any) => {
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
    if (isEqual(session, sessionValue)) {
      exitModal();
      dispatch(closeModal());
      toast.info("No Changes Made");
      return;
    }

    const { sessionStart, sessionEnd, comments, venue, ...otherVal } =
      sessionValue;
    execute({
      ...otherVal,
      sessionStart: new Date(sessionStart),
      sessionEnd: new Date(sessionEnd),
      venue: venue.id,
      comments: comments ?? undefined,
    });
  };

  useEffect(() => {
    if (status === "hasSucceeded" && result?.data?.success) {
      exitModal();
      dispatch(closeModal());
    }
  }, [status, exitModal, dispatch]);

  return (
    <>
      <form className={styles.sessionContainerEdit} onSubmit={handleSubmit}>
        {(reload || status === "executing") && <Loader />}
        {status !== "executing" && (
          <span className={styles.closeIcon}>
            <MdClose
              onClick={() => {
                exitModal();
                dispatch(closeModal());
              }}
            />
          </span>
        )}
        <div className={styles.header}>
          <h2>Edit Session #{modalState.id}</h2>
        </div>
        {page === 1 && (
          <Page1
            session={sessionValue}
            setSessionVal={setSessionValue}
            setPage={setPage}
          />
        )}
        {page === 2 && (
          <Page2
            session={sessionValue}
            setSessionVal={setSessionValue}
            setPage={setPage}
            disabled={status === "executing"}
          />
        )}
      </form>
    </>
  );
};

export default Edit;
