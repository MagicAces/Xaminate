"use client";

import { useGetSession } from "@/server/hooks/sessions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Utils/Loader";
import styles from "@/styles/session.module.scss";
import Top from "./Top";

import { useDispatch, useSelector } from "react-redux";
import { setSession } from "@/redux/slices/sessionSlice";
import Skeleton from "react-loading-skeleton";
import Reports from "./Reports";
import Details from "./Details";

const Session = ({ id }: { id: number }) => {
  const { data, isLoading, error } = useGetSession(id);
  const { session } = useSelector((state: any) => state.session);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error || data?.error) {
      console.log(error);
      toast.error(data?.error || "Could not fetch session details");
      router.replace("/sessions");
    }

    if (data?.success) dispatch(setSession(data?.success));
  }, [error, data, dispatch, router]);

  return (
    <>
      {isLoading && <Loader curved={false} />}
      <div className={styles.sessionPage}>
        {!session ? (
          <Skeleton
            baseColor="#2C2C2C"
            highlightColor="#505050"
            className={styles.sessionPageTop}
            height={20}
            style={{
              borderRadius: "0.5rem",
              marginTop: "0.5rem",
              padding: "1rem",
            }}
          />
        ) : (
          <Top />
        )}
        <div className={styles.sessionPageBody}>
          {!session ? (
            <>
              <div className={styles.sessionDetails}>
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  className={styles.sessionDetailsTop}
                  width={50}
                  height={20}
                  style={{
                    borderRadius: "0.5rem",
                    // marginTop: "0.5rem",
                    padding: "1rem",
                  }}
                />
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  className={styles.sessionDetailsBody}
                  style={{
                    borderRadius: "0.5rem",
                    // marginTop: "0.5rem",
                    // padding: "1rem",
                  }}
                />
              </div>
              <div className={styles.sessionReports}>
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  className={styles.sessionReportsTop}
                  width={50}
                  height={20}
                  style={{
                    borderRadius: "0.5rem",
                    // marginTop: "0.5rem",
                    padding: "1rem",
                  }}
                />
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  className={styles.sessionReportsBody}
                  style={{
                    borderRadius: "0.5rem",
                    // marginTop: "0.5rem",
                    // padding: "1rem",
                  }}
                />
              </div>
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
