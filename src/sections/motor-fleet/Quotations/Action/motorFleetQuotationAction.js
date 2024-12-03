import { createAsyncThunk } from "@reduxjs/toolkit";
import motorFleetQuotationAPI from "src/services/api/motor-fleet/motor-fleet-quotation";

// get all quotations list api
export const getAllMotorFleetQuotationsList = createAsyncThunk(
  "motorFleetQuotation/getAllMotorFleetQuotationsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetQuotationAPI.getAllMotorFleetQuotationsListApi(data);
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
export const getMotorFleetQuoationDetails = createAsyncThunk(
  "motorFleetQuotation/getMotorFleetQuoationDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetQuotationAPI.getMotorFleetQuotationById(data);
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
