"use client";

import styles from "@/styles/setting.module.scss";
import { useState } from "react";
import { GiCctvCamera } from "react-icons/gi";
import { MdCancel, MdEdit } from "react-icons/md";
import View from "./Cameras/View";
import Edit from "./Cameras/Edit";

const Cameras = () => {
  const [mode, setMode] = useState("view");

  return (
    <>
      <div className={styles.settingContentCamera}>
        <div className={styles.settingContentCameraHeader}>
          <div className={styles.settingContentCameraHeaderLeft}>
            <GiCctvCamera />
            <span>Cameras</span>
          </div>
          {mode === "view" ? (
            <div
              className={styles.settingContentCameraHeaderRight}
              onClick={() => setMode("edit")}
            >
              <MdEdit />
              <span>Edit</span>
            </div>
          ) : (
            <div
              className={styles.settingContentCameraHeaderRight}
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

export default Cameras;
