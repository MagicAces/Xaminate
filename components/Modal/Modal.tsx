"use client";

import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";
import Notification from "./Notification/Notification";
import Profile from "./Profile/Profile";
import Session from "./Session/Session";

const Modal = () => {
  const { modalState, exitModal } = useModal();

  return (
    <>
      <div className={styles.modalContainer} onClick={exitModal}>
        {modalState.type === "profile" && <Profile />}
        {modalState.type === "notification" && <Notification />}
        {modalState.type === "session" && <Session />}
      </div>
    </>
  );
};

export default Modal;
