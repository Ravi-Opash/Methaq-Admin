import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getHealthQuotesPaybles, updateHealthQuote } from "./Action/healthInsuranceAction";
import { QuillEditor } from "src/components/quill-editor";

const EditHealthenefitModal = ({ handleClose, onSubmitHadler, defaultValue }) => {
  const [errors, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      isEnable: true,
      benefitValue: defaultValue || "",
    },

    validationSchema: yup
      .object({
        benefitValue: yup.string().required("Is required"),
      })
      .required(),

    onSubmit: async (values, helpers) => {
      if (values?.benefitValue == "<p><br></p>") {
        setError("Please enter value!");
        return;
      }
      onSubmitHadler(values);
    },
  });

  return (
    <Box sx={{ display: "inline-block", width: "100%" }}>
      <form onSubmit={formik.handleSubmit}>
        <QuillEditor
          onChange={(content) => {
            setError("");
            formik.setFieldValue(`benefitValue`, content);
          }}
          placeholder="Write something"
          sx={{ height: 200, mt: 1 }}
          value={formik.values?.benefitValue}
        />
        <p style={{ color: "red", fontFamily: "12px" }}>{errors}</p>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button disabled={formik.isSubmitting} type="submit" variant="contained">
            Submit
          </Button>

          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditHealthenefitModal;
