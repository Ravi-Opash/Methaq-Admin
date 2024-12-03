"use client";
import React, { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
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
import PhoneNumberInput from "src/components/phoneInput-field";
import * as Yup from "yup";
import { useFormik } from "formik";
import YNSwitch from "src/components/YNSwitch";
import { differenceInCalendarDays } from "date-fns";
import { useRouter } from "next/router";
import { editProfesionIndemnityDetailsById, getProfessionIndemnityById } from "./Action/professionalIndemnityAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import AnimationLoader from "src/components/amimated-loader";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));
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

const ClaimList = [50000, 100000, 200000, 250000, 500000, 1000000, 2000000, 3675000, 5000000];

const planTypes = ["Expert", "Text Agent(Individuals Only)", "Engineering Consultant", "Legal Translators", "Other"];

const policySubType = ["Category 2", "Private", "Category 1"];

const schema = Yup.object({
  fullName: Yup.string().required("fullName is required"),
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
  businessActivity: Yup.string().required("Business activity is required"),
  law: Yup.string().required("law required"),
  territorialLimit: Yup.string().required("territorial limit is required"),
  remarks: Yup.string().max(500).notRequired(),
  policyFrom: Yup.string().required("policy from is required"),
  policyTo: Yup.string().required("policy to is required"),
  // policyDays: Yup.string().required("policy Days is required"),

  connectedWithOrg: Yup.string().when("connectedWithOrgYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  takingCoverInFirm: Yup.string().when("takingCoverInFirmYN", {
    is: (insType) => {
      return insType === false;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  policyClaim: Yup.string().when("policyClaimYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  policyDeclined: Yup.string().when("policyDeclinedYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

const EditProfessionalIndemnityDetailForm = () => {
  const [isError, setIsError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [totalDays, setTotalDays] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const { professionalIndemnityId } = router.query;
  const { professionIndemnityDetails } = useSelector((state) => state.professionIndemnity);
  const professionaIndemnityListFilter = useRef(false);

  const [selectedFile, setSelectedFile] = useState("");
  const [isSelectedFile, setIsSelectedFile] = useState(false);
  useEffect(() => {
    if (professionIndemnityDetails?.tradeLicense) {
      setSelectedFile({
        name: professionIndemnityDetails?.tradeLicense?.originalname,
      });
    }
  }, [professionIndemnityDetails]);

  // Get Professional Indemnity details
  const getProfessionalIndemnityDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (professionaIndemnityListFilter.current) {
      return;
    }
    professionaIndemnityListFilter.current = true;

    try {
      dispatch(getProfessionIndemnityById(professionalIndemnityId))
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
    if (professionalIndemnityId) {
      getProfessionalIndemnityDetailsHandler();
    }
  }, [professionalIndemnityId]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      planType: professionIndemnityDetails?.planType ? professionIndemnityDetails?.planType : "",
      policySubType: professionIndemnityDetails?.policySubType ? professionIndemnityDetails?.policySubType : "",
      fullName: professionIndemnityDetails?.fullName ? professionIndemnityDetails?.fullName : "",
      businessAddress: professionIndemnityDetails?.businessAddress || "",
      emirates: professionIndemnityDetails?.emirates || "",
      telephoneNo: professionIndemnityDetails?.telephoneNo || "",
      email: professionIndemnityDetails?.email || "",
      mobileNumber: professionIndemnityDetails?.mobileNumber || "",
      businessActivity: professionIndemnityDetails?.businessActivity || "",
      law: professionIndemnityDetails?.law || "",
      territorialLimit: professionIndemnityDetails?.territorialLimit || "",
      remarks: professionIndemnityDetails?.remarks || "",
      policyFrom: professionIndemnityDetails?.policyFrom || "",
      policyTo: professionIndemnityDetails?.policyTo || "",
      retroactiveDate: professionIndemnityDetails?.retroactiveDate || "",
      anyOneOccurrence: professionIndemnityDetails?.anyOneOccurrence || "",
      inAggregate: professionIndemnityDetails?.inAggregate || "",
      policyDays: professionIndemnityDetails?.policyDays || "",
      connectedWithOrgYN: professionIndemnityDetails?.connectedWithOrgYN ? true : false,
      connectedWithOrg: professionIndemnityDetails?.connectedWithOrg || "",
      takingCoverInFirmYN: professionIndemnityDetails?.takingCoverInFirmYN || false,
      takingCoverInFirm: professionIndemnityDetails?.takingCoverInFirm || "",
      policyClaimYN: professionIndemnityDetails?.policyClaimYN || false,
      policyClaim: professionIndemnityDetails?.policyClaim || "",
      policyDeclinedYN: professionIndemnityDetails?.policyDeclinedYN || false,
      policyDeclined: professionIndemnityDetails?.policyDeclined || "",
    },

    validationSchema: schema,

    onSubmit: async (values, helpers) => {
      let payload = jsonToFormData({ ...values, tradeLicense: selectedFile });
      if (!isSelectedFile) {
        payload = jsonToFormData({
          ...values,
        });
      }
      setIsLoader(true);

      dispatch(
        editProfesionIndemnityDetailsById({
          id: professionalIndemnityId,
          data: payload,
        })
      )
        .unwrap()
        .then((res) => {
          toast.success("Successfully updated!");
          setIsLoader(false);
          router?.push(`/professional-indemnity/${professionalIndemnityId}`);
        });
    },
  });

  // MobileNumber chnage handler
  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  // Phone number chnage handler
  const handleTelePhoneNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("fullTeleNo", mobile);
    formik.setFieldValue("telephoneNo", mobileNumber);
  };

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
  }, [formik.values.policyFrom, formik.values.policyTo]);

  useEffect(() => {
    if (professionIndemnityDetails?.mobileNumber) {
      formik.setFieldValue("mobile", `971${professionIndemnityDetails?.mobileNumber}`);
      formik.setFieldValue("mobileNumber", `${professionIndemnityDetails?.mobileNumber}`);
    }
    if (professionIndemnityDetails?.telephoneNo) {
      formik.setFieldValue("fullTeleNo", `971${professionIndemnityDetails?.telephoneNo}`);
      formik.setFieldValue("telephoneNo", `${professionIndemnityDetails?.telephoneNo}`);
    }
  }, [professionIndemnityDetails]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    setSelectedFile(file);
    setIsSelectedFile(true);
    event.target.value = null; // Clear the file input value
  };

  // calculate policyTo date value from poliyTo value
  useEffect(() => {
    if (formik?.values?.policyFrom) {
      formik.setFieldValue(
        "policyTo",
        new Date(
          new Date(formik?.values?.policyFrom).setFullYear(new Date(formik?.values?.policyFrom).getFullYear() + 1)
        ).toISOString()
      );
    }
  }, [formik?.values?.policyFrom]);

  return (
    <>
      {isLoader && (
        <>
          <AnimationLoader open={true} />
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
                                Plan Type <Span> *</Span>
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
                                error={Boolean(formik.touched.planType && formik.errors.planType)}
                                helperText={formik.touched.planType && formik.errors.planType}
                                fullWidth
                                label="Plan Type"
                                name="planType"
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  formik.setFieldValue("planType", e.target.value);
                                  // Based on condition given by portal which we copied
                                  if (
                                    e?.target?.value &&
                                    e?.target?.value != "Other" &&
                                    e?.target?.value != "Engineering Consultant"
                                  ) {
                                    formik.setFieldValue("inAggregate", 1000000);
                                    formik.setFieldValue("anyOneOccurrence", 1000000);
                                  }
                                }}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.planType}
                              >
                                <option value="ssss"></option>
                                {planTypes?.map((i) => (
                                  <option value={i}>{i}</option>
                                ))}
                              </TextField>
                            </Box>
                          </Box>
                        </Grid>
                        {formik.values.planType === "Engineering Consultant" && (
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
                                  Policy Sub Type <Span> *</Span>
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
                                  error={Boolean(formik.touched.policySubType && formik.errors.policySubType)}
                                  helperText={formik.touched.policySubType && formik.errors.policySubType}
                                  fullWidth
                                  label="Policy Sub Type"
                                  name="policySubType"
                                  onBlur={formik.handleBlur}
                                  onChange={(e) => {
                                    formik.setFieldValue("policySubType", e.target.value);
                                    // Based on condition given by portal which we copied
                                    if (e?.target?.value == "Private") {
                                      formik.setFieldValue("inAggregate", 2000000);
                                      formik.setFieldValue("anyOneOccurrence", 2000000);
                                    } else if (e?.target?.value == "Category 2") {
                                      formik.setFieldValue("inAggregate", 500000);
                                      formik.setFieldValue("anyOneOccurrence", 50000);
                                    } else if (e?.target?.value == "Category 1") {
                                      formik.setFieldValue("inAggregate", 1000000);
                                      formik.setFieldValue("anyOneOccurrence", 100000);
                                    }
                                  }}
                                  select
                                  SelectProps={{ native: true }}
                                  value={formik.values.policySubType}
                                >
                                  <option value="ssss"></option>
                                  {policySubType?.map((i) => (
                                    <option value={i}>{i}</option>
                                  ))}
                                </TextField>
                              </Box>
                            </Box>
                          </Grid>
                        )}
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
                                Proposer's Emirates <Span> *</Span>
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
                                <option value="ssss"></option>
                                {proposerEm?.map((i) => (
                                  <option value={i}>{i}</option>
                                ))}
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
                                Proposer's Full Name <Span> *</Span>
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
                                error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                                helperText={formik.touched.fullName && formik.errors.fullName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.fullName}
                                label="Proposer's Full Name"
                                name="fullName"
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
                                label="Contractor Name"
                                name="businessAddress"
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
                              Retroactive date
                            </Typography>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="Retroactive date"
                              onChange={(value) => {
                                formik.setFieldValue("retroactiveDate", value);
                              }}
                              renderInput={(params) => (
                                <TextField name="retroactiveDate" fullWidth {...params} error={false} />
                              )}
                              value={formik.values.retroactiveDate}
                            />
                            {formik.touched.retroactiveDate && formik.errors.retroactiveDate && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.retroactiveDate}
                              </Typography>
                            )}
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
                              disabled
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
                        </Box>
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
                      Limit Of Liability
                    </Typography>
                    <Box sx={{ mt: 1, p: 1 }}>
                      <Grid container spacing={2} mb={3}>
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
                                Any one Occurrence <Span> *</Span>
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
                                error={Boolean(formik.touched.anyOneOccurrence && formik.errors.anyOneOccurrence)}
                                helperText={formik.touched.anyOneOccurrence && formik.errors.anyOneOccurrence}
                                fullWidth
                                label="Any one Occurrence"
                                name="anyOneOccurrence"
                                disabled={formik.values.planType != "Other"}
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  formik.setFieldValue("anyOneOccurrence", e.target.value);
                                  if (e?.target?.value) {
                                    formik.setFieldValue("inAggregate", +e?.target?.value);
                                  } else {
                                    formik.setFieldValue("inAggregate", "");
                                  }
                                }}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.anyOneOccurrence}
                              >
                                <option value="ssss"></option>
                                {ClaimList?.map((i) => (
                                  <option value={i}>{i}</option>
                                ))}
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
                                In the Aggregate <Span> *</Span>
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
                                error={Boolean(formik.touched.inAggregate && formik.errors.inAggregate)}
                                helperText={formik.touched.inAggregate && formik.errors.inAggregate}
                                fullWidth
                                disabled
                                label="In the Aggregate"
                                name="inAggregate"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                SelectProps={{ native: true }}
                                value={formik.values.inAggregate}
                              ></TextField>
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
                        fontSize: "18px",
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
                            Are you connected or associated (financially or otherwise) with any other practice, company
                            or organization?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"connectedWithOrgYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="connectedWithOrg"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-connectedWithOrg"
                            error={Boolean(formik.touched.connectedWithOrg && formik.errors.connectedWithOrg)}
                            helperText={formik.touched.connectedWithOrg && formik.errors.connectedWithOrg}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.connectedWithOrg}
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
                            Are you taking cover for all the employees in your firm?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"takingCoverInFirmYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="takingCoverInFirm"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-takingCoverInFirm"
                            error={Boolean(formik.touched.takingCoverInFirm && formik.errors.takingCoverInFirm)}
                            helperText={formik.touched.takingCoverInFirm && formik.errors.takingCoverInFirm}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.takingCoverInFirm}
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
                            Has any Claim (s) been made against you in Past or Current?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"policyClaimYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="policyClaim"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-policyClaim"
                            error={Boolean(formik.touched.policyClaim && formik.errors.policyClaim)}
                            helperText={formik.touched.policyClaim && formik.errors.policyClaim}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.policyClaim}
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
                            Was your application for this policy been declined any time in the past?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"policyDeclinedYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="policyDeclined"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-policyDeclined"
                            error={Boolean(formik.touched.policyDeclined && formik.errors.policyDeclined)}
                            helperText={formik.touched.policyDeclined && formik.errors.policyDeclined}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.policyDeclined}
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
            <Button type="submit" variant="contained">
              Update
            </Button>
            <NextLink href={`/professional-indemnity/${professionalIndemnityId}`} passHref>
              <Button
                component="a"
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

export default EditProfessionalIndemnityDetailForm;
