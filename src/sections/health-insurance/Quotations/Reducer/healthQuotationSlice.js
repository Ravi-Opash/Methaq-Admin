import { createSlice } from "@reduxjs/toolkit";
import { getAllHealthQuotationsList, getHealthQuoationDetails } from "../Action/healthQuotationAction";

const healthQuotationSlice = createSlice({
  name: "healthQuotation",
  initialState: {
    allQuotationsListLoader: false,
    allQuotationsList: null,
    allQuotationsListPagination: null,
    allQuotationsListPagination: null,
    healthQuotationDetails: null,
    healthquoteSearchFiltter:null,
    allQuotationsListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllHealthQuotationsListCustomPagination: (state, action) => {
      state.allQuotationsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    sethealthQuotationInfoDetails: (state, action) => {
      state.healthQuotationDetails = action.payload;
    },
    sethealthQuotationsSearchFilter:(state,action)=>{
      state.healthquoteSearchFiltter = action.payload;
    }
  },
  extraReducers: (builder) => {
    // get all quotations list api
    builder.addCase(getAllHealthQuotationsList.pending, (state, { payload }) => {
      state.allQuotationsListLoader = true;
    });

    builder.addCase(getAllHealthQuotationsList.fulfilled, (state, { payload }) => {
      state.allQuotationsListLoader = false;
      state.allQuotationsList = payload.data;
      state.allQuotationsListPagination = payload.pagination;
    });

    builder.addCase(getAllHealthQuotationsList.rejected, (state, { payload }) => {
      state.allQuotationsListLoader = false;
      state.error = payload;
    });
    // get all quotations list api
    builder.addCase(getHealthQuoationDetails.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getHealthQuoationDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthQuotationDetails = payload.data;
    });

    builder.addCase(getHealthQuoationDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setAllHealthQuotationsListCustomPagination, sethealthQuotationInfoDetails, sethealthQuotationsSearchFilter } =
  healthQuotationSlice.actions;

export default healthQuotationSlice.reducer;
