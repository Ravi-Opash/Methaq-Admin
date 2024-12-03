"use client";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import PhoneNumberInput from "src/components/phoneInput-field";
import * as Yup from "yup";
import { useFormik } from "formik";
import YNSwitch from "src/components/YNSwitch";
import EquipmentDetails from "src/components/Comercial/EquipmentDetails";
import { useDispatch, useSelector } from "react-redux";
import { editContractorPlantMachineryById } from "./Action/contractorPlantMachineryAction";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { differenceInCalendarDays } from "date-fns";
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
const policyTypeList = ["Individual Equipment", "Multiple Equipment"];

const TPLLimitList = [250000, 500000, 1000000, 2000000, 3675000, 5000000];

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
  businessActivity: Yup.string().required("Business activity is required"),
  law: Yup.string().required("law required"),
  assuredType: Yup.string().required("assuredType required"),
  territorialLimit: Yup.string().required("territorial limit is required"),
  policyType: Yup.string().required("Policy type is required"),
  noOfEquipment: Yup.string().required("No of equipment is required"),
  mortagageBankDetails: Yup.string().when("isMortagaged", {
    is: (p) => {
      return p === true;
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  remarks: Yup.string().max(500).notRequired(),
  tplLimit: Yup.string().required("TPL limit is required"),
  policyFrom: Yup.string().required("policy from is required"),
  policyTo: Yup.string().required("policy to is required"),
  equipment: Yup.array().when("isEquipmentFile", {
    is: (p) => {
      return p != true;
    },
    then: () =>
      Yup.array().of(
        Yup
          .object({
            equipmentType: Yup.string().required("Is required"),
            mfgYear: Yup.string().required("Is required"),
            equipmentValue: Yup.string().required("Is required"),
          })
          .required()
      ),
    otherwise: () => Yup.mixed().notRequired(),
  }),

  offshoreActivity: Yup.string().when("offshoreActivityYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  relatedConstruction: Yup.string().when("relatedConstructionYN", {
    is: (insType) => {
      return insType === false;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  oilGasActivity: Yup.string().when("oilGasActivityYN", {
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
  lossRatioExceeded: Yup.string().when("lossRatioExceededYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

const EditContractorPlantMachineryDetailForm = () => {
  const [loop, setLoop] = useState([1]);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { commercialId } = router.query;

  const diapatch = useDispatch();

  const { loading, contractorPlantMachinerykDetail } = useSelector(
    (state) => state.contractorPlantMachinery
  );

  const [selectedFile, setSelectedFile] = useState("");
  const [isSelectedFile, setIsSelectedFile] = useState(false);

  const [selectedEquipmentFile, setSelectedEquipmentFile] = useState("");
  const [isSelectedEquipmentFile, setIsSelectedEquipmentFile] = useState(false);

  useEffect(() => {
    if (contractorPlantMachinerykDetail?.tradeLicense) {
      setSelectedFile({
        name: contractorPlantMachinerykDetail?.tradeLicense?.originalname,
      });
    }
    if (contractorPlantMachinerykDetail?.equipmentDetail) {
      setSelectedEquipmentFile({
        name: contractorPlantMachinerykDetail?.equipmentDetail?.originalname,
      });
      formik.setFieldValue('isEquipmentFile', true)
    }
  }, [contractorPlantMachinerykDetail]);

  const [totalDays, setTotalDays] = useState(0);

  let obj = {
    equipment:
      contractorPlantMachinerykDetail?.equipment?.length > 0
        ? contractorPlantMachinerykDetail?.equipment?.map((acc, idx) => ({
            ...acc,
            equipmentType: acc?.equipmentType,
            equipmentDescription: acc?.equipmentDescription,
            mfgYear: acc?.mfgYear,
            equipmentEngineNumber: acc?.equipmentEngineNumber,
            equipmentChassisNo: acc?.equipmentChassisNo,
            equipmentPlateNo: acc?.equipmentPlateNo,
            equipmentColor: acc?.equipmentColor,
            equipmentValue: acc?.equipmentValue,
          }))
        : [],
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: contractorPlantMachinerykDetail?.fullName
        ? contractorPlantMachinerykDetail?.fullName
        : "",
      businessAddress: contractorPlantMachinerykDetail?.businessAddress || "",
      emirates: contractorPlantMachinerykDetail?.emirates || "",
      telephoneNo: contractorPlantMachinerykDetail?.telephoneNo || "",
      email: contractorPlantMachinerykDetail?.email || "",
      mobileNumber: contractorPlantMachinerykDetail?.mobileNumber || "",
      businessActivity: contractorPlantMachinerykDetail?.businessActivity || "",
      law: contractorPlantMachinerykDetail?.law || "",
      assuredType: contractorPlantMachinerykDetail?.assuredType || "",
      territorialLimit: contractorPlantMachinerykDetail?.territorialLimit || "",
      policyType: contractorPlantMachinerykDetail?.policyType || "",
      isMortagaged: contractorPlantMachinerykDetail?.isMortagaged || false,
      noOfEquipment: contractorPlantMachinerykDetail?.noOfEquipment || 1,
      isMortagaged: contractorPlantMachinerykDetail?.isMortagaged
        ? true
        : false,
      mortagageBankDetails:
        contractorPlantMachinerykDetail?.mortagageBankDetails || "",
      remarks: contractorPlantMachinerykDetail?.remarks || "",
      tplLimit: contractorPlantMachinerykDetail?.tplLimit || "",
      policyFrom: contractorPlantMachinerykDetail?.policyFrom || "",
      policyTo: contractorPlantMachinerykDetail?.policyTo || "",
      policyDays: contractorPlantMachinerykDetail?.policyDays || "",
      offshoreActivityYN: contractorPlantMachinerykDetail?.offshoreActivityYN
        ? true
        : false,
      offshoreActivity: contractorPlantMachinerykDetail?.offshoreActivity || "",
      relatedConstructionYN:
        contractorPlantMachinerykDetail?.relatedConstructionYN || false,
      relatedConstruction:
        contractorPlantMachinerykDetail?.relatedConstruction || "",
      oilGasActivityYN:
        contractorPlantMachinerykDetail?.oilGasActivityYN || false,
      oilGasActivity: contractorPlantMachinerykDetail?.oilGasActivity || "",
      policyDeclinedYN:
        contractorPlantMachinerykDetail?.policyDeclinedYN || false,
      policyDeclined: contractorPlantMachinerykDetail?.policyDeclined || "",
      lossRatioExceededYN:
        contractorPlantMachinerykDetail?.lossRatioExceededYN || false,
      lossRatioExceeded:
        contractorPlantMachinerykDetail?.lossRatioExceeded || "",
      ...obj,
    },

    validationSchema: schema,

    onSubmit: async (values, helpers) => {
      let payload = jsonToFormData({
        ...values,
        tradeLicense: isSelectedFile ? selectedFile : "",
        equipmentDetail: isSelectedEquipmentFile ? selectedEquipmentFile : "",
      });
      if (!isSelectedFile && !isSelectedEquipmentFile) {
        payload = jsonToFormData({
          ...values,
        });
      } else if (!isSelectedFile) {
        payload = jsonToFormData({
          ...values,
          equipmentDetail: isSelectedEquipmentFile ? selectedEquipmentFile : "",
        });
      } else if (!isSelectedEquipmentFile) {
        payload = jsonToFormData({
          ...values,
          equipmentDetail: isSelectedEquipmentFile ? selectedEquipmentFile : "",
        });
      }
      diapatch(
        editContractorPlantMachineryById({ id: commercialId, data: payload })
      )
        .unwrap()
        .then((res) => {
          toast.success("successfully updated!");
          router.push(`/contractor-plant-machinery/${commercialId}`);
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
  useEffect(() => {
    if (formik.values.noOfEquipment > 0) {
      const array = [];
      for (let i = 0; i < formik.values.noOfEquipment; i++) {
        array.push(1);
      }
      setLoop([...array]);

      let aa = formik?.values?.equipment;
      if (aa?.length > 0) {
        const ss = aa.slice(0, formik.values.noOfEquipment);
        formik.setFieldValue("equipment", ss);
      }
    }
  }, [formik.values.noOfEquipment]);

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
    if (contractorPlantMachinerykDetail?.mobileNumber) {
      formik.setFieldValue(
        "mobile",
        `971${contractorPlantMachinerykDetail?.mobileNumber}`
      );
      formik.setFieldValue(
        "mobileNumber",
        `${contractorPlantMachinerykDetail?.mobileNumber}`
      );
    }
    if (contractorPlantMachinerykDetail?.telephoneNo) {
      formik.setFieldValue(
        "fullTeleNo",
        `971${contractorPlantMachinerykDetail?.telephoneNo}`
      );
      formik.setFieldValue(
        "telephoneNo",
        `${contractorPlantMachinerykDetail?.telephoneNo}`
      );
    }
  }, [contractorPlantMachinerykDetail]);

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

  const handleEquipmentFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    formik.setFieldValue('isEquipmentFile', true)
    setSelectedEquipmentFile(file);
    setIsSelectedEquipmentFile(true);
    event.target.value = null; // Clear the file input value
  };

  return (
    <>
      {" "}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "10rem !important",
          }}
        >
          <AnimationLoader open={true}/>
        </Box>
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
                                  Assured Type
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
                                    formik.touched.assuredType &&
                                      formik.errors.assuredType
                                  )}
                                  helperText={
                                    formik.touched.assuredType &&
                                    formik.errors.assuredType
                                  }
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
                                  <option value={"Corporate"}>
                                    {"Corporate"}
                                  </option>
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
                                Business Activity
                                <Span> *</Span>
                              </Typography>
                              <TextField
                                error={Boolean(
                                  formik.touched.businessActivity &&
                                    formik.errors.businessActivity
                                )}
                                helperText={
                                  formik.touched.businessActivity &&
                                  formik.errors.businessActivity
                                }
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
                                Policy Type
                                <Span> *</Span>
                              </Typography>
                              <TextField
                                error={Boolean(
                                  formik.touched.policyType &&
                                    formik.errors.policyType
                                )}
                                helperText={
                                  formik.touched.policyType &&
                                  formik.errors.policyType
                                }
                                fullWidth
                                label="Policy Type "
                                name="policyType"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.policyType}
                              >
                                <option value=""></option>
                                {policyTypeList?.map((i) => (
                                  <option value={i}>{i}</option>
                                ))}
                              </TextField>
                            </Box>
                          </Grid>
                          {formik.values.policyType == "Multiple Equipment" && (
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
                                  No Of Equipment
                                  <Span> *</Span>
                                </Typography>
                                <TextField
                                  fullWidth
                                  error={Boolean(
                                    formik.touched.noOfEquipment &&
                                      formik.errors.noOfEquipment
                                  )}
                                  helperText={
                                    formik.touched.noOfEquipment &&
                                    formik.errors.noOfEquipment
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.noOfEquipment}
                                  label="No Of Equipment"
                                  name="noOfEquipment"
                                  type="number"
                                  autoComplete="new-noOfEquipment"
                                />
                              </Box>
                            </Grid>
                          )}
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
                                Is the equipment Mortgaged ?
                              </Typography>
                            </Box>
                            <FormControlLabel
                              control={
                                <Switch
                                  name="isMortagaged"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.isMortagaged}
                                  defaultChecked={
                                    contractorPlantMachinerykDetail
                                      ? contractorPlantMachinerykDetail?.isMortagaged
                                      : true
                                  }
                                />
                              }
                              label="Is the equipment Mortgaged"
                            />
                          </Grid>
                          {formik.values.isMortagaged && (
                            <Grid item xs={12} md={6}>
                              <Box
                                sx={{ display: "inline-block", width: "100%" }}
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
                                  Mortgage Bank Details<Span> *</Span>
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "inline-block",
                                  width: "100%",
                                }}
                              >
                                <TextField
                                  label="Mortgage Bank Details"
                                  name="mortagageBankDetails"
                                  type="text"
                                  autoComplete="new-mortagageBankDetails"
                                  sx={{ width: "100%" }}
                                  error={Boolean(
                                    formik.touched.mortagageBankDetails &&
                                      formik.errors.mortagageBankDetails
                                  )}
                                  helperText={
                                    formik.touched.mortagageBankDetails &&
                                    formik.errors.mortagageBankDetails
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.mortagageBankDetails}
                                />
                              </Box>
                            </Grid>
                          )}
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
                        On Site Third Party Liability
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
                                  On Site TPL Limit <Span> *</Span>
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
                                    formik.touched.tplLimit &&
                                      formik.errors.tplLimit
                                  )}
                                  helperText={
                                    formik.touched.tplLimit &&
                                    formik.errors.tplLimit
                                  }
                                  fullWidth
                                  label="On Site TPL Limit"
                                  name="tplLimit"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  select
                                  SelectProps={{ native: true }}
                                  value={formik.values.tplLimit}
                                >
                                  <option value=""></option>
                                  {TPLLimitList?.map((i) => (
                                    <option value={i}>{i}</option>
                                  ))}
                                </TextField>
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
                          fontSize: { sm: "18px", xs: "16px" },
                          color: "#60176F",
                          px: "14px",
                          borderRadius: "10px 10px 0 0",

                          alignItems: "center",
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        Equipment Details
                      </Typography>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            borderRadius: "10px",
                            // boxShadow:
                            //   "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                            mb: 3,
                          }}
                        >
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
                              Click the button below to upload Equipment
                            </Typography>

                            <Button
                              variant="contained"
                              sx={{
                                width: "140px",
                                height: "40px",
                                p: 0,
                                m: 0,
                              }}
                            >
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
                                  onChange={handleEquipmentFileUpload}
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
                              Allowed file type
                              (.pdf,.docx,.doc,.xlsx,.xls,.jpg, .jpeg,.png)
                            </Typography>
                            {selectedEquipmentFile && (
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: "#707070",
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  mb: 2,
                                }}
                              >
                                Selected File: {selectedEquipmentFile?.name}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      {loop?.map((ele, idx) => {
                        return <EquipmentDetails index={idx} formik={formik} />;
                      })}
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
                              Are you using these Equipment for offshore
                              activities?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"offshoreActivityYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="offshoreActivity"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-offshoreActivity"
                              error={Boolean(
                                formik.touched.offshoreActivity &&
                                  formik.errors.offshoreActivity
                              )}
                              helperText={
                                formik.touched.offshoreActivity &&
                                formik.errors.offshoreActivity
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.offshoreActivity}
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
                              The Equipment is purely related to Civil
                              Construction works
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"relatedConstructionYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="relatedConstruction"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-relatedConstruction"
                              error={Boolean(
                                formik.touched.relatedConstruction &&
                                  formik.errors.relatedConstruction
                              )}
                              helperText={
                                formik.touched.relatedConstruction &&
                                formik.errors.relatedConstruction
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.relatedConstruction}
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
                              Are these Equipment directly involved in Oil & Gas
                              activities?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"oilGasActivityYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="oilGasActivity"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-oilGasActivity"
                              error={Boolean(
                                formik.touched.oilGasActivity &&
                                  formik.errors.oilGasActivity
                              )}
                              helperText={
                                formik.touched.oilGasActivity &&
                                formik.errors.oilGasActivity
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.oilGasActivity}
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
                              Has your application for this policy been declined
                              in the past few years?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"policyDeclinedYN"}
                              formik={formik}
                            />
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
                              error={Boolean(
                                formik.touched.policyDeclined &&
                                  formik.errors.policyDeclined
                              )}
                              helperText={
                                formik.touched.policyDeclined &&
                                formik.errors.policyDeclined
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.policyDeclined}
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
                              In past 3 years has your loss ratio exceeded 60%
                              in any given year?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch
                              name={"lossRatioExceededYN"}
                              formik={formik}
                            />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="lossRatioExceeded"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-lossRatioExceeded"
                              error={Boolean(
                                formik.touched.lossRatioExceeded &&
                                  formik.errors.lossRatioExceeded
                              )}
                              helperText={
                                formik.touched.lossRatioExceeded &&
                                formik.errors.lossRatioExceeded
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.lossRatioExceeded}
                            />
                          </Grid>
                        </Grid>
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
                            Click the button below to upload Trade License /
                            Contract Copy
                          </Typography>

                          <Button
                            variant="contained"
                            sx={{ width: "140px", height: "40px", p: 0, m: 0 }}
                          >
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
                            Allowed file type (.pdf,.docx,.doc,.xlsx,.xls,.jpg,
                            .jpeg,.png)
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
              <NextLink href={`/contractor-plant-machinery/${commercialId}`} passHref>
                <Button
                  component="a"
                  // disabled={formik.isSubmitting}
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

export default EditContractorPlantMachineryDetailForm;
