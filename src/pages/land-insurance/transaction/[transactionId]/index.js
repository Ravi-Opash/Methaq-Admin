import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
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
import { format, parseISO } from "date-fns";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ListItemComp from "src/components/ListItemComp";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { formatNumber } from "src/utils/formatNumber";
import { getLandTransactionsDetailsById } from "src/sections/Land-insurance/Transaction/Action/landTransactionAction";
import { Scrollbar } from "src/components/scrollbar";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import AnimationLoader from "src/components/amimated-loader";

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

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  [theme.breakpoints.up("xl")]: {
    width: 500,
  },
  width: 300,
}));

const LandTransactionsDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { transactionId } = router.query;
  const { landTransactionDetail } = useSelector((state) => state.landTransactions);

  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  let totalAddonPrice = 0;
  landTransactionDetail?.addonId?.addons?.map((addon) => {
    totalAddonPrice += +addon?.price;
  });

  // Download document handler
  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + "/" + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Get land transaction detail API
  const getProposalDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(getLandTransactionsDetailsById(transactionId))
        .unwrap()
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      getProposalDetailsHandler();
    }
  }, [transactionId]);

  return (
    <>
      {!!loading && (
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
              }}
            >
              <NextLink href="/land-insurance/transaction">
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
                  <Grid item xs={12} sm={12}>
                    <List sx={{ py: 0 }}>
                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Transaction No."}
                            value={landTransactionDetail?.transactionNumber || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Transaction Date and Time"}
                            value={
                              landTransactionDetail?.paymentTime
                                ? format(parseISO(landTransactionDetail?.paymentTime), "dd/MM/yyyy HH:mm")
                                : ""
                            }
                          />
                        </Grid>
                      </Grid>

                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Payment Type"}
                            value={landTransactionDetail?.paidBy || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Amount Paid"}
                            value={
                              landTransactionDetail?.billAmount
                                ? "AED " + formatNumber(parseInt(landTransactionDetail?.billAmount * 100) / 100)
                                : "-"
                            }
                          />
                        </Grid>
                      </Grid>
                    </List>
                  </Grid>
                </Grid>
              </Box>

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
                    px: "15px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  Insurance Company Details
                </Typography>
                <Box xs={{ mt: 1 }}>
                  <Grid container spacing={2} p={2}>
                    <Grid container columnSpacing={4}>
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          isCopy={true}
                          label={"Company name"}
                          value={landTransactionDetail?.proposal?.company?.companyName || "-"}
                        />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          isCopy={true}
                          label={"Policy Number"}
                          value={landTransactionDetail?.policyId?.policyNumber || "-"}
                        />
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4}>
                      <Grid item xs={12} md={6}>
                        <ListItem disablePadding sx={{ position: "reletive" }}>
                          <ListItemButton>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: { xs: "space-between", sm: "unset" },
                                gap: 2,
                                width: "100%",
                              }}
                            >
                              <Box sx={{ width: "190px" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    mb: 1,
                                    fontWeight: "500",
                                    fontSize: "15px",
                                    display: "inline-block",
                                  }}
                                >
                                  Credit Note File
                                </Typography>
                              </Box>
                              <Box sx={{ width: "50%" }}>
                                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                  <Typography
                                    onClick={() =>
                                      onDocumentDowmload(landTransactionDetail?.policyId?.creditNoteFile?.path)
                                    }
                                    aria-label="upload picture"
                                    component="label"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      fontSize: {
                                        xs: "13px",
                                        sm: "14px",
                                      },
                                      width: "max-content",
                                      cursor: "pointer",
                                      "&:hover": {
                                        color: "#60176f",
                                        textDecoration: "underline",
                                        textUnderlineOffset: "2px",
                                      },
                                    }}
                                  >
                                    <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} /> Download
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItem disablePadding sx={{ position: "reletive" }}>
                          <ListItemButton>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: { xs: "space-between", sm: "unset" },
                                gap: 2,
                                width: "100%",
                              }}
                            >
                              <Box sx={{ width: "190px" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    mb: 1,
                                    fontWeight: "500",
                                    fontSize: "15px",
                                    display: "inline-block",
                                  }}
                                >
                                  Debit Note File
                                </Typography>
                              </Box>
                              <Box sx={{ width: "50%" }}>
                                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                  <Typography
                                    onClick={() =>
                                      onDocumentDowmload(landTransactionDetail?.policyId?.debitNoteFile?.path)
                                    }
                                    aria-label="upload picture"
                                    component="label"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      fontSize: {
                                        xs: "13px",
                                        sm: "14px",
                                      },
                                      width: "max-content",
                                      cursor: "pointer",
                                      "&:hover": {
                                        color: "#60176f",
                                        textDecoration: "underline",
                                        textUnderlineOffset: "2px",
                                      },
                                    }}
                                  >
                                    <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} /> Download
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4}>
                      <Grid item xs={12} md={6}>
                        <ListItem disablePadding sx={{ position: "reletive" }}>
                          <ListItemButton>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: { xs: "space-between", sm: "unset" },
                                gap: 2,
                                width: "100%",
                              }}
                            >
                              <Box sx={{ width: "190px" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    mb: 1,
                                    fontWeight: "500",
                                    fontSize: "15px",
                                    display: "inline-block",
                                  }}
                                >
                                  Tax Invoice File
                                </Typography>
                              </Box>
                              <Box sx={{ width: "50%" }}>
                                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                  <Typography
                                    onClick={() =>
                                      onDocumentDowmload(landTransactionDetail?.policyId?.taxInvoiceFile?.path)
                                    }
                                    aria-label="upload picture"
                                    component="label"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      fontSize: {
                                        xs: "13px",
                                        sm: "14px",
                                      },
                                      width: "max-content",
                                      cursor: "pointer",
                                      "&:hover": {
                                        color: "#60176f",
                                        textDecoration: "underline",
                                        textUnderlineOffset: "2px",
                                      },
                                    }}
                                  >
                                    <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} /> Download
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItem disablePadding sx={{ position: "reletive" }}>
                          <ListItemButton>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: { xs: "space-between", sm: "unset" },
                                gap: 2,
                                width: "100%",
                              }}
                            >
                              <Box sx={{ width: "190px" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    mb: 1,
                                    fontWeight: "500",
                                    fontSize: "15px",
                                    display: "inline-block",
                                  }}
                                >
                                  Certificate File
                                </Typography>
                              </Box>
                              <Box sx={{ width: "50%" }}>
                                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                  <Typography
                                    onClick={() =>
                                      onDocumentDowmload(landTransactionDetail?.policyId?.arabicCertificateFile?.path)
                                    }
                                    aria-label="upload picture"
                                    component="label"
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      fontSize: {
                                        xs: "13px",
                                        sm: "14px",
                                      },
                                      width: "max-content",
                                      cursor: "pointer",
                                      "&:hover": {
                                        color: "#60176f",
                                        textDecoration: "underline",
                                        textUnderlineOffset: "2px",
                                      },
                                    }}
                                  >
                                    <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} /> Download
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  mt: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px",
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
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    Items
                  </Typography>
                </Box>

                <Card>
                  <Scrollbar>
                    <Box sx={{ minWidth: 800 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCells>Item</TableCells>
                            <TableCell>Amount</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow hover key={landTransactionDetail?.code}>
                            <TableCells>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  width: "max-content",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  textUnderlineOffset: "3px",
                                  "&:hover": {
                                    color: "#60176f",
                                  },
                                }}
                                onClick={() =>
                                  router?.push(`/land-insurance/policies/${landTransactionDetail?.policyId?._id}`)
                                }
                              >
                                {"Policy " + landTransactionDetail?.policyId?.policyNumber}
                              </Typography>
                            </TableCells>
                            <TableCell>{"AED " + formatNumber(landTransactionDetail?.price)}</TableCell>
                          </TableRow>

                          {landTransactionDetail?.addonId?.addons?.map((addon) => {
                            return (
                              <>
                                <TableRow hover key={addon?.code}>
                                  <TableCells>{"Add on " + (addon?.prodNum ? addon?.prodNum : "-")}</TableCells>
                                  <TableCell>{"AED " + formatNumber(addon?.price)}</TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                        </TableBody>
                      </Table>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCells>Commission</TableCells>
                            <TableCell>Amount</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: "14px" }}>Commission from Insurance company</Typography>
                                <StyledTooltip arrow title={"Total commision from policy - the discount"}>
                                  <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                                </StyledTooltip>
                              </Box>
                            </TableCell>
                            <TableCell>{`AED ${formatNumber(
                              landTransactionDetail?.policyId?.commissionAmount || 0
                            )}`}</TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: "14px" }}>Net payable to insurance company </Typography>
                                <StyledTooltip arrow title={"The amount, Insurance company get paid by eSanad"}>
                                  <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                                </StyledTooltip>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {landTransactionDetail?.policyId?.netPayableToInsCompany
                                ? `AED ${formatNumber(landTransactionDetail?.policyId?.netPayableToInsCompany)}`
                                : "-"}
                            </TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: "14px" }}>Net Commission</Typography>
                                <StyledTooltip
                                  arrow
                                  title={"Total commission after removing discount plus processing fees"}
                                >
                                  <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                                </StyledTooltip>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {landTransactionDetail?.policyId?.netCommission
                                ? `AED ${formatNumber(landTransactionDetail?.policyId?.netCommission)}`
                                : "-"}
                            </TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </Scrollbar>
                </Card>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LandTransactionsDetails;

LandTransactionsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
