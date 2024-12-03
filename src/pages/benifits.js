import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
  debounce,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getBenifitsList, deleteBenifitsById } from "src/sections/benifits/action/benifitsAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSelection } from "src/hooks/use-selection";
import ModalComp from "src/components/modalComp";
import {
  setBenifitsDetail,
  setBenifitsListPagination,
} from "src/sections/benifits/reducer/benifitsSlice";
import BenifitsTable from "src/sections/benifits/benifits-table";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import AnimationLoader from "src/components/amimated-loader";

const Benifits = () => {
  const dispatch = useDispatch();

  const { benifitsList, pagination, benifitsListPagination, benifitsListLoader } = useSelector(
    (state) => state.benifits
  );

  // Local state for managing modal visibility and deletion ID
  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);

  // Modal close handler
  const handleClose = () => setOpen(false);

  // Memoized function to return all the benefit IDs
  const useBenifitsIds = (benifits) => {
    return useMemo(() => {
      if (benifits !== null) {
        return benifits?.map((company) => company._id); 
      }
    }, [benifits]);
  };

  // Benefit IDs for selection
  const benifitsIds = useBenifitsIds(benifitsList);

  // Custom hook for handling selection of benefits
  const benifitsSelection = useSelection(benifitsIds);

  // Local state for managing search filter input
  const [searchFilter, setSearchFilter] = useState("");

  // Ref to prevent duplicate API calls in development mode
  const initialized = useRef(false);

  // Function to fetch the benefits list with the provided search filters and pagination
  const getBenifitsListHandler = async (otherProps) => {
    if (initialized.current) {
      return;  
    }
    initialized.current = true;

    // Merging the search filter and other props (e.g., pagination) into the payload
    let payload = { ...searchFilter, ...otherProps };

    try {
      // Dispatching action to fetch benefits list with search filter and pagination
      dispatch(getBenifitsList({ 
        page: pagination?.page, 
        size: pagination?.size, 
        search: payload?.name,  
      }))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, { type: "error" });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle search filter changes
  const searchBenifitsFilterHandler = (name, value) => {
    initialized.current = false;

    // Reset pagination when search filter changes
    dispatch(
      setBenifitsListPagination({
        page: 1, 
        size: 10, 
      })
    );

    // If the filter has a name and value, update the filter and fetch the list
    if (name && (value === "" || value)) {
      getBenifitsListHandler({ [name]: value });
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value, 
      }));
    } else {
      getBenifitsListHandler(); 
    }
  };

  // Debounced version of the search filter handler to limit API calls
  const debounceLeadsHandler = debounce(searchBenifitsFilterHandler, 1000);

  // useEffect to fetch the list of benefits when the component is mounted
  useEffect(() => {
    getBenifitsListHandler();

    return () => {
      dispatch(
        setBenifitsListPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []); 

  // Pagination handler to handle page changes
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(setBenifitsListPagination({ page: value + 1, size: pagination?.size }));
      dispatch(getBenifitsList({ page: value + 1, size: pagination?.size }));
    },
    [pagination?.size]
  );

  // Handler for changing the number of rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setBenifitsListPagination({
          page: 1, 
          size: event.target.value,
        })
      );

      dispatch(
        getBenifitsList({
          page: 1,
          size: event.target.value,
        })
      );
    },
    [pagination?.page]
  );

  // Handler to open the modal for deleting a benefit by ID
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);  
    },
    [pagination]
  );

  // Function to delete a benefit by its ID
  const deleteByIdHandler = (id) => {
    dispatch(deleteBenifitsById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getBenifitsList({
              page: pagination?.page,
              size: pagination?.size,
            })
          );
          setOpen(false);  
          toast("Successfully Deleted", { type: "success" });  
        }
      })
      .catch((err) => {
        toast(err, { type: "error" });  
      });
  };

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
                <Typography variant="h4">Benifits</Typography>
              </Stack>

              {/* Button to navigate to the "create benefits" page */}
              <NextLink
                href={`/benifits/create`}
                passHref
                onClick={() => dispatch(setBenifitsDetail(null))} 
              >
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
            </Stack>

            {/* Search filter for searching benefits */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <Card sx={{ p: 2 }}>
                  <OutlinedInput
                    defaultValue=""
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

            {/* Show a loader while the benefits list is loading */}
            {benifitsListLoader ? (
              <AnimationLoader open={true} />
            ) : (
              <>
                {benifitsList && (
                  <BenifitsTable
                    count={benifitsListPagination?.totalItems}  
                    items={benifitsList}  
                    onDeselectAll={benifitsSelection.handleDeselectAll}  
                    onDeselectOne={benifitsSelection.handleDeselectOne} 
                    onPageChange={handlePageChange}  
                    onRowsPerPageChange={handleRowsPerPageChange}  
                    onSelectAll={benifitsSelection.handleSelectAll}  
                    onSelectOne={benifitsSelection.handleSelectOne} 
                    page={pagination?.page - 1}  
                    rowsPerPage={pagination?.size} 
                    selected={benifitsSelection.selected}  
                    searchFilter={searchFilter}  
                    deleteByIdHandler={deleteModalByIdHandler}  
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Modal for confirming deletion */}
      <ModalComp open={open} handleClose={handleClose}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to delete ?
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
          mt={3}
        >
          {/* Buttons to confirm or cancel deletion */}
          <Button
            variant="contained"
            sx={{
              marginRight: "10px",
            }}
            onClick={() => deleteByIdHandler(deleteId)} 
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => handleClose()}>Cancel</Button>
        </Box>
      </ModalComp>
    </>
  );
};

Benifits.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Benifits;
