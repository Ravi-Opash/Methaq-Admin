import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
  Checkbox,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { updateHealthLeadDetailsById } from "../Leads/Action/healthInsuranceLeadAction";
import { DatePicker } from "@mui/x-date-pickers";
import PhoneNumberInput from "src/components/phoneInput-field";
import { getNationalities } from "src/sections/Proposals/Action/proposalsAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { differenceInYears } from "date-fns";
import * as Yup from "yup";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));
let items = [
  "all",
  "Self",
  "Self (Investor)",
  "Self and Dependent",
  "Dependent only",
  "Self (Investor) and Dependent",
  "Investor’s Dependent only",
];
const salaries = ["Up to 4000", "4000 - 12000", "12000+"];
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

function InsuranceInfoEditModal({ setLoading, HandleInsuranceModalClose, healthInfo, fetchSummary, setConfirmPopup }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { proposalId } = router.query;
  const [isError, setIsError] = useState(false);
  const [nationalityList, setNationalityList] = useState([]);
  const inref = useRef(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      insurerType: healthInfo?.insurerType || "",
      visaStatus:
        healthInfo?.visaStatus == "Tourist/visit visa" || healthInfo?.visaStatus == "Cancelled Visa"
          ? "Change Status"
          : healthInfo?.visaStatus,
      visaStatus2:
        healthInfo?.visaStatus == "Tourist/visit visa"
          ? "Tourist/visit visa"
          : healthInfo?.visaStatus == "Cancelled Visa"
          ? "Cancelled Visa"
          : "",
      currentInsurer: healthInfo?.currentInsurer || "",
      currentInsurerExpiryDate: healthInfo?.currentInsurerExpiryDate || "",
      spouseDetails: healthInfo?.spouseDetails || [],
      kidsDetails: healthInfo?.kidsDetails || [],
    },
    validationSchema: Yup.object({
      insurerType: Yup.string().required("Required"),
      visaStatus2: Yup.string()
        .required("Visa status is required")
        .when(["visaStatus"], {
          is: (value) => value === "Change Status",
          then: (schema) => Yup.string().required("Visa status is required"),
          otherwise: (schema) => Yup.string().notRequired(),
        }),
      currentInsurer: Yup.string()
        .required("Required")
        .when(["visaStatus"], {
          is: (value) => value !== "New",
          then: (schema) => Yup.string().required("Current Insurance is required"),
          otherwise: (schema) => Yup.string().notRequired(),
        }),
      currentInsurerExpiryDate: Yup.string()
        .required("Required")
        .when(["visaStatus"], {
          is: (value) => value !== "New",
          then: (schema) => Yup.string().required("Current Insurance Expiry Date is required"),
          otherwise: (schema) => Yup.string().notRequired(),
        }),
      visaStatus: Yup.string().required("Visa status is required"),
      spouseDetails: Yup.array().of(
        Yup.object().shape({
          fullName: Yup.string().required("Full name is required"),
          dateOfBirth: Yup.date().required("Date of birth is required"),
          gender: Yup.string().required("Gender is required"),
        })
      ),
      kidsDetails: Yup.array().of(
        Yup.object().shape({
          fullName: Yup.string().required("Full name is required"),
          dateOfBirth: Yup.date().required("Date of birth is required"),
          gender: Yup.string().required("Gender is required"),
        })
      ),
    }),
    onSubmit: async (values, helpers) => {
      let kids = [];
      let spouse = [];
      if (values?.kidsDetails?.length > 0) {
        values?.kidsDetails?.map((ele) => {
          kids?.push({ ...ele, dateOfBirth: new Date(ele?.dateOfBirth)?.toISOString() });
        });
      }
      if (values?.spouseDetails?.length > 0) {
        values?.spouseDetails?.map((ele) => {
          spouse?.push({ ...ele, dateOfBirth: new Date(ele?.dateOfBirth)?.toISOString() });
        });
      }
      const payload = {
        ...values,
        visaStatus: values?.visaStatus2 || values?.visaStatus,
      };
      if (values?.visaStatus2) {
        delete payload.visaStatus2;
      }

      setLoading(false);
      dispatch(updateHealthLeadDetailsById({ id: healthInfo?._id, data: payload }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          fetchSummary();
          toast.success("Successfully updated!");
          setLoading(true);
          HandleInsuranceModalClose(false);
          setConfirmPopup(true);
        })
        .catch((err) => {
          console.log(err, "err");
          setLoading(true);
          toast.error(err);
        });
    },
  });
  const [kidsArray, setKidsArray] = useState(healthInfo?.kidsDetails || []);
  const [spouseVisible, setSpouseVisible] = useState(healthInfo?.spouseDetails.length > 0 ? true : false);
  const [isChecked, setchecked] = useState(healthInfo?.kidsDetails.length > 0 ? true : false);

  const addKids = () => {
    const newArray = [...kidsArray, {}];
    formik.setFieldValue(`kidsDetails[${newArray.length - 1}].dateOfBirth`, "");
    setKidsArray(newArray);
  };

  const removeKids = () => {
    const kidValues = formik?.values?.kidsDetails || [];
    const updatedKidValues = kidValues.slice(0, -1);
    formik?.setFieldValue("kidsDetails", updatedKidValues);
    const updatedKidsArray = kidsArray.slice(0, -1);
    setKidsArray(updatedKidsArray);
  };

  const onKidsCheckboxHandler = (value) => {
    if (value) {
      setKidsArray([1]);
      setchecked(true);
      formik.setFieldValue("kidsDetails", [{ fullName: "", dateOfBirth: "", gender: "" }]);
    } else {
      setKidsArray([]);
      setchecked(false);
      formik.setFieldValue("kidsDetails", []);
    }
  };

  const onSpouseCheckboxHandler = (value) => {
    if (value) {
      setSpouseVisible(true);
      formik.setFieldValue("spouseDetails", [{ fullName: "", dateOfBirth: "", gender: "" }]);
    } else {
      setSpouseVisible(false);
      formik.setFieldValue("spouseDetails", []);
    }
  };
  return (
    <div>
      {" "}
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "inline-block", width: "100%" }}>
          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              borderRadius: "10px",
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
                    color: "#60176F",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: "14px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  Edit Insurance Details
                </Typography>
                <Box sx={{ p: 1, px: 2 }}>
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
                            Insurance Type<Span> *</Span>
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
                            error={Boolean(formik.touched.insurerType && formik.errors.insurerType)}
                            helperText={formik.touched.insurerType && formik.errors.insurerType}
                            fullWidth
                            label="Insurance Type"
                            name="insurerType"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.insurerType}
                          >
                            <option value=""></option>
                            {items.map((c) => {
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
                            Current visa status in the UAE <Span> *</Span>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="visaStatus"
                              value={formik?.values?.visaStatus}
                              onChange={formik.handleChange}
                              onBlur={formik?.handleBlur}
                            >
                              <FormControlLabel value="Renewal" control={<Radio />} label="Renewal" />
                              <FormControlLabel value="Change Status" control={<Radio />} label="Change Status" />
                              <FormControlLabel value="New" control={<Radio />} label="New" />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      </Box>
                      {formik?.values?.visaStatus === "Change Status" && (
                        <>
                          <Grid item xs={12} md={6}>
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="visaStatus2"
                                value={formik?.values?.visaStatus2}
                                onChange={formik.handleChange}
                                onBlur={formik?.handleBlur}
                              >
                                <FormControlLabel
                                  value="Tourist/visit visa"
                                  control={<Radio />}
                                  label="Tourist/visit visa"
                                />
                                <FormControlLabel value="Cancelled Visa" control={<Radio />} label="Cancelled Visa" />
                              </RadioGroup>
                            </FormControl>
                            {formik?.errors?.visaStatus2 && (
                              <Typography
                                sx={{
                                  mb: 0.5,
                                  fontSize: "12px",
                                  color: "#d32f2f",
                                }}
                              >
                                {formik?.errors?.visaStatus2}
                              </Typography>
                            )}
                          </Grid>
                        </>
                      )}
                    </Grid>
                    {formik?.values?.visaStatus != "New" && (
                      <>
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
                                Who is your current insurer <Span> *</Span>
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
                                label="Who is your current insurer"
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
                                Current Insurance Expiry Date <Span> *</Span>
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
                                label="Insurance expiry/change status date"
                                onChange={(value) => {
                                  formik.setFieldValue("currentInsurerExpiryDate", value);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    name="currentInsurerExpiryDate"
                                    fullWidth
                                    {...params}
                                    error={Boolean(
                                      formik.touched.currentInsurerExpiryDate && formik.errors.currentInsurerExpiryDate
                                    )}
                                    helperText={
                                      formik.touched.currentInsurerExpiryDate && formik.errors.currentInsurerExpiryDate
                                    }
                                  />
                                )}
                                value={
                                  formik.values.currentInsurerExpiryDate ? formik.values.currentInsurerExpiryDate : ""
                                }
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
                {(formik?.values?.insurerType == "Self and Dependent" ||
                  formik?.values?.insurerType == "Self (Investor) and Dependent" ||
                  formik?.values?.insurerType == "Dependent only" ||
                  formik?.values?.insurerType == "Investor’s Dependent only") && (
                  <>
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        borderRadius: "10px",
                        boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
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
                          borderRadius: "10px 10px 0 0",
                        }}
                      >
                        Spouse Details
                        <Checkbox
                          onChange={(e) => onSpouseCheckboxHandler(e?.target?.checked)}
                          checked={spouseVisible}
                        />
                      </Typography>

                      {spouseVisible && (
                        <Grid container columnSpacing={1} sx={{ p: 1 }}>
                          <Grid item xs={11} md={6} lg={3}>
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
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    color: "#707070",
                                  }}
                                >
                                  Full Name
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
                                      formik.touched.spouseDetails?.[0] &&
                                      formik.errors.spouseDetails?.[0] &&
                                      formik.touched.spouseDetails?.[0]?.fullName &&
                                      formik.errors.spouseDetails?.[0]?.fullName
                                  )}
                                  helperText={
                                    formik.touched.spouseDetails &&
                                    formik.errors.spouseDetails &&
                                    formik.touched.spouseDetails?.[0] &&
                                    formik.errors.spouseDetails?.[0] &&
                                    formik.touched.spouseDetails?.[0]?.fullName &&
                                    formik.errors.spouseDetails?.[0]?.fullName
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik?.values?.spouseDetails?.[0]?.fullName}
                                  label="Full Name"
                                  name={`spouseDetails[0].fullName`}
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={11} md={6} lg={3}>
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
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    color: "#707070",
                                  }}
                                >
                                  Date Of Birth
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
                                  label="Date Of Birth"
                                  onChange={(value) => {
                                    if (value && value != "Invalid Date") {
                                      formik.setFieldValue(
                                        "spouseDetails[0].age",
                                        differenceInYears(new Date(), value)
                                      );
                                    }
                                    formik.setFieldValue(`spouseDetails[0].dateOfBirth`, new Date(value), true);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      name={`spouseDetails[0].dateOfBirth`}
                                      fullWidth
                                      {...params}
                                      error={false}
                                    />
                                  )}
                                  value={formik.values?.spouseDetails?.[0]?.dateOfBirth}
                                  disableFuture
                                />

                                {formik.touched.spouseDetails &&
                                  formik.errors.spouseDetails &&
                                  formik.touched.spouseDetails[0] &&
                                  formik.errors.spouseDetails[0] &&
                                  formik.touched?.spouseDetails?.[0]?.dateOfBirth &&
                                  formik.errors?.spouseDetails?.[0]?.dateOfBirth && (
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        fontSize: "12px",
                                        display: "inline-block",
                                        color: "red",
                                      }}
                                    >
                                      {formik.errors?.spouseDetails?.[0]?.dateOfBirth}
                                    </Typography>
                                  )}
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={11} md={6} lg={3}>
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
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    color: "#707070",
                                  }}
                                >
                                  Age
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
                                    formik.touched.spouseDetails?.[0]?.age && formik.errors.spouseDetails?.[0]?.age
                                  )}
                                  fullWidth
                                  disabled
                                  helperText={
                                    formik.touched.spouseDetails?.[0]?.age && formik.errors.spouseDetails?.[0]?.age
                                  }
                                  label="Age (Years)"
                                  name={`spouseDetails[0].age`}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.spouseDetails?.[0]?.age}
                                  InputLabelProps={{ shrink: !!formik.values.spouseDetails?.[0]?.dateOfBirth }}
                                  type="number"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={11} md={6} lg={3}>
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
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    color: "#707070",
                                  }}
                                >
                                  Gender
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
                                      formik.touched.spouseDetails?.[0] &&
                                      formik.errors.spouseDetails?.[0] &&
                                      formik.touched?.spouseDetails[0]?.gender &&
                                      formik.errors?.spouseDetails[0]?.gender
                                  )}
                                  helperText={
                                    formik.touched.spouseDetails &&
                                    formik.errors.spouseDetails &&
                                    formik.touched.spouseDetails?.[0] &&
                                    formik.errors.spouseDetails?.[0] &&
                                    formik.touched?.spouseDetails?.[0]?.gender &&
                                    formik.errors?.spouseDetails?.[0]?.gender
                                  }
                                  fullWidth
                                  label="Gender"
                                  name={`spouseDetails[0].gender`}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  select
                                  SelectProps={{ native: true }}
                                  value={formik.values.spouseDetails?.[0]?.gender}
                                >
                                  <option value=""></option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </TextField>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        borderRadius: "10px",
                        boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1.5,
                          width: "100%",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "600",
                            fontSize: "18px",
                            display: "inline-block",
                            color: "#60176F",
                            px: "14px",
                            borderRadius: "10px 10px 0 0",
                          }}
                        >
                          Kids Details
                          <Checkbox onChange={(e) => onKidsCheckboxHandler(e?.target?.checked)} checked={isChecked} />
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
                          {kidsArray?.length > 0 && (
                            <>
                              <AddCircleIcon onClick={addKids} sx={{ color: "#60176F" }} />
                              {kidsArray?.length > 1 && (
                                <RemoveCircleIcon onClick={removeKids} sx={{ color: "#60176F" }} />
                              )}
                            </>
                          )}
                        </Box>
                      </Box>
                      {kidsArray.map((ele, idx) => (
                        <Grid key={idx} container columnSpacing={1} sx={{ p: 1 }}>
                          <Grid item xs={11} md={6} lg={3}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ fontWeight: "600", fontSize: "14px", color: "#707070" }}
                                >
                                  Full Name
                                </Typography>
                              </Box>
                              <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
                                <TextField
                                  fullWidth
                                  error={Boolean(
                                    formik.touched.kidsDetails?.[idx]?.fullName &&
                                      formik.errors.kidsDetails?.[idx]?.fullName
                                  )}
                                  helperText={
                                    formik.touched.kidsDetails?.[idx]?.fullName &&
                                    formik.errors.kidsDetails?.[idx]?.fullName
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.kidsDetails?.[idx]?.fullName || ""}
                                  label="Full Name"
                                  name={`kidsDetails[${idx}].fullName`}
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={11} md={6} lg={3}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ fontWeight: "600", fontSize: "14px", color: "#707070" }}
                                >
                                  Date Of Birth
                                </Typography>
                              </Box>
                              <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
                                <DatePicker
                                  inputFormat="dd-MM-yyyy"
                                  label="Date Of Birth"
                                  disableFuture
                                  onChange={(value) => {
                                    if (value && value !== "Invalid Date") {
                                      formik.setFieldValue(
                                        `kidsDetails[${idx}].age`,
                                        differenceInYears(new Date(), value)
                                      );
                                      formik.setFieldValue(`kidsDetails[${idx}].dateOfBirth`, new Date(value), true);
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      name={`kidsDetails[${idx}].dateOfBirth`}
                                      fullWidth
                                      {...params}
                                      error={Boolean(
                                        formik.touched.kidsDetails?.[idx]?.dateOfBirth &&
                                          formik.errors.kidsDetails?.[idx]?.dateOfBirth
                                      )}
                                      helperText={
                                        formik.touched.kidsDetails?.[idx]?.dateOfBirth &&
                                        formik.errors.kidsDetails?.[idx]?.dateOfBirth
                                      }
                                    />
                                  )}
                                  value={formik.values.kidsDetails?.[idx]?.dateOfBirth || null}
                                />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={11} md={6} lg={3}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ fontWeight: "600", fontSize: "14px", color: "#707070" }}
                                >
                                  Age
                                </Typography>
                              </Box>
                              <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
                                <TextField
                                  error={Boolean(
                                    formik.touched.kidsDetails?.[idx]?.age && formik.errors.kidsDetails?.[idx]?.age
                                  )}
                                  fullWidth
                                  disabled
                                  helperText={
                                    formik.touched.kidsDetails?.[idx]?.age && formik.errors.kidsDetails?.[idx]?.age
                                  }
                                  label="Age (Years)"
                                  name={`kidsDetails[${idx}].age`}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.kidsDetails?.[idx]?.age || ""}
                                  InputLabelProps={{ shrink: !!formik.values.kidsDetails?.[idx]?.dateOfBirth }}
                                  type="number"
                                />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={11} md={6} lg={3}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ fontWeight: "600", fontSize: "14px", color: "#707070" }}
                                >
                                  Gender
                                </Typography>
                              </Box>
                              <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
                                <TextField
                                  error={Boolean(
                                    formik.touched.kidsDetails?.[idx]?.gender &&
                                      formik.errors.kidsDetails?.[idx]?.gender
                                  )}
                                  helperText={
                                    formik.touched.kidsDetails?.[idx]?.gender &&
                                    formik.errors.kidsDetails?.[idx]?.gender
                                  }
                                  fullWidth
                                  label="Gender"
                                  name={`kidsDetails[${idx}].gender`}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  select
                                  SelectProps={{ native: true }}
                                  value={formik.values.kidsDetails?.[idx]?.gender || ""}
                                >
                                  <option value=""></option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </TextField>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  </>
                )}
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
          <Button disabled={formik.isSubmitting} type="submit" variant="contained">
            Update
          </Button>
          <Button
            onClick={() => HandleInsuranceModalClose(true)}
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
        </CardActions>
      </form>
    </div>
  );
}

export default InsuranceInfoEditModal;
