"use client";

import {
  setIsDisabled,
  setReload,
  setReports,
} from "@/redux/slices/reportSlice";
import { useGetReports, useGetTestReports } from "@/server/hooks/reports";
import styles from "@/styles/report.module.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Body from "./Body";
import Footer from "./Footer";
import Top from "./Top";
import Loader from "../Utils/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { getReportsTest } from "@/server/actions/reports";
import Filters from "./Filters";
import { setReload as modalReload } from "@/redux/slices/modalSlice";
import { useModal } from "@/utils/context";

const Content = () => {
  const queryClient = useQueryClient();
  const { reportsBox, reload, isDisabled } = useSelector(
    (state: any) => state.report
  );
  const { reload: modalLoad } = useSelector((state: any) => state.modal);

  const dispatch = useDispatch();
  const { data, error, isFetching, isLoading, isSuccess, isPlaceholderData } =
    useGetTestReports({ query: reportsBox.query, status: reportsBox.status });

  useEffect(() => {
    dispatch(setIsDisabled(isPlaceholderData || isLoading));

    if (error) {
      toast.error(error.message || "Error Fetching Reports", { toastId: "E1" });
    }

    if (!isFetching) dispatch(setReload(false));
    if (isSuccess && !isFetching && !isLoading) dispatch(setReports(data));
  }, [
    dispatch,
    isFetching,
    isLoading,
    isSuccess,
    error,
    data,
    isPlaceholderData,
  ]);

  useEffect(() => {
    if (!isPlaceholderData && data?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: [
          "reports",
          {
            ...reportsBox.query,
            page: reportsBox.query.page + 1,
            status: reportsBox.status,
          },
        ],
        queryFn: async () => {
          const data = await getReportsTest({
            ...reportsBox.query,
            page: reportsBox.query.page + 1,
            status: reportsBox.status,
          });
          return data.success;
        },
      });
    }

    if (!isPlaceholderData && data?.hasPrevPage) {
      queryClient.prefetchQuery({
        queryKey: [
          "reports",
          {
            ...reportsBox.query,
            page: reportsBox.query.page - 1,
            status: reportsBox.status,
          },
        ],
        queryFn: async () => {
          const data = await getReportsTest({
            ...reportsBox.query,
            page: reportsBox.query.page - 1,

            status: reportsBox.status,
          });
          return data.success;
        },
      });
    }
  }, [isPlaceholderData, data, reportsBox, queryClient]);

  useEffect(() => {
    dispatch(modalReload(false));
  }, []);

  return (
    <>
      <main className={styles.reportContent}>
        {(modalLoad || reload || isDisabled) && <Loader curved={false} />}
        <Top />
        <Filters />
        <Body />
        <Footer />
      </main>
    </>
  );
};

export default Content;
