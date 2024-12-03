import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import PhoneInputs from "src/components/phoneInput";

function ProposalCreateDrivingLicenceDetails({ formik, isNecessary = false, uaeStatus = {} }) {
  return (
    <>
      {!isNecessary && (
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
              display: "inline-block",
              color: "#60176F",
              px: "14px",
              borderRadius: "10px 10px 0 0",
            }}
          >
            Driving License details
          </Typography>

          <Grid container columnSpacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={5.8}>
              <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
                <Grid container columnSpacing={2}>
                  <Grid item xs={12} md={12}>
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                      <Grid item xs={12} md={3}>
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
                            TC Number
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                          }}
                        >
                          <TextField
                            error={Boolean(formik.touched.dlTcNo && formik.errors.dlTcNo)}
                            fullWidth
                            helperText={formik.touched.dlTcNo && formik.errors.dlTcNo}
                            label="TC Number"
                            name="dlTcNo"
                            id="dlTcNo"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.dlTcNo}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
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
                            Driving license Issue
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                          }}
                        >
                          <DatePicker
                            inputFormat="dd-MM-yyyy"
                            label="Driving license Issue"
                            onChange={(value) => {
                              formik.setFieldValue("licenceIssueDate", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                name="licenceIssueDate"
                                id="licenceIssueDate"
                                fullWidth
                                {...params}
                                error={Boolean(formik.touched.licenceIssueDate && formik.errors.licenceIssueDate)}
                                helperText={formik.touched.licenceIssueDate && formik.errors.licenceIssueDate}
                              />
                            )}
                            value={formik.values.licenceIssueDate}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={3}>
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
                            Place of issue
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                          }}
                        >
                          <TextField
                            error={Boolean(formik.touched.placeOfIssueDL && formik.errors.placeOfIssueDL)}
                            helperText={formik.touched.placeOfIssueDL && formik.errors.placeOfIssueDL}
                            fullWidth
                            label="Place of issue"
                            name="placeOfIssueDL"
                            id="placeOfIssueDL"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.placeOfIssueDL}
                          >
                            <option value=""></option>
                            {uaeStatus?.map((state, idx) => {
                              return <option value={state}>{state}</option>;
                            })}
                          </TextField>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} sm={5.8}>
              <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
                <Grid container columnSpacing={2}>
                  <Grid item xs={12} md={12}>
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                      <Grid item xs={12} md={3}>
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
                            License Number
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                          }}
                        >
                          <TextField
                            error={Boolean(formik.touched.licenceNo && formik.errors.licenceNo)}
                            fullWidth
                            helperText={formik.touched.licenceNo && formik.errors.licenceNo}
                            label="License Number"
                            name="licenceNo"
                            id="licenceNo"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.licenceNo}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={3}>
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
                            Driving license expiry
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                          }}
                        >
                          <DatePicker
                            inputFormat="dd-MM-yyyy"
                            label="Driving license expiry"
                            onChange={(value) => {
                              formik.setFieldValue("licenceExpiryDate", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                name="licenceExpiryDate"
                                id="licenceExpiryDate"
                                fullWidth
                                {...params}
                                error={Boolean(formik.touched.licenceExpiryDate && formik.errors.licenceExpiryDate)}
                                helperText={formik.touched.licenceExpiryDate && formik.errors.licenceExpiryDate}
                              />
                            )}
                            value={formik.values.licenceExpiryDate}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default ProposalCreateDrivingLicenceDetails;
