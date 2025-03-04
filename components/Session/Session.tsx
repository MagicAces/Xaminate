"use client";

import { useGetSession } from "@/server/hooks/sessions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Utils/Loader";
import styles from "@/styles/session.module.scss";
import Top from "./Top";

import { useDispatch, useSelector } from "react-redux";
import { setReload, setSession } from "@/redux/slices/sessionSlice";
import Skeleton from "react-loading-skeleton";
import Reports from "./Reports";
import Details from "./Details";
import { useModal } from "@/utils/context";
import Modal from "../Modal/Modal";
import "react-loading-skeleton/dist/skeleton.css";

const Session = ({ id }: { id: number }) => {
  const { data, isLoading, error, isFetching } = useGetSession(id);
  const { session, reload } = useSelector((state: any) => state.session);
  const router = useRouter();
  const dispatch = useDispatch();
  const { modalState } = useModal();

  useEffect(() => {
    if (error || data?.error) {
      console.log(error);
      toast.error(data?.error || "Could not fetch session details");
      router.replace("/sessions");
    }

    if (!isLoading && !isFetching) dispatch(setReload(false));

    if (data?.success) dispatch(setSession(data?.success));
  }, [error, data, dispatch, router]);

  return (
    <>
      {(reload || isLoading) && <Loader curved={false} />}

      {modalState.mode > 0 && modalState.id > 0 && <Modal />}
      <div className={styles.sessionPage}>
        {!session || session?.id !== id ? (
          <Skeleton
            baseColor="#2C2C2C"
            highlightColor="#505050"
            containerClassName={styles.sessionPageTop}
            height={30}
            style={{
              borderRadius: "0.5rem",
              marginTop: "0.5rem",
              flex: "1",
              padding: "1rem",
            }}
          />
        ) : (
          <Top />
        )}
        <div className={styles.sessionPageBody}>
          {!session || session?.id !== id ? (
            <>
              <Skeleton
                baseColor="#2C2C2C"
                highlightColor="#505050"
                containerClassName={styles.skeletonDetails}
                height={"100%"}
                style={{
                  borderRadius: "0.5rem",
                  // marginTop: "0.5rem",
                  padding: "1rem",
                }}
              />

              <Skeleton
                baseColor="#2C2C2C"
                highlightColor="#505050"
                containerClassName={styles.skeletonReports}
                height={"100%"}
                style={{
                  borderRadius: "0.5rem",
                  // marginTop: "0.5rem",
                  // padding: "1rem",
                }}
              />
            </>
          ) : (
            <>
              <Details />
              <Reports />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Session;
