import { IoMdArrowBack } from "react-icons/io";
import styles from "@/styles/session.module.scss";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { SessionOutput } from "@/types";
import { capitalize } from "lodash";
import { GiExitDoor } from "react-icons/gi";
import { MdPinEnd } from "react-icons/md";
import { IoMdStats } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";

const Top = () => {
  const { id } = useParams();
  const { session }: { session: SessionOutput } = useSelector(
    (state: any) => state.session
  );

  return (
    <>
      <div className={styles.sessionPageTop}>
        <div className={styles.sessionPageTopLeft}>
          <IoMdArrowBack />
          <span>
            Session <span>#{id}</span>
          </span>
          <div className={styles[`${session?.status}`]}>
            <div></div>
            <div>{capitalize(session?.status)}</div>
          </div>
        </div>
        <div className={styles.sessionPageTopRight}>
          {session?.status === "pending" && (
            <button type="button" className={styles.endButton}>
              <GiExitDoor />
              End
            </button>
          )}
          {session?.status === "active" && (
            <button type="button" className={styles.terminateButton}>
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
          <button type="button" className={styles.editButton}>
            <FaRegEdit />
            Edit
          </button>
        </div>
      </div>
    </>
  );
};

export default Top;
