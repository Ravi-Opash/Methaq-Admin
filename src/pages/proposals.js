import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import NextLink from "next/link";
import { Box, Button, CircularProgress, Container, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  clearDocsData,
  resetProposalQuotationList,
  setProposalDashbordFilter,
  setProposalDetailsFromTable,
  setProposalListPagination,
  setProposalSerchFilter,
} from "src/sections/Proposals/Reducer/proposalsSlice";
import { debounce } from "src/utils/debounce-search";
import { useDispatch, useSelector } from "react-redux";
import FilterCard from "src/components/filterCard";
import ProposalsTable from "src/sections/Proposals/proposals-table";
import {
  exportUserInfoToBot,
  fetUserInfoByEmail,
  getAllAgentlist,
  getProposalDashBoard,
  getProposalsDetailsById,
  getProposalsList,
} from "src/sections/Proposals/Action/proposalsAction";
import { useSelection } from "src/hooks/use-selection";
import { moduleAccess } from "src/utils/module-access";
import ProposalStatsInfo from "src/sections/Proposals/proposal-stats-info";
import ModalComp from "src/components/modalComp";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import { CrossSvg } from "src/Icons/CrossSvg";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { toast } from "react-toastify";
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

const Proposals = () => {
  const dispatch = useDispatch();
  const {
    proposalList,
    proposalPagination,
    pagination,
    proposalListLoader,
    proposalDashbord,
    proposalDashbordFilter,
    proposalSearchFilter,
    proposalDetail,
    proposalDetailLoader,
    proposaldashboardLoading,
  } = useSelector((state) => state.proposals);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);

  // useMemo hook - to return all the proposal ids
  const useProposalsIds = (proposals) => {
    return useMemo(() => {
      if (proposals !== null) {
        return proposals?.map((proposal) => proposal._id);
      }
    }, [proposals]);
  };

  // all proposals ids
  const proposalsIds = useProposalsIds(proposalList);
  // checkbox selection
  const proposalsSelection = useSelection(proposalsIds);

  // search filter
  const [searchFilter, setSearchFilter] = useState({
    name: proposalSearchFilter?.name || "",
    type: proposalSearchFilter?.type || "all",
    status: proposalSearchFilter?.status || "all",
    fromDate: proposalSearchFilter?.fromDate || ``,
    toDate: proposalSearchFilter?.toDate || ``,
    proposalsFilter: proposalSearchFilter?.proposalsFilter || "",
    agentId: proposalSearchFilter?.agentId || "",
    scrollPosition: proposalSearchFilter?.scrollPosition || 0,
  });

  // search filter handler
  useEffect(() => {
    if (searchFilter) {
      dispatch(setProposalSerchFilter(searchFilter));
    }
  }, [searchFilter]);

  // reset proposal list
  useEffect(() => {
    dispatch(resetProposalQuotationList());
    dispatch(clearDocsData());
  }, []);

  // Scroll handling
  useEffect(() => {
    if (proposalSearchFilter && !loading && !proposalListLoader && proposalList?.length > 0) {
      window.scrollTo({ top: parseInt(proposalSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [proposalList]);

  // Function to handle updates to the search filter
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // agent list
  const [agentList, setAgentList] = useState([]);

  const initial = useRef(false);

  // get agent list
  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    dispatch(getAllAgentlist({}))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        setAgentList(res?.data);
      })
      .catch((err) => {
        console.log(err, "err");
      });
    dispatch(setProposalDetailsFromTable(null));
  }, []);

  const proposalsListFilter = useRef(false);

  // Search filter handler
  const searchProposalsFilterHandler = (name, value) => {
    proposalsListFilter.current = false;

    dispatch(
      setProposalListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getProposalsListFilterHandler({ [name]: value }, 1, 10);

      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getProposalsListFilterHandler();
    }
  };

  const debounceProposalsHandler = debounce(searchProposalsFilterHandler, 1000);

  // Function to fetch proposals data with the given filter, page, and size
  const getProposalsListFilterHandler = async (otherProps, page, size) => {
    if (proposalsListFilter.current) {
      return;
    }
    proposalsListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getProposalsList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
          payloadData: {
            status: payload?.status,
            qType: payload?.type,
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
            proposalsFilter: payload?.proposalsFilter,
            agentId: payload?.agentId,
          },
        })
      );
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  const proposalsDashBoard = useRef(false);

  // Function to fetch proposals dashboard
  const fetchProposalDashBoard = () => {
    if (proposalsDashBoard.current) {
      return;
    }
    proposalsDashBoard.current = true;
    dispatch(getProposalDashBoard({ agentId: searchFilter?.agentId || "" }))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // useEffect to fetch proposals data
  useEffect(() => {
    getProposalsListFilterHandler();
    fetchProposalDashBoard();
    return () => {
      // dispatch(
      //   setProposalListPagination({
      //     page: 1,
      //     size: 10,
      //   })
      // );
    };
  }, []);

  // handle page change
  const handleProposalsPageChange = useCallback(
    (event, value) => {
      dispatch(
        setProposalListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getProposalsList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
          payloadData: {
            status: searchFilter?.status,
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            proposalsFilter: proposalDashbordFilter,
            agentId: searchFilter?.agentId,
          },
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // handle rows per page change
  const handleProposalsRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setProposalListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getProposalsList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            status: searchFilter?.status,
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            proposalsFilter: proposalDashbordFilter,
            agentId: searchFilter?.agentId,
          },
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  // handle proposal dashboard filter
  const handleProposalDashbordFilter = (name, value) => {
    proposalsListFilter.current = false;

    dispatch(
      setProposalListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getProposalsListFilterHandler({ [name]: value }, 1, 10);

      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getProposalsListFilterHandler();
    }
  };

  // handle reset filter
  const handleResetFilter = () => {
    setIsLoading(true);
    dispatch(
      setProposalListPagination({
        page: 1,
        size: 10,
      })
    );
    dispatch(
      setProposalSerchFilter({
        name: "",
        type: "all",
        status: "all",
        fromDate: ``,
        toDate: ``,
        proposalsFilter: "",
        agentId: "",
        scrollPosition: "",
      })
    );
    dispatch(getProposalDashBoard({}))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
      });
    setSearchFilter({
      name: "",
      type: "all",
      status: "all",
      fromDate: ``,
      toDate: ``,
      proposalsFilter: "",
      agentId: "",
      scrollPosition: 0,
    });
    dispatch(setProposalDashbordFilter(""));
    dispatch(
      getProposalsList({
        page: 1,
        size: 10,
        search: "",
        payloadData: {
          status: "all",
          qType: "all",
          startDate: "",
          endDate: "",
          proposalsFilter: "",
          agentId: "",
        },
      })
    )
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  // handle history
  const handleHistorySelect = (proposalId, carId, userId) => {
    setHistoryModal(true);
    dispatch(
      getProposalsDetailsById({
        id: proposalId,
        carId: carId,
        userId: userId,
      })
    );
  };

  // handle export
  const handleExportUserInfoToBot = (user, admin) => {
    if (user) {
      const payload = {
        action: "create",
        name: user?.fullName,
        email: user?.email,
        phone: `${user?.countryCode || "971"}${user?.mobileNumber}`,
        agent_email: admin?.email,
      };
      const formData = jsonToFormData(payload);
      setLoading(true);
      dispatch(exportUserInfoToBot(formData))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          if (res?.data?.message == "error") {
            toast.error(res?.data?.data?.[0] || "Something went wrong!");
          } else {
            toast.success("Successfully sent!");
            const link = document.createElement("a");
            link.href = res?.data?.conversation_url;
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            link.remove();
            // window.location.href = res?.data?.conversation_url;
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err, "err");
          toast.error(err || "Something went wrong!");
          setLoading(false);
        });
    }
  };

  const mappedAgentList = agentList?.map((agent) => {
    return {
      label: agent.userId?.fullName,
      id: agent.userId?._id,
    };
  });

  return (
    <>
      {loading && (
        <>
          <AnimationLoader open={true} />
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            px: {
              xs: "14px !important",
              sm: "16px !important",
              xl: "24px !important",
            },
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Proposals</Typography>
              </Stack>
            </Stack>
            <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                {(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor) && (
                  <TextField
                    fullWidth
                    sx={{ minWidth: 250 }}
                    label="Filter by agent"
                    name="agentId"
                    onChange={(e) => {
                      searchProposalsFilterHandler(e.target.name, e.target.value);
                      dispatch(getProposalDashBoard({ agentId: e.target.value }))
                        .unwrap()
                        .then((res) => {
                          // console.log(res, "res");
                        })
                        .catch((err) => {
                          console.log(err, "err");
                        });
                    }}
                    select
                    SelectProps={{ native: true }}
                    value={searchFilter?.agentId}
                  >
                    <option value=""></option>
                    {agentList.map((agent, index) => {
                      if (!agent?.userId?._id) {
                        return;
                      }
                      return (
                        <option value={agent?.userId?._id} key={index}>
                          {agent?.userId?.fullName}
                        </option>
                      );
                    })}
                  </TextField>
                )}
              </Stack>

              {moduleAccess(user, "proposals.create") && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button variant="contained" onClick={handleResetFilter}>
                    Reset Filter
                  </Button>
                  <NextLink href={`/proposals/create`} passHref onClick={() => dispatch(fetUserInfoByEmail(null))}>
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

            <ProposalStatsInfo
              proposalDashbordFilter={proposalDashbordFilter}
              proposalDashbord={proposalDashbord}
              getProposalsListFilterHandler={handleProposalDashbordFilter}
              proposaldashboardLoading={proposaldashboardLoading}
            />

            {!isLoading ? (
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceProposalsHandler}
                inputPlaceHolder="Search proposals"
                selectOptions={options}
                statusOptions={statusOptions}
                FilterDataHandler={FilterDataHandler}
              />
            ) : (
              <Box sx={{ height: 50 }}></Box>
            )}

            {proposalListLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={!!proposalListLoader} />
              </Box>
            ) : (
              <>
                {proposalList && (
                  <ProposalsTable
                    count={proposalPagination?.totalItems}
                    items={proposalList}
                    onDeselectAll={proposalsSelection.handleDeselectAll}
                    onDeselectOne={proposalsSelection.handleDeselectOne}
                    onPageChange={handleProposalsPageChange}
                    onRowsPerPageChange={handleProposalsRowsPerPageChange}
                    onSelectAll={proposalsSelection.handleSelectAll}
                    onSelectOne={proposalsSelection.handleSelectOne}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    selected={proposalsSelection.selected}
                    onHistorySelect={handleHistorySelect}
                    handleExportUserInfoToBot={handleExportUserInfoToBot}
                    proposalSearchFilter={proposalSearchFilter}
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
          {proposalDetailLoader ? (
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
            <ProposalHistoryTable items={proposalDetail?.proposalHistory} />
          )}
        </Box>
      </ModalComp>
    </>
  );
};

Proposals.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Proposals;
