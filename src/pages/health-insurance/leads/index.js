import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, CircularProgress, Grid, InputAdornment, OutlinedInput, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getHealthLeads } from "src/sections/health-insurance/Leads/Action/healthInsuranceLeadAction";
import { setHealthInsuranceLeadListPagination } from "src/sections/health-insurance/Leads/Reducer/healthInsuranceLeadsReducerSlice";
import HealthLeadsTable from "src/sections/health-insurance/Leads/health-lead-table";
import { debounce } from "src/utils/debounce-search";

const HealthInsurance = () => {
  // Redux dispatch and selector hooks
  const dispatch = useDispatch();
  const { healthInsuranceLeadLoader, healthInsuranceLeadList, healthInsuranceLeadPagination, pagination } = useSelector(
    (state) => state.healthInsuranceLeads
  );

  // Ref to track if the component has been initialized
  const initialized = useRef(false);

  // Local state to store the search filter criteria
  const [searchFilter, setSearchFilter] = useState({
    name: "",
  });

  // Search filter handler to update filter state and trigger data fetch
  const searchFilterHandler = (name, value) => {
    initialized.current = false;

    // Reset pagination to page 1 when search filter changes
    dispatch(
      setHealthInsuranceLeadListPagination({
        page: 1,
        size: 10,
      })
    );

    // If a valid search value is entered, fetch the health leads with the updated filter
    if (name && (value === "" || value)) {
      getHealthListHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getHealthListHandler();
    }
  };

  // Function to fetch health leads from the backend
  const getHealthListHandler = async (otherProps, page, size) => {
    // Combine the search filter with other optional parameters
    let payload = { ...searchFilter, ...otherProps };

    try {
      // Dispatch action to fetch health leads with the current pagination and search filter
      dispatch(
        getHealthLeads({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
        })
      )
        .unwrap()
        .then((res) => {
          // Optional: Handle successful response (currently not used)
        })
        .catch((err) => {
          // Show error message if the request fails
          if (err) {
            toast(err, {
              type: "error",
            });
          }
        });
    } catch (err) {
      console.log(err); // Log any errors that occur
    }
  };

  // useEffect to initialize data on component mount
  useEffect(
    () => {
      if (initialized.current) {
        return; // Prevent refetching if already initialized
      }
      initialized.current = true;
      getHealthListHandler(); // Fetch health leads when component mounts

      return () => {
        // Cleanup logic (currently not used)
      };
    },
    [] // Empty dependency array means this effect runs only once on mount
  );

  // Callback function to handle page changes in the table
  const handlePageChange = useCallback(
    (event, value) => {
      // Reset pagination on page change
      dispatch(
        setHealthInsuranceLeadListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      // Fetch health leads for the new page
      dispatch(
        getHealthLeads({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter] // Re-run if pagination size or search filter changes
  );

  // Callback function to handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      // Update pagination state when rows per page changes
      dispatch(
        setHealthInsuranceLeadListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      // Fetch health leads for the new rows per page size
      dispatch(
        getHealthLeads({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.page, searchFilter] // Re-run if pagination page or search filter changes
  );

  // Debounced search handler to limit the frequency of API calls while typing
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
            {/* Page title section */}
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Health Insurance</Typography>
              </Stack>
            </Stack>

            {/* Search input field */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <Card sx={{ p: 2 }}>
                  <OutlinedInput
                    defaultValue=""
                    fullWidth
                    name="name"
                    placeholder={"Search...." || ""}
                    onChange={(e) => debounceLeadsHandler(e.target.name, e.target.value)} // Trigger debounced search on input change
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

            {/* Loader: Show a loading animation when data is being fetched */}
            {healthInsuranceLeadLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={!!healthInsuranceLeadLoader} />
              </Box>
            ) : (
              <>
                {/* Display table of health leads once data is fetched */}
                {healthInsuranceLeadList && (
                  <HealthLeadsTable
                    count={healthInsuranceLeadPagination?.totalItems} // Total number of items
                    items={healthInsuranceLeadList} // Health lead data to display
                    onPageChange={handlePageChange} // Page change handler
                    onRowsPerPageChange={handleRowsPerPageChange} // Rows per page change handler
                    page={pagination?.page - 1} // Current page (zero-indexed)
                    rowsPerPage={pagination?.size} // Number of rows per page
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

// Wrap the component in the DashboardLayout for consistent layout
HealthInsurance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthInsurance;
