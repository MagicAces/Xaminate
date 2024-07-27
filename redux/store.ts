import { configureStore } from "@reduxjs/toolkit";
import resetReducer from "@/redux/slices/resetSlice";
import { apiSlice } from "@/redux/slices/apiSlice";
import modalReducer from "@/redux/slices/modalSlice";
import sessionReducer from "@/redux/slices/sessionSlice";
import reportReducer from "@/redux/slices/reportSlice";
import sidebarReducer from "@/redux/slices/sidebarSlice";
import settingReducer from "@/redux/slices/settingSlice";
import dashboardReducer from "@/redux/slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    reset: resetReducer,
    modal: modalReducer,
    session: sessionReducer,
    report: reportReducer,
    sidebar: sidebarReducer,
    setting: settingReducer,
    dashboard: dashboardReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
