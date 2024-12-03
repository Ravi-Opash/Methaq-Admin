import { getProfessionIndemnityById, getProfessionIndemnityList } from "../Action/professionalIndemnityAction";

const { createSlice } = require("@reduxjs/toolkit");

const professionIndemnitySlice = createSlice({
  name: "professionIndemnity",
  initialState: {
    loading: false,
    error: null,
    professionIndemnityList: null,
    professionIndemnityPagination: null,
    professionIndemnityLoader: false,
    success: false,
    profssionIndemnitySearchFilter: null,
    pagination: {
      page: 1,
      size: 10,
    },
    professionIndemnityDetails: null,
  },
  reducers: {
    setProfessionIndemnityListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setProfessionIndemnitySearchFilter: (state, action) => {
      state.profssionIndemnitySearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Get Profession Indemnity list
    builder.addCase(getProfessionIndemnityList.pending, (state, { payload }) => {
      (state.loading = true), (state.professionIndemnityList = null);
      state.professionIndemnityPagination = null;
      state.professionIndemnityLoader = true;
    });
    builder.addCase(getProfessionIndemnityList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.professionIndemnityLoader = false;
      state.professionIndemnityList = payload.data;
      state.professionIndemnityPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getProfessionIndemnityList.rejected, (state, { payload }) => {
      state.loading = false;
      state.professionIndemnityLoader = false;
      state.error = payload;
    });

    // get getProfessionIndemnity detail by id
    builder.addCase(getProfessionIndemnityById.pending, (state, { payload }) => {
      state.loading = true;
      state.professionIndemnityDetails = null;
    });

    builder.addCase(getProfessionIndemnityById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.professionIndemnityDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getProfessionIndemnityById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});
export const { setProfessionIndemnityListPagination, setProfessionIndemnitySearchFilter } =
  professionIndemnitySlice.actions;
export default professionIndemnitySlice.reducer;
