import {
  ControlledMenu,
  MenuHeader,
  useHover,
  useMenuState,
} from "@szhsin/react-menu";
import { ReactNode, useRef } from "react";
import { BsInfoCircleFill } from "react-icons/bs";

import styles from "@/styles/menus.module.scss";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Camera } from "@/types";
import { formatISODateToDDMMYYYY } from "@/utils/functs";

const CameraTooltip = ({ camera }: { camera: Camera }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);

  return (
    <>
      <div ref={tooltipRef} {...anchorProps} className={styles.cameraTooltip}>
        <BsInfoCircleFill />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={tooltipRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.cameraTooltipMenu}
        gap={10}
        align="start"
        portal={{
          target: document.body,
          stablePosition: true,
        }}
        direction="top"
        position="anchor"
        arrow={false}
      >
        <MenuHeader className={styles.cameraTooltipMenuContent}>
          <div className={styles.createdOnBox}>
            <span>Added on</span>
            <span>{formatISODateToDDMMYYYY(camera.created_on)}</span>
          </div>
          <div className={styles.updatedAtBox}>
            <span>Last updated</span>
            <span>{formatISODateToDDMMYYYY(camera.updated_at)}</span>
          </div>
          <div className={styles.bookingsBox}>
            <span>Total Reports Captured</span>
            <span>{camera.reportCount}</span>
          </div>
        </MenuHeader>
      </ControlledMenu>
    </>
  );
};

export default CameraTooltip;
