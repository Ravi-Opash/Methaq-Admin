import { createAsyncThunk } from "@reduxjs/toolkit";
import landInsuranceAPI from "src/services/api/land-insurance/land-insurance";

// get all transactions list api
export const getAllLandTransactionsList = createAsyncThunk(
  "landPolicies/getAllLandTransactionsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.getAllLandTransactionsListApi(data);
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
export const getLandTransactionsDetailsById = createAsyncThunk(
  "landPolicies/getLandTransactionsDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.getLandTransactionsDetailsByIdApi(id);
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
