import { Backdrop, Box, Button, CircularProgress, Divider, TextField, Typography } from "@mui/material";
import React from "react";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import EastIcon from "@mui/icons-material/East";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { toast } from "react-toastify";
import MailIcon from "@mui/icons-material/Mail";
import MessageIcon from "@mui/icons-material/Message";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { CrossSvg } from "src/Icons/CrossSvg";
import { shareHealthPDFViaSEmail, shareHealthPDFViaSMS } from "./Action/healthInsuranceAction";
import PhoneInputs from "src/components/phoneInput";

// Modal for sharing health insurance PDF via email/SMS
const HealthSharePDFModal = ({
  handleClose,
  healthCompareDetails,
  downloadExcel,
  refId,
  setIsLoading,
  isLoading,
  pdfLink,
}) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: healthCompareDetails[0]?.healthInfo?.email || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      // Prepare the payload for sending the email
      const payload = {
        email: values.email.toLowerCase(),
      };

      let ids;
      if (healthCompareDetails) {
        // Extract health plan IDs from the details
        ids = healthCompareDetails.map((i) => {
          return i._id;
        });
      }
      setIsLoading(true);
      // Dispatch action to share the PDF via email

      dispatch(shareHealthPDFViaSEmail({ ids: ids, toEmail: payload.email, refId: refId }))
        .unwrap()
        .then((res) => {
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
      mobileNumber: healthCompareDetails[0]?.healthInfo?.mobileNumber || "",
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
      if (healthCompareDetails) {
        ids = healthCompareDetails.map((i) => {
          return i._id;
        });
      }
      setIsLoading(true);

      dispatch(shareHealthPDFViaSMS({ ids: ids, toMobileNumber: payload.mobileNumber, refId: refId }))
        .unwrap()
        .then((res) => {
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
  // Function to download the PDF

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
          {" "}
          {/* Section for downloading the PDF */}
          <Box sx={{ display: "flex", flexFlow: "column", width: "100%" }}>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
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
                onClick={downloadExcel}
              >
                <span>Download Excel</span>
                <DownloadSvg sx={{ mt: 0.5 }} />
              </Button>
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
              {" "}
              {/* Section forCopy Link */}
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
                {/* Section for sharing via Email */}

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
                        defaultValue={healthCompareDetails[0]?.healthInfo?.email || ""}
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
              {/* Section for sharing via SMS */}

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

export default HealthSharePDFModal;
