import { createAsyncThunk } from "@reduxjs/toolkit";
import motorFleetTransactionsAPI from "src/services/api/motor-fleet/motor-fleet-transaction";

// get all transactions list api
export const getAllMotorFleetTransactionsList = createAsyncThunk(
  "travelPolicies/getAllMotorFleetTransactionsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetTransactionsAPI.getAllMotorFleetTransactionsListApi(data);
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
export const getMotorFleetTransactionsDetailsById = createAsyncThunk(
  "travelPolicies/getMotorFleetTransactionsDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await motorFleetTransactionsAPI.getMotorFleetTransactionsDetailsByIdApi(id);
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
