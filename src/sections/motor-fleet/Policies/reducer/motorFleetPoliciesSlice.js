import { createSlice } from "@reduxjs/toolkit";
import {
  getAllMotorFleetPoliciesList,
  getHealthCustomerPolicyDetailById,
  getMotorFleetPolicyCommetById,
  getMotorFleetPolicyDetailById,
  getMotorFleetPolicyTransactions,
} from "../action/motorFleetPoliciesAction";

const motorFleetPoliciesSlice = createSlice({
  name: "motorFleetPolicies",
  initialState: {
    allMotorFleetPoliciesList: null,
    allMotorFleetPoliciesListPagination: null,
    allMotorFleetPoliciesListLoader: false,
    motorFleetPolicyDetailsLoader: false,
    motorFleetPolicyDetails: null,
    motorFleetPolicyCommentLoader: false,
    motorFleetPolicyCommentList: null,
    motorFleetPolicyTransactionLoader: false,
    motorFleetPolicyTransactionList: null,
    allMotorFleetPoliciesListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllMotorFleetPoliciesListCustomPagination: (state, action) => {
      state.allMotorFleetPoliciesListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
  },
  extraReducers: (builder) => {
    // get all policies list api
    builder.addCase(getAllMotorFleetPoliciesList.pending, (state, { payload }) => {
      state.allMotorFleetPoliciesListLoader = true;
    });

    builder.addCase(getAllMotorFleetPoliciesList.fulfilled, (state, { payload }) => {
      state.allMotorFleetPoliciesListLoader = false;
      state.allMotorFleetPoliciesList = payload.data;
      state.allMotorFleetPoliciesListPagination = payload.pagination;
    });

    builder.addCase(getAllMotorFleetPoliciesList.rejected, (state, { payload }) => {
      state.allMotorFleetPoliciesListLoader = false;
      state.error = payload;
    });

    builder.addCase(getMotorFleetPolicyDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetPolicyDetailsLoader = true;
      state.motorFleetPolicyDetails = null;
    });

    builder.addCase(getMotorFleetPolicyDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetPolicyDetailsLoader = false;
      state.motorFleetPolicyDetails = payload;
      state.success = true;
    });

    builder.addCase(getMotorFleetPolicyDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.motorFleetPolicyDetailsLoader = false;
      state.error = payload;
    });

    // get comment list
    builder.addCase(getMotorFleetPolicyCommetById.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetPolicyCommentLoader = true;
      state.motorFleetPolicyCommentList = null;
    });

    builder.addCase(getMotorFleetPolicyCommetById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetPolicyCommentLoader = false;
      state.motorFleetPolicyCommentList = payload?.data;
      state.success = true;
    });

    builder.addCase(getMotorFleetPolicyCommetById.rejected, (state, { payload }) => {
      state.loading = false;
      state.motorFleetPolicyCommentLoader = false;
      state.error = payload;
    });
     
    // get transaction list
    builder.addCase(getMotorFleetPolicyTransactions.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetPolicyTransactionLoader = true;
      state.motorFleetPolicyTransactionList = null;
    });

    builder.addCase(getMotorFleetPolicyTransactions.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetPolicyTransactionLoader = false;
      state.motorFleetPolicyTransactionList = payload?.data;
      state.success = true;
    });

    builder.addCase(getMotorFleetPolicyTransactions.rejected, (state, { payload }) => {
      state.loading = false;
      state.motorFleetPolicyTransactionLoader = false;
      state.error = payload;
    });
  },
});

export const { setAllMotorFleetPoliciesListCustomPagination } = motorFleetPoliciesSlice.actions;

export default motorFleetPoliciesSlice.reducer;
