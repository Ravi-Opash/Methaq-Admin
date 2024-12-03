import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Box, Card, Container, Grid, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { debounce } from "src/utils/debounce-search";
import { useDispatch, useSelector } from "react-redux";
import { useSelection } from "src/hooks/use-selection";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import AnimationLoader from "src/components/amimated-loader";
import CancelRequestsTable from "src/sections/cancel-request/cancel-request-table";
import { getCancelRequestsList } from "src/sections/cancel-request/action/cancelRequestAction";
import {
  setCancelRequestListPagination,
  setCancelRequestsSearchFilter,
} from "src/sections/cancel-request/reducer/cancelReducerSlice";

const Index = () => {
  const dispatch = useDispatch();
  const { cancelRequestList, cancelRequestPagination, pagination, cancelRequestListLoader, cancelRequestSearchFilter } =
    useSelector((state) => state.cancelRequests);

  const useCancelRequestsIds = (cancelRequests) => {
    return useMemo(() => {
      if (cancelRequests !== null) {
        return cancelRequests?.map((cancelRequest) => cancelRequest._id);
      }
    }, [cancelRequests]);
  };

  // all cancelRequests ids
  const cancelRequestsIds = useCancelRequestsIds(cancelRequestList);
  // checkbox selection
  const cancelRequestsSelection = useSelection(cancelRequestsIds);

  const [searchFilter, setSearchFilter] = useState({
    name: cancelRequestSearchFilter?.name || "",
    // type: cancelRequestSearchFilter?.type || "all",
    // fromDate: cancelRequestSearchFilter?.fromDate || ``,
    // toDate: cancelRequestSearchFilter?.toDate || ``,
    scrollPosition: cancelRequestSearchFilter?.scrollPosition || 0,
  });

  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  useEffect(() => {
    if (searchFilter) {
      dispatch(setCancelRequestsSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  useEffect(() => {
    if (cancelRequestSearchFilter && !cancelRequestListLoader && cancelRequestList?.length > 0) {
      window.scrollTo({ top: parseInt(cancelRequestSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [cancelRequestList]);

  const cancelRequestsListFilter = useRef(false);

  const searchCancelRequestsFilterHandler = (name, value) => {
    cancelRequestsListFilter.current = false;

    dispatch(
      setCancelRequestListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getCancelRequestsListFilterHandler({ [name]: value }, 1, 10);

      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getCancelRequestsListFilterHandler();
    }
  };

  const debounceCancelRequestsHandler = debounce(searchCancelRequestsFilterHandler, 1000);

  // get list API calling function
  const getCancelRequestsListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (cancelRequestsListFilter.current) {
      return;
    }
    cancelRequestsListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getCancelRequestsList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
          payloadData: {
            pType: "CANCELLED",
            sort: {
              cancellationRequestTime: -1,
            },
            // startDate: payload?.fromDate,
            // endDate: payload?.toDate,
          },
        })
      );
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  useEffect(() => {
    getCancelRequestsListFilterHandler(cancelRequestSearchFilter?.name);
    return () => {};
  }, []);

  // Chnage page handler
  const handleCancelRequestsPageChange = useCallback(
    (event, value) => {
      dispatch(
        setCancelRequestListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getCancelRequestsList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
          payloadData: {
            pType: "CANCELLED",
            sort: {
              cancellationRequestTime: -1,
            },
            // startDate: payload?.fromDate,
            // endDate: payload?.toDate,
          },
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Change get count on page handler 
  const handleCancelRequestsRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setCancelRequestListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getCancelRequestsList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            pType: "CANCELLED",
            sort: {
              cancellationRequestTime: -1,
            },
            // startDate: payload?.fromDate,
            // endDate: payload?.toDate,
          },
        })
      );
    },
    [pagination?.page, searchFilter]
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
                <Typography variant="h4">Cancel Request</Typography>
              </Stack>
            </Stack>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <Card sx={{ p: 2 }}>
                  <OutlinedInput
                    defaultValue={cancelRequestSearchFilter?.name || ""}
                    fullWidth
                    name="name"
                    placeholder={"Search Request" || ""}
                    onChange={(e) => debounceCancelRequestsHandler(e.target.name, e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <MagnifyingGlassIcon />
                        </SvgIcon>
                      </InputAdornment>
                    }
                    sx={{ maxWidth: 500 }}
                  />
                </Card>
              </Box>
            </Grid>

            {cancelRequestListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                {/* <CircularProgress /> */}
                <AnimationLoader open={!!cancelRequestListLoader} />
              </Box>
            ) : (
              <>
                {cancelRequestList && (
                  <CancelRequestsTable
                    count={cancelRequestPagination?.totalItems}
                    items={cancelRequestList}
                    onDeselectAll={cancelRequestsSelection.handleDeselectAll}
                    onDeselectOne={cancelRequestsSelection.handleDeselectOne}
                    onPageChange={handleCancelRequestsPageChange}
                    onRowsPerPageChange={handleCancelRequestsRowsPerPageChange}
                    onSelectAll={cancelRequestsSelection.handleSelectAll}
                    onSelectOne={cancelRequestsSelection.handleSelectOne}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    selected={cancelRequestsSelection.selected}
                    cancelRequestSearchFilter={cancelRequestSearchFilter}
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

Index.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Index;
