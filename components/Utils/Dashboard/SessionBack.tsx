"use client";

import { cameraVenues, sessionBackOptions } from "@/data/select";
import { setReload, setSessionsBack } from "@/redux/slices/dashboardSlice";
import styles from "@/styles/setting.module.scss";
import { DashboardState, SelectOption } from "@/types";
import { TiArrowUnsorted } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import Select, { DropdownIndicatorProps, components } from "react-select";

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, true>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <TiArrowUnsorted fontSize={15} color="#FFF" />
    </components.DropdownIndicator>
  );
};

const SessionBack = () => {
  const { sessionsBack }: DashboardState = useSelector(
    (state: any) => state.dashboard
  );

  const dispatch = useDispatch();

  const handleSelectChange = (data: any) => {
    dispatch(setSessionsBack(data?.value || sessionsBack));
    dispatch(setReload({ name: "reportsPerSession", value: true }));
  };

  return (
    <>
      <div className={styles.sessionsBack}>
        <Select
          className={`${styles.sessionsBackInput}`}
          classNamePrefix="cameras-edit"
          name="sessions_back"
          tabIndex={1}
          menuPlacement="auto"
          value={sessionBackOptions().filter(
            (option: any) => option.value === sessionsBack
          )}
          options={sessionBackOptions()}
          components={{ DropdownIndicator }}
          noOptionsMessage={({ inputValue }) => "No Option Found"}
          isSearchable={false}
          onChange={(data) => handleSelectChange(data)}
          styles={{
            noOptionsMessage: (base) => ({
              ...base,
              color: `#FFFFFF`,
              backgroundColor: "#4CAF50",
            }),
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          // menuPortalTarget={document.body}
        />
      </div>
    </>
  );
};

export default SessionBack;
