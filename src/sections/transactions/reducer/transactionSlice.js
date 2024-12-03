import { createSlice } from "@reduxjs/toolkit";
import {
  getAddonTransactionsDetailsById,
  getAllAddonTransactionsList,
  getAllTransactionsList,
  getTransactionsDetailsById,
} from "../action/transactionAction";

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    allTransactionsList: null,
    allTransactionsListPagination: null,
    allTransactionsListLoader: false,
    allTransactionsListCustomPagination: {
      page: 1,
      size: 10,
    },
    transactionDetail: null,
    transactionDetailLoader: false,

    //ADDON -------
    allAddonTransactionsList: null,
    allAddonTransactionsListPagination: null,
    allAddonTransactionsListLoader: false,
    allAddonTransactionsListCustomPagination: {
      page: 1,
      size: 10,
    },
    addonTransactionDetail: null,
    addonTransactionDetailLoader: false,
    policyTransactionSearchFilter: null,
    addonTransactionSearchFilter: null,
    error: null,
  },
  reducers: {
    setAllTransactionsListCustomPagination: (state, action) => {
      state.allTransactionsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setAllAddonTransactionsListCustomPagination: (state, action) => {
      state.allAddonTransactionsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setPolicyTransactionSearchFilter: (state, action) => {
      state.policyTransactionSearchFilter = action.payload;
    },
    setAddonTransactionSearchFilter: (state, action) => {
      state.addonTransactionSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all transactions list api
    builder.addCase(getAllTransactionsList.pending, (state, { payload }) => {
      state.allTransactionsListLoader = true;
    });

    builder.addCase(getAllTransactionsList.fulfilled, (state, { payload }) => {
      state.allTransactionsListLoader = false;
      state.allTransactionsList = payload.data;
      state.allTransactionsListPagination = payload.pagination;
    });

    builder.addCase(getAllTransactionsList.rejected, (state, { payload }) => {
      state.allTransactionsListLoader = false;
      state.error = payload;
    });

    // get transaction details
    builder.addCase(getTransactionsDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.transactionDetailLoader = true;
      state.transactionDetail = null;
    });

    builder.addCase(getTransactionsDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.transactionDetailLoader = false;
      state.transactionDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getTransactionsDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.transactionDetailLoader = false;
      state.error = payload;
    });

    //ADDON -------

    // get all addon transactions list api
    builder.addCase(getAllAddonTransactionsList.pending, (state, { payload }) => {
      state.allAddonTransactionsListLoader = true;
    });

    builder.addCase(getAllAddonTransactionsList.fulfilled, (state, { payload }) => {
      state.allAddonTransactionsListLoader = false;
      state.allAddonTransactionsList = payload.data;
      state.allAddonTransactionsListPagination = payload.pagination;
    });

    builder.addCase(getAllAddonTransactionsList.rejected, (state, { payload }) => {
      state.allAddonTransactionsListLoader = false;
      state.error = payload;
    });

    // get addon transaction details
    builder.addCase(getAddonTransactionsDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.addonTransactionDetailLoader = true;
      state.addonTransactionDetail = null;
    });

    builder.addCase(getAddonTransactionsDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.addonTransactionDetailLoader = false;
      state.addonTransactionDetail = payload.data[0];
      state.success = true;
    });

    builder.addCase(getAddonTransactionsDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.addonTransactionDetailLoader = false;
      state.error = payload;
    });
  },
});

export const {
  setAllTransactionsListCustomPagination,
  setAllAddonTransactionsListCustomPagination,
  setPolicyTransactionSearchFilter,
  setAddonTransactionSearchFilter
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
