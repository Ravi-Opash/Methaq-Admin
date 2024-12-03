import { createAsyncThunk } from "@reduxjs/toolkit";
import landInsuranceAPI from "src/services/api/land-insurance/land-insurance";

// get all policies list api
export const getAllLandPoliciesList = createAsyncThunk(
  "landpolicies/getAllLandPoliciesList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.getAllLandPoliciesListApi(data);
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

// get customer policy detail by id
export const getLandPolicyDetailById = createAsyncThunk(
  "landpolicies/getLandPolicyDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.getLandPolicyDetailByIdApi(id);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

//get CSV list
export const exportLandPolicyCSVFile = createAsyncThunk(
  "landpolicies/exportLandPolicyCSVFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await landInsuranceAPI.exportLandPolicyCSVFileApi(data);
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
