"use client";
import styles from "@/styles/session.module.scss";
import { useState } from "react";

import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import { FiExternalLink } from "react-icons/fi";
import ColoredScrollbars from "../Utils/ColoredScrollbars";
import { useSelector } from "react-redux";
import { SessionOutput } from "@/types";
import { MdAccessTime } from "react-icons/md";
import { formatSessionDate } from "@/utils/functs";

const Details = () => {
  const [view, setView] = useState(1);
  const { session }: { session: SessionOutput } = useSelector(
    (state: any) => state.session
  );
  return (
    <>
      <div className={styles.sessionDetails}>
        <div className={styles.sessionDetailsTop}>
          <h4>
            Details
            <span>{view} / 2</span>
          </h4>
        </div>
        <div className={styles.sessionDetailsBody}>
          <div className={styles.detailHeader}>
            <div
              onClick={() => setView(1)}
              className={view === 1 ? styles.activeView : undefined}
            ></div>
            <div
              onClick={() => setView(2)}
              className={view === 2 ? styles.activeView : undefined}
            ></div>
          </div>
          {view === 1 ? (
            <div className={styles.viewOne}>
              <div className={styles.course}>
                <label>Course</label>
                <div className={styles.courseValues}>
                  {session?.course_names.map((course: string, index) => (
                    <div className={styles.courseValue} key={index}>
                      <span>{course}</span>-
                      <span>{session?.course_codes[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.sessionTime}>
                <div className={styles.startTime}>
                  <label>Start Time</label>
                  <div className={styles.startTimeValue}>
                    {formatSessionDate(session?.start_time)}
                    <MdAccessTime />
                  </div>
                </div>
                <div className={styles.endTime}>
                  <label>End Time</label>
                  <div className={styles.endTimeValue}>
                    {formatSessionDate(session?.end_time)}
                    <MdAccessTime />
                  </div>
                </div>
              </div>
              <div className={styles.venueDuration}>
                <div className={styles.venue}>
                  <label>Venue</label>
                  <div className={styles.venueValue}>{session?.venue.name}</div>
                </div>
                <div className={styles.duration}>
                  <label>Planned Duration</label>
                  <div className={styles.durationValue}>
                    {session?.duration}
                  </div>
                </div>
              </div>

              <div className={styles.invigilators}>
                <label>
                  {session?.classes.length > 1 ? "Invigilators" : "Invigilator"}
                </label>
                <div className={styles.invigilatorsValues}>
                  {session?.invigilators.map(
                    (invigilator: string, index: number) => (
                      <div key={index} className={styles.classValue}>
                        {invigilator}
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className={styles.classes}>
                <label>
                  {session?.classes.length > 1 ? "Classes" : "Class"}
                </label>
                <div className={styles.classesValues}>
                  {session?.classes.map((classe: string, index: number) => (
                    <div key={index} className={styles.classValue}>
                      {classe}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.viewTwo}>
              {session?.status === "closed" && (
                <div className={styles.actualValues}>
                  <div className={styles.actualEndTime}>
                    <label>Actual End Time</label>
                    <div className={styles.actualEndTimeValue}>
                      {session?.actual_end_time
                        ? formatSessionDate(session.actual_end_time)
                        : formatSessionDate(session.end_time)}
                    </div>
                  </div>
                  <div className={styles.actualDuration}>
                    <label>Actual Duration</label>
                    <div className={styles.actualDurationValue}>
                      {session?.actualDuration || session?.duration}
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.comment}>
                <label>Comments</label>
                <div className={styles.commentValue}>
                  {session?.comments || "N/A"}
                </div>
              </div>

              <div className={styles.authors}>
                <div className={styles.createdBy}>
                  <label>Created By</label>
                  <div className={styles.createdByValue}>
                    {session?.creator?.first_name +
                      " " +
                      session?.creator?.last_name}
                  </div>
                </div>
                <div className={styles.terminatedBy}>
                  <label>Terminated By</label>
                  <div className={styles.terminatedByValue}>
                    {session?.terminated_by
                      ? session?.terminator?.first_name +
                        " " +
                        session?.terminator?.last_name
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className={styles.dateStats}>
                <div className={styles.createdOn}>
                  <label>Created On</label>
                  <div className={styles.createdOnValue}>
                    {formatSessionDate(session?.created_on)}
                  </div>
                </div>
                <div className={styles.updatedAt}>
                  <label>Last Updated</label>
                  <div className={styles.updatedAtValue}>
                    {formatSessionDate(session?.updated_at)}
                  </div>
                </div>
              </div>

              <div className={styles.attendance}>
                <label>
                  Student Count <FiExternalLink />
                </label>
                <div className={styles.attendanceValue}>
                  {session?.attendance?.student_count || "N/A"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Details;
