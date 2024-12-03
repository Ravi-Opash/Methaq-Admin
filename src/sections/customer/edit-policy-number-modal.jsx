import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import ModalComp from "src/components/modalComp";
import { DocumentSvg } from "src/Icons/DocumentSvg";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { getCustomerPolicyDetailById, postCustomerPolicyDocByCustomerId } from "./action/customerAction";
import {
  getHealthPolicyDetailById,
  uploadHealthPolicyFile,
} from "../health-insurance/Policies/action/healthPoliciesAction";
import { CircleFill } from "src/Icons/CircleFill";
import { AddFile } from "src/Icons/AddFile";
import RemoveIcon from "@mui/icons-material/Remove";
import { AddIcon } from "src/Icons/AddIcon";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import DownloadIcon from "@mui/icons-material/Download";
import { DatePicker } from "@mui/x-date-pickers";

const EditPolicyNumberModal = ({ handleEditPolicyNoClose, customerPolicyDetails, keyName }) => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { policyId } = router.query;

  const [customFileArray, setCustomFileArray] = useState(
    customerPolicyDetails?.custom ? [...customerPolicyDetails?.custom] : []
  );

  const [open, setOpen] = useState(false);
  const [filename, _filename] = useState("");
  const [payloadValue, setPayloadValue] = useState(null);
  const handleClose = () => setOpen(false);
  const [loading, setIsLoading] = useState(false);
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

    validationSchema: yup.object({
      companyPolicyNumber: yup.string().required("Policy Number is required"),
      policy: yup.mixed().required("File required"),
      healthCertificate: yup.mixed().required("File required"),
      medicalCard: yup.mixed().required("File required"),
      paymentReceipt: yup.mixed().required("File required"),
      effectivedate: yup.date().typeError("Required").required("Required"),
    }),

    onSubmit: async (values) => {
      // console.log("values", values);
      setPayloadValue(values);
      setOpen(true);
    },
  });

  const onSubmitPayload = () => {
    // const formData = jsonToFormData(payloadValue);
    const formData = new FormData();
    Object.entries(payloadValue).map(([key, value]) => {
      if (key == "custom" && value) {
        payloadValue?.custom?.map((i) => {
          let fileType = i?.customFile?.type?.split("/")?.[1];
          const renamedFile = new File([i?.customFile], `${i?.customFileName}.${fileType}`, {
            type: i?.customFile?.type,
          });
          formData.append("custom", renamedFile);
        });
      } else {
        formData.append(key, value);
      }
    });

    if (customerPolicyDetails && keyName == "Car-Policy") {
      dispatch(
        postCustomerPolicyDocByCustomerId({
          id: policyId,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          // console.log("res", res);
          if (res) {
            toast("Successfully uploaded", {
              type: "success",
            });
            dispatch(getCustomerPolicyDetailById(policyId));
            handleEditPolicyNoClose();
            handleClose();
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
    if (customerPolicyDetails && keyName == "Health-Policy") {
      setIsLoading(true);
      handleClose();
      dispatch(
        uploadHealthPolicyFile({
          id: policyId,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          // console.log("res", res);
          if (res) {
            toast("Successfully uploaded", {
              type: "success",
            });
            dispatch(getHealthPolicyDetailById(policyId));
            handleEditPolicyNoClose();

            setIsLoading(false);
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          setIsLoading(false);
        });
    }
  };

  const fileUploadHandler = (event, keyName) => {
    _filename(event?.currentTarget?.files[0]?.name);
    formik.setFieldValue(keyName, event.currentTarget.files[0]);
  };

  const fileUploadCustomHandler = (event, idx) => {
    _filename(event?.currentTarget?.files[0]?.name);
    formik.setFieldValue(`[custom][${idx}][customFile]`, event.currentTarget?.files[0]);
  };

  const addCustomeFileHandler = () => {
    let array = [...customFileArray];
    array.push(1);
    setCustomFileArray(array);
  };

  // const removeCustomeFileHandler = (idx) => {
  //   console.log(idx, "idx");
  //   let data = formik?.values?.custom || [];
  //   let aa = data?.splice(idx, 1);
  //   formik.setFieldValue("custom", aa);
  //   let array = [...customFileArray];
  //   array.pop(1);
  //   setCustomFileArray(array);
  // };

  const removeCustomeFileHandler = (idx) => {
    let data = [...(formik?.values?.custom || [])];
    data.splice(idx, 1);
    formik.setFieldValue("custom", data);
    let array = [...customFileArray];
    array.splice(idx, 1);
    setCustomFileArray(array);
  };

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
      {loading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      <form onSubmit={formik.handleSubmit}>
        <CardHeader title="Update policy PDF" sx={{ p: 0, mb: 1 }} />

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
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* <DocumentSvg sx={{ fontSize: "25px" }} /> */}
                        Policy
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="#707070"
                        backgroundColor="none"
                        aria-label="upload picture"
                        component="label"
                        disableRipple
                        sx={{
                          flexDirection: "column",
                          cursor: "pointer",
                          "&:hover": {
                            background: "none",
                          },
                          p: 0,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <input
                            accept=".pdf"
                            id="file"
                            type="file"
                            name="file"
                            onChange={(event) => {
                              fileUploadHandler(event, "policy");
                            }}
                            onBlur={formik.handleBlur}
                            style={{ display: "none" }}
                          />
                          <DocumentSvg sx={{ fontSize: "25px" }} />

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "12px",
                              fontWeight: "600",
                              textDecoration: "underline",
                              mt: 0.5,
                              cursor: "pointer",
                            }}
                          >
                            Click to Upload
                          </Typography>
                        </Box>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                        <CircleFill
                          sx={{
                            color: formik.values.policy ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                            fontSize: "22px",
                          }}
                        />
                        {customerPolicyDetails?.policyFile && (
                          <DownloadIcon
                            sx={{ color: "#60176F", cursor: "pointer" }}
                            onClick={() => downloadFile(customerPolicyDetails?.policyFile?.path)}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* <DocumentSvg sx={{ fontSize: "25px" }} /> */}
                        Certificate of health insurance (COC)
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="#707070"
                        backgroundColor="none"
                        aria-label="upload picture"
                        component="label"
                        disableRipple
                        sx={{
                          flexDirection: "column",
                          cursor: "pointer",
                          "&:hover": {
                            background: "none",
                          },
                          p: 0,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <input
                            accept=".pdf"
                            id="file"
                            type="file"
                            name="file"
                            onChange={(event) => {
                              fileUploadHandler(event, "healthCertificate");
                            }}
                            onBlur={formik.handleBlur}
                            style={{ display: "none" }}
                          />
                          <DocumentSvg sx={{ fontSize: "25px" }} />

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "12px",
                              fontWeight: "600",
                              textDecoration: "underline",
                              mt: 0.5,
                              cursor: "pointer",
                            }}
                          >
                            Click to Upload
                          </Typography>
                        </Box>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                        <CircleFill
                          sx={{
                            color: formik.values.healthCertificate ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                            fontSize: "22px",
                          }}
                        />
                        {customerPolicyDetails?.healthCertificate && (
                          <DownloadIcon
                            sx={{ color: "#60176F", cursor: "pointer" }}
                            onClick={() => downloadFile(customerPolicyDetails?.healthCertificate?.path)}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* <DocumentSvg sx={{ fontSize: "25px" }} /> */}
                        Medical E-card
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="#707070"
                        backgroundColor="none"
                        aria-label="upload picture"
                        component="label"
                        disableRipple
                        sx={{
                          flexDirection: "column",
                          cursor: "pointer",
                          "&:hover": {
                            background: "none",
                          },
                          p: 0,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <input
                            accept=".pdf"
                            id="file"
                            type="file"
                            name="file"
                            onChange={(event) => {
                              fileUploadHandler(event, "medicalCard");
                            }}
                            onBlur={formik.handleBlur}
                            style={{ display: "none" }}
                          />
                          <DocumentSvg sx={{ fontSize: "25px" }} />

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "12px",
                              fontWeight: "600",
                              textDecoration: "underline",
                              mt: 0.5,
                              cursor: "pointer",
                            }}
                          >
                            Click to Upload
                          </Typography>
                        </Box>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                        <CircleFill
                          sx={{
                            color: formik.values.medicalCard ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                            fontSize: "22px",
                          }}
                        />
                        {customerPolicyDetails?.medicalCard && (
                          <DownloadIcon
                            sx={{ color: "#60176F", cursor: "pointer" }}
                            onClick={() => downloadFile(customerPolicyDetails?.medicalCard?.path)}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* <DocumentSvg sx={{ fontSize: "25px" }} /> */}
                        Payment Receipt
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="#707070"
                        backgroundColor="none"
                        aria-label="upload picture"
                        component="label"
                        disableRipple
                        sx={{
                          flexDirection: "column",
                          cursor: "pointer",
                          "&:hover": {
                            background: "none",
                          },
                          p: 0,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <input
                            accept=".pdf"
                            id="file"
                            type="file"
                            name="file"
                            onChange={(event) => {
                              fileUploadHandler(event, "paymentReceipt");
                            }}
                            onBlur={formik.handleBlur}
                            style={{ display: "none" }}
                          />
                          <DocumentSvg sx={{ fontSize: "25px" }} />

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              color: "#707070",
                              fontSize: "12px",
                              fontWeight: "600",
                              textDecoration: "underline",
                              mt: 0.5,
                              cursor: "pointer",
                            }}
                          >
                            Click to Upload
                          </Typography>
                        </Box>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                        <CircleFill
                          sx={{
                            color: formik?.values?.paymentReceipt ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                            fontSize: "22px",
                          }}
                        />
                        {customerPolicyDetails?.paymentReceipt && (
                          <DownloadIcon
                            sx={{ color: "#60176F", cursor: "pointer" }}
                            onClick={() => downloadFile(customerPolicyDetails?.paymentReceipt?.path)}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  {customFileArray?.map((ele, idx) => {
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <TextField
                              error={Boolean(
                                formik?.touched?.custom?.[idx]?.customFileName &&
                                  formik?.errors?.custom?.[idx]?.customFileName
                              )}
                              helperText={
                                formik?.touched?.custom?.[idx]?.customFileName &&
                                formik?.errors?.custom?.[idx]?.customFileName
                              }
                              label="Add Custom File name"
                              name={`[custom][${idx}][customFileName]`}
                              id={`[custom][${idx}][customFileName]`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              type="customFileName"
                              value={formik.values.custom?.[idx]?.customFileName}
                            />
                            {!customerPolicyDetails?.policyFile && (
                              <DeleteSvg
                                onClick={() => removeCustomeFileHandler(idx)}
                                sx={{ color: "#60176F", fontSize: 16, cursor: "pointer" }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="#707070"
                            backgroundColor="none"
                            aria-label="upload picture"
                            component="label"
                            disableRipple
                            sx={{
                              flexDirection: "column",
                              cursor: "pointer",
                              "&:hover": {
                                background: "none",
                              },
                              p: 0,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <input
                                accept=".pdf"
                                id="file"
                                type="file"
                                name="file"
                                onChange={(event) => {
                                  fileUploadCustomHandler(event, idx);
                                }}
                                onBlur={formik.handleBlur}
                                style={{ display: "none" }}
                              />
                              <DocumentSvg sx={{ fontSize: "25px" }} />

                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  color: "#707070",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  textDecoration: "underline",
                                  mt: 0.5,
                                  cursor: "pointer",
                                }}
                              >
                                Click to Upload
                              </Typography>
                            </Box>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                            <CircleFill
                              sx={{
                                color: formik.values.custom?.[idx]?.customFile ? "#5cb85c" : "rgba(255, 0, 0, 0.8)",
                                fontSize: "22px",
                              }}
                            />
                            {customerPolicyDetails?.custom?.[idx]?.customFile && (
                              <DownloadIcon
                                sx={{ color: "#60176F", cursor: "pointer" }}
                                onClick={() => downloadFile(customerPolicyDetails?.custom?.[idx]?.customFile)}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                    <Typography sx={{ ml: 1, fontSize: 13 }}>Want to upload Custom file? Click to Add Icon</Typography>
                    {!customerPolicyDetails?.policyFile && (
                      <AddFile
                        onClick={addCustomeFileHandler}
                        sx={{ color: "#60176F", fontSize: 24, cursor: "pointer" }}
                      />
                    )}
                  </Box>
                </TableBody>
              </Table>
            </Card>
          </Grid>

          {/* <Grid item xs={12}>
            <IconButton
              color="#707070"
              backgroundColor="none"
              aria-label="upload picture"
              component="label"
              disableRipple
              sx={{
                flexDirection: "column",
                cursor: "pointer",
                "&:hover": {
                  background: "none",
                },
                p: 0,
              }}
            >
              <input
                // accept="image/*"
                accept=".pdf"
                id="file"
                type="file"
                name="file"
                onChange={(event) => {
                  fileUploadHandler(event);
                }}
                onBlur={formik.handleBlur}
                style={{ display: "none" }}
              />
              <DocumentSvg sx={{ fontSize: "70px" }} />

              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  color: "#707070",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "underline",
                  mt: 0.5,
                  cursor: "pointer",
                }}
              >
                click to upload
              </Typography>
            </IconButton>

            {formik.errors.policy && (
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  color: "red",
                  fontSize: "12px",
                  fontWeight: "600",
                  mt: 0.5,
                  cursor: "pointer",
                }}
              >
                {formik.errors.policy}
              </Typography>
            )}
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                color: "#ccc",
                fontSize: "12px",
                fontWeight: "600",
                mt: 0.5,
                cursor: "pointer",
              }}
            >
              {filename || customerPolicyDetails?.policyFile?.originalname}
            </Typography>
          </Grid> */}
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
                maxWidth: "50%",
              }}
            >
              <DatePicker
                inputFormat="dd-MM-yyyy"
                label="Policy Effective Date"
                value={formik.values?.effectivedate}
                onChange={(value) => {
                  formik.setFieldValue("effectivedate", value, true);
                }}
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

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button
            type="button"
            variant="contained"
            onClick={formik.handleSubmit}
            disabled={!!customerPolicyDetails?.policyFile}
            // disabled={formik.values.companyPolicyNumber === "" || formik.values.policy === ""}
          >
            Update
          </Button>

          <Button variant="outlined" type="button" onClick={() => handleEditPolicyNoClose()}>
            Cancel
          </Button>
        </Box>

        <ModalComp open={open} handleClose={handleClose} width="44rem">
          <CardHeader title="Are you sure you want to change?" sx={{ p: 0, mb: 2 }} />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={onSubmitPayload}>
              Sure
            </Button>

            <Button variant="outlined" type="button" onClick={() => handleClose()}>
              Cancel
            </Button>
          </Box>
        </ModalComp>
      </form>
    </>
  );
};

export default EditPolicyNumberModal;
