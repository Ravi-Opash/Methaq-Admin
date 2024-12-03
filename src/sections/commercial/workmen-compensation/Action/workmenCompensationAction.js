import { createAsyncThunk } from "@reduxjs/toolkit";
import CommercialAPI from "src/services/api/commercial";

// get commercial list
export const getworkmenCompensationList = createAsyncThunk(
  "commercial/getworkmenCompensationList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CommercialAPI.getworkmenCompensationListApi(data);
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
export const getworkmenCompensationDetailById = createAsyncThunk(
  "commercial/getworkmenCompensationDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await CommercialAPI.getworkmenCompensationDetailByIdApi(id);
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
export const editWorkmenCompensationById = createAsyncThunk(
  "commercial/editWorkmenCompensationById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await CommercialAPI.editWorkmenCompensationByIdApi(id, data);
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
export const shareWorkmenCompensationPDFshare = createAsyncThunk(
  "commercial/shareWorkmenCompensationPDFshare",
  async ({ id, toEmail }, { rejectWithValue }) => {
    try {
      const response = await CommercialAPI.shareWorkmenCompensationPDFshareApi(id, toEmail);
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
