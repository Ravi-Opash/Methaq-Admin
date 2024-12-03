import { createSlice } from "@reduxjs/toolkit";
import {
  addHealthProvider,
  getAllHealthProviderList,
  getHealthNetworkProviderById,
  getHealthProviderDetailById,
  updateHealthProviderApi,
} from "../Action/healthProviderAction";

const healthProviderSlice = createSlice({
  name: "healthProvider",
  initialState: {
    allHealthProviderListLoader: false,
    allHealthProviderList: null,
    allHealthProviderListPagination: null,
    healthQuotationDetails: null,
    healthProviderDetails: null,
    healthProviderSelectedListLoader: false,
    healthProviderSelectedList: null,
    healthProviderDetailLoader: false,
    allHealthProviderSearchFilter: null,
    allHelathProviderListCustomPagination: {
      page: 1,
      size: 10,
    },
    healthNetworkProviderListCustomPagination: {
      page: 1,
      size: 10,
    },
    error: null,
  },
  reducers: {
    setAllHealthProviderListCustomPagination: (state, action) => {
      state.allHelathProviderListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    clearProvideDetail: (state, action) => {
      state.healthProviderDetails = null;
    },
    setAllHealthNetworkProviderListCustomPagination: (state, action) => {
      state.healthNetworkProviderListCustomPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    clearHealthProviderSelectedList: (state, action) => {
      state.healthProviderSelectedList = null;
    },
    setHealthProviderSearchFilter: (state, action) => {
      state.allHealthProviderSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get all quotations list api
    builder.addCase(getAllHealthProviderList.pending, (state, { payload }) => {
      state.allHealthProviderListLoader = true;
    });

    builder.addCase(getAllHealthProviderList.fulfilled, (state, { payload }) => {
      // console.log(payload, "ss");
      state.allHealthProviderListLoader = false;
      state.allHealthProviderList = payload.data;
      state.allHealthProviderListPagination = payload.pagination;
    });

    builder.addCase(getAllHealthProviderList.rejected, (state, { payload }) => {
      state.allHealthProviderListLoader = false;
      state.error = payload;
    });

    builder.addCase(addHealthProvider.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addHealthProvider.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addHealthProvider.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // update benifits by id api
    builder.addCase(updateHealthProviderApi.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(updateHealthProviderApi.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(updateHealthProviderApi.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get benifits by id api
    builder.addCase(getHealthProviderDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthProviderDetailLoader = true;
      state.healthProviderDetails = null;
    });

    builder.addCase(getHealthProviderDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthProviderDetailLoader = false;
      state.healthProviderDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthProviderDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthProviderDetailLoader = false;
      state.error = payload;
    });

    // get benifits by id api
    builder.addCase(getHealthNetworkProviderById.pending, (state, { payload }) => {
      state.loading = true;
      state.healthProviderSelectedListLoader = true;
      state.healthProviderSelectedList = null;
    });

    builder.addCase(getHealthNetworkProviderById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.healthProviderSelectedListLoader = false;
      state.healthProviderSelectedList = payload.data;
      state.success = true;
    });

    builder.addCase(getHealthNetworkProviderById.rejected, (state, { payload }) => {
      state.loading = false;
      state.healthProviderSelectedListLoader = false;
      state.error = payload;
    });
  },
});

export const {
  setAllHealthProviderListCustomPagination,
  clearProvideDetail,
  clearHealthProviderSelectedList,
  setAllHealthNetworkProviderListCustomPagination,
  setHealthProviderSearchFilter,
} = healthProviderSlice.actions;

export default healthProviderSlice.reducer;
