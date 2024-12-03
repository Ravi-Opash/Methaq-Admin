import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getHealthQuotesPaybles, updateHealthQuote } from "./Action/healthInsuranceAction";

const AddLoadingPremiumNoteModal = ({ handleClose, id, defaultValue }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      loadingReason: defaultValue || "",
    },

    validationSchema: yup
      .object({
        loadingReason: yup.string().required("Note is required"),
      })
      .required(),

    onSubmit: async (values, helpers) => {
      dispatch(updateHealthQuote({ id: id, data: values }))
        .unwrap()
        .then((res) => {
          if (res) {
            dispatch(getHealthQuotesPaybles(id));
            handleClose();
            formik.resetForm();
            toast.success("Successfully added loading reason!")
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          formik.resetForm();
        });
    },
  });

  return (
    <Box sx={{ display: "inline-block", width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          multiline
          rows={2}
          error={Boolean(formik.touched.loadingReason && formik.errors.loadingReason)}
          fullWidth
          helperText={formik.touched.loadingReason && formik.errors.loadingReason}
          label="Reason for loading premium"
          name="loadingReason"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.loadingReason}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button disabled={formik.isSubmitting} type="submit" variant="contained">
            Add Reason
          </Button>

          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddLoadingPremiumNoteModal;
