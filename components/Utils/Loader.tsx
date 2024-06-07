import { BarLoader } from "react-spinners";
import styles from "@/styles/loader.module.scss";

const Loader = ({ curved = true }: { curved?: boolean }) => {
  return (
    <>
      <div
        className={styles.container}
        style={curved ? { borderRadius: "0.6rem" } : {}}
      >
        <BarLoader width={"auto"} height={8} color="#4CAF50" />
      </div>
    </>
  );
};

export default Loader;
