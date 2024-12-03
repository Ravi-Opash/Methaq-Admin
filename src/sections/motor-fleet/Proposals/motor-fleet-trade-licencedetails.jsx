import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { FileDropzone } from "src/components/file-dropzone";
import {
  Grid,
  Typography,
  List,
  Button,
  TextField,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  Backdrop,
} from "@mui/material";
import { bytesToSize } from "src/utils/bytes-to-size";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon } from "src/Icons/EditIcon";
import ListItemComp from "src/components/ListItemComp";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  createTradeLicenseDetails,
  getfleetdetails,
  updateFleetDetails,
} from "src/sections/motor-fleet/Proposals/Action/motorFleetProposalsAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { toast } from "react-toastify";
import { addDays, startOfDay } from "date-fns";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const MotorTradeLicensedetails = ({ fleetDetail }) => {
  const dispatch = useDispatch();
  const { fleetUpdateLoader, updatedfleetDetail } = useSelector((state) => state.motorFleetProposals);
  //kyc upload
  const [kycFormUploadFile, setKycFormUploadFile] = useState(null);
  const [uploadKycFormListFile, setKycFormFile] = useState();
  //trade license upload
  const [tradeLicenseUploadFile, setTradeLicenseUploadFile] = useState(null);
  const [uploadTradeLicenseListFile, setTradeLicenseFile] = useState();

  const [editLicencedetails, setEditLicencedetails] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      tradeLicenseExpiryDate: fleetDetail ? fleetDetail?.tradeLicenseExpiryDate : "",
      tradeLicenseNo: fleetDetail ? fleetDetail?.tradeLicenseNo : "",
      tradeLicense: fleetDetail ? fleetDetail?.tradeLicense : "",
      kyc: fleetDetail ? fleetDetail?.kyc : "",
    },

    validationSchema: Yup.object({
      // tradeLicenseExpiryDate: Yup.date()
      //   .required("Trade license expiry is required")
      //   .min(new Date(), "Trade license expiry date cannot be in the past"),
      tradeLicenseExpiryDate: Yup.date()
        .min(startOfDay(addDays(new Date(), 1)), "Must select future date!")
        .required("Trade license expiry is required")
        .typeError("Trade license expiry date cannot be in the past"),
      tradeLicenseNo: Yup.string().required("Trade license number is required"),
      tradeLicense: Yup.mixed().required("Trade license file is required"),
      // kyc: Yup.mixed().required("KYC form file is required"),
    }),

    onSubmit: async (values, helpers) => {
      const dateObject = new Date(values.tradeLicenseExpiryDate).toISOString();
      let payload = jsonToFormData({
        ...values,
        tradeLicenseExpiryDate: dateObject,
      });
      dispatch(updateFleetDetails({ id: fleetDetail?._id, data: payload })).then((res) => {
        setEditLicencedetails(false);
        toast.success("Trade license details updated successfully");
        dispatch(getfleetdetails({ id: fleetDetail?.proposalId }));
      });
    },
  });
  const handlekycFileChange = async ([file]) => {
    formik.setFieldValue("kyc", file);
    setKycFormUploadFile(file);
    setKycFormFile({
      filename: file?.name,
      size: file?.size,
    });
  };

  const handleTradeLicenseFileImage = async ([file]) => {
    formik.setFieldValue("tradeLicense", file);
    setTradeLicenseUploadFile(file);
    setTradeLicenseFile({
      filename: file?.name,
      size: file?.size,
    });
  };

  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + "/" + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    if (fleetDetail?.tradeLicenseExpiryDate || fleetDetail?.tradeLicenseNo) {
      setEditLicencedetails(false);
    } else {
      setEditLicencedetails(true);
    }
  }, [fleetDetail]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {fleetUpdateLoader && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={fleetUpdateLoader}>
          <CircularProgress sx={{ color: "#60176F" }} />
        </Backdrop>
      )}
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
          mt: 3,
        }}
      >
        {!editLicencedetails ? (
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              py: 1.5,
              width: "100%",
              backgroundColor: "#f5f5f5",
              fontWeight: "600",
              fontSize: "18px",
              display: "inline-block",
              color: "#60176F",
              px: "14px",
              borderRadius: "10px 10px 0 0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Trade License Details
            {/* {moduleAccess(user, "travelQuote.update") && !isPolicyGenerated && ( */}
            <EditIcon onClick={() => setEditLicencedetails(true)} sx={{ fontSize: 30, cursor: "pointer" }} />
            {/* )} */}
          </Typography>
        ) : (
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              py: 1.5,
              width: "100%",
              backgroundColor: "#f5f5f5",
              fontWeight: "600",
              fontSize: "18px",
              display: "inline-block",
              color: "#60176F",
              px: "14px",
              borderRadius: "10px 10px 0 0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Trade License Details
          </Typography>
        )}

        <Grid container columnSpacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={5.8}>
            <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12} md={12}>
                  <Grid container rowSpacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
                    {editLicencedetails && (
                      <Grid item xs={12} md={3}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            ml: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Trade License Expiry
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    <Grid item xs={12} md={9}>
                      {editLicencedetails ? (
                        <Box sx={{ display: "inline-block", width: "100%" }}>
                          <DatePicker
                            inputFormat="dd-MM-yyyy"
                            label="Trade License Expiry"
                            maxDate={new Date().setDate(new Date().getDate() + 365)}
                            minDate={new Date()}
                            onChange={(value) => {
                              formik.setFieldValue("tradeLicenseExpiryDate", value);
                            }}
                            renderInput={(params) => (
                              <TextField name="tradeLicenseExpiryDate" fullWidth {...params} error={false} />
                            )}
                            value={formik.values.tradeLicenseExpiryDate ? formik.values.tradeLicenseExpiryDate : ""}
                          />

                          {formik.touched?.tradeLicenseExpiryDate && formik.errors?.tradeLicenseExpiryDate && (
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                fontSize: "12px",
                                display: "inline-block",
                                color: "red",
                              }}
                            >
                              {formik.errors?.tradeLicenseExpiryDate}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <ListItemComp
                          isCopy={true}
                          label={"Trade License Expiry"}
                          value={fleetDetail?.tradeLicenseExpiryDate || "-"}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} md={3}>
                      {editLicencedetails && (
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            ml: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Trade License File
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    {editLicencedetails ? (
                      <Grid item xs={12} md={9}>
                        <Box sx={{ display: "inline-block", width: "100%" }}>
                          <FileDropzone
                            accept={{
                              "image/*": [],
                              "application/pdf": [],
                            }}
                            maxFiles={1}
                            onDrop={handleTradeLicenseFileImage}
                          />
                        </Box>{" "}
                        {uploadTradeLicenseListFile && uploadTradeLicenseListFile?.filename && (
                          <List sx={{ width: "100%" }}>
                            <ListItem
                              sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,

                                "& + &": {
                                  mt: 1,
                                },
                              }}
                            >
                              <ListItemText
                                primary={
                                  uploadTradeLicenseListFile?.filename ? uploadTradeLicenseListFile?.filename : ""
                                }
                                primaryTypographyProps={{
                                  color: "textPrimary",
                                  variant: "subtitle2",
                                }}
                                secondary={
                                  uploadTradeLicenseListFile?.size ? bytesToSize(uploadTradeLicenseListFile?.size) : ""
                                }
                              />
                            </ListItem>
                          </List>
                        )}
                      </Grid>
                    ) : (
                      <Grid container rowSpacing={2} mt={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Grid item xs={15} md={3}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontWeight: "500",
                                  fontSize: "15px",
                                  display: "inline-block",
                                  color: "#000",
                                  ml: 2,
                                }}
                              >
                                Trade License File
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={10} md={9}>
                            <Box sx={{ marginLeft: 7 }}>
                              <Box
                                onClick={() => onDocumentDowmload(fleetDetail?.tradeLicense?.path)}
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                              >
                                <Typography
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
                                  // onClick={() => {
                                  //   let pdfUrl = URL + "/" + travelPolicyDeatils?.taxInvoiceFile?.path;

                                  //   const link = document.createElement("a");
                                  //   link.href = pdfUrl;
                                  //   link.setAttribute("target", "_blank");
                                  //   document.body.appendChild(link);
                                  //   link.click();
                                  //   link.remove();
                                  // }}
                                >
                                  Download
                                </Typography>
                                <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} />
                              </Box>
                            </Box>
                          </Grid>
                        </Box>
                      </Grid>
                    )}
                    <Typography
                      sx={{
                        color: "#F04438",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      {Boolean(formik.touched.tradeLicense && formik.errors.tradeLicense)}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#F04438",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                      mt={1}
                    >
                      {formik.touched.tradeLicense && formik.errors.tradeLicense}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5.8}>
            <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12} md={12}>
                  <Grid container spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
                    {editLicencedetails && (
                      <Grid item xs={12} md={3}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            ml: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Trade License Number
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {editLicencedetails ? (
                      <Grid item xs={12} md={9}>
                        <Box sx={{ display: "inline-block", width: "100%" }}>
                          <TextField
                            error={Boolean(formik.touched?.tradeLicenseNo && formik.errors?.tradeLicenseNo)}
                            fullWidth
                            helperText={formik.touched?.tradeLicenseNo && formik.errors?.tradeLicenseNo}
                            label="Trade License Number"
                            name="tradeLicenseNo"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values?.tradeLicenseNo}
                          />
                        </Box>
                      </Grid>
                    ) : (
                      <ListItemComp
                        isCopy={true}
                        label={"Trade License No"}
                        value={fleetDetail?.tradeLicenseNo || "-"}
                      />
                    )}
                    {editLicencedetails && (
                      <Grid item xs={12} md={3}>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            KYC form file
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {editLicencedetails ? (
                      <Grid item xs={12} md={9}>
                        <Box sx={{ display: "inline-block", width: "100%" }}>
                          <FileDropzone
                            accept={{
                              "image/*": [],
                              "application/pdf": [],
                            }}
                            maxFiles={1}
                            onDrop={handlekycFileChange}
                            name="kyc"
                            value={formik.values?.kyc}
                          />
                        </Box>
                        {uploadKycFormListFile && uploadKycFormListFile?.filename && (
                          <List sx={{ width: "100%" }}>
                            <ListItem
                              sx={{
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                                "& + &": {
                                  mt: 1,
                                },
                              }}
                            >
                              <ListItemText
                                primary={uploadKycFormListFile?.filename ? uploadKycFormListFile?.filename : ""}
                                primaryTypographyProps={{
                                  color: "textPrimary",
                                  variant: "subtitle2",
                                }}
                                secondary={uploadKycFormListFile?.size ? bytesToSize(uploadKycFormListFile?.size) : ""}
                              />
                            </ListItem>
                          </List>
                        )}
                        <Typography
                          sx={{
                            color: "#F04438",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                          }}
                        >
                          {Boolean(formik.touched.kyc && formik.errors.kyc)}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#F04438",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                          }}
                          mt={1}
                        >
                          {formik.touched.kyc && formik.errors.kyc}
                        </Typography>
                      </Grid>
                    ) : (
                      <>
                        <Grid container rowSpacing={2} mt={1} sx={{ alignItems: "center", justifyContent: "center" }}>
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Grid item xs={15} md={3}>
                              <Box
                                sx={{
                                  display: "inline-block",
                                  width: "100%",
                                  ml: 1,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontWeight: "500",
                                    fontSize: "15px",
                                    display: "inline-block",
                                    color: "#000",
                                    marginLeft: "12px",
                                  }}
                                >
                                  KYC Form File
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={9}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 7 }}>
                                <>
                                  {fleetDetail?.kyc?.path ? (
                                    <>
                                      <Box
                                        onClick={() => onDocumentDowmload(fleetDetail?.kyc?.path)}
                                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                      >
                                        <Typography
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
                                          // onClick={() => {
                                          //   let pdfUrl = URL + "/" + travelPolicyDeatils?.taxInvoiceFile?.path;

                                          //   const link = document.createElement("a");
                                          //   link.href = pdfUrl;
                                          //   link.setAttribute("target", "_blank");
                                          //   document.body.appendChild(link);
                                          //   link.click();
                                          //   link.remove();
                                          // }}
                                        >
                                          Download
                                        </Typography>
                                      </Box>
                                      <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} />
                                    </>
                                  ) : (
                                    <Typography sx={{ fontSize: 14, display: "flex", alignItems: "start" }}>
                                      No File
                                    </Typography>
                                  )}
                                </>
                              </Box>
                            </Grid>
                          </Box>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {!!editLicencedetails && (
            <Grid item xs={12} sm={12}>
              <Box sx={{ p: 2, width: "100%", display: "flex", justifyContent: "end", gap: 2 }}>
                <Button
                  sx={{ fontSize: "12px", minWidth: 100 }}
                  variant="outlined"
                  type="button"
                  onClick={() => setEditLicencedetails(false)}
                >
                  Cancel
                </Button>
                <Button sx={{ fontSize: "12px", minWidth: 100 }} type="submit" variant="contained">
                  Submit
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </form>
  );
};

export default MotorTradeLicensedetails;
