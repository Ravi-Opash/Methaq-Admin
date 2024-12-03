import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Box, Button, CardHeader, Divider, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { DatePicker } from "@mui/x-date-pickers";
import format from "date-fns/format";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getCustomerQuotationDetailById } from "../customer/action/customerAction";
import { EditInProposalCustomerDetailsById } from "../Proposals/Action/proposalsAction";
import PhoneNumberInput from "src/components/phoneInput-field";

const EditCustomerDetailsQuotationModal = ({ handleEditModalClose }) => {
  const dispatch = useDispatch();
  const { proposalDetail } = useSelector((state) => state.proposals);
  const { customerQuotationDetails } = useSelector((state) => state.customer);
  const [isError, setIsError] = useState(false);

  const router = useRouter();
  const { quotationId } = router.query;

  // console.log("customerQuotationDetails", customerQuotationDetails);

  const formik = useFormik({
    initialValues: {
      fullName: customerQuotationDetails?.userId?.fullName
        ? customerQuotationDetails?.userId?.fullName
        : "",
      email: customerQuotationDetails?.userId?.email ? customerQuotationDetails?.userId?.email : "",
      mobileNumber: customerQuotationDetails?.userId?.mobileNumber
        ? customerQuotationDetails?.userId?.mobileNumber
        : "",
      licenceNo: customerQuotationDetails?.userId?.licenceNo
        ? customerQuotationDetails?.userId?.licenceNo
        : "",
      nationality: customerQuotationDetails?.userId?.nationality
        ? customerQuotationDetails?.userId?.nationality
        : "",
      dateOfBirth: customerQuotationDetails?.userId?.dateOfBirth
        ? customerQuotationDetails?.userId?.dateOfBirth
        : "",
      licenceIssueDate: customerQuotationDetails?.userId?.licenceIssueDate
        ? customerQuotationDetails?.userId?.licenceIssueDate
        : "",
      licenceExpiryDate: customerQuotationDetails?.userId?.licenceExpiryDate
        ? customerQuotationDetails?.userId?.licenceExpiryDate
        : "",
    },

    validationSchema: yup.object({
      fullName: yup.string().required("Full name is required"),
      email: yup.string().email().required("Email is required"),
      mobileNumber: yup
        .string()
        .required("Mobile Number is required")
        .matches(/^5/, "Mobile number should starts with 5")
        .min(9)
        .max(9),
      // yup
      //   .string()
      //   .matches(/^(50|51|52|55|56|58|2|3|4|6|7|9)\d{9}$/, "Phone number is not valid"),
    }),

    onSubmit: async (values, helpers) => {
      // console.log("values", values);
      if (customerQuotationDetails?.userId?._id) {
        dispatch(
          EditInProposalCustomerDetailsById({
            id: customerQuotationDetails?.userId?._id,
            data: values,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("res", res);
            if (res?.success) {
              toast("Successfully Edited", {
                type: "success",
              });
              dispatch(getCustomerQuotationDetailById(quotationId));
              handleEditModalClose();
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

  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  useEffect(() => {
    if (customerQuotationDetails?.userId?.mobileNumber) {
      formik.setFieldValue("mobile", "971" + customerQuotationDetails?.userId?.mobileNumber);
    }
  }, [customerQuotationDetails?.userId?.mobileNumber]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <CardHeader title="Edit customer" sx={{ p: 0, mb: 2 }} />
        <Divider />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              error={Boolean(formik.touched.fullName && formik.errors.fullName)}
              fullWidth
              helperText={formik.touched.fullName && formik.errors.fullName}
              label="Full name"
              name="fullName"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.fullName}
            />
          </Grid>

          <Grid item xs={6}>
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

          <Grid item xs={6}>
            {/* <TextField
              error={Boolean(formik.touched.mobileNumber && formik.errors.mobileNumber)}
              fullWidth
              helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
              label="Phone number"
              name="mobileNumber"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.mobileNumber}
            /> */}
            <PhoneNumberInput
              handleMobileNumberChange={handleMobileNumberChange}
              formik={formik}
              setIsError={setIsError}
              isError={isError}
              boxMargin={0}
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

          <Grid item xs={6}>
            <TextField
              fullWidth
              //   error={Boolean(formik.touched.licenceNo && formik.errors.licenceNo)}
              //   helperText={formik.touched.licenceNo && formik.errors.licenceNo}
              label="Licence no"
              name="licenceNo"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.licenceNo}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              //   error={Boolean(formik.touched.nationality && formik.errors.nationality)}
              //   helperText={formik.touched.nationality && formik.errors.nationality}
              label="Nationality"
              name="nationality"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.nationality}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              inputFormat="dd-MM-yyyy"
              label="Date Of Birth"
              onChange={(value) => formik.setFieldValue("dateOfBirth", format(value, "dd-MM-yyyy"))}
              renderInput={(params) => (
                <TextField name="dateOfBirth" fullWidth {...params} error={false} />
              )}
              value={formik.values.dateOfBirth}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              inputFormat="dd-MM-yyyy"
              label="Licence Issue Date"
              onChange={(value) =>
                formik.setFieldValue("licenceIssueDate", format(value, "dd-MM-yyyy"))
              }
              renderInput={(params) => (
                <TextField name="licenceIssueDate" fullWidth {...params} error={false} />
              )}
              value={formik.values.licenceIssueDate}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePicker
              inputFormat="dd-MM-yyyy"
              label="Licence Expiry Date"
              onChange={(value) =>
                formik.setFieldValue("licenceExpiryDate", format(value, "dd-MM-yyyy"))
              }
              renderInput={(params) => (
                <TextField name="licenceExpiryDate" fullWidth {...params} error={false} />
              )}
              value={formik.values.licenceExpiryDate}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button disabled={formik.isSubmitting} type="submit" variant="contained">
            Update
          </Button>

          <Button variant="outlined" type="button" onClick={() => handleEditModalClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default EditCustomerDetailsQuotationModal;
