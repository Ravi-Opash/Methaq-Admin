import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { randomeNumberGenerater } from "src/utils/randomeNumberGenerater";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { createNewHealthProposals } from "src/sections/health-insurance/Proposals/Action/healthInsuranceAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { socket } from "src/utils/socket";
import {
  addQuoateToProposalHealthQuotationList,
  clearQuoteCount,
  setHealthProposalQuotationList,
  setHealthQuoteCount,
  setHealthSocketLoader,
  setQuoteCount,
} from "src/sections/health-insurance/Proposals/Reducer/healthInsuranceSlice";
import { getNationalities } from "src/sections/Proposals/Action/proposalsAction";
import { debounce } from "src/utils/debounce-search";
import { differenceInYears } from "date-fns";
import AnimationLoader from "src/components/amimated-loader";
import PhoneInputs from "src/components/phoneInput";

// Styled component for span (used in validation messages).
const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

// List of insurance companies (can be moved to a constants file for reusability).
const currentInsurance = [
  "Al Ittihad Al Watani",
  "AXA / GIG",
  "Al Sagr Insurance Company",
  "Arabia Insurance Company",
  "Al Buhaira National Insurance Company",
  "Al Dhafra Insurance Company",
  "Abu Dhabi National Takaful",
  "Alliance",
  "Adamjee",
  "Bupa",
  "Cigna",
  "Daman",
  "Dubai Insurance Company",
  "Dubai National Insurance Company",
  "Emirates Insurance Company",
  "Fidelity United",
  "Insurance House",
  "MedGulf",
  "MaxHealth",
  "Methaq",
  "NLGI",
  "Noor Takaful",
  "National General Insurance",
  "Orient Insurance Company",
  "Orient Takaful Insurance Company",
  "Oman / Sukoon",
  "Qatar Insurance Company",
  "RAK Insurance",
  "Salama Insurance Company",
  "SAICOHEALTH Damana",
  "Takaful Emarat",
  "Union Insurance",
  "Watania",
  "Yas Takaful",
  "Others",
];

// Hospital options (can be expanded as needed).
export const hospitalList = [{ NAME: "0" }, { NAME: "10" }, { NAME: "15" }, { NAME: "20" }, { NAME: "30" }];

// Constants for dropdown menu styles.
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

// Styled IOS Switch for custom appearance.
const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    margin: "0 !important",
    marginLeft: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#60176F",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

// UAE Emirates list (for proposer location selection).
const proposerEm = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Fujairah", "Ras Al Khaimah"];

// List of insurance companies for dropdown selection.
const insuranceCompany = [
  { label: "Abu Dhabi National Ins. Co.", value: "Abu Dhabi National Ins. Co." },
  { label: "Abu Dhabi National Takaful", value: "Abu Dhabi National Takaful" },
  { label: "Al Ain Ahlia Insurance Co.", value: "Al Ain Ahlia Insurance Co." },
  { label: "Al Buhaira National Insurance Co", value: "Al Buhaira National Insurance Co" },
  { label: "Al Dhafra National Ins. Co", value: "Al Dhafra National Ins. Co" },
  { label: "Al Fujairah National Ins. Co", value: "Al Fujairah National Ins. Co" },
  { label: "Yas Takaful", value: "Yas Takaful" },
  { label: "Al Khazna Insurance Co.", value: "Al Khazna Insurance Co." },
  { label: "Al Sagr National Ins. Co.", value: "Al Sagr National Ins. Co." },
  { label: "Al Wathba National Insurance Co.", value: "Al Wathba National Insurance Co." },
  { label: "Alliance Insurance Co.", value: "Alliance Insurance Co." },
  { label: "Arabian Scandinavian Ins. Co", value: "Arabian Scandinavian Ins. Co" },
  { label: "Arabic Islamic Ins. Co.", value: "Arabic Islamic Ins. Co." },
  { label: "HAYAH Insurance", value: "HAYAH Insurance" },
  { label: "Dar Al Takaful", value: "Dar Al Takaful" },
  { label: "Dubai Insurance Co.", value: "Dubai Insurance Co." },
  { label: "Dubai Islamic Ins. & Reins. Co.", value: "Dubai Islamic Ins. & Reins. Co." },
  { label: "Dubai National Ins. & Reins. Co", value: "Dubai National Ins. & Reins. Co" },
  { label: "Emirates Insurance Co.", value: "Emirates Insurance Co." },
  { label: "Fidelity United Insurance Co.", value: "Fidelity United Insurance Co." },
  { label: "Insurance House", value: "Insurance House" },
  { label: "Methaq Takaful Insurance Co.", value: "Methaq Takaful Insurance Co." },
  { label: "National General Insurance Co", value: "National General Insurance Co" },
  { label: "National Health Insurance Co.", value: "National Health Insurance Co." },
  { label: "Noor Takaful General", value: "Noor Takaful General" },
  { label: "Noor Takaful Family", value: "Noor Takaful Family" },
  { label: "Oman Insurance Co.", value: "Oman Insurance Co." },
  { label: "Orient Insurance Co.", value: "Orient Insurance Co." },
  { label: "Orient UNB Takaful", value: "Orient UNB Takaful" },
  { label: "RAK National Insurance Co.", value: "RAK National Insurance Co." },
  { label: "Sharjah Insurance Co.", value: "Sharjah Insurance Co." },
  { label: "Takaful Emarat", value: "Takaful Emarat" },
  { label: "Union Insurance Company", value: "Union Insurance Company" },
  { label: "National Takaful Company ( Wataina )", value: "National Takaful Company ( Wataina )" },
  { label: "None (New Car)", value: null },
];

