"use client";

import { useGetReport } from "@/server/hooks/reports";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../Utils/Loader";
import styles from "@/styles/report.module.scss";
import Top from "./Top";

import { useDispatch, useSelector } from "react-redux";
import { setReport } from "@/redux/slices/reportSlice";
import Skeleton from "react-loading-skeleton";
import Statistics from "./Statistics";
import Details from "./Details";
import { useModal } from "@/utils/context";
import Modal from "../Modal/Modal";

const Report = ({ id }: { id: number }) => {
  const { data, isLoading, error } = useGetReport(id);
  const { report } = useSelector((state: any) => state.report);
  const router = useRouter();
  const dispatch = useDispatch();
  const { modalState } = useModal();

  useEffect(() => {
    if (error || data?.error) {
      console.log(error);
      toast.error(data?.error || "Could not fetch report details");
      router.replace("/reports");
    }

    if (data?.success) dispatch(setReport(data?.success));
  }, [error, data, dispatch, router]);

  return (
    <>
      {isLoading && <Loader curved={false} />}

      {modalState.mode > 0 && modalState.id > 0 && <Modal />}
      <div className={styles.reportPage}>
        {!report || report?.id !== id ? (
          <Skeleton
            baseColor="#2C2C2C"
            highlightColor="#505050"
            className={styles.reportPageTop}
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
        <div className={styles.reportPageBody}>
          {!report || report?.id !== id ? (
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
              <>
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  containerClassName={styles.skeletonSnapshot}
                  height={"100%"}
                  style={{
                    borderRadius: "0.5rem",
                    // marginTop: "0.5rem",
                    // padding: "1rem",
                  }}
                />
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  containerClassName={styles.skeletonStats}
                  height={"100%"}
                  style={{
                    borderRadius: "0.5rem",
                    // marginTop: "0.5rem",
                    // padding: "1rem",
                  }}
                />
              </>
            </>
          ) : (
            <>
              <Details />
              <Statistics />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Report;
