import { CircularProgress, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import { SearchInput } from "src/components/search-input";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getcontractorPlantMachineryList } from "src/sections/commercial/contractor-plant-machinery/Action/contractorPlantMachineryAction";
import {
  setContractorPlantMachineryListPagination,
  setContractorPlantMachinerySearchFilter,
} from "src/sections/commercial/contractor-plant-machinery/Reducer/contractorPlantMachinerySlice";
import ContractorPlantMachineryListTable from "src/sections/commercial/contractor-plant-machinery/contractor-plant-machinery-table";
import { debounce } from "src/utils/debounce-search";

const Commercial = () => {
  const dispatch = useDispatch();
  const {
    contractorPlantMachineryList,
    pagination,
    contractorPlantMachineryPagination,
    contractorPlantMachineryLoader,
    contractorePlanetMachinerySearchFilter,
  } = useSelector((state) => state.contractorPlantMachinery);

  // Local state for handling search filter and scroll position
  const [searchFilter, setSearchFilter] = useState({
    name: contractorePlanetMachinerySearchFilter?.name || "",
    scrollPosition: contractorePlanetMachinerySearchFilter?.scrollPosition || 0,
  });

  // Update Redux store with current search filter when it changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setContractorPlantMachinerySearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when the list of plant machinery updates
  useEffect(() => {
    if (
      contractorePlanetMachinerySearchFilter &&
      !contractorPlantMachineryLoader &&
      contractorPlantMachineryList?.length > 0
    ) {
      window.scrollTo({
        top: parseInt(contractorePlanetMachinerySearchFilter?.scrollPosition, 10),
        behavior: "smooth",
      });
    }
  }, [contractorPlantMachineryList]); // Run effect when the list of items changes

  const contractorPlantMachineryListFilter = useRef(false); // Ref to prevent multiple calls in development mode

  // Handler to apply search filter and reset pagination to first page
  const searchContractorPlantMachineryFilterHandler = (value) => {
    contractorPlantMachineryListFilter.current = false;

    // Reset pagination to the first page
    dispatch(
      setContractorPlantMachineryListPagination({
        page: 1,
        size: 10,
      })
    );

    // Get filtered plant machinery list based on the search term
    getContractorPlantMachineryListFilterHandler({ name: value }, 1, 10);
    setSearchFilter({ name: value, scrollPosition: 0 }); // Update searchFilter state
  };

  // Debounced version of the search handler to reduce unnecessary API calls
  const debounceContractorPlantMachineryHandler = debounce(searchContractorPlantMachineryFilterHandler, 1000);

  // Function to fetch plant machinery data with the given filter, page, and size
  const getContractorPlantMachineryListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (contractorPlantMachineryListFilter.current) {
      return;
    }
    contractorPlantMachineryListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps }; // Combine current filter with the new search term

    try {
      dispatch(
        getcontractorPlantMachineryList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
        })
      );
    } catch (err) {
      toast(err, { type: "error" });
    }
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    getContractorPlantMachineryListFilterHandler(contractorePlanetMachinerySearchFilter?.name);
    return () => {};
  }, []);

  // Handler to change the current page in pagination
  const handleContractorPlantMachineryPageChange = useCallback(
    (event, value) => {
      dispatch(
        setContractorPlantMachineryListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      // Reset scroll position on page change
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch plant machinery list for the new page
      dispatch(
        getcontractorPlantMachineryList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Handler to change the number of rows per page
  const handleContractorPlantMachineryRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setContractorPlantMachineryListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      // Reset scroll position on rows per page change
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch plant machinery list with new page size
      dispatch(
        getcontractorPlantMachineryList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.page, searchFilter]
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
              <Typography variant="h4">Contractor Plant & Machinery</Typography>
            </Stack>
          </Stack>

          {/* Search Input */}
          <SearchInput
            placeHolder="Search Commercial"
            searchFilterHandler={debounceContractorPlantMachineryHandler}
            defaultValue={contractorePlanetMachinerySearchFilter?.name || ""}
          />

          {contractorPlantMachineryLoader ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "10rem !important",
              }}
            >
              <AnimationLoader open={true} />
            </Box>
          ) : (
            <>
              {/* Display Plant Machinery List Table */}
              {contractorPlantMachineryList && (
                <ContractorPlantMachineryListTable
                  item={contractorPlantMachineryList}
                  count={contractorPlantMachineryPagination?.totalItems}
                  onPageChange={handleContractorPlantMachineryPageChange}
                  onRowsPerPageChange={handleContractorPlantMachineryRowsPerPageChange}
                  page={pagination?.page - 1}
                  rowsPerPage={pagination?.size}
                  contractorePlanetMachinerySearchFilter={contractorePlanetMachinerySearchFilter}
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
