import { ReportDisplay, ReportSlice, ReportOutput } from "@/types";
import { isReportFilterEmpty, resetReportBox } from "@/utils/slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ReportSlice = {
  data: undefined,
  reportsBox: {
    query: {
      page: 1,
      limit: 10,
      startTime: "",
      endTime: "",
      search: "",
      sort: {
        field: "timestamp",
        order: "desc",
      },
    },
    filter: {
      startTime: "",
      endTime: "",
    },
    status: "Pending",
    sort: {
      field: "timestamp",
      order: "desc",
    },
    search: "",
    mode: "none",
  },
  report: undefined,
  reload: false,
  isDisabled: false,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<ReportDisplay | undefined>) => {
      state.data = action.payload;
    },
    clearReportsBox: (state) => {
      return resetReportBox(state);
    },
    setReport: (state, action: PayloadAction<ReportOutput>) => {
      state.report = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.reportsBox.status = action.payload;
    },
    updateReportFilters: (state, action) => {
      const { name, value } = action.payload;
      state.reportsBox.filter = {
        ...state.reportsBox.filter,
        [name]: value ? value : "",
      };

      return state;
    },
    mergeReportFilters: (state) => {
      state.reportsBox.query = {
        ...state.reportsBox.query,
        ...state.reportsBox.filter,
      };

      if (state.reportsBox.query.search) {
        state.reportsBox.mode = "query";
      } else if (isReportFilterEmpty(state)) {
        state.reportsBox.mode = "none";
      } else {
        state.reportsBox.mode = "query";
      }
    },
    updateReportSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload;
      if (search === "") state.reportsBox.query.search = "";

      state.reportsBox.search = search;
      return state;
    },
    mergeReportSearch: (state) => {
      state.reportsBox.query = {
        ...state.reportsBox.query,
        search: state.reportsBox.search,
      };

      if (isReportFilterEmpty(state)) {
        state.reportsBox.mode = "query";

        if (state.reportsBox.search === "") {
          state.reportsBox.mode = "none";
        }
      } else {
        state.reportsBox.mode = "query";
      }
      return state;
    },
    updateReportSort: (state, action) => {
      state.reportsBox.sort = action.payload;
      return state;
    },
    mergeReportSort: (state) => {
      state.reportsBox.query = {
        ...state.reportsBox.query,
        sort: {
          ...state.reportsBox.sort,
        },
      };
      console.log(state.reportsBox);
    },
    updateReportControls: (state, action) => {
      const { name, value } = action.payload;

      state.reportsBox.query = {
        ...state.reportsBox.query,
        [name]: value,
      };

      return state;
    },
    setReload: (state, action) => {
      state.reload = action.payload;
    },
    setIsDisabled: (state, action) => {
      state.isDisabled = action.payload;
    },
  },
});

export const {
  setReports,
  setReport,
  updateReportFilters,
  updateReportSearch,
  updateReportSort,
  setStatus,
  mergeReportSort,
  mergeReportFilters,
  mergeReportSearch,
  clearReportsBox,
  updateReportControls,
  setReload,
  setIsDisabled,
} = reportSlice.actions;

export default reportSlice.reducer;
