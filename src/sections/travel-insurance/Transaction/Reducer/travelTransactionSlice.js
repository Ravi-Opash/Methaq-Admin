import { createSlice } from "@reduxjs/toolkit";
import { getAllTravelTransactionsList, getTravelTransactionsDetailsById } from "../Action/travelTransactionAction";

const travelTransactionsSlice = createSlice({
  name: "travelTransactions",
  initialState: {
    allTravelTransactionsList: null,
    allTravelTransactionsListPagination: null,
    allTravelTransactionsListLoader: false,
    travelTransactionDetailLoader: false,
    travelTransactionDetail: null,
    TravelTransactionsSearchFilter: null,
    allTravelTransactionsListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllTravelTransactionsListCustomPagination: (state, action) => {
      state.allTravelTransactionsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setTravelTransactionSearchFilter: (state, action) => {
      state.TravelTransactionsSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all transactions list api
    builder.addCase(getAllTravelTransactionsList.pending, (state, { payload }) => {
      state.allTravelTransactionsListLoader = true;
    });

    builder.addCase(getAllTravelTransactionsList.fulfilled, (state, { payload }) => {
      state.allTravelTransactionsListLoader = false;
      state.allTravelTransactionsList = payload.data;
      state.allTravelTransactionsListPagination = payload.pagination;
    });

    builder.addCase(getAllTravelTransactionsList.rejected, (state, { payload }) => {
      state.allTravelTransactionsListLoader = false;
      state.error = payload;
    });

    // get transaction details by id
    builder.addCase(getTravelTransactionsDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.travelTransactionDetailLoader = true;
      state.travelTransactionDetail = null;
    });

    builder.addCase(getTravelTransactionsDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.travelTransactionDetailLoader = false;
      state.travelTransactionDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getTravelTransactionsDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.travelTransactionDetailLoader = false;
      state.error = payload;
    });
  },
});

export const { setAllTravelTransactionsListCustomPagination, setTravelTransactionSearchFilter } =
  travelTransactionsSlice.actions;

export default travelTransactionsSlice.reducer;
