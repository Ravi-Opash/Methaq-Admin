import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import ListItemComp from "src/components/ListItemComp";
import NextImage from "next/image";
import { format, parseISO, isValid } from "date-fns";
import ModalComp from "src/components/modalComp";
import { DocumentSvg } from "src/Icons/DocumentSvg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import AddCommentModal from "src/sections/customer/CustomerComments/add-comment-modal";
import ViewHealthPolicyModal from "./view-policy-modal";
import MotorPolicyUploadModal from "src/sections/Policies/motor-policy-upload-modal";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { moduleAccess } from "src/utils/module-access";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

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

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const LandPolicyDetail = ({ policyData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { policyId } = router?.query;

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  // console.log(policyData, "policyData");
  const [openEditPolicyNo, setOpenEditPolicyNo] = useState(false);
  const handleEditPolicyNoClose = () => setOpenEditPolicyNo(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const handleViewModalClose = () => setOpenViewModal(false);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required("Please select a file"),
  });

  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {},
  });

  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + "/" + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <Box sx={{ display: "flex", flexFlow: "column" }}>
      {/* {"personal detail"} */}
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          mt: 3,
          borderBottom: "1px solid #E6E6E6",
        }}
      >
        <Grid container columnSpacing={4}>
          <Grid item xs={12} sm={12}>
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
                mb: 0,
              }}
            >
              Personal Details
            </Typography>

            <Grid container columnSpacing={8}>
              <Grid item xs={12} sm={12}>
                <List sx={{ py: 0 }}>
                  <Grid container>
                    <Grid item xs={12} md={6} columnSpacing={4}>
                      <ListItemComp isCopy={true} label={"Full Name"} value={policyData?.proposal?.fullName[0]} />
                      <DividerCustom />
                    </Grid>
                    <Grid item xs={12} md={6} columnSpacing={4}>
                      <ListItemComp isCopy={true} label={"Email"} value={policyData?.proposal?.email || "-"} />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6} columnSpacing={4}>
                      <ListItemComp
                        isCopy={true}
                        label={"Mobile Number"}
                        value={policyData?.proposal?.mobileNumber ? `+971 ${policyData?.proposal?.mobileNumber}` : "-"}
                      />
                      <DividerCustom />
                    </Grid>
                    <Grid item xs={12} md={6} columnSpacing={4}>
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
                            <Box sx={{ width: { xl: "190px", xs: "50%" } }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mb: 1,
                                  fontWeight: "500",
                                  fontSize: "15px",
                                  display: "inline-block",
                                  // textAlign: "end",
                                }}
                              >
                                Owner's Id
                              </Typography>
                            </Box>
                            <Box sx={{ width: "50%" }}>
                              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                <Typography
                                  onClick={() => onDocumentDowmload(policyData?.proposal?.ownerId?.[0]?.path)}
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
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {policyData?.proposal?.fullName?.length > 1 && (
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
                  width: "100%",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "600",
                  fontSize: "18px",
                  display: "inline-block",
                  color: "#60176F",
                  borderRadius: "10px 10px 0 0",
                }}
              >
                Other Owners
              </Typography>
            </Box>
            <Box sx={{ minWidth: 700 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell>ID</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {policyData?.proposal?.fullName
                    ?.slice(0, policyData?.proposal?.fullName?.length - 1)
                    ?.map((item, idx) => {
                      return (
                        <TableRow hover>
                          <TableCell>{policyData?.proposal?.fullName?.[idx + 1]}</TableCell>
                          {policyData?.proposal?.ownerId?.[idx + 1] && (
                            <TableCell>
                              <Typography
                                onClick={() => onDocumentDowmload(policyData?.proposal?.ownerId?.[idx + 1]?.path)}
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
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderRadius: "10px",
          my: 2,
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
            Location Details
          </Typography>
        </Box>
        <Grid container columnSpacing={8}>
          <Grid item xs={12} sm={12}>
            <List sx={{ py: 0 }}>
              <Grid container>
                <Grid item xs={12} md={12} columnSpacing={4}>
                  <ListItemComp
                    fullWidth={true}
                    isCopy={true}
                    label={"Location"}
                    value={policyData?.proposal?.location || "-"}
                  />
                  <DividerCustom />
                </Grid>
              </Grid>
              <Divider />
              <Grid container>
                <Grid item xs={12} md={6} columnSpacing={4}>
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
                              // textAlign: "end",
                            }}
                          >
                            Site Map
                          </Typography>
                        </Box>
                        <Box sx={{ width: "50%" }}>
                          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                            <Typography
                              onClick={() => onDocumentDowmload(policyData?.proposal?.sitemap?.path)}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#60176F",
            borderRadius: "10px 10px 0 0",
            width: "100%",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              mb: 1,
              fontWeight: "600",
              fontSize: "18px",
              display: "inline-block",
              color: "#60176F",
              px: "14px",
              mt: 2,
            }}
          >
            Current policy
          </Typography>
        </Box>

        <Grid container columnSpacing={3}>
          <Grid item xs={12} sm={9}>
            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy issue"}
                    value={
                      policyData?.policyEffectiveDate
                        ? format(parseISO(policyData?.policyEffectiveDate), "dd-MM-yyyy")
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy expiry"}
                    value={
                      policyData?.policyExpiryDate ? format(parseISO(policyData?.policyExpiryDate), "dd-MM-yyyy") : ""
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Ref Number"} value={policyData?.policyNumber || ""} />
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Premium"} value={`${policyData?.totalPrice} AED`} />
                </Grid>
              </Grid>
              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Company Policy Number"} value={policyData?.companyPolicyNumber || ""} />
                  <DividerCustom />
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
                              // textAlign: "end",
                            }}
                          >
                            Credit Note File
                          </Typography>
                        </Box>
                        <Box sx={{ width: "50%" }}>
                          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                            <Typography
                              onClick={() => onDocumentDowmload(policyData?.creditNoteFile?.path)}
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
                              // textAlign: "end",
                            }}
                          >
                            Debit Note File
                          </Typography>
                        </Box>
                        <Box sx={{ width: "50%" }}>
                          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                            <Typography
                              onClick={() => onDocumentDowmload(policyData?.debitNoteFile?.path)}
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
                              // textAlign: "end",
                            }}
                          >
                            Tax Invoice File
                          </Typography>
                        </Box>
                        <Box sx={{ width: "50%" }}>
                          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                            <Typography
                              onClick={() => onDocumentDowmload(policyData?.taxInvoiceFile?.path)}
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
                              // textAlign: "end",
                            }}
                          >
                            Certificate File
                          </Typography>
                        </Box>
                        <Box sx={{ width: "50%" }}>
                          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                            <Typography
                              onClick={() => onDocumentDowmload(policyData?.arabicCertificateFile?.path)}
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
            </List>
          </Grid>

          <Grid item xs={12} sm={3}>
            <BoxCustom
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  alignItems: "center",
                }}
              >
                {moduleAccess(user, "landQuote.update") && (
                  <Box
                    sx={{
                      display: "flex",
                      color: "#707070",
                      cursor: "pointer",
                      flexFlow: "column",
                      alignItems: "center",
                    }}
                    onClick={() => setOpenEditPolicyNo(true)}
                  >
                    <Tooltip title="Click to udpate policy pdf" arrow>
                      <DocumentSvg sx={{ fontSize: "70px" }} />
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      aria-label="upload picture"
                      component="label"
                      gutterBottom
                      sx={{
                        color: "#707070",
                        fontSize: "12px",
                        fontWeight: "600",
                        textDecoration: "underline",
                        mt: 0.5,
                        cursor: "pointer",
                      }}
                    >
                      Upload
                    </Typography>
                  </Box>
                )}

                {policyData?.policyFile && (
                  <a
                    href={baseURL + "/" + policyData?.policyFile?.path}
                    download={policyData?.policyFile?.filename}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "inline-block",
                      fontSize: "1rem",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      aria-label="upload picture"
                      component="label"
                      gutterBottom
                      sx={{
                        color: "#707070",
                        fontSize: "12px",
                        fontWeight: "600",
                        textDecoration: "underline",
                        mt: 0.5,
                        cursor: "pointer",
                      }}
                    >
                      View
                    </Typography>
                  </a>
                )}
              </Box>
            </BoxCustom>
          </Grid>
        </Grid>
      </Box>

      {/* <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderBottom: "1px solid #E6E6E6",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mt: 3,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              py: 1.5,
              fontWeight: "600",
              fontSize: "18px",
              display: "inline-block",
              color: "#60176F",
              px: "14px",
              mb: 0,
            }}
          >
            Transactions
          </Typography>
        </Box>

        <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
          {healthPolicyTransactionLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
              {healthPolicyTransactionList && (
                <HealthPolicyTransactionTable items={healthPolicyTransactionList} policyData={policyData} />
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "inline-block", width: "100%", my: 2 }}>
        <Grid container columnSpacing={4}>
          <Grid item xs={12} sm={12}>
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
                mb: 0,
              }}
            >
              Policy history
            </Typography>
            {policyData && <CustomerHistoryTable items={policyData} />}
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderBottom: "1px solid #E6E6E6",
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
            {moduleAccess(user, "healthQuote.update") && (
              <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                Add a Comment
              </Button>
            )}
          </Box>
        </Box>

        {healthPolicyCommentLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
            {healthPolicyCommentList && <HealthPolicyCommentsTable items={healthPolicyCommentList} />}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "inline-block", width: "100%", my: 2 }}>
        <HealthPolicyFinanceTable />
      </Box> */}

      <ModalComp open={open} handleClose={handleClose} width="44rem">
        <AddCommentModal handleClose={handleClose} id={policyId} flag={"health-policy"} />
      </ModalComp>
      <ModalComp open={openEditPolicyNo} handleClose={handleEditPolicyNoClose} width="44rem">
        <MotorPolicyUploadModal
          handleEditPolicyNoClose={handleEditPolicyNoClose}
          customerPolicyDetails={policyData}
          keyName={"Land-Policy"}
          // newPolicyId={policyData?.policyId?._id}
          proposalId={policyId}
        />
      </ModalComp>
      <ModalComp open={openViewModal} handleClose={handleViewModalClose} width="44rem">
        <ViewHealthPolicyModal
          handleEditPolicyNoClose={handleViewModalClose}
          customerPolicyDetails={policyData}
          keyName={`Land-Policy`}
        />
      </ModalComp>
    </Box>
  );
};

export default LandPolicyDetail;
