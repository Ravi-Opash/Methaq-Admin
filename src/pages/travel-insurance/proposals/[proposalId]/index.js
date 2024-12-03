import { Box, Container, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  getTravelInfoByproposalId,
  getTravelProposalQuotesById,
  getTravelPaidProposals,
  travelCheckoutPayment,
  travelInsurancePayByLink,
  travelPurchaseConfirm,
  getTravelInsuranceCompany,
  reGenerateTravelProposalByProposalId,
  getTravelQuotesPaybles,
  getTravelProposalCommentsList,
} from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import { getTravelComparePlans } from "src/sections/travel-insurance/compare-plans/Action/travelComparePlanAction";
import NextLink from "next/link";
import {
  Button,
  Grid,
  Link,
  Typography,
  Card,
  CircularProgress,
  Divider,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Backdrop,
  Skeleton,
  SvgIcon,
  IconButton,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { EditIcon } from "src/Icons/EditIcon";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { format, isValid, parseISO } from "date-fns";
import { Scrollbar } from "src/components/scrollbar";
import { moduleAccess } from "src/utils/module-access";
import ModalComp from "src/components/modalComp";
import { CrossSvg } from "src/Icons/CrossSvg";
import NetworkLogo from "../../../../../public/assets/logos/NetworkLogo.svg";
import { toast } from "react-toastify";
import Image from "next/image";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import {
  setTravelInfoId,
  setTravelProposalPaymentInfo,
  setTravelProposalQuotationListPagination,
  setTravekQuoteCount,
  setTravelProposalQuotationList,
} from "src/sections/travel-insurance/Proposals/Reducer/travelInsuranceSlice";
import { socket } from "src/utils/socket";
import TravelPromoCodeSession from "src/sections/travel-insurance/Proposals/travel-apply-promo-code";
import TravelProposalQuotationTable from "src/sections/travel-insurance/Proposals/proposal-quotation-table";
import TravelProposalAssignTask from "src/sections/travel-insurance/Proposals/travel-proposal-assign-task";
import TransactionInfoModal from "src/sections/Proposals/transaction-Info-modal";
import { debounce } from "src/utils/debounce-search";
import TravelPlanPaybleDetails from "src/sections/travel-insurance/Proposals/travel-plan-payble-details";
import AddCommentModal from "src/sections/customer/CustomerComments/add-comment-modal";
import TravelProposalCommentsTable from "src/sections/travel-insurance/Proposals/travel-proposal-comment-table";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import TravelPersonalEditForm from "src/sections/travel-insurance/Travel-info/travel-personal-edit-form";
import EditDesinationDetails from "src/sections/travel-insurance/Travel-info/travel-desination-edit-form";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import AnimationLoader from "src/components/amimated-loader";
import { formatNumber } from "src/utils/formatNumber";
import { SeverityPill } from "src/components/severity-pill";
import LinkIcon from "@heroicons/react/24/solid/LinkIcon";
import { ArrowRight } from "src/Icons/ArrowRight";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const TravelInsuranceDetails = () => {
  const dispatch = useDispatch();
  const {
    travelProposalQuotationlist,
    travelProposalPaymentInfo,
    proposalTravelInfo,
    proposalTravelInfoLoader,
    travelProposalQuotationlistLoader,
    travelInfoId,
    policyFeeLoader,
    quotePayableDetails,
    travelSocketLoader,
    travelProposalCommentListLoader,
    travelProposalCommentList,
  } = useSelector((state) => state.travelInsurance);
  const router = useRouter();
  const { proposalId } = router.query;
  const { customerQuotationDetails } = useSelector((state) => state.customer);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [isProposalPurchased, setIsProposalPurchased] = useState(false);
  const [policyIssued, setPolicyIssued] = useState(false);
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);
  const [policyId, setPolicyId] = useState("");
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [countPlanLoader, setCountPlanLoader] = useState(travelSocketLoader || false);

  // re-generate button disabled condition
  const [isDisabled, setIsDisabled] = useState(false);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!travelSocketLoader) {
      tiggerCompletionOfRegenerate(!travelSocketLoader && countPlanLoader);
      fetchProposalSummary(true);
    }
  }, [travelSocketLoader]);

  const [requireArray, setrequireArray] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const [transactionRefModalOpen, setTransactionRefModalOpen] = useState(false);
  const HandleTransactionRefModalClose = () => setTransactionRefModalOpen(false);
  const [paidByMethod, setPaidByMethod] = useState("");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [isFromSocket, setIsFromSocket] = useState(false);
  const [isPolicyGenerated, setIsPolicyGenerated] = useState(false);

  const [editPeronsaldetails, setEditPersonalDeatils] = useState(false);
  const HandlePersonalModalClose = () => setEditPersonalDeatils(false);
  const [editDesinationDetails, setEditDesinationDeatils] = useState(false);
  const HandleDesinationModalClose = () => setEditDesinationDeatils(false);

  const [commentModal, setCommentModal] = useState(false);

  // Function to handle checkbox change and limit selection
  const handleCheckboxChange = (value) => {
    if (selectedCheckboxes.includes(value)) {
      // Checkbox already selected, remove it from the selected checkboxes
      setSelectedCheckboxes(selectedCheckboxes.filter((item) => item !== value));
    } else {
      // Limit the selection to four checkboxes
      if (selectedCheckboxes.length < 4) {
        setSelectedCheckboxes([...selectedCheckboxes, value]);
      }
    }
  };

  // Function to handle checkbox change
  useEffect(() => {
    if (selectedCheckboxes && selectedCheckboxes?.length == 1) {
      dispatch(getTravelQuotesPaybles(selectedCheckboxes?.[0]));
    }
  }, [selectedCheckboxes?.length]);

  // Function to handle checkbox change and policy purchased status
  const setStatusByListOfQuotes = (list = [], changed) => {
    if (travelProposalPaymentInfo?.proposalId == proposalId && !changed) {
      return;
    }
    let pPurchased = false;
    let pGenerated = false;
    let pIssued = false;
    let policyId = "";
    list?.map((quote) => {
      if (quote.isPaid > 0) {
        setIsProposalPurchased(true);
        pPurchased = true;
      }
      if (quote.isBought) {
        setIsPolicyGenerated(true);
        pGenerated = true;
        setPolicyId(quote?.policy?._id);
        policyId = quote?.policy?._id;
      }
      if (quote.policyIssued) {
        setPolicyIssued(true);
        pIssued = true;
        setPolicyId(quote?.policy?._id);
        policyId = quote?.policy?._id;
      }
    });

    if (!pPurchased) {
      setIsProposalPurchased(false);
    }
    if (!pGenerated) {
      setIsPolicyGenerated(false);
    }
    if (!pIssued) {
      setPolicyIssued(false);
    }

    dispatch(
      setTravelProposalPaymentInfo({
        proposalId: proposalId,
        policyIssued: pIssued,
        isPolicyGenerated: pGenerated,
        isProposalPurchased: pPurchased,
        policyId: policyId,
      })
    );
  };

  // Function to view proposals online for travel in website
  const onViewProposalOnline = () => {
    let temp;
    const domainName = window.location.origin;
    if (domainName === "https://admin.dev.esanad.com") {
      temp = "https://dev.esanad.com";
    } else if (domainName === "https://admin.esanad.com") {
      temp = "https://esanad.com";
    } else if (domainName === "http://localhost:3000") {
      temp = "https://dev.esanad.com";
    }

    const plink = temp + "/travel-insurance/getQuote?ref=" + travelProposalQuotationlist[0]?.internalRef;

    const link = document.createElement("a");
    link.href = plink;
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Function to fetch proposal summary and initialize stop api call multiple times
  const initialized = useRef(false);

  const fetchProposalSummary = (changed) => {
    dispatch(
      getTravelProposalQuotesById({
        id: proposalId,
        page: 1,
        size: 10,
      })
    )
      .unwrap()
      .then((res) => {
        // console.log(" res", res);
        setIsFromSocket(false);
      })
      .catch((err) => {
        // console.log(err);
      });

    dispatch(getTravelInfoByproposalId({ proposalId: proposalId, travelInfoId: travelInfoId }))
      .then((res) => {})
      .catch((err) => {
        toast.error(err);
      });

    dispatch(getTravelInsuranceCompany(proposalId))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        toast.error(err);
      });

    dispatch(getTravelPaidProposals(proposalId))
      .unwrap()
      .then((res) => {
        setStatusByListOfQuotes([...res?.data?.paidProposals, res?.data?.contactProposals], changed);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // Function to fetch proposal summary and comments
  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    // if (travelInfoId) {
    fetchProposalSummary(true);
    dispatch(getTravelProposalCommentsList(proposalId))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        toast?.error(err);
      });
  }, [travelInfoId]);

  // Function to clear state on unmount
  useEffect(() => {
    return () => {
      dispatch(setTravelProposalQuotationListPagination({ page: 1, size: 10 }));
      dispatch(setTravelProposalPaymentInfo(null));
      dispatch(setTravelInfoId(null));
    };
  }, []);

  // Function to handle payment
  const payByLinkHandler = (paidBy) => {
    if (proposalTravelInfo?.isRegenerate) {
      toast.error("Re-generate proposal before you go further!");
      return;
    }
    const valid = validationForPaymentHandler();
    if (!valid) {
      return;
    }
    if (isProposalPurchased === true) {
      toast("You already bought policy for this proposal!", {
        type: "error",
      });
    } else if (selectedCheckboxes.length === 0) {
      toast("Please select quotation which you want to buy!", {
        type: "error",
      });
      const element = document.getElementById("travel-quotation-list");
      element.scrollIntoView({
        behavior: "smooth",
      });
    } else if (selectedCheckboxes.length >= 2) {
      toast("Please select only one qutation!", {
        type: "error",
      });
    } else {
      if (paidBy?.paidBy == "link") {
        setVerifyModal(true);
        return;
      }
      if (paidBy?.paidBy == "CRM - Direct to insurance company") {
        setrequireArray(["proofAmount", "proofOfPayment", "transactionRefNo"]);
      }
      if (paidBy?.paidBy == "CRM - Bank transfer") {
        setrequireArray(["transactionRefNo"]);
      }
      setTransactionRefModalOpen(true);
      setPaidByMethod(paidBy?.paidBy);
    }
  };

  // Function to handle payment by link
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(travelCheckoutPayment({ quoteId: selectedCheckboxes[0], paidBy: "CRM - Link" }))
      .unwrap()
      .then((data) => {
        handleCloseVerifymodal();
        setPaymentLinkInfo(data);
        setPaymentLinkShareModal(true);
        setLoading(true);
      })
      .catch((err) => {
        // console.log(err);
        toast(err, {
          type: "error",
        });
        setLoading(true);
        handleCloseVerifymodal();
      });
  };

  // Function to handle payment confirm after payment
  const onClickOnConfirm = (paidBy) => {
    if (selectedCheckboxes.length === 0) {
      toast("Please select quotation which you want to Confirm!", {
        type: "error",
      });
    } else if (selectedCheckboxes.length >= 2) {
      toast("Please select only one qutation!", {
        type: "error",
      });
    } else {
      setLoading(false);
      dispatch(travelPurchaseConfirm({ id: selectedCheckboxes[0], data: { paidBy: paidBy } }))
        .then((res) => {
          if (res?.error?.message) {
            toast.error(res.payload);
          } else {
            toast.success("Payment confirmed successfully!");
            fetchProposalSummary(true);
          }
          setLoading(true);
        })
        .catch((err) => {
          // console.log(err, "err");
          toast.error(err);
          setLoading(true);
        });
    }
  };

  // Function to handle submit transaction ref
  const handleSubmitRefNo = (data) => {
    setLoading(false);
    dispatch(
      travelInsurancePayByLink({
        id: selectedCheckboxes[0],
        data: data,
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.error?.message) {
          toast.error(res.payload);
        } else {
          toast.success("Payment confirmed successfully!");
          fetchProposalSummary(true);
        }
        setLoading(true);
        HandleTransactionRefModalClose(false);
      })
      .catch((err) => {
        // console.log(err, "err");
        toast.error(err);
        setLoading(true);
      });
  };

  // Function to handle plan select
  const onPlanSelectHandler = (value, id) => {
    if (selectedPlans?.length >= 4 && !selectedPlans?.includes(id)) {
      toast.error("You can select 4 plans maximum!");
      return;
    }
    let arr = selectedPlans;
    if (selectedPlans?.includes(id)) {
      let filterArray = arr?.filter((i) => i !== id);
      setSelectedPlans(filterArray);
    } else {
      arr = [...arr, id];
      setSelectedPlans(arr);
    }
  };

  // Function trigger completion of regenerate
  const tiggerCompletionOfRegenerate = (value) => {
    if (value) {
      setCountPlanLoader(false);
      toast?.success("Proposal Regenerated Successfully!");
      setIsDisabled(false);
      fetchProposalSummary(true);
    }
  };

  // Function to handle regenerate and debounce for delay 2 seconds
  const debounceProposalsHandler = debounce(tiggerCompletionOfRegenerate, 2000);

  // Function to handle regenerate proposal
  const ReGenerateHandler = useCallback(
    (travelProposalQuotationlist) => {
      setLoading(false);
      setIsDisabled(true);
      if (socket && travelProposalQuotationlist?.[0]?.reqId) {
        if (socket.disconnected) socket.connect();
        socket.off("travel-quote-created");
        socket.emit("join", { room: travelProposalQuotationlist?.[0]?.reqId });

        socket.on("travel-quote-created", (quote) => {
          if (quote?.Errors?.length > 0) {
          } else {
            setCountPlanLoader(true);
            dispatch(setTravelProposalQuotationList(quote));
            setIsFromSocket(true);
            dispatch(setTravekQuoteCount(-1));
            debounceProposalsHandler(true);
          }
        });

        socket.off("quote-counter");

        socket.on("quote-counter", (count) => {
          dispatch(setTravekQuoteCount(count));
          // setTimeout(() => {
          //   dispatch(clearQuoteCount());
          // }, 30000);
        });
      }
      setSelectedCheckboxes([]);
      dispatch(
        reGenerateTravelProposalByProposalId({
          travelInfoId: proposalTravelInfo?.travelId?._id,
          proposalNo: proposalId,
          refId: travelProposalQuotationlist?.[0]?.internalRef,
          reqId: travelProposalQuotationlist?.[0]?.reqId,
        })
      )
        .unwrap()
        .then((res) => {
          // console.log("res1111", res);
          // toast?.success("Proposal Regenerated Successfully!");
          setLoading(true);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          setLoading(true);
        });
    },
    [proposalTravelInfo]
  );

  // Function to get travel info by proposal id
  const getTravelInfoByPrposalIdHandler = () => {
    dispatch(getTravelInfoByproposalId({ proposalId: proposalId, travelInfoId: proposalTravelInfo?._id }))
      .then((res) => {})
      .catch((err) => {
        toast.error(err);
      });
  };

  // Check condition of passport.... before payment
  const validationForPaymentHandler = () => {
    if (proposalTravelInfo?.travellersId) {
      let valid = true;
      proposalTravelInfo?.travellersId?.map((person) => {
        if (!person?.passportNumber) {
          valid = false;
        }
      });
      if (!valid) {
        toast.error("Please add passport number of travellers!");
      }
      return valid;
    }
  };

  // Function to handle compare plan
  const handleCompare = () => {
    if (selectedCheckboxes.length <= 1) {
      toast.error("Please select atleast 2 quotes to compare");
      return;
    }
    dispatch(
      getTravelComparePlans({
        companyIds: selectedPlans,
        refId: travelProposalQuotationlist?.[0]?.internalRef || travelProposalQuotationlist?.[0]?.reqId,
      })
    )
      .then((res) => {
        // console.log(res, "res");
        router.push("/travel-insurance/compare-plans");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
      }}
    >
      {!isLoading && (
        <>
          <AnimationLoader open={true} />
        </>
      )}
      {(countPlanLoader || travelSocketLoader) && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
          open={countPlanLoader || travelSocketLoader}
        >
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, fontWeight: 700 }}>
            <Typography variant="h4" sx={{ fontSize: 24, color: "#60176F" }}>{`Getting Plans .... ${
              travelProposalQuotationlist?.length || 0
            }`}</Typography>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Box>
        </Backdrop>
      )}
      <Container maxWidth={false}>
        <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
          <Box
            sx={{
              display: "inline-block",
            }}
          >
            <NextLink href="/travel-insurance/proposals" passHref>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Travel insurance proposals</Typography>
              </Link>
            </NextLink>
          </Box>

          <Stack spacing={1} mb={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                mt: 5,
              }}
            >
              <Typography variant="h4">Travel Proposal Details</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "start", md: "center" },
                  alignItems: "cener",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "inline-block" }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                      setCommentModal(true);
                    }}
                    startIcon={
                      <SvgIcon fontSize="small">
                        <SpeakerNotesIcon />
                      </SvgIcon>
                    }
                  >
                    Comments
                  </Button>
                </Box>
              </Box>
            </Box>
          </Stack>
          {!proposalTravelInfoLoader ? (
            <Box sx={{ display: "inline-block", width: "100%" }}>
              {isPolicyGenerated && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 1,
                    p: 2.5,
                    backgroundColor: "#e5f7e5",
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px $e5f7e5",
                    borderRadius: "10px 10px 10px 10px",
                  }}
                >
                  <Typography sx={{ ml: 0, fontWeight: 600, color: "#111927" }}>
                    This proposal has been made into a policy, Click here to view policy.
                  </Typography>
                  <Button
                    type="button"
                    sx={{ mr: 1 }}
                    variant="contained"
                    onClick={() => router.push(`/travel-insurance/policies/${policyId}`)}
                  >
                    View Policy
                  </Button>
                </Box>
              )}
              {travelProposalQuotationlist?.length > 0 ? (
                <>
                  {(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor) && (
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TravelProposalAssignTask
                        proposalId={proposalId}
                        assignedAgent={travelProposalQuotationlist?.[0]?.adminId}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box>
                  <Skeleton height={50} />
                  <Skeleton height={30} />
                  <Skeleton height={30} width={300} />
                  <Skeleton height={30} />
                </Box>
              )}
              {travelProposalQuotationlist?.length > 0 ? (
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <TravelPromoCodeSession
                    proposalId={travelProposalQuotationlist?.[0]?.proposalId}
                    items={travelProposalQuotationlist?.[0]}
                    fetchProposalSummary={fetchProposalSummary}
                    isPurchased={!!proposalTravelInfo?.paymentId}
                  />
                </Box>
              ) : (
                <Box>
                  <Skeleton height={30} />
                  <Skeleton height={130} />
                </Box>
              )}
              <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <ProposalStatusSession
                    proposalId={proposalId}
                    items={proposalTravelInfo?.travelProposal}
                    fetchProposalSummary={() => fetchProposalSummary(false)}
                    isPolicyGenerated={isPolicyGenerated}
                    policyIssued={policyIssued}
                    flag={"Travel"}
                  />
                </Box>
                <Box
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    mb: 3,
                    borderRadius: "10px",
                    background: "white",
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Scrollbar>
                    <Box
                      sx={{
                        display: "flex",
                        minWidth: 700,
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f5f5f5",
                        p: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          mb: 0,
                          pl: 1,
                          fontWeight: "600",
                          fontSize: "18px",
                          display: "inline-block",
                          color: "#60176F",
                        }}
                      >
                        Quotations
                      </Typography>
                      <Box>
                        <Box sx={{ display: "inline-block" }}>
                          <Button
                            onClick={onViewProposalOnline}
                            sx={{
                              textDecoration: "underline",
                              textDecorationColor: "#60176F !important",
                            }}
                          >
                            View online
                          </Button>
                        </Box>
                        <Button
                          sx={{
                            textDecoration: "underline",
                            textDecorationColor: "#60176F !important",
                          }}
                          onClick={handleCompare}
                        >
                          Generate a comparison
                        </Button>
                      </Box>
                    </Box>
                  </Scrollbar>
                  {travelProposalQuotationlistLoader ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "500px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box id={"travel-quotation-list"} sx={{ display: "inline-block", width: "100%" }}>
                      <TravelProposalQuotationTable
                        handleCheckboxChange={handleCheckboxChange}
                        checkSelect={selectedCheckboxes}
                        onPlanSelectHandler={onPlanSelectHandler}
                        isFromSocket={isFromSocket}
                        isPurchased={isProposalPurchased}
                      />
                    </Box>
                  )}
                </Box>
                <Box
                  id={"ownerDetails"}
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    borderRadius: "10px",
                    mb: 3,
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#60176F",
                      px: "14px",
                      borderRadius: "10px 10px 0 0",
                      py: 1.5,
                      width: "100%",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        fontSize: "18px",
                        display: "inline-block",
                      }}
                    >
                      Destination Details
                    </Typography>
                    {moduleAccess(user, "travelQuote.update") && !isPolicyGenerated && (
                      <EditIcon
                        onClick={() => setEditDesinationDeatils(true)}
                        sx={{ fontSize: 30, cursor: "pointer" }}
                      />
                    )}
                  </Box>
                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Insurance Type"}
                              value={proposalTravelInfo?.travelId?.insuranceType || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Departure Country"}
                              value={proposalTravelInfo?.travelId?.country || "-"}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Destination"}
                              value={proposalTravelInfo?.travelId?.destination || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Start Date"}
                              value={
                                proposalTravelInfo?.travelId?.inceptionDate
                                  ? format(parseISO(proposalTravelInfo?.travelId?.inceptionDate), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Period"}
                              value={proposalTravelInfo?.travelId?.period || "-"}
                            />
                          </Grid>
                        </Grid>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  id={"ownerDetails"}
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    borderRadius: "10px",
                    // mb: 3,
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#60176F",
                      px: "14px",
                      borderRadius: "10px 10px 0 0",
                      py: 1.5,
                      width: "100%",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        fontSize: "18px",
                        display: "inline-block",
                      }}
                    >
                      Personal Details
                    </Typography>

                    {moduleAccess(user, "travelQuote.update") && !isPolicyGenerated && (
                      <EditIcon onClick={() => setEditPersonalDeatils(true)} sx={{ fontSize: 30, cursor: "pointer" }} />
                    )}
                  </Box>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Full Name"}
                              value={
                                proposalTravelInfo?.travellersId?.[0].firstName +
                                  " " +
                                  proposalTravelInfo?.travellersId?.[0].lastName || "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Email"}
                              value={proposalTravelInfo?.travellersId?.[0]?.contact?.email || "-"}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Mobile Number"}
                              value={
                                proposalTravelInfo?.travellersId?.[0]?.contact?.mobileNumber
                                  ? `+971 ${proposalTravelInfo?.travellersId?.[0]?.contact?.phoneNumber}`
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Date of Birth"}
                              value={
                                proposalTravelInfo?.travellersId?.[0]?.dateOfBirth
                                  ? format(parseISO(proposalTravelInfo?.travellersId?.[0]?.dateOfBirth), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Gender"}
                              value={proposalTravelInfo?.travellersId?.[0]?.gender || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Passport Number"}
                              value={proposalTravelInfo?.travellersId?.[0]?.passportNumber || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Age"}
                              value={proposalTravelInfo?.travellersId?.[0]?.age || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Nationality"}
                              value={proposalTravelInfo?.travellersId?.[0]?.nationality || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>
                      </List>
                    </Grid>
                  </Grid>
                  {proposalTravelInfo?.travellersId?.length > 1 && (
                    <Grid container columnSpacing={4}>
                      <Grid item xs={12} sm={12}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            py: 1.5,
                            width: "100%",
                            // backgroundColor: "#f5f5f5",
                            fontWeight: "600",
                            fontSize: "15px",
                            display: "inline-block",
                            // color: "#60176F",
                            px: "14px",
                            mb: 0,
                          }}
                        >
                          Other Travelers Details
                        </Typography>

                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Full Name</TableCell>
                              <TableCell>DOB</TableCell>
                              <TableCell>Age</TableCell>
                              <TableCell>Relation</TableCell>
                              <TableCell>Gender</TableCell>
                              <TableCell>PAssport Number</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {proposalTravelInfo?.travellersId
                              ?.slice(1, proposalTravelInfo?.travelId?.length)
                              ?.map((item, idx) => {
                                return (
                                  <TableRow
                                    hover
                                    // sx={{ cursor: "pointer" }}
                                  >
                                    <TableCell>{item?.firstName + " " + item?.lastName}</TableCell>
                                    <TableCell>
                                      {isValid(parseISO(item?.dateOfBirth))
                                        ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                        : "Start date"}
                                    </TableCell>
                                    <TableCell>{item?.age}</TableCell>
                                    <TableCell>{item?.relation || "-"}</TableCell>
                                    <TableCell>{item?.gender || "-"}</TableCell>
                                    <TableCell>{item?.passportNumber || "-"}</TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Box>
              {proposalTravelInfo?.paymentId && (
                <Card sx={{ mb: 2, mt: 2 }}>
                  <Box sx={{ display: "inline-block", width: "100%" }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        width: "100%",
                        py: 1.5,
                        backgroundColor: "#f5f5f5",
                        fontWeight: "600",
                        fontSize: "18px",
                        display: "inline-block",
                        color: "#60176F",
                        px: "14px",
                      }}
                    >
                      Transactions
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        mb: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#60176F", mx: 2, my: 1 }}>
                        {" "}
                        Payments{" "}
                      </Typography>
                      <Scrollbar>
                        <Box sx={{ minWidth: 800 }}>
                          <Box sx={{ border: "1px solid #70707020", mx: 2, mb: 3 }}>
                            <Grid container sx={{ backgroundColor: "#70707020" }}>
                              <Grid item xs={1.5}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Amount</Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Status</Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Ref. No</Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>From</Typography>
                              </Grid>
                              <Grid item xs={1.5}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}>Date</Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <Typography sx={{ fontSize: 14, fontWeight: 600, p: 1 }}></Typography>
                              </Grid>
                            </Grid>
                            <Grid container alignItems={"cenyter"}>
                              <Grid item xs={1.5}>
                                <Typography sx={{ fontSize: 14, p: 1 }}>
                                  {formatNumber(proposalTravelInfo?.paymentId?.billAmount)}
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Box sx={{ p: 1 }}>
                                  <SeverityPill
                                    fontSize="10"
                                    color={
                                      proposalTravelInfo?.paymentId?.status == "SUCCESS" ||
                                      proposalTravelInfo?.paymentId?.status == "FAILED"
                                        ? "success"
                                        : "error"
                                    }
                                  >
                                    {proposalTravelInfo?.paymentId?.status == "SUCCESS" ||
                                    proposalTravelInfo?.paymentId?.status == "FAILED"
                                      ? "Success"
                                      : "Pending"}
                                  </SeverityPill>
                                  {proposalTravelInfo?.paymentId?.status != "SUCCESS" && (
                                    <IconButton
                                      onClick={() => copyToClipboard(proposalTravelInfo?.paymentId?.paymentLink)}
                                    >
                                      <LinkIcon fontSize="small" sx={{ color: "#707070" }} />
                                    </IconButton>
                                  )}
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography sx={{ fontSize: 14, p: 1 }}>
                                  {proposalTravelInfo?.paymentId?.orderRef}
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography sx={{ fontSize: 14, p: 1 }}>
                                  {proposalTravelInfo?.paymentId?.paymentGatewayName}
                                </Typography>
                              </Grid>
                              <Grid item xs={1.5}>
                                <Typography sx={{ fontSize: 14, p: 1 }}>
                                  {proposalTravelInfo?.paymentId?.createdAt
                                    ? format(parseISO(proposalTravelInfo?.paymentId?.createdAt), "dd/MM/yyyy")
                                    : ""}
                                </Typography>
                              </Grid>
                              {proposalTravelInfo?.transactionId && (
                                <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
                                  <IconButton
                                    onClick={() =>
                                      router.push(`/travel-insurance/transaction/${proposalTravelInfo?.transactionId}`)
                                    }
                                  >
                                    <ArrowRight fontSize="small" sx={{ color: "#707070" }} />
                                  </IconButton>
                                </Grid>
                              )}
                            </Grid>
                            <Divider />
                          </Box>
                        </Box>
                      </Scrollbar>
                    </Box>
                  </Box>
                </Card>
              )}

              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderBottom: "1px solid #E6E6E6",
                  mt: 3,
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      py: 1.5,
                      mb: 0,
                      fontWeight: "600",
                      fontSize: "18px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                    }}
                  >
                    Comments
                  </Typography>

                  <Box sx={{ display: "inline-block", mr: 2 }}>
                    {moduleAccess(user, "travelQuote.update") && (
                      <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                        Add a Comment
                      </Button>
                    )}
                  </Box>
                </Box>

                {travelProposalCommentListLoader ? (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                    {travelProposalCommentList && <TravelProposalCommentsTable items={travelProposalCommentList} />}
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  mb: 3,
                  mt: 3,
                  boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    py: 1.5,
                    width: "100%",
                    backgroundColor: "#f5f5f5",
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                    px: "14px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  Proposal History
                </Typography>
                <Box>
                  <ProposalHistoryTable items={proposalTravelInfo?.proposalHistory} />
                </Box>
              </Box>

              {selectedCheckboxes?.[0] && quotePayableDetails && (
                <Box sx={{ mb: 2 }}>
                  <TravelPlanPaybleDetails
                    quotePayableDetails={quotePayableDetails}
                    selectedCheckboxes={selectedCheckboxes}
                    policyFeeLoader={policyFeeLoader}
                  />
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="button"
                  disabled={!!isProposalPurchased || isDisabled}
                  variant="contained"
                  sx={{ minWidth: "140px" }}
                  onClick={() => ReGenerateHandler(travelProposalQuotationlist)}
                >
                  Re-generate
                </Button>
                {isProposalPurchased && (
                  <Button
                    type="button"
                    disabled={!!isPolicyGenerated}
                    variant="contained"
                    onClick={() => onClickOnConfirm({ paidBy: "user" })}
                    sx={{ minWidth: "140px" }}
                  >
                    Complete
                  </Button>
                )}
                {!isProposalPurchased && (
                  <>
                    <Button
                      type="button"
                      disabled={!!isPolicyGenerated}
                      variant="contained"
                      onClick={() => payByLinkHandler({ paidBy: "CRM - Direct to insurance company" })}
                      sx={{ minWidth: "140px" }}
                    >
                      Paid to the company
                    </Button>
                    <Button
                      type="button"
                      disabled={!!isPolicyGenerated}
                      variant="contained"
                      onClick={() => payByLinkHandler({ paidBy: "link" })}
                      sx={{ minWidth: "140px" }}
                    >
                      Pay by link
                    </Button>
                    <Button
                      type="button"
                      disabled={!!isPolicyGenerated}
                      variant="contained"
                      onClick={() => payByLinkHandler({ paidBy: "CRM - Bank transfer" })}
                      sx={{ minWidth: "140px" }}
                    >
                      Pay by bank transfer
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={true} />
              </Box>
            </>
          )}
        </Box>
      </Container>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              position: "absolute",
              top: "-16px",
              right: "-16px",
            }}
          >
            <Box onClick={handleCloseVerifymodal} sx={{ display: "inline-block", mt: 0.6, cursor: "pointer" }}>
              <CrossSvg color="#60176F" />
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}>
            Select Payment option to generate payment link
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card
                  onClick={onPaidBylinkgenerate}
                  sx={{
                    p: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "15",
                    },
                  }}
                >
                  <Image src={NetworkLogo} alt="NetworkLogo" width={120} height={80} />
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ModalComp>
      <ModalComp
        open={transactionRefModalOpen}
        handleClose={HandleTransactionRefModalClose}
        widths={{ xs: "95%", sm: 500 }}
      >
        <TransactionInfoModal
          HandleTransactionRefModalClose={HandleTransactionRefModalClose}
          handleSubmitRefNo={handleSubmitRefNo}
          paidBy={paidByMethod}
          requireArray={requireArray}
          totalAmount={quotePayableDetails?.totalPrice}
        />
      </ModalComp>
      <ModalComp
        open={paymentLinkShareModal}
        handleClose={() => setPaymentLinkShareModal(false)}
        widths={{ xs: "95%", sm: 500 }}
      >
        <SharePaymentLinkModal
          handleClose={() => setPaymentLinkShareModal(false)}
          paymentLink={paymentLinkOnfo?.paymentLink}
          setLoading={setLoading}
          credential={customerQuotationDetails}
          email={proposalTravelInfo?.travellersId?.[0]?.contact?.email || proposalTravelInfo?.userId?.email}
          mobileNumber={
            proposalTravelInfo?.travellersId?.[0]?.contact?.mobileNumber || proposalTravelInfo?.userId?.mobileNumber
          }
        />
      </ModalComp>
      <ModalComp open={open} handleClose={handleClose} widths={{ xs: "95%", sm: 500 }}>
        <AddCommentModal handleClose={handleClose} id={proposalId} flag={"travel-proposal"} />
      </ModalComp>

      {/* Desination Deatils Edit Modal */}
      <ModalComp
        open={editDesinationDetails}
        handleClose={HandleDesinationModalClose}
        widths={{ xs: "90%", sm: "95%", md: 700 }}
      >
        <EditDesinationDetails
          HandleDesinationModalClose={HandleDesinationModalClose}
          setLoading={setLoading}
          isLoading={isLoading}
          proposalTravelInfo={proposalTravelInfo}
          fetchSummary={getTravelInfoByPrposalIdHandler}
        />
      </ModalComp>

      {/* Personal Deatils Edit Modal */}
      <ModalComp
        open={editPeronsaldetails}
        handleClose={HandlePersonalModalClose}
        widths={{ xs: "90%", sm: "95%", md: 700 }}
      >
        <TravelPersonalEditForm
          HandlePersonalModalClose={HandlePersonalModalClose}
          setLoading={setLoading}
          isLoading={isLoading}
          proposalTravelInfo={proposalTravelInfo?.travellersId}
          fetchSummary={getTravelInfoByPrposalIdHandler}
        />
      </ModalComp>

      <ModalComp
        open={commentModal}
        handleClose={() => setCommentModal(false)}
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
          <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
            <CrossSvg
              sx={{
                cursor: "pointer",
                fontSize: "20px",
                "&:hover": {
                  color: "#60176F",
                },
              }}
              onClick={() => setCommentModal(false)}
            />
          </Box>
          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              mt: 1,
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  py: 1.5,
                  mb: 0,
                  fontWeight: "600",
                  fontSize: "18px",
                  display: "inline-block",
                  color: "#60176F",
                  px: "14px",
                }}
              >
                Comments
              </Typography>

              <Box sx={{ display: "inline-block", mr: 2 }}>
                {moduleAccess(user, "travelQuote.update") && (
                  <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                    Add a Comment
                  </Button>
                )}
              </Box>
            </Box>

            {travelProposalCommentListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                {travelProposalCommentList && <TravelProposalCommentsTable items={travelProposalCommentList} />}
              </Box>
            )}
          </Box>
        </Box>
      </ModalComp>
    </Box>
  );
};

TravelInsuranceDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelInsuranceDetails;
