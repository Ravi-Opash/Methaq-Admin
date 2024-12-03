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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import ListItemComp from "src/components/ListItemComp";
import { format, parseISO, isValid } from "date-fns";
import ModalComp from "src/components/modalComp";
import { DocumentSvg } from "src/Icons/DocumentSvg";
import * as Yup from "yup";
import { moduleAccess } from "src/utils/module-access";
import CustomerHistoryTable from "src/sections/customer/CustomerHistory/customer-history-table";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import EditPolicyNumberModal from "src/sections/customer/edit-policy-number-modal";
import { toast } from "react-toastify";
import HealthPolicyFinanceTable from "./health-policy-finance-table";
import HealthPolicyCommentsTable from "./health-policy-comment-table";
import AddCommentModal from "src/sections/customer/CustomerComments/add-comment-modal";
import ViewHealthPolicyModal from "./view-policy-modal";
import HealthPolicyTransactionTable from "./health-policy-transaction-table";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
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

const docsUploadData = {
  Self: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: "Certificate Of Continuity", key: "continuityCertificate", require: true },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: "Cancellation of Visa", key: "cancellationOfVisa", require: true },
      { label: "Change Status", key: "changeStatus", require: true },
    ],
    New: [
      { label: "Passport", key: "passport", require: true },
      { label: "Entry Stamp", key: "entryStamp", require: true },
      { label: "Change Status", key: "changeStatus", require: true },
    ],
  },
  [`Self (Investor)`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: "Certificate Of Continuity", key: "continuityCertificate", require: true },
      { label: "Trade license", key: "tradeLicense", require: true },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
      { label: "Trade license", key: "tradeLicense", require: true },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: "Cancellation of Visa", key: "cancellationOfVisa", require: true },
      { label: "Change Status", key: "changeStatus", require: true },
      { label: "Trade license", key: "tradeLicense", require: true },
    ],
    New: [
      { label: "Passport", key: "passport", require: true },
      { label: "Entry Stamp", key: "entryStamp", require: true },
      { label: "Change Status", key: "changeStatus", require: true },
      { label: "Trade license", key: "tradeLicense", require: true },
    ],
  },
  [`Dependent only`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      {
        label: "Certificate Of Continuity",
        key: "continuityCertificate",
        require: false,
        ownerRequire: true,
        requireCity: ["Abu Dhabi"],
      },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
    ],
    New: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: false, ownerRequire: true },
      { label: "Emirate Id", key: "emiratesId", require: false, ownerRequire: true },
    ],
  },
  [`Investor’s Dependent only`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      {
        label: "Certificate Of Continuity",
        key: "continuityCertificate",
        require: false,
        ownerRequire: true,
        requireCity: ["Abu Dhabi"],
      },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    New: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: false, ownerRequire: true },
      { label: "Emirate Id", key: "emiratesId", require: false, ownerRequire: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
  },
  [`Self and Dependent`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      {
        label: "Certificate Of Continuity",
        key: "continuityCertificate",
        require: false,
        ownerRequire: true,
        requireCity: ["Abu Dhabi"],
      },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
    ],
    New: [
      { label: "Passport", key: "passport", require: true, ownerRequire: true },
      { label: "Visa", key: "visaDoc", require: false, ownerRequire: true },
      { label: "Emirate Id", key: "emiratesId", require: false, ownerRequire: true },
    ],
  },
  [`Self (Investor) and Dependent`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      {
        label: "Certificate Of Continuity",
        key: "continuityCertificate",
        require: false,
        ownerRequire: true,
        requireCity: ["Abu Dhabi"], // require in Abu Dhabi for all
      },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    New: [
      { label: "Passport", key: "passport", require: true, ownerRequire: true },
      { label: "Visa", key: "visaDoc", require: false, ownerRequire: true },
      { label: "Emirate Id", key: "emiratesId", require: false, ownerRequire: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
  },
};

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const HealthPolicyDetail = ({ policyData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { policyId } = router?.query;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const {
    healthPolicyCommentList,
    healthPolicyCommentLoader,
    healthPolicyTransactionList,
    healthPolicyTransactionLoader,
  } = useSelector((state) => state.healthPolicies);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [openEditPolicyNo, setOpenEditPolicyNo] = useState(false);
  const handleEditPolicyNoClose = () => setOpenEditPolicyNo(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const handleViewModalClose = () => setOpenViewModal(false);

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

  //For Doenload Policy Dunction
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

            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Full name"} value={policyData?.healthInfoId?.fullName} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Email"} value={policyData?.healthInfoId?.email} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Date of birth"}
                    value={
                      isValid(parseISO(policyData?.healthInfoId?.dateOfBirth))
                        ? format(parseISO(policyData?.healthInfoId?.dateOfBirth), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Mobile Number"} value={policyData?.healthInfoId?.mobileNumber} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Gender"} value={policyData?.healthInfoId?.gender} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Nationality"} value={policyData?.healthInfoId?.nationality} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"City"} value={policyData?.healthInfoId?.city} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Age"} value={policyData?.healthInfoId?.age} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[policyData?.healthInfoId?.visaStatus]?.map(
                  (ele, i) => {
                    if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("ownerDetails")) {
                      return;
                    }

                    let isRequire = false;
                    if (ele?.ownerRequire) {
                      isRequire = true;
                    } else if (
                      !ele?.require &&
                      ele?.requireCity?.length > 0 &&
                      ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                    ) {
                      isRequire = true;
                    } else if (ele?.require) {
                      isRequire = true;
                    } else {
                      isRequire = false;
                    }
                    return (
                      <>
                        <Grid item xs={12} md={6} key={i}>
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
                                    {ele?.label}
                                    {ele?.ownerRequire ? (
                                      <Span>*</Span>
                                    ) : !ele?.require &&
                                      ele?.requireCity?.length > 0 &&
                                      ele?.requireCity?.includes(policyData?.healthInfoId?.city) ? (
                                      <Span>*</Span>
                                    ) : ele?.require ? (
                                      <Span>*</Span>
                                    ) : (
                                      ""
                                    )}
                                  </Typography>
                                </Box>
                                <Box sx={{ width: "50%" }}>
                                  {policyData?.healthInfoId?.[ele?.key] ? (
                                    <Typography
                                      variant="subtitle2"
                                      onClick={() => {
                                        onDocumentDowmload(policyData?.healthInfoId?.[ele?.key]?.path);
                                      }}
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
                        </Grid>
                      </>
                    );
                  }
                )}
              </Grid>
            </List>
          </Grid>
        </Grid>
      </Box>
      {/* {"Spouse details"} */}
      {policyData?.healthInfoId?.spouseDetails?.length > 0 && (
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
                Spouse Details
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell>DOB</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Gender</TableCell>
                    {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                      policyData?.healthInfoId?.visaStatus
                    ]?.map((ele, i) => {
                      if (ele?.requireCity?.length > 0 && !ele?.requireCity?.includes(policyData?.healthInfoId?.city)) {
                        return <></>;
                      }
                      if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("spouseDetails")) {
                        return;
                      }
                      return (
                        <TableCell key={i}>
                          {ele?.label}
                          {!ele?.require &&
                          ele?.requireCity?.length > 0 &&
                          ele?.requireCity?.includes(policyData?.healthInfoId?.city) ? (
                            <Span>*</Span>
                          ) : ele?.require ? (
                            <Span>*</Span>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {policyData?.healthInfoId?.spouseDetails?.map((item, idx) => {
                    return (
                      <TableRow
                        hover
                        // sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{item?.fullName}</TableCell>
                        <TableCell>
                          {isValid(parseISO(item?.dateOfBirth))
                            ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                            : "Start date"}
                        </TableCell>
                        <TableCell>{item?.age}</TableCell>
                        <TableCell>{item?.gender}</TableCell>
                        {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                          policyData?.healthInfoId?.visaStatus
                        ]?.map((ele, i) => {
                          if (
                            ele?.requireCity?.length > 0 &&
                            !ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            return <></>;
                          }
                          if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("spouseDetails")) {
                            return;
                          }
                          let isRequire = false;
                          if (
                            !ele?.require &&
                            ele?.requireCity?.length > 0 &&
                            ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            isRequire = true;
                          } else if (ele?.require) {
                            isRequire = true;
                          } else {
                            isRequire = false;
                          }
                          return (
                            <TableCell key={i}>
                              {policyData?.healthInfoId?.[ele?.key] ? (
                                <Typography
                                  variant="subtitle2"
                                  onClick={() => {
                                    onDocumentDowmload(policyData?.healthInfoId?.[ele?.key]?.path);
                                  }}
                                  gutterBottom
                                  sx={{
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    color: "#60176F",
                                    textAlign: { xs: "end", sm: "left" },
                                  }}
                                >
                                  View File
                                </Typography>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Box>
      )}
      {/* {"kids details"} */}
      {policyData?.healthInfoId?.kidsDetails?.length > 0 && (
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
                Kids Details
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    {/* <TableCell>Policy No</TableCell> */}
                    <TableCell>DOB</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Gender</TableCell>
                    {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                      policyData?.healthInfoId?.visaStatus
                    ]?.map((ele, i) => {
                      if (ele?.requireCity?.length > 0 && !ele?.requireCity?.includes(policyData?.healthInfoId?.city)) {
                        return <></>;
                      }
                      if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("kidsDetails")) {
                        return;
                      }
                      return (
                        <TableCell key={i}>
                          {ele?.label}
                          {!ele?.require &&
                          ele?.requireCity?.length > 0 &&
                          ele?.requireCity?.includes(policyData?.healthInfoId?.city) ? (
                            <Span>*</Span>
                          ) : ele?.require ? (
                            <Span>*</Span>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {policyData?.healthInfoId?.kidsDetails?.map((item, idx) => {
                    return (
                      <TableRow
                        hover
                        // sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{item?.fullName}</TableCell>
                        <TableCell>
                          {isValid(parseISO(item?.dateOfBirth))
                            ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                            : "Start date"}
                        </TableCell>
                        <TableCell>{item?.age}</TableCell>
                        <TableCell>{item?.gender}</TableCell>
                        {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                          policyData?.healthInfoId?.visaStatus
                        ]?.map((ele, i) => {
                          if (
                            ele?.requireCity?.length > 0 &&
                            !ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            return <></>;
                          }
                          if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("kidsDetails")) {
                            return;
                          }
                          let isRequire = false;
                          if (
                            !ele?.require &&
                            ele?.requireCity?.length > 0 &&
                            ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            isRequire = true;
                          } else if (ele?.require) {
                            isRequire = true;
                          } else {
                            isRequire = false;
                          }
                          return (
                            <TableCell>
                              {policyData?.healthInfoId?.[ele?.key] ? (
                                <Typography
                                  variant="subtitle2"
                                  onClick={() => {
                                    onDocumentDowmload(policyData?.healthInfoId?.[ele?.key]?.path);
                                  }}
                                  gutterBottom
                                  sx={{
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    color: "#60176F",
                                    textAlign: { xs: "end", sm: "left" },
                                  }}
                                >
                                  View File
                                </Typography>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Box>
      )}
      {/* {"Parents details"} */}
      {policyData?.healthInfoId?.parentDetails?.length > 0 && (
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
                Parents Details
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    {/* <TableCell>Policy No</TableCell> */}
                    <TableCell>DOB</TableCell>
                    <TableCell>Gender</TableCell>
                    {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                      policyData?.healthInfoId?.visaStatus
                    ]?.map((ele, i) => {
                      if (ele?.requireCity?.length > 0 && !ele?.requireCity?.includes(policyData?.healthInfoId?.city)) {
                        return <></>;
                      }
                      if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("parentDetails")) {
                        return;
                      }
                      return (
                        <TableCell key={i}>
                          {ele?.label}
                          {!ele?.require &&
                          ele?.requireCity?.length > 0 &&
                          ele?.requireCity?.includes(policyData?.healthInfoId?.city) ? (
                            <Span>*</Span>
                          ) : ele?.require ? (
                            <Span>*</Span>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {policyData?.healthInfoId?.parentDetails?.map((item, idx) => {
                    return (
                      <TableRow
                        hover
                        // sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{item?.fullName}</TableCell>
                        <TableCell>
                          {isValid(parseISO(item?.dateOfBirth))
                            ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                            : "Start date"}
                        </TableCell>
                        <TableCell>{item?.gender}</TableCell>
                        {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                          policyData?.healthInfoId?.visaStatus
                        ]?.map((ele, i) => {
                          if (
                            ele?.requireCity?.length > 0 &&
                            !ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            return <></>;
                          }
                          if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("parentDetails")) {
                            return;
                          }
                          let isRequire = false;
                          if (
                            !ele?.require &&
                            ele?.requireCity?.length > 0 &&
                            ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            isRequire = true;
                          } else if (ele?.require) {
                            isRequire = true;
                          } else {
                            isRequire = false;
                          }
                          return (
                            <TableCell>
                              {policyData?.healthInfoId?.[ele?.key] ? (
                                <Typography
                                  variant="subtitle2"
                                  onClick={() => {
                                    onDocumentDowmload(policyData?.healthInfoId?.[ele?.key]?.path);
                                  }}
                                  gutterBottom
                                  sx={{
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    color: "#60176F",
                                    textAlign: { xs: "end", sm: "left" },
                                  }}
                                >
                                  View File
                                </Typography>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Box>
      )}
      {/* {"other family memners details"} */}
      {policyData?.healthInfoId?.otherFamilyDependentsDetails?.length > 0 && (
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
                Other Dependents Details
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    {/* <TableCell>Policy No</TableCell> */}
                    <TableCell>DOB</TableCell>
                    <TableCell>Gender</TableCell>
                    {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                      policyData?.healthInfoId?.visaStatus
                    ]?.map((ele, i) => {
                      if (ele?.requireCity?.length > 0 && !ele?.requireCity?.includes(policyData?.healthInfoId?.city)) {
                        return <></>;
                      }
                      if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("otherFamilyDependentsDetails")) {
                        return;
                      }
                      return (
                        <TableCell key={i}>
                          {ele?.label}
                          {!ele?.require &&
                          ele?.requireCity?.length > 0 &&
                          ele?.requireCity?.includes(policyData?.healthInfoId?.city) ? (
                            <Span>*</Span>
                          ) : ele?.require ? (
                            <Span>*</Span>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {policyData?.healthInfoId?.otherFamilyDependentsDetails?.map((item, idx) => {
                    return (
                      <TableRow
                        hover
                        // sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{item?.fullName}</TableCell>
                        <TableCell>
                          {isValid(parseISO(item?.dateOfBirth))
                            ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                            : "Start date"}
                        </TableCell>
                        <TableCell>{item?.gender}</TableCell>
                        {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                          policyData?.healthInfoId?.visaStatus
                        ]?.map((ele, i) => {
                          if (
                            ele?.requireCity?.length > 0 &&
                            !ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            return <></>;
                          }
                          if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("otherFamilyDependentsDetails")) {
                            return;
                          }
                          let isRequire = false;
                          if (
                            !ele?.require &&
                            ele?.requireCity?.length > 0 &&
                            ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            isRequire = true;
                          } else if (ele?.require) {
                            isRequire = true;
                          } else {
                            isRequire = false;
                          }
                          return (
                            <TableCell>
                              {policyData?.healthInfoId?.[ele?.key] ? (
                                <Typography
                                  variant="subtitle2"
                                  onClick={() => {
                                    onDocumentDowmload(policyData?.healthInfoId?.[ele?.key]?.path);
                                  }}
                                  gutterBottom
                                  sx={{
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    color: "#60176F",
                                    textAlign: { xs: "end", sm: "left" },
                                  }}
                                >
                                  View File
                                </Typography>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Box>
      )}
      {/* {"Workers details"} */}
      {policyData?.healthInfoId?.domesticWorkerDetails?.length > 0 && (
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
                Workers Details
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    {/* <TableCell>Policy No</TableCell> */}
                    <TableCell>DOB</TableCell>
                    <TableCell>Gender</TableCell>
                    {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                      policyData?.healthInfoId?.visaStatus
                    ]?.map((ele, i) => {
                      if (ele?.requireCity?.length > 0 && !ele?.requireCity?.includes(policyData?.healthInfoId?.city)) {
                        return <></>;
                      }
                      if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("domesticWorkerDetails")) {
                        return;
                      }
                      return (
                        <TableCell key={i}>
                          {ele?.label}
                          {!ele?.require &&
                          ele?.requireCity?.length > 0 &&
                          ele?.requireCity?.includes(policyData?.healthInfoId?.city) ? (
                            <Span>*</Span>
                          ) : ele?.require ? (
                            <Span>*</Span>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {policyData?.healthInfoId?.domesticWorkerDetails?.map((item, idx) => {
                    return (
                      <TableRow
                        hover
                        // sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{item?.fullName}</TableCell>
                        <TableCell>
                          {isValid(parseISO(item?.dateOfBirth))
                            ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                            : "Start date"}
                        </TableCell>
                        <TableCell>{item?.gender}</TableCell>
                        {docsUploadData?.[policyData?.healthInfoId?.insurerType]?.[
                          policyData?.healthInfoId?.visaStatus
                        ]?.map((ele, i) => {
                          if (
                            ele?.requireCity?.length > 0 &&
                            !ele?.requireCity?.includes(policyData?.healthInfoId?.city)
                          ) {
                            return <></>;
                          }
                          if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("domesticWorkerDetails")) {
                            return;
                          }
                          return (
                            <TableCell>
                              {policyData?.healthInfoId?.[ele?.key] ? (
                                <Typography
                                  variant="subtitle2"
                                  onClick={() => {
                                    onDocumentDowmload(policyData?.healthInfoId?.[ele?.key]?.path);
                                  }}
                                  gutterBottom
                                  sx={{
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    color: "#60176F",
                                    textAlign: { xs: "end", sm: "left" },
                                  }}
                                >
                                  View File
                                </Typography>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Box>
      )}

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
        </Box>

        <Grid container columnSpacing={3}>
          <Grid item xs={12} sm={9}>
            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Company"} value={policyData?.quoteId?.companyData?.companyName} />
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Insurance Type"} value={policyData?.healthInfoId?.insurerType || "-"} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy Issue"}
                    value={
                      policyData?.policyIssueDate ? format(parseISO(policyData?.policyIssueDate), "dd-MM-yyyy") : "-"
                    }
                  />
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy expiry"}
                    value={
                      policyData?.policyExpiryDate ? format(parseISO(policyData?.policyExpiryDate), "dd-MM-yyyy") : "-"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Ref No"} value={policyData?.policyNumber || "-"} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Company Policy No"} value={policyData?.companyPolicyNumber} />
                </Grid>
              </Grid>
              <Divider />
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy Effective date"}
                    value={
                      policyData?.activeEffectiveDate
                        ? format(parseISO(policyData?.activeEffectiveDate), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}></Grid>
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
                <Box
                  sx={{
                    display: "flex",
                    color: "#707070",
                    cursor: "pointer",
                    flexFlow: "column",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    if (!moduleAccess(user, "healthQuote.update")) {
                      toast.error("You don't have permission to Update!");
                      return;
                    }
                    setOpenEditPolicyNo(true);
                  }}
                >
                  <Tooltip title="Click to udpate policy pdf" arrow>
                    <DocumentSvg sx={{ fontSize: "70px" }} />
                  </Tooltip>
                  {moduleAccess(user, "healthQuote.update") && (
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
                  )}
                </Box>

                {policyData?.policyFile && (
                  <Typography
                    onClick={() => setOpenViewModal(true)}
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
                )}
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
      </Box>

      <ModalComp open={open} handleClose={handleClose} width="44rem">
        <AddCommentModal handleClose={handleClose} id={policyId} flag={"health-policy"} />
      </ModalComp>

      <ModalComp open={openEditPolicyNo} handleClose={handleEditPolicyNoClose} width="44rem">
        <EditPolicyNumberModal
          handleEditPolicyNoClose={handleEditPolicyNoClose}
          customerPolicyDetails={policyData}
          keyName={`Health-Policy`}
        />
      </ModalComp>
      <ModalComp open={openViewModal} handleClose={handleViewModalClose} width="44rem">
        <ViewHealthPolicyModal
          handleEditPolicyNoClose={handleViewModalClose}
          customerPolicyDetails={policyData}
          keyName={`Health-Policy`}
        />
      </ModalComp>
    </Box>
  );
};

export default HealthPolicyDetail;
