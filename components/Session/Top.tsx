import styles from "@/styles/session.module.scss";
import { MdSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Top = () => {
    const dispatch = useDispatch();
    const { sessionsBox } = useSelector((state: any) => state.auth);

  return (
    <>
          <div className={styles.sessionContentTop}>
              <div className={styles.searchBox}>
                  <MdSearch />
              </div>
           <input />   
      </div>
    </>
  );
};

export default Top;
