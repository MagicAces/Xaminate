"use client";

import logo from "@/public/images/logo.svg";
import styles from "@/styles/success.module.scss";
import Image from "next/image";
import { FaRegCircleCheck } from "react-icons/fa6";
import Footer from "./Footer";

const Success = () => {
  return (
    <>
      <div className={styles.successContainer}>
        <div className={styles.textContainer}>
          <div className={styles.topContainer}>
            <Image
              src={logo}
              alt="logo.svg"
              className={styles.logoImage}
              width={80}
              height={80}
            />
            <h2>Successful Reset</h2>
          </div>
          <span>
            <FaRegCircleCheck />
            <span>
              Your password has been reset. Log in to your account with your new
              password
            </span>
          </span>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Success;
