import { configureStore } from "@reduxjs/toolkit";
import resetReducer from "@/redux/slices/resetSlice";
import { apiSlice } from "@/redux/slices/apiSlice";
import modalReducer from "@/redux/slices/modalSlice";
import sessionReducer from "@/redux/slices/sessionSlice";

import sidebarReducer from "@/redux/slices/sidebarSlice";

export const store = configureStore({
  reducer: {
    reset: resetReducer,
    modal: modalReducer,
    session: sessionReducer,
    sidebar: sidebarReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
