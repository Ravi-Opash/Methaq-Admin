import { createAsyncThunk } from "@reduxjs/toolkit";
import commercialAPI from "src/services/api/commercial";

// get list
export const getMedicalMalPracticeList = createAsyncThunk(
  "commercial/getMedicalMalPracticeList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await commercialAPI.getMedicalMalPracticeListApi(data);
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
export const getMedicalMalPracticeDetailById = createAsyncThunk(
  "commercial/getMedicalMalPracticeDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await commercialAPI.getMedicalMalPracticeByIdApi(id);
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
export const editMedicalMalPracticeDetailsById = createAsyncThunk(
  "commercial/editMedicalMalPracticeDetailsById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await commercialAPI.editMedicalMalPracticeDetailsByIdApi(
        id,
        data
      );
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
export const shareMedicalMalPracticePDFshare = createAsyncThunk(
  "commercial/shareMedicalMalPracticePDFshare",
  async ({ id, toEmail }, { rejectWithValue }) => {
      try {
          const response = await commercialAPI.shareMedicalMalPracticePDFshareApi(id, toEmail);
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
