import logo from "@/public/images/logo.svg";
import { hardReset, setPassword, setSection } from "@/redux/slices/resetSlice";
import { changePassword } from "@/server/actions/reset";
import styles from "@/styles/password.module.scss";
// import { AnimatePresence, motion } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { MdClose, MdInfoOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../Utils/Button";
import Loader from "../Utils/Loader";
import Footer from "./Footer";

const Password = () => {
  const [error, setError] = useState("");
  const [passwordReveal, setPasswordReveal] = useState({
    newPass: false,
    confirmPass: false,
  });
  const { password, userId } = useSelector((state: any) => state.reset);
  const dispatch = useDispatch();

  const { execute, status } = useAction(changePassword, {
    onSuccess(data) {
      if (data?.error) {
        toast.error(data.error);
        setError(data.error);
        dispatch(hardReset());
      }
      if (data?.success) {
        toast.success(data?.success);
        dispatch(setSection(data?.section));
      }
    },
    onError(error) {
      if (error.serverError) toast.error("Server Error");
      if (error.fetchError) toast.error("Something wrong occurred");

      dispatch(setPassword({ newPass: "", confirmPass: "" }));
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    dispatch(
      setPassword({
        ...password,
        [name]: value,
      })
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.newPass !== password.confirmPass) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      dispatch(setPassword({ newPass: "", confirmPass: "" }));
      return;
    }

    execute({ password: password.newPass, userId });
  };

  return (
    <>
      <div className={styles.passwordContainer}>
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
            <h2>Set Password</h2>
          </div>
          <p>Must be 8 characters</p>
        </div>

        {/* <AnimatePresence> */}
        {error && (
          // <motion.div
          //   animate={{ opacity: 1 }}
          //   initial={{ opacity: 0.1 }}
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
        <form className={styles.passwordForm} onSubmit={handleSubmit}>
          <div className={styles.newPassBox}>
            <label htmlFor="password">New Password</label>
            <div>
              <input
                onChange={handleChange}
                type={passwordReveal.newPass ? "text" : "password"}
                placeholder="*********"
                name="newPass"
                minLength={8}
                disabled={status === "executing"}
                autoComplete="off"
                value={password.newPass}
                required
              />
              {passwordReveal.newPass ? (
                <BsEyeSlashFill
                  onClick={() =>
                    setPasswordReveal({ ...passwordReveal, newPass: false })
                  }
                />
              ) : (
                <BsEyeFill
                  onClick={() =>
                    setPasswordReveal({ ...passwordReveal, newPass: true })
                  }
                />
              )}
            </div>
          </div>
          <div className={styles.confirmPassBox}>
            <label htmlFor="confirm">Confirm Password </label>
            <div>
              <input
                onChange={handleChange}
                type={passwordReveal.confirmPass ? "text" : "password"}
                name="confirmPass"
                placeholder="*********"
                minLength={8}
                autoComplete="off"
                disabled={status === "executing"}
                value={password.confirmPass}
                required
              />
              {passwordReveal.confirmPass ? (
                <BsEyeSlashFill
                  onClick={() =>
                    setPasswordReveal({ ...passwordReveal, confirmPass: false })
                  }
                />
              ) : (
                <BsEyeFill
                  onClick={() =>
                    setPasswordReveal({ ...passwordReveal, confirmPass: true })
                  }
                />
              )}
            </div>
          </div>
          <Button
            message="Save"
            disabled={status === "executing"}
            buttonClass={styles.submit}
          />
        </form>
        <Footer />
      </div>
    </>
  );
};

export default Password;
