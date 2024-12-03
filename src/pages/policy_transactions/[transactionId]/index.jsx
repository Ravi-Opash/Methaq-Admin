import {
  Box,
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
  TextField,
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
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getTransactionsDetailsById } from "src/sections/transactions/action/transactionAction";
import { toast } from "react-toastify";
import POlicyTransactionDetailsTable from "src/sections/transactions/policy_transaction-detail-table";
import { PrintSvg } from "src/Icons/PrintSvg";
import { formatNumber } from "src/utils/formatNumber";
import { EditIcon } from "src/Icons/EditIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { moduleAccess } from "src/utils/module-access";
import { UploadPolicyFile, editPolicyNumber } from "src/sections/Policies/action/policiesAction";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const BoxCustom = styled(Box)(({ theme }) => ({
  padding: "0 24px",

  [theme.breakpoints.up("sm")]: {
    padding: 0,
    paddingRight: "24px",
  },
}));

const TransactionsDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { transactionId } = router.query;
  const { transactionDetail, transactionDetailLoader } = useSelector((state) => state.transactions);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);

  const [financeObj, setFinanceObj] = useState({});
  const [invoiceEditable, setInvoiceEditable] = useState(false);
  const [isTexInvoiceUploaded, setIsTexInvoiceUploaded] = useState(
    transactionDetail?.policyId?.commissionInvoiceFile ? true : false
  );

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

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

  // Helper function to download a PDF file from a URL
  const getProposalDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled

    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      // Function for getting proposal details
      dispatch(getTransactionsDetailsById(transactionId))
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

  // useEffect to get proposal details
  useEffect(() => {
    if (transactionId) {
      getProposalDetailsHandler();
    }
  }, [transactionId]);

  // Function to upload invoice file
  const handleUploadInvoiceFile = (event) => {
    if (event?.target?.files?.[0]) {
      const formData = new FormData();
      formData.append("commissionInvoiceFile", event?.target?.files[0]);
      dispatch(
        UploadPolicyFile({
          data: formData,
          policyId: transactionDetail?.policyId?._id,
        })
      )
        .unwrap()
        .then((res) => {
          dispatch(getTransactionsDetailsById(transactionId));
          toast.success("SuccessFully Updated");
          setIsTexInvoiceUploaded(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    }
    event.target.value = "";
  };

  // Function to edit policy number
  const onSubmitChange = (value) => {
    dispatch(editPolicyNumber({ ...value, policyId: transactionDetail?.policyId?._id }))
      .unwrap()
      .then((res) => {
        dispatch(getTransactionsDetailsById(transactionId));
        toast.success("SuccessFully Updated");
        setInvoiceEditable(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  return (
    <>
      {!loading && (
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
            <CircularProgress sx={{ color: "#60176F" }} />
          </Box>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 9998,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
            }}
          ></div>
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
              <NextLink href="/policy_transactions">
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

          {transactionDetailLoader ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                {/* <CircularProgress /> */}
                <AnimationLoader open={!!transactionDetailLoader} />
              </Box>
            </>
          ) : (
            <>
              {transactionDetail && (
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
                                  label={"Transaction No."}
                                  isCopy={true}
                                  value={transactionDetail?.transactionNumber || "-"}
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6} columnSpacing={4}>
                                <ListItemComp
                                  label={"Transaction Date and Time"}
                                  isCopy={true}
                                  value={
                                    transactionDetail?.paymentTime
                                      ? format(parseISO(transactionDetail?.paymentTime), "dd/MM/yyyy HH:mm:ss HH:mm")
                                      : "-"
                                  }
                                />
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container>
                              <Grid item xs={12} md={6} columnSpacing={4}>
                                <ListItemComp
                                  label={"Payment Type"}
                                  isCopy={true}
                                  value={transactionDetail?.paidBy || "-"}
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6} columnSpacing={4}>
                                <ListItemComp
                                  isCopy={true}
                                  label={"Amount Paid"}
                                  value={`AED ${formatNumber(transactionDetail?.billAmount)}`}
                                />
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  isCopy={true}
                                  label={"Payment Reference No."}
                                  value={transactionDetail?.paymentRefNo || "-"}
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Status"}
                                  isCopy={true}
                                  value={transactionDetail?.payment?.status}
                                />
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  isCopy={true}
                                  label={"Source"}
                                  value={
                                    transactionDetail.isAdmin
                                      ? `Agent: ${
                                          transactionDetail.adminId?.fullName ? transactionDetail.adminId?.fullName : ""
                                        }`
                                      : `Direct: ${
                                          transactionDetail.userId?.fullName ? transactionDetail?.userId?.fullName : ""
                                        } (website)`
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
                          px: "14px",
                          borderRadius: "10px 10px 0 0",
                        }}
                      >
                        Finance Details
                      </Typography>
                      <Box xs={{ mt: 1 }}>
                        <Grid container spacing={2} p={2}>
                          <Grid item xs={12} sm={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={6} md={4}>
                                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>Credit Note</Typography>
                              </Grid>
                              <Grid item xs={6} md={8}>
                                <Typography
                                  sx={{
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    color: "#60176F",
                                    cursor: "pointer",
                                    width: "max-content",
                                  }}
                                  onClick={() =>
                                    onPdfDownload(`${baseURL}/${transactionDetail?.policyId?.creditNoteFile?.path}`)
                                  }
                                >
                                  {transactionDetail?.policyId?.creditNoteFile?.path ? "Download File" : "-"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={6} md={4}>
                                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>Debit Note</Typography>
                              </Grid>
                              <Grid item xs={6} md={8}>
                                <Typography
                                  sx={{
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    color: "#60176F",
                                    cursor: "pointer",
                                    width: "max-content",
                                  }}
                                  onClick={() =>
                                    onPdfDownload(`${baseURL}/${transactionDetail?.policyId?.debitNoteFile?.path}`)
                                  }
                                >
                                  {transactionDetail?.policyId?.debitNoteFile?.path ? "Download File" : "-"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Grid container spacing={1}>
                              <Grid item xs={6} md={4}>
                                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>Tax Invoice</Typography>
                              </Grid>
                              <Grid item xs={6} md={8}>
                                <Typography
                                  sx={{
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    color: "#60176F",
                                    cursor: "pointer",
                                    width: "max-content",
                                  }}
                                  onClick={() =>
                                    onPdfDownload(
                                      `${baseURL}/${transactionDetail?.policyId?.commissionInvoiceFile?.path}`
                                    )
                                  }
                                >
                                  Download File
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Table sx={{ mt: 3 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Document</TableCell>
                                <TableCell>Number</TableCell>
                                <TableCell>File</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Commission Invoice</TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    {!invoiceEditable ? (
                                      <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                        sx={{
                                          fontWeight: "400",
                                          fontSize: "14px",
                                          color: "#707070",
                                          textAlign: { xs: "end", sm: "left" },
                                        }}
                                      >
                                        {`${transactionDetail?.policyId?.commissionInvoiceNumber || "-"}`}
                                      </Typography>
                                    ) : (
                                      <TextField
                                        sx={{ width: "160px" }}
                                        label="Invoice Number"
                                        name="commissionInvoiceNumber"
                                        defaultValue={transactionDetail?.policyId?.commissionInvoiceNumber || ""}
                                        onChange={(e) => {
                                          const newValue = e.target.value;
                                          setFinanceObj({
                                            ...financeObj,
                                            commissionInvoiceNumber: newValue,
                                          });
                                        }}
                                      />
                                    )}
                                    {moduleAccess(user, "policies.update") && (
                                      <>
                                        {!invoiceEditable ? (
                                          <EditIcon
                                            onClick={() => setInvoiceEditable(true)}
                                            sx={{
                                              fontSize: "20px",
                                              cursor: "pointer",
                                              color: "#707070",
                                              mt: -1,
                                              "&:hover": {
                                                color: "#60176F",
                                              },
                                            }}
                                          />
                                        ) : (
                                          <CheckCircleIcon
                                            onClick={() =>
                                              onSubmitChange({
                                                commissionInvoiceNumber: financeObj?.commissionInvoiceNumber,
                                              })
                                            }
                                            sx={{
                                              fontSize: "20px",
                                              cursor: "pointer",
                                              color: "#707070",
                                              mt: -1,
                                              "&:hover": {
                                                color: "#60176F",
                                              },
                                            }}
                                          />
                                        )}
                                      </>
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  {isTexInvoiceUploaded ? (
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
                                            `${baseURL}/${transactionDetail?.policyId?.commissionInvoiceFile?.path}`
                                          )
                                        }
                                      >
                                        Download
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                      }}
                                    >
                                      <CheckCircleIcon sx={{ color: "#8c8c8c", fontSize: 20 }} />
                                      <Typography
                                        variant="subtitle2"
                                        aria-label="upload picture"
                                        component="label"
                                        gutterBottom
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
                                      >
                                        <input
                                          accept=".pdf"
                                          id="image-upload"
                                          type="file"
                                          onChange={handleUploadInvoiceFile}
                                          style={{ display: "none" }}
                                        />
                                        Upload
                                      </Typography>
                                    </Box>
                                  )}
                                </TableCell>
                              </TableRow>
                              {transactionDetail?.policyId?.paidBy == "CRM - Direct to insurance company" && (
                                <TableRow>
                                  <TableCell>Proof of Payment</TableCell>
                                  <TableCell>{`AED ${transactionDetail?.policyId?.proofAmount}`}</TableCell>
                                  <TableCell>
                                    {transactionDetail?.policyId?.proofOfPayment?.path ? (
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
                                              `${baseURL}/${transactionDetail?.policyId?.proofOfPayment?.path}`
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
                        </Grid>
                      </Box>
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
                              {/* <Grid item xs={6} md={4}>
                                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>Company name</Typography>
                              </Grid> */}
                              <Grid item xs={6} md={8}>
                                {/* <Typography
                                  sx={{
                                    fontSize: "15px",
                                    fontWeight: 400,
                                    color: "#707070",
                                  }}
                                >
                                  {transactionDetail?.quoteId?.company?.companyName || "-"}
                                </Typography>
                                 */}
                                <ListItemComp
                                  isCopy={true}
                                  label={"Company name"}
                                  value={transactionDetail?.quoteId?.company?.companyName || "-"}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Grid container spacing={1}>
                              {/* <Grid item xs={6} md={4}>
                                <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>Policy Number</Typography>
                              </Grid> */}
                              <Grid item xs={6} md={8}>
                                {/* <Typography
                                  sx={{
                                    fontSize: "15px",
                                    fontWeight: 400,
                                    color: "#707070",
                                  }}
                                >
                                  {transactionDetail?.policyId?.companyPolicyNumber || "-"}
                                </Typography> */}
                                <ListItemComp
                                  isCopy={true}
                                  label={"Policy Number"}
                                  value={transactionDetail?.policyId?.companyPolicyNumber || "-"}
                                />
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
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            color: "#60176F",
                            px: "14px",

                            borderRadius: "10px 10px 0 0",
                          }}
                        >
                          Items
                          <span
                            style={{
                              fontSize: 14,
                              width: "max-content",
                              cursor: "pointer",
                              ml: 2,
                              textDecoration: "underline",
                              textUnderlineOffset: "3px",
                              color: "#60176f",
                            }}
                            onClick={() => router?.push(`/policies/${transactionDetail?.policyId?._id}`)}
                          >
                            {`( Policy ${transactionDetail?.policyId?.policyNumber} )`}
                          </span>
                        </Typography>
                      </Box>

                      <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                        <POlicyTransactionDetailsTable items={transactionDetail} />
                      </Box>
                    </Box>
                    {/* <Box sx={{ display: "inline-block", cursor: "pointer", m: 3 }}>
                      <PrintSvg sx={{ fontSize: "36px" }} />
                    </Box> */}
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
