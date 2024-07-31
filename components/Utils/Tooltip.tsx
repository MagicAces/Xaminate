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

const Tooltip = ({ children }: { children: ReactNode }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);

  return (
    <>
      <div ref={tooltipRef} {...anchorProps} className={styles.tooltip}>
        <BsInfoCircleFill />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={tooltipRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.tooltipMenu}
        gap={12}
        align="center"
        arrow={false}
      >
        <MenuHeader className={styles.tooltipMenuContent}>
          {children}
        </MenuHeader>
      </ControlledMenu>
    </>
  );
};

export default Tooltip;
