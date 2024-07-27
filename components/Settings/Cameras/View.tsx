"use client";
import CameraScrollbars from "@/components/Utils/Settings/CameraScrollbars";
import CameraTooltip from "@/components/Utils/Settings/CameraTooltip";
import styles from "@/styles/setting.module.scss";
import { Camera } from "@/types";
import { useSelector } from "react-redux";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

const View = () => {
  const { cameras }: { cameras: Camera[] } = useSelector(
    (state: any) => state.setting
  );

  return (
    <>
      <div className={styles.settingContentCameraView}>
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
                {cameras?.filter((cam: Camera) => !cam.deleted)?.length > 0 ? (
                  cameras
                    ?.filter((cam: Camera) => !cam.deleted)
                    ?.map((camera: Camera, index: number) => (
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
                              <CameraTooltip camera={camera} />
                            </span>
                            <span className={styles.name}>{camera.name}</span>
                            <span className={styles.venue}>
                              {camera.venue.name}
                            </span>
                            <span
                              className={`${styles.status} ${
                                styles[camera.status]
                              }`}
                            >
                              {camera.status}
                            </span>
                          </div>
                        </ScrollSyncPane>
                      </div>
                    ))
                ) : (
                  <div className={styles.noCameras}>No cameras available</div>
                )}
              </div>
            </CameraScrollbars>
          </div>
        </ScrollSync>
      </div>
    </>
  );
};

export default View;
