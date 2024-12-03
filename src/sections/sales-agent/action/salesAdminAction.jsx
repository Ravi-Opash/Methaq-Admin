import { createAsyncThunk } from "@reduxjs/toolkit";
import salesAdminAPI from "src/services/api/sales-agent";
import adminAPI from "src/services/api/sub-admins";

// get company list api
export const getSalesAdminsList = createAsyncThunk(
  "sub-admins/getSalesAdminsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await salesAdminAPI.getSlaesAdminsListApi(data);
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

// add new admin api
export const addNewSalesAdmin = createAsyncThunk(
  "sub-admins/addNewSalesAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await salesAdminAPI.addNewSalesAdminApi(data);
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

// update company by id api
export const updateSalesAdminById = createAsyncThunk(
  "sub-admins/updateSalesAdminById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await salesAdminAPI.updateSalesAdminByIdApi(data);
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

// delete admin by id api
export const deleteSalesAdminById = createAsyncThunk(
  "sub-admins/deleteSalesAdminById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await salesAdminAPI.deleteSalesAdminByIdApi(id);
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

// get admin by id api
export const getSalesAdminDetailById = createAsyncThunk(
  "sub-admins/getSalesAdminDetailById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await salesAdminAPI.getSalesAdminDetailByIdApi(id);
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

// get admin by id api
export const getSalesAdminproposalList = createAsyncThunk(
  "sub-admins/getSalesAdminproposalList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await salesAdminAPI.getSalesAdminproposalListApi(data);
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
