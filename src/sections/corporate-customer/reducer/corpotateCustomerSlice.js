import { createSlice } from "@reduxjs/toolkit";
import {
  getCorporateCustomerList,
  getCorporateCustomerDetailsById,
  updateCorporateCustomerById,
} from "../action/corporateCustomerAction";

const corporateCustomerSlice = createSlice({
  name: "corporateCustomer",
  initialState: {
    loading: false,
    corporateCustomerList: null,
    corporateCustomerPagination: null,
    corporateCustomerListLoader: false,
    corporateCustomerDetails: null,
    corporateCustomerSearchFilter: null,
    pagination: {
      page: 1,
      size: 10,
    },
    corporatePagination: {
      page: 1,
      size: 10,
    },
    error: null,
    success: false,
  },

  reducers: {
    setCorporateCustomerDetails: (state, action) => {
      state.corporateCustomerDetails = action.payload;
    },

    setCorporateCustomerListPagination: (state, action) => {
      state.corporatePagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCorporteCustomerSearchlist: (state, action) => {
      state.corporateCustomerSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get customer list
    builder.addCase(getCorporateCustomerList.pending, (state, { payload }) => {
      state.loading = true;
      state.corporateCustomerListLoader = true;
    });

    builder.addCase(getCorporateCustomerList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.corporateCustomerListLoader = false;
      state.corporateCustomerList = payload.data;
      state.corporateCustomerPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCorporateCustomerList.rejected, (state, { payload }) => {
      state.loading = false;
      state.corporateCustomerListLoader = false;
      state.error = payload;
    });

    // get customer details by id
    builder.addCase(getCorporateCustomerDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.corporateCustomerDetails = null;
    });

    builder.addCase(getCorporateCustomerDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.corporateCustomerDetails = payload;
      state.success = true;
    });

    builder.addCase(getCorporateCustomerDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // update customer by id
    builder.addCase(updateCorporateCustomerById.pending, (state, { payload }) => {
      state.loading = true;
      state.updateCorporateCustomerDetails = null;
    });

    builder.addCase(updateCorporateCustomerById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.updateCorporateCustomerDetails = payload;
      state.success = true;
    });

    builder.addCase(updateCorporateCustomerById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setCorporateCustomerListPagination, setCorporateCustomerDetails, setCorporteCustomerSearchlist } =
  corporateCustomerSlice.actions;

export default corporateCustomerSlice.reducer;
