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
import PhoneNumberInput from "src/components/phoneInput-field";
import { getNationalities } from "src/sections/Proposals/Action/proposalsAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { JavascriptRounded } from "@mui/icons-material";
const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    margin: "0 !important",
    marginLeft: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#60176F",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

function MoreInfoEditModal({
  setLoading,
  isLoading,
  healthInfo,
  fetchSummary,
  HandleMoreInfoModalClose,
  setConfirmPopup,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { proposalId } = router.query;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      regularMedication: healthInfo?.regularMedication || false,
      smoke: healthInfo?.smoke || false,
      hypertension: healthInfo?.hypertension || false,
      diabetes: healthInfo?.diabetes || false,
    },

    // validationSchema: schema,

    onSubmit: async (values, helpers) => {
      const payload = {
        ...values,
      };

      setLoading(false);
      dispatch(updateHealthLeadDetailsById({ id: healthInfo?._id, data: payload }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          fetchSummary();
          toast.success("Successfully updated!");
          setLoading(true);
          HandleMoreInfoModalClose(false);
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
                  Edit More Info Details
                </Typography>
                <Box sx={{ p: 1, px: 2 }}>
                  <Grid container columnSpacing={2} rowSpacing={2}>
                    <Grid item xs={12} md={10}>
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
                          Are you on regular medication or have existing medical conditions?
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <FormControlLabel
                          sx={{ ml: 0 }}
                          control={
                            <IOSSwitch
                              name="regularMedication"
                              onChange={(value, e) => {
                                formik.setFieldValue("regularMedication", value.target.checked);
                              }}
                              onBlur={formik.handleBlur}
                              checked={formik.values.regularMedication}
                            />
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
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
                          Do you smoke?
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <FormControlLabel
                          sx={{ ml: 0 }}
                          control={
                            <IOSSwitch
                              name="smoke"
                              onChange={(value, e) => {
                                formik.setFieldValue("smoke", value.target.checked);
                              }}
                              onBlur={formik.handleBlur}
                              checked={formik.values.smoke}
                            />
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
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
                          Do you have hypertension ?
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <FormControlLabel
                          sx={{ ml: 0 }}
                          control={
                            <IOSSwitch
                              name="hypertension"
                              onChange={(value, e) => {
                                formik.setFieldValue("hypertension", value.target.checked);
                              }}
                              onBlur={formik.handleBlur}
                              checked={formik.values.hypertension}
                            />
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
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
                          Do you have Diabetes ?
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <FormControlLabel
                          sx={{ ml: 0 }}
                          control={
                            <IOSSwitch
                              name="diabetes"
                              onChange={(value, e) => {
                                formik.setFieldValue("diabetes", value.target.checked);
                              }}
                              onBlur={formik.handleBlur}
                              checked={formik.values.diabetes}
                            />
                          }
                        />
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
            onClick={() => HandleMoreInfoModalClose(true)}
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

export default MoreInfoEditModal;
