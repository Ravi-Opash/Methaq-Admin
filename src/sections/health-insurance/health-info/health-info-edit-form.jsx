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
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import YNSwitch from "src/components/YNSwitch";
import PhoneNumberInput from "src/components/phoneInput-field";
import { getNationalities } from "src/sections/Proposals/Action/proposalsAction";
import { getHealthLeadsDetailById, updateHealthLeadDetailsById } from "../Leads/Action/healthInsuranceLeadAction";
import AnimationLoader from "src/components/amimated-loader";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const schema = Yup.object({
  fullName: Yup.string().required("Principal name is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "invalid email"),
  mobileNumber: Yup.string()
    .min(9)
    .max(9)
    .required("Mobile number is required")
    .matches(/^5/, "Mobile number should starts with 5"),
  nationality: Yup.string().required("Principal name is required"),
  city: Yup.string().required("City is required"),
  salary: Yup.string().required("Salary is required"),
  maritalStatus: Yup.string().required("Marirtal Status is required"),
  preferredHospital: Yup.mixed(),
  preferredCoPay: Yup.mixed(),
  dentalCoverage: Yup.boolean(),
  opticalCoverage: Yup.boolean(),
  isPolicyExistInUAE: Yup.string(),
  currentInsurer: Yup.string(),
  regularMedication: Yup.boolean(),
  smoke: Yup.boolean(),
  hypertension: Yup.boolean(),
  diabetes: Yup.boolean(),
  height: Yup.number(),
  weight: Yup.number(),
  spouseDetails: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string().required("Full name is required"),
      dateOfBirth: Yup.string().required("Date of birth is required"),
      gender: Yup.string().required("gender is required"),
    })
  ),
  kidsDetails: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string().required("Full name is required"),
      dateOfBirth: Yup.string().required("Date of birth is required"),
      gender: Yup.string().required("gender is required"),
    })
  ),
  otherFamilyDependentsDetails: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string().required("Full name is required"),
      dateOfBirth: Yup.string().required("Date of birth is required"),
      gender: Yup.string().required("gender is required"),
    })
  ),
  parentDetails: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string().required("Full name is required"),
      dateOfBirth: Yup.string().required("Date of birth is required"),
      gender: Yup.string().required("gender is required"),
    })
  ),
  domesticWorkerDetails: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string().required("Full name is required"),
      dateOfBirth: Yup.string().required("Date of birth is required"),
      gender: Yup.string().required("gender is required"),
    })
  ),
}).required();

const nationalities = ["India", "Pakistan", "Philippens", "UAE", "Egypt", "Jordan", "Africa", "Austrelia"];

const cities = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];

export const hospitalList = [
  {
    NAME: "BURJEEL HOSPITALS LLC - Abu Dhabi",
  },
  {
    NAME: "BURJEEL DAY SURGERY CENTER LLC / ALREEM - Abu Dhabi",
  },
  {
    NAME: "MEDICLINIC HOSPITAL L.L.C. / Airport road - Abu Dhabi",
  },
  {
    NAME: "MEDICLINIC HOSPITAL L.L.C. / Khalifa Street - Abu Dhabi",
  },
  {
    NAME: "CLEVELAND CLINIC ABU DHABI LLC - Abu Dhabi",
  },
  {
    NAME: "MEDEOR 24X7 HOSPITAL LLC - Abu Dhabi",
  },
  {
    NAME: "SAUDI GERMAN HOSPITAL - Duabi",
  },
  {
    NAME: "AMERICAN HOSPITAL - Duabi",
  },
  {
    NAME: "AL JALILA CHILDREN'S SPECIALTY HOSPITAL - Duabi",
  },
  {
    NAME: "Medcare Hospitals - Duabi",
  },
  {
    NAME: "DR.SULAIMAN AL HABIB HOSPITAL - Duabi",
  },
  {
    NAME: "IRANIAN HOSPITAL - Duabi",
  },
  {
    NAME: "AL ZAHRA HOSPITAL - Duabi",
  },
  {
    NAME: "SAUDI GERMAN HOSPITAL - Ajman",
  },
  {
    NAME: "EMIRATES HOSPITAL - Duabi",
  },
  {
    NAME: "Aster Clinics",
  },
  {
    NAME: "ZULEKHA HOSPITAL - Sharjah",
  },
  {
    NAME: "SUNNY SHARQAN MEDICAL CENTRE LLC - Sharjah",
  },
  {
    NAME: "ZAHRAWI HOSPITAL - RAK",
  },
  {
    NAME: "THUMBAY HOSPITAL LLC",
  },
];

