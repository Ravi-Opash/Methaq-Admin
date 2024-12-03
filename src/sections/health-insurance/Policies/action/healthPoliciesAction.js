import { createAsyncThunk } from "@reduxjs/toolkit";
import healthPoliciesAPI from "src/services/api/health-insurance/health-policies";

// get all policies list api
export const getAllHealthPoliciesList = createAsyncThunk(
  "healthpolicies/getAllPoliciesList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.getAllHealthPoliciesListApi(data);
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
export const getHealthPolicyDetailById = createAsyncThunk(
  "healthpolicies/getHealthPolicyDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.getHealthPolicyDetailByIdApi(id);
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

// health policy upload
export const uploadHealthPolicyFile = createAsyncThunk(
  "healthpolicies/uploadHealthPolicyFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.uploadHealthPolicyFileApi(data);
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

// edit Policy Number
export const updatehealthPolicyFinanceDetails = createAsyncThunk(
  "health-policies/updateHealthPolicyFinanceDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.updatehealthPolicyFinanceDetailsApi(data);
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
export const uploadHealthFinancePolicyFile = createAsyncThunk(
  "policies/uploadHealthFinancePolicyFile",
  async ({ policyId, data }, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.uploadHealthFinancePolicyFileApi(policyId, data);
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

// get comment list
export const getHealthPolicyCommetById = createAsyncThunk(
  "policies/getHealthPolicyCommetById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.getHealthPolicyCommetByIdApi(id);
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

// create comments for customer id
export const createHealthPolicyComment = createAsyncThunk(
  "customer/createHealthPolicyComment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.createHealthPolicyCommentApi(data);
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
// get policy transaction table
export const getHealthPolicyTransactions = createAsyncThunk(
  "customer/getHealthPolicyTransactions",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.getHealthPolicyTransactionsApi(data);
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

// get health policy csv
export const exportHealthPolicyCSVFile = createAsyncThunk(
  "customer/exportHealthPolicyCSVFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.exportHealthPolicyCSVFileApi(data);
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

// get health policy csv
export const exportHealthPolicyCSVFilePraktora = createAsyncThunk(
  "customer/exportHealthPolicyCSVFilePraktora",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.exportHealthPolicyCSVFilePraktoraApi(data);
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
