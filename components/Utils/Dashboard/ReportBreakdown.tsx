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
import { TbReport, TbTimelineEventExclamation } from "react-icons/tb";
import { useSelector } from "react-redux";

const ReportBreakdown = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);
  const { topRow }: { topRow: DashboardTopRowData } = useSelector(
    (state: any) => state.dashboard
  );

  return (
    <>
      <div ref={tooltipRef} {...anchorProps} className={styles.reportBreakdown}>
        <TbReport />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={tooltipRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.reportBreakdownMenu}
        gap={12}
        align="end"
        arrow={false}
      >
        <MenuHeader className={styles.reportBreakdownMenuContent}>
          <div className={styles.approvedReportsBox}>
            <span>Approved</span>
            <span>{topRow.reports.approved}</span>
          </div>
          <div className={styles.pendingReportsBox}>
            <span>Pending</span>
            <span>{topRow.reports.pending}</span>
          </div>
          <div className={styles.rejectedReportsBox}>
            <span>Rejected</span>
            <span>{topRow.reports.rejected}</span>
          </div>
        </MenuHeader>
      </ControlledMenu>
    </>
  );
};

export default ReportBreakdown;
