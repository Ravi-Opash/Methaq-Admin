// This is component for commercial category form details

import { Grid, TextField, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React from "react";
export default function CategoryDetails({ index, formik, onChangeValue }) {
  const Span = styled("span")(({ theme }) => ({
    [theme.breakpoints.up("xs")]: {},
    color: "red",
  }));

  return (
    <Grid container spacing={2} mb={3}>
      <Grid item xs={12} md={4}>
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
              {`Category-${index + 1}`} <Span> *</Span>
            </Typography>
          </Box>
          <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
            <TextField
              error={Boolean(
                formik?.touched?.category?.[index]?.categoryOfEmployees &&
                  formik?.errors?.category?.[index]?.categoryOfEmployees
              )}
              helperText={
                formik?.touched?.category?.[index]?.categoryOfEmployees &&
                formik?.errors?.category?.[index]?.categoryOfEmployees
              }
              fullWidth
              label="Category Of Employees"
              name={`[category][${index}][categoryOfEmployees]`}
              id={`[category][${index}][categoryOfEmployees]`}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              select
              SelectProps={{ native: true }}
              value={formik?.values?.category?.[index]?.categoryOfEmployees}
            >
              <option value={""}></option>
              {index == 0 && <option value={"Admin"}>Admin</option>}
              {index == 0 && <option value={"Non Admin/Manual"}>Non Admin/Manual</option>}
              {index == 1 && formik?.values?.category?.[0]?.categoryOfEmployees == "Admin" && (
                <option value={"Non Admin/Manual"}>Non Admin/Manual</option>
              )}
              {index == 1 && formik?.values?.category?.[0]?.categoryOfEmployees == "Non Admin/Manual" && (
                <option value={"Admin"}>Admin</option>
              )}
            </TextField>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
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
              No Of Employees <Span> *</Span>
            </Typography>
          </Box>
          <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
            <TextField
              label="No Of Employees"
              id={`[category][${index}][noOfEmployees]`}
              name={`[category][${index}][noOfEmployees]`}
              type="number"
              rows={2}
              autoComplete="new-noOfEmployees"
              sx={{ width: "100%" }}
              error={Boolean(
                formik?.touched?.category?.[index]?.noOfEmployees && formik?.errors?.category?.[index]?.noOfEmployees
              )}
              helperText={
                formik?.touched?.category?.[index]?.noOfEmployees && formik?.errors?.category?.[index]?.noOfEmployees
              }
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.setFieldValue(`[category][${index}][noOfEmployees]`, e.target.value);
                onChangeValue();
              }}
              value={formik?.values?.category?.[index]?.noOfEmployees}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
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
              {`Estimated Wages For The Period (${formik?.values?.currency})`}
              <Span> *</Span>
            </Typography>
          </Box>
          <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
            <TextField
              label={`Estimated Wages For The Period (${formik?.values?.currency})`}
              name={`[category][${index}][estimatedWages]`}
              id={`[category][${index}][estimatedWages]`}
              type="text"
              rows={2}
              autoComplete="new-estimatedWages"
              sx={{ width: "100%" }}
              error={Boolean(
                formik?.touched?.category?.[index]?.estimatedWages && formik?.errors?.category?.[index]?.estimatedWages
              )}
              helperText={
                formik?.touched?.category?.[index]?.estimatedWages && formik?.errors?.category?.[index]?.estimatedWages
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik?.values?.category?.[index]?.estimatedWages}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
