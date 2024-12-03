import { createAsyncThunk } from "@reduxjs/toolkit";
import travelTransactionsAPI from "src/services/api/travel-insurance/travel-transaction";

// get all transactions list api
export const getAllTravelTransactionsList = createAsyncThunk(
  "travelPolicies/getAllTravelTransactionsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelTransactionsAPI.getAllTravelTransactionsListApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// get transaction details
export const getTravelTransactionsDetailsById = createAsyncThunk(
  "travelPolicies/getTravelTransactionsDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await travelTransactionsAPI.getTravelTransactionsDetailsByIdApi(id);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// export transactions
export const exportTravelTransactionCSVFile = createAsyncThunk(
  "policies/exportTravelTransactionCSVFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelTransactionsAPI.exportTravelTransactionCSVFileApi(data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
