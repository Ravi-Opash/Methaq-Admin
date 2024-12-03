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
import InfoIcon from "@mui/icons-material/Info";
import { format, parseISO, isValid } from "date-fns";
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
import { UploadPolicyFile, editPolicyNumber } from "src/sections/Policies/action/policiesAction";
import { Scrollbar } from "src/components/scrollbar";
import { getTravelTransactionsDetailsById } from "src/sections/travel-insurance/Transaction/Action/travelTransactionAction";
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

const TravelTransactionsDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { transactionId } = router.query;
  const { travelTransactionDetail } = useSelector((state) => state.travelTransactions);

  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  const [invoiceEditable, setInvoiceEditable] = useState(false);
  const [isTexInvoiceUploaded, setIsTexInvoiceUploaded] = useState(
    travelTransactionDetail?.policyId?.commissionInvoiceFile ? true : false
  );

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  let totalAddonPrice = 0;
  travelTransactionDetail?.addonId?.addons?.map((addon) => {
    totalAddonPrice += +addon?.price;
  });

  // Function to handle PDF download
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

  // Function to get proposal details
  const getProposalDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(getTravelTransactionsDetailsById(transactionId))
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

  // Function to get proposal details
  useEffect(() => {
    if (transactionId) {
      getProposalDetailsHandler();
    }
  }, [transactionId]);

  return (
    <>
      <AnimationLoader open={!loading} />

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
              <NextLink href="/travel-insurance/transaction">
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
                  <Grid item xs={12} sm={10}>
                    <List sx={{ py: 0 }}>
                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Transaction No."}
                            value={travelTransactionDetail?.transactionNumber || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Transaction Date and Time"}
                            value={
                              travelTransactionDetail?.paymentTime
                                ? format(parseISO(travelTransactionDetail?.paymentTime), "dd/MM/yyyy HH:mm")
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
                            value={travelTransactionDetail?.paidBy || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Amount Paid"}
                            value={
                              travelTransactionDetail?.billAmount
                                ? "AED " + formatNumber(parseInt(travelTransactionDetail?.billAmount * 100) / 100)
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
                            value={travelTransactionDetail?.paymentRefNo || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ListItemComp
                            isCopy={true}
                            label={"Status"}
                            value={travelTransactionDetail?.paymentId?.status || "-"}
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
                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={1}>
                        <Grid item xs={6} md={8}>
                          <ListItemComp
                            isCopy={true}
                            label={"Company name"}
                            value={travelTransactionDetail?.travelQuoteId?.company?.companyName || "-"}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={1}>
                        <Grid item xs={6} md={8}>
                          <ListItemComp
                            isCopy={true}
                            label={"Policy Number"}
                            value={travelTransactionDetail?.travelPolicyId?.policyNumber || "-"}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <Table sx={{ mt: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Document</TableCell>
                    <TableCell>Number</TableCell>
                    <TableCell>File</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {travelTransactionDetail?.travelPolicyId?.paidBy == "CRM - Direct to insurance company" && (
                    <TableRow>
                      <TableCell>Proof of Payment</TableCell>
                      <TableCell>{`AED ${travelTransactionDetail?.travelPolicyId?.proofAmount}`}</TableCell>
                      <TableCell>
                        {travelTransactionDetail?.travelPolicyId?.proofOfPayment?.path ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <CheckCircleIcon sx={{ color: "#00FF00", fontSize: 20 }} />
                            <Typography
                              sx={{
                                fontSize: 14,
                                width: "max-content",
                                cursor: "pointer",
                                "&:hover": {
                                  color: "#60176f",
                                  textDecoration: "underline",
                                  textUnderlineOffset: "3px",
                                },
                              }}
                              onClick={() =>
                                onPdfDownload(
                                  `${baseURL}/${travelTransactionDetail?.travelPolicyId?.proofOfPayment?.path}`
                                )
                              }
                            >
                              Download
                            </Typography>
                          </Box>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  // borderBottom: "1px solid #E6E6E6",
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
                            {/* <TableCell>Action</TableCell> */}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow hover key={travelTransactionDetail?.code}>
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
                                  router?.push(
                                    `/travel-insurance/policies/${travelTransactionDetail?.travelPolicyId?._id}`
                                  )
                                }
                              >
                                {"Policy " + travelTransactionDetail?.travelPolicyId?._id}
                              </Typography>
                            </TableCells>
                            <TableCell>{"AED " + formatNumber(travelTransactionDetail?.price)}</TableCell>
                          </TableRow>
                          {travelTransactionDetail?.addonId?.addons?.map((addon) => {
                            return (
                              <>
                                <TableRow hover key={addon?.code}>
                                  <TableCells>{"Add on " + (addon?.prodNum ? addon?.prodNum : "-")}</TableCells>
                                  <TableCell>{"AED " + formatNumber(addon?.price)}</TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                          <TableRow hover key={travelTransactionDetail?.code}>
                            <TableCells>{"Vat on Policy"}</TableCells>
                            <TableCell>
                              {"AED " + formatNumber(+parseInt(travelTransactionDetail?.price * 0.05 * 100) / 100)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCells>Commission</TableCells>
                            <TableCell>Amount</TableCell>
                            {/* <TableCell>Action</TableCell> */}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                  sx={{ fontSize: "14px" }}
                                >{`Total commission from policy (${travelTransactionDetail?.travelPolicyId?.commission}%)`}</Typography>
                                <StyledTooltip arrow title={"Total commission from this policy before discount"}>
                                  <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                                </StyledTooltip>
                              </Box>
                            </TableCell>
                            <TableCell>{`AED ${formatNumber(
                              travelTransactionDetail?.travelPolicyId?.commissionAmountBeforeDiscount
                            )}`}</TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>

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
                              travelTransactionDetail?.travelPolicyId?.commissionAmount || 0
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
                              {travelTransactionDetail?.travelPolicyId?.netPayableToInsCompany
                                ? `AED ${formatNumber(travelTransactionDetail?.travelPolicyId?.netPayableToInsCompany)}`
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
                              {travelTransactionDetail?.travelPolicyId?.netCommission
                                ? `AED ${formatNumber(travelTransactionDetail?.travelPolicyId?.netCommission)}`
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

export default TravelTransactionsDetails;

TravelTransactionsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
