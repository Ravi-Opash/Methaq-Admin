import React from "react";
import NextLink from "next/link";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import format from "date-fns/format";
import { DatePicker } from "@mui/x-date-pickers";
import { addHealthProvider, updateHealthProviderApi } from "./Action/healthProviderAction";
import { toast } from "react-toastify";

const proposerEm = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];
const providertype = [
  "Hospital",
  "Clinic",
  "Pharmacy",
  "Diagnostics",
  "Optical Center",
  "Day Surgery Center",
  "Government Hospital",
  "Government Clinic",
  "Government Pharmacy",
];

const PrividerEditForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { providerId } = router.query;
  const { healthProviderDetails } = useSelector((state) => state.healthProvider);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      providerCode: healthProviderDetails ? healthProviderDetails?.providerCode : "",
      serviceProvider: healthProviderDetails ? healthProviderDetails?.serviceProvider : "",
      emirate: healthProviderDetails ? healthProviderDetails?.emirate : "",
      region: healthProviderDetails ? healthProviderDetails?.region : "",
      providerType: healthProviderDetails ? healthProviderDetails?.providerType : "",
      providerName: healthProviderDetails ? healthProviderDetails?.providerName : "",
      providerLicenseNumber: healthProviderDetails ? healthProviderDetails?.providerLicenseNumber : "",
      providerStartDate: healthProviderDetails?.providerStartDate || "",
      providerContactNumber: healthProviderDetails ? healthProviderDetails?.providerContactNumber : "",
      providerAddresss: healthProviderDetails ? healthProviderDetails?.providerAddresss : "",
      providerGroup: healthProviderDetails ? healthProviderDetails?.providerGroup : "",
      providerSpeciality: healthProviderDetails ? healthProviderDetails?.providerSpeciality : "",
      isActive: healthProviderDetails ? healthProviderDetails?.isActive : true,
    },

    validationSchema: Yup.object({
      serviceProvider: Yup.string().required("Service Provider is required"),
      emirate: Yup.string().required("Emirate is required"),
      providerType: Yup.string().required("Provider Type is required"),
      providerName: Yup.string().required("Provider Name is required"),
      providerLicenseNumber: Yup.string().required("Provider License Number is required"),
      providerContactNumber: Yup.string().required("Provider Contact Number is required"),
      providerAddresss: Yup.string().required("Provider Addresss is required"),
      isActive: Yup.boolean().required("limit is required"),
    }),

    onSubmit: async (values, helpers) => {
      if (providerId) {
        dispatch(updateHealthProviderApi({ id: providerId, data: values }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              toast("Successfully Edited", {
                type: "success",
              });

              router.push("/health-insurance/providers");
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
        // If no providerId, create a new health provider
      } else {
        dispatch(addHealthProvider(values))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              toast("Successfully Created", {
                type: "success",
              });
              router.push("/health-insurance/providers");
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
          <CardHeader title={providerId ? "Edit Provider" : "Create Provider"} />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.providerCode && formik.errors.providerCode)}
                  fullWidth
                  helperText={formik.touched.providerCode && formik.errors.providerCode}
                  label="Provider Code"
                  name="providerCode"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik?.values?.providerCode}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.serviceProvider && formik.errors.serviceProvider)}
                  fullWidth
                  helperText={formik.touched.serviceProvider && formik.errors.serviceProvider}
                  label="Service Provider"
                  name="serviceProvider"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik?.values?.serviceProvider}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                  <TextField
                    error={Boolean(formik.touched.emirate && formik.errors.emirate)}
                    helperText={formik.touched.emirate && formik.errors.emirate}
                    fullWidth
                    label="Emirate"
                    name="emirate"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.emirate}
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
                  <TextField
                    error={Boolean(formik.touched.region && formik.errors.region)}
                    fullWidth
                    helperText={formik.touched.region && formik.errors.region}
                    label="Service Provider Region"
                    name="region"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik?.values?.region}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                  <TextField
                    error={Boolean(formik.touched.providerType && formik.errors.providerType)}
                    helperText={formik.touched.providerType && formik.errors.providerType}
                    fullWidth
                    label="Provider Type"
                    name="providerType"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.providerType}
                  >
                    <option value=""></option>
                    {providertype?.map((i) => (
                      <option value={i}>{i}</option>
                    ))}
                  </TextField>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.providerName && formik.errors.providerName)}
                  fullWidth
                  helperText={formik.touched.providerName && formik.errors.providerName}
                  label="Provider Name"
                  name="providerName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.providerName}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.providerLicenseNumber && formik.errors.providerLicenseNumber)}
                  fullWidth
                  helperText={formik.touched.providerLicenseNumber && formik.errors.providerLicenseNumber}
                  label="Provider License Number"
                  name="providerLicenseNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.providerLicenseNumber}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.providerContactNumber && formik.errors.providerContactNumber)}
                  fullWidth
                  helperText={formik.touched.providerContactNumber && formik.errors.providerContactNumber}
                  label="Provider Contact Number"
                  name="providerContactNumber"
                  type="string"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.providerContactNumber}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  multiline
                  error={Boolean(formik.touched.providerAddresss && formik.errors.providerAddresss)}
                  fullWidth
                  helperText={formik.touched.providerAddresss && formik.errors.providerAddresss}
                  label="Provider Addresss"
                  name="providerAddresss"
                  onBlur={formik.handleBlur}
                  rows={2}
                  onChange={formik.handleChange}
                  value={formik.values.providerAddresss}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.providerSpeciality && formik.errors.providerSpeciality)}
                  fullWidth
                  helperText={formik.touched.providerSpeciality && formik.errors.providerSpeciality}
                  label="Provider Speciality"
                  name="providerSpeciality"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.providerSpeciality}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.providerGroup && formik.errors.providerGroup)}
                  fullWidth
                  helperText={formik.touched.providerGroup && formik.errors.providerGroup}
                  label="Provider Group"
                  name="providerGroup"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.providerGroup}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <DatePicker
                  inputFormat="dd-MM-yyyy"
                  label="Provider Start Date"
                  onChange={(value) => {
                    formik.setFieldValue("providerStartDate", value, true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      name="providerStartDate"
                      fullWidth
                      {...params}
                      error={Boolean(formik.touched.providerStartDate && formik.errors.providerStartDate)}
                      helperText={formik.touched.providerStartDate && formik.errors.providerStartDate}
                    />
                  )}
                  value={formik.values.providerStartDate}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.isActive}
                      defaultChecked={healthProviderDetails ? healthProviderDetails?.isActive : true}
                    />
                  }
                  label="Is Active"
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions
            sx={{
              flexWrap: "wrap",
              m: -1,
            }}
          >
            <Button disabled={formik.isSubmitting} type="submit" sx={{ m: 1 }} variant="contained">
              {providerId ? "Update" : "Create"}
            </Button>

            <NextLink href={`/health-insurance/providers`} passHref>
              <Button
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
            </NextLink>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default PrividerEditForm;
