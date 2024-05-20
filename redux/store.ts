import { configureStore } from "@reduxjs/toolkit";
import resetReducer from "@/redux/slices/resetSlice";
import { apiSlice } from "@/redux/slices/apiSlice";
import modalReducer from "@/redux/slices/modalSlice";

export const store = configureStore({
  reducer: {
    reset: resetReducer,
    modal: modalReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
