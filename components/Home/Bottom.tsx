"use client";

import styles from "@/styles/home.module.scss";
import Report from "./Bottom/Report";

const Bottom = () => {
  return (
    <>
      <div className={styles.homeContentBottom}>
        <Report />
      </div>
    </>
  );
};

export default Bottom;
