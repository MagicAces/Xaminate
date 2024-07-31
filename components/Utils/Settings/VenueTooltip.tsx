"use client";

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
import { Venue } from "@/types";
import { formatISODateToDDMMYYYY } from "@/utils/functs";

const VenueTooltip = ({ venue }: { venue: Venue }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);

  return (
    <>
      <div ref={tooltipRef} {...anchorProps} className={styles.venueTooltip}>
        <BsInfoCircleFill />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={tooltipRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.venueTooltipMenu}
        gap={12}
        align="end"
        arrow={false}
      >
        <MenuHeader className={styles.venueTooltipMenuContent}>
          <div className={styles.createdOnBox}>
            <span>Added on</span>
            <span>{formatISODateToDDMMYYYY(venue.created_on)}</span>
          </div>
          <div className={styles.updatedAtBox}>
            <span>Last updated</span>
            <span>{formatISODateToDDMMYYYY(venue.updated_at)}</span>
          </div>
          <div className={styles.bookingsBox}>
            <span>Active bookings</span>
            <span>{venue.bookings.length}</span>
          </div>
        </MenuHeader>
      </ControlledMenu>
    </>
  );
};

export default VenueTooltip;
