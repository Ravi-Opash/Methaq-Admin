import { Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const ProposalCreatePromocodeDetails = ({ formik, salesAgentlist = {} }) => {
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
          Add Voucher
        </Typography>
        <Grid container columnSpacing={4} sx={{ my: 2 }}>
          <Grid item xs={12} sm={11.5}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={6}>
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
                        Promo Code
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.promoCode && formik.errors.promoCode)}
                        helperText={formik.touched.promoCode && formik.errors.promoCode}
                        fullWidth
                        label="Promo Code"
                        name="promoCode"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.promoCode}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
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
                        Select Sales Agent
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
                        fullWidth
                        label="Sales Agent"
                        name="salesCommissionAgentId"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.salesCommissionAgentId}
                      >
                        <option value=""></option>
                        {salesAgentlist?.map((agent, idx) => {
                          return <option value={agent?._id}>{agent?.userId?.fullName}</option>;
                        })}
                      </TextField>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProposalCreatePromocodeDetails;
