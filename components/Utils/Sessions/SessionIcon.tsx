import React, { ReactNode, useRef, useEffect } from "react";
import {
  MenuItem,
  useMenuState,
  useHover,
  ControlledMenu,
} from "@szhsin/react-menu";

import styles from "@/styles/menus.module.scss";
import "@szhsin/react-menu/dist/transitions/slide.css";
import "@szhsin/react-menu/dist/index.css";

import { FaEllipsis } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";
import { GiExitDoor } from "react-icons/gi";
import { MdPinEnd } from "react-icons/md";
import { useRouter } from "next/navigation";

const SessionIcon = ({
  id,
  status,
  openModal,
}: {
  id: number;
  status: string;
  openModal: (type: string) => void;
}) => {
  const router = useRouter();

  const sessionIconRef = useRef(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);

  useEffect(() => {
    router.prefetch(`/sessions/${id}`);
  }, []);

  return (
    <>
      <div
        ref={sessionIconRef}
        {...anchorProps}
        className={
          menuState.state === "open"
            ? `${styles.sessionIcon} ${styles.sessionOpen}`
            : `${styles.sessionIcon}`
        }
      >
        <FaEllipsis />
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={sessionIconRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.sessionIconMenu}
        gap={10}
        portal={{
          target: document.body,
          stablePosition: true,
        }}
        align="end"
        arrow={false}
        // onItemClick={({ value }) => handleDateChange(value)}
      >
        <MenuItem
          className={`${styles.sessionIconEdit} ${styles.sessionIconItem}`}
          onClick={() => openModal("edit")}
        >
          <FaRegEdit />
          <span>Edit Session</span>
        </MenuItem>

        <MenuItem
          className={`${styles.sessionIconView} ${styles.sessionIconItem}`}
          onClick={() => router.push(`/sessions/${id}`)}
        >
          <IoIosEye />
          <span>View Session</span>
        </MenuItem>

        {status === "active" && (
          <MenuItem
            className={`${styles.sessionIconEnd} ${styles.sessionIconItem}`}
            onClick={() => openModal("end")}
          >
            <MdPinEnd />
            <span>End Session</span>
          </MenuItem>
        )}
        {status === "pending" && (
          <MenuItem
            className={`${styles.sessionIconExit} ${styles.sessionIconItem}`}
            onClick={() => openModal("end")}
          >
            <GiExitDoor />
            <span>Exit Session</span>
          </MenuItem>
        )}
      </ControlledMenu>
    </>
  );
};

export default SessionIcon;
