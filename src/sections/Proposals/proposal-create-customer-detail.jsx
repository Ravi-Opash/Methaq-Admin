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

function CreatePrposalCustomerDetails({
  formik,
  isNecessary = false,
  nationalityOptions = [],
  showInputField = false,
}) {
  return (
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
        Customer details
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
                        Full name
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                        fullWidth
                        helperText={formik.touched.fullName && formik.errors.fullName}
                        label="Full name"
                        name="fullName"
                        id="fullName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.fullName}
                      />
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
                            Arabic name
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
                            id="arabicName"
                            error={Boolean(formik.touched.arabicName && formik.errors.arabicName)}
                            inputProps={{
                              lang: "ar-AE",
                            }}
                            lang="ar-AE"
                            fullWidth
                            helperText={formik.touched.arabicName && formik.errors.arabicName}
                            label="Arabic name"
                            name="arabicName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.arabicName}
                          />
                        </Box>
                      </Grid>
                    </>
                  )}

                  {!isNecessary && (
                    <>
                      <Grid item xs={12} md={3} sx={{ my: 1 }}>
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
                            Gender
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={9} sx={{ my: 1 }}>
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="gender"
                            id="gender"
                            value={formik?.values?.gender}
                            onChange={formik.handleChange}
                            onBlur={formik?.handleBlur}
                          >
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                          </RadioGroup>
                        </FormControl>
                        {formik?.errors?.gender && (
                          <Typography
                            sx={{
                              mb: 0.5,
                              fontSize: "12px",
                              color: "#d32f2f",
                            }}
                          >
                            {formik?.errors?.gender}
                          </Typography>
                        )}
                      </Grid>
                    </>
                  )}

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
                        Mobile Number
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <PhoneInputs name={`mobileNumber`} formik={formik} />
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
                            Nationality
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
                          <Autocomplete
                            id="nationality"
                            options={nationalityOptions}
                            loading={false}
                            value={formik.values.nationality || null}
                            onChange={(e, value) => {
                              formik.setFieldValue("nationality", value);

                              if (!value) {
                                formik.setFieldValue("nationality", "");
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Nationality"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                                }}
                              />
                            )}
                          />

                          {formik.touched.nationality && formik.errors.nationality && (
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                fontSize: "12px",
                                display: "inline-block",
                                color: "red",
                              }}
                            >
                              {formik.errors.nationality}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </>
                  )}

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
                        Email
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.email && formik.errors.email)}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email address"
                        name="email"
                        id="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        type="email"
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
                        Employer
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
                        error={Boolean(formik.touched.employer && formik.errors.employer)}
                        fullWidth
                        helperText={formik.touched.employer && formik.errors.employer}
                        label="employer"
                        name="employer"
                        id="employer"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.employer}
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
                        Date of birth
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Date Of Birth"
                        onChange={(value) => {
                          formik.setFieldValue("dateOfBirth", value);
                        }}
                        disableFuture
                        renderInput={(params) => (
                          <TextField
                            name="dateOfBirth"
                            id="dateOfBirth"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                          />
                        )}
                        value={formik.values.dateOfBirth ? formik.values.dateOfBirth : ""}
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
                        Age
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.age && formik.errors.age)}
                        fullWidth
                        disabled
                        helperText={formik.touched.age && formik.errors.age}
                        label="Age (Years)"
                        name="age"
                        id="age"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.age}
                        type="number"
                      />
                    </Box>
                  </Grid>

                  {isNecessary && (
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
                            Nationality
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
                          <Autocomplete
                            id="nationality"
                            options={nationalityOptions}
                            loading={false}
                            value={formik.values.nationality || null}
                            onChange={(e, value) => {
                              formik.setFieldValue("nationality", value);

                              if (!value) {
                                formik.setFieldValue("nationality", "");
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Nationality"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                                }}
                              />
                            )}
                          />

                          {formik.touched.nationality && formik.errors.nationality && (
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                fontSize: "12px",
                                display: "inline-block",
                                color: "red",
                              }}
                            >
                              {formik.errors.nationality}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </>
                  )}

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
                            Marital status
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
                            error={Boolean(formik.touched.maritalStatus && formik.errors.maritalStatus)}
                            helperText={formik.touched.maritalStatus && formik.errors.maritalStatus}
                            fullWidth
                            label="Marital status"
                            name="maritalStatus"
                            id="maritalStatus"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.maritalStatus}
                          >
                            <option value=""></option>
                            <option value="Married"> Married </option>
                            <option value="Single"> Single </option>
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
                            Occupation
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
                            error={Boolean(formik.touched.occupation && formik.errors.occupation)}
                            fullWidth
                            helperText={formik.touched.occupation && formik.errors.occupation}
                            label="Occupation"
                            name="occupation"
                            id="occupation"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.occupation}
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
                            Driver Address
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
                            error={Boolean(formik.touched.address && formik.errors.address)}
                            fullWidth
                            helperText={formik.touched.address && formik.errors.address}
                            multiline
                            rows={2}
                            label="Driver Address"
                            name="address"
                            id="address"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.address}
                          />
                        </Box>
                      </Grid>
                    </>
                  )}

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
                        Source
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
                        error={Boolean(formik.touched.source && formik.errors.source)}
                        helperText={formik.touched.source && formik.errors.source}
                        fullWidth
                        label="Source"
                        name="source"
                        id="source"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.source}
                      >
                        <option value=""></option>
                        <option value="Social Media">Social Media</option>
                        <option value="WhatsApp Campaign">WhatsApp Campaign</option>
                        <option value="Email Campaign">Email Campaign</option>
                        <option value="Friend Referral">Friend Referral</option>
                        <option value="Tasheel">Tasheel</option>
                        <option value="Yalla Motor">Yalla Motor</option>
                        <option value="Kavak">Kavak</option>
                        <option value="Source">Source</option>
                      </TextField>
                    </Box>
                  </Grid>

                  {showInputField && (
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
                            Sales
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
                            error={Boolean(formik.touched.sales && formik.errors.sales)}
                            fullWidth
                            helperText={formik.touched.sales && formik.errors.sales}
                            label="Sales"
                            name="sales"
                            id="sales"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.sales}
                            type="text"
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
  );
}

export default CreatePrposalCustomerDetails;
