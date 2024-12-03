import { createSlice } from "@reduxjs/toolkit";
import { getAllMotorFleetQuotationsList, getMotorFleetQuoationDetails } from "../Action/motorFleetQuotationAction";

const motorFleetQuotationSlice = createSlice({
  name: "motorFleetQuotation",
  initialState: {
    allMotorFleetQuotationsListLoader: false,
    allMotorFleetQuotationsList: null,
    allMotorFleetQuotationsListPagination: null,
    allMotorFleetQuotationsListPagination: null,
    motorFleetQuotationDetails: null,
    allMotorQuotationsListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllMotorFleetQuotationsListCustomPagination: (state, action) => {
      state.allMotorQuotationsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setMotorFleetQuotationInfoDetails: (state, action) => {
      state.motorFleetQuotationDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all quotations list api
    builder.addCase(getAllMotorFleetQuotationsList.pending, (state, { payload }) => {
      state.allMotorFleetQuotationsListLoader = true;
    });

    builder.addCase(getAllMotorFleetQuotationsList.fulfilled, (state, { payload }) => {
      state.allMotorFleetQuotationsListLoader = false;
      state.allMotorFleetQuotationsList = payload.data;
      state.allMotorFleetQuotationsListPagination = payload.pagination;
    });

    builder.addCase(getAllMotorFleetQuotationsList.rejected, (state, { payload }) => {
      state.allMotorFleetQuotationsListLoader = false;
      state.error = payload;
    });
    // get all quotations list api
    builder.addCase(getMotorFleetQuoationDetails.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(getMotorFleetQuoationDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetQuotationDetails = payload.data;
    });

    builder.addCase(getMotorFleetQuoationDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setAllMotorFleetQuotationsListCustomPagination, setMotorFleetQuotationInfoDetails } =
  motorFleetQuotationSlice.actions;

export default motorFleetQuotationSlice.reducer;
