"use client";

import logo from "@/public/images/logo.svg";
import { setEmail, setIds, setSection } from "@/redux/slices/resetSlice";
import { sendOTP } from "@/server/actions/reset";
import styles from "@/styles/email.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { MdClose, MdInfoOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../Utils/Button";
import Loader from "../Utils/Loader";
import Footer from "./Footer";

const Email = () => {
  const [error, setError] = useState("");
  const { email } = useSelector((state: any) => state.reset);
  const dispatch = useDispatch();

  const { execute, status } = useAction(sendOTP, {
    onSuccess(data) {
      if (data?.error) {
        toast.error(data.error);
        setError(data.error);
        data.section === 1 && dispatch(setEmail(""));
      }
      if (data?.success) {
        toast.success(data?.success);
        dispatch(setIds({ ...data.ids }));
        dispatch(setSection(2));
      }
    },
    onError(error) {
      console.log(error);
      if (error.serverError) toast.error("Server Error");
      if (error.fetchError) toast.error("Something wrong occurred");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    execute({ email });
  };

  return (
    <>
      <div className={styles.emailContainer}>
        {status === "executing" && <Loader />}
        <div className={styles.textContainer}>
          <div className={styles.topContainer}>
            <Image
              src={logo}
              alt="logo.svg"
              className={styles.logoImage}
              width={80}
              height={80}
            />
            <h2>Forgot Password</h2>
          </div>
          <span>
            Enter the email associated with your account so we can send you
            reset instructions
          </span>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 1 }}
              className={styles.errorBox}
            >
              <span>
                <MdInfoOutline />
                <span>{error}</span>
              </span>
              <MdClose onClick={() => setError("")} />
            </motion.div>
          )}
        </AnimatePresence>
        <form className={styles.emailForm} onSubmit={handleSubmit}>
          <div className={styles.emailBox}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              onChange={(e) => dispatch(setEmail(e.target.value))}
              autoComplete="cc-email"
              name="email"
              placeholder="acestar@example.com"
              value={email}
              disabled={status === "executing"}
              required
            />
          </div>
          <Button
            message="Send"
            disabled={status === "executing"}
            buttonClass={styles.submit}
          />
        </form>
        <Footer />
      </div>
    </>
  );
};

export default Email;
