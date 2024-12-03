import { CircularProgress, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimationLoader from "src/components/amimated-loader";
import { SearchInput } from "src/components/search-input";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getMedicalMalPracticeList } from "src/sections/commercial/medical-malpractice/Action/medicalmalepracticeAction";
import {
  setMedicalMalPracticeListPagination,
  setMedicalMalPracticeSearchFilter,
} from "src/sections/commercial/medical-malpractice/Reducer/medicalmalepracticeSlice";
import MedicalMalpracticeListTable from "src/sections/commercial/medical-malpractice/medical-malpractice-table";
import { debounce } from "src/utils/debounce-search";

const MedicalMalpractice = () => {
  const dispatch = useDispatch();
  const {
    medicalMalPracticeList,
    pagination,
    medicalMalPracticePagination,
    medicalMalPracticeLoader,
    medicalMalPracticeSearchFilter,
  } = useSelector((state) => state.medicalMalPractice);

  // State to manage the search filter (name and scroll position)
  const [searchFilter, setSearchFilter] = useState({
    name: medicalMalPracticeSearchFilter?.name || "",
    scrollPosition: medicalMalPracticeSearchFilter?.scrollPosition || 0,
  });

  // Effect to update the Redux store with the search filter whenever it changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setMedicalMalPracticeSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Effect to handle scrolling behavior when the medical malpractice list is updated
  useEffect(() => {
    if (medicalMalPracticeSearchFilter && !medicalMalPracticeLoader && medicalMalPracticeList?.length > 0) {
      window.scrollTo({ top: parseInt(medicalMalPracticeSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [medicalMalPracticeList]);

  // Ref to prevent duplicate API calls in development mode with React Strict Mode enabled
  const medicalMalPracticeListFilter = useRef(false);

  // Function to handle search filter change and trigger data fetching
  const searchContractorAllRisksFilterHandler = (value) => {
    medicalMalPracticeListFilter.current = false;

    // Reset pagination to the first page and fetch filtered data
    dispatch(
      setMedicalMalPracticeListPagination({
        page: 1,
        size: 10,
      })
    );

    // Call the function to fetch filtered data
    getMedicalMalPracticeListFilterHandler({ name: value }, 1, 10);

    // Update the search filter state
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // Debounced function to handle search input with a delay (avoids excessive API calls)
  const debounceContractorAllRisksHandler = debounce(searchContractorAllRisksFilterHandler, 1000);

  // Function to fetch the list of medical malpractice records based on the applied filters, page, and size
  const getMedicalMalPracticeListFilterHandler = async (otherProps, page, size) => {
    // Prevent duplicate calls
    if (medicalMalPracticeListFilter.current) {
      return;
    }
    medicalMalPracticeListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps }; // Combine search filter and other properties

    try {
      // Dispatch the action to fetch medical malpractice list from the API
      dispatch(
        getMedicalMalPracticeList({
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

  // Effect to fetch data when the component mounts
  useEffect(() => {
    getMedicalMalPracticeListFilterHandler(medicalMalPracticeSearchFilter?.name);
    return () => {};
  }, []);

  // Handler for page change event (pagination)
  const handleContractorAllRiskPageChange = useCallback(
    (event, value) => {
      // Update pagination to the selected page
      dispatch(
        setMedicalMalPracticeListPagination({
          page: value + 1, // Increment the page number (0-based index)
          size: pagination?.size,
        })
      );

      // Reset scroll position to the top
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch the new page of data
      dispatch(
        getMedicalMalPracticeList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Handler for change in rows per page (pagination size)
  const handleContractorAllRiskRowsPerPageChange = useCallback(
    (event) => {
      // Update pagination size and reset to the first page
      dispatch(
        setMedicalMalPracticeListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      // Reset scroll position to the top
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch data for the first page with the new page size
      dispatch(
        getMedicalMalPracticeList({
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
              <Typography variant="h4">Medical Malpractice</Typography>
            </Stack>
          </Stack>

          {/* Search Input Component */}
          <SearchInput
            placeHolder="Search Medical Malpractice"
            searchFilterHandler={debounceContractorAllRisksHandler}
            defaultValue={medicalMalPracticeSearchFilter?.name || ""}
          />

          {/* Conditional Rendering for Loader or Table */}
          {medicalMalPracticeLoader ? (
            <>
              <AnimationLoader open={true} />
            </>
          ) : (
            <>
              {/* Render Medical Malpractice List Table if data is available */}
              {medicalMalPracticeList && (
                <MedicalMalpracticeListTable
                  item={medicalMalPracticeList}
                  count={medicalMalPracticePagination?.totalItems}
                  onPageChange={handleContractorAllRiskPageChange}
                  onRowsPerPageChange={handleContractorAllRiskRowsPerPageChange}
                  page={pagination?.page - 1}
                  rowsPerPage={pagination?.size}
                  medicalMalPracticeSearchFilter={medicalMalPracticeSearchFilter}
                />
              )}
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

MedicalMalpractice.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MedicalMalpractice;
