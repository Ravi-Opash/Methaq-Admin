import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { toast } from "react-toastify";
import {
  addNewHealthInsuranceCompanyNetwork,
  updateHealthInsuranceCompanyNetworkById,
} from "../Action/healthinsuranceCompanyAction";

const HealthInsuranceCompanyNetworkEditForm = () => {
  const dispatch = useDispatch();
  const { healthInsuranceCompanyNetworkDetails } = useSelector(
    (state) => state.healthInsuranceCompany
  );
  const router = useRouter();
  const { companyId ,networkId, tpaId } = router.query;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      networkName: healthInsuranceCompanyNetworkDetails
        ? healthInsuranceCompanyNetworkDetails?.networkName
        : "",
    },

    validationSchema: Yup.object({
      networkName: Yup.string().required("Network name is required"),
    }),

    onSubmit: (values, helpers) => {
      const payload = {
        networkName: values?.networkName,
      };

      //   console.log(payload, "ss");
      //   return;

      if (networkId) {
        dispatch(
          updateHealthInsuranceCompanyNetworkById({
            id: networkId,
            data: payload,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push(`/companies/${companyId}/health-insurance/tpa/${tpaId}/network`);
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
          addNewHealthInsuranceCompanyNetwork({
            TPA: tpaId,
            networkName: values?.networkName,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(`/companies/${companyId}/health-insurance/tpa/${tpaId}/network`);
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
                    formik.touched.networkName && formik.errors.networkName
                  )}
                  fullWidth
                  helperText={
                    formik.touched.networkName && formik.errors.networkName
                  }
                  label="Network Name"
                  name="networkName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.networkName}
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
          <NextLink href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network`} passHref>
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {networkId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default HealthInsuranceCompanyNetworkEditForm;
