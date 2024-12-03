import { Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

const CardPaymentAccordian = ({ buyQuotationHandler }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },

    validationSchema: yup
      .object({
        name: yup.string().required("Name is required"),
        cardNumber: yup
          .string()
          .required("Card number is required")
          .matches(/^\d{16}$/, "Invalid card number"),
        expiryDate: yup
          .string()
          .required("Expiry date is required")
          .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date"),
        cvv: yup
          .string()
          .required("CVV is required")
          .matches(/^\d{3,4}$/, "Invalid CVV"),
      })
      .required(),

    onSubmit: async (values, helpers) => {
      //   console.log("values", values);
      buyQuotationHandler();
      formik.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Card holder name"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Card number"
            name="cardNumber"
            type="number"
            value={formik.values.cardNumber}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.cardNumber && formik.errors.cardNumber)}
            helperText={formik.touched.cardNumber && formik.errors.cardNumber}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Expiry Date"
            placeholder="MM/YY"
            fullWidth
            name="expiryDate"
            value={formik.values.expiryDate}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.expiryDate && formik.errors.expiryDate)}
            helperText={formik.touched.expiryDate && formik.errors.expiryDate}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="CVV"
            name="cvv"
            value={formik.values.cvv}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="text"
            error={Boolean(formik.touched.cvv && formik.errors.cvv)}
            helperText={formik.touched.cvv && formik.errors.cvv}
          />
        </Grid>
      </Grid>

      <Button disabled={formik.isSubmitting} type="submit" sx={{ mt: 2 }} variant="contained">
        Pay
      </Button>
    </form>
  );
};

export default CardPaymentAccordian;
