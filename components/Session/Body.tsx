import styles from "@/styles/session.module.scss";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import ColoredScrollbars from "../Utils/ColoredScrollbars";
import { useSelector } from "react-redux";
import { SessionRow } from "@/types";
import { formatArray, formatSessionDate } from "@/utils/functs";
import { capitalize, toUpper } from "lodash";
import { FaEllipsis } from "react-icons/fa6";

const Body = () => {
  const { data, isDisabled } = useSelector((state: any) => state.session);

  return (
    <>
      <ScrollSync>
        <div className={styles.sessionContentBody}>
          <div className={styles.sessionContentBodyHeader}>
            <ScrollSyncPane>
              <ColoredScrollbars className={styles.headerContent}>
                <div className={styles.headerText}>
                  <span className={styles.dateCreated}>Date Created</span>
                  <span className={styles.id}>ID</span>
                  <span className={styles.courseCodes}>Course Code(s)</span>
                  <span className={styles.venue}>Venue</span>
                  <span className={styles.status}>Status</span>
                  <span className={styles.reports}>Reports</span>
                  <span className={styles.duration}>Duration</span>
                  <span className={styles.actions}>Actions</span>
                </div>
              </ColoredScrollbars>
            </ScrollSyncPane>
          </div>
          <ColoredScrollbars
            className={styles.bodyContainer}
            // autoHeight={true}
            autoHide={true}
            autoHideTimeout={1000}
          >
            {data?.sessions?.length > 0 ? (
              data?.sessions?.map((session: SessionRow, index: number) => (
                <div
                  className={styles.sessionRowOuter}
                  key={index}
                  style={{
                    opacity: 0,
                    animation: `slideIn 0.5s ease-out forwards`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <ScrollSyncPane>
                    <div className={styles.sessionRowInner}>
                      <span className={styles.dateCreated}>
                        {formatSessionDate(session.created_on)}
                      </span>
                      <span className={styles.id}>#{session.id}</span>
                      <span className={styles.courseCodes}>
                        <span>{formatArray(session.course_codes).first}</span>
                        {formatArray(session.course_codes).extra && (
                          <span className={styles.extraBadge}>
                            {formatArray(session.course_codes).extra}
                          </span>
                        )}
                      </span>
                      <span className={styles.venue}>
                        {toUpper(session.venue_name)}
                      </span>
                      <span className={styles.status}>
                        {capitalize(session.status)}
                      </span>
                      <span className={styles.reports}>
                        {session.reportsCount}
                      </span>
                      <span className={styles.duration}>
                        {session.duration}
                      </span>
                      <span className={styles.actions}>
                        <FaEllipsis />
                      </span>
                    </div>
                  </ScrollSyncPane>
                </div>
              ))
            ) : (
              <div className={styles.noSesions}>No sessions available</div>
            )}
          </ColoredScrollbars>
        </div>
      </ScrollSync>
    </>
  );
};

export default Body;
