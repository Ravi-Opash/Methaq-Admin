import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Autocomplete,
  Box,
  Button,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { formattedDateUfc } from "src/utils/Format";
import PhoneNumberInput from "src/components/phoneInput-field";
import { DatePicker } from "@mui/x-date-pickers";
import { EditInProposalCustomerDetailsById, getNationalities, getProposalsDetailsById } from "./Action/proposalsAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { getCustomerQuotationDetailById } from "../customer/action/customerAction";
import { differenceInYears } from "date-fns";
import { dateFormate } from "src/utils/date-formate";

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const uaeStatus = ["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain"];

const EditCustomerDetailsForm = ({ setIsCustomerEdit, isQuote }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { proposalId, quotationId } = router.query;
  const { proposalDetail, EditCustomerDetailsInProposalByIdLoader } = useSelector((state) => state.proposals);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  //   const [showInputField, setShowInputField] = useState(false);
  const [isError, setIsError] = useState(false);

  const searchNationalities = () => {
    dispatch(getNationalities({}))
      .unwrap()
      .then((res) => {
        setNationalityOptions(res.data);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        console.error(err);
      });
  };

  useEffect(() => {
    searchNationalities();
  }, []);

  const initialValues = {
    fullName: proposalDetail?.customer?.fullName || "",
    arabicName: proposalDetail?.customer?.arabicName || "",
    email: proposalDetail?.customer?.email || "",
    age: proposalDetail?.customer?.age || "",
    mobileNumber: proposalDetail?.customer?.mobileNumber || "",
    occupation: proposalDetail?.customer?.occupation || "",
    address: proposalDetail?.customer?.address || "",
    employer: proposalDetail?.customer?.employer || "",
    maritalStatus: proposalDetail?.customer?.maritalStatus || "",
    nationality: proposalDetail?.customer?.nationality || "",
    dateOfBirth: proposalDetail?.customer?.dateOfBirth || "",
    licenceIssueDate: proposalDetail?.customer?.licenceIssueDate || "",
    licenceExpiryDate: proposalDetail?.customer?.licenceExpiryDate || "",
    placeOfIssueDL: proposalDetail?.customer?.placeOfIssueDL || "",
    licenceNo: proposalDetail?.customer?.licenceNo || "",
    dlTcNo: proposalDetail?.customer?.dlTcNo || "",
    emiratesId: proposalDetail?.customer?.emiratesId || "",
    emiratesIdExpiryDate: proposalDetail?.customer?.emiratesIdExpiryDate || "",
    gender: proposalDetail?.customer?.gender || "",
  };

  const handleSubmit = (values) => {
    // console.log(values, "values");

    const payload = {
      ...values,
      dateOfBirth: dateFormate(values?.dateOfBirth),
      licenceIssueDate: dateFormate(values?.licenceIssueDate),
      licenceExpiryDate: dateFormate(values?.licenceExpiryDate),
      emiratesIdExpiryDate: dateFormate(values?.emiratesIdExpiryDate),
    };

    // const payload = jsonToFormData(values);

    if (proposalDetail?.customer?._id) {
      dispatch(
        EditInProposalCustomerDetailsById({
          id: proposalDetail?.customer?._id,
          data: payload,
        })
      )
        .unwrap()
        .then((res) => {
          if (res?.success) {
            toast("Successfully Edited", {
              type: "success",
            });

            if (!isQuote) {
              dispatch(getProposalsDetailsById({ id: proposalId }));
            } else {
              dispatch(getCustomerQuotationDetailById(quotationId));
            }
            setIsCustomerEdit(false);
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
  };

  const hasAllRequiredFields = (data, requiredFields) => {
    for (const field of requiredFields) {
      if (!data[field]) {
        return false;
      }
    }
    return true;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      arabicName: Yup.string().required("Required"),
      email: Yup.string().required("Required"),
      gender: Yup.string().required("Required"),
      nationality: Yup.string().required("Required"),
      dateOfBirth: Yup.string().required("Required"),
      maritalStatus: Yup.string().required("Required"),
      occupation: Yup.string().required("Required"),
      mobileNumber: Yup.string().matches(/^5/, "Mobile number should starts with 5").min(9).max(9).required("Required"),
      emiratesId: Yup.string().required("Required"),
      dlTcNo: Yup.string().required("Required"),
      emiratesIdExpiryDate: Yup.string().required("Required"),
      licenceNo: Yup.string().required("Required"),
      licenceIssueDate: Yup.string().required("Required"),
      licenceExpiryDate: Yup.date().min(new Date(), "Driving licence expired!").notRequired(),
      placeOfIssueDL: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      employer: Yup.string().required("Required"),
    }),
    onSubmit: handleSubmit,
  });

  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  useEffect(() => {
    if (proposalDetail?.customer?.mobileNumber) {
      formik.setFieldValue("mobile", "971" + proposalDetail?.customer?.mobileNumber);
    }
  }, [proposalDetail?.customer?.mobileNumber]);

  useEffect(() => {
    if (formik.values?.dateOfBirth && formik.values?.dateOfBirth != "Invalid Date") {
      formik.setFieldValue("age", differenceInYears(new Date(), new Date(formik.values?.dateOfBirth)));
    }
  }, [formik.values?.dateOfBirth]);

  return (
    <Box sx={{ p: 2.5 }}>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600, width: "180px", ml: 1 }}>
            Basic Customer Detail
          </Typography>

          <Divider sx={{ width: { xs: "50%", sm: "60%", md: "70%" } }} />
        </Box>
        <Grid container columnSpacing={4} sx={{ my: 2 }}>
          <Grid item xs={12} sm={11.5}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Full name
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                        fullWidth
                        helperText={formik.touched.fullName && formik.errors.fullName}
                        // disabled={!!proposalDetail?.customer?.fullName}
                        label="Full name"
                        name="fullName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.fullName}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Arabic name
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.arabicName && formik.errors.arabicName)}
                        inputProps={{
                          lang: "ar-AE",
                        }}
                        // disabled={!!proposalDetail?.customer?.arabicName}
                        lang="ar-AE"
                        fullWidth
                        helperText={formik.touched.arabicName && formik.errors.arabicName}
                        label="Arabic name"
                        name="arabicName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.arabicName}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={2.5} sm={2} sx={{ my: 1 }}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 1 }}>
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
                        Gender:
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={9.5} sm={10} sx={{ my: 1 }}>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="gender"
                        value={formik?.values?.gender}
                        onChange={formik.handleChange}
                        onBlur={formik?.handleBlur}
                      >
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                      </RadioGroup>
                    </FormControl>
                    {formik?.errors?.gender && (
                      <Typography
                        sx={{
                          mb: 0.5,
                          fontSize: "12px",
                          color: "#d32f2f",
                        }}
                      >
                        {formik?.errors?.gender}
                      </Typography>
                    )}
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Mobile Number
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <PhoneNumberInput
                      handleMobileNumberChange={handleMobileNumberChange}
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
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Nationality
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="nationality"
                        options={nationalityOptions}
                        // loading={loading}
                        // disabled={!!proposalDetail?.customer?.nationality}
                        value={formik.values.nationality}
                        onChange={(e, value) => {
                          formik.setFieldValue("nationality", value);

                          if (!value) {
                            formik.setFieldValue("nationality", "");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Nationality"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {/* {loading ? <CircularProgress color="inherit" size={20} /> : null} */}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />

                      {formik.touched.nationality && formik.errors.nationality && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.nationality}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Email
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.email && formik.errors.email)}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email address"
                        name="email"
                        // disabled={!!proposalDetail?.customer?.email && proposalDetail?.customer?.isParent}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        type="email"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} sx={{ mt: { xs: 2, md: "unset" } }}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Date of birth
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Date Of Birth"
                        onChange={(value) => {
                          formik.setFieldValue("dateOfBirth", value);
                        }}
                        // disabled={!!proposalDetail?.customer?.dateOfBirth}
                        renderInput={(params) => (
                          <TextField
                            name="dateOfBirth"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                          />
                        )}
                        value={formik.values.dateOfBirth ? formik.values.dateOfBirth : ""}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.age && formik.errors.age)}
                        fullWidth
                        helperText={formik.touched.age && formik.errors.age}
                        label="Age (Year)"
                        name="age"
                        disabled
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.age}
                        type="number"
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Marital status
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.maritalStatus && formik.errors.maritalStatus)}
                        helperText={formik.touched.maritalStatus && formik.errors.maritalStatus}
                        fullWidth
                        label="Marital status"
                        name="maritalStatus"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        // disabled={!!proposalDetail?.customer?.maritalStatus}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.maritalStatus}
                      >
                        <option value=""></option>
                        <option value="Married"> Married </option>
                        <option value="Single"> Single </option>
                      </TextField>
                    </Box>
                  </Grid>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Occupation
                      </Typography>
                    </Box>
                  </Grid> */}
                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.occupation && formik.errors.occupation)}
                        fullWidth
                        helperText={formik.touched.occupation && formik.errors.occupation}
                        // disabled={!!proposalDetail?.customer?.occupation}
                        label="Occupation"
                        name="occupation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.occupation}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Driver Address
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.address && formik.errors.address)}
                        fullWidth
                        helperText={formik.touched.address && formik.errors.address}
                        multiline
                        rows={1}
                        // disabled={!!proposalDetail?.customer?.address}
                        label="Driver Address"
                        name="address"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.address}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.employer && formik.errors.employer)}
                        fullWidth
                        helperText={formik.touched.employer && formik.errors.employer}
                        label="Employer"
                        name="employer"
                        // disabled={!!proposalDetail?.customer?.employer && proposalDetail?.customer?.isParent}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.employer}
                        type="text"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600, width: "170px", ml: 1 }}>Emirates ID Detail</Typography>

          <Divider sx={{ width: { xs: "50%", sm: "60%", md: "70%" } }} />
        </Box>
        <Grid container columnSpacing={4} sx={{ my: 2 }}>
          <Grid item xs={12} sm={11.5}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        ID Number
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.emiratesId && formik.errors.emiratesId)}
                        fullWidth
                        helperText={formik.touched.emiratesId && formik.errors.emiratesId}
                        label="ID Number"
                        // disabled={!!proposalDetail?.customer?.emiratesId}
                        name="emiratesId"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.emiratesId}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} sx={{ mt: { xs: 2, md: "unset" } }}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        ID Expiry
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="ID Expiry"
                        // disabled={!!proposalDetail?.customer?.emiratesIdExpiryDate}
                        onChange={(value) => formik.setFieldValue("emiratesIdExpiryDate", value)}
                        renderInput={(params) => (
                          <TextField
                            name="emiratesIdExpiryDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.emiratesIdExpiryDate && formik.errors.emiratesIdExpiryDate)}
                            helperText={formik.touched.emiratesIdExpiryDate && formik.errors.emiratesIdExpiryDate}
                          />
                        )}
                        value={formik.values.emiratesIdExpiryDate}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600, width: "180px", ml: 1 }}>
            Driving License details
          </Typography>

          <Divider sx={{ width: { xs: "35%", sm: "60%", md: "70%" } }} />
        </Box>
        <Grid container columnSpacing={4} sx={{ my: 2 }}>
          <Grid item xs={12} sm={11.5}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        TC Number
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.dlTcNo && formik.errors.dlTcNo)}
                        fullWidth
                        helperText={formik.touched.dlTcNo && formik.errors.dlTcNo}
                        label="TC Number"
                        // disabled={!!proposalDetail?.customer?.dlTcNo}
                        name="dlTcNo"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.dlTcNo}
                      />
                    </Box>
                  </Grid>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Driving license Issue
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Driving license Issue"
                        onChange={(value) => {
                          formik.setFieldValue("licenceIssueDate", value);
                        }}
                        // disabled={!!proposalDetail?.customer?.licenceIssueDate}
                        renderInput={(params) => (
                          <TextField
                            name="licenceIssueDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.licenceIssueDate && formik.errors.licenceIssueDate)}
                            helperText={formik.touched.licenceIssueDate && formik.errors.licenceIssueDate}
                          />
                        )}
                        value={formik.values.licenceIssueDate}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Place of issue
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.placeOfIssueDL && formik.errors.placeOfIssueDL)}
                        helperText={formik.touched.placeOfIssueDL && formik.errors.placeOfIssueDL}
                        fullWidth
                        label="Place of issue"
                        name="placeOfIssueDL"
                        // disabled={!!proposalDetail?.customer?.placeOfIssueDL}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.placeOfIssueDL}
                      >
                        <option value=""></option>
                        {uaeStatus?.map((state, idx) => {
                          return <option value={state}>{state}</option>;
                        })}
                      </TextField>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} sx={{ mt: { xs: 2, md: "unset" } }}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        License Number
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.licenceNo && formik.errors.licenceNo)}
                        fullWidth
                        helperText={formik.touched.licenceNo && formik.errors.licenceNo}
                        label="License Number"
                        name="licenceNo"
                        // disabled={!!proposalDetail?.customer?.licenceNo}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.licenceNo}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Driving license expiry
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Driving license expiry"
                        onChange={(value) => {
                          formik.setFieldValue("licenceExpiryDate", value);
                        }}
                        // disabled={!!proposalDetail?.customer?.licenceExpiryDate}
                        renderInput={(params) => (
                          <TextField
                            name="licenceExpiryDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.licenceExpiryDate && formik.errors.licenceExpiryDate)}
                            helperText={formik.touched.licenceExpiryDate && formik.errors.licenceExpiryDate}
                          />
                        )}
                        value={formik.values.licenceExpiryDate}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "end",
          }}
          mt={3}
        >
          <Button
            // disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
          >
            Update
          </Button>

          <Button variant="outlined" type="button" onClick={() => setIsCustomerEdit(false)}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditCustomerDetailsForm;
