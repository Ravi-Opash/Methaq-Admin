import {
  Box,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Link,
  List,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { format, parseISO, isValid } from "date-fns";
import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ListItemComp from "src/components/ListItemComp";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { formatNumber } from "src/utils/formatNumber";
import { getPaymentDetailsById } from "src/sections/payment-link/Action/paymentLinkAction";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const LandTransactionsDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { paymentId } = router.query;

  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  const [paymentDetails, SetpaymentDetails] = useState([]);

  // Get payment details
  useEffect(() => {
    try {
      if (initialized.current) {
        return;
      }
      initialized.current = true;
      dispatch(getPaymentDetailsById({ id: paymentId }))
        .unwrap()
        .then((res) => {
          // console.log("res", res);
          SetpaymentDetails(res);
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
    }
  }, [paymentId]);

  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              transform: "-webkit-translate(-50%, -50%)",
              transform: "-moz-translate(-50%, -50%)",
              transform: "-ms-translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            {/* <CircularProgress sx={{ color: "#60176F" }} /> */}
            <AnimationLoader open={true} />
          </Box>
        </>
      ) : (
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
                <NextLink href="/payment-link">
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
              <Box>
                <Typography variant="h4">Payment details</Typography>
              </Box>
            </Stack>
            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                <Card sx={{ mb: 3 }}>
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
                              label={"Amount"}
                              value={`AED ${formatNumber(paymentDetails?.data?.billAmount)}`}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Created At"}
                              value={
                                paymentDetails?.data?.createdAt
                                  ? format(parseISO(paymentDetails?.data?.createdAt), "dd/MM/yyyy HH:MM")
                                  : ""
                              }
                            />
                          </Grid>
                        </Grid>
                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Status"} value={paymentDetails?.data?.status} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Agent"} value={paymentDetails?.data?.userId?.fullName || "-"} />
                          </Grid>
                        </Grid>
                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Comment"} value={paymentDetails?.data?.comments || "-"} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Auth Reference No."}
                              value={paymentDetails?.data?.authReferenceNumber || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>
                      </List>
                    </Grid>
                  </Grid>
                </Card>
                {paymentDetails?.data?.customTransactionId && (
                  <Card sx={{ mb: 3 }}>
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
                      Transaction Details
                    </Typography>

                    <Grid container columnSpacing={8}>
                      <Grid item xs={12} sm={12}>
                        <List sx={{ py: 0 }}>
                          <Grid container>
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemComp
                                label={"Transaction No."}
                                value={paymentDetails?.data?.customTransactionId?.transactionNumber || "-"}
                              />
                              <DividerCustom />
                            </Grid>
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemComp
                                label={"Transaction Time"}
                                value={
                                  paymentDetails?.data?.customTransactionId?.paymentTime
                                    ? format(
                                        parseISO(paymentDetails?.data?.customTransactionId?.paymentTime),
                                        "dd/MM/yyyy HH:mm"
                                      )
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                          <Divider />
                          <Grid container>
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemComp
                                label={"Amount Paid"}
                                value={
                                  paymentDetails?.data?.customTransactionId?.billAmount
                                    ? "AED " +
                                      formatNumber(
                                        parseInt(paymentDetails?.data?.customTransactionId?.billAmount * 100) / 100
                                      )
                                    : "-"
                                }
                              />
                              <DividerCustom />
                            </Grid>
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemComp
                                label={"Payment Ref No"}
                                value={paymentDetails?.data?.customTransactionId?.paymentRefNo}
                              />
                            </Grid>
                          </Grid>

                          <Divider />

                          <Grid container>
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemComp
                                label={"Payment Type"}
                                value={paymentDetails?.data?.customTransactionId?.paidBy || "-"}
                              />
                              <DividerCustom />
                            </Grid>
                            <Grid item xs={12} md={6} columnSpacing={4}></Grid>
                          </Grid>
                        </List>
                      </Grid>
                    </Grid>
                  </Card>
                )}
                <Box
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    borderRadius: "10px",
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
                    History
                  </Typography>
                  <Box>
                    <ProposalHistoryTable items={paymentDetails?.history} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
};

export default LandTransactionsDetails;

LandTransactionsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
