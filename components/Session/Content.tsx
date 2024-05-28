"use client";

import {
  setIsDisabled,
  setReload,
  setSessions,
} from "@/redux/slices/sessionSlice";
import { useGetSessions } from "@/server/hooks/sessions";
import styles from "@/styles/session.module.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Body from "./Body";
import Footer from "./Footer";
import Top from "./Top";
import { useQueryClient } from "@tanstack/react-query";
import { getSessions } from "@/server/actions/sessions";

const Content = () => {
  const queryClient = useQueryClient();
  const { sessionsBox } = useSelector((state: any) => state.session);
  const dispatch = useDispatch();
  const { data, error, isFetching, isLoading, isSuccess, isPlaceholderData } =
    useGetSessions(sessionsBox.query);

  useEffect(() => {
    dispatch(setIsDisabled(isPlaceholderData || isLoading));

    if (error) {
      toast.error(error.message || "Error Fetching Sessions");
    }

    if (!isFetching) dispatch(setReload(false));
    if (isSuccess && !isFetching && !isLoading) dispatch(setSessions(data));
  }, [
    dispatch,
    setReload,
    isFetching,
    isLoading,
    isSuccess,
    setSessions,
    error,
    data,
    isPlaceholderData,
  ]);

  useEffect(() => {
    if (!isPlaceholderData && data?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: [
          "sessions",
          { ...sessionsBox.query, page: sessionsBox.query.page + 1 },
        ],
        queryFn: async () => {
          const data = await getSessions({
            ...sessionsBox.query,
            page: sessionsBox.query.page + 1,
          });
          return data.success;
        },
      });
    }
  }, [isPlaceholderData, data, sessionsBox, queryClient]);
  return (
    <>
      <main className={styles.sessionContent}>
        <Top />
        <Body />
        <Footer />
      </main>
    </>
  );
};

export default Content;
