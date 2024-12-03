import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import {
  setAllPraktoraPoliciesListCustomPagination,
  setPraktoraPoliciesSearchFilter,
} from "src/sections/PraktoraPolicies/reducer/praktoraPoliciesSlice";
import { getAllPraktoraPoliciesList } from "src/sections/PraktoraPolicies/action/praktoraPoliciesAction";
import AnimationLoader from "src/components/amimated-loader";
import PraktoraPoliciesTable from "src/sections/PraktoraPolicies/praktora-policies-table";
import ModalComp from "src/components/modalComp";
import UploadPraktoraPoliciesModal from "src/sections/PraktoraPolicies/upload-csv-file-modal";

const PraktoraPolicies = () => {
  const {
    allPraktoraPoliciesListCustomPagination,
    allPraktoraPoliciesListLoader,
    allPraktoraPoliciesList,
    allPraktoraPoliciesListPagination,
    PraktoraPoliciesSearchFilter,
  } = useSelector((state) => state.PraktoraPolicies);
  const dispatch = useDispatch();

  const [uploadCSVModal, setUploadCSVModal] = useState(false);
  const handleCloseCSVModal = () => setUploadCSVModal(false);

  // Filter state
  const [searchFilter, setSearchFilter] = useState({
    name: PraktoraPoliciesSearchFilter?.name || "",
    type: PraktoraPoliciesSearchFilter?.type || "all",
    fromDate: PraktoraPoliciesSearchFilter?.fromDate || ``,
    toDate: PraktoraPoliciesSearchFilter?.toDate || ``,
    scrollPosition: PraktoraPoliciesSearchFilter?.scrollPosition || 0,
  });

  const [isloading, setisloading] = useState(false);

  // set initial search filter state from redux state or default
  useEffect(() => {
    if (searchFilter) {
      dispatch(setPraktoraPoliciesSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Search handler with debounce
  const policyListFilter = useRef(false);

  // Search filter handler
  const searchFilterHandler = (name, value) => {
    policyListFilter.current = false;
    dispatch(
      setAllPraktoraPoliciesListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllPolicyListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getAllPolicyListFilterHandler();
    }
  };

  // Scroll to top
  useEffect(() => {
    if (PraktoraPoliciesSearchFilter && !allPraktoraPoliciesListLoader && allPraktoraPoliciesList?.length > 0) {
      window.scrollTo({ top: parseInt(PraktoraPoliciesSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allPraktoraPoliciesList]);

  const debounceHandler = debounce(searchFilterHandler, 1000);

  // get policy list API calling function
  const getAllPolicyListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (policyListFilter.current) {
      return;
    }
    policyListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllPraktoraPoliciesList({
          page: page || allPraktoraPoliciesListCustomPagination?.page,
          size: size || allPraktoraPoliciesListCustomPagination?.size,
          search: payload?.name,
          payloadData: {
            pType: payload?.type,
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

  // get policy list
  useEffect(() => {
    getAllPolicyListFilterHandler();
    return () => {
      // dispatch(
      //   setAllPraktoraPoliciesListCustomPagination({
      //     page: 1,
      //     size: 10,
      //   })
      // );
    };
  }, []);

  // pagination
  const handlePageChange = useCallback(
    (event, value) => {
      // console.log("value", value);

      dispatch(
        setAllPraktoraPoliciesListCustomPagination({
          page: value + 1,
          size: allPraktoraPoliciesListCustomPagination?.size,
        })
      );
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllPraktoraPoliciesList({
          page: value + 1,
          size: allPraktoraPoliciesListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allPraktoraPoliciesListCustomPagination?.size, searchFilter]
  );

  // rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllPraktoraPoliciesListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllPraktoraPoliciesList({
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
    [allPraktoraPoliciesListCustomPagination?.page, searchFilter]
  );

  return (
    <>
      {isloading ? <AnimationLoader open={true} /> : <></>}
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
                <Typography variant="h4">Praktora Policies</Typography>
              </Stack>
              <Stack spacing={1}>
                <Button onClick={() => setUploadCSVModal(true)} sx={{ fontSize: "14px" }} variant="contained">
                  Add CSV File
                </Button>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              {allPraktoraPoliciesListLoader ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "10rem !important",
                  }}
                >
                  <AnimationLoader open={allPraktoraPoliciesListLoader} />
                </Box>
              ) : (
                <>
                  {allPraktoraPoliciesList && (
                    <PraktoraPoliciesTable
                      count={allPraktoraPoliciesListPagination?.totalItems}
                      items={allPraktoraPoliciesList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allPraktoraPoliciesListCustomPagination?.page - 1}
                      rowsPerPage={allPraktoraPoliciesListCustomPagination?.size}
                      PraktoraPoliciesSearchFilter={PraktoraPoliciesSearchFilter}
                    />
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Container>
        <ModalComp open={uploadCSVModal} handleClose={handleCloseCSVModal} widths={{ xs: "95%", sm: "500px" }}>
          <UploadPraktoraPoliciesModal handleClose={handleCloseCSVModal} />
        </ModalComp>
      </Box>
    </>
  );
};

PraktoraPolicies.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PraktoraPolicies;
