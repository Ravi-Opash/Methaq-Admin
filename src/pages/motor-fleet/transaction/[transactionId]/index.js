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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { format, parseISO, isValid } from "date-fns";
import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ListItemComp from "src/components/ListItemComp";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { formatNumber } from "src/utils/formatNumber";
import { Scrollbar } from "src/components/scrollbar";
import { getMotorFleetTransactionsDetailsById } from "src/sections/motor-fleet/Transaction/Action/motorFleetTransactionAction";

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
  const { motorFleetTransactionDetail } = useSelector((state) => state.motorFleetTransactions);

  // prevent from calling twice in development mode with React.StrictMode enabled
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  let totalAddonPrice = 0;
  motorFleetTransactionDetail?.addonId?.addons?.map((addon) => {
    totalAddonPrice += +addon?.price;
  });

  // Functin to get proposals details for motor fleet
  const getProposalDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      setLoading(true);
      dispatch(getMotorFleetTransactionsDetailsById(transactionId))
        .unwrap()
        .then((res) => {
          // console.log("res", res);
          setLoading(false);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
      setLoading(true);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch proposal details
  useEffect(() => {
    if (transactionId) {
      getProposalDetailsHandler();
    }
  }, [transactionId]);

  return (
    <>
      {loading ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <CircularProgress />
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
                <NextLink href="/motor-fleet/transaction">
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
                              label={"Transaction No."}
                              value={motorFleetTransactionDetail?.transactionNumber || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Transaction Date and Time"}
                              value={
                                motorFleetTransactionDetail?.paymentTime
                                  ? format(parseISO(motorFleetTransactionDetail?.paymentTime), "dd/MM/yyyy HH:mm")
                                  : ""
                              }
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Payment Type"} value={motorFleetTransactionDetail?.paidBy || "-"} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Amount Paid"}
                              value={
                                motorFleetTransactionDetail?.billAmount
                                  ? "AED " + formatNumber(parseInt(motorFleetTransactionDetail?.billAmount * 100) / 100)
                                  : "-"
                              }
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Payment Reference No."}
                              value={motorFleetTransactionDetail?.paymentRefNo || "-"}
                            />
                            <DividerCustom />
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
                          <Grid item xs={6} md={4}>
                            <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>Company name</Typography>
                          </Grid>
                          <Grid item xs={6} md={8}>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: 400,
                                color: "#707070",
                              }}
                            >
                              {motorFleetTransactionDetail?.quoteId?.company?.companyName || "-"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Grid container spacing={1}>
                          <Grid item xs={6} md={4}>
                            <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>Policy Number</Typography>
                          </Grid>
                          <Grid item xs={6} md={8}>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: 400,
                                color: "#707070",
                              }}
                            >
                              {motorFleetTransactionDetail?.policyId?.policyNumber || "-"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

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
                            <TableRow hover key={motorFleetTransactionDetail?.code}>
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
                                    router?.push(`/motor-fleet/policies/${motorFleetTransactionDetail?.policyId?._id}`)
                                  }
                                >
                                  {"Policy " + motorFleetTransactionDetail?.policyId?.policyNumber}
                                </Typography>
                              </TableCells>
                              <TableCell>{"AED " + formatNumber(motorFleetTransactionDetail?.price)}</TableCell>
                            </TableRow>

                            {motorFleetTransactionDetail?.addonId?.addons?.map((addon) => {
                              return (
                                <>
                                  <TableRow hover key={addon?.code}>
                                    <TableCells>{"Add on " + (addon?.prodNum ? addon?.prodNum : "-")}</TableCells>
                                    <TableCell>{"AED " + formatNumber(addon?.price)}</TableCell>
                                  </TableRow>
                                </>
                              );
                            })}
                            <TableRow hover key={motorFleetTransactionDetail?.code}>
                              <TableCells>{"Vat on Policy"}</TableCells>
                              <TableCell>
                                {"AED " +
                                  formatNumber(+parseInt(motorFleetTransactionDetail?.price * 0.05 * 100) / 100)}
                              </TableCell>
                            </TableRow>
                            <TableRow hover key={motorFleetTransactionDetail?.code}>
                              <TableCells>{"Grand Total"}</TableCells>
                              <TableCell>{"AED " + formatNumber(motorFleetTransactionDetail?.billAmount)}</TableCell>
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
      )}
    </>
  );
};

export default TravelTransactionsDetails;

TravelTransactionsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
