import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { updateCustomerById } from "./action/customerAction";
import { toast } from "react-toastify";
import PhoneNumberInput from "src/components/phoneInput-field";

const CorporateCustomerEditForm = () => {
  const dispatch = useDispatch();
  const { customerDetails } = useSelector((state) => state.customer);
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const { customerId } = router.query;

  const formik = useFormik({
    initialValues: {
      coustomerId: customerDetails ? customerDetails?.data?.customer?._id : "",
      fullName: customerDetails ? customerDetails?.data?.customer?.fullName : "",
      email: customerDetails ? customerDetails?.data?.customer?.email : "",
      mobileNumber: customerDetails ? customerDetails?.data?.customer?.mobileNumber : "",
    },

    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email().required("Email is required"),
      mobileNumber: Yup.string()
        .required("Mobile Number is required")
        .matches(/^5/, "Mobile number should starts with 5")
        .min(9)
        .max(9),
    }),

    onSubmit: async (values, helpers) => {
      dispatch(updateCustomerById({ id: customerId, data: values }))
        .unwrap()
        .then((res) => {
          if (res?.success) {
            toast("Successfully Edited", {
              type: "success",
            });

            router.push("/customers");
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    },
  });

  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  useEffect(() => {
    if (customerDetails?.data?.customer?.mobileNumber) {
      formik.setFieldValue("mobile", "971" + customerDetails?.data?.customer?.mobileNumber);
    }
  }, [customerDetails?.data?.customer?.mobileNumber]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader title="Edit customer" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                  fullWidth
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  label="Full name"
                  name="fullName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.fullName}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.email}
                  type="email"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <PhoneNumberInput
                  handleMobileNumberChange={handleMobileNumberChange}
                  formik={formik}
                  setIsError={setIsError}
                  isError={isError}
                />
                {isError && formik?.errors?.mobileNumber && (
                  <Typography
                    sx={{
                      mb: 0.5,
                      fontSize: "12px",
                      color: "#d32f2f",
                    }}
                  >
                    {formik?.errors?.mobileNumber}
                  </Typography>
                )}
              </Grid>

              <Grid item md={6} xs={12}></Grid>
            </Grid>
          </CardContent>

          <CardActions
            sx={{
              flexWrap: "wrap",
              m: -1,
            }}
          >
            <Button disabled={formik.isSubmitting} type="submit" sx={{ m: 1 }} variant="contained">
              Update
            </Button>

            <NextLink href={`/customers/${customerId}`} passHref>
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

export default CorporateCustomerEditForm;
