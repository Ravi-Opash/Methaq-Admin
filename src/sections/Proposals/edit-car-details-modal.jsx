import React, { useEffect, useState } from "react";
import { useFormik, Field } from "formik";
import format from "date-fns/format";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import {
  Autocomplete,
  Box,
  Button,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import {
  EditCarDetails,
  getAllCarsList,
  getAllCarsModalList,
  getAllTrim,
  getBodies,
  getCalculateCarValue,
  getCarDetails,
  getCarYears,
  getProposalsDetailsById,
  getQuotationListByProposalId,
  reGenerateProposalByProposalId,
} from "./Action/proposalsAction";
import * as Yup from "yup";
import { formattedDateUfc } from "src/utils/Format";

function generateChassisNumber() {
  const length = 17;
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  let chassisNumber = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    chassisNumber += chars.charAt(randomIndex);
  }

  return chassisNumber;
}

const EditCarDetailsModal = ({
  handleCarEditModalClose,
  nationality,
  dateOfBirth,
  p_Id,
  isQuote,
  proposalQuotationList,
  customerQuotationDetails,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { proposalId } = router.query;

  const [open, setOpen] = React.useState(false);
  const [openModel, setOpenModel] = React.useState(false);
  const [openYear, setOpenYear] = React.useState(false);
  const [openBodyType, setOpenBodyType] = React.useState(false);
  const [openTrim, setOpenTrim] = React.useState(false);

  const [isLoadingCar, setIsLoadingCar] = useState(true);

  const { AllCarsList, proposalDetail, proposalQuotationCustomePagination } = useSelector(
    (state) => state.proposals
  );

  // console.log("AllCarsList", nationality, dateOfBirth);

  // console.log("proposalQuotationList", customerQuotationDetails);

  const [searchCar, setSearchCar] = useState([]);
  const [searchModels, setSearchedModels] = useState([]);
  const [searchTrim, setSearchTrim] = useState([]);
  const [searchYears, setSearchedYears] = useState([]);
  const [searchBodyType, setSearchBodyType] = useState([]);

  const initialValues = {
    make: proposalDetail?.car.make || "",
    model: proposalDetail?.car.model || "",
    trim: proposalDetail?.car.trim || "",
    body_type: proposalDetail?.car.bodyType || "",
    body_type_text: proposalDetail?.car.bodyType || "",
    cylinders: proposalDetail?.car.cylinders || "",
    cylinders_text: proposalDetail?.car.cylinders || "",
    year: proposalDetail?.car.year || "",
    price: proposalDetail?.car.price || "",
    regionalSpec: proposalDetail?.car.regionalSpec || "GCC",
    insuranceExpiryDate: proposalDetail?.car.insuranceExpiryDate || "",
    insuranceStartDate: proposalDetail?.car.policyEffectiveDate || "",
  };

  const handleSubmit = (values) => {
    const { cylinders_text, body_type_text, body_type } = values;

    if (!cylinders_text) {
      values.cylinders_text = values.cylinders;
    }

    if (!body_type_text) {
      values.body_type_text = body_type?.name || body_type;
    }

    let formattedExpiryDate;
    if (values.insuranceExpiryDate) {
      formattedExpiryDate = formattedDateUfc(values.insuranceExpiryDate);
    }
    let formattedStartDate;
    if (values.insuranceStartDate) {
      formattedStartDate = formattedDateUfc(values.insuranceStartDate);
    }

    let requiredFields;

    if (isQuote) {
      requiredFields = [
        "make",
        "model",
        "trim",
        "year",
        "regionalSpec",
        "body_type",
        "body_type_text",
        "cylinders_text",
        "cylinders",
        "price",
      ];
    } else {
      requiredFields = [
        "make",
        "model",
        "trim",
        "year",
        "regionalSpec",
        "body_type",
        "body_type_text",
        "cylinders_text",
        "cylinders",
        "price",
        "insuranceExpiryDate",
        "insuranceStartDate",
      ];
    }

    const allRequiredFieldsPresent = hasAllRequiredFields(values, requiredFields);

    if (!allRequiredFieldsPresent) {
      toast.error("Please fill in all the required fields");
      return;
    }

    let updatedManualCarDetails;
    if (isQuote) {
      updatedManualCarDetails = {
        make: values.make,
        model: values.model,
        trim: values.trim,
        bodyType: values.body_type_text || values.body_type,
        cylinders: values.cylinders,
        year: values.year,
        price: values.price,
        regionalSpec: values.regionalSpec,
        chesisNo: generateChassisNumber(),
      };
    } else {
      updatedManualCarDetails = {
        make: values.make,
        model: values.model,
        trim: values.trim,
        bodyType: values.body_type_text || values.body_type,
        cylinders: values.cylinders,
        year: values.year,
        price: values.price,
        regionalSpec: values.regionalSpec,
        chesisNo: generateChassisNumber(),
        insuranceExpiryDate: formattedExpiryDate,
        policyEffectiveDate: formattedStartDate,
        updateType: "proposal",
        proposalId: proposalId,
      };
    }

    dispatch(
      EditCarDetails({
        id: proposalDetail?.car?._id,
        data: updatedManualCarDetails,
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            reGenerateProposalByProposalId({
              carId: proposalDetail?.car?._id,
              userId: proposalDetail?.customer?._id,
              pId: p_Id || proposalId,
              refId:
                proposalQuotationList?.[0]?.internalRef || customerQuotationDetails?.internalRef,
            })
          )
            .unwrap()
            .then((res) => {
              // console.log("res new", res);

              if (res) {
                dispatch(
                  getQuotationListByProposalId({
                    page: proposalQuotationCustomePagination?.page,
                    size: proposalQuotationCustomePagination?.size,
                    id: res?.data?.proposalNo,
                  })
                );

                dispatch(getProposalsDetailsById({ id: res?.data?.proposalNo }));

                toast("Successfully updated and re-generated", {
                  type: "success",
                });
                if (p_Id) {
                  router.push("/quotations");
                }
              }
            })
            .catch((err) => {
              toast(err, {
                type: "error",
              });
            });

          handleCarEditModalClose();
        }
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  const hasAllRequiredFields = (data, requiredFields) => {
    for (const field of requiredFields) {
      if (!data[field]) {
        return false;
      }
    }
    return true;
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      make: Yup.string().required("Required"),
      model: Yup.string().required("Required"),
      body_type: Yup.string().required("Required"),
      trim: Yup.string().required("Required"),
      cylinders: Yup.string().required("Required"),
      year: Yup.string().required("Required"),
      price: Yup.string().required("Required"),
      regionalSpec: Yup.string().required("Required"),
      insuranceExpiryDate: !isQuote && Yup.string().required("Required"),
      insuranceStartDate: !isQuote && Yup.string().required("Required"),
    }),
    onSubmit: handleSubmit,
  });

  const carOptions = searchCar?.map((value) => {
    return value;
  });

  const modelsOptions =
    searchModels &&
    searchModels?.map((value) => {
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

  const trimOptions =
    searchTrim &&
    searchTrim?.map((value) => {
      return value;
    });

  const loading = open && carOptions?.length === 0;
  const loadingModel = openModel && modelsOptions?.length === 0;
  const loadingYear = openYear && searchYears?.length === 0;
  const loadingType = openBodyType && bodyTypeOptions?.length === 0;
  const loadingTrim = openTrim && trimOptions?.length === 0;

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

  const fetchModels = (make, year) => {
    if (!!make && !!year) {
      dispatch(getAllCarsModalList({ make: make, year: year }))
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

  const fetchYears = (make) => {
    dispatch(getCarYears({ make }))
      .unwrap()
      .then((res) => {
        // console.log(res?.data, "res");
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
        console.log(res, "res");
        setSearchBodyType(res.payload?.data);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  function roundToNearestHundred(value) {
    return Math.round(value / 100) * 100;
  }

  const getCarValueHandler = (make, modal, trim, year, nationality, dateOfBirth) => {
    // console.log("make", make);
    // console.log("modal", modal);
    // console.log("trim", trim);
    // console.log("year", year);

    setIsLoadingCar(true);

    if (make && modal && trim && year && nationality && dateOfBirth) {
      let data = {
        make: make,
        model: modal,
        trim: trim,
        year: year.name ? year.name : year,
        nationality: nationality,
        dateOfBirth: dateOfBirth,
      };
      setIsLoadingCar(false);
      dispatch(getCalculateCarValue(data))
        .unwrap()
        .then((res) => {
          // console.log("ressss", res);

          formik.setFieldValue("price", roundToNearestHundred(res?.data?.predicted_price));
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        })
        .finally(() => {
          setIsLoadingCar(true);
        });
    }
  };

  const fetchBodyTypesandCylinders = (make, model, trim, year) => {
    dispatch(getCarDetails({ make: make, model: model, trim: trim, year: year }))
      .unwrap()
      .then((res) => {
        formik.setFieldValue("cylinders", res?.data?.cylinders ? res?.data?.cylinders : "4");
        formik.setFieldValue("cylinders_text", res?.data?.cylinders);

        const bodyType = searchBodyType.find(
          (body) => body?.name.toLowerCase() === res?.data?.type.toLowerCase()
        );

        // console.log(bodyType, res?.data?.type, "bodyType");

        if (bodyType) {
          formik.setFieldValue("body_type_text", res?.data?.type);
          formik.setFieldValue("body_type", bodyType?.name);
        }
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  const fetchTrims = (make, year, model) => {
    dispatch(getAllTrim({ make: make, year: year, model: model }))
      .unwrap()
      .then((res) => {
        setSearchTrim(res.data);
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
    fetchBodyTypes();
    // dispatch(clearFinalData());
  }, []);

  useEffect(() => {
    if (formik.values.make) {
      fetchYears(formik.values.make);
    }

    if (formik.values.make && formik.values.year) {
      fetchModels(formik.values.make, formik.values.year);
    }

    if (formik.values.make && formik.values.year && formik.values.model) {
      fetchTrims(formik.values.make, formik.values.year, formik.values.model);
    }
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <CardHeader title="Edit car details" sx={{ p: 0, mb: 2 }} />
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              id="make"
              options={carOptions}
              loading={loading}
              value={formik.values.make}
              onChange={(e, value) => {
                formik.setFieldValue("make", value);
                formik.setFieldValue("year", "");
                formik.setFieldValue("model", "");
                formik.setFieldValue("trim", "");
                formik.setFieldValue("body_type", "");
                formik.setFieldValue("body_type_text", "");
                formik.setFieldValue("cylinders_text", "");
                formik.setFieldValue("cylinders", "");

                // getCarValueHandler(
                //   value,
                //   formik.values.model,
                //   formik.values.trim,
                //   formik.values.year
                // );
                fetchYears(value);

                if (!value) {
                  formik.setFieldValue("make", "");
                }
              }}
              ListboxProps={{ style: { maxHeight: 250 } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Car Brand"
                  error={Boolean(formik.touched.make && formik.errors.make)}
                  helperText={formik.touched.make && formik.errors.make}
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

          <Grid item xs={12}>
            <Autocomplete
              id="year"
              options={searchYears}
              loading={loadingYear}
              value={formik.values.year}
              onChange={(e, value) => {
                formik.setFieldValue("year", value);
                fetchModels(formik.values.make, value);
                formik.setFieldValue("model", "");
                formik.setFieldValue("trim", "");
                formik.setFieldValue("bidy_type", "");
                formik.setFieldValue("cylinder", "");
                formik.setFieldValue("price", "");
                // getCarValueHandler(
                //   formik.values.make,
                //   formik.values.model,
                //   formik.values.trim,
                //   value
                // );

                if (!value) {
                  formik.setFieldValue("year", "");
                }
              }}
              ListboxProps={{ style: { maxHeight: 250 } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Car Year"
                  error={Boolean(formik.touched.year && formik.errors.year)}
                  helperText={formik.touched.year && formik.errors.year}
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

          <Grid item xs={12}>
            <Autocomplete
              id="model"
              options={searchModels}
              loading={loadingModel}
              value={formik.values.model}
              onChange={(e, value) => {
                fetchTrims(formik.values.make, formik.values.year, value);

                // getCarValueHandler(
                //   formik.values.make,
                //   value,
                //   formik.values.trim,
                //   formik.values.year
                // );

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
                  error={Boolean(formik.touched.model && formik.errors.model)}
                  helperText={formik.touched.model && formik.errors.model}
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

          <Grid item xs={12}>
            <Autocomplete
              id="trim"
              options={trimOptions}
              loading={loadingTrim}
              value={formik.values.trim}
              onChange={(e, value) => {
                if (!value) {
                  formik.setFieldValue("body_type", "");
                  formik.setFieldValue("body_type_text", "");
                  formik.setFieldValue("cylinders_text", "");
                  formik.setFieldValue("cylinders", "");
                  return;
                }
                fetchBodyTypesandCylinders(
                  formik.values.make,
                  formik.values.model,
                  value,
                  formik.values.year
                );
                formik.setFieldValue("trim", value);

                getCarValueHandler(
                  formik.values.make,
                  formik.values.model,
                  value,
                  formik.values.year,
                  nationality,
                  dateOfBirth
                );
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
                    error={Boolean(formik.touched.body_type && formik.errors.body_type)}
                    helperText={formik.touched.body_type && formik.errors.body_type}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingType ? <CircularProgress color="inherit" size={20} /> : null}
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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

          <Grid item xs={12}>
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

          <Grid item xs={12}>
            <TextField
              error={Boolean(formik.touched.price && formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              type="text"
              fullWidth
              label="Car Value"
              name="price"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.price}
            ></TextField>
          </Grid>

          {!isQuote && (
            <Grid item xs={12}>
              <DatePicker
                inputFormat="dd-MM-yyyy"
                label="Policy Start Date"
                onChange={(value) => {
                  if (value == "Invalid Date" || value === null) {
                    formik.setFieldValue("insuranceStartDate", "");
                  } else {
                    formik.setFieldValue("insuranceStartDate", format(value, "dd-MM-yyyy"));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    name="insuranceStartDate"
                    fullWidth
                    {...params}
                    error={Boolean(
                      formik.touched.insuranceStartDate && formik.errors.insuranceStartDate
                    )}
                    helperText={
                      formik.touched.insuranceStartDate && formik.errors.insuranceStartDate
                    }
                  />
                )}
                value={formik.values.insuranceStartDate || ""}
              />
            </Grid>
          )}
          {!isQuote && (
            <Grid item xs={12}>
              <DatePicker
                inputFormat="dd-MM-yyyy"
                label="Insurance Expiry Date"
                onChange={(value) => {
                  // console.log(value, "value");
                  if (value == "Invalid Date" || value === null) {
                    formik.setFieldValue("insuranceExpiryDate", "");
                  } else {
                    formik.setFieldValue("insuranceExpiryDate", format(value, "dd-MM-yyyy"));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    name="insuranceExpiryDate"
                    fullWidth
                    {...params}
                    error={Boolean(
                      formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate
                    )}
                    helperText={
                      formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate
                    }
                  />
                )}
                value={formik.values.insuranceExpiryDate}
              />
            </Grid>
          )}
        </Grid>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button
            // disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
          >
            Update
          </Button>

          <Button variant="outlined" type="button" onClick={() => handleCarEditModalClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default EditCarDetailsModal;
