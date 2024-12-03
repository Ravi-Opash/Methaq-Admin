import { createSlice } from "@reduxjs/toolkit";
import { getAllHealthTransactionsList, getHealthTransactionsDetailsById } from "../Action/healthTransactionAction";

const healthTransactionsSlice = createSlice({
  name: "healthTransactions",
  initialState: {
    allHealthTransactionsList: null,
    allHealthTransactionsListPagination: null,
    allHealthTransactionsListLoader: false,
    healthTransactionDetailLoader: false,
    healthTransactionDetail: null,
    allHealthTransactionListSearchFilter: null,
    allHealthTransactionsListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllHealthTransactionsListCustomPagination: (state, action) => {
      state.allHealthTransactionsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setAllHealthTransactionListSearchFilter: (state, action) => {
      state.allHealthTransactionListSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all transactions list api
    builder.addCase(getAllHealthTransactionsList.pending, (state, { payload }) => {
      state.allHealthTransactionsListLoader = true;
    });

    builder.addCase(getAllHealthTransactionsList.fulfilled, (state, { payload }) => {
      state.allHealthTransactionsListLoader = false;
      state.allHealthTransactionsList = payload.data;
      state.allHealthTransactionsListPagination = payload.pagination;
    });

    builder.addCase(getAllHealthTransactionsList.rejected, (state, { payload }) => {
      state.allHealthTransactionsListLoader = false;
      state.error = payload;
    });

    builder.addCase(getHealthTransactionsDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthTransactionDetailLoader = true;
      state.healthTransactionDetail = null;
    });

    builder.addCase(getHealthTransactionsDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthTransactionDetailLoader = false;
      state.healthTransactionDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthTransactionsDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthTransactionDetailLoader = false;
      state.error = payload;
    });
  },
});

export const { setAllHealthTransactionsListCustomPagination, setAllHealthTransactionListSearchFilter } =
  healthTransactionsSlice.actions;

export default healthTransactionsSlice.reducer;
