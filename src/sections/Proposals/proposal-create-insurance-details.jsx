import { Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";

function ProposalCreateInsuranceDetails({ formik, isNecessary = false, insuranceCompany = {}, fieldRef = {} }) {
  return (
    <>
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
          Insurance Details
        </Typography>

        <Grid container columnSpacing={4} sx={{ mt: 2 }}>
          {!isNecessary && (
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
                            Type of issues
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
                            error={Boolean(formik.touched.typeOfIssues && formik.errors.typeOfIssues)}
                            helperText={formik.touched.typeOfIssues && formik.errors.typeOfIssues}
                            fullWidth
                            label="Type of issues"
                            name="typeOfIssues"
                            id="typeOfIssues"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.typeOfIssues}
                          >
                            <option value=""></option>
                            <option value="Renewal">Renewal</option>
                            <option value="New">New</option>
                          </TextField>
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
                            Current Insurer
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
                            error={Boolean(formik.touched.currentInsurer && formik.errors.currentInsurer)}
                            helperText={formik.touched.currentInsurer && formik.errors.currentInsurer}
                            fullWidth
                            label="Current Insurer"
                            name="currentInsurer"
                            id="currentInsurer"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.currentInsurer}
                            select
                            SelectProps={{ native: true }}
                          >
                            <option value=""></option>
                            {insuranceCompany?.map((option, idx) => {
                              return <option value={option.value}>{option.label}</option>;
                            })}
                          </TextField>
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
                            Insurance Type
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
                            error={Boolean(formik.touched.insuranceType && formik.errors.insuranceType)}
                            helperText={formik.touched.insuranceType && formik.errors.insuranceType}
                            fullWidth
                            label="Insurance Type"
                            name="insuranceType"
                            id="insuranceType"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.insuranceType}
                          >
                            <option value=""></option>
                            <option value="thirdparty">Third Party</option>
                            <option value="comprehensive">Comprehensive</option>
                          </TextField>
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
                            Current Insurance expiry
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
                            label="Current Insurance expiry"
                            onChange={(value) => {
                              formik.setFieldValue("insuranceExpiryDate", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                name="insuranceExpiryDate"
                                id="insuranceExpiryDate"
                                fullWidth
                                {...params}
                                error={Boolean(formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate)}
                                helperText={formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate}
                              />
                            )}
                            // minDate={new Date().setDate(new Date().getDate() + 1)}
                            value={formik.values.insuranceExpiryDate}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}

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
                          Claim history
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <TextField
                          error={Boolean(formik.touched.claimHistory && formik.errors.claimHistory)}
                          helperText={formik.touched.claimHistory && formik.errors.claimHistory}
                          fullWidth
                          label="Claim history"
                          name="claimHistory"
                          id="claimHistory"
                          ref={fieldRef}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={formik.values.claimHistory}
                        >
                          <option value=""></option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </TextField>
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
                          Claim Count
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <TextField
                          error={Boolean(formik.touched.yearOfNoClaim && formik.errors.yearOfNoClaim)}
                          helperText={formik.touched.yearOfNoClaim && formik.errors.yearOfNoClaim}
                          disabled={formik.values.claimHistory == "false"}
                          fullWidth
                          label="Claim Count"
                          name="yearOfNoClaim"
                          id="yearOfNoClaim"
                          ref={fieldRef}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={formik.values.yearOfNoClaim}
                        >
                          <option value=""></option>
                          <option value={"Claimed Last Year"}>Claimed Last Year</option>
                          <option value={"No Claims for One Year"}>No Claims for 1 Years</option>
                          <option value={"No Claims for Two Years"}>No Claims for 2 Years</option>
                          <option value={"No Claims for Three Years"}>No Claims for 3 Years</option>
                          <option value={"No Claims for Four Years"}>No Claims for 4 Years</option>
                          {/* <option value={"No Claims for Five Years"}>
                                No Claims for 5 Years
                                </option> */}
                          {formik?.values?.claimHistory != "true" && (
                            <option value={"No Claims for Five Years"}>Never Claimed</option>
                          )}
                        </TextField>
                      </Box>
                    </Grid>

                    {!isNecessary && (
                      <>
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
                              Current Insurance Policy Number
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
                              error={Boolean(formik.touched.policyNumber && formik.errors.policyNumber)}
                              fullWidth
                              helperText={formik.touched.policyNumber && formik.errors.policyNumber}
                              label="Current insurance policy number"
                              name="policyNumber"
                              id="policyNumber"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.policyNumber}
                            />
                          </Box>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ProposalCreateInsuranceDetails;
