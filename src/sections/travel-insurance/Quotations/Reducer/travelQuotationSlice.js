import { createSlice } from "@reduxjs/toolkit";
import { getAllTravelQuotationsList, getTravelQuoationDetails } from "../Action/travelQuotationAction";

const travelQuotationSlice = createSlice({
  name: "travelQuotation",
  initialState: {
    allTravelQuotationsListLoader: false,
    allTravelQuotationsList: null,
    allTravelQuotationsListPagination: null,
    allTravelQuotationsListPagination: null,
    travelQuotationDetails: null,
    allTravelQuotationsSearchFilter: null,
    allTravelQuotationsListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllTravelQuotationsListCustomPagination: (state, action) => {
      state.allTravelQuotationsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setTravelQuotationInfoDetails: (state, action) => {
      state.travelQuotationDetails = action.payload;
    },
    setTravelQuotationSearchFilter: (state, action) => {
      state.allTravelQuotationsSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all quotations list api
    builder.addCase(getAllTravelQuotationsList.pending, (state, { payload }) => {
      state.allTravelQuotationsListLoader = true;
    });

    builder.addCase(getAllTravelQuotationsList.fulfilled, (state, { payload }) => {
      state.allTravelQuotationsListLoader = false;
      state.allTravelQuotationsList = payload.data;
      state.allTravelQuotationsListPagination = payload.pagination;
    });

    builder.addCase(getAllTravelQuotationsList.rejected, (state, { payload }) => {
      state.allTravelQuotationsListLoader = false;
      state.error = payload;
    });
    
    // get all quotations list api
    builder.addCase(getTravelQuoationDetails.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getTravelQuoationDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelQuotationDetails = payload.data;
    });

    builder.addCase(getTravelQuoationDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {
  setAllTravelQuotationsListCustomPagination,
  setTravelQuotationInfoDetails,
  setTravelQuotationSearchFilter,
} = travelQuotationSlice.actions;

export default travelQuotationSlice.reducer;
