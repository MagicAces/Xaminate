"use client";

import { BiReset } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/report.module.scss";
import { MdCircle, MdClear, MdSearch } from "react-icons/md";
import {
  clearReportsBox,
  mergeReportSearch,
  setReload,
  // setReports,
  setStatus,
  updateReportControls,
  updateReportSearch,
} from "@/redux/slices/reportSlice";
import { ReportSlice } from "@/types";
import Skeleton from "react-loading-skeleton";
import Filter from "../Utils/Reports/Filter";
import Sort from "../Utils/Reports/Sort";

const Top = () => {
  const dispatch = useDispatch();
  const { reportsBox, data, reload, isDisabled }: ReportSlice = useSelector(
    (state: any) => state.report
  );

  const handleReset = () => {
    dispatch(setReload(true));
    // dispatch(setReports(undefined))
    dispatch(clearReportsBox());
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setReload(true));
    dispatch(mergeReportSearch());
    dispatch(updateReportControls({ name: "page", value: 1 }));
  };

  const handleSearchClear = () => {
    if (reportsBox.search.length === 0) return;
    dispatch(setReload(true));
    dispatch(updateReportSearch(""));
    dispatch(mergeReportSearch());
    dispatch(updateReportControls({ name: "page", value: 1 }));
  };

  // console.log(data?.reports);

  return (
    <>
      <div
        className={styles.reportContentTop}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.reportContentTopStatuses}>
          <div className={styles.statuses}>
            <div
              className={`${styles.pendingStatus} ${
                reportsBox.status === "Pending" ? styles.activeStatus : ""
              }`}
              onClick={() => {
                dispatch(setStatus("Pending"));
                dispatch(updateReportControls({ name: "page", value: 1 }));
              }}
            >
              <div className={styles.pendingText}>
                <MdCircle />
                <span>Pending</span>
              </div>
              {data ? (
                <span className={styles.pendingCount}>
                  {data?.pendingCount}
                </span>
              ) : (
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  width={15}
                  height={15}
                  enableAnimation={true}
                  style={{ borderRadius: "0.5rem" }}
                />
              )}
            </div>
            <div
              className={`${styles.approvedStatus} ${
                reportsBox.status === "Approved" ? styles.activeStatus : ""
              }`}
              onClick={() => {
                dispatch(setStatus("Approved"));
                dispatch(updateReportControls({ name: "page", value: 1 }));
              }}
            >
              <div className={styles.approvedText}>
                <MdCircle />
                <span>Approved</span>
              </div>
              {data ? (
                <span className={styles.approvedCount}>
                  {data?.approvedCount}
                </span>
              ) : (
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  width={15}
                  height={15}
                  enableAnimation={true}
                  style={{ borderRadius: "0.5rem" }}
                />
              )}
            </div>
            <div
              className={`${styles.rejectedStatus} ${
                reportsBox.status === "Rejected" ? styles.activeStatus : ""
              }`}
              onClick={() => {
                dispatch(setStatus("Rejected"));
                dispatch(updateReportControls({ name: "page", value: 1 }));
              }}
            >
              <div className={styles.rejectedText}>
                <MdCircle />
                <span>Rejected</span>
              </div>
              {data ? (
                <span className={styles.rejectedCount}>
                  {data?.rejectedCount}
                </span>
              ) : (
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  width={15}
                  height={15}
                  enableAnimation={true}
                  style={{ borderRadius: "0.5rem" }}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.reportContentTopActions}>
          <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
            <MdSearch />
            <input
              type="text"
              name="search"
              value={reportsBox.search}
              placeholder={"Search..."}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(updateReportSearch(e.target.value))
              }
              disabled={reload || isDisabled}
            />
            {reportsBox.search && <MdClear onClick={handleSearchClear} />}
          </form>
          <div className={styles.filterAndSort}>
            <div
              role="button"
              title="Clear filters"
              className={styles.clearFilterButton}
              style={{
                visibility: reportsBox.mode === "query" ? "visible" : "hidden",
              }}
              onClick={handleReset}
            >
              <BiReset />
            </div>
            <Filter />
            <Sort />
          </div>
        </div>
      </div>
    </>
  );
};

export default Top;
