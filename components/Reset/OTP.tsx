import logo from "@/public/images/logo.svg";
import {
  setEmail,
  setIds,
  setOTP,
  setSection,
} from "@/redux/slices/resetSlice";
import { sendOTP, verifyOTP } from "@/server/actions/reset";
import styles from "@/styles/otp.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdClose, MdInfoOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../Utils/Loader";
import Footer from "./Footer";

const OTP = () => {
  const [error, setError] = useState("");

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const formRef = useRef<HTMLFormElement>(null);
  const { otp, email, userId, tokenId } = useSelector(
    (state: any) => state.reset
  );
  const dispatch = useDispatch();

  const focus = () => {
    if (inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
  };

  useEffect(() => {
    focus();
  }, []);

  const { execute: send, status: sendStatus } = useAction(sendOTP, {
    onSuccess(data) {
      if (data?.error) {
        toast.error(data.error);
        setError(data.error);
        dispatch(setSection(data.section));

        data?.section === 1 && dispatch(setEmail(""));
      }
      if (data?.success) {
        toast.success(data?.success);
        dispatch(setIds({ ...data.ids }));
      }
      dispatch(setOTP(new Array(6).fill("")));
      focus();
    },
    onError(error) {
      if (error.serverError) toast.error("Server Error");
      if (error.fetchError) toast.error("Something wrong occurred");

      dispatch(setOTP(new Array(6).fill("")));
      focus();
    },
  });

  const { execute: verify, status: verifyStatus } = useAction(verifyOTP, {
    onSuccess(data) {
      if (data?.error) {
        toast.error(data.error);
        setError(data.error);
        dispatch(setOTP(new Array(6).fill("")));

        focus();
        data.section === 1 && dispatch(setEmail(""));
      }
      if (data?.success) {
        toast.success(data?.success);
      }

      dispatch(setSection(data.section));
    },
    onError(error) {
      console.log(error);
      if (error.serverError) toast.error("Server Error");
      if (error.fetchError) toast.error("Something wrong occurred");
      if (error.validationErrors) toast.error("Server Error");

      dispatch(setOTP(new Array(6).fill("")));
      focus();
    },
  });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1]?.current?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
    if (e.key === "ArrowRight" && index < 6) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;

    if (value !== "" && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }

    dispatch(setOTP(newOTP));

    if (newOTP[5] !== "") {
      focus();
      if (newOTP.join("").length === 6)
        verify({ otp: newOTP.join(""), userId, tokenId });
    }
  };

  return (
    <>
      <div className={styles.otpContainer}>
        {(sendStatus === "executing" || verifyStatus === "executing") && (
          <Loader />
        )}
        <div className={styles.textContainer}>
          <div className={styles.topContainer}>
            <Image
              src={logo}
              alt="logo.svg"
              className={styles.logoImage}
              width={80}
              height={80}
            />
            <h2>Code Verifcation</h2>
          </div>
          <p>
            A 6-digit code has been sent to <span>{email}</span>. Check your
            inbox or spam folder.
          </p>
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
        <form ref={formRef} className={styles.otpForm}>
          <div className={styles.otpBox}>
            {otp.map((digit: string, index: number) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                autoFocus={index === 0}
                disabled={
                  sendStatus === "executing" || verifyStatus === "executing"
                }
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={inputRefs[index]}
              />
            ))}
          </div>
        </form>
        <p className={styles.resendText}>
          Didn't receive an email?{" "}
          <span className={styles.resendLink} onClick={() => send({ email })}>
            {" "}
            Click to resend
          </span>
        </p>
        <Footer />
      </div>
    </>
  );
};

export default OTP;
