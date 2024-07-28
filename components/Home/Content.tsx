"use client";
import styles from "@/styles/home.module.scss";
import Top from "./Top";
import Middle from "./Middle";
import Bottom from "./Bottom";
import "react-loading-skeleton/dist/skeleton.css";

const Content = () => {
  return (
    <>
      <main className={styles.homeContent}>
        <Top />
        <Middle />
        <Bottom />
      </main>
    </>
  );
};

export default Content;
