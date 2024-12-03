import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Link,
  List,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { format, parseISO, isValid } from "date-fns";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ListItemComp from "src/components/ListItemComp";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { formatNumber } from "src/utils/formatNumber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getHealthTransactionsDetailsById } from "src/sections/health-insurance/Transaction/Action/healthTransactionAction";
import { Scrollbar } from "src/components/scrollbar";
import AnimationLoader from "src/components/amimated-loader";

// Custom styled Tooltip with specific styles
const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#60176F",
      color: "#FFFFFF",
      maxWidth: 200,
      fontSize: "11px",
      border: "1px solid #dadde9",
      borderRadius: "7px",
      textAlign: "center",
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#60176F",
      [`& :before`]: {},
    },
  })
);

// Custom Divider that hides on larger screens
const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

// Custom styled NextImage component for responsive image styling
const Img = styled(NextImage)(({ theme }) => ({
  margin: "auto",
  width: "auto !important",
  objectFit: "cover",
  maxWidth: "100% !important",
  [theme.breakpoints.up("md")]: {
    height: "150px",
  },
  [theme.breakpoints.down("md")]: {
    height: "200px",
  },
}));

// Custom Box with responsive padding
const BoxCustom = styled(Box)(({ theme }) => ({
  padding: "0 24px",

  [theme.breakpoints.up("sm")]: {
    padding: 0,
    paddingRight: "24px",
  },
}));

// Custom TableCell with adjustable width based on screen size
const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  [theme.breakpoints.up("xl")]: {
    width: 500,
  },
  width: 300,
}));

// Main Health Transactions Details Component
const HealthTransactionsDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { transactionId } = router.query;
  const { healthTransactionDetail, healthTransactionDetailLoader } = useSelector((state) => state.healthTransactions);

  const initialized = useRef(false); // To prevent duplicate API calls in development with React Strict Mod

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  // Calculate total addon price and VAT
  let totalAddonPrice = 0;
  healthTransactionDetail?.addonId?.addons?.map((addon) => {
    totalAddonPrice += +addon?.price;
  });

  const addOnVat = totalAddonPrice * 0.05;

  // Function to download PDF by creating an anchor link
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

  // Fetch transaction details by transactionId
  const getProposalDetailsHandler = async () => {
    // Prevent calling twice in development mode with React StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(getHealthTransactionsDetailsById(transactionId))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (transactionId) {
      getProposalDetailsHandler();
    }
  }, [transactionId]);

  return (
    <>
      {/* Loading spinner while transaction details are being fetched */}
      <AnimationLoader open={healthTransactionDetailLoader} />

      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth={false}>
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box sx={{ display: "inline-block" }}>
              <NextLink href="/health-insurance/transaction">
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
              </NextLink>
            </Box>
          </Box>

          <Stack spacing={1} mb={3}>
            <Typography variant="h4">Transaction details</Typography>
          </Stack>

          <Box sx={{ display: "inline-block", width: "100%" }}>
            {/* Payment Details Box */}
            <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  mb: 3,
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
                  Payment Details
                </Typography>

                <Grid container columnSpacing={8}>
                  <Grid item xs={12} sm={10}>
                    <List sx={{ py: 0 }}>
                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Transaction No."}
                            value={healthTransactionDetail?.transactionNumber || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Transaction Date and Time"}
                            value={
                              healthTransactionDetail?.paymentTime
                                ? format(parseISO(healthTransactionDetail?.paymentTime), "dd/MM/yyyy HH:mm")
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>

                      <Divider />

                      {/* Payment Type and Amount Paid */}
                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            label={"Payment Type"}
                            isCopy={true}
                            value={healthTransactionDetail?.paidBy || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Amount Paid"}
                            value={
                              healthTransactionDetail?.billAmount
                                ? "AED " + formatNumber(parseInt(healthTransactionDetail?.billAmount * 100) / 100)
                                : "-"
                            }
                          />
                        </Grid>
                      </Grid>

                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <ListItemComp
                            isCopy={true}
                            label={"Payment Reference No."}
                            value={healthTransactionDetail?.payment?.orderRef || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ListItemComp
                            label={"Status"}
                            isCopy={true}
                            value={healthTransactionDetail?.payment?.status || "-"}
                          />
                        </Grid>
                      </Grid>
                    </List>
                  </Grid>
                </Grid>
              </Box>

              {/* Insurance Company Details */}
              <Box sx={{ mt: 3 }}>
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
                  Insurance Company Details
                </Typography>
                <List sx={{ py: 0 }}>
                  <ListItemComp
                    label={"Insurance Company Name"}
                    value={healthTransactionDetail?.insuranceCompanyName || "-"}
                  />
                  <Divider />
                  <ListItemComp
                    label={"Insurance Policy"}
                    value={healthTransactionDetail?.insurancePolicyNo || "-"}
                  />
                  <Divider />
                  <ListItemComp
                    label={"Insurance Provider"}
                    value={healthTransactionDetail?.insuranceProvider || "-"}
                  />
                  <Divider />
                </List>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

HealthTransactionsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthTransactionsDetails;
