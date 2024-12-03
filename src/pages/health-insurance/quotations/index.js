import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import FilterCard from "src/components/filterCard";
import HealthQuotationTable from "src/sections/health-insurance/Quotations/quotation-table";
import {
  setAllHealthQuotationsListCustomPagination,
  sethealthQuotationsSearchFilter,
} from "src/sections/health-insurance/Quotations/Reducer/healthQuotationSlice";
import { getAllHealthQuotationsList } from "src/sections/health-insurance/Quotations/Action/healthQuotationAction";
import AnimationLoader from "src/components/amimated-loader";

// Options for the status filter (active, expired, or all)
const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active Quotation",
    value: "ACTIVE",
  },
  {
    label: "Expired Quotation",
    value: "EXPIRED",
  },
];

// Options for the type of quotation filter (comprehensive, third-party, or all)
const QuotationTypeoption = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Comprehensive",
    value: "comprehensive",
  },
  {
    label: "Third Party",
    value: "thirdparty",
  },
];

const QuotationsComp = () => {
  // Redux state selectors
  const {
    allQuotationsListCustomPagination,
    allQuotationsListLoader,
    allQuotationsList,
    allQuotationsListPagination,
    healthquoteSearchFiltter,
  } = useSelector((state) => state.healthQuotation);

  const dispatch = useDispatch();

  // Local state to manage search filters and pagination
  const [searchFilter, setSearchFilter] = useState({
    name: healthquoteSearchFiltter?.name || "",
    type: healthquoteSearchFiltter?.type || "all",
    fromDate: healthquoteSearchFiltter?.fromDate || ``,
    toDate: healthquoteSearchFiltter?.toDate || ``,
    insuranceType: healthquoteSearchFiltter?.insuranceType || "all",
    scrollPosition: healthquoteSearchFiltter?.scrollPosition || 0,
  });

  // Function to handle updates to the search filter
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Update the search filter in Redux whenever the local search filter changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(sethealthQuotationsSearchFilter(searchFilter));
    }
  }, [searchFilter, dispatch]);

  // Scroll to the saved position after loading the quotations list
  useEffect(() => {
    if (healthquoteSearchFiltter && !allQuotationsListLoader && allQuotationsList?.length > 0) {
      window.scrollTo({ top: parseInt(healthquoteSearchFiltter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allQuotationsListLoader, healthquoteSearchFiltter, allQuotationsList]);

  // Ref to manage the debounce mechanism and prevent multiple dispatches
  const QuotationListFilter = useRef(false);

  // Function to handle the search filter update with debouncing
  const searchFilterHandler = (name, value) => {
    QuotationListFilter.current = false;
    dispatch(
      setAllHealthQuotationsListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllHealthQuotationListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getAllHealthQuotationListFilterHandler();
    }
  };

  // Debounced search filter handler
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Function to handle the API call for fetching health quotations with filters
  const getAllHealthQuotationListFilterHandler = async (otherProps, page, size) => {
    // Prevent redundant calls in development with React.StrictMode
    if (QuotationListFilter.current) {
      return;
    }
    QuotationListFilter.current = true;
    
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllHealthQuotationsList({
          page: page || allQuotationsListCustomPagination?.page,
          size: size || allQuotationsListCustomPagination?.size,
          search: payload?.name,
          payloadData: {
            qType: payload?.type,
            insuranceType: payload?.insuranceType,
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
          },
        })
      );
    } catch (err) {
      toast(err, { type: "error" });
    }
  };

  // Fetch the initial list of health quotations when the component mounts
  useEffect(() => {
    getAllHealthQuotationListFilterHandler();
    return () => {
    };
  }, []);

  // Handle pagination when the page is changed
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllHealthQuotationsListCustomPagination({
          page: value + 1,
          size: allQuotationsListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllHealthQuotationsList({
          page: value + 1,
          size: allQuotationsListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            qType: searchFilter?.type,
            insuranceType: searchFilter?.insuranceType,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allQuotationsListCustomPagination?.size, searchFilter, dispatch]
  );

  // Handle the number of rows per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllHealthQuotationsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllHealthQuotationsList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            qType: searchFilter?.type,
            insuranceType: searchFilter?.insuranceType,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allQuotationsListCustomPagination?.page, searchFilter, dispatch]
  );

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth={false}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Health Insurance Quotations</Typography>
            </Stack>
          </Stack>

          <Stack spacing={3}>
            {/* Filter section */}
            <FilterCard
              searchFilter={searchFilter}
              searchFilterHandler={debounceHandler}
              inputPlaceHolder="Search Quotations"
              selectOptions={options}
              FilterDataHandler={FilterDataHandler}
              QuotationTypeoption={QuotationTypeoption}
            />

            {/* Loader display when data is loading */}
            {allQuotationsListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                <AnimationLoader open={!!allQuotationsListLoader} />
              </Box>
            ) : (
              <>
                {/* Display the quotations table */}
                {allQuotationsList && (
                  <HealthQuotationTable
                    count={allQuotationsListPagination?.totalItems}
                    items={allQuotationsList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={allQuotationsListCustomPagination?.page - 1}
                    rowsPerPage={allQuotationsListCustomPagination?.size}
                    quoteAPI={() => getAllHealthQuotationListFilterHandler()}
                    healthquoteSearchFiltter={healthquoteSearchFiltter}
                  />
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

QuotationsComp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default QuotationsComp;
