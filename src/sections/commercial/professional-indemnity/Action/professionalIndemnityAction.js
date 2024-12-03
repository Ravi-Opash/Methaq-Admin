import { createAsyncThunk } from "@reduxjs/toolkit";
import commercialAPI from "src/services/api/commercial";

// get list
export const getProfessionIndemnityList = createAsyncThunk(
  "commercial/getProfessionIndemnityList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await commercialAPI.getProfessionIndemnityListApi(data);
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
// get profession Indemnity detail by id
export const getProfessionIndemnityById = createAsyncThunk(
  "commercial/getProfessionIndemnityById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await commercialAPI.getProfessionIndemnityByIdApi(id);
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
export const editProfesionIndemnityDetailsById = createAsyncThunk(
  "commercial/editProfesionIndemnityDetailsById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await commercialAPI.editProfessionIndemnityDetailsByIdApi(id, data);
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
export const shareProfesionIndemnityPDFshare = createAsyncThunk(
  "commercial/shareProfesionIndemnityPDFshare",
  async ({ id, toEmail }, { rejectWithValue }) => {
    try {
      const response = await commercialAPI.shareProfesionIndemnityPDFshareApi(id, toEmail);
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
