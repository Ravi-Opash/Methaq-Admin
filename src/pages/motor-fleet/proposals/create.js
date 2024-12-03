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
  TableCell,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { randomeNumberGenerater } from "src/utils/randomeNumberGenerater";
import PhoneNumberInput from "src/components/phoneInput-field";
import { createMotorFleetProposal } from "src/sections/motor-fleet/Proposals/Action/motorFleetProposalsAction";

const reqId = randomeNumberGenerater();

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateProposals = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: "",
      mobileNumber: "",
      email: "",
    },

    validationSchema: Yup.object({
      companyName: Yup.string().required("company name is required"),
    }),

    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      // Function for create motor fleet proposal
      dispatch(createMotorFleetProposal(values))
        .unwrap()
        .then((res) => {
          if (res?.success) {
            router?.push(`/motor-fleet/proposals/${res?.data?.proposalId}`).then(() => {
              setIsLoading(false);
            });
          }
        })
        .catch((err) => {
          console.log(err, "err");
          setIsLoading(false);
        });
    },
  });

  // Mobile number handler
  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  const getTravelDestinationLists = () => {};

  // useEffect travel destination
  useEffect(() => {
    getTravelDestinationLists();
  }, []);

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
              <NextLink href="/motor-fleet/proposals" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Proposals</Typography>
                </Link>
              </NextLink>
            </Box>
          </Box>

          {isLoading && (
            <>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
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
              Customer Details
            </Typography>

            <Grid container columnSpacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={5.8}>
                <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={12} md={12}>
                      <Grid container rowSpacing={2} sx={{ alignItems: "center" }}>
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
                              Company Name <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched?.companyName && formik.errors?.companyName)}
                              fullWidth
                              helperText={formik.touched?.companyName && formik.errors?.companyName}
                              label="Company Name"
                              name="companyName"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values?.companyName}
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
                              Mobile Number
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <PhoneNumberInput
                            handleMobileNumberChange={handleMobileNumberChange}
                            formik={formik}
                            setIsError={setIsError}
                            isError={isError}
                          />
                          {formik?.errors?.mobileNumber && (
                            <Typography
                              sx={{
                                mb: 0.5,
                                fontSize: "12px",
                                color: "#d32f2f",
                              }}
                            >
                              {formik?.errors?.mobileNumber}
                            </Typography>
                          )}
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
                              Email
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched?.email && formik.errors?.email)}
                              fullWidth
                              helperText={formik.touched?.email && formik.errors?.email}
                              label="Email address"
                              name="email"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values?.email}
                              type="email"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained">
              Generate
            </Button>
          </Box>
        </Container>
      </Box>
    </form>
  );
};

CreateProposals.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateProposals;
