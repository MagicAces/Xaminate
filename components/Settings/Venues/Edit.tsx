"use client";

import styles from "@/styles/setting.module.scss";
import { Venue } from "@/types";
import { useEffect, useState } from "react";
import {
  MdDelete,
  MdAddLocationAlt,
  MdOutlineUndo,
  MdOutlineRedo,
  MdOutlineSave,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { BiReset } from "react-icons/bi";
import { toast } from "react-toastify";

import { isEqual, uniq } from "lodash";
import { useAction } from "next-safe-action/hooks";
import { editVenues } from "@/server/actions/venues";
import { setReload } from "@/redux/slices/settingSlice";
import Loader from "@/components/Utils/Loader";

const Edit = ({ setMode }: { setMode: any }) => {
  const { venues }: { venues: Venue[] } = useSelector(
    (state: any) => state.setting
  );
  const dispatch = useDispatch();
  const [originalVenues] = useState(venues);
  const [displayVenues, setDisplayVenues] = useState(venues);
  const [history, setHistory] = useState<any>([displayVenues]);
  const [pointer, setPointer] = useState(0);
  const [event, setEvent] = useState("");
  const [save, setSave] = useState(false);

  const { execute, status, result } = useAction(editVenues, {
    onSuccess: (data: any) => {
      if (data?.success) toast.success(data?.success);
      if (data?.error) toast.error(data?.error);
    },
    onError: (error) => {
      console.log(error);
      dispatch(setReload(false));
      if (error.serverError) toast.error("Server Error");
    },
  });

  const handleUndo = () => {
    if (pointer <= 0) return;

    setDisplayVenues(() => {
      const newVenues = history[pointer - 1];
      return newVenues;
    });

    setEvent("undo");
  };

  const handleReset = () => {
    setDisplayVenues(() => {
      return originalVenues;
    });

    setEvent("reset");
  };

  const handleRedo = () => {
    if (pointer === history.length - 1) return;

    setDisplayVenues(() => {
      const newVenues = history[pointer + 1];
      return newVenues;
    });

    setEvent("redo");
  };

  const handleAdd = () => {
    setDisplayVenues((prevVenues: any) => {
      const newVenues = [...prevVenues, { name: "" }];
      return newVenues;
    });
    setEvent("add");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    setDisplayVenues((prevVenues) => {
      const newVenues = prevVenues.map((venue: any, position: number) => {
        if (position === index) {
          return { ...venue, name: value };
        }
        return venue;
      });

      return newVenues;
    });
    setEvent("input");
    setSave(Math.floor(Math.random() * 10) >= 5);
  };

  const handleDelete = (index: number) => {
    setDisplayVenues((prevVenues) => {
      const newVenues = prevVenues.filter(
        (venue: any, position: number) => position !== index
      );
      return newVenues;
    });
    setEvent("delete");
  };

  const handleSave = async () => {
    if (isEqual(originalVenues, displayVenues)) {
      setMode("view");
      toast.info("No changes made");
      return;
    }

    const venueNames = displayVenues.map((venue) => venue.name);
    const uniqueVenueNames = uniq(venueNames);

    if (uniqueVenueNames.length !== venueNames.length) {
      toast.error("Duplicate venue names found.");
      return;
    }

    const deleted = originalVenues.filter(
      (origVenue) => !displayVenues.some((venue) => venue.id === origVenue.id)
    );

    const updated = displayVenues.filter((venue) =>
      originalVenues.some(
        (origVenue) => origVenue.id === venue.id && !isEqual(origVenue, venue)
      )
    );

    const added = displayVenues.filter((venue) => !venue.id);

    // dispatch(setReload(true));
    execute({
      deleted: deleted.map((venue) => venue.id),
      updated,
      added,
    });
  };

  useEffect(() => {
    if (event === "add" || event === "delete") {
      setHistory((prevHistory: any) => {
        const newHistory =
          pointer !== prevHistory.length - 1
            ? [
                ...prevHistory.slice(0, pointer < 0 ? 1 : pointer + 1),
                displayVenues,
              ]
            : [...prevHistory, displayVenues];
        return newHistory.slice(-50);
      });
    } else if (event === "undo") {
      setPointer((prevPointer) => {
        if (prevPointer > 0) {
          return prevPointer - 1;
        }
        return 0;
      });
    } else if (event === "redo") {
      setPointer((prevPointer) => {
        if (prevPointer < history.length - 1) {
          return prevPointer + 1;
        }
        return history.length - 1;
      });
    } else if (event === "reset") {
      setHistory(() => {
        return [originalVenues];
      });
      setPointer(0);
    } else if (event === "input" && save) {
      setHistory((prevHistory: any) => {
        const newHistory = [...prevHistory, displayVenues];
        return newHistory;
      });
    }
  }, [displayVenues, event, save]);

  useEffect(() => {
    if (event === "add" || event === "delete") setPointer(history.length - 1);
    if (event === "input" && save) setPointer(history.length - 1);
  }, [history, event, save]);

  useEffect(() => {
    if (status === "hasSucceeded" && result?.data?.success) {
      setMode("view");
      dispatch(setReload(true));
    }
  }, [status, result, dispatch]);

  return (
    <>
      <div className={styles.settingContentVenueEdit}>
        {status === "executing" && <Loader curved={true} />}
        {venues?.filter((venue: Venue) => !venue.deleted).length > 0 ? (
          <div className={styles.venues}>
            {displayVenues
              .filter((venue: Venue) => !venue.deleted)
              .map((venue: any, index: number) => (
                <div className={styles.venue} key={index}>
                  <input
                    value={venue.name}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder="Enter venue"
                    autoFocus={index === displayVenues.length - 1}
                  />
                  <MdDelete onClick={() => handleDelete(index)} />
                </div>
              ))}
          </div>
        ) : (
          <div className={styles.noVenues}>Add a venue</div>
        )}
        <div className={styles.editToolbar}>
          <span onClick={handleAdd}>
            <MdAddLocationAlt />
          </span>
          <span
            className={
              history.length === 1 || pointer === 0 ? styles.disabled : ""
            }
            onClick={handleUndo}
          >
            <MdOutlineUndo />
          </span>
          <span
            className={history.length === 1 ? styles.disabled : ""}
            onClick={handleReset}
          >
            <BiReset />
          </span>
          <span
            className={history.length - 1 === pointer ? styles.disabled : ""}
            onClick={handleRedo}
          >
            <MdOutlineRedo />
          </span>
          <span onClick={handleSave}>
            <MdOutlineSave />
          </span>
        </div>
      </div>
    </>
  );
};

export default Edit;
