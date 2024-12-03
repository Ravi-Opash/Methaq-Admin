import { Button, Grid, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FilterCard from "src/components/filterCard";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextLink from "next/link";
import { debounce } from "src/utils/debounce-search";
import { getLandInsuranceList } from "src/sections/Land-insurance/Proposals/Action/landInsuranceAction";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  setLandInsuranceListPagination,
  setLandProposalSerchFilter,
} from "src/sections/Land-insurance/Proposals/Reducer/landInsuranceSlice";
import LandTable from "src/sections/Land-insurance/land-table";
import { moduleAccess } from "src/utils/module-access";
import AnimationLoader from "src/components/amimated-loader";

const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active Proposals",
    value: "ACTIVE",
  },
  {
    label: "Expired Proposals",
    value: "EXPIRED",
  },
];

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Quote generated",
    value: "Quote generated",
  },
  {
    label: "Un Attended",
    value: "Un Attended",
  },
  {
    label: "Under Process",
    value: "Under Process",
  },
  {
    label: "Customer contacted",
    value: "Customer contacted",
  },
  {
    label: "Customer Picked",
    value: "Customer Picked",
  },
  {
    label: "Customer Didn't picked up",
    value: "Customer Didn't picked up",
  },
  {
    label: "Document Requested",
    value: "Document Requested",
  },
  {
    label: "Referred to insurance company",
    value: "Referred to insurance company",
  },
  {
    label: "Lost",
    value: "Lost",
  },
];

const landInsurance = () => {
  const dispatch = useDispatch();
  const {
    landInsuranceLoader,
    landInsuranceList,
    landInsurancePagination,
    landProposalDashbordFilter,
    pagination,
    landProposalSearchFilter,
  } = useSelector((state) => state.landInsurance);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const initialized = useRef(false);

  const [searchFilter, setSearchFilter] = useState({
    name: landProposalSearchFilter?.name || "",
    type: landProposalSearchFilter?.type || "all",
    status: landProposalSearchFilter?.status || "all",
    fromDate: landProposalSearchFilter?.fromDate || ``,
    toDate: landProposalSearchFilter?.toDate || ``,
    proposalsFilter: landProposalSearchFilter?.proposalsFilter || "",
    scrollPosition: landProposalSearchFilter?.scrollPosition || 0,
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
      dispatch(setLandProposalSerchFilter(searchFilter));
    }
  }, [searchFilter]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (landProposalSearchFilter && !isLoading && !landInsuranceLoader && landInsuranceList?.length > 0) {
      window.scrollTo({ top: parseInt(landProposalSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [landInsuranceList]);

  // Filer handler
  const searchFilterHandler = (name, value) => {
    initialized.current = false;

    dispatch(
      setLandInsuranceListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getLandListHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getLandListHandler();
    }
  };

  // Get land insurance proposal list API
  const getLandListHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getLandInsuranceList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
          payloadData: {
            status: payload?.status,
            qType: payload?.type,
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
            proposalsFilter: payload?.proposalsFilter,
          },
        })
      )
        .unwrap()
        .then((res) => {})
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

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    getLandListHandler();

    return () => {};
  }, []);

  // page chnage handler
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setLandInsuranceListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getLandInsuranceList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
          payloadData: {
            status: searchFilter?.status,
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            proposalsFilter: landProposalDashbordFilter,
          },
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // rows per page chnage API
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setLandInsuranceListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getLandInsuranceList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            status: searchFilter?.status,
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            proposalsFilter: landProposalDashbordFilter,
          },
        })
      );
    },
    [pagination?.page, searchFilter]
  );

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
                <Typography variant="h4">Musataha Insurance</Typography>
              </Stack>
              {moduleAccess(user, "landQuote.create") && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <NextLink href={`/land-insurance/proposals/create`} passHref>
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
              )}
            </Stack>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                {!isLoading ? (
                  <FilterCard
                    searchFilter={searchFilter}
                    searchFilterHandler={debounceLeadsHandler}
                    inputPlaceHolder="Search Land proposals"
                    selectOptions={options}
                    statusOptions={statusOptions}
                    FilterDataHandler={FilterDataHandler}
                  />
                ) : (
                  <Box sx={{ height: 50 }}></Box>
                )}
              </Box>
            </Grid>

            {landInsuranceLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={landInsuranceLoader} />
              </Box>
            ) : (
              <>
                {landInsuranceList && (
                  <LandTable
                    count={landInsurancePagination?.totalItems}
                    items={landInsuranceList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    landProposalSearchFilter={landProposalSearchFilter}
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
landInsurance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default landInsurance;
