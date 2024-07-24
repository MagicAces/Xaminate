import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SidebarState } from "@/types";

const initialState: SidebarState = {
  fullView: false,
  logoutReload: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setFullView: (state, action: PayloadAction<boolean>) => {
      state.fullView = action.payload;
    },
    setLogoutReload: (state, action: PayloadAction<boolean>) => {
      state.logoutReload = action.payload;
    },
  },
});

export default sidebarSlice.reducer;
export const { setFullView, setLogoutReload } = sidebarSlice.actions;
