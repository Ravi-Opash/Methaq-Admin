import { createAsyncThunk } from "@reduxjs/toolkit";
import healthPoliciesAPI from "src/services/api/health-insurance/health-policies";
import motorFleetPoliciesAPI from "src/services/api/motor-fleet/motor-fleet-policies";

// get all policies list api
export const getAllMotorFleetPoliciesList = createAsyncThunk(
  "motorFleetPolicies/getAllPoliciesList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetPoliciesAPI.getAllMotorFleetPoliciesListApi(data);
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
export const getMotorFleetPolicyDetailById = createAsyncThunk(
  "healthpolicies/getMotorFleetPolicyDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await motorFleetPoliciesAPI.getMotorFleetPolicyDetailByIdApi(id);
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

// post customer policy doc by customer id
export const postTravelPolicyDocByCustomerId = createAsyncThunk(
  "customer/postTravelPolicyDocByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthPoliciesAPI.postTravelPolicyDocByCustomerIdApi(data);
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
export const getMotorFleetPolicyCommetById = createAsyncThunk(
  "policies/getMotorFleetPolicyCommetById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await motorFleetPoliciesAPI.getMotorFleetPolicyCommetByIdApi(id);
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
export const createMotorFleetPolicyComment = createAsyncThunk(
  "customer/createMotorFleetPolicyComment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetPoliciesAPI.createMotorFleetPolicyCommentApi(data);
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
      const response = await motorFleetPoliciesAPI.updatetravelPolicyFinanceDetailsApi(data);
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
      const response = await motorFleetPoliciesAPI.uploadTravelFinancePolicyFileApi(policyId, data);
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

// get Motor Fleet policy transaction table
export const getMotorFleetPolicyTransactions = createAsyncThunk(
  "policies/getMotorFleetPolicyTransactions",
  async (data, { rejectWithValue }) => {
    try {
      const response = await motorFleetPoliciesAPI.getMotorFleetPolicyTransactionsApi(data);
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

// remove RegistartionCards in proposal detail
export const setMotorFleetAdminProposalVisitHistory = createAsyncThunk(
  "proposal-detail/setMotorFleetAdminProposalVisitHistory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await motorFleetPoliciesAPI.setMotorFleetAdminProposalVisitHistoryApi(id);
      return response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Motor Fleet Insurance Upload Policies
export const uploadMotorFleetePolicyFile = createAsyncThunk(
  "policies/uploadMotorFleetPolicyFile",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await motorFleetPoliciesAPI.uploadMotorFleetPolicyFileApi(id, data);
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
