// This is component for commercial client / employee form details

import { Grid, TextField, Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

export default function ClientDetailsForm({ formik, StaffSpeciality, index }) {
  return (
    <Grid container spacing={2} mb={3}>
      <Grid item xs={12} md={4}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
              Name Of Employee <Span> *</Span>
            </Typography>
          </Box>
          <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
            <TextField
              label="Name Of Employee"
              name={`[employee][${index}][employeeName]`}
              type="text"
              rows={2}
              autoComplete="new-employeeName"
              sx={{ width: "100%" }}
              error={Boolean(
                formik?.touched?.employee?.[index]?.employeeName && formik?.errors?.employee?.[index]?.employeeName
              )}
              helperText={
                formik?.touched?.employee?.[index]?.employeeName && formik?.errors?.employee?.[index]?.employeeName
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik?.values?.employee?.[index]?.employeeName}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              color: "#707070",
              fontSize: "14px",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Speciality
            <Span> *</Span>
          </Typography>
          <TextField
            error={Boolean(
              formik?.touched?.employee?.[index]?.speciality && formik?.errors?.employee?.[index]?.speciality
            )}
            helperText={formik?.touched?.employee?.[index]?.speciality && formik?.errors?.employee?.[index]?.speciality}
            fullWidth
            label="Speciality"
            name={`[employee][${index}][speciality]`}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            select
            SelectProps={{ native: true }}
            value={formik?.values?.employee?.[index]?.speciality}
          >
            <option value=""></option>
            {StaffSpeciality?.map((item) => {
              return <option value={item}>{item}</option>;
            })}
          </TextField>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
              License Code <Span> *</Span>
            </Typography>
          </Box>
          <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
            <TextField
              label="License Code"
              name={`[employee][${index}][licenseCode]`}
              type="text"
              rows={2}
              autoComplete="new-licenseCode"
              sx={{ width: "100%" }}
              error={Boolean(
                formik?.touched?.employee?.[index]?.licenseCode && formik?.errors?.employee?.[index]?.licenseCode
              )}
              helperText={
                formik?.touched?.employee?.[index]?.licenseCode && formik?.errors?.employee?.[index]?.licenseCode
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik?.values?.employee?.[index]?.licenseCode}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
