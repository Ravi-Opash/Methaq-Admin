import { Autocomplete, Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { EditCarDetails, submitMotorCustomerKYC } from "./Action/proposalsAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setProposalDetail } from "./Reducer/proposalsSlice";

function ExtraDetailForm({ setIsLoading, options = [] }) {
  const dispatch = useDispatch();
  const { proposalDetail } = useSelector((state) => state.proposals);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bank: proposalDetail?.car?.bank || "",
    },

    validationSchema: Yup.object({
      bank: Yup.string().required("Required"),
    }),

    onSubmit: (values, helpers) => {
      console.log(values);
      setIsLoading(true);

      dispatch(EditCarDetails({ id: proposalDetail?.car?._id, data: values }))
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          if (proposalDetail) {
            dispatch(setProposalDetail({ ...proposalDetail, car: res?.data }));
          }
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
          Extra Details
        </Typography>
      </Box>
      <Card sx={{ borderRadius: "0 0 10px 10px", p: { xs: 1, md: 2 } }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container rowSpacing={2} columnSpacing={4}>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: 13, sm: 14 }, ml: 0.5 }}>Bank</Typography>
              <Autocomplete
                sx={{ maxWidth: 500 }}
                id="bank"
                options={options}
                loading={false}
                value={formik.values.bank}
                onChange={(e, value) => {
                  formik.setFieldValue("bank", value);

                  if (!value) {
                    formik.setFieldValue("bank", "");
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bank"
                    error={Boolean(formik.touched.bank && formik.errors.bank)}
                    helperText={formik.touched.bank && formik.errors.bank}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                    }}
                  />
                )}
              />
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

export default ExtraDetailForm;
