import { createSlice } from "@reduxjs/toolkit";
import {
  changeProductStatusById,
  createProductData,
  deleteProductById,
  editProductData,
  getProductDetailsById,
  getProductList,
} from "../action/productAction";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    error: null,
    productList: null,
    productListLoader: false,
    productListPagination: null,
    productDetail: null,
    productDetailLoader: false,
    pagination: {
      page: 1,
      size: 10,
    },
    success: false,
  },
  reducers: {
    setproductDetail: (state, action) => {
      state.productDetail = action.payload;
    },
    setProductListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
  },
  extraReducers: (builder) => {
    // get product list
    builder.addCase(getProductList.pending, (state, { payload }) => {
      state.loading = true;
      state.productListLoader = true;
    });

    builder.addCase(getProductList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.productListLoader = false;
      state.productList = payload.data;
      state.productListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getProductList.rejected, (state, { payload }) => {
      state.loading = false;
      state.productListLoader = false;
      state.error = payload;
    });

    // get product details by id
    builder.addCase(getProductDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.productDetailLoader = true;
      state.productDetail = null;
    });

    builder.addCase(getProductDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.productDetailLoader = false;
      state.productDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getProductDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.productDetailLoader = false;
      state.error = payload;
    });

    // create product data
    builder.addCase(createProductData.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(createProductData.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(createProductData.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit product data
    builder.addCase(editProductData.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(editProductData.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(editProductData.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // delete product data
    builder.addCase(deleteProductById.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(deleteProductById.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(deleteProductById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // change product status
    builder.addCase(changeProductStatusById.pending, (state, { payload }) => {
      state.loading = false;
    });

    builder.addCase(changeProductStatusById.fulfilled, (state, { payload }) => {
      state.loading = true;
      state.success = true;
    });

    builder.addCase(changeProductStatusById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setproductDetail, setProductListPagination } = productSlice.actions;

export default productSlice.reducer;
