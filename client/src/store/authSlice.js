import { createSlice } from "@reduxjs/toolkit";
const saved = JSON.parse(localStorage.getItem("ss_auth") || "null");
const slice = createSlice({
  name: "auth",
  initialState: { user: saved?.user || null, token: saved?.token || null },
  reducers: {
    loginSuccess: (s, a) => {
      s.user = a.payload.user;
      s.token = a.payload.token;
      localStorage.setItem("ss_auth", JSON.stringify(a.payload));
    },
    logout: (s) => {
      s.user = null;
      s.token = null;
      localStorage.removeItem("ss_auth");
    },
  },
});
export const { loginSuccess, logout } = slice.actions;
export default slice.reducer;
