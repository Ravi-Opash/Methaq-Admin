import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import ListItemComp from "src/components/ListItemComp";
import NextImage from "next/image";
import { format, parseISO, isValid } from "date-fns";
import ModalComp from "src/components/modalComp";
import { DocumentSvg } from "src/Icons/DocumentSvg";
import * as Yup from "yup";
import { moduleAccess } from "src/utils/module-access";
import CustomerHistoryTable from "src/sections/customer/CustomerHistory/customer-history-table";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import AddCommentModal from "src/sections/customer/CustomerComments/add-comment-modal";
import MotorFleetPolicyCommentsTable from "./motor-fleet-policy-comment-table";
import MotorFleetPolicyTransactionTable from "./motor-fleet-policy-transaction-table";
import MotorFleetPolicyFinanceTable from "./motor-fleet-policy-finance-table";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import MotorPolicyUploadModal from "src/sections/Policies/motor-policy-upload-modal";

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

const MotorFleetPolicyDetail = ({ policyData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { policyId } = router?.query;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const {
    motorFleetPolicyCommentList,
    motorFleetPolicyCommentLoader,
    motorFleetPolicyTransactionList,
    motorFleetPolicyTransactionLoader,
  } = useSelector((state) => state.motorFleetPolicies);

  const [openEditPolicyNo, setOpenEditPolicyNo] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const handleEditPolicyNoClose = () => setOpenEditPolicyNo(false);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

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
            my: 1,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box>
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
              Corporate Company Details
            </Typography>
          </Box>
        </Box>

        <Grid container columnSpacing={3}>
          <Grid item xs={12} sm={12}>
            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Company Name"} value={`${policyData?.fleetdDetailsId?.companyName || "-"} `} />
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Email"} value={`${policyData?.fleetdDetailsId?.email || "-"} `} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Mobile Number"}
                    value={`${policyData?.fleetdDetailsId?.mobileNumber || "-"} `}
                  />
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Trade License Number"}
                    value={policyData?.fleetdDetailsId?.tradeLicenseNo || "-"}
                  />
                  <DividerCustom />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Trade License Expiry"}
                    value={
                      policyData?.fleetdDetailsId?.tradeLicenseExpiryDate
                        ? format(parseISO(policyData?.fleetdDetailsId?.tradeLicenseExpiryDate), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ListItem disablePadding>
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
                              kyc form file
                            </Typography>
                          </Box>
                          <Box sx={{ width: "50%" }}>
                            {policyData?.fleetdDetailsId?.kyc?.path ? (
                              <Typography
                                variant="subtitle2"
                                onClick={() => onDocumentDowmload(policyData?.fleetdDetailsId?.kyc?.path)}
                                gutterBottom
                                sx={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  textDecoration: "underline",
                                  color: "#60176F",
                                  textAlign: { xs: "end", sm: "left" },
                                }}
                              >
                                View File
                              </Typography>
                            ) : (
                              "-"
                            )}
                          </Box>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  </Box>
                </Grid>
              </Grid>
              <Divider />
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ListItem disablePadding>
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
                              Trade License File
                            </Typography>
                          </Box>
                          <Box sx={{ width: "50%" }}>
                            {policyData?.fleetdDetailsId?.tradeLicense?.path ? (
                              <Typography
                                variant="subtitle2"
                                onClick={() => onDocumentDowmload(policyData?.fleetdDetailsId?.tradeLicense?.path)}
                                gutterBottom
                                sx={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  textDecoration: "underline",
                                  color: "#60176F",
                                  textAlign: { xs: "end", sm: "left" },
                                }}
                              >
                                View File
                              </Typography>
                            ) : (
                              "-"
                            )}
                          </Box>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  </Box>
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
          borderBottom: "1px solid #E6E6E6",
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 1,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box>
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
              Current policy Details
            </Typography>
          </Box>
        </Box>

        <Grid container columnSpacing={3}>
          <Grid item xs={12} sm={9}>
            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItem disablePadding>
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
                            }}
                          >
                            Insurance Compoany
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "50%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
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
                            {policyData?.quoteId?.company?.companyName || "-"}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy issue"}
                    value={
                      policyData?.policyEffectiveDate
                        ? format(parseISO(policyData?.policyEffectiveDate), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy expiry"}
                    value={
                      policyData?.policyExpiryDate ? format(parseISO(policyData?.policyExpiryDate), "dd-MM-yyyy") : "-"
                    }
                  />
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItem disablePadding>
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
                            }}
                          >
                            Insurance Company Policy Number
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "50%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
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
                            {policyData?.companyPolicyNumber || "-"}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Ref No"} value={policyData?.policyNumber} />
                </Grid>
              </Grid>

              <Divider />
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
                <Grid item xs={12} sm={3}>
                  <BoxCustom
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      paddingRight: "0 !important",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexFlow: "column",
                        alignItems: "center",
                      }}
                    >
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

                    {formik.touched.file && formik.errors.file && <div>{formik.errors.file}</div>}
                  </BoxCustom>
                </Grid>
              </Box>

              {formik.touched.file && formik.errors.file && <div>{formik.errors.file}</div>}
            </BoxCustom>
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
            {moduleAccess(user, "travelQuote.update") && (
              <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                Add a Comment
              </Button>
            )}
          </Box>
        </Box>

        {motorFleetPolicyCommentLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
            {motorFleetPolicyCommentList && <MotorFleetPolicyCommentsTable items={motorFleetPolicyCommentList} />}
          </Box>
        )}
      </Box>

      <Box
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
          {motorFleetPolicyTransactionLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
              {motorFleetPolicyTransactionList && (
                <MotorFleetPolicyTransactionTable items={motorFleetPolicyTransactionList} policyData={policyData} />
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

      <ModalComp open={open} handleClose={handleClose} width="44rem">
        <AddCommentModal handleClose={handleClose} id={policyId} flag={"motor-fleet-policy"} />
      </ModalComp>
      <ModalComp open={openEditPolicyNo} handleClose={handleEditPolicyNoClose} width="44rem">
        <MotorPolicyUploadModal
          handleEditPolicyNoClose={handleEditPolicyNoClose}
          customerPolicyDetails={policyData}
          keyName={"motorFleet-Policy"}
        />
      </ModalComp>
    </Box>
  );
};

export default MotorFleetPolicyDetail;
