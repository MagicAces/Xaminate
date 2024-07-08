"use client";

import React, { ReactNode, createElement, forwardRef, useRef } from "react";
import {
  useMenuState,
  useHover,
  ControlledMenu,
  MenuHeader,
} from "@szhsin/react-menu";

import styles from "@/styles/menus.module.scss";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "@szhsin/react-menu/dist/index.css";
import { MdClear, MdFilterAlt } from "react-icons/md";
import { IoCalendarNumber } from "react-icons/io5";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  mergeReportFilters,
  updateReportControls,
  updateReportFilters,
} from "@/redux/slices/reportSlice";
import { setReload } from "@/redux/slices/reportSlice";

interface ReportTimeInputProps {
  value?: string; // value can be undefined if not provided by DatePicker
  type: string;
  onClick?: () => void; // onClick can be undefined if not provided by DatePicker
  handleClearDate: (name: string) => void;
}

const ReportTimeInput = forwardRef<HTMLDivElement, ReportTimeInputProps>(
  ({ value, onClick, handleClearDate, type }, ref) => (
    <div className={`${styles.filterReportTime}`} onClick={onClick} ref={ref}>
      {value ? (
        <span>{value}</span>
      ) : (
        <span className={styles.placeholder}>
          {type === "startTime" ? "Start Date" : "End Date"}
        </span>
      )}
      <div className={`${styles.timeIcons}`}>
        {value && (
          <MdClear
            onClick={(e) => {
              e.stopPropagation();
              handleClearDate(type);
            }}
          />
        )}
        {!value && <IoCalendarNumber />}
      </div>
    </div>
  )
);

ReportTimeInput.displayName = "ReportTimeInput";

const Filter = () => {
  const { reportsBox } = useSelector((state: any) => state.report);
  const reportFilterIconRef = useRef(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);

  const dispatch = useDispatch();

  const handleClearDate = (name: string) => {
    dispatch(updateReportFilters({ name, value: "" }));
  };

  const handleFilterReset = () => {
    if (reportsBox.filter.startTime === "" && reportsBox.filter.endTime === "")
      return;
    dispatch(setReload(true));
    dispatch(updateReportFilters({ name: "startTime", value: "" }));
    dispatch(updateReportFilters({ name: "endTime", value: "" }));
    dispatch(updateReportControls({ name: "page", value: 1 }));
    dispatch(mergeReportFilters());
  };

  const handleFilterSubmit = () => {
    dispatch(setReload(true));
    dispatch(mergeReportFilters());
    dispatch(updateReportControls({ name: "page", value: 1 }));
  };
  return (
    <>
      <div
        ref={reportFilterIconRef}
        {...anchorProps}
        className={
          menuState.state === "open"
            ? `${styles.reportFilterIcon} ${styles.reportFilterOpen}`
            : `${styles.reportFilterIcon}`
        }
      >
        <MdFilterAlt />
        <span>Filter</span>
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={reportFilterIconRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.reportFilterIconMenu}
        gap={10}
        // portal={{
        //   target: document.body,
        //   stablePosition: true,
        // }}
        align="end"
        arrow={false}
        // onItemClick={({ value }) => handleDateChange(value)}
      >
        <MenuHeader className={styles.reportFilterIconMenuHeader}>
          Timestamp
        </MenuHeader>
        <MenuHeader className={`${styles.reportFilterIconMenuFields}`}>
          <div className="from">
            <span className="from-heading">From:</span>
            <DatePicker
              selected={
                reportsBox.filter.startTime.length > 0
                  ? new Date(reportsBox.filter.startTime)
                  : null
              }
              onChange={(date: Date) => {
                dispatch(
                  updateReportFilters({
                    name: "startTime",
                    value: date?.toISOString(),
                  })
                );
              }}
              calendarClassName={styles.calendar}
              className={styles.filterReportStart}
              dayClassName={() => `${styles.day}`}
              dateFormat="dd/MM/YYYY"
              customInput={
                createElement(ReportTimeInput, {
                  handleClearDate,
                  type: "startTime",
                }) as ReactNode
              }
              withPortal
              onKeyDown={(e) => e.preventDefault()}
              fixedHeight
              tabIndex={1}
              required
            />
          </div>
          <div className="to">
            <span className="to-heading">To:</span>
            <DatePicker
              selected={
                reportsBox.filter.endTime.length > 0
                  ? new Date(reportsBox.filter.endTime)
                  : null
              }
              onChange={(date: Date) => {
                dispatch(
                  updateReportFilters({
                    name: "endTime",
                    value: date?.toISOString(),
                  })
                );
              }}
              calendarClassName={styles.calendar}
              className={styles.filterReportStart}
              dayClassName={() => `${styles.day}`}
              dateFormat="dd/MM/YYYY"
              customInput={
                createElement(ReportTimeInput, {
                  handleClearDate,
                  type: "endTime",
                }) as ReactNode
              }
              withPortal
              onKeyDown={(e) => e.preventDefault()}
              fixedHeight
              tabIndex={1}
              required
            />
          </div>
        </MenuHeader>
        <MenuHeader className={styles.reportFilterIconMenuFooter}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleFilterReset}
          >
            Reset
          </button>
          <button
            type="button"
            className={styles.applyButton}
            onClick={handleFilterSubmit}
          >
            Apply
          </button>
        </MenuHeader>
      </ControlledMenu>
    </>
  );
};

export default Filter;
