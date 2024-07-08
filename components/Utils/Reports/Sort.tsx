import {
  ControlledMenu,
  MenuHeader,
  useHover,
  useMenuState,
} from "@szhsin/react-menu";
import { useRef } from "react";

import styles from "@/styles/menus.module.scss";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { BiSort } from "react-icons/bi";

import {
  mergeReportSort,
  setReload,
  updateReportSort,
} from "@/redux/slices/reportSlice";
import "react-datepicker/dist/react-datepicker.css";
import { MdSwitchLeft, MdSwitchRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Sort = () => {
  const { reportsBox } = useSelector((state: any) => state.report);
  const reportSortIconRef = useRef(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);

  const dispatch = useDispatch();

  const handleSortChange = (field: string | null, order: string | null) => {
    dispatch(setReload(true));
    dispatch(
      updateReportSort({
        field: field || reportsBox.sort.field,
        order: order || reportsBox.sort.order,
      })
    );
    dispatch(mergeReportSort());
  };

  return (
    <>
      <div
        ref={reportSortIconRef}
        {...anchorProps}
        className={
          menuState.state === "open"
            ? `${styles.reportSortIcon} ${styles.reportSortOpen}`
            : `${styles.reportSortIcon}`
        }
      >
        <BiSort />
        <span>Sort By</span>
      </div>
      <ControlledMenu
        {...hoverProps}
        {...menuState}
        anchorRef={reportSortIconRef}
        onClose={() => toggle(false)}
        transition
        menuClassName={styles.reportSortIconMenu}
        gap={10}
        // portal={{
        //   target: document.body,
        //   stablePosition: true,
        // }}
        align="end"
        arrow={false}
        // onItemClick={({ value }) => handleDateChange(value)}
      >
        <MenuHeader className={styles.reportSortIconMenuFields}>
          <label
            className={`${styles.label} ${
              reportsBox.sort.field === "session_id"
                ? styles.selected
                : styles.unselected
            }`}
          >
            <input
              type="radio"
              name="sortField"
              value="session_id"
              checked={reportsBox.sort.field === "session_id"}
              onChange={() => handleSortChange("session_id", null)}
              className={styles.radioInput}
            />
            Session ID
          </label>
          <label
            className={`${styles.label} ${
              reportsBox.sort.field === "timestamp"
                ? styles.selected
                : styles.unselected
            }`}
          >
            <input
              type="radio"
              name="sortField"
              value="timestamp"
              checked={reportsBox.sort.field === "timestamp"}
              onChange={() => handleSortChange("timestamp", null)}
              className={styles.radioInput}
            />
            Timestamp
          </label>
          <label
            className={`${styles.label} ${
              reportsBox.sort.field === "id"
                ? styles.selected
                : styles.unselected
            }`}
          >
            <input
              type="radio"
              name="sortField"
              value="id"
              checked={reportsBox.sort.field === "id"}
              onChange={() => handleSortChange("id", null)}
              className={styles.radioInput}
            />
            ID
          </label>
        </MenuHeader>
        <MenuHeader className={styles.reportSortIconMenuFooter}>
          {reportsBox.sort.order === "asc" ? (
            <div
              className={styles.ascendingSwitch}
              onClick={() => handleSortChange(null, "desc")}
            >
              <span>Ascending</span>
              <MdSwitchLeft />
            </div>
          ) : (
            <div
              className={styles.descendingSwitch}
              onClick={() => handleSortChange(null, "asc")}
            >
              <span>Descending</span>
              <MdSwitchRight />
            </div>
          )}
        </MenuHeader>
      </ControlledMenu>
    </>
  );
};

export default Sort;
