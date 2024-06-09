import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SidebarState } from "@/types";

const initialState: SidebarState = {
  fullView: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setFullView: (state, action: PayloadAction<boolean>) => {
      state.fullView = action.payload;
    },
  },
});

export default sidebarSlice.reducer;
export const { setFullView } = sidebarSlice.actions;
