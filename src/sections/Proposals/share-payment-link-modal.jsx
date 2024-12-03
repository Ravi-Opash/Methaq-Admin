import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import React from "react";
import EastIcon from "@mui/icons-material/East";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { toast } from "react-toastify";
import MailIcon from "@mui/icons-material/Mail";
import MessageIcon from "@mui/icons-material/Message";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { CrossSvg } from "src/Icons/CrossSvg";
import { sharePaymentLinkViaEmail, sharePaymentLinkViaMobileNumber } from "./Action/proposalsAction";
import PhoneInputs from "src/components/phoneInput";

const SharePaymentLinkModal = ({ handleClose, paymentLink, setLoading, email, mobileNumber }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: email || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      // console.log("values", values);
      const payload = {
        email: values.email.toLowerCase(),
        paymentLink: paymentLink,
      };

      setLoading(false);
      dispatch(sharePaymentLinkViaEmail(payload))
        .unwrap()
        .then((res) => {
          toast.success("link successfully sent to email");
          setLoading(true);
        })
        .catch((err) => {
          console.log(err, "err");
          toast.error(err);
          setLoading(true);
        });
    },
  });
  const formik2 = useFormik({
    initialValues: {
      mobileNumber: mobileNumber || "",
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
        paymentLink: paymentLink,
      };

      setLoading(false);

      dispatch(sharePaymentLinkViaMobileNumber(payload))
        .unwrap()
        .then((res) => {
          toast.success("link successfully sent to mobile number");
          setLoading(true);
        })
        .catch((err) => {
          console.log(err, "err2");
          toast.error(err);
          setLoading(true);
        });
    },
  });

  return (
    <>
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
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: "13.5px", wordWrap: "break-word" }}>{paymentLink}</Typography>
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
                navigator.clipboard.writeText(paymentLink);
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
                <Box>Copy payment link</Box>
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
                Share Payment Link
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
                        defaultValue={email}
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
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        textAlign: "center",
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

export default SharePaymentLinkModal;
