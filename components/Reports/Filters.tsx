//@ts-nocheck
"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/report.module.scss";
import { ReportDisplay, ReportSlice } from "@/types";
import { MdClose } from "react-icons/md";
import { capitalize } from "lodash";
import { formatISODateToDDMMYYYY } from "@/utils/functs";
import {
  mergeReportFilters,
  setReload,
  updateReportControls,
  updateReportFilters,
} from "@/redux/slices/reportSlice";

const Filters = () => {
  const { reportsBox, data }: ReportSlice = useSelector(
    (state: any) => state.report
  );
  const dispatch = useDispatch();

  const handleClose = (name: string) => {
    dispatch(updateReportFilters({ name, value: "" }));
    dispatch(mergeReportFilters());
    dispatch(updateReportControls({ name: "page", value: 1 }));
    dispatch(setReload(true));
  };

  return (
    <>
      <div className={styles.reportFilterValues}>
        {/* <span>Filters:</span> */}
        {(reportsBox.query.startTime !== "" ||
          reportsBox.query.endTime !== "" ||
          reportsBox.query.search !== "") &&
          data?.pendingCount !== null &&
          data?.totalCount !== null &&
          data && (
            <span className={styles.filterText}>
              Found {data?.totalCount} out of{" "}
              {data[`${reportsBox.status.toLowerCase()}Count`]}{" "}
              {reportsBox.status.toLowerCase()} reports:
            </span>
          )}

        {reportsBox.query.startTime !== "" && (
          <div className={styles.filterValue}>
            <span className={styles.filterLighten}>Start:</span>
            <span>{formatISODateToDDMMYYYY(reportsBox.query.startTime)}</span>
            <MdClose onClick={() => handleClose("startTime")} />
          </div>
        )}
        {reportsBox.query.endTime !== "" && (
          <div className={styles.filterValue}>
            <span className={styles.filterLighten}>End:</span>
            <span>{formatISODateToDDMMYYYY(reportsBox.query.endTime)}</span>
            <MdClose onClick={() => handleClose("endTime")} />
          </div>
        )}
      </div>
    </>
  );
};

export default Filters;
