import { createAsyncThunk } from "@reduxjs/toolkit";
import policiesAPI from "src/services/api/policies";

// get all policies list api
export const getAllPoliciesList = createAsyncThunk(
  "policies/getAllPoliciesList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await policiesAPI.getAllPoliciesListApi(data);
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
export const getAllQuotationsList = createAsyncThunk(
  "policies/getAllQuotationsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await policiesAPI.getAllQuotationsListApi(data);
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
// edit Policy Number
export const editPolicyNumber = createAsyncThunk(
  "policies/editPolicyNumber",
  async (data, { rejectWithValue }) => {
    try {
      const response = await policiesAPI.editPolicyNumberApi(data);
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

// edit Policy Number
export const UploadPolicyFile = createAsyncThunk(
  "policies/UploadPolicyFile",
  async ({ policyId, data }, { rejectWithValue }) => {
    try {
      const response = await policiesAPI.UploadPolicyFileApi(policyId, data);
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
export const exportPolicyCSVFile = createAsyncThunk(
  "policies/exportPolicyCSVFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await policiesAPI.exportPolicyCSVFileApi(data);
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
export const editCompanyToPolicy = createAsyncThunk(
  "policies/editCompanyToPolicy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await policiesAPI.editCompanyToPolicyApi(data);
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

// Download policy
export const getCarPolicyPdf = createAsyncThunk(
  "policies/getCarPolicyPdf",
  async ({id}, { rejectWithValue }) => {
    try {
      const response = await policiesAPI.getCarPolicyPdfApi(id);
      return response?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
