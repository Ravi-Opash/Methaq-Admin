import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { Box, Button, Container, Link, Stack, Switch, Typography, styled } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import CreateProposalQuotationTabel from "src/sections/Proposals/create-proposal-quotation-tabel";
import {
  createNewProposals,
  getAllCarsList,
  getAllCarsModalList,
  getAllTrim,
  getBodies,
  getCalculateCarValue,
  getCarDetails,
  getCarYears,
  getNationalities,
  getSalesAgentList,
} from "src/sections/Proposals/Action/proposalsAction";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import DocsUploadOnCreate from "src/sections/Proposals/documents-upload-create-proposal";
import { ratio } from "fuzzball";
import {
  addQuoateToProposalQuotationList,
  clearDocsData,
  clearQuoteCount,
  setPath,
  setQuoteCount,
  setSocketRoomId,
} from "src/sections/Proposals/Reducer/proposalsSlice";
import { capitalizeWords } from "src/utils/capitalize-words";
import { socket } from "src/utils/socket";
import { randomeNumberGenerater } from "src/utils/randomeNumberGenerater";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { addDays, addYears, compareAsc, differenceInYears, isValid, startOfDay } from "date-fns";
import { dateFormate } from "src/utils/date-formate";
import AnimationLoader from "src/components/amimated-loader";
import CreatePrposalCustomerDetails from "src/sections/Proposals/proposal-create-customer-detail";
import ProposalCreateEidDetails from "src/sections/Proposals/proposal-create-eid-details";
import ProposalCreateDrivingLicenceDetails from "src/sections/Proposals/proposal-create-drivinglicence-details";
import ProposalCreateInsuranceDetails from "src/sections/Proposals/proposal-create-insurance-details";
import ProposalCreateCarDetails from "src/sections/Proposals/Proposal-Create-CarDetails";
import ProposalCreatePromocodeDetails from "src/sections/Proposals/proposal-create-promocode-details";

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

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const uaeStatus = ["Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah", "Sharjah", "Umm Al Quwain"];

const plateCodeLatters = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "50",
  "A",
  "AA",
  "B",
  "C",
  "D",
  "DC",
  "DU",
  "DXB",
  "E",
  "EX",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "RN",
  "S",
  "T",
  "TC",
  "TL",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const insuranceCompany = [
  {
    label: "Abu Dhabi National Ins. Co.",
    value: "Abu Dhabi National Ins. Co.",
  },
  {
    label: "Abu Dhabi National Takaful",
    value: "Abu Dhabi National Takaful",
  },
  {
    label: "Al Ain Ahlia Insurance Co.",
    value: "Al Ain Ahlia Insurance Co.",
  },
  {
    label: "Al Buhaira National Insurance Co",
    value: "Al Buhaira National Insurance Co",
  },
  {
    label: "Al Dhafra National Ins. Co",
    value: "Al Dhafra National Ins. Co",
  },
  {
    label: "Al Fujairah National Ins. Co",
    value: "Al Fujairah National Ins. Co",
  },
  {
    label: "Yas Takaful",
    value: "Yas Takaful",
  },
  {
    label: "Al Khazna Insurance Co.",
    value: "Al Khazna Insurance Co.",
  },
  {
    label: "Al Sagr National Ins. Co.",
    value: "Al Sagr National Ins. Co.",
  },
  {
    label: "Al Wathba National Insurance Co.",
    value: "Al Wathba National Insurance Co.",
  },
  {
    label: "Alliance Insurance Co.",
    value: "Alliance Insurance Co.",
  },
  {
    label: "Arabian Scandinavian Ins. Co",
    value: "Arabian Scandinavian Ins. Co",
  },
  {
    label: "Arabic Islamic Ins. Co.",
    value: "Arabic Islamic Ins. Co.",
  },
  {
    label: "HAYAH Insurance",
    value: "HAYAH Insurance",
  },
  {
    label: "Dar Al Takaful",
    value: "Dar Al Takaful",
  },
  {
    label: "Dubai Insurance Co.",
    value: "Dubai Insurance Co.",
  },
  {
    label: "Dubai Islamic Ins. & Reins. Co.",
    value: "Dubai Islamic Ins. & Reins. Co.",
  },
  {
    label: "Dubai National Ins. & Reins. Co",
    value: "Dubai National Ins. & Reins. Co",
  },
  {
    label: "Emirates Insurance Co.",
    value: "Emirates Insurance Co.",
  },
  {
    label: "Fidelity United Insurance Co.",
    value: "Fidelity United Insurance Co.",
  },
  {
    label: "Insurance House",
    value: "Insurance House",
  },
  {
    label: "Methaq Takaful Insurance Co.",
    value: "Methaq Takaful Insurance Co.",
  },
  {
    label: "National General Insurance Co",
    value: "National General Insurance Co",
  },
  {
    label: "National Health Insurance Co.",
    value: "National Health Insurance Co.",
  },
  {
    label: "Noor Takaful General",
    value: "Noor Takaful General",
  },
  {
    label: "Noor Takaful Family",
    value: "Noor Takaful Family",
  },
  {
    label: "Oman Insurance Co.",
    value: "Oman Insurance Co.",
  },
  {
    label: "Orient Insurance Co.",
    value: "Orient Insurance Co.",
  },
  {
    label: "Orient UNB Takaful",
    value: "Orient UNB Takaful",
  },
  {
    label: "RAK National Insurance Co.",
    value: "RAK National Insurance Co.",
  },
  {
    label: "Sharjah Insurance Co.",
    value: "Sharjah Insurance Co.",
  },
  {
    label: "Takaful Emarat",
    value: "Takaful Emarat",
  },
  {
    label: "Union Insurance Company",
    value: "Union Insurance Company",
  },
  {
    label: "National Takaful Company ( Wataina )",
    value: "National Takaful Company ( Wataina )",
  },
  {
    label: "None (New Car)",
    value: null,
  },
];

