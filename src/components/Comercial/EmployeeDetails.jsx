// This is a component for commercial employee form details

import { Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function EmployeeDetails({ formik, index, onChangeValue }) {
  return (
    <>
      <Typography sx={{ fontWeight: 600 }}>{`Employee-${
        index + 1
      }`}</Typography>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "inline-block", width: "100%" }}>
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
                Cattegory Of Employee 
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <TextField
                  label="Cattegory Of Employee"
                  name={`[employee][${index}][categoryOfEmployees]`}
                  id={`[employee][${index}][categoryOfEmployees]`}
                  type="text"
                  disabled
                  rows={2}
                  sx={{ width: "100%" }}
                  error={Boolean(
                    formik?.touched?.employee?.[index]?.categoryOfEmployees &&
                      formik?.errors?.employee?.[index]?.categoryOfEmployees
                  )}
                  helperText={
                    formik?.touched?.employee?.[index]?.categoryOfEmployees &&
                    formik?.errors?.employee?.[index]?.categoryOfEmployees
                  }
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.setFieldValue(
                      `[employee][${index}][categoryOfEmployees]`,
                      e.target.value
                    );
                    onChangeValue();
                  }}
                  value={formik?.values?.employee?.[index]?.categoryOfEmployees}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "inline-block", width: "100%" }}>
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
                Name Of Employees 
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <TextField
                  label="Name Of Employees"
                  id={`[employee][${index}][name]`}
                  name={`[employee][${index}][name]`}
                  type="text"
                  rows={2}
                  autoComplete="new-name"
                  sx={{ width: "100%" }}
                  error={Boolean(
                    formik?.touched?.employee?.[index]?.name &&
                      formik?.errors?.employee?.[index]?.name
                  )}
                  helperText={
                    formik?.touched?.employee?.[index]?.name &&
                    formik?.errors?.employee?.[index]?.name
                  }
                  onBlur={formik.handleBlur}
                  onChange={(e, value) => {
                    formik.setFieldValue(
                      `[employee][${index}][name]`,
                      e.target.value
                    );
                    onChangeValue();
                  }}
                  value={formik?.values?.employee?.[index]?.name}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "inline-block", width: "100%" }}>
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
                Designation Of Employees 
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <TextField
                  label="Designation Of Employees"
                  id={`[employee][${index}][designation]`}
                  name={`[employee][${index}][designation]`}
                  type="text"
                  rows={2}
                  autoComplete="new-designation"
                  sx={{ width: "100%" }}
                  error={Boolean(
                    formik?.touched?.employee?.[index]?.designation &&
                      formik?.errors?.employee?.[index]?.designation
                  )}
                  helperText={
                    formik?.touched?.employee?.[index]?.designation &&
                    formik?.errors?.employee?.[index]?.designation
                  }
                  onBlur={formik.handleBlur}
                  onChange={(e, value) => {
                    formik.setFieldValue(
                      `[employee][${index}][designation]`,
                      e.target.value
                    );
                    onChangeValue();
                  }}
                  value={formik?.values?.employee?.[index]?.designation}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "inline-block", width: "100%" }}>
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
                {`Estimate Wages For The Period (${formik?.values?.currency})`} 
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <TextField
                  label={`Estimate Wages For The Period (${formik?.values?.currency})`}
                  id={`[employee][${index}][estimatesPeriod]`}
                  name={`[employee][${index}][estimatesPeriod]`}
                  type="text"
                  rows={2}
                  autoComplete="new-estimatesPeriod"
                  sx={{ width: "100%" }}
                  error={Boolean(
                    formik?.touched?.employee?.[index]?.estimatesPeriod &&
                      formik?.errors?.employee?.[index]?.estimatesPeriod
                  )}
                  helperText={
                    formik?.touched?.employee?.[index]?.estimatesPeriod &&
                    formik?.errors?.employee?.[index]?.estimatesPeriod
                  }
                  onBlur={formik.handleBlur}
                  onChange={(e, value) => {
                    formik.setFieldValue(
                      `[employee][${index}][estimatesPeriod]`,
                      e.target.value
                    );
                    onChangeValue();
                  }}
                  value={formik?.values?.employee?.[index]?.estimatesPeriod}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
