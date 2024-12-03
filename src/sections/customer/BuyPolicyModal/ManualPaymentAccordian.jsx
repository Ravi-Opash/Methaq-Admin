import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { Box, Button, Grid, IconButton, TextField, Typography, styled } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import format from "date-fns/format";
import { toast } from "react-toastify";
import Image from "next/image";

const Img = styled(Image)(({ theme }) => ({
  width: "100% !important",
  objectFit: "cover",
  height: "100% !important",
}));

const ManualPaymentAccordian = () => {
  const formik = useFormik({
    initialValues: {
      typeOfPayment: "link",
      dateOfPayment: `${format(new Date(), "dd-MM-yyyy")}`,
    },

    validationSchema: yup
      .object({
        typeOfPayment: yup.string().required("Name is required"),
      })
      .required(),

    onSubmit: async (values, helpers) => {
      //   console.log("values", values);
    },
  });

  const [uploadPaymentProof, setUploadPaymentProof] = useState(null);

  const uploadPaymentProofHandler = (event) => {
    const file = event.target.files[0];
    setUploadPaymentProof(URL.createObjectURL(file));
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              error={Boolean(formik.touched.typeOfPayment && formik.errors.typeOfPayment)}
              helperText={formik.touched.typeOfPayment && formik.errors.typeOfPayment}
              fullWidth
              label="Discount Type"
              name="Type of payment"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              select
              SelectProps={{ native: true }}
              value={formik.values.typeOfPayment}
            >
              {/* {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))} */}

              <option value="link">Link</option>
              <option value="card">Card</option>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              inputFormat="dd-MM-yyyy"
              label="Date of payment"
              onChange={(value) => formik.setFieldValue("createdDate", format(value, "dd-MM-yyyy"))}
              renderInput={(params) => <TextField name="dateOfPayment" fullWidth {...params} />}
              value={formik.values.dateOfPayment}
            />
          </Grid>

          <Grid item xs={6}>
            <Box
              sx={{
                textAlign: "left",
                border: "1px solid #E6E6E6",
                width: "100%",
                height: "161px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {uploadPaymentProof ? (
                <>
                  <Img src={uploadPaymentProof} alt="Preview" width={100} height={100} />
                </>
              ) : (
                <IconButton
                  color="#707070"
                  backgroundColor="none"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  sx={{
                    flexDirection: "column",
                    cursor: "pointer",
                    gap: 3,
                    "&:hover": {
                      background: "none",
                    },
                  }}
                >
                  <input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    onChange={uploadPaymentProofHandler}
                    style={{ display: "none" }}
                  />

                  <Box
                    sx={{
                      width: "48px",
                      height: "48px",
                      opacity: 1,
                      border: "1px solid #E6E6E6",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "0.50rem",
                    }}
                  >
                    {/* <AddIcon sx={{ fontSize: "30px" }} /> */}+
                  </Box>

                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: {
                        xs: "11px",
                        sm: "14px",
                        lg: "16px",
                      },
                      lineHeight: {
                        xs: "13px",
                        sm: "16px",
                        lg: "19px",
                      },
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Upload payment proof
                  </Typography>
                </IconButton>
              )}
            </Box>

            {uploadPaymentProof && (
              <Typography
                variant="subtitle2"
                aria-label="upload picture"
                component="label"
                gutterBottom
                sx={{
                  color: "#707070",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "underline",
                  mt: 0.5,
                  cursor: "pointer",
                }}
              >
                Upload new
                <input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  onChange={uploadPaymentProofHandler}
                  style={{ display: "none" }}
                />
              </Typography>
            )}
          </Grid>
        </Grid>

        <Button disabled={formik.isSubmitting} type="submit" sx={{ mt: 2 }} variant="contained">
          Pay
        </Button>
      </form>
    </>
  );
};

export default ManualPaymentAccordian;
