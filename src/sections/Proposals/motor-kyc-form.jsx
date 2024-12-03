import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import PhoneInputs from "src/components/phoneInput";
import * as Yup from "yup";
import { getNationalities, submitMotorCustomerKYC } from "./Action/proposalsAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setProposalDetail } from "./Reducer/proposalsSlice";

function MotorKYCForm({ setIsLoading }) {
  const dispatch = useDispatch();
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const { proposalDetail } = useSelector((state) => state.proposals);

  const searchNationalities = () => {
    dispatch(getNationalities({}))
      .unwrap()
      .then((res) => {
        setNationalityOptions(res.data);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        console.error(err);
      });
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    searchNationalities();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: proposalDetail?.customer?.fullName || "",
      email: proposalDetail?.customer?.email || "",
      mobileNumber: proposalDetail?.customer?.mobileNumber || "",
      nationality: proposalDetail?.customer?.nationality || "",
      sourceOfFunds: proposalDetail?.customer?.sourceOfFunds || "",
      politicallyExposed: proposalDetail?.customer?.politicallyExposed || false,
    },

    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      email: Yup.string().required("Required"),
      nationality: Yup.string().required("Required"),
      sourceOfFunds: Yup.string().required("Required"),
      politicallyExposed: Yup.boolean().required("Required"),
      mobileNumber: Yup.string().matches(/^5/, "Mobile number should starts with 5").min(9).max(9).required("Required"),
    }),

    onSubmit: (values, helpers) => {
      console.log(values);
      setIsLoading(true);

      dispatch(submitMotorCustomerKYC({ userId: proposalDetail?.customer?._id, data: values }))
        .unwrap()
        .then((res) => {
          dispatch(setProposalDetail({ ...proposalDetail, customer: res?.data }));
          setIsLoading(false);
          toast.success("Successfully Submited!");
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err, "err");
          toast.error(err);
        });
    },
  });

  return (
    <Box
      id={"motor-kyc-form"}
      sx={{
        display: "inline-block",
        width: "100%",
        my: 3,
        borderRadius: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: "10px 10px 0 0",
        }}
      >
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            py: 1.5,
            mb: 0,
            fontWeight: "600",
            fontSize: "18px",
            display: "inline-block",
            color: "#60176F",
            px: "14px",
          }}
        >
          KYC Form
        </Typography>
      </Box>
      <Card sx={{ borderRadius: "0 0 10px 10px", p: { xs: 1, md: 2 } }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={2} columnSpacing={4}>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, sm: 14 }, ml: 0.3 }}>
                Client / Customers's Full Name
              </Typography>
              <TextField
                error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                fullWidth
                helperText={formik.touched.fullName && formik.errors.fullName}
                label="Client / Customers's Full Name"
                name="fullName"
                id="fullName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.fullName}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, sm: 14 }, ml: 0.3 }}>Mobile Number</Typography>
              <PhoneInputs formik={formik} label={""} />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, sm: 14 }, ml: 0.3 }}>Email Address</Typography>
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email Address"
                name="email"
                id="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                type="email"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, sm: 14 }, ml: 0.3 }}>Nationality</Typography>
              <Autocomplete
                id="nationality"
                options={nationalityOptions}
                loading={false}
                value={formik.values.nationality}
                onChange={(e, value) => {
                  formik.setFieldValue("nationality", value);

                  if (!value) {
                    formik.setFieldValue("nationality", "");
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nationality"
                    error={Boolean(formik.touched.nationality && formik.errors.nationality)}
                    helperText={formik.touched.nationality && formik.errors.nationality}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, sm: 14 }, ml: 0.3 }}>
                Please select the source of funds to pay premium for this policy
              </Typography>
              <TextField
                fullWidth
                label="Source of funds"
                placeholder="Please Select"
                error={Boolean(formik.touched.sourceOfFunds && formik.errors.sourceOfFunds)}
                helperText={formik.touched.sourceOfFunds && formik.errors.sourceOfFunds}
                name="sourceOfFunds"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                select
                SelectProps={{ native: true }}
                value={formik?.values?.sourceOfFunds}
              >
                <option value={""}></option>
                <option value={"Ownership of a business/self-employed"}>
                  {"Ownership of a business/self-employed"}
                </option>
                <option value={"Employment/Salaried"}>{"Employment/Salaried"}</option>
                <option value={"Inheritance"}>{"Inheritance"}</option>
                <option value={"Investment"}>{"Investment"}</option>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, sm: 14 }, ml: 0.3 }}>
                Politically Exposed Person (PEP)
              </Typography>
              <FormControl
                sx={{
                  ml: 3,
                }}
              >
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="politicallyExposed"
                  id="politicallyExposed"
                  value={formik?.values?.politicallyExposed}
                  onChange={formik.handleChange}
                  onBlur={formik?.handleBlur}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio size="small" />}
                    label={<Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>Yes</Typography>}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio size="small" />}
                    label={<Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>No</Typography>}
                  />
                </RadioGroup>
                {formik?.touched?.politicallyExposed && (
                  <FormHelperText>{formik?.errors?.politicallyExposed}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}

export default MotorKYCForm;
