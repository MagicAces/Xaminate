"use client";

import React, { useCallback } from "react";
import { Scrollbars, ScrollbarProps } from "react-custom-scrollbars-2";

interface RecentScrollbarsProps extends ScrollbarProps {}

const RecentScrollbars: React.FC<RecentScrollbarsProps> = (props) => {
  const renderView = useCallback(
    ({ style, ...props }: React.HTMLProps<HTMLDivElement>) => {
      const viewStyle: React.CSSProperties = {
        padding: "0.3rem 0",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderBottomLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
      };
      return (
        <div className="box" style={{ ...style, ...viewStyle }} {...props} />
      );
    },
    []
  );

  const renderThumb = useCallback(
    ({ style, ...props }: React.HTMLProps<HTMLDivElement>) => {
      const thumbStyle: React.CSSProperties = {
        backgroundColor: "#505050",
        borderRadius: "0.5rem",
      };
      return <div style={{ ...style, ...thumbStyle }} {...props} />;
    },
    []
  );

  const renderTrack = useCallback(
    ({ style, ...props }: React.HTMLProps<HTMLDivElement>) => {
      const trackStyle: React.CSSProperties = {
        ...style,
        left: "50%",
        width: "100px",
        top: 0,
        backgroundColor: "#1E1E1E",
        transform: "translateX(-50%)",
      };

      return <div {...props} style={{ ...trackStyle }} />;
    },
    []
  );
  return (
    <Scrollbars
      renderView={renderView}
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      renderTrackVertical={renderTrack}
      renderTrackHorizontal={renderTrack}
      hideTracksWhenNotNeeded={true}
      universal={true}
      //   autoHide={true}
      {...props}
    />
  );
};

export default RecentScrollbars;
