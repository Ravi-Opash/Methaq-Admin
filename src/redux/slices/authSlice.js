import { createSlice } from "@reduxjs/toolkit";
import { getAdminDetails, loginAdmin, logoutAdmin } from "../actions/authAcion";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    loginUserData: null,
    error: null,
    success: false,
    isAgentOnline: true,
  },
  reducers: {
    setIsAgentOnline: (state, action) => {
      state.isAgentOnline = action.payload;
    },
  },
  extraReducers: (builder) => {
    // admin login
    builder.addCase(loginAdmin.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(loginAdmin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.loginUserData = payload.data;
    });
    builder.addCase(loginAdmin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get admin details
    builder.addCase(getAdminDetails.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getAdminDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.loginUserData = payload.data;
      state.success = true;
    });

    builder.addCase(getAdminDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // logout admin
    builder.addCase(logoutAdmin.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(logoutAdmin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(logoutAdmin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setIsAgentOnline } = authSlice.actions;

export default authSlice.reducer;
