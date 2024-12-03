import {
  editMedicalMalPracticeDetailsById,
  getMedicalMalPracticeDetailById,
  getMedicalMalPracticeList,
} from "../Action/medicalmalepracticeAction";

const { createSlice } = require("@reduxjs/toolkit");

const medicalMalPracticeSlice = createSlice({
  name: "medicalMalPractice",
  initialState: {
    loading: false,
    error: null,
    medicalMalPracticeList: null,
    medicalMalPracticePagination: null,
    medicalMalPracticeLoader: false,
    success: false,
    medicalMalPracticeSearchFilter: null,
    pagination: {
      page: 1,
      size: 10,
    },
    medicalMalPracticeDetails: null,
  },
  reducers: {
    setMedicalMalPracticeListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setMedicalMalPracticeSearchFilter: (state, action) => {
      state.medicalMalPracticeSearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMedicalMalPracticeList.pending, (state, { payload }) => {
      state.medicalMalPracticeLoader = true;
      state.error = null;
    });
    builder.addCase(getMedicalMalPracticeList.fulfilled, (state, { payload }) => {
      state.medicalMalPracticeLoader = false;
      state.medicalMalPracticeList = payload.data;
      state.medicalMalPracticePagination = payload.pagination;
      state.success = true;
    });
    builder.addCase(getMedicalMalPracticeList.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // get medical malpracrice detail by id
    builder.addCase(getMedicalMalPracticeDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.medicalMalPracticeDetails = null;
    });

    builder.addCase(getMedicalMalPracticeDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.medicalMalPracticeDetails = payload.data;
      state.success = true;
    });

    builder.addCase(getMedicalMalPracticeDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit medical malpracrice detail by id
    builder.addCase(editMedicalMalPracticeDetailsById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(editMedicalMalPracticeDetailsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(editMedicalMalPracticeDetailsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});
export const { setMedicalMalPracticeListPagination,setMedicalMalPracticeSearchFilter } = medicalMalPracticeSlice.actions;
export default medicalMalPracticeSlice.reducer;
