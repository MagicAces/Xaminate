import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResetState } from "@/types";

const initialState: ResetState = {
  section: 1,
  email: "",
  otp: new Array(6).fill(""),
  password: {
    newPass: "",
    confirmPass: ""
  },
  tokenId: "",
  userId: ""
};

const resetSlice = createSlice({
  name: "reset",
  initialState,
  reducers: {
    setSection: (state, action) => {
      state.section = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setOTP: (state, action) => {
      state.otp = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setIds: (state, action) => {
      const { tokenId, userId } = action.payload
      state.tokenId = tokenId;
      state.userId = userId;
    },
    hardReset: (state) => {
      state.section = 1;
      state.email = '';
      state.otp = new Array(6).fill("");
      state.password = { newPass: "", confirmPass: "" }
      state.tokenId = "";
      state.userId = "";
    }
  },
});

export default resetSlice.reducer;
export const { setSection, setEmail, setOTP, setPassword, setIds, hardReset } = resetSlice.actions;
