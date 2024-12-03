import { createAsyncThunk } from "@reduxjs/toolkit";
import healthQuotationAPI from "src/services/api/health-insurance/health-quotation";

// get all quotations list api
export const getAllHealthQuotationsList = createAsyncThunk(
  "hatlhPolicies/getAllHealthQuotationsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthQuotationAPI.getAllHealthQuotationsListApi(data);
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
// get all quotations list api
export const getHealthQuoationDetails = createAsyncThunk(
  "hatlhPolicies/getHealthQuoationDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthQuotationAPI.getHealthQuoationDetailsApi(data);
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
