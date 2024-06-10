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
        {!session || session?.id !== id ? (
          <Skeleton
            baseColor="#2C2C2C"
            highlightColor="#505050"
            className={styles.sessionPageTop}
            height={30}
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
