import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentLinksAPI from "src/services/api/payment-link";

// get Transection List
export const getPaymentLinksList = createAsyncThunk(
  "PaymentLinks/getPaymentLinksList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await paymentLinksAPI.getPaymentLinksListApi(data);
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

// Genrate Payment Links
export const getpayByLink = createAsyncThunk("PaymentLinks/getpayByLink", async (data, { rejectWithValue }) => {
  try {
    const response = await paymentLinksAPI.getpayByLinkApi(data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message);
    } else {
      return rejectWithValue(error.message);
    }
  }
});

// Genrate Payment Links
export const getPaymentDetailsById = createAsyncThunk(
  "PaymentLinks/getPaymentDetailsById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await paymentLinksAPI.getPaymentDetailsByIdApi(id);
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

// export payment csv file
export const exportPaymentCSVFile = createAsyncThunk(
  "policies/exportPaymentCSVFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await paymentLinksAPI.exportPaymentCSVFileApi(data);
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
