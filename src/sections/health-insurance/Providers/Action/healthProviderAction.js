import { createAsyncThunk } from "@reduxjs/toolkit";
import healthProviderAPI from "src/services/api/health-insurance/health-provider";

// get all quotations list api
export const getAllHealthProviderList = createAsyncThunk(
  "healthProvider/getAllHealthProviderList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthProviderAPI.getHealthProviderListApi(data);
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

// add new company api
export const addHealthProvider = createAsyncThunk(
  "healthProvider/addHealthProvider",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthProviderAPI.addHealthProviderApi(data);
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

// update benifits by id api
export const updateHealthProviderApi = createAsyncThunk(
  "healthProvider/updateHealthProviderApi",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthProviderAPI.updateHealthProviderApi(data);
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

export const getHealthProviderDetailById = createAsyncThunk(
  "healthProvider/getHealthProviderDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthProviderAPI.getHealthProviderDetailByIdApi(id);
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

export const deleteHealthProviderById = createAsyncThunk(
  "company/deleteHealthProviderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await healthProviderAPI.deleteHealthProviderByIdApi(id);
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

// get all networks's provider list api
export const getHealthNetworkProviderById = createAsyncThunk(
  "healthProvider/getHealthNetworkProviderById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await healthProviderAPI.getHealthNetworkProviderByIdApi(data);
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
