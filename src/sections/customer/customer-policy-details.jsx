import React, { useEffect, useRef, useState } from "react";
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
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import ListItemComp from "src/components/ListItemComp";
import NextImage from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO, isValid } from "date-fns";
import CustomerClaimsTable from "./CustomerClaims/customer-claims-table";
import CustomerHistoryTable from "./CustomerHistory/customer-history-table";
import CustomerAddOnsTable from "./CustomerAddOns/customer-add-ons-table";
import CustomerCommentsTable from "./CustomerComments/customer-comments-table";
import CustomerTransactionTable from "./CustomerTransactions/customer-transaction-table";
import ModalComp from "src/components/modalComp";
import AddCommentModal from "./CustomerComments/add-comment-modal";
import { DocumentSvg } from "src/Icons/DocumentSvg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import {
  ReSendEmailByPolicyId,
  getCustomerPolicyDetailById,
  postCustomerPolicyDocByCustomerId,
  sendPolicieBySMS,
} from "./action/customerAction";
import { toast } from "react-toastify";
import EditPolicyNumberModal from "./edit-policy-number-modal";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import { EditIcon } from "src/Icons/EditIcon";
import { editCompanyToPolicy, editPolicyNumber } from "../Policies/action/policiesAction";
import PolicyFinanceTable from "../Policies/policy-finance-table";
import MotorPolicyUploadModal from "../Policies/motor-policy-upload-modal";
import { getAllCarCompanies } from "../companies/action/companyAcrion";
import PdfViewer from "src/components/pdf-as-image";

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

