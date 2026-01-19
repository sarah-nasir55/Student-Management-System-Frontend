import { createSlice } from "@reduxjs/toolkit";
import { removeCookie } from "../lib/cookies";

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    signupFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },

    clearAuthError(state) {
      state.error = null;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
      state.error = null;

      removeCookie("auth_token");
      localStorage.removeItem("auth_user");
      setTimeout(() => {
        localStorage.removeItem("persist:root");
      }, 100);
    },
    restoreAuth: (state, action) => {
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = action.payload;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  clearAuthError,
  logout,
  restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;
