import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { randomeNumberGenerater } from "src/utils/randomeNumberGenerater";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { socket } from "src/utils/socket";
import {
  clearTravelProposalQuotesLiast,
  setTravelProposalQuotationList,
  setTravelSocketLoader,
} from "src/sections/travel-insurance/Proposals/Reducer/travelInsuranceSlice";
import {
  getTravelDestinationList,
  getTravelRelationList,
  getQuotelistFromAdmin,
} from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import { debounce } from "src/utils/debounce-search";
import { addDays, startOfDay, differenceInYears } from "date-fns";
import { getNationalities } from "src/sections/Proposals/Action/proposalsAction";
import AnimationLoader from "src/components/amimated-loader";
import PhoneInputs from "src/components/phoneInput";
import { dateFormate } from "src/utils/date-formate";

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
  const [isLoading, setIsLoading] = useState(true);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [showInputField, setShowInputField] = useState(false);
  const [destinationPlace, setDestination] = useState([]);
  const [relationList, setReletionList] = useState([]);
  const [otherArray, setOtherArray] = useState([]);

  // Function to tigger completion of regenerate & travel socket loader
  const tiggerCompletionOfRegenerate = () => {
    dispatch(setTravelSocketLoader(false));
  };

  // Function to tigger completion of regenerate and deley proposals for 2 seconds
  const debounceProposalsHandler = debounce(tiggerCompletionOfRegenerate, 2000);

  // Formik handler
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      mobileNumber: "",
      insuranceType: "",
      source: "",
      sales: "",
      period: "",
      travellers: [
        {
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          gender: "",
          relation: "Principal",
          salutation: "",
          passportNumber: "",
          age: "",
        },
      ],
    },

    validationSchema: Yup.object({
      inceptionDate: Yup.date()
        .min(startOfDay(addDays(new Date(), 1)), "Must select future date!")
        .required("Start Date is required")
        .typeError("Start Date is required"),
      destination: Yup.string().required("Destination is Required"),
      period: Yup.string().required("Period is Required"),
      insuranceType: Yup.string().required("insuranceType is Required"),
      mobileNumber: Yup.string()
        .matches(/^5/, "Mobile number should starts with 5")
        .min(9)
        .max(9)
        .required("Mobile number is Required"),
      source: Yup.string().required("source is Required"),
      sales: Yup.string()
        .required("Required")
        .when(["source"], {
          is: (value) => value === "Source",
          then: (schema) => Yup.string().required("Required"),
          otherwise: (schema) => Yup.string(),
        }),
      country: Yup.string().required("Departure Country is Required"),
      travellers: Yup.array().of(
        Yup.object().shape({
          firstName: Yup.string().required("First name is required"),
          lastName: Yup.string().required("Last name is required"),
          email:
            otherArray?.length < 1
              ? Yup.string().email("Invalid email address").required("Email is required")
              : Yup.string().notRequired(),
          dateOfBirth: Yup.date()
            .max(new Date(), "Date of birth cannot be in the future")
            .min(
              new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate()),
              "You must be younger than 100 years old"
            )
            .typeError("Date of birth is required"),
          gender: Yup.string().required("Gender is required"),
          relation: Yup.string().required("Relation is required"),
          salutation: Yup.string().required("Salutation is required"),
          passportNumber: Yup.string().required("Passport number is required"),
        })
      ),
    }),

    onSubmit: async (values, helpers) => {
      // console.log(values, "ele");
      let travellers = [];
      values?.travellers?.map((i, idx) => {
        travellers?.push({
          ...i,
          dateOfBirth: i?.dateOfBirth ? dateFormate(i?.dateOfBirth) : "-",
          mobileNumber: values?.mobileNumber,
          mobile: values?.mobile,
          countryCode: values?.countryCode,
          email: values?.travellers?.[0]?.email,
        });
      });

      const payload = {
        travellers: travellers,
        country: values?.country || "United Arab Emirates",
        destination: values?.destination,
        inceptionDate: values?.inceptionDate ? dateFormate(values?.inceptionDate) : "-",
        insuranceType: values.insuranceType,
        period: values.period,
        source: values?.source,
        sales: values?.sales || "",
        reqId: reqId,
      };

      if (values.insuranceType === "FAMILY") {
        if (otherArray.length < 1) {
          toast.error("Please Fill others Familiy Members details");
          return;
        }
      } else if (values.insuranceType === "GROUP") {
        if (otherArray.length < 1) {
          toast.error("Please Fill others GROUP Members details");
          return;
        }
      }

      if (socket) {
        dispatch(clearTravelProposalQuotesLiast());
        if (socket.disconnected) socket.connect();
        socket.off("travel-quote-created");
        socket.emit("join", { room: reqId });
        socket.on("travel-quote-created", (quote) => {
          if (quote?.Errors?.length > 0) {
          } else {
            // We get quote here
            dispatch(setTravelProposalQuotationList(quote));
            debounceProposalsHandler();
            dispatch(setTravelSocketLoader(true));
          }
        });
        socket.off("travel-quote-counter");
        socket.on("travel-quote-counter", (count) => {});
      }
      setIsLoading(false);
      dispatch(getQuotelistFromAdmin(payload))
        .unwrap()
        .then((res) => {
          if (res?.data?.success) {
            toast("Successfully created", {
              type: "success",
            });
            setIsLoading(true);
            formik.resetForm();
            router.push(`/travel-insurance/proposals/${res?.data?.data?.proposalNo}`);
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          setIsLoading(true);
        });

      if (values.insuranceType === "FAMILY" || values.insuranceType === "GROUP") {
        if (otherArray.length < 1) {
          toast.error("Please select others details");
          return;
        }
      }
    },
  });

  // Search Nationalities and get Nationalities list
  const searchNationalities = () => {
    dispatch(getNationalities({}))
      .unwrap()
      .then((res) => {
        setNationalityOptions(res.data);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        console.error(err);
      });
  };

  useEffect(() => {
    searchNationalities();
  }, []);

  // Function to calculate age
  const ageCalculationhandler = (value, index) => {
    const dob = startOfDay(new Date(value));
    const currentDate = startOfDay(new Date());
    const age = differenceInYears(currentDate, dob);
    formik.setFieldValue(`travellers[${index}].age`, age);
  };

  // Function to show input field
  useEffect(() => {
    if (formik.values.source === "Source") {
      setShowInputField(true);
    } else {
      setShowInputField(false);
    }
  }, [formik.values.source]);

  // Function to add others travellers details
  const addOther = () => {
    const array = otherArray;
    array.push(1);
    formik.setFieldValue(`travellers.[${array?.length}].relation`, "");
    formik.setFieldValue(`travellers.[${array?.length}].gender`, "");
    formik.setFieldValue(`travellers.[${array?.length}].lastName`, "");
    formik.setFieldValue(`travellers.[${array?.length}].firstName`, "");
    formik.setFieldValue(`travellers.[${array?.length}].dateOfBirth`, "");
    formik.setFieldValue(`travellers.[${array?.length}].age`, "");
    setOtherArray([...array]);
  };

  // Function to remove others travellers details
  const removeOthers = () => {
    const othersValues = formik?.values?.travellers;
    othersValues?.pop();
    formik?.setFieldValue(othersValues);
    const array = otherArray;
    array.pop();
    setOtherArray([...array]);
  };

  // Function to check others checkbox
  const onOtherCheckboxHandler = (value) => {
    if (value) {
      setOtherArray([1]);
      formik.setFieldValue(`travellers.[1].firstName`, "");
      formik.setFieldValue(`travellers.[1].lastName`, "");
      formik.setFieldValue(`travellers.[1].dateOfBirth`, "");
      formik.setFieldValue(`travellers.[1].gender`, "");
      formik.setFieldValue(`travellers.[1].relation`, "");
      formik.setFieldValue(`travellers.[1].age`, "");
    } else {
      setOtherArray([]);
      formik.setFieldValue("travellers", formik?.values?.travellers?.[0]);
    }
  };

  // Function to get travel destination lists
  const getTravelDestinationLists = () => {
    dispatch(getTravelDestinationList({}))
      .unwrap()
      .then((res) => {
        setDestination(res.data);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
        // setIsLoading(false);
      });
  };

  // Function to get relation list
  useEffect(() => {
    dispatch(getTravelRelationList({}))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        setReletionList(res?.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  useEffect(() => {
    getTravelDestinationLists();
  }, []);

  // Function to focus on first error
  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      if (document.getElementById(Object.keys(formik.errors)[0]))
        document.getElementById(Object.keys(formik.errors)[0]).focus();
    }
  }, [formik]);

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
              <NextLink href="/travel-insurance/proposals" passHref>
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

          {!isLoading && (
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
              Destination details
            </Typography>

            <Grid container columnSpacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={5.8}>
                {" "}
                {/* sm was 4.5 */}
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
                                fontWeight: "700",
                                fontSize: "13px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Departure Country<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box
                            sx={{
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                              }}
                            >
                              <Autocomplete
                                id="country"
                                options={destinationPlace}
                                loading={false}
                                value={formik.values.country}
                                onChange={(e, value) => {
                                  formik.setFieldValue("country", value);

                                  if (!value) {
                                    formik.setFieldValue("country", "");
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Departure Country"
                                    name="country"
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                                    }}
                                  />
                                )}
                              />

                              {formik.errors.country && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontSize: "12px",
                                    display: "inline-block",
                                    color: "red",
                                  }}
                                >
                                  {formik.errors.country}
                                </Typography>
                              )}
                            </Box>
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
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Destination<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box
                            sx={{
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <Autocomplete
                              id="destination"
                              options={destinationPlace}
                              loading={false}
                              value={formik.values.destination}
                              onChange={(e, value) => {
                                formik.setFieldValue("destination", value);

                                if (!value) {
                                  formik.setFieldValue("destination", "");
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Destination"
                                  name="destination"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                                  }}
                                />
                              )}
                            />

                            {formik.errors.destination && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.destination}
                              </Typography>
                            )}
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
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Period<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box
                            sx={{
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <TextField
                              type="number"
                              error={Boolean(formik.touched.period && formik.errors.period)}
                              fullWidth
                              helperText={formik.touched.period && formik.errors.period}
                              label="Period"
                              name="period"
                              id="period"
                              onBlur={formik.handleBlur}
                              InputProps={{ inputProps: { min: 1 } }}
                              onChange={formik.handleChange}
                              value={formik.values.period}
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
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Start Date<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="Start Date"
                              minDate={startOfDay(addDays(new Date(), 1))}
                              onChange={(value) => {
                                formik.setFieldValue("inceptionDate", value);
                              }}
                              x
                              renderInput={(params) => (
                                <TextField
                                  name="inceptionDate"
                                  id="inceptionDate"
                                  fullWidth
                                  {...params}
                                  error={Boolean(formik.touched.inceptionDate && formik.errors.inceptionDate)}
                                  helperText={formik.touched.inceptionDate && formik.errors.inceptionDate}
                                />
                              )}
                              value={formik.values.inceptionDate ? formik.values.inceptionDate : ""}
                            />

                            {formik.errors.inceptionDate && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.inceptionDate}
                              </Typography>
                            )}
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
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Insurance Type<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box
                            sx={{
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <TextField
                              error={Boolean(formik.touched.insuranceType && formik.errors.insuranceType)}
                              helperText={formik.touched.insuranceType && formik.errors.insuranceType}
                              fullWidth
                              label="Insurance Type"
                              name="insuranceType"
                              id="insuranceType"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.insuranceType}
                            >
                              <option value=""></option>
                              <option value="FAMILY"> FAMILY </option>
                              <option value="GROUP"> GROUP </option>
                              <option value="INDIVIDUAL"> Individual </option>
                            </TextField>
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
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Source<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box
                            sx={{
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <TextField
                              error={Boolean(formik.touched.source && formik.errors.source)}
                              helperText={formik.touched.source && formik.errors.source}
                              fullWidth
                              label="Source"
                              name="source"
                              id="source"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.source}
                            >
                              <option value=""></option>
                              <option value="Social Media">Social Media</option>
                              <option value="WhatsApp Campaign">WhatsApp Campaign</option>
                              <option value="Email Campaign">Email Campaign</option>
                              <option value="Friend Referral">Friend Referral</option>
                              <option value="Source">Source</option>
                            </TextField>
                          </Box>
                        </Grid>
                        {showInputField && (
                          <>
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
                                    fontWeight: "700",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    color: "#707070",
                                  }}
                                >
                                  Sales<Span> *</Span>
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={12} md={9}>
                              <Box
                                sx={{
                                  display: "inline-block",
                                  width: "100%",
                                }}
                              >
                                <TextField
                                  error={Boolean(formik.touched.sales && formik.errors.sales)}
                                  fullWidth
                                  helperText={formik.touched.sales && formik.errors.sales}
                                  label="Sales"
                                  name="sales"
                                  id="sales"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.sales}
                                  type="text"
                                />
                              </Box>
                            </Grid>
                          </>
                        )}
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
                              First name <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(
                                formik.touched?.travellers?.[0]?.firstName && formik.errors?.travellers?.[0]?.firstName
                              )}
                              fullWidth
                              helperText={
                                formik.touched?.travellers?.[0]?.firstName && formik.errors?.travellers?.[0]?.firstName
                              }
                              label="First name"
                              name="travellers.[0].firstName"
                              id="travellers.[0].firstName"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values?.travellers?.[0]?.firstName}
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
                              Last name <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(
                                formik.touched?.travellers?.[0]?.lastName && formik.errors?.travellers?.[0]?.lastName
                              )}
                              fullWidth
                              helperText={
                                formik.touched?.travellers?.[0]?.lastName && formik.errors?.travellers?.[0]?.lastName
                              }
                              label="Last name"
                              name="travellers.[0].lastName"
                              id="travellers.[0].lastName"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values?.travellers?.[0]?.lastName}
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
                              Mobile Number <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <PhoneInputs name={`mobileNumber`} formik={formik} />
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
                              Email <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(
                                formik.touched?.travellers?.[0]?.email && formik.errors?.travellers?.[0]?.email
                              )}
                              fullWidth
                              helperText={
                                formik.touched?.travellers?.[0]?.email && formik.errors?.travellers?.[0]?.email
                              }
                              label="Email address"
                              name="travellers.[0].email"
                              id="travellers.[0].email"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values?.travellers?.[0]?.email}
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
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Nationality <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(
                                formik.touched?.travellers?.[0]?.nationality &&
                                  formik.errors?.travellers?.[0]?.nationality
                              )}
                              helperText={
                                formik.touched?.travellers?.[0]?.nationality &&
                                formik.errors?.travellers?.[0]?.nationality
                              }
                              fullWidth
                              label="Nationality"
                              name="travellers.[0].nationality"
                              id="travellers.[0].nationality"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values?.travellers?.[0]?.nationality}
                            >
                              <option value=""></option>
                              {nationalityOptions?.map((n) => {
                                return <option value={n}>{n}</option>;
                              })}
                            </TextField>
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
                              Passport Number<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(
                                formik.touched?.travellers?.[0]?.passportNumber &&
                                  formik.errors?.travellers?.[0]?.passportNumber
                              )}
                              fullWidth
                              helperText={
                                formik.touched?.travellers?.[0]?.passportNumber &&
                                formik.errors?.travellers?.[0]?.passportNumber
                              }
                              label="Passport Number"
                              name="travellers.[0].passportNumber"
                              id="travellers.[0].passportNumber"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values?.travellers?.[0]?.passportNumber}
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
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Date of birth <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <DatePicker
                              inputFormat="dd-MM-yyyy"
                              label="Date Of Birth"
                              maxDate={new Date()}
                              onChange={(value) => {
                                formik.setFieldValue("travellers.[0].dateOfBirth", value);
                                if (value != "Invalid Date" && value) {
                                  ageCalculationhandler(value, 0);
                                } else {
                                  formik.setFieldValue(`travellers[0].age`, "");
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  name="dateOfBirth"
                                  id="dateOfBirth"
                                  fullWidth
                                  {...params}
                                  error={Boolean(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                />
                              )}
                              value={
                                formik.values?.travellers?.[0]?.dateOfBirth
                                  ? formik.values?.travellers?.[0]?.dateOfBirth
                                  : ""
                              }
                            />

                            {formik.touched?.travellers?.[0]?.dateOfBirth &&
                              formik.errors?.travellers?.[0]?.dateOfBirth && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontSize: "12px",
                                    display: "inline-block",
                                    color: "red",
                                  }}
                                >
                                  {formik.errors?.travellers?.[0]?.dateOfBirth}
                                </Typography>
                              )}
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
                              Age
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              fullWidth
                              disabled
                              label="Age (Years)"
                              name="age"
                              id="age"
                              value={formik.values.travellers?.[0]?.age || ""}
                              type="number"
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
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Select Relation<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box
                            sx={{
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <TextField
                              error={Boolean(
                                formik.touched?.travellers?.[0]?.relation && formik.errors?.travellers?.[0]?.relation
                              )}
                              helperText={
                                formik.touched?.travellers?.[0]?.relation && formik.errors?.travellers?.[0]?.relation
                              }
                              fullWidth
                              label="Select Relation"
                              name="travellers.[0].relation"
                              id="travellers.[0].relation"
                              onBlur={formik.handleBlur}
                              disabled
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values?.travellers?.[0]?.relation}
                            >
                              <option value=""></option>
                              <option value="Principal"> Principal </option>
                            </TextField>
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
                              Gender <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="travellers.[0].gender"
                              id="travellers.[0].gender"
                              value={formik?.values?.travellers?.[0]?.gender}
                              onChange={formik.handleChange}
                              onBlur={formik?.handleBlur}
                            >
                              <FormControlLabel
                                value="Female"
                                control={<Radio size="small" />}
                                label={
                                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                    Female
                                  </Typography>
                                }
                              />
                              <FormControlLabel
                                value="Male"
                                control={<Radio size="small" />}
                                label={
                                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>Male</Typography>
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                          {formik?.errors?.travellers?.[0]?.gender && (
                            <Typography
                              sx={{
                                mb: 0.5,
                                fontSize: "12px",
                                color: "#d32f2f",
                              }}
                            >
                              {formik?.errors?.travellers?.[0]?.gender}
                            </Typography>
                          )}
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
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Select Salutation<Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box
                            sx={{
                              display: "inline-block",
                              width: "100%",
                            }}
                          >
                            <TextField
                              error={Boolean(
                                formik.touched?.travellers?.[0]?.salutation &&
                                  formik.errors?.travellers?.[0]?.salutation
                              )}
                              helperText={
                                formik.touched?.travellers?.[0]?.salutation &&
                                formik.errors?.travellers?.[0]?.salutation
                              }
                              fullWidth
                              label="Select salutation"
                              name="travellers.[0].salutation"
                              id="travellers.[0].salutation"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values?.travellers?.[0]?.salutation}
                            >
                              {formik.values?.travellers?.[0]?.gender == `Male` ? (
                                <>
                                  <option value={""}></option>
                                  <option value={"Mr"}>Mr</option>
                                  <option value={"Master"}>Master</option>
                                  <option value={"Child"}>Child</option>
                                  <option value={"Infant"}>Infant</option>
                                  <option value={"Dr"}>Dr</option>
                                </>
                              ) : formik.values?.travellers?.[0]?.gender == `Female` ? (
                                <>
                                  <option value={""}></option>
                                  <option value={"Mrs"}>Mrs</option>
                                  <option value={"Ms"}>Ms</option>
                                  <option value={"Miss"}>Miss</option>
                                  <option value={"Child"}>Child</option>
                                  <option value={"Infant"}>Infant</option>
                                  <option value={"Dr"}>Dr</option>
                                </>
                              ) : (
                                <>
                                  <option value={""}></option>
                                  <option value={"Mr"}>Mr</option>
                                  <option value={"Mrs"}>Mrs</option>
                                  <option value={"Ms"}>Ms</option>
                                  <option value={"Miss"}>Miss</option>
                                  <option value={"Child"}>Child</option>
                                  <option value={"Infant"}>Infant</option>
                                  <option value={"Dr"}>Dr</option>
                                  <option value={"Master"}>Master</option>
                                </>
                              )}{" "}
                            </TextField>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {formik.values.insuranceType !== "INDIVIDUAL" && (
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
                  py: 1.5,
                  width: "100%",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                    px: "14px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  {formik.values.insuranceType ? formik.values.insuranceType : "Others"} Details
                  <Checkbox onChange={(e) => onOtherCheckboxHandler(e?.target?.checked)} />
                </Typography>
                <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
                  {otherArray?.length > 0 && (
                    <>
                      <AddCircleIcon onClick={addOther} sx={{ color: "#60176F" }} />
                      {otherArray?.length > 1 && <RemoveCircleIcon onClick={removeOthers} sx={{ color: "#60176F" }} />}
                    </>
                  )}
                </Box>
              </Box>

              {otherArray?.map((ele, idx) => {
                return (
                  <Grid key={idx} container columnSpacing={4} rowSpacing={1} sx={{ p: 2 }}>
                    <Grid item xs={11} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            First Name
                          </Typography>
                          <Span> *</Span>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <TextField
                            fullWidth
                            error={Boolean(
                              formik.touched.travellers &&
                                formik.errors.travellers &&
                                formik.touched.travellers?.[idx + 1] &&
                                formik.errors.travellers?.[idx + 1] &&
                                formik.touched.travellers?.[idx + 1]?.firstName &&
                                formik.errors.travellers?.[idx + 1]?.firstName
                            )}
                            helperText={
                              formik.touched.travellers &&
                              formik.errors.travellers &&
                              formik.touched.travellers?.[idx + 1] &&
                              formik.errors.travellers?.[idx + 1] &&
                              formik.touched.travellers?.[idx + 1]?.firstName &&
                              formik.errors.travellers?.[idx + 1]?.firstName
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik?.values?.travellers?.[idx + 1]?.firstName}
                            label="First Name"
                            name={`travellers[${idx + 1}].firstName`}
                            type="text"
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Last Name
                          </Typography>
                          <Span> *</Span>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <TextField
                            fullWidth
                            error={Boolean(
                              formik.touched.travellers &&
                                formik.errors.travellers &&
                                formik.touched.travellers?.[idx + 1] &&
                                formik.errors.travellers?.[idx + 1] &&
                                formik.touched.travellers?.[idx + 1]?.lastName &&
                                formik.errors.travellers?.[idx + 1]?.lastName
                            )}
                            helperText={
                              formik.touched.travellers &&
                              formik.errors.travellers &&
                              formik.touched.travellers?.[idx + 1] &&
                              formik.errors.travellers?.[idx + 1] &&
                              formik.touched.travellers?.[idx + 1]?.lastName &&
                              formik.errors.travellers?.[idx + 1]?.lastName
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik?.values?.travellers?.[idx + 1]?.lastName}
                            label="Last Name"
                            name={`travellers[${idx + 1}].lastName`}
                            type="text"
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Date Of Birth
                          </Typography>
                          <Span> *</Span>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <DatePicker
                            inputFormat="dd-MM-yyyy"
                            label="Date Of Birth"
                            maxDate={new Date()}
                            onChange={(value) => {
                              formik.setFieldValue(`travellers[${idx + 1}].dateOfBirth`, value);
                              if (value != "Invalid Date" && value) {
                                ageCalculationhandler(value, idx + 1);
                              } else {
                                formik.setFieldValue(`travellers[${idx + 1}].age`, "");
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                name={`travellers[${idx + 1}].dateOfBirth`}
                                fullWidth
                                {...params}
                                error={false}
                              />
                            )}
                            value={formik.values?.travellers?.[idx + 1]?.dateOfBirth}
                          />

                          {formik.touched.travellers &&
                            formik.errors.travellers &&
                            formik.touched.travellers[idx + 1] &&
                            formik.errors.travellers[idx + 1] &&
                            formik.touched?.travellers?.[idx + 1]?.dateOfBirth &&
                            formik.errors?.travellers?.[idx + 1]?.dateOfBirth && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors?.travellers?.[idx + 1]?.dateOfBirth}
                              </Typography>
                            )}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Age
                          </Typography>
                        </Box>
                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(
                                formik.touched.age &&
                                  formik.errors.travellers &&
                                  formik.touched.travellers?.[idx + 1] &&
                                  formik.errors.travellers?.[idx + 1] &&
                                  formik.touched?.travellers[idx + 1]?.age &&
                                  formik.errors?.travellers[idx + 1]?.age
                              )}
                              fullWidth
                              disabled
                              helperText={
                                formik.touched.travellers &&
                                formik.errors.travellers &&
                                formik.touched.travellers?.[idx + 1] &&
                                formik.errors.travellers?.[idx + 1] &&
                                formik.touched?.travellers?.[idx + 1]?.age &&
                                formik.errors?.travellers?.[idx + 1]?.age
                              }
                              label="Age (Years)"
                              name={`travellers[${idx + 1}].age`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values?.travellers?.[idx + 1]?.age || ""}
                              type="number"
                            />
                          </Box>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Gender
                          </Typography>
                          <Span> *</Span>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <TextField
                            error={Boolean(
                              formik.touched.travellers &&
                                formik.errors.travellers &&
                                formik.touched.travellers?.[idx + 1] &&
                                formik.errors.travellers?.[idx + 1] &&
                                formik.touched?.travellers[idx + 1]?.gender &&
                                formik.errors?.travellers[idx + 1]?.gender
                            )}
                            helperText={
                              formik.touched.travellers &&
                              formik.errors.travellers &&
                              formik.touched.travellers?.[idx + 1] &&
                              formik.errors.travellers?.[idx + 1] &&
                              formik.touched?.travellers?.[idx + 1]?.gender &&
                              formik.errors?.travellers?.[idx + 1]?.gender
                            }
                            fullWidth
                            label="Gender"
                            name={`travellers[${idx + 1}].gender`}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.travellers?.[idx + 1]?.gender}
                          >
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </TextField>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Select Relation<Span> *</Span>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <TextField
                            error={Boolean(
                              formik.touched.travellers &&
                                formik.errors.travellers &&
                                formik.touched.travellers?.[idx + 1] &&
                                formik.errors.travellers?.[idx + 1] &&
                                formik.touched?.travellers[idx + 1]?.relation &&
                                formik.errors?.travellers[idx + 1]?.relation
                            )}
                            helperText={
                              formik.touched.travellers &&
                              formik.errors.travellers &&
                              formik.touched.travellers?.[idx + 1] &&
                              formik.errors.travellers?.[idx + 1] &&
                              formik.touched?.travellers?.[idx + 1]?.relation &&
                              formik.errors?.travellers?.[idx + 1]?.relation
                            }
                            fullWidth
                            label="Select Relation"
                            name={`travellers[${idx + 1}].relation`}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.travellers?.[idx + 1]?.relation}
                          >
                            <option value={""}></option>
                            {relationList?.map((ele) => {
                              return <option value={ele}>{ele}</option>;
                            })}
                          </TextField>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Passport Number<Span> *</Span>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <TextField
                            fullWidth
                            error={Boolean(
                              formik.touched.travellers &&
                                formik.errors.travellers &&
                                formik.touched.travellers?.[idx + 1] &&
                                formik.errors.travellers?.[idx + 1] &&
                                formik.touched.travellers?.[idx + 1]?.passportNumber &&
                                formik.errors.travellers?.[idx + 1]?.passportNumber
                            )}
                            helperText={
                              formik.touched.travellers &&
                              formik.errors.travellers &&
                              formik.touched.travellers?.[idx + 1] &&
                              formik.errors.travellers?.[idx + 1] &&
                              formik.touched.travellers?.[idx + 1]?.passportNumber &&
                              formik.errors.travellers?.[idx + 1]?.passportNumber
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik?.values?.travellers?.[idx + 1]?.passportNumber}
                            label="Passport Number"
                            name={`travellers[${idx + 1}].passportNumber`}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
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
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Select Salutation<Span> *</Span>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <TextField
                            error={Boolean(
                              formik.touched.travellers &&
                                formik.errors.travellers &&
                                formik.touched.travellers?.[idx + 1] &&
                                formik.errors.travellers?.[idx + 1] &&
                                formik.touched?.travellers[idx + 1]?.salutation &&
                                formik.errors?.travellers[idx + 1]?.salutation
                            )}
                            helperText={
                              formik.touched.travellers &&
                              formik.errors.travellers &&
                              formik.touched.travellers?.[idx + 1] &&
                              formik.errors.travellers?.[idx + 1] &&
                              formik.touched?.travellers?.[idx + 1]?.salutation &&
                              formik.errors?.travellers?.[idx + 1]?.salutation
                            }
                            fullWidth
                            label="Select Salutation"
                            name={`travellers[${idx + 1}].salutation`}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.travellers?.[idx + 1]?.salutation}
                          >
                            {formik.values?.travellers?.[idx + 1]?.gender == `Male` ? (
                              <>
                                <option value={""}></option>
                                <option value={"Mr"}>Mr</option>
                                <option value={"Master"}>Master</option>
                                <option value={"Child"}>Child</option>
                                <option value={"Infant"}>Infant</option>
                                <option value={"Dr"}>Dr</option>
                              </>
                            ) : formik.values?.travellers?.[idx + 1]?.gender == `Female` ? (
                              <>
                                <option value={""}></option>
                                <option value={"Mrs"}>Mrs</option>
                                <option value={"Ms"}>Ms</option>
                                <option value={"Miss"}>Miss</option>
                                <option value={"Child"}>Child</option>
                                <option value={"Infant"}>Infant</option>
                                <option value={"Dr"}>Dr</option>
                              </>
                            ) : (
                              <>
                                <option value={""}></option>
                                <option value={"Mr"}>Mr</option>
                                <option value={"Mrs"}>Mrs</option>
                                <option value={"Ms"}>Ms</option>
                                <option value={"Miss"}>Miss</option>
                                <option value={"Child"}>Child</option>
                                <option value={"Infant"}>Infant</option>
                                <option value={"Dr"}>Dr</option>
                                <option value={"Master"}>Master</option>
                              </>
                            )}
                          </TextField>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained">
              Generate
            </Button>
            <Button type="button" disabled variant="contained" onClick={() => setOpen(true)} sx={{ minWidth: "118px" }}>
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
