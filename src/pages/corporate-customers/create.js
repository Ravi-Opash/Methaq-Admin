import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

import { DatePicker } from "@mui/x-date-pickers";
import {
  createNewCorporateCustomer,
  updateCorporateCustomerById,
} from "src/sections/corporate-customer/action/corporateCustomerAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { useDispatch, useSelector } from "react-redux";
import { dateFormate } from "src/utils/date-formate";
import { useRouter } from "next/router";
import { FileDropzone } from "src/components/file-dropzone";
import PhoneInputs from "src/components/phoneInput";
import { bytesToSize } from "src/utils/bytes-to-size";
import AnimationLoader from "src/components/amimated-loader";
import { isValidFile } from "src/utils/is-file-validation";
import { getAllAgentlist } from "src/sections/Proposals/Action/proposalsAction";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

const sourceOfBuss = ["Direct", "Referral", "Agents"];

// Function to find object is empty or not
function isEmpty(obj) {
  if (obj) {
    return Object.keys(obj).length === 0;
  } else {
    return true;
  }
}

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
    value: "None",
  },
];

const subProductsList = [
  {
    label: "Engineering and Construction",
    value: "Engineering and Construction",
  },
  {
    label: "Liability Insurance",
    value: "Liability Insurance",
  },
  {
    label: "Marine Cargo Insurance",
    value: "Marine Cargo Insurance",
  },
  {
    label: "Marine Hull Insurance",
    value: "Marine Hull Insurance",
  },
  {
    label: "Commercial Property Insurance",
    value: "Commercial Property Insurance",
  },
  {
    label: "Business Travel Insurance",
    value: "Business Travel Insurance",
  },
  {
    label: "Group Medical Insurance",
    value: "Group Medical Insurance",
  },
  {
    label: "Motor Fleet Insurance",
    value: "Motor Fleet Insurance",
  },
  {
    label: "Energy Insurance",
    value: "Energy Insurance",
  },
  {
    label: "Office Multicover Insurance (SME’s)",
    value: "Office Multicover Insurance (SME’s",
  },
  {
    label: "Cyber Insurance",
    value: "Cyber Insurance",
  },
  {
    label: "Musataha Insurance",
    value: "Musataha Insurance",
  },
];

const proposerEm = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];
const industryName = [
  "Agriculture",
  "Automotive",
  "Banking and Finance",
  "Construction",
  "Consumer Goods",
  "Education",
  "Energy",
  "Healthcare",
  "Hospitality",
  "Information Technology",
  "Manufacturing",
  "Media and Entertainment",
  "Real Estate",
  "Retail",
  "Telecommunications",
  "Transportation and Logistics",
  "Utilities",
  "Others",
];

