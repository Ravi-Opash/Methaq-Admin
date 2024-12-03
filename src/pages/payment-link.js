import React, { useState, useEffect, useRef, useCallback } from "react";
import NextLink from "next/link";
import { Box, Button, CircularProgress, Container, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { debounce } from "src/utils/debounce-search";
import { useDispatch, useSelector } from "react-redux";
import { moduleAccess } from "src/utils/module-access";
import {
  setPaymentLinkListPagination,
  setPaymentLinkSerchFilter,
} from "src/sections/payment-link/Reducer/paymentLinkSlice";
import PaymentLinksTable from "src/sections/payment-link/payment-link-table";
import { exportPaymentCSVFile, getPaymentLinksList } from "src/sections/payment-link/Action/paymentLinkAction";
import { getAllAgentlist } from "src/sections/Proposals/Action/proposalsAction";
import ModalComp from "src/components/modalComp";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import { CrossSvg } from "src/Icons/CrossSvg";
import { getPaymentDetailsById } from "src/sections/payment-link/Action/paymentLinkAction";
import AnimationLoader from "src/components/amimated-loader";
import PaymentFilterCard from "src/components/paymentFilterCard";
import { toast } from "react-toastify";

// Status options for filtering payments
const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Success",
    value: "SUCCESS",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
];

const Paymentlink = () => {
  const dispatch = useDispatch();

  // State for the payment links, loader, and filters
  const { paymentLinkList, paymentLinkPagination, pagination, paymentLinkListLoader, paymentLinkSearchFilter } =
    useSelector((state) => state.paymentLinks);
  const { loginUserData: user } = useSelector((state) => state.auth);

  // Local state for loading flags and modal state
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [agentList, setAgentList] = useState([]);
  const [historyModal, setHistoryModal] = useState(false);
  const [paymentDetails, SetpaymentDetails] = useState([]);
  const initial = useRef(false);

  // Fetch agent list on component mount
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
  }, []);

  // Local state for search filters
  const [searchFilter, setSearchFilter] = useState({
    name: paymentLinkSearchFilter?.name || "",
    type: paymentLinkSearchFilter?.type || "all",
    fromDate: paymentLinkSearchFilter?.fromDate || ``,
    toDate: paymentLinkSearchFilter?.toDate || ``,
    scrollPosition: paymentLinkSearchFilter?.scrollPosition || 0,
  });

  // Update global search filter when local state changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setPaymentLinkSerchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position if payment link list is loaded
  useEffect(() => {
    if (paymentLinkSearchFilter && !paymentLinkListLoader && paymentLinkList?.length > 0) {
      window.scrollTo({ top: parseInt(paymentLinkSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [paymentLinkList]);

  // Handle filter changes for search inputs (such as agent or type)
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Prevent duplicate calls to API when the component rerenders in development mode
  const paymentLinksListFilter = useRef(false);

  // Handle search filter changes with debounce
  const searchPaymentLinksFilterHandler = (name, value) => {
    paymentLinksListFilter.current = false;

    dispatch(
      setPaymentLinkListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getPaymentLinksListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getPaymentLinksListFilterHandler();
    }
  };

  // Debounced function for search filter changes
  const debouncePaymentLinksHandler = debounce(searchPaymentLinksFilterHandler, 1000);

  // Function to fetch filtered payment links from API
  const getPaymentLinksListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (paymentLinksListFilter.current) {
      return;
    }
    paymentLinksListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getPaymentLinksList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
          payloadData: {
            agentId: payload?.adminId || "",
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

  // Fetch payment links when the component mounts
  useEffect(() => {
    getPaymentLinksListFilterHandler();
  }, []);

  // Handle pagination for payment links
  const handlePaymentLinksPageChange = useCallback(
    (event, value) => {
      dispatch(
        setPaymentLinkListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getPaymentLinksList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
          payloadData: {
            agentId: searchFilter?.adminId || "",
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Handle changing rows per page for the payment link table
  const handlePaymentLinksRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setPaymentLinkListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getPaymentLinksList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            agentId: searchFilter?.adminId || "",
            qType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  const paymentid = paymentLinkList;
  // console.log(paymentid, "P_ID");

  const handleHistorySelect = (id) => {
    setHistoryModal(true);
    dispatch(getPaymentDetailsById({ id: id }))
      .unwrap()
      .then((res) => {
        SetpaymentDetails(res);
      })
      .catch((err) => {});
  };

  // Function to download a PDF file of the payment link details
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Function to export payment data as a CSV file
  const exportCSVFileHandler = () => {
    setIsHistoryLoading(true);
    dispatch(
      exportPaymentCSVFile({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
      })
    )
      .unwrap()
      .then((res) => {
        setIsHistoryLoading(false);
        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data);
        toast.success("successfully exported!");
      })
      .catch((err) => {
        toast.error(err);
        setIsHistoryLoading(false);
      });
  };

  return (
    <>
      {isHistoryLoading && <AnimationLoader open={true} />}
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
            {/* Page Header and Filter Controls */}
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Payments</Typography>
              </Stack>
              <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" spacing={4}>
                {moduleAccess(user, "paymentLink.create") && (
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      sx={{ minWidth: 250 }}
                      label="Filter by agent"
                      name="agentId"
                      onChange={(e) => {
                        debouncePaymentLinksHandler("adminId", e?.target?.value);
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={searchFilter?.agentId}
                    >
                      <option value=""></option>
                      {agentList.map((agent) => {
                        if (!agent?.userId?._id) {
                          return;
                        }
                        return <option value={agent?.userId?._id}>{agent?.userId?.fullName}</option>;
                      })}
                    </TextField>
                    <NextLink href={`/payment-link/create`} passHref>
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
            </Stack>

            {/* Payment Filter Card */}
            {!isLoading ? (
              <PaymentFilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debouncePaymentLinksHandler}
                inputPlaceHolder="Search Payment By Ref Number"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
                exportCSVFile={exportCSVFileHandler}
              />
            ) : (
              <Box sx={{ height: 50 }}></Box>
            )}

            {/* Loading State or Payment Links Table */}
            {paymentLinkListLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={true} />
              </Box>
            ) : (
              <>
                {paymentLinkList && (
                  <PaymentLinksTable
                    count={paymentLinkPagination?.totalItems}
                    items={paymentLinkList}
                    onPageChange={handlePaymentLinksPageChange}
                    onRowsPerPageChange={handlePaymentLinksRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    onHistorySelect={handleHistorySelect}
                    paymentLinkSearchFilter={paymentLinkSearchFilter}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Payment History Modal */}
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

          {/* Loading state for payment history or show history table */}
          {!paymentDetails ? (
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
            <ProposalHistoryTable items={paymentDetails?.history} />
          )}
        </Box>
      </ModalComp>
    </>
  );
};

Paymentlink.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Paymentlink;
