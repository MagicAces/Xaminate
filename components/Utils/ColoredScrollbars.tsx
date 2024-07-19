"use client";

import React, { useCallback } from "react";
import { Scrollbars, ScrollbarProps } from "react-custom-scrollbars-2";

interface ColoredScrollbarsProps extends ScrollbarProps {}

const ColoredScrollbars: React.FC<ColoredScrollbarsProps> = (props) => {
  const renderView = useCallback(
    ({ style, ...props }: React.HTMLProps<HTMLDivElement>) => {
      const viewStyle: React.CSSProperties = {
        padding: "5px 0",
        backgroundColor: "#2C2C2C",
        color: "#FFF",
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

  return (
    <Scrollbars
      renderView={renderView}
      renderThumbVertical={renderThumb}
      renderThumbHorizontal={renderThumb}
      hideTracksWhenNotNeeded={true}
      //   autoHide={true}
      {...props}
    />
  );
};

export default ColoredScrollbars;
