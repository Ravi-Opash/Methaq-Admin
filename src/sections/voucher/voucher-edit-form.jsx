import React from "react";
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
  Switch,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import format from "date-fns/format";
import { DatePicker } from "@mui/x-date-pickers";
import { addVoucher, editVoucherById } from "./action/voucherAction";
import { toast } from "react-toastify";
import { endOfDay } from "date-fns";

const VoucherEditForm = () => {
  const dispatch = useDispatch();
  const { voucherDetail } = useSelector((state) => state.voucher);
  const router = useRouter();
  const { voucherId } = router.query;

  // Formik hook to manage form state, validation, and submission
  const formik = useFormik({
    initialValues: {
      // Initial form values based on voucher details if present
      promoCode: voucherDetail ? voucherDetail?.promoCode : "",
      discountType: voucherDetail ? voucherDetail?.discountType : "percentage",
      discountValue: voucherDetail ? voucherDetail?.discountValue : "",
      createdDate: voucherDetail ? voucherDetail?.createdDate : ``,
      expiryDate: voucherDetail ? voucherDetail?.expiryDate : `${format(new Date(), "dd-MM-yyyy")}`,
      isActive: voucherDetail ? voucherDetail?.isActive : true,
      isDefault: voucherDetail?.isDefault ? voucherDetail?.isDefault : false,
    },

    // Yup validation schema to ensure data integrity
    validationSchema: Yup.object({
      promoCode: Yup.string().required("Promo code is required"),
      discountType: Yup.string().required("Discount type is required"),
      discountValue: Yup.number().required("Discount value is required"),
      createdDate: Yup.date().typeError("Created date is required").required("Created date is required"),
      expiryDate: Yup.date().typeError("Expiry date is required").required("Expiry date is required"),
    }),

    // Handle form submission
    onSubmit: async (values, helpers) => {
      const payload = {
        ...values,
        createdDate: new Date(endOfDay(new Date(values?.createdDate))).toISOString(),
        expiryDate: new Date(endOfDay(new Date(values?.expiryDate))).toISOString(),
      };

      // Check if the voucherId exists (if editing an existing voucher)
      if (voucherId) {
        dispatch(
          editVoucherById({
            id: voucherId,
            data: payload,
          })
        )
          .unwrap()
          .then((res) => {
            // Handle success response
            if (res?.success) {
              router.push("/vouchers");
              toast("Successfully Edited", { type: "success" });
            }
          })
          .catch((err) => {
            toast(err, { type: "error" });
          });
      } else {
        // If no voucherId, create a new voucher
        dispatch(addVoucher(values))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push("/vouchers");
              toast("Successfully Created", { type: "success" });
            }
          })
          .catch((err) => {
            toast(err, { type: "error" });
          });
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader title={voucherId ? "Edit voucher" : "Create voucher"} />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              {/* Promo Code Input */}
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.promoCode && formik.errors.promoCode)}
                  fullWidth
                  helperText={formik.touched.promoCode && formik.errors.promoCode}
                  label="Promo Code"
                  name="promoCode"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.promoCode}
                />
              </Grid>

              {/* Discount Type Input (select between percentage or fixedPrice) */}
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

              {/* Discount Value Input (number with unit based on discount type) */}
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

              {/* Created Date Picker */}
              <Grid item md={6} xs={12}>
                <DatePicker
                  inputFormat="dd-MM-yyyy"
                  label="Created Date"
                  value={formik.values.createdDate}
                  onChange={(value) => formik.setFieldValue("createdDate", value)}
                  renderInput={(params) => (
                    <TextField
                      name="createdDate"
                      fullWidth
                      {...params}
                      helperText={formik.touched.createdDate && formik.errors.createdDate}
                      error={formik.touched.createdDate && formik.errors.createdDate}
                    />
                  )}
                />
              </Grid>

              {/* Expiry Date Picker */}
              <Grid item md={6} xs={12}>
                <DatePicker
                  inputFormat="dd-MM-yyyy"
                  label="Expiry Date"
                  value={formik.values.expiryDate}
                  onChange={(value) => formik.setFieldValue("expiryDate", value)}
                  renderInput={(params) => (
                    <TextField
                      name="expiryDate"
                      fullWidth
                      {...params}
                      error={formik.touched?.expiryDate && formik.errors?.expiryDate}
                      helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                    />
                  )}
                />
              </Grid>

              {/* Is Active Switch (toggle whether the voucher is active) */}
              <Grid item md={3} xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.isActive}
                      defaultChecked={voucherDetail ? voucherDetail?.isActive : true}
                    />
                  }
                  label="Is Active"
                />
              </Grid>

              {/* Is Default Switch (toggle whether the voucher is the default voucher) */}
              <Grid item md={3} xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isDefault"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.isDefault}
                      defaultChecked={voucherDetail ? voucherDetail?.isDefault : false}
                    />
                  }
                  label="Is Default"
                />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions sx={{ flexWrap: "wrap", m: -1 }}>
            {/* Submit button (Create or Update voucher) */}
            <Button disabled={formik.isSubmitting} type="submit" sx={{ m: 1 }} variant="contained">
              {voucherId ? "Update" : "Create"}
            </Button>

            {/* Cancel button to navigate back to voucher list */}
            <NextLink href={`/vouchers`} passHref>
              <Button component="a" disabled={formik.isSubmitting} sx={{ m: 1, mr: "auto" }} variant="outlined">
                Cancel
              </Button>
            </NextLink>
          </CardActions>
        </Card>
      </form>
    </>
  );
};

export default VoucherEditForm;
