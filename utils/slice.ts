import { ReportSlice, SessionSlice } from "@/types";

export const isSessionFilterEmpty = (state: SessionSlice) => {
  let empty = true;

  if (state.sessionsBox.filter.status.length > 0) empty = false;
  if (state.sessionsBox.filter.endTime.length > 0) empty = false;
  if (state.sessionsBox.filter.startTime.length > 0) empty = false;
  if (state.sessionsBox.filter.venue > 0) empty = false;

  return empty;
};

export const resetSessionBox = (state: SessionSlice) => {
  state.sessionsBox = {
    query: {
      page: 1,
      limit: 10,
      venue: 0,
      status: "",
      startTime: "",
      endTime: "",
      search: "",
    },
    filter: {
      venue: 0,
      status: "",
      startTime: "",
      endTime: "",
    },
    search: "",
    mode: "none",
  };
};

export const isReportFilterEmpty = (state: ReportSlice) => {
  let empty = true;

  if (state.reportsBox.filter.endTime.length > 0) empty = false;
  if (state.reportsBox.filter.startTime.length > 0) empty = false;

  return empty;
};

export const resetReportBox = (state: ReportSlice) => {
  state.reportsBox = {
    query: {
      page: 1,
      limit: 10,
      startTime: "",
      endTime: "",
      search: "",
      sort: {
        field: "id",
        order: "desc",
      },
    },
    filter: {
      startTime: "",
      endTime: "",
    },
    status: "Pending",
    sort: {
      field: "id",
      order: "desc",
    },
    search: "",
    mode: "none",
  };
};
