import { IoMdArrowBack } from "react-icons/io";
import styles from "@/styles/session.module.scss";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { SessionOutput } from "@/types";
import { capitalize } from "lodash";
import { GiExitDoor } from "react-icons/gi";
import { MdPinEnd } from "react-icons/md";
import { IoMdStats } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { useModal } from "@/utils/context";
import { setReload, setSession } from "@/redux/slices/modalSlice";

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
    }
  };

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
              End
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
            <button type="button" className={styles.closedButton}>
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
            <button type="button" className={styles.closedButton}>
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
