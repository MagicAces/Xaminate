"use client";

import styles from "@/styles/report.module.scss";
import { useState } from "react";
import unknown from "@/public/images/unknown_user.png";
import { ReportOutput } from "@/types";
import { useModal } from "@/utils/context";
import { formatSorRDate } from "@/utils/functs";
import Image from "next/image";
import { useRouter } from "next/router";
import { MdFlipToBack, MdFlipToFront } from "react-icons/md";
import { useSelector } from "react-redux";

const Details = () => {
  const [isFlipped, setFlipped] = useState(false);
  const { report }: { report: ReportOutput } = useSelector(
    (state: any) => state.report
  );
  const { exitModal } = useModal();
  const router = useRouter();

  return (
    <>
      <div className={styles.reportDetails}>
        <div className={styles.reportDetailsTop}>
          <h4>Details</h4>
        </div>
        <div className={styles.reportDetailsBody}>
          <div className={styles.detailFlip}>
            {isFlipped ? (
              <MdFlipToFront onClick={() => setFlipped(false)} />
            ) : (
              <MdFlipToBack onClick={() => setFlipped(false)} />
            )}
          </div>
          {!isFlipped ? (
            <div className={styles.detailBoxFront}>
              <div className={styles.firstBox}>
                <Image
                  src={
                    report?.student?.photo ? report?.student?.photo : unknown
                  }
                  alt="student-pic"
                  width={90}
                  height={90}
                  className={styles.studentPhoto}
                  priority
                />
                <div className={styles.firstRow}>
                  <div className={styles.NameBox}>
                    <span>Last name</span>
                    <p>{report?.student?.last_name}</p>
                  </div>
                  <div className={styles.firstNameBox}>
                    <span>First name</span>
                    <p>{report?.student?.first_name}</p>
                  </div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.indexNoBox}>
                    <span>Index number</span>
                    <p>{report?.student?.index_number}</p>
                  </div>
                  <div className={styles.referenceNo}>
                    <span>Reference number</span>
                    <p>{report?.student?.reference_no}</p>
                  </div>
                </div>
              </div>
              <div className={styles.secondBox}>
                <div className={styles.firstRow}>
                  <div className={styles.programBox}>
                    <span>Program</span>
                    <p>{report?.student?.program}</p>
                  </div>
                  <div className={styles.levelBox}>
                    <span>Level</span>
                    <p>{report?.student?.level}</p>
                  </div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.timestampBox}>
                    <span>Timestamp</span>
                    <p>{formatSorRDate(report?.timestamp)}</p>
                  </div>
                  <div className={styles.sessionIdBox}>
                    <span>Session ID</span>
                    <p
                      onClick={() => {
                        if (report?.session_id) {
                          router.push(`/sessions/${report?.session_id}`);
                          exitModal();
                        }
                      }}
                    >
                      {report?.session_id}
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.thirdBox}>
                <div className={styles.descriptionBox}>
                  <span>Description</span>
                  <p>
                    {report?.description.length > 0
                      ? report?.description
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.detailBoxBack}>
              <div className={styles.firstBox}>
                <div className={styles.firstRow}>
                  <div className={styles.createdBox}>
                    <span>Created on</span>
                    <p>{formatSorRDate(report?.created_on)}</p>
                  </div>
                  <div className={styles.updatedBox}>
                    <span>Last updated</span>
                    <p>{formatSorRDate(report?.updated_at)}</p>
                  </div>
                </div>
                <div className={styles.secondRow}>
                  <div className={styles.statusChangeBox}>
                    <span>
                      {report?.status_changed
                        ? `${report?.status} on`
                        : "Status changed on"}
                    </span>
                    <p>
                      {report?.status_changed
                        ? formatSorRDate(report?.status_changed)
                        : `N/A`}
                    </p>
                  </div>
                  <div className={styles.editedBy}>
                    <span>
                      {report?.status_changed
                        ? `${report?.status} by`
                        : "Status changed by"}
                    </span>
                    <p>{`${report?.editor?.last_name} ${report?.editor?.first_name}`}</p>
                  </div>
                </div>
              </div>
              <div className={styles.secondBox}>
                <div className={styles.commentBox}>
                  <span>Comments</span>
                  <div>{report?.comments ? report?.comments : "N/A"}</div>
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
