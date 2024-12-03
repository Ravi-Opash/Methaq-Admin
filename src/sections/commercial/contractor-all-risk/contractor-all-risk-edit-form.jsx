"use client";
import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import YNSwitch from "src/components/YNSwitch";
import PhoneNumberInput from "src/components/phoneInput-field";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { editContractorDetailsById, getCommercialDetailById } from "./Action/commercialAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import AnimationLoader from "src/components/amimated-loader";

// Custom styled span component
const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

// Yup validation schema for form fields
const schema = Yup.object({
  principalName: Yup.string().required("Principal name is required"),
  assuredType: Yup.string().required("Assured Type is required"),
  contractorName: Yup.string().required("contractor name is required"),
  tradeLicenseNo: Yup.string().required("tradeLicense No is required"),
  businessAddress: Yup.string().required("businessAddress is required"),
  emirates: Yup.string().required("emirates is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "invalid email"),
  mobileNumber: Yup.string()
    .min(9)
    .max(9)
    .required("Mobile number is required")
    .matches(/^5/, "Mobile number should starts with 5"),
  //   telephoneNo: Yup.string().min(8).max(8).required("Telephone number is required"),
  businessActivity: Yup.string().required("Business activity is required"),
  law: Yup.string().required("law required"),
  territorialLimit: Yup.string().required("territorial limit is required"),
  scopeOfWork: Yup.string().required("scope of work is required"),
  remarks: Yup.string().max(500).notRequired(),
  projectTitle: Yup.string().max(500).required("Project title is required"),
  projectDescription: Yup.string().max(500).required("Project description is required"),
  projectLocation: Yup.string().max(500).required("Project location is required"),
  policyFrom: Yup.string().required("policy from is required"),
  policyTo: Yup.string().required("policy to is required"),
  maintenanceFrom: Yup.string().required("maintenance from is required"),
  maintenanceTo: Yup.string().required("maintenance To is required"),
  // Condition from portal given by Tony
  estimatedContractValue: Yup.number().when("scopeOfWork", (scopeofWork, schema) => {
    if (scopeofWork[0] === "Construction of Villa") {
      return schema.min(300000).max(10000000).required("Is required for Construction of Villa");
    } else if (scopeofWork[0] === "Construction of building") {
      return schema.min(1000000).max(20000000).required("Is required for Construction of Villa");
    } else if (scopeofWork[0] === "Fit out works") {
      return schema.min(10000).max(5000000).required("Is required for Construction of Villa");
    } else if (scopeofWork[0] === "Building Maintenance") {
      return schema.min(10000).max(2000000).required("Is required for Construction of Villa");
    } else if (scopeofWork[0] === "Soft landscaping") {
      return schema.min(10000).max(1000000).required("Is required for Construction of Villa");
    }
    return schema;
  }),
  principalsExistingProperty: Yup.number().max(1000000).notRequired(),
  contractorsPlantMachinery: Yup.number().max(1000000).notRequired(),
  temporarySiteFacilities: Yup.number().max(1000000).notRequired(),
  removalOfDebris: Yup.number().max(1000000).notRequired(),
  totalSumInsured: Yup.number().required("is required"),
  limitOfIndemnity: Yup.number().max(1000000).required("is required"),
  limitOfIndemnityAggregate: Yup.number().max(1000000).required("is required"),

  projectMidway: Yup.string().when("projectMidwayYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  projectOffshore: Yup.string().when("projectOffshoreYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  wetWorksInvolved: Yup.string().when("wetWorksInvolvedYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  projectStartedTwoMonthsEarlier: Yup.string().when("projectStartedTwoMonthsEarlierYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  projectStartAfterTwoMonth: Yup.string().when("projectStartAfterTwoMonthYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
}).required();

const proposerEm = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];

const businessAct = [
  "Accountancy, banking and finance",
  "Business, consulting and management",
  "Charity and voluntary work",
  "Creative arts and design",
  "Energy and utilities",
  "Engineering and manufacturing",
  "Environment and agriculture",
  "Healthcare",
  "Hospitality and events management",
  "Information technology",
  "Insurance",
  "Law",
  "Law enforcement and security",
  "Leisure, sport and tourism",
  "Marketing, advertising and PR",
  "Media and internet",
  "Property and construction",
  "Public services and administration",
  "Recruitment and HR",
  "Retail",
  "Sales",
  "Science and pharmaceuticals",
  "Social Service",
  "Teacher training and education",
  "Transport and logistics",
  "Contractor",
  "Others",
];

const scopeofWork = [
  "Construction of Villa",
  "Construction of building",
  "Fit out works",
  "Building Maintenance",
  "Soft landscaping",
];

// The main component for editing contractor details
const EditContractorAllRiskDetailForm = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { commercialId } = router.query;

  // Retrieve contractor details from Redux store
  const { contractorAllRiskDetail } = useSelector((state) => state.contractorAllRisk);
  const [isError, setIsError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const [totalmaintenanceDays, setTotalmaintenanceDays] = useState(0);
  const [limitMessage, setLimitMessage] = useState("");

  // File input for trade license
  const [selectedFile, setSelectedFile] = useState(contractorAllRiskDetail?.tradeLicense || "");

  const contractorAllRisksListFilter = useRef(false);
  // Fetch contractor details based on commercialId
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (contractorAllRisksListFilter.current) {
      return;
    }
    contractorAllRisksListFilter.current = true;

    try {
      dispatch(getCommercialDetailById(commercialId))
        .unwrap()
        .then((res) => {})
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
    if (commercialId) {
      getCommercialyDetailsHandler();
    }
  }, [commercialId]);

  // Formik form setup and validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      principalName: contractorAllRiskDetail?.principalName ? contractorAllRiskDetail?.principalName : "",
      contractorName: contractorAllRiskDetail?.contractorName || "",
      assuredType: contractorAllRiskDetail?.assuredType || "",
      consultantName: contractorAllRiskDetail?.consultantName || "",
      tradeLicenseNo: contractorAllRiskDetail?.tradeLicenseNo || "",
      subContractorName: contractorAllRiskDetail?.subContractorName || "",
      businessAddress: contractorAllRiskDetail?.businessAddress || "",
      emirates: contractorAllRiskDetail?.emirates || "",
      telephoneNo: contractorAllRiskDetail?.telephoneNo || "",
      email: contractorAllRiskDetail?.email || "",
      mobileNumber: "",
      businessActivity: contractorAllRiskDetail?.businessActivity || "",
      law: contractorAllRiskDetail?.law || "",
      territorialLimit: contractorAllRiskDetail?.territorialLimit || "",
      scopeOfWork: contractorAllRiskDetail?.scopeOfWork || "",
      remarks: contractorAllRiskDetail?.remarks || "",
      projectTitle: contractorAllRiskDetail?.projectTitle || "",
      projectDescription: contractorAllRiskDetail?.projectDescription || "",
      projectLocation: contractorAllRiskDetail?.projectLocation || "",
      sumInsuredCurrency: contractorAllRiskDetail?.sumInsuredCurrency || "AED",
      estimatedContractValue: contractorAllRiskDetail?.estimatedContractValue || 0,
      principalsExistingProperty: contractorAllRiskDetail?.principalsExistingProperty || 0,
      contractorsPlantMachinery: contractorAllRiskDetail?.contractorsPlantMachinery || 0,
      temporarySiteFacilities: contractorAllRiskDetail?.temporarySiteFacilities || 0,
      removalOfDebris: contractorAllRiskDetail?.removalOfDebris || 0,
      totalSumInsured: contractorAllRiskDetail?.totalSumInsured || 0,
      limitOfIndemnity: contractorAllRiskDetail?.limitOfIndemnity || 0,
      limitOfIndemnityAggregate: contractorAllRiskDetail?.limitOfIndemnityAggregate || 0,
      policyFrom: contractorAllRiskDetail?.policyFrom || "",
      policyTo: contractorAllRiskDetail?.policyTo || "",
      maintenanceFrom: contractorAllRiskDetail?.maintenanceFrom || "",
      maintenanceTo: contractorAllRiskDetail?.maintenanceTo || "",
      policyDays: contractorAllRiskDetail?.policyDays || "",
      projectMidwayYN: contractorAllRiskDetail?.projectMidwayYN ? true : false,
      projectMidway: contractorAllRiskDetail?.projectMidway || "",
      projectOffshoreYN: contractorAllRiskDetail?.projectOffshoreYN || false,
      projectOffshore: contractorAllRiskDetail?.projectOffshore || "",
      wetWorksInvolvedYN: contractorAllRiskDetail?.wetWorksInvolvedYN || false,
      wetWorksInvolved: contractorAllRiskDetail?.wetWorksInvolved || "",
      projectStartedTwoMonthsEarlierYN: contractorAllRiskDetail?.projectStartedTwoMonthsEarlierYN || false,
      projectStartedTwoMonthsEarlier: contractorAllRiskDetail?.projectStartedTwoMonthsEarlier || "",
      projectStartAfterTwoMonthYN: contractorAllRiskDetail?.projectStartAfterTwoMonthYN || false,
      projectStartAfterTwoMonth: contractorAllRiskDetail?.projectStartAfterTwoMonth || "",
    },

    validationSchema: schema,

    onSubmit: async (values, helpers) => {
      setIsLoader(true);
      const payload = jsonToFormData({ ...values, tradeLicense: selectedFile });
      dispatch(
        editContractorDetailsById({
          id: commercialId,
          data: payload,
        })
      )
        .unwrap()
        .then((res) => {
          toast.success("Successfully updated!");
          setIsLoader(false);
          router?.push(`/contractor-all-risk/${commercialId}`);
        })
        .catch((err) => {
          console.log(err, "err");
          setIsLoader(false);
          toast.error(err);
        });
    },
  });

  // Handle changes in mobile number input field
  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  // Handle changes in telephone number input field
  const handleTelePhoneNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("fullTeleNo", mobile);
    formik.setFieldValue("telephoneNo", mobileNumber);
  };

  // Effect hook to calculate the number of days between policy start and end dates
  useEffect(() => {
    if (formik.values.policyFrom && formik.values.policyTo) {
      const days = differenceInCalendarDays(new Date(formik.values.policyTo), new Date(formik.values.policyFrom));
      setTotalDays(days);
      formik.setFieldValue("policyDays", days);
    }
    if (formik.values.maintenanceFrom && formik.values.maintenanceTo) {
      const days = differenceInCalendarDays(
        new Date(formik.values.maintenanceTo),
        new Date(formik.values.maintenanceFrom)
      );
      setTotalmaintenanceDays(days);
      formik.setFieldValue("maintenanceDays", days);
    }
  }, [formik.values.policyFrom, formik.values.policyTo, formik.values.maintenanceFrom, formik.values.maintenanceTo]);

  // Effect hook to update limit message when scope of work changes
  useEffect(() => {
    if (contractorAllRiskDetail && commercialId) {
      if (contractorAllRiskDetail?.scopeOfWork === "Construction of Villa") {
        setLimitMessage("Construction of Villa (ECV) Minimum value is 300,000 and (ECV) Maximum value is 10,000,000");
      }
      if (contractorAllRiskDetail?.scopeOfWork === "Construction of building") {
        setLimitMessage(
          "Construction of building (ECV) Minimum value is 1,000,000 and (ECV) Maximum value is 20,000,000"
        );
      }
      if (contractorAllRiskDetail?.scopeOfWork === "Fit out works") {
        setLimitMessage("Fit out works (ECV) Minimum value is 10,000 and (ECV) Maximum value is 5,000,000");
      }
      if (contractorAllRiskDetail?.scopeOfWork === "Building Maintenance") {
        setLimitMessage("Fit out works (ECV) Minimum value is 10,000 and (ECV) Maximum value is 5,000,000");
      }
      if (contractorAllRiskDetail?.scopeOfWork === "Soft landscaping") {
        setLimitMessage("Soft landscaping (ECV) Minimum value is 10,000 and (ECV) Maximum value is 1,000,000");
      }
      if (!contractorAllRiskDetail?.scopeOfWork) {
        setLimitMessage("");
      }

      if (contractorAllRiskDetail?.mobileNumber) {
        formik.setFieldValue("mobile", `971${contractorAllRiskDetail?.mobileNumber}`);
        formik.setFieldValue("mobileNumber", `${contractorAllRiskDetail?.mobileNumber}`);
      }
      if (contractorAllRiskDetail?.telephoneNo) {
        formik.setFieldValue("fullTeleNo", `971${contractorAllRiskDetail?.telephoneNo}`);
        formik.setFieldValue("telephoneNo", `${contractorAllRiskDetail?.telephoneNo}`);
      }
    }
  }, [contractorAllRiskDetail, commercialId]);

  // Effect hook to update limit message when scope of work is selected or changed
  useEffect(() => {
    if (formik?.values?.scopeOfWork) {
      if (formik?.values?.scopeOfWork === "Construction of Villa") {
        setLimitMessage("Construction of Villa (ECV) Minimum value is 300,000 and (ECV) Maximum value is 10,000,000");
      }
      if (formik?.values?.scopeOfWork === "Construction of building") {
        setLimitMessage(
          "Construction of building (ECV) Minimum value is 1,000,000 and (ECV) Maximum value is 20,000,000"
        );
      }
      if (formik?.values?.scopeOfWork === "Fit out works") {
        setLimitMessage("Fit out works (ECV) Minimum value is 10,000 and (ECV) Maximum value is 5,000,000");
      }
      if (formik?.values?.scopeOfWork === "Building Maintenance") {
        setLimitMessage("Fit out works (ECV) Minimum value is 10,000 and (ECV) Maximum value is 5,000,000");
      }
      if (formik?.values?.scopeOfWork === "Soft landscaping") {
        setLimitMessage("Soft landscaping (ECV) Minimum value is 10,000 and (ECV) Maximum value is 1,000,000");
      }
      if (!formik?.values?.scopeOfWork) {
        setLimitMessage("");
      }
    }
  }, [formik?.values?.scopeOfWork]);

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    setSelectedFile(file);
    event.target.value = null; // Clear the file input value
  };

  return (
    <>
      {isLoader && (
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
            <AnimationLoader open={true} />
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
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <Divider />
          <CardContent>
            <Box sx={{ display: "inline-block", width: "100%", my: 2 }}>
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      mt={4}
                      sx={{
                        py: 1.5,
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "#60176F",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: "14px",
                        borderRadius: "10px 10px 0 0",
                      }}
                    >
                      Proposal Details
                    </Typography>
                    <Box sx={{ mt: 1, p: 1, px: 2 }}>
                      <Grid container columnSpacing={2} rowSpacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Assured Type <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.assuredType && formik.errors.assuredType)}
                                helperText={formik.touched.assuredType && formik.errors.assuredType}
                                fullWidth
                                label="Assured Type"
                                name="assuredType"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.assuredType}
                              >
                                <option value=""></option>
                                <option value={"Corporate"}>{"Corporate"}</option>
                              </TextField>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Proposer's Principal Name <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.principalName && formik.errors.principalName)}
                                helperText={formik.touched.principalName && formik.errors.principalName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.principalName}
                                label="Principal Name"
                                name="principalName"
                                type="text"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Proposer's Contractor Name <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.contractorName && formik.errors.contractorName)}
                                helperText={formik.touched.contractorName && formik.errors.contractorName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.contractorName}
                                label="Contractor Name"
                                name="contractorName"
                                type="text"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Proposer's Consultant Name
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.consultantName && formik.errors.consultantName)}
                                helperText={formik.touched.consultantName && formik.errors.consultantName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.consultantName}
                                label="Consultant Name"
                                name="consultantName"
                                type="text"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Proposer's Sub Contractor Names
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.subContractorName && formik.errors.subContractorName)}
                                helperText={formik.touched.subContractorName && formik.errors.subContractorName}
                                multiline
                                rows={2}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.subContractorName}
                                label="Sub Contractor Names "
                                name="subContractorName"
                                type="text"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Proposer's Business Address <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.businessAddress && formik.errors.businessAddress)}
                                helperText={formik.touched.businessAddress && formik.errors.businessAddress}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.businessAddress}
                                label="Proposer's Business Address"
                                name="businessAddress"
                                type="text"
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Proposer's Emirates
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              error={Boolean(formik.touched.emirates && formik.errors.emirates)}
                              helperText={formik.touched.emirates && formik.errors.emirates}
                              fullWidth
                              label="Proposer's Emirates"
                              name="emirates"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.emirates}
                            >
                              <option value=""></option>
                              {proposerEm?.map((i) => (
                                <option value={i}>{i}</option>
                              ))}
                            </TextField>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Office Tel No (971 XXXXXXXX)
                            </Typography>
                            <PhoneNumberInput
                              name={"fullTeleNo"}
                              label={"Tel No"}
                              handleMobileNumberChange={handleTelePhoneNumberChange}
                              formik={formik}
                              setIsError={setIsError}
                              isError={isError}
                            />
                            {isError && formik?.errors?.telephoneNo && (
                              <Typography
                                sx={{
                                  mb: 0.5,
                                  fontSize: "12px",
                                  color: "#d32f2f",
                                }}
                              >
                                {formik?.errors?.telephoneNo}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Email ID <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                error={Boolean(formik.touched.email && formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                label="Email ID"
                                name="email"
                                type="email"
                                autoComplete="new-email"
                              />
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Mobile # <Span> *</Span> (971 XXXXXXXXX)
                            </Typography>
                            <PhoneNumberInput
                              label={"Mobile No"}
                              handleMobileNumberChange={handleMobileNumberChange}
                              formik={formik}
                              setIsError={setIsError}
                              isError={isError}
                            />
                            {isError && formik?.errors?.mobileNumber && (
                              <Typography
                                sx={{
                                  mb: 0.5,
                                  fontSize: "12px",
                                  color: "#d32f2f",
                                }}
                              >
                                {formik?.errors?.mobileNumber}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Business Activity
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              error={Boolean(formik.touched.businessActivity && formik.errors.businessActivity)}
                              helperText={formik.touched.businessActivity && formik.errors.businessActivity}
                              fullWidth
                              label="Business Activity"
                              name="businessActivity"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.businessActivity}
                            >
                              <option value=""></option>
                              {businessAct?.map((i) => (
                                <option value={i}>{i}</option>
                              ))}
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Law / Jurisdiction - UAE
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              error={Boolean(formik.touched.law && formik.errors.law)}
                              helperText={formik.touched.law && formik.errors.law}
                              fullWidth
                              label="Law / Jurisdiction - UAE"
                              name="law"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.law}
                            >
                              <option value=""></option>
                              <option value="United Arab Emirates">United Arab Emirates</option>
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Trade License No
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              fullWidth
                              error={Boolean(formik.touched.tradeLicenseNo && formik.errors.tradeLicenseNo)}
                              helperText={formik.touched.tradeLicenseNo && formik.errors.tradeLicenseNo}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.tradeLicenseNo}
                              label="Trade License No"
                              name="tradeLicenseNo"
                              type="text"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Territorial Limit
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              error={Boolean(formik.touched.territorialLimit && formik.errors.territorialLimit)}
                              helperText={formik.touched.territorialLimit && formik.errors.territorialLimit}
                              fullWidth
                              label="Territorial Limit"
                              name="territorialLimit"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.territorialLimit}
                            >
                              <option value=""></option>
                              <option value="United Arab Emirates">United Arab Emirates</option>
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              Scope of work
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              error={Boolean(formik.touched.scopeOfWork && formik.errors.scopeOfWork)}
                              helperText={formik.touched.scopeOfWork && formik.errors.scopeOfWork}
                              fullWidth
                              label="Business Activity"
                              name="scopeOfWork"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.scopeOfWork}
                            >
                              <option value=""></option>
                              {scopeofWork?.map((i) => (
                                <option value={i}>{i}</option>
                              ))}
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "700",
                                  fontSize: "14px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Proposer's Remarks
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                label="Proposer's Remarks"
                                name="remarks"
                                type="text"
                                multiline
                                rows={2}
                                autoComplete="new-remarks"
                                sx={{ width: "100%" }}
                                error={Boolean(formik.touched.remarks && formik.errors.remarks)}
                                helperText={formik.touched.remarks && formik.errors.remarks}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.remarks}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
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
                        fontSize: { sm: "18px", xs: "16px" },
                        color: "#60176F",
                        px: "14px",
                        borderRadius: "10px 10px 0 0",

                        alignItems: "center",
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      Project Information
                    </Typography>
                    <Box sx={{ mt: 1, p: 1, px: 2 }}>
                      <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={12}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                              }}
                            >
                              Project Title
                              <Span> *</Span>
                            </Typography>
                          </Box>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              fullWidth
                              label="Project Title"
                              name="projectTitle"
                              type="text"
                              multiline
                              rows={2}
                              sx={{ width: "100%" }}
                              error={Boolean(formik.touched.projectTitle && formik.errors.projectTitle)}
                              helperText={formik.touched.projectTitle && formik.errors.projectTitle}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.projectTitle}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                              }}
                            >
                              Project Description
                              <Span> *</Span>
                            </Typography>
                          </Box>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              fullWidth
                              label="Project Description"
                              name="projectDescription"
                              type="text"
                              multiline
                              rows={2}
                              sx={{ width: "100%" }}
                              error={Boolean(formik.touched.projectDescription && formik.errors.projectDescription)}
                              helperText={formik.touched.projectDescription && formik.errors.projectDescription}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.projectDescription}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                              }}
                            >
                              Project Location
                              <Span> *</Span>
                            </Typography>
                          </Box>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              fullWidth
                              label="Project Location"
                              name="projectLocation"
                              type="text"
                              multiline
                              rows={2}
                              sx={{ width: "100%" }}
                              error={Boolean(formik.touched.projectLocation && formik.errors.projectLocation)}
                              helperText={formik.touched.projectLocation && formik.errors.projectLocation}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.projectLocation}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
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
                        fontSize: { sm: "18px", xs: "16px" },
                        color: "#60176F",
                        px: "14px",
                        borderRadius: "10px 10px 0 0",

                        alignItems: "center",
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      Sum Insured / Limit
                    </Typography>
                    <Box sx={{ mt: 1, p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "500",
                          fontSize: { sm: "18px", xs: "16px" },

                          color: "inherit",
                          m2: 2,
                        }}
                      >
                        Section I – Material Damage:
                      </Typography>
                      <Grid container spacing={2} mb={3} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            Select Sum Insured Currency
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            error={Boolean(formik.touched.sumInsuredCurrency && formik.errors.sumInsuredCurrency)}
                            helperText={formik.touched.sumInsuredCurrency && formik.errors.sumInsuredCurrency}
                            fullWidth
                            label="Sum Insured Currency"
                            name="sumInsuredCurrency"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.sumInsuredCurrency}
                          >
                            <option value={"AED"}>{"AED"}</option>
                            <option value={"USD"}>{"USD"}</option>
                            <option value={"EU"}>{"EU"}</option>
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} mb={3} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            {`1/. Estimated Contract Value (${formik.values.sumInsuredCurrency})`}
                            <Span> *</Span>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            error={Boolean(
                              formik.touched.estimatedContractValue && formik.errors.estimatedContractValue
                            )}
                            helperText={formik.touched.estimatedContractValue && formik.errors.estimatedContractValue}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.estimatedContractValue}
                            label="Estimated Contract Value"
                            name="estimatedContractValue"
                            type="number"
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} mb={3} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            {`2/. Principals Existing / Surrounding Property (${formik.values.sumInsuredCurrency})`}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Principals Existing / Surrounding Property"
                            name="principalsExistingProperty"
                            type="number"
                            error={Boolean(
                              formik.touched.principalsExistingProperty && formik.errors.principalsExistingProperty
                            )}
                            helperText={
                              formik.touched.principalsExistingProperty && formik.errors.principalsExistingProperty
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.principalsExistingProperty}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} mb={3} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            {`3/. Contractors Plant / Equipment & Machinery (${formik.values.sumInsuredCurrency})`}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Contractors Plant / Equipment & Machinery"
                            name="contractorsPlantMachinery"
                            type="number"
                            error={Boolean(
                              formik.touched.contractorsPlantMachinery && formik.errors.contractorsPlantMachinery
                            )}
                            helperText={
                              formik.touched.contractorsPlantMachinery && formik.errors.contractorsPlantMachinery
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.contractorsPlantMachinery}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} mb={3} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            {`4/. Temporary Site Facilities (${formik.values.sumInsuredCurrency})`}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Temporary Site Facilities"
                            name="temporarySiteFacilities"
                            type="number"
                            error={Boolean(
                              formik.touched.temporarySiteFacilities && formik.errors.temporarySiteFacilities
                            )}
                            helperText={formik.touched.temporarySiteFacilities && formik.errors.temporarySiteFacilities}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.temporarySiteFacilities}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} mb={3} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            {`5/. Removal of Debris (${formik.values.sumInsuredCurrency})`}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Removal of Debris"
                            name="removalOfDebris"
                            type="number"
                            error={Boolean(formik.touched.removalOfDebris && formik.errors.removalOfDebris)}
                            helperText={formik.touched.removalOfDebris && formik.errors.removalOfDebris}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.removalOfDebris}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} mb={3} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#313131",
                              fontSize: "15px",
                              fontWeight: 700,
                            }}
                          >
                            {`Total Sum Insured (${formik.values.sumInsuredCurrency})`}
                            <Span> *</Span>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Total Sum Insured"
                            name="totalSumInsured"
                            type="number"
                            disabled={true}
                            error={Boolean(formik.touched.totalSumInsured && formik.errors.totalSumInsured)}
                            helperText={formik.touched.totalSumInsured && formik.errors.totalSumInsured}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.totalSumInsured}
                          />
                        </Grid>
                      </Grid>

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "500",
                          fontSize: { sm: "18px", xs: "16px" },

                          color: "inherit",
                          m2: 2,
                        }}
                      >
                        Section I – Material Damage:
                      </Typography>
                      <Grid container spacing={2} mb={3} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            {`Limit of Indemnity (any one occurrence ${formik.values.sumInsuredCurrency})`}
                            <Span> *</Span>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Limit of Indemnity"
                            name="limitOfIndemnity"
                            type="number"
                            error={Boolean(formik.touched.limitOfIndemnity && formik.errors.limitOfIndemnity)}
                            helperText={formik.touched.limitOfIndemnity && formik.errors.limitOfIndemnity}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.limitOfIndemnity}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            {`Limit of Indemnity in the aggregate (${formik.values.sumInsuredCurrency})`}
                            <Span> *</Span>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Limit of Indemnity in aggregate "
                            name="limitOfIndemnityAggregate"
                            type="number"
                            error={Boolean(
                              formik.touched.limitOfIndemnityAggregate && formik.errors.limitOfIndemnityAggregate
                            )}
                            helperText={
                              formik.touched.limitOfIndemnityAggregate && formik.errors.limitOfIndemnityAggregate
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.limitOfIndemnityAggregate}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
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
                        fontSize: { sm: "18px", xs: "16px" },
                        color: "#60176F",
                        px: "14px",
                        borderRadius: "10px 10px 0 0",

                        alignItems: "center",
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      Policy Period
                    </Typography>
                    <Box sx={{ mt: 1, p: 1 }}>
                      <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              From
                              <Span> *</Span>
                            </Typography>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="From"
                              onChange={(value) => {
                                formik.setFieldValue("policyFrom", value, true);
                              }}
                              renderInput={(params) => (
                                <TextField name="policyFrom" fullWidth {...params} error={false} />
                              )}
                              value={formik.values.policyFrom}
                            />

                            {formik.touched.policyFrom && formik.errors.policyFrom && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.policyFrom}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              To
                              <Span> *</Span>
                            </Typography>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="To"
                              onChange={(value) => {
                                formik.setFieldValue("policyTo", value);
                              }}
                              renderInput={(params) => (
                                <TextField name="policyTo" fullWidth {...params} error={false} />
                              )}
                              value={formik.values.policyTo}
                            />

                            {formik.touched.policyTo && formik.errors.policyTo && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.policyTo}
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        {totalDays > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              mt: 1,
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                textAlign: "left",
                                ml: "14px",
                                fontWeight: 600,
                              }}
                            >
                              Total Number of Days:
                            </Typography>
                            {totalDays > 0 && (
                              <Box
                                sx={{
                                  border: "1px solid #60176F",
                                  px: 2,
                                  py: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  borderRadius: "10px",
                                  fontWeight: 600,
                                }}
                              >
                                {totalDays}
                              </Box>
                            )}
                          </Box>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
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
                        fontSize: { sm: "18px", xs: "16px" },
                        color: "#60176F",
                        px: "14px",
                        borderRadius: "10px 10px 0 0",

                        alignItems: "center",
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      Maintenance Period
                    </Typography>
                    <Box sx={{ mt: 1, p: 1 }}>
                      <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              From
                              <Span> *</Span>
                            </Typography>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="From"
                              onChange={(value) => {
                                formik.setFieldValue("maintenanceFrom", value, true);
                              }}
                              renderInput={(params) => (
                                <TextField name="maintenanceFrom" fullWidth {...params} error={false} />
                              )}
                              value={formik.values.maintenanceFrom}
                            />

                            {formik.touched.maintenanceFrom && formik.errors.maintenanceFrom && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.maintenanceFrom}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                fontWeight: 700,
                                mb: 1,
                              }}
                            >
                              To
                              <Span> *</Span>
                            </Typography>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="To"
                              onChange={(value) => {
                                formik.setFieldValue("maintenanceTo", value);
                              }}
                              renderInput={(params) => (
                                <TextField name="maintenanceTo" fullWidth {...params} error={false} />
                              )}
                              value={formik.values.maintenanceTo}
                            />

                            {formik.touched.maintenanceTo && formik.errors.maintenanceTo && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.maintenanceTo}
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        {totalmaintenanceDays > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              mt: 1,
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#707070",
                                fontSize: "14px",
                                textAlign: "left",
                                ml: "14px",
                                fontWeight: 600,
                              }}
                            >
                              Total Number of Days:
                            </Typography>
                            {totalmaintenanceDays > 0 && (
                              <Box
                                sx={{
                                  border: "1px solid #60176F",
                                  px: 2,
                                  py: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  borderRadius: "10px",
                                  fontWeight: 600,
                                }}
                              >
                                {totalmaintenanceDays}
                              </Box>
                            )}
                          </Box>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      mt={4}
                      sx={{
                        py: 1.5,
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        fontWeight: "600",
                        fontSize: "18px",
                        // display: "inline-block",
                        color: "#60176F",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: "14px",
                        borderRadius: "10px 10px 0 0",
                      }}
                    >
                      Declarations
                    </Typography>

                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        pb: 2,
                        px: 2.2,
                      }}
                    >
                      <Grid container columnSpacing={2} rowSpacing={2} sx={{ alignItems: "center" }}>
                        <Grid item xs={12} sm={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "16px",
                              fontWeight: 700,
                              mb: 1,
                            }}
                          >
                            Is the project Mid-way?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"projectMidwayYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="projectMidway"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-projectMidway"
                            error={Boolean(formik.touched.projectMidway && formik.errors.projectMidway)}
                            helperText={formik.touched.projectMidway && formik.errors.projectMidway}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.projectMidway}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        pb: 2,
                        px: 2.2,
                      }}
                    >
                      <Grid container columnSpacing={2} rowSpacing={2} sx={{ alignItems: "center" }}>
                        <Grid item xs={12} sm={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "16px",
                              fontWeight: 700,
                              mb: 1,
                            }}
                          >
                            Is the project Offshore?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"projectOffshoreYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="projectOffshore"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-projectOffshore"
                            error={Boolean(formik.touched.projectOffshore && formik.errors.projectOffshore)}
                            helperText={formik.touched.projectOffshore && formik.errors.projectOffshore}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.projectOffshore}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        pb: 2,
                        px: 2.2,
                      }}
                    >
                      <Grid container columnSpacing={2} rowSpacing={2} sx={{ alignItems: "center" }}>
                        <Grid item xs={12} sm={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "16px",
                              fontWeight: 700,
                              mb: 1,
                            }}
                          >
                            Are wet works involved?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"wetWorksInvolvedYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="wetWorksInvolved"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-wetWorksInvolved"
                            error={Boolean(formik.touched.wetWorksInvolved && formik.errors.wetWorksInvolved)}
                            helperText={formik.touched.wetWorksInvolved && formik.errors.wetWorksInvolved}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.wetWorksInvolved}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        pb: 2,
                        px: 2.2,
                      }}
                    >
                      <Grid container columnSpacing={2} rowSpacing={2} sx={{ alignItems: "center" }}>
                        <Grid item xs={12} sm={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "16px",
                              fontWeight: 700,
                              mb: 1,
                            }}
                          >
                            Did the project start more than 2 months earlier?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"projectStartedTwoMonthsEarlierYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="projectStartedTwoMonthsEarlier"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-projectStartedTwoMonthsEarlier"
                            error={Boolean(
                              formik.touched.projectStartedTwoMonthsEarlier &&
                                formik.errors.projectStartedTwoMonthsEarlier
                            )}
                            helperText={
                              formik.touched.projectStartedTwoMonthsEarlier &&
                              formik.errors.projectStartedTwoMonthsEarlier
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.projectStartedTwoMonthsEarlier}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        pb: 2,
                        px: 2.2,
                      }}
                    >
                      <Grid container columnSpacing={2} rowSpacing={2} sx={{ alignItems: "center" }}>
                        <Grid item xs={12} sm={12} md={6}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "16px",
                              fontWeight: 700,
                              mb: 1,
                            }}
                          >
                            Is the project going to start after more than 2 months?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"projectStartAfterTwoMonthYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="projectStartAfterTwoMonth"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-projectStartAfterTwoMonth"
                            error={Boolean(
                              formik.touched.projectStartAfterTwoMonth && formik.errors.projectStartAfterTwoMonth
                            )}
                            helperText={
                              formik.touched.projectStartAfterTwoMonth && formik.errors.projectStartAfterTwoMonth
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.projectStartAfterTwoMonth}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
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
                        fontSize: { sm: "18px", xs: "16px" },
                        color: "#60176F",
                        px: "14px",
                        borderRadius: "10px 10px 0 0",

                        alignItems: "center",
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      Trade License / Contract Copy
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#707070",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                      >
                        Click the button below to upload Trade License / Contract Copy
                      </Typography>

                      <Button variant="contained" sx={{ width: "140px", height: "40px", p: 0, m: 0 }}>
                        <Typography
                          variant="subtitle2"
                          aria-label="upload picture"
                          component="label"
                          gutterBottom
                          sx={{
                            width: "100%",
                            height: "100%",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            px: 2,
                            py: 1,
                            m: 0,
                          }}
                        >
                          Browse File
                          <input
                            accept=".xlsx, .xls, .doc, .docx, .pptx, .pdf, .png, .jpeg, .jpg"
                            id="file-upload"
                            type="file"
                            onChange={handleFileUpload}
                            style={{
                              display: "none",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </Typography>
                      </Button>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#707070",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                      >
                        Allowed file type (.pdf,.docx,.doc,.xlsx,.xls,.jpg, .jpeg,.png)
                      </Typography>
                      {selectedFile && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#707070",
                            fontSize: "16px",
                            fontWeight: 700,
                            mb: 2,
                          }}
                        >
                          Selected File: {selectedFile?.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>

          <CardActions
            sx={{
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "end",
            }}
          >
            <Button disabled={formik.isSubmitting} type="submit" variant="contained">
              Update
            </Button>
            <NextLink href={`/contractor-all-risk/${commercialId}`} passHref>
              <Button
                component="a"
                disabled={formik.isSubmitting}
                sx={{
                  m: 1,
                  mr: "auto",
                }}
                variant="outlined"
              >
                Cancel
              </Button>
            </NextLink>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default EditContractorAllRiskDetailForm;
