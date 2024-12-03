import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import FilterCard from "src/components/filterCard";
import TravelQuotationTable from "src/sections/travel-insurance/Quotations/quotation-table";
import {
  setAllTravelQuotationsListCustomPagination,
  setTravelQuotationSearchFilter,
} from "src/sections/travel-insurance/Quotations/Reducer/travelQuotationSlice";
import { getAllTravelQuotationsList } from "src/sections/travel-insurance/Quotations/Action/travelQuotationAction";
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
    allTravelQuotationsListCustomPagination,
    allTravelQuotationsListLoader,
    allTravelQuotationsList,
    allTravelQuotationsListPagination,
    allTravelQuotationsSearchFilter,
  } = useSelector((state) => state.travelQuotation);
  const dispatch = useDispatch();

  // Function to set the search filter
  const [searchFilter, setSearchFilter] = useState({
    name: allTravelQuotationsSearchFilter?.name || "",
    type: allTravelQuotationsSearchFilter?.type || "all",
    fromDate: allTravelQuotationsSearchFilter?.fromDate || ``,
    toDate: allTravelQuotationsSearchFilter?.toDate || ``,
    insuranceType: allTravelQuotationsSearchFilter?.insuranceType || "all",
    scrollPosition: allTravelQuotationsSearchFilter?.scrollPosition || 0,
  });

  // Function to set the search filter
  useEffect(() => {
    if (searchFilter) {
      dispatch(setTravelQuotationSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Function to set the scroll position
  useEffect(() => {
    if (allTravelQuotationsSearchFilter && !allTravelQuotationsListLoader && allTravelQuotationsList?.length > 0) {
      window.scrollTo({ top: parseInt(allTravelQuotationsSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allTravelQuotationsList]);

  // Function to set the scroll position and search
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Function to handle the search and date filter
  const QuotationListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    QuotationListFilter.current = false;
    dispatch(
      setAllTravelQuotationsListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllTravelQuotationListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getAllTravelQuotationListFilterHandler();
    }
  };

  // Function to debounce the search
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Function to get the travel quotation list
  const getAllTravelQuotationListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (QuotationListFilter.current) {
      return;
    }
    QuotationListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllTravelQuotationsList({
          page: page || allTravelQuotationsListCustomPagination?.page,
          size: size || allTravelQuotationsListCustomPagination?.size,
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

  // Function to get the travel quotation list
  useEffect(() => {
    getAllTravelQuotationListFilterHandler();
    return () => {
      // dispatch(
      //   setAllTravelQuotationsListCustomPagination({
      //     page: 1,
      //     size: 10,
      //   })
      // );
    };
  }, []);

  // Function to handle the pagination
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllTravelQuotationsListCustomPagination({
          page: value + 1,
          size: allTravelQuotationsListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllTravelQuotationsList({
          page: value + 1,
          size: allTravelQuotationsListCustomPagination?.size,
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
    [allTravelQuotationsListCustomPagination?.size, searchFilter]
  );

  // Function to handle the rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllTravelQuotationsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllTravelQuotationsList({
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
    [allTravelQuotationsListCustomPagination?.page, searchFilter]
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
                <Typography variant="h4">Travel Insurance Quotations</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search quotations"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
                QuotationTypeoption={QuotationTypeoption}
              />

              {allTravelQuotationsListLoader ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                  {/* <CircularProgress /> */}
                  <AnimationLoader open={allTravelQuotationsListLoader} />
                </Box>
              ) : (
                <>
                  {allTravelQuotationsList && (
                    <TravelQuotationTable
                      count={allTravelQuotationsListPagination?.totalItems}
                      items={allTravelQuotationsList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allTravelQuotationsListCustomPagination?.page - 1}
                      rowsPerPage={allTravelQuotationsListCustomPagination?.size}
                      quoteAPI={() => getAllTravelQuotationListFilterHandler()}
                      allTravelQuotationsSearchFilter={allTravelQuotationsSearchFilter}
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
