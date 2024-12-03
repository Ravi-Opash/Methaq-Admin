import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Card,
  Container,
  Grid,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
  Button,
} from "@mui/material";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import HealthProviderTable from "src/sections/health-insurance/Providers/health-providers-table";
import {
  clearProvideDetail,
  setAllHealthProviderListCustomPagination,
  setHealthProviderSearchFilter,
} from "src/sections/health-insurance/Providers/Reducer/healthProviderSlice";
import { toast } from "react-toastify";
import {
  deleteHealthProviderById,
  getAllHealthProviderList,
} from "src/sections/health-insurance/Providers/Action/healthProviderAction";
import { debounce } from "src/utils/debounce-search";
import ModalComp from "src/components/modalComp";
import { useRouter } from "next/router";
import { moduleAccess } from "src/utils/module-access";
import AnimationLoader from "src/components/amimated-loader";

const HealthProviders = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Extract necessary data from Redux store
  const {
    allHealthProviderListLoader,
    allHealthProviderList,
    allHealthProviderListPagination,
    allHelathProviderListCustomPagination,
    allHealthProviderSearchFilter,
  } = useSelector((state) => state.healthProvider);
  const { loginUserData: user } = useSelector((state) => state.auth);

  // State to handle the delete ID and modal visibility
  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);

  // State to handle search filters
  const [searchFilter, setSearchFilter] = useState({
    name: allHealthProviderSearchFilter?.name || "",
    type: allHealthProviderSearchFilter?.type || "all",
    fromDate: allHealthProviderSearchFilter?.fromDate || "",
    toDate: allHealthProviderSearchFilter?.toDate || "",
    scrollPosition: allHealthProviderSearchFilter?.scrollPosition || 0,
  });

  // Close the delete confirmation modal
  const handleClose = () => setOpen(false);

  // Update the Redux store with the search filter whenever it changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setHealthProviderSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Handle page scroll when provider list is updated (for pagination)
  useEffect(() => {
    if (allHealthProviderSearchFilter && !allHealthProviderListLoader && allHealthProviderList?.length > 0) {
      window.scrollTo({ top: parseInt(allHealthProviderSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allHealthProviderList]);

  // Ref to handle debounced search for providers
  const leadsListFilter = useRef(false);

  // Handle search filter changes with debounce
  const searchProviderFilterHandler = (name, value) => {
    leadsListFilter.current = false;

    dispatch(
      setAllHealthProviderListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    // Update the search filter and fetch the filtered list
    if (name && (value === "" || value)) {
      getHealthProviderListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getHealthProviderListFilterHandler();
    }
  };

  // Debounced version of search handler to avoid frequent API calls
  const debounceLeadsHandler = debounce(searchProviderFilterHandler, 1000);

  // Function to fetch the filtered list of health providers
  const getHealthProviderListFilterHandler = async (otherProps, page, size) => {
    if (leadsListFilter.current) {
      return; 
    }
    leadsListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      // Dispatch action to fetch health providers based on filter settings
      dispatch(
        getAllHealthProviderList({
          page: page || allHelathProviderListCustomPagination?.page,
          size: size || allHelathProviderListCustomPagination?.size,
          search: payload?.name,
          payloadData: {
            qType: payload?.type,
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
          },
        })
      );
    } catch (err) {
      toast(err, { type: "error" });
    }
  };

  // Function to handle the deletion of a health provider
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true); 
      setDeleteId(id); 
    },
    [allHelathProviderListCustomPagination] 
  );

  // Function to delete a health provider by ID
  const deleteByIdHandler = (id) => {
    dispatch(deleteHealthProviderById(id))
      .unwrap()
      .then((res) => {
        // Refetch the list of health providers after deletion
        dispatch(
          getAllHealthProviderList({
            page: allHelathProviderListCustomPagination?.page,
            size: allHelathProviderListCustomPagination?.size,
          })
        );
        toast("Successfully deleted", { type: "success" }); 
        setOpen(false); 
      })
      .catch((err) => {
        toast(err, { type: "error" });
      });
  };

  // Initialize health provider list when component mounts
  useEffect(() => {
    getHealthProviderListFilterHandler(allHealthProviderSearchFilter?.name);
    return () => {};
  }, []); 

  // Handler for changing the page in the table
  const handleLeadsPageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllHealthProviderListCustomPagination({
          page: value + 1,
          size: allHelathProviderListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllHealthProviderList({
          page: value + 1,
          size: allHelathProviderListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allHelathProviderListCustomPagination?.size, searchFilter]
  );

  // Handler for changing the number of rows per page in the table
  const handleLeadsRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllHealthProviderListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllHealthProviderList({
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
    [allHelathProviderListCustomPagination?.page, searchFilter]
  );

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4" sx={{ fontSize: { md: "2rem", xs: "1.2rem" } }}>
                  Health Insurance Providers
                </Typography>
              </Stack>
              {/* Conditionally render 'Add' button based on user permissions */}
              {moduleAccess(user, "healthQuote.create") && (
                <Button
                  onClick={() => {
                    dispatch(clearProvideDetail()); 
                    router.push(`/health-insurance/providers/create`); 
                  }}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              )}
            </Stack>

            {/* Search input for filtering health providers */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <Card sx={{ p: 2 }}>
                  <OutlinedInput
                    defaultValue={allHealthProviderSearchFilter?.name || ""}
                    fullWidth
                    name="name"
                    placeholder={"Search Providers"}
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

            {/* Display a loading animation while data is being fetched */}
            {allHealthProviderListLoader ? (
              <AnimationLoader open={!!allHealthProviderListLoader} />
            ) : (
              // Display the table of health providers once data is available
              <HealthProviderTable
                count={allHealthProviderListPagination?.totalItems}
                items={allHealthProviderList}
                onPageChange={handleLeadsPageChange}
                onRowsPerPageChange={handleLeadsRowsPerPageChange}
                page={allHelathProviderListCustomPagination?.page - 1}
                rowsPerPage={allHelathProviderListCustomPagination?.size}
                deleteByIdHandler={deleteModalByIdHandler}
                allHealthProviderSearchFilter={allHealthProviderSearchFilter}
              />
            )}
          </Stack>
        </Container>
      </Box>

      {/* Modal for delete confirmation */}
      <ModalComp open={open} handleClose={handleClose}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to delete?
        </Typography>

        <Box sx={{ display: "flex" }} mt={3}>
          <Button
            variant="contained"
            sx={{ marginRight: "10px" }}
            onClick={() => deleteByIdHandler(deleteId)} 
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
    </>
  );
};

HealthProviders.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthProviders;
