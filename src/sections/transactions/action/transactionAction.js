import { createAsyncThunk } from "@reduxjs/toolkit";
import transactionsAPI from "src/services/api/transaction";

// get all transactions list api
export const getAllTransactionsList = createAsyncThunk(
  "policies/getAllTransactionsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getAllTransactionsListApi(data);
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
export const getTransactionsDetailsById = createAsyncThunk(
  "transactions/getTransactionsDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getTransactionsDetailsByIdApi(id);
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
export const exportMotorTransactionCSVFile = createAsyncThunk(
  "policies/exportMotorTransactionCSVFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.exportMotorTransactionCSVFileApi(data);
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

// get all Addon transactions list api
export const getAllAddonTransactionsList = createAsyncThunk(
  "policies/getAllAddonTransactionsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getAllAddonTransactionsListApi(data);
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

// get Addon transaction details
export const getAddonTransactionsDetailsById = createAsyncThunk(
  "transactions/getAddonTransactionsDetailsById",
  async ({ id, code }, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getAddonTransactionsDetailsByIdApi({ id, code });
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
