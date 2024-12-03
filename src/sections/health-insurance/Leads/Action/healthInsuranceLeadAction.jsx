import { createAsyncThunk } from "@reduxjs/toolkit";
import healthInsuranceAPI from "src/services/api/health-insurance/health-insurance-proposal";
import leadsAPI from "src/services/api/leads";

// get leads list
export const getHealthLeads = createAsyncThunk("healthInsurance/getHealthLeads", async (data, { rejectWithValue }) => {
  try {
    const response = await healthInsuranceAPI.getHealthLeadsApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get leads list
export const getHealthLeadsDetailById = createAsyncThunk(
  "leads/getHealthLeadsDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthInsuranceAPI.getHealthLeadsDetailByIdApi(id);
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

// edit leads details
export const updateHealthLeadDetailsById = createAsyncThunk(
    "healthInsurance/updateHealthLeadDetailsById",
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await healthInsuranceAPI.updateHealthLeadDetailByIdApi(id, data);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data.message) {
          console.log(error, "data");
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  );
