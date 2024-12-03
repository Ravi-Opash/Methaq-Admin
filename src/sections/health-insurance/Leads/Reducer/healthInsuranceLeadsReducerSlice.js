import { createSlice } from "@reduxjs/toolkit";
import { getHealthLeads, getHealthLeadsDetailById } from "../Action/healthInsuranceLeadAction";

const healthInsuranceLeadSlice = createSlice({
  name: "healthInsuranceLeads",
  initialState: {
    loading: false,
    error: null,
    healthInsuranceLeadList: null,
    healthInsuranceLeadLoader: false,
    healthInsuranceLeadPagination: null,
    healthDashboardData: null,
    dashboardLoading: false,
    pagination: {
      page: 1,
      size: 10,
    },
    healthLeadDetails: null,
    success: false,
  },
  reducers: {
    setHealthInsuranceLeadListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
  },
  extraReducers: (builder) => {
    // get health insurance list
    builder.addCase(getHealthLeads.pending, (state, { payload }) => {
      state.loading = true;
      state.healthInsuranceLeadLoader = true;
      state.healthInsuranceLeadList = null;
      state.healthInsuranceLeadPagination = null;
    });

    builder.addCase(getHealthLeads.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceLeadLoader = false;
      state.healthInsuranceLeadList = payload.data;
      state.healthInsuranceLeadPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getHealthLeads.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthInsuranceLeadLoader = false;
      state.error = payload;
    });

    // get lead details
    builder.addCase(getHealthLeadsDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthLeadDetails = null;
    });

    builder.addCase(getHealthLeadsDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthLeadDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthLeadsDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setHealthInsuranceLeadListPagination } = healthInsuranceLeadSlice.actions;

export default healthInsuranceLeadSlice.reducer;
