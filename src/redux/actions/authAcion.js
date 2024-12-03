import { createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "src/services/api/auth";
import userAPI from "src/services/api/user";

// login admin api
export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authAPI.loginApi(data);
      // console.log("data - action", response.data);
      localStorage.setItem("accessToken", response.data.token);
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

// get admin details api
export const getAdminDetails = createAsyncThunk(
  "admin/getAdminDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userAPI.getAdminDetailsApi();
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

// logout admin api
export const logoutAdmin = createAsyncThunk(
  "admin/logoutAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userAPI.logoutApi();
      localStorage.clear();
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

// Change password
export const ChangeAgentPassword = createAsyncThunk(
  "admin/ChangeAgentPassword",
  async (data, { rejectWithValue }) => {
    // console.log("payload");
    try {
      const response = await userAPI.ChangeAgentPasswordApi(data);
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
