// This is component for commercial equipment form details

import { Grid, TextField, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));
var currentYear = new Date().getFullYear();
const typeList = ["PILING RIGS", "CRANES", "Other Equipment"];

var yearsArray = Array.from({ length: currentYear - 2003 }, (_, index) => 2004 + index);
export default function EquipmentDetails({ index, formik }) {
  return (
    <Box sx={{ mt: 1, p: 2 }}>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          fontWeight: "500",
          fontSize: { sm: "18px", xs: "16px" },

          color: "inherit",
          m2: 2,
        }}
      >
        {`Equipment-${index + 1}`}
      </Typography>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12} md={6}>
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
                Assured Type <Span> *</Span>
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
              <TextField
                error={Boolean(
                  formik?.touched?.equipment?.[index]?.equipmentType &&
                    formik?.errors?.equipment?.[index]?.equipmentType
                )}
                helperText={
                  formik?.touched?.equipment?.[index]?.equipmentType &&
                  formik?.errors?.equipment?.[index]?.equipmentType
                }
                fullWidth
                label="Type"
                name={`[equipment][${index}][equipmentType]`}
                id={`[equipment][${index}][equipmentType]`}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                select
                SelectProps={{ native: true }}
                value={formik?.values?.equipment?.[index]?.equipmentType}
              >
                <option value=""></option>
                {typeList?.map((ele) => (
                  <option value={ele}>{ele}</option>
                ))}
              </TextField>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
                Description <Span> *</Span>
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
              <TextField
                fullWidth
                error={Boolean(
                  formik?.touched?.equipment?.[index]?.equipmentDescription &&
                    formik?.errors?.equipment?.[index]?.equipmentDescription
                )}
                helperText={
                  formik?.touched?.equipment?.[index]?.equipmentDescription &&
                  formik?.errors?.equipment?.[index]?.equipmentDescription
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik?.values?.equipment?.[index]?.equipmentDescription}
                label="Description"
                name={`[equipment][${index}][equipmentDescription]`}
                id={`[equipment][${index}][equipmentDescription]`}
                type="text"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
                MFG Year <Span> *</Span>
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
              <TextField
                error={Boolean(
                  formik?.touched?.equipment?.[index]?.mfgYear && formik?.errors?.equipment?.[index]?.mfgYear
                )}
                helperText={formik?.touched?.equipment?.[index]?.mfgYear && formik?.errors?.equipment?.[index]?.mfgYear}
                fullWidth
                label="MFG Year"
                name={`[equipment][${index}][mfgYear]`}
                id={`[equipment][${index}][mfgYear]`}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                select
                SelectProps={{ native: true }}
                value={formik?.values?.equipment?.[index]?.mfgYear}
              >
                <option value=""></option>
                {yearsArray.map((ele) => (
                  <option value={ele}>{ele}</option>
                ))}
              </TextField>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
                Engine Number <Span> *</Span>
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
              <TextField
                fullWidth
                error={Boolean(
                  formik?.touched?.equipment?.[index]?.equipmentEngineNumber &&
                    formik?.errors?.equipment?.[index]?.equipmentEngineNumber
                )}
                helperText={
                  formik?.touched?.equipment?.[index]?.equipmentEngineNumber &&
                  formik?.errors?.equipment?.[index]?.equipmentEngineNumber
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik?.values?.equipment?.[index]?.equipmentEngineNumber}
                label="Engine Number"
                name={`[equipment][${index}][equipmentEngineNumber]`}
                id={`[equipment][${index}][equipmentEngineNumber]`}
                type="text"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
                Chassis No<Span> *</Span>
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
              <TextField
                fullWidth
                error={Boolean(
                  formik?.touched?.equipment?.[index]?.equipmentChassisNo &&
                    formik?.errors?.equipment?.[index]?.equipmentChassisNo
                )}
                helperText={
                  formik?.touched?.equipment?.[index]?.equipmentChassisNo &&
                  formik?.errors?.equipment?.[index]?.equipmentChassisNo
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik?.values?.equipment?.[index]?.equipmentChassisNo}
                label="Chassis No"
                name={`[equipment][${index}][equipmentChassisNo]`}
                id={`[equipment][${index}][equipmentChassisNo]`}
                type="text"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
                Plate No<Span> *</Span>
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
              <TextField
                fullWidth
                error={Boolean(
                  formik?.touched?.equipment?.[index]?.equipmentPlateNo &&
                    formik?.errors?.equipment?.[index]?.equipmentPlateNo
                )}
                helperText={
                  formik?.touched?.equipment?.[index]?.equipmentPlateNo &&
                  formik?.errors?.equipment?.[index]?.equipmentPlateNo
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik?.values?.equipment?.[index]?.equipmentPlateNo}
                label="Plate No"
                name={`[equipment][${index}][equipmentPlateNo]`}
                id={`[equipment][${index}][equipmentPlateNo]`}
                type="text"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
                Color<Span> *</Span>
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
              <TextField
                fullWidth
                error={Boolean(
                  formik?.touched?.equipment?.[index]?.equipmentColor &&
                    formik?.errors?.equipment?.[index]?.equipmentColor
                )}
                helperText={
                  formik?.touched?.equipment?.[index]?.equipmentColor &&
                  formik?.errors?.equipment?.[index]?.equipmentColor
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik?.values?.equipment?.[index]?.equipmentColor}
                label="Color"
                name={`[equipment][${index}][equipmentColor]`}
                id={`[equipment][${index}][equipmentColor]`}
                type="text"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
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
                Value<Span> *</Span>
              </Typography>
            </Box>
            <Box sx={{ display: "inline-block", width: "100%", marginTop: "5px" }}>
              <TextField
                fullWidth
                error={Boolean(
                  formik?.touched?.equipment?.[index]?.equipmentValue &&
                    formik?.errors?.equipment?.[index]?.equipmentValue
                )}
                helperText={
                  formik?.touched?.equipment?.[index]?.equipmentValue &&
                  formik?.errors?.equipment?.[index]?.equipmentValue
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik?.values?.equipment?.[index]?.equipmentValue}
                label="Value"
                name={`[equipment][${index}][equipmentValue]`}
                id={`[equipment][${index}][equipmentValue]`}
                type="text"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
