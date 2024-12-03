import { Autocomplete, Grid, InputAdornment, TextField, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import CarImagesForm from "./car-images-form";

function ProposalCreateCarDetails({
  formik,
  isNecessary = false,
  carOptions = {},
  fieldRef = {},
  searchYears = {},
  searchModels = {},
  trimOptions = {},
  loading = false,
  bodyTypeOptions = {},
  isLoadingCar = false,
  allYears = {},
  uaeStatus = {},
  plateCodeLatters = {},
  isInsuranceExpired = {},
  enableBodyText = {},
  setSearchCar,
  searchCars,
  setSearchedModels,
  setSearchTrim,
  fetchModels,
  fetchTrims,
  fetchBodyTypesandCylinders,
}) {
  return (
    <>
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderRadius: "10px",
          mb: 3,
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
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
          Car details
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
                        Year
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="year"
                        ref={fieldRef}
                        options={searchYears}
                        loading={searchYears?.length == 0}
                        value={formik.values.year}
                        onBlur={formik.handleBlur}
                        onChange={(e, value) => {
                          formik.setFieldValue("year", value);
                          setSearchCar([]);
                          searchCars(value);
                          formik.setFieldValue("make", "");
                          formik.setFieldValue("model", "");
                          formik.setFieldValue("trim", "");
                          formik.setFieldValue("bodyType", "");
                          formik.setFieldValue("body_type_text", "");
                          formik.setFieldValue("cylinders_text", "");
                          formik.setFieldValue("cylinders", "");

                          if (!value) {
                            formik.setFieldValue("year", "");
                          }
                        }}
                        ListboxProps={{ style: { maxHeight: 250 } }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(formik.touched.year && formik.errors.year)}
                            helperText={formik.touched.year && formik.errors.year}
                            label="Car Year"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {searchYears?.length == 0 ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
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
                        Brand
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="make"
                        ref={fieldRef}
                        options={carOptions}
                        loading={formik.values.year && carOptions?.length == 0}
                        value={formik.values.make}
                        disabled={!formik.values.year}
                        onBlur={formik.handleBlur}
                        onChange={(e, value) => {
                          formik.setFieldValue("make", value);
                          setSearchedModels([]);
                          fetchModels(value, formik.values.year);
                          formik.setFieldValue("model", "");
                          formik.setFieldValue("trim", "");
                          formik.setFieldValue("bodyType", "");
                          formik.setFieldValue("body_type_text", "");
                          formik.setFieldValue("cylinders_text", "");
                          formik.setFieldValue("cylinders", "");

                          if (!value) {
                            formik.setFieldValue("make", "");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(formik.touched.make && formik.errors.make)}
                            helperText={formik.touched.make && formik.errors.make}
                            label="Car Brand"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {formik.values.year && carOptions?.length == 0 ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
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
                        Model
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="model"
                        ref={fieldRef}
                        disabled={!formik.values.make}
                        options={searchModels}
                        loading={formik.values.make && searchModels?.length == 0}
                        value={formik.values.model}
                        onBlur={formik.handleBlur}
                        onChange={(e, value) => {
                          setSearchTrim([]);
                          fetchTrims(formik.values.make, formik.values.year, value);

                          formik.setFieldValue("model", value);
                          formik.setFieldValue("trim", "");
                          formik.setFieldValue("bodyType", "");
                          formik.setFieldValue("body_type_text", "");
                          formik.setFieldValue("cylinders_text", "");
                          formik.setFieldValue("cylinders", "");
                          if (!value) {
                            formik.setFieldValue("model", "");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Car Model"
                            error={Boolean(formik.touched.model && formik.errors.model)}
                            helperText={formik.touched.model && formik.errors.model}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {formik.values.make && searchModels?.length == 0 ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
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
                        Regional Specs
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
                        error={Boolean(formik.touched.regionalSpec && formik.errors.regionalSpec)}
                        helperText={formik.touched.regionalSpec && formik.errors.regionalSpec}
                        fullWidth
                        label="Regional Specs"
                        name="regionalSpec"
                        id="regionalSpec"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.regionalSpec}
                      >
                        <option value="GCC">GCC</option>
                        <option value="Non-GCC">Non-GCC</option>
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
                        Trim
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="trim"
                        ref={fieldRef}
                        disabled={!formik.values.model}
                        options={trimOptions}
                        loading={formik.values.model && trimOptions?.length == 0}
                        value={formik.values.trim}
                        onBlur={formik.handleBlur}
                        onChange={(e, value) => {
                          formik.setFieldValue("trim", value);
                          fetchBodyTypesandCylinders(
                            formik.values.make,
                            formik.values.model,
                            value,
                            formik.values.year,
                            formik.values?.regionalSpec
                          );

                          if (!value) {
                            formik.setFieldValue("bodyType", "");
                            formik.setFieldValue("body_type_text", "");
                            formik.setFieldValue("cylinders_text", "");
                            formik.setFieldValue("cylinders", "");
                          }
                        }}
                        ListboxProps={{ style: { maxHeight: 250 } }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Car Trim"
                            error={Boolean(formik.touched.trim && formik.errors.trim)}
                            helperText={formik.touched.trim && formik.errors.trim}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {formik.values.model && trimOptions?.length == 0 ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
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
                        No. of Cylinders
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      {!!formik.values.cylinders_text && (
                        <TextField
                          ref={fieldRef}
                          error={Boolean(formik.touched.cylinders_text && formik.errors.cylinders_text)}
                          fullWidth
                          helperText={formik.touched.cylinders_text && formik.errors.cylinders_text}
                          label="Cylinders"
                          name="cylinders_text"
                          disabled
                          value={formik.values.cylinders_text}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                {loading && <CircularProgress size={20} />}
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}

                      {!formik.values.cylinders_text && (
                        <TextField
                          error={Boolean(formik.touched.cylinders && formik.errors.cylinders)}
                          disabled={!formik.values.trim}
                          helperText={formik.touched.cylinders && formik.errors.cylinders}
                          fullWidth
                          label="Cylinders"
                          name="cylinders"
                          id="cylinders"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={formik.values.cylinders !== "" ? formik.values.cylinders : undefined}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                {loading && <CircularProgress size={20} />}
                              </InputAdornment>
                            ),
                          }}
                        >
                          <option value=""></option>
                          <option value="4">4</option>
                          <option value="6">6</option>
                          <option value="8">8</option>
                          <option value="9">9+</option>
                        </TextField>
                      )}
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
                            Body type
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
                          {!!formik.values.body_type_text && enableBodyText && (
                            <TextField
                              ref={fieldRef}
                              error={Boolean(formik.touched.body_type_text && formik.errors.body_type_text)}
                              fullWidth
                              helperText={formik.touched.body_type_text && formik.errors.body_type_text}
                              label="Body Type"
                              name="body_type_text"
                              disabled
                              value={formik.values.body_type_text}
                            />
                          )}

                          {!!formik.values.body_type_text && !enableBodyText && (
                            <TextField
                              error={Boolean(formik.touched.body_type_text && formik.errors.body_type_text)}
                              fullWidth
                              helperText={formik.touched.body_type_text && formik.errors.body_type_text}
                              label="Body Type"
                              name="body_type_text"
                              disabled
                              value={formik.values.body_type_text}
                            />
                          )}

                          {!formik.values.body_type_text && (
                            <Autocomplete
                              id="bodyType"
                              disabled={!formik.values.trim}
                              options={bodyTypeOptions}
                              loading={loading}
                              value={formik?.values?.bodyType}
                              onBlur={formik.handleBlur}
                              onChange={(e, value) => {
                                formik.setFieldValue("bodyType", value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Body Type"
                                  error={Boolean(formik.touched.bodyType && formik.errors.bodyType)}
                                  helperText={formik.touched.bodyType && formik.errors.bodyType}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                />
                              )}
                            />
                          )}
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
                            Value
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
                            disabled={!formik.values.trim}
                            ref={fieldRef}
                            error={Boolean(formik.touched.price && formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                            fullWidth
                            type="number"
                            label="Car Value"
                            name="price"
                            id="price"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={!isLoadingCar ? "" : formik.values.price}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  {loading && <CircularProgress size={20} />}
                                </InputAdornment>
                              ),
                            }}
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
                            Policy Start Date
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
                            ref={fieldRef}
                            label="Policy Start Date"
                            maxDate={new Date().setDate(new Date().getDate() + 365)}
                            minDate={new Date()}
                            onChange={(value) => {
                              formik.setFieldValue("policyEffectiveDate", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                name="policyEffectiveDate"
                                fullWidth
                                {...params}
                                error={Boolean(formik.touched.policyEffectiveDate && formik.errors.policyEffectiveDate)}
                                helperText={formik.touched.policyEffectiveDate && formik.errors.policyEffectiveDate}
                              />
                            )}
                            value={formik.values.policyEffectiveDate}
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
                            Registration card expiry date
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
                            label="Registration card expiry date"
                            onChange={(value) => {
                              formik.setFieldValue("regCardExpiryDate", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                name="regCardExpiryDate"
                                id="regCardExpiryDate"
                                fullWidth
                                {...params}
                                error={Boolean(formik.touched.regCardExpiryDate && formik.errors.regCardExpiryDate)}
                                helperText={formik.touched.regCardExpiryDate && formik.errors.regCardExpiryDate}
                              />
                            )}
                            value={formik.values.regCardExpiryDate}
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
                            Use of vehicle
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
                            error={Boolean(formik.touched.useOfVehicle && formik.errors.useOfVehicle)}
                            helperText={formik.touched.useOfVehicle && formik.errors.useOfVehicle}
                            fullWidth
                            label="Use Of Vehicle"
                            name="useOfVehicle"
                            id="useOfVehicle"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.useOfVehicle}
                          >
                            <option value=""></option>
                            <option value="Commercial">Commercial</option>
                            <option value="Personal">Personal</option>
                          </TextField>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
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
                            Body type
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
                          {!!formik.values.body_type_text && enableBodyText && (
                            <TextField
                              error={Boolean(formik.touched.body_type_text && formik.errors.body_type_text)}
                              fullWidth
                              helperText={formik.touched.body_type_text && formik.errors.body_type_text}
                              label="Body Type"
                              name="body_type_text"
                              disabled
                              value={formik.values.body_type_text}
                            />
                          )}

                          {!!formik.values.body_type_text && !enableBodyText && (
                            <TextField
                              error={Boolean(formik.touched.body_type_text && formik.errors.body_type_text)}
                              fullWidth
                              helperText={formik.touched.body_type_text && formik.errors.body_type_text}
                              label="Body Type"
                              name="body_type_text"
                              disabled
                              value={formik.values.body_type_text}
                            />
                          )}

                          {!formik.values.body_type_text && (
                            <Autocomplete
                              id="bodyType"
                              disabled={!formik.values.trim}
                              options={bodyTypeOptions}
                              loading={loading}
                              value={formik?.values?.bodyType}
                              onChange={(e, value) => {
                                formik.setFieldValue("bodyType", value);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Body Type"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                                />
                              )}
                            />
                          )}

                          {formik.touched.bodyType && formik.errors.bodyType && (
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                fontSize: "12px",
                                display: "inline-block",
                                color: "red",
                              }}
                            >
                              {formik.errors.bodyType}
                            </Typography>
                          )}
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
                            Value
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
                            disabled={!formik.values.trim}
                            error={Boolean(formik.touched.price && formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                            fullWidth
                            label="Car Value"
                            name="price"
                            id="price"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={!isLoadingCar ? "" : formik.values.price}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  {loading && <CircularProgress size={20} />}
                                </InputAdornment>
                              ),
                            }}
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
                            Policy Start Date
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
                            label="Policy Start Date"
                            maxDate={new Date().setDate(new Date().getDate() + 365)}
                            minDate={new Date()}
                            onChange={(value) => {
                              formik.setFieldValue("policyEffectiveDate", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                name="policyEffectiveDate"
                                id="policyEffectiveDate"
                                fullWidth
                                {...params}
                                error={false}
                              />
                            )}
                            value={formik.values.policyEffectiveDate}
                          />

                          {formik.touched.policyEffectiveDate && formik.errors.policyEffectiveDate && (
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                fontSize: "12px",
                                display: "inline-block",
                                color: "red",
                              }}
                            >
                              {formik.errors.policyEffectiveDate}
                            </Typography>
                          )}
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
                            No. Of Passengers
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
                            ref={fieldRef}
                            error={Boolean(formik.touched.noOfPassengers && formik.errors.noOfPassengers)}
                            helperText={formik.touched.noOfPassengers && formik.errors.noOfPassengers}
                            select
                            fullWidth
                            label="No Of Passengers"
                            name="noOfPassengers"
                            id="noOfPassengers"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            SelectProps={{ native: true }}
                            value={formik.values.noOfPassengers}
                          >
                            <option value=""></option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                          </TextField>
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
                            Chassis No.
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
                            error={Boolean(formik.touched.chesisNo && formik.errors.chesisNo)}
                            helperText={formik.touched.chesisNo && formik.errors.chesisNo}
                            fullWidth
                            label="Chassis No."
                            name="chesisNo"
                            id="chesisNo"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.chesisNo}
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
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
                            Registration card TC Number
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
                            error={Boolean(formik.touched.tcNo && formik.errors.tcNo)}
                            fullWidth
                            helperText={formik.touched.tcNo && formik.errors.tcNo}
                            label="Registration card TC Number"
                            name="tcNo"
                            id="tcNo"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.tcNo}
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
                            Year of first registration
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
                            error={Boolean(formik.touched.registrationYear && formik.errors.registrationYear)}
                            helperText={formik.touched.registrationYear && formik.errors.registrationYear}
                            fullWidth
                            label="Year of first registration"
                            name="registrationYear"
                            id="registrationYear"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.registrationYear}
                          >
                            <option value=""></option>
                            {allYears?.map((year, idx) => {
                              return <option value={year}>{year}</option>;
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
                            Registration card issue date
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
                            label="Registration card issue date"
                            onChange={(value) => {
                              formik.setFieldValue("registrationDate", value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                name="registrationDate"
                                id="registrationDate"
                                fullWidth
                                {...params}
                                error={Boolean(formik.touched.registrationDate && formik.errors.registrationDate)}
                                helperText={formik.touched.registrationDate && formik.errors.registrationDate}
                              />
                            )}
                            value={formik.values.registrationDate}
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
                            Registration emirate
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
                            error={Boolean(formik.touched.registrationEmirate && formik.errors.registrationEmirate)}
                            helperText={formik.touched.registrationEmirate && formik.errors.registrationEmirate}
                            fullWidth
                            label="Registration emirate"
                            name="registrationEmirate"
                            id="registrationEmirate"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.registrationEmirate}
                          >
                            <option value=""></option>
                            {uaeStatus?.map((state, idx) => {
                              return <option value={state}>{state}</option>;
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
                            Engine Number
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
                            error={Boolean(formik.touched.engineNumber && formik.errors.engineNumber)}
                            fullWidth
                            helperText={formik.touched.engineNumber && formik.errors.engineNumber}
                            label="Engine Number"
                            name="engineNumber"
                            id="engineNumber"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.engineNumber}
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
                            Color
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
                            error={Boolean(formik.touched.color && formik.errors.color)}
                            fullWidth
                            helperText={formik.touched.color && formik.errors.color}
                            label="Color"
                            name="color"
                            id="color"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.color}
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
                            Plate Number
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
                            error={Boolean(formik.touched.plateNumber && formik.errors.plateNumber)}
                            fullWidth
                            helperText={formik.touched.plateNumber && formik.errors.plateNumber}
                            label="Plate Number"
                            name="plateNumber"
                            id="plateNumber"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.plateNumber}
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
                            Plate Code
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
                            error={Boolean(formik.touched.plateCode && formik.errors.plateCode)}
                            helperText={formik.touched.plateCode && formik.errors.plateCode}
                            fullWidth
                            label="Plate Code"
                            name="plateCode"
                            id="plateCode"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.plateCode}
                          >
                            <option value=""></option>
                            {plateCodeLatters?.map((code, idx) => {
                              return <option value={code}> {code} </option>;
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
                            Origin
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
                            error={Boolean(formik.touched.origin && formik.errors.origin)}
                            fullWidth
                            helperText={formik.touched.origin && formik.errors.origin}
                            label="Origin"
                            name="origin"
                            id="origin"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.origin}
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
                            No. Of Passengers
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
                            error={Boolean(formik.touched.noOfPassengers && formik.errors.noOfPassengers)}
                            helperText={formik.touched.noOfPassengers && formik.errors.noOfPassengers}
                            select
                            fullWidth
                            label="No Of Passengers"
                            name="noOfPassengers"
                            id="noOfPassengers"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            SelectProps={{ native: true }}
                            value={formik.values.noOfPassengers}
                          >
                            <option value=""></option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                          </TextField>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {isInsuranceExpired && (
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
            Car Images
          </Typography>

          <Grid id="expiredCarPhotos" container columnSpacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} px={{ xs: 1, md: 2 }}>
              <CarImagesForm formik={formik} />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default ProposalCreateCarDetails;
