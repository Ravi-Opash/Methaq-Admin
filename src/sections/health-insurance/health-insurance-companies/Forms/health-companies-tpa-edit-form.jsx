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
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  addNewHealthInsuranceCompanyTpa,
  updateHealthInsuranceCompanyTpaById,
} from "../Action/healthinsuranceCompanyAction";

const HealthInsuranceCompanyTPAEditForm = () => {
  const dispatch = useDispatch();
  const { healthInsuranceCompanyTpaDetails } = useSelector(
    (state) => state.healthInsuranceCompany
  );
  const router = useRouter();
  const { tpaId, companyId } = router.query;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      TPAName: healthInsuranceCompanyTpaDetails
        ? healthInsuranceCompanyTpaDetails?.TPAName
        : "",
    },

    validationSchema: Yup.object({
      TPAName: Yup.string().required("TPA name is required"),
    }),

    onSubmit: (values, helpers) => {
      const payload = {
        TPAName: values?.TPAName,
      };

    //   console.log(payload, "ss");
    //   return

      if (tpaId) {
        dispatch(
          updateHealthInsuranceCompanyTpaById({ id: tpaId, data: payload })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push(`/companies/${companyId}/health-insurance/tpa`);
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
        dispatch(addNewHealthInsuranceCompanyTpa({...payload, company: companyId}))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(`/companies/${companyId}/health-insurance/tpa`);
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
                  error={Boolean(
                    formik.touched.TPAName && formik.errors.TPAName
                  )}
                  fullWidth
                  helperText={formik.touched.TPAName && formik.errors.TPAName}
                  label="TPA Name"
                  name="TPAName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.TPAName}
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
          <NextLink href={`/companies/${companyId}/health-insurance/tpa`} passHref>
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {tpaId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default HealthInsuranceCompanyTPAEditForm;
