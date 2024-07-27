"use client";

import styles from "@/styles/home.module.scss";
import Venue from "./Middle/Venue";
import Report from "./Middle/Report";

const Middle = () => {
  return (
    <>
      <div className={styles.homeContentMiddle}>
        <Venue />
        <Report />
      </div>
    </>
  );
};

export default Middle;
