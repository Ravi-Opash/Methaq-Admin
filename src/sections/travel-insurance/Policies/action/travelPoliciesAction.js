import { createAsyncThunk } from "@reduxjs/toolkit";
import travelPoliciesAPI from "src/services/api/travel-insurance/travel-policies";

// get all policies list api
export const getAllTravelPoliciesList = createAsyncThunk(
  "travelpolicies/getAllPoliciesList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.getAllTravelPoliciesListApi(data);
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
export const getTravelPolicyDetailById = createAsyncThunk(
  "travelpolicies/getTravelPolicyDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.getTravelPolicyDetailByIdApi(id);
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

// get comment list
export const getTravelPolicyCommetById = createAsyncThunk(
  "policies/getTravelPolicyCommetById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.getTravelPolicyCommetByIdApi(id);
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
export const createTravelPolicyComment = createAsyncThunk(
  "customer/createTravelPolicyComment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.createTravelPolicyCommentApi(data);
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
export const updatetravelPolicyFinanceDetails = createAsyncThunk(
  "policies/updatetravelPolicyFinanceDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.updatetravelPolicyFinanceDetailsApi(data);
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

// Upload Policy File From Finance section
export const uploadTravelFinancePolicyFile = createAsyncThunk(
  "policies/uploadTravelFinancePolicyFile",
  async ({ policyId, data }, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.uploadTravelFinancePolicyFileApi(policyId, data);
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
export const getTravelPolicyTransactions = createAsyncThunk(
  "customer/getTravelPolicyTransactions",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.getTravelPolicyTransactionsApi(data);
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

// policy issue api
export const travelPolicyIssue = createAsyncThunk(
  "customer/travelPolicyIssue",
  async ({id, data}, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.travelPolicyIssueApi(id, data);
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

// Travel policy download
export const downloadTravelPolicy = createAsyncThunk(
  "customer/downloadTravelPolicy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.downloadTravelPolicyApi(data);
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
export const exportTravelPolicyCSVFile = createAsyncThunk(
  "policies/exportTravelPolicyCSVFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await travelPoliciesAPI.exportTravelPolicyCSVFileApi(data);
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