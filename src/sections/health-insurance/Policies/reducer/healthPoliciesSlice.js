import { createSlice } from "@reduxjs/toolkit";
import {
  getAllHealthPoliciesList,
  getHealthCustomerPolicyDetailById,
  getHealthPolicyCommetById,
  getHealthPolicyDetailById,
  getHealthPolicyTransactions,
} from "../action/healthPoliciesAction";

const healthPoliciesSlice = createSlice({
  name: "healthPolicies",
  initialState: {
    allHealthPoliciesList: null,
    allHealthPoliciesListPagination: null,
    allHealthPoliciesListLoader: false,
    healthCustomerPolicyDetailsLoader: false,
    healthPolicyCommentLoader: false,
    healthPolicyCommentList: null,
    healthPolicyTransactionLoader: false,
    healthPolicyTransactionList: null,
    healthPolicyDetails: null,
    allHealthPoliciesListSearchFilter: null,
    allHealthPoliciesListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllHealthPoliciesListCustomPagination: (state, action) => {
      state.allHealthPoliciesListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setAllHealthPoliciesListSearchFilter: (state, action) => {
      state.allHealthPoliciesListSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all policies list api
    builder.addCase(getAllHealthPoliciesList.pending, (state, { payload }) => {
      state.allHealthPoliciesListLoader = true;
    });

    builder.addCase(getAllHealthPoliciesList.fulfilled, (state, { payload }) => {
      state.allHealthPoliciesListLoader = false;
      state.allHealthPoliciesList = payload.data;
      state.allHealthPoliciesListPagination = payload.pagination;
    });

    builder.addCase(getAllHealthPoliciesList.rejected, (state, { payload }) => {
      state.allHealthPoliciesListLoader = false;
      state.error = payload;
    });

    builder.addCase(getHealthPolicyDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthCustomerPolicyDetailsLoader = true;
      state.healthPolicyDetails = null;
    });

    builder.addCase(getHealthPolicyDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthCustomerPolicyDetailsLoader = false;
      state.healthPolicyDetails = payload;
      state.success = true;
    });

    builder.addCase(getHealthPolicyDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthCustomerPolicyDetailsLoader = false;
      state.error = payload;
    });

    // get comment list
    builder.addCase(getHealthPolicyCommetById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthPolicyCommentLoader = true;
      state.healthPolicyCommentList = null;
    });

    builder.addCase(getHealthPolicyCommetById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthPolicyCommentLoader = false;
      state.healthPolicyCommentList = payload?.data;
      state.success = true;
    });

    builder.addCase(getHealthPolicyCommetById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthPolicyCommentLoader = false;
      state.error = payload;
    });

    // get policy transaction
    builder.addCase(getHealthPolicyTransactions.pending, (state, { payload }) => {
      state.loading = true;
      state.healthPolicyTransactionLoader = true;
      state.healthPolicyTransactionList = null;
    });

    builder.addCase(getHealthPolicyTransactions.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthPolicyTransactionLoader = false;
      state.healthPolicyTransactionList = payload?.data;
      state.success = true;
    });

    builder.addCase(getHealthPolicyTransactions.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthPolicyTransactionLoader = false;
      state.error = payload;
    });
  },
});

export const { setAllHealthPoliciesListCustomPagination, setAllHealthPoliciesListSearchFilter } =
  healthPoliciesSlice.actions;

export default healthPoliciesSlice.reducer;
