import { Button, CircularProgress, Grid, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FilterCard from "src/components/filterCard";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextLink from "next/link";
import { debounce } from "src/utils/debounce-search";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import MotorFleetTable from "src/sections/motor-fleet/motor-fleet-table";
import {
  setMotorFleetListPagination,
  setMotorFleetSerchFilter,
} from "src/sections/motor-fleet/Proposals/Reducer/motorFleetProposalsSlice";
import { getMotorFleetList } from "src/sections/motor-fleet/Proposals/Action/motorFleetProposalsAction";

const HealthInsurance = () => {
  const dispatch = useDispatch();
  const { pagination, motorFleetPagination, motorFleetList, motorFleetLoader, motorFleetSearchFilter } = useSelector(
    (state) => state.motorFleetProposals
  );

  const initialized = useRef(false);

  const [searchFilter, setSearchFilter] = useState({
    name: motorFleetSearchFilter?.name || "",
    fromDate: motorFleetSearchFilter?.fromDate || ``,
    toDate: motorFleetSearchFilter?.toDate || ``,
  });

  // Handle changes to the search filters
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update the Redux store whenever searchFilter changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setMotorFleetSerchFilter(searchFilter));
    }
  }, [searchFilter]);

  const [isLoading, setIsLoading] = useState(false);

  // Function to handle search filter
  const searchFilterHandler = (name, value) => {
    initialized.current = false;

    dispatch(
      setMotorFleetListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getMotorFleetListHandler({ [name]: value });
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getMotorFleetListHandler();
    }
  };

  // Get motor fleet list
  const getMotorFleetListHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getMotorFleetList({
          page: pagination?.page,
          size: pagination?.size,
          search: payload?.name,
          payloadData: {
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
          },
        })
      )
        .unwrap()
        .then((res) => {
          // console.log("res- getCustomerListHandler", res);
        })
        .catch((err) => {
          if (err) {
            toast(err, {
              type: "error",
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Get motor fleet list
  useEffect(
    () => {
      if (initialized.current) {
        return;
      }
      initialized.current = true;
      getMotorFleetListHandler();

      return () => {};
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Pagination - Handle page change
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setMotorFleetListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );
      dispatch(
        getMotorFleetList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
          payloadData: {
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Pagination - Handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setMotorFleetListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getMotorFleetList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  // Debounce - Handle search
  const debounceLeadsHandler = debounce(searchFilterHandler, 1000);

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
                <Typography variant="h4">Motor Fleet Insurance</Typography>
              </Stack>
              {/* {moduleAccess(user, "motorFleet.create") && ( */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <NextLink href={`/motor-fleet/proposals/create`} passHref>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Add
                  </Button>
                </NextLink>
              </Box>
              {/* )} */}
            </Stack>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                {!isLoading ? (
                  <FilterCard
                    searchFilter={searchFilter}
                    searchFilterHandler={debounceLeadsHandler}
                    inputPlaceHolder="Search proposals"
                    FilterDataHandler={FilterDataHandler}
                  />
                ) : (
                  <Box sx={{ height: 50 }}></Box>
                )}
              </Box>
            </Grid>

            {motorFleetLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {motorFleetList && (
                  <MotorFleetTable
                    count={motorFleetPagination?.totalItems}
                    items={motorFleetList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    searchFilter={searchFilter}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};
HealthInsurance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthInsurance;
