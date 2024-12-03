import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  addNewHealthInsuranceCompanyPlans,
  updateHealthInsuranceCompanyPlansById,
} from "../Action/healthinsuranceCompanyAction";

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

const HealthInsuranceCompanyPlansEditForm = () => {
  const dispatch = useDispatch();
  const { healthInsuranceCompanyPlansDetails } = useSelector((state) => state.healthInsuranceCompany);
  const router = useRouter();
  const { companyId, tpaId, networkId, cityId, planId } = router.query;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      planName: healthInsuranceCompanyPlansDetails ? healthInsuranceCompanyPlansDetails?.planName : "",
      coPay: healthInsuranceCompanyPlansDetails ? healthInsuranceCompanyPlansDetails?.coPay : "",
      isEnable: healthInsuranceCompanyPlansDetails ? healthInsuranceCompanyPlansDetails?.isEnable : true,
      isBasic: healthInsuranceCompanyPlansDetails?.isBasic ? healthInsuranceCompanyPlansDetails?.isBasic : false,
      isPremiumRequestUpon: healthInsuranceCompanyPlansDetails?.isPremiumRequestUpon
        ? healthInsuranceCompanyPlansDetails?.isPremiumRequestUpon
        : false,
    },

    validationSchema: Yup.object({
      planName: Yup.string().required("Plans name is required"),
      // coPay: Yup.number().max(100).required("Co pay is required"),
    }),

    onSubmit: (values, helpers) => {
      const payload = {
        planName: values?.planName,
        coPay: values?.coPay,
        isEnable: values?.isEnable,
        isBasic: values?.isBasic,
        isPremiumRequestUpon: values?.isPremiumRequestUpon,
      };

      if (planId) {
        dispatch(
          updateHealthInsuranceCompanyPlansById({
            id: planId,
            data: payload,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push(
                `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans`
              );
              toast("Successfully Edited", {
                type: "success",
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
      } else {
        dispatch(
          addNewHealthInsuranceCompanyPlans({
            city: cityId,
            ...payload,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(
                `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans`
              );
              toast("Successfully Created", {
                type: "success",
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.planName && formik.errors.planName)}
                  fullWidth
                  helperText={formik.touched.planName && formik.errors.planName}
                  label="Plan Name"
                  name="planName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.planName}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.coPay && formik.errors.coPay)}
                  fullWidth
                  helperText={formik.touched.coPay && formik.errors.coPay}
                  label="Co Pay"
                  name="coPay"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.coPay}
                >
                  <option value=""></option>
                  <option value="0"> 0% </option>
                  <option value="5"> 5% </option>
                  <option value="10"> 10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="30">30%</option>
                </TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#707070", ml: 1 }}>
                  Mark as Basic plan
                </Typography>
                <FormControlLabel
                  sx={{ m: 1, ml: 1 }}
                  control={
                    <IOSSwitch
                      name={`isBasic`}
                      onChange={(value, e) => {
                        formik.setFieldValue(`isBasic`, value.target.checked);
                      }}
                      onBlur={formik.handleBlur}
                      checked={formik.values && formik.values.isBasic}
                    />
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#707070", ml: 1 }}>
                  Is Plan Active
                </Typography>
                <FormControlLabel
                  sx={{ m: 1, ml: 1 }}
                  control={
                    <IOSSwitch
                      name={`isEnable`}
                      onChange={(value, e) => {
                        formik.setFieldValue(`isEnable`, value.target.checked);
                      }}
                      onBlur={formik.handleBlur}
                      checked={formik.values && formik.values.isEnable}
                    />
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#707070" }}>No Price</Typography>
                </Box>
                <FormControlLabel
                  sx={{ m: 1, ml: 1 }}
                  name="isPremiumRequestUpon"
                  onChange={formik.handleChange}
                  control={
                    <IOSSwitch
                      name={`isPremiumRequestUpon`}
                      onBlur={formik.handleBlur}
                      checked={formik.values && formik.values.isPremiumRequestUpon}
                    />
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            mx: -1,
            mb: -1,
            mt: 3,
          }}
        >
          <NextLink
            href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans`}
            passHref
          >
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {planId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default HealthInsuranceCompanyPlansEditForm;
