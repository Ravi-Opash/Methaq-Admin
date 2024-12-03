import React, { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import format from "date-fns/format";
import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { createDiscountData, editDiscountData, getClubCategotyList } from "../action/partnerAction";
import { FileDropzone } from "src/components/file-dropzone";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";

const DiscountEditForm = () => {
  const dispatch = useDispatch();
  const { discountDetail, categoryList } = useSelector((state) => state.partners);
  const router = useRouter();
  const { discountId, partnerId } = router.query;
  const [newUploadCoverFile, setnewUploadCoverFile] = useState(null);
  const [uploadCoverFileInfo, setUploadCoverFileInfo] = useState(
    discountDetail?.coverImg
      ? {
          filename: discountDetail?.coverImg?.filename,
          size: discountDetail?.coverImg?.size,
        }
      : ""
  );

  const initialized = useRef(false);

  const fetchCategoryList = () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    dispatch(getClubCategotyList())
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const formik = useFormik({
    initialValues: {
      discountType: discountDetail ? discountDetail?.discountType : "percentage",
      discountValue: discountDetail ? discountDetail?.discountValue : "",
      maxDiscount: discountDetail ? discountDetail?.maxDiscount : "",
      discountTitle: discountDetail ? discountDetail?.discountTitle : "",
      category: discountDetail ? discountDetail?.category : "",
      termsNConditions: discountDetail ? discountDetail?.termsNConditions : "",
      description: discountDetail ? discountDetail?.description : "",
      // discountCode: discountDetail ? discountDetail?.discountCode : "",
      coverImg: discountDetail ? discountDetail?.coverImg : "",
      startDate: discountDetail ? discountDetail?.startDate : `${format(new Date(), "dd-MM-yyyy")}`,
      expiryDate: discountDetail
        ? discountDetail?.expiryDate
        : `${format(new Date(), "dd-MM-yyyy")}`,
      useageLimitPerUser: discountDetail ? discountDetail?.useageLimitPerUser : "",
      isActive: discountDetail ? discountDetail?.isActive : true,
    },

    validationSchema: Yup.object({
      discountType: Yup.string().required("Discount type is required"),
      discountValue: Yup.number().required("Discount value is required"),
      useageLimitPerUser: Yup.number().required("Useages limit per user is required"),
      category: Yup.string().required("Category is required"),
      // maxDiscount: Yup.number(),
      discountTitle: Yup.string().required("Voucher title is required"),
      termsNConditions: Yup.string().required("Terms and condition is required"),
      description: Yup.string().required("Description is required"),
      coverImg: Yup.mixed().required("Please select cover image"),
      // discountCode: Yup.string()
      //   .min(4, "Must be exactly 4 digits")
      //   .max(4, "Must be exactly 4 digits")
      //   .required("Voucher code value is required"),
      // createdDate: Yup.date().required("Created date"),
      // expiryDate: Yup.date().required("Expiry date"),
    }),

    onSubmit: async (values, helpers) => {
      // console.log("values", values);

      if (newUploadCoverFile === null) {
        delete values.coverImg;
      }

      let payload;
      if (discountId) {
        payload = jsonToFormData(values);
      } else {
        payload = jsonToFormData({ ...values, partner: partnerId });
      }

      if (discountId) {
        dispatch(
          editDiscountData({
            id: discountId,
            data: payload,
            partner: partnerId,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("res", res);
            if (res?.success) {
              router.push(`/partners/${partnerId}/discount-offers`);
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
        dispatch(createDiscountData(payload))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(`/partners/${partnerId}/discount-offers`);
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
    formik.setFieldValue("coverImg", file);

    setnewUploadCoverFile(file);

    setUploadCoverFileInfo({
      filename: file?.name,
      size: file?.size,
    });
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader title={discountId ? "Edit discount/offer" : "Create discount/offer"} />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.discountType && formik.errors.discountType)}
                  helperText={formik.touched.discountType && formik.errors.discountType}
                  fullWidth
                  label="Discount Type"
                  name="discountType"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.discountType}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixedPrice">Fixed Price</option>
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.discountValue && formik.errors.discountValue)}
                  fullWidth
                  helperText={formik.touched.discountValue && formik.errors.discountValue}
                  label="Discount Value"
                  name="discountValue"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.discountValue}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.discountType === "percentage" ? "%" : "AED"}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(
                    formik.touched.useageLimitPerUser && formik.errors.useageLimitPerUser
                  )}
                  fullWidth
                  type="number"
                  helperText={formik.touched.useageLimitPerUser && formik.errors.useageLimitPerUser}
                  label="Useage Limit Per User"
                  name="useageLimitPerUser"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.useageLimitPerUser}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.maxDiscount && formik.errors.maxDiscount)}
                  fullWidth
                  type="number"
                  helperText={formik.touched.maxDiscount && formik.errors.maxDiscount}
                  label="Maximum Discount"
                  name="maxDiscount"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.maxDiscount}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{"AED"}</InputAdornment>,
                  }}
                />
              </Grid>

              {/* <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.discountCode && formik.errors.discountCode)}
                  fullWidth
                  type="number"
                  helperText={formik.touched.discountCode && formik.errors.discountCode}
                  label="Discount Code"
                  name="discountCode"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.discountCode}
                />
              </Grid> */}

              <Grid item md={6} xs={12}>
                <DatePicker
                  inputFormat="dd-MM-yyyy"
                  label="Start Date"
                  onChange={(value) => {
                    if (value == "Invalid Date" || !value) {
                      return;
                    } else {
                      formik.setFieldValue("startDate", new Date(value)?.toISOString());
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      name="startDate"
                      fullWidth
                      // error={Boolean(formik.touched.startDate && formik.errors.startDate)}
                      // helperText={formik.touched.startDate && formik.errors.startDate}
                      {...params}
                    />
                  )}
                  value={formik.values.startDate}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <DatePicker
                  inputFormat="dd-MM-yyyy"
                  label="Expiry Date"
                  onChange={(value) => {
                    if (value == "Invalid Date" || !value) {
                      return;
                    } else {
                      formik.setFieldValue("expiryDate", new Date(value)?.toISOString());
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      name="expiryDate"
                      fullWidth
                      // error={Boolean(formik.touched.expiryDate && formik.errors.expiryDate)}
                      // helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                      {...params}
                    />
                  )}
                  value={formik.values.expiryDate}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.discountTitle && formik.errors.discountTitle)}
                  fullWidth
                  helperText={formik.touched.discountTitle && formik.errors.discountTitle}
                  label="Discount Title"
                  name="discountTitle"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.discountTitle}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.category && formik.errors.category)}
                  fullWidth
                  helperText={formik.touched.category && formik.errors.category}
                  label="Offer category"
                  name="category"
                  select
                  SelectProps={{ native: true }}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.category}
                >
                  <option value=""></option>
                  {categoryList?.map((category) => (
                    <option value={category?.title}>{category?.title}</option>
                  ))}
                </TextField>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.termsNConditions && formik.errors.termsNConditions)}
                  fullWidth
                  multiline
                  rows={5}
                  helperText={formik.touched.termsNConditions && formik.errors.termsNConditions}
                  label="Terms And Conditions"
                  name="termsNConditions"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.termsNConditions}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.description && formik.errors.description)}
                  fullWidth
                  multiline
                  rows={5}
                  helperText={formik.touched.description && formik.errors.description}
                  label="Description"
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </Grid>

              <Grid item md={12} xs={12}>
                <Typography variant="h6" sx={{ mt: 1, fontSize: "15px" }}>
                  Upload Cover Image
                </Typography>
                <FileDropzone
                  accept={{
                    "image/*": [],
                  }}
                  maxFiles={1}
                  onDrop={handleDropCover}
                />

                {uploadCoverFileInfo && (
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
                        primary={uploadCoverFileInfo?.filename}
                        primaryTypographyProps={{
                          color: "textPrimary",
                          variant: "subtitle2",
                        }}
                        secondary={bytesToSize(uploadCoverFileInfo?.size)}
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
                  {Boolean(formik.touched.coverImg && formik.errors.coverImg)}
                </Typography>
                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                  mt={1}
                >
                  {formik.touched.coverImg && formik.errors.coverImg}
                </Typography>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.isActive}
                      defaultChecked={discountDetail ? discountDetail?.isActive : true}
                    />
                  }
                  label="Is Active"
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions
            sx={{
              flexWrap: "wrap",
              m: -1,
            }}
          >
            <Button disabled={formik.isSubmitting} type="submit" sx={{ m: 1 }} variant="contained">
              {discountId ? "Update" : "Create"}
            </Button>

            <NextLink href={`/partners/${partnerId}/discount-offers`} passHref>
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

export default DiscountEditForm;
