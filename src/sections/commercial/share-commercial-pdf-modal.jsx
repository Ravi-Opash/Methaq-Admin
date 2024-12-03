import { Backdrop, Box, Button, CircularProgress, Divider, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import EastIcon from "@mui/icons-material/East";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { toast } from "react-toastify";
import MailIcon from "@mui/icons-material/Mail";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { CrossSvg } from "src/Icons/CrossSvg";
import { shareContractorAllRiskPDFshare } from "./contractor-all-risk/Action/commercialAction";
import { shareContractorPlantMachineryPDFshare } from "./contractor-plant-machinery/Action/contractorPlantMachineryAction";
import { shareWorkmenCompensationPDFshare } from "./workmen-compensation/Action/workmenCompensationAction";
import { shareMedicalMalPracticePDFshare } from "./medical-malpractice/Action/medicalmalepracticeAction";
import { shareProfesionIndemnityPDFshare } from "./professional-indemnity/Action/professionalIndemnityAction";
import { shareSmallBusinessEnterprisePDFshare } from "./small-medium-enterrise/Action/smallMediumEnterpriseAction";

const ShareCommercialPDFModal = ({ handleClose, pdfLink, info, commercialName }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: info?.email || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      const payload = {
        email: values.email.toLowerCase(),
      };

      setIsLoading(true);

      // Condition based on commercial type
      if (commercialName == "contractor-all-risk") {
        dispatch(
          shareContractorAllRiskPDFshare({
            id: info?.commercialNumber,
            toEmail: payload.email,
          })
        )
          .unwrap()
          .then((res) => {
            toast.success("PDF link successfully sent to email");
            setIsLoading(false);
            handleClose();
          })
          .catch((err) => {
            console.log(err, "err");
            toast.error(err);
            setIsLoading(false);
          });
      }
      if (commercialName == "contractor-palnt") {
        dispatch(
          shareContractorPlantMachineryPDFshare({
            id: info?.contractorPlantNumber,
            toEmail: payload.email,
          })
        )
          .unwrap()
          .then((res) => {
            toast.success("PDF link successfully sent to email");
            setIsLoading(false);
            handleClose();
          })
          .catch((err) => {
            console.log(err, "err");
            toast.error(err);
            setIsLoading(false);
          });
      }
      if (commercialName == "professional") {
        dispatch(
          shareProfesionIndemnityPDFshare({
            id: info?.commercialNumber,
            toEmail: payload.email,
          })
        )
          .unwrap()
          .then((res) => {
            toast.success("PDF link successfully sent to email");
            setIsLoading(false);
            handleClose();
          })
          .catch((err) => {
            console.log(err, "err");
            toast.error(err);
            setIsLoading(false);
          });
      }
      if (commercialName == "medical") {
        dispatch(
          shareMedicalMalPracticePDFshare({
            id: info?.medicalMalpracticeNumber,
            toEmail: payload.email,
          })
        )
          .unwrap()
          .then((res) => {
            toast.success("PDF link successfully sent to email");
            setIsLoading(false);
            handleClose();
          })
          .catch((err) => {
            console.log(err, "err");
            toast.error(err);
            setIsLoading(false);
          });
      }
      if (commercialName == "workmen") {
        dispatch(
          shareWorkmenCompensationPDFshare({
            id: info?.workmensCompensationNumber,
            toEmail: payload.email,
          })
        )
          .unwrap()
          .then((res) => {
            toast.success("PDF link successfully sent to email");
            setIsLoading(false);
            handleClose();
          })
          .catch((err) => {
            console.log(err, "err");
            toast.error(err);
            setIsLoading(false);
          });
      }
      if (commercialName == "SME") {
        dispatch(
          shareSmallBusinessEnterprisePDFshare({
            id: info?.smallMediumEnterpriseNumber,
            toEmail: payload.email,
          })
        )
          .unwrap()
          .then((res) => {
            toast.success("PDF link successfully sent to email");
            setIsLoading(false);
            handleClose();
          })
          .catch((err) => {
            console.log(err, "err");
            toast.error(err);
            setIsLoading(false);
          });
      }
    },
  });

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
                <Box>Copy PDF link</Box>
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
                        defaultValue={info?.email}
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
                      <Button
                        type="submit"
                        sx={{
                          color: "#60176F",
                          fontWeight: "bold",
                          cursor: "pointer",
                          gap: 1,
                        }}
                      >
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

export default ShareCommercialPDFModal;
