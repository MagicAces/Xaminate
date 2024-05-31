import styles from "@/styles/session.module.scss";
import { useSelector } from "react-redux";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
const Footer = () => {
  const { data, isDisabled, sessionsBox } = useSelector((state: any) => state.session);

  return (
    <>
      <div className={styles.sessionFooter}>
        <div className={styles.sessionFooterStats}>
          <span>
            Pending <span>{data ? "" : `(${data?.pendingCount})`}</span>
          </span>
          <span>
            Active <span>{data ? "" : `(${data?.activeCount})`}</span>
          </span>
          <span>
            Closed <span>{data ? "" : `(${data?.closedCount})`}</span>
          </span>
        </div>
        <div className={styles.sessionFooterNavigation}>
          <button
            className={styles.navBack}
            type="button"
            disabled={isDisabled || !data?.hasPrevPage}
          >
            <IoChevronBack />
          </button>
          <button
            className={styles.navForward}
            type="button"
            disabled={isDisabled || !data?.hasNextPage}
          >
            <IoChevronForward />
          </button>
        </div>
        <div className={styles.sessionFooterInput}>
          <input type="text" value={sessionsBox.query.page.toString()} />
        </div>
      </div>
    </>
  );
};

export default Footer;
