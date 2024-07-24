"use client";

import styles from "@/styles/setting.module.scss";
import { useSelector } from "react-redux";
import Loader from "../Utils/Loader";
import Alerts from "./Alerts";
import Venues from "./Venues";
import Cameras from "./Cameras";

const Content = () => {
  const { reload } = useSelector((state: any) => state.setting);

  return (
    <>
      <main className={styles.settingContent}>
        {reload && <Loader curved={false} />}
        <Venues />
        <Alerts />
        <Cameras />
      </main>
    </>
  );
};

export default Content;
