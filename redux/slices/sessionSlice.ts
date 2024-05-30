import { SessionDisplay, SessionSlice, Venue } from "@/types";
import { isSessionFilterEmpty, resetSessionBox } from "@/utils/slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SessionSlice = {
  data: undefined,
  sessionsBox: {
    query: {
      page: 1,
      limit: 15,
      venue: 0,
      status: "",
      startTime: "",
      endTime: "",
      search: "",
    },
    filter: {
      venue: 0,
      status: "",
      startTime: "",
      endTime: "",
    },
    search: "",
    mode: "none",
  },
  reload: false,
  isDisabled: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<SessionDisplay>) => {
      state.data = action.payload;
    },
    clearSessionsBox: (state) => {
      return resetSessionBox(state);
    },
    updateSessionFilters: (state, action) => {
      const { name, value } = action.payload;
      console.log(name, value);
      state.sessionsBox.filter = {
        ...state.sessionsBox.filter,
        [name]: value ? value : "",
      };

      return state;
    },
    mergeSessionFilters: (state) => {
      state.sessionsBox.query = {
        ...state.sessionsBox.query,
        ...state.sessionsBox.filter,
      };

      if (state.sessionsBox.query.search) {
        state.sessionsBox.mode = "query";
      } else if (!isSessionFilterEmpty(state)) {
        state.sessionsBox.mode = "none";
      } else {
        state.sessionsBox.mode = "query";
      }
    },
    updateSessionSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload;
      if (search === "") state.sessionsBox.query.search = "";

      state.sessionsBox.search = search;
      return state;
    },
    mergeSessionSearch: (state) => {
      state.sessionsBox.query = {
        ...state.sessionsBox.query,
        search: state.sessionsBox.search,
      };

      if (isSessionFilterEmpty(state)) {
        state.sessionsBox.mode = "query";

        if (state.sessionsBox.search === "") {
          state.sessionsBox.mode = "none";
        }
      } else {
        state.sessionsBox.mode = "query";
      }
      return state;
    },
    updateSessionControls: (state, action) => {
      const { name, value } = action.payload;

      state.sessionsBox.query = {
        ...state.sessionsBox.query,
        [name]: value,
      };

      return state;
    },
    setReload: (state, action) => {
      state.reload = action.payload;
    },
    setIsDisabled: (state, action) => {
      state.isDisabled = action.payload;
    },
  },
});

export const {
  setSessions,
  updateSessionFilters,
  updateSessionSearch,
  mergeSessionFilters,
  mergeSessionSearch,
  clearSessionsBox,
  updateSessionControls,
  setReload,
  setIsDisabled,
} = sessionSlice.actions;

export default sessionSlice.reducer;
