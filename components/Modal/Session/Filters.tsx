"use client";
import React from "react";
import { MdClose } from "react-icons/md";
import styles from "@/styles/modal.module.scss";
import { useModal } from "@/utils/context";

import { statusOptions, venueOptions } from "@/data/select";
import {
  mergeSessionFilters,
  updateSessionControls,
  updateSessionFilters,
} from "@/redux/slices/sessionSlice";
import { MdClear, MdOutlineArrowDropDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Select, { components, DropdownIndicatorProps } from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarNumber } from "react-icons/io5";
import { SelectOption } from "@/types";
import {
  createElement,
  forwardRef,
  ReactNode,
  useEffect,
  useState,
} from "react";

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
  type: string;
  onClick?: () => void; // onClick can be undefined if not provided by DatePicker
  handleClearDate: (name: string) => void;
}

const SessionTimeInput = forwardRef<HTMLDivElement, SessionTimeInputProps>(
  ({ value, onClick, handleClearDate, type }, ref) => (
    <div className={`${styles.filterSessionTime}`} onClick={onClick} ref={ref}>
      {value ? (
        <span>{value}</span>
      ) : (
        <span className={styles.placeholder}>
          {type === "startTime" ? "Start Date" : "End Date"}
        </span>
      )}
      <div className={`${styles.timeIcons}`}>
        {value && (
          <MdClear
            onClick={(e) => {
              e.stopPropagation();
              handleClearDate(type);
            }}
          />
        )}
        {!value && <IoCalendarNumber />}
      </div>
    </div>
  )
);

SessionTimeInput.displayName = "SessionTimeInput";

const Filters = () => {
  const { exitModal } = useModal();
  const dispatch = useDispatch();
  const { sessionsBox, reload, isDisabled } = useSelector(
    (state: any) => state.session
  );
  const { venues } = useSelector((state: any) => state.modal);
  const [isClient, setIsClient] = useState(false);
  const handleSelectChange = (data: any, name: string) => {
    dispatch(updateSessionFilters({ name, value: data?.value ?? 0 }));
  };

  const handleFilterSubmit = () => {
    dispatch(mergeSessionFilters());
    dispatch(updateSessionControls({ name: "page", value: 1 }));
    exitModal();
  };

  const handleClearDate = (name: string) => {
    dispatch(updateSessionFilters({ name, value: "" }));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <div className={styles.sessionContainerFilter}>
        <span className={styles.closeIcon}>
          <MdClose onClick={() => exitModal()} />
        </span>
        <div className={styles.filterColumn}>
          <Select
            className={styles.venueInput}
            classNamePrefix="filter-select"
            name="venue"
            tabIndex={1}
            value={venueOptions(venues).filter(
              (venue) => venue?.value === sessionsBox?.filter?.venue
            )}
            components={{ DropdownIndicator }}
            noOptionsMessage={({ inputValue }) => "No Venues Found"}
            isClearable={true}
            isSearchable={false}
            onChange={(data) => handleSelectChange(data, "venue")}
            styles={{
              noOptionsMessage: (base) => ({
                ...base,
                color: `#FFFFFF`,
                backgroundColor: "#4CAF50",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            options={venueOptions(venues)}
            placeholder={"Select Venue"}
            menuPortalTarget={isClient ? document.body : null}
          />
          <Select
            className={styles.statusInput}
            classNamePrefix="filter-select"
            name="status"
            tabIndex={1}
            value={statusOptions().filter(
              (status) => status?.value === sessionsBox?.filter?.status
            )}
            components={{ DropdownIndicator }}
            noOptionsMessage={({ inputValue }) => "No Status Available"}
            isClearable={true}
            isSearchable={false}
            onChange={(data) => handleSelectChange(data, "status")}
            styles={{
              noOptionsMessage: (base) => ({
                ...base,
                color: `#FFFFFF`,
                backgroundColor: "#4CAF50",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            options={statusOptions()}
            placeholder={"Select Status"}
            menuPortalTarget={isClient ? document.body : null}
          />
          <DatePicker
            selected={
              sessionsBox.filter.startTime.length > 0
                ? new Date(sessionsBox.filter.startTime)
                : null
            }
            onChange={(date: Date) => {
              dispatch(
                updateSessionFilters({
                  name: "startTime",
                  value: date?.toISOString(),
                })
              );
            }}
            calendarClassName={styles.calendar}
            className={styles.filterSessionStart}
            dayClassName={() => `${styles.day}`}
            dateFormat="dd/MM/YYYY"
            customInput={
              createElement(SessionTimeInput, {
                handleClearDate,
                type: "startTime",
              }) as ReactNode
            }
            withPortal
            onKeyDown={(e) => e.preventDefault()}
            fixedHeight
            tabIndex={1}
            required
          />
          <DatePicker
            selected={
              sessionsBox.filter.endTime.length > 0
                ? new Date(sessionsBox.filter.endTime)
                : null
            }
            onChange={(date: Date) => {
              dispatch(
                updateSessionFilters({
                  name: "endTime",
                  value: date?.toISOString(),
                })
              );
            }}
            calendarClassName={styles.calendar}
            className={styles.filterSessionEnd}
            dayClassName={() => `${styles.day}`}
            dateFormat="dd/MM/YYYY"
            customInput={
              createElement(SessionTimeInput, {
                handleClearDate,
                type: "endTime",
              }) as ReactNode
            }
            withPortal
            onKeyDown={(e) => e.preventDefault()}
            fixedHeight
            tabIndex={1}
            required
          />
        </div>
        <div
          role="button"
          title="Filter"
          className={`${styles.filterButton} ${
            reload || isDisabled ? styles.filterButton : ""
          }`}
          onClick={handleFilterSubmit}
        >
          Filter
        </div>
      </div>
    </>
  );
};

export default Filters;
