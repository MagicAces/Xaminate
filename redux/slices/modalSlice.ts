import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalSliceState, Session, Venue } from "@/types";

const initialState: ModalSliceState = {
  venues: [],
  session: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setVenues: (state, action: PayloadAction<Venue[]>) => {
      state.venues = action.payload;
    },
    setSession: (state, action: PayloadAction<Session>) => {
      state.session = action.payload;
    },
    closeModal: (state) => {
      state.session = {};
    },
  },
});

export const { setVenues, setSession, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