const CustomerPolicyDetails = ({
  handleTransactionsListPageChange,
  handleTransactionsListRowsPerPageChange,
  handleHistoryListPageChange,
  handleHistoryListRowsPerPageChange,
  handleAddOnsListPageChange,
  handleAddOnsListRowsPerPageChange,
  handleCommentListPageChange,
  handleCommentListRowsPerPageChange,
  isActionHide,
}) => {
  const {
    customerPolicyDetails,
    customerTransactionsList,
    customerTransactionsListLoader,
    customerTransactionsListPagination,
    customerTransactionsListCustomPagination,
    customerHistoryList,
    customerHistoryListLoader,
    customerHistoryListPagination,
    customerHistoryListCustomPagination,
    customerAddOnsList,
    customerAddOnsListLoader,
    customerAddOnsListPagination,
    customerAddOnsListCustomPagination,
    customerCommentList,
    customerCommentListLoader,
    customerCommentListPagination,
    customerCommentListCustomPagination,
  } = useSelector((state) => state.customer);

  const { loginUserData: user } = useSelector((state) => state.auth);
  const { allCarInsuranceCompanyList } = useSelector((state) => state.company);

  const router = useRouter();
  const { policyId } = router.query;

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [openEditPolicyNo, setOpenEditPolicyNo] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const handleEditPolicyNoClose = () => setOpenEditPolicyNo(false);

  const [newValue, setNewValue] = useState(customerPolicyDetails?.companyPolicyNumber || "-");

  const [isCompanyEditable, setIsCompanyEditable] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(customerPolicyDetails?.quoteId?.company?._id || "");

  const initialized = useRef(false);
  // Get Motor Company List - To change insurance company
  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    dispatch(getAllCarCompanies({ key: "motor", search: "" }))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
  }, []);

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

  const fileUploadHandler = (event) => {
    formik.setFieldValue("file", event.currentTarget.files[0]);
    const formData = new FormData();
    formData.append(
      "policyNumber",
      customerPolicyDetails?.policyNumber || customerPolicyDetails?.response?.PolicyNumber
    );
    formData.append("policy", event.currentTarget.files[0]);

    if (customerPolicyDetails) {
      dispatch(
        postCustomerPolicyDocByCustomerId({
          id: policyId,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          // console.log("res", res);
          if (res) {
            toast("Successfully uploaded", {
              type: "success",
            });
            dispatch(getCustomerPolicyDetailById(policyId));
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
  };

  const resendEmailHandler = () => {
    dispatch(ReSendEmailByPolicyId(policyId))
      .unwrap()
      .then((res) => {
        if (res) {
          toast(res?.message, {
            type: "success",
          });
        }
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  const sendPolicieBySms = () => {
    dispatch(
      sendPolicieBySMS({
        id: policyId,
        toMobileNumber: customerPolicyDetails?.userId?.mobileNumber,
      })
    )
      .unwrap()
      .then((res) => {
        // console.log("res", res);
        if (res) {
          toast(res?.data?.status, {
            type: "success",
          });
        }
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  const onSubmitChange = (value) => {
    dispatch(editPolicyNumber({ companyPolicyNumber: value, policyId: policyId }))
      .unwrap()
      .then((res) => {
        dispatch(getCustomerPolicyDetailById(policyId));
        toast.success("SuccessFully Updated");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setIsEditable(false);
  };

  const onCompanyChange = (value) => {
    dispatch(editCompanyToPolicy({ companyId: value, policyId: policyId }))
      .unwrap()
      .then((res) => {
        dispatch(getCustomerPolicyDetailById(policyId));
        toast.success("SuccessFully Updated");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setIsEditable(false);
  };

  return (
    <Box sx={{ display: "flex", flexFlow: "column" }}>
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderBottom: "1px solid #F2F4F7",
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
          }}
        >
          Car details
        </Typography>

        <Grid container columnSpacing={4}>
          <Grid item xs={12} sm={9}>
            <List sx={{ py: 0 }}>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Brand"} value={customerPolicyDetails?.carId?.make} />

                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Value"}
                    value={`AED ${formatNumber(
                      customerPolicyDetails?.carId?.price || customerPolicyDetails?.quoteId?.carValue
                    )}`}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Model"} value={customerPolicyDetails?.carId?.model} />

                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"No. of clynders"}
                    value={
                      customerPolicyDetails?.carId?.cylinders ? customerPolicyDetails?.carId?.cylinders : "clynders"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Trim"}
                    value={customerPolicyDetails?.carId?.trim ? customerPolicyDetails?.carId?.trim : "Trim"}
                  />

                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Year"} value={customerPolicyDetails?.carId?.year} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Body type"}
                    value={
                      customerPolicyDetails?.carId?.bodyType ? customerPolicyDetails?.carId?.bodyType : "Body type"
                    }
                  />
                </Grid>
              </Grid>
            </List>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box sx={{ display: "flex", flexFlow: "column" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  height: "100%",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                {/* <Img
                  src={baseURL + "/" + customerPolicyDetails?.carId?.registrationCardP?.path}
                  alt="registrationCardP"
                  height={120}
                  width={200}
                  style={{
                    borderRadius: "0.75rem",
                    objectFit: "cover",
                    width: "100%",
                    maxWidth: "200px",
                  }}
                /> */}
                <PdfViewer
                  pdfUrl={baseURL + "/" + customerPolicyDetails?.carId?.registrationCardP?.path}
                  Component={Img}
                  imgHeight={120}
                  imgWidth={200}
                />
              </Box>

              {customerPolicyDetails?.carId?.registrationCardP && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <a
                    href={baseURL + "/" + customerPolicyDetails?.carId?.registrationCardP?.path}
                    download={customerPolicyDetails?.carId?.registrationCardP?.filename}
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
                      Download
                    </Typography>
                  </a>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          mt: 3,
          borderBottom: "1px solid #E6E6E6",
        }}
      >
        <Grid container columnSpacing={4}>
          <Grid item xs={12} sm={9}>
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
              Customer details
            </Typography>

            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Insured Name"} value={customerPolicyDetails?.userId?.fullName} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Nationality"}
                    value={
                      customerPolicyDetails?.userId?.nationality ? customerPolicyDetails?.userId?.nationality : "-"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Insured Email"}
                    // value={customerPolicyDetails?.userId?.dateOfBirth}
                    value={customerPolicyDetails?.userId?.email || "-"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Date of birth"}
                    // value={customerPolicyDetails?.userId?.dateOfBirth}
                    value={
                      isValid(parseISO(customerPolicyDetails?.userId?.dateOfBirth))
                        ? format(parseISO(customerPolicyDetails?.userId?.dateOfBirth), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Age"} value={customerPolicyDetails?.userId?.age || "-"} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Employer"} value={customerPolicyDetails?.userId?.employer || "-"} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"ID Number"}
                    value={customerPolicyDetails?.userId?.emiratesId ? customerPolicyDetails?.userId?.emiratesId : "-"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"ID Expiry"}
                    value={
                      isValid(parseISO(customerPolicyDetails?.userId?.emiratesIdExpiryDate))
                        ? format(parseISO(customerPolicyDetails?.userId?.emiratesIdExpiryDate), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Driving license Issue"}
                    value={
                      isValid(parseISO(customerPolicyDetails?.userId?.licenceIssueDate))
                        ? format(parseISO(customerPolicyDetails?.userId?.licenceIssueDate), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Driving license expiry"}
                    value={
                      isValid(parseISO(customerPolicyDetails?.userId?.licenceExpiryDate))
                        ? format(parseISO(customerPolicyDetails?.userId?.licenceExpiryDate), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Driving license source"}
                    value={customerPolicyDetails?.userId?.placeOfIssueDL || "-"}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Driving license no."}
                    value={customerPolicyDetails?.userId?.licenceNo ? customerPolicyDetails?.userId?.licenceNo : "-"}
                  />
                </Grid>
              </Grid>
            </List>
          </Grid>

          <Grid item xs={12} sm={3}>
            <BoxCustom
              sx={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
                pr: 3,
              }}
            >
              <Box sx={{ display: "flex", flexFlow: "column" }}>
                {/* <Img
                  src={baseURL + "/" + customerPolicyDetails?.userId?.emiratesIdP?.path}
                  alt="emiratesIdP"
                  height={120}
                  width={200}
                  style={{
                    borderRadius: "0.75rem",
                    objectFit: "cover",
                    width: "100%",
                    maxWidth: "200px",
                  }}
                /> */}

                <PdfViewer
                  pdfUrl={baseURL + "/" + customerPolicyDetails?.userId?.emiratesIdP?.path}
                  Component={Img}
                  imgHeight={120}
                  imgWidth={200}
                />

                {customerPolicyDetails?.userId?.emiratesIdP && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <a
                      href={baseURL + "/" + customerPolicyDetails?.userId?.emiratesIdP?.path}
                      download={customerPolicyDetails?.userId?.emiratesIdP?.filename}
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
                        Download
                      </Typography>
                    </a>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: "flex", flexFlow: "column" }}>
                {/* <Img
                  src={baseURL + "/" + customerPolicyDetails?.userId?.drivingLicenseP?.path}
                  alt="drivingLicenseP"
                  height={120}
                  width={200}
                  style={{
                    borderRadius: "0.75rem",
                    objectFit: "cover",
                    width: "100%",
                    maxWidth: "200px",
                  }}
                /> */}
                <PdfViewer
                  pdfUrl={baseURL + "/" + customerPolicyDetails?.userId?.drivingLicenseP?.path}
                  Component={Img}
                  imgHeight={120}
                  imgWidth={200}
                />

                {customerPolicyDetails?.userId?.drivingLicenseP && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <a
                      href={baseURL + "/" + customerPolicyDetails?.userId?.drivingLicenseP?.path}
                      download={customerPolicyDetails?.userId?.drivingLicenseP?.filename}
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
                        Download
                      </Typography>
                    </a>
                  </Box>
                )}
              </Box>
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
              Current policy
            </Typography>
          </Box>

          <Box>
            {!isActionHide && (
              <>
                <Box sx={{ display: "inline-block", mr: 2 }}>
                  {moduleAccess(user, "policies.update") && (
                    <Button type="button" variant="contained" onClick={() => sendPolicieBySms()}>
                      Send by SMS
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: "inline-block", mr: 2 }}>
                  {moduleAccess(user, "policies.update") && (
                    <Button type="button" variant="contained" onClick={() => resendEmailHandler()}>
                      Re-send email
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>

        <Grid container columnSpacing={3}>
          <Grid item xs={12} sm={9}>
            <List>
              <Grid container columnSpacing={4}>
                {/* <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Company"}
                    value={customerPolicyDetails?.quoteId?.company?.companyName}
                  />
                  <DividerCustom />
                </Grid> */}
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
                          {!isCompanyEditable ? (
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
                              {customerPolicyDetails?.quoteId?.company?.companyName || "-"}
                            </Typography>
                          ) : (
                            <TextField
                              sx={{ width: "200px" }}
                              label="Company"
                              name="companyName"
                              defaultValue={customerPolicyDetails?.quoteId?.company?._id || ""}
                              select
                              SelectProps={{ native: true }}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setSelectedCompany(newValue);
                              }}
                            >
                              <option value={""}></option>
                              {allCarInsuranceCompanyList?.map((company, idx) => {
                                return <option value={company?._id}>{company?.companyName}</option>;
                              })}
                            </TextField>
                          )}
                          {moduleAccess(user, "policies.update") && (
                            <>
                              {!isCompanyEditable ? (
                                <EditIcon
                                  onClick={() => setIsCompanyEditable(true)}
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
                                  onClick={() => onCompanyChange(selectedCompany)}
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
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy issue"}
                    value={
                      customerPolicyDetails?.response?.PolicyEffectiveDate &&
                      format(parseISO(customerPolicyDetails?.response?.PolicyEffectiveDate), "dd-MM-yyyy")
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
                      customerPolicyDetails?.response?.PolicyExpiryDate &&
                      format(parseISO(customerPolicyDetails?.response?.PolicyExpiryDate), "dd-MM-yyyy")
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
                          {!isEditable ? (
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
                              {customerPolicyDetails?.companyPolicyNumber || "-"}
                            </Typography>
                          ) : (
                            <TextField
                              sx={{ width: "140px" }}
                              label="Policy No"
                              name="premium"
                              defaultValue={customerPolicyDetails?.companyPolicyNumber || ""}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setNewValue(newValue);
                              }}
                            />
                          )}
                          {moduleAccess(user, "policies.update") && (
                            <>
                              {!isEditable ? (
                                <EditIcon
                                  onClick={() => setIsEditable(true)}
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
                                  onClick={() => onSubmitChange(newValue)}
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
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Type"}
                    value={
                      (customerPolicyDetails?.quoteId?.insuranceType == "thirdparty"
                        ? "Third Party"
                        : customerPolicyDetails?.quoteId?.insuranceType == "comprehensive"
                        ? "Comprehensive"
                        : "-") + (customerPolicyDetails?.quoteId?.basicQuote ? "(Basic)" : "")
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Ref No"}
                    value={customerPolicyDetails?.policyNumber || customerPolicyDetails?.response?.PolicyNumber}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Repair Type"}
                    value={
                      customerPolicyDetails?.quoteId?.basicQuote
                        ? "-"
                        : customerPolicyDetails?.quoteId?.repairType
                        ? customerPolicyDetails?.quoteId?.repairType === "nonagency"
                          ? "Non Agency"
                          : "Agency"
                        : customerPolicyDetails?.quoteId?.insuranceType == "thirdparty"
                        ? "Third Party"
                        : "Non Agency"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Source"} value={customerPolicyDetails?.quoteId?.source || "-"} />
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
                {/* <IconButton
                  color="#707070"
                  backgroundColor="none"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  sx={{
                    flexDirection: "column",
                    cursor: "pointer",
                    "&:hover": {
                      background: "none",
                    },
                    p: 0,
                  }}
                >
                  <input
                    // accept="image/*"
                    accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                    id="file"
                    type="file"
                    name="file"
                    onChange={(event) => {
                      fileUploadHandler(event);
                    }}
                    onBlur={formik.handleBlur}
                    style={{ display: "none" }}
                  />
                  <DocumentSvg sx={{ fontSize: "70px" }} />

                  <Typography
                    variant="subtitle2"
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
                </IconButton> */}

                {moduleAccess(user, "policies.update") && (
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

                {customerPolicyDetails?.policyFile && (
                  <a
                    href={baseURL + "/" + customerPolicyDetails?.policyFile?.path}
                    download={customerPolicyDetails?.policyFile?.filename}
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
        </Grid>
      </Box>

      {/* <Box
        sx={{ display: "inline-block", width: "100%", borderBottom: "1px solid #E6E6E6", mt: 2 }}
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
          }}
        >
          Claims
        </Typography>

        <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
          <CustomerClaimsTable />
        </Box>
      </Box> */}

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

        {customerTransactionsListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
            {customerTransactionsList && (
              <CustomerTransactionTable
                count={customerTransactionsListPagination?.totalItems}
                items={customerTransactionsList}
                onPageChange={handleTransactionsListPageChange}
                onRowsPerPageChange={handleTransactionsListRowsPerPageChange}
                page={customerTransactionsListCustomPagination?.page - 1}
                rowsPerPage={customerTransactionsListCustomPagination?.size}
              />
            )}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderBottom: "1px solid #E6E6E6",
          mt: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            width: "100%",
            py: 1.5,
            mb: 0,
            backgroundColor: "#f5f5f5",
            fontWeight: "600",
            fontSize: "18px",
            display: "inline-block",
            color: "#60176F",
            px: "14px",
          }}
        >
          History
        </Typography>

        {customerHistoryListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
            {customerHistoryList && <CustomerHistoryTable items={customerPolicyDetails} />}
          </Box>
        )}
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
            Add ons
          </Typography>
        </Box>

        {customerAddOnsListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
            {customerAddOnsList && (
              <CustomerAddOnsTable
                count={customerAddOnsListPagination?.totalItems}
                items={customerAddOnsList}
                onPageChange={handleAddOnsListPageChange}
                onRowsPerPageChange={handleAddOnsListRowsPerPageChange}
                page={customerAddOnsListCustomPagination?.page - 1}
                rowsPerPage={customerAddOnsListCustomPagination?.size}
              />
            )}
          </Box>
        )}
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

          {!isActionHide && (
            <Box sx={{ display: "inline-block", mr: 2 }}>
              {moduleAccess(user, "policies.update") && (
                <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                  Add a Comment
                </Button>
              )}
            </Box>
          )}
        </Box>

        {customerCommentListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
            {customerCommentList && (
              <CustomerCommentsTable
                count={customerCommentListPagination?.totalItems}
                items={customerCommentList}
                onPageChange={handleCommentListPageChange}
                onRowsPerPageChange={handleCommentListRowsPerPageChange}
                page={customerCommentListCustomPagination?.page - 1}
                rowsPerPage={customerCommentListCustomPagination?.size}
              />
            )}
          </Box>
        )}
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
            Finance
          </Typography>
        </Box>

        {customerAddOnsListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
            {customerAddOnsList && <PolicyFinanceTable />}
          </Box>
        )}
      </Box>

      <ModalComp open={open} handleClose={handleClose} width="44rem">
        <AddCommentModal handleClose={handleClose} id={policyId} flag={"car-policy"} />
      </ModalComp>

      <ModalComp open={openEditPolicyNo} handleClose={handleEditPolicyNoClose} width="44rem">
        <MotorPolicyUploadModal
          handleEditPolicyNoClose={handleEditPolicyNoClose}
          customerPolicyDetails={customerPolicyDetails}
          keyName={"Car-Policy"}
        />
      </ModalComp>
    </Box>
  );
};

export default CustomerPolicyDetails;
