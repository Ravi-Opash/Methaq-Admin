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
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  addNewHealthInsuranceCompanyCity,
  updateHealthInsuranceCompanyCityById,
} from "../Action/healthinsuranceCompanyAction";

const uaeStatus = [
  { label: "Abu Dhabi", value: "Abu Dhabi" },
  { label: "Ajman", value: "Ajman" },
  { label: "Dubai", value: "Dubai" },
  { label: "Fujairah", value: "Fujairah" },
  { label: "Ras Al Khaimah", value: "Ras Al Khaimah" },
  { label: "Sharjah", value: "Sharjah" },
  { label: "Umm Al Quwain", value: "Umm Al Quwain" },
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const HealthInsuranceCompanyCityEditForm = () => {
  const dispatch = useDispatch();
  const { healthInsuranceCompanyCityDetails } = useSelector((state) => state.healthInsuranceCompany);
  const router = useRouter();
  const { companyId, tpaId, networkId, cityId } = router.query;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      cityName: healthInsuranceCompanyCityDetails?.cityName ? healthInsuranceCompanyCityDetails?.cityName : [],
    },

    validationSchema: Yup.object({
      cityName: Yup.array().of(Yup.string()).required("City name is required"),
    }),

    onSubmit: (values, helpers) => {
      // console.log(values, "values");

      const payload = {
        cityName: values?.cityName,
      };

      // console.log(payload, "ss");
      // return;

      if (cityId) {
        dispatch(
          updateHealthInsuranceCompanyCityById({
            id: cityId,
            data: payload,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push(`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city`);
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
          addNewHealthInsuranceCompanyCity({
            network: networkId,
            cityName: values?.cityName,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city`);
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
                {/* <TextField
                  error={Boolean(
                    formik.touched.cityName && formik.errors.cityName
                  )}
                  helperText={formik.touched.cityName && formik.errors.cityName}
                  fullWidth
                  label="City Name"
                  name="cityName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.cityName}
                >
                  <option value=""></option>
                  {uaeStatus?.map((state, idx) => {
                    return <option value={state}>{state}</option>;
                  })}
                </TextField> */}
                <FormControl
                  fullWidth
                  sx={{
                    "& label.Mui-focused": {
                      color: "#60176F",
                    },
                  }}
                >
                  <InputLabel
                    sx={{
                      transform: "translate(12px, 20px) scale(1)",
                      background: "#FFF",
                      padding: "0 4px",
                    }}
                    id="demo-multiple-chip-label"
                  >
                    City
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    name="cityName"
                    multiple
                    fullWidth
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    value={formik.values.cityName || []}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    MenuProps={MenuProps}
                    renderValue={(selected) => (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {uaeStatus.map((h) => {
                      return <MenuItem value={h?.value}>{h?.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
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
          <NextLink href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city`} passHref>
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {cityId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default HealthInsuranceCompanyCityEditForm;
