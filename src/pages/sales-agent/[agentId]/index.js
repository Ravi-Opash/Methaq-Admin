import React, { useRef, useEffect, useState, useCallback } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { getSalesAdminDetailById, getSalesAdminproposalList } from "src/sections/sales-agent/action/salesAdminAction";
import SalesAgentSummary from "src/sections/sales-agent/sales-agent-summary";
import { debounce } from "src/utils/debounce-search";
import { setSalesAdminProposalListPagination } from "src/sections/sales-agent/reducer/salesAdminSlice";
import AnimationLoader from "src/components/amimated-loader";

const SalesAgentDetails = () => {
  const dispatch = useDispatch();
  const { salesAdminDetail, loading, salesAgentProposalListPagination } = useSelector((state) => state.salesAdmins);
  const router = useRouter();
  const { agentId } = router.query;

  const initialized = useRef(false);

  // Function to get company details
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getSalesAdminDetailById(agentId))
        .unwrap()
        .then((res) => {
          // console.log("res", res);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to get company details
  useEffect(() => {
    getCompanyDetailsHandler();
    getSalesAgentProposalListFilterHandler();

    return () => {
      dispatch(
        setSalesAdminProposalListPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []);

  // Function to get company details
  const [searchFilter, setSearchFilter] = useState({
    name: "",
    status: "all",
    startDate: "",
    endDate: "",
  });

  const proposalsListFilter = useRef(false);

  // Function to get company details
  const searchProposalsFilterHandler = (name, value) => {
    proposalsListFilter.current = false;

    dispatch(
      setSalesAdminProposalListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getSalesAgentProposalListFilterHandler({ [name]: value }, 1, 10);

      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getSalesAgentProposalListFilterHandler();
    }
  };

  // Function to Date Filter
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to Debounce proposals search
  const debounceProposalsHandler = debounce(searchProposalsFilterHandler, 1000);

  // Function for sales agent proposal list
  const getSalesAgentProposalListFilterHandler = async (otherProps) => {
    if (proposalsListFilter.current) {
      return;
    }
    proposalsListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getSalesAdminproposalList({
          page: salesAgentProposalListPagination?.page,
          size: salesAgentProposalListPagination?.size,
          search: payload?.name,
          agentId: agentId,
          payloadData: {
            status: payload?.status,
            startDate: payload?.startDate,
            endDate: payload?.endDate,
          },
        })
      );
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  // Function for handle pagination
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setSalesAdminProposalListPagination({
          page: value + 1,
          size: salesAgentProposalListPagination?.size,
        })
      );
      dispatch(
        getSalesAdminproposalList({
          page: value + 1,
          size: salesAgentProposalListPagination?.size,
          search: searchFilter?.name,
          agentId: agentId,
          payloadData: {
            status: searchFilter?.status,
            startDate: searchFilter?.startDate,
            endDate: searchFilter?.endDate,
          },
        })
      );
    },
    [salesAgentProposalListPagination?.size, searchFilter]
  );

  // Function for handle rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setSalesAdminProposalListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getSalesAdminproposalList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          agentId: agentId,
          payloadData: {
            status: searchFilter?.status,
            startDate: searchFilter?.startDate,
            endDate: searchFilter?.endDate,
          },
        })
      );
    },
    [salesAgentProposalListPagination?.page, searchFilter]
  );

  // Function for handle month
  const onMonthSelect = (value) => {
    console.log(value, "pppp");
    dispatch(
      getSalesAdminproposalList({
        page: salesAgentProposalListPagination?.page,
        size: salesAgentProposalListPagination?.size,
        search: searchFilter?.name,
        agentId: agentId,
        payloadData: {
          status: searchFilter?.status,
          startDate: value?.startDate,
          endDate: value?.endDate,
        },
      })
    );
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
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
              <AnimationLoader open={true} />
            </Box>
          ) : (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href="/sales-agent" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Admins</Typography>
                  </Link>
                </NextLink>
              </Box>

              {salesAdminDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Sales Agent Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        <NextLink href={`/sales-agent/${salesAdminDetail?._id}/edit`} passHref>
                          <Button
                            component="a"
                            endIcon={<PencilAlt fontSize="small" />}
                            sx={{ m: 1 }}
                            variant="contained"
                          >
                            Edit
                          </Button>
                        </NextLink>
                      </Grid>
                    </Grid>
                  </Box>
                  <SalesAgentSummary
                    salesAdminDetail={salesAdminDetail}
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    searchFilter={searchFilter}
                    debounceProposalsHandler={debounceProposalsHandler}
                    FilterDataHandler={FilterDataHandler}
                    onMonthSelect={onMonthSelect}
                  />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

SalesAgentDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SalesAgentDetails;
