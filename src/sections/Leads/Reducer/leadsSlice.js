import { createSlice } from "@reduxjs/toolkit";
import { getLeadDetailsById, getLeadsList, reGenerateProposalByCustomerId } from "../Action/leadsAction";

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    loading: false,
    error: null,
    leadList: null,
    leadListLoader: false,
    leadPagination: null,
    leadDetails: null,
    leadSearchFilter: null,
    pagination: {
      page: 1,
      size: 10,
    },
    success: false,
  },
  reducers: {
    setLeadListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    clearLeadsDetails: (state, action) => {
      state.leadDetails = null;
    },
    setLeadsSearchFilter: (state, action) => {
      state.leadSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get lead list
    builder.addCase(getLeadsList.pending, (state, { payload }) => {
      state.loading = true;
      state.leadListLoader = true;
      state.leadList = null;
      state.leadPagination = null;
    });

    builder.addCase(getLeadsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.leadListLoader = false;
      state.leadList = payload.data;
      state.leadPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getLeadsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.leadListLoader = false;
      state.error = payload;
    });

    // get lead details
    builder.addCase(getLeadDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.leadDetails = null;
    });

    builder.addCase(getLeadDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.leadDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getLeadDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setLeadListPagination, clearLeadsDetails, setLeadsSearchFilter } = leadSlice.actions;

export default leadSlice.reducer;
