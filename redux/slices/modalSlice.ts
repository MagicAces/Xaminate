import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalSliceState } from "@/types";

const initialState: ModalSliceState = {
  loader: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setLoader: (state, action: PayloadAction<boolean>) => {
      state.loader = action.payload;
    },
    closeModal: (state) => {
      state.loader = false;
    },
  },
});

export const { setLoader, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
