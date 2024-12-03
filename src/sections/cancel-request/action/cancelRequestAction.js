import { createAsyncThunk } from "@reduxjs/toolkit";
import cancelRequestsAPI from "src/services/api/cancel-request";

// get cancelRequests list
export const getCancelRequestsList = createAsyncThunk(
  "cancelRequests/getCancelRequestsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await cancelRequestsAPI.getCancelRequestsListApi(data);
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

// get cancelRequests list
export const cancelPolicyRequest = createAsyncThunk(
  "cancelRequests/cancelPolicyRequest",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await cancelRequestsAPI.cancelPolicyRequestApi({ id, data });
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

// get cancelRequests list
export const confirmCancellationPolicy = createAsyncThunk(
  "cancelRequests/confirmCancellationPolicy",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await cancelRequestsAPI.confirmCancellationPolicyApi({ id, data });
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
// Refund API
export const refundPaymentNetwork = createAsyncThunk(
  "cancelRequests/refundPaymentNetwork",
  async (data, { rejectWithValue }) => {
    try {
      const response = await cancelRequestsAPI.refundPaymentNetworkApi(data);
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
// Confirm Refund API
export const confirmRefundPaymentNetwork = createAsyncThunk(
  "cancelRequests/confirmRefundPaymentNetwork",
  async (data, { rejectWithValue }) => {
    try {
      const response = await cancelRequestsAPI.confirmRefundPaymentNetworkApi(data);
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
