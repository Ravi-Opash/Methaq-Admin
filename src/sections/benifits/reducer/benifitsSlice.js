import { createSlice } from "@reduxjs/toolkit";
import {
  getBenifitsList,
  addNewBenifits,
  deleteBenifitsById,
  getBenifitsDetailById,
  updateBenifitsById,
} from "../action/benifitsAction";

const benifitsSlice = createSlice({
  name: "benifits",
  initialState: {
    loading: false,
    error: null,
    benifitsList: null,
    benifitsListLoader: false,
    benifitsListPagination: null,
    benifitsDetail: null,
    benifitsDetailLoader: false,
    pagination: {
      page: 1,
      size: 10,
    },
    success: false,
  },
  reducers: {
    setBenifitsDetail: (state, action) => {
      state.benifitsDetail = action.payload;
    },
    setBenifitsListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
  },
  extraReducers: (builder) => {
    // get benifits list api
    builder.addCase(getBenifitsList.pending, (state, { payload }) => {
      state.loading = true;
      state.benifitsListLoader = true;
    });

    builder.addCase(getBenifitsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.benifitsListLoader = false;
      state.benifitsList = payload.data;
      state.benifitsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getBenifitsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.benifitsListLoader = false;
      state.error = payload;
    });

    // get benifits by id api
    builder.addCase(getBenifitsDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.benifitsDetailLoader = true;
      state.benifitsDetail = null;
    });

    builder.addCase(getBenifitsDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.benifitsDetailLoader = false;
      state.benifitsDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getBenifitsDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.benifitsDetailLoader = false;
      state.error = payload;
    });

    //  delete benifits by id api
    builder.addCase(deleteBenifitsById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteBenifitsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteBenifitsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // update benifits by id api
    builder.addCase(updateBenifitsById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(updateBenifitsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(updateBenifitsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // add new company api
    builder.addCase(addNewBenifits.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addNewBenifits.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addNewBenifits.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setBenifitsDetail, setBenifitsListPagination } = benifitsSlice.actions;

export default benifitsSlice.reducer;
