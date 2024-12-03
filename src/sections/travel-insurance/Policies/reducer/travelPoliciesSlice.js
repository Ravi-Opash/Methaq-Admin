import { createSlice } from "@reduxjs/toolkit";
import {
  getAllTravelPoliciesList,
  getTravelPolicyCommetById,
  getTravelPolicyDetailById,
  getTravelPolicyTransactions,
} from "../action/travelPoliciesAction";

const travelPoliciesSlice = createSlice({
  name: "travelPolicies",
  initialState: {
    allTravelPoliciesList: null,
    allTravelPoliciesListPagination: null,
    allTravelPoliciesListLoader: false,
    travelCustomerPolicyDetailsLoader: false,
    travelPolicyDetails: null,
    travelPolicyCommentLoader: false,
    travelPolicyCommentList: null,
    travelPolicyTransactionLoader: false,
    travelPolicyTransactionList: null,
    alltravelPoliciesListSearchFilter: null,
    allTravelPoliciesListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllTravelPoliciesListCustomPagination: (state, action) => {
      state.allTravelPoliciesListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setAllTravelPoliciesListSearchFilter: (state, action) => {
      state.alltravelPoliciesListSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all policies list api
    builder.addCase(getAllTravelPoliciesList.pending, (state, { payload }) => {
      state.allTravelPoliciesListLoader = true;
    });

    builder.addCase(getAllTravelPoliciesList.fulfilled, (state, { payload }) => {
      state.allTravelPoliciesListLoader = false;
      state.allTravelPoliciesList = payload.data;
      state.allTravelPoliciesListPagination = payload.pagination;
    });

    builder.addCase(getAllTravelPoliciesList.rejected, (state, { payload }) => {
      state.allTravelPoliciesListLoader = false;
      state.error = payload;
    });

    // get customer policy details
    builder.addCase(getTravelPolicyDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.travelCustomerPolicyDetailsLoader = true;
      state.travelPolicyDetails = null;
    });

    builder.addCase(getTravelPolicyDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelCustomerPolicyDetailsLoader = false;
      state.travelPolicyDetails = payload;
      state.success = true;
    });

    builder.addCase(getTravelPolicyDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelCustomerPolicyDetailsLoader = false;
      state.error = payload;
    });

    // get comment list
    builder.addCase(getTravelPolicyCommetById.pending, (state, { payload }) => {
      state.loading = true;
      state.travelPolicyCommentLoader = true;
      state.travelPolicyCommentList = null;
    });

    builder.addCase(getTravelPolicyCommetById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelPolicyCommentLoader = false;
      state.travelPolicyCommentList = payload?.data;
      state.success = true;
    });

    builder.addCase(getTravelPolicyCommetById.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelPolicyCommentLoader = false;
      state.error = payload;
    });
    // get transaction list
    builder.addCase(getTravelPolicyTransactions.pending, (state, { payload }) => {
      state.loading = true;
      state.travelPolicyTransactionLoader = true;
      state.travelPolicyTransactionList = null;
    });

    builder.addCase(getTravelPolicyTransactions.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelPolicyTransactionLoader = false;
      state.travelPolicyTransactionList = payload?.data;
      state.success = true;
    });

    builder.addCase(getTravelPolicyTransactions.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelPolicyTransactionLoader = false;
      state.error = payload;
    });
  },
});

export const { setAllTravelPoliciesListCustomPagination, setAllTravelPoliciesListSearchFilter } = travelPoliciesSlice.actions;

export default travelPoliciesSlice.reducer;
