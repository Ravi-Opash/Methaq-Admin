import { createAsyncThunk } from "@reduxjs/toolkit";
import healthTransactionsAPI from "src/services/api/health-insurance/health-transaction";

// get all transactions list api
export const getAllHealthTransactionsList = createAsyncThunk(
  "healthPolicies/getAllHealthTransactionsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthTransactionsAPI.getAllHealthTransactionsListApi(data);
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
export const getHealthTransactionsDetailsById = createAsyncThunk(
  "healthPolicies/getHealthTransactionsDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthTransactionsAPI.getHealthTransactionsDetailsByIdApi(id);
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

// export policy csv file
export const exportHealthTransactionCSVFile = createAsyncThunk(
  "policies/exportHealthTransactionCSVFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthTransactionsAPI.exportHealthTransactionCSVFileApi(data);
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
