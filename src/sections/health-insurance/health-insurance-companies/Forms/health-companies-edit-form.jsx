import React, { useState } from "react";
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
  Divider,
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
import { toast } from "react-toastify";
import { addNewHealthInsuranceCompany, updateHealthInsuranceCompanyById } from "../Action/healthinsuranceCompanyAction";
import { QuillEditor } from "src/components/quill-editor";
import { FileDropzone } from "src/components/file-dropzone";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";

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

const HealthInsuranceCompanyEditForm = () => {
  const dispatch = useDispatch();
  const { healthInsuranceCompanyDetails } = useSelector((state) => state.healthInsuranceCompany);
  const router = useRouter();
  const { companyId } = router.query;

  const [newUploadFile, setnewUploadFile] = useState(null);
  const [bannerUploadFile, setBannerUploadFile] = useState(null);

  const [uploadFileInfo, setUploadFileInfo] = useState(
    healthInsuranceCompanyDetails
      ? {
          filename: healthInsuranceCompanyDetails?.logoImg?.filename,
          size: healthInsuranceCompanyDetails?.logoImg?.size,
        }
      : ""
  );

  const [uploadBannerFile, setUploadBannerFile] = useState(
    healthInsuranceCompanyDetails
      ? {
          filename: healthInsuranceCompanyDetails?.bannerImg?.filename,
          size: healthInsuranceCompanyDetails?.bannerImg?.size,
        }
      : ""
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: healthInsuranceCompanyDetails ? healthInsuranceCompanyDetails?.companyName : "",
      dec: healthInsuranceCompanyDetails ? healthInsuranceCompanyDetails?.dec : "",
      headquarters: healthInsuranceCompanyDetails?.headquarters ? healthInsuranceCompanyDetails?.headquarters : "",
      commission: healthInsuranceCompanyDetails?.commission ? healthInsuranceCompanyDetails?.commission : "",
      googlePlaceId: healthInsuranceCompanyDetails?.googlePlaceId ? healthInsuranceCompanyDetails?.googlePlaceId : "",
      contactNo: healthInsuranceCompanyDetails ? healthInsuranceCompanyDetails?.contactNo : "",
      startedYear: healthInsuranceCompanyDetails?.startedYear ? healthInsuranceCompanyDetails?.startedYear : "",
      companyEmail: healthInsuranceCompanyDetails ? healthInsuranceCompanyDetails?.companyEmail : "",
      companyPortal: healthInsuranceCompanyDetails ? healthInsuranceCompanyDetails?.companyPortal : "",
      companyWebsite: healthInsuranceCompanyDetails ? healthInsuranceCompanyDetails?.companyWebsite : "",
      reductionType: healthInsuranceCompanyDetails
        ? healthInsuranceCompanyDetails?.healthValueReduction?.reductionType
        : "",
      reductionValue: healthInsuranceCompanyDetails
        ? healthInsuranceCompanyDetails?.healthValueReduction?.reductionValue
        : "",
      logoImg: healthInsuranceCompanyDetails ? healthInsuranceCompanyDetails?.logoImg : "",
      bannerImg: healthInsuranceCompanyDetails ? healthInsuranceCompanyDetails?.bannerImg : "",
      eSanadRecommendation: healthInsuranceCompanyDetails?.eSanadRecommendation || false,
      isActive: healthInsuranceCompanyDetails?.isActive || false,
    },

    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      dec: Yup.string().required("Description is required"),
      headquarters: Yup.string().required("Headquarters is required"),
      googlePlaceId: Yup.string().required("Place Id is required"),
      startedYear: Yup.string().matches(/^\d{4}$/, "Year is required"),
      // ownerName: Yup.string().required("Owner name is required"),
      // contactNo: Yup.string()
      //   .matches(/^(50|51|52|55|56|58|2|3|4|6|7|9)\d{9}$/, "Contact number is not valid")
      //   .required("Contact number is required"),
      // companyAdd: Yup.string().required("Company add is required"),
      // companyEmail: Yup.string().email().required("Company email is required"),
      companyPortal: Yup.string(),
      companyWebsite: Yup.string().required("Please enter website"),
      logoImg: Yup.mixed().required("Please select file"),
      bannerImg: Yup.mixed().required("Please select file"),
    }),

    onSubmit: (values, helpers) => {
      // console.log(values, "values");

      if (newUploadFile === null) {
        delete values.logoImg;
      }

      if (bannerUploadFile === null) {
        delete values.bannerImg;
      }

      const payload = {
        companyEmail: values?.companyEmail,
        companyName: values?.companyName,
        companyPortal: values?.companyPortal,
        companyWebsite: values?.companyWebsite,
        contactNo: values?.contactNo,
        dec: values?.dec,
        bannerImg: values?.bannerImg,
        logoImg: values?.logoImg,
        googlePlaceId: values?.googlePlaceId,
        headquarters: values?.headquarters,
        commission: values?.commission,
        healthValueReduction: {
          reductionType: values?.reductionType || "",
          reductionValue: values?.reductionValue || "",
        },
        eSanadRecommendation: values?.eSanadRecommendation,
        isActive: values?.isActive,
        startedYear: values?.startedYear,
      };

      if (!payload?.bannerImg) {
        delete payload.bannerImg;
      }

      if (!payload?.logoImg) {
        delete payload.logoImg;
      }

      const formData = jsonToFormData(payload);

      if (companyId) {
        dispatch(updateHealthInsuranceCompanyById({ id: companyId, data: formData }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push("/health-insurance-companies");
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
        dispatch(addNewHealthInsuranceCompany(formData))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(`/companies/${companyId}/health-insurance`);
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
    formik.setFieldValue("logoImg", file);
    setnewUploadFile(file);

    setUploadFileInfo({
      filename: file?.name,
      size: file?.size,
    });
  };

  const handleBannerImage = async ([file]) => {
    formik.setFieldValue("bannerImg", file);
    setBannerUploadFile(file);
    setUploadBannerFile({
      filename: file?.name,
      size: file?.size,
    });
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <Typography variant="h6">Basic details</Typography>
              </Grid>

              <Grid item md={8} xs={12}>
                <TextField
                  error={Boolean(formik.touched.companyName && formik.errors.companyName)}
                  fullWidth
                  helperText={formik.touched.companyName && formik.errors.companyName}
                  label="Company Name"
                  name="companyName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.companyName}
                />

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
                    sx={{ height: 400 }}
                    value={formik.values.dec}
                  />

                  {Boolean(formik.touched.dec && formik.errors.dec) && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>{formik.errors.dec}</FormHelperText>
                    </Box>
                  )}
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.companyEmail && formik.errors.companyEmail)}
                    fullWidth
                    helperText={formik.touched.companyEmail && formik.errors.companyEmail}
                    label="Company Email"
                    name="companyEmail"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.companyEmail}
                    type="email"
                  />
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.companyPortal && formik.errors.companyPortal)}
                    fullWidth
                    helperText={formik.touched.companyPortal && formik.errors.companyPortal}
                    label="Company Portal"
                    name="companyPortal"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.companyPortal}
                    type="url"
                  />
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.companyWebsite && formik.errors.companyWebsite)}
                    fullWidth
                    helperText={formik.touched.companyWebsite && formik.errors.companyWebsite}
                    label="Company Website"
                    name="companyWebsite"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.companyWebsite}
                    type="url"
                  />
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.headquarters && formik.errors.headquarters)}
                    fullWidth
                    helperText={formik.touched.headquarters && formik.errors.headquarters}
                    label="Headquarters"
                    name="headquarters"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.headquarters}
                  />
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.contactNo && formik.errors.contactNo)}
                    fullWidth
                    helperText={formik.touched.contactNo && formik.errors.contactNo}
                    label="Contact No"
                    name="contactNo"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.contactNo}
                  />
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.startedYear && formik.errors.startedYear)}
                    fullWidth
                    helperText={formik.touched.startedYear && formik.errors.startedYear}
                    label="Year started"
                    name="startedYear"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.startedYear}
                  />
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.googlePlaceId && formik.errors.googlePlaceId)}
                    fullWidth
                    helperText={formik.touched.googlePlaceId && formik.errors.googlePlaceId}
                    label="Google Place Id"
                    name="googlePlaceId"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.googlePlaceId}
                  />
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.reductionType && formik.errors.reductionType)}
                    helperText={formik.touched.reductionType && formik.errors.reductionType}
                    fullWidth
                    label="Reduction Type"
                    name="reductionType"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.reductionType}
                  >
                    <option value=""></option>
                    <option value="percentage">Percentage</option>
                    <option value="fixedPrice">Fixed Price</option>
                  </TextField>
                </Box>

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.reductionValue && formik.errors.reductionValue)}
                    fullWidth
                    helperText={formik.touched.reductionValue && formik.errors.reductionValue}
                    label="Reduction Value"
                    name="reductionValue"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.reductionValue}
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {formik.values.reductionType === "percentage" ? "%" : "AED"}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.commission && formik.errors.commission)}
                    fullWidth
                    helperText={formik.touched.commission && formik.errors.commission}
                    label="Commission"
                    name="commission"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.commission}
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Box>
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.eSanadRecommendation && formik.errors.eSanadRecommendation)}
                    helperText={formik.touched.eSanadRecommendation && formik.errors.eSanadRecommendation}
                    fullWidth
                    label="eSanad Recommendation"
                    name="eSanadRecommendation"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.eSanadRecommendation}
                  >
                    <option value={true}>true</option>
                    <option value={false}>false</option>
                  </TextField>
                </Box>

                <Box mt={5}>
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
                    {Boolean(formik.touched.logoImg && formik.errors.logoImg)}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#F04438",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                    }}
                    mt={1}
                  >
                    {formik.touched.logoImg && formik.errors.logoImg}
                  </Typography>
                </Box>

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
                    {Boolean(formik.touched.bannerImg && formik.errors.bannerImg)}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#F04438",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                    }}
                    mt={1}
                  >
                    {formik.touched.bannerImg && formik.errors.bannerImg}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
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
                          formik.setFieldValue("isActive", value.target.checked);
                        }}
                        onBlur={formik.handleBlur}
                        checked={formik.values.isActive}
                      />
                    }
                  />
                </Box>
              </Grid>
            </Grid>
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
          <NextLink href={`/companies/${companyId}/health-insurance`} passHref>
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

export default HealthInsuranceCompanyEditForm;
