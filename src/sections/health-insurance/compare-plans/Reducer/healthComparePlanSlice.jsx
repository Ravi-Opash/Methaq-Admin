import { createSlice } from "@reduxjs/toolkit";
import { getHealthComparePlans } from "../Action/healthComparePlanAction";

const initialState = {
  loading: false,
  success: false,
  error: null,
  healthCompareDetails: null,
};

const healthComparePlan = createSlice({
  name: "healthComparePlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHealthComparePlans.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getHealthComparePlans.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthCompareDetails = payload?.data;
      state.success = true;
    });

    builder.addCase(getHealthComparePlans.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});
// export actions
export default healthComparePlan.reducer;
