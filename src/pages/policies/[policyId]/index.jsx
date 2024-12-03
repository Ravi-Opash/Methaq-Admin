import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Tab,
  Tabs,
  Typography,
  styled,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/router";
import NextImage from "next/image";
import { useSelector, useDispatch } from "react-redux";
import {
  getCustomerAddOnsListByCustomerId,
  getCustomerCommentsListByCustomerId,
  getCustomerHistoryListByCustomerId,
  getCustomerPolicyDetailById,
  getCustomerTransactionsListByCustomerId,
} from "src/sections/customer/action/customerAction";
import { toast } from "react-toastify";
import CustomerPolicyDetails from "src/sections/customer/customer-policy-details";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { format, parseISO, isValid } from "date-fns";
import {
  clearCustomerPolicyDetails,
  setCustomerAddOnsListCustomPagination,
  setCustomerCommentListCustomPagination,
  setCustomerHistoryListCustomPagination,
  setCustomerTransactionsListCustomPagination,
} from "src/sections/customer/reducer/customerSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { debounce } from "src/utils/debounce-search";
import { formatNumber } from "src/utils/formatNumber";
import { getCarPolicyPdf } from "src/sections/Policies/action/policiesAction";
import { SeverityPill } from "src/components/severity-pill";
import AnimationLoader from "src/components/amimated-loader";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { cancelPolicyRequest } from "src/sections/cancel-request/action/cancelRequestAction";

const Img = styled(NextImage)(({ theme }) => ({
  height: "max-content !important",
}));

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Coverages", value: "coverages" },
];

const PolicyDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { policyId } = router.query;

  const {
    customerPolicyDetails,
    customerPolicyDetailsLoader,
    customerTransactionsListCustomPagination,
    customerHistoryListCustomPagination,
    customerAddOnsListCustomPagination,
    customerCommentListCustomPagination,
  } = useSelector((state) => state.customer);

  const [currentTab, setCurrentTab] = useState("overview");

  const initializedPolicy = useRef(false);
  const getCustomerPolicyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedPolicy.current) {
      return;
    }
    initializedPolicy.current = true;
    try {
      dispatch(getCustomerPolicyDetailById(policyId));
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  // customer transaction list start
  const initializedTransactions = useRef(false);
  const getCustomerTransactionsListHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedTransactions.current) {
      return;
    }
    initializedTransactions.current = true;

    try {
      dispatch(
        getCustomerTransactionsListByCustomerId({
          page: customerTransactionsListCustomPagination?.page,
          size: customerTransactionsListCustomPagination?.size,
          id: customerPolicyDetails?.quote?.userId,
          policyId,
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

  // Pagination
  const handleTransactionsListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setCustomerTransactionsListCustomPagination({
          page: value + 1,
          size: customerTransactionsListCustomPagination?.size,
        })
      );
      dispatch(
        getCustomerTransactionsListByCustomerId({
          page: value + 1,
          size: customerTransactionsListCustomPagination?.size,
          id: customerPolicyDetails?.quote?.userId,
          policyId,
        })
      );
    },
    [customerTransactionsListCustomPagination?.size, customerPolicyDetails]
  );

  // Pagination rows per page
  const handleTransactionsListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setCustomerTransactionsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getCustomerTransactionsListByCustomerId({
          page: 1,
          size: event.target.value,
          id: customerPolicyDetails?.quote?.userId,
          policyId,
        })
      );
    },
    [customerTransactionsListCustomPagination?.page, customerPolicyDetails]
  );
  // customer transaction list end

  // customer history list start
  const initializedHistory = useRef(false);
  const getCustomerHistoryListHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedHistory.current) {
      return;
    }
    initializedHistory.current = true;

    try {
      dispatch(
        getCustomerHistoryListByCustomerId({
          page: customerHistoryListCustomPagination?.page,
          size: customerHistoryListCustomPagination?.size,
          id: customerPolicyDetails?.quote?.userId,
          policyId,
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

  // Pagination List page change
  const handleHistoryListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setCustomerHistoryListCustomPagination({
          page: value + 1,
          size: customerHistoryListCustomPagination?.size,
        })
      );
      dispatch(
        getCustomerHistoryListByCustomerId({
          page: value + 1,
          size: customerHistoryListCustomPagination?.size,
          id: customerPolicyDetails?.quote?.userId,
          policyId,
        })
      );
    },
    [customerHistoryListCustomPagination?.size, customerPolicyDetails]
  );

  // Pagination rows per page
  const handleHistoryListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setCustomerHistoryListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getCustomerHistoryListByCustomerId({
          page: 1,
          size: event.target.value,
          id: customerPolicyDetails?.quote?.userId,
          policyId,
        })
      );
    },
    [customerHistoryListCustomPagination?.page, customerPolicyDetails]
  );
  // customer history list start

  // customer Add ons list start
  const initializedAddons = useRef(false);
  const getCustomerAddOnsListHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedAddons.current) {
      return;
    }
    initializedAddons.current = true;

    try {
      dispatch(
        getCustomerAddOnsListByCustomerId({
          page: customerAddOnsListCustomPagination?.page,
          size: customerAddOnsListCustomPagination?.size,
          id: policyId,
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

  // Pagination List page change
  const handleAddOnsListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setCustomerAddOnsListCustomPagination({
          page: value + 1,
          size: customerAddOnsListCustomPagination?.size,
        })
      );
      dispatch(
        getCustomerAddOnsListByCustomerId({
          page: value + 1,
          size: customerAddOnsListCustomPagination?.size,
          id: policyId,
        })
      );
    },
    [customerAddOnsListCustomPagination?.size, policyId]
  );

  // Pagination rows per page
  const handleAddOnsListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setCustomerAddOnsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getCustomerAddOnsListByCustomerId({
          page: 1,
          size: event.target.value,
          id: policyId,
        })
      );
    },
    [customerAddOnsListCustomPagination?.page, policyId]
  );
  // customer Add ons list end

  // customer comment list start
  const initializedComment = useRef(false);
  const getCustomerCommentListHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedComment.current) {
      return;
    }
    initializedComment.current = true;

    try {
      dispatch(
        getCustomerCommentsListByCustomerId({
          page: customerCommentListCustomPagination?.page,
          size: customerCommentListCustomPagination?.size,
          id: policyId,
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

  // Pagination List page change
  const handleCommentListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setCustomerCommentListCustomPagination({
          page: value + 1,
          size: customerCommentListCustomPagination?.size,
        })
      );
      dispatch(
        getCustomerCommentsListByCustomerId({
          page: value + 1,
          size: customerCommentListCustomPagination?.size,
          id: policyId,
        })
      );
    },
    [customerCommentListCustomPagination?.size, policyId]
  );

  // Pagination rows per page
  const handleCommentListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setCustomerCommentListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getCustomerCommentsListByCustomerId({
          page: 1,
          size: event.target.value,
          id: policyId,
        })
      );
    },
    [customerCommentListCustomPagination?.page, policyId]
  );
  // customer comment list end

  useEffect(
    () => {
      if (customerPolicyDetails) {
        getCustomerTransactionsListHandler();
        getCustomerHistoryListHandler();
      }

      return () => {
        dispatch(
          setCustomerTransactionsListCustomPagination({
            page: 1,
            size: 10,
          })
        );

        dispatch(
          setCustomerHistoryListCustomPagination({
            page: 1,
            size: 10,
          })
        );
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerPolicyDetails]
  );

  // customer policy details
  useEffect(
    () => {
      getCustomerPolicyDetailsHandler();
      getCustomerAddOnsListHandler();
      getCustomerCommentListHandler();

      return () => {
        dispatch(
          setCustomerAddOnsListCustomPagination({
            page: 1,
            size: 10,
          })
        );

        dispatch(clearCustomerPolicyDetails());

        dispatch(
          setCustomerCommentListCustomPagination({
            page: 1,
            size: 10,
          })
        );
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Tabs
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const [isActionHide, setIsActionHide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // screenshot
  const captureScreenshot = async () => {
    const element = document.getElementById("policy_details_capture");

    const doc = new jsPDF({
      unit: "px",
      format: "a4",
    });

    const logo = document.querySelector(`#app-logo`);
    const logoCanvas = await html2canvas(logo);
    const logoimageData = logoCanvas.toDataURL("image/png");
    const logoimgProps = doc.getImageProperties(logoimageData);
    // console.log(logoimgProps.width / 2 + 5);
    doc.addImage(
      logoimageData,
      "PNG",
      10,
      10,
      logoimgProps.width / 2 + 10,
      logoimgProps.height / 2 - 10,
      "Logo",
      "FAST",
      0,
      {
        compress: true,
      }
    );

    // Replace 'divId' with the ID of the div you want to capture

    html2canvas(element, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("divScreenshot.pdf");
        setIsActionHide(false);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsActionHide(false);
        setIsLoading(false);
      });
  };

  // Helper function to download a PDF file from a URL
  const onPdfDownload = (url) => {
    const filename = url.split("/");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename[filename.length - 1]);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // console.log(customerPolicyDetails, "customerPolicyDetails");

  const debounceHandler = debounce(captureScreenshot, 3000);

  // Helper function to download a PDF file from a URL
  const onPolicyDownload = () => {
    // if (customerPolicyDetails?.companyResponse?.Documents?.[0]?.[0]?.Schdule) {
    //   let pdfUrl =
    //     customerPolicyDetails?.companyResponse?.Documents?.[0]?.[0]?.Schdule;
    //   const link = document.createElement("a");
    //   link.href = pdfUrl;
    //   link.setAttribute("target", "_blank");
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    // } else {
    //   return;
    // }
    if (customerPolicyDetails?.quote?.isMatrix) {
      if (customerPolicyDetails?.policyFile) {
        // console.log(customerPolicyDetails?.policyFile, "ele");
        onPdfDownload(baseURL + "/" + customerPolicyDetails?.policyFile?.path);
      } else {
        toast.error("Please Upload policy first");
      }
    } else {
      setIsLoading(true);
      dispatch(getCarPolicyPdf({ id: policyId }))
        .unwrap()
        .then((res) => {
          if (!res?.data) {
            setIsLoading(false);
            toast.error("No pdf link available");
            return;
          }
          let pdfUrl = baseURL + res?.data;

          if (res?.data?.startsWith("http")) {
            pdfUrl = res?.data;
          }
          // console.log(pdfUrl);
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          link.remove();
          setIsLoading(false);
        })
        .catch((err) => {
          toast?.error(err);
          setIsLoading(false);
        });
    }
  };

  // copy to clipboard
  const copyTextHandler = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copy To Clipboard", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      {isLoading && (
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
        <Container maxWidth={false}>
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              <Box onClick={() => router.back()}>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Back</Typography>
                </Link>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "inline-block", width: "100%" }} id="policy_details_capture">
            {customerPolicyDetailsLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={customerPolicyDetailsLoader} />
              </Box>
            ) : (
              <>
                {customerPolicyDetails && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      m: "auto",
                      border: "1px solid #E6E6E6",
                      backgroundColor: "#FFF",
                      borderRadius: "10px",
                      opacity: 1,
                      p: 2,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexFlow: "column",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "600",
                            color: "#60176F",
                            fontSize: {
                              md: "24px",
                              sm: "14px",
                              xs: "12px",
                            },
                          }}
                        >
                          {`${customerPolicyDetails?.quoteId?.company?.companyName}` || "-"}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: { xs: "start", lg: "center" },
                            flexDirection: { xs: "column", lg: "row" },
                            gap: 2,
                            mb: 1.5,
                            width: "100%",
                          }}
                        >
                          <Breadcrumbs separator="|" aria-label="breadcrumb">
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  color: "#00000",
                                  fontWeight: "400",
                                  textTransform: "capitalize",
                                  fontSize: {
                                    md: "14px",
                                    sm: "12px",
                                    xs: "12px",
                                  },
                                }}
                              >
                                Proposals Number:
                              </Typography>
                              <Chip
                                onClick={() => router.push(`/proposals/${customerPolicyDetails?.quote?.proposalId}`)}
                                label={customerPolicyDetails?.quote?.proposalId || "-"}
                                size="small"
                                sx={{
                                  background: "#60176f2e",
                                }}
                              />
                              <ContentCopyIcon
                                onClick={() => copyTextHandler(customerPolicyDetails?.quote?.proposalId)}
                                sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                              />
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  color: "#00000",
                                  fontWeight: "400",
                                  textTransform: "capitalize",
                                  fontSize: {
                                    md: "14px",
                                    sm: "12px",
                                    xs: "12px",
                                  },
                                }}
                              >
                                Policy Number:
                              </Typography>
                              <Chip
                                label={customerPolicyDetails?.policyNumber || "-"}
                                size="small"
                                sx={{ background: "#60176f2e" }}
                              />
                              <ContentCopyIcon
                                onClick={() => copyTextHandler(customerPolicyDetails?.policyNumber)}
                                sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                              />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  color: "#00000",
                                  fontWeight: "400",
                                  textTransform: "capitalize",
                                  fontSize: {
                                    md: "14px",
                                    sm: "12px",
                                    xs: "12px",
                                  },
                                }}
                              >
                                Company Policy Number:
                              </Typography>
                              <Chip
                                label={customerPolicyDetails?.companyPolicyNumber || "-"}
                                size="small"
                                sx={{ background: "#60176f2e" }}
                              />
                              <ContentCopyIcon
                                onClick={() => copyTextHandler(customerPolicyDetails?.companyPolicyNumber)}
                                sx={{ fontSize: 20, cursor: "pointer", color: "#707070" }}
                              />
                            </Box>
                          </Breadcrumbs>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={9}>
                            <Box sx={{ display: "flex", flexFlow: "column" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mb: 1,
                                  color: "#707070",
                                  fontWeight: "400",
                                  textTransform: "capitalize",
                                  fontSize: {
                                    md: "18px",
                                    sm: "14px",
                                    xs: "12px",
                                  },
                                }}
                              >
                                {customerPolicyDetails?.quoteId?.insuranceType == "thirdparty"
                                  ? "Third Party"
                                  : customerPolicyDetails?.quoteId?.insuranceType
                                  ? "comprehensive"
                                  : "Comprehensive"}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mb: 1,
                                  fontWeight: "600",
                                  fontSize: {
                                    md: "18px",
                                    sm: "14px",
                                    xs: "12px",
                                  },
                                }}
                              >
                                {`${customerPolicyDetails?.carId?.make} ${customerPolicyDetails?.carId?.model}` ||
                                  "Car Name"}
                              </Typography>

                              <Box
                                sx={{
                                  display: "inline-block",
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    mb: 1,
                                    fontWeight: "400",
                                    fontSize: "12px",
                                    display: "inline-block",
                                    px: 2,
                                    py: 0.5,
                                    background: "#60176f2e",
                                  }}
                                >
                                  Car no
                                </Typography>
                              </Box>

                              <Grid container spacing={2} my={2}>
                                <Grid item xs={6}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexFlow: "column",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        fontWeight: "400",
                                        fontSize: "14px",
                                        display: "inline-block",
                                        color: "#707070",
                                      }}
                                    >
                                      Start date
                                    </Typography>

                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "600",
                                        fontSize: "16px",
                                        display: "inline-block",
                                      }}
                                    >
                                      {customerPolicyDetails?.response?.PolicyEffectiveDate &&
                                      isValid(parseISO(customerPolicyDetails?.response?.PolicyEffectiveDate))
                                        ? format(
                                            parseISO(customerPolicyDetails?.response?.PolicyEffectiveDate),
                                            "dd-MM-yyyy"
                                          )
                                        : "Start date"}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={6}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexFlow: "column",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        fontWeight: "400",
                                        fontSize: "14px",
                                        display: "inline-block",
                                        color: "#707070",
                                      }}
                                    >
                                      End date
                                    </Typography>

                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "600",
                                        fontSize: "16px",
                                        display: "inline-block",
                                      }}
                                    >
                                      {customerPolicyDetails?.response?.PolicyExpiryDate &&
                                      isValid(parseISO(customerPolicyDetails?.response?.PolicyExpiryDate))
                                        ? format(
                                            parseISO(customerPolicyDetails?.response?.PolicyExpiryDate),
                                            "dd-MM-yyyy"
                                          )
                                        : "End date"}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>

                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexFlow: "column",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        fontWeight: "400",
                                        fontSize: "14px",
                                        display: "inline-block",
                                        color: "#707070",
                                      }}
                                    >
                                      Policy holder
                                    </Typography>

                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "600",
                                        fontSize: "16px",
                                        display: "inline-block",
                                      }}
                                    >
                                      {customerPolicyDetails?.userId?.fullName || "Policy holder name"}
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={6}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexFlow: "column",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        fontWeight: "400",
                                        fontSize: "14px",
                                        display: "inline-block",
                                        color: "#707070",
                                      }}
                                    >
                                      Insured declared value
                                    </Typography>

                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "600",
                                        fontSize: "16px",
                                        display: "inline-block",
                                      }}
                                    >
                                      AED{" "}
                                      {formatNumber(
                                        customerPolicyDetails?.carId?.price || customerPolicyDetails?.quoteId?.carValue
                                      )}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>

                          <Grid item xs={3}></Grid>
                        </Grid>
                      </Box>

                      <Divider />

                      {!isActionHide && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 2,
                            gap: 3,
                          }}
                        >
                          <Box
                            onClick={onPolicyDownload}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              cursor: "pointer",
                            }}
                          >
                            <DownloadSvg />

                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                mb: 0,
                                color: "#707070",
                                fontWeight: "400",
                                fontSize: "16px",
                              }}
                            >
                              Download
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    m: "auto",
                    border: "1px solid #E6E6E6",
                    backgroundColor: "#FFF",
                    borderRadius: "10px",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    <Tabs
                      indicatorColor="primary"
                      onChange={handleTabsChange}
                      scrollButtons="auto"
                      // sx={{ mt: 3 }}
                      textColor="primary"
                      value={currentTab}
                      variant="scrollable"
                      sx={{
                        "& button": {
                          padding: { xs: "16px 10px", sm: "16px 20px" },
                          ml: "0 !important",
                        },
                      }}
                    >
                      {tabs.map((tab) => (
                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                      ))}
                    </Tabs>

                    <Box sx={{ mt: 3, display: "inline-block", width: "100%" }}>
                      {currentTab === "overview" && (
                        <>
                          {customerPolicyDetails ? (
                            <>
                              <CustomerPolicyDetails
                                handleTransactionsListPageChange={handleTransactionsListPageChange}
                                handleTransactionsListRowsPerPageChange={handleTransactionsListRowsPerPageChange}
                                handleHistoryListPageChange={handleHistoryListPageChange}
                                handleHistoryListRowsPerPageChange={handleHistoryListRowsPerPageChange}
                                handleAddOnsListPageChange={handleAddOnsListPageChange}
                                handleAddOnsListRowsPerPageChange={handleAddOnsListRowsPerPageChange}
                                handleCommentListPageChange={handleCommentListPageChange}
                                handleCommentListRowsPerPageChange={handleCommentListRowsPerPageChange}
                                isActionHide={isActionHide}
                              />
                            </>
                          ) : (
                            <div>No data found..</div>
                          )}
                        </>
                      )}

                      {currentTab === "coverages" && (
                        <>
                          {customerPolicyDetails ? (
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              {customerPolicyDetails?.quoteId?.response?.IncludedFeatures.length > 0 && (
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    width: "100%",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                      width: "100%",
                                      mb: 1,
                                      fontWeight: "600",
                                      fontSize: "18px",
                                      display: "inline-block",
                                      color: "#60176F",
                                      p: 1.5,
                                      px: 2,
                                      backgroundColor: "#f5f5f5",
                                    }}
                                  >
                                    Benefits
                                  </Typography>

                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                    sx={{
                                      px: "14px",
                                      flexDirection: {
                                        xs: "column",
                                        md: "row",
                                      },
                                      width: "100%",
                                    }}
                                  >
                                    {customerPolicyDetails?.quoteId?.response?.IncludedFeatures.length > 0 &&
                                      customerPolicyDetails?.quoteId?.response?.IncludedFeatures?.map((val, idx) => {
                                        let isEnable = false;
                                        const match = customerPolicyDetails?.quoteId?.extraFeatures?.find(
                                          (i) => i?.Code == val?.Code
                                        );
                                        if (match) {
                                          isEnable = true;
                                        }
                                        return (
                                          <>
                                            <Grid item xs={12} md={6} sx={{ my: 2 }}>
                                              <Box sx={{ display: "flex", gap: 1 }}>
                                                <Img
                                                  src={
                                                    val?.coverageDetail?.image
                                                      ? process.env.NEXT_PUBLIC_BASE_URL +
                                                        "/" +
                                                        val?.coverageDetail?.image?.path
                                                      : "/assets/car.png"
                                                  }
                                                  alt="car"
                                                  width={45}
                                                  height={45}
                                                />

                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    flexWrap: "wrap",
                                                    gap: 1,
                                                    mt: 1,
                                                  }}
                                                >
                                                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <Typography
                                                      variant="h4"
                                                      sx={{
                                                        color: "#000000",
                                                        fontSize: {
                                                          xs: "12px",
                                                          sm: "14px",
                                                          xl: "16px",
                                                        },
                                                        lineHeight: {
                                                          xs: "13px",
                                                          sm: "16px",
                                                          xl: "19px",
                                                        },
                                                        fontWeight: "500",
                                                      }}
                                                    >
                                                      {val?.Title}
                                                    </Typography>
                                                    <SeverityPill
                                                      color={"success"}
                                                      fontSize={10}
                                                      sx={{
                                                        cursor: "pointer",
                                                        mt: 0.1,
                                                      }}
                                                    >
                                                      {"Covered"}
                                                    </SeverityPill>
                                                  </Box>
                                                  <Typography
                                                    variant="h4"
                                                    sx={{
                                                      color: "#8B8E8B",
                                                      fontSize: {
                                                        xs: "12px",
                                                        sm: "14px",
                                                        xl: "16px",
                                                      },
                                                      lineHeight: {
                                                        xs: "15px",
                                                        sm: "19px",
                                                        xl: "24px",
                                                      },
                                                      fontWeight: "300",
                                                    }}
                                                  >
                                                    {val?.coverageDetail?.description
                                                      ? val?.coverageDetail?.description
                                                      : ""}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                            </Grid>
                                          </>
                                        );
                                      })}
                                  </Grid>
                                </Box>
                              )}

                              {customerPolicyDetails?.quoteId?.response?.ExtraFeatures.length > 0 && (
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    width: "100%",
                                  }}
                                >
                                  <Divider />
                                  <Box
                                    sx={{
                                      py: 2,
                                      display: "inline-block",
                                      width: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        width: "100%",
                                        mb: 1,
                                        fontWeight: "600",
                                        fontSize: "18px",
                                        display: "inline-block",
                                        color: "#60176F",
                                        p: 1.5,
                                        px: 2,
                                        backgroundColor: "#f5f5f5",
                                      }}
                                    >
                                      Coverage
                                    </Typography>

                                    <Grid
                                      container
                                      rowSpacing={1}
                                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                      sx={{
                                        px: "14px",
                                        flexDirection: {
                                          xs: "column",
                                          md: "row",
                                        },
                                        width: "100%",
                                      }}
                                    >
                                      {customerPolicyDetails?.quoteId?.response?.ExtraFeatures.length > 0 &&
                                        customerPolicyDetails?.quoteId?.response?.ExtraFeatures?.map((val, idx) => {
                                          let isEnable = false;
                                          const match = customerPolicyDetails?.quoteId?.extraFeatures?.find(
                                            (i) => i?.Code == val?.Code
                                          );
                                          if (match) {
                                            isEnable = true;
                                          }
                                          return (
                                            <>
                                              <Grid item xs={12} md={6} sx={{ my: 2 }}>
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    mt: 1,
                                                  }}
                                                >
                                                  <Img
                                                    src={
                                                      val?.benifitDetail?.image
                                                        ? process.env.NEXT_PUBLIC_BASE_URL +
                                                          "/" +
                                                          val?.benifitDetail?.image?.path
                                                        : "/assets/car.png"
                                                    }
                                                    alt="car"
                                                    width={45}
                                                    height={45}
                                                  />

                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      flexWrap: "wrap",
                                                      gap: 1,
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 1,
                                                        alignItems: "start",
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 1,
                                                        }}
                                                      >
                                                        <Typography
                                                          variant="h4"
                                                          sx={{
                                                            color: "#000000",
                                                            fontSize: {
                                                              xs: "12px",
                                                              sm: "14px",
                                                              xl: "16px",
                                                            },
                                                            lineHeight: {
                                                              xs: "13px",
                                                              sm: "16px",
                                                              xl: "19px",
                                                            },
                                                            fontWeight: "500",
                                                          }}
                                                        >
                                                          {val?.Title}
                                                        </Typography>
                                                        <SeverityPill
                                                          color={isEnable ? "success" : "error"}
                                                          fontSize={10}
                                                          sx={{
                                                            cursor: "pointer",
                                                            mt: 0.1,
                                                          }}
                                                        >
                                                          {isEnable
                                                            ? val?.Amount != 0
                                                              ? "Covered"
                                                              : "Covered | Free"
                                                            : "Not Covered"}
                                                        </SeverityPill>
                                                      </Box>
                                                      <Typography
                                                        variant="h4"
                                                        sx={{
                                                          color: "#60176F",
                                                          fontSize: {
                                                            xs: "10px",
                                                            sm: "12px",
                                                            xl: "12px",
                                                          },
                                                          lineHeight: {
                                                            xs: "15px",
                                                            sm: "18px",
                                                            xl: "24px",
                                                          },
                                                          fontWeight: "300",
                                                        }}
                                                      >
                                                        {val?.Amount
                                                          ? val?.Amount === 0
                                                            ? ""
                                                            : "AED" + " " + formatNumber(val?.Amount)
                                                          : ""}
                                                      </Typography>
                                                    </Box>

                                                    <Typography
                                                      variant="h4"
                                                      sx={{
                                                        color: "#8B8E8B",
                                                        fontSize: {
                                                          xs: "12px",
                                                          sm: "14px",
                                                          xl: "16px",
                                                        },
                                                        lineHeight: {
                                                          xs: "15px",
                                                          sm: "19px",
                                                          xl: "24px",
                                                        },
                                                        fontWeight: "300",
                                                      }}
                                                    >
                                                      {val?.benifitDetail?.description
                                                        ? val?.benifitDetail?.description
                                                        : "Morbi molestie efficitur ligula, vel mattis mi sodales eget. Suspendisse mattis lacinia bibendum. Fusce et justo mollis mi sollicitudin sagittis. Ut sed diam sed orci mollis dictum id eget tortor. Fusce nisi eros, congue auctor laoreet at, imperdiet semper urna. Donec ut fermentum mauris, vel auctor metus. Aliquam lacinia velit ac nulla rhoncus volutpat in at neque."}
                                                    </Typography>
                                                  </Box>
                                                </Box>
                                              </Grid>
                                            </>
                                          );
                                        })}
                                    </Grid>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <div>No data found..</div>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

PolicyDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PolicyDetails;
