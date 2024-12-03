import { Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";

function ProposalCreateEidDetails({ formik, isNecessary = false }) {
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
            Emirates Id details
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
                            ID Number
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
                            error={Boolean(formik.touched.emiratesId && formik.errors.emiratesId)}
                            fullWidth
                            helperText={formik.touched.emiratesId && formik.errors.emiratesId}
                            label="ID Number"
                            name="emiratesId"
                            id="emiratesId"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.emiratesId}
                          />
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
                            ID Expiry
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
                            label="ID Expiry"
                            onChange={(value) => formik.setFieldValue("emiratesIdExpiryDate", value)}
                            renderInput={(params) => (
                              <TextField
                                name="emiratesIdExpiryDate"
                                id="emiratesIdExpiryDate"
                                fullWidth
                                {...params}
                                error={Boolean(
                                  formik.touched.emiratesIdExpiryDate && formik.errors.emiratesIdExpiryDate
                                )}
                                helperText={formik.touched.emiratesIdExpiryDate && formik.errors.emiratesIdExpiryDate}
                              />
                            )}
                            value={formik.values.emiratesIdExpiryDate}
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

export default ProposalCreateEidDetails;
