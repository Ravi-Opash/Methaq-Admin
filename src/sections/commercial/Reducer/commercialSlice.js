import { getCommercialDetailById, getCommercialList } from "../Action/commercialAction";

const { createSlice } = require("@reduxjs/toolkit");

const commercialSlice = createSlice({
    name: "commercial",
    initialState: {
        loading: false,
        error: null,
        commericalList: null,
        commercialDetail: null,
        commercialLoader: false,
        success: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getCommercialList.pending, (state, { payload }) => {
            state.loading = true;
            state.commericalList = null;
            state.leadPagination = null;
        });

        builder.addCase(getCommercialList.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.commercialLoader = false;
            state.commericalList = payload.data;
            state.success = true;
        });

        builder.addCase(getCommercialList.rejected, (state, { payload }) => {
            state.loading = false;
            state.commercialLoader = false;
            state.error = payload;
        });

        // get commercial detail by id
        builder.addCase(getCommercialDetailById.pending, (state, { payload }) => {
            state.loading = true;
            state.commercialLoader = true;
            state.commercialDetail = null;
        });

        builder.addCase(getCommercialDetailById.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.commercialLoader = false;
            state.commercialDetail = payload.data;
            state.success = true;
        });

        builder.addCase(getCommercialDetailById.rejected, (state, { payload }) => {
            state.loading = false;
            state.commercialLoader = false;
            state.error = payload;
        });
    }
})
export default commercialSlice.reducer;