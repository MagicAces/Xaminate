"use client";

import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";

import Button from "@/components/Utils/Button";
import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";
import { SessionEdit, SessionWarn } from "@/types";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosAdd } from "react-icons/io";
import { MdClose, MdDeleteOutline, MdInfoOutline } from "react-icons/md";

// import { AnimatePresence, motion } from "framer-motion";
import { SessionInput } from "@/lib/schema";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Page2 = ({
  session,
  setSessionVal,
  setPage,
  disabled,
}: {
  session: SessionEdit;
  setSessionVal: any;
  setPage: any;
  disabled: boolean;
}) => {
  const { exitModal } = useModal();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const [warning, setWarning] = useState<SessionWarn>({
    courseNames: [],
    courseCodes: [],
    classes: [],
    venue: false,
    sessionStart: false,
    sessionEnd: false,
    invigilators: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: number
  ) => {
    const { name, value } = e.target;

    setSessionVal((prevValue: SessionEdit) => ({
      ...prevValue,
      [name]: (prevValue[name as keyof SessionInput] as string[]).map(
        (item, index) => (index === position ? value : item)
      ),
    }));
  };

  const disableWarning = (position: number | null = null) => {
    setWarning((prevWarning) => ({
      ...prevWarning,
      invigilators:
        (prevWarning["invigilators"] as number[]).length > 0
          ? (prevWarning["invigilators"] as number[]).filter(
              (i) => i !== position
            )
          : (prevWarning["invigilators"] as number[]),
    }));
  };

  const handleAdd = () => {
    setSessionVal((prevValue: SessionEdit) => ({
      ...prevValue,
      invigilators: [...(prevValue["invigilators"] as string[]), ""],
    }));
  };

  const handleDelete = (position: number) => {
    setSessionVal((prevValue: SessionEdit) => ({
      ...prevValue,
      invigilators: [
        ...(prevValue["invigilators"] as string[]).filter(
          (_, index) => position !== index
        ),
      ],
    }));
  };

  const handleBack = () => {
    const invigilatorsIndexes = session.invigilators.reduce<number[]>(
      (acc, invigilator, index) => {
        if (!invigilator) acc.push(index);
        return acc;
      },
      []
    );
    setWarning((prevWarning) => ({
      ...prevWarning,
      invigilators: invigilatorsIndexes,
    }));
    if (invigilatorsIndexes.length) {
      setError("Fill in the highlighted details");
      toast.error("Fill in the highlighted details");
      return;
    }

    setPage(1);
  };

  return (
    <>
      {/* <AnimatePresence> */}
      {error && (
        // <motion.div
        //   animate={{ opacity: 1 }}
        //   initial={{ opacity: 0 }}
        //   exit={{ opacity: 0 }}
        //   transition={{ ease: "easeInOut", duration: 1 }}
        //   className={styles.errorBox}
        // >
        <div className={styles.errorBox}>
          <span>
            <MdInfoOutline />
            <span>{error}</span>
          </span>
          <MdClose onClick={() => setError("")} />
        </div>
        // </motion.div>
      )}
      {/* </AnimatePresence> */}
      <ColoredScrollbars className={styles.scrollContainer}>
        <div className={styles.scrollContent}>
          <div className={styles.invigilatorsBox}>
            <div className={styles.top}>
              <label
                className={
                  warning.invigilators.length > 0
                    ? styles.errorLabel
                    : undefined
                }
              >
                Invigilator{session?.invigilators?.length > 1 && "(s)"}
              </label>

              <IoIosAdd onClick={handleAdd} />
            </div>
            <div className={styles.bottom}>
              {session?.invigilators?.map(
                (invigilator: string, index: number) => (
                  <div key={index} className={styles.invigilators}>
                    <input
                      name="invigilators"
                      className={
                        warning.invigilators.length > 0 &&
                        warning.invigilators?.includes(index)
                          ? `${styles.invigilatorsInput} ${styles.errorInput}`
                          : `${styles.invigilatorsInput}`
                      }
                      value={invigilator}
                      type="text"
                      required
                      tabIndex={1}
                      onFocus={() => disableWarning(index)}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                    {session.invigilators?.length > 1 && (
                      <MdDeleteOutline
                        title="Delete"
                        onClick={() => handleDelete(index)}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className={styles.commentsBox}>
            <div className={styles.top}>
              <label>Comments</label>
            </div>
            <div className={styles.bottom}>
              <textarea
                name="comments"
                className={styles.comments}
                rows={12}
                value={session?.comments ?? ""}
                onChange={(e) =>
                  setSessionVal((prevValue: SessionEdit) => ({
                    ...prevValue,
                    comments: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </ColoredScrollbars>
      <div className={styles.navigateButtons}>
        <button
          type="button"
          onClick={handleBack}
          className={styles.backButton}
        >
          Back
        </button>
        <Button
          message="Save"
          disabled={disabled}
          buttonClass={styles.saveButton}
        />
      </div>
    </>
  );
};

export default Page2;
