import { createSlice } from "@reduxjs/toolkit";
import { getTravelComparePlans } from "../Action/travelComparePlanAction";

const initialState = {
  loading: false,
  success: false,
  error: null,
  travelCompareDetails: null,
};

const travelComparePlan = createSlice({
  name: "travelComparePlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get travel compare plans
    builder.addCase(getTravelComparePlans.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getTravelComparePlans.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelCompareDetails = payload?.data;
      state.success = true;
    });

    builder.addCase(getTravelComparePlans.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});
// export actions
export default travelComparePlan.reducer;
