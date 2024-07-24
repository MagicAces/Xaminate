import { setReload, setSession, setSummary } from "@/redux/slices/modalSlice";
import styles from "@/styles/session.module.scss";
import { SessionOutput, SessionSummary } from "@/types";
import { useModal } from "@/utils/context";
import { capitalize } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GiExitDoor } from "react-icons/gi";
import { IoMdArrowBack, IoMdStats } from "react-icons/io";
import { MdPinEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Top = () => {
  const { id }: { id: string } = useParams();
  const { session }: { session: SessionOutput } = useSelector(
    (state: any) => state.session
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { setState } = useModal();

  const showModal = (type: string) => {
    if (type === "edit") {
      setState(session.id, 3, "session");
      dispatch(setReload(true));
      dispatch(
        setSession({
          id: session.id,
          sessionStart: session.start_time,
          sessionEnd: session.end_time,
          comments: session.comments,
          classes: session.classes,
          courseNames: session.course_names,
          courseCodes: session.course_codes,
          invigilators: session.invigilators,
          venue: {
            id: session.venue.id,
            name: session.venue.name,
          },
        })
      );
    } else if (type === "end") {
      setState(session.id, 4, "session");
    } else if (type === "summary") {
      // Calculate the report statuses
      const reportStatusCounts = session.reports.reduce(
        (counts, report) => {
          if (report.status === "Pending") counts.pending++;
          else if (report.status === "Approved") counts.approved++;
          else if (report.status === "Rejected") counts.rejected++;
          return counts;
        },
        { pending: 0, approved: 0, rejected: 0 }
      );

      // Calculate the students' report frequency
      const studentFrequencyMap = session.reports.reduce((map, report) => {
        if (report.student) {
          const { index_number, first_name, last_name } = report.student;
          const fullname = `${first_name} ${last_name}`;
          if (!map[index_number]) {
            map[index_number] = {
              fullname,
              index_number,
              frequency: 0,
            };
          }
          map[index_number].frequency++;
        }
        return map;
      }, {} as Record<number, { fullname: string; index_number: number; frequency: number }>);

      const studentFrequency = Object.values(studentFrequencyMap);

      const summary: SessionSummary = {
        reports: reportStatusCounts,
        students: studentFrequency,
      };

      dispatch(setSummary(summary));
      dispatch(setReload(true));
      setState(session.id, 5, "session");
    }
  };

  useEffect(() => {
    router.prefetch("/sessions")
  }, [])

  return (
    <>
      <div className={styles.sessionPageTop}>
        <div className={styles.sessionPageTopLeft}>
          <IoMdArrowBack onClick={() => router.push("/sessions")} />
          <span className={styles.sessionId}>
            Session <span>#{id}</span>
          </span>
          <div className={styles[`${session?.status}`]}>
            <div></div>
            <div>{capitalize(session?.status)}</div>
          </div>
        </div>
        <div className={styles.sessionPageTopRight}>
          {session?.status === "pending" && (
            <button
              type="button"
              className={styles.endButton}
              onClick={() => showModal("end")}
            >
              <GiExitDoor />
              Exit
            </button>
          )}
          {session?.status === "active" && (
            <button
              type="button"
              className={styles.terminateButton}
              onClick={() => showModal("end")}
            >
              <MdPinEnd />
              Terminate
            </button>
          )}
          {session?.status === "closed" && (
            <button
              type="button"
              className={styles.closedButton}
              onClick={() => showModal("summary")}
            >
              <IoMdStats />
              Summary
            </button>
          )}
          <button
            type="button"
            className={styles.editButton}
            onClick={() => showModal("edit")}
          >
            <FaRegEdit />
            Edit
          </button>
        </div>
        <div className={`${styles.sessionPageTopRight} ${styles.mobileMode}`}>
          {session?.status === "pending" && (
            <button
              type="button"
              className={styles.endButton}
              onClick={() => showModal("end")}
            >
              <GiExitDoor />
            </button>
          )}
          {session?.status === "active" && (
            <button
              type="button"
              className={styles.terminateButton}
              onClick={() => showModal("end")}
            >
              <MdPinEnd />
            </button>
          )}
          {session?.status === "closed" && (
            <button
              type="button"
              className={styles.closedButton}
              onClick={() => showModal("summary")}
            >
              <IoMdStats />
            </button>
          )}
          <button
            type="button"
            className={styles.editButton}
            onClick={() => showModal("edit")}
          >
            <FaRegEdit />
          </button>
        </div>
      </div>
    </>
  );
};

export default Top;
