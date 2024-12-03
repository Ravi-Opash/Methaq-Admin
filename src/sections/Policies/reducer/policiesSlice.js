import { createSlice } from "@reduxjs/toolkit";
import { getAllPoliciesList, getAllQuotationsList } from "../action/policiesAction";

const policiesSlice = createSlice({
  name: "policies",
  initialState: {
    allPoliciesList: null,
    allPoliciesListPagination: null,
    allPoliciesListLoader: false,
    allQuotationsList: null,
    allQuotationsListPagination: null,
    allQuotationsListLoader: false,
    policiesSearchFilter: null,
    quotationsSearchFilter: null,
    allPoliciesListCustomPagination: {
      page: 1,
      size: 10,
    },
    allQuotationsListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllPoliciesListCustomPagination: (state, action) => {
      state.allPoliciesListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setAllQuotationsListCustomPagination: (state, action) => {
      state.allQuotationsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    updateQuotationList: (state, action) => {
      state.allQuotationsList = action.payload;
    },
    setPoliciesSearchFilter:(state,action)=>{
      state.policiesSearchFilter = action.payload
    },
    setQuotationsSearchFilter:(state,action)=>{
      state.quotationsSearchFilter = action.payload
    }
  },
  extraReducers: (builder) => {
    // get all policies list api
    builder.addCase(getAllPoliciesList.pending, (state, { payload }) => {
      state.allPoliciesListLoader = true;
    });

    builder.addCase(getAllPoliciesList.fulfilled, (state, { payload }) => {
      state.allPoliciesListLoader = false;
      state.allPoliciesList = payload.data;
      state.allPoliciesListPagination = payload.pagination;
    });

    builder.addCase(getAllPoliciesList.rejected, (state, { payload }) => {
      state.allPoliciesListLoader = false;
      state.error = payload;
    });

    // get all quotations list api
    builder.addCase(getAllQuotationsList.pending, (state, { payload }) => {
      state.allQuotationsListLoader = true;
    });

    builder.addCase(getAllQuotationsList.fulfilled, (state, { payload }) => {
      state.allQuotationsListLoader = false;
      state.allQuotationsList = payload.data;
      state.allQuotationsListPagination = payload.pagination;
    });

    builder.addCase(getAllQuotationsList.rejected, (state, { payload }) => {
      state.allQuotationsListLoader = false;
      state.error = payload;
    });
  },
});

export const {
  setAllPoliciesListCustomPagination,
  setAllQuotationsListCustomPagination,
  updateQuotationList,
  setPoliciesSearchFilter,
  setQuotationsSearchFilter
} = policiesSlice.actions;

export default policiesSlice.reducer;
