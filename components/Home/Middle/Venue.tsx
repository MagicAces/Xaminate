"use client";

import DateFilter from "@/components/Utils/Dashboard/DateFilter";
import Loader from "@/components/Utils/Loader";
import { setReload, setVenueStats } from "@/redux/slices/dashboardSlice";
import { useGetVenueStats } from "@/server/hooks/dashboard";
import styles from "@/styles/home.module.scss";
import { DashboardState, VenueStats } from "@/types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";

// import ReactCharts with no SSR
const ReactCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Venue = () => {
  const { dateFilter, venueStats, reload }: DashboardState = useSelector(
    (state: any) => state.dashboard
  );
  const dispatch = useDispatch();

  const {
    data: venueStatsData,
    isLoading: venueStatsLoading,
    isFetching: venueStatsFetching,
    error: venueStatsError,
    isPlaceholderData,
  } = useGetVenueStats(dateFilter.venue);

  const [series, setSeries] = useState([
    {
      name: "Sessions",
      data: venueStats.map((venue: VenueStats) => venue.sessions),
    },
    {
      name: "Reports",
      data: venueStats.map((venue: VenueStats) => venue.reports),
    },
  ]);

  useEffect(() => {
    if (
      venueStatsError ||
      typeof venueStatsData === "string" ||
      typeof venueStatsData === "undefined"
    ) {
      console.error(venueStatsError?.message || venueStatsData);
    }

    if (!venueStatsFetching && !venueStatsLoading) {
      dispatch(setReload({ name: "venueStats", value: false }));
    }

    if (
      !venueStatsLoading &&
      venueStatsData &&
      typeof venueStatsData !== "string" &&
      typeof venueStatsData !== "undefined"
    ) {
      dispatch(setVenueStats(venueStatsData));
    }
  }, [venueStatsError, venueStatsData, dispatch]);

  useEffect(() => {
    setSeries([
      {
        name: "Sessions",
        data: venueStats.map((venue: VenueStats) => venue.sessions),
      },
      {
        name: "Reports",
        data: venueStats.map((venue: VenueStats) => venue.reports),
      },
    ]);
  }, [venueStats, reload, venueStatsData]);

  return (
    <>
      {!venueStatsLoading ? (
        <div className={styles.homeContentMiddleVenue}>
          {reload.venueStats && <Loader curved={true} />}
          <div className={styles.homeContentMiddleVenueTop}>
            <div className={styles.homeContentMiddleVenueTopLeft}>
              <span>Venue Stats</span> <span>| {dateFilter.venue}</span>
            </div>
            <DateFilter category="venue" />
          </div>
          <div className={styles.homeContentMiddleVenueBody}>
            <ReactCharts
              options={{
                chart: {
                  type: "bar",
                  height: 250,
                  // width: "100%",
                  toolbar: {
                    show: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: true,
                  curve: "smooth",
                  width: 2,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: venueStats.map(
                    (venue: VenueStats) => venue.venue.name
                  ),
                  axisTicks: {
                    show: false,
                  },
                  labels: {
                    style: {
                      colors: "#FFF",
                      fontFamily: "inherit",
                      fontSize: "12px",
                      fontWeight: 200,
                    },
                  },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "67%",
                    barHeight: "70%",
                    borderRadius: 2,

                    //   distributed: true,
                  },
                },
                //   colors: ["#FFC107", "#4CAF50"],
                yaxis: {
                  forceNiceScale: true,
                  labels: {
                    formatter: function (val) {
                      return val.toFixed(0);
                    },

                    style: {
                      colors: "#FFF",
                      fontFamily: "inherit",
                      fontSize: "12px",
                      fontWeight: 200,
                    },
                  },
                  title: {
                    text: "Count",
                    style: {
                      fontFamily: "inherit",
                      fontSize: "12px",
                      color: "#FFF",
                    },
                  },
                  // show: true,
                  // axisBorder: {
                  //   show: true,
                  //   color: "#FFF",
                  // },
                  // axisTicks: {
                  //   show: false,
                  // },
                },
                fill: {
                  // type: "gradient",
                  opacity: 1,
                  // gradient: {
                  //   opacityFrom: 1,
                  //   opacityTo: 0.9,
                  // },
                },
                legend: {
                  fontFamily: "inherit",
                  fontSize: "13px",
                  fontWeight: "300",
                  labels: {
                    colors: "#FFF",
                  },
                },
                tooltip: {
                  y: {
                    formatter: function (val) {
                      return val.toFixed(0);
                    },
                  },
                  theme: "dark",
                  followCursor: true,
                  fillSeriesColor: true,
                  enabled: true,
                  style: {
                    fontFamily: "inherit",
                  },
                  onDatasetHover: {
                    highlightDataSeries: true,
                  },
                  hideEmptySeries: false,
                },
                grid: {
                  borderColor: "#505050",
                  yaxis: {
                    lines: {
                      show: true,
                    },
                  },
                  xaxis: {
                    lines: {
                      show: false,
                    },
                  },
                },
              }}
              series={series}
              type="bar"
              height={250}
              width={"100%"}
            />
          </div>
        </div>
      ) : (
        <Skeleton
          className={styles.homeContentMiddleVenue}
          baseColor="#2C2C2C"
          highlightColor="#505050"
          height={315}
          style={{
            borderRadius: "0.5rem",
            flex: "1",
            // marginTop: "0.5rem",
            padding: "1rem",
          }}
        />
      )}
    </>
  );
};

export default Venue;
