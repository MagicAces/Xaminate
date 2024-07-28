"use client";

import styles from "@/styles/home.module.scss";
import Report from "./Bottom/Report";
import Recent from "./Bottom/Recent";

const Bottom = () => {
  return (
    <>
      <div className={styles.homeContentBottom}>
        <Report />
        <Recent />
      </div>
    </>
  );
};

export default Bottom;
