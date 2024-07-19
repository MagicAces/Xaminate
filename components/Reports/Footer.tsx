"use client";

import { limitOptions } from "@/data/select";
import { setReload, updateReportControls } from "@/redux/slices/reportSlice";
import { ReportSlice, SelectOption } from "@/types";
import styles from "@/styles/report.module.scss";
import { MdOutlineArrowDropDown } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import Select, { components, DropdownIndicatorProps } from "react-select";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, true>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <MdOutlineArrowDropDown fontSize={24} color="#4CAF50" />
    </components.DropdownIndicator>
  );
};

const Footer = () => {
  const { reportsBox, data }: ReportSlice = useSelector(
    (state: any) => state.report
  );
  const [client, setClient] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <>
      <div className={styles.reportContentFooter}>
        <div className={styles.reportContainerFooterPages}>
          <Select
            className={`${styles.limitInput}`}
            classNamePrefix="report-limit"
            name="limit"
            tabIndex={1}
            value={limitOptions().find(
              (option) => option.value === reportsBox.query.limit
            )}
            components={{ DropdownIndicator }}
            noOptionsMessage={({ inputValue }) => "No Limits Found"}
            isSearchable={false}
            isClearable={false}
            onChange={(data: any) => {
              dispatch(
                updateReportControls({ name: "limit", value: data?.value })
              );
              dispatch(updateReportControls({ name: "page", value: 1 }));
              dispatch(setReload(true));
            }}
            styles={{
              noOptionsMessage: (base) => ({
                ...base,
                color: `#FFFFFF`,
                backgroundColor: "#4CAF50",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            options={limitOptions()}
            placeholder={"Rows per page"}
            // menuPortalTarget={client ? document.body : null}
            menuPlacement="top"
          />
        </div>
        <div className={styles.reportContentFooterNavigation}>
          <div className={styles.navText}>
            <span className={styles.navRows}>
              <span>
                {(reportsBox.query.page - 1) * reportsBox.query.limit + 1}
              </span>
              <span>-</span>
              <span>
                {data?.totalCount ? (
                  reportsBox.query.page * reportsBox.query.limit >
                  data?.totalCount ? (
                    data?.totalCount
                  ) : (
                    reportsBox.query.page * reportsBox.query.limit
                  )
                ) : (
                  <Skeleton
                    baseColor="#2C2C2C"
                    highlightColor="#505050"
                    width={15}
                    height={15}
                    style={{ borderRadius: "0.1rem" }}
                  />
                )}{" "}
              </span>
            </span>
            <span className={styles.totalCount}>
              of{" "}
              {data?.totalCount || (
                <Skeleton
                  baseColor="#2C2C2C"
                  highlightColor="#505050"
                  width={15}
                  height={15}
                  style={{ borderRadius: "0.1rem" }}
                />
              )}
            </span>
          </div>
          {data ? (
            <div className={styles.navButtons}>
              <span
                className={`${styles.navButtonsLeft} ${
                  !data?.hasPrevPage ? styles.disabledButton : ""
                }`}
                onClick={() => {
                  if (data?.hasPrevPage)
                    dispatch(
                      updateReportControls({
                        name: "page",
                        value: reportsBox.query.page - 1,
                      })
                    );
                }}
              >
                <MdKeyboardArrowLeft fontSize={20} />
              </span>
              <span
                className={`${styles.navButtonsLeft} ${
                  !data?.hasNextPage ? styles.disabledButton : ""
                }`}
                onClick={() => {
                  if (data?.hasNextPage)
                    dispatch(
                      updateReportControls({
                        name: "page",
                        value: reportsBox.query.page + 1,
                      })
                    );
                }}
              >
                <MdKeyboardArrowRight fontSize={20} />
              </span>
            </div>
          ) : (
            <Skeleton
              baseColor="#2C2C2C"
              highlightColor="#505050"
              className={styles.navButtons}
              style={{ borderRadius: "0.1rem" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Footer;
