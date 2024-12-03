import { createSlice } from "@reduxjs/toolkit";
import {
  addVoucher,
  changeVoucherStatusById,
  deleteVoucherById,
  editVoucherById,
  getVoucherDetailsById,
  getVoucherHistoryList,
  getVoucherList,
} from "../action/voucherAction";

const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    loading: false,
    error: null,
    voucherList: null,
    voucherListLoader: false,
    voucherListPagination: null,
    voucherDetail: null,
    voucherDetailLoader: false,
    voucherSearchfilter: null,
    pagination: {
      page: 1,
      size: 10,
    },

    //voucher History
    voucherHistoryList: null,
    voucherHistoryListLoader: false,
    voucherHistoryListPagination: null,
    voucherHistoryPagination: {
      page: 1,
      size: 10,
    },
    success: false,
  },

  reducers: {
    setVoucherListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setVoucherHistoryListPagination: (state, action) => {
      state.voucherHistoryPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setVoucherDetail: (state, action) => {
      state.voucherDetail = action.payload;
    },
    setVoucherDetailsSearchFilter: (state, action) => {
      state.voucherSearchfilter = action.payload;
      console.log(action,"ser")
    },
  },
  extraReducers: (builder) => {
    // get voucher list
    builder.addCase(getVoucherList.pending, (state, { payload }) => {
      state.loading = true;
      state.voucherListLoader = true;
    });

    builder.addCase(getVoucherList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.voucherListLoader = false;
      state.voucherList = payload.data;
      state.voucherListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getVoucherList.rejected, (state, { payload }) => {
      state.loading = false;
      state.voucherListLoader = false;
      state.error = payload;
    });

    // get voucher history list
    builder.addCase(getVoucherHistoryList.pending, (state, { payload }) => {
      state.loading = true;
      state.voucherHistoryListLoader = true;
    });

    builder.addCase(getVoucherHistoryList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.voucherHistoryListLoader = false;
      state.voucherHistoryList = payload.data;
      state.voucherHistoryListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getVoucherHistoryList.rejected, (state, { payload }) => {
      state.loading = false;
      state.voucherHistoryListLoader = false;
      state.error = payload;
    });

    // get voucher details by id
    builder.addCase(getVoucherDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.voucherDetailLoader = true;
      state.voucherDetail = null;
    });

    builder.addCase(getVoucherDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.voucherDetailLoader = false;
      state.voucherDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getVoucherDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.voucherDetailLoader = false;
      state.error = payload;
    });

    // add voucher
    builder.addCase(addVoucher.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addVoucher.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addVoucher.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit voucher by id
    builder.addCase(editVoucherById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(editVoucherById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(editVoucherById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // delete voucher api
    builder.addCase(deleteVoucherById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteVoucherById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteVoucherById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // update voucher status by id
    builder.addCase(changeVoucherStatusById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(changeVoucherStatusById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(changeVoucherStatusById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const {
  setVoucherListPagination,
  setVoucherHistoryListPagination,
  setVoucherDetail,
  setVoucherDetailsSearchFilter,
} = voucherSlice.actions;

export default voucherSlice.reducer;
