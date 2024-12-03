import { createSlice } from "@reduxjs/toolkit";
import { getAllMotorFleetTransactionsList, getMotorFleetTransactionsDetailsById } from "../Action/motorFleetTransactionAction";

const motorFleetTransactionsSlice = createSlice({
  name: "motorFleetTransactions",
  initialState: {
    allMotorFleetTransactionsList: null,
    allMotorFleetTransactionsListPagination: null,
    allMotorFleetTransactionsListLoader: false,
    motorFleetTransactionDetailLoader: false,
    motorFleetTransactionDetail: null,
    allMotorFleetTransactionsListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllMotorFleetTransactionsListCustomPagination: (state, action) => {
      state.allMotorFleetTransactionsListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
  },
  extraReducers: (builder) => {
    // get all transactions list api
    builder.addCase(getAllMotorFleetTransactionsList.pending, (state, { payload }) => {
      state.allMotorFleetTransactionsListLoader = true;
    });

    builder.addCase(getAllMotorFleetTransactionsList.fulfilled, (state, { payload }) => {
      state.allMotorFleetTransactionsListLoader = false;
      state.allMotorFleetTransactionsList = payload.data;
      state.allMotorFleetTransactionsListPagination = payload.pagination;
    });

    builder.addCase(getAllMotorFleetTransactionsList.rejected, (state, { payload }) => {
      state.allMotorFleetTransactionsListLoader = false;
      state.error = payload;
    });

    builder.addCase(getMotorFleetTransactionsDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.motorFleetTransactionDetailLoader = true;
      state.motorFleetTransactionDetail = null;
    });

    builder.addCase(getMotorFleetTransactionsDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.motorFleetTransactionDetailLoader = false;
      state.motorFleetTransactionDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getMotorFleetTransactionsDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.motorFleetTransactionDetailLoader = false;
      state.error = payload;
    });
  },
});

export const { setAllMotorFleetTransactionsListCustomPagination } = motorFleetTransactionsSlice.actions;

export default motorFleetTransactionsSlice.reducer;
