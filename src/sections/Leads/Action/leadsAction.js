import { createAsyncThunk } from "@reduxjs/toolkit";
import leadsAPI from "src/services/api/leads";

// get leads list
export const getLeadsList = createAsyncThunk(
  "leads/getLeadsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await leadsAPI.getLeadsListApi(data);
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

// get leads list
export const getLeadDetailsById = createAsyncThunk(
  "leads/getLeadDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await leadsAPI.getLeadDetailsByIdApi(id);
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

//re generate proposal by customer id
export const reGenerateProposalByCustomerId = createAsyncThunk(
  "leads/reGenerateProposalByCustomerId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await leadsAPI.reGenerateProposalByCarId(data);
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
