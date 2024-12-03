import {
  editWorkmenCompensationById,
  getworkmenCompensationDetailById,
  getworkmenCompensationList,
} from "../Action/workmenCompensationAction";

const { createSlice } = require("@reduxjs/toolkit");

const workmenCompensationSlice = createSlice({
  name: "workmenCompensation",
  initialState: {
    loading: false,
    error: null,
    workmenCompensationList: null,
    workmenCompensationDetail: null,
    workmenCompensationLoader: false,
    workmenCompensationPagination: null,
    workmenCompensationSearchFilter: null,
    success: false,
    pagination: {
      page: 1,
      size: 10,
    },
  },
  reducers: {
    setWorkmenCompensationListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setWorkmenCompensationSearchfilter: (state, action) => {
      state.workmenCompensationSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get list
    builder.addCase(getworkmenCompensationList.pending, (state, { payload }) => {
      state.loading = true;
      state.workmenCompensationList = null;
      state.workmenCompensationPagination = null;
      state.workmenCompensationLoader = true;
    });

    builder.addCase(getworkmenCompensationList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.workmenCompensationLoader = false;
      state.workmenCompensationList = payload.data;
      state.workmenCompensationPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getworkmenCompensationList.rejected, (state, { payload }) => {
      state.loading = false;
      state.workmenCompensationLoader = false;
      state.error = payload;
    });

    // get workmenCompensation detail by id
    builder.addCase(getworkmenCompensationDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.workmenCompensationDetail = null;
    });

    builder.addCase(getworkmenCompensationDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.workmenCompensationDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getworkmenCompensationDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit workmenCompensation by id
    builder.addCase(editWorkmenCompensationById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(editWorkmenCompensationById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(editWorkmenCompensationById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setWorkmenCompensationListPagination, setWorkmenCompensationSearchfilter } =
  workmenCompensationSlice.actions;
export default workmenCompensationSlice.reducer;
