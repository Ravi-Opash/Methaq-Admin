import { createAsyncThunk } from "@reduxjs/toolkit";
import PraktoraPoliciesAPI from "src/services/api/praktoraPolicies.js/praktoraPolicies";

// get all praktora policies list Table api
export const getAllPraktoraPoliciesList = createAsyncThunk(
  "policies/getAllPraktoraPoliciesList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PraktoraPoliciesAPI.getAllPraktoraPoliciesListApi(data);
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

// get Praktora policy detail by id
export const getPraktoraPolicyDetailById = createAsyncThunk(
  "customer/getPraktoraPolicyDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await PraktoraPoliciesAPI.getPraktoraPolicyDetailByIdApi(id);
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

// praktora policy  api
export const praktoraUploadPolicyIssue = createAsyncThunk(
  "customer/praktoraUploadPolicyIssue",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await PraktoraPoliciesAPI.uploadPraktoraPolicyFileApi(data);
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
