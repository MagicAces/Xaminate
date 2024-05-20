import { hardReset, setEmail } from "@/redux/slices/resetSlice";
import { sendOTP } from "@/server/actions/reset";
import styles from "@/styles/footer.module.scss";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Footer = () => {
  const { section } = useSelector((state: any) => state.reset);
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.footer}>
        <Link
          href={"/login"}
          className={styles.login}
          onClick={() => dispatch(hardReset())}
        >
          <div>
            <IoMdArrowBack />
            <span>Back to Login</span>
          </div>
        </Link>
        <div className={styles.navigation}>
          <div className={section === 1 ? styles.activeNav : undefined}></div>
          <div className={section === 2 ? styles.activeNav : undefined}></div>
          <div className={section === 3 ? styles.activeNav : undefined}></div>
          <div className={section === 4 ? styles.activeNav : undefined}></div>
        </div>
      </div>
    </>
  );
};

export default Footer;
