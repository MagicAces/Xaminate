"use client";

import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";
import { isWeekday } from "@/utils/dates";

import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";
import { venueOptions } from "@/data/select";
import { SelectOption, SessionEdit, SessionWarn } from "@/types";
import {
  ReactNode,
  createElement,
  forwardRef,
  useEffect,
  useState,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosAdd } from "react-icons/io";
import {
  MdAccessTime,
  MdClose,
  MdDeleteOutline,
  MdInfoOutline,
  MdOutlineArrowDropDown,
} from "react-icons/md";
import Select, { DropdownIndicatorProps, components } from "react-select";

import { SessionInput } from "@/lib/schema";
import { closeModal } from "@/redux/slices/modalSlice";
// import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, true>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <MdOutlineArrowDropDown fontSize={24} color="#FFFFFF" />
    </components.DropdownIndicator>
  );
};

interface SessionTimeInputProps {
  value?: string; // value can be undefined if not provided by DatePicker
  onClick?: () => void; // onClick can be undefined if not provided by DatePicker
  onFocus?: () => void;
  error?: boolean; // error is optional and can be undefined
}

const SessionTimeInput = forwardRef<HTMLDivElement, SessionTimeInputProps>(
  ({ value, onClick, onFocus, error }, ref) => (
    <div
      className={
        error
          ? `${styles.sessionTime} ${styles.errorInput}`
          : `${styles.sessionTime}`
      }
      onClick={onClick}
      onFocus={onFocus}
      ref={ref}
    >
      {value ? (
        <span>{value}</span>
      ) : (
        <span className={styles.placeholder}></span>
      )}
      <MdAccessTime />
    </div>
  )
);

SessionTimeInput.displayName = "SessionTimeInput";

