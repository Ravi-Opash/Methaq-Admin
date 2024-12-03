import React, { useState, useEffect, useCallback, useRef } from "react";
import NextLink from "next/link";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  styled,
  Card,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getpayByLink } from "src/sections/payment-link/Action/paymentLinkAction";
import ModalComp from "src/components/modalComp";
import { CrossSvg } from "src/Icons/CrossSvg";
import NetworkLogo from "../../../public/assets/logos/NetworkLogo.svg";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import Image from "next/image";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

const CreatePaymentLink = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      amount: "",
      comments: "",
    },

    validationSchema: Yup.object({
      // Customer details
      amount: Yup.string().required("Required"),
    }),

    onSubmit: async (values, helpers) => {
      // console.log(values, "ele");
    },
  });

  // Function to create payment link
  const getpayByLinkHandler = () => {
    setIsLoading(false);
    dispatch(
      getpayByLink({
        data: {
          redirectUri: "http://www.esanad.com",
          billAmount: formik.values.amount,
          comments: formik.values.comments,
          paidBy: "CRM - Admin",
        },
      })
    )
      .unwrap()
      .then((data) => {
        handleCloseVerifymodal();
        setPaymentLinkInfo(data);
        setPaymentLinkShareModal(true);
        setIsLoading(true);
      })
      .catch((err) => {
        // console.log(err);
        toast(err, {
          type: "error",
        });
        setIsLoading(true);
        handleCloseVerifymodal();
      });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <NextLink href="/payment-link" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Back</Typography>
                </Link>
              </NextLink>
            </Box>
          </Box>

          {!isLoading && (
            <>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 999,
                }}
                open={!isLoading}
              >
                <CircularProgress sx={{ color: "#60176F" }} />
              </Backdrop>
            </>
          )}

          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
              mb: 3,
            }}
          >
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
              }}
            >
              Payment details
            </Typography>

            <Grid container columnSpacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={5.8}>
                <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={12} md={12}>
                      <Grid container spacing={2} sx={{ alignItems: "center" }}>
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
                              Comments
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched.comments && formik.errors.comments)}
                              fullWidth
                              helperText={formik.touched.comments && formik.errors.comments}
                              label="Comments"
                              name="comments"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.comments}
                              type="number"
                              multiline
                              rows={3}
                            />
                          </Box>
                        </Grid>
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
                              Amount <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched.amount && formik.errors.amount)}
                              fullWidth
                              helperText={formik.touched.amount && formik.errors.amount}
                              label="Amount"
                              name="amount"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.amount}
                              type="number"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} sm={5.8}>
                <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={12} md={12}>
                      <Grid container spacing={2} sx={{ alignItems: "center" }}></Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!formik.values.amount}
              onClick={() => setVerifyModal(true)}
            >
              Generate Payment Link
            </Button>
          </Box>

          {/* Payment Model */}
          <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  position: "absolute",
                  top: "-16px",
                  right: "-16px",
                }}
              >
                <Box onClick={handleCloseVerifymodal} sx={{ display: "inline-block", mt: 0.6, cursor: "pointer" }}>
                  <CrossSvg color="#60176F" />
                </Box>
              </Box>
              <Typography sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}>
                Select Payment option to generate payment link
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card
                      onClick={getpayByLinkHandler}
                      sx={{
                        p: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: "15",
                        },
                      }}
                    >
                      <Image src={NetworkLogo} alt="NetworkLogo" width={120} height={80} />
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </ModalComp>

          {/* Share model */}

          <ModalComp
            open={paymentLinkShareModal}
            handleClose={() => setPaymentLinkShareModal(false)}
            widths={{ xs: "95%", sm: 500 }}
          >
            <SharePaymentLinkModal
              handleClose={() => setPaymentLinkShareModal(false)}
              paymentLink={paymentLinkOnfo?.paymentLink}
              setLoading={setIsLoading}
              credential={""}
              email={""}
              mobileNumber={""}
            />
          </ModalComp>
        </Container>
      </Box>
    </form>
  );
};

CreatePaymentLink.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreatePaymentLink;
