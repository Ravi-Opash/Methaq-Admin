import {
  Autocomplete,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCarsList,
  getAllCarsModalList,
  getAllTrim,
  getBodies,
  getCarDetails,
  getCarYears,
  getNationalities,
  getSalesAgentList,
} from "src/sections/Proposals/Action/proposalsAction";
import { toast } from "react-toastify";
import { addManualFleetCar, getAllMotorFleetList } from "./Action/motorFleetProposalsAction";
const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: 13,
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: 14,
  },
}));
const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

const plateCodeLatters = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "50",
  "AA",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "K",
  "M",
  "N",
  "P",
  "R",
  "S",
  "T",
  "V",
  "X",
  "Y",
];

function MotorFleetAddMotorDetails({
  setLoading,
  HandlePersonalModalClose,
  landInfo,
  fetchSummary,
  handleClose,
  fleetDetail,
}) {
  const router = useRouter();
  const { proposalId } = router.query;
  const dispatch = useDispatch();
  const [searchCar, setSearchCar] = useState([]);
  const [searchYears, setSearchedYears] = useState([]);
  const [searchModels, setSearchedModels] = useState([]);
  const [searchTrim, setSearchTrim] = useState([]);
  const [searchBodyType, setSearchBodyType] = useState([]);
  const [salesAgentlist, setSalesAgentlist] = useState([]);
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading } = useSelector((state) => state.proposals);
  const carOptions = searchCar?.map((value, idx) => {
    return value;
  });

  const modelsOptions =
    searchModels &&
    searchModels?.map((value, idx) => {
      return value;
    });

  const trimOptions =
    searchTrim &&
    searchTrim?.map((value, idx) => {
      return value;
    });

  const bodyTypeOptions =
    searchBodyType &&
    (searchBodyType || [])?.map((value, idx) => {
      return {
        name: value.name,
        id: value._id,
        label: value.name,
        value: value._id,
      };
    });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // card details
      make: "",
      model: "",
      trim: "",
      year: "",
      bodyType: "",
      chesisNo: "",
      engineNumber: "",
      color: "",
      plateNumber: "",
      plateCode: "",
      dinVal: "",
    },

    validationSchema: Yup.object({
      make: Yup.string().required("Required"),
      model: Yup.string().required("Required"),
      trim: Yup.string().required("Required"),
      year: Yup.string().required("Required"),
      chesisNo: Yup.string().required("Required"),
      engineNumber: Yup.string().required("Required"),
      color: Yup.string().required("Required"),
      plateNumber: Yup.string().required("Required"),
      plateCode: Yup.string().required("Required"),
      dinVal: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      setIsLoading(true);
      dispatch(addManualFleetCar({ id: proposalId, data: values }))
        .unwrap()
        .then((res) => {
          toast.success("Car details added successfully");
          dispatch(getAllMotorFleetList({ id: fleetDetail?._id }));
          // HandlePersonalModalClose();
          handleClose(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
          setIsLoading(false);
        });
    },
  });

  const searchCars = (year) => {
    dispatch(getAllCarsList({ year }))
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

  const fetchSalesAgentList = () => {
    dispatch(getSalesAgentList({}))
      .unwrap()
      .then((res) => {
        setSalesAgentlist(res?.data);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  const searchNationalities = () => {
    dispatch(getNationalities({}))
      .unwrap()
      .then((res) => {
        setNationalityOptions(res.data);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        console.error(err);
      });
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    fetchYears();
    searchNationalities();
    fetchBodyTypes();
    fetchSalesAgentList();
  }, []);

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

  const fetchTrims = (make, year, model) => {
    dispatch(getAllTrim({ make: make, year: year, model: model }))
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

  const fetchBodyTypesandCylinders = (make, model, trim, year, regionalSpec) => {
    dispatch(getCarDetails({ make: make, model: model, trim: trim, year: year }))
      .unwrap()
      .then((res) => {
        formik.setFieldValue("cylinders", res?.data?.cylinders ? res?.data?.cylinders : "");
        formik.setFieldValue("cylinders_text", res?.data?.cylinders);

        formik.setFieldValue("bodyType", res?.data?.bodyType);

        if (res?.data?.noOfPassengers) {
          formik.setFieldValue("noOfPassengers", res?.data?.noOfPassengers);
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
    <div>
      {" "}
      {isLoading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={isLoading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "inline-block", width: "100%" }}>
          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            <Box sx={{ display: "inline-block", width: "100%" }}>
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
                    color: "#60176F",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: "14px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  Add Car Details
                </Typography>
                <Box sx={{ p: 1, px: 2 }}>
                  <Grid container sx={{ mt: 2 }}>
                    <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
                      <Grid container spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <Autocomplete
                                id="year"
                                options={searchYears}
                                loading={searchYears?.length == 0}
                                value={formik.values.year}
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
                                    label="Car Year"
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <React.Fragment>
                                          {searchYears?.length == 0 ? (
                                            <CircularProgress color="inherit" size={20} />
                                          ) : null}
                                          {params.InputProps.endAdornment}
                                        </React.Fragment>
                                      ),
                                    }}
                                  />
                                )}
                              />

                              {formik.touched.year && formik.errors.year && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontSize: "12px",
                                    display: "inline-block",
                                    color: "red",
                                  }}
                                >
                                  {formik.errors.year}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <Autocomplete
                                id="make"
                                options={carOptions}
                                loading={formik.values.year && carOptions?.length == 0}
                                value={formik.values.make}
                                disabled={!formik.values.year}
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

                              {formik.touched.make && formik.errors.make && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontSize: "12px",
                                    display: "inline-block",
                                    color: "red",
                                  }}
                                >
                                  {formik.errors.make}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <Autocomplete
                                id="model"
                                disabled={!formik.values.make}
                                options={searchModels}
                                loading={formik.values.make && searchModels?.length == 0}
                                value={formik.values.model}
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
                                    // error={Boolean(formik.touched.model && formik.errors.model)}
                                    // helperText={formik.touched.model && formik.errors.model}
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

                              {formik.touched.model && formik.errors.model && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontSize: "12px",
                                    display: "inline-block",
                                    color: "red",
                                  }}
                                >
                                  {formik.errors.model}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <Autocomplete
                                id="trim"
                                disabled={!formik.values.model}
                                options={trimOptions}
                                loading={formik.values.model && trimOptions?.length == 0}
                                value={formik.values.trim}
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
                                    // error={Boolean(formik.touched.trim && formik.errors.trim)}
                                    // helperText={formik.touched.trim && formik.errors.trim}
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

                              {formik.touched.trim && formik.errors.trim && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontSize: "12px",
                                    display: "inline-block",
                                    color: "red",
                                  }}
                                >
                                  {formik.errors.trim}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <Autocomplete
                                id="bodyType"
                                disabled
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
                                    // error={Boolean(formik.touched.bodyType && formik.errors.bodyType)}
                                    // helperText={formik.touched.bodyType && formik.errors.bodyType}
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
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.chesisNo && formik.errors.chesisNo)}
                                helperText={formik.touched.chesisNo && formik.errors.chesisNo}
                                fullWidth
                                label="Chassis No."
                                name="chesisNo"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.chesisNo}
                                inputProps={{
                                  style: { textTransform: "uppercase" },
                                }}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.engineNumber && formik.errors.engineNumber)}
                                fullWidth
                                helperText={formik.touched.engineNumber && formik.errors.engineNumber}
                                label="Engine Number"
                                name="engineNumber"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.engineNumber}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.color && formik.errors.color)}
                                fullWidth
                                helperText={formik.touched.color && formik.errors.color}
                                label="Color"
                                name="color"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.color}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.plateNumber && formik.errors.plateNumber)}
                                fullWidth
                                helperText={formik.touched.plateNumber && formik.errors.plateNumber}
                                label="Plate Number"
                                name="plateNumber"
                                onWheel={(e) => e.target.blur()}
                                type="number"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.plateNumber}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.plateCode && formik.errors.plateCode)}
                                helperText={formik.touched.plateCode && formik.errors.plateCode}
                                fullWidth
                                label="Plate Code"
                                name="plateCode"
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
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.dinVal && formik.errors.dinVal)}
                                fullWidth
                                helperText={formik.touched.dinVal && formik.errors.dinVal}
                                label="DIN Value"
                                name="dinVal"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.dinVal}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <CardActions
          sx={{
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "end",
          }}
        >
          <Button disabled={formik.isSubmitting} type="submit" variant="contained">
            Submit
          </Button>
          <Button
            onClick={() => handleClose(true)}
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
        </CardActions>
      </form>
    </div>
  );
}

export default MotorFleetAddMotorDetails;
