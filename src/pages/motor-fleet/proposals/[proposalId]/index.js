import { Box, Container, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextLink from "next/link";
import { Link, Typography, CircularProgress, Button, Backdrop, Grid, Card } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import ModalComp from "src/components/modalComp";
import { CrossSvg } from "src/Icons/CrossSvg";
import AddCommentModal from "src/sections/customer/CustomerComments/add-comment-modal";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import MotorFleetProposalCommentsTable from "src/sections/motor-fleet/Proposals/motor-fleet-proposal-comment-table";
import { getAllCarCompanies } from "src/sections/companies/action/companyAcrion";
import MotorFleetCarDetails from "src/sections/motor-fleet/Proposals/motor-fleet-car-details";
import MotorFleetCompanyDetails from "src/sections/motor-fleet/Proposals/motor-fleet-company-details";
import MotorFleetInsuranceCompaniesDetails from "src/sections/motor-fleet/Proposals/motor-fleet-insurnace-company";
import {
  checkoutMotorPayment,
  getInsuranceCompanyList,
  getfleetdetails,
  motorFleetInsurancePayByLink,
  getMotorFleetProposalCommentsList,
  getMotorFleetProposalsStatus,
  getAllMotorFleetList,
  sendEmailToInsuranceComp,
  motorFleetPurchaseConfirm,
  getMotorFleetQuotesPaybles,
  getMotorFleetComparePlans,
} from "src/sections/motor-fleet/Proposals/Action/motorFleetProposalsAction";
import MotorTradeLicensedetails from "src/sections/motor-fleet/Proposals/motor-fleet-trade-licencedetails";
import MotorFleetPlanPaybleDetails from "src/sections/motor-fleet/Proposals/motor-fleet-plan-payble-details";
import TransactionInfoModal from "src/sections/Proposals/transaction-Info-modal";
import Image from "next/image";
import NetworkLogo from "../../../../../public/assets/logos/NetworkLogo.svg";
import { setMotorFleetListPagination } from "src/sections/motor-fleet/Proposals/Reducer/motorFleetProposalsSlice";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";

const MotorFleetDetails = () => {
  const dispatch = useDispatch();
  const {
    motorFleetInfo,
    motorFleetInfoLoader,
    motorFleetProposalCommentListLoader,
    motorFleetProposalCommentList,
    fleetDetail,
    fleetCompanyList,
    motorFleetProposalInfo,
    motorFleetProposalInfoLoader,
    pagination,
    motorFleetPagination,
    motorFetchExellList,
    policyFeeLoader,
    quotePayableDetails,
  } = useSelector((state) => state.motorFleetProposals);
  const router = useRouter();
  const { proposalId } = router.query;
  const [commentModal, setCommentModal] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [paidByMethod, setPaidByMethod] = useState("");
  const [isProposalPurchased, setIsProposalPurchased] = useState(false);
  const [isPolicyGenerated, setIsPolicyGenerated] = useState(false);
  const [policyIssued, setPolicyIssued] = useState(false);
  const [options, setOptions] = useState([]);
  const [allData, setAllData] = useState([]);
  const [value, setValue] = useState("");
  const [companyArray, setCompanyArray] = useState([]);
  const [disableCompanyAdd, setDisableCompanyAdd] = useState(false);
  const [requireArray, setrequireArray] = useState([]);
  const [transactionRefModalOpen, setTransactionRefModalOpen] = useState(false);
  const HandleTransactionRefModalClose = () => setTransactionRefModalOpen(false);
  const initialized = useRef(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);

  const handleCheckboxChange = (value) => {
    const match = selectedCheckboxes?.find((item) => item?._id === value?._id);
    if (match) {
      // Checkbox already selected, remove it from the selected checkboxes
      setSelectedCheckboxes(selectedCheckboxes.filter((item) => item?._id !== value?._id));
    } else {
      // Limit the selection to four checkboxes
      setSelectedCheckboxes([...selectedCheckboxes, value]);
    }
  };

  // Quote Payable details When only one Check box is selcted.
  useEffect(() => {
    if (selectedCheckboxes && selectedCheckboxes?.length == 1) {
      dispatch(getMotorFleetQuotesPaybles(selectedCheckboxes?.[0]?._id));
    }
  }, [selectedCheckboxes?.length]);

  useEffect(() => {
    if (!!fleetDetail) {
      let pPurchased = false;
      let pGenerated = false;
      let pIssued = false;
      if (fleetDetail?.paymentId?.status === "SUCCESS") {
        setIsProposalPurchased(true);
        pPurchased = true;
      }
      if (fleetDetail?.policyId) {
        setIsPolicyGenerated(true);
        pGenerated = true;
      }
      if (fleetDetail?.policyId?.status === "Active") {
        setPolicyIssued(true);
        pIssued = true;
      }

      if (!pPurchased) {
        setIsProposalPurchased(false);
      }
      if (!pGenerated) {
        setIsPolicyGenerated(false);
      }
      if (!pIssued) {
        setPolicyIssued(false);
      }
    }
  }, [fleetDetail, proposalId]);

  // Fetch all companies
  const getCompniesNameList = () => {
    dispatch(getAllCarCompanies({ key: "motor", search: "" }))
      .unwrap()
      .then((res) => {
        setAllData(res);
        const arr = [];
        const filterRes = res.filter((r) => r.companyPortal);
        filterRes.map((i) => {
          arr.push(i?.companyName);
        });
        setOptions(arr);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // Fetch all motor fleets
  const getAllMotorFetch = (id) => {
    dispatch(getAllMotorFleetList({ id: id }))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
        setIsLoading(false);
      });
  };

  // Fetch fleet details
  const getFleetDetailsList = () => {
    setIsLoading(true);
    dispatch(getfleetdetails({ id: proposalId }))
      .unwrap()
      .then((res) => {
        dispatch(getInsuranceCompanyList(res?.data?._id))
          .unwrap()
          .then((res) => {
            setCompanyArray(res?.data);
          })
          .catch((err) => {
            toast.error(err);
          });
        setIsLoading(false);
        getAllMotorFetch(res?.data?._id);
      })
      .catch((err) => {
        console.log(err, "err");
        setIsLoading(false);
      });
  };

  // Fetch fleet comments
  const motorFleetCommentlisthandler = () => {
    dispatch(getMotorFleetProposalCommentsList(proposalId))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        toast.error(err);
        console.log(err, "err");
      });
  };

  // Fetch fleet proposals status
  const MotorFleetProposalsStatus = () => {
    dispatch(getMotorFleetProposalsStatus({ id: proposalId }))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  // Fetch all motor fleets
  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    getCompniesNameList();
    getFleetDetailsList();
    motorFleetCommentlisthandler();
    MotorFleetProposalsStatus();
  }, []);

  const fetchProposalSummary = (changed) => {};

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    fetchProposalSummary(true);
  }, [motorFleetInfo]);

  const [carListUploadFile, setCarListUploadFile] = useState(null);
  const [uploadCarListFile, setCarListFile] = useState();

  // Upload car list
  const handleCarListUpload = async ([file]) => {
    setCarListUploadFile(file);
    setCarListFile({
      id: proposalId,
      filename: file?.name,
      size: file?.size,
    });
  };

  // Pay by link
  const payByLinkHandler = (paidBy) => {
    if (!motorFetchExellList?.length > 0) {
      toast("Please upload car list!", {
        type: "error",
      });
      return;
    }
    if (!fleetDetail?.tradeLicenseExpiryDate || !fleetDetail?.tradeLicenseNo || !fleetDetail?.tradeLicense) {
      toast("fill all the required details", {
        type: "error",
      });
      const element = document.getElementById("tradeLicenseDetails");
      element.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }
    if (selectedCheckboxes?.length === 0) {
      toast("Please select at list one insurance company!", {
        type: "error",
      });
      return;
    }
    if (selectedCheckboxes?.length > 1) {
      toast("Please select only one company", {
        type: "error",
      });
      return;
    }
    if (!selectedCheckboxes?.[0]?.price) {
      toast("Please enter company premium", {
        type: "error",
      });
      return;
    }
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
  };

  // Confirm payment
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
      dispatch(motorFleetPurchaseConfirm({ id: selectedCheckboxes[0]?._id, data: { paidBy: paidBy } }))
        .then((res) => {
          if (res?.error?.message) {
            toast.error(res.payload);
          } else {
            toast.success("Payment confirmed successfully!");
            // fetchProposalSummary(true);
            dispatch(getfleetdetails({ id: fleetDetail?.proposalId }));
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

  // Submit transaction ref
  const handleSubmitRefNo = (data) => {
    setLoading(false);
    dispatch(
      motorFleetInsurancePayByLink({
        id: selectedCheckboxes?.[0]?._id,
        data: data,
      })
    )
      .unwrap()
      .then((res) => {
        getFleetDetailsList();
        if (res?.error?.message) {
          toast.error(res.payload);
        } else {
          toast.success("Payment confirmed successfully!");
          HandleTransactionRefModalClose();
        }
        setLoading(true);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(true);
      });
  };

  // Select plan
  const onPlanSelectHandler = (value, id) => {
    // if (selectedPlans?.length >= 4 && !selectedPlans?.includes(id)) {
    //   toast.error("You can select 4 plans maximum!");
    //   return;
    // }
    let arr = selectedPlans;
    if (selectedPlans?.includes(id)) {
      let filterArray = arr?.filter((i) => i !== id);
      setSelectedPlans(filterArray);
    } else {
      arr = [...arr, id];
      setSelectedPlans(arr);
    }
  };

  // Pay by link generate
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(checkoutMotorPayment({ quoteId: selectedCheckboxes?.[0]?._id, paidBy: "CRM - Link" }))
      .unwrap()
      .then((data) => {
        handleCloseVerifymodal();
        setPaymentLinkInfo(data);
        setPaymentLinkShareModal(true);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
        toast(err, {
          type: "error",
        });
        setLoading(true);
        handleCloseVerifymodal();
      });
  };

  // Pagination
  const handlePageChange = useCallback(
    (event, value) => {
      // console.log(value, pagination, "llll");

      dispatch(
        setMotorFleetListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );
      dispatch(
        getAllMotorFleetList({
          id: fleetDetail?._id,
          page: value + 1,
          size: pagination?.size,
        })
      );
    },
    [pagination?.size, fleetDetail?._id]
  );

  // Pagination - Rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setMotorFleetListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getAllMotorFleetList({
          id: fleetDetail?._id,
          page: 1,
          size: event.target.value,
        })
      );
    },
    [pagination?.page, fleetDetail?._id]
  );

  // Send email
  const handleSendEmailToInsuranceCompanies = () => {
    if (motorFetchExellList?.length > 0) {
      const arr = [];
      selectedCheckboxes?.map((i) => {
        arr.push(i?.company?._id);
      });
      dispatch(sendEmailToInsuranceComp({ companies: arr, id: fleetDetail?._id }))
        .unwrap()
        .then(() => {
          toast.success("Successfully sent email!");
          dispatch(getfleetdetails({ id: fleetDetail?.proposalId }));
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    } else {
      toast.error("Please upload car list");
    }
  };

  // Compare quotes API function
  const onCompareQuoteHandler = () => {
    // Conditions to met for compare quotes
    if (selectedCheckboxes?.length <= 1) {
      toast.error("Please select at least 2 quotations to compare!");
      return;
    }
    if (selectedCheckboxes?.length > 4) {
      toast.error("You can compare maximum 4 quotations!");
      return;
    }
    // API goes here ...
    const array = [];
    selectedCheckboxes?.map((i) => {
      if (i) {
        array?.push(i?._id);
      }
    });
    setLoading(false);

    // API - getMotorFleetComparePlans function
    dispatch(getMotorFleetComparePlans({ fleetQuoteIds: array }))
      .then((res) => {
        router
          .push("/motor-fleet/quotations/compare-plans")
          .then(() => {
            setLoading(true);
          })
          .catch(() => {
            setLoading(true);
          });
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setLoading(true);
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
      {!loading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={!loading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      {isLoading ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          <Container maxWidth={false}>
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href="/motor-fleet/proposals" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Motor Fleet insurance proposals</Typography>
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
                    mt: 2,
                  }}
                >
                  <Typography variant="h5">Motor Fleet Proposal Details</Typography>
                </Box>
              </Stack>
              {fleetDetail?.policyId && (
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
                    onClick={() => router.push(`/motor-fleet/policies/${fleetDetail?.policyId?._id}`)}
                  >
                    View Policy
                  </Button>
                </Box>
              )}
              {!motorFleetInfoLoader ? (
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                    <Box sx={{ display: "inline-block", width: "100%" }} id="tradeLicenseDetails">
                      {!motorFleetProposalInfoLoader && (
                        <ProposalStatusSession
                          proposalId={proposalId}
                          items={motorFleetProposalInfo?.proposalStatus}
                          fetchProposalSummary={() => fetchProposalSummary(false)}
                          isPolicyGenerated={!!fleetDetail?.policyId}
                          // policyIssued={policyIssued}
                          flag={"MotorFleet"}
                        />
                      )}
                    </Box>

                    {/* // Company details */}
                    <MotorFleetCompanyDetails fleetDetail={fleetDetail} />

                    {/* Trade Licence Details */}
                    <MotorTradeLicensedetails fleetDetail={fleetDetail} />

                    {/* Car Details */}
                    <MotorFleetCarDetails
                      count={motorFleetPagination?.totalItems}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={pagination?.page - 1}
                      rowsPerPage={pagination?.size}
                      fleetDetail={fleetDetail}
                      handleCarListUpload={handleCarListUpload}
                      uploadCarListFile={uploadCarListFile}
                      companyArray={fleetCompanyList}
                      options={options}
                      value={value}
                      disableCompanyAdd={disableCompanyAdd}
                    />

                    {/* insurance company details */}
                    <MotorFleetInsuranceCompaniesDetails
                      fleetDetail={fleetDetail}
                      onPlanSelectHandler={onPlanSelectHandler}
                      checkSelect={selectedCheckboxes}
                      setCompanyArray={setCompanyArray}
                      companyArray={fleetCompanyList}
                      handleCheckboxChange={handleCheckboxChange}
                      options={options}
                      setValue={setValue}
                      value={value}
                      disableCompanyAdd={disableCompanyAdd}
                      companyData={allData}
                      onCompareQuoteHandler={onCompareQuoteHandler}
                    />
                  </Box>

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
                        {/* {moduleAccess(user, "motorFleetQuote.update") && ( */}
                        <Button sx={{ fontSize: 12 }} type="button" variant="contained" onClick={() => setOpen(true)}>
                          Add a Comment
                        </Button>
                        {/* )} */}
                      </Box>
                    </Box>

                    {motorFleetProposalCommentListLoader ? (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                        {motorFleetProposalCommentList && (
                          <MotorFleetProposalCommentsTable items={motorFleetProposalCommentList} />
                        )}
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
                      <ProposalHistoryTable items={motorFleetProposalInfo?.proposalHistory} />
                    </Box>
                  </Box>
                  {selectedCheckboxes?.[0] && !!quotePayableDetails && (
                    <Box sx={{ mb: 2 }}>
                      <MotorFleetPlanPaybleDetails
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
                    {!isProposalPurchased && fleetDetail?.mailSent === true && (
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
                    {!fleetDetail?.mailSent && (
                      <Button
                        type="button"
                        variant="contained"
                        disabled={fleetDetail?.mailSent === true}
                        sx={{ fontSize: 14 }}
                        onClick={() => {
                          if (selectedCheckboxes?.length > 0) {
                            handleSendEmailToInsuranceCompanies();
                            setDisableCompanyAdd(true);
                          } else {
                            toast.error("Please add / Select at lease one company!");
                          }
                        }}
                      >
                        Send an email to Insurance companies
                      </Button>
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
                    <CircularProgress />
                  </Box>
                </>
              )}
            </Box>
          </Container>
          <ModalComp open={open} handleClose={handleClose} widths={{ xs: "95%", sm: 500 }}>
            <AddCommentModal handleClose={handleClose} id={proposalId} flag={"motorfleet-proposal"} />
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
                    {/* {moduleAccess(user, "motorFleetQuote.update") && ( */}
                    <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                      Add a Comment
                    </Button>
                    {/* )} */}
                  </Box>
                </Box>

                {motorFleetProposalCommentListLoader ? (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                    {motorFleetProposalCommentList && (
                      <motorFleetProposalCommentsTable items={motorFleetProposalCommentList} />
                    )}
                  </Box>
                )}
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
              totalAmount={selectedCheckboxes?.[0]?.price * 1.05}
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
              credential={fleetDetail}
              email={fleetDetail?.email || fleetDetail?.userId?.email}
              mobileNumber={fleetDetail?.mobileNumber || fleetDetail?.userId?.mobileNumber}
            />
          </ModalComp>
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
                  {/* <Grid item xs={6}>
                <Card
                  onClick={onPayByTamara}
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
                  <Image src={TamaraLogo} alt="TamaraLogo" width={120} height={80} />
                </Card>
              </Grid> */}
                </Grid>
              </Box>
            </Box>
          </ModalComp>
        </>
      )}
    </Box>
  );
};

MotorFleetDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MotorFleetDetails;
