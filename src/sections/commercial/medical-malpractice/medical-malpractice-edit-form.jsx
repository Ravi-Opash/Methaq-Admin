"use client";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  Card,
  CardActions,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import PhoneNumberInput from "src/components/phoneInput-field";
import * as Yup from "yup";
import { useFormik } from "formik";
import YNSwitch from "src/components/YNSwitch";
import ClientDetailsForm from "src/components/Comercial/ClientDetailsForm";
import { differenceInCalendarDays } from "date-fns";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { editMedicalMalPracticeDetailsById } from "./Action/medicalmalepracticeAction";
import { toast } from "react-toastify";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import AnimationLoader from "src/components/amimated-loader";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));
const proposerEm = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];
const StaffSpeciality = [
  "Acupuncture (No Surgery)",
  "Allergy (No Surgery)",
  "Anaesthesiology (Major Surgery)",
  "Anesthesia Technician (No Surgery)",
  "Ayurvedic (No Surgery)",
  "Beautician (No Surgery)",
  "Cardiovascular Disease (Minor Surgery)",
  "Cardiovascular Disease (No Surgery)",
  "Chiropractic (No Surgery)",
  "Consultant Surgeons (Excluding Surgery)",
  "Dental Assistant",
  "Dentist - including minor surgery",
  "Dermatology (Minor Surgery)",
  "Diabetes (Minor Surgery)",
  "Dialisys technologist (No Surgery)",
  "Dietician / nutritionist",
  "E N T (Minor Surgery)",
  "Emergency Medicine (Major Surgery)",
  "Endocrinology (Minor Surgery)",
  "Endodontist (Minor Surgery)",
  "Fertility Specialist (Major Surgery)",
  "Gastoenterology (Minor Surgery)",
  "General Practitioners / Physician - (No Surgery)",
  "Geriatrics (Minor Surgery)",
  "Gynaecologitgs (Excluding Surgeries and/or deliveries)",
  "Hair Transplant (No Surgery)",
  "Hematology (Minor Surgery)",
  "Homeopathey (Technician)",
  "Homeopathy (No Surgery)",
  "Infectious Disease (Minor Surgery)",
  "Intensive Care Medicine (Minor Surgery)",
  "Internal Medicine (No Surgery)",
  "Lab Technician",
  "Laboratory Specialist",
  "Laryngology (Minor Surgery)",
  "Laser technician memo (No Surgery)",
  "Microbiologist (No Surgery)",
  "Neoplastic Disease (Minor Surgery)",
  "Neoplastic Disease (No Surgery)",
  "Nephrology (No Surgery)",
  "Nuclear Medicine (No Surgery)",
  "Nurse",
  "Ophthalmology (Minor Surgery)",
  "Optomeeterist",
  "Orthodontist (Minor Surgery)",
  "Orthodontist (No Surgery)",
  "Orthopaedic (Minor Surgery)",
  "Otology (No Surgery)",
  "Otorhinolaryngology (No Surgery)",
  "Pathologist (No Surgery)",
  "Pediatrician (No Surgery)",
  "Pharmacist",
  "Physicians Assistant",
  "Physiotherapist (No Surgery)",
  "Physiotherapist Technician",
  "Physiotherapist Technician",
  "Psychiatrist (No Surgery)",
  "Radiology - diagnostic (Minor Surgery)",
  "Rhinology (Minor Surgery)",
  "Speech therapist (No Surgery)",
  "Surgery - Cardiac (Major Surgery)",
  "Surgery - Neurology (Major Surgery)",
  "Surgery - Plastic (renewal only) (Major Surgery)",
  "Surgery-Abdominal, Colon & Rectal (Major Surgery)",
  "Traditional Medicines (No Surgery)",
  "Urology (Minor Surgery)",
];
const ClaimList = [250000, 500000, 1000000, 2000000, 3675000, 5000000];

