import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingState, Venue, Camera } from "@/types";

const initialState: SettingState = {
  reload: false,
  venues: [],
  cameras: [],
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setReload: (state, action: PayloadAction<boolean>) => {
      state.reload = action.payload;
    },
    setVenues: (state, action: PayloadAction<Venue[]>) => {
      state.venues = action.payload;
    },
    setCameras: (state, action: PayloadAction<Camera[]>) => {
      state.cameras = action.payload;
    },
  },
});

export default settingSlice.reducer;
export const { setReload, setVenues, setCameras } = settingSlice.actions;
