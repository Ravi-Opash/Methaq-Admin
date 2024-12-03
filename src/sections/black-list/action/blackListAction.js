import { createAsyncThunk } from "@reduxjs/toolkit";
import blackListAPI from "src/services/api/black-list";

// get customer list api
export const getBlackList = createAsyncThunk("customer/getBlackList", async (data, { rejectWithValue }) => {
  try {
    const response = await blackListAPI.getBlackListApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get customer list api
export const deleteBlackList = createAsyncThunk("customer/deleteBlackList", async (data, { rejectWithValue }) => {
  try {
    const response = await blackListAPI.deleteBlackListApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Add fron and back covers
export const addFrontBackCover = createAsyncThunk("customer/addFrontBackCover", async (data, { rejectWithValue }) => {
  try {
    const response = await blackListAPI.addFrontBackCoverListApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Create black list API
export const createBlackList = createAsyncThunk("customer/createBlackList", async (data, { rejectWithValue }) => {
  try {
    const response = await blackListAPI.createBlackListApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});
