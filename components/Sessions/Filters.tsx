import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/styles/session.module.scss";
import { Venue } from "@/types";
import { MdClose } from "react-icons/md";
import { capitalize } from "lodash";
import { formatISODateToDDMMYYYY } from "@/utils/functs";
import {
  mergeSessionFilters,
  setReload,
  updateSessionControls,
  updateSessionFilters,
} from "@/redux/slices/sessionSlice";

const Filters = () => {
  const { sessionsBox } = useSelector((state: any) => state.session);
  const { venues }: { venues: Venue[] } = useSelector(
    (state: any) => state.modal
  );
  const dispatch = useDispatch();

  const handleClose = (name: string) => {
    dispatch(updateSessionFilters({ name, value: name === "venue" ? 0 : "" }));
    dispatch(mergeSessionFilters());
    dispatch(updateSessionControls({ name: "page", value: 1 }));
    dispatch(setReload(true));
  };

  return (
    <>
      <div className={styles.sessionFilterValues}>
        {sessionsBox.query.venue > 0 &&
          venues.filter((venue) => venue.id === sessionsBox.query.venue)
            .length > 0 && (
            <div className={styles.filterValue}>
              <span>
                {
                  venues.filter(
                    (venue) => venue.id === sessionsBox.query.venue
                  )[0].name
                }
              </span>
              <MdClose onClick={() => handleClose("venue")} />
            </div>
          )}
        {sessionsBox.query.status !== "" && (
          <div className={styles.filterValue}>
            <span>{capitalize(sessionsBox.query.status)}</span>
            <MdClose onClick={() => handleClose("status")} />
          </div>
        )}
        {sessionsBox.query.startTime !== "" && (
          <div className={styles.filterValue}>
            <span className={styles.filterLighten}>Start:</span>
            <span>{formatISODateToDDMMYYYY(sessionsBox.query.startTime)}</span>
            <MdClose onClick={() => handleClose("startTime")} />
          </div>
        )}
        {sessionsBox.query.endTime !== "" && (
          <div className={styles.filterValue}>
            <span className={styles.filterLighten}>End:</span>
            <span>{formatISODateToDDMMYYYY(sessionsBox.query.endTime)}</span>
            <MdClose onClick={() => handleClose("endTime")} />
          </div>
        )}
      </div>
    </>
  );
};

export default Filters;
