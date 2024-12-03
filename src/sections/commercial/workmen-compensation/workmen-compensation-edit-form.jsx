"use client";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Card,
  CardActions,
  Grid,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import PhoneNumberInput from "src/components/phoneInput-field";
import * as Yup from "yup";
import { useFormik } from "formik";
import YNSwitch from "src/components/YNSwitch";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CategoryDetails from "src/components/Comercial/CategoryDetails";
import EmployeeDetails from "src/components/Comercial/EmployeeDetails";
import { editWorkmenCompensationById } from "./Action/workmenCompensationAction";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import { differenceInCalendarDays } from "date-fns";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { formatNumber } from "src/utils/formatNumber";
import AnimationLoader from "src/components/amimated-loader";

// Styled component for error message styling
const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

// Arrays for predefined values in select fields
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
const medicalExpenes = ["25000", "30000", "35000", "40000", "45000", "50000"];
const repaExpenses = ["15000", "25000", "35000"];
const liabilityLimit = ["1000000", "2000000", "3675000", "5000000"];

// Validation schema for the form using Yup
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
  otherBusinessActivity: Yup.string().when("businessActivity", {
    is: (insType) => {
      return insType == "Others";
    },
    then: () => Yup.string().required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  law: Yup.string().required("law required"),
  territorialLimit: Yup.string().required("territorial limit is required"),
  remarks: Yup.string().max(500).notRequired(),
  policyFrom: Yup.string().required("policy from is required"),
  noOfEmployees: Yup.string().required("No Of Employees is required"),
  policyType: Yup.string().required("Policy type is required"),
  basisOfWages: Yup.string().required("Basis Of Wages is required"),
  currency: Yup.string().required("currency is required"),
  medicalExpenses: Yup.string().required("Medical Expenses is required"),
  employeesLiabilityLimit: Yup.string().required(
    "Employees Liability Limit is required"
  ),
  repatriationExpenses: Yup.string().required(
    "Repatriation Expenses is required"
  ),
  policyTo: Yup.string().required("policy to is required"),
  offShoreActivities: Yup.string().when("offShoreActivitiesYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  takingCoverInFirm: Yup.string().when("takingCoverInFirmYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  oilGasActivities: Yup.string().when("oilGasActivitiesYN", {
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
  claimsLastFiveYear: Yup.string().when("claimsLastFiveYearYN", {
    is: (insType) => {
      return insType === true;
    },
    then: () => Yup.string().max(500).required("Is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
  category: Yup.lazy((value) => {
    return Yup.array().of(
      Yup.object({
        categoryOfEmployees: Yup.string().required("Is required"),
        noOfEmployees: Yup.string().required("Is required"),
        estimatedWages: Yup.string().required("Is required"),
      }).required()
    );
  }),
});

// Main form component for editing workmen compensation details
const EditWorkmenCompensationDetailForm = () => {
  const [loop, setLoop] = useState([1]);
  const [isError, setIsError] = useState(false);
  const [eLoop, setELoop] = useState([1]);
  const [temp, setTemp] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalEstimatedValue, setTotalEstimatedValue] = useState(0);
  const [totalEmployeesEstimatedValue, setTotalEmployeesEstimatedValue] =
    useState(0);
  const [disableAddCategoryBtn, setDisableAddCategoryBtn] = useState(false);
  const [disableRemoveCategoryBtn, setDisableRemoveCategoryBtn] =
    useState(true);

  const [totalDays, setTotalDays] = useState(0);

  const router = useRouter();
  const { commercialId } = router.query;
  const dispatch = useDispatch();
  const { loading, workmenCompensationDetail } = useSelector(
    (state) => state.workmenCompensation
  );

  const [selectedFile, setSelectedFile] = useState("");
  const [selectedEmployeeListFile, setSelectedEmployeeListFile] = useState("");
  
   // Set initial state from Redux when workmen compensation details are available
  useEffect(() => {
    if (workmenCompensationDetail?.tradeLicense) {
      setSelectedFile({
        name: workmenCompensationDetail?.tradeLicense?.originalname,
      });
    }
    if (workmenCompensationDetail?.employeeList) {
      setSelectedEmployeeListFile({
        name: workmenCompensationDetail?.employeeList?.originalname,
      });
    }
  }, [workmenCompensationDetail]);

  // Handle file upload for trade license
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    setSelectedFile(file);
    event.target.value = null; // Clear file input value
  };

  // Handle file upload for employee list
  const handleEmployeeListFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    setSelectedEmployeeListFile(file);
    event.target.value = null; // Clear file input value
  };

  // Prepare initial values for the form based on workmen compensation details
  let obj = {
    employee:
      workmenCompensationDetail?.employee?.length > 0
        ? workmenCompensationDetail?.employee?.map((acc, idx) => ({
            ...acc,
            categoryOfEmployees: acc?.categoryOfEmployees,
            name: acc?.name,
            designation: acc?.designation,
            estimatesPeriod: acc?.estimatesPeriod,
          }))
        : [],
  };
  let obj2 = {
    category:
      workmenCompensationDetail?.category?.length > 0
        ? workmenCompensationDetail?.category?.map((acc, idx) => ({
            ...acc,
            categoryOfEmployees: acc?.categoryOfEmployees,
            noOfEmployees: acc?.noOfEmployees,
            estimatedWages: acc?.estimatedWages,
          }))
        : [],
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: workmenCompensationDetail?.fullName
        ? workmenCompensationDetail?.fullName
        : "",
      commercialId: workmenCompensationDetail?.commercialId || "",
      businessAddress: workmenCompensationDetail?.businessAddress || "",
      emirates: workmenCompensationDetail?.emirates || "",
      telephoneNo: workmenCompensationDetail?.telephoneNo || "",
      email: workmenCompensationDetail?.email || "",
      mobileNumber: "",
      businessActivity: workmenCompensationDetail?.businessActivity || "",
      otherBusinessActivity:
        workmenCompensationDetail?.otherBusinessActivity || "",
      law: workmenCompensationDetail?.law || "",
      policySubType: workmenCompensationDetail?.policySubType || "",
      territorialLimit: workmenCompensationDetail?.territorialLimit || "",
      remarks: workmenCompensationDetail?.remarks || "",
      policyFrom: workmenCompensationDetail?.policyFrom || "",
      noOfEmployees: workmenCompensationDetail?.noOfEmployees || "",
      totalEmployeesEstimatedValue:
        workmenCompensationDetail?.totalEmployeesEstimatedValue || "",
      noOfCategoryEmployees:
        workmenCompensationDetail?.noOfCategoryEmployees || "",
      policyType: workmenCompensationDetail?.policyType || "",
      basisOfWages: workmenCompensationDetail?.basisOfWages || "",
      policyTo: workmenCompensationDetail?.policyTo || "",
      policyDays: workmenCompensationDetail?.policyDays || "",
      currency: workmenCompensationDetail?.currency || "AED",
      medicalExpenses: workmenCompensationDetail?.medicalExpenses || "",
      repatriationExpenses:
        workmenCompensationDetail?.repatriationExpenses || "",
      employeesLiabilityLimit:
        workmenCompensationDetail?.employeesLiabilityLimit || "",
      offShoreActivitiesYN: workmenCompensationDetail?.offShoreActivitiesYN
        ? true
        : false,
      offShoreActivities: workmenCompensationDetail?.offShoreActivities || "",
      takingCoverInFirmYN:
        workmenCompensationDetail?.takingCoverInFirmYN || false,
      takingCoverInFirm: workmenCompensationDetail?.takingCoverInFirm || "",
      oilGasActivitiesYN:
        workmenCompensationDetail?.oilGasActivitiesYN || false,
      oilGasActivities: workmenCompensationDetail?.oilGasActivities || "",
      policyDeclinedYN: workmenCompensationDetail?.policyDeclinedYN || false,
      policyDeclined: workmenCompensationDetail?.policyDeclined || "",
      claimsLastFiveYearYN:
        workmenCompensationDetail?.claimsLastFiveYearYN || false,
      claimsLastFiveYear: workmenCompensationDetail?.claimsLastFiveYear || "",
      totalEstimatedValue: workmenCompensationDetail?.totalEstimatedValue || "",
      ...obj,
      ...obj2,
    },
    validationSchema: schema,

    onSubmit: async (values, helpers) => {
      const payload = jsonToFormData({ ...values, tradeLicense: selectedFile, employeeList: selectedEmployeeListFile });
      dispatch(editWorkmenCompensationById({ id: commercialId, data: payload }))
        .unwrap()
        .then((res) => {
          toast.success("successfully updated!");
          router.push(`/workmen-compensation/${commercialId}`);
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
      const days = differenceInCalendarDays(
        new Date(formik.values.policyTo),
        new Date(formik.values.policyFrom)
      );
      setTotalDays(days);
      formik.setFieldValue("policyDays", days);
    }
  }, [formik.values.policyFrom, formik.values.policyTo]);

  useEffect(() => {
    if (workmenCompensationDetail) {
      if (workmenCompensationDetail?.category?.length == 1) {
        setDisableAddCategoryBtn(false);
        setDisableRemoveCategoryBtn(true);
      }
      if (workmenCompensationDetail?.category?.length == 2) {
        setDisableRemoveCategoryBtn(false);
        setDisableAddCategoryBtn(true);
      }
    }
  }, [workmenCompensationDetail]);

  const onChangeValue = () => {
    setTemp(!temp);
  };

  const addCategoryHandler = () => {
    const array = [...loop];
    if (array?.length == 1) {
      setDisableAddCategoryBtn(true);
      setDisableRemoveCategoryBtn(false);
    }
    array.push(1);
    setLoop(array);
  };

  const removeCategoryHandler = () => {
    const array = [...loop];

    if (array?.length == 1) {
      return;
    }
    if (array?.length == 2) {
      setDisableRemoveCategoryBtn(true);
      setDisableAddCategoryBtn(false);
    }
    array.pop();
    setLoop(array);

    const aa = [...formik.values.category];
    let totalEstimatedValue = 0;
    let totalEmployees = 0;

    aa.pop();

    aa?.map((i) => {
      totalEstimatedValue += +i?.estimatedWages;
      totalEmployees += +i?.noOfEmployees;
    });

    formik.setFieldValue("category", aa);

    formik.setFieldValue("noOfCategoryEmployees", totalEmployees);
    formik.setFieldValue("totalEstimatedValue", totalEstimatedValue);
  };

  useEffect(() => {
    if (formik.values.category?.length > 0) {
      let totalEstimatedValue = 0;
      let totalEmployees = 0;

      const array = [];

      formik.values.category?.map((i) => {
        if (i?.estimatedWages) {
          totalEstimatedValue += +i?.estimatedWages;
        }
        if (i?.noOfEmployees) {
          totalEmployees += +i?.noOfEmployees;
        }
        array.push(1);
      });

      setLoop([...array]);
      formik.setFieldValue("noOfCategoryEmployees", totalEmployees);
      formik.setFieldValue("totalEstimatedValue", totalEstimatedValue);
      setTotalEmployees(totalEmployees);
      setTotalEstimatedValue(totalEstimatedValue);

      let aa = formik.values.category;
      if (aa?.length > 0) {
        const ss = aa.slice(0, formik.values.category?.length);
        formik.setFieldValue("category", ss);
      }
    }
  }, [formik.values.category?.length, temp]);

  useEffect(() => {
    if (formik.values.noOfCategoryEmployees > 0) {
      const array = [];

      for (let i = 0; i < formik.values.noOfCategoryEmployees; i++) {
        array.push(1);
        if (+formik.values?.category?.[0]?.noOfEmployees > i) {
          formik.setFieldValue(
            `[employee][${i}][categoryOfEmployees]`,
            formik.values?.category?.[0]?.categoryOfEmployees
          );
        } else {
          formik.setFieldValue(
            `[employee][${i}][categoryOfEmployees]`,
            formik.values?.category?.[1]?.categoryOfEmployees
          );
        }
      }
      setELoop([...array]);
    }
  }, [totalEmployees, formik.values.noOfCategoryEmployees]);

  useEffect(() => {
    if (formik.values.employee?.length > 0) {
      let tValue = 0;

      formik.values.employee?.map((i) => {
        tValue += +i?.estimatesPeriod;
      });
      formik.setFieldValue("totalEmployeesEstimatedValue", tValue);
      setTotalEmployeesEstimatedValue(tValue);
    }
  }, [formik?.values?.employee?.length, temp]);

  useEffect(() => {
    if (workmenCompensationDetail?.mobileNumber) {
      formik.setFieldValue(
        "mobile",
        `971${workmenCompensationDetail?.mobileNumber}`
      );
      formik.setFieldValue(
        "mobileNumber",
        `${workmenCompensationDetail?.mobileNumber}`
      );
    }
    if (workmenCompensationDetail?.telephoneNo) {
      formik.setFieldValue(
        "fullTeleNo",
        `971${workmenCompensationDetail?.telephoneNo}`
      );
      formik.setFieldValue(
        "telephoneNo",
        `${workmenCompensationDetail?.telephoneNo}`
      );
    }
  }, [workmenCompensationDetail]);

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
            <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
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
                                label="Contractor Name"
                                name="businessAddress"
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
                              Proposer's Emirates
                              <Span> *</Span>
                            </Typography>
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
                              <option value=""></option>
                              {proposerEm?.map((i) => (
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
                            {formik?.errors?.mobileNumber && (
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
                        {formik?.values?.businessActivity == "Others" && (
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
                                  Business Activity <Span> *</Span>
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
                                    formik.touched.otherBusinessActivity &&
                                      formik.errors.otherBusinessActivity
                                  )}
                                  helperText={
                                    formik.touched.otherBusinessActivity &&
                                    formik.errors.otherBusinessActivity
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.otherBusinessActivity}
                                  label="Enter Business Activity"
                                  name="otherBusinessActivity"
                                  type="text"
                                />
                              </Box>
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
                              <option value="Named Basis">Named Basis</option>
                              <option value="Unnamed Basis">
                                Unnamed Basis
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
                              Basis Of Wages
                              <Span> *</Span>
                            </Typography>
                            <TextField
                              error={Boolean(
                                formik.touched.basisOfWages &&
                                  formik.errors.basisOfWages
                              )}
                              helperText={
                                formik.touched.basisOfWages &&
                                formik.errors.basisOfWages
                              }
                              fullWidth
                              label="Basis Of Wages "
                              name="basisOfWages"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.basisOfWages}
                            >
                              <option value=""></option>
                              <option value="Basic onlly">Basic Only</option>
                              <option value="Basic + Allowances">
                                Basic + Allowances
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
                                formik.setFieldValue("policyFrom", value, true);
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
                              onChange={(value) => {
                                formik.setFieldValue("policyTo", value);
                              }}
                              disabled
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
                      Limit Of Liability
                    </Typography>
                    <Box sx={{ mt: 1, p: 1 }}>
                      <Grid container spacing={2} mb={3}>
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
                            Liability Currency
                          </Typography>
                          <TextField
                            error={Boolean(
                              formik.touched.currency && formik.errors.currency
                            )}
                            helperText={
                              formik.touched.currency && formik.errors.currency
                            }
                            fullWidth
                            label="Liability Currency"
                            name="currency"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.currency}
                          >
                            <option value={"AED"}>{"AED"}</option>
                            <option value={"USD"}>{"USD"}</option>
                            <option value={"EU"}>{"EU"}</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={0} md={6}></Grid>
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
                                {`Medical Expenses (${formik?.values?.currency})`}{" "}
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
                                error={Boolean(
                                  formik.touched.medicalExpenses &&
                                    formik.errors.medicalExpenses
                                )}
                                helperText={
                                  formik.touched.medicalExpenses &&
                                  formik.errors.medicalExpenses
                                }
                                fullWidth
                                label={`Medical Expenses (${formik?.values?.currency})`}
                                name="medicalExpenses"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.medicalExpenses}
                              >
                                <option value=""></option>
                                {medicalExpenes?.map((i) => (
                                  <option value={i}>{formatNumber(i)}</option>
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
                                {`Repatriation Expenses (${formik?.values?.currency})`}{" "}
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
                                error={Boolean(
                                  formik.touched.repatriationExpenses &&
                                    formik.errors.repatriationExpenses
                                )}
                                helperText={
                                  formik.touched.repatriationExpenses &&
                                  formik.errors.repatriationExpenses
                                }
                                fullWidth
                                label={`Repatriation Expenses (${formik?.values?.currency})`}
                                name="repatriationExpenses"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.repatriationExpenses}
                              >
                                <option value=""></option>
                                {repaExpenses?.map((i) => (
                                  <option value={i}>{formatNumber(i)}</option>
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
                                {`Employers Liability limit (${formik?.values?.currency})`}{" "}
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
                                error={Boolean(
                                  formik.touched.employeesLiabilityLimit &&
                                    formik.errors.employeesLiabilityLimit
                                )}
                                helperText={
                                  formik.touched.employeesLiabilityLimit &&
                                  formik.errors.employeesLiabilityLimit
                                }
                                fullWidth
                                label={`Employers Liability limit (${formik?.values?.currency})`}
                                name="employeesLiabilityLimit"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.employeesLiabilityLimit}
                              >
                                <option value=""></option>
                                {liabilityLimit?.map((i) => (
                                  <option value={i}>{formatNumber(i)}</option>
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
                      Category Details
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        mr: 2,
                      }}
                    >
                      {!disableAddCategoryBtn && (
                        <AddIcon
                          onClick={addCategoryHandler}
                          sx={{
                            color: "#60176F",
                            fontSize: 30,
                            cursor: "pointer",
                          }}
                        />
                      )}
                      {!disableRemoveCategoryBtn && (
                        <RemoveIcon
                          onClick={removeCategoryHandler}
                          sx={{ color: "#60176F", fontSize: 30 }}
                        />
                      )}
                    </Box>
                    <Box sx={{ mt: 1, p: 1 }}>
                      {loop?.map((ele, idx) => {
                        return (
                          <CategoryDetails
                            index={idx}
                            formik={formik}
                            onChangeValue={onChangeValue}
                          />
                        );
                      })}
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
                      Employee Details
                    </Typography>

                    <Box sx={{ mt: 1, p: 1 }}>
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
                          Click the button below to upload employee list
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
                              onChange={handleEmployeeListFileUpload}
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
                        {selectedEmployeeListFile && (
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "#707070",
                              fontSize: "16px",
                              fontWeight: 700,
                              mb: 2,
                            }}
                          >
                            Selected File: {selectedEmployeeListFile?.name}
                          </Typography>
                        )}
                      </Box>

                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                          textAlign: "center",
                          my: 2,
                        }}
                      >
                        OR
                      </Typography>

                      {eLoop?.map((ele, idx) => {
                        return (
                          <EmployeeDetails
                            formik={formik}
                            index={idx}
                            onChangeValue={onChangeValue}
                          />
                        );
                      })}
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
                            Are you involved in offshore activities?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch
                            name={"offShoreActivitiesYN"}
                            formik={formik}
                          />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="offShoreActivities"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-offShoreActivities"
                            error={Boolean(
                              formik.touched.offShoreActivities &&
                                formik.errors.offShoreActivities
                            )}
                            helperText={
                              formik.touched.offShoreActivities &&
                              formik.errors.offShoreActivities
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.offShoreActivities}
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
                            Are you taking cover for all the employees in your
                            firm?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch
                            name={"takingCoverInFirmYN"}
                            formik={formik}
                          />
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
                            error={Boolean(
                              formik.touched.takingCoverInFirm &&
                                formik.errors.takingCoverInFirm
                            )}
                            helperText={
                              formik.touched.takingCoverInFirm &&
                              formik.errors.takingCoverInFirm
                            }
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
                            Do you have projects related to Oil & Gas sector
                            activities?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch
                            name={"oilGasActivitiesYN"}
                            formik={formik}
                          />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="oilGasActivities"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-oilGasActivities"
                            error={Boolean(
                              formik.touched.oilGasActivities &&
                                formik.errors.oilGasActivities
                            )}
                            helperText={
                              formik.touched.oilGasActivities &&
                              formik.errors.oilGasActivities
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.oilGasActivities}
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
                            Was your application for this policy been declined
                            any time in the past?
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
                            Did you have any claims for the past 5 years?
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                          <YNSwitch
                            name={"claimsLastFiveYearYN"}
                            formik={formik}
                          />
                        </Grid>
                        <Grid item xs={12} sm={8} md={4}>
                          <TextField
                            fullWidth
                            placeholder="if yes, please give details"
                            name="claimsLastFiveYear"
                            type="text"
                            multiline
                            rows={2}
                            autoComplete="new-claimsLastFiveYear"
                            error={Boolean(
                              formik.touched.claimsLastFiveYear &&
                                formik.errors.claimsLastFiveYear
                            )}
                            helperText={
                              formik.touched.claimsLastFiveYear &&
                              formik.errors.claimsLastFiveYear
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.claimsLastFiveYear}
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
                      Trade License
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
                        Click the button below to upload Trade License
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
              <NextLink href={`/workmen-compensation/${commercialId}`} passHref>
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

export default EditWorkmenCompensationDetailForm;
