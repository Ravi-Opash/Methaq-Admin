import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, CircularProgress, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import FilterCard from "src/components/filterCard";
import { setAllMotorFleetQuotationsListCustomPagination } from "src/sections/motor-fleet/Quotations/Reducer/motorFleetQuotationSlice";
import { getAllMotorFleetQuotationsList } from "src/sections/motor-fleet/Quotations/Action/motorFleetQuotationAction";
import MotorFleetQuotationTable from "src/sections/motor-fleet/Quotations/quotation-table";

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
    allMotorQuotationsListCustomPagination,
    allMotorFleetQuotationsListLoader,
    allMotorFleetQuotationsList,
    allMotorFleetQuotationsListPagination,
  } = useSelector((state) => state.motorFleetQuotation);
  const dispatch = useDispatch();

  // Filter search
  const [searchFilter, setSearchFilter] = useState({
    name: "",
    type: "all",
    fromDate: ``,
    toDate: ``,
    insuranceType: "all",
  });

  // Function to handle updates to the search filter
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle filtering
  const MotorFleetQuotationListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    MotorFleetQuotationListFilter.current = false;
    dispatch(
      setAllMotorFleetQuotationsListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllMotorFleetQuotationListFilterHandler({ [name]: value });
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getAllMotorFleetQuotationListFilterHandler();
    }
  };

  // Function to handle debounce
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Function to handle filtering
  const getAllMotorFleetQuotationListFilterHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (MotorFleetQuotationListFilter.current) {
      return;
    }
    MotorFleetQuotationListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllMotorFleetQuotationsList({
          page: allMotorQuotationsListCustomPagination?.page,
          size: allMotorQuotationsListCustomPagination?.size,
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

  // Function to handle pagination
  useEffect(() => {
    getAllMotorFleetQuotationListFilterHandler();
    return () => {
      dispatch(
        setAllMotorFleetQuotationsListCustomPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []);

  // Function to handle pagination - page change
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllMotorFleetQuotationsListCustomPagination({
          page: value + 1,
          size: allMotorQuotationsListCustomPagination?.size,
        })
      );

      dispatch(
        getAllMotorFleetQuotationsList({
          page: value + 1,
          size: allMotorQuotationsListCustomPagination?.size,
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
    [allMotorQuotationsListCustomPagination?.size, searchFilter]
  );

  // Function to handle pagination - rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllMotorFleetQuotationsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getAllMotorFleetQuotationsList({
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
    [allMotorQuotationsListCustomPagination?.page, searchFilter]
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
                <Typography variant="h4">Motor fleet Quotations</Typography>
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

              {allMotorFleetQuotationsListLoader ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {allMotorFleetQuotationsList && (
                    <MotorFleetQuotationTable
                      count={allMotorFleetQuotationsListPagination?.totalItems}
                      items={allMotorFleetQuotationsList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allMotorQuotationsListCustomPagination?.page - 1}
                      rowsPerPage={allMotorQuotationsListCustomPagination?.size}
                      quoteAPI={() => getAllMotorFleetQuotationListFilterHandler()}
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
