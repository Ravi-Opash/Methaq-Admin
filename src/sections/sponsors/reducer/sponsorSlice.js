import { createSlice } from "@reduxjs/toolkit";
import { getSponsorsDetailById, getSponsorsList } from "../action/sponsorAction";

const sponsorsSlice = createSlice({
  name: "sponsors",
  initialState: {
    loading: false,
    error: null,
    sponsorsList: null,
    sponsorsListLoader: false,
    pagination: {
      page: 1,
      size: 10,
    },
    sponsorsPagination: {
      page: 1,
      size: 10,
    },
    success: false,
    sponsorsListPagination: null,
    sponsorsDetailsLoader: false,
    sponsorsDetailsList: null,
    sponsorsDetailsListPagination: null,
    sponsorsDetailsPagination: {
      page: 1,
      size: 10,
    },
  },
  reducers: {
    setSponsorsListPagination: (state, action) => {
      state.sponsorsPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setSponsorsDetailsListPagination: (state, action) => {
      state.sponsorsDetailsPagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
  },
  extraReducers: (builder) => {
    // get company list api
    builder.addCase(getSponsorsList.pending, (state, { payload }) => {
      state.loading = true;
      state.sponsorsListLoader = true;
    });

    builder.addCase(getSponsorsList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.sponsorsListLoader = false;
      state.sponsorsList = payload.data;
      state.sponsorsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getSponsorsList.rejected, (state, { payload }) => {
      state.loading = false;
      state.sponsorsListLoader = false;
      state.error = payload;
    });

    // get company by id api
    builder.addCase(getSponsorsDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.sponsorsDetailsLoader = true;
      state.sponsorsDetailsList = null;
    });

    builder.addCase(getSponsorsDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.sponsorsDetailsLoader = false;
      state.sponsorsDetailsList = payload.data;
      state.sponsorsDetailsListPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getSponsorsDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.sponsorsDetailsLoader = false;
      state.error = payload;
    });
  },
});

export const { setSponsorsListPagination, setSponsorsDetailsListPagination } =
  sponsorsSlice.actions;

export default sponsorsSlice.reducer;
