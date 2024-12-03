import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import FilterCard from "src/components/filterCard";
import AllQoutationTable from "src/sections/quotations/all-qoutation-table";
import {
  setAllQuotationsListCustomPagination,
  setQuotationsSearchFilter,
} from "src/sections/Policies/reducer/policiesSlice";
import { getAllQuotationsList } from "src/sections/Policies/action/policiesAction";
import AnimationLoader from "src/components/amimated-loader";

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
  const {
    allQuotationsListCustomPagination,
    allQuotationsListLoader,
    allQuotationsList,
    allQuotationsListPagination,
    quotationsSearchFilter,
  } = useSelector((state) => state.policies);
  const dispatch = useDispatch();

  // Local state to manage search filters and pagination
  const [searchFilter, setSearchFilter] = useState({
    name: quotationsSearchFilter?.name || "",
    type: quotationsSearchFilter?.type || "all",
    fromDate: quotationsSearchFilter?.fromDate || ``,
    toDate: quotationsSearchFilter?.toDate || ``,
    insuranceType: quotationsSearchFilter?.insuranceType || "all",
    scrollPosition: quotationsSearchFilter?.scrollPosition || 0,
  });

  // Update the Redux store whenever searchFilter changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setQuotationsSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when salesAdmin list is loaded or updated
  useEffect(() => {
    if (quotationsSearchFilter && !allQuotationsListLoader && allQuotationsList?.length > 0) {
      window.scrollTo({ top: parseInt(quotationsSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allQuotationsList]);

  // Function to handle updates to the search filter
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Function to handle the search filter update with debouncing
  const QuotationListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    QuotationListFilter.current = false;
    dispatch(
      setAllQuotationsListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllQuotationListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getAllQuotationListFilterHandler();
    }
  };

  // get all quotations list api
  const debounceHandler = debounce(searchFilterHandler, 1000);
  const getAllQuotationListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (QuotationListFilter.current) {
      return;
    }
    QuotationListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllQuotationsList({
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
      toast(err, {
        type: "error",
      });
    }
  };

  // useEffect to get all quotations list
  useEffect(() => {
    getAllQuotationListFilterHandler();
    return () => {};
  }, []);

  // Function to handle page and rows per page changes
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllQuotationsListCustomPagination({
          page: value + 1,
          size: allQuotationsListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllQuotationsList({
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
    [allQuotationsListCustomPagination?.size, searchFilter]
  );

  // Function to handle page and rows per page changes
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllQuotationsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllQuotationsList({
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
    [allQuotationsListCustomPagination?.page, searchFilter]
  );

  return (
    <>
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
                <Typography variant="h4">Quotations</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search Quotation"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
                QuotationTypeoption={QuotationTypeoption}
              />

              {allQuotationsListLoader ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                  <AnimationLoader open={!!allQuotationsListLoader} />
                </Box>
              ) : (
                <>
                  {allQuotationsList && (
                    <AllQoutationTable
                      count={allQuotationsListPagination?.totalItems}
                      items={allQuotationsList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allQuotationsListCustomPagination?.page - 1}
                      rowsPerPage={allQuotationsListCustomPagination?.size}
                      quoteAPI={() => getAllQuotationListFilterHandler()}
                      quotationsSearchFilter={quotationsSearchFilter}
                    />
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

QuotationsComp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default QuotationsComp;