const maritalStatusList = ["Married", "Single", "Divorced", "Widow"];

const salaries = ["Up to 4000", "4000 - 12000", "12000+"];

const preferredCoPayList = [
  { label: "0%", value: "0" },
  { label: "10%", value: "10" },
  { label: "15%", value: "15" },
  { label: "20%", value: "20" },
  { label: "30%", value: "30" },
];

const currentInsurance = [
  "Al Ittihad Al Watani",
  "AXA / GIG",
  "Al Sagr Insurance Company",
  "Arabia Insurance Company",
  "Al Buhaira National Insurance Company",
  "Al Dhafra Insurance Company",
  "Abu Dhabi National Takaful",
  "Alliance",
  "Adamjee",
  "Bupa",
  "Cigna",
  "Daman",
  "Dubai Insurance Company",
  "Dubai National Insurance Company",
  "Emirates Insurance Company",
  "Fidelity United",
  "Insurance House",
  "MedGulf",
  "MaxHealth",
  "Methaq",
  "NLGI",
  "Noor Takaful",
  "National General Insurance",
  "Orient Insurance Company",
  "Orient Takaful Insurance Company",
  "Oman / Sukoon",
  "Qatar Insurance Company",
  "RAK Insurance",
  "Salama Insurance Company",
  "SAICOHEALTH Damana",
  "Takaful Emarat",
  "Union Insurance",
  "Watania",
  "Yas Takaful",
  "Others",
];

const EditHealthInsuranceInfoForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { proposalId } = router.query;

  const { healthLeadDetails, loading } = useSelector((state) => state.healthInsuranceLeads);
  const healthInsuranceFilter = useRef(false);
  const [isError, setIsError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [nationalityList, setNationalityList] = useState([]);

  const getHealthInfo = async () => {
    if (healthInsuranceFilter.current) {
      return;
    }
    healthInsuranceFilter.current = true;

    try {
      dispatch(getHealthLeadsDetailById(proposalId))
        .unwrap()
        .then((res) => {
          // console.log("res", res);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getNationalities({}))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        setNationalityList(res);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  useEffect(() => {
    if (proposalId) {
      getHealthInfo();
    }
  }, [proposalId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: healthLeadDetails?.fullName || "",
      dateOfBirth: healthLeadDetails?.dateOfBirth || "",
      email: healthLeadDetails?.email || "",
      mobile: "971" + (healthLeadDetails?.mobileNumber || ""),
      countryCode: healthLeadDetails?.countryCode || "971",
      mobileNumber: healthLeadDetails?.mobileNumber || "",
      nationality: healthLeadDetails?.nationality || "",
      city: healthLeadDetails?.city || "",
      salary: healthLeadDetails?.salary || "",
      maritalStatus: healthLeadDetails?.maritalStatus || "",
      preferredHospital: healthLeadDetails?.preferenceDetails?.preferredHospital || "",
      preferredCoPay: healthLeadDetails?.preferenceDetails?.preferredCoPay || "",
      dentalCoverage: healthLeadDetails?.preferenceDetails?.dentalCoverage || false,
      opticalCoverage: healthLeadDetails?.preferenceDetails?.opticalCoverage || false,
      isPolicyExistInUAE: healthLeadDetails?.isPolicyExistInUAE || "no",
      currentInsurer: healthLeadDetails?.currentInsurer || "",
      regularMedication: healthLeadDetails?.regularMedication || false,
      smoke: healthLeadDetails?.smoke || false,
      hypertension: healthLeadDetails?.hypertension || false,
      diabetes: healthLeadDetails?.diabetes || false,
      height: healthLeadDetails?.height || "",
      weight: healthLeadDetails?.weight || "",
      spouseDetails: healthLeadDetails?.spouseDetails || [],
      kidsDetails: healthLeadDetails?.kidsDetails || [],
      otherFamilyDependentsDetails: healthLeadDetails?.otherFamilyDependentsDetails || [],
      parentDetails: healthLeadDetails?.parentDetails || [],
      domesticWorkerDetails: healthLeadDetails?.domesticWorkerDetails || [],
    },

    validationSchema: schema,

    onSubmit: async (values, helpers) => {
      // console.log(values, "value");
      const payload = {
        ...values,
        preferenceDetails: {
          preferredHospital: values?.preferredHospital,
          preferredCoPay: values?.preferredCoPay,
          dentalCoverage: values?.dentalCoverage,
          opticalCoverage: values?.opticalCoverage,
        },
      };
      delete payload.preferredHospital;
      delete payload.preferredCoPay;
      delete payload.dentalCoverage;
      delete payload.opticalCoverage;

      // console.log(payload, "payload");

      setIsLoader(true);
      dispatch(updateHealthLeadDetailsById({ id: proposalId, data: payload }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          toast.success("Successfully updated!");
          setIsLoader(false);
          router?.push(`/health-insurance/proposal/${proposalId}`);
        })
        .catch((err) => {
          console.log(err, "err");
          setIsLoader(false);
          toast.error(err);
        });
    },
  });

  const handleNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  return (
    <>
      {isLoader && (
        <>
          <AnimationLoader open={true}/>
        </>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Card>
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
                        // display: "inline-block",
                        color: "#60176F",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: "14px",
                        borderRadius: "10px 10px 0 0",
                      }}
                    >
                      Personal Details
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
                                Full Name <Span> *</Span>
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
                                label="Full Name"
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
                                Date Of Birth <Span> *</Span>
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <DatePicker
                                inputFormat="dd-MM-yyyy"
                                label="From"
                                onChange={(value) => {
                                  formik.setFieldValue("dateOfBirth", new Date(value).toISOString(), true);
                                }}
                                renderInput={(params) => (
                                  <TextField name="dateOfBirth" fullWidth {...params} error={false} />
                                )}
                                value={formik.values.dateOfBirth}
                              />

                              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontSize: "12px",
                                    display: "inline-block",
                                    color: "red",
                                  }}
                                >
                                  {formik.errors.dateOfBirth}
                                </Typography>
                              )}
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
                                Email <Span> *</Span>
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
                                label="Email"
                                name="email"
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
                                Mobile # <Span> *</Span> (971 XXXXXXXXX)
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <PhoneNumberInput
                                // name="mobile"
                                label={"Mobile No"}
                                handleMobileNumberChange={handleNumberChange}
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
                                Nationality <Span> *</Span>
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
                                error={Boolean(formik.touched.nationality && formik.errors.nationality)}
                                helperText={formik.touched.nationality && formik.errors.nationality}
                                fullWidth
                                label="Nationality"
                                name="nationality"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.nationality}
                              >
                                <option value=""></option>
                                {nationalityList?.data?.map((n) => {
                                  return <option value={n}>{n}</option>;
                                })}
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
                                City <Span> *</Span>
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
                                error={Boolean(formik.touched.city && formik.errors.city)}
                                helperText={formik.touched.city && formik.errors.city}
                                fullWidth
                                label="City"
                                name="city"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.city}
                              >
                                <option value=""></option>
                                {cities.map((c) => {
                                  return <option value={c}>{c}</option>;
                                })}
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
                                Salary <Span> *</Span>
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
                                error={Boolean(formik.touched.salary && formik.errors.salary)}
                                helperText={formik.touched.salary && formik.errors.salary}
                                fullWidth
                                label="Salary"
                                name="salary"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.salary}
                              >
                                <option value=""></option>
                                {salaries.map((s) => {
                                  return <option value={s}>{s}</option>;
                                })}
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
                                Marital Status <Span> *</Span>
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
                                error={Boolean(formik.touched.maritalStatus && formik.errors.maritalStatus)}
                                helperText={formik.touched.maritalStatus && formik.errors.maritalStatus}
                                fullWidth
                                label="Marital Status"
                                name="maritalStatus"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.maritalStatus}
                              >
                                <option value=""></option>
                                {maritalStatusList.map((m) => {
                                  return <option value={m}>{m}</option>;
                                })}
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
                      Preference Details
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
                                Preferred Hospital
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              {/* <TextField
                                                                error={Boolean(
                                                                    formik.touched.preferredHospital && formik.errors.preferredHospital
                                                                )}
                                                                helperText={formik.touched.preferredHospital && formik.errors.preferredHospital}
                                                                fullWidth
                                                                label="Preferred Hospital"
                                                                name="preferredHospital"
                                                                onBlur={formik.handleBlur}
                                                                onChange={formik.handleChange}
                                                                select
                                                                SelectProps={{ native: true }}
                                                                value={formik.values.preferredHospital}
                                                            >
                                                                <option value=""></option>
                                                                {hospitalList.map((h) => {
                                                                    return <option value={h?.NAME}>{h?.NAME}</option>
                                                                })}
                                                            </TextField> */}
                              <FormControl
                                fullWidth
                                sx={{
                                  "& label.Mui-focused": {
                                    color: "#60176F",
                                  },
                                }}
                              >
                                <InputLabel
                                  sx={{
                                    transform: "translate(12px, 20px) scale(1)",
                                    background: "#FFF",
                                    padding: "0 4px",
                                  }}
                                  id="demo-multiple-chip-label"
                                >
                                  Preferred Hospital
                                </InputLabel>
                                <Select
                                  labelId="demo-multiple-chip-label"
                                  id="demo-multiple-chip"
                                  name="preferredHospital"
                                  multiple
                                  fullWidth
                                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                  value={formik.values.preferredHospital || []}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  MenuProps={MenuProps}
                                  renderValue={(selected) => (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                      ))}
                                    </Box>
                                  )}
                                >
                                  {hospitalList.map((h) => {
                                    return <MenuItem value={h?.NAME}>{h?.NAME}</MenuItem>;
                                  })}
                                </Select>
                              </FormControl>
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
                                Preferred Co Pay
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              {/* <TextField
                                error={Boolean(
                                  formik.touched.preferredCoPay &&
                                    formik.errors.preferredCoPay
                                )}
                                helperText={
                                  formik.touched.preferredCoPay &&
                                  formik.errors.preferredCoPay
                                }
                                fullWidth
                                label="Preferred Co Pay"
                                name="preferredCoPay"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.preferredCoPay}
                              >
                                <option value=""></option>
                                {preferredCoPayList.map((c) => {
                                  return (
                                    <option value={c.value}>{c.label}</option>
                                  );
                                })}
                              </TextField> */}

                              <FormControl
                                fullWidth
                                sx={{
                                  "& label.Mui-focused": {
                                    color: "#60176F",
                                  },
                                }}
                              >
                                <InputLabel
                                  sx={{
                                    transform: "translate(12px, 20px) scale(1)",
                                    background: "#FFF",
                                    padding: "0 4px",
                                  }}
                                  id="demo-multiple-chip-label"
                                >
                                  Preferred Co Pay
                                </InputLabel>
                                <Select
                                  labelId="demo-multiple-chip-label"
                                  id="demo-multiple-chip"
                                  name="preferredCoPay"
                                  multiple
                                  fullWidth
                                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                  value={formik.values.preferredCoPay || []}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  MenuProps={MenuProps}
                                  renderValue={(selected) => (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                      ))}
                                    </Box>
                                  )}
                                >
                                  {preferredCoPayList.map((h) => {
                                    return <MenuItem value={h?.value}>{h?.label}</MenuItem>;
                                  })}
                                </Select>
                              </FormControl>
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
                                Dental Coverage
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <YNSwitch name={"dentalCoverage"} formik={formik} />
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
                                Optical Coverage
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <YNSwitch name={"opticalCoverage"} formik={formik} />
                            </Box>
                          </Box>
                          multiple
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Box>

                {healthLeadDetails?.spouseDetails?.length > 0 && (
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
                        Spouse Details
                      </Typography>
                      {formik?.values?.spouseDetails?.map((s, i) => {
                        return (
                          <Box sx={{ mt: 1, p: 1, px: 2 }}>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Full Name <Span> *</Span>
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
                                        formik.touched.spouseDetails &&
                                          formik.errors.spouseDetails &&
                                          formik.touched.spouseDetails[i] &&
                                          formik.errors.spouseDetails[i] &&
                                          formik.touched.spouseDetails[i]?.fullName &&
                                          formik.errors.spouseDetails[i]?.fullName
                                      )}
                                      helperText={
                                        formik.touched.spouseDetails &&
                                        formik.errors.spouseDetails &&
                                        formik.touched.spouseDetails[i] &&
                                        formik.errors.spouseDetails[i] &&
                                        formik.touched.spouseDetails[i]?.fullName &&
                                        formik.errors.spouseDetails[i]?.fullName
                                      }
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik?.values?.spouseDetails[i].fullName}
                                      label="Full Name"
                                      name={`spouseDetails[${i}].fullName`}
                                      type="text"
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Date Of Birth <Span> *</Span>
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <DatePicker
                                      inputFormat="dd-MM-yyyy"
                                      label="From"
                                      onChange={(value) => {
                                        formik.setFieldValue(
                                          `spouseDetails[${i}].dateOfBirth`,
                                          new Date(value).toISOString(),
                                          true
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          name={`spouseDetails[${i}].dateOfBirth`}
                                          fullWidth
                                          {...params}
                                          error={false}
                                        />
                                      )}
                                      value={formik.values?.spouseDetails[i].dateOfBirth}
                                    />

                                    {formik.touched.spouseDetails &&
                                      formik.errors.spouseDetails &&
                                      formik.touched.spouseDetails[i] &&
                                      formik.errors.spouseDetails[i] &&
                                      formik.touched?.spouseDetails[i].dateOfBirth &&
                                      formik.errors?.spouseDetails[i].dateOfBirth && (
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            fontSize: "12px",
                                            display: "inline-block",
                                            color: "red",
                                          }}
                                        >
                                          {formik.errors?.spouseDetails[i].dateOfBirth}
                                        </Typography>
                                      )}
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Gender <Span> *</Span>
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
                                        formik.touched.spouseDetails &&
                                          formik.errors.spouseDetails &&
                                          formik.touched.spouseDetails[i] &&
                                          formik.errors.spouseDetails[i] &&
                                          formik.touched?.spouseDetails[i]?.gender &&
                                          formik.errors?.spouseDetails[i]?.gender
                                      )}
                                      helperText={
                                        formik.touched.spouseDetails &&
                                        formik.errors.spouseDetails &&
                                        formik.touched.spouseDetails[i] &&
                                        formik.errors.spouseDetails[i] &&
                                        formik.touched?.spouseDetails[i]?.gender &&
                                        formik.errors?.spouseDetails[i]?.gender
                                      }
                                      fullWidth
                                      label="Gender"
                                      name={`spouseDetails[${i}].gender`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      select
                                      SelectProps={{ native: true }}
                                      value={formik.values.spouseDetails[i].gender}
                                    >
                                      <option value=""></option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {healthLeadDetails?.kidsDetails?.length > 0 && (
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
                        Kids Details
                      </Typography>
                      {formik?.values?.kidsDetails?.map((s, i) => {
                        return (
                          <Box sx={{ mt: 1, p: 1, px: 2 }}>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Full Name <Span> *</Span>
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
                                        formik.touched.kidsDetails &&
                                          formik.errors.kidsDetails &&
                                          formik.touched.kidsDetails[i] &&
                                          formik.errors.kidsDetails[i] &&
                                          formik.touched.kidsDetails[i]?.fullName &&
                                          formik.errors.kidsDetails[i]?.fullName
                                      )}
                                      helperText={
                                        formik.touched.kidsDetails &&
                                        formik.errors.kidsDetails &&
                                        formik.touched.kidsDetails[i] &&
                                        formik.errors.kidsDetails[i] &&
                                        formik.touched.kidsDetails[i]?.fullName &&
                                        formik.errors.kidsDetails[i]?.fullName
                                      }
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik?.values?.kidsDetails[i].fullName}
                                      label="Full Name"
                                      name={`kidsDetails[${i}].fullName`}
                                      type="text"
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Date Of Birth <Span> *</Span>
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <DatePicker
                                      inputFormat="dd-MM-yyyy"
                                      label="From"
                                      onChange={(value) => {
                                        formik.setFieldValue(
                                          `kidsDetails[${i}].dateOfBirth`,
                                          new Date(value).toISOString(),
                                          true
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          name={`kidsDetails[${i}].dateOfBirth`}
                                          fullWidth
                                          {...params}
                                          error={false}
                                        />
                                      )}
                                      value={formik.values?.kidsDetails[i].dateOfBirth}
                                    />

                                    {formik.touched.kidsDetails &&
                                      formik.errors.kidsDetails &&
                                      formik.touched.kidsDetails[i] &&
                                      formik.errors.kidsDetails[i] &&
                                      formik.touched?.kidsDetails[i].dateOfBirth &&
                                      formik.errors?.kidsDetails[i].dateOfBirth && (
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            fontSize: "12px",
                                            display: "inline-block",
                                            color: "red",
                                          }}
                                        >
                                          {formik.errors?.kidsDetails[i].dateOfBirth}
                                        </Typography>
                                      )}
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Gender <Span> *</Span>
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
                                        formik.touched.kidsDetails &&
                                          formik.errors.kidsDetails &&
                                          formik.touched.kidsDetails[i] &&
                                          formik.errors.kidsDetails[i] &&
                                          formik.touched?.kidsDetails[i]?.gender &&
                                          formik.errors?.kidsDetails[i]?.gender
                                      )}
                                      helperText={
                                        formik.touched.kidsDetails &&
                                        formik.errors.kidsDetails &&
                                        formik.touched.kidsDetails[i] &&
                                        formik.errors.kidsDetails[i] &&
                                        formik.touched?.kidsDetails[i]?.gender &&
                                        formik.errors?.kidsDetails[i]?.gender
                                      }
                                      fullWidth
                                      label="Gender"
                                      name={`kidsDetails[${i}].gender`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      select
                                      SelectProps={{ native: true }}
                                      value={formik.values.kidsDetails[i].gender}
                                    >
                                      <option value=""></option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {healthLeadDetails?.otherFamilyDependentsDetails?.length > 0 && (
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
                        Dependent Details
                      </Typography>
                      {formik?.values?.otherFamilyDependentsDetails?.map((s, i) => {
                        return (
                          <Box sx={{ mt: 1, p: 1, px: 2 }}>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Full Name <Span> *</Span>
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
                                        formik.touched.otherFamilyDependentsDetails &&
                                          formik.errors.otherFamilyDependentsDetails &&
                                          formik.touched.otherFamilyDependentsDetails[i] &&
                                          formik.errors.otherFamilyDependentsDetails[i] &&
                                          formik.touched.otherFamilyDependentsDetails[i]?.fullName &&
                                          formik.errors.otherFamilyDependentsDetails[i]?.fullName
                                      )}
                                      helperText={
                                        formik.touched.otherFamilyDependentsDetails &&
                                        formik.errors.otherFamilyDependentsDetails &&
                                        formik.touched.otherFamilyDependentsDetails[i] &&
                                        formik.errors.otherFamilyDependentsDetails[i] &&
                                        formik.touched.otherFamilyDependentsDetails[i]?.fullName &&
                                        formik.errors.otherFamilyDependentsDetails[i]?.fullName
                                      }
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik?.values?.otherFamilyDependentsDetails[i].fullName}
                                      label="Full Name"
                                      name={`otherFamilyDependentsDetails[${i}].fullName`}
                                      type="text"
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Date Of Birth <Span> *</Span>
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <DatePicker
                                      inputFormat="dd-MM-yyyy"
                                      label="From"
                                      onChange={(value) => {
                                        formik.setFieldValue(
                                          `otherFamilyDependentsDetails[${i}].dateOfBirth`,
                                          new Date(value).toISOString(),
                                          true
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          name={`otherFamilyDependentsDetails[${i}].dateOfBirth`}
                                          fullWidth
                                          {...params}
                                          error={false}
                                        />
                                      )}
                                      value={formik.values?.otherFamilyDependentsDetails[i].dateOfBirth}
                                    />

                                    {formik.touched.otherFamilyDependentsDetails &&
                                      formik.errors.otherFamilyDependentsDetails &&
                                      formik.touched.otherFamilyDependentsDetails[i] &&
                                      formik.errors.otherFamilyDependentsDetails[i] &&
                                      formik.touched?.otherFamilyDependentsDetails[i].dateOfBirth &&
                                      formik.errors?.otherFamilyDependentsDetails[i].dateOfBirth && (
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            fontSize: "12px",
                                            display: "inline-block",
                                            color: "red",
                                          }}
                                        >
                                          {formik.errors?.otherFamilyDependentsDetails[i].dateOfBirth}
                                        </Typography>
                                      )}
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Gender <Span> *</Span>
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
                                        formik.touched.otherFamilyDependentsDetails &&
                                          formik.errors.otherFamilyDependentsDetails &&
                                          formik.touched.otherFamilyDependentsDetails[i] &&
                                          formik.errors.otherFamilyDependentsDetails[i] &&
                                          formik.touched?.otherFamilyDependentsDetails[i]?.gender &&
                                          formik.errors?.otherFamilyDependentsDetails[i]?.gender
                                      )}
                                      helperText={
                                        formik.touched.otherFamilyDependentsDetails &&
                                        formik.errors.otherFamilyDependentsDetails &&
                                        formik.touched.otherFamilyDependentsDetails[i] &&
                                        formik.errors.otherFamilyDependentsDetails[i] &&
                                        formik.touched?.otherFamilyDependentsDetails[i]?.gender &&
                                        formik.errors?.otherFamilyDependentsDetails[i]?.gender
                                      }
                                      fullWidth
                                      label="Gender"
                                      name={`otherFamilyDependentsDetails[${i}].gender`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      select
                                      SelectProps={{ native: true }}
                                      value={formik.values.otherFamilyDependentsDetails[i].gender}
                                    >
                                      <option value=""></option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {healthLeadDetails?.parentDetails?.length > 0 && (
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
                        Parents Details
                      </Typography>
                      {formik?.values?.parentDetails?.map((s, i) => {
                        return (
                          <Box sx={{ mt: 1, p: 1, px: 2 }}>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Full Name <Span> *</Span>
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
                                        formik.touched.parentDetails &&
                                          formik.errors.parentDetails &&
                                          formik.touched.parentDetails[i] &&
                                          formik.errors.parentDetails[i] &&
                                          formik.touched.parentDetails[i]?.fullName &&
                                          formik.errors.parentDetails[i]?.fullName
                                      )}
                                      helperText={
                                        formik.touched.parentDetails &&
                                        formik.errors.parentDetails &&
                                        formik.touched.parentDetails[i] &&
                                        formik.errors.parentDetails[i] &&
                                        formik.touched.parentDetails[i]?.fullName &&
                                        formik.errors.parentDetails[i]?.fullName
                                      }
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik?.values?.parentDetails[i].fullName}
                                      label="Full Name"
                                      name={`parentDetails[${i}].fullName`}
                                      type="text"
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Date Of Birth <Span> *</Span>
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <DatePicker
                                      inputFormat="dd-MM-yyyy"
                                      label="From"
                                      onChange={(value) => {
                                        formik.setFieldValue(
                                          `parentDetails[${i}].dateOfBirth`,
                                          new Date(value).toISOString(),
                                          true
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          name={`parentDetails[${i}].dateOfBirth`}
                                          fullWidth
                                          {...params}
                                          error={false}
                                        />
                                      )}
                                      value={formik.values?.parentDetails[i].dateOfBirth}
                                    />

                                    {formik.touched.parentDetails &&
                                      formik.errors.parentDetails &&
                                      formik.touched.parentDetails[i] &&
                                      formik.errors.parentDetails[i] &&
                                      formik.touched?.parentDetails[i].dateOfBirth &&
                                      formik.errors?.parentDetails[i].dateOfBirth && (
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            fontSize: "12px",
                                            display: "inline-block",
                                            color: "red",
                                          }}
                                        >
                                          {formik.errors?.parentDetails[i].dateOfBirth}
                                        </Typography>
                                      )}
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Gender <Span> *</Span>
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
                                        formik.touched.parentDetails &&
                                          formik.errors.parentDetails &&
                                          formik.touched.parentDetails[i] &&
                                          formik.errors.parentDetails[i] &&
                                          formik.touched?.parentDetails[i]?.gender &&
                                          formik.errors?.parentDetails[i]?.gender
                                      )}
                                      helperText={
                                        formik.touched.parentDetails &&
                                        formik.errors.parentDetails &&
                                        formik.touched.parentDetails[i] &&
                                        formik.errors.parentDetails[i] &&
                                        formik.touched?.parentDetails[i]?.gender &&
                                        formik.errors?.parentDetails[i]?.gender
                                      }
                                      fullWidth
                                      label="Gender"
                                      name={`parentDetails[${i}].gender`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      select
                                      SelectProps={{ native: true }}
                                      value={formik.values.parentDetails[i].gender}
                                    >
                                      <option value=""></option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {healthLeadDetails?.domesticWorkerDetails?.length > 0 && (
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
                        Domestic Workers Details
                      </Typography>
                      {formik?.values?.domesticWorkerDetails?.map((s, i) => {
                        return (
                          <Box sx={{ mt: 1, p: 1, px: 2 }}>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Full Name <Span> *</Span>
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
                                        formik.touched.domesticWorkerDetails &&
                                          formik.errors.domesticWorkerDetails &&
                                          formik.touched.domesticWorkerDetails[i] &&
                                          formik.errors.domesticWorkerDetails[i] &&
                                          formik.touched.domesticWorkerDetails[i]?.fullName &&
                                          formik.errors.domesticWorkerDetails[i]?.fullName
                                      )}
                                      helperText={
                                        formik.touched.domesticWorkerDetails &&
                                        formik.errors.domesticWorkerDetails &&
                                        formik.touched.domesticWorkerDetails[i] &&
                                        formik.errors.domesticWorkerDetails[i] &&
                                        formik.touched.domesticWorkerDetails[i]?.fullName &&
                                        formik.errors.domesticWorkerDetails[i]?.fullName
                                      }
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik?.values?.domesticWorkerDetails[i].fullName}
                                      label="Full Name"
                                      name={`domesticWorkerDetails[${i}].fullName`}
                                      type="text"
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Date Of Birth <Span> *</Span>
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <DatePicker
                                      inputFormat="dd-MM-yyyy"
                                      label="From"
                                      onChange={(value) => {
                                        formik.setFieldValue(
                                          `domesticWorkerDetails[${i}].dateOfBirth`,
                                          new Date(value).toISOString(),
                                          true
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          name={`domesticWorkerDetails[${i}].dateOfBirth`}
                                          fullWidth
                                          {...params}
                                          error={false}
                                        />
                                      )}
                                      value={formik.values?.domesticWorkerDetails[i].dateOfBirth}
                                    />

                                    {formik.touched.domesticWorkerDetails &&
                                      formik.errors.domesticWorkerDetails &&
                                      formik.touched.domesticWorkerDetails[i] &&
                                      formik.errors.domesticWorkerDetails[i] &&
                                      formik.touched?.domesticWorkerDetails[i].dateOfBirth &&
                                      formik.errors?.domesticWorkerDetails[i].dateOfBirth && (
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            fontSize: "12px",
                                            display: "inline-block",
                                            color: "red",
                                          }}
                                        >
                                          {formik.errors?.domesticWorkerDetails[i].dateOfBirth}
                                        </Typography>
                                      )}
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                    }}
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
                                      Gender <Span> *</Span>
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
                                        formik.touched.domesticWorkerDetails &&
                                          formik.errors.domesticWorkerDetails &&
                                          formik.touched.domesticWorkerDetails[i] &&
                                          formik.errors.domesticWorkerDetails[i] &&
                                          formik.touched?.domesticWorkerDetails[i]?.gender &&
                                          formik.errors?.domesticWorkerDetails[i]?.gender
                                      )}
                                      helperText={
                                        formik.touched.domesticWorkerDetails &&
                                        formik.errors.domesticWorkerDetails &&
                                        formik.touched.domesticWorkerDetails[i] &&
                                        formik.errors.domesticWorkerDetails[i] &&
                                        formik.touched?.domesticWorkerDetails[i]?.gender &&
                                        formik.errors?.domesticWorkerDetails[i]?.gender
                                      }
                                      fullWidth
                                      label="Gender"
                                      name={`domesticWorkerDetails[${i}].gender`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      select
                                      SelectProps={{ native: true }}
                                      value={formik.values.domesticWorkerDetails[i].gender}
                                    >
                                      <option value=""></option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

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
                      More Info
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
                                Do you have an existing Policy in the UAE?
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
                                error={Boolean(formik.touched.isPolicyExistInUAE && formik.errors.isPolicyExistInUAE)}
                                helperText={formik.touched.isPolicyExistInUAE && formik.errors.isPolicyExistInUAE}
                                fullWidth
                                label="Do you have an existing Policy in the UAE?"
                                name="isPolicyExistInUAE"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.isPolicyExistInUAE}
                              >
                                <option value=""></option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="expired">Expired</option>
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
                                Who is your current insurer?
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
                                error={Boolean(formik.touched.currentInsurer && formik.errors.currentInsurer)}
                                helperText={formik.touched.currentInsurer && formik.errors.currentInsurer}
                                fullWidth
                                label="Current Insurer"
                                name="currentInsurer"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.currentInsurer}
                              >
                                <option value=""></option>
                                {currentInsurance.map((c) => {
                                  return <option value={c}>{c}</option>;
                                })}
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
                                Are you on regular medication or have existing medical conditions?
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <YNSwitch name={"regularMedication"} formik={formik} />
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
                                Do you smoke?
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <YNSwitch name={"smoke"} formik={formik} />
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
                                Do you have hypertension?
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <YNSwitch name={"hypertension"} formik={formik} />
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
                                Do you have Diabetes?
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <YNSwitch name={"diabetes"} formik={formik} />
                            </Box>
                          </Box>
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
            <Button disabled={formik.isSubmitting} type="submit" variant="contained">
              Update
            </Button>
            <NextLink href={`/health-insurance/proposal/${proposalId}`} passHref>
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

export default EditHealthInsuranceInfoForm;
