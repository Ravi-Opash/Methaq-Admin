import {
  Alert,
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import AnimationLoader from "src/components/amimated-loader";
import { toast } from "react-toastify";
import { getHealthQuotesPaybles, updateQuoteDetails } from "./Action/healthInsuranceAction";
import { dateFormate } from "src/utils/date-formate";

const CreditDebitUpload = ({ handleClose, quoteId, proposalId, insurerName = "" }) => {
  const dispatch = useDispatch();
  const [uploadTextInfo, setUploadTextInfo] = useState("");
  const [uploadDebitInfo, setUploadDebitInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const initialValues = {
    taxInfo: "",
    creditFile: "",
    texInfoNoteNumber: "",
    creditNoteNumber: "",
    textInfoNoteDate: "",
    creditNoteDate: "",
  };

  // Function to handle form submission and update quote details
  const handleSubmit = (values) => {
    setLoading(true);
    let payload = {
      ...values,
      textInfoNoteDate: dateFormate(values?.textInfoNoteDate),
      creditNoteDate: dateFormate(values?.creditNoteDate),
    };
    // Convert form data to form-data format before sending
    payload = jsonToFormData(payload);
    if (values) {
      dispatch(updateQuoteDetails({ quoteId: quoteId, data: payload }))
        .then((res) => {
          toast.success("Uploaded Successfully");
          dispatch(getHealthQuotesPaybles(quoteId));
          setLoading(false);
          handleClose();
        })
        .catch((err) => {
          setLoading(false);
          console.log(err, "err");
        });
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      taxInfo: Yup.mixed().required("Please Upload Text File"),
      creditFile: Yup.mixed().required("Please Upload Debit File"),
      texInfoNoteNumber: Yup.string().required("Required"),
      creditNoteNumber: Yup.string().required("Required"),
      textInfoNoteDate: Yup.date().required("Required"),
      creditNoteDate: Yup.date().required("Required"),
    }),
    onSubmit: handleSubmit,
  });

  // Handler for uploading the text invoice file (PDF only)
  const handleDropTextInvoice = async ([file]) => {
    console.log(file, "file");
    if (file?.type != "application/pdf") {
      toast.error("Please Upload Pdf File Only");
      return;
    }

    setUploadTextInfo({
      filename: file?.name,
      size: file?.size,
    });

    formik.setFieldValue("taxInfo", file);
  };
  
  // Set uploaded debit file info (filename and size)
  const handleDropDebit = async ([file]) => {
    if (file?.type != "application/pdf") {
      toast.error("Please Upload Pdf File Only");
      return;
    }

    setUploadDebitInfo({
      filename: file?.name,
      size: file?.size,
    });

    formik.setFieldValue("creditFile", file);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <AnimationLoader open={true} />
          </Box>
        )}
        <Alert severity="error">Please upload Tax invoice and Credit note!. </Alert>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Card
            sx={{
              cursor: "pointer",
              width: "100%",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "20px", mt: "10px" }}
            >
              <Typography variant="h6">Tax invoice & Credit note</Typography>
              <Box onClick={() => handleClose()}>
                <CloseIcon />
              </Box>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>File</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <>
                  <TableRow sx={{ cursor: "default" }}>
                    <TableCell>Tax Invoice</TableCell>
                    <TableCell>
                      {" "}
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Date"
                        onChange={(value) => {
                          if (value == "Invalid Date" || value === null) {
                            formik.setFieldValue("textInfoNoteDate", "");
                          } else {
                            formik.setFieldValue("textInfoNoteDate", value);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            name="textInfoNoteDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.textInfoNoteDate && formik.errors.textInfoNoteDate)}
                            helperText={formik.touched.textInfoNoteDate && formik.errors.textInfoNoteDate}
                          />
                        )}
                        value={formik.values.textInfoNoteDate || ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        error={Boolean(formik.touched.texInfoNoteNumber && formik.errors.texInfoNoteNumber)}
                        fullWidth
                        helperText={formik.touched.texInfoNoteNumber && formik.errors.texInfoNoteNumber}
                        label="Tax Invoice"
                        name="texInfoNoteNumber"
                        type="string"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.texInfoNoteNumber}
                      />
                    </TableCell>
                    <TableCell sx={{ cursor: "pointer" }}>
                      {" "}
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Box>
                          <CheckCircleIcon sx={{ color: uploadTextInfo ? "#00FF00" : "#707070", fontSize: 20 }} />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          aria-label="upload picture"
                          component="label"
                          gutterBottom
                          sx={{
                            fontSize: 14,
                            width: "max-content",
                            cursor: "pointer",
                            "&:hover": {
                              color: "#60176f",
                              textDecoration: "underline",
                              textUnderlineOffset: "3px",
                            },
                          }}
                        >
                          <input
                            accept=".pdf"
                            id="image-upload"
                            type="file"
                            onChange={(e) => handleDropTextInvoice(e.target.files)}
                            style={{ display: "none" }}
                          />
                          Upload
                        </Typography>
                      </Box>
                      {uploadTextInfo && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: 12,
                            width: "max-content",
                          }}
                        >
                          {uploadTextInfo.filename}
                        </Typography>
                      )}
                      {formik.touched.taxInfo && formik.errors.taxInfo && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "#F04438",
                          }}
                        >
                          {formik.errors?.taxInfo}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                </>
              </TableBody>
              <TableBody>
                <>
                  <TableRow sx={{ cursor: "default" }}>
                    <TableCell>Credit Note</TableCell>
                    <TableCell>
                      {" "}
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Date"
                        onChange={(value) => {
                          if (value == "Invalid Date" || value === null) {
                            formik.setFieldValue("creditNoteDate", "");
                          } else {
                            formik.setFieldValue("creditNoteDate", value);
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            name="creditNoteDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.creditNoteDate && formik.errors.creditNoteDate)}
                            helperText={formik.touched.creditNoteDate && formik.errors.creditNoteDate}
                          />
                        )}
                        value={formik.values.creditNoteDate || ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        error={Boolean(formik.touched.creditNoteNumber && formik.errors.creditNoteNumber)}
                        fullWidth
                        helperText={formik.touched.creditNoteNumber && formik.errors.creditNoteNumber}
                        label="Credit Note Number"
                        type="string"
                        name="creditNoteNumber"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.creditNoteNumber}
                      />
                    </TableCell>
                    <TableCell sx={{ cursor: "pointer" }}>
                      {" "}
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Box>
                          <CheckCircleIcon sx={{ color: uploadDebitInfo ? "#00FF00" : "#707070", fontSize: 20 }} />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          aria-label="upload picture"
                          component="label"
                          gutterBottom
                          sx={{
                            fontSize: 14,
                            width: "max-content",
                            cursor: "pointer",
                            "&:hover": {
                              color: "#60176f",
                              textDecoration: "underline",
                              textUnderlineOffset: "3px",
                            },
                          }}
                        >
                          <input
                            accept=".pdf"
                            id="image-upload"
                            type="file"
                            onChange={(e) => handleDropDebit(e.target.files)}
                            style={{ display: "none" }}
                          />
                          Upload
                        </Typography>
                      </Box>
                      {uploadDebitInfo && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: 12,
                            width: "max-content",
                          }}
                        >
                          {uploadDebitInfo.filename}
                        </Typography>
                      )}
                      {formik.touched.creditFile && formik.errors.creditFile && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "#F04438",
                          }}
                        >
                          {formik.errors?.creditFile}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                </>
              </TableBody>
            </Table>
          </Card>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button type="submit" variant="contained">
            Submit
          </Button>

          <Button variant="outlined" type="button" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default CreditDebitUpload;
