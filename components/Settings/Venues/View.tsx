"use client";
import VenueTooltip from "@/components/Utils/Settings/VenueTooltip";
import styles from "@/styles/setting.module.scss";
import { Venue } from "@/types";
import { useSelector } from "react-redux";

const View = () => {
  const { venues }: { venues: Venue[] } = useSelector(
    (state: any) => state.setting
  );

  return (
    <>
      <div className={styles.settingContentVenueView}>
        {venues?.filter((venue: Venue) => !venue.deleted).length > 0 ? (
          <div className={styles.venues}>
            {venues
              .filter((venue: Venue) => !venue.deleted)
              .map((venue: Venue, index: number) => (
                <div className={styles.venue} key={index}>
                  <span>{venue.name}</span>
                  <VenueTooltip venue={venue} />
                </div>
              ))}
          </div>
        ) : (
          <div className={styles.noVenues}>No venues found</div>
        )}
      </div>
    </>
  );
};

export default View;
