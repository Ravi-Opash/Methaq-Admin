import { Button, Card, CardActions, CardContent, Grid, TextField, Typography, styled } from "@mui/material";
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
import { differenceInYears } from "date-fns";
import { dateFormate } from "src/utils/date-formate";
import * as Yup from "yup";
import { he } from "date-fns/locale";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

const cities = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];
const salaries = ["Up to 4000", "4000 - 12000", "12000+"];
const maritalStatusList = ["Married", "Single", "Divorced", "Widow"];

function PersonInfoEditModal({
  setLoading,
  HandlePersonalModalClose,
  isLoading,
  healthInfo,
  fetchSummary,
  setConfirmPopup,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { proposalId } = router.query;
  const [isError, setIsError] = useState(false);
  const [nationalityList, setNationalityList] = useState([]);
  const inref = useRef(false);
  useEffect(() => {
    if (inref.current) {
      return;
    }
    inref.current = true;
    dispatch(getNationalities({}))
      .unwrap()
      .then((res) => {
        setNationalityList(res);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: healthInfo?.fullName || "",
      insurerName: healthInfo?.insurerName || "",
      dateOfBirth: healthInfo?.dateOfBirth || "",
      email: healthInfo?.email || "",
      age: healthInfo?.age || "",
      mobile: "971" + (healthInfo?.mobileNumber || ""),
      countryCode: healthInfo?.countryCode || "971",
      mobileNumber: healthInfo?.mobileNumber || "",
      nationality: healthInfo?.nationality || "",
      city: healthInfo?.city || "",
      salary: healthInfo?.salary || "",
      maritalStatus: healthInfo?.maritalStatus || "",
      //   insurerType: healthInfo?.insurerType || "",
      //   visaStatus: healthInfo?.visaStatus || "",
      //   currentInsurer: healthInfo?.currentInsurer || "",
      //   currentInsurerExpiryDate: healthInfo?.currentInsurerExpiryDate || "",
    },

    validationSchema: Yup.object({
      fullName: Yup.string()
        .trim()
        .required("Full name is required")
        .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)+$/, "Please enter your full name")
        .min(3, "Full name must be at least 3 characters long"),
      dateOfBirth: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      age: Yup.string().required("Required"),
      mobile: Yup.string().required("Required"),
      countryCode: Yup.string().required("Required"),
      mobileNumber: Yup.string().required("Required"),
      nationality: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      salary: Yup.string().required("Required"),
      maritalStatus: Yup.string().required("Required"),
    }),

    onSubmit: async (values, helpers) => {
      // console.log(values, "value");
      const payload = {
        ...values,
        dateOfBirth: dateFormate(values?.dateOfBirth),
      };

      setLoading(false);
      dispatch(updateHealthLeadDetailsById({ id: healthInfo?._id, data: payload }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          fetchSummary();
          toast.success("Successfully updated!");
          HandlePersonalModalClose(false);
          setLoading(true);
          setConfirmPopup(true);
        })
        .catch((err) => {
          console.log(err, "err");
          setLoading(true);
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

  useEffect(() => {
    if (formik.values?.dateOfBirth && formik.values?.dateOfBirth != "Invalid Date") {
      formik.setFieldValue("age", differenceInYears(new Date(), new Date(formik.values?.dateOfBirth)));
    }
  }, [formik.values?.dateOfBirth]);
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
                  Edit Personal Details
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
                            Insurer Name
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
                            error={Boolean(formik.touched.insurerName && formik.errors.insurerName)}
                            fullWidth
                            helperText={formik.touched.insurerName && formik.errors.insurerName}
                            label="Insurer Name"
                            name="insurerName"
                            type="string"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.insurerName}
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
                              formik.setFieldValue("dateOfBirth", value, true);
                            }}
                            disableFuture
                            renderInput={(params) => (
                              <TextField
                                name="dateOfBirth"
                                fullWidth
                                {...params}
                                error={Boolean(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                                helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                              />
                            )}
                            value={formik.values.dateOfBirth}
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
            onClick={() => HandlePersonalModalClose(true)}
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

export default PersonInfoEditModal;
