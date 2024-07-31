"use client";

import {
  ControlledMenu,
  MenuHeader,
  useHover,
  useMenuState,
} from "@szhsin/react-menu";
import { ReactNode, useRef } from "react";

import styles from "@/styles/menus.module.scss";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { DashboardTopRowData, Venue } from "@/types";
import { formatISODateToDDMMYYYY } from "@/utils/functs";
import { TbTimelineEventExclamation } from "react-icons/tb";
import { useSelector } from "react-redux";

const SessionBreakdown = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [menuState, toggle] = useMenuState({
    transition: true,
    initialMounted: true,
  });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);
  const { topRow }: { topRow: DashboardTopRowData } = useSelector(
    (state: any) => state.dashboard
  );

  return (
    <>
      <div
        ref={tooltipRef}
        {...anchorProps}
        className={styles.sessionBreakdown}
      >
        <TbTimelineEventExclamation />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={tooltipRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.sessionBreakdownMenu}
        gap={12}
        align="end"
        arrow={false}
      >
        <MenuHeader className={styles.sessionBreakdownMenuContent}>
          <div className={styles.activeSessionsBox}>
            <span>Active</span>
            <span>{topRow.sessions.active}</span>
          </div>
          <div className={styles.pendingSessionsBox}>
            <span>Pending</span>
            <span>{topRow.sessions.pending}</span>
          </div>
          <div className={styles.closedSessionsBox}>
            <span>Closed</span>
            <span>{topRow.sessions.closed}</span>
          </div>
        </MenuHeader>
      </ControlledMenu>
    </>
  );
};

export default SessionBreakdown;
