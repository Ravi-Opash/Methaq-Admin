import { Button, CircularProgress, Grid, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FilterCard from "src/components/filterCard";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  getHealthInsuranceDashBoard,
  getHealthInsuranceList,
  getHealthInfoByproposalId,
} from "src/sections/health-insurance/Proposals/Action/healthInsuranceAction";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  setHealthInsuranceListPagination,
  setHealthProposalSerchFilter,
} from "src/sections/health-insurance/Proposals/Reducer/healthInsuranceSlice";
import HealthproposalStatsInfo from "src/sections/health-insurance/health-status-info";
import HealthTable from "src/sections/health-insurance/health-table";
import { debounce } from "src/utils/debounce-search";
import NextLink from "next/link";
import { moduleAccess } from "src/utils/module-access";
import ModalComp from "src/components/modalComp";
import { CrossSvg } from "src/Icons/CrossSvg";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import AnimationLoader from "src/components/amimated-loader";

//option data
const options = [
  { label: "All", value: "all" },
  { label: "Active Proposals", value: "ACTIVE" },
  { label: "Expired Proposals", value: "EXPIRED" },
];

// Status Data
const statusOptions = [
  { label: "All", value: "all" },
  { label: "Quote generated", value: "Quote generated" },
  { label: "Un Attended", value: "Un Attended" },
  { label: "Under Process", value: "Under Process" },
  { label: "Customer contacted", value: "Customer contacted" },
  { label: "Customer Picked", value: "Customer Picked" },
  { label: "Customer Didn't picked up", value: "Customer Didn't picked up" },
  { label: "Document Requested", value: "Document Requested" },
  { label: "Referred to insurance company", value: "Referred to insurance company" },
  { label: "Lost", value: "Lost" },
];

const HealthInsurance = () => {
  const dispatch = useDispatch();
  const {
    healthInsuranceLoader,
    healthInsuranceList,
    healthInsurancePagination,
    healthProposalDashbordFilter,
    pagination,
    healthDashboardData,
    dashboardLoading,
    healthProposalSearchFilter,
    proposalHealthInfo,
    proposalHealthInfoLoader,
  } = useSelector((state) => state.healthInsurance);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const initialized = useRef(false);

  // Modal state for viewing proposal history
  const [historyModal, setHistoryModal] = useState(false);

  // Set initial search filter state from redux state or default
  const [searchFilter, setSearchFilter] = useState({
    name: healthProposalSearchFilter?.name || "",
    type: healthProposalSearchFilter?.type || "all",
    status: healthProposalSearchFilter?.status || "all",
    fromDate: healthProposalSearchFilter?.fromDate || ``,
    toDate: healthProposalSearchFilter?.toDate || ``,
    proposalsFilter: healthProposalSearchFilter?.proposalsFilter || "",
    scrollPosition: healthProposalSearchFilter?.scrollPosition || 0,
  });

  // Effect to update search filter in the redux store
  useEffect(() => {
    if (searchFilter) {
      dispatch(setHealthProposalSerchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Handle page scroll position after fetching health insurance list
  useEffect(() => {
    if (healthProposalSearchFilter && !healthInsuranceLoader && healthInsuranceList?.length > 0) {
      const scrollPosition = parseInt(healthProposalSearchFilter?.scrollPosition, 10);
      const timeoutScroll = setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      }, 200);
      return () => clearTimeout(timeoutScroll);
    }
  }, [healthInsuranceList, healthInsuranceLoader]);

  // Update the search filter based on user selection
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // State for loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handler for searching with debounced input
  const searchFilterHandler = (name, value) => {
    initialized.current = false;

    dispatch(setHealthInsuranceListPagination({ page: 1, size: 10 }));

    if (name && (value === "" || value)) {
      getHealthListHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getHealthListHandler({}, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));
    }
  };

  // Get the list of health insurance data based on the search filter
  const getHealthListHandler = async (otherProps, page, size) => {
    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getHealthInsuranceList({
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
      ).unwrap();
    } catch (err) {
      console.log(err);
      toast(err, { type: "error" });
    }
  };

  // Fetch health insurance dashboard data
  const fetchDashBoardData = () => {
    dispatch(getHealthInsuranceDashBoard({}))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    getHealthListHandler();
    fetchDashBoardData();
  }, []);

  // Handle pagination changes
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setHealthInsuranceListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getHealthInsuranceList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
          payloadData: {
            status: searchFilter?.status,
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            proposalsFilter: healthProposalDashbordFilter,
          },
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setHealthInsuranceListPagination({
          page: 1,
          size: event.target.value,
        })
      );
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getHealthInsuranceList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            status: searchFilter?.status,
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            proposalsFilter: healthProposalDashbordFilter,
          },
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  // Debounced search handler
  const debounceLeadsHandler = debounce(searchFilterHandler, 1000);

  // Open proposal history modal and fetch the proposal details
  const handleHistorySelect = (proposalId) => {
    setHistoryModal(true);
    dispatch(
      getHealthInfoByproposalId({
        proposalId: proposalId,
        healthInfoId: proposalHealthInfo?.HealthProposal?.healthInfo?._id,
      })
    ).catch((err) => {
      toast.error(err);
    });
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Health Insurance</Typography>
              </Stack>
              {moduleAccess(user, "healthQuote.create") && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <NextLink href={`/health-insurance/proposals/create`} passHref>
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

            {/* Proposal Status  */}

            {dashboardLoading ? (
              <></>
            ) : (
              <HealthproposalStatsInfo
                proposalDashbord={healthDashboardData}
                getProposalsListFilterHandler={searchFilterHandler}
                proposaldashboardLoading={false}
                healthProposalDashbordFilter={healthProposalDashbordFilter}
              />
            )}
            {/* Proposal Filter Card */}

            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                {!isLoading ? (
                  <FilterCard
                    searchFilter={searchFilter}
                    searchFilterHandler={debounceLeadsHandler}
                    inputPlaceHolder="Search health proposals"
                    selectOptions={options}
                    statusOptions={statusOptions}
                    FilterDataHandler={FilterDataHandler}
                  />
                ) : (
                  <Box sx={{ height: 50 }}></Box>
                )}
              </Box>
            </Grid>

            {healthInsuranceLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={!!healthInsuranceLoader} />
              </Box>
            ) : (
              <>
                {/* Proposal Data Table */}
                {healthInsuranceList && (
                  <HealthTable
                    count={healthInsurancePagination?.totalItems}
                    items={healthInsuranceList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    searchFilter={searchFilter}
                    onHistorySelect={handleHistorySelect}
                    healthProposalSearchFilter={healthProposalSearchFilter}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Proposal History Modal */}
      <ModalComp
        open={historyModal}
        handleClose={() => setHistoryModal(false)}
        widths={{ xs: "95%", sm: "95%", md: "880px" }}
      >
        <Box>
          <Typography
            sx={{
              color: "#60176F",
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "center",
              mt: -3,
            }}
          >
            Click out side or on close button to close pop up*
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              sx={{
                color: "#60176F",
                fontWeight: 600,
                ml: 1,
              }}
            >
              Proposal History
            </Typography>
            <CrossSvg
              sx={{
                cursor: "pointer",
                fontSize: "20px",
                "&:hover": {
                  color: "#60176F",
                },
              }}
              onClick={() => setHistoryModal(false)}
            />
          </Box>
          {proposalHealthInfoLoader ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "320px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <ProposalHistoryTable items={proposalHealthInfo?.proposalHistory} />
          )}
        </Box>
      </ModalComp>
    </>
  );
};

HealthInsurance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthInsurance;
