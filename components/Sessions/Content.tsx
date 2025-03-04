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
import Loader from "../Utils/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { getSessions } from "@/server/actions/sessions";
import Filters from "./Filters";

const Content = () => {
  const queryClient = useQueryClient();
  const { sessionsBox, reload, isDisabled } = useSelector(
    (state: any) => state.session
  );

  const dispatch = useDispatch();
  const { data, error, isFetching, isLoading, isSuccess, isPlaceholderData } =
    useGetSessions(sessionsBox.query);

  useEffect(() => {
    dispatch(setIsDisabled(isPlaceholderData || isLoading));

    if (!isFetching && !isLoading) dispatch(setReload(false));
    if (error) {
      toast.error(error.message || "Error Fetching Sessions", {
        toastId: "E2",
      });
    }

    if (!isFetching && !isLoading) dispatch(setReload(false));
    if (isSuccess && !isFetching && !isLoading) dispatch(setSessions(data));
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

    if (!isPlaceholderData && data?.hasPrevPage) {
      queryClient.prefetchQuery({
        queryKey: [
          "sessions",
          { ...sessionsBox.query, page: sessionsBox.query.page - 1 },
        ],
        queryFn: async () => {
          const data = await getSessions({
            ...sessionsBox.query,
            page: sessionsBox.query.page - 1,
          });
          return data.success;
        },
      });
    }
  }, [isPlaceholderData, data, sessionsBox, queryClient]);

  const isFilterEmpty = () => {
    if (sessionsBox.query.venue > 0) return false;
    if (sessionsBox.query.status !== "") return false;
    if (sessionsBox.query.startTime !== "") return false;
    if (sessionsBox.query.endTime !== "") return false;

    return true;
  };

  return (
    <>
      <main className={styles.sessionContent}>
        {(reload || isDisabled) && <Loader curved={false} />}
        <Top />
        {!isFilterEmpty() && <Filters />}
        <Body />
        <Footer />
      </main>
    </>
  );
};

export default Content;
