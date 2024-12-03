import { createSlice } from "@reduxjs/toolkit";
import { getAllLandTransactionsList, getLandTransactionsDetailsById } from "../Action/landTransactionAction";

const landTransactionsSlice = createSlice({
  name: "landTransactions",
  initialState: {
    allLandTransactionsList: null,
    allLandTransactionsListPagination: null,
    allLandTransactionsListLoader: false,
    healthTransactionDetailLoader: false,
    landTransactionDetail: null,
    allLandTransectionsearchFilter: null,
    allLandTransactionsListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllLandTransactionsListCustomPagination: (state, action) => {
      state.allLandTransactionsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setAlllandtransactionSearchFilter: (state, action) => {
      state.allLandTransectionsearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all transactions list api
    builder.addCase(getAllLandTransactionsList.pending, (state, { payload }) => {
      state.allLandTransactionsListLoader = true;
    });

    builder.addCase(getAllLandTransactionsList.fulfilled, (state, { payload }) => {
      state.allLandTransactionsListLoader = false;
      state.allLandTransactionsList = payload.data;
      state.allLandTransactionsListPagination = payload.pagination;
    });

    builder.addCase(getAllLandTransactionsList.rejected, (state, { payload }) => {
      state.allLandTransactionsListLoader = false;
      state.error = payload;
    });

    builder.addCase(getLandTransactionsDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthTransactionDetailLoader = true;
      state.landTransactionDetail = null;
    });

    builder.addCase(getLandTransactionsDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthTransactionDetailLoader = false;
      state.landTransactionDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getLandTransactionsDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthTransactionDetailLoader = false;
      state.error = payload;
    });
  },
});

export const { setAllLandTransactionsListCustomPagination, setAlllandtransactionSearchFilter } = landTransactionsSlice.actions;

export default landTransactionsSlice.reducer;
