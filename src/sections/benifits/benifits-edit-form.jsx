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
import { updateBenifitsById, addNewBenifits } from "./action/benifitsAction";

const BenifitsEditForm = () => {
  const dispatch = useDispatch();
  const { benifitsDetail } = useSelector((state) => state.benifits);
  const router = useRouter();
  const { benifitsId } = router.query;

  // State for tracking the newly uploaded file and its details
  const [newUploadFile, setnewUploadFile] = useState(null);

  // State to hold the file's information (name, size) if an existing benefit is being edited
  const [uploadFileInfo, setUploadFileInfo] = useState(
    benifitsDetail
      ? {
          filename: benifitsDetail?.image?.filename,
          size: benifitsDetail?.image?.size,
        }
      : ""
  );

  // Formik hook for handling form submission, validation, and state management
  const formik = useFormik({
    initialValues: {
      name: benifitsDetail ? benifitsDetail?.name : "",
      description: benifitsDetail ? benifitsDetail?.description : "",
      limitType: benifitsDetail ? benifitsDetail?.limitType : "boolean",
      limit: benifitsDetail ? benifitsDetail?.limit : "YES",
      additionalCharge: benifitsDetail ? benifitsDetail?.additionalCharge : "",
      file: benifitsDetail ? benifitsDetail?.image : "",
    },

    // Validation schema using Yup for form validation
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      limitType: Yup.string().required("Limit type is required"),
      limit: Yup.string().required("Limit is required"),
      additionalCharge: Yup.string().required("Additional charge is required"),
      file: Yup.mixed().required("Please select a file"),
    }),

    // Form submission handler
    onSubmit: (values, helpers) => {
      // If no new file is uploaded, remove the file from the form values
      if (newUploadFile === null) {
        delete values.file;
      }

      const formData = jsonToFormData(values);

      // If benifitsId is available (edit mode), dispatch the update action
      if (benifitsId) {
        dispatch(updateBenifitsById({ id: benifitsId, data: formData }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push("/benifits");
              toast("Successfully Edited", { type: "success" });
            }
          })
          .catch((err) => {
            toast(err, { type: "error" });
          });
      } else {
        // If benifitsId is not available (create mode), dispatch the add new benefits action
        dispatch(addNewBenifits(formData))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push("/benifits");
              toast("Successfully Created", { type: "success" });
            }
          })
          .catch((err) => {
            // Show error toast if creation fails
          });
      }
    },
  });

  // Handler for dropping a file into the file dropzone
  const handleDropCover = async ([file]) => {
    formik.setFieldValue("file", file);
    setnewUploadFile(file);

    setUploadFileInfo({
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
              {/* Benefit Name Input */}
              <Grid item md={12} xs={12}>
                <TextField
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Benefit Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </Grid>

              {/* Description Input */}
              <Box mt={3}>
                <TextField
                  error={Boolean(formik.touched.description && formik.errors.description)}
                  fullWidth
                  helperText={formik.touched.description && formik.errors.description}
                  label="Description"
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </Box>

              {/* Limit Type Selection */}
              <Box mt={3}>
                <TextField
                  error={Boolean(formik.touched.limitType && formik.errors.limitType)}
                  helperText={formik.touched.limitType && formik.errors.limitType}
                  fullWidth
                  label="Limit Type"
                  name="limitType"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.limitType}
                >
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </TextField>
              </Box>

              {/* Limit Input (conditionally rendered based on Limit Type) */}
              {formik.values.limitType === "boolean" ? (
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.limit && formik.errors.limit)}
                    helperText={formik.touched.limit && formik.errors.limit}
                    fullWidth
                    label="Limit"
                    name="limit"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.limit}
                  >
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </TextField>
                </Box>
              ) : (
                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.limit && formik.errors.limit)}
                    fullWidth
                    helperText={formik.touched.limit && formik.errors.limit}
                    label="Limit"
                    name="limit"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.limit}
                    type="number"
                  />
                </Box>
              )}

              {/* Additional Charge Input */}
              <Box mt={3}>
                <TextField
                  error={Boolean(formik.touched.additionalCharge && formik.errors.additionalCharge)}
                  fullWidth
                  helperText={formik.touched.additionalCharge && formik.errors.additionalCharge}
                  label="Additional Charge"
                  name="additionalCharge"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.additionalCharge}
                />
              </Box>

              {/* File Upload Dropzone */}
              <Box mt={3}>
                <FileDropzone accept={{ "image/*": [] }} maxFiles={1} onDrop={handleDropCover} />

                {/* Display uploaded file information */}
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

                {/* Display validation errors for the file field */}
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

        {/* Form Action Buttons */}
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
          <NextLink href={`/benifits`} passHref>
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {benifitsId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default BenifitsEditForm;
