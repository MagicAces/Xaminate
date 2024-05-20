import { BarLoader } from "react-spinners";
import styles from "@/styles/loader.module.scss";

const Loader = () => {
  return (
    <>
      <div className={styles.container}>
        <BarLoader width={"auto"} height={8} color="#4CAF50" />
      </div>
    </>
  );
};

export default Loader;
