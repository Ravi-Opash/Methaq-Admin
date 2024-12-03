import { createSlice } from "@reduxjs/toolkit";
import { removeEmptyValue } from "src/utils/fn";
import { getPaymentLinksList } from "../Action/paymentLinkAction";

const paymentLinkSlice = createSlice({
  name: "paymentLinks",
  initialState: {
    loading: false,
    error: null,
    paymentLinkList: null,
    paymentLinkListLoader: false,
    paymentLinkPagination: null,
    pagination: {
      page: 1,
      size: 10,
    },
    paymentLinkSearchFilter: null,
    success: false,
  },
  reducers: {
    setPaymentLinkListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setPaymentLinkSerchFilter: (state, action) => {
      state.paymentLinkSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get product list
    builder.addCase(getPaymentLinksList.pending, (state, { payload }) => {
      state.loading = true;
      state.paymentLinkListLoader = true;
      state.paymentLinkList = null;
      state.paymentLinkPagination = null;
    });

    builder.addCase(getPaymentLinksList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.paymentLinkListLoader = false;
      state.paymentLinkList = payload.data;
      state.paymentLinkPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getPaymentLinksList.rejected, (state, { payload }) => {
      state.loading = false;
      state.paymentLinkListLoader = false;
      state.error = payload;
    });
  },
});

export const { setPaymentLinkListPagination, setPaymentLinkSerchFilter } = paymentLinkSlice.actions;

export default paymentLinkSlice.reducer;
