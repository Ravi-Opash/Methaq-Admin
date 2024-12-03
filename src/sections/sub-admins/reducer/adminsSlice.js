import { createSlice } from "@reduxjs/toolkit";
import {
  addNewAdmin,
  deleteAdminById,
  getAdminDetailById,
  getAdminsList,
  updateAdminById,
} from "../action/adminAcrion";

const adminsSlice = createSlice({
  name: "admins",
  initialState: {
    loading: false,
    error: null,
    adminList: null,
    adminListPagination: null,
    adminDetail: null,
    adminListLoader: false,
    companyDetailLoader: false,
    adminListSearchFilter: null,
    pagination: {
      page: 1,
      size: 5,
    },
    success: false,
  },
  reducers: {
    setAdminDetail: (state, action) => {
      state.adminDetail = action.payload;
    },
    setAdminListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setAdminListsearchFilter: (state, action) => {
      state.adminListSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get company list api
    builder.addCase(getAdminsList.pending, (state, { payload }) => {
      state.loading = true;
      state.adminListLoader = true;
    });

    builder.addCase(getAdminsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.adminListLoader = false;
      state.adminList = payload.data;
      state.adminListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getAdminsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.adminListLoader = false;
      state.error = payload;
    });

    // add new Admin api
    builder.addCase(addNewAdmin.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addNewAdmin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addNewAdmin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    //  delete admin by id api
    builder.addCase(deleteAdminById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteAdminById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteAdminById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get admin by id api
    builder.addCase(getAdminDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.adminDetailLoader = true;
    });

    builder.addCase(getAdminDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.adminDetailLoader = false;
      state.adminDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getAdminDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.adminDetailLoader = false;
      state.error = payload;
    });

    // update admin by id api
    builder.addCase(updateAdminById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(updateAdminById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(updateAdminById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setAdminDetail, setAdminListPagination, setAdminListsearchFilter } = adminsSlice.actions;

export default adminsSlice.reducer;
