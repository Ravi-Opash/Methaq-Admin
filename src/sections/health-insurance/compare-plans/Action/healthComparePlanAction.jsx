import { createAsyncThunk } from "@reduxjs/toolkit";
import healthCompanyAPI from "src/services/api/health-insurance/health-insurance-companies";

// get company by id api
export const getHealthComparePlans = createAsyncThunk(
  "company/getHealthComparePlans",
  async ({ ids, refId }, { rejectWithValue }) => {
    try {
      const response = await healthCompanyAPI.getHealthComparePlansApi(ids, refId);
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
