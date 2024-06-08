import styles from "@/styles/session.module.scss";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useSelector } from "react-redux";
import { SessionRow } from "@/types";
import { formatArray, formatSessionDate } from "@/utils/functs";
import { capitalize, toUpper } from "lodash";
import SessionScrollbars from "../Utils/SessionScrollbars";
import Skeleton from "react-loading-skeleton";
import SessionIcon from "../Utils/SessionIcon";
import { useRouter } from "next/navigation";

const Body = () => {
  const { data, isDisabled } = useSelector((state: any) => state.session);

  const router = useRouter();

  return (
    <>
      <ScrollSync>
        <div className={styles.sessionContentBody}>
          <div className={styles.sessionContentBodyHeader}>
            <ScrollSyncPane>
              <div className={styles.headerContent}>
                <span className={styles.dateCreated}>Date Created</span>
                <span className={styles.id}>ID</span>
                <span className={styles.courseCodes}>Course Code(s)</span>
                <span className={styles.venue}>Venue</span>
                <span className={styles.attendance}>Attendance</span>
                <span className={styles.status}>Status</span>
                <span className={styles.reports}>Reports</span>
                <span className={styles.duration}>Duration</span>
                <span className={styles.actions}>Actions</span>
              </div>
            </ScrollSyncPane>
          </div>
          <SessionScrollbars
            className={styles.bodyContainer}
            autoHeight={true}
            autoHeightMin={350}
            autoHeightMax={"64vh"}
            autoHide={true}
            autoHideTimeout={1000}
          >
            <div className={styles.sessionRows}>
              {data?.sessions?.length > 0 ? (
                data?.sessions?.map((session: SessionRow, index: number) => (
                  <div
                    className={styles.sessionRowOuter}
                    key={index}
                    // style={{
                    //   opacity: 0,
                    //   animation: `slideIn 0.5s ease-out forwards`,
                    //   animationDelay: `${index * 0.2}s`,
                    // }}
                  >
                    <ScrollSyncPane>
                      <div
                        className={`${styles.sessionRowInner} hide-scrollbar`}
                      >
                        <span className={styles.dateCreated}>
                          {formatSessionDate(session.created_on)}
                        </span>
                        <span
                          className={styles.id}
                          onClick={() => router.push(`/sessions/${session.id}`)}
                        >
                          #{session.id}
                        </span>
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
                        <span className={styles.attendance}>
                          {session.studentCount}
                        </span>
                        <span
                          className={`${styles.status} ${
                            styles[`${session.status}`]
                          }`}
                        >
                          {capitalize(session.status)}
                        </span>
                        <span className={styles.reports}>
                          {session.reportsCount}
                        </span>
                        <span className={styles.duration}>
                          {session.duration}
                        </span>
                        <span className={styles.actions}>
                          <SessionIcon
                            id={session.id}
                            status={session.status}
                          />
                        </span>
                      </div>
                    </ScrollSyncPane>
                  </div>
                ))
              ) : isDisabled ? (
                new Array(8).fill("").map((_, index) => (
                  <Skeleton
                    key={index}
                    baseColor="#2C2C2C"
                    highlightColor="#505050"
                    className={styles.sessionRowOuter}
                    height={20}
                    style={{
                      borderRadius: "0.5rem",
                      marginTop: "0.5rem",
                      padding: "1rem",
                    }}
                  />
                ))
              ) : (
                <div className={styles.noSessions}>No sessions available</div>
              )}
            </div>
          </SessionScrollbars>
        </div>
      </ScrollSync>
    </>
  );
};

export default Body;
