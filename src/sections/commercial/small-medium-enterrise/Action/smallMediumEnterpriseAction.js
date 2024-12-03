import { createAsyncThunk } from "@reduxjs/toolkit";
import CommercialAPI from "src/services/api/commercial";

// get commercial list
export const getSmallMediumEnterpriseList = createAsyncThunk(
  "commercial/getSmallMediumEnterpriseList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CommercialAPI.getSmallBusinessEnterpriseListingApi(data);
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

// get detail by id
export const getSmallBusinessEnterpriseById = createAsyncThunk(
  "commercial/getSmallBusinessEnterpriseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await CommercialAPI.getSmallBusinessEnterpriseByIdApi(id);
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

// edit detail by id
export const editSmallBusinessEnterpriseById = createAsyncThunk(
  "commercial/editSmallBusinessEnterpriseById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await CommercialAPI.editSmallBusinessEnterpriseByIdApi(id, data);
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
// share commercial pdf
export const shareSmallBusinessEnterprisePDFshare = createAsyncThunk(
  "commercial/shareSmallBusinessEnterprisePDFshare",
  async ({ id, toEmail }, { rejectWithValue }) => {
    try {
      const response = await CommercialAPI.shareSmallBusinessPDFshareApi(id, toEmail);
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
