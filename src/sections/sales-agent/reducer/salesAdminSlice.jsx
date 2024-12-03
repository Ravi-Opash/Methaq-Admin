import { createSlice } from "@reduxjs/toolkit";
import {
  addNewSalesAdmin,
  deleteSalesAdminById,
  getSalesAdminDetailById,
  getSalesAdminproposalList,
  getSalesAdminsList,
  updateSalesAdminById,
} from "../action/salesAdminAction";

const slaesAdminsSlice = createSlice({
  name: "salesAdmins",
  initialState: {
    loading: false,
    error: null,
    salesAdminList: null,
    salesAdminListPagination: null,
    salesAdminDetail: null,
    salesAdminListLoader: false,
    salesAdminDetailLoader: false,
    companyDetailLoader: false,
    salesAdminSearchFilter: null,
    pagination: {
      page: 1,
      size: 5,
    },
    salesAgentProposalListApiPagination: null,
    salesAgentProposalList: null,
    salesAgentProposalListLoader: false,
    salesAgentProposalListPagination: {
      page: 1,
      size: 10,
    },
    success: false,
  },
  reducers: {
    setSalesAdminDetail: (state, action) => {
      state.salesAdminDetail = action.payload;
    },
    setSalesAdminListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setSalesAdminProposalListPagination: (state, action) => {
      state.salesAgentProposalListPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setSalesadminSearchFilter: (state, action) => {
      state.salesAdminSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get company list api
    builder.addCase(getSalesAdminsList.pending, (state, { payload }) => {
      state.loading = true;
      state.salesAdminListLoader = true;
    });

    builder.addCase(getSalesAdminsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.salesAdminListLoader = false;
      state.salesAdminList = payload.data;
      state.salesAdminListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getSalesAdminsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.salesAdminListLoader = false;
      state.error = payload;
    });

    // add new Admin api
    builder.addCase(addNewSalesAdmin.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(addNewSalesAdmin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(addNewSalesAdmin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    //  delete salesAdmin by id api
    builder.addCase(deleteSalesAdminById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(deleteSalesAdminById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(deleteSalesAdminById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get salesAdmin by id api
    builder.addCase(getSalesAdminDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.salesAdminDetailLoader = true;
    });

    builder.addCase(getSalesAdminDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.salesAdminDetailLoader = false;
      state.salesAdminDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getSalesAdminDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.salesAdminDetailLoader = false;
      state.error = payload;
    });

    // update salesAdmin by id api
    builder.addCase(updateSalesAdminById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(updateSalesAdminById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(updateSalesAdminById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // update salesAdmin by id api
    builder.addCase(getSalesAdminproposalList.pending, (state, { payload }) => {
      // state.loading = true;
      state.salesAgentProposalListLoader = true;
    });

    builder.addCase(getSalesAdminproposalList.fulfilled, (state, { payload }) => {
      // state.loading = false;
      state.success = true;
      state.salesAgentProposalListLoader = false;
      state.salesAgentProposalList = payload.data;
      state.salesAgentProposalListApiPagination = payload.pagination;
    });

    builder.addCase(getSalesAdminproposalList.rejected, (state, { payload }) => {
      // state.loading = false;
      state.salesAgentProposalListLoader = false;
      state.error = payload;
    });
  },
});

export const {
  setSalesAdminListPagination,
  setSalesAdminDetail,
  setSalesAdminProposalListPagination,
  setSalesadminSearchFilter,
} = slaesAdminsSlice.actions;

export default slaesAdminsSlice.reducer;
