import { createAsyncThunk } from "@reduxjs/toolkit";
import travelQuotationAPI from "src/services/api/travel-insurance/travel-quotation";

// get all quotations list api
export const getAllTravelQuotationsList = createAsyncThunk(
  "hatlhPolicies/getAllTravelQuotationsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelQuotationAPI.getAllTravelQuotationsListApi(data);
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
export const getTravelQuoationDetails = createAsyncThunk(
  "hatlhPolicies/getTravelQuoationDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelQuotationAPI.getTravelQuoationDetailsApi(data);
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

// update travel addons
export const updateTravelAddons = createAsyncThunk(
  "travelPolicies/updateTravelAddons",
  async ({id, data}, { rejectWithValue }) => {
    try {
      const response = await travelQuotationAPI.updateTravelAddonsApi(id, data);
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
