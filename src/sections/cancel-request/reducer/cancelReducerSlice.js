import { createSlice } from "@reduxjs/toolkit";
import { getCancelRequestsList } from "../action/cancelRequestAction";

const cancelRequestSlice = createSlice({
  name: "cancelRequests",
  initialState: {
    loading: false,
    error: null,
    cancelRequestList: null,
    cancelRequestListLoader: false,
    cancelRequestPagination: null,
    cancelRequestSearchFilter: null,
    pagination: {
      page: 1,
      size: 10,
    },
    success: false,
  },
  reducers: {
    setCancelRequestListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setCancelRequestsSearchFilter: (state, action) => {
      state.cancelRequestSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get cancelRequest list
    builder.addCase(getCancelRequestsList.pending, (state, { payload }) => {
      state.loading = true;
      state.cancelRequestListLoader = true;
      state.cancelRequestList = null;
      state.cancelRequestPagination = null;
    });

    builder.addCase(getCancelRequestsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.cancelRequestListLoader = false;
      state.cancelRequestList = payload.data;
      state.cancelRequestPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getCancelRequestsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.cancelRequestListLoader = false;
      state.error = payload;
    });
  },
});

export const { setCancelRequestListPagination, clearCancelRequestsDetails, setCancelRequestsSearchFilter } =
  cancelRequestSlice.actions;

export default cancelRequestSlice.reducer;
