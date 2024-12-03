import { createAsyncThunk } from "@reduxjs/toolkit";
import benifitsAPI from "src/services/api/benifits";

// Get benefits list
export const getBenifitsList = createAsyncThunk("benifits/getBenifitsList", async (data, { rejectWithValue }) => {
  try {
    const response = await benifitsAPI.getBenifitsList(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get benifits by id api
export const getBenifitsDetailById = createAsyncThunk(
  "benifits/getBenifitsDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await benifitsAPI.getBenifitsDetailByIdApi(id);
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
export const updateBenifitsById = createAsyncThunk("benifits/updateBenifitsById", async (data, { rejectWithValue }) => {
  try {
    const response = await benifitsAPI.updateBenifitsByIdApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// add new benifits api
export const addNewBenifits = createAsyncThunk("benifits/addNewBenifits", async (data, { rejectWithValue }) => {
  try {
    const response = await benifitsAPI.addNewBenifitsApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// delete benifits by id api
export const deleteBenifitsById = createAsyncThunk("benifits/deleteBenifitsById", async (id, { rejectWithValue }) => {
  try {
    const response = await benifitsAPI.deleteBenifitsByIdApi(id);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});
