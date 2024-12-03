import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { FileDropzone } from "src/components/file-dropzone";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { toast } from "react-toastify";
import { addNewCompany, updateCompanyById } from "./action/companyAcrion";
import { QuillEditor } from "src/components/quill-editor";
import { Stack } from "@mui/system";

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    margin: "0 !important",
    marginLeft: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#60176F",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

const CompanyEditForm = () => {
  const dispatch = useDispatch();
  const { companyDetail } = useSelector((state) => state.company);
  const router = useRouter();
  const { companyId } = router.query;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [newUploadFile, setnewUploadFile] = useState(null);
  const [bannerUploadFile, setBannerUploadFile] = useState(null);

  const [uploadFileInfo, setUploadFileInfo] = useState(
    companyDetail
      ? {
          filename: companyDetail?.logoImg?.filename,
          size: companyDetail?.logoImg?.size,
        }
      : ""
  );

  const [uploadBannerFile, setUploadBannerFile] = useState(
    companyDetail
      ? {
          filename: companyDetail?.bannerImg?.filename,
          size: companyDetail?.bannerImg?.size,
        }
      : ""
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: companyDetail ? companyDetail?.companyName : "",
      dec: companyDetail ? companyDetail?.dec : "",
      headquarters: companyDetail?.headquarters ? companyDetail?.headquarters : "",
      googlePlaceId: companyDetail?.googlePlaceId ? companyDetail?.googlePlaceId : "",
      contactNo: companyDetail ? companyDetail?.contactNo : "",
      startedYear: companyDetail?.startedYear ? companyDetail?.startedYear : "",
      companyEmail: companyDetail ? companyDetail?.companyEmail : "",
      praktoraCompanyName: companyDetail ? companyDetail?.praktoraCompanyName : "",
      companyPortal: companyDetail ? companyDetail?.companyPortal : "",
      companyWebsite: companyDetail ? companyDetail?.companyWebsite : "",
      file: companyDetail ? companyDetail?.logoImg : "",
      banner: companyDetail ? companyDetail?.bannerImg : "",
      healthInsurance: companyDetail?.healthInsurance || {},
      motorInsurance: companyDetail?.motorInsurance || {},
      travelInsurance: companyDetail?.travelInsurance || {},
      petInsurance: companyDetail?.healthInsurance || {},
      landInsurance: companyDetail?.landInsurance || {},
      healthInsuranceActive: companyDetail?.healthInsurance?.isActive || !!companyDetail?.healthInsurance || false,
      travelInsuranceActive: companyDetail?.travelInsurance?.isActive || !!companyDetail?.travelInsurance || false,
      motorInsuranceActive: companyDetail?.motorInsurance?.isActive || !!companyDetail?.motorInsurance || false,
      landInsuranceActive: companyDetail?.landInsurance?.isActive || !!companyDetail?.landInsurance || false,
      petInsuranceActive: companyDetail?.petInsurance?.isActive || false,
    },

    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      dec: Yup.string().required("Description is required"),
      headquarters: Yup.string().required("Headquarters is required"),
      googlePlaceId: Yup.string().required("Place Id is required"),
      startedYear: Yup.string().matches(/^\d{4}$/, "Year is required"),
      companyPortal: Yup.string(),
      companyWebsite: Yup.string().required("Please enter website"),
      file: Yup.mixed().required("Please select file"),
      banner: Yup.mixed().required("Please select file"),
    }),

    onSubmit: (values, helpers) => {
      console.log("values", values);
      if (newUploadFile === null) {
        delete values.file;
      }
      if (bannerUploadFile === null) {
        delete values.banner;
      }

      if (!values?.healthInsuranceActive) {
        delete values?.healthInsurance;
      }
      if (!values?.travelInsuranceActive) {
        delete values?.travelInsurance;
      }
      if (!values?.motorInsuranceActive) {
        delete values?.motorInsurance;
      }
      if (!values?.petInsuranceActive) {
        delete values?.petInsurance;
      }

      const formData = jsonToFormData(values);
      if (companyId) {
        dispatch(updateCompanyById({ id: companyId, data: formData }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push("/companies");
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
        dispatch(addNewCompany(formData))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push("/companies");
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
    },
  });

  const handleDropCover = async ([file]) => {
    formik.setFieldValue("file", file);
    setnewUploadFile(file);

    setUploadFileInfo({
      filename: file?.name,
      size: file?.size,
    });
  };

  const handleBannerImage = async ([file]) => {
    formik.setFieldValue("banner", file);
    setBannerUploadFile(file);
    setUploadBannerFile({
      filename: file?.name,
      size: file?.size,
    });
  };

  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      if (document.getElementById(Object.keys(formik.errors)[0]))
        document.getElementById(Object.keys(formik.errors)[0]).focus();
    }
  }, [formik]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.companyName && formik.errors.companyName)}
                  fullWidth
                  helperText={formik.touched.companyName && formik.errors.companyName}
                  label="Company Name"
                  name="companyName"
                  id="companyName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.companyName}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Box>
                  <TextField
                    error={Boolean(formik.touched.companyEmail && formik.errors.companyEmail)}
                    fullWidth
                    helperText={formik.touched.companyEmail && formik.errors.companyEmail}
                    label="Company Email"
                    name="companyEmail"
                    id="companyEmail"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.companyEmail}
                    type="email"
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box>
                  <TextField
                    error={Boolean(formik.touched.praktoraCompanyName && formik.errors.praktoraCompanyName)}
                    fullWidth
                    helperText={formik.touched.praktoraCompanyName && formik.errors.praktoraCompanyName}
                    label="Praktora Company Name"
                    name="praktoraCompanyName"
                    id="praktoraCompanyName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.praktoraCompanyName}
                    type="text"
                  />
                </Box>
              </Grid>
              <Grid item md={12} xs={12}>
                <Box mt={3}>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      mt: 3,
                    }}
                    variant="subtitle2"
                  >
                    Description
                  </Typography>

                  <QuillEditor
                    onChange={(content) => {
                      formik.setFieldValue("dec", content);
                    }}
                    placeholder="Write something"
                    sx={{ height: 300 }}
                    value={formik.values.dec}
                  />

                  {Boolean(formik.touched.dec && formik.errors.dec) && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>{formik.errors.dec}</FormHelperText>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.companyPortal && formik.errors.companyPortal)}
                    fullWidth
                    helperText={formik.touched.companyPortal && formik.errors.companyPortal}
                    label="Company Portal"
                    name="companyPortal"
                    id="companyPortal"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.companyPortal}
                    type="url"
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.companyWebsite && formik.errors.companyWebsite)}
                    fullWidth
                    helperText={formik.touched.companyWebsite && formik.errors.companyWebsite}
                    label="Company Website"
                    name="companyWebsite"
                    id="companyWebsite"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.companyWebsite}
                    type="url"
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.headquarters && formik.errors.headquarters)}
                    fullWidth
                    helperText={formik.touched.headquarters && formik.errors.headquarters}
                    label="Headquarters"
                    name="headquarters"
                    id="headquarters"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.headquarters}
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.contactNo && formik.errors.contactNo)}
                    fullWidth
                    helperText={formik.touched.contactNo && formik.errors.contactNo}
                    label="Contact No"
                    name="contactNo"
                    id="contactNo"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.contactNo}
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.startedYear && formik.errors.startedYear)}
                    fullWidth
                    helperText={formik.touched.startedYear && formik.errors.startedYear}
                    label="Year started"
                    name="startedYear"
                    id="startedYear"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.startedYear}
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.googlePlaceId && formik.errors.googlePlaceId)}
                    fullWidth
                    helperText={formik.touched.googlePlaceId && formik.errors.googlePlaceId}
                    label="Google Place Id"
                    name="googlePlaceId"
                    id="googlePlaceId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.googlePlaceId}
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      mt: 3,
                    }}
                    variant="subtitle2"
                  >
                    Logo
                  </Typography>

                  <FileDropzone
                    accept={{
                      "image/*": [],
                    }}
                    maxFiles={1}
                    onDrop={handleDropCover}
                  />

                  {uploadFileInfo && (
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
                  )}

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
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <Typography
                    color="textSecondary"
                    sx={{
                      mb: 1,
                      mt: 3,
                    }}
                    variant="subtitle2"
                  >
                    Banner Image
                  </Typography>

                  <FileDropzone
                    accept={{
                      "image/*": [],
                    }}
                    maxFiles={1}
                    onDrop={handleBannerImage}
                  />

                  {uploadBannerFile && uploadBannerFile?.filename && (
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
                          primary={uploadBannerFile?.filename ? uploadBannerFile?.filename : ""}
                          primaryTypographyProps={{
                            color: "textPrimary",
                            variant: "subtitle2",
                          }}
                          secondary={uploadBannerFile?.size ? bytesToSize(uploadBannerFile?.size) : ""}
                        />
                      </ListItem>
                    </List>
                  )}

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
              <Grid item xs={12} md={3} sx={{ my: 1 }}>
                <Stack spacing={1}>
                  <Typography variant="h6">Available Products</Typography>
                  <Stack>
                    <FormControlLabel
                      control={<Checkbox checked={formik.values.motorInsuranceActive} />}
                      label="Motor Insurance"
                      name="motorInsuranceActive"
                      onChange={formik.handleChange}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formik.values.healthInsuranceActive} />}
                      label="Health Insurance"
                      name="healthInsuranceActive"
                      onChange={formik.handleChange}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formik.values.travelInsuranceActive} />}
                      label="Travel Insurance"
                      name="travelInsuranceActive"
                      onChange={formik.handleChange}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formik.values.petInsuranceActive} />}
                      label="Pet Insurance"
                      name="petInsuranceActive"
                      onChange={formik.handleChange}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={formik.values.landInsuranceActive} />}
                      label="Musataha Insurance"
                      name="landInsuranceActive"
                      onChange={formik.handleChange}
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            {/* {"motor insurance details"} */}
            {formik.values?.motorInsuranceActive && (
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  mb: 3,
                  mt: 3,
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
                  Motor Insurance details
                </Typography>
                <Grid container columnSpacing={2} padding={2}>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched.motorInsurance?.carValueReduction?.reductionType &&
                            formik.errors.motorInsurance?.carValueReduction?.reductionType
                        )}
                        helperText={
                          formik.touched.motorInsurance?.carValueReduction?.reductionType &&
                          formik.errors.motorInsurance?.carValueReduction?.reductionType
                        }
                        fullWidth
                        label="Reduction Type"
                        name={`motorInsurance.carValueReduction.reductionType`}
                        id="motorInsurance.carValueReduction.reductionType"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.motorInsurance?.carValueReduction?.reductionType}
                      >
                        <option value=""></option>
                        <option value="percentage">Percentage</option>
                        <option value="fixedPrice">Fixed Price</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.motorInsurance?.carValueReduction?.reductionValue &&
                            formik.errors?.motorInsurance?.carValueReduction?.reductionValue
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.motorInsurance?.reductionValue &&
                          formik.errors?.motorInsurance?.reductionValue
                        }
                        label="Reduction Value"
                        name={`motorInsurance.carValueReduction.reductionValue`}
                        id="motorInsurance.carValueReduction.reductionValue"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.motorInsurance?.carValueReduction?.reductionValue}
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {formik.values?.motorInsurance?.carValueReduction?.reductionType === "percentage"
                                ? "%"
                                : "AED"}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.motorInsurance?.commissionThirdparty &&
                            formik.errors?.motorInsurance?.commissionThirdparty
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.motorInsurance?.commissionThirdparty &&
                          formik.errors?.motorInsurance?.commissionThirdparty
                        }
                        label="Third Party Commission"
                        name={`motorInsurance.commissionThirdparty`}
                        id="motorInsurance.commissionThirdparty"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.motorInsurance?.commissionThirdparty}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.motorInsurance?.fleetCommission &&
                            formik.errors?.motorInsurance?.fleetCommission
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.motorInsurance?.fleetCommission &&
                          formik.errors?.motorInsurance?.fleetCommission
                        }
                        label="MotorFleet Commission"
                        name={`motorInsurance.fleetCommission`}
                        id="motorInsurance.fleetCommission"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.motorInsurance?.fleetCommission}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.motorInsurance?.commissionComprehensive &&
                            formik.errors?.motorInsurance?.commissionComprehensive
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.motorInsurance?.commissionComprehensive &&
                          formik.errors?.motorInsurance?.commissionComprehensive
                        }
                        label="Comprehensive Commission"
                        name={`motorInsurance.commissionComprehensive`}
                        id="motorInsurance.commissionComprehensive"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.motorInsurance?.commissionComprehensive}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.motorInsurance?.eSanadRecommendation &&
                            formik.errors?.motorInsurance?.eSanadRecommendation
                        )}
                        helperText={
                          formik.touched?.motorInsurance?.eSanadRecommendation &&
                          formik.errors?.motorInsurance?.eSanadRecommendation
                        }
                        fullWidth
                        label="eSanad Recommendation"
                        name={`motorInsurance.eSanadRecommendation`}
                        id="motorInsurance.eSanadRecommendation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values?.motorInsurance?.eSanadRecommendation}
                      >
                        <option value={""}></option>
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.motorInsurance?.roadSiteAssistNo &&
                            formik.errors?.motorInsurance?.roadSiteAssistNo
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.motorInsurance?.roadSiteAssistNo &&
                          formik.errors?.motorInsurance?.roadSiteAssistNo
                        }
                        label="Road side assitance no"
                        name={`motorInsurance.roadSiteAssistNo`}
                        id="motorInsurance.roadSiteAssistNo"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.motorInsurance?.roadSiteAssistNo}
                        type="number"
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}></Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
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
                          Allow without Matrix or API
                        </Typography>
                      </Box>
                      <FormControlLabel
                        sx={{ ml: 0 }}
                        control={
                          <IOSSwitch
                            name="isWithoutMatrixOrApi"
                            id="isWithoutMatrixOrApi"
                            onChange={(value, e) => {
                              formik.setFieldValue("motorInsurance.isWithoutMatrixOrApi", value.target.checked);
                            }}
                            onBlur={formik.handleBlur}
                            checked={formik.values?.motorInsurance?.isWithoutMatrixOrApi}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
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
                          Is Active
                        </Typography>
                      </Box>
                      <FormControlLabel
                        sx={{ ml: 0 }}
                        control={
                          <IOSSwitch
                            name="isActive"
                            id="isActive"
                            onChange={(value, e) => {
                              formik.setFieldValue("motorInsurance.isActive", value.target.checked);
                            }}
                            onBlur={formik.handleBlur}
                            checked={formik.values?.motorInsurance?.isActive}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
            {/* {"health insurance details"} */}
            {formik.values.healthInsuranceActive && (
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  mb: 3,
                  mt: 3,
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
                  Health Insurance details
                </Typography>
                <Grid container columnSpacing={2} padding={2}>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.healthInsurance?.commission && formik.errors?.healthInsurance?.commission
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.healthInsurance?.commission && formik.errors?.healthInsurance?.commission
                        }
                        label="Commission"
                        name={`healthInsurance.commission`}
                        id="healthInsurance.commission"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.healthInsurance?.commission}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.healthInsurance?.eSanadRecommendation &&
                            formik.errors?.healthInsurance?.eSanadRecommendation
                        )}
                        helperText={
                          formik.touched?.healthInsurance?.eSanadRecommendation &&
                          formik.errors?.healthInsurance?.eSanadRecommendation
                        }
                        fullWidth
                        label="eSanad Recommendation"
                        name={`healthInsurance.eSanadRecommendation`}
                        id="healthInsurance.eSanadRecommendation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values?.healthInsurance?.eSanadRecommendation}
                      >
                        <option value={""}></option>
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
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
                        Is Active
                      </Typography>
                    </Box>
                    <FormControlLabel
                      sx={{ ml: 0 }}
                      control={
                        <IOSSwitch
                          name="isActive"
                          id="isActive"
                          onChange={(value, e) => {
                            formik.setFieldValue(`healthInsurance.isActive`, value.target.checked);
                          }}
                          onBlur={formik.handleBlur}
                          checked={formik.values?.healthInsurance?.isActive}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {/* {"health insurance details"} */}
            {formik.values.travelInsuranceActive && (
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  mb: 3,
                  mt: 3,
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
                  Travel Insurance details
                </Typography>
                <Grid container columnSpacing={2} padding={2}>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.travelInsurance?.commission && formik.errors?.travelInsurance?.commission
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.travelInsurance?.commission && formik.errors?.travelInsurance?.commission
                        }
                        label="Commission"
                        name={`travelInsurance.commission`}
                        id="travelInsurance.commission"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.travelInsurance?.commission}
                        type="number"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.travelInsurance?.eSanadRecommendation &&
                            formik.errors?.travelInsurance?.eSanadRecommendation
                        )}
                        helperText={
                          formik.touched?.travelInsurance?.eSanadRecommendation &&
                          formik.errors?.travelInsurance?.eSanadRecommendation
                        }
                        fullWidth
                        label="eSanad Recommendation"
                        name={`travelInsurance.eSanadRecommendation`}
                        id="travelInsurance.eSanadRecommendation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values?.travelInsurance?.eSanadRecommendation}
                      >
                        <option value={""}></option>
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
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
                        Is Active
                      </Typography>
                    </Box>
                    <FormControlLabel
                      sx={{ ml: 0 }}
                      control={
                        <IOSSwitch
                          name="isActive"
                          onChange={(value, e) => {
                            formik.setFieldValue(`travelInsurance.isActive`, value.target.checked);
                          }}
                          onBlur={formik.handleBlur}
                          checked={formik.values?.travelInsurance?.isActive}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {/* {"pet insurance details"} */}
            {formik.values.petInsuranceActive && (
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  mb: 3,
                  mt: 3,
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
                  Pet Insurance details
                </Typography>
                <Grid container columnSpacing={2} padding={2}>
                  <Grid item md={6} xs={12}>
                    <Box>
                      <TextField
                        error={Boolean(
                          formik.touched?.petInsurance?.eSanadRecommendation &&
                            formik.errors?.petInsurance?.eSanadRecommendation
                        )}
                        helperText={
                          formik.touched?.petInsurance?.eSanadRecommendation &&
                          formik.errors?.petInsurance?.eSanadRecommendation
                        }
                        fullWidth
                        label="eSanad Recommendation"
                        name={`petInsurance.eSanadRecommendation`}
                        id="petInsurance.eSanadRecommendation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values?.petInsurance?.eSanadRecommendation}
                      >
                        {" "}
                        <option value={""}></option>
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
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
                        Is Active
                      </Typography>
                    </Box>
                    <FormControlLabel
                      sx={{ ml: 0 }}
                      control={
                        <IOSSwitch
                          name="isActive"
                          onChange={(value, e) => {
                            formik.setFieldValue(`petInsurance.isActive`, value.target.checked);
                          }}
                          onBlur={formik.handleBlur}
                          checked={formik.values?.petInsurance?.isActive}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            {formik.values.landInsuranceActive && (
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  mb: 3,
                  mt: 3,
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
                  Musataha Insurance details
                </Typography>
                <Grid container columnSpacing={2} padding={2}>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.landInsurance?.commissionType && formik.errors?.landInsurance?.commissionType
                        )}
                        helperText={
                          formik.touched?.landInsurance?.commissionType && formik.errors?.landInsurance?.commissionType
                        }
                        fullWidth
                        label="Commission type"
                        name={`landInsurance.commissionType`}
                        id="landInsurance.commissionType"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values?.landInsurance?.commissionType}
                      >
                        <option value=""></option>
                        <option value="percentage">Percentage</option>
                        <option value="fixedPrice">Fixed Price</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.landInsurance?.commission && formik.errors?.landInsurance?.commission
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.landInsurance?.commission && formik.errors?.landInsurance?.commission
                        }
                        label="Commission"
                        name={`landInsurance.commission`}
                        id="landInsurance.commission"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.landInsurance?.commission}
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {formik.values?.landInsurance?.commissionType === "percentage" ? "%" : "AED"}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={3}>
                      <TextField
                        error={Boolean(
                          formik.touched?.landInsurance?.eSanadRecommendation &&
                            formik.errors?.landInsurance?.eSanadRecommendation
                        )}
                        helperText={
                          formik.touched?.landInsurance?.eSanadRecommendation &&
                          formik.errors?.landInsurance?.eSanadRecommendation
                        }
                        fullWidth
                        label="eSanad Recommendation"
                        name={`landInsurance.eSanadRecommendation`}
                        id="landInsurance.eSanadRecommendation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values?.landInsurance?.eSanadRecommendation}
                      >
                        <option value={""}></option>
                        <option value={false}>false</option>
                        <option value={true}>true</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
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
                        Is Active
                      </Typography>
                    </Box>
                    <FormControlLabel
                      sx={{ ml: 0 }}
                      control={
                        <IOSSwitch
                          name="isActive"
                          onChange={(value, e) => {
                            formik.setFieldValue(`landInsurance.isActive`, value.target.checked);
                          }}
                          onBlur={formik.handleBlur}
                          checked={formik.values?.landInsurance?.isActive}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>

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
          <NextLink href={`/companies`} passHref>
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {companyId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CompanyEditForm;
