import { createAsyncThunk } from "@reduxjs/toolkit";
import adminAPI from "src/services/api/sub-admins";

// get company list api
export const getAdminsList = createAsyncThunk("sub-admins/getAdminsList", async (data, { rejectWithValue }) => {
  try {
    const response = await adminAPI.getAdminsListApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// add new admin api
export const addNewAdmin = createAsyncThunk("sub-admins/addNewAdmin", async (data, { rejectWithValue }) => {
  try {
    const response = await adminAPI.addNewAdminApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// update company by id api
export const updateAdminById = createAsyncThunk("sub-admins/updateAdminById", async (data, { rejectWithValue }) => {
  try {
    const response = await adminAPI.updateAdminByIdApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// delete admin by id api
export const deleteAdminById = createAsyncThunk("sub-admins/deleteAdminById", async (id, { rejectWithValue }) => {
  try {
    const response = await adminAPI.deleteAdminByIdApi(id);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// get admin by id api
export const getAdminDetailById = createAsyncThunk("sub-admins/getAdminDetailById", async (id, { rejectWithValue }) => {
  try {
    const response = await adminAPI.getAdminDetailByIdApi(id);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// change password by admin api
export const changePasswordByAdmin = createAsyncThunk(
  "sub-admins/changePasswordByAdmin",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.changePasswordByAdminApi(data, id);
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

// get list of otor Superviser agent list
export const fetchMotorSuperwiserAgentList = createAsyncThunk(
  "sub-admins/fetchMotorSuperwiserAgentList",
  async ({}, { rejectWithValue }) => {
    try {
      const response = await adminAPI.fetchMotorSuperwiserAgentListApi();
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
