import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import FormGroup from "@mui/material/FormGroup";
import { useRouter } from "next/router";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { Formik, Field, Form, FormikProvider } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { FileDropzone } from "src/components/file-dropzone";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { toast } from "react-toastify";
import {
  addNewMatrix,
  getMatrixBenefits,
  updateMatrixById,
  getMatrixbyMatrixId,
} from "../action/companyAcrion";
// import BenifitsDetails from "src/pages/benifits/[benifitsId]";

const MatrixEditForm = () => {
  const dispatch = useDispatch();
  const { matrixDetail, benefitsDetail } = useSelector((state) => state.company);
  const router = useRouter();
  const { companyId, matrixId } = router.query;
  const [newUploadFile, setnewUploadFile] = useState(null);
  const [selectAll, setSelectAll] = useState(true); // Set selectAll to true initially
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [selectedOptions, setSelectedOptions] = useState([]);
  // React.useEffect(() => {
  //   dispatch(getMatrixBenefits());
  // }, []);

  useEffect(() => {
    if (matrixId) {
      dispatch(getMatrixbyMatrixId(matrixId))
        .unwrap()
        .then((res) => {
          setSelectedOptions(res.data.benefits);
        })
        .catch((err) => {
          // Handle error
        });
    } else if (benefitsDetail) {
      const allBenefitIds = benefitsDetail.map((benefit) => benefit._id);
      // console.log(allBenefitIds)
      setSelectedOptions(allBenefitIds);
    }
  }, [benefitsDetail, matrixId]);

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all benefits
      setSelectedOptions([]);
    } else {
      // Select all benefits
      const allBenefitIds = benefitsDetail.map((benefit) => benefit._id);
      setSelectedOptions(allBenefitIds);
    }
    setSelectAll(!selectAll);
  };

  const handleChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, value]);
    } else {
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.filter((option) => option !== value)
      );
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, value]);
    } else {
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.filter((option) => option !== value)
      );
    }
    // if (!matrixId || selectedOptions.includes(value)) {
    //     handleChange(event);
    // }
    // else {
    //     const { value } = event.target;
    //         setSelectedOptions([value]);
    // }
    // If no checkboxes are selected, reselect the first checkbox
    // if (selectedOptions.length === 0) {
    //     const { value } = event.target;
    //     setSelectedOptions([value]);
    // }
  };
  // const isAllOptionsSelected = selectedOptions.length === benefitsDetail?.length;
  // console.log(selectedOptions)

  const validationSchema = Yup.object().shape({
    insuranceType: Yup.string().required("InsuranceType is required"),
    vehicleType: Yup.string().required("Vehicle Type is required"),
    vehicleValuationFrom: Yup.string().when("insuranceType", {
      is: (insType) => {
        return insType === "comprehensive";
      },
      then: () => Yup.string().required("vehicleValuationFrom is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    vehicleValuationTo: Yup.string().when("insuranceType", {
      is: (insType) => {
        return insType === "comprehensive";
      },
      then: () => Yup.string().required("vehicleValuationTo is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    minimumPremium: Yup.string().required("Minimum Premium is required"),
    noOfCylinders: Yup.string().when("insuranceType", {
      is: (insType) => {
        return insType === "thirdparty";
      },
      then: () => Yup.string().required("noOfCylinders is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    repairCondition: Yup.string().when("insuranceType", {
      is: (insType) => {
        return insType === "comprehensive";
      },
      then: () =>
        Yup.string()
          .oneOf(["agency", "nonagency"], "invalid")
          .required("repairCondition is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    rateInPercentage: Yup.string().when("insuranceType", {
      is: (insType) => {
        return insType === "comprehensive";
      },
      then: () => Yup.string().required("rateInPercentage is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    // benefits: Yup.array().required("benefits is required"),
    carAge: Yup.string().when("insuranceType", {
      is: (insType) => {
        return insType === "comprehensive";
      },
      then: () => Yup.string().required("Car age is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
  });

  const initialValues = {
    companyId: companyId ? companyId : "",
    insuranceType: matrixDetail ? matrixDetail?.insuranceType : "comprehensive",
    vehicleType: matrixDetail ? matrixDetail?.vehicleType : "coupe",
    vehicleValuationFrom: matrixDetail ? matrixDetail?.vehicleValuationFrom : "",
    vehicleValuationTo: matrixDetail ? matrixDetail?.vehicleValuationTo : "",
    minimumPremium: matrixDetail ? matrixDetail?.minimumPremium : "",
    noOfCylinders: matrixDetail ? matrixDetail?.noOfCylinders : "4",
    repairCondition: matrixDetail ? matrixDetail?.repairCondition : "agency",
    rateInPercentage: matrixDetail ? matrixDetail?.rateInPercentage : "",
    carAge: matrixDetail ? matrixDetail?.carAge : "",
    // benefits: [],
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,

    onSubmit: (values, helpers) => {
      // const payload = { ...values, benefits: selectedOptions };
      const payload = { ...values };

      // console.log(payload, "payload1");
      if (payload.insuranceType === "thirdparty") {
        delete payload.repairCondition;
        delete payload.rateInPercentage;
        delete payload.vehicleValuationFrom;
        delete payload.vehicleValuationTo;
      } else if (payload.insuranceType === "comprehensive") {
        delete payload.noOfCylinders;
      }
      // console.log(payload, "payload2");

      if (matrixId) {
        dispatch(updateMatrixById({ id: matrixId, data: payload }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push(`/companies/${companyId}/motor-insurance/matrix`);
              toast("Successfully Edited", {
                type: "success",
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
      } else {
        dispatch(addNewMatrix(payload))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(`/companies/${companyId}/motor-insurance/matrix`);
              toast("Successfully Created", {
                type: "success",
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
      }

      if (newUploadFile === null) {
        delete values.file;
      }

      const formData = jsonToFormData(values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              {/* <Grid item md={4} xs={12}>
                                <Typography variant="h6">Basic details</Typography>
                            </Grid> */}

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.insuranceType && formik.errors.insuranceType)}
                  helperText={formik.touched.insuranceType && formik.errors.insuranceType}
                  fullWidth
                  label="Insurance Type"
                  name="insuranceType"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.insuranceType}
                >
                  <option value="comprehensive">Comprehensive</option>
                  <option value="thirdparty">Third Party</option>
                </TextField>
              </Grid>

              {/* <Box mt={3}> */}
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.vehicleType && formik.errors.vehicleType)}
                  fullWidth
                  helperText={formik.touched.vehicleType && formik.errors.vehicleType}
                  label="Vehicle Type"
                  name="vehicleType"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.vehicleType}
                >
                  <option value="coupe">Coupe</option>
                  <option value="4wd">4wd</option>
                  <option value="sedan">Sedan</option>
                </TextField>
              </Grid>
              {/* </Box> */}
              {formik.values.insuranceType === "comprehensive" && (
                <Grid item md={6} xs={12}>
                  {/* <Box mt={3}> */}
                  <TextField
                    error={Boolean(
                      formik.touched.vehicleValuationFrom && formik.errors.vehicleValuationFrom
                    )}
                    fullWidth
                    helperText={
                      formik.touched.vehicleValuationFrom && formik.errors.vehicleValuationFrom
                    }
                    label="Vehicle Valuation From"
                    name="vehicleValuationFrom"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.vehicleValuationFrom}
                  />
                  {/* </Box> */}
                </Grid>
              )}

              {formik.values.insuranceType === "comprehensive" && (
                // <Box mt={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(
                      formik.touched.vehicleValuationTo && formik.errors.vehicleValuationTo
                    )}
                    fullWidth
                    helperText={
                      formik.touched.vehicleValuationTo && formik.errors.vehicleValuationTo
                    }
                    label="Vehicle Valuation To"
                    name="vehicleValuationTo"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.vehicleValuationTo}
                  />
                </Grid>
              )}

              {/* <Box mt={3}> */}
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.minimumPremium && formik.errors.minimumPremium)}
                  fullWidth
                  helperText={formik.touched.minimumPremium && formik.errors.minimumPremium}
                  label="Minimum Premium"
                  name="minimumPremium"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.minimumPremium}
                />
              </Grid>
              {/* </Box> */}

              {formik.values.insuranceType === "thirdparty" && (
                <Grid item md={6} xs={12}>
                  {/* <Box mt={3}> */}
                  <TextField
                    error={Boolean(formik.touched.noOfCylinders && formik.errors.noOfCylinders)}
                    fullWidth
                    helperText={formik.touched.noOfCylinders && formik.errors.noOfCylinders}
                    label="No of Cylinders"
                    name="noOfCylinders"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.noOfCylinders}
                  >
                    {/* <option value="" disabled></option> */}
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="9">9+</option>
                  </TextField>

                  {/* </Box> */}
                </Grid>
              )}

              {formik.values.insuranceType === "comprehensive" && (
                <Grid item md={6} xs={12}>
                  {/* <Box mt={3}> */}
                  <TextField
                    error={Boolean(formik.touched.repairCondition && formik.errors.repairCondition)}
                    fullWidth
                    helperText={formik.touched.repairCondition && formik.errors.repairCondition}
                    label="Repair Condition"
                    name="repairCondition"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.repairCondition}
                  >
                    {/* <option value="" disabled></option> */}
                    <option value="agency">Agency</option>
                    <option value="nonagency">nonagency</option>
                  </TextField>
                  {/* </Box> */}
                </Grid>
              )}
              {formik.values.insuranceType === "comprehensive" && (
                <Grid item md={6} xs={12}>
                  {/* <Box mt={3}> */}
                  <TextField
                    error={Boolean(
                      formik.touched.rateInPercentage && formik.errors.rateInPercentage
                    )}
                    fullWidth
                    helperText={formik.touched.rateInPercentage && formik.errors.rateInPercentage}
                    label="Rate In Percentage"
                    name="rateInPercentage"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.rateInPercentage}
                  />
                  {/* </Box> */}
                </Grid>
              )}
              {formik.values.insuranceType === "comprehensive" && (
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.carAge && formik.errors.carAge)}
                    fullWidth
                    helperText={formik.touched.carAge && formik.errors.carAge}
                    label="Car Age"
                    name="carAge"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.carAge}
                  >
                    <option value=""></option>
                    <option value="1">1 year</option>
                    <option value="2">2 year</option>
                    <option value=">2">2 year +</option>
                  </TextField>
                </Grid>
              )}
              {/* <Box mt={3}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAllOptionsSelected ? true : selectAll}
                        indeterminate={!isAllOptionsSelected && selectAll}
                        onChange={handleSelectAll}
                        name="selectAllBenefits"
                        sx={{ paddingLeft: "2.5rem" }}
                      />
                    }
                    label="Select All Benefits"
                  />
                  <Grid container md={12} xs={12}>
                    {benefitsDetail?.map((benefit, idx) => (
                      <Grid key={benefit._id} item md={6} xs={12}>
                        <FormControlLabel
                          key={benefit._id}
                          control={
                            <Checkbox
                              checked={selectedOptions.includes(benefit._id)}
                              onChange={handleCheckboxChange}
                              name={`benefits[${idx}]`}
                            />
                          }
                          value={benefit._id}
                          label={benefit.name}
                          onChange={formik.handleChange}
                          name={`benefits[${idx}]`}
                          sx={{ paddingLeft: "2rem" }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box> */}
              <Box mt={3}>
                {/* <FileDropzone
                                        accept={{
                                            "image/*": [],
                                        }}
                                        maxFiles={1}
                                        onDrop={handleDropCover}
                                    /> */}

                {/* {uploadFileInfo && (
                                        <List>
                                            <ListItem
                                                sx={{
                                                    border: 1,
                                                    borderColor: "divider",
                                                    borderRadius: 1,
                                                    "& + &": {
                                                        mt: 1,
                                                    },
                                                }}
                                            >
                                                <ListItemText
                                                    primary={uploadFileInfo?.filename}
                                                    primaryTypographyProps={{
                                                        color: "textPrimary",
                                                        variant: "subtitle2",
                                                    }}
                                                    secondary={bytesToSize(uploadFileInfo?.size)}
                                                />
                                            </ListItem>
                                        </List>
                                    )} */}

                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {Boolean(formik.touched.file && formik.errors.file)}
                </Typography>
                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                  mt={1}
                >
                  {formik.touched.file && formik.errors.file}
                </Typography>
              </Box>
            </Grid>
          </CardContent>
        </Card>
        {/* {JSON.stringify(formik.errors)} */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            mx: -1,
            mb: -1,
            mt: 3,
          }}
        >
          <NextLink href={`/companies/${companyId}/motor-insurance/matrix`} passHref>
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {matrixId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default MatrixEditForm;
