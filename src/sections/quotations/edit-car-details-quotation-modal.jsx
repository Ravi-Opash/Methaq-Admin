import React from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Box, Button, CardHeader, Divider, Grid } from "@mui/material";

const EditCarDetailsQuotationModal = ({ handleCarEditModalClose }) => {
  const formik = useFormik({
    initialValues: {},

    validationSchema: {},

    onSubmit: async (values, helpers) => {
      // console.log("values", values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <CardHeader title="Edit car details" sx={{ p: 0, mb: 2 }} />
        <Divider />

        <Grid container spacing={2}>
          <Grid item xs={12}></Grid>
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

          <Button variant="outlined" type="button" onClick={() => handleCarEditModalClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default EditCarDetailsQuotationModal;
