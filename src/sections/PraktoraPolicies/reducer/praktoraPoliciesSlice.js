import { createSlice } from "@reduxjs/toolkit";
import { getAllPraktoraPoliciesList, getPraktoraPolicyDetailById } from "../action/praktoraPoliciesAction";

const PraktoraPoliciesSlice = createSlice({
  name: "praktoraPolicies",
  initialState: {
    allPraktoraPoliciesList: null,
    allPraktoraPoliciesListPagination: null,
    allPraktoraPoliciesListLoader: false,
    allPraktoraPolicyDetailsById: null,
    allQuotationsListPagination: null,
    allPraktoraPolicyDetailsByIdLoader: false,
    PraktoraPoliciesSearchFilter: null,
    allPraktoraPoliciesListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllPraktoraPoliciesListCustomPagination: (state, action) => {
      state.allPraktoraPoliciesListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setPraktoraPoliciesSearchFilter: (state, action) => {
      state.PraktoraPoliciesSearchFilter = action.payload;
    },
    setQuotationsSearchFilter: (state, action) => {
      state.quotationsSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all policies list api
    builder.addCase(getAllPraktoraPoliciesList.pending, (state, { payload }) => {
      state.allPraktoraPoliciesListLoader = true;
    });

    builder.addCase(getAllPraktoraPoliciesList.fulfilled, (state, { payload }) => {
      state.allPraktoraPoliciesListLoader = false;
      state.allPraktoraPoliciesList = payload.data;
      state.allPraktoraPoliciesListPagination = payload.pagination;
    });

    builder.addCase(getAllPraktoraPoliciesList.rejected, (state, { payload }) => {
      state.allPraktoraPoliciesListLoader = false;
      state.error = payload;
    });

    // // get all getPraktoraPolicyDetailById list api
    builder.addCase(getPraktoraPolicyDetailById.pending, (state, { payload }) => {
      state.allPraktoraPolicyDetailsByIdLoader = true;
    });

    builder.addCase(getPraktoraPolicyDetailById.fulfilled, (state, { payload }) => {
      state.allPraktoraPolicyDetailsByIdLoader = false;
      state.allPraktoraPolicyDetailsById = payload.data;
    });

    builder.addCase(getPraktoraPolicyDetailById.rejected, (state, { payload }) => {
      state.allPraktoraPolicyDetailsByIdLoader = false;
      state.error = payload;
    });
  },
});

export const {
  setAllPraktoraPoliciesListCustomPagination,
  setAllQuotationsListCustomPagination,
  updateQuotationList,
  setPraktoraPoliciesSearchFilter,
  setQuotationsSearchFilter,
} = PraktoraPoliciesSlice.actions;

export default PraktoraPoliciesSlice.reducer;
