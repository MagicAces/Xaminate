"use client";

import styles from "@/styles/session.module.scss";
import { SessionOutput } from "@/types";
import { useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos, MdCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { faker } from "@faker-js/faker";
import Image from "next/image";
import { formatToCCTVTimestamp } from "@/utils/functs";
import reports from "@/data/reports";

const Reports = () => {
  const { session }: { session: SessionOutput } = useSelector(
    (state: any) => state.session
  );
  const [page, setPage] = useState(1);

  return (
    <div className={styles.sessionReports}>
      <div className={styles.sessionReportsTop}>
        <h4>
          Reports
          <span>{reports.length}</span>
        </h4>
      </div>
      <div className={styles.sessionReportsBody}>
        <div className={styles.sessionReportsBodyTop}>
          {page} / {reports.length}
        </div>
        <div className={styles.sessionReportsBodyContent}>
          <div
            className={styles.backNav}
            onClick={() =>
              setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1))
            }
          >
            <MdArrowBackIos style={page <= 1 ? { visibility: "hidden" } : {}} />
          </div>
          <div className={styles.reports}>
            {reports.length > 0 ? (
              reports?.map((report, index) => {
                if (page === index + 1) {
                  return (
                    <div
                      className={`${styles.report} ${
                        styles[`${report.status.toLowerCase()}`]
                      }`}
                      key={index}
                    >
                      <MdCircle />
                      <h5>Report {`0${report.id}-0${session?.id}`}</h5>
                      <Image
                        src={report.student.image}
                        alt="Student's pic"
                        width={120}
                        height={120}
                        className={styles.reportImage}
                        priority
                      />
                      <div className={styles.reportBody}>
                        <div className={styles.studentID}>
                          <span>Student ID</span>
                          <span>{report.student.index_number}</span>
                        </div>
                        <div className={styles.status}>
                          <span>Status</span>
                          <span>{report.status}</span>
                        </div>
                        <div className={styles.studentName}>
                          <span>Name</span>
                          <span>
                            {`${report.student?.first_name} ${report.student?.last_name}`}
                          </span>
                        </div>
                        <div className={styles.studentID}>
                          <span>Program</span>
                          <span>{report.student.program}</span>
                        </div>
                        <div className={styles.timestamp}>
                        <span>Timestamp</span>
                          <span>
                            {formatToCCTVTimestamp(report.timestamp)}
                          </span>
                        </div>
                      </div>
                      <button type="button" className={styles.reportButton}>
                        Review
                      </button>
                    </div>
                  );
                }
                return;
              })
            ) : (
              <div className={styles.noReport}>No Report Found</div>
            )}
          </div>

          <div
            className={styles.forwardNav}
            onClick={() =>
              setPage((prevPage) =>
                prevPage < reports.length
                  ? prevPage + 1
                  : reports.length 
              )
            }
          >
            <MdArrowForwardIos
              style={
                page >= reports.length
                  ? { visibility: "hidden" }
                  : {}
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
