import {
  editSmallBusinessEnterpriseById,
  getSmallBusinessEnterpriseById,
  getSmallMediumEnterpriseList,
} from "../Action/smallMediumEnterpriseAction";

const { createSlice } = require("@reduxjs/toolkit");

const smallMediumEnterpriseSlice = createSlice({
  name: "smallMediumEnterprise",
  initialState: {
    loading: false,
    error: null,
    smallMediumEnterpriseList: null,
    smallMediumEnterpriseDetail: null,
    smallMediumEnterpriseLoader: false,
    smallMediumEnterprisePagination: null,
    smallMediumEnterpriseSearchFilter: null,
    success: false,
    pagination: {
      page: 1,
      size: 10,
    },
  },
  reducers: {
    setSmallMediumEnterpriseListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setSmallMediumEnterpriseSearchFilter: (state, action) => {
      state.smallMediumEnterpriseSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSmallMediumEnterpriseList.pending, (state, { payload }) => {
      state.loading = true;
      state.smallMediumEnterpriseList = null;
      state.smallMediumEnterprisePagination = null;
      state.smallMediumEnterpriseLoader = true;
    });

    builder.addCase(getSmallMediumEnterpriseList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.smallMediumEnterpriseLoader = false;
      state.smallMediumEnterpriseList = payload.data;
      state.smallMediumEnterprisePagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getSmallMediumEnterpriseList.rejected, (state, { payload }) => {
      state.loading = false;
      state.smallMediumEnterpriseLoader = false;
      state.error = payload;
    });

    // get smallMediumEnterprise detail by id
    builder.addCase(getSmallBusinessEnterpriseById.pending, (state, { payload }) => {
      state.loading = true;
      state.smallMediumEnterpriseDetail = null;
    });

    builder.addCase(getSmallBusinessEnterpriseById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.smallMediumEnterpriseDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getSmallBusinessEnterpriseById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit smallMediumEnterprise by id
    builder.addCase(editSmallBusinessEnterpriseById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(editSmallBusinessEnterpriseById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(editSmallBusinessEnterpriseById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setSmallMediumEnterpriseListPagination, setSmallMediumEnterpriseSearchFilter } =
  smallMediumEnterpriseSlice.actions;
export default smallMediumEnterpriseSlice.reducer;
