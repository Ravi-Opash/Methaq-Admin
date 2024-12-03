import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { CircleFill } from "src/Icons/CircleFill";
import DownloadIcon from "@mui/icons-material/Download";
import { DatePicker } from "@mui/x-date-pickers";

const ViewHealthPolicyModal = ({ handleEditPolicyNoClose, customerPolicyDetails, keyName }) => {
  const router = useRouter();

  const [customFileArray, setCustomFileArray] = useState(
    customerPolicyDetails?.custom ? [...customerPolicyDetails?.custom] : []
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyPolicyNumber: customerPolicyDetails?.companyPolicyNumber || "",
      policy: customerPolicyDetails?.policyFile || "",
      healthCertificate: customerPolicyDetails?.healthCertificate || "",
      medicalCard: customerPolicyDetails?.medicalCard || "",
      paymentReceipt: customerPolicyDetails?.paymentReceipt || "",
      custom: customerPolicyDetails?.custom || "",
      effectivedate: customerPolicyDetails?.activeEffectiveDate || "",
    },

    onSubmit: async (values) => {},
  });

  //For Download File
  const downloadFile = (fileUrl) => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    let downloadLink = `${baseURL}/${fileUrl}`;
    const link = document.createElement("a");
    link.href = downloadLink;
    link.setAttribute("rel", "noopener noreferrer");
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <CardHeader title="View policy PDF" sx={{ p: 0, mb: 1 }} />

      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          color: "#707070",
          fontSize: "13px",
          fontWeight: "500",
          cursor: "pointer",
          mb: 1,
        }}
      >
        {`Ref Number ${customerPolicyDetails?.policyNumber}`}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={Boolean(formik.touched.companyPolicyNumber && formik.errors.companyPolicyNumber)}
            fullWidth
            helperText={formik.touched.companyPolicyNumber && formik.errors.companyPolicyNumber}
            label="Insurance Company Policy Number "
            disabled={true}
            name="companyPolicyNumber"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.companyPolicyNumber}
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Policy</Box>
                  </TableCell>
                  <TableCell>
                    {customerPolicyDetails?.policyFile && (
                      <DownloadIcon
                        sx={{ color: "#60176F", cursor: "pointer" }}
                        onClick={() => downloadFile(customerPolicyDetails?.policyFile?.path)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                      <CircleFill
                        sx={{
                          color: formik.values.policy ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                          fontSize: "22px",
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      Certificate of health insurance (COC)
                    </Box>
                  </TableCell>
                  <TableCell>
                    {customerPolicyDetails?.healthCertificate && (
                      <DownloadIcon
                        sx={{ color: "#60176F", cursor: "pointer" }}
                        onClick={() => downloadFile(customerPolicyDetails?.healthCertificate?.path)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                      <CircleFill
                        sx={{
                          color: formik.values.healthCertificate ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                          fontSize: "22px",
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Medical E-card</Box>
                  </TableCell>
                  <TableCell>
                    {customerPolicyDetails?.medicalCard && (
                      <DownloadIcon
                        sx={{ color: "#60176F", cursor: "pointer" }}
                        onClick={() => downloadFile(customerPolicyDetails?.medicalCard?.path)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                      <CircleFill
                        sx={{
                          color: formik.values.medicalCard ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                          fontSize: "22px",
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Payment Receipt</Box>
                  </TableCell>
                  <TableCell>
                    {customerPolicyDetails?.paymentReceipt && (
                      <DownloadIcon
                        sx={{ color: "#60176F", cursor: "pointer" }}
                        onClick={() => downloadFile(customerPolicyDetails?.paymentReceipt?.path)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                      <CircleFill
                        sx={{
                          color: formik?.values?.paymentReceipt ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                          fontSize: "22px",
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
                {customFileArray?.map((ele, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {formik.values.custom?.[idx]?.customFileName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {customerPolicyDetails?.custom?.[idx]?.customFile && (
                          <DownloadIcon
                            sx={{ color: "#60176F", cursor: "pointer" }}
                            onClick={() => downloadFile(customerPolicyDetails?.custom?.[idx]?.customFile)}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                          <CircleFill
                            sx={{
                              color: formik.values.custom?.[idx]?.customFile ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                              fontSize: "22px",
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </Grid>
        <Grid item xs={11} md={6} mt={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                marginTop: "5px",
                maxWidth: "80%",
              }}
            >
              <DatePicker
                inputFormat="dd-MM-yyyy"
                label="Policy Effective Date"
                value={formik.values?.effectivedate}
                onChange={(value) => {
                  formik.setFieldValue("effectivedate", value, true);
                }}
                disabled={true}
                renderInput={(params) => (
                  <TextField
                    name={"effectivedate"}
                    fullWidth
                    {...params}
                    helperText={formik.touched?.effectivedate && formik.errors?.effectivedate}
                    error={formik.touched?.effectivedate && formik.errors?.effectivedate}
                  />
                )}
              />
            </Box>
          </Box>
        </Grid>
        {(formik.errors.policy ||
          formik.errors.paymentReceipt ||
          formik.errors.medicalCard ||
          formik.errors.healthCertificate) && (
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              color: "red",
              fontSize: "12px",
              fontWeight: "600",
              mt: 0.5,
              ml: 2,
              cursor: "pointer",
            }}
          >
            Please upload all files
          </Typography>
        )}
      </Grid>

      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
        mt={3}
      >
        <Button variant="outlined" type="button" onClick={() => handleEditPolicyNoClose()}>
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default ViewHealthPolicyModal;
