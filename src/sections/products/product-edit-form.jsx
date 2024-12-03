import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { QuillEditor } from "src/components/quill-editor";
import { FileDropzone } from "src/components/file-dropzone";
import { fileToBase64 } from "src/utils/file-to-base64";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { createProductData, editProductData } from "./action/productAction";
import { toast } from "react-toastify";

const ProductEditForm = () => {
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state.products);
  const router = useRouter();
  const { productId } = router.query;

  const [newUploadFile, setnewUploadFile] = useState(null);
  const [uploadFileInfo, setUploadFileInfo] = useState(
    productDetail
      ? {
          filename: productDetail?.icon?.filename,
          size: productDetail?.icon?.size,
        }
      : ""
  );

  //   console.log("productDetail", productDetail);
  //   console.log("uploadFileInfo", uploadFileInfo);

  const formik = useFormik({
    initialValues: {
      productName: productDetail ? productDetail?.productName : "",
      description: productDetail ? productDetail?.description : "",
      file: productDetail ? productDetail?.icon : "",
      price: productDetail ? productDetail?.price : "",
      // currency: productDetail ? productDetail?.currency : "AED",
      isActive: productDetail ? productDetail?.isActive : true,
    },

    validationSchema: Yup.object({
      productName: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      file: Yup.mixed().required("Please select file"),
      price: Yup.number().required("Price is required"),
    }),

    onSubmit: (values, helpers) => {
      // console.log("values", values);

      if (newUploadFile === null) {
        delete values.file;
      }

      const formData = jsonToFormData(values);

      if (productId) {
        dispatch(editProductData({ id: productId, data: formData }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              toast("Successfully Updated", {
                type: "success",
              });
              router.push("/products");
            }
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      } else {
        dispatch(createProductData(formData))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              toast("Successfully Created", {
                type: "success",
              });
              formik.resetForm();
              router.push("/products");
            }
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
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
                  error={Boolean(formik.touched.productName && formik.errors.productName)}
                  fullWidth
                  helperText={formik.touched.productName && formik.errors.productName}
                  label="Product Name"
                  name="productName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.productName}
                />

                <Box mt={3}>
                  <TextField
                    error={Boolean(formik.touched.description && formik.errors.description)}
                    fullWidth
                    helperText={formik.touched.description && formik.errors.description}
                    label="Product description"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </Box>

                {/* <Typography
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    mt: 3,
                  }}
                  variant="subtitle2"
                >
                  Description
                </Typography> */}

                {/* <QuillEditor
                  onChange={(value) => {
                    formik.setFieldValue("description", value);
                  }}
                  placeholder="Write something"
                  sx={{ height: 400 }}
                  value={formik.values.description}
                /> */}

                {/* {Boolean(formik.touched.description && formik.errors.description) && (
                  <Box sx={{ mt: 2 }}>
                    <FormHelperText error>{formik.errors.description}</FormHelperText>
                  </Box>
                )} */}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <Typography variant="h6">Images</Typography>
                <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                  Images will appear in the store front of your website.
                </Typography>
              </Grid>
              <Grid item md={8} xs={12}>
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
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <Typography variant="h6">Pricing</Typography>
              </Grid>
              <Grid item md={8} xs={12}>
                <TextField
                  error={Boolean(formik.touched.price && formik.errors.price)}
                  fullWidth
                  label="Price"
                  name="price"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.price}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* <Card sx={{ mt: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <Typography variant="h6">Currency</Typography>
              </Grid>
              <Grid item md={8} xs={12}>
                <TextField
                  error={Boolean(formik.touched.currency && formik.errors.currency)}
                  fullWidth
                  label="Currency"
                  name="currency"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currency}
                  disabled
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card> */}

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <Typography variant="h6">Active</Typography>
              </Grid>
              <Grid item md={8} xs={12}>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="isActive"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.isActive}
                        defaultChecked={productDetail ? productDetail?.isActive : true}
                      />
                    }
                    label="Is Active"
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
          <NextLink href={`/products`} passHref>
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained">
            {productId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default ProductEditForm;
