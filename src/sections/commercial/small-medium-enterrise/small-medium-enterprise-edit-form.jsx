"use client";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import NextLink from "next/link";
import { editSmallBusinessEnterpriseById } from "./Action/smallMediumEnterpriseAction";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import PhoneNumberInput from "src/components/phoneInput-field";
import { DatePicker } from "@mui/x-date-pickers";
import YNSwitch from "src/components/YNSwitch";
import { differenceInCalendarDays } from "date-fns";
import { toast } from "react-toastify";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import AnimationLoader from "src/components/amimated-loader";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));
const proposerEm = [
  "Abu Dhabi",
  "Ajman",
  "Fujairah",
  "Sharjah",
  "Dubai",
  "Ras Al Khaimah",
  "Umm Al Quwain",
];
const schema = Yup.object({
  fullName: Yup.string().required("fullName is required"),
  businessAddress: Yup.string().required("businessAddress is required"),
  emirates: Yup.string().required("emirates is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "invalid email"
    ),
  mobileNumber: Yup.string()
    .min(9)
    .max(9)
    .required("Mobile number is required")
    .matches(/^5/, "Mobile number should starts with 5"),
  law: Yup.string().required("law required"),
  territorialLimit: Yup.string().required("territorial limit is required"),
  remarks: Yup.string().max(500).notRequired(),
  policyFrom: Yup.string().required("policy from is required"),
  policyTo: Yup.string().required("policy to is required"),

  businessInsuredName: Yup.string().required(
    "Business Insured Name from is required"
  ),
  businessArea: Yup.string().required("Business Area to is required"),
  businessEmail: Yup.string().required("Business Email from is required"),
  businessMobileNumber: Yup.string()
    .min(9)
    .max(9)
    .required("Business Mobile number is required")
    .matches(/^5/, "Mobile number should starts with 5"),
  businessCity: Yup.string().required("Business City to is required"),
  addressInsuredPremises: Yup.string().required(
    "Address Insured Premises to is required"
  ),
  natureInsuredPremises: Yup.string().required(
    "Nature of Business at Insured Premises to is required"
  ),

  protectionMeasures: Yup.string().when("protectionMeasuresYN", {
    is: (insType) => {
      return insType === false;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  protectionMeasures24Hourse: Yup.string().when(
    "protectionMeasures24HourseYN",
    {
      is: (insType) => {
        return insType === false;
      },
      then: () => Yup.string().max(500).required("Is required"),
      otherwise: () => Yup.string().notRequired(),
    }
  ),
  businessUtilize: Yup.string().when("businessUtilizeYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  businessEngage: Yup.string().when("businessEngageYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  constructedRcc: Yup.string().when("constructedRccYN", {
    is: (insType) => {
      return insType === false;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  lossOrDamage: Yup.string().when("lossOrDamageYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  declinedInsurance: Yup.string().when("declinedInsuranceYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

const EditSmallMediumEnterpriseDetailForm = () => {
  const router = useRouter();
  const { smallMediumId } = router.query;
  const [isError, setIsError] = useState(false);
  const [totalDays, setTotalDays] = useState(0);

  const dispatch = useDispatch();
  const { loading, smallMediumEnterpriseDetail } = useSelector(
    (state) => state.smallMediumEnterprise
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: smallMediumEnterpriseDetail?.fullName
        ? smallMediumEnterpriseDetail?.fullName
        : "",
      commercialId: smallMediumEnterpriseDetail?.commercialId || "",
      businessAddress: smallMediumEnterpriseDetail?.businessAddress || "",
      emirates: smallMediumEnterpriseDetail?.emirates || "",
      telephoneNo: smallMediumEnterpriseDetail?.telephoneNo || "",
      teleNoBusiness: smallMediumEnterpriseDetail?.teleNoBusiness || "",
      email: smallMediumEnterpriseDetail?.email || "",
      mobileNumber: "",
      law: smallMediumEnterpriseDetail?.law || "",
      territorialLimit: smallMediumEnterpriseDetail?.territorialLimit || "",
      remarks: smallMediumEnterpriseDetail?.remarks || "",
      policyFrom: smallMediumEnterpriseDetail?.policyFrom || "",
      policyTo: smallMediumEnterpriseDetail?.policyTo || "",
      policyDays: smallMediumEnterpriseDetail?.policyDays || "",
      businessInsuredName:
        smallMediumEnterpriseDetail?.businessInsuredName || "",
      natureInsuredPremises:
        smallMediumEnterpriseDetail?.natureInsuredPremises || "",
      addressInsuredPremises:
        smallMediumEnterpriseDetail?.addressInsuredPremises || "",
      businessArea: smallMediumEnterpriseDetail?.businessArea || "",
      businessCity: smallMediumEnterpriseDetail?.businessCity || "",
      businessMobileNumber:
        smallMediumEnterpriseDetail?.businessMobileNumber || "",
      businessWebsite: smallMediumEnterpriseDetail?.businessWebsite || "",
      businessEmail: smallMediumEnterpriseDetail?.businessEmail || "",
      protectionMeasuresYN:
        smallMediumEnterpriseDetail?.protectionMeasuresYN || true,
      protectionMeasures: smallMediumEnterpriseDetail?.protectionMeasures || "",
      businessUtilizeYN:
        smallMediumEnterpriseDetail?.businessUtilizeYN || false,
      businessUtilize: smallMediumEnterpriseDetail?.businessUtilize || "",
      protectionMeasures24HourseYN:
        smallMediumEnterpriseDetail?.protectionMeasures24HourseYN || true,
      protectionMeasures24Hourse:
        smallMediumEnterpriseDetail?.protectionMeasures24Hourse || "",
      businessEngageYN: smallMediumEnterpriseDetail?.businessEngageYN || false,
      businessEngage: smallMediumEnterpriseDetail?.businessEngage || "",
      constructedRccYN: smallMediumEnterpriseDetail?.constructedRccYN || true,
      constructedRcc: smallMediumEnterpriseDetail?.constructedRcc || "",
      lossOrDamageYN: smallMediumEnterpriseDetail?.lossOrDamageYN || false,
      lossOrDamage: smallMediumEnterpriseDetail?.lossOrDamage || "",
      declinedInsuranceYN:
        smallMediumEnterpriseDetail?.declinedInsuranceYN || false,
      declinedInsurance: smallMediumEnterpriseDetail?.declinedInsurance || "",
    },

    validationSchema: schema,

    onSubmit: async (values, helpers) => {
      const payload = jsonToFormData({
        ...values,
      });
      dispatch(
        editSmallBusinessEnterpriseById({ id: smallMediumId, data: payload })
      )
        .unwrap()
        .then((res) => {
          toast.success("successfully updated!");
          router.push(`/small-medium-enterprise/${smallMediumId}`);
        })
        .catch((err) => {
          console.log(err, "err");
          toast.error(err);
        });
    },
  });
  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };
  const handleTelePhoneNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("fullTeleNo", mobile);
    formik.setFieldValue("telephoneNo", mobileNumber);
  };

  const handleBuissnessMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("businessNumber", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("businessMobileNumber", mobileNumber);
  };
  const handleBuissnessTelePhoneNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("fullTeleNoBusiness", mobile);
    formik.setFieldValue("teleNoBusiness", mobileNumber);
  };

  useEffect(() => {
    if (formik.values.policyFrom && formik.values.policyTo) {
      const days = differenceInCalendarDays(
        new Date(formik.values.policyTo),
        new Date(formik.values.policyFrom)
      );
      setTotalDays(days);
      formik.setFieldValue("policyDays", days);
    }
  }, [formik.values.policyFrom, formik.values.policyTo]);

  useEffect(() => {
    if (formik.values.policyFrom && formik.values.policyTo) {
      const days = differenceInCalendarDays(
        new Date(formik.values.policyTo),
        new Date(formik.values.policyFrom)
      );
      setTotalDays(days);
      formik.setFieldValue("policyDays", days);
    }
  }, [formik.values.policyFrom, formik.values.policyTo]);

  // set value of mobile numbers...  
  useEffect(() => {
    if (smallMediumEnterpriseDetail?.mobileNumber) {
      formik.setFieldValue(
        "mobile",
        `971${smallMediumEnterpriseDetail?.mobileNumber}`
      );
      formik.setFieldValue(
        "mobileNumber",
        `${smallMediumEnterpriseDetail?.mobileNumber}`
      );
    }
    if (smallMediumEnterpriseDetail?.telephoneNo) {
      formik.setFieldValue(
        "fullTeleNo",
        `971${smallMediumEnterpriseDetail?.telephoneNo}`
      );
      formik.setFieldValue(
        "telephoneNo",
        `${smallMediumEnterpriseDetail?.telephoneNo}`
      );
    }
    if (smallMediumEnterpriseDetail?.businessMobileNumber) {
      formik.setFieldValue(
        "businessNumber",
        `971${smallMediumEnterpriseDetail?.businessMobileNumber}`
      );
      formik.setFieldValue(
        "businessMobileNumber",
        `${smallMediumEnterpriseDetail?.businessMobileNumber}`
      );
    }
    if (smallMediumEnterpriseDetail?.teleNoBusiness) {
      formik.setFieldValue(
        "fullTeleNoBusiness",
        `971${smallMediumEnterpriseDetail?.teleNoBusiness}`
      );
      formik.setFieldValue(
        "teleNoBusiness",
        `${smallMediumEnterpriseDetail?.teleNoBusiness}`
      );
    }
  }, [smallMediumEnterpriseDetail]);

  // calculate policyTo date value from poliyTo value
  useEffect(() => {
    if (formik?.values?.policyFrom) {
      formik.setFieldValue(
        "policyTo",
        new Date(
          new Date(formik?.values?.policyFrom).setFullYear(
            new Date(formik?.values?.policyFrom).getFullYear() + 1
          )
        ).toISOString()
      );
    }
  }, [formik?.values?.policyFrom]);
  return (
    <>
      {loading ? (
        <AnimationLoader open={true}/>
      ) : (
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
                        boxShadow:
                          "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
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
                        Proposal Details
                      </Typography>
                      <Box sx={{ mt: 1, p: 1, px: 2 }}>
                        <Grid container columnSpacing={2} rowSpacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  error={Boolean(
                                    formik.touched.fullName &&
                                      formik.errors.fullName
                                  )}
                                  helperText={
                                    formik.touched.fullName &&
                                    formik.errors.fullName
                                  }
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
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  error={Boolean(
                                    formik.touched.emirates &&
                                      formik.errors.emirates
                                  )}
                                  helperText={
                                    formik.touched.emirates &&
                                    formik.errors.emirates
                                  }
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
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  error={Boolean(
                                    formik.touched.businessAddress &&
                                      formik.errors.businessAddress
                                  )}
                                  helperText={
                                    formik.touched.businessAddress &&
                                    formik.errors.businessAddress
                                  }
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
                            <Box
                              sx={{ display: "inline-block", width: "100%" }}
                              mb={1}
                            >
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
                                handleMobileNumberChange={
                                  handleTelePhoneNumberChange
                                }
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
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  error={Boolean(
                                    formik.touched.email && formik.errors.email
                                  )}
                                  helperText={
                                    formik.touched.email && formik.errors.email
                                  }
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
                            <Box
                              sx={{ display: "inline-block", width: "100%" }}
                              mb={1}
                            >
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
                                handleMobileNumberChange={
                                  handleMobileNumberChange
                                }
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
                            <Box
                              sx={{ display: "inline-block", width: "100%" }}
                              mb={1}
                            >
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
                                error={Boolean(
                                  formik.touched.law && formik.errors.law
                                )}
                                helperText={
                                  formik.touched.law && formik.errors.law
                                }
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
                                <option value="United Arab Emirates">
                                  United Arab Emirates
                                </option>
                              </TextField>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "inline-block", width: "100%" }}
                              mb={1}
                            >
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
                                error={Boolean(
                                  formik.touched.territorialLimit &&
                                    formik.errors.territorialLimit
                                )}
                                helperText={
                                  formik.touched.territorialLimit &&
                                  formik.errors.territorialLimit
                                }
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
                                <option value="United Arab Emirates">
                                  United Arab Emirates
                                </option>
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
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  error={Boolean(
                                    formik.touched.remarks &&
                                      formik.errors.remarks
                                  )}
                                  helperText={
                                    formik.touched.remarks &&
                                    formik.errors.remarks
                                  }
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
                        boxShadow:
                          "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
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
                        Business Details
                      </Typography>
                      <Box sx={{ mt: 1, p: 1, px: 2 }}>
                        <Grid container columnSpacing={2} rowSpacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  Business Insured Name <Span> *</Span>
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
                                  error={Boolean(
                                    formik.touched.businessInsuredName &&
                                      formik.errors.businessInsuredName
                                  )}
                                  helperText={
                                    formik.touched.businessInsuredName &&
                                    formik.errors.businessInsuredName
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.businessInsuredName}
                                  label="Business Insured Name "
                                  name="businessInsuredName"
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  Nature of Business at Insured Premises{" "}
                                  <Span> *</Span>
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
                                  error={Boolean(
                                    formik.touched.natureInsuredPremises &&
                                      formik.errors.natureInsuredPremises
                                  )}
                                  helperText={
                                    formik.touched.natureInsuredPremises &&
                                    formik.errors.natureInsuredPremises
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.natureInsuredPremises}
                                  label="Nature of Business at Insured Premises"
                                  name="natureInsuredPremises"
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  Address of insured premises <Span> *</Span>
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
                                  error={Boolean(
                                    formik.touched.addressInsuredPremises &&
                                      formik.errors.addressInsuredPremises
                                  )}
                                  helperText={
                                    formik.touched.addressInsuredPremises &&
                                    formik.errors.addressInsuredPremises
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.addressInsuredPremises}
                                  label="Address of insured premises"
                                  name="addressInsuredPremises"
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              teleNoBusiness
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  Business Area <Span> *</Span>
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
                                  error={Boolean(
                                    formik.touched.businessArea &&
                                      formik.errors.businessArea
                                  )}
                                  helperText={
                                    formik.touched.businessArea &&
                                    formik.errors.businessArea
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.businessArea}
                                  label="Business Area"
                                  name="businessArea"
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  Business City <Span> *</Span>
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
                                  error={Boolean(
                                    formik.touched.businessCity &&
                                      formik.errors.businessCity
                                  )}
                                  helperText={
                                    formik.touched.businessCity &&
                                    formik.errors.businessCity
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.businessCity}
                                  label="Business City"
                                  name="businessCity"
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "inline-block", width: "100%" }}
                              mb={1}
                            >
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
                                Business Tel No (971 XXXXXXXX)
                              </Typography>
                              <PhoneNumberInput
                                name={"fullTeleNoBusiness"}
                                label={"Tel No"}
                                handleMobileNumberChange={
                                  handleBuissnessTelePhoneNumberChange
                                }
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
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  Business Email ID <Span> *</Span>
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
                                  error={Boolean(
                                    formik.touched.businessEmail &&
                                      formik.errors.businessEmail
                                  )}
                                  helperText={
                                    formik.touched.businessEmail &&
                                    formik.errors.businessEmail
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.businessEmail}
                                  label="Business Email ID"
                                  name="businessEmail"
                                  type="email"
                                  autoComplete="new-businessEmail"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "inline-block", width: "100%" }}
                              mb={1}
                            >
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
                                Business Mobile # <Span> *</Span> (971
                                XXXXXXXXX)
                              </Typography>
                              <PhoneNumberInput
                                name={"businessNumber"}
                                label={"Business Mobile"}
                                handleMobileNumberChange={
                                  handleBuissnessMobileNumberChange
                                }
                                formik={formik}
                                setIsError={setIsError}
                                isError={isError}
                              />
                              {isError &&
                                formik?.errors?.businessMobileNumber && (
                                  <Typography
                                    sx={{
                                      mb: 0.5,
                                      fontSize: "12px",
                                      color: "#d32f2f",
                                    }}
                                  >
                                    {formik?.errors?.businessMobileNumber}
                                  </Typography>
                                )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
                              >
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
                                  Business Website
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
                                  error={Boolean(
                                    formik.touched.businessWebsite &&
                                      formik.errors.businessWebsite
                                  )}
                                  helperText={
                                    formik.touched.businessWebsite &&
                                    formik.errors.businessWebsite
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.businessWebsite}
                                  label="Business Website"
                                  name="businessWebsite"
                                  type="text"
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
                        boxShadow:
                          "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
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
                            <Box
                              sx={{ display: "inline-block", width: "100%" }}
                              mb={1}
                            >
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
                                  formik.setFieldValue(
                                    "policyFrom",
                                    value,
                                    true
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    name="policyFrom"
                                    fullWidth
                                    {...params}
                                    error={false}
                                  />
                                )}
                                value={formik.values.policyFrom}
                              />

                              {formik.touched.policyFrom &&
                                formik.errors.policyFrom && (
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
                            <Box
                              sx={{ display: "inline-block", width: "100%" }}
                              mb={1}
                            >
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
                                disabled
                                onChange={(value) => {
                                  formik.setFieldValue("policyTo", value);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    name="policyTo"
                                    fullWidth
                                    {...params}
                                    error={false}
                                  />
                                )}
                                value={formik.values.policyTo}
                              />

                              {formik.touched.policyTo &&
                                formik.errors.policyTo && (
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
                        boxShadow:
                          "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
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
                        <Grid
                          container
                          columnSpacing={2}
                          rowSpacing={2}
                          sx={{ alignItems: "center" }}
                        >
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
                              Are you taking anyone or more from the given fire
                              protection measures:(Sprinkler, Extinguisher, Hose
                              Reel, Alarm, Smoke Detectors)?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"protectionMeasuresYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="protectionMeasures"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-protectionMeasures"
                              error={Boolean(
                                formik.touched.protectionMeasures &&
                                  formik.errors.protectionMeasures
                              )}
                              helperText={
                                formik.touched.protectionMeasures &&
                                formik.errors.protectionMeasures
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.protectionMeasures}
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
                        <Grid
                          container
                          columnSpacing={2}
                          rowSpacing={2}
                          sx={{ alignItems: "center" }}
                        >
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
                              Are you taking anyone or more from the given
                              Security measures: (Grills / Roller Shutters, 24
                              Hour Security, Burglar Alarm, CCTV Recording)?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"protectionMeasures24HourseYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="protectionMeasures24Hourse"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-protectionMeasures24Hourse"
                              error={Boolean(
                                formik.touched.protectionMeasures24Hourse &&
                                  formik.errors.protectionMeasures24Hourse
                              )}
                              helperText={
                                formik.touched.protectionMeasures24Hourse &&
                                formik.errors.protectionMeasures24Hourse
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.protectionMeasures24Hourse}
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
                        <Grid
                          container
                          columnSpacing={2}
                          rowSpacing={2}
                          sx={{ alignItems: "center" }}
                        >
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
                              Does your business utilize the insured premises
                              for warehousing purpose?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"businessUtilizeYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="businessUtilize"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-businessUtilize"
                              error={Boolean(
                                formik.touched.businessUtilize &&
                                  formik.errors.businessUtilize
                              )}
                              helperText={
                                formik.touched.businessUtilize &&
                                formik.errors.businessUtilize
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.businessUtilize}
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
                        <Grid
                          container
                          columnSpacing={2}
                          rowSpacing={2}
                          sx={{ alignItems: "center" }}
                        >
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
                              Does your business engage in any manufacturing
                              activities?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"businessEngageYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="businessEngage"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-businessEngage"
                              error={Boolean(
                                formik.touched.businessEngage &&
                                  formik.errors.businessEngage
                              )}
                              helperText={
                                formik.touched.businessEngage &&
                                formik.errors.businessEngage
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.businessEngage}
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
                        <Grid
                          container
                          columnSpacing={2}
                          rowSpacing={2}
                          sx={{ alignItems: "center" }}
                        >
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
                              Are the insured premises, namely floors, external
                              walls and roof are constructed 100% Reinforced
                              Cement Concrete (RCC) or 100% of
                              bricks/tile/concrete?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"constructedRccYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="constructedRccYN"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-constructedRccYN"
                              error={Boolean(
                                formik.touched.constructedRccYN &&
                                  formik.errors.constructedRccYN
                              )}
                              helperText={
                                formik.touched.constructedRccYN &&
                                formik.errors.constructedRccYN
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.constructedRccYN}
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
                        <Grid
                          container
                          columnSpacing={2}
                          rowSpacing={2}
                          sx={{ alignItems: "center" }}
                        >
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
                              Have you ever had a proposal for insurance or
                              renewal declined by an insurance compnay?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"declinedInsuranceYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="declinedInsurance"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-declinedInsurance"
                              error={Boolean(
                                formik.touched.declinedInsurance &&
                                  formik.errors.declinedInsurance
                              )}
                              helperText={
                                formik.touched.declinedInsurance &&
                                formik.errors.declinedInsurance
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.declinedInsurance}
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
                        <Grid
                          container
                          columnSpacing={2}
                          rowSpacing={2}
                          sx={{ alignItems: "center" }}
                        >
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
                              Have you had any incidents causing loss or damage
                              and/or actual insurance claims in the last 3
                              years?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch name={"lossOrDamageYN"} formik={formik} />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="lossOrDamage"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-lossOrDamage"
                              error={Boolean(
                                formik.touched.lossOrDamage &&
                                  formik.errors.lossOrDamage
                              )}
                              helperText={
                                formik.touched.lossOrDamage &&
                                formik.errors.lossOrDamage
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.lossOrDamage}
                            />
                          </Grid>
                        </Grid>
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
              <NextLink href={`/small-medium-enterprise/${smallMediumId}`} passHref>
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
      )}
    </>
  );
};

export default EditSmallMediumEnterpriseDetailForm;
