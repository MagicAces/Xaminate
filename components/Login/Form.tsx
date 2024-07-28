"use client";

import { LoginInput, loginSchema } from "@/lib/schema";
import logo from "@/public/images/logo.svg";
import { authenticate } from "@/server/actions/user";
import styles from "@/styles/form.module.scss";
import { zodResolver } from "@hookform/resolvers/zod";
// import { AnimatePresence, motion } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { MdClose, MdInfoOutline } from "react-icons/md";
import { toast } from "react-toastify";
import Button from "../Utils/Button";
import Loader from "../Utils/Loader";
import { setReload } from "@/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutReload } from "@/redux/slices/sidebarSlice";
import { signIn } from "next-auth/react";

export default function Form() {
  const [error, setError] = useState("");
  const [passwordReveal, setPasswordReveal] = useState(false);
  const { reload } = useSelector((state: any) => state.modal);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, status } = useAction(authenticate, {
    onSuccess(data) {
      if (data?.error) {
        reset({ password: "" });
        toast.error(data.error);
        setError(data.error);
      }
      // if (data?.success) {
      //   toast.success(data?.success);
      //   console.log(data?.data);
      reset();
      // }
    },
    onError(error) {
      console.log(error);
      if (error.serverError) toast.error("Server Error");
    },
  });

  const onSubmitHandler: SubmitHandler<LoginInput> = async (
    values: LoginInput
  ) => {
    dispatch(setReload(true));
    const signInResult = await signIn("credentials", {
      ...values,
      redirect: true,
      callbackUrl,
    });
    dispatch(setReload(false));
    // execute({ ...values, redirect: false, callbackUrl });
  };

  useEffect(() => {
    // dispatch(setReload(false));
    dispatch(setLogoutReload(false));
  }, []);

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
        {(status === "executing" || reload) && <Loader />}
        <div className={styles.topContainer}>
          <Image
            src={logo}
            alt="logo.svg"
            className={styles.logoImage}
            width={80}
            height={80}
          />
          <h2>Login</h2>
        </div>
        {/* <AnimatePresence> */}
        {error && (
          // <motion.div
          //   animate={{ opacity: 1 }}
          //   initial={{ opacity: 0 }}
          //   exit={{ opacity: 0 }}
          //   transition={{ ease: "easeInOut", duration: 1 }}
          //   className={styles.errorBox}
          // >
          <div className={styles.errorBox}>
            <span>
              <MdInfoOutline />
              <span>{error}</span>
            </span>
            <MdClose onClick={() => setError("")} />
          </div>
          // </motion.div>
        )}
        {/* </AnimatePresence> */}
        <div className={styles.inputContainer}>
          <div className={styles.emailBox}>
            <label
              className={errors["email"] && styles.errorLabel}
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              className={errors["email"] && styles.errorInput}
              {...register("email")}
              placeholder="johndoe@example.com"
              disabled={status === "executing"}
              autoComplete="false"
            />
            {/* <AnimatePresence> */}
            {errors["email"] && (
              // <motion.p
              //   initial={{ opacity: 0 }}
              //   animate={{ opacity: 1 }}
              //   exit={{ opacity: 0 }}
              //   transition={{ ease: "easeInOut", duration: 1 }}
              //   className={styles.errorText}
              // >
              <p className={styles.errorText}>
                {errors["email"]?.message as string}
              </p>
              // </motion.p>
            )}
            {/* </AnimatePresence> */}
          </div>
          <div className={styles.passwordBox}>
            <label
              className={errors["password"] && styles.errorLabel}
              htmlFor="password"
            >
              Password
            </label>
            <div>
              <input
                type={passwordReveal ? "text" : "password"}
                {...register("password")}
                placeholder="*********"
                className={errors["password"] && styles.errorInput}
                disabled={status === "executing"}
              />
              {passwordReveal ? (
                <BsEyeSlashFill onClick={() => setPasswordReveal(false)} />
              ) : (
                <BsEyeFill onClick={() => setPasswordReveal(true)} />
              )}
            </div>
            {/* <AnimatePresence> */}
            {errors["password"] && (
              // <motion.p
              //   initial={{ opacity: 0 }}
              //   animate={{ opacity: 1 }}
              //   exit={{ opacity: 0 }}
              //   transition={{ ease: "easeInOut", duration: 1 }}
              //   className={styles.errorText}
              // >
              <p className={styles.errorText}>
                {errors["password"]?.message as string}
              </p>
              // {/* </motion.p> */}
            )}
            {/* </AnimatePresence> */}
          </div>
          <div className={styles.forgotBox}>
            <Link href={"/login/reset"}>Forgot Password?</Link>
          </div>
        </div>
        <Button
          disabled={status === "executing" || reload}
          message="Login"
          buttonClass={styles.submit}
        />
      </form>
    </>
  );
}
