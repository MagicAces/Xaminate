import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DashboardState,
  DashboardTopRowData,
  VenueStats,
  ReportStats,
  SessionRecent,
  ReportRecent,
  ReportsPerSession,
} from "@/types";

const initialState: DashboardState = {
  topRow: {
    sessions: {
      currentMonth: 0,
      total: 0,
      percentageChange: 0,
      pending: 0,
      active: 0,
      closed: 0,
    },
    reports: {
      currentMonth: 0,
      total: 0,
      percentageChange: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    venues: {
      total: 0,
      percentageChange: 0,
    },
    cameras: {
      total: 0,
      percentageChange: 0,
      active: 0,
      inactive: 0,
      maintenance: 0,
    },
  },
  venueStats: [],
  reportStats: {
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  reportsPerSession: [],
  // recentSessions: [],
  recentItems: [],
  dateFilter: {
    venue: "This Month",
    report: "This Month",
  },
  sessionsBack: 10,
  category: "session",
  reload: {
    venueStats: false,
    reportStats: false,
    reportsPerSession: false,
    recentItems: false,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setTopRow: (state, action: PayloadAction<DashboardTopRowData>) => {
      state.topRow = action.payload;
    },
    setVenueStats: (state, action: PayloadAction<VenueStats[]>) => {
      state.venueStats = action.payload;
    },
    setReportStats: (state, action: PayloadAction<ReportStats>) => {
      state.reportStats = action.payload;
    },
    setReportsPerSession: (
      state,
      action: PayloadAction<ReportsPerSession[]>
    ) => {
      state.reportsPerSession = action.payload;
    },
    setRecentItems: (
      state,
      action: PayloadAction<SessionRecent[] | ReportRecent[]>
    ) => {
      state.recentItems = action.payload;
    },
    // setRecentReports: (state, action: PayloadAction<ReportRecent[]>) => {
    //   state.recentReports = action.payload;
    // },
    setDateFilter: (state, action) => {
      const { name, value } = action.payload;
      state.dateFilter = {
        ...state.dateFilter,
        [name]: value,
      };
    },
    setSessionsBack: (state, action) => {
      state.sessionsBack = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setReload: (state, action) => {
      const { name, value } = action.payload;
      state.reload = {
        ...state.reload,
        [name]: value,
      };
    },
  },
});

export default dashboardSlice.reducer;
export const {
  setTopRow,
  setVenueStats,
  setReportStats,
  setReportsPerSession,
  setRecentItems,
  // setRecentReports,
  setDateFilter,
  setSessionsBack,
  setCategory,
  setReload,
} = dashboardSlice.actions;
