import { createAsyncThunk } from "@reduxjs/toolkit";
import sponsorsAPI from "src/services/api/sponsors";

// get company list api
export const getSponsorsList = createAsyncThunk(
  "company/getSponsorsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sponsorsAPI.getSponsorsListApi(data);
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

// get company by id api
export const getSponsorsDetailById = createAsyncThunk(
  "company/getSponsorsDetailById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sponsorsAPI.getSponsorsDetailByIdApi(data);
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
