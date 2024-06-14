import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalSliceState, Venue, SessionEdit } from "@/types";

const initialState: ModalSliceState = {
  venues: [],
  session: {},
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
    closeModal: (state) => {
      state.session = {};
      state.reload = false;
    },
    setReload: (state, action: PayloadAction<boolean>) => {
      state.reload = action.payload;
    },
  },
});

export const { setVenues, setSession, closeModal, setReload } =
  modalSlice.actions;

export default modalSlice.reducer;
