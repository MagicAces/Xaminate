import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ModalSliceState,
  Venue,
  SessionEdit,
  ReportDisplay,
  StudentDisplay,
} from "@/types";

const initialState: ModalSliceState = {
  venues: [],
  session: {},
  report: {},
  student: {},
  reload: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setVenues: (state, action: PayloadAction<Venue[]>) => {
      state.venues = action.payload;
    },
    setSession: (state, action: PayloadAction<SessionEdit>) => {
      state.session = action.payload;
    },
    setReport: (state, action: PayloadAction<ReportDisplay>) => {
      state.report = action.payload;
    },
    setStudent: (state, action: PayloadAction<StudentDisplay>) => {
      state.student = action.payload;
    },
    closeModal: (state) => {
      state.session = {};
      state.reload = false;
    },
    setReload: (state, action: PayloadAction<boolean>) => {
      state.reload = action.payload;
    },
  },
});

export const {
  setVenues,
  setSession,
  setReport,
  setStudent,
  closeModal,
  setReload,
} = modalSlice.actions;

export default modalSlice.reducer;