const Page1 = ({
  session,
  setSessionVal,
  setPage,
}: {
  session: SessionEdit;
  setSessionVal: any;
  setPage: any;
}) => {
  const { venues } = useSelector((state: any) => state.setting);
  const { exitModal } = useModal();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [options, setOptions] = useState<SelectOption[]>([]);
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

  const handleSelectChange = (data: any) => {
    setSessionVal((prevValue: SessionEdit) => ({
      ...prevValue,
      venue: {
        id: data?.value ?? 0,
        name: data?.label ?? "",
      },
    }));
  };

  const handleDelete = (name: string, position: number) => {
    switch (name) {
      case "courseNames":
        setSessionVal((prevValue: SessionEdit) => ({
          ...prevValue,
          courseNames: [
            ...prevValue.courseNames.filter((_, index) => position !== index),
          ],
          courseCodes: [
            ...prevValue.courseCodes.filter((_, index) => position !== index),
          ],
        }));
        break;
      default:
        setSessionVal((prevValue: SessionEdit) => ({
          ...prevValue,
          [name]: [
            ...(prevValue[name as keyof SessionInput] as string[]).filter(
              (_, index) => position !== index
            ),
          ],
        }));
        break;
    }
  };

  const handleAdd = (name: string) => {
    switch (name) {
      case "courseNames":
        setSessionVal((prevValue: SessionEdit) => ({
          ...prevValue,
          courseNames: [...prevValue.courseNames, ""],
          courseCodes: [...prevValue.courseCodes, ""],
        }));
        break;
      default:
        setSessionVal((prevValue: SessionEdit) => ({
          ...prevValue,
          [name]: [...(prevValue[name as keyof SessionInput] as string[]), ""],
        }));
        break;
    }
  };

  const disableWarning = (
    name: keyof SessionWarn,
    position: number | null = null
  ) => {
    if (position) {
      setWarning((prevWarning) => ({
        ...prevWarning,
        [name]:
          (prevWarning[name] as number[]).length > 0
            ? (prevWarning[name] as number[]).filter((i) => i !== position)
            : (prevWarning[name] as number[]),
      }));
    } else {
      setWarning((prevWarning) => ({
        ...prevWarning,
        [name]: false,
      }));
    }
  };

  const validateInputs = () => {
    const coursenameIndexes = session.courseNames.reduce<number[]>(
      (acc, course, index) => {
        if (!course) acc.push(index);
        return acc;
      },
      []
    );

    const coursecodeIndexes = session.courseCodes.reduce<number[]>(
      (acc, code, index) => {
        if (!code) acc.push(index);
        return acc;
      },
      []
    );

    const classesIndexes = session.classes.reduce<number[]>(
      (acc, classe, index) => {
        if (!classe) acc.push(index);
        return acc;
      },
      []
    );

    const invigilatorsIndexes = session.invigilators.reduce<number[]>(
      (acc, invigilator, index) => {
        if (!invigilator) acc.push(index);
        return acc;
      },
      []
    );

    const venueState = session.venue.id === 0;
    const sessionStartState = session.sessionStart === null;
    const sessionEndState = session.sessionEnd === null;

    setWarning({
      courseNames: coursenameIndexes,
      courseCodes: coursecodeIndexes,
      classes: classesIndexes,
      venue: venueState,
      sessionStart: sessionStartState,
      sessionEnd: sessionEndState,
      invigilators: invigilatorsIndexes,
    });

    if (
      coursenameIndexes.length ||
      coursecodeIndexes.length ||
      classesIndexes.length ||
      invigilatorsIndexes.length ||
      venueState ||
      sessionStartState ||
      sessionEndState
    ) {
      setError("Fill in the highlighted details");
      toast.error("Fill in the highlighted details");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    const valid = validateInputs();

    if (!valid) return;

    if (
      session.sessionEnd &&
      session.sessionStart &&
      new Date(session.sessionEnd) < new Date(session.sessionStart)
    ) {
      toast.error("Session End less than Session Start");
      setError("Session End less than Session Start");
      return;
    }

    setPage(2);
  };

  useEffect(() => {
    const updateOptions = async () => {
      const updatedOpts = await venueOptions(
        venues,
        session?.sessionStart,
        session?.sessionEnd
      );
      setOptions(updatedOpts);

      // const currentVenue = updatedOpts.find(
      //   (opt) => opt.value === session?.venue?.id
      // );
      // if (currentVenue && currentVenue.isDisabled) {
      //   setSessionVal((prevValue: SessionEdit) => ({
      //     ...prevValue,
      //     venue: { id: 0, name: "" },
      //   }));
      // }
    };

    updateOptions();
  }, [venues, session?.sessionStart, session?.sessionEnd]);

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
          <div className={styles.courseRow}>
            <div className={styles.courseNameBox}>
              <div className={styles.top}>
                <label
                  className={
                    warning.courseNames.length > 0
                      ? styles.errorLabel
                      : undefined
                  }
                >
                  Course Name{session?.courseNames?.length > 1 && "(s)"}
                </label>
                <IoIosAdd onClick={() => handleAdd("courseNames")} />
              </div>
              <div className={styles.bottom}>
                {session?.courseNames?.map((course: string, index: number) => (
                  <div key={index} className={styles.courseName}>
                    <input
                      name="courseNames"
                      className={
                        warning.courseNames.length > 0 &&
                        warning.courseNames.includes(index)
                          ? `${styles.courseNameInput} ${styles.errorInput}`
                          : `${styles.courseNameInput}`
                      }
                      value={course}
                      type="text"
                      required
                      tabIndex={1}
                      onFocus={() => disableWarning("courseNames", index)}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                    {session.courseNames?.length > 1 && (
                      <MdDeleteOutline
                        title="Delete"
                        onClick={() => handleDelete("courseNames", index)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.courseCodeBox}>
              <div className={styles.top}>
                <label
                  className={
                    warning.courseCodes.length > 0
                      ? styles.errorLabel
                      : undefined
                  }
                >
                  Course Code{session?.courseCodes?.length > 1 && "(s)"}
                </label>

                <IoIosAdd style={{ visibility: "hidden" }} />
              </div>
              <div className={styles.bottom}>
                {session?.courseCodes?.map((code: string, index: number) => (
                  <div key={index} className={styles.courseCode}>
                    <input
                      name="courseCodes"
                      className={
                        warning.courseCodes.length > 0 &&
                        warning.courseCodes?.includes(index)
                          ? `${styles.courseCodesInput} ${styles.errorInput}`
                          : `${styles.courseCodesInput}`
                      }
                      value={code}
                      type="text"
                      required
                      tabIndex={1}
                      onFocus={() => disableWarning("courseCodes", index)}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.timeRow}>
            <div className={styles.sessionStartBox}>
              <label
                className={warning.sessionStart ? styles.errorLabel : undefined}
              >
                Session Start
              </label>
              <DatePicker
                selected={
                  session?.sessionStart ? new Date(session?.sessionStart) : null
                }
                onChange={(date: Date) => {
                  disableWarning("sessionStart");
                  setSessionVal((prevValue: SessionEdit) => ({
                    ...prevValue,
                    sessionStart: date.toISOString(),
                  }));
                }}
                calendarClassName={styles.calendar}
                className={styles.sessionStart}
                dayClassName={() => `${styles.day}`}
                dateFormat="MMMM d, yyyy hh:mm aa"
                // minDate={new Date()}
                customInput={
                  createElement(SessionTimeInput, {
                    error: warning.sessionStart,
                  }) as ReactNode
                }
                withPortal
                onKeyDown={(e) => e.preventDefault()}
                fixedHeight
                showTimeSelect
                tabIndex={1}
                // filterTime={isWeekday}
                // filterDate={isWeekday}
                timeIntervals={15}
                timeCaption="Time"
                timeFormat="p"
                showTimeInput
                // openToDate={new Date()}
                timeClassName={(date) => `${styles.time}`}
                required
              />
            </div>
            <div className={styles.sessionEndBox}>
              <label
                className={warning.sessionEnd ? styles.errorLabel : undefined}
              >
                Session End
              </label>
              <DatePicker
                selected={
                  session?.sessionEnd ? new Date(session?.sessionEnd) : null
                }
                onChange={(date: Date) => {
                  disableWarning("sessionEnd");
                  setSessionVal((prevValue: SessionEdit) => ({
                    ...prevValue,
                    sessionEnd: date.toISOString(),
                  }));
                }}
                calendarClassName={styles.calendar}
                className={styles.sessionEnd}
                dayClassName={() => `${styles.day}`}
                dateFormat="MMMM d, yyyy hh:mm aa"
                // minDate={new Date()}
                customInput={
                  createElement(SessionTimeInput, {
                    error: warning.sessionEnd,
                  }) as ReactNode
                }
                withPortal
                onKeyDown={(e) => e.preventDefault()}
                fixedHeight
                showTimeSelect
                // filterTime={isWeekday}
                // filterDate={isWeekday}
                timeIntervals={15}
                timeCaption="Time"
                timeFormat="p"
                tabIndex={1}
                showTimeInput
                // openToDate={new Date()}
                timeClassName={(date) => `${styles.time}`}
                required
              />
            </div>
          </div>
          <div className={styles.venueRow}>
            <label className={warning.venue ? styles.errorLabel : undefined}>
              Venue
            </label>
            <Select
              className={
                warning.venue
                  ? `${styles.venueInput} ${styles.errorInput}`
                  : `${styles.venueInput}`
              }
              classNamePrefix="session-create"
              name="venue"
              tabIndex={1}
              required={true}
              value={options.find(
                (option) => option.value === session?.venue?.id
              )}
              options={options}
              components={{ DropdownIndicator }}
              noOptionsMessage={({ inputValue }) => "No Venues Found"}
              isSearchable={true}
              onChange={(data) => handleSelectChange(data)}
              styles={{
                noOptionsMessage: (base) => ({
                  ...base,
                  color: `#FFFFFF`,
                  backgroundColor: "#4CAF50",
                }),
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              onFocus={() => disableWarning("venue")}
              menuPortalTarget={document.body}
            />
          </div>
          <div className={styles.lastRow}>
            <div className={styles.classesBox}>
              <div className={styles.top}>
                <label
                  className={
                    warning.classes.length > 0 ? styles.errorLabel : undefined
                  }
                >
                  Class{session?.classes?.length > 1 && "(es)"}
                </label>
                <IoIosAdd onClick={() => handleAdd("classes")} />
              </div>
              <div className={styles.bottom}>
                {session?.classes?.map((classe: string, index: number) => (
                  <div key={index} className={styles.classes}>
                    <input
                      name="classes"
                      className={
                        warning.classes.length > 0 &&
                        warning.classes?.includes(index)
                          ? `${styles.classesInput} ${styles.errorInput}`
                          : `${styles.classesInput}`
                      }
                      value={classe}
                      type="text"
                      required
                      tabIndex={1}
                      onFocus={() => disableWarning("classes", index)}
                      onChange={(e) => handleInputChange(e, index)}
                    />

                    {session.classes?.length > 1 && (
                      <MdDeleteOutline
                        title="Delete"
                        onClick={() => handleDelete("classes", index)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ColoredScrollbars>
      <div className={styles.navigateButtons}>
        <button
          type="button"
          onClick={handleNext}
          className={styles.nextButton}
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => {
            exitModal();
            dispatch(closeModal());
          }}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default Page1;
