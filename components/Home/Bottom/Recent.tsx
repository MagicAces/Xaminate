"use client";

import RecentScrollbars from "@/components/Utils/Dashboard/RecentScrollbars";
import ReportScrollbars from "@/components/Utils/Reports/ReportScrollbars";
import {
  setCategory,
  setRecentItems,
  setReload,
} from "@/redux/slices/dashboardSlice";
import { useGetRecentItems } from "@/server/hooks/dashboard";
import styles from "@/styles/home.module.scss";
import { DashboardState, ReportRecent, SessionRecent } from "@/types";
import { capitalize } from "lodash";
import { useEffect } from "react";
import { MdLocationOn, MdSwitchLeft, MdSwitchRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import nodata from "@/public/images/nodata.svg";
import Image from "next/image";
import {
  TbClockStop,
  TbReport,
  TbTimelineEventExclamation,
} from "react-icons/tb";
import { formatDuration, formatSorRDate } from "@/utils/functs";
import { PiStudentFill } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { BiTime } from "react-icons/bi";
import Loader from "@/components/Utils/Loader";

const Recent = () => {
  const { category, recentItems, reload }: DashboardState = useSelector(
    (state: any) => state.dashboard
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    data: recentItemsData,
    isLoading: recentItemsLoading,
    isFetching: recentItemsFetching,
    error: recentItemsError,
  } = useGetRecentItems(category);

  useEffect(() => {
    if (
      recentItemsError ||
      typeof recentItemsData === "string" ||
      typeof recentItemsData === "undefined"
    ) {
      console.error(recentItemsError?.message || recentItemsData);
    }

    if (!recentItemsFetching && !recentItemsLoading) {
      dispatch(setReload({ name: "recentItems", value: false }));
    }

    if (
      !recentItemsLoading &&
      recentItemsData &&
      typeof recentItemsData !== "string" &&
      typeof recentItemsData !== "undefined"
    ) {
      dispatch(
        setRecentItems(
          category === "session"
            ? recentItemsData.sessions || []
            : recentItemsData.reports || []
        )
      );
    }
  }, [
    recentItemsError,
    recentItemsData,
    recentItemsFetching,
    dispatch,
    category,
  ]);

  return (
    <>
      <div className={styles.homeContentBottomRecent}>
        {(reload.recentItems || recentItemsLoading) && <Loader curved={true} />}
        <div className={styles.homeContentBottomRecentHeader}>
          <span>Recent {capitalize(category)}s</span>
          <span
            onClick={() => {
              dispatch(
                setCategory(category === "session" ? "report" : "session")
              );
              dispatch(setReload({ name: "recentItems", value: true }));
            }}
          >
            {category === "session" ? <MdSwitchLeft /> : <MdSwitchRight />}
          </span>
        </div>
        <RecentScrollbars
          className={styles.bodyContainer}
          autoHeight={true}
          autoHeightMin={180}
          autoHeightMax={250}
          autoHide={false}
          autoHideTimeout={1000}
        >
          <div className={styles.recentRows}>
            {recentItems.length > 0 ? (
              recentItems.map((item: any, index: number) => {
                router.prefetch(`/${category}s/${item.id}`);
                return (
                  <div
                    key={index}
                    className={styles.recentRowOuter}
                    onClick={() => router.push(`/${category}s/${item.id}`)}
                  >
                    <div className={styles.iconBadge}>
                      {category === "session" ? (
                        <TbTimelineEventExclamation />
                      ) : (
                        <TbReport />
                      )}
                    </div>
                    <div className={styles.textRegion}>
                      <div className={styles.textRegionTop}>
                        <span>
                          {capitalize(category)} #{item.id}
                        </span>
                        <span className={styles[item.status?.toLowerCase()]}>
                          {capitalize(item.status)}
                        </span>
                      </div>
                      {category === "session" ? (
                        <div className={styles.textRegionBottom}>
                          <span>
                            <MdLocationOn />
                            <span>{item?.venue_name}</span>
                          </span>
                          <span>
                            <BiTime />
                            <span>
                              {formatDuration(
                                new Date(item.start_time as string),
                                new Date(item.end_time as string)
                              )}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className={styles.textRegionBottom}>
                          <span>
                            <PiStudentFill />
                            <span>{item?.student_index_no}</span>
                          </span>
                          <span>
                            <TbClockStop />
                            <span>{formatSorRDate(item?.timestamp)}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.noRecentData}>
                <Image src={nodata} alt="🫙" height={50} width={50} />
                <p>No recent data</p>
              </div>
            )}
          </div>
        </RecentScrollbars>
      </div>
    </>
  );
};

export default Recent;
