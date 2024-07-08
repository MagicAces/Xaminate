"use client";
import { setReload } from "@/redux/slices/modalSlice";
import styles from "@/styles/home.module.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Content = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setReload(false));
  }, []);

  return (
    <>
      <main className={styles.homeBody}></main>
    </>
  );
};

export default Content;
