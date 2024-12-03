import {
  editContractorPlantMachineryById,
  getcontractorPlantMachineryDetailById,
  getcontractorPlantMachineryList,
} from "../Action/contractorPlantMachineryAction";

const { createSlice } = require("@reduxjs/toolkit");

const contractorPlantMachinerySlice = createSlice({
  name: "contractorPlantMachinery",
  initialState: {
    loading: false,
    error: null,
    contractorPlantMachineryList: null,
    contractorPlantMachinerykDetail: null,
    contractorPlantMachineryLoader: false,
    contractorPlantMachineryPagination: null,
    contractorePlanetMachinerySearchFilter: null,
    success: false,
    pagination: {
      page: 1,
      size: 10,
    },
  },
  reducers: {
    setContractorPlantMachineryListPagination: (state, action) => {
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
      };
    },
    setContractorPlantMachinerySearchFilter: (state, action) => {
      state.contractorePlanetMachinerySearchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get contractor Plant Machinery list
    builder.addCase(getcontractorPlantMachineryList.pending, (state, { payload }) => {
      state.loading = true;
      state.contractorPlantMachineryList = null;
      state.contractorPlantMachineryPagination = null;
      state.contractorPlantMachineryLoader = true;
    });

    builder.addCase(getcontractorPlantMachineryList.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.contractorPlantMachineryLoader = false;
      state.contractorPlantMachineryList = payload.data;
      state.contractorPlantMachineryPagination = payload.pagination;
      state.success = true;
    });

    builder.addCase(getcontractorPlantMachineryList.rejected, (state, { payload }) => {
      state.loading = false;
      state.contractorPlantMachineryLoader = false;
      state.error = payload;
    });

    // get contractorPlantMachineryk detail by id
    builder.addCase(getcontractorPlantMachineryDetailById.pending, (state, { payload }) => {
      state.loading = true;
      state.contractorPlantMachinerykDetail = null;
    });

    builder.addCase(getcontractorPlantMachineryDetailById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.contractorPlantMachinerykDetail = payload.data;
      state.success = true;
    });

    builder.addCase(getcontractorPlantMachineryDetailById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    // edit contractorPlantMachinery by id
    builder.addCase(editContractorPlantMachineryById.pending, (state, { payload }) => {
      state.loading = true;
    });

    builder.addCase(editContractorPlantMachineryById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
    });

    builder.addCase(editContractorPlantMachineryById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setContractorPlantMachineryListPagination, setContractorPlantMachinerySearchFilter } =
  contractorPlantMachinerySlice.actions;
export default contractorPlantMachinerySlice.reducer;
