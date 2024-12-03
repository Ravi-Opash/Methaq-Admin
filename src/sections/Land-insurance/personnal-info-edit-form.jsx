import { Button, Card, CardActions, CardContent, Grid, TextField, Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import PhoneNumberInput from "src/components/phoneInput-field";
import { getNationalities } from "src/sections/Proposals/Action/proposalsAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { differenceInYears } from "date-fns";
import { updateHealthLeadDetailsById } from "../health-insurance/Leads/Action/healthInsuranceLeadAction";
import { updateLandDetails } from "./Proposals/Action/landInsuranceAction";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

const cities = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];
const salaries = ["Up to 4000", "4000 - 12000", "12000+"];
const maritalStatusList = ["Married", "Single", "Divorced", "Widow"];

function PersonLandInfoEditModal({ setLoading, HandlePersonalModalClose, isLoading, landInfo, fetchSummary }) {
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
      fullName: landInfo?.fullName || "",
      email: landInfo?.email || "",
      mobile: "971" + (landInfo?.mobileNumber || ""),
      countryCode: landInfo?.countryCode || "971",
      mobileNumber: landInfo?.mobileNumber || "",
      //   insurerType: landInfo?.insurerType || "",
      //   visaStatus: landInfo?.visaStatus || "",
      //   currentInsurer: landInfo?.currentInsurer || "",
      //   currentInsurerExpiryDate: landInfo?.currentInsurerExpiryDate || "",
    },

    // validationSchema: schema,

    onSubmit: async (values, helpers) => {
      // console.log(values, "value");
      const payload = {
        ...values,
      };

      setLoading(false);
      dispatch(updateLandDetails({ landInfoId: landInfo?._id, data: payload }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          fetchSummary();
          toast.success("Successfully updated!");
          HandlePersonalModalClose(false);
          setLoading(true);
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

export default PersonLandInfoEditModal;
