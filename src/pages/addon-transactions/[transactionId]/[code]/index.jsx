import {
  Box,
  Button,
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
import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ListItemComp from "src/components/ListItemComp";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  getAddonTransactionsDetailsById,
} from "src/sections/transactions/action/transactionAction";
import { toast } from "react-toastify";
import AddonTransactionDetailsTable from "src/sections/transactions/addon_transaction-detail-table";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const TransactionsDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { transactionId, code } = router.query;
  const { addonTransactionDetail, addonTransactionDetailLoader } = useSelector(
    (state) => state.transactions
  );

  const initialized = useRef(false);

  // get Add-ons transaction details API function
  const getAddonTransactionDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(getAddonTransactionsDetailsById({ id: transactionId, code: code }))
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

  useEffect(() => {
    if (transactionId) {
      getAddonTransactionDetailsHandler();
    }
  }, [transactionId, code]);

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
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                  cursor: "pointer",
                }}
                onClick={() => router.back()}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Back</Typography>
              </Link>
            </Box>
          </Box>

          <Stack spacing={1} mb={3}>
            <Typography variant="h4">Add-on Details</Typography>
          </Stack>

          {addonTransactionDetailLoader ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                <AnimationLoader open={!!addonTransactionDetailLoader} />
              </Box>
            </>
          ) : (
            <>
              {addonTransactionDetail && (
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        borderRadius: "10px",
                        mb: 3,
                        boxShadow:
                          "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
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
                        Details
                      </Typography>

                      <Grid container columnSpacing={8}>
                        <Grid item xs={12} sm={10}>
                          <List sx={{ py: 0 }}>
                            <Grid container>
                              <Grid item xs={12} md={6} columnSpacing={4}>
                                <ListItemComp
                                  label={"Transaction No."}
                                  value={
                                    addonTransactionDetail?.transaction?.transactionNumber || "-"
                                  }
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6} columnSpacing={4}>
                                <ListItemComp
                                  label={"Date and Time"}
                                  value={
                                    addonTransactionDetail?.transaction?.paymentTime
                                      ? format(
                                          parseISO(
                                            addonTransactionDetail?.transaction?.paymentTime
                                          ),
                                          "dd/MM/yyyy HH:mm:ss"
                                        )
                                      : "-"
                                  }
                                />
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container>
                              <Grid item xs={12} md={6} columnSpacing={4}>
                                <ListItemComp
                                  label={"Policy No"}
                                  value={addonTransactionDetail?.policyId?.policyNumber || "-"}
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6} columnSpacing={4}>
                                <ListItemComp
                                  label={"Reference Number"}
                                  value={addonTransactionDetail?.transaction?.paymentRefNo}
                                />
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Source"}
                                  value={
                                    addonTransactionDetail?.transaction?.isAdmin
                                      ? `Agent: ${
                                          addonTransactionDetail?.transaction?.admin?.fullName
                                            ? addonTransactionDetail?.transaction?.admin?.fullName
                                            : ""
                                        }`
                                      : `Direct: ${
                                          addonTransactionDetail?.userId?.fullName
                                            ? addonTransactionDetail?.userId?.fullName
                                            : ""
                                        } (website)`
                                  }
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Status"}
                                  value={addonTransactionDetail?.payment?.status}
                                />
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Customer"}
                                  value={addonTransactionDetail?.userId?.fullName || "-"}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignContent: "center",
                                }}
                              >
                                <Button
                                  sx={{ height: "40px", m: "auto" }}
                                  type="button"
                                  variant="contained"
                                  onClick={() =>
                                    router.push(`/customers/${addonTransactionDetail?.userId?._id}`)
                                  }
                                >
                                  View Customer
                                </Button>
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

                      <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                        <AddonTransactionDetailsTable items={addonTransactionDetail?.addons} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default TransactionsDetails;

TransactionsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
