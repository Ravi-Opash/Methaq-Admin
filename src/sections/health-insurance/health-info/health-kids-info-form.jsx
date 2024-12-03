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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import * as Yup from "yup";
import { dateFormate } from "src/utils/date-formate";

function KidsInfoEditModal({
  setLoading,
  isLoading,
  healthInfo,
  fetchSummary,
  HandleKidsInfoModalClose,
  setConfirmPopup,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { proposalId } = router.query;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      kidsDetails: healthInfo?.kidsDetails || [],
    },

    validationSchema: Yup.object({
      kidsDetails: Yup.array().of(
        Yup.object().shape({
          fullName: Yup.string().required("Full name is required"),
          dateOfBirth: Yup.date().required("Date of birth is required"),
          gender: Yup.string().required("Gender is required"),
          age: Yup.number().required("Age is required").min(0, "Age must be a positive number"),
        })
      ),
    }),

    onSubmit: async (values, helpers) => {
      let kids = [];
      if (values?.kidsDetails?.length > 0) {
        values?.kidsDetails?.map((ele) => {
          kids?.push({ ...ele, dateOfBirth: dateFormate(ele?.dateOfBirth) });
        });
      }

      const payload = {
        kidsDetails: kids,
      };

      setLoading(false);
      dispatch(updateHealthLeadDetailsById({ id: healthInfo?._id, data: payload }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          fetchSummary();
          toast.success("Successfully updated!");
          setLoading(true);
          HandleKidsInfoModalClose(false);
          setConfirmPopup(true);
        })
        .catch((err) => {
          console.log(err, "err");
          setLoading(true);
          toast.error(err);
        });
    },
  });

  const [kidsArray, setKidsArray] = useState([1]);

  const addKids = () => {
    const newArray = [...kidsArray];
    newArray.push(newArray.length + 1);
    setKidsArray(newArray);
    const newKidsDetails = [...formik.values.kidsDetails, { dateOfBirth: "", fullName: "", gender: "", age: "" }];
    formik.setFieldValue("kidsDetails", newKidsDetails);
  };

  const removeKids = () => {
    const newKidsDetails = [...formik.values.kidsDetails];
    if (newKidsDetails.length > 1) {
      newKidsDetails.pop();
      formik.setFieldValue("kidsDetails", newKidsDetails);
    }

    const newArray = [...kidsArray];
    if (newArray.length > 1) {
      newArray.pop();
      setKidsArray(newArray);
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
                    Edit Kids Details
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
                    <AddCircleIcon onClick={addKids} sx={{ color: "#60176F" }} />
                    {kidsArray.length > 0 && <RemoveCircleIcon onClick={removeKids} sx={{ color: "#60176F" }} />}
                  </Box>
                </Box>

                <Box sx={{ p: 1, px: 2 }}>
                  {formik?.values?.kidsDetails?.map((s, i) => {
                    return (
                      <Grid container columnSpacing={2} rowSpacing={2} mb={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                ml: 2,
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
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                ml: 2,
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
                                label="Date Of Birth"
                                onChange={(value) => {
                                  if (value && value != "Invalid Date") {
                                    formik.setFieldValue(`kidsDetails[${i}].age`, differenceInYears(new Date(), value));
                                  }
                                  formik.setFieldValue(`kidsDetails[${i}].dateOfBirth`, value, true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    name={`kidsDetails[${i}].dateOfBirth`}
                                    fullWidth
                                    {...params}
                                    error={false}
                                  />
                                )}
                                value={formik.values?.kidsDetails?.[i]?.dateOfBirth}
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
                                ml: 2,
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
                                  formik.touched.kidsDetails &&
                                    formik.errors.kidsDetails &&
                                    formik.touched.kidsDetails?.[i] &&
                                    formik.errors.kidsDetails?.[i] &&
                                    formik.touched?.kidsDetails[i]?.gender &&
                                    formik.errors?.kidsDetails[i]?.gender
                                )}
                                helperText={
                                  formik.touched.kidsDetails &&
                                  formik.errors.kidsDetails &&
                                  formik.touched.kidsDetails?.[i] &&
                                  formik.errors.kidsDetails?.[i] &&
                                  formik.touched?.kidsDetails?.[i]?.gender &&
                                  formik.errors?.kidsDetails?.[i]?.gender
                                }
                                fullWidth
                                label="Gender"
                                name={`kidsDetails[${i}].gender`}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.kidsDetails?.[i]?.gender}
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
                                  formik.touched.kidsDetails?.[i]?.age && formik.errors.kidsDetails?.[i]?.age
                                )}
                                fullWidth
                                disabled
                                helperText={formik.touched.kidsDetails?.[i]?.age && formik.errors.kidsDetails?.[i]?.age}
                                label="Age (Years)"
                                name={`kidsDetails[${i}].age`}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.kidsDetails?.[i]?.age}
                                InputLabelProps={{ shrink: !!formik.values.kidsDetails?.[i]?.dateOfBirth }}
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
            onClick={() => HandleKidsInfoModalClose(true)}
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

export default KidsInfoEditModal;
