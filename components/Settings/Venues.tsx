"use client";

import styles from "@/styles/setting.module.scss";
import { useState } from "react";
import { IoLocation } from "react-icons/io5";
import { MdCancel, MdEdit } from "react-icons/md";
import View from "./Venues/View";
import Edit from "./Venues/Edit";

const Venues = () => {
  const [mode, setMode] = useState("view");

  return (
    <>
      <div className={styles.settingContentVenue}>
        <div className={styles.settingContentVenueHeader}>
          <div className={styles.settingContentVenueHeaderLeft}>
            <IoLocation />
            <span>Venues</span>
          </div>
          {mode === "view" ? (
            <div
              className={styles.settingContentVenueHeaderRight}
              onClick={() => setMode("edit")}
            >
              <MdEdit />
              <span>Edit</span>
            </div>
          ) : (
            <div
              className={styles.settingContentVenueHeaderRight}
              onClick={() => setMode("view")}
            >
              <MdCancel />
              <span>Cancel</span>
            </div>
          )}
        </div>
        {mode === "view" ? <View /> : <Edit setMode={setMode} />}
      </div>
    </>
  );
};

export default Venues;
