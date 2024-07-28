import styles from "@/styles/session.module.scss";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { useDispatch, useSelector } from "react-redux";
import { SessionRow } from "@/types";
import { formatArray, formatSorRDate } from "@/utils/functs";
import { capitalize, toUpper } from "lodash";
import SessionScrollbars from "../Utils/Sessions/SessionScrollbars";
import Skeleton from "react-loading-skeleton";
import SessionIcon from "../Utils/Sessions/SessionIcon";
import { useRouter } from "next/navigation";
import { useModal } from "@/utils/context";
import Modal from "../Modal/Modal";
import { setReload, setSession } from "@/redux/slices/modalSlice";

import nodata from "@/public/images/nodata.svg";
import Image from "next/image";

const Body = () => {
  const { data, isDisabled } = useSelector((state: any) => state.session);
  const { modalState, setState } = useModal();

  const router = useRouter();
  const dispatch = useDispatch();

  const showModal = (session: SessionRow, type: string) => {
    if (type == "edit") {
      setState(session.id, 3, "session");
      dispatch(setReload(true));
      dispatch(
        setSession({
          id: session.id,
          sessionStart: "",
          sessionEnd: "",
          comments: "",
          classes: [],
          courseNames: [],
          courseCodes: session.course_codes,
          invigilators: [],
          venue: {
            id: session.venue_id,
            name: session.venue_name,
          },
        })
      );
    } else if (type === "end") {
      setState(session.id, 4, "session");
    }
  };

  return (
    <>
      {modalState.mode > 0 && modalState.id > 0 && <Modal />}
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
                data?.sessions?.map((session: SessionRow, index: number) => {
                  return (
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
                            {formatSorRDate(session.created_on)}
                          </span>
                          <span
                            className={styles.id}
                            onClick={() => {
                              router.prefetch(`/sessions/${session.id}`);
                              router.push(`/sessions/${session.id}`);
                            }}
                          >
                            #{session.id}
                          </span>
                          <span className={styles.courseCodes}>
                            <span>
                              {formatArray(session.course_codes).first}
                            </span>
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
                              openModal={(type) => showModal(session, type)}
                            />
                          </span>
                        </div>
                      </ScrollSyncPane>
                    </div>
                  );
                })
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
                <div className={styles.noSessions}>
                  <Image src={nodata} alt="🫙" height={50} width={50} />
                  <span>No sessions available</span>
                </div>
              )}
            </div>
          </SessionScrollbars>
        </div>
      </ScrollSync>
    </>
  );
};

export default Body;
