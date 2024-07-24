"use client";
import CameraScrollbars from "@/components/Utils/Settings/CameraScrollbars";
import { setReload } from "@/redux/slices/settingSlice";
import styles from "@/styles/setting.module.scss";
import { Camera, SettingState, Venue } from "@/types";
import { isEqual, uniq } from "lodash";
import { useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import {
  MdDelete,
  MdOutlineRedo,
  MdOutlineSave,
  MdOutlineUndo,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { toast } from "react-toastify";

import { SelectOption } from "@/types";
import { MdOutlineArrowDropDown } from "react-icons/md";
import Select, { DropdownIndicatorProps, components } from "react-select";
import { cameraOptions, cameraVenues } from "@/data/select";
import { TbCameraPlus } from "react-icons/tb";
import { base } from "@faker-js/faker";
import { useAction } from "next-safe-action/hooks";
import { editCameras } from "@/server/actions/cameras";

// import { AnimatePresence, motion } from "framer-motion";

const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, true>
) => {
  return (
    <components.DropdownIndicator {...props}>
      <MdOutlineArrowDropDown fontSize={24} color="#FFFFFF" />
    </components.DropdownIndicator>
  );
};

const Edit = ({ setMode }: any) => {
  const { cameras, venues }: SettingState = useSelector(
    (state: any) => state.setting
  );

  const dispatch = useDispatch();
  const [originalCameras] = useState(cameras);
  const [displayCameras, setDisplayCameras] = useState(cameras);
  const [history, setHistory] = useState<any>([displayCameras]);
  const [pointer, setPointer] = useState(0);
  const [event, setEvent] = useState("");
  const [save, setSave] = useState(false);

  const { execute, status, result } = useAction(editCameras, {
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

    setDisplayCameras(() => {
      const newCameras = history[pointer - 1];
      return newCameras;
    });

    setEvent("undo");
  };

  const handleReset = () => {
    setDisplayCameras(() => {
      return originalCameras;
    });

    setEvent("reset");
  };

  const handleRedo = () => {
    if (pointer === history.length - 1) return;

    setDisplayCameras(() => {
      const newCameras = history[pointer + 1];
      return newCameras;
    });

    setEvent("redo");
  };

  const handleAdd = () => {
    setDisplayCameras((prevCameras: any) => {
      const newCameras = [
        ...prevCameras,
        { name: "", venue_id: 0, status: "Active" },
      ];
      console.log(newCameras);
      return newCameras;
    });
    setEvent("add");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    setDisplayCameras((prevCameras) => {
      const newCameras = prevCameras.map((camera: any, position: number) => {
        if (position === index) {
          return { ...camera, name: value };
        }
        return camera;
      });

      return newCameras;
    });
    setEvent("input");
    setSave(Math.floor(Math.random() * 10) >= 5);
  };

  const handleDelete = (index: number) => {
    setDisplayCameras((prevCameras) => {
      const newCameras = prevCameras.filter(
        (camera: any, position: number) => position !== index
      );
      return newCameras;
    });
    setEvent("delete");
  };

  const handleSelectChange = (data: any, index: number, type: string) => {
    // setSessionVal((prevValue: SessionEdit) => ({
    //   ...prevValue,
    //   venue: {
    //     id: data?.value ?? 0,
    //     name: data?.label ?? "",
    //   },
    // }));
    setDisplayCameras((prevCameras) => {
      const newCameras = prevCameras.map((camera: any, position: number) => {
        if (position === index) {
          return { ...camera, [type]: data?.value };
        }
        return camera;
      });

      return newCameras;
    });
    setEvent("input");
    setSave(true);
  };

  const handleSave = async () => {
    if (isEqual(originalCameras, displayCameras)) {
      setMode("view");
      toast.info("No changes made");
      return;
    }

    const cameraNames = displayCameras.map((camera) => camera.name);
    const uniqueCameraNames = uniq(cameraNames);

    if (uniqueCameraNames.length !== cameraNames.length) {
      toast.error("Duplicate camera names found.");
      return;
    }

    dispatch(setReload(true));

    const deleted = originalCameras.filter(
      (origCamera) =>
        !displayCameras.some((camera) => camera.id === origCamera.id)
    );

    const updated = displayCameras.filter((camera) =>
      originalCameras.some(
        (origCamera) =>
          origCamera.id === camera.id && !isEqual(origCamera, camera)
      )
    );

    const added = displayCameras.filter((camera) => !camera.id);

    // execute({
    //   deleted: deleted.map((camera) => camera.id),
    //   updated,
    //   added,
    // });
    setMode("view");
  };

  useEffect(() => {
    if (event === "add" || event === "delete") {
      setHistory((prevHistory: any) => {
        const newHistory =
          pointer !== prevHistory.length - 1
            ? [
                ...prevHistory.slice(0, pointer < 0 ? 1 : pointer + 1),
                displayCameras,
              ]
            : [...prevHistory, displayCameras];
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
        return [originalCameras];
      });
      setPointer(0);
    } else if (event === "input" && save) {
      setHistory((prevHistory: any) => {
        const newHistory = [...prevHistory, displayCameras];
        return newHistory;
      });
    }
  }, [displayCameras, event, save]);

  useEffect(() => {
    if (event === "add" || event === "delete") setPointer(history.length - 1);
    if (event === "input" && save) setPointer(history.length - 1);
  }, [history, event, save]);

  return (
    <>
      <div className={styles.settingContentCameraEdit}>
        <div className={styles.camerasPane}>
          <ScrollSync>
            <div className={styles.settingCameraTable}>
              <div className={styles.settingCameraTableHeader}>
                <ScrollSyncPane>
                  <div className={styles.headerContent}>
                    <span className={styles.actions}></span>
                    <span className={styles.name}>Name</span>
                    <span className={styles.venue}>Venue</span>
                    <span className={styles.status}>Status</span>
                  </div>
                </ScrollSyncPane>
              </div>
              <CameraScrollbars
                className={styles.bodyContainer}
                autoHeight={true}
                autoHeightMin={180}
                autoHeightMax={"100%"}
                autoHide={true}
                autoHideTimeout={1000}
              >
                <div className={styles.camerasRows}>
                  {displayCameras?.length > 0 ? (
                    displayCameras?.map((camera: Camera, index: number) => (
                      <div
                        className={styles.camerasRowOuter}
                        key={index}
                        // style={{
                        //   opacity: 0,
                        //   animation: `slideIn 0.5s ease-out forwards`,
                        //   animationDelay: `${index * 0.2}s`,
                        // }}
                      >
                        <ScrollSyncPane>
                          <div
                            className={`${styles.camerasRowInner} hide-scrollbar`}
                          >
                            <span className={styles.actions}>
                              <MdDelete onClick={() => handleDelete(index)} />
                            </span>
                            <span className={styles.name}>
                              <input
                                value={camera.name}
                                onChange={(e) => handleInputChange(e, index)}
                                placeholder="Enter venue"
                                autoFocus={index === cameraVenues.length - 1}
                              />
                            </span>
                            <span className={styles.venue}>
                              {/* {camera.venue.name} */}
                              <Select
                                className={`${styles.venueInput}`}
                                classNamePrefix="cameras-edit"
                                name="venue"
                                tabIndex={1}
                                required={true}
                                menuPlacement="auto"
                                value={cameraVenues(venues).filter(
                                  (venue: any) =>
                                    venue.value === camera.venue_id
                                )}
                                options={cameraVenues(venues)}
                                components={{ DropdownIndicator }}
                                noOptionsMessage={({ inputValue }) =>
                                  "No Venues Found"
                                }
                                isSearchable={true}
                                onChange={(data) =>
                                  handleSelectChange(data, index, "venue_id")
                                }
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
                                menuPortalTarget={document.body}
                              />
                            </span>
                            <span className={`${styles.status}`}>
                              {/* {camera.status} */}
                              <Select
                                className={`${styles.statusInput}`}
                                classNamePrefix="cameras-edit"
                                name="status"
                                tabIndex={1}
                                required={true}
                                menuPlacement="auto"
                                value={cameraOptions().filter(
                                  (venue: any) =>
                                    venue.value === camera.status.toLowerCase()
                                )}
                                options={cameraOptions()}
                                components={{ DropdownIndicator }}
                                noOptionsMessage={({ inputValue }) =>
                                  "No Status Found"
                                }
                                isSearchable={false}
                                onChange={(data) =>
                                  handleSelectChange(data, index, "status")
                                }
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
                                menuPortalTarget={document.body}
                              />
                            </span>
                          </div>
                        </ScrollSyncPane>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noCameras}>Add a camera</div>
                  )}
                </div>
              </CameraScrollbars>
            </div>
          </ScrollSync>
        </div>
        <div className={styles.editToolbar}>
          <span onClick={handleAdd}>
            <TbCameraPlus />
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
