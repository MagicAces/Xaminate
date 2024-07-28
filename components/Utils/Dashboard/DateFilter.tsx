// ts-ignore
// ts-nocheck
"use client";

import {
  ClickEvent,
  ControlledMenu,
  EventHandler,
  MenuHeader,
  MenuItem,
  useHover,
  useMenuState,
} from "@szhsin/react-menu";
import { ReactNode, useRef } from "react";

import styles from "@/styles/menus.module.scss";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { DashboardState, DashboardTopRowData, Venue } from "@/types";
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import { TbReport, TbTimelineEventExclamation } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setDateFilter, setReload } from "@/redux/slices/dashboardSlice";

const DateFilter = ({ category }: { category: "venue" | "report" }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);
  const { dateFilter }: DashboardState = useSelector(
    (state: any) => state.dashboard
  );
  const dispatch = useDispatch();

  const handleClick = (e: ClickEvent) => {
    if (e.value === dateFilter[category]) return;
    dispatch(setDateFilter({ name: category, value: e.value }));
    dispatch(setReload({ name: `${category}Stats`, value: true }));
  };

  return (
    <>
      <div ref={tooltipRef} {...anchorProps} className={styles.dateFilter}>
        <HiMiniEllipsisVertical />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={tooltipRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.dateFilterMenu}
        gap={12}
        align="end"
        arrow={false}
      >
        <MenuItem
          className={`${
            dateFilter[category] === "Today"
              ? styles.dateFilterMenuItemActive
              : ""
          } 
              ${styles.dateFilterMenuItem}`}
          value="Today"
          onClick={handleClick}
        >
          <span>Today</span>
        </MenuItem>
        <MenuItem
          className={`${
            dateFilter[category] === "This Week"
              ? styles.dateFilterMenuItemActive
              : ""
          } 
              ${styles.dateFilterMenuItem}`}
          value="This Week"
          onClick={handleClick}
        >
          <span>This Week</span>
        </MenuItem>
        <MenuItem
          className={`${
            dateFilter[category] === "This Month"
              ? styles.dateFilterMenuItemActive
              : ""
          } 
              ${styles.dateFilterMenuItem}`}
          value="This Month"
          onClick={handleClick}
        >
          <span>This Month</span>
        </MenuItem>
        <MenuItem
          className={`${
            dateFilter[category] === "This Year"
              ? styles.dateFilterMenuItemActive
              : ""
          } 
              ${styles.dateFilterMenuItem}`}
          value="This Year"
          onClick={handleClick}
        >
          <span>This Year</span>
        </MenuItem>
        <MenuItem
          className={`${
            dateFilter[category] === "All Time"
              ? styles.dateFilterMenuItemActive
              : ""
          } 
              ${styles.dateFilterMenuItem}`}
          value="All Time"
          onClick={handleClick}
        >
          <span>All Time</span>
        </MenuItem>
      </ControlledMenu>
    </>
  );
};

export default DateFilter;
