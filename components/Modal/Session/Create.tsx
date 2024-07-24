"use client";

import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";
import { filterPassedTime, isWeekday } from "@/utils/dates";

import { SessionWarn, SelectOption } from "@/types";
import {
  createElement,
  forwardRef,
  ReactNode,
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
  MdOutlineArrowDropDown,
  MdInfoOutline,
} from "react-icons/md";
import Select, { components, DropdownIndicatorProps } from "react-select";
import ColoredScrollbars from "@/components/Utils/ColoredScrollbars";
import Button from "@/components/Utils/Button";
import { venueOptions } from "@/data/select";

// import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAction } from "next-safe-action/hooks";
import { createSession } from "@/server/actions/sessions";
import { SessionInput } from "@/lib/schema";
import Loader from "@/components/Utils/Loader";

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
        <span className={styles.placeholder}>10:30</span>
      )}
      <MdAccessTime />
    </div>
  )
);

SessionTimeInput.displayName = "SessionTimeInput";

const Create: React.FC = () => {
  const { exitModal } = useModal();
  const { venues } = useSelector((state: any) => state.modal);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [values, setValues] = useState<SessionInput>({
    courseNames: [""],
    courseCodes: [""],
    classes: [""],
    venue: 0,
    sessionStart: null,
    sessionEnd: null,
    invigilators: [""],
  });

  const [warning, setWarning] = useState<SessionWarn>({
    courseNames: [],
    courseCodes: [],
    classes: [],
    venue: false,
    sessionStart: false,
    sessionEnd: false,
    invigilators: [],
  });

  const { execute, result, status } = useAction(createSession, {
    onSuccess: (data) => {
      if (data?.success) toast.success(data?.success);
      if (data?.error) toast.error(data?.error);
    },
    onError: (error) => {
      console.log(error);
      if (error.serverError) toast.error("Server Error");
    },
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    position: number
  ) => {
    const { name, value } = e.target;

    setValues((prevValue) => ({
      ...prevValue,
      [name]: (prevValue[name as keyof SessionInput] as string[]).map(
        (item, index) => (index === position ? value : item)
      ),
    }));
  };

  const handleSelectChange = (data: any) => {
    setValues((prevValue) => ({
      ...prevValue,
      venue: data.value ?? "",
    }));
  };

  const handleDelete = (name: string, position: number) => {
    switch (name) {
      case "courseNames":
        setValues((prevValue) => ({
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
        setValues((prevValue) => ({
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
        setValues((prevValue) => ({
          ...prevValue,
          courseNames: [...prevValue.courseNames, ""],
          courseCodes: [...prevValue.courseCodes, ""],
        }));
        break;
      default:
        setValues((prevValue) => ({
          ...prevValue,
          [name]: [...(prevValue[name as keyof SessionInput] as string[]), ""],
        }));
        break;
    }
  };

  const validateInputs = () => {
    const coursenameIndexes = values.courseNames.reduce<number[]>(
      (acc, course, index) => {
        if (!course) acc.push(index);
        return acc;
      },
      []
    );

    const coursecodeIndexes = values.courseCodes.reduce<number[]>(
      (acc, code, index) => {
        if (!code) acc.push(index);
        return acc;
      },
      []
    );

    const classesIndexes = values.classes.reduce<number[]>(
      (acc, classe, index) => {
        if (!classe) acc.push(index);
        return acc;
      },
      []
    );

    const invigilatorsIndexes = values.invigilators.reduce<number[]>(
      (acc, invigilator, index) => {
        if (!invigilator) acc.push(index);
        return acc;
      },
      []
    );

    const venueState = values.venue === 0;
    const sessionStartState = values.sessionStart === null;
    const sessionEndState = values.sessionEnd === null;

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = validateInputs();

    if (!valid) return;

    if (
      values.sessionEnd &&
      values.sessionStart &&
      values.sessionEnd < values.sessionStart
    ) {
      toast.error("Session End less than Session Start");
      setError("Session End less than Session Start");
      return;
    }

    execute(values);
  };

  useEffect(() => {
    const updateOptions = async () => {
      const updatedOpts = await venueOptions(
        venues, // Replace with your venues array
        values.sessionStart,
        values.sessionEnd
      );
      setOptions(updatedOpts.filter((opt) => !opt.isDeleted));
    };

    updateOptions();
  }, [venues, values.sessionStart, values.sessionEnd]);

  useEffect(() => {
    if (status === "hasSucceeded" && result?.data?.success) exitModal();
  }, [status, exitModal]);

  return (
    <>
      <form
        className={styles.sessionContainerCreate}
        // onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {status === "executing" && <Loader />}
        {status !== "executing" && (
          <span className={styles.closeIcon}>
            <MdClose onClick={() => exitModal()} />
          </span>
        )}
        <div className={styles.header}>
          <h2>Create Session</h2>
        </div>
        {/* <AnimatePresence> */}
        {error && (
          // <motion.div
          //   animate={{ opacity: 1 }}
          //   initial={{ opacity: 0 }}
          //   exit={{ opacity: 0 }}
          //   transition={{ ease: "easeInOut", duration: 1 }}
          // className={styles.errorBox}
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
                    Course Name{values.courseNames.length > 1 && "(s)"}
                  </label>
                  <IoIosAdd onClick={() => handleAdd("courseNames")} />
                </div>
                <div className={styles.bottom}>
                  {values.courseNames?.map((course: string, index: number) => (
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
                        placeholder="Computer Networking"
                        onFocus={() => disableWarning("courseNames", index)}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                      {values.courseNames?.length > 1 && (
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
                    Course Code{values.courseCodes.length > 1 && "(s)"}
                  </label>

                  <IoIosAdd style={{ visibility: "hidden" }} />
                </div>
                <div className={styles.bottom}>
                  {values.courseCodes?.map((code: string, index: number) => (
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
                        placeholder="COE 471"
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
                  className={
                    warning.sessionStart ? styles.errorLabel : undefined
                  }
                >
                  Session Start
                </label>
                <DatePicker
                  selected={values.sessionStart}
                  onChange={(date: Date) => {
                    disableWarning("sessionStart");
                    setValues((prevValue) => ({
                      ...prevValue,
                      sessionStart: date,
                    }));
                  }}
                  calendarClassName={styles.calendar}
                  className={styles.sessionStart}
                  dayClassName={() => `${styles.day}`}
                  dateFormat="MMMM d, yyyy hh:mm aa"
                  minDate={new Date()}
                  customInput={
                    createElement(SessionTimeInput, {
                      error: warning.sessionStart,
                    }) as ReactNode
                  }
                  withPortal
                  onKeyDown={(e) => e.preventDefault()}
                  fixedHeight
                  showTimeSelect
                  showTimeInput
                  tabIndex={1}
                  filterTime={isWeekday}
                  filterDate={isWeekday}
                  timeIntervals={5}
                  timeCaption="Time"
                  timeFormat="p"
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
                  selected={values.sessionEnd}
                  onChange={(date: Date) => {
                    disableWarning("sessionEnd");
                    setValues((prevValue) => ({
                      ...prevValue,
                      sessionEnd: date,
                    }));
                  }}
                  calendarClassName={styles.calendar}
                  className={styles.sessionEnd}
                  dayClassName={() => `${styles.day}`}
                  dateFormat="MMMM d, yyyy hh:mm aa"
                  minDate={new Date()}
                  customInput={
                    createElement(SessionTimeInput, {
                      error: warning.sessionEnd,
                    }) as ReactNode
                  }
                  withPortal
                  onKeyDown={(e) => e.preventDefault()}
                  fixedHeight
                  showTimeSelect
                  showTimeInput
                  filterTime={filterPassedTime}
                  filterDate={isWeekday}
                  timeIntervals={15}
                  timeCaption="Time"
                  timeFormat="p"
                  tabIndex={1}
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
                value={options.find((option) => option.value === values.venue)}
                components={{ DropdownIndicator }}
                noOptionsMessage={({ inputValue }) => "No Venues Found"}
                isSearchable={true}
                onChange={handleSelectChange}
                styles={{
                  noOptionsMessage: (base) => ({
                    ...base,
                    color: `#FFFFFF`,
                    backgroundColor: "#4CAF50",
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                onFocus={() => disableWarning("venue")}
                options={options}
                placeholder={"Venue"}
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
                    Class{values.classes.length > 1 && "(es)"}
                  </label>
                  <IoIosAdd onClick={() => handleAdd("classes")} />
                </div>
                <div className={styles.bottom}>
                  {values.classes?.map((classe: string, index: number) => (
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
                        placeholder="COE 4"
                        onFocus={() => disableWarning("classes", index)}
                        onChange={(e) => handleInputChange(e, index)}
                      />

                      {values.classes?.length > 1 && (
                        <MdDeleteOutline
                          title="Delete"
                          onClick={() => handleDelete("classes", index)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.invigilatorsBox}>
                <div className={styles.top}>
                  <label
                    className={
                      warning.invigilators.length > 0
                        ? styles.errorLabel
                        : undefined
                    }
                  >
                    Invigilator{values.invigilators.length > 1 && "(s)"}
                  </label>

                  <IoIosAdd onClick={() => handleAdd("invigilators")} />
                </div>
                <div className={styles.bottom}>
                  {values.invigilators?.map(
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
                          placeholder="John Doe"
                          required
                          tabIndex={1}
                          onFocus={() => disableWarning("invigilators", index)}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                        {values.invigilators?.length > 1 && (
                          <MdDeleteOutline
                            title="Delete"
                            onClick={() => handleDelete("invigilators", index)}
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </ColoredScrollbars>
        <Button
          message="Create"
          buttonClass={styles.submit}
          disabled={status === "executing"}
        />
      </form>
    </>
  );
};

export default Create;
