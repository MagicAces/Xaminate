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
          <span>({reports.length})</span>
        </h4>
      </div>
      <div className={styles.sessionReportsBody}>
        <div className={styles.sessionReportsBodyTop}>
          {page} / {Math.ceil(reports.length / 2)}
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
                if (page * 2 >= index + 1 && (page - 1) * 2 < index + 1) {
                  return (
                    <div className={styles.report} key={index}>
                      <MdCircle />
                      <h5>Report ${`0${report.id}-0${session?.id}`}</h5>
                      <Image
                        src={report.student.image}
                        alt="Student's pic"
                        width={150}
                        height={150}
                        className={styles.reportImage}
                      />
                      <div className={styles.reportBody}>
                        <div className={styles.leftPart}>
                          <span>Student ID</span>
                          <span>Status</span>
                          <span>Name</span>
                          <span>Program</span>
                          <span>Timestamp</span>
                        </div>
                        <div className={styles.rightPart}>
                          <span>{report.student.index_number}</span>
                          <span>{report.status}</span>
                          <span>
                            {`${report.student?.first_name} ${report.student?.last_name}`}
                          </span>
                          <span>{report.student.program}</span>
                          <span>
                            {formatToCCTVTimestamp(report.created_on)}
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
                prevPage < Math.ceil(reports.length / 2)
                  ? prevPage + 1
                  : Math.ceil(reports.length / 2)
              )
            }
          >
            <MdArrowForwardIos
              style={
                page >= Math.ceil(reports.length / 2)
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
