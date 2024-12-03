import { createSlice } from "@reduxjs/toolkit";
import { getPetDetailsById, getPetInsuranceList } from "../Action/petInsuranceAction";

const petInsuranceSlice = createSlice({
  name: "petInsurance",
  initialState: {
    loading: false,
    error: null,
    petInsuranceList: null,
    petInsuranceLoader: false,
    petInsurancePagination: null,
    petInsuranceSearchFilter: null,
    pagination: {
      page: 1,
      size: 10,
    },
    petDetails: null,
    success: false,
  },
  reducers: {
    setPetInsuranceListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setPetInsuranceSearchFilter: (state, action) => {
      state.petInsuranceSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get pet insurance list
    builder.addCase(getPetInsuranceList.pending, (state, { payload }) => {
      state.loading = true;
      state.petInsuranceLoader = true;
      state.petInsuranceList = null;
      state.petInsurancePagination = null;
    });

    builder.addCase(getPetInsuranceList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.petInsuranceLoader = false;
      state.petInsuranceList = payload.data;
      state.petInsurancePagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getPetInsuranceList.rejected, (state, { payload }) => {
      state.loading = false;
      state.petInsuranceLoader = false;
      state.error = payload;
    });

    // get pet details by id
    builder.addCase(getPetDetailsById.pending, (state, { payload }) => {
      state.loading = true;
      state.petDetails = null;
    });

    builder.addCase(getPetDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.petDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getPetDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});
export const { setPetInsuranceListPagination, setPetInsuranceSearchFilter } = petInsuranceSlice.actions;

export default petInsuranceSlice.reducer;
