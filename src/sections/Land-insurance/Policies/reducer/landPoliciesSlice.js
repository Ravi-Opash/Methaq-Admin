import { createSlice } from "@reduxjs/toolkit";
import {
  getAllLandPoliciesList,
  getHealthCustomerPolicyDetailById,
  getHealthPolicyCommetById,
  getLandPolicyDetailById,
  getHealthPolicyTransactions,
} from "../action/landPoliciesAction";

const landPoliciesSlice = createSlice({
  name: "landPolicies",
  initialState: {
    allLandPoliciesList: null,
    allLandPoliciesListPagination: null,
    allLandPoliciesListLoader: false,
    landPolicyDetails: null,
    allLandPoliciesSearchFilter: null,
    allLandPoliciesListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllLandPoliciesListCustomPagination: (state, action) => {
      state.allLandPoliciesListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setAllLandPoliciesSearchFilter: (state, action) => {
      state.allLandPoliciesSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all policies list api
    builder.addCase(getAllLandPoliciesList.pending, (state, { payload }) => {
      state.allLandPoliciesListLoader = true;
    });

    builder.addCase(getAllLandPoliciesList.fulfilled, (state, { payload }) => {
      state.allLandPoliciesListLoader = false;
      state.allLandPoliciesList = payload.data;
      state.allLandPoliciesListPagination = payload.pagination;
    });

    builder.addCase(getAllLandPoliciesList.rejected, (state, { payload }) => {
      state.allLandPoliciesListLoader = false;
      state.error = payload;
    });

    builder.addCase(getLandPolicyDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthCustomerPolicyDetailsLoader = true;
      state.landPolicyDetails = null;
    });

    builder.addCase(getLandPolicyDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthCustomerPolicyDetailsLoader = false;
      state.landPolicyDetails = payload;
      state.success = true;
    });

    builder.addCase(getLandPolicyDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthCustomerPolicyDetailsLoader = false;
      state.error = payload;
    });
  },
});

export const { setAllLandPoliciesListCustomPagination, setAllLandPoliciesSearchFilter } = landPoliciesSlice.actions;

export default landPoliciesSlice.reducer;
