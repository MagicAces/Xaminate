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
import { GiCctvCamera } from "react-icons/gi";
import { useSelector } from "react-redux";

const CameraBreakdown = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);
  const { topRow }: { topRow: DashboardTopRowData } = useSelector(
    (state: any) => state.dashboard
  );

  return (
    <>
      <div ref={tooltipRef} {...anchorProps} className={styles.cameraBreakdown}>
        <GiCctvCamera />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={tooltipRef}
        // onClose={() => toggle(false)}
        transition
        menuClassName={styles.cameraBreakdownMenu}
        gap={12}
        align="end"
        arrow={false}
      >
        <MenuHeader className={styles.cameraBreakdownMenuContent}>
          <div className={styles.activeCamerasBox}>
            <span>Active</span>
            <span>{topRow.cameras.active}</span>
          </div>
          <div className={styles.inactiveCamerasBox}>
            <span>Inactive</span>
            <span>{topRow.cameras.inactive}</span>
          </div>
          <div className={styles.maintenanceCamerasBox}>
            <span>Maintenance</span>
            <span>{topRow.cameras.maintenance}</span>
          </div>
        </MenuHeader>
      </ControlledMenu>
    </>
  );
};

export default CameraBreakdown;
