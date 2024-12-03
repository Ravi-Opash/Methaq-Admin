import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { updateHealthLeadDetailsById } from "../Leads/Action/healthInsuranceLeadAction";
import { DatePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { differenceInYears } from "date-fns";
import { formatDate } from "src/utils/formateDate";
import { dateFormate } from "src/utils/date-formate";

function SpouseInfoEditModal({ setLoading, HandleSpouseInfoModalClose, healthInfo, fetchSummary, setConfirmPopup }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { proposalId } = router.query;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      spouseDetails: healthInfo?.spouseDetails || [],
    },

    // validationSchema: schema,

    onSubmit: async (values, helpers) => {
      const payload = {
        spouseDetails: [
          {
            ...values?.spouseDetails?.[0],
            dateOfBirth: values?.spouseDetails?.[0]?.dateOfBirth
              ? dateFormate(values?.spouseDetails?.[0]?.dateOfBirth)
              : "",
          },
        ],
      };

      setLoading(false);
      dispatch(updateHealthLeadDetailsById({ id: healthInfo?._id, data: payload }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          fetchSummary();
          toast.success("Successfully updated!");
          setLoading(true);
          HandleSpouseInfoModalClose(false);
          setConfirmPopup(true);
        })
        .catch((err) => {
          console.log(err, "err");
          setLoading(true);
          toast.error(err);
        });
    },
  });

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
                  Edit Spouse Details
                </Typography>
                <Box sx={{ p: 1, px: 2 }}>
                  {formik?.values?.spouseDetails?.map((s, i) => {
                    return (
                      <Grid container columnSpacing={2} rowSpacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                ml: 1,
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
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                ml: 1,
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
                                label="From"
                                onChange={(value) => {
                                  if (value && value != "Invalid Date") {
                                    formik.setFieldValue(
                                      `spouseDetails[${i}].age`,
                                      differenceInYears(new Date(), value)
                                    );
                                  }
                                  formik.setFieldValue(`spouseDetails[${i}].dateOfBirth`, value, true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    name={`spouseDetails[${i}].dateOfBirth`}
                                    fullWidth
                                    {...params}
                                    error={false}
                                  />
                                )}
                                value={formik.values?.spouseDetails?.[i]?.dateOfBirth}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                ml: 1,
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
                                    formik.touched.spouseDetails?.[i] &&
                                    formik.errors.spouseDetails?.[i] &&
                                    formik.touched?.spouseDetails[i]?.gender &&
                                    formik.errors?.spouseDetails[i]?.gender
                                )}
                                helperText={
                                  formik.touched.spouseDetails &&
                                  formik.errors.spouseDetails &&
                                  formik.touched.spouseDetails?.[i] &&
                                  formik.errors.spouseDetails?.[i] &&
                                  formik.touched?.spouseDetails?.[i]?.gender &&
                                  formik.errors?.spouseDetails?.[i]?.gender
                                }
                                fullWidth
                                label="Gender"
                                name={`spouseDetails[${i}].gender`}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.spouseDetails?.[i]?.gender}
                              >
                                <option value=""></option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </TextField>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                ml: 1,
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
                                  formik.touched.spouseDetails?.[i]?.age && formik.errors.spouseDetails?.[i]?.age
                                )}
                                fullWidth
                                disabled
                                helperText={
                                  formik.touched.spouseDetails?.[i]?.age && formik.errors.spouseDetails?.[i]?.age
                                }
                                label="Age (Years)"
                                name={`spouseDetails[${i}].age`}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.spouseDetails?.[i]?.age}
                                InputLabelProps={{ shrink: !!formik.values.spouseDetails?.[i]?.dateOfBirth }}
                                type="number"
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    );
                  })}
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
            onClick={() => HandleSpouseInfoModalClose(true)}
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

export default SpouseInfoEditModal;