const reqId = randomeNumberGenerater();

const CreateProposals = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { emiratesIdDetails, drivingLicenceDetails, carRegistrationDetails, loading } = useSelector(
    (state) => state.proposals
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCar, setIsLoadingCar] = useState(true);
  const [isInsuranceExpired, setIsInsuranceExpired] = useState(false);
  const [nationalitySelected, setNationalitySelected] = useState("United Arab Emirates");

  const [isNecessary, setIsNecessary] = useState(false);
  const [enableBodyText, setEnableBodyText] = useState(false);

  const [emiratesID, setEmiratesID] = useState(null);
  const [drivingLicence, setDrivingLicence] = useState(null);
  const [registrationCarCard, setRegistrationCarCard] = useState(null);

  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [searchCar, setSearchCar] = useState([]);
  const [searchYears, setSearchedYears] = useState([]);
  const [searchModels, setSearchedModels] = useState([]);
  const [searchTrim, setSearchTrim] = useState([]);
  const [searchBodyType, setSearchBodyType] = useState([]);
  const [salesAgentlist, setSalesAgentlist] = useState([]);

  const fieldRef = useRef(null); // null;

  const [showInputField, setShowInputField] = useState(false);
  const [allYears, setAllYears] = useState([]);

  // useEffect to get all years
  useEffect(() => {
    let currentYear = new Date().getFullYear();
    dispatch(setPath("/proposals/create"));

    const years = [currentYear];
    for (let i = 0; i < 40; i++) {
      currentYear = currentYear - 1;
      years.push(currentYear);
    }

    setAllYears(years);
  }, []);

  const carOptions = searchCar?.map((value, idx) => {
    return value;
  });

  const trimOptions =
    searchTrim &&
    searchTrim?.map((value, idx) => {
      return value;
    });

  const bodyTypeOptions =
    searchBodyType &&
    (searchBodyType || [])?.map((value, idx) => {
      return {
        name: value.name,
        id: value._id,
        label: value.name,
        value: value._id,
      };
    });

  // Function to search cars
  const searchCars = (year) => {
    dispatch(getAllCarsList({ year }))
      .unwrap()
      .then((res) => {
        setSearchCar(res?.data);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        console.error(err);
      });
  };

  // Function to search years
  const fetchYears = () => {
    dispatch(getCarYears({}))
      .unwrap()
      .then((res) => {
        setSearchedYears(res?.data);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  // Function to search models
  const fetchBodyTypes = () => {
    dispatch(getBodies({}))
      .then((res) => {
        setSearchBodyType(res.payload?.data);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  // Function to search sales agents
  const fetchSalesAgentList = () => {
    dispatch(getSalesAgentList({}))
      .unwrap()
      .then((res) => {
        setSalesAgentlist(res?.data);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  // Function to search nationalities
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

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    fetchYears();
    searchNationalities();
    fetchBodyTypes();
    fetchSalesAgentList();
  }, []);

  // Function to search models
  const fetchModels = (make, year) => {
    if (!!make && !!year) {
      dispatch(getAllCarsModalList({ make: make, year: year }))
        .unwrap()
        .then((res) => {
          setSearchedModels(res?.data);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
  };

  // Function to search trims
  const fetchTrims = (make, year, model) => {
    dispatch(getAllTrim({ make: make, year: year, model: model }))
      .unwrap()
      .then((res) => {
        setSearchTrim(res.data);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  // Function to handle form submission
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      isNecessary: isNecessary || false,
      emiratesId: null, // Add the image-upload field with initial value as null
      drivingLicense: null,
      registrationCard: null,
      promoCode: "",
      // card details
      make: carRegistrationDetails?.data?.make || "",
      model: carRegistrationDetails?.data?.model || "",
      trim: carRegistrationDetails?.data?.trim || "",
      bodyType: "",
      body_type_text: "",
      cylinders: "",
      cylinders_text: "",
      year: carRegistrationDetails?.data?.year || "",
      price: "",
      valuation: "",
      age: emiratesIdDetails?.data?.dateOfBirth
        ? differenceInYears(new Date(), new Date(emiratesIdDetails?.data?.dateOfBirth))
        : "",
      regionalSpec:
        carRegistrationDetails?.data?.regionalSpec?.toLowerCase() == "non-gcc"
          ? "Non-GCC"
          : carRegistrationDetails?.data?.regionalSpec
          ? carRegistrationDetails?.data?.regionalSpec
          : "GCC",
      policyEffectiveDate: "",
      motorProduct: "",
      useOfVehicle: "Personal",
      regCardExpiryDate: carRegistrationDetails?.data?.regCardExpiryDate || "",
      registrationDate: carRegistrationDetails?.data?.registrationDate || "",
      chesisNo: carRegistrationDetails?.data?.chesisNo || "",
      registrationEmirate: uaeStatus?.includes(capitalizeWords(carRegistrationDetails?.data?.registrationEmirate))
        ? carRegistrationDetails?.data?.registrationEmirate
        : "",
      engineNumber: carRegistrationDetails?.data?.engineNumber || "",
      color: carRegistrationDetails?.data?.color || "",
      plateNumber: carRegistrationDetails?.data?.plateNumber?.split("")?.includes("/")
        ? carRegistrationDetails?.data?.plateNumber?.split("/")[1]
        : carRegistrationDetails?.data?.plateNumber
        ? carRegistrationDetails?.data?.plateNumber
        : "",
      origin: carRegistrationDetails?.data?.origin || "",
      tcNo: carRegistrationDetails?.data?.tcNo || "",
      registrationYear: carRegistrationDetails?.data?.registrationYear
        ? carRegistrationDetails?.data?.registrationYear?.split("-")[2] ||
          carRegistrationDetails?.data?.registrationYear?.split("-")[0]
        : "",
      insuranceExpiryDate: carRegistrationDetails?.data?.insuranceExpiryDate || "",
      plateCode: carRegistrationDetails?.data?.plateCode?.split("")?.includes("/")
        ? carRegistrationDetails?.data?.plateCode?.split("/")[0]
        : "",
      noOfPassengers: carRegistrationDetails?.data?.noOfPassengers || "",
      policyNumber: carRegistrationDetails?.data?.policyNumber || "",

      // customer details
      fullName: emiratesIdDetails?.data?.fullName || drivingLicenceDetails?.data?.fullName || "",
      arabicName: emiratesIdDetails?.data?.arabicName || "",
      email: "",
      mobileNumber: "",
      gender:
        emiratesIdDetails?.data?.gender === "M" ? "male" : emiratesIdDetails?.data?.gender === "F" ? "female" : "",
      occupation: emiratesIdDetails?.data?.occupation || "Manager",
      employer: emiratesIdDetails?.data?.employer || " ",
      address: drivingLicenceDetails?.data?.placeOfIssueDL || "",
      maritalStatus: "Married",
      nationality: nationalitySelected,
      dateOfBirth: emiratesIdDetails?.data?.dateOfBirth || "",
      licenceIssueDate: drivingLicenceDetails?.data?.licenceIssueDate || "",
      licenceExpiryDate: drivingLicenceDetails?.data?.licenceExpiryDate || "",
      placeOfIssueDL: uaeStatus?.includes(capitalizeWords(drivingLicenceDetails?.data?.placeOfIssueDL))
        ? drivingLicenceDetails?.data?.placeOfIssueDL
        : "",
      licenceNo: drivingLicenceDetails?.data?.licenceNo || "",
      dlTcNo: drivingLicenceDetails?.data?.dlTcNo || "",
      emiratesId: emiratesIdDetails?.data?.emiratesId || "",
      emiratesIdExpiryDate: emiratesIdDetails?.data?.emiratesIdExpiryDate || "",
      insuranceType:
        carRegistrationDetails?.data?.insureType === "Comprehensive" ||
        carRegistrationDetails?.data?.insureType === "comprehensive"
          ? "comprehensive"
          : carRegistrationDetails?.data?.insureType === "Third Party" ||
            carRegistrationDetails?.data?.insureType === "third party"
          ? "thirdparty"
          : "",
      currentInsurer: "",
      claimHistory: "",
      yearOfNoClaim: "",
      typeOfIssues: "Renewal",
      source: "",
      sales: "",
      salesCommissionAgentId: "",
    },

    validationSchema: Yup.object({
      make: Yup.string().required("Required"),
      model: Yup.string().required("Required"),
      bodyType: Yup.mixed().required("Required"),
      trim: Yup.string().required("Required"),
      cylinders: Yup.string().required("Required"),
      year: Yup.string().required("Required"),
      price: Yup.string().required("Required"),
      regionalSpec: Yup.string().required("Required"),
      noOfPassengers: Yup.string().required("Required"),
      expiredCarPhotos: Yup.array().when(["isInsuranceExpired"], {
        is: (value) => value === true,
        then: (schema) => Yup.array().of(Yup.mixed().required("Required")).min(3, "At least 3 images require"),
        otherwise: (schema) => Yup.array().notRequired(),
      }),

      plateCode: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      plateNumber: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      color: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      engineNumber: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      policyEffectiveDate: Yup.date()
        .min(addDays(new Date(), -1), "Must select future date!")
        .max(addYears(new Date(), 1), "Can't select one year after date!")
        .typeError("Required")
        .required("Required"),

      useOfVehicle: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      registrationYear: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      origin: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      registrationEmirate: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      employer: Yup.string().required("Required"),
      placeOfIssueDL: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      chesisNo: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.min(17).max(17).required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      registrationDate: Yup.date().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      regCardExpiryDate: Yup.date().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),

      // customer details
      fullName: Yup.string().required("Required"),
      arabicName: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      email: Yup.string().required("Required"),
      gender: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      occupation: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      maritalStatus: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      address: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      mobileNumber: Yup.string().matches(/^5/, "Mobile number should starts with 5").min(9).max(9).required("Required"),
      licenceNo: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      dlTcNo: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      tcNo: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      nationality: Yup.string().required("Required"),
      dateOfBirth: Yup.string().required("Required"),
      currentInsurer: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      licenceIssueDate: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      claimHistory: Yup.string().required("Required"),
      yearOfNoClaim: Yup.string().required("Required"),
      typeOfIssues: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      licenceExpiryDate: Yup.date().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.min(new Date(), "Driving licence expired!").typeError("Required").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      insuranceExpiryDate: Yup.date().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.typeError("Required").required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      source: Yup.string().required("Required"),
      insuranceType: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      sales: Yup.string()
        .required("Required")
        .when(["source"], {
          is: (value) => value === "Source",
          then: (schema) => Yup.string().required("Required"),
          otherwise: (schema) => Yup.string(),
        }),
      emiratesId: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      emiratesIdExpiryDate: Yup.string().when("isNecessary", {
        is: (value) => value != true,
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    onSubmit: async (values, helpers) => {
      setIsLoading(false);

      if (!isValidDate(values.dateOfBirth) || !isValidDate(values.policyEffectiveDate)) {
        toast.error("Invalid date value detected. Please check the date fields.");
        setIsLoading(true);

        return;
      }

      if (isInsuranceExpired && (!values?.expiredCarPhotos || values?.expiredCarPhotos?.length < 3)) {
        toast("Current insurance expired! Upload car images to proceed further!", {
          type: "error",
        });
        const element = document.getElementById("car-images");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
          });
        }
        setIsLoading(true);
        return;
      }

      const finalSubmitData = {
        promoCode: values?.promoCode,
        // card details
        make: values.make,
        model: values.model,
        trim: values.trim,
        bodyType: values.body_type_text || values?.bodyType?.name,
        cylinders: values.cylinders,
        year: values.year,
        price: values.price,
        regionalSpec: values.regionalSpec,
        policyEffectiveDate: dateFormate(new Date(values.policyEffectiveDate).toISOString()),
        regCardExpiryDate: values.regCardExpiryDate
          ? dateFormate(new Date(values.regCardExpiryDate).toISOString())
          : "",
        registrationDate: values.registrationDate ? dateFormate(new Date(values.registrationDate).toISOString()) : "",
        chesisNo: values.chesisNo ? values.chesisNo?.toUpperCase() : "",
        motorProduct: values.motorProduct || "",
        useOfVehicle: values.useOfVehicle || "Personal",
        tcNo: values.tcNo || "",
        registrationYear: values.registrationYear || "",
        registrationEmirate: values.registrationEmirate || "",
        engineNumber: values.engineNumber || "",
        color: values.color || "",
        plateCode: values.plateCode || "",
        noOfPassengers: values.noOfPassengers || "",
        plateNumber: values.plateNumber || "",
        origin: values.origin || "",
        policyNumber: values.policyNumber || "",
        valuation: values?.valuation,

        // customer details
        fullName: values.fullName,
        arabicName: values.arabicName || "",
        gender: values.gender || "",
        age: values.age || "",
        email: values.email.toLowerCase(),
        mobileNumber: values.mobileNumber,
        licenceNo: values.licenceNo || "",
        nationality: values.nationality,
        occupation: values.occupation || "",
        employer: values.employer || "",
        address: values.address || "",
        dateOfBirth: values.dateOfBirth ? dateFormate(new Date(values.dateOfBirth).toISOString()) : "",
        maritalStatus: values.maritalStatus || "",
        licenceIssueDate: values.licenceIssueDate ? dateFormate(new Date(values.licenceIssueDate).toISOString()) : "",
        licenceExpiryDate: values.licenceExpiryDate
          ? dateFormate(new Date(values.licenceExpiryDate).toISOString())
          : "",
        placeOfIssueDL: values.placeOfIssueDL || "",
        currentInsurer: values.currentInsurer || "",
        insureType: values.insuranceType || "",
        insuranceExpiryDate: values.insuranceExpiryDate
          ? dateFormate(new Date(values.insuranceExpiryDate).toISOString())
          : "",
        claimHistory: values.claimHistory,
        yearOfNoClaim: values.yearOfNoClaim,
        licenseSource: values.licenseSource || "",
        emiratesId: values.emiratesId || "",
        emiratesIdExpiryDate: values.emiratesIdExpiryDate
          ? dateFormate(new Date(values.emiratesIdExpiryDate).toISOString())
          : "",
        dlTcNo: values.dlTcNo || "",
        typeOfIssues: values.typeOfIssues || "",
        source: values.source || "",
        sales: values.sales || "",
        isQuickProposal: isNecessary || false,

        salesCommissionAgentId: values.salesCommissionAgentId || "",
        oneYearLicence: true,
        roomId: reqId,
      };

      dispatch(setSocketRoomId(reqId));

      if (socket) {
        if (socket.disconnected) socket.connect();
        socket.emit("join", { room: reqId });

        socket.off("admin-proposal-created");
        socket.on("admin-proposal-created", (quote) => {
          if (quote?.Errors?.length > 0) {
          } else {
            dispatch(addQuoateToProposalQuotationList(quote));
            dispatch(setQuoteCount(-1));
          }
        });

        socket.off("quote-counter");

        socket.on("quote-counter", (count) => {
          dispatch(setQuoteCount(count));
          setTimeout(() => {
            dispatch(clearQuoteCount());
          }, 30000);
        });
      }

      const formData = jsonToFormData(finalSubmitData);
      emiratesID?.map((file, idx) => {
        formData.append("emiratesId", file);
      });
      drivingLicence?.map((file, idx) => {
        formData.append("drivingLicense", file);
      });
      registrationCarCard?.map((file, idx) => {
        formData.append("registrationCard", file);
      });
      values?.expiredCarPhotos?.map((i, idx) => {
        formData?.append("expiredCarPhotos", values?.expiredCarPhotos?.[idx]);
      });

      if (finalSubmitData) {
        dispatch(createNewProposals({ formData, roomId: reqId }))
          .unwrap()
          .then((res) => {
            // console.log("res", res);
            if (res?.data?.success) {
              toast("Successfully created", {
                type: "success",
              });
              dispatch(clearDocsData());
              formik.resetForm();
              router.push(`/proposals/${res?.data?.data?.proposalNo}`).then(() => {
                setIsLoading(true);
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            setIsLoading(true);
          });
      }
    },
  });

  //  round to nearest hundred
  function roundToNearestHundred(value) {
    return Math.round(value / 100) * 100;
  }

  // API calling - get car value
  const getCarValueHandler = (data) => {
    setIsLoadingCar(true);
    if (data) {
      setIsLoadingCar(false);
      dispatch(getCalculateCarValue(data))
        .unwrap()
        .then((res) => {
          formik.setFieldValue("price", roundToNearestHundred(res?.data?.predicted_price));
          formik.setFieldValue("valuation", res?.data?.valuation);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        })
        .finally(() => {
          setIsLoadingCar(true);
        });
    }
  };

  // API calling - get car details cylinders
  const fetchBodyTypesandCylinders = (make, model, trim, year, regionalSpec) => {
    dispatch(getCarDetails({ make: make, model: model, trim: trim, year: year }))
      .unwrap()
      .then((res) => {
        getCarValueHandler({
          make,
          model,
          trim,
          year,
          ...res.data,
          regionalSpec,
        });

        formik.setFieldValue("cylinders", res?.data?.cylinders ? res?.data?.cylinders : "");
        formik.setFieldValue("cylinders_text", res?.data?.cylinders);

        formik.setFieldValue("body_type_text", res?.data?.bodyType);
        if (bodyTypeOptions?.includes(res?.data?.bodyType)) {
          setEnableBodyText(true);
        } else {
          setEnableBodyText(false);
        }
        formik.setFieldValue("bodyType", res?.data?.bodyType);

        if (res?.data?.noOfPassengers) {
          formik.setFieldValue("noOfPassengers", res?.data?.noOfPassengers);
        }
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };
  
  // Function to show input field
  useEffect(() => {
    if (formik.values.source === "Source") {
      setShowInputField(true);
    } else {
      setShowInputField(false);
    }
  }, [formik.values.source]);

  useEffect(() => {
    if (carRegistrationDetails?.data && insuranceCompany) {
      insuranceCompany.map((Insurer, idx) => {
        if (ratio(Insurer?.value, carRegistrationDetails?.data?.currentInsurer?.replace(/[^\x00-\x7F]/g, "")) > 90) {
          formik.setFieldValue("currentInsurer", Insurer?.value);
        }
      });
    }
  }, [carRegistrationDetails?.data, drivingLicenceDetails]);

  useEffect(() => {
    if (carRegistrationDetails?.data && searchYears) {
      searchYears.map((year, idx) => {
        if (ratio(year, carRegistrationDetails?.data?.year?.replace(/[^\x00-\x7F]/g, "")) == 100) {
          formik.setFieldValue("year", year);
          searchCars(year);
        }
      });
    }
  }, [carRegistrationDetails?.data, emiratesIdDetails?.data, drivingLicenceDetails]);

  useEffect(() => {
    if (carRegistrationDetails?.data && carOptions && formik.values.year) {
      carOptions.map((make, idx) => {
        if (ratio(make, carRegistrationDetails?.data?.make) == 100) {
          formik.setFieldValue("make", make);
          fetchModels(make, formik.values.year);
        }
      });
    }
  }, [carRegistrationDetails?.data, carOptions?.length, emiratesIdDetails?.data, drivingLicenceDetails]);

  useEffect(() => {
    if (carRegistrationDetails?.data && searchModels && formik.values.make && formik.values.year) {
      searchModels.map((model, idx) => {
        if (ratio(model, carRegistrationDetails?.data?.model?.replace(/[^\x00-\x7F]/g, "")) == 100) {
          formik.setFieldValue("model", model);
          fetchTrims(formik.values.make, formik.values.year, model);
        }
      });
    }
  }, [carRegistrationDetails?.data, searchModels?.length, emiratesIdDetails?.data, drivingLicenceDetails]);

  useEffect(() => {
    if (formik.values.make && formik.values.year && formik.values.model && formik.values.trim) {
      fetchBodyTypesandCylinders(
        formik.values.make,
        formik.values.model,
        formik.values.trim,
        formik.values.year,
        formik.values.regionalSpec || "GCC"
      );
    }
  }, [
    formik.values.make,
    formik.values.model,
    formik.values.trim,
    formik.values.year,
    emiratesIdDetails?.data,
    drivingLicenceDetails,
  ]);

  useEffect(() => {
    if (emiratesIdDetails?.data && nationalityOptions) {
      nationalityOptions.map((nation, idx) => {
        if (ratio(nation, emiratesIdDetails?.data?.nationality) > 90) {
          formik.setFieldValue("nationality", nation);
          setNationalitySelected(nation);
        }
      });
    }
  }, [emiratesIdDetails?.data, carRegistrationDetails, drivingLicenceDetails]);

  useEffect(() => {
    if (formik.values.claimHistory) {
      if (formik.values.claimHistory == "false") {
        formik.setFieldValue("yearOfNoClaim", "No Claims for Five Years");
      }
      if (formik.values.claimHistory == "true" && formik.values.yearOfNoClaim == "No Claims for Five Years") {
        formik.setFieldValue("yearOfNoClaim", "");
      }
    }
  }, [formik.values.claimHistory]);

  // Fuction to reset emirates value
  const resetEmiratesValue = () => {
    formik.setFieldValue("nationality", "United Arab Emirates");
    formik.setFieldValue("emiratesIdExpiryDate", "");
    formik.setFieldValue("emiratesId", "");
    formik.setFieldValue("dateOfBirth", "");
    formik.resetForm({
      nationality: "United Arab Emirates",
      emiratesIdExpiryDate: "",
      emiratesId: "",
      dateOfBirth: "",
    });
  };

  useEffect(() => {
    if (formik.values?.dateOfBirth && formik.values?.dateOfBirth != "Invalid Date") {
      formik.setFieldValue("age", differenceInYears(new Date(), new Date(formik.values?.dateOfBirth)));
    }
  }, [formik.values?.dateOfBirth]);

  // Fuction to check insurance date
  const checkInsuranceDateValidation = (policyDate, insuranceDate) => {
    if (isValid(new Date(policyDate)) && isValid(new Date(insuranceDate))) {
      if (
        compareAsc(new Date(startOfDay(new Date(insuranceDate))), new Date(startOfDay(new Date(policyDate)))) === -1
      ) {
        setIsInsuranceExpired(true);
        formik?.setFieldValue("isInsuranceExpired", true);
      } else {
        setIsInsuranceExpired(false);
        formik?.setFieldValue("isInsuranceExpired", false);
        formik?.setFieldValue("expiredCarPhotos", []);
      }
    }
  };

  useEffect(() => {
    if (formik?.values?.policyEffectiveDate && formik?.values?.insuranceExpiryDate) {
      checkInsuranceDateValidation(formik?.values?.policyEffectiveDate, formik?.values?.insuranceExpiryDate);
    }
  }, [formik?.values?.policyEffectiveDate, formik?.values?.insuranceExpiryDate]);

  useEffect(() => {
    if (
      carRegistrationDetails?.data?.insuranceExpiryDate &&
      isValid(new Date(carRegistrationDetails?.data?.insuranceExpiryDate))
    ) {
      checkInsuranceDateValidation(
        formik?.values?.policyEffectiveDate,
        new Date(carRegistrationDetails?.data?.insuranceExpiryDate)
      );
    }
  }, [carRegistrationDetails?.data?.insuranceExpiryDate]);

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
              <NextLink href="/proposals" passHref>
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

          <Stack spacing={1} mb={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">Create Proposals</Typography>
              <Box sx={{ mt: "20px !important", display: "flex", gap: 2 }}>
                <Typography variant="h6">Quick Proposal</Typography>
                <IOSSwitch
                  name={"aa"}
                  onChange={(e) => {
                    setIsNecessary(e.target.checked);
                    formik.setFieldValue("isNecessary", e.target.checked);
                  }}
                />
              </Box>
            </Box>
          </Stack>

          {!isLoading && (
            <>
              <AnimationLoader open={!isLoading} />
            </>
          )}
          <>
            <Box
              sx={{
                display: "inline-block",
                width: "100%",
                mb: 3,
                borderRadius: "10px",
                background: "white",
                boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  p: 1,
                  borderRadius: "10px 10px 0 0",
                }}
              >
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    mb: 0,
                    pl: 1,
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                  }}
                >
                  Quotations
                </Typography>
              </Box>

              <Box sx={{ display: "inline-block", width: "100%" }}>
                <CreateProposalQuotationTabel />
              </Box>
            </Box>

            <Box>
              <DocsUploadOnCreate
                setIsLoading={setIsLoading}
                setRegistrationCarCard={setRegistrationCarCard}
                setDrivingLicence={setDrivingLicence}
                setEmiratesID={setEmiratesID}
                resetEmiratesValue={resetEmiratesValue}
              />
            </Box>

            <CreatePrposalCustomerDetails
              formik={formik}
              isNecessary={isNecessary}
              nationalityOptions={nationalityOptions}
              showInputField={showInputField}
            />

            <ProposalCreateEidDetails formik={formik} isNecessary={isNecessary} />

            <ProposalCreateDrivingLicenceDetails formik={formik} isNecessary={isNecessary} uaeStatus={uaeStatus} />

            <ProposalCreateInsuranceDetails
              formik={formik}
              isNecessary={isNecessary}
              insuranceCompany={insuranceCompany}
              fieldRef={fieldRef}
            />

            <ProposalCreateCarDetails
              formik={formik}
              isNecessary={isNecessary}
              searchYears={searchYears}
              fieldRef={fieldRef}
              carOptions={carOptions}
              searchModels={searchModels}
              trimOptions={trimOptions}
              loading={loading}
              bodyTypeOptions={bodyTypeOptions}
              isLoadingCar={isLoadingCar}
              allYears={allYears}
              uaeStatus={uaeStatus}
              plateCodeLatters={plateCodeLatters}
              isInsuranceExpired={isInsuranceExpired}
              enableBodyText={enableBodyText}
              setSearchCar={setSearchCar}
              searchCars={searchCars}
              setSearchedModels={setSearchedModels}
              setSearchTrim={setSearchTrim}
              fetchModels={fetchModels}
              fetchTrims={fetchTrims}
              fetchBodyTypesandCylinders={fetchBodyTypesandCylinders}
            />

            <ProposalCreatePromocodeDetails formik={formik} salesAgentlist={salesAgentlist} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained">
                Generate
              </Button>
              <Button type="button" disabled variant="contained" sx={{ minWidth: "118px" }}>
                Buy
              </Button>
            </Box>
          </>
        </Container>
      </Box>
    </form>
  );
};

CreateProposals.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateProposals;
