import React, { useState } from "react";
import NextLink from "next/link";
import { Box, Button, Checkbox, Container, Grid, Link, TextField, Typography, styled } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import PhoneNumberInput from "src/components/phoneInput-field";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { insertInArray, jsonToFormData } from "src/utils/convert-to-form-data";
import { createNewLandProposals } from "src/sections/Land-insurance/Proposals/Action/landInsuranceAction";
import AnimationLoader from "src/components/amimated-loader";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

export const hospitalList = [
  {
    NAME: "0",
  },
  {
    NAME: "10",
  },
  {
    NAME: "15",
  },
  {
    NAME: "20",
  },
  {
    NAME: "30",
  },
];

const CreateProposals = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedIdFile, setSelectedIdFile] = useState("");
  const [selectedSiteMapFile, setSelectedSiteMapFile] = useState("");

  const [persons, setPersons] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: [],
      email: "",
      mobileNumber: "",
      location: "",
      ownerId: [],
      sitemap: "",
    },

    validationSchema: Yup.object({
      // Customer details
      fullName: Yup.lazy((value) => {
        return formik.values.fullName ? Yup.array().of(Yup.string().required("Required")) : Yup.mixed().optional();
      }),
      email: Yup.string().required("Required"),
      mobileNumber: Yup.string().matches(/^5/, "Mobile number should starts with 5").min(9).max(9).required("Required"),
      location: Yup.string().required("Required"),
      sitemap: Yup.mixed().required("Required"),
    }),

    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      const aa = values?.ownerId;
      delete values?.ownerId;
      const payload = jsonToFormData(values);

      aa?.map((ele) => {
        payload.append("ownerId", ele);
      });
      dispatch(createNewLandProposals(payload))
        .unwrap()
        .then((res) => {
          toast("Successfully created", {
            type: "success",
          });
          router.push(`/land-insurance/proposals/${res?.data?.data?._id}`).then(() => {
            setIsLoading(false);
          });
        })
        .catch((err) => {
          console.log(err, "Err");
          setIsLoading(false);
          toast.error(err);
        });
    },
  });

  // on mobilenumber change 
  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  // Owner Id upload handler
  const handleUploadId = (event, index) => {
    const file = event.target.files?.[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a PDF, JPG, JPEG, or PNG file");
      event.target.value = null;
      return;
    }
    event.target.value = null; // Clear the file input value
    formik.setFieldValue(`ownerId.[${index}]`, file);
    let result;
    result = insertInArray(selectedIdFile, index, file);
    setSelectedIdFile(result);
  };

  // Add Owner handler
  const addPerson = () => {
    const array = persons;
    array.push(1);
    setPersons([...array]);
  };

  // Remove Owner handler
  const removePerson = () => {
    if (persons.length <= 1) {
      return;
    }
    let aa = formik.values.fullName;
    let bb = formik.values.ownerId;
    const ss = aa.slice(0, aa?.length - 1);
    const pp = bb.slice(0, bb?.length - 1);
    formik.setFieldValue("fullName", ss);
    formik.setFieldValue("ownerId", pp);
    const array = persons;
    array.pop();
    setPersons([...array]);
  };

  // Site map upload handler 
  const handleUploadSiteMap = (event) => {
    const file = event.target.files[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a PDF, JPG, JPEG, or PNG file");
      event.target.value = null;
      return;
    }
    event.target.value = null; // Clear the file input value

    formik.setFieldValue("sitemap", file);
    setSelectedSiteMapFile(file);
  };

  // Other Owner check box handler. 
  const onOwnerCheckboxHandler = (value) => {
    if (value) {
      setPersons([1]);
      formik.setFieldValue(`ownerId.[${persons?.length + 1}]`, "");
    } else {
      setPersons([]);
      formik.setFieldValue("ownerId", []);
      formik.setFieldValue("fullName", []);
    }
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
              <NextLink href="/land-insurance/proposals" passHref>
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
              <AnimationLoader open={true} />
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
              Owner's details
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
                                fontSize: { xs: "13px", xl: "14px" },
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Owner's Full Name <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched.fullName?.[0] && formik.errors.fullName?.[0])}
                              fullWidth
                              helperText={formik.touched.fullName?.[0] && formik.errors.fullName?.[0]}
                              label="Owner's Full Name"
                              name={`fullName.[0]`}
                              id={`fullName.[0]`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.fullName?.[0] || ""}
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
                                fontSize: { xs: "13px", xl: "14px" },
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Mobile Number <Span> *</Span>
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
                                fontSize: { xs: "13px", xl: "14px" },
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Email <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched.email && formik.errors.email)}
                              fullWidth
                              helperText={formik.touched.email && formik.errors.email}
                              label="Email address"
                              name="email"
                              id="email"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.email}
                              type="email"
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
                                fontSize: { xs: "13px", xl: "14px" },
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Upload Your ID <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "flex", gap: 2, width: "100%", alignItems: "center" }}>
                            <Button
                              sx={{
                                color: "white",
                                backgroundColor: "#60176F",
                                fontSize: { xs: "13px", xl: "14px" },
                                lineHeight: {
                                  xs: "13px",
                                  sm: "18px",
                                  lg: "19px",
                                  xl: "24px",
                                },
                                fontWeight: "700",
                                fontFamily: "Lato",
                                p: 0,
                                m: 0,
                                borderRadius: "10px",
                                border: "1px solid #60176F",
                                textTransform: "capitalize",
                                cursor: "pointer",
                                "&:hover": {
                                  background: "#60176F",
                                  color: "white",
                                  opacity: 0.8,
                                },
                                "&:focus": {
                                  background: "#60176F",
                                  color: "white",
                                  opacity: 0.8,
                                },
                                "&:active": {
                                  background: "#60176F",
                                  color: "white",
                                  opacity: 0.8,
                                },
                                "&:disabled": {
                                  cursor: "not-allowed",
                                  border: "none",
                                  background: "#60176F",
                                  color: "white",
                                  opacity: 0.5,
                                },
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                aria-label="upload picture"
                                component="label"
                                gutterBottom
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  color: "white",
                                  fontSize: { xs: "13px", xl: "14px" },
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  px: 2,
                                  py: 1,
                                  m: 0,
                                }}
                              >
                                Browse File
                                <input
                                  accept=".pdf"
                                  id="file-upload"
                                  type="file"
                                  onChange={(event) => handleUploadId(event, 0)}
                                  style={{
                                    display: "none",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                />
                              </Typography>
                            </Button>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#707070",
                                fontSize: { xs: "13px", sm: "14px" },
                                textAlign: "center",
                                fontWeight: 600,
                              }}
                            >
                              Allowed file type (.pdf,.jpg, .jpeg,.png)
                            </Typography>
                          </Box>
                          {formik.values?.ownerId?.[0] && (
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#707070",
                                fontSize: { xs: "13px", sm: "14px" },
                                textAlign: "start",
                                fontWeight: 700,
                                mt: 2,
                              }}
                            >
                              Selected File: {formik.values.ownerId?.[0]?.name}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                backgroundColor: "#f5f5f5",
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
                Other owner's details if any
              </Typography>
              <Checkbox onChange={(e) => onOwnerCheckboxHandler(e?.target?.checked)} />
              <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
                {persons?.length > 0 && (
                  <>
                    <AddCircleIcon onClick={() => addPerson()} sx={{ color: "#60176F" }} />
                    {persons?.length > 1 && <RemoveCircleIcon onClick={removePerson} sx={{ color: "#60176F" }} />}
                  </>
                )}
              </Box>
            </Box>

            <Grid container columnSpacing={4} sx={{ mt: 2 }}>
              {persons?.map((person, index) => (
                <>
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
                                    fontSize: { xs: "13px", xl: "14px" },
                                    display: "inline-block",
                                    color: "#707070",
                                  }}
                                >
                                  Owner's Full Name <Span> *</Span>
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={9}>
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <TextField
                                  error={Boolean(
                                    formik.touched.fullName?.[index + 1] && formik.errors.fullName?.[index + 1]
                                  )}
                                  fullWidth
                                  helperText={
                                    formik.touched.fullName?.[index + 1] && formik.errors.fullName?.[index + 1]
                                  }
                                  label="Owner's Full Name"
                                  name={`fullName.${index + 1}`}
                                  id={`fullName.${index + 1}`}
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.fullName?.[index + 1]}
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
                                    fontSize: { xs: "13px", xl: "14px" },
                                    display: "inline-block",
                                    color: "#707070",
                                  }}
                                >
                                  Upload Your ID <Span> *</Span>
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={9}>
                              <Box sx={{ display: "flex", gap: 2, width: "100%", alignItems: "center" }}>
                                <Button
                                  sx={{
                                    color: "white",
                                    backgroundColor: "#60176F",
                                    fontSize: {
                                      xs: "12px",
                                      sm: "16px",
                                      lg: "17px",
                                      xl: "20px",
                                    },
                                    lineHeight: {
                                      xs: "13px",
                                      sm: "18px",
                                      lg: "19px",
                                      xl: "24px",
                                    },
                                    fontWeight: "700",
                                    fontFamily: "Lato",
                                    p: 0,
                                    m: 0,
                                    borderRadius: "10px",
                                    border: "1px solid #60176F",
                                    textTransform: "capitalize",
                                    cursor: "pointer",
                                    "&:hover": {
                                      background: "#60176F",
                                      color: "white",
                                      opacity: 0.8,
                                    },
                                    "&:focus": {
                                      background: "#60176F",
                                      color: "white",
                                      opacity: 0.8,
                                    },
                                    "&:active": {
                                      background: "#60176F",
                                      color: "white",
                                      opacity: 0.8,
                                    },
                                    "&:disabled": {
                                      cursor: "not-allowed",
                                      border: "none",
                                      background: "#60176F",
                                      color: "white",
                                      opacity: 0.5,
                                    },
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    aria-label="upload picture"
                                    component="label"
                                    gutterBottom
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      color: "white",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                      px: 2,
                                      py: 1,
                                      m: 0,
                                    }}
                                  >
                                    Browse File
                                    <input
                                      accept=".pdf"
                                      id="file-upload"
                                      type="file"
                                      onChange={(e) => handleUploadId(e, index + 1)}
                                      style={{
                                        display: "none",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    />
                                  </Typography>
                                </Button>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: "#707070",
                                    fontSize: { xs: "13px", sm: "14px" },
                                    textAlign: "center",
                                    fontWeight: 600,
                                  }}
                                >
                                  Allowed file type (.pdf,.jpg, .jpeg,.png)
                                </Typography>
                              </Box>
                              {formik?.values?.ownerId?.[index + 1] && (
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: "#707070",
                                    fontSize: { xs: "13px", sm: "14px" },
                                    textAlign: "start",
                                    fontWeight: 700,
                                    mt: 2,
                                  }}
                                >
                                  Selected File: {formik.values.ownerId?.[index + 1]?.name}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </>
              ))}
            </Grid>
          </Box>

          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                backgroundColor: "#f5f5f5",
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
                Location Details
              </Typography>
            </Box>
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
                                fontSize: { xs: "13px", xl: "14px" },
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Location (Address) <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched.location && formik.errors.location)}
                              fullWidth
                              helperText={formik.touched.location && formik.errors.location}
                              label="Location"
                              name={`location`}
                              id="location"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.location}
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
                                fontSize: { xs: "13px", xl: "14px" },
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Upload Site Map <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "flex", gap: 2, width: "100%", alignItems: "center" }}>
                            <Button
                              sx={{
                                color: "white",
                                backgroundColor: "#60176F",
                                fontSize: {
                                  xs: "12px",
                                  sm: "16px",
                                  lg: "17px",
                                  xl: "20px",
                                },
                                lineHeight: {
                                  xs: "13px",
                                  sm: "18px",
                                  lg: "19px",
                                  xl: "24px",
                                },
                                fontWeight: "700",
                                fontFamily: "Lato",
                                p: 0,
                                m: 0,
                                borderRadius: "10px",
                                border: "1px solid #60176F",
                                textTransform: "capitalize",
                                cursor: "pointer",
                                "&:hover": {
                                  background: "#60176F",
                                  color: "white",
                                  opacity: 0.8,
                                },
                                "&:focus": {
                                  background: "#60176F",
                                  color: "white",
                                  opacity: 0.8,
                                },
                                "&:active": {
                                  background: "#60176F",
                                  color: "white",
                                  opacity: 0.8,
                                },
                                "&:disabled": {
                                  cursor: "not-allowed",
                                  border: "none",
                                  background: "#60176F",
                                  color: "white",
                                  opacity: 0.5,
                                },
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                aria-label="upload picture"
                                component="label"
                                gutterBottom
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  color: "white",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  px: 2,
                                  py: 1,
                                  m: 0,
                                }}
                              >
                                Browse File
                                <input
                                  accept=".pdf, .png, .jpeg, .jpg"
                                  id="file-upload"
                                  type="file"
                                  onChange={handleUploadSiteMap}
                                  style={{
                                    display: "none",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                />
                              </Typography>
                            </Button>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#707070",
                                fontSize: { xs: "13px", sm: "14px" },
                                textAlign: "center",
                                fontWeight: 600,
                              }}
                            >
                              Allowed file type (.pdf,.jpg, .jpeg,.png)
                            </Typography>
                          </Box>
                          {formik.touched.sitemap && formik.errors.sitemap && (
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "red",
                                fontSize: { xs: "13px", sm: "14px" },
                              }}
                            >
                              {formik?.errors?.sitemap}
                            </Typography>
                          )}
                          {selectedSiteMapFile && (
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#707070",
                                fontSize: { xs: "13px", sm: "14px" },
                                textAlign: "start",
                                fontWeight: 700,
                                mt: 2,
                              }}
                            >
                              Selected File: {selectedSiteMapFile?.name}
                            </Typography>
                          )}
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
            <Button type="button" disabled variant="contained" sx={{ minWidth: "118px" }}>
              Buy
            </Button>
          </Box>
        </Container>
      </Box>
    </form>
  );
};

CreateProposals.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateProposals;
