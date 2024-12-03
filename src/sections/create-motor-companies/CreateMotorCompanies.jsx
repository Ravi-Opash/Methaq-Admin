import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
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
import { addNewCompany, updateCompanyById } from "../../sections/companies/action/companyAcrion";
import AnimationLoader from "src/components/amimated-loader";

// Function to initialize form values based on the Flag and existing company details
const getInitialValues = (Flag, companyDetail, companyId) => {
  const baseValues = {
    companyName: companyDetail ? companyDetail.companyName : "",
    companyPortal: companyDetail ? companyDetail.companyPortal : "",
    file: companyDetail ? companyDetail.logoImg : "",
    ...(!companyId && { showPortal: true }),
  };

  // Defines the initial values for various insurance types
  const insuranceValues = {
    "motor-insurance": { motorInsurance: { eSanadRecommendation: false } },
    "health-insurance": { healthInsurance: { eSanadRecommendation: false } },
    "travel-insurance": { travelInsurance: { eSanadRecommendation: false } },
    "land-insurance": { landInsurance: { eSanadRecommendation: false } },
    "pet-insurance": { petInsurance: { eSanadRecommendation: false } },
  };

  return {
    ...baseValues,
    ...(insuranceValues[Flag] || {}),
  };
};

// Function to get the redirect URL based on the insurance type flag
const getRedirectUrl = (Flag) => {
  const routeMap = {
    "motor-insurance": "/motor-companies",
    "health-insurance": "/health-insurance/health-companies",
    "travel-insurance": "/travel-insurance/travel-companies",
    "land-insurance": "/land-insurance/land-portals",
    "pet-insurance": "/pet-insurance/petinsurance-portals",
  };
  return routeMap[Flag] || "/";
};

const CreateMotorCompanies = ({ Flag }) => {
  const dispatch = useDispatch();
  const { companyDetail } = useSelector((state) => state.company);
  const router = useRouter();
  const { companyId } = router.query;
  const [newUploadFile, setnewUploadFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFileInfo, setUploadFileInfo] = useState(
    companyId
      ? companyDetail
        ? {
            filename: companyDetail?.logoImg?.filename,
            size: companyDetail?.logoImg?.size,
          }
        : null
      : null
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: companyId
      ? getInitialValues(Flag, companyDetail, companyId)
      : {
          companyName: "",
          companyPortal: "",
          file: "",
          showPortal: true,
          ...(Flag === "motor-insurance" && { motorInsurance: { eSanadRecommendation: false } }),
          ...(Flag === "health-insurance" && { healthInsurance: { eSanadRecommendation: false } }),
          ...(Flag === "travel-insurance" && { travelInsurance: { eSanadRecommendation: false } }),
          ...(Flag === "land-insurance" && { landInsurance: { eSanadRecommendation: false } }),
          ...(Flag === "pet-insurance" && { petInsurance: { eSanadRecommendation: false } }),
        },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      companyPortal: Yup.string().required("Please enter portal"),
      file: Yup.mixed().required("Please select file"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      if (!newUploadFile) {
        delete values.file;
      }

      const formData = jsonToFormData(values);
      const action = companyId ? updateCompanyById({ id: companyId, data: formData }) : addNewCompany(formData);

      dispatch(action)
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          if (res?.success) {
            formik.resetForm();
            router.push(getRedirectUrl(Flag));
            toast(companyId ? "Successfully Edited" : "Successfully Created", { type: "success" });
          }
        })
        .catch((err) => {
          toast(err.message || "An error occurred", { type: "error" });
          setIsLoading(false);
        });
    },
  });

  // Function to handle file drop and update the form field and state
  const handleDropCover = ([file]) => {
    formik.setFieldValue("file", file);
    setnewUploadFile(file);

    setUploadFileInfo({
      filename: file?.name,
      size: file?.size,
    });
  };

  // Function to handle navigation to the appropriate URL
  const handleNavigation = () => {
    router.push(getRedirectUrl(Flag));
  };

  return (
    <>
      {isLoading && <AnimationLoader open={true} />}
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
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.companyName}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Box>
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
              </Grid>
              <Grid item md={6} xs={12}>
                <Box mt={3}>
                  <Typography color="textSecondary" sx={{ mb: 1, mt: 3 }} variant="subtitle2">
                    Logo
                  </Typography>

                  <FileDropzone accept={{ "image/*": [] }} maxFiles={1} onDrop={handleDropCover} />

                  {uploadFileInfo && (
                    <List>
                      <ListItem
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          "& + &": { mt: 1 },
                        }}
                      >
                        <ListItemText
                          primary={uploadFileInfo?.filename}
                          primaryTypographyProps={{ color: "textPrimary", variant: "subtitle2" }}
                          secondary={bytesToSize(uploadFileInfo?.size)}
                        />
                      </ListItem>
                    </List>
                  )}

                  <Typography sx={{ color: "#F04438", fontSize: "0.75rem", fontWeight: "500" }}>
                    {formik.touched.file && formik.errors.file}
                  </Typography>
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
          <Button sx={{ m: 1 }} variant="outlined" onClick={handleNavigation}>
            Cancel
          </Button>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {companyId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CreateMotorCompanies;
