import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import format from "date-fns/format";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Image from "next/image";
import {
  getAllCarsList,
  getAllCarsModalList,
  getAllTrim,
  getBodies,
  getCarDetails,
  getCarYears,
} from "./Action/proposalsAction";

const Img = styled(Image)(({ theme }) => ({
  width: "100% !important",
  objectFit: "cover",
  height: "100% !important",
}));

const CreateProposalForm = (props) => {
  // const {
  //   carOptions,
  //   trimOptions,
  //   loading,
  //   searchModels,
  //   loadingModel,
  //   fetchTrims,
  //   fetchModels,
  //   loadingTrim,
  // } = props;

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openTrim, setOpenTrim] = useState(false);
  const [openBodyType, setOpenBodyType] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  const [searchCar, setSearchCar] = useState([]);
  const [searchYears, setSearchedYears] = useState([]);
  const [searchModels, setSearchedModels] = useState([]);
  const [searchTrim, setSearchTrim] = useState([]);
  const [searchBodyType, setSearchBodyType] = useState([]);

  const carOptions = searchCar?.map((value) => {
    return value;
  });

  const modelsOptions =
    searchModels &&
    searchModels?.map((value) => {
      return value;
    });

  const trimOptions =
    searchTrim &&
    searchTrim?.map((value) => {
      return value;
    });

  const bodyTypeOptions =
    searchBodyType &&
    (searchBodyType || [])?.map((value) => {
      return {
        name: value.name,
        id: value._id,
        label: value.name,
        value: value._id,
      };
    });

  const yearsOptions =
    searchYears &&
    searchYears?.map((value) => {
      return {
        name: value.name,
        id: value._id,
        label: value.name,
        value: value._id,
      };
    });

  const loading = open && carOptions?.length === 0;
  const loadingModel = openModel && modelsOptions?.length === 0;
  const loadingTrim = openTrim && trimOptions?.length === 0;
  const loadingType = openBodyType && bodyTypeOptions?.length === 0;
  const loadingYear = openYear && yearsOptions?.length === 0;

  const searchCars = () => {
    dispatch(getAllCarsList({}))
      .unwrap()
      .then((res) => {
        setSearchCar(res?.data);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        console.error(err);
      });
  };

  const fetchYears = () => {
    dispatch(getCarYears({}))
      .unwrap()
      .then((res) => {
        setSearchedYears(res?.data);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  const fetchBodyTypes = () => {
    dispatch(getBodies({}))
      .then((res) => {
        setSearchBodyType(res.payload?.data);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  useEffect(() => {
    searchCars();
    fetchYears();
    fetchBodyTypes();
  }, []);

  const fetchModels = (value) => {
    if (!!value) {
      dispatch(getAllCarsModalList({ make: value }))
        .unwrap()
        .then((res) => {
          setSearchedModels(res?.data);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
  };

  const fetchTrims = (make, model) => {
    dispatch(getAllTrim({ make: make, model: model }))
      .unwrap()
      .then((res) => {
        setSearchTrim(res.data);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  const formik = useFormik({
    initialValues: {
      emiratesId: null, // Add the image-upload field with initial value as null
      drivingLicense: null,
      registrationCard: null,
      // card details
      make: "",
      model: "",
      trim: "",
      body_type: "",
      body_type_text: "",
      cylinders: "4",
      cylinders_text: "",
      year: "",
      price: "",
      regionalSpec: "GCC",
      // customer details
      fullName: "",
      email: "",
      mobileNumber: "",
      licenceNo: "",
      nationality: "",
      dateOfBirth: "",
      licenceIssueDate: "",
      licenceExpiryDate: "",
    },

    validationSchema: Yup.object({}),

    onSubmit: async (values, helpers) => {
      // console.log("values", values);
    },
  });

  const [uploadEmiratesId, setUploadEmiratesId] = useState(null);
  const uploadEmiratesIdHandler = (event) => {
    const file = event.target.files[0];
    setUploadEmiratesId(URL.createObjectURL(file));
  };

  const [uploadDrivingLicense, setUploadDrivingLicense] = useState(null);
  const uploadDrivingLicenseHandler = (event) => {
    const file = event.target.files[0];
    setUploadDrivingLicense(URL.createObjectURL(file));
  };

  const [uploadRegistrationCard, setUploadRegistrationCard] = useState(null);
  const uploadRegistrationCardHandler = (event) => {
    const file = event.target.files[0];
    setUploadRegistrationCard(URL.createObjectURL(file));
  };

  const fetchBodyTypesandCylinders = (make, model, trim) => {
    dispatch(getCarDetails({ make: make, model: model, trim: trim }))
      .unwrap()
      .then((res) => {
        formik.setFieldValue("cylinders", res?.data?.cylinders ? res?.data?.cylinders : "");
        formik.setFieldValue("cylinders_text", res?.data?.cylinders);

        const bodyType = searchBodyType.find(
          (body) => body?.name.toLowerCase() === res?.data?.bodyType.toLowerCase()
        );

        if (bodyType) {
          formik.setFieldValue("body_type_text", res?.data?.bodyType);
          formik.setFieldValue("body_type", {
            name: bodyType?.name,
            id: bodyType?._id,
            label: bodyType?.name,
            value: bodyType?._id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          {/* <CardHeader title="Create Proposals" /> */}
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <Box
                  sx={{
                    textAlign: "left",
                    border: "1px solid #E6E6E6",
                    width: "100%",
                    height: "180px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {uploadEmiratesId ? (
                    <>
                      <Img src={uploadEmiratesId} alt="Preview" width={100} height={100} />
                    </>
                  ) : (
                    <IconButton
                      color="#707070"
                      backgroundColor="none"
                      aria-label="upload picture"
                      component="label"
                      disableRipple
                      sx={{
                        flexDirection: "column",
                        cursor: "pointer",
                        gap: 3,
                        "&:hover": {
                          background: "none",
                        },
                      }}
                    >
                      <input
                        accept="image/*"
                        id="emiratesId"
                        type="file"
                        onChange={(event) => {
                          formik.setFieldValue("emiratesId", event.currentTarget.files[0]),
                            uploadEmiratesIdHandler(event);
                        }}
                        style={{ display: "none" }}
                      />

                      <Box
                        sx={{
                          width: "48px",
                          height: "48px",
                          opacity: 1,
                          border: "1px solid #E6E6E6",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "0.50rem",
                        }}
                      >
                        +
                      </Box>

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          color: "#707070",
                          fontSize: {
                            xs: "11px",
                            sm: "14px",
                            lg: "16px",
                          },
                          lineHeight: {
                            xs: "13px",
                            sm: "16px",
                            lg: "19px",
                          },
                          fontWeight: "400",
                          textAlign: "center",
                        }}
                      >
                        Upload Emirates Id
                      </Typography>
                    </IconButton>
                  )}
                </Box>

                {uploadEmiratesId && (
                  <Typography
                    variant="subtitle2"
                    aria-label="upload picture"
                    component="label"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: "12px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      mt: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    Upload new
                    <input
                      accept="image/*"
                      id="emiratesId"
                      type="file"
                      onChange={(event) => {
                        formik.setFieldValue("emiratesId", event.currentTarget.files[0]),
                          uploadEmiratesIdHandler(event);
                      }}
                      style={{ display: "none" }}
                    />
                  </Typography>
                )}
              </Grid>

              <Grid item md={4} xs={12}>
                <Box
                  sx={{
                    textAlign: "left",
                    border: "1px solid #E6E6E6",
                    width: "100%",
                    height: "180px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {uploadDrivingLicense ? (
                    <>
                      <Img src={uploadDrivingLicense} alt="Preview" width={100} height={100} />
                    </>
                  ) : (
                    <IconButton
                      color="#707070"
                      backgroundColor="none"
                      aria-label="upload driving license"
                      component="label"
                      disableRipple
                      sx={{
                        flexDirection: "column",
                        cursor: "pointer",
                        gap: 3,
                        "&:hover": {
                          background: "none",
                        },
                      }}
                    >
                      <input
                        accept="image/*"
                        id="drivingLicense"
                        type="file"
                        onChange={(event) => {
                          formik.setFieldValue("drivingLicense", event.currentTarget.files[0]),
                            uploadDrivingLicenseHandler(event);
                        }}
                        style={{ display: "none" }}
                      />

                      <Box
                        sx={{
                          width: "48px",
                          height: "48px",
                          opacity: 1,
                          border: "1px solid #E6E6E6",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "0.50rem",
                        }}
                      >
                        +
                      </Box>

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          color: "#707070",
                          fontSize: {
                            xs: "11px",
                            sm: "14px",
                            lg: "16px",
                          },
                          lineHeight: {
                            xs: "13px",
                            sm: "16px",
                            lg: "19px",
                          },
                          fontWeight: "400",
                          textAlign: "center",
                        }}
                      >
                        Upload Driving License
                      </Typography>
                    </IconButton>
                  )}
                </Box>

                {uploadDrivingLicense && (
                  <Typography
                    variant="subtitle2"
                    aria-label="upload driving license"
                    component="label"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: "12px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      mt: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    Upload new
                    <input
                      accept="image/*"
                      id="drivingLicense"
                      type="file"
                      onChange={(event) => {
                        formik.setFieldValue("drivingLicense", event.currentTarget.files[0]),
                          uploadDrivingLicenseHandler(event);
                      }}
                      style={{ display: "none" }}
                    />
                  </Typography>
                )}
              </Grid>

              <Grid item md={4} xs={12}>
                <Box
                  sx={{
                    textAlign: "left",
                    border: "1px solid #E6E6E6",
                    width: "100%",
                    height: "180px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {uploadRegistrationCard ? (
                    <>
                      <Img src={uploadRegistrationCard} alt="Preview" width={100} height={100} />
                    </>
                  ) : (
                    <IconButton
                      color="#707070"
                      backgroundColor="none"
                      aria-label="upload registration card"
                      component="label"
                      disableRipple
                      sx={{
                        flexDirection: "column",
                        cursor: "pointer",
                        gap: 3,
                        "&:hover": {
                          background: "none",
                        },
                      }}
                    >
                      <input
                        accept="image/*"
                        id="registrationCard"
                        type="file"
                        onChange={(event) => {
                          formik.setFieldValue("registrationCard", event.currentTarget.files[0]),
                            uploadRegistrationCardHandler(event);
                        }}
                        style={{ display: "none" }}
                      />

                      <Box
                        sx={{
                          width: "48px",
                          height: "48px",
                          opacity: 1,
                          border: "1px solid #E6E6E6",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "0.50rem",
                        }}
                      >
                        +
                      </Box>

                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          color: "#707070",
                          fontSize: {
                            xs: "11px",
                            sm: "14px",
                            lg: "16px",
                          },
                          lineHeight: {
                            xs: "13px",
                            sm: "16px",
                            lg: "19px",
                          },
                          fontWeight: "400",
                          textAlign: "center",
                        }}
                      >
                        Upload Registration Card
                      </Typography>
                    </IconButton>
                  )}
                </Box>

                {uploadRegistrationCard && (
                  <Typography
                    variant="subtitle2"
                    aria-label="upload registration card"
                    component="label"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: "12px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      mt: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    Upload new
                    <input
                      accept="image/*"
                      id="registrationCard"
                      type="file"
                      onChange={(event) => {
                        formik.setFieldValue("registrationCard", event.currentTarget.files[0]),
                          uploadRegistrationCardHandler(event);
                      }}
                      style={{ display: "none" }}
                    />
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Box sx={{ display: "inline-block", width: "100%", my: 2 }}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="make"
                    options={carOptions}
                    loading={loading}
                    value={formik.values.make}
                    onChange={(e, value) => {
                      fetchModels(value);
                      formik.setFieldValue("make", value);
                      formik.setFieldValue("model", "");
                      formik.setFieldValue("trim", "");
                      formik.setFieldValue("body_type", "");
                      formik.setFieldValue("body_type_text", "");
                      formik.setFieldValue("cylinders_text", "");
                      formik.setFieldValue("cylinders", "");

                      if (!value) {
                        formik.setFieldValue("make", "");
                      }
                    }}
                    ListboxProps={{ style: { maxHeight: 250 } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Car Brand"
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
                </Grid>

                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="model"
                    options={searchModels}
                    loading={loadingModel}
                    value={formik.values.model}
                    onChange={(e, value) => {
                      fetchTrims(formik.values.make, value);
                      formik.setFieldValue("model", value);
                      formik.setFieldValue("trim", "");
                      formik.setFieldValue("body_type", "");
                      formik.setFieldValue("body_type_text", "");
                      formik.setFieldValue("cylinders_text", "");
                      formik.setFieldValue("cylinders", "");
                      if (!value) {
                        formik.setFieldValue("model", "");
                      }
                    }}
                    ListboxProps={{ style: { maxHeight: 250 } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Car Model"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingModel ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="trim"
                    options={trimOptions}
                    loading={loadingTrim}
                    value={formik.values.trim}
                    onChange={(e, value) => {
                      fetchBodyTypesandCylinders(formik.values.make, formik.values.model, value);
                      formik.setFieldValue("trim", value);
                      if (!value) {
                        formik.setFieldValue("body_type", "");
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
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingModel ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {!!formik.values.body_type_text && (
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(formik.touched.body_type_text && formik.errors.body_type_text)}
                      fullWidth
                      helperText={formik.touched.body_type_text && formik.errors.body_type_text}
                      label="Body Type"
                      name="body_type_text"
                      disabled
                      value={formik.values.body_type_text}
                    />
                  </Grid>
                )}

                {!formik.values.body_type_text && (
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="body_type"
                      options={bodyTypeOptions}
                      loading={loadingType}
                      value={formik?.values?.body_type}
                      onChange={(e, value) => {
                        formik.setFieldValue("body_type", value);
                      }}
                      ListboxProps={{ style: { maxHeight: 250 } }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Body Type"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingType ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                )}

                {!!formik.values.cylinders_text && (
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(formik.touched.cylinders_text && formik.errors.cylinders_text)}
                      fullWidth
                      helperText={formik.touched.cylinders_text && formik.errors.cylinders_text}
                      label="Cylinders"
                      name="cylinders_text"
                      disabled
                      value={formik.values.cylinders_text}
                    />
                  </Grid>
                )}

                {!formik.values.cylinders_text && (
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(formik.touched.cylinders && formik.errors.cylinders)}
                      helperText={formik.touched.cylinders && formik.errors.cylinders}
                      fullWidth
                      label="Cylinders"
                      name="cylinders"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={formik.values.cylinders}
                    >
                      <option value="4">4</option>
                      <option value="6">6</option>
                      <option value="8">8</option>
                      <option value="9">9+</option>
                    </TextField>
                  </Grid>
                )}

                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="year"
                    options={yearsOptions}
                    loading={loadingYear}
                    value={formik.values.year}
                    onChange={(e, value) => {
                      formik.setFieldValue("year", value);
                      if (!value) {
                        formik.setFieldValue("year", "");
                      }
                    }}
                    ListboxProps={{ style: { maxHeight: 250 } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Car Year"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingYear ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.regionalSpec && formik.errors.regionalSpec)}
                    helperText={formik.touched.regionalSpec && formik.errors.regionalSpec}
                    fullWidth
                    label="Regional Specs"
                    name="regionalSpec"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.regionalSpec}
                  >
                    <option value="GCC">GCC</option>
                    <option value="Non-GCC">Non-GCC</option>
                  </TextField>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.price && formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    type="number"
                    fullWidth
                    label="Car Value"
                    name="price"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.price}
                  ></TextField>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                    fullWidth
                    helperText={formik.touched.fullName && formik.errors.fullName}
                    label="Full name"
                    name="fullName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.fullName}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type="email"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.mobileNumber && formik.errors.mobileNumber)}
                    fullWidth
                    helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                    label="Phone number"
                    name="mobileNumber"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.mobileNumber}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    //   error={Boolean(formik.touched.licenceNo && formik.errors.licenceNo)}
                    //   helperText={formik.touched.licenceNo && formik.errors.licenceNo}
                    label="Licence no"
                    name="licenceNo"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.licenceNo}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    //   error={Boolean(formik.touched.nationality && formik.errors.nationality)}
                    //   helperText={formik.touched.nationality && formik.errors.nationality}
                    label="Nationality"
                    name="nationality"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.nationality}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <DatePicker
                    inputFormat="dd-MM-yyyy"
                    label="Date Of Birth"
                    onChange={(value) =>
                      formik.setFieldValue("dateOfBirth", format(value, "dd-MM-yyyy"))
                    }
                    renderInput={(params) => (
                      <TextField name="dateOfBirth" fullWidth {...params} error={false} />
                    )}
                    value={formik.values.dateOfBirth}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <DatePicker
                    inputFormat="dd-MM-yyyy"
                    label="Licence Issue Date"
                    onChange={(value) =>
                      formik.setFieldValue("licenceIssueDate", format(value, "dd-MM-yyyy"))
                    }
                    renderInput={(params) => (
                      <TextField name="licenceIssueDate" fullWidth {...params} error={false} />
                    )}
                    value={formik.values.licenceIssueDate}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <DatePicker
                    inputFormat="dd-MM-yyyy"
                    label="Licence Expiry Date"
                    onChange={(value) =>
                      formik.setFieldValue("licenceExpiryDate", format(value, "dd-MM-yyyy"))
                    }
                    renderInput={(params) => (
                      <TextField name="licenceExpiryDate" fullWidth {...params} error={false} />
                    )}
                    value={formik.values.licenceExpiryDate}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>

          <CardActions
            sx={{
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Button disabled={formik.isSubmitting} type="submit" variant="contained">
              Create
            </Button>
            <NextLink href={`/proposals`} passHref>
              <Button
                component="a"
                disabled={formik.isSubmitting}
                sx={{
                  m: 1,
                  mr: "auto",
                }}
                variant="outlined"
              >
                Cancel
              </Button>
            </NextLink>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default CreateProposalForm;
