import { Backdrop, Box, Button, CircularProgress, Divider, TextField, Typography, styled } from "@mui/material";
import React, { useEffect } from "react";
import { DownloadSvg } from "src/Icons/DownloadSvg";
// import CloseIcon from "@mui/icons-material/Close";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EastIcon from "@mui/icons-material/East";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { toast } from "react-toastify";
import MailIcon from "@mui/icons-material/Mail";
import MessageIcon from "@mui/icons-material/Message";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
// import { downloadCopmareQuotePDF, sharePDFViaSEmail, sharePDFViaSMS } from "./Action/proposalsAction";
import { CrossSvg } from "src/Icons/CrossSvg";
import { downloadCopmareQuotePDF } from "src/sections/Proposals/Action/proposalsAction";
import {
  shareMotorFleetPDFViaSEmail,
  shareMotorFleetPDFViaSMS,
} from "src/sections/motor-fleet/Proposals/Action/motorFleetProposalsAction";
import PhoneInputs from "src/components/phoneInput";

const MotorFleetSharePDFModal = ({
  handleClose,
  motorFleetCompareDetails,
  QuotationComparisonList,
  refId,
  setIsLoading,
  isLoading,
  pdfLink,
}) => {
  const dispatch = useDispatch();

  const { proposalUserInfo } = useSelector((state) => state.proposals);

  const formik = useFormik({
    initialValues: {
      email: motorFleetCompareDetails[0]?.quoteInfo?.fleetdDetailsId?.email || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      //   console.log("values", values);
      const payload = {
        email: values.email.toLowerCase(),
      };

      let ids;
      if (motorFleetCompareDetails) {
        ids = motorFleetCompareDetails.map((i) => {
          return i._id;
        });
      }
      setIsLoading(true);
      dispatch(shareMotorFleetPDFViaSEmail({ fleetQuoteIds: ids, toEmail: payload.email, refId: refId }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          toast.success("PDF link successfully sent to email");
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err, "err");
          toast.error(err);
          setIsLoading(false);
        });
    },
  });
  const formik2 = useFormik({
    initialValues: {
      mobileNumber: motorFleetCompareDetails[0]?.quoteInfo?.fleetdDetailsId?.mobileNumber || "",
    },
    validationSchema: Yup.object({
      mobileNumber: Yup.string()
        .required("Mobile Number is required")
        .matches(/^5/, "Mobile number should starts with 5")
        .min(9)
        .max(9),
    }),
    onSubmit: async (values, helpers) => {
      const payload = {
        mobileNumber: values.mobileNumber,
      };
      let ids;
      if (motorFleetCompareDetails) {
        ids = motorFleetCompareDetails.map((i) => {
          return i._id;
        });
      }
      setIsLoading(true);

      dispatch(shareMotorFleetPDFViaSMS({ fleetQuoteIds: ids, toMobileNumber: payload.mobileNumber, refId: refId }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res2");
          toast.success("PDF link successfully sent to mobile number");
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err, "err2");
          toast.error(err);
          setIsLoading(false);
        });
    },
  });

  const downloadPdf = async () => {
    setIsLoading(true);

    const link = document.createElement("a");
    link.href = pdfLink;
    link.setAttribute("download", "comparePlan.pdf");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setIsLoading(false);
    handleClose();
  };

  return (
    <>
      {isLoading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          gap: 2,
          mb: 2,
          position: "reletive",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            position: "absolute",
            top: 1,
            right: "10PX",
          }}
        >
          <Box onClick={() => handleClose()} sx={{ display: "inline-block", mt: 0.6, cursor: "pointer" }}>
            <CrossSvg color="#60176F" />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexFlow: "column", width: "100%" }}>
            <Box sx={{ display: "inline-block", mb: 1 }}>
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  alignItems: "center",
                  color: "#FFF",
                  backgroundColor: "#60176F",
                  "&:hover": {
                    backgroundColor: "#60176F",
                    opacity: 0.8,
                  },
                }}
                onClick={downloadPdf}
              >
                <span>Download PDF</span>
                <DownloadSvg sx={{ mt: 0.5 }} />
              </Button>
              {/* <Box sx={{ display: "inline-block" }}>
                  <Button
                    sx={{
                      textDecoration: "underline",
                      textDecorationColor: "#60176F !important",
                      p: 0,
                    }}
                    onClick={downloadPdf}
                  >
                    Download PDF
                  </Button>
                </Box> */}
            </Box>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => {
                navigator.clipboard.writeText(pdfLink);
                toast.success("Copy-link To Clipboard", {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <InsertLinkIcon />
                </Box>
                <Box>Copy link</Box>
              </Box>
              <Box>
                <EastIcon />
              </Box>
            </Box>
            <Divider />
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  mb: 0,
                  fontWeight: "600",
                  fontSize: {
                    md: "18px",
                    sm: "16px",
                    xs: "14px",
                  },
                }}
              >
                Share PDF
              </Typography>
              <Box>
                <Box sx={{ display: "flex", gap: 1, marginTop: "10px", p: 1 }}>
                  <MailIcon />
                  <Box>By email</Box>
                </Box>
                <form onSubmit={formik.handleSubmit}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <TextField
                        error={!!(formik.touched.email && formik.errors.email)}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Enter Email"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik?.values?.email}
                        defaultValue={motorFleetCompareDetails[0]?.quoteInfo?.fleetdDetailsId?.email || ""}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        textAlign: "center",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <Button type="submit" sx={{ color: "#60176F", fontWeight: "bold", cursor: "pointer", gap: 1 }}>
                        SEND <EastIcon />
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Box>
              <Divider />

              <Box>
                <Box sx={{ display: "flex", gap: 1, marginTop: "10px", p: 1 }}>
                  <MessageIcon />
                  <Box>By SMS</Box>
                </Box>

                <form onSubmit={formik2.handleSubmit}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <PhoneInputs name={`mobileNumber`} formik={formik2} />
                      {/* <Typography sx={{ mb: 2, fontSize: "12px", color: "#d32f2f" }}>
                        {errors?.mobileNumber?.message}
                      </Typography> */}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        textAlign: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button type="submit" sx={{ color: "#60176F", fontWeight: "bold", cursor: "pointer", gap: 1 }}>
                        SEND <EastIcon />
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MotorFleetSharePDFModal;
