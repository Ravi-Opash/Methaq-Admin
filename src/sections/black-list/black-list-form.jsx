import React, { useEffect, useState } from "react";
import { Button, Card, CardActions, CardContent, Divider, Grid, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import PhoneNumberInput from "src/components/phoneInput-field";
import { createBlackList } from "./action/blackListAction";
import { getCustomerDetailsById } from "../customer/action/customerAction";

const BlackListEditForm = () => {
  const dispatch = useDispatch();
  const { blackListInfo } = useSelector((state) => state.black);
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const { blackListId } = router.query;

  // Fetch customer details when editing a blacklist entry (using useEffect)
  useEffect(() => {
    if (blackListId) {
      dispatch(getCustomerDetailsById(blackListId));
    }
  }, [blackListId]);

  // Formik hook to handle form state and validation
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: blackListInfo ? blackListInfo?.customer?.email : "",
      mobileNumber: blackListInfo ? blackListInfo?.customer?.mobileNumber : "",
    },

    // Yup validation schema for the form fields
    validationSchema: Yup.object({
      email: Yup.string().email(),
      mobileNumber: Yup.string().matches(/^5/, "Mobile number should starts with 5").min(9).max(9),
    }),

    // Form submission handler
    onSubmit: async (values, helpers) => {
      // Create the payload object with the form values
      const payload = {
        email: values?.email.toLowerCase(),
        mobileNumber: values?.mobileNumber,
      };

      // Dispatch action to create or update the blacklist entry
      dispatch(createBlackList({ data: payload }))
        .unwrap()
        .then((res) => {
          if (router?.asPath.split("/").includes("create")) {
            toast("Successfully created black list", {
              type: "success",
            });
          } else {
            toast("Successfully edited black list", {
              type: "success",
            });
          }
          router.push("/black-list");
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    },
  });

  // Handle changes in the mobile number input field
  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  // Set the initial mobile number value when editing an existing entry
  useEffect(() => {
    if (blackListInfo?.customer?.mobileNumber) {
      formik.setFieldValue("mobile", "971" + blackListInfo?.customer?.mobileNumber);
    }
  }, [blackListInfo?.customer?.mobileNumber]);
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
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
            </Grid>
          </CardContent>

          <CardActions
            sx={{
              flexWrap: "wrap",
              m: -1,
            }}
          >
            <Button
              disabled={formik.isSubmitting || (!formik?.values?.email && !formik?.values?.mobileNumber)}
              type="submit"
              sx={{ m: 1 }}
              variant="contained"
            >
              {router?.asPath.split("/").includes("create") ? "Create" : "Update"}
            </Button>

            <NextLink href={`/black-list`} passHref>
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

export default BlackListEditForm;
