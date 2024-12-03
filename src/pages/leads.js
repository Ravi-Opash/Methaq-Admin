import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Box, Card, Container, Grid, InputAdornment, OutlinedInput, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { setLeadListPagination, setLeadsSearchFilter } from "src/sections/Leads/Reducer/leadsSlice";
import { debounce } from "src/utils/debounce-search";
import { useDispatch, useSelector } from "react-redux";
import LeadsTable from "src/sections/Leads/leads-table";
import { getLeadsList } from "src/sections/Leads/Action/leadsAction";
import { useSelection } from "src/hooks/use-selection";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import AnimationLoader from "src/components/amimated-loader";

const Leads = () => {
  const dispatch = useDispatch();

  const { leadList, leadPagination, pagination, leadListLoader, leadSearchFilter } = useSelector(
    (state) => state.leads
  );

  // Custom hook to get an array of lead IDs from lead list
  const useLeadsIds = (leads) => {
    return useMemo(() => {
      if (leads !== null) {
        return leads?.map((lead) => lead._id);
      }
    }, [leads]);
  };

  // All lead IDs to be used for selection
  const leadsIds = useLeadsIds(leadList);

  // Custom hook for checkbox selection logic
  const leadsSelection = useSelection(leadsIds);

  // State to manage the search filter values
  const [searchFilter, setSearchFilter] = useState({
    name: leadSearchFilter?.name || "",
    type: leadSearchFilter?.type || "all",
    fromDate: leadSearchFilter?.fromDate || ``,
    toDate: leadSearchFilter?.toDate || ``,
    scrollPosition: leadSearchFilter?.scrollPosition || 0,
  });

  // Effect to dispatch the updated search filter to the Redux store
  useEffect(() => {
    if (searchFilter) {
      dispatch(setLeadsSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Effect to handle scrolling when the lead list is loaded
  useEffect(() => {
    if (leadSearchFilter && !leadListLoader && leadList?.length > 0) {
      window.scrollTo({ top: parseInt(leadSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [leadList]);

  // Ref to prevent duplicate calls to the API
  const leadsListFilter = useRef(false);

  // Handler function for searching leads (applies filter)
  const searchLeadsFilterHandler = (name, value) => {
    leadsListFilter.current = false;

    // Reset pagination to page 1 whenever a new search is performed
    dispatch(
      setLeadListPagination({
        page: 1,
        size: 10,
      })
    );

    // If search criteria exist, trigger search with updated filters
    if (name && (value === "" || value)) {
      getLeadsListFilterHandler({ [name]: value }, 1, 10);

      // Update the search filter state with the new value
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getLeadsListFilterHandler();
    }
  };

  // Debounced search handler to prevent excessive calls to the API
  const debounceLeadsHandler = debounce(searchLeadsFilterHandler, 1000);

  // Function to get leads list based on filters, page, and size
  const getLeadsListFilterHandler = async (otherProps, page, size) => {
    // Prevent duplicate calls (important for React Strict Mode in development)
    if (leadsListFilter.current) {
      return;
    }
    leadsListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getLeadsList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
          payloadData: {
            qType: payload?.type,
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

  // Effect to load the leads list when the component mounts
  useEffect(() => {
    getLeadsListFilterHandler(leadSearchFilter?.name);
    return () => {};
  }, []);

  // Handler to change the page in the leads list
  const handleLeadsPageChange = useCallback(
    (event, value) => {
      // Update pagination on page change
      dispatch(
        setLeadListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      // Reset scroll position when changing pages
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch leads for the new page
      dispatch(
        getLeadsList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Handler to change the number of rows per page
  const handleLeadsRowsPerPageChange = useCallback(
    (event) => {
      // Update pagination with the new page size
      dispatch(
        setLeadListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      // Reset scroll position when changing page size
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch leads for the first page with the new page size
      dispatch(
        getLeadsList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
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
                <Typography variant="h4">Leads</Typography>
              </Stack>
            </Stack>
            {/* Search Filter for Leads */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <Card sx={{ p: 2 }}>
                  <OutlinedInput
                    defaultValue={leadSearchFilter?.name || ""}
                    fullWidth
                    name="name"
                    placeholder={"Search Leads" || ""}
                    onChange={(e) => debounceLeadsHandler(e.target.name, e.target.value)}
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

            {/* Loader or Leads Table */}
            {leadListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                <AnimationLoader open={!!leadListLoader} />
              </Box>
            ) : (
              <>
                {/* Display the leads table if leads are available */}
                {leadList && (
                  <LeadsTable
                    count={leadPagination?.totalItems}
                    items={leadList}
                    onDeselectAll={leadsSelection.handleDeselectAll}
                    onDeselectOne={leadsSelection.handleDeselectOne}
                    onPageChange={handleLeadsPageChange}
                    onRowsPerPageChange={handleLeadsRowsPerPageChange}
                    onSelectAll={leadsSelection.handleSelectAll}
                    onSelectOne={leadsSelection.handleSelectOne}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    selected={leadsSelection.selected}
                    leadSearchFilter={leadSearchFilter}
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

Leads.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Leads;