const CreateProposals = () => {
  const dispatch = useDispatch();
  const { corporateCustomerDetails } = useSelector((state) => state.corporateCustomer);
  const [comtactPersonArray, setContactPersonArray] = useState([1]);
  const router = useRouter();
  const [carFleetVisible, setCarFleetVisible] = useState(
    !isEmpty(corporateCustomerDetails?.data?.carFleetInsurance?.carFleet)
  );
  const [healthInsVisible, setHealthInsVisible] = useState(
    !isEmpty(corporateCustomerDetails?.data?.healthInsurance?.health)
  );
  const [generalInsVisible, setGeneralInsVisible] = useState(
    !isEmpty(corporateCustomerDetails?.data?.generalInsurance?.general)
  );
  const [isLoading, setIsLoading] = useState(false);
  const { customerId } = router.query;

  const [generalInsuranceArray, setGeneralInsuranceArray] = useState([1]);
  const [healthInsuranceArray, setHealthInsuranceArray] = useState([1]);
  const [carFleetInsuanceArray, setCarFleetInsuanceArray] = useState([1]);
  const [carFleetCustomFilesArray, setCarFleetCustomFilesArray] = useState([]);
  const [generalCustomFilesArray, setGeneralCustomFilesArray] = useState([]);
  const [healthCustomFilesArray, setHealthCustomFilesArray] = useState([]);
  const [removedCarFleetFiles, setRemovedCarFleetFiles] = useState([]);
  const [removedHealthFiles, setRemovedHealthFiles] = useState([]);
  const [removedGeneralFiles, setRemovedGeneralFiles] = useState([]);
  const [showInputField, setShowInputField] = useState(false);
  const [agentList, setAgentList] = useState([]);
  const initial = useRef(false);

  useEffect(() => {
    if (corporateCustomerDetails?.data?.contactPersons?.length > 0) {
      let array = [];
      corporateCustomerDetails?.data?.contactPersons?.map((i) => {
        array?.push(1);
      });
      setContactPersonArray(array);
    }

    // Store each insurance details and file array in states
    if (corporateCustomerDetails?.data?.generalInsurance?.general?.length > 0) {
      let array = [];
      corporateCustomerDetails?.data?.generalInsurance?.general?.map((i) => {
        array?.push(1);
      });
      setGeneralInsuranceArray(array);
    }
    if (corporateCustomerDetails?.data?.generalInsurance?.customFiles?.length > 0) {
      let array = [];
      corporateCustomerDetails?.data?.generalInsurance?.customFiles?.map((i) => {
        array?.push(1);
      });
      setGeneralCustomFilesArray(array);
    }
    if (corporateCustomerDetails?.data?.healthInsurance?.health?.length > 0) {
      let array = [];
      corporateCustomerDetails?.data?.healthInsurance?.health?.map((i) => {
        array?.push(1);
      });
      setHealthInsuranceArray(array);
    }
    if (corporateCustomerDetails?.data?.healthInsurance?.customFiles?.length > 0) {
      let array = [];
      corporateCustomerDetails?.data?.healthInsurance?.customFiles?.map((i) => {
        array?.push(1);
      });
      setHealthCustomFilesArray(array);
    }
    if (corporateCustomerDetails?.data?.carFleetInsurance?.carFleet?.length > 0) {
      let array = [];
      corporateCustomerDetails?.data?.carFleetInsurance?.carFleet?.map((i) => {
        array?.push(1);
      });
      setCarFleetInsuanceArray(array);
    }
    if (corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.length > 0) {
      let array = [];
      corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.map((i) => {
        array?.push(1);
      });
      setCarFleetCustomFilesArray(array);
    }
  }, [corporateCustomerDetails?.data]);

  let carDocsinit = [];
  if (corporateCustomerDetails?.data?.carFleetInsurance?.customFiles) {
    carDocsinit = [
      ...corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.reduce((acc, e) => {
        return [...acc, { originalname: e?.originalname || "", file: e || "" }];
      }, []),
    ];
  }
  let healthDocsinit = [];
  if (corporateCustomerDetails?.data?.healthInsurance?.customFiles) {
    healthDocsinit = [
      ...corporateCustomerDetails?.data?.healthInsurance?.customFiles?.reduce((acc, e) => {
        return [...acc, { originalname: e?.originalname || "", file: e || "" }];
      }, []),
    ];
  }

  let generalDocsinit = [];
  if (corporateCustomerDetails?.data?.generalInsurance?.customFiles) {
    generalDocsinit = [
      ...corporateCustomerDetails?.data?.generalInsurance?.customFiles?.reduce((acc, e) => {
        return [...acc, { originalname: e?.originalname || "", file: e || "" }];
      }, []),
    ];
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: corporateCustomerDetails ? corporateCustomerDetails?.data?.fullName : "",
      emirates: corporateCustomerDetails ? corporateCustomerDetails?.data?.emirates : "Abu Dhabi",
      industry: corporateCustomerDetails ? corporateCustomerDetails?.data?.industry : "",
      tradeLicense: corporateCustomerDetails ? corporateCustomerDetails?.data?.tradeLicense : "",
      businessOfRecord: corporateCustomerDetails ? corporateCustomerDetails?.data?.businessOfRecord : "",
      source: corporateCustomerDetails ? corporateCustomerDetails?.data?.source : "",
      agent: corporateCustomerDetails ? corporateCustomerDetails?.data?.agent : "",
      contactPersons: corporateCustomerDetails?.data?.contactPersons || [
        {
          personName: "",
          email: "",
          mobileNumber: "",
          position: "",
        },
      ],
      carFleet: !isEmpty(corporateCustomerDetails?.data?.carFleetInsurance?.carFleet)
        ? corporateCustomerDetails?.data?.carFleetInsurance?.carFleet
        : [],
      carCustomDocuments: !isEmpty(corporateCustomerDetails?.data?.carFleetInsurance?.customFiles) ? carDocsinit : [],
      health: !isEmpty(corporateCustomerDetails?.data?.healthInsurance?.health)
        ? corporateCustomerDetails?.data?.healthInsurance?.health
        : [],
      healthCustomDocuments: !isEmpty(corporateCustomerDetails?.data?.healthInsurance?.customFiles)
        ? healthDocsinit
        : [],
      general: !isEmpty(corporateCustomerDetails?.data?.generalInsurance?.general)
        ? corporateCustomerDetails?.data?.generalInsurance?.general
        : [],
      generalCustomDocuments: !isEmpty(corporateCustomerDetails?.data?.generalInsurance?.customFiles)
        ? generalDocsinit
        : [],
      carFleetVisible: !isEmpty(corporateCustomerDetails?.data?.carFleetInsurance?.carFleet),
      carFleetCustomFileVisible: !isEmpty(corporateCustomerDetails?.data?.carFleetInsurance?.customFiles),
      healthInsVisible: !isEmpty(corporateCustomerDetails?.data?.healthInsurance?.health),
      healthCustomFileVisible: !isEmpty(corporateCustomerDetails?.data?.healthInsurance?.customFiles),
      generalInsVisible: !isEmpty(corporateCustomerDetails?.data?.generalInsurance?.general),
      generalCustomFileVisible: !isEmpty(corporateCustomerDetails?.data?.generalInsurance?.customFiles),
    },

    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      emirates: Yup.string().required("Required"),
      industry: Yup.string().required("Required"),
      // tradeLicense: Yup.mixed().required("Required"),
      // businessOfRecord: Yup.mixed().required("Required"),
      source: Yup.string().required("Required"),
      // agent: Yup.string()
      // .required("Required")
      // .when(["source"], {
      //   is: (value) => value === "Agents",
      //   then: (schema) => Yup.string().required("Required"),
      //   otherwise: (schema) => Yup.string(),
      // }),
      contactPersons: Yup.array().of(
        Yup.object().shape({
          personName: Yup.string().required("Required"),
          // email: Yup.string().email("Invalid email").required("Required"),
          mobileNumber: Yup.string()
            .matches(/^5/, "Mobile number should starts with 5")
            .min(9, "Mobile number should be 9 digits long")
            .max(9, "Mobile number should be 9 digits long")
            .required("Required"),
          position: Yup.string().required("Required"),
        })
      ),
      carFleet: Yup.array().when(["carFleetVisible"], {
        is: (value) => value === true,
        then: (schema) =>
          Yup.array().of(
            Yup.object().shape({
              currentInsurer: Yup.string().required("Required"),
              existingBroker: Yup.string().required("Required"),
              renewalDate: Yup.date()
                .typeError("Required")
                .required("Required")
                .min(new Date(), "Date should be in the future"),
              existingBrokernoOfYears: Yup.number().max(20, "Maximum 20 years is allowed").required("Required"),
              currentInsurernoOfYears: Yup.number().max(20, "Maximum 20 years is allowed").required("Required"),
              noOfCars: Yup.number().min(1, "Number of cars must be at least 1").required("Number of cars is required"),
              probability: Yup.number().typeError("Required"),
            })
          ),
        otherwise: (schema) => Yup.array().notRequired(),
      }),
      health: Yup.array().when(["healthInsVisible"], {
        is: (value) => value === true,
        then: (schema) =>
          Yup.array().of(
            Yup.object().shape({
              currentInsurer: Yup.string().required("Required"),
              existingBroker: Yup.string().required("Required"),
              renewalDate: Yup.date()
                .typeError("Required")
                .required("Required")
                .min(new Date(), "Date should be in the future"),
              existingBrokernoOfYears: Yup.number().max(20, "Maximum 20 years is allowed").required("Required"),
              currentInsurernoOfYears: Yup.number().max(20, "Maximum 20 years is allowed").required("Required"),
              type: Yup.string().required("Required"),
              probability: Yup.number().typeError("Required"),
              groupSize: Yup.number()
                .min(0, "Number of cars must be at least 0")
                .required("Number of groupSize is required"),
              noOfPeople: Yup.number()
                .min(1, "Number of cars must be at least 1")
                .required("Number of noOfPeople is required"),
            })
          ),
        otherwise: (schema) => Yup.array().notRequired(),
      }),
      general: Yup.array().when(["generalInsVisible"], {
        is: (value) => value === true,
        then: (schema) =>
          Yup.array().of(
            Yup.object().shape({
              currentInsurer: Yup.string().required("Required"),
              existingBroker: Yup.string().required("Required"),
              renewalDate: Yup.date()
                .typeError("Required")
                .required("Required")
                .min(new Date(), "Date should be in the future"),
              currentInsurernoOfYears: Yup.number().max(20, "Maximum 20 years is allowed").required("Required"),
              existingBrokernoOfYears: Yup.string().required("Required"),
              probability: Yup.number().typeError("Required"),
              subProduct: Yup.string().required("Required"),
            })
          ),
        otherwise: (schema) => Yup.array().notRequired(),
      }),
      carCustomDocuments: Yup.array().of(
        Yup.object({
          file: Yup.mixed().required("File is required"),
          originalname: Yup.string().required("File name is required"),
        })
      ),
      healthCustomDocuments: Yup.array().of(
        Yup.object({
          file: Yup.mixed().required("File is required"),
          originalname: Yup.string().required("File name is required"),
        })
      ),
      generalCustomDocuments: Yup.array().of(
        Yup.object({
          file: Yup.mixed().required("File is required"),
          originalname: Yup.string().required("File name is required"),
        })
      ),
    }),

    onSubmit: async (values, helpers) => {
      // console.log(values, "values");
      // return;
      let payload = { ...values };
      if (formik?.values?.tradeLicense?.destination) {
        delete payload?.tradeLicense;
      }
      if (formik?.values?.businessOfRecord?.destination) {
        delete payload?.businessOfRecord;
      }

      // Remove empty objects
      if (!generalInsVisible) {
        delete payload?.general;
        delete payload?.generalCustomDocuments;
      }
      if (!healthInsVisible) {
        delete payload?.health;
        delete payload?.healthCustomDocuments;
      }
      if (!carFleetVisible) {
        delete payload?.carFleet;
        delete payload?.carCustomDocuments;
      }

      // Change date to ISO formate
      let carFleetData = [];
      if (payload?.carFleet?.length > 0) {
        payload?.carFleet?.map((ele) => {
          carFleetData?.push({ ...ele, renewalDate: dateFormate(ele?.renewalDate) });
        });
        payload = {
          ...payload,
          carFleet: carFleetData,
        };
      }
      let healthInsuranceData = [];
      if (payload?.health?.length > 0) {
        payload?.health?.map((ele) => {
          healthInsuranceData?.push({ ...ele, renewalDate: dateFormate(ele?.renewalDate) });
        });
        payload = {
          ...payload,
          health: healthInsuranceData,
        };
      }
      let generalInsuranceData = [];
      if (payload?.general?.length > 0) {
        payload?.general?.map((ele) => {
          generalInsuranceData?.push({ ...ele, renewalDate: dateFormate(ele?.renewalDate) });
        });
        payload = {
          ...payload,
          general: generalInsuranceData,
        };
      }

      // Validation to select at least one business line
      if (!(generalInsVisible || healthInsVisible || carFleetVisible)) {
        toast.error("Please select at least one line of business");
        return;
      }

      // Remove empty objects
      if (!generalInsVisible) {
        delete payload?.general;
        delete payload?.generalCustomDocuments;
      }
      if (!healthInsVisible) {
        delete payload?.health;
        delete payload?.healthCustomDocuments;
      }
      if (!carFleetVisible) {
        delete payload?.carFleet;
        delete payload?.carCustomDocuments;
      }

      let carFleetFiles = payload?.carCustomDocuments;
      delete payload?.carCustomDocuments;
      delete payload?.carFleetCustomFileVisible;

      let healthFiles = payload?.healthCustomDocuments;
      delete payload?.healthCustomDocuments;
      delete payload?.healthCustomFileVisible;

      let generalFiles = payload?.generalCustomDocuments;
      delete payload?.generalCustomDocuments;
      delete payload?.generalCustomFileVisible;

      let payload2 = {
        ...payload,
        carFleetInsurance: {
          carFleet: carFleetData,
        },
        healthInsurance: {
          health: healthInsuranceData,
        },
        generalInsurance: {
          general: generalInsuranceData,
        },
        removeCarFileName: removedCarFleetFiles || [],
        removeMedicalFileName: removedHealthFiles || [],
        removeGeneralFileName: removedGeneralFiles || [],
      };

      if (formik?.values?.tradeLicense?.destination) {
        delete payload?.tradeLicense;
        delete payload2?.tradeLicense;
      }
      if (formik?.values?.businessOfRecord?.destination) {
        delete payload?.businessOfRecord;
        delete payload2?.businessOfRecord;
      }

      delete payload2?.carFleet;
      delete payload2?.health;
      delete payload2?.general;
      delete payload2?.carFleetVisible;
      delete payload2?.generalInsVisible;
      delete payload2?.healthInsVisible;

      setIsLoading(true);
      const formData = jsonToFormData(payload2);

      carFleetFiles?.map((i) => {
        if (!i?.file || !isValidFile(i?.file)) {
          return;
        }
        let fileType = i?.file?.type?.split("/")?.[1];
        const renamedFile = new File([i?.file], `${i?.originalname}.${fileType}`, {
          type: i?.file?.type,
        });
        formData.append(`carCustomDocuments`, renamedFile);
      });
      healthFiles?.map((i) => {
        if (!i?.file || !isValidFile(i?.file)) {
          return;
        }
        let fileType = i?.file?.type?.split("/")?.[1];
        const renamedFile = new File([i?.file], `${i?.originalname}.${fileType}`, {
          type: i?.file?.type,
        });
        formData.append(`healthCustomDocuments`, renamedFile);
      });
      generalFiles?.map((i) => {
        if (!i?.file || !isValidFile(i?.file)) {
          return;
        }
        let fileType = i?.file?.type?.split("/")?.[1];
        const renamedFile = new File([i?.file], `${i?.originalname}.${fileType}`, {
          type: i?.file?.type,
        });
        formData.append(`generalCustomDocuments`, renamedFile);
      });

      if (customerId) {
        dispatch(updateCorporateCustomerById({ id: customerId, data: formData }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              toast("Successfully updated", {
                type: "success",
              });
              setIsLoading(false);
              router.push(`/corporate-customers/${res?.data?._id}`).then(() => {
                setIsLoading(false);
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            setIsLoading(false);
          });
      } else {
        dispatch(createNewCorporateCustomer({ data: formData }))
          .unwrap()
          .then((res) => {
            if (res?.data?.success) {
              toast("Successfully created", {
                type: "success",
              });
              router.push(`/corporate-customers`).then(() => {
                setIsLoading(false);
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
            setIsLoading(false);
          });
      }
    },
  });

  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    dispatch(getAllAgentlist({}))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        setAgentList(res?.data);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  const addContactPerson = () => {
    if (comtactPersonArray?.length < 3) {
      const array = comtactPersonArray;
      formik.setFieldValue(`contactPersons.[${array?.length}].position`, "");
      formik.setFieldValue(`contactPersons.[${array?.length}].email`, "");
      formik.setFieldValue(`contactPersons.[${array?.length}].mobileNumber`, "");
      formik.setFieldValue(`contactPersons.[${array?.length}].personName`, "");
      array.push(1);
      setContactPersonArray([...array]);
    } else {
      toast("Maximum three person allowed", { type: "error" });
    }
  };
  const removeContactPerson = (index) => {
    // Form Job
    let personValue = formik?.values?.contactPersons ? [...formik?.values?.contactPersons] : [];
    personValue?.splice(index, 1);
    formik.setFieldValue("contactPersons", personValue);

    // State Job
    let array = [...comtactPersonArray];
    array?.splice(index, 1);
    setContactPersonArray(array);
  };

  // On select of biusness line checkbox
  const onCarFleetCheckboxHandler = (value) => {
    if (value) {
      formik.setFieldValue("carFleet[0][currentInsurer]", "");
      formik.setFieldValue("carFleet[0][existingBroker]", "");
      formik.setFieldValue("carFleet[0][renewalDate]", "");
      formik.setFieldValue("carFleet[0][currentInsurernoOfYears]", "");
      formik.setFieldValue("carFleet[0][existingBrokernoOfYears]", "");
      formik.setFieldValue("carFleet[0][noOfCars]", "");
      formik.setFieldValue("carFleet[0][probability]", "");
      setCarFleetVisible(true);
      formik?.setFieldValue("carFleetVisible", true);
    } else {
      if (corporateCustomerDetails?.data?.carFleetInsurance?.customFiles) {
        let arr = [];
        corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.map((i, idx) => {
          arr?.push(corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.[idx]?.filename);
        });
        setRemovedCarFleetFiles(arr);
      }
      setCarFleetVisible(false);
      formik?.setFieldValue("carFleetVisible", false);
    }
  };
  const onCarFleetCustomFileCheckboxHandler = (value) => {
    if (value) {
      formik.setFieldValue("carCustomDocuments[0][file]", "");
      formik.setFieldValue("carCustomDocuments[0][originalname]", "");
      setCarFleetCustomFilesArray([1]);
      formik?.setFieldValue("carFleetCustomFileVisible", true);
    } else {
      if (corporateCustomerDetails?.data?.carFleetInsurance?.customFiles) {
        let arr = [];
        corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.map((i, idx) => {
          arr?.push(corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.[idx]?.filename);
        });
        setRemovedCarFleetFiles(arr);
      }
      setCarFleetCustomFilesArray([]);
      formik?.setFieldValue("carCustomDocuments", []);
      formik?.setFieldValue("carFleetCustomFileVisible", false);
    }
  };
  const onHealthInsCheckboxHandler = (value) => {
    if (value) {
      formik.setFieldValue("health[0][currentInsurer]", "");
      formik.setFieldValue("health[0][existingBroker]", "");
      formik.setFieldValue("health[0][renewalDate]", "");
      formik.setFieldValue("health[0][existingBrokernoOfYears]", "");
      formik.setFieldValue("health[0][currentInsurernoOfYears]", "");
      formik.setFieldValue("health[0][noOfPeople]", "");
      formik.setFieldValue("health[0][groupSize]", "");
      formik.setFieldValue("health[0][type]", "");
      formik.setFieldValue("health[0][probability]", "");
      setHealthInsVisible(true);
      formik?.setFieldValue("healthInsVisible", true);
    } else {
      if (corporateCustomerDetails?.data?.healthInsurance?.customFiles) {
        let arr = [];
        corporateCustomerDetails?.data?.healthInsurance?.customFiles?.map((i, idx) => {
          arr?.push(corporateCustomerDetails?.data?.healthInsurance?.customFiles?.[idx]?.filename);
        });
        setRemovedHealthFiles(arr);
      }
      setHealthInsVisible(false);
      formik?.setFieldValue("healthInsVisible", false);
    }
  };
  const onHealthCustomFileCheckboxHandler = (value) => {
    if (value) {
      formik.setFieldValue("healthCustomDocuments[0][file]", "");
      formik.setFieldValue("healthCustomDocuments[0][originalname]", "");
      setHealthCustomFilesArray([1]);
      formik?.setFieldValue("healthCustomFileVisible", true);
    } else {
      if (corporateCustomerDetails?.data?.healthInsurance?.customFiles) {
        let arr = [];
        corporateCustomerDetails?.data?.healthInsurance?.customFiles?.map((i, idx) => {
          arr?.push(corporateCustomerDetails?.data?.healthInsurance?.customFiles?.[idx]?.filename);
        });
        setRemovedHealthFiles(arr);
      }
      setHealthCustomFilesArray([]);
      formik?.setFieldValue("healthCustomDocuments", []);
      formik?.setFieldValue("healthCustomFileVisible", false);
    }
  };
  const onGneralInsCheckboxHandler = (value) => {
    if (value) {
      formik.setFieldValue("general[0][currentInsurer]", "");
      formik.setFieldValue("general[0][existingBroker]", "");
      formik.setFieldValue("general[0][renewalDate]", "");
      formik.setFieldValue("general[0][subProduct]", "");
      formik.setFieldValue("general[0][existingBrokernoOfYears]", "");
      formik.setFieldValue("general[0][currentInsurernoOfYears]", "");
      formik.setFieldValue("general[0][probability]", "");
      setGeneralInsVisible(true);
      formik?.setFieldValue("generalInsVisible", true);
    } else {
      if (corporateCustomerDetails?.data?.generalInsurance?.customFiles) {
        let arr = [];
        corporateCustomerDetails?.data?.generalInsurance?.customFiles?.map((i, idx) => {
          arr?.push(corporateCustomerDetails?.data?.generalInsurance?.customFiles?.[idx]?.filename);
        });
        setRemovedGeneralFiles(arr);
      }
      setGeneralInsVisible(false);
      formik?.setFieldValue("generalInsVisible", false);
    }
  };
  const onGeneralCustomFileCheckboxHandler = (value) => {
    if (value) {
      formik.setFieldValue("generalCustomDocuments[0][file]", "");
      formik.setFieldValue("generalCustomDocuments[0][originalname]", "");
      setGeneralCustomFilesArray([1]);
      formik?.setFieldValue("generalCustomFileVisible", true);
    } else {
      if (corporateCustomerDetails?.data?.generalInsurance?.customFiles) {
        let arr = [];
        corporateCustomerDetails?.data?.generalInsurance?.customFiles?.map((i, idx) => {
          arr?.push(corporateCustomerDetails?.data?.generalInsurance?.customFiles?.[idx]?.filename);
        });
        setRemovedGeneralFiles(arr);
      }
      setGeneralCustomFilesArray([]);
      formik?.setFieldValue("generalCustomDocuments", []);
      formik?.setFieldValue("generalCustomFileVisible", false);
    }
  };

  // Car Fleet Insurance ------------------
  const addCarFleetInsurance = () => {
    const array = [...carFleetInsuanceArray];
    formik.setFieldValue(`carFleet.[${array?.length}].currentInsurer`, "");
    formik.setFieldValue(`carFleet.[${array?.length}].existingBroker`, "");
    formik.setFieldValue(`carFleet.[${array?.length}].renewalDate`, "");
    formik.setFieldValue(`carFleet.[${array?.length}].probability`, "");
    formik.setFieldValue(`carFleet.[${array?.length}].existingBrokernoOfYears`, "");
    formik.setFieldValue(`carFleet.[${array?.length}].currentInsurernoOfYears`, "");
    formik.setFieldValue(`carFleet.[${array?.length}].noOfCars`, "");
    array.push(1);
    setCarFleetInsuanceArray([...array]);
  };

  const removeCarFleetInsurance = (idx) => {
    // Form Job
    let carFleetcurrentInsurerValue = [...(formik?.values?.carFleet || [])];
    carFleetcurrentInsurerValue.splice(idx, 1);
    formik.setFieldValue("carFleet", carFleetcurrentInsurerValue);

    // State Job
    let array = [...carFleetInsuanceArray];
    array.splice(idx, 1);
    setCarFleetInsuanceArray(array);
  };

  const addCarFleetCustomeFileArray = () => {
    const array = [...carFleetCustomFilesArray];
    formik.setFieldValue(`carCustomDocuments.[${array?.length}].file`, "");
    formik.setFieldValue(`carCustomDocuments.[${array?.length}].originalname`, "");
    array.push(1);
    setCarFleetCustomFilesArray([...array]);
  };

  const removeCarFleetCustomeFileArray = (idx) => {
    // Form Job
    if (formik?.values?.carCustomDocuments?.length === 1) {
      formik?.setFieldValue("carFleetCustomFileVisible", false);
    }
    let value = [...(formik?.values?.carCustomDocuments || [])];
    value.splice(idx, 1);
    formik.setFieldValue("carCustomDocuments", value);

    // State Job
    let array = [...carFleetCustomFilesArray];
    array.splice(idx, 1);
    setCarFleetCustomFilesArray(array);

    if (corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.[idx]) {
      setRemovedCarFleetFiles([
        ...removedCarFleetFiles,
        corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.[idx]?.filename,
      ]);
    }
  };

  // Health Insurance -------------------
  const addHealthInsurance = () => {
    const array = [...healthInsuranceArray];
    formik.setFieldValue(`health.[${array?.length}].currentInsurer`, "");
    formik.setFieldValue(`health.[${array?.length}].existingBroker`, "");
    formik.setFieldValue(`health.[${array?.length}].renewalDate`, "");
    formik.setFieldValue(`health.[${array?.length}].probability`, "");
    formik.setFieldValue(`health.[${array?.length}].existingBrokernoOfYears`, "");
    formik.setFieldValue(`health.[${array?.length}].currentInsurernoOfYears`, "");
    formik.setFieldValue(`health.[${array?.length}].noOfPeople`, "");
    formik.setFieldValue(`health.[${array?.length}].groupSize`, "");
    formik.setFieldValue(`health.[${array?.length}].type`, "");
    array.push(1);
    setHealthInsuranceArray([...array]);
  };

  const removeHealthInsurance = (idx) => {
    // Form Job
    let healthInsurerValue = [...(formik?.values?.health || [])];
    healthInsurerValue.splice(idx, 1);
    formik.setFieldValue("health", healthInsurerValue);

    // State Job
    let array = [...healthInsuranceArray];
    array.splice(idx, 1);
    setHealthInsuranceArray(array);
  };

  const addHealthCustomeFileArray = () => {
    const array = [...healthCustomFilesArray];
    formik.setFieldValue(`healthCustomDocuments.[${array?.length}].file`, "");
    formik.setFieldValue(`healthCustomDocuments.[${array?.length}].originalname`, "");
    array.push(1);
    setHealthCustomFilesArray([...array]);
  };

  const removeHealthCustomeFileArray = (idx) => {
    // Form Job
    if (formik?.values?.healthCustomDocuments?.length === 1) {
      formik?.setFieldValue("healthCustomFileVisible", false);
    }
    let value = [...(formik?.values?.healthCustomDocuments || [])];
    value.splice(idx, 1);
    formik.setFieldValue("healthCustomDocuments", value);

    // State Job
    let array = [...healthCustomFilesArray];
    array.splice(idx, 1);
    setHealthCustomFilesArray(array);

    if (corporateCustomerDetails?.data?.healthInsurance?.customFiles?.[idx]) {
      setRemovedHealthFiles([
        ...removedCarFleetFiles,
        corporateCustomerDetails?.data?.healthInsurance?.customFiles?.[idx]?.filename,
      ]);
    }
  };

  // General Insurance ------------------------
  const addGeneralInsurance = () => {
    const array = [...generalInsuranceArray];
    formik.setFieldValue(`general.[${array?.length}].currentInsurer`, "");
    formik.setFieldValue(`general.[${array?.length}].existingBroker`, "");
    formik.setFieldValue(`general.[${array?.length}].renewalDate`, "");
    formik.setFieldValue(`general.[${array?.length}].probability`, "");
    formik.setFieldValue(`general.[${array?.length}].currentInsurernoOfYears`, "");
    formik.setFieldValue(`general.[${array?.length}].existingBrokernoOfYears`, "");
    formik.setFieldValue(`general.[${array?.length}].subProduct`, "");
    array.push(1);
    setGeneralInsuranceArray([...array]);
  };

  const removeGeneralInsurance = (idx) => {
    // Form Job
    let generalInsurerValue = [...(formik?.values?.general || [])];
    generalInsurerValue.splice(idx, 1);
    formik.setFieldValue("general", generalInsurerValue);

    // State Job
    let array = [...generalInsuranceArray];
    array.splice(idx, 1);
    setGeneralInsuranceArray(array);
  };

  const addGeneralCustomeFileArray = () => {
    const array = [...generalCustomFilesArray];
    formik.setFieldValue(`generalCustomDocuments.[${array?.length}].file`, "");
    formik.setFieldValue(`generalCustomDocuments.[${array?.length}].originalname`, "");
    array.push(1);
    setGeneralCustomFilesArray([...array]);
  };

  const removeGeneralCustomeFileArray = (idx) => {
    // Form Job
    if (formik?.values?.generalCustomDocuments?.length === 1) {
      formik?.setFieldValue("generalCustomFileVisible", false);
    }
    let value = [...(formik?.values?.generalCustomDocuments || [])];
    value.splice(idx, 1);
    formik.setFieldValue("generalCustomDocuments", value);

    // State Job
    let array = [...generalCustomFilesArray];
    array.splice(idx, 1);
    setGeneralCustomFilesArray(array);

    if (corporateCustomerDetails?.data?.generalInsurance?.customFiles?.[idx]) {
      setRemovedGeneralFiles([
        ...removedCarFleetFiles,
        corporateCustomerDetails?.data?.generalInsurance?.customFiles?.[idx]?.filename,
      ]);
    }
  };

  // Conatct of preson Session Document upload handler
  const uploadBORDocumentHandler = async ([file]) => {
    formik.setFieldValue(`businessOfRecord`, file);
  };

  // Conatct of preson Session Document upload handler
  const handleTradLicenseUpload = async ([file]) => {
    formik.setFieldValue(`tradeLicense`, file);
  };

  const handleUploadCarFleetCustomFiles = ([file], idx) => {
    formik.setFieldValue(`carCustomDocuments[${idx}][file]`, file);
  };
  const handleUploadHealthCustomFiles = ([file], idx) => {
    formik.setFieldValue(`healthCustomDocuments[${idx}][file]`, file);
  };
  const handleUploadGeneralCustomFiles = ([file], idx) => {
    formik.setFieldValue(`generalCustomDocuments[${idx}][file]`, file);
  };

  useEffect(() => {
    if (formik.values.source === "Agents") {
      setShowInputField(true);
    } else {
      setShowInputField(false);
    }
  }, [formik.values.source]);

  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      if (document.getElementById(Object.keys(formik.errors)[0]))
        document.getElementById(Object.keys(formik.errors)[0]).focus();
    }
  }, [formik]);

  return (
    <>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
          <AnimationLoader open={isLoading} />
        </Box>
      )}
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
                <NextLink href="/corporate-customers" passHref>
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
                Corporate customer details
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
                                Company name<Span> *</Span>
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={9}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <TextField
                                error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                                fullWidth
                                helperText={formik.touched.fullName && formik.errors.fullName}
                                label="Company name"
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
                                  fontSize: "13px",
                                  display: "inline-block",
                                  color: "#707070",
                                }}
                              >
                                Source of business <Span> *</Span>
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={9}>
                            <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                              <TextField
                                error={Boolean(formik.touched?.source && formik.errors?.source)}
                                helperText={formik.touched?.source && formik.errors?.source}
                                fullWidth
                                label="Source of business"
                                name="source"
                                id="source"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values?.source}
                              >
                                <option value=""></option>
                                {sourceOfBuss?.map((n, idx) => {
                                  return (
                                    <option key={idx} value={n}>
                                      {n}
                                    </option>
                                  );
                                })}
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
                                    Agents <Span> *</Span>
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={9}>
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    width: "100%",
                                    marginTop: "5px",
                                  }}
                                >
                                  <TextField
                                    error={Boolean(formik.touched.agent && formik.errors.agent)}
                                    helperText={formik.touched.agent && formik.errors.agent}
                                    fullWidth
                                    label="Agents"
                                    name="agent"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    select
                                    SelectProps={{ native: true }}
                                    value={formik.values.agent}
                                  >
                                    <option value=""></option>
                                    {agentList.map((agent) => {
                                      if (!agent?.userId?._id) {
                                        return;
                                      }
                                      return <option value={agent?.userId?._id}>{agent?.userId?.fullName}</option>;
                                    })}
                                  </TextField>
                                </Box>
                              </Grid>
                            </>
                          )}

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
                                BOR Document
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={9}>
                            <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                              <Box sx={{ mt: 0.5 }}>
                                <FileDropzone
                                  accept={{
                                    "image/*": [],
                                    "application/pdf": [".pdf"],
                                  }}
                                  size="small"
                                  maxFiles={1}
                                  onDrop={(e) => uploadBORDocumentHandler(e)}
                                />
                              </Box>
                              {(formik?.values?.businessOfRecord ||
                                corporateCustomerDetails?.data?.businessOfRecord) && (
                                <List>
                                  <ListItem
                                    sx={{
                                      fontSize: 14,
                                      border: 1,
                                      borderColor: "divider",
                                      borderRadius: 1,
                                      "& + &": {
                                        mt: 1,
                                      },
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        formik?.values?.businessOfRecord?.name ||
                                        corporateCustomerDetails?.data?.businessOfRecord?.originalname
                                      }
                                      primaryTypographyProps={{
                                        color: "textPrimary",
                                        variant: "subtitle2",
                                      }}
                                      secondary={bytesToSize(
                                        formik?.values?.businessOfRecord?.size ||
                                          corporateCustomerDetails?.data?.businessOfRecord?.size
                                      )}
                                    />
                                  </ListItem>
                                </List>
                              )}

                              <Typography
                                sx={{
                                  color: "#F04438",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                {formik.errors.businessOfRecord}
                              </Typography>
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
                                Emirates <Span> *</Span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.emirates && formik.errors.emirates)}
                                helperText={formik.touched.emirates && formik.errors.emirates}
                                fullWidth
                                label="Emirates"
                                name="emirates"
                                id="emirates"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.emirates}
                              >
                                <option value=""></option>
                                {proposerEm?.map((i, idx) => (
                                  <option key={idx} value={i}>
                                    {i}
                                  </option>
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
                                Industry <Span> *</Span>
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <Box
                              sx={{
                                display: "inline-block",
                                width: "100%",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                error={Boolean(formik.touched.industry && formik.errors.industry)}
                                helperText={formik.touched.industry && formik.errors.industry}
                                fullWidth
                                label="Industry"
                                name="industry"
                                id="industry"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.industry}
                              >
                                <option value=""></option>
                                {industryName?.map((i, idx) => (
                                  <option key={idx} value={i}>
                                    {i}
                                  </option>
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
                                Trade License
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={9}>
                            <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                              <FileDropzone
                                accept={{
                                  "image/*": [],
                                  "application/pdf": [".pdf"],
                                }}
                                size="small"
                                maxFiles={1}
                                onDrop={(e) => handleTradLicenseUpload(e)}
                              />
                            </Box>
                            {(formik?.values?.tradeLicense || corporateCustomerDetails?.data?.tradeLicense) && (
                              <List>
                                <ListItem
                                  sx={{
                                    fontSize: 14,
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    "& + &": {
                                      mt: 1,
                                    },
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      formik?.values?.tradeLicense?.name ||
                                      corporateCustomerDetails?.data?.tradeLicense?.originalname
                                    }
                                    primaryTypographyProps={{
                                      color: "textPrimary",
                                      variant: "subtitle2",
                                    }}
                                    secondary={bytesToSize(
                                      formik?.values?.tradeLicense?.size ||
                                        corporateCustomerDetails?.data?.tradeLicense?.size
                                    )}
                                  />
                                </ListItem>
                              </List>
                            )}

                            <Typography
                              sx={{
                                color: "#F04438",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }}
                            >
                              {formik.errors.tradeLicense}
                            </Typography>
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
                  py: 1.5,
                  width: "100%",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                    px: "14px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  Contact Persons
                </Typography>
              </Box>

              {comtactPersonArray?.map((ele, idx) => {
                return (
                  <Box key={idx} sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
                      <Divider
                        sx={{
                          width:
                            idx == comtactPersonArray?.length - 1 && comtactPersonArray?.length < 3
                              ? "calc(100% - 130px)"
                              : "calc(100% - 70px)",
                        }}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {comtactPersonArray?.length > 1 && (
                          <IconButton
                            onClick={() => removeContactPerson(idx)}
                            sx={{ borderRadius: "5px", border: "1px solid #F04438", p: 1 }}
                          >
                            <DeleteOutlineIcon sx={{ color: "#F04438" }} />
                          </IconButton>
                        )}
                        {idx == comtactPersonArray?.length - 1 && comtactPersonArray?.length < 3 && (
                          <IconButton
                            onClick={addContactPerson}
                            sx={{ borderRadius: "5px", border: "1px solid green", p: 1 }}
                          >
                            <AddIcon sx={{ color: "green" }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Grid key={idx} container columnSpacing={1}>
                      <Grid item xs={12} sm={12}>
                        <Grid key={idx} container spacing={1}>
                          <Grid item xs={11} md={6} xl={3}>
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
                                  marginTop: "5px",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  error={Boolean(
                                    formik.touched.contactPersons &&
                                      formik.errors.contactPersons &&
                                      formik.touched.contactPersons?.[idx] &&
                                      formik.errors.contactPersons?.[idx] &&
                                      formik.touched.contactPersons?.[idx]?.personName &&
                                      formik.errors.contactPersons?.[idx]?.personName
                                  )}
                                  helperText={
                                    formik.touched.contactPersons &&
                                    formik.errors.contactPersons &&
                                    formik.touched.contactPersons?.[idx] &&
                                    formik.errors.contactPersons?.[idx] &&
                                    formik.touched.contactPersons?.[idx]?.personName &&
                                    formik.errors.contactPersons?.[idx]?.personName
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik?.values?.contactPersons?.[idx]?.personName}
                                  label="Company name"
                                  name={`contactPersons[${idx}].personName`}
                                  id={`contactPersons[${idx}].personName`}
                                  type="personName"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={11} md={6} xl={3}>
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
                                  marginTop: "5px",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  error={Boolean(
                                    formik.touched.contactPersons &&
                                      formik.errors.contactPersons &&
                                      formik.touched.contactPersons?.[idx] &&
                                      formik.errors.contactPersons?.[idx] &&
                                      formik.touched.contactPersons?.[idx]?.email &&
                                      formik.errors.contactPersons?.[idx]?.email
                                  )}
                                  helperText={
                                    formik.touched.contactPersons &&
                                    formik.errors.contactPersons &&
                                    formik.touched.contactPersons?.[idx] &&
                                    formik.errors.contactPersons?.[idx] &&
                                    formik.touched.contactPersons?.[idx]?.email &&
                                    formik.errors.contactPersons?.[idx]?.email
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik?.values?.contactPersons?.[idx]?.email}
                                  label="Email"
                                  name={`contactPersons[${idx}].email`}
                                  id={`contactPersons[${idx}].email`}
                                  type="email"
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={11} md={6} xl={3}>
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
                                  marginTop: "5px",
                                }}
                              >
                                <PhoneInputs name={`contactPersons[${idx}].mobileNumber`} formik={formik} />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={11} md={6} xl={3}>
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
                                  marginTop: "5px",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  error={Boolean(
                                    formik.touched.contactPersons &&
                                      formik.errors.contactPersons &&
                                      formik.touched.contactPersons?.[idx] &&
                                      formik.errors.contactPersons?.[idx] &&
                                      formik.touched.contactPersons?.[idx]?.position &&
                                      formik.errors.contactPersons?.[idx]?.position
                                  )}
                                  helperText={
                                    formik.touched.contactPersons &&
                                    formik.errors.contactPersons &&
                                    formik.touched.contactPersons?.[idx] &&
                                    formik.errors.contactPersons?.[idx] &&
                                    formik.touched.contactPersons?.[idx]?.position &&
                                    formik.errors.contactPersons?.[idx]?.position
                                  }
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik?.values?.contactPersons?.[idx]?.position}
                                  label="Position"
                                  name={`contactPersons[${idx}].position`}
                                  id={`contactPersons[${idx}].position`}
                                  type="text"
                                />
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
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
                  F
                  sx={{
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                    px: "14px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  Line of business
                </Typography>
              </Box>
              <Box sx={{ display: "flex", width: "100%", mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    py: 1.5,
                    width: "100%",
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                    px: "14px",
                    pb: 0,
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <Checkbox
                    onChange={(e) => onCarFleetCheckboxHandler(e?.target?.checked)}
                    checked={!!formik?.values?.carFleetVisible}
                  />
                  Motor Fleet
                </Typography>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    py: 1.5,
                    width: "100%",
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                    px: "14px",
                    pb: 0,
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <Checkbox
                    onChange={(e) => onHealthInsCheckboxHandler(e?.target?.checked)}
                    checked={!!formik?.values?.healthInsVisible}
                  />
                  Group Health
                </Typography>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    py: 1.5,
                    width: "100%",
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                    px: "14px",
                    pb: 0,
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <Checkbox
                    onChange={(e) => onGneralInsCheckboxHandler(e?.target?.checked)}
                    checked={!!formik?.values?.generalInsVisible}
                  />
                  General Insurance
                </Typography>
              </Box>
              <Divider sx={{ width: "100%", color: "#60176F" }} />
              {carFleetVisible && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      width: "100%",
                      fontWeight: "600",
                      fontSize: "18px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                      py: 1,
                      backgroundColor: "#60176F10",
                    }}
                  >
                    Motor Fleet
                  </Typography>
                  {carFleetInsuanceArray?.map((ele, idx) => {
                    return (
                      <Box key={idx} sx={{ px: 1, py: 1 }}>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
                          <Divider
                            sx={{
                              width:
                                idx == carFleetInsuanceArray?.length - 1 && carFleetInsuanceArray?.length > 1
                                  ? "calc(100% - 130px)"
                                  : "calc(100% - 70px)",
                            }}
                          />
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {carFleetInsuanceArray?.length > 1 && (
                              <IconButton
                                onClick={() => removeCarFleetInsurance(idx)}
                                sx={{ borderRadius: "5px", border: "1px solid #F04438", p: 1 }}
                              >
                                <DeleteOutlineIcon sx={{ color: "#F04438" }} />
                              </IconButton>
                            )}
                            {idx == carFleetInsuanceArray?.length - 1 && (
                              <IconButton
                                onClick={() => {
                                  addCarFleetInsurance();
                                }}
                                sx={{ borderRadius: "5px", border: "1px solid green", p: 1 }}
                              >
                                <AddIcon sx={{ color: "green" }} />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                        <Grid key={idx} container columnSpacing={1}>
                          <Grid item xs={12} sm={9}>
                            <Grid key={idx} container spacing={1}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.carFleet?.[idx]?.currentInsurer &&
                                          formik.errors.carFleet?.[idx]?.currentInsurer
                                      )}
                                      helperText={
                                        formik.touched.carFleet?.[idx]?.currentInsurer &&
                                        formik.errors.carFleet?.[idx]?.currentInsurer
                                      }
                                      fullWidth
                                      label="Current Insurer"
                                      name={`carFleet[${idx}][currentInsurer]`}
                                      id={`carFleet[${idx}][currentInsurer]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.carFleet?.[idx]?.currentInsurer}
                                      select
                                      SelectProps={{ native: true }}
                                    >
                                      <option value=""></option>
                                      {insuranceCompany?.map((option, idx) => {
                                        return (
                                          <option key={idx} value={option.value}>
                                            {option.label}
                                          </option>
                                        );
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.carFleet?.[idx]?.currentInsurernoOfYears &&
                                          formik.errors.carFleet?.[idx]?.currentInsurernoOfYears
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.carFleet?.[idx]?.currentInsurernoOfYears &&
                                        formik.errors.carFleet?.[idx]?.currentInsurernoOfYears
                                      }
                                      label="current Insurer No of year"
                                      name={`carFleet[${idx}][currentInsurernoOfYears]`}
                                      id={`carFleet[${idx}][currentInsurernoOfYears]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.carFleet?.[idx]?.currentInsurernoOfYears}
                                      type="number"
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.carFleet?.[idx]?.existingBroker &&
                                          formik.errors.carFleet?.[idx]?.existingBroker
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.carFleet?.[idx]?.existingBroker &&
                                        formik.errors.carFleet?.[idx]?.existingBroker
                                      }
                                      label="Existing Broker"
                                      name={`carFleet[${idx}][existingBroker]`}
                                      id={`carFleet[${idx}][existingBroker]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.carFleet?.[idx]?.existingBroker}
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.carFleet?.[idx]?.existingBrokernoOfYears &&
                                          formik.errors.carFleet?.[idx]?.existingBrokernoOfYears
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.carFleet?.[idx]?.existingBrokernoOfYears &&
                                        formik.errors.carFleet?.[idx]?.existingBrokernoOfYears
                                      }
                                      label="existing Broker No of year"
                                      name={`carFleet[${idx}][existingBrokernoOfYears]`}
                                      id={`carFleet[${idx}][existingBrokernoOfYears]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.carFleet?.[idx]?.existingBrokernoOfYears}
                                      type="number"
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <DatePicker
                                      inputFormat="dd-MM-yyyy"
                                      label="Renewal date"
                                      value={formik.values?.carFleet?.[idx]?.renewalDate || ""}
                                      onChange={(value) => {
                                        formik.setFieldValue(`carFleet[${idx}][renewalDate]`, value, true);
                                      }}
                                      disablePast
                                      renderInput={(params) => (
                                        <TextField
                                          name={`carFleet[${idx}][renewalDate]`}
                                          id={`carFleet[${idx}][renewalDate]`}
                                          fullWidth
                                          {...params}
                                          helperText={
                                            formik.touched?.carFleet?.[idx]?.renewalDate &&
                                            formik.errors?.carFleet?.[idx]?.renewalDate
                                          }
                                          error={
                                            formik.touched?.carFleet?.[idx]?.renewalDate &&
                                            formik.errors?.carFleet?.[idx]?.renewalDate
                                          }
                                        />
                                      )}
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.carFleet?.[idx]?.noOfCars &&
                                          formik.errors.carFleet?.[idx]?.noOfCars
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.carFleet?.[idx]?.noOfCars &&
                                        formik.errors.carFleet?.[idx]?.noOfCars
                                      }
                                      label="No of Cars"
                                      name={`carFleet[${idx}][noOfCars]`}
                                      id={`carFleet[${idx}][noOfCars]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.carFleet?.[idx]?.noOfCars}
                                      type="number"
                                      inputProps={{ min: 1 }}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Box>
                              <Box>
                                <TextField
                                  error={Boolean(
                                    formik.touched?.carFleet?.[idx]?.probability &&
                                      formik.errors?.carFleet?.[idx]?.probability
                                  )}
                                  helperText={
                                    formik.touched?.carFleet?.[idx]?.probability &&
                                    formik.errors?.carFleet?.[idx]?.probability
                                  }
                                  fullWidth
                                  label="Probability"
                                  name={`carFleet[${idx}][probability]`}
                                  id={`carFleet[${idx}][probability]`}
                                  onChange={(event) => {
                                    formik.setFieldValue(`carFleet[${idx}][probability]`, event.target.value);
                                  }}
                                  select
                                  SelectProps={{ native: true }}
                                  value={formik.values.carFleet?.[idx]?.probability || ""}
                                >
                                  <option value=" "> </option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </TextField>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                  <Box sx={{ px: 1, mt: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Files</Typography>
                      <Divider sx={{ width: "calc(100% - 40px)" }} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                      <Typography sx={{ fontSize: 14 }}>Check here to add files</Typography>

                      <Checkbox
                        onChange={(e) => onCarFleetCustomFileCheckboxHandler(e?.target?.checked)}
                        checked={!!formik?.values?.carFleetCustomFileVisible}
                      />
                    </Box>
                  </Box>
                  {formik?.values?.carFleetCustomFileVisible &&
                    carFleetCustomFilesArray?.map((ele, idx) => {
                      return (
                        <Box key={idx} sx={{ p: 1 }}>
                          <Grid container spacing={1} alignItems={"center"}>
                            <Grid item xs={5} md={5} xl={4}>
                              <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                                <FileDropzone
                                  accept={{
                                    "image/*": [],
                                    "application/pdf": [".pdf"],
                                  }}
                                  size="small"
                                  maxFiles={1}
                                  onDrop={(e) => handleUploadCarFleetCustomFiles(e, idx)}
                                />
                              </Box>
                              {(formik?.values?.carCustomDocuments?.[idx]?.file ||
                                corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.[idx]) && (
                                <List>
                                  <ListItem
                                    sx={{
                                      fontSize: 14,
                                      border: 1,
                                      borderColor: "divider",
                                      borderRadius: 1,
                                      "& + &": {
                                        mt: 1,
                                      },
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        formik?.values?.carCustomDocuments?.[idx]?.file?.name ||
                                        corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.[idx]
                                          ?.originalname
                                      }
                                      primaryTypographyProps={{
                                        color: "textPrimary",
                                        variant: "subtitle2",
                                      }}
                                      secondary={bytesToSize(
                                        formik?.values?.carCustomDocuments?.[idx]?.file?.size ||
                                          corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.[idx]?.size
                                      )}
                                    />
                                  </ListItem>
                                </List>
                              )}

                              <Typography
                                sx={{
                                  color: "#F04438",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                {formik.errors.carCustomDocuments?.[idx]?.file}
                              </Typography>
                            </Grid>
                            <Grid item xs={5} md={3} xl={3}>
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
                                    marginTop: "5px",
                                  }}
                                >
                                  <TextField
                                    error={Boolean(
                                      formik.touched.carCustomDocuments?.[idx]?.originalname &&
                                        formik.errors.carCustomDocuments?.[idx]?.originalname
                                    )}
                                    fullWidth
                                    helperText={
                                      formik.touched.carCustomDocuments?.[idx]?.originalname &&
                                      formik.errors.carCustomDocuments?.[idx]?.originalname
                                    }
                                    label="File Name"
                                    name={`carCustomDocuments[${idx}][originalname]`}
                                    id={`carCustomDocuments[${idx}][originalname]`}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.carCustomDocuments?.[idx]?.originalname}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={2}>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <IconButton
                                  onClick={() => removeCarFleetCustomeFileArray(idx)}
                                  sx={{ borderRadius: "5px", border: "1px solid #F04438", p: 1.2 }}
                                >
                                  <DeleteOutlineIcon sx={{ color: "#F04438" }} />
                                </IconButton>
                                {idx == carFleetCustomFilesArray?.length - 1 && (
                                  <IconButton
                                    onClick={() => {
                                      addCarFleetCustomeFileArray();
                                    }}
                                    sx={{ borderRadius: "5px", border: "1px solid green", p: 1.2 }}
                                  >
                                    <AddIcon sx={{ color: "green" }} />
                                  </IconButton>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                </>
              )}
              {healthInsVisible && (
                <>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      width: "100%",
                      fontWeight: "600",
                      fontSize: "18px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                      py: 1,
                      mt: 2,
                      backgroundColor: "#60176F10",
                    }}
                  >
                    Group Health
                  </Typography>
                  {healthInsuranceArray?.map((ele, idx) => {
                    return (
                      <Box key={idx} sx={{ px: 1, pb: 1 }}>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
                          <Divider
                            sx={{
                              width:
                                idx == healthInsuranceArray?.length - 1 && healthInsuranceArray?.length > 1
                                  ? "calc(100% - 130px)"
                                  : "calc(100% - 70px)",
                            }}
                          />
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {healthInsuranceArray?.length > 1 && (
                              <IconButton
                                onClick={() => removeHealthInsurance(idx)}
                                sx={{ borderRadius: "5px", border: "1px solid #F04438", p: 1 }}
                              >
                                <DeleteOutlineIcon sx={{ color: "#F04438" }} />
                              </IconButton>
                            )}
                            {idx == healthInsuranceArray?.length - 1 && (
                              <IconButton
                                onClick={() => {
                                  addHealthInsurance();
                                }}
                                sx={{ borderRadius: "5px", border: "1px solid green", p: 1 }}
                              >
                                <AddIcon sx={{ color: "green" }} />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                        <Grid key={idx} container columnSpacing={1}>
                          <Grid item xs={12}>
                            <Grid key={idx} container spacing={1}>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.health?.[idx]?.currentInsurer &&
                                          formik.errors.health?.[idx]?.currentInsurer
                                      )}
                                      helperText={
                                        formik.touched.health?.[idx]?.currentInsurer &&
                                        formik.errors.health?.[idx]?.currentInsurer
                                      }
                                      fullWidth
                                      label="Current Insurer"
                                      name={`health[${idx}][currentInsurer]`}
                                      id={`health[${idx}][currentInsurer]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.health?.[idx]?.currentInsurer}
                                      select
                                      SelectProps={{ native: true }}
                                    >
                                      <option value=""></option>
                                      {insuranceCompany?.map((option, idx) => {
                                        return (
                                          <option key={idx} value={option.value}>
                                            {option.label}
                                          </option>
                                        );
                                      })}
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.health?.[idx]?.currentInsurernoOfYears &&
                                          formik.errors.health?.[idx]?.currentInsurernoOfYears
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.health?.[idx]?.currentInsurernoOfYears &&
                                        formik.errors.health?.[idx]?.currentInsurernoOfYears
                                      }
                                      label="current Insurer No of year"
                                      name={`health[${idx}][currentInsurernoOfYears]`}
                                      id={`health[${idx}][currentInsurernoOfYears]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.health?.[idx]?.currentInsurernoOfYears}
                                      type="number"
                                    />
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <DatePicker
                                      inputFormat="dd-MM-yyyy"
                                      label="Renewal date"
                                      value={formik.values?.health?.[idx]?.renewalDate || ""}
                                      onChange={(value) => {
                                        formik.setFieldValue(`health[${idx}][renewalDate]`, value, true);
                                      }}
                                      disablePast
                                      renderInput={(params) => (
                                        <TextField
                                          name={`health[${idx}][renewalDate]`}
                                          id={`health[${idx}][renewalDate]`}
                                          helperText={
                                            formik.touched?.health?.[idx]?.renewalDate &&
                                            formik.errors?.health?.[idx]?.renewalDate
                                          }
                                          fullWidth
                                          {...params}
                                          error={
                                            formik.touched?.health?.[idx]?.renewalDate &&
                                            formik.errors?.health?.[idx]?.renewalDate
                                          }
                                        />
                                      )}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.health?.[idx]?.existingBroker &&
                                          formik.errors.health?.[idx]?.existingBroker
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.health?.[idx]?.existingBroker &&
                                        formik.errors.health?.[idx]?.existingBroker
                                      }
                                      label="Existing Broker"
                                      name={`health[${idx}][existingBroker]`}
                                      id={`health[${idx}][existingBroker]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.health?.[idx]?.existingBroker}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.health?.[idx]?.existingBrokernoOfYears &&
                                          formik.errors.health?.[idx]?.existingBrokernoOfYears
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.health?.[idx]?.existingBrokernoOfYears &&
                                        formik.errors.health?.[idx]?.existingBrokernoOfYears
                                      }
                                      label="existing Broker No of year"
                                      name={`health[${idx}][existingBrokernoOfYears]`}
                                      id={`health[${idx}][existingBrokernoOfYears]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.health?.[idx]?.existingBrokernoOfYears}
                                      type="number"
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.health?.[idx]?.groupSize &&
                                          formik.errors.health?.[idx]?.groupSize
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.health?.[idx]?.groupSize &&
                                        formik.errors.health?.[idx]?.groupSize
                                      }
                                      label="Group size number"
                                      name={`health[${idx}][groupSize]`}
                                      id={`health[${idx}][groupSize]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.health?.[idx]?.groupSize}
                                      type="number"
                                      inputProps={{ min: 0 }}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{ m: 1 }}>
                                  <FormControl
                                    required
                                    error={formik.touched.health?.[idx]?.type && formik.errors.health?.[idx]?.type}
                                    component="fieldset"
                                    variant="standard"
                                  >
                                    <FormLabel component="legend">Type</FormLabel>
                                    <FormGroup>
                                      <Box sx={{ display: "flex" }}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              size="small"
                                              checked={formik?.values?.health?.[idx]?.type == "Basic"}
                                              onChange={(e) => {
                                                formik?.setFieldValue(`health[${idx}].type`, e?.target?.name);
                                              }}
                                              name="Basic"
                                            />
                                          }
                                          label="Basic"
                                        />
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              size="small"
                                              checked={formik?.values?.health?.[idx]?.type == "Enhance"}
                                              onChange={(e) => {
                                                console.log(e?.target, "target");
                                                formik?.setFieldValue(`health[${idx}].type`, e?.target?.name);
                                              }}
                                              name="Enhance"
                                            />
                                          }
                                          label="Enhance"
                                        />
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              size="small"
                                              checked={formik?.values?.health?.[idx]?.type == "Basic & Enhance"}
                                              onChange={(e) => {
                                                formik?.setFieldValue(`health[${idx}].type`, e?.target?.name);
                                              }}
                                              name="Basic & Enhance"
                                            />
                                          }
                                          label="Both"
                                        />
                                      </Box>
                                    </FormGroup>
                                    {formik.touched.health?.[idx]?.type && (
                                      <FormHelperText>{formik.errors.health?.[idx]?.type}</FormHelperText>
                                    )}
                                  </FormControl>
                                  {/* <Box>
                                    {formik.errors?.health?.[idx]?.probability &&
                                      formik.touched?.health?.[idx]?.probability && (
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          sx={{
                                            fontSize: "12px",
                                            display: "inline-block",
                                            color: "#F04438",
                                          }}
                                        >
                                          {formik.errors?.health?.[idx]?.probability}
                                        </Typography>
                                      )}
                                  </Box> */}
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Box>
                                  <Box>
                                    <TextField
                                      error={Boolean(
                                        formik.touched?.health?.[idx]?.probability &&
                                          formik.errors?.health?.[idx]?.probability
                                      )}
                                      helperText={
                                        formik.touched?.health?.[idx]?.probability &&
                                        formik.errors?.health?.[idx]?.probability
                                      }
                                      fullWidth
                                      label="Probability"
                                      name={`health[${idx}][probability]`}
                                      id={`health[${idx}][probability]`}
                                      onChange={(event) => {
                                        formik.setFieldValue(`health[${idx}][probability]`, event.target.value);
                                      }}
                                      select
                                      SelectProps={{ native: true }}
                                      value={formik.values.health?.[idx]?.probability || ""}
                                    >
                                      <option value=" "> </option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.health?.[idx]?.noOfPeople &&
                                          formik.errors.health?.[idx]?.noOfPeople
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.health?.[idx]?.noOfPeople &&
                                        formik.errors.health?.[idx]?.noOfPeople
                                      }
                                      label="No of people"
                                      name={`health[${idx}][noOfPeople]`}
                                      id={`health[${idx}][noOfPeople]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.health?.[idx]?.noOfPeople}
                                      type="number"
                                      inputProps={{ min: 1 }}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                          {/* <Grid item xs={12} sm={3}></Grid> */}
                        </Grid>
                      </Box>
                    );
                  })}
                  <Box sx={{ px: 1, mt: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Files</Typography>
                      <Divider sx={{ width: "calc(100% - 40px)" }} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                      <Typography sx={{ fontSize: 14 }}>Check here to add files</Typography>

                      <Checkbox
                        onChange={(e) => onHealthCustomFileCheckboxHandler(e?.target?.checked)}
                        checked={!!formik?.values?.healthCustomFileVisible}
                      />
                    </Box>
                  </Box>
                  {formik?.values?.healthCustomFileVisible &&
                    healthCustomFilesArray?.map((ele, idx) => {
                      return (
                        <Box key={idx} sx={{ p: 1 }}>
                          <Grid container spacing={1} alignItems={"center"}>
                            <Grid item xs={5} md={5} xl={4}>
                              <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                                <FileDropzone
                                  accept={{
                                    "image/*": [],
                                    "application/pdf": [".pdf"],
                                  }}
                                  size="small"
                                  maxFiles={1}
                                  onDrop={(e) => handleUploadHealthCustomFiles(e, idx)}
                                />
                              </Box>
                              {(formik?.values?.healthCustomDocuments?.[idx]?.file ||
                                corporateCustomerDetails?.data?.healthInsurance?.customFiles?.[idx]) && (
                                <List>
                                  <ListItem
                                    sx={{
                                      fontSize: 14,
                                      border: 1,
                                      borderColor: "divider",
                                      borderRadius: 1,
                                      "& + &": {
                                        mt: 1,
                                      },
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        formik?.values?.healthCustomDocuments?.[idx]?.file?.name ||
                                        corporateCustomerDetails?.data?.healthInsurance?.customFiles?.[idx]
                                          ?.originalname
                                      }
                                      primaryTypographyProps={{
                                        color: "textPrimary",
                                        variant: "subtitle2",
                                      }}
                                      secondary={bytesToSize(
                                        formik?.values?.healthCustomDocuments?.[idx]?.file?.size ||
                                          corporateCustomerDetails?.data?.healthInsurance?.customFiles?.[idx]?.size
                                      )}
                                    />
                                  </ListItem>
                                </List>
                              )}

                              <Typography
                                sx={{
                                  color: "#F04438",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                {formik.errors.healthCustomDocuments?.[idx]?.file}
                              </Typography>
                            </Grid>
                            <Grid item xs={5} md={3} xl={3}>
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
                                    marginTop: "5px",
                                  }}
                                >
                                  <TextField
                                    error={Boolean(
                                      formik.touched.healthCustomDocuments?.[idx]?.originalname &&
                                        formik.errors.healthCustomDocuments?.[idx]?.originalname
                                    )}
                                    fullWidth
                                    helperText={
                                      formik.touched.healthCustomDocuments?.[idx]?.originalname &&
                                      formik.errors.healthCustomDocuments?.[idx]?.originalname
                                    }
                                    label="File Name"
                                    name={`healthCustomDocuments[${idx}][originalname]`}
                                    id={`healthCustomDocuments[${idx}][originalname]`}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.healthCustomDocuments?.[idx]?.originalname}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={2}>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <IconButton
                                  onClick={() => removeHealthCustomeFileArray(idx)}
                                  sx={{ borderRadius: "5px", border: "1px solid #F04438", p: 1.2 }}
                                >
                                  <DeleteOutlineIcon sx={{ color: "#F04438" }} />
                                </IconButton>
                                {idx == healthCustomFilesArray?.length - 1 && (
                                  <IconButton
                                    onClick={() => {
                                      addHealthCustomeFileArray();
                                    }}
                                    sx={{ borderRadius: "5px", border: "1px solid green", p: 1.2 }}
                                  >
                                    <AddIcon sx={{ color: "green" }} />
                                  </IconButton>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                </>
              )}
              {generalInsVisible && (
                <>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      width: "100%",
                      fontWeight: "600",
                      fontSize: "18px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                      py: 1,
                      mt: 2,
                      backgroundColor: "#60176F10",
                    }}
                  >
                    General Insurance
                  </Typography>
                  {generalInsuranceArray?.map((ele, idx) => {
                    return (
                      <Box key={idx} sx={{ px: 1, pb: 1 }}>
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", alignItems: "center" }}>
                          <Divider
                            sx={{
                              width:
                                idx == generalInsuranceArray?.length - 1 && generalInsuranceArray?.length > 1
                                  ? "calc(100% - 130px)"
                                  : "calc(100% - 70px)",
                            }}
                          />
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {generalInsuranceArray?.length > 1 && (
                              <IconButton
                                onClick={() => removeGeneralInsurance(idx)}
                                sx={{ borderRadius: "5px", border: "1px solid #F04438", p: 1 }}
                              >
                                <DeleteOutlineIcon sx={{ color: "#F04438" }} />
                              </IconButton>
                            )}
                            {idx == generalInsuranceArray?.length - 1 && (
                              <IconButton
                                onClick={() => {
                                  addGeneralInsurance();
                                }}
                                sx={{ borderRadius: "5px", border: "1px solid green", p: 1 }}
                              >
                                <AddIcon sx={{ color: "green" }} />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                        <Grid key={idx} container columnSpacing={1}>
                          <Grid item xs={12} sm={12}>
                            <Grid key={idx} container spacing={1}>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.general?.[idx]?.currentInsurer &&
                                          formik.errors.general?.[idx]?.currentInsurer
                                      )}
                                      helperText={
                                        formik.touched.general?.[idx]?.currentInsurer &&
                                        formik.errors.general?.[idx]?.currentInsurer
                                      }
                                      fullWidth
                                      label="Current Insurer"
                                      name={`general[${idx}][currentInsurer]`}
                                      id={`general[${idx}][currentInsurer]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.general?.[idx]?.currentInsurer}
                                      select
                                      SelectProps={{ native: true }}
                                    >
                                      <option value=""></option>
                                      {insuranceCompany?.map((option, idx) => {
                                        return (
                                          <option key={idx} value={option.value}>
                                            {option.label}
                                          </option>
                                        );
                                      })}
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.general?.[idx]?.currentInsurernoOfYears &&
                                          formik.errors.general?.[idx]?.currentInsurernoOfYears
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.general?.[idx]?.currentInsurernoOfYears &&
                                        formik.errors.general?.[idx]?.currentInsurernoOfYears
                                      }
                                      label="current Insurer No of year"
                                      name={`general[${idx}][currentInsurernoOfYears]`}
                                      id={`general[${idx}][currentInsurernoOfYears]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.general?.[idx]?.currentInsurernoOfYears}
                                      type="number"
                                    />
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <DatePicker
                                      inputFormat="dd-MM-yyyy"
                                      label="Renewal date"
                                      value={formik.values?.general?.[idx]?.renewalDate || ""}
                                      onChange={(value) => {
                                        formik.setFieldValue(`general[${idx}][renewalDate]`, value, true);
                                      }}
                                      disablePast
                                      renderInput={(params) => (
                                        <TextField
                                          name={`general[${idx}][renewalDate]`}
                                          id={`general[${idx}][renewalDate]`}
                                          fullWidth
                                          {...params}
                                          helperText={
                                            formik.touched?.general?.[idx]?.renewalDate &&
                                            formik.errors?.general?.[idx]?.renewalDate
                                          }
                                          error={
                                            formik.touched?.general?.[idx]?.renewalDate &&
                                            formik.errors?.general?.[idx]?.renewalDate
                                          }
                                        />
                                      )}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.general?.[idx]?.existingBroker &&
                                          formik.errors.general?.[idx]?.existingBroker
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.general?.[idx]?.existingBroker &&
                                        formik.errors.general?.[idx]?.existingBroker
                                      }
                                      label="Existing Broker"
                                      name={`general[${idx}][existingBroker]`}
                                      id={`general[${idx}][existingBroker]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.general?.[idx]?.existingBroker}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.general?.[idx]?.existingBrokernoOfYears &&
                                          formik.errors.general?.[idx]?.existingBrokernoOfYears
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.general?.[idx]?.existingBrokernoOfYears &&
                                        formik.errors.general?.[idx]?.existingBrokernoOfYears
                                      }
                                      label="existing Broker No of year"
                                      name={`general[${idx}][existingBrokernoOfYears]`}
                                      id={`general[${idx}][existingBrokernoOfYears]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.general?.[idx]?.existingBrokernoOfYears}
                                      type="number"
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
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
                                      marginTop: "5px",
                                    }}
                                  >
                                    <TextField
                                      error={Boolean(
                                        formik.touched.general?.[idx]?.subProduct &&
                                          formik.errors.general?.[idx]?.subProduct
                                      )}
                                      helperText={
                                        formik.touched.general?.[idx]?.subProduct &&
                                        formik.errors.general?.[idx]?.subProduct
                                      }
                                      fullWidth
                                      label="Sub Product"
                                      name={`general[${idx}][subProduct]`}
                                      id={`general[${idx}][subProduct]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      value={formik.values.general?.[idx]?.subProduct}
                                      select
                                      SelectProps={{ native: true }}
                                    >
                                      <option value=""></option>
                                      {subProductsList?.map((option, idx) => {
                                        return (
                                          <option key={idx} value={option.value}>
                                            {option.label}
                                          </option>
                                        );
                                      })}
                                    </TextField>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Box>
                                  <Box>
                                    <Box>
                                      <TextField
                                        error={Boolean(
                                          formik.touched?.general?.[idx]?.probability &&
                                            formik.errors?.general?.[idx]?.probability
                                        )}
                                        helperText={
                                          formik.touched?.general?.[idx]?.probability &&
                                          formik.errors?.general?.[idx]?.probability
                                        }
                                        fullWidth
                                        label="Probability"
                                        name={`general[${idx}][probability]`}
                                        id={`general[${idx}][probability]`}
                                        onChange={(event) => {
                                          formik.setFieldValue(`general[${idx}][probability]`, event.target.value);
                                        }}
                                        select
                                        SelectProps={{ native: true }}
                                        value={formik.values.general?.[idx]?.probability || ""}
                                      >
                                        <option value=" "> </option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                      </TextField>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                  <Box sx={{ px: 1, mt: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Files</Typography>
                      <Divider sx={{ width: "calc(100% - 40px)" }} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                      <Typography sx={{ fontSize: 14 }}>Check here to add files</Typography>

                      <Checkbox
                        onChange={(e) => onGeneralCustomFileCheckboxHandler(e?.target?.checked)}
                        checked={!!formik?.values?.generalCustomFileVisible}
                      />
                    </Box>
                  </Box>
                  {formik?.values?.generalCustomFileVisible &&
                    generalCustomFilesArray?.map((ele, idx) => {
                      return (
                        <Box key={idx} sx={{ p: 1 }}>
                          <Grid container spacing={1} alignItems={"center"}>
                            <Grid item xs={5} md={5} xl={4}>
                              <Box sx={{ display: "inline-block", width: "100%" }} mb={1}>
                                <FileDropzone
                                  accept={{
                                    "image/*": [],
                                    "application/pdf": [".pdf"],
                                  }}
                                  size="small"
                                  maxFiles={1}
                                  onDrop={(e) => handleUploadGeneralCustomFiles(e, idx)}
                                />
                              </Box>
                              {(formik?.values?.generalCustomDocuments?.[idx]?.file ||
                                corporateCustomerDetails?.data?.generalInsurance?.customFiles?.[idx]) && (
                                <List>
                                  <ListItem
                                    sx={{
                                      fontSize: 14,
                                      border: 1,
                                      borderColor: "divider",
                                      borderRadius: 1,
                                      "& + &": {
                                        mt: 1,
                                      },
                                    }}
                                  >
                                    <ListItemText
                                      primary={
                                        formik?.values?.generalCustomDocuments?.[idx]?.file?.name ||
                                        corporateCustomerDetails?.data?.generalInsurance?.customFiles?.[idx]
                                          ?.originalname
                                      }
                                      primaryTypographyProps={{
                                        color: "textPrimary",
                                        variant: "subtitle2",
                                      }}
                                      secondary={bytesToSize(
                                        formik?.values?.generalCustomDocuments?.[idx]?.file?.size ||
                                          corporateCustomerDetails?.data?.generalInsurance?.customFiles?.[idx]?.size
                                      )}
                                    />
                                  </ListItem>
                                </List>
                              )}

                              <Typography
                                sx={{
                                  color: "#F04438",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                {formik.errors.generalCustomDocuments?.[idx]?.file}
                              </Typography>
                            </Grid>
                            <Grid item xs={5} md={3} xl={3}>
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
                                    marginTop: "5px",
                                  }}
                                >
                                  <TextField
                                    error={Boolean(
                                      formik.touched.generalCustomDocuments?.[idx]?.originalname &&
                                        formik.errors.generalCustomDocuments?.[idx]?.originalname
                                    )}
                                    fullWidth
                                    helperText={
                                      formik.touched.generalCustomDocuments?.[idx]?.originalname &&
                                      formik.errors.generalCustomDocuments?.[idx]?.originalname
                                    }
                                    label="File Name"
                                    name={`generalCustomDocuments[${idx}][originalname]`}
                                    id={`generalCustomDocuments[${idx}][originalname]`}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.generalCustomDocuments?.[idx]?.originalname}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={2}>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <IconButton
                                  onClick={() => removeGeneralCustomeFileArray(idx)}
                                  sx={{ borderRadius: "5px", border: "1px solid #F04438", p: 1.2 }}
                                >
                                  <DeleteOutlineIcon sx={{ color: "#F04438" }} />
                                </IconButton>
                                {idx == generalCustomFilesArray?.length - 1 && (
                                  <IconButton
                                    onClick={() => {
                                      addGeneralCustomeFileArray();
                                    }}
                                    sx={{ borderRadius: "5px", border: "1px solid green", p: 1.2 }}
                                  >
                                    <AddIcon sx={{ color: "green" }} />
                                  </IconButton>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                </>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained">
                {customerId ? "Update" : "Create"}
              </Button>
            </Box>
          </Container>
        </Box>
      </form>
    </>
  );
};

CreateProposals.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateProposals;
