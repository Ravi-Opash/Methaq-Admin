import { createAsyncThunk } from "@reduxjs/toolkit";
import productAPI from "src/services/api/product";

// get product list
export const getProductList = createAsyncThunk(
  "product/getProductList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductListApi(data);
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

// get product details by id
export const getProductDetailsById = createAsyncThunk(
  "product/getProductDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductDetailsByIdApi(id);
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

// create product data
export const createProductData = createAsyncThunk(
  "product/createProductData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await productAPI.createProductDataApi(data);
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

// edit product data
export const editProductData = createAsyncThunk(
  "product/editProductData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await productAPI.editProductDataApi(data);
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

// delete product data
export const deleteProductById = createAsyncThunk(
  "product/deleteProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productAPI.deleteProductByIdApi(id);
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

// change product status
export const changeProductStatusById = createAsyncThunk(
  "product/changeProductStatusById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await productAPI.changeProductStatusByIdApi(data);
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
