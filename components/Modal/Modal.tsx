"use client";

import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";
import Notification from "./Notification";
import Profile from "./Profile";

const Modal = () => {
  const { modalState, exitModal } = useModal();

  return (
    <>
      <div className={styles.modalContainer} onClick={exitModal}>
        {modalState.type === "profile" && <Profile />}
        {modalState.type === "notification" && <Notification />}
      </div>
    </>
  );
};

export default Modal;
