import { Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import { SearchInput } from "src/components/search-input";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getContractorAllRisksList } from "src/sections/commercial/contractor-all-risk/Action/commercialAction";
import {
  setContractorAllRiskListPagination,
  setContractoreAllRiskSearchFilter,
} from "src/sections/commercial/contractor-all-risk/Reducer/commercialSlice";
import ContractorAllRiaksListTable from "src/sections/commercial/contractor-all-risk/contractor-all-risk-table";
import { debounce } from "src/utils/debounce-search";

const Commercial = () => {
  const dispatch = useDispatch();

  const {
    contractorAllRiskList,
    pagination,
    contractorAllRiskPagination,
    contractorAllRiskLoader,
    contractorAllRiskSearchFilter,
  } = useSelector((state) => state.contractorAllRisk);

  // Local state for managing search filter
  const [searchFilter, setSearchFilter] = useState({
    name: contractorAllRiskSearchFilter?.name || "",
    scrollPosition: contractorAllRiskSearchFilter?.scrollPosition || 0,
  });

  // Effect to update the search filter in Redux whenever the local search filter changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setContractoreAllRiskSearchFilter(searchFilter));
    }
  }, [searchFilter, dispatch]);

  // Effect to scroll to the previous position when the list updates
  useEffect(() => {
    if (contractorAllRiskSearchFilter && !contractorAllRiskLoader && contractorAllRiskList?.length > 0) {
      window.scrollTo({ top: parseInt(contractorAllRiskSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [contractorAllRiskList, contractorAllRiskSearchFilter, contractorAllRiskLoader]);

  // Ref to prevent double fetching of data (due to React.StrictMode in development)
  const contractorAllRisksListFilter = useRef(false);

  // Function to handle the search input change
  const searchContractorAllRisksFilterHandler = (value) => {
    contractorAllRisksListFilter.current = false;

    // Reset pagination and fetch data again with the new search term
    dispatch(
      setContractorAllRiskListPagination({
        page: 1,
        size: 10,
      })
    );

    getContractorAllRisksListFilterHandler({ name: value }, 1, 10);
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // Debounced version of the search handler to avoid frequent calls while typing
  const debounceContractorAllRisksHandler = debounce(searchContractorAllRisksFilterHandler, 1000);

  // Function to fetch the filtered contractor risks list
  const getContractorAllRisksListFilterHandler = async (otherProps, page, size) => {
    // Prevent calling API twice due to React StrictMode
    if (contractorAllRisksListFilter.current) {
      return;
    }
    contractorAllRisksListFilter.current = true;

    // Combine the current search filter with additional properties
    let payload = { ...searchFilter, ...otherProps };

    try {
      // Dispatch action to fetch the list with the current search term, pagination, and size
      dispatch(
        getContractorAllRisksList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
        })
      );
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  // Fetch the data when the component is mounted
  useEffect(() => {
    getContractorAllRisksListFilterHandler(contractorAllRiskSearchFilter?.name);
    return () => {};
  }, []);

  // Callback to handle page change in pagination
  const handleContractorAllRiskPageChange = useCallback(
    (event, value) => {
      dispatch(
        setContractorAllRiskListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      // Reset scroll position when changing pages
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch the new data for the selected page
      dispatch(
        getContractorAllRisksList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter, dispatch]
  );

  // Callback to handle the change in number of rows per page
  const handleContractorAllRiskRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setContractorAllRiskListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      // Reset scroll position when changing rows per page
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch the data again with the new rows per page setting
      dispatch(
        getContractorAllRisksList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.page, searchFilter, dispatch]
  );

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
      }}
    >
      <Container maxWidth={false}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Commercial</Typography>
            </Stack>
          </Stack>

          {/* Search input field */}
          <SearchInput
            placeHolder="Search Commercial"
            searchFilterHandler={debounceContractorAllRisksHandler}
            defaultValue={contractorAllRiskSearchFilter?.name || ""}
          />

          {contractorAllRiskLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
              <AnimationLoader open={true} />
            </Box>
          ) : (
            <>
              {contractorAllRiskList && (
                <ContractorAllRiaksListTable
                  item={contractorAllRiskList}
                  count={contractorAllRiskPagination?.totalItems}
                  onPageChange={handleContractorAllRiskPageChange}
                  onRowsPerPageChange={handleContractorAllRiskRowsPerPageChange}
                  page={pagination?.page - 1}
                  rowsPerPage={pagination?.size}
                  contractorAllRiskSearchFilter={contractorAllRiskSearchFilter}
                />
              )}
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

Commercial.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Commercial;