// Generate a random request ID for the proposal.
const reqId = randomeNumberGenerater();

const CreateProposals = () => {
  // Redux dispatch hook for dispatching actions and Next.js router for navigation.
  const dispatch = useDispatch();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [nationalityOptions, setNationalityOptions] = useState([]); // Stores list of nationalities.
  const [showInputField, setShowInputField] = useState(false); // Controls visibility of dynamic input fields.
  const initialized = useRef(false); // Tracks if the component has been initialized.

  // Function to fetch nationalities from the API.
  const searchNationalities = () => {
    dispatch(getNationalities({})) // Dispatch action to get nationalities.
      .unwrap()
      .then((res) => {
        setNationalityOptions(res?.data); // Store fetched nationalities in state.
      })
      .catch((err) => {
        toast(err, { type: "error" });
        console.error(err);
      });
  };

  // Function to stop the socket loader when quote regeneration is complete.
  const tiggerCompletionOfRegenerate = () => {
    dispatch(setHealthSocketLoader(false));
  };

  // Debounced function to control the frequency of socket events.
  const debounceProposalsHandler = debounce(tiggerCompletionOfRegenerate, 2000);

  // useEffect hook to fetch nationalities when the component first mounts.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    searchNationalities();
  }, []);

  // Formik hook to handle form initialization, validation, and submission.
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      arabicName: "",
      email: "",
      age: "",
      mobileNumber: "",
      gender: "",
      maritalStatus: "Married",
      nationality: "United Arab Emirates",
      dateOfBirth: "",
      source: "",
      sales: "",
      salary: "",
      city: "",
      insurerType: "",
      opticalCoverage: false,
      dentalCoverage: false,
      spouseDetails: [],
      kidsDetails: [],
      visaStatus: "",
      otherFamilyDependentsDetails: [],
      parentDetails: [],
      domesticWorkerDetails: [],
    },

    // Validation schema using Yup to validate form inputs.
    validationSchema: Yup.object({
      fullName: Yup.string()
        .trim()
        .required("Full name is required")
        .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)+$/, "Please enter your full name")
        .min(3, "Full name must be at least 3 characters long"),
      dateOfBirth: Yup.date()
        .max(new Date(), "Date of birth must be a past date!")
        .typeError("Required")
        .required("Required"),
      nationality: Yup.string().required("Required"),
      gender: Yup.string().required("Required"),
      email: Yup.string().required("Required"),
      maritalStatus: Yup.string().required("Required"),
      mobileNumber: Yup.string().matches(/^5/, "Mobile number should start with 5").min(9).max(9).required("Required"),
      salary: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      source: Yup.string().required("Required"),
      sales: Yup.string()
        .required("Required")
        .when(["source"], {
          is: (value) => value === "Source", // Conditional validation for sales field.
          then: (schema) => Yup.string().required("Required"),
          otherwise: (schema) => Yup.string(),
        }),

      // Insurance detail
      insurerType: Yup.string().required("Required"),
      visaStatus: Yup.string().required("Required"),
      visaStatus2: Yup.string()
        .required("Required")
        .when(["visaStatus"], {
          is: (value) => value === "Change Status", // Conditional validation for visa status change.
          then: (schema) => Yup.string().required("Required"),
          otherwise: (schema) => Yup.string(),
        }),
    }),
    // Handle form submission.
    onSubmit: async (values, helpers) => {
      let kids = [];
      let spouse = [];

      // Format kids and spouse details before submitting.
      if (values?.kidsDetails?.length > 0) {
        values?.kidsDetails?.map((ele) => {
          kids.push({ ...ele, dateOfBirth: new Date(ele?.dateOfBirth)?.toISOString() });
        });
      }
      if (values?.spouseDetails?.length > 0) {
        values?.spouseDetails?.map((ele) => {
          spouse.push({ ...ele, dateOfBirth: new Date(ele?.dateOfBirth)?.toISOString() });
        });
      }

      // Construct the payload for proposal creation.
      const payload = {
        ...values,
        visaStatus: values?.visaStatus2 || values?.visaStatus,
        preferenceDetails: {
          preferredCoPay: values?.preferredCopay,
          dentalCoverage: values?.dentalCoverage,
          opticalCoverage: values?.opticalCoverage,
        },
        dateOfBirth: new Date(values?.dateOfBirth)?.toISOString(),
        kidsDetails: kids,
        spouseDetails: spouse,
        reqId: reqId,
      };

      // Clean up payload if certain fields are not provided.
      if (values?.preferredCopay) {
        delete payload.preferredCopay;
      }
      if (values?.visaStatus2) {
        delete payload.visaStatus2;
      }

      // Handle socket connection and events if the socket exists.
      if (socket) {
        if (socket.disconnected) socket.connect();
        socket.off("health-quote-created");
        socket.emit("join", { room: reqId });

        // Listen for health quote creation via socket.
        socket.on("health-quote-created", (quote) => {
          if (quote?.Errors?.length > 0) {
          } else {
            // Dispatch the created quote to Redux store.
            dispatch(setHealthProposalQuotationList(quote));
          }
        });

        // Listen for quote counter updates.
        socket.off("quote-counter");
        socket.on("quote-counter", (count) => {
          dispatch(setHealthQuoteCount(count)); // Update quote count in Redux store.
          debounceProposalsHandler();
        });
      }

      // Set loading state to false once the quote creation process completes.
      setIsLoading(false);

      // Dispatch action to create a new health proposal.
      dispatch(createNewHealthProposals(payload))
        .unwrap()
        .then((res) => {
          if (res?.data?.success) {
            toast("Successfully created", { type: "success" });
            dispatch(setHealthSocketLoader(true));
            setIsLoading(true);
            formik.resetForm();
            router.push(`/health-insurance/proposals/${res?.data?.data?.healthInfo?.proposalNo}`);
          }
        })
        .catch((err) => {
          toast(err, { type: "error" });
          setIsLoading(true);
        });
    },
  });

  // Show/hide additional input field based on 'source' field value.
  useEffect(() => {
    if (formik.values.source === "Source") {
      setShowInputField(true);
    } else {
      setShowInputField(false);
    }
  }, [formik.values.source]);

  // State for managing kids and spouse details.
  const [kidsArray, setKidsArray] = useState([]);
  const [spouseVisible, setSpouseVisible] = useState(false);

  // Add a new kid to the form.
  const addKids = () => {
    const array = kidsArray;
    formik.setFieldValue(`kidsDetails.[${array.length}].dateOfBirth`, "");
    array.push(1);
    setKidsArray([...array]);
  };

  // Remove the last added kid from the form.
  const removeKids = () => {
    const kidValues = formik?.values?.kidsDetails;
    kidValues?.pop();
    formik?.setFieldValue(kidValues);
    const array = kidsArray;
    array.pop();
    setKidsArray([...array]);
  };

  // Handle kids checkbox change (show/hide kids details).
  const onKidsCheckboxHandler = (value) => {
    if (value) {
      setKidsArray([1]);
      formik.setFieldValue("kidsDetails", [{ fullName: "", dateOfBirth: "", gender: "" }]);
    } else {
      setKidsArray([]);
      formik.setFieldValue("kidsDetails", []);
    }
  };

  // Handle spouse checkbox change (show/hide spouse details).
  const onSpouseCheckboxHandler = (value) => {
    if (value) {
      setSpouseVisible(true);
      formik.setFieldValue("spouseDetails", [{ fullName: "", dateOfBirth: "", gender: "" }]);
    } else {
      setSpouseVisible(false);
      formik.setFieldValue("spouseDetails", []);
    }
  };

  // Automatically calculate age based on the selected dateOfBirth.
  useEffect(() => {
    if (formik.values?.dateOfBirth && formik.values?.dateOfBirth !== "Invalid Date") {
      formik.setFieldValue("age", differenceInYears(new Date(), formik.values?.dateOfBirth));
    }
  }, [formik.values?.dateOfBirth]);

  // Focus on the first form field with an error during form submission.
  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      if (document.getElementById(Object.keys(formik.errors)[0])) {
        document.getElementById(Object.keys(formik.errors)[0]).focus();
      }
    }
  }, [formik]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Main container for the form */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            {/* Link back to the proposals page */}
            <Box sx={{ display: "inline-block" }}>
              <NextLink href="/health-insurance/proposals" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  {/* Arrow icon to indicate navigation */}
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Proposals</Typography>
                </Link>
              </NextLink>
            </Box>
          </Box>

          {/* Conditional rendering of the loading animation */}
          {!isLoading && (
            <>
              <AnimationLoader open={true} />
            </>
          )}
          {/* Customer deatils Section */}

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
              Customer details
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
                              Full name <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                              fullWidth
                              helperText={formik.touched.fullName && formik.errors.fullName}
                              label="Full name"
                              name="fullName"
                              id="fullName"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.fullName}
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
                              Arabic name
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
                              error={Boolean(formik.touched.arabicName && formik.errors.arabicName)}
                              inputProps={{
                                lang: "ar-AE",
                              }}
                              lang="ar-AE"
                              fullWidth
                              helperText={formik.touched.arabicName && formik.errors.arabicName}
                              label="Arabic name"
                              name="arabicName"
                              id="arabicName"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.arabicName}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={3} sx={{ my: 1 }}>
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

                        <Grid item xs={12} md={9} sx={{ my: 1 }}>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="gender"
                              id="gender"
                              value={formik?.values?.gender}
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
                              <FormControlLabel
                                value="Other"
                                control={<Radio size="small" />}
                                label={
                                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                    Other
                                  </Typography>
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                          {formik?.errors?.gender && (
                            <Typography
                              sx={{
                                mb: 0.5,
                                fontSize: "12px",
                                color: "#d32f2f",
                              }}
                            >
                              {formik?.errors?.gender}
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
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Salary <Span> *</Span>
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
                              error={Boolean(formik.touched.salary && formik.errors.salary)}
                              helperText={formik.touched.salary && formik.errors.salary}
                              fullWidth
                              label="Salary"
                              name="salary"
                              id="salary"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.salary}
                            >
                              <option value=""></option>
                              <option value="Up to 4000">Up to 4000</option>
                              <option value="4000 - 12000">4000 - 12000</option>
                              <option value="12000+">12000+</option>
                            </TextField>
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
                              onChange={(value) => {
                                formik.setFieldValue("dateOfBirth", value);
                              }}
                              disableFuture
                              renderInput={(params) => (
                                <TextField
                                  id="dateOfBirth"
                                  name="dateOfBirth"
                                  fullWidth
                                  {...params}
                                  error={Boolean(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
                                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                                />
                              )}
                              value={formik.values.dateOfBirth ? formik.values.dateOfBirth : ""}
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
                              Age
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <TextField
                              error={Boolean(formik.touched.age && formik.errors.age)}
                              fullWidth
                              disabled
                              helperText={formik.touched.age && formik.errors.age}
                              label="Age (Years)"
                              name="age"
                              id="age"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.age}
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
                                fontWeight: "600",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Nationality
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
                              id="nationality"
                              options={nationalityOptions}
                              loading={false}
                              value={formik.values.nationality}
                              onChange={(e, value) => {
                                formik.setFieldValue("nationality", value);

                                if (!value) {
                                  formik.setFieldValue("nationality", "");
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Nationality"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                                  }}
                                />
                              )}
                            />

                            {formik.touched.nationality && formik.errors.nationality && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors.nationality}
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
                              Marital status
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
                              error={Boolean(formik.touched.maritalStatus && formik.errors.maritalStatus)}
                              helperText={formik.touched.maritalStatus && formik.errors.maritalStatus}
                              fullWidth
                              label="Marital status"
                              name="maritalStatus"
                              id="maritalStatus"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.maritalStatus}
                            >
                              <option value=""></option>
                              <option value="Married"> Married </option>
                              <option value="Single"> Single </option>
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
                              Occupation
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
                              error={Boolean(formik.touched.occupation && formik.errors.occupation)}
                              fullWidth
                              helperText={formik.touched.occupation && formik.errors.occupation}
                              label="Occupation"
                              name="occupation"
                              id="occupation"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.occupation}
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
                              City <Span> *</Span>
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
                              error={Boolean(formik.touched.city && formik.errors.city)}
                              helperText={formik.touched.city && formik.errors.city}
                              fullWidth
                              label="City"
                              name="city"
                              id="city"
                              onBlur={formik.handleBlur}
                              onChange={(e) => {
                                formik.handleChange(e);
                                if (e.target.value === "Dubai") {
                                  formik.setFieldValue("visaStatus", "");
                                  formik.setFieldValue("visaStatus2", "");
                                }
                              }}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.city}
                            >
                              <option value=""></option>
                              {proposerEm.map((item) => (
                                <option value={item}>{item}</option>
                              ))}
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
                              Source <Span> *</Span>
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
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    display: "inline-block",
                                    color: "#707070",
                                  }}
                                >
                                  Sales
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
          {/* Insurance deatils Section */}

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
              Insurance Details
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
                              Insured Type <Span> *</Span>
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
                              error={Boolean(formik.touched.insurerType && formik.errors.insurerType)}
                              helperText={formik.touched.insurerType && formik.errors.insurerType}
                              fullWidth
                              label="Insured Type"
                              name="insurerType"
                              id="insurerType"
                              onBlur={formik.handleBlur}
                              onChange={(e) => {
                                formik.handleChange(e);
                                if (
                                  e.target.value === "Dependent only" ||
                                  e.target.value === "Investor’s Dependent only"
                                ) {
                                  formik.setFieldValue("visaStatus", "");
                                  formik.setFieldValue("visaStatus2", "");
                                }
                              }}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.insurerType}
                            >
                              <option value=""></option>
                              <option value="Self">Self</option>
                              <option value="Self (Investor)">Self (Investor)</option>
                              <option value="Self and Dependent">Self and Dependent</option>
                              <option value="Self (Investor) and Dependent">Self (Investor) and Dependent</option>
                              <option value="Dependent only">Dependent only</option>
                              <option value="Investor’s Dependent only">Investor’s Dependent only</option>
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
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
                              Additional features :
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12} sx={{ paddingTop: "0 !important" }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              ml: 2,
                              width: "100%",
                            }}
                          >
                            <FormControlLabel
                              sx={{ fontSize: 14 }}
                              control={<Checkbox checked={formik.values.dentalCoverage} size="small" />}
                              label={
                                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                  Dental Coverage
                                </Typography>
                              }
                              name="dentalCoverage"
                              id="dentalCoverage"
                              onChange={formik.handleChange}
                            />
                            <FormControlLabel
                              control={<Checkbox checked={formik.values.opticalCoverage} size="small" />}
                              label={
                                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                  Optical Coverage
                                </Typography>
                              }
                              name="opticalCoverage"
                              id="opticalCoverage"
                              onChange={formik.handleChange}
                            />
                          </Box>
                        </Grid>
                        {formik?.values?.visaStatus != "New" && (
                          <>
                            <Grid item xs={12} md={12}>
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
                                  Insurance expiry/change status date
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={12} sx={{ mt: -2 }}>
                              <Box sx={{ display: "inline-block", width: "100%", pl: 2 }}>
                                <DatePicker
                                  inputFormat="dd-MM-yyyy"
                                  label="Insurance expiry/change status date"
                                  onChange={(value) => {
                                    formik.setFieldValue("currentInsurerExpiryDate", value);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      name="currentInsurerExpiryDate"
                                      id="currentInsurerExpiryDate"
                                      fullWidth
                                      {...params}
                                      error={false}
                                    />
                                  )}
                                  value={
                                    formik.values.currentInsurerExpiryDate ? formik.values.currentInsurerExpiryDate : ""
                                  }
                                />

                                {formik.touched.currentInsurerExpiryDate && formik.errors.currentInsurerExpiryDate && (
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                      fontSize: "12px",
                                      display: "inline-block",
                                      color: "red",
                                    }}
                                  >
                                    {formik.errors.currentInsurerExpiryDate}
                                  </Typography>
                                )}
                              </Box>
                            </Grid>
                          </>
                        )}
                        <Grid item xs={12} md={10}>
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
                              Are you on regular medication or have existing medical conditions?
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <FormControlLabel
                              sx={{ ml: 0 }}
                              control={
                                <IOSSwitch
                                  name="regularMedication"
                                  id="regularMedication"
                                  onChange={(value, e) => {
                                    formik.setFieldValue("regularMedication", value.target.checked);
                                  }}
                                  onBlur={formik.handleBlur}
                                  checked={formik.values.regularMedication}
                                />
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={10}>
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
                              Do you smoke?
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <FormControlLabel
                              sx={{ ml: 0 }}
                              control={
                                <IOSSwitch
                                  name="smoke"
                                  id="smoke"
                                  onChange={(value, e) => {
                                    formik.setFieldValue("smoke", value.target.checked);
                                  }}
                                  onBlur={formik.handleBlur}
                                  checked={formik.values.smoke}
                                />
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={10}>
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
                              Do you have hypertension ?
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <FormControlLabel
                              sx={{ ml: 0 }}
                              control={
                                <IOSSwitch
                                  name="hypertension"
                                  id="hypertension"
                                  onChange={(value, e) => {
                                    formik.setFieldValue("hypertension", value.target.checked);
                                  }}
                                  onBlur={formik.handleBlur}
                                  checked={formik.values.hypertension}
                                />
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={10}>
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
                              Do you have Diabetes ?
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            <FormControlLabel
                              sx={{ ml: 0 }}
                              control={
                                <IOSSwitch
                                  name="diabetes"
                                  id="diabetes"
                                  onChange={(value, e) => {
                                    formik.setFieldValue("diabetes", value.target.checked);
                                  }}
                                  onBlur={formik.handleBlur}
                                  checked={formik.values.diabetes}
                                />
                              }
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
                              Preferred Co-pay
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
                            <Select
                              labelId="demo-multiple-chip-label"
                              name="preferredCopay"
                              id="preferredCopay"
                              multiple
                              fullWidth
                              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                              value={formik.values.preferredCopay || []}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              MenuProps={MenuProps}
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </Box>
                              )}
                            >
                              {hospitalList.map((h) => {
                                return <MenuItem value={h?.NAME}>{h?.NAME}</MenuItem>;
                              })}
                            </Select>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
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
                              Current visa status in the UAE <Span> *</Span>
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12} sx={{ paddingTop: "0 !important" }}>
                          <FormControl
                            sx={{
                              ml: 3,
                            }}
                          >
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="visaStatus"
                              id="visaStatus"
                              value={formik?.values?.visaStatus}
                              onChange={formik.handleChange}
                              onBlur={formik?.handleBlur}
                            >
                              <FormControlLabel
                                value="Renewal"
                                control={<Radio size="small" />}
                                label={
                                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                    Renewal
                                  </Typography>
                                }
                              />
                              {formik.values.city === "Dubai" ? (
                                <>
                                  {(formik?.values?.insurerType === "Self" ||
                                    formik?.values?.insurerType === "Self (Investor)" ||
                                    formik?.values?.insurerType === "Self and Dependent" ||
                                    formik?.values?.insurerType === "Self (Investor) and Dependent") && (
                                    <FormControlLabel
                                      value="Change Status"
                                      control={<Radio size="small" />}
                                      label={
                                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                          Change Status
                                        </Typography>
                                      }
                                    />
                                  )}
                                </>
                              ) : (
                                <FormControlLabel
                                  value="Change Status"
                                  control={<Radio size="small" />}
                                  label={
                                    <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                      Change Status
                                    </Typography>
                                  }
                                />
                              )}
                              <FormControlLabel
                                value="New"
                                control={<Radio size="small" />}
                                label={
                                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>New</Typography>
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        {formik?.values?.visaStatus === "Change Status" && (
                          <>
                            <Grid item xs={12} md={12} sx={{ paddingTop: "0 !important" }}>
                              <FormControl
                                sx={{
                                  ml: 3,
                                }}
                              >
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-row-radio-buttons-group-label"
                                  name="visaStatus2"
                                  id="visaStatus2"
                                  value={formik?.values?.visaStatus2}
                                  onChange={formik.handleChange}
                                  onBlur={formik?.handleBlur}
                                >
                                  <FormControlLabel
                                    value="Tourist/visit visa"
                                    control={<Radio size="small" />}
                                    label={
                                      <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                        Tourist/visit visa
                                      </Typography>
                                    }
                                  />
                                  <FormControlLabel
                                    value="Cancelled Visa"
                                    control={<Radio size="small" />}
                                    label={
                                      <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#707070" }}>
                                        Cancelled Visa
                                      </Typography>
                                    }
                                  />
                                </RadioGroup>
                              </FormControl>
                              {formik?.errors?.visaStatus2 && (
                                <Typography
                                  sx={{
                                    mb: 0.5,
                                    fontSize: "12px",
                                    color: "#d32f2f",
                                    ml: 3,
                                  }}
                                >
                                  {formik?.errors?.visaStatus2}
                                </Typography>
                              )}
                            </Grid>
                          </>
                        )}
                        {formik?.errors?.visaStatus && (
                          <Typography
                            sx={{
                              mb: 0.5,
                              fontSize: "12px",
                              color: "#d32f2f",
                              ml: 3,
                            }}
                          >
                            {formik?.errors?.visaStatus}
                          </Typography>
                        )}
                        {formik?.values?.visaStatus != "New" && (
                          <>
                            <Grid item xs={12} md={12}>
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
                                  Who is your current insurer
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={12} sx={{ mt: -2 }}>
                              <Box
                                sx={{
                                  display: "inline-block",
                                  width: "100%",
                                  pl: 2,
                                }}
                              >
                                <TextField
                                  error={Boolean(formik.touched.currentInsurer && formik.errors.currentInsurer)}
                                  helperText={formik.touched.currentInsurer && formik.errors.currentInsurer}
                                  fullWidth
                                  label="Who is your current insurer"
                                  name="currentInsurer"
                                  id="currentInsurer"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  select
                                  SelectProps={{ native: true }}
                                  value={formik.values.currentInsurer}
                                >
                                  <option value={""}></option>
                                  {currentInsurance?.map((ele) => {
                                    return <option value={ele}>{ele}</option>;
                                  })}
                                </TextField>
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
          {/* If select In Insurance Type Self and Dependent,Self (Investor) and Dependent,Dependent only,Investor’s Dependent only*/}
          {(formik?.values?.insurerType == "Self and Dependent" ||
            formik?.values?.insurerType == "Self (Investor) and Dependent" ||
            formik?.values?.insurerType == "Dependent only" ||
            formik?.values?.insurerType == "Investor’s Dependent only") && (
            <>
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
                  Spouse Details
                  <Checkbox onChange={(e) => onSpouseCheckboxHandler(e?.target?.checked)} />
                </Typography>

                {spouseVisible && (
                  <Grid container columnSpacing={1} sx={{ p: 1 }}>
                    <Grid item xs={11} md={6} lg={3}>
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
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Full Name
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
                              formik.touched.spouseDetails &&
                                formik.errors.spouseDetails &&
                                formik.touched.spouseDetails?.[0] &&
                                formik.errors.spouseDetails?.[0] &&
                                formik.touched.spouseDetails?.[0]?.fullName &&
                                formik.errors.spouseDetails?.[0]?.fullName
                            )}
                            helperText={
                              formik.touched.spouseDetails &&
                              formik.errors.spouseDetails &&
                              formik.touched.spouseDetails?.[0] &&
                              formik.errors.spouseDetails?.[0] &&
                              formik.touched.spouseDetails?.[0]?.fullName &&
                              formik.errors.spouseDetails?.[0]?.fullName
                            }
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik?.values?.spouseDetails?.[0]?.fullName}
                            label="Full Name"
                            name={`spouseDetails[0].fullName`}
                            type="text"
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6} lg={3}>
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
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Date Of Birth
                          </Typography>
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
                            onChange={(value) => {
                              if (value && value != "Invalid Date") {
                                formik.setFieldValue("spouseDetails[0].age", differenceInYears(new Date(), value));
                              }
                              formik.setFieldValue(`spouseDetails[0].dateOfBirth`, new Date(value), true);
                            }}
                            renderInput={(params) => (
                              <TextField name={`spouseDetails[0].dateOfBirth`} fullWidth {...params} error={false} />
                            )}
                            value={formik.values?.spouseDetails?.[0]?.dateOfBirth}
                            disableFuture
                          />

                          {formik.touched.spouseDetails &&
                            formik.errors.spouseDetails &&
                            formik.touched.spouseDetails[0] &&
                            formik.errors.spouseDetails[0] &&
                            formik.touched?.spouseDetails?.[0]?.dateOfBirth &&
                            formik.errors?.spouseDetails?.[0]?.dateOfBirth && (
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  fontSize: "12px",
                                  display: "inline-block",
                                  color: "red",
                                }}
                              >
                                {formik.errors?.spouseDetails?.[0]?.dateOfBirth}
                              </Typography>
                            )}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6} lg={3}>
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
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Age
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
                              formik.touched.spouseDetails?.[0]?.age && formik.errors.spouseDetails?.[0]?.age
                            )}
                            fullWidth
                            disabled
                            helperText={formik.touched.spouseDetails?.[0]?.age && formik.errors.spouseDetails?.[0]?.age}
                            label="Age (Years)"
                            name={`spouseDetails[0].age`}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.spouseDetails?.[0]?.age}
                            InputLabelProps={{ shrink: !!formik.values.spouseDetails?.[0]?.dateOfBirth }}
                            type="number"
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11} md={6} lg={3}>
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
                              fontWeight: "600",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Gender
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
                              formik.touched.spouseDetails &&
                                formik.errors.spouseDetails &&
                                formik.touched.spouseDetails?.[0] &&
                                formik.errors.spouseDetails?.[0] &&
                                formik.touched?.spouseDetails[0]?.gender &&
                                formik.errors?.spouseDetails[0]?.gender
                            )}
                            helperText={
                              formik.touched.spouseDetails &&
                              formik.errors.spouseDetails &&
                              formik.touched.spouseDetails?.[0] &&
                              formik.errors.spouseDetails?.[0] &&
                              formik.touched?.spouseDetails?.[0]?.gender &&
                              formik.errors?.spouseDetails?.[0]?.gender
                            }
                            fullWidth
                            label="Gender"
                            name={`spouseDetails[0].gender`}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={formik.values.spouseDetails?.[0]?.gender}
                          >
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </TextField>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                )}
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
                    Kids Details
                    <Checkbox onChange={(e) => onKidsCheckboxHandler(e?.target?.checked)} />
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
                    {kidsArray?.length > 0 && (
                      <>
                        <AddCircleIcon onClick={addKids} sx={{ color: "#60176F" }} />
                        {kidsArray?.length > 1 && <RemoveCircleIcon onClick={removeKids} sx={{ color: "#60176F" }} />}
                      </>
                    )}
                  </Box>
                </Box>

                {kidsArray?.map((ele, idx) => {
                  return (
                    <Grid key={idx} container columnSpacing={1} sx={{ p: 1 }}>
                      <Grid item xs={11} md={6} lg={3}>
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
                                fontWeight: "600",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Full Name
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
                                formik.touched.kidsDetails &&
                                  formik.errors.kidsDetails &&
                                  formik.touched.kidsDetails?.[idx] &&
                                  formik.errors.kidsDetails?.[idx] &&
                                  formik.touched.kidsDetails?.[idx]?.fullName &&
                                  formik.errors.kidsDetails?.[idx]?.fullName
                              )}
                              helperText={
                                formik.touched.kidsDetails &&
                                formik.errors.kidsDetails &&
                                formik.touched.kidsDetails?.[idx] &&
                                formik.errors.kidsDetails?.[idx] &&
                                formik.touched.kidsDetails?.[idx]?.fullName &&
                                formik.errors.kidsDetails?.[idx]?.fullName
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik?.values?.kidsDetails?.[idx]?.fullName}
                              label="Full Name"
                              name={`kidsDetails[${idx}].fullName`}
                              type="text"
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={11} md={6} lg={3}>
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
                                fontWeight: "600",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Date Of Birth
                            </Typography>
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
                              disableFuture
                              onChange={(value) => {
                                if (value && value != "Invalid Date") {
                                  formik.setFieldValue(`kidsDetails[${idx}].age`, differenceInYears(new Date(), value));
                                }
                                formik.setFieldValue(`kidsDetails[${idx}].dateOfBirth`, new Date(value), true);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  name={`kidsDetails[${idx}].dateOfBirth`}
                                  fullWidth
                                  {...params}
                                  error={false}
                                />
                              )}
                              value={formik.values?.kidsDetails?.[idx]?.dateOfBirth}
                            />

                            {formik.touched.kidsDetails &&
                              formik.errors.kidsDetails &&
                              formik.touched.kidsDetails[idx] &&
                              formik.errors.kidsDetails[idx] &&
                              formik.touched?.kidsDetails?.[idx]?.dateOfBirth &&
                              formik.errors?.kidsDetails?.[idx]?.dateOfBirth && (
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    fontSize: "12px",
                                    display: "inline-block",
                                    color: "red",
                                  }}
                                >
                                  {formik.errors?.kidsDetails?.[idx]?.dateOfBirth}
                                </Typography>
                              )}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={11} md={6} lg={3}>
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
                                fontWeight: "600",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Age
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
                                formik.touched.kidsDetails?.[idx]?.age && formik.errors.kidsDetails?.[idx]?.age
                              )}
                              fullWidth
                              disabled
                              helperText={
                                formik.touched.kidsDetails?.[idx]?.age && formik.errors.kidsDetails?.[idx]?.age
                              }
                              label="Age (Years)"
                              name={`kidsDetails[${idx}].age`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.kidsDetails?.[idx]?.age}
                              InputLabelProps={{ shrink: !!formik.values.kidsDetails?.[idx]?.dateOfBirth }}
                              type="number"
                            />
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={11} md={6} lg={3}>
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
                                fontWeight: "600",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Gender
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
                                formik.touched.kidsDetails &&
                                  formik.errors.kidsDetails &&
                                  formik.touched.kidsDetails?.[idx] &&
                                  formik.errors.kidsDetails?.[idx] &&
                                  formik.touched?.kidsDetails[idx]?.gender &&
                                  formik.errors?.kidsDetails[idx]?.gender
                              )}
                              helperText={
                                formik.touched.kidsDetails &&
                                formik.errors.kidsDetails &&
                                formik.touched.kidsDetails?.[idx] &&
                                formik.errors.kidsDetails?.[idx] &&
                                formik.touched?.kidsDetails?.[idx]?.gender &&
                                formik.errors?.kidsDetails?.[idx]?.gender
                              }
                              fullWidth
                              label="Gender"
                              name={`kidsDetails[${idx}].gender`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.kidsDetails?.[idx]?.gender}
                            >
                              <option value=""></option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </TextField>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  );
                })}
              </Box>
            </>
          )}

          {/* Generate Policy Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Button type="submit" variant="contained">
              Generate
            </Button>
            {/* Buy Policy Button */}
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