const schema = Yup.object({
  fullName: Yup.string().notRequired(),
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
  law: Yup.string().required("law required"),
  territorialLimit: Yup.string().required("territorial limit is required"),
  policyType: Yup.string().required("Policy type is required"),
  noOfStaff: Yup.string().required("No of staff is required"),
  emiratesId: Yup.string().when("policyType", {
    is: (p) => {
      return p === "Individual";
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  clinicsName: Yup.string().required("Clinic name is required"),
  staffSpeciality: Yup.string().when("policyType", {
    is: (p) => {
      return p === "Individual";
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  staffLicenseCode: Yup.string().when("policyType", {
    is: (p) => {
      return p === "Individual";
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  remarks: Yup.string().max(500).notRequired(),
  anyOneClaim: Yup.string().required("Is required"),
  inAggregate: Yup.string().required("Is required"),
  policyFrom: Yup.string().required("policy from is required"),
  policyTo: Yup.string().required("policy to is required"),
  // policyDays: Yup.string().required("policy Days is required"),
  patientsPerYear: Yup.string().when("policyType", {
    is: (p) => {
      return p === "Clinics";
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  establishmentOwnedBy: Yup.string().when("policyType", {
    is: (p) => {
      return p === "Clinics";
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  operationTimeByOwneres: Yup.string().when("policyType", {
    is: (p) => {
      return p === "Clinics";
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  mainProductOnClinic: Yup.string().when("policyType", {
    is: (p) => {
      return p === "Clinics";
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),

  involvedInProcedures: Yup.string().when("involvedInProceduresYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  operateMachine: Yup.string().when("operateMachineYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  previousApplicationDeclined: Yup.string().when("previousApplicationDeclinedYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  premiumOrRestrictions: Yup.string().when("premiumOrRestrictionsYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  previousInsuranceTerminated: Yup.string().when("previousInsuranceTerminatedYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  lastFiveYearMalpractice: Yup.string().when("lastFiveYearMalpracticeYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  proceduresOnClinic: Yup.string().when("proceduresOnClinicYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),

  employee: Yup.array().when("policyType", {
    is: (p) => {
      return p === "Clinics";
    },
    then: () =>
      Yup.array().of(
        Yup.object({
          employeeName: Yup.string().required("Is required"),
          speciality: Yup.string().required("Is required"),
          licenseCode: Yup.string().required("Is required"),
        }).required()
      ),
    otherwise: () => Yup.mixed().notRequired(),
  }),
}).required();

const EditMedicalMalpracticeDetailForm = () => {
  const [loop, setLoop] = useState([1]);
  const [isError, setIsError] = useState(false);

  const [totalDays, setTotalDays] = useState(0);

  const router = useRouter();
  const { madicalMalpracticeId } = router.query;
  const dispatch = useDispatch();
  const { loading, medicalMalPracticeDetails } = useSelector((state) => state.medicalMalPractice);

  const [selectedFile, setSelectedFile] = useState("");
  const [isSelectedFile, setIsSelectedFile] = useState(false);
  const [selectedEmiratesFile, setSelectedEmiratesFile] = useState("");
  const [isSelectedEmirateFile, setIsSelectedEmirateFile] = useState(false);
  useEffect(() => {
    if (medicalMalPracticeDetails?.medicalLicense) {
      setSelectedFile({
        name: medicalMalPracticeDetails?.medicalLicense?.originalname,
      });
    }
    if (medicalMalPracticeDetails?.emiratesIdFile) {
      setSelectedEmiratesFile({
        name: medicalMalPracticeDetails?.emiratesIdFile?.originalname,
      });
    }
  }, [medicalMalPracticeDetails]);

  let obj = {
    employee:
      medicalMalPracticeDetails?.employee?.length > 0
        ? medicalMalPracticeDetails?.employee?.map((acc, idx) => ({
            ...acc,
            licenseCode: acc?.licenseCode,
            speciality: acc?.speciality,
            employeeName: acc?.employeeName,
          }))
        : [],
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      policyType: medicalMalPracticeDetails?.policyType || "",
      fullName: medicalMalPracticeDetails?.fullName ? medicalMalPracticeDetails?.fullName : "",
      commercialId: medicalMalPracticeDetails?.commercialId || "",
      businessAddress: medicalMalPracticeDetails?.businessAddress || "",
      emirates: medicalMalPracticeDetails?.emirates || "",
      telephoneNo: medicalMalPracticeDetails?.telephoneNo || "",
      email: medicalMalPracticeDetails?.email || "",
      mobileNumber: "",
      law: medicalMalPracticeDetails?.law || "",
      territorialLimit: medicalMalPracticeDetails?.territorialLimit || "",
      noOfStaff: medicalMalPracticeDetails?.noOfStaff || 1,
      emiratesId: medicalMalPracticeDetails?.emiratesId || "",
      emiratesIdExpiryDate: medicalMalPracticeDetails?.emiratesIdExpiryDate || "",
      retroactiveDate: medicalMalPracticeDetails?.retroactiveDate || "",
      clinicsName: medicalMalPracticeDetails?.clinicsName || "",
      staffSpeciality: medicalMalPracticeDetails?.staffSpeciality || "",
      staffLicenseCode: medicalMalPracticeDetails?.staffLicenseCode || "",
      policyType: medicalMalPracticeDetails?.policyType || "",
      licenseAuthority: medicalMalPracticeDetails?.licenseAuthority || "",
      remarks: medicalMalPracticeDetails?.remarks || "",
      anyOneClaim: medicalMalPracticeDetails?.anyOneClaim || "",
      inAggregate: medicalMalPracticeDetails?.inAggregate || "",
      policyFrom: medicalMalPracticeDetails?.policyFrom || "",
      policyTo: medicalMalPracticeDetails?.policyTo || "",
      policyDays: medicalMalPracticeDetails?.policyDays || "",
      schoolUniversityName: medicalMalPracticeDetails?.schoolUniversityName || "",
      practicePlaceTime: medicalMalPracticeDetails?.practicePlaceTime || "",
      establishmentOwnedBy: medicalMalPracticeDetails?.establishmentOwnedBy || "",
      operationTimeByOwneres: medicalMalPracticeDetails?.operationTimeByOwneres || "",
      patientsPerYear: medicalMalPracticeDetails?.patientsPerYear || "",
      mainProductOnClinic: medicalMalPracticeDetails?.mainProductOnClinic || "",
      involvedInProceduresYN: medicalMalPracticeDetails?.involvedInProceduresYN ? true : false,
      involvedInProcedures: medicalMalPracticeDetails?.involvedInProcedures || "",
      operateMachineYN: medicalMalPracticeDetails?.operateMachineYN ? true : false,
      operateMachine: medicalMalPracticeDetails?.operateMachine || "",
      previousApplicationDeclinedYN: medicalMalPracticeDetails?.previousApplicationDeclinedYN || false,
      previousApplicationDeclined: medicalMalPracticeDetails?.previousApplicationDeclined || "",
      premiumOrRestrictionsYN: medicalMalPracticeDetails?.premiumOrRestrictionsYN || false,
      premiumOrRestrictions: medicalMalPracticeDetails?.premiumOrRestrictions || "",
      previousInsuranceTerminatedYN: medicalMalPracticeDetails?.previousInsuranceTerminatedYN || false,
      previousInsuranceTerminated: medicalMalPracticeDetails?.previousInsuranceTerminated || "",
      lastFiveYearMalpracticeYN: medicalMalPracticeDetails?.lastFiveYearMalpracticeYN || false,
      lastFiveYearMalpractice: medicalMalPracticeDetails?.lastFiveYearMalpractice || "",
      proceduresOnClinicYN: medicalMalPracticeDetails?.proceduresOnClinicYN || false,
      proceduresOnClinic: medicalMalPracticeDetails?.proceduresOnClinic || "",
      ...obj,
    },

    validationSchema: schema,

    onSubmit: async (values, helpers) => {
      // console.log("values", values);

      let payload = jsonToFormData({
        ...values,
        medicalLicense: selectedFile,
        emiratesIdFile: selectedEmiratesFile,
      });
      if (!isSelectedFile && !isSelectedEmirateFile) {
        payload = jsonToFormData({
          ...values,
        });
      } else if (!isSelectedFile) {
        payload = jsonToFormData({
          ...values,
          emiratesIdFile: selectedEmiratesFile,
        });
      } else if (!isSelectedEmirateFile) {
        payload = jsonToFormData({
          ...values,
          medicalLicense: selectedFile,
        });
      }

      dispatch(
        editMedicalMalPracticeDetailsById({
          id: madicalMalpracticeId,
          data: payload,
        })
      )
        .unwrap()
        .then((res) => {
          toast.success("successfully updated!");
          router.push(`/medical-malpractice/${madicalMalpracticeId}`);
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
    if (formik.values.policyFrom && formik.values.policyTo) {
      const days = differenceInCalendarDays(new Date(formik.values.policyTo), new Date(formik.values.policyFrom));
      setTotalDays(days);
      formik.setFieldValue("policyDays", days);
    }
  }, [formik.values.policyFrom, formik.values.policyTo]);

  useEffect(() => {
    if (medicalMalPracticeDetails?.mobileNumber) {
      formik.setFieldValue("mobile", `971${medicalMalPracticeDetails?.mobileNumber}`);
      formik.setFieldValue("mobileNumber", `${medicalMalPracticeDetails?.mobileNumber}`);
    }
    if (medicalMalPracticeDetails?.telephoneNo) {
      formik.setFieldValue("fullTeleNo", `971${medicalMalPracticeDetails?.telephoneNo}`);
      formik.setFieldValue("telephoneNo", `${medicalMalPracticeDetails?.telephoneNo}`);
    }
  }, [medicalMalPracticeDetails]);

  useEffect(() => {
    if (formik?.values.noOfStaff > 0) {
      const array = [];
      for (let i = 0; i < formik?.values.noOfStaff; i++) {
        array.push(1);
      }
      setLoop([...array]);
    }
  }, [formik?.values.noOfStaff]);

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

  const handleEmiratesIdFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    setSelectedEmiratesFile(file);
    setIsSelectedEmirateFile(true);
    event.target.value = null; // Clear the file input value
  };

  return (
    <>
      {loading ? (
        <AnimationLoader open={true} />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <Box sx={{ display: "inline-block", width: "100%" }}>
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
                        fontSize: { sm: "18px", xs: "16px" },
                        color: "#60176F",
                        px: "14px",
                        borderRadius: "10px 10px 0 0",

                        alignItems: "center",
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      Policy Details
                    </Typography>
                    <Box sx={{ mt: 1, p: 1 }}>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="policyType"
                          value={formik?.values?.policyType}
                          onChange={formik.handleChange}
                          onBlur={formik?.handleBlur}
                        >
                          <FormControlLabel value="Individual" control={<Radio />} label="Individual" />
                          <FormControlLabel value="Clinics" control={<Radio />} label="Clinics" />
                        </RadioGroup>
                      </FormControl>
                      {formik.errors.policyType && (
                        <Typography
                          sx={{
                            color: "#d32f2f",
                            fontSize: "13px",
                            textAlign: "left",
                            ml: "14px",
                          }}
                        >
                          {formik?.errors.policyType.message}
                        </Typography>
                      )}
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
                      Proposal Details
                    </Typography>
                    <Box sx={{ mt: 1, p: 1, px: 2 }}>
                      <Grid container columnSpacing={2} rowSpacing={2}>
                        {formik.values.policyType === "Clinics" && (
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
                                  Clinics Name <Span> *</Span>
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
                                  error={Boolean(formik.touched.clinicsName && formik.errors.clinicsName)}
                                  helperText={formik.touched.clinicsName && formik.errors.clinicsName}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.clinicsName}
                                  label="Proposer's Full Name"
                                  name="clinicsName"
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>
                        )}
                        {formik.values.policyType === "Individual" && (
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
                        {formik?.values?.policyType === "Individual" && (
                          <>
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
                                  Emirates ID <Span> *</Span>
                                </Typography>
                                <TextField
                                  fullWidth
                                  error={Boolean(formik.touched.emiratesId && formik.errors.emiratesId)}
                                  helperText={formik.touched.emiratesId && formik.errors.emiratesId}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.emiratesId}
                                  label="Emirates ID"
                                  name="emiratesId"
                                  type="emiratesId"
                                  autoComplete="new-emiratesId"
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
                                  Emirates ID Expiry
                                </Typography>
                                <DatePicker
                                  inputFormat="dd-MM-yyyy"
                                  label="Emirates ID Expiry"
                                  onChange={(value) => {
                                    formik.setFieldValue("emiratesIdExpiryDate", value);
                                  }}
                                  renderInput={(params) => (
                                    <TextField name="emiratesIdExpiryDate" fullWidth {...params} error={false} />
                                  )}
                                  value={formik.values.emiratesIdExpiryDate}
                                />

                                {formik.touched.emiratesIdExpiryDate && formik.errors.emiratesIdExpiryDate && (
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                      fontSize: "12px",
                                      display: "inline-block",
                                      color: "red",
                                    }}
                                  >
                                    {formik.errors.emiratesIdExpiryDate}
                                  </Typography>
                                )}
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
                                    mb: 1,
                                  }}
                                >
                                  Emirates ID Upload
                                </Typography>
                                <Box
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "#707070",
                                      fontSize: "14px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Click the button below to upload emirates Id
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
                                        accept=".pdf, .png, .jpeg, .jpg"
                                        id="file-upload"
                                        type="file"
                                        onChange={handleEmiratesIdFileUpload}
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
                                      fontSize: "14px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Allowed file type (.pdf,.jpg, .jpeg,.png)
                                  </Typography>
                                  {selectedEmiratesFile && (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        color: "#707070",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        mb: 2,
                                      }}
                                    >
                                      Selected File: {selectedEmiratesFile?.name}
                                    </Typography>
                                  )}
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
                                    Clinics Name <Span> *</Span>
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
                                    error={Boolean(formik.touched.clinicsName && formik.errors.clinicsName)}
                                    helperText={formik.touched.clinicsName && formik.errors.clinicsName}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.clinicsName}
                                    label="Proposer's Full Name"
                                    name="clinicsName"
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
                                  Staff Speciality
                                  <Span> *</Span>
                                </Typography>
                                <TextField
                                  error={Boolean(formik.touched.staffSpeciality && formik.errors.staffSpeciality)}
                                  helperText={formik.touched.staffSpeciality && formik.errors.staffSpeciality}
                                  fullWidth
                                  label="Staff Speciality"
                                  name="staffSpeciality"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  select
                                  SelectProps={{ native: true }}
                                  value={formik.values.staffSpeciality}
                                >
                                  <option value=""></option>
                                  {StaffSpeciality?.map((i) => (
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
                                  Staff License Code
                                  <Span> *</Span>
                                </Typography>
                                <TextField
                                  fullWidth
                                  error={Boolean(formik.touched.staffLicenseCode && formik.errors.staffLicenseCode)}
                                  helperText={formik.touched.staffLicenseCode && formik.errors.staffLicenseCode}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.staffLicenseCode}
                                  label="Proposer's Full Name"
                                  name="staffLicenseCode"
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
                                  License Authority
                                </Typography>
                                <TextField
                                  error={Boolean(formik.touched.licenseAuthority && formik.errors.licenseAuthority)}
                                  helperText={formik.touched.licenseAuthority && formik.errors.licenseAuthority}
                                  fullWidth
                                  label="License Authority"
                                  name="licenseAuthority"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  select
                                  SelectProps={{ native: true }}
                                  value={formik.values.licenseAuthority}
                                >
                                  <option value=""></option>
                                  <option value="DHA">DHA</option>
                                  <option value="HAAD">HAAD</option>
                                  <option value="Others">Others</option>
                                </TextField>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
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
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <DatePicker
                                  inputFormat="dd-MM-yyyy"
                                  label="Retroactive date"
                                  onChange={(value) => {
                                    formik.setFieldValue("retroactiveDate", value);
                                  }}
                                  renderInput={(params) => (
                                    <TextField name="retroactiveDate" fullWidth {...params} error={false} />
                                  )}
                                  value={formik.values.retroactiveDate ? formik.values.retroactiveDate : ""}
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
                          </>
                        )}
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
                              No Of Staff
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              fullWidth
                              disabled={formik.values.policyType === "Individual"}
                              error={Boolean(formik.touched.noOfStaff && formik.errors.noOfStaff)}
                              helperText={formik.touched.noOfStaff && formik.errors.noOfStaff}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.noOfStaff}
                              label="No Of Staff"
                              name="noOfStaff"
                              type="number"
                              autoComplete="new-noOfStaff"
                            />
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
                      Policy Limit
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
                                Any one Claim(AED) <Span> *</Span>
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
                                error={Boolean(formik.touched.anyOneClaim && formik.errors.anyOneClaim)}
                                helperText={formik.touched.anyOneClaim && formik.errors.anyOneClaim}
                                fullWidth
                                label="Any one Claim(AED)"
                                name="anyOneClaim"
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  formik.setFieldValue("anyOneClaim", e.target.value);
                                  if (e?.target?.value) {
                                    formik.setFieldValue("inAggregate", +e?.target?.value * 2);
                                  } else {
                                    formik.setFieldValue("inAggregate", "");
                                  }
                                }}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.anyOneClaim}
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
                                In the Aggregate(AED) <Span> *</Span>
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
                                label="In the Aggregate(AED)"
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
                              disabled
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
                {formik?.values?.policyType === "Clinics" && (
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
                        Insured Details
                      </Typography>
                      <Box sx={{ mt: 1, p: 1 }}>
                        {loop?.map((ele, idx) => {
                          return <ClientDetailsForm formik={formik} StaffSpeciality={StaffSpeciality} index={idx} />;
                        })}
                      </Box>
                    </Box>
                  </Box>
                )}
                {formik?.values?.policyType === "Individual" && (
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
                        Individual Insured Details
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
                                At what medical school/University did the proposer graduated and when ?
                              </Typography>
                              <TextField
                                fullWidth
                                name="schoolUniversityName"
                                label="School University Name"
                                type="text"
                                rows={2}
                                autoComplete="new-schoolUniversityName"
                                error={Boolean(
                                  formik.touched.schoolUniversityName && formik.errors.schoolUniversityName
                                )}
                                helperText={formik.touched.schoolUniversityName && formik.errors.schoolUniversityName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.schoolUniversityName}
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
                                Where and when has the proposer practiced his profession since graduation ?
                              </Typography>
                              <TextField
                                fullWidth
                                name="practicePlaceTime"
                                type="text"
                                label="Practice Place and Time"
                                rows={2}
                                autoComplete="new-practicePlaceTime"
                                error={Boolean(formik.touched.practicePlaceTime && formik.errors.practicePlaceTime)}
                                helperText={formik.touched.practicePlaceTime && formik.errors.practicePlaceTime}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.practicePlaceTime}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                )}
                {/* clinit insured List */}
                {formik?.values?.policyType === "Clinics" && (
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
                        Clinics Insured Details
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
                                Establishment(s) is owned by
                                <Span> *</Span>
                              </Typography>
                              <TextField
                                fullWidth
                                name="establishmentOwnedBy"
                                label="Establishment(s) is owned by"
                                type="text"
                                rows={2}
                                autoComplete="new-establishmentOwnedBy"
                                error={Boolean(
                                  formik.touched.establishmentOwnedBy && formik.errors.establishmentOwnedBy
                                )}
                                helperText={formik.touched.establishmentOwnedBy && formik.errors.establishmentOwnedBy}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.establishmentOwnedBy}
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
                                How long had the Establishment(s) been operated by the present owners? If
                                change,when&nbs?
                                <Span> *</Span>
                              </Typography>
                              <TextField
                                fullWidth
                                name="operationTimeByOwneres"
                                type="text"
                                label="Time of operation by oweners"
                                rows={2}
                                autoComplete="new-operationTimeByOwneres"
                                error={Boolean(
                                  formik.touched.operationTimeByOwneres && formik.errors.operationTimeByOwneres
                                )}
                                helperText={
                                  formik.touched.operationTimeByOwneres && formik.errors.operationTimeByOwneres
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.operationTimeByOwneres}
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
                                Number of patients per year
                                <Span> *</Span>
                              </Typography>
                              <TextField
                                fullWidth
                                name="patientsPerYear"
                                label="Number of patients per year"
                                type="text"
                                rows={2}
                                autoComplete="new-patientsPerYear"
                                error={Boolean(formik.touched.patientsPerYear && formik.errors.patientsPerYear)}
                                helperText={formik.touched.patientsPerYear && formik.errors.patientsPerYear}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.patientsPerYear}
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
                                State the main procedures carried on the clinic <Span> *</Span>
                              </Typography>
                              <TextField
                                fullWidth
                                name="mainProductOnClinic"
                                type="text"
                                label="Main product on clinic"
                                rows={2}
                                autoComplete="new-mainProductOnClinic"
                                error={Boolean(formik.touched.mainProductOnClinic && formik.errors.mainProductOnClinic)}
                                helperText={formik.touched.mainProductOnClinic && formik.errors.mainProductOnClinic}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.mainProductOnClinic}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Box>
                )}
                {/* Additional Details */}
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
                      Additional Details
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
                            Is the proposer involved in any cosmetic/aesthetic procedures?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"involvedInProceduresYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="involvedInProcedures"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-involvedInProcedures"
                            error={Boolean(formik.touched.involvedInProcedures && formik.errors.involvedInProcedures)}
                            helperText={formik.touched.involvedInProcedures && formik.errors.involvedInProcedures}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.involvedInProcedures}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    {formik.values.policyType === "Clinics" && (
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
                              Does the Proposer own or operate x-ray machine or laser? If so,please give number,type and
                              whether they?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch name={"operateMachineYN"} formik={formik} />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="operateMachine"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-operateMachine"
                              error={Boolean(formik.touched.operateMachine && formik.errors.operateMachine)}
                              helperText={formik.touched.operateMachine && formik.errors.operateMachine}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.operateMachine}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
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
                            Has a previous application been declined?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"previousApplicationDeclinedYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="previousApplicationDeclined"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-previousApplicationDeclined"
                            error={Boolean(
                              formik.touched.previousApplicationDeclined && formik.errors.previousApplicationDeclined
                            )}
                            helperText={
                              formik.touched.previousApplicationDeclined && formik.errors.previousApplicationDeclined
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.previousApplicationDeclined}
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
                            Has a previous insurer required increased premium or special restrictions?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"premiumOrRestrictionsYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="premiumOrRestrictions"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-premiumOrRestrictions"
                            error={Boolean(formik.touched.premiumOrRestrictions && formik.errors.premiumOrRestrictions)}
                            helperText={formik.touched.premiumOrRestrictions && formik.errors.premiumOrRestrictions}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.premiumOrRestrictions}
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
                            Has a previous insurance been terminated/not been renewed by insurer?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"previousInsuranceTerminatedYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="previousInsuranceTerminated"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-previousInsuranceTerminated"
                            error={Boolean(
                              formik.touched.previousInsuranceTerminated && formik.errors.previousInsuranceTerminated
                            )}
                            helperText={
                              formik.touched.previousInsuranceTerminated && formik.errors.previousInsuranceTerminated
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.previousInsuranceTerminated}
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
                            Have any Claims or suits for malpractice been made against the proposer or any of the
                            partners,assistants,nurses or technicians during the past five years?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch name={"lastFiveYearMalpracticeYN"} formik={formik} />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="lastFiveYearMalpractice"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-lastFiveYearMalpractice"
                            error={Boolean(
                              formik.touched.lastFiveYearMalpractice && formik.errors.lastFiveYearMalpractice
                            )}
                            helperText={formik.touched.lastFiveYearMalpractice && formik.errors.lastFiveYearMalpractice}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.lastFiveYearMalpractice}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    {formik.values.policyType === "Clinics" && (
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
                              State the main procedures carried on the clinic?
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} md={2}>
                            <YNSwitch name={"proceduresOnClinicYN"} formik={formik} />
                          </Grid>
                          <Grid item xs={12} sm={8} md={4}>
                            <TextField
                              fullWidth
                              placeholder="if yes, please give details"
                              name="proceduresOnClinic"
                              type="text"
                              multiline
                              rows={2}
                              autoComplete="new-proceduresOnClinic"
                              error={Boolean(formik.touched.proceduresOnClinic && formik.errors.proceduresOnClinic)}
                              helperText={formik.touched.proceduresOnClinic && formik.errors.proceduresOnClinic}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.proceduresOnClinic}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </Box>
                {formik.values.policyType === "Individual" && (
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
                        Medical License
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
                          Click the button below to upload Medical License
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
                )}
              </Box>
            </Box>

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
              <NextLink href={`/medical-malpractice/${madicalMalpracticeId}`} passHref>
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

export default EditMedicalMalpracticeDetailForm;
