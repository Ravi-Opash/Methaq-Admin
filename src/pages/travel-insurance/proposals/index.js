import { Button, CircularProgress, Grid, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FilterCard from "src/components/filterCard";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  setTravelInsuranceListPagination,
  setTravelProposalSerchFilter,
} from "src/sections/travel-insurance/Proposals/Reducer/travelInsuranceSlice";
import NextLink from "next/link";
import TravelTable from "src/sections/travel-insurance/travel-table";
import { debounce } from "src/utils/debounce-search";
import {
  getTravelInsuranceDashBoard,
  getTravelInsuranceList,
  getTravelInfoByproposalId,
} from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import TravelproposalStatsInfo from "src/sections/travel-insurance/travel-status-info";
import { moduleAccess } from "src/utils/module-access";
import ModalComp from "src/components/modalComp";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import { CrossSvg } from "src/Icons/CrossSvg";
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

const TravelInsurance = () => {
  const dispatch = useDispatch();
  const {
    travelInsuranceLoader,
    travelInsuranceList,
    travelInsurancePagination,
    travelProposalDashbordFilter,
    pagination,
    travelDashboardData,
    traveldashboardLoading,
    travelProposalSearchFilter,
    proposalTravelInfo,
    proposalTravelInfoLoader,
  } = useSelector((state) => state.travelInsurance);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const initialized = useRef(false);

  const [historyModal, setHistoryModal] = useState(false);

  // Function to set the search filter
  const [searchFilter, setSearchFilter] = useState({
    name: travelProposalSearchFilter?.name || "",
    type: travelProposalSearchFilter?.type || "all",
    status: travelProposalSearchFilter?.status || "all",
    fromDate: travelProposalSearchFilter?.fromDate || ``,
    toDate: travelProposalSearchFilter?.toDate || ``,
    proposalsFilter: travelProposalSearchFilter?.proposalsFilter || "",
    scrollPosition: travelProposalSearchFilter?.scrollPosition || 0,
    // agentId: travelProposalSearchFilter?.agentId || "",
  });

  // Function to update the search filter
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Function to update the search filter
  useEffect(() => {
    if (searchFilter) {
      dispatch(setTravelProposalSerchFilter(searchFilter));
    }
  }, [searchFilter]);

  const [isLoading, setIsLoading] = useState(false);

  // Function to set the scroll position
  useEffect(() => {
    if (travelProposalSearchFilter && !travelInsuranceLoader && travelInsuranceList?.length > 0) {
      const scrollPosition = parseInt(travelProposalSearchFilter?.scrollPosition, 10);

      const timeoutScroll = setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      }, 200);

      return () => clearTimeout(timeoutScroll);
    }
  }, [travelInsuranceList, travelInsuranceLoader]);

  // Function to handle the search
  const searchFilterHandler = (name, value) => {
    initialized.current = false;

    dispatch(
      setTravelInsuranceListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getTravelListHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getTravelListHandler();
    }
  };

  // Function to get the travel list
  const getTravelListHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getTravelInsuranceList({
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

  // Function to fetch dashboard data
  const fetchDashBoardData = () => {
    dispatch(getTravelInsuranceDashBoard({}))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // Function to get the travel list and stop multiple call
  useEffect(
    () => {
      if (initialized.current) {
        return;
      }
      initialized.current = true;
      getTravelListHandler();
      fetchDashBoardData();

      return () => {
        // dispatch(
        //   setTravelInsuranceListPagination({
        //     page: 1,
        //     size: 10,
        //   })
        // );
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Function to handle the page change
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setTravelInsuranceListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getTravelInsuranceList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
          payloadData: {
            status: searchFilter?.status,
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            proposalsFilter: travelProposalDashbordFilter,
          },
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Function to handle the rows per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setTravelInsuranceListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getTravelInsuranceList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            status: searchFilter?.status,
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            proposalsFilter: travelProposalDashbordFilter,
          },
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  const travelInfoId = proposalTravelInfo?.travelId?._id;

  // Function to handle the history
  const handleHistorySelect = (proposalId) => {
    setHistoryModal(true);
    dispatch(getTravelInfoByproposalId({ proposalId: proposalId, travelInfoId: travelInfoId }))
      .then((res) => {})
      .catch((err) => {
        toast.error(err);
      });
  };

  // Function to handle the search and date filter or delay the call
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
                <Typography variant="h4">Travel Insurance</Typography>
              </Stack>
              {moduleAccess(user, "travelQuote.create") && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <NextLink href={`/travel-insurance/proposals/create`} passHref>
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

            {traveldashboardLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: "5rem !important",
                }}
              >
                {/* <CircularProgress /> */}
              </Box>
            ) : (
              <TravelproposalStatsInfo
                proposalDashbord={travelDashboardData}
                getProposalsListFilterHandler={searchFilterHandler}
                proposaldashboardLoading={false}
                travelProposalDashbordFilter={travelProposalDashbordFilter}
              />
            )}

            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                {!isLoading ? (
                  <FilterCard
                    searchFilter={searchFilter}
                    searchFilterHandler={debounceLeadsHandler}
                    inputPlaceHolder="Search travel proposals"
                    selectOptions={options}
                    statusOptions={statusOptions}
                    FilterDataHandler={FilterDataHandler}
                  />
                ) : (
                  <Box sx={{ height: 50 }}></Box>
                )}
              </Box>
            </Grid>

            {travelInsuranceLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={!!travelInsuranceLoader} />
              </Box>
            ) : (
              <>
                {travelInsuranceList && (
                  <TravelTable
                    count={travelInsurancePagination?.totalItems}
                    items={travelInsuranceList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    searchFilter={searchFilter}
                    onHistorySelect={handleHistorySelect}
                    travelProposalSearchFilter={travelProposalSearchFilter}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>
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
          {proposalTravelInfoLoader ? (
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
            <ProposalHistoryTable items={proposalTravelInfo?.proposalHistory} />
          )}
        </Box>
      </ModalComp>
    </>
  );
};
TravelInsurance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelInsurance;
