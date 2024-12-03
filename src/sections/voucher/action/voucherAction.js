import { createAsyncThunk } from "@reduxjs/toolkit";
import voucherAPI from "src/services/api/voucher";

// get voucher list
export const getVoucherList = createAsyncThunk(
  "voucher/getVoucherList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await voucherAPI.getVoucherListApi(data);
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

// get voucher history list
export const getVoucherHistoryList = createAsyncThunk(
  "voucher/getVoucherHistoryList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await voucherAPI.getVoucherHistoryListApi(data);
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

// apply voucher
export const applyVoucher = createAsyncThunk(
  "voucher/applyVoucher",
  async (data, { rejectWithValue }) => {
    try {
      const response = await voucherAPI.applyVoucherApi(data);
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

// get voucher details by id
export const getVoucherDetailsById = createAsyncThunk(
  "voucher/getVoucherDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await voucherAPI.getVoucherDetailsByIdApi(id);
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

// add voucher
export const addVoucher = createAsyncThunk(
  "voucher/addVoucher",
  async (data, { rejectWithValue }) => {
    try {
      const response = await voucherAPI.addVoucherApi(data);
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

// edit voucher by id
export const editVoucherById = createAsyncThunk(
  "voucher/editVoucherById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await voucherAPI.editVoucherByIdApi(data);
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

// delete voucher api
export const deleteVoucherById = createAsyncThunk(
  "voucher/deleteVoucherById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await voucherAPI.deleteVoucherByIdApi(id);
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

// update voucher status by id
export const changeVoucherStatusById = createAsyncThunk(
  "voucher/changeVoucherStatusById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await voucherAPI.changeVoucherStatusByIdApi(data);
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
