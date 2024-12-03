import React, { useEffect, useState } from "react";
import { useFormik, Field } from "formik";
import format from "date-fns/format";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  EditCarDetails,
  getAllCarsList,
  getAllCarsModalList,
  getAllTrim,
  getBodies,
  getCalculateCarValue,
  getCarDetails,
  getCarYears,
  getProposalsDetailsById,
  getQuotationListByProposalId,
} from "./Action/proposalsAction";
import * as Yup from "yup";
import { formattedDateUfc } from "src/utils/Format";
import ModalComp from "src/components/modalComp";
import { ratio } from "fuzzball";
import { addDays, addYears, compareAsc, isValid, startOfDay } from "date-fns";
import { dateFormate } from "src/utils/date-formate";
import { insertInArray, jsonToFormData } from "src/utils/convert-to-form-data";
import CarImagesForm from "./car-images-form";

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
    value: "None",
  },
];

const EditCarDetailsForm = ({
  ReGenerateHandler,
  setIsCarEdit,
  setLoading,
  fetchProposalSummary,
  isProposalPurchased,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { proposalId } = router.query;

  const { proposalDetail, proposalQuotationCustomePagination, proposalQuotationList, loading } = useSelector(
    (state) => state.proposals
  );
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [selectedIdFile, setSelectedIdFile] = useState("");
  const [isLoadingCar, setIsLoadingCar] = useState(true);
  const [allYears, setAllYears] = useState([]);
  const [missMatch, setMissMatch] = useState(false);
  const handleClose = () => setMissMatch(false);
  const [sensitiveData, setSensitiveData] = useState({
    make: proposalDetail?.car.make,
    model: proposalDetail?.car.model,
    trim: proposalDetail?.car.trim,
    bodyType: proposalDetail?.car.bodyType,
    cylinders: proposalDetail?.car.cylinders,
    year: proposalDetail?.car.year,
    price: proposalDetail?.car.price,
    regionalSpec: proposalDetail?.car.regionalSpec,
  });

  const [finalPayload, setFinalPayload] = useState();

  useEffect(() => {
    let currentYear = new Date().getFullYear();

    const years = [currentYear];
    for (let i = 0; i < 40; i++) {
      currentYear = currentYear - 1;
      years.push(currentYear);
    }

    setAllYears(years);
  }, []);

  const [searchCar, setSearchCar] = useState([]);
  const [searchModels, setSearchedModels] = useState([]);
  const [searchTrim, setSearchTrim] = useState([]);
  const [searchYears, setSearchedYears] = useState([]);
  const [searchBodyType, setSearchBodyType] = useState([]);

  const initialValues = {
    make: proposalDetail?.car.make || "",
    model: proposalDetail?.car.model || "",
    trim: proposalDetail?.car.trim || "",
    body_type: proposalDetail?.car.bodyType || "",
    body_type_text: proposalDetail?.car.bodyType || "",
    bodyType: { name: proposalDetail?.car.bodyType } || "",
    cylinders: proposalDetail?.car.cylinders || "",
    cylinders_text: proposalDetail?.car.cylinders || "",
    year: proposalDetail?.car.year || "",
    price: proposalDetail?.car.price || "",
    regionalSpec: proposalDetail?.car.regionalSpec || "GCC",
    insuranceExpiryDate: proposalDetail?.car.insuranceExpiryDate || "",
    policyEffectiveDate: proposalDetail?.car.policyEffectiveDate || "",
    regCardExpiryDate: proposalDetail?.car.regCardExpiryDate || "",
    registrationDate: proposalDetail?.car.registrationDate || "",
    chesisNo: proposalDetail?.car.chesisNo || "",
    tcNo: proposalDetail?.car.tcNo || "",
    policyNumber: proposalDetail?.car.policyNumber || "",
    registrationYear: proposalDetail?.car.registrationYear || "",
    registrationEmirate: proposalDetail?.car.registrationEmirate || "",
    engineNumber: proposalDetail?.car.engineNumber || "",
    color: proposalDetail?.car.color || "",
    plateNumber: proposalDetail?.car.plateNumber || "",
    origin: proposalDetail?.car.origin || "",
    motorProduct: proposalDetail?.car.motorProduct || "",
    noOfPassengers: proposalDetail?.car.noOfPassengers || "",
    useOfVehicle: proposalDetail?.car.useOfVehicle || "Personal",
    plateCode: plateCodeLatters?.includes(proposalDetail?.car?.plateCode) ? proposalDetail?.car?.plateCode : "",
    currentInsurer: insuranceCompany?.includes(proposalDetail?.car?.currentInsurer)
      ? proposalDetail?.car?.currentInsurer
      : "",
    insureType:
      proposalDetail?.car.insureType === "comprehensive" || proposalDetail?.car.insureType === "Comprehensive"
        ? "comprehensive"
        : proposalDetail?.car.insureType === "thirdparty" || proposalDetail?.car.insureType === "Thirdparty"
        ? "thirdparty"
        : "",
    claimHistory: proposalDetail?.car.claimHistory || "",
    yearOfNoClaim: proposalDetail?.car.yearOfNoClaim || "",
    // ncdProofDocument: proposalDetail?.car.ncdProofDocument || "",
    typeOfIssues: proposalDetail?.car?.typeOfIssues || "",
    expiredCarPhotos: proposalDetail?.car?.expiredCarPhotos || [],
  };

  const handleSubmit = (values) => {
    // console.log(values, "values");
    const { cylinders_text, body_type_text, body_type } = values;

    if (!cylinders_text) {
      values.cylinders_text = values.cylinders;
    }

    if (!body_type_text) {
      values.body_type_text = body_type?.name || body_type;
    }

    // let formattedExpiryDate;
    // if (values.insuranceExpiryDate) {
    //   formattedExpiryDate = formattedDateUfc(values.insuranceExpiryDate);
    // }
    // let formattedStartDate;
    // if (values.policyEffectiveDate) {
    //   formattedStartDate = formattedDateUfc(values.policyEffectiveDate);
    // }
    // let formattedRegCardExpiryDate;
    // if (values.regCardExpiryDate) {
    //   formattedRegCardExpiryDate = formattedDateUfc(values.regCardExpiryDate);
    // }

    let updatedManualCarDetails;
    updatedManualCarDetails = {
      make: values.make,
      model: values.model,
      trim: values.trim,
      bodyType: values.body_type_text || values.body_type,
      cylinders: values.cylinders,
      year: values.year,
      price: values.price,
      regionalSpec: values.regionalSpec,
      insuranceExpiryDate: dateFormate(values.insuranceExpiryDate),
      policyEffectiveDate: dateFormate(values.policyEffectiveDate),
      regCardExpiryDate: dateFormate(values.regCardExpiryDate),
      registrationDate: dateFormate(values.registrationDate),
      chesisNo: values.chesisNo?.toUpperCase(),
      tcNo: values.tcNo,
      policyNumber: values.policyNumber,
      registrationYear: values.registrationYear,
      registrationEmirate: values.registrationEmirate,
      engineNumber: values.engineNumber,
      color: values.color,
      plateNumber: values.plateNumber,
      origin: values.origin,
      motorProduct: values.motorProduct,
      noOfPassengers: values.noOfPassengers,
      useOfVehicle: values.useOfVehicle,
      plateCode: values.plateCode,
      currentInsurer: values.currentInsurer,
      insureType: values.insureType,
      claimHistory: values.claimHistory,
      // ncdProofDocument: values.ncdProofDocument,
      yearOfNoClaim: values.yearOfNoClaim,
      typeOfIssues: values.typeOfIssues,
      proposalId: proposalId,
      updateType: "proposal",
    };

    setFinalPayload(updatedManualCarDetails);

    const matchObj = {
      make: values.make,
      model: values.model,
      trim: values.trim,
      bodyType: values.body_type_text || values.body_type,
      cylinders: values.cylinders,
      year: values.year,
      price: values.price,
      regionalSpec: values.regionalSpec,
    };

    if (
      matchObj.make !== sensitiveData.make ||
      matchObj.model !== sensitiveData.model ||
      matchObj.trim !== sensitiveData.trim ||
      matchObj.bodyType !== sensitiveData.bodyType ||
      matchObj.cylinders !== sensitiveData.cylinders ||
      matchObj.year !== sensitiveData.year ||
      matchObj.price != sensitiveData.price ||
      matchObj.regionalSpec !== sensitiveData.regionalSpec
    ) {
      setMissMatch(true);
      return;
    }

    setLoading && setLoading(false);

    const formData = jsonToFormData(updatedManualCarDetails);
    values?.expiredCarPhotos?.map((i, idx) => {
      formData?.append("expiredCarPhotos", values?.expiredCarPhotos?.[idx]);
    });

    dispatch(
      EditCarDetails({
        id: proposalDetail?.car?._id,
        data: formData,
      })
    )
      .unwrap()
      .then((res) => {
        if (res) {
          dispatch(
            getQuotationListByProposalId({
              page: proposalQuotationCustomePagination?.page,
              size: proposalQuotationCustomePagination?.size,
              id: proposalDetail?.proposalStatus?.proposalId || proposalId,
            })
          );

          fetchProposalSummary && fetchProposalSummary();

          dispatch(
            getProposalsDetailsById({
              id: proposalDetail?.proposalStatus?.proposalId || proposalId,
            })
          );

          toast("Successfully updated", {
            type: "success",
          });
          setIsCarEdit(false);
          setLoading && setLoading(true);
        }
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        setLoading && setLoading(true);
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      make: Yup.string().required("Required"),
      model: Yup.string().required("Required"),
      // bodyType: Yup.string().required("Required"),
      trim: Yup.string().required("Required"),
      cylinders: Yup.string().required("Required"),
      year: Yup.string().required("Required"),
      price: Yup.string().required("Required"),
      regionalSpec: Yup.string().required("Required"),
      plateCode: Yup.string().max(2).required("Required"),
      plateNumber: Yup.string().max(5).required("Required"),
      color: Yup.string().required("Required"),
      engineNumber: Yup.string().required("Required"),
      policyEffectiveDate: Yup.date()
        .min(addDays(new Date(), -1), "Must select future date!")
        .max(addYears(new Date(), 1), "Can't select one year after date!")
        .notRequired(),
      expiredCarPhotos: Yup.array().when(["isInsuranceExpired"], {
        is: (value) => value === true,
        then: (schema) => Yup.array().of(Yup.mixed().required("Required")).min(3, "At least 3 images require"),
        otherwise: (schema) => Yup.array().notRequired(),
      }),
      registrationYear: Yup.string().required("Required"),
      origin: Yup.string().required("Required"),
      noOfPassengers: Yup.string().required("Required"),
      useOfVehicle: Yup.string().required("Required"),
      registrationEmirate: Yup.string().required("Required"),
      chesisNo: Yup.string().min(17).max(17).required("Required"),
      tcNo: Yup.string().required("Required"),
      registrationDate: Yup.string().required("Required"),
      regCardExpiryDate: Yup.string().required("Required"),
      policyEffectiveDate: Yup.string().required("Required"),
      //insurance
      currentInsurer: Yup.string().required("Required"),
      insureType: Yup.string().required("Required"),
      insuranceExpiryDate: Yup.string().required("Required"),
      claimHistory: Yup.string().required("Required"),
      yearOfNoClaim: Yup.string().required("Required"),
      typeOfIssues: Yup.string().required("Required"),
      // policyNumber: Yup.string().required("Required"),
    }),
    onSubmit: handleSubmit,
  });

  const onPayloadSubmit = () => {
    if (finalPayload) {
      const formData = jsonToFormData(finalPayload);

      dispatch(
        EditCarDetails({
          id: proposalDetail?.car?._id,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          if (proposalId) {
            ReGenerateHandler(proposalQuotationList);
            toast("Successfully updated", {
              type: "success",
            });
            setIsCarEdit(false);
            setLoading && setLoading(true);
            return;
          }
          if (res) {
            dispatch(
              getQuotationListByProposalId({
                page: proposalQuotationCustomePagination?.page,
                size: proposalQuotationCustomePagination?.size,
                id: proposalDetail?.proposalStatus?.proposalId || proposalId,
              })
            );

            fetchProposalSummary && fetchProposalSummary();

            if (proposalDetail?.proposalStatus?.proposalId || proposalId) {
              dispatch(
                getProposalsDetailsById({
                  id: proposalDetail?.proposalStatus?.proposalId || proposalId,
                })
              );
            }

            toast("Successfully updated", {
              type: "success",
            });
            setIsCarEdit(false);
            setLoading && setLoading(true);
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          setLoading && setLoading(true);
        });
    }
  };

  useEffect(() => {
    if (proposalDetail && insuranceCompany) {
      insuranceCompany.map((Insurer, idx) => {
        if (ratio(Insurer?.value, proposalDetail?.car?.currentInsurer?.replace(/[^\x00-\x7F]/g, "")) > 90) {
          formik.setFieldValue("currentInsurer", Insurer?.value);
        }
      });
    }
  }, [proposalDetail]);

  const carOptions = searchCar?.map((value) => {
    return value;
  });

  const modelsOptions =
    searchModels &&
    searchModels?.map((value) => {
      return value;
    });

  const bodyTypeOptions =
    searchBodyType &&
    (searchBodyType || [])?.map((value) => {
      return {
        name: value.name,
        id: value._id,
        label: value.name,
        value: value._id,
      };
    });

  const trimOptions =
    searchTrim &&
    searchTrim?.map((value) => {
      return value;
    });

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

  function roundToNearestHundred(value) {
    return Math.round(value / 100) * 100;
  }

  const getCarValueHandler = (data) => {
    setIsLoadingCar(true);

    if (data) {
      setIsLoadingCar(false);
      dispatch(getCalculateCarValue(data))
        .unwrap()
        .then((res) => {
          formik.setFieldValue("price", roundToNearestHundred(res?.data?.predicted_price));
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

  const fetchBodyTypesandCylinders = (make, model, trim, year) => {
    dispatch(getCarDetails({ make: make, model: model, trim: trim, year: year }))
      .unwrap()
      .then((res) => {
        getCarValueHandler({
          make,
          model,
          trim,
          year,
          ...res.data,
          regionalSpec: formik?.values?.regionalSpec,
        });

        formik.setFieldValue("cylinders", res?.data?.cylinders ? res?.data?.cylinders : formik.values.cylinders || "");
        formik.setFieldValue("cylinders_text", res?.data?.cylinders || formik.values.cylinders || "");

        formik.setFieldValue("body_type_text", res?.data?.bodyType);
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

  const fetchTrims = (make, year, model) => {
    dispatch(getAllTrim({ make: make, year: year, model: model }))
      .unwrap()
      .then((res) => {
        setSearchTrim(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast(err, {
          type: "error",
        });
      });
  };

  useEffect(() => {
    fetchYears();
    fetchBodyTypes();
    // dispatch(clearFinalData());
  }, []);

  useEffect(() => {
    if (formik.values.year) {
      searchCars(formik.values.year);
    }

    if (formik.values.make && formik.values.year) {
      fetchModels(formik.values.make, formik.values.year);
    }

    if (formik.values.make && formik.values.year && formik.values.model) {
      fetchTrims(formik.values.make, formik.values.year, formik.values.model);
    }

    if (
      formik.values.make &&
      formik.values.year &&
      formik.values.model &&
      formik.values.trim &&
      (!formik.values.bodyType || !formik.values.cylinders || !formik.values.price)
    ) {
      fetchBodyTypesandCylinders(formik.values.make, formik.values.model, formik.values.trim, formik.values.year);
    }
  }, []);

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

  const handleUploadId = (event, index) => {
    const file = event.target.files?.[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    event.target.value = null; // Clear the file input value
    formik.setFieldValue("ncdProofDocument", file);
    let result;
    // if (selectedIdFile?.[index]) {
    result = insertInArray(selectedIdFile, index, file);
    setSelectedIdFile(result);
  };

  const checkInsuranceDateValidation = (policyDate, insuranceDate) => {
    if (isValid(new Date(policyDate)) && isValid(new Date(insuranceDate))) {
      if (
        compareAsc(new Date(startOfDay(new Date(insuranceDate))), new Date(startOfDay(new Date(policyDate)))) === -1
      ) {
        formik?.setFieldValue("isInsuranceExpired", true);
      } else {
        formik?.setFieldValue("isInsuranceExpired", false);
      }
    }
  };

  useEffect(() => {
    if (
      formik?.values?.insuranceExpiryDate &&
      isValid(new Date(formik?.values?.insuranceExpiryDate)) &&
      formik?.values?.policyEffectiveDate &&
      isValid(new Date(formik?.values?.policyEffectiveDate))
    ) {
      checkInsuranceDateValidation(
        new Date(formik?.values?.policyEffectiveDate),
        new Date(formik?.values?.insuranceExpiryDate)
      );
    }
  }, [formik?.values?.insuranceExpiryDate, formik?.values?.policyEffectiveDate]);

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600, width: "150px", ml: 1 }}>Policy Start Date</Typography>

          <Divider sx={{ width: { xs: "50%", sm: "60%", md: "70%" } }} />
        </Box>
        <Grid container columnSpacing={4} sx={{ my: 2 }}>
          <Grid item xs={12} sm={11.5}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Policy Start Date"
                        maxDate={new Date().setDate(new Date().getDate() + 365)}
                        minDate={new Date()}
                        onChange={(value) => {
                          formik.setFieldValue("policyEffectiveDate", value);
                        }}
                        // disabled={!!proposalDetail?.car?.policyEffectiveDate}
                        renderInput={(params) => (
                          <TextField
                            name="policyEffectiveDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.policyEffectiveDate && formik.errors.policyEffectiveDate)}
                            helperText={formik.touched.policyEffectiveDate && formik.errors.policyEffectiveDate}
                          />
                        )}
                        value={formik.values.policyEffectiveDate}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600, width: "150px", ml: 1 }}>Basic Car Detail</Typography>

          <Divider sx={{ width: { xs: "50%", sm: "60%", md: "70%" } }} />
        </Box>
        <Grid container columnSpacing={4} sx={{ my: 2 }}>
          <Grid item xs={12} sm={11.5}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Year
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="year"
                        disabled={!!proposalDetail?.car?.year}
                        options={searchYears}
                        loading={searchYears?.length == 0}
                        value={formik.values.year}
                        onChange={(e, value) => {
                          setSearchCar([]);
                          searchCars(value);
                          formik.setFieldValue("year", value);
                          formik.setFieldValue("make", "");
                          formik.setFieldValue("model", "");
                          formik.setFieldValue("trim", "");
                          formik.setFieldValue("bodyType", "");
                          formik.setFieldValue("body_type_text", "");
                          formik.setFieldValue("cylinders_text", "");
                          formik.setFieldValue("cylinders", "");

                          if (!value) {
                            formik.setFieldValue("year", "");
                          }
                        }}
                        ListboxProps={{ style: { maxHeight: 250 } }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Car Year"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {searchYears?.length == 0 ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />

                      {formik.touched.year && formik.errors.year && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.year}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Brand
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="make"
                        options={carOptions}
                        loading={formik.values.year && carOptions?.length == 0}
                        value={formik.values.make}
                        disabled={proposalDetail?.car?.make ? !!proposalDetail?.car?.make : !formik.values.year}
                        onChange={(e, value) => {
                          formik.setFieldValue("make", value);
                          setSearchedModels([]);
                          fetchModels(value, formik.values.year);
                          formik.setFieldValue("model", "");
                          formik.setFieldValue("trim", "");
                          formik.setFieldValue("bodyType", "");
                          formik.setFieldValue("body_type_text", "");
                          formik.setFieldValue("cylinders_text", "");
                          formik.setFieldValue("cylinders", "");

                          if (!value) {
                            formik.setFieldValue("make", "");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Car Brand"
                            // error={Boolean(formik.touched.make && formik.errors.make)}
                            // helperText={formik.touched.make && formik.errors.make}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {formik.values.year && carOptions?.length == 0 ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />

                      {formik.touched.make && formik.errors.make && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.make}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Model
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="model"
                        disabled={proposalDetail?.car?.model ? !!proposalDetail?.car?.model : !formik.values.make}
                        options={searchModels}
                        loading={formik.values.make && searchModels?.length == 0}
                        value={formik.values.model}
                        onChange={(e, value) => {
                          setSearchTrim([]);
                          fetchTrims(formik.values.make, formik.values.year, value);

                          formik.setFieldValue("model", value);
                          formik.setFieldValue("trim", "");
                          formik.setFieldValue("bodyType", "");
                          formik.setFieldValue("body_type_text", "");
                          formik.setFieldValue("cylinders_text", "");
                          formik.setFieldValue("cylinders", "");
                          if (!value) {
                            formik.setFieldValue("model", "");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Car Model"
                            // error={Boolean(formik.touched.model && formik.errors.model)}
                            // helperText={formik.touched.model && formik.errors.model}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {formik.values.make && searchModels?.length == 0 ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />

                      {formik.touched.model && formik.errors.model && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.model}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Regional Specs
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.regionalSpec && formik.errors.regionalSpec)}
                        helperText={formik.touched.regionalSpec && formik.errors.regionalSpec}
                        disabled={!!proposalDetail?.car?.regionalSpec}
                        fullWidth
                        label="Regional Specs"
                        name="regionalSpec"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.regionalSpec}
                      >
                        <option value="GCC">GCC</option>
                        <option value="Non-GCC">Non-GCC</option>
                      </TextField>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Trim
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <Autocomplete
                        id="trim"
                        disabled={proposalDetail?.car?.trim ? !!proposalDetail?.car?.trim : !formik.values.model}
                        options={trimOptions}
                        loading={formik.values.model && trimOptions?.length == 0}
                        value={formik.values.trim}
                        onChange={(e, value) => {
                          formik.setFieldValue("trim", value);
                          fetchBodyTypesandCylinders(
                            formik.values.make,
                            formik.values.model,
                            value,
                            formik.values.year
                          );

                          if (!value) {
                            formik.setFieldValue("bodyType", "");
                            formik.setFieldValue("body_type_text", "");
                            formik.setFieldValue("cylinders_text", "");
                            formik.setFieldValue("cylinders", "");
                          }
                        }}
                        ListboxProps={{ style: { maxHeight: 250 } }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Car Trim"
                            // error={Boolean(formik.touched.trim && formik.errors.trim)}
                            // helperText={formik.touched.trim && formik.errors.trim}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {formik.values.model && trimOptions?.length == 0 ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />

                      {formik.touched.trim && formik.errors.trim && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.trim}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        No. of Cylinders
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      {!!formik.values.cylinders_text && (
                        <TextField
                          error={Boolean(formik.touched.cylinders_text && formik.errors.cylinders_text)}
                          fullWidth
                          helperText={formik.touched.cylinders_text && formik.errors.cylinders_text}
                          label="Cylinders"
                          name="cylinders_text"
                          disabled
                          value={formik.values.cylinders_text}
                        />
                      )}

                      {!formik.values.cylinders_text && (
                        <TextField
                          error={Boolean(formik.touched.cylinders && formik.errors.cylinders)}
                          disabled={
                            proposalDetail?.car?.cylinders ? !!proposalDetail?.car?.cylinders : !formik.values.trim
                          }
                          helperText={formik.touched.cylinders && formik.errors.cylinders}
                          fullWidth
                          label="Cylinders"
                          name="cylinders"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={formik.values.cylinders !== "" ? formik.values.cylinders : undefined}
                        >
                          <option value=""></option>
                          <option value="4">4</option>
                          <option value="6">6</option>
                          <option value="8">8</option>
                          <option value="9">9+</option>
                        </TextField>
                      )}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Body type
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      {!!formik.values.body_type_text && (
                        <TextField
                          error={Boolean(formik.touched.body_type_text && formik.errors.body_type_text)}
                          fullWidth
                          helperText={formik.touched.body_type_text && formik.errors.body_type_text}
                          label="Body Type"
                          name="body_type_text"
                          disabled
                          value={formik.values.body_type_text}
                        />
                      )}

                      {!formik.values.body_type_text && (
                        <Autocomplete
                          id="bodyType"
                          disabled={
                            proposalDetail?.car?.bodyType ? !!proposalDetail?.car?.bodyType : !formik.values.trim
                          }
                          options={bodyTypeOptions}
                          loading={loading}
                          value={formik?.values?.bodyType}
                          onChange={(e, value) => {
                            formik.setFieldValue("bodyType", value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Body Type"
                              // error={Boolean(formik.touched.bodyType && formik.errors.bodyType)}
                              // helperText={formik.touched.bodyType && formik.errors.bodyType}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      )}

                      {formik.touched.bodyType && formik.errors.bodyType && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.bodyType}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Value
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        // disabled={proposalDetail?.car?.price ? !!proposalDetail?.car?.price : !formik.values.trim}
                        error={Boolean(formik.touched.price && formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                        fullWidth
                        type="number"
                        label="Car Value"
                        name="price"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={!isLoadingCar ? "" : formik.values.price}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              {!isLoadingCar && <CircularProgress size={20} />}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Policy Start Date
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.noOfPassengers && formik.errors.noOfPassengers)}
                        fullWidth
                        helperText={formik.touched.noOfPassengers && formik.errors.noOfPassengers}
                        select
                        disabled={!!isProposalPurchased}
                        label="No Of Passengers"
                        name="noOfPassengers"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.noOfPassengers}
                        SelectProps={{ native: true }}
                      >
                        <option value=""></option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.useOfVehicle && formik.errors.useOfVehicle)}
                        fullWidth
                        helperText={formik.touched.useOfVehicle && formik.errors.useOfVehicle}
                        select
                        disabled={!!isProposalPurchased}
                        label="Use Of Vehicle"
                        name="useOfVehicle"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.useOfVehicle}
                        SelectProps={{ native: true }}
                      >
                        <option value=""></option>
                        <option value="Commercial">Commercial</option>
                        <option value="Personal">Personal</option>
                      </TextField>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6} sx={{ mt: { xs: 2, md: "unset" } }}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Chassis No.
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.chesisNo && formik.errors.chesisNo)}
                        helperText={formik.touched.chesisNo && formik.errors.chesisNo}
                        disabled={!!isProposalPurchased}
                        fullWidth
                        label="Chassis No."
                        name="chesisNo"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.chesisNo}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Registration card TC Number
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.tcNo && formik.errors.tcNo)}
                        fullWidth
                        // disabled={!!isProposalPurchased}
                        helperText={formik.touched.tcNo && formik.errors.tcNo}
                        label="Registration card TC Number"
                        name="tcNo"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.tcNo}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Reg. card issue date"
                        onChange={(value) => {
                          formik.setFieldValue("registrationDate", value);
                        }}
                        // disabled={!!isProposalPurchased}
                        renderInput={(params) => (
                          <TextField
                            name="registrationDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.registrationDate && formik.errors.registrationDate)}
                            helperText={formik.touched.registrationDate && formik.errors.registrationDate}
                          />
                        )}
                        value={formik.values.registrationDate}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Reg. card expiry date"
                        onChange={(value) => {
                          formik.setFieldValue("regCardExpiryDate", value);
                        }}
                        // disabled={!!isProposalPurchased}
                        renderInput={(params) => (
                          <TextField
                            name="regCardExpiryDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.regCardExpiryDate && formik.errors.regCardExpiryDate)}
                            helperText={formik.touched.regCardExpiryDate && formik.errors.regCardExpiryDate}
                          />
                        )}
                        value={formik.values.regCardExpiryDate}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Year of first registration
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.registrationYear && formik.errors.registrationYear)}
                        helperText={formik.touched.registrationYear && formik.errors.registrationYear}
                        fullWidth
                        // disabled={!!isProposalPurchased}
                        label="Year of first registration"
                        name="registrationYear"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.registrationYear}
                      >
                        <option value=""></option>
                        {allYears?.map((year) => {
                          return <option value={year}>{year}</option>;
                        })}
                      </TextField>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Registration emirate
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.registrationEmirate && formik.errors.registrationEmirate)}
                        helperText={formik.touched.registrationEmirate && formik.errors.registrationEmirate}
                        fullWidth
                        // disabled={!!isProposalPurchased}
                        label="Registration emirate"
                        name="registrationEmirate"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.registrationEmirate}
                      >
                        <option value=""></option>
                        {uaeStatus?.map((state, idx) => {
                          return <option value={state}>{state}</option>;
                        })}
                      </TextField>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Engine Number
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.engineNumber && formik.errors.engineNumber)}
                        fullWidth
                        // disabled={!!isProposalPurchased}
                        helperText={formik.touched.engineNumber && formik.errors.engineNumber}
                        label="Engine Number"
                        name="engineNumber"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.engineNumber}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Color
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.color && formik.errors.color)}
                        fullWidth
                        helperText={formik.touched.color && formik.errors.color}
                        // disabled={!!isProposalPurchased}
                        label="Color"
                        name="color"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.color}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Plate Number
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.plateNumber && formik.errors.plateNumber)}
                        fullWidth
                        helperText={formik.touched.plateNumber && formik.errors.plateNumber}
                        // disabled={!!isProposalPurchased}
                        label="Plate Number"
                        name="plateNumber"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.plateNumber}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Plate Code
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.plateCode && formik.errors.plateCode)}
                        helperText={formik.touched.plateCode && formik.errors.plateCode}
                        fullWidth
                        label="Plate Code"
                        name="plateCode"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        // disabled={!!isProposalPurchased}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.plateCode}
                      >
                        <option value=""></option>
                        {plateCodeLatters?.map((code, idx) => {
                          return <option value={code}> {code} </option>;
                        })}
                      </TextField>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                    <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                        Origin
                      </Typography>
                    </Box>
                  </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.origin && formik.errors.origin)}
                        fullWidth
                        helperText={formik.touched.origin && formik.errors.origin}
                        // disabled={!!isProposalPurchased}
                        label="Origin"
                        name="origin"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.origin}
                      />
                    </Box>
                  </Grid>
                  {/* <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.motorProduct && formik.errors.motorProduct)}
                        fullWidth
                        helperText={formik.touched.motorProduct && formik.errors.motorProduct}
                        disabled={!!isProposalPurchased}
                        label="Motor Product"
                        name="motorProduct"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.motorProduct}
                      />
                    </Box>
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600, width: "150px", ml: 1 }}>Insurance Detail</Typography>

          <Divider sx={{ width: { xs: "50%", sm: "60%", md: "70%" } }} />
        </Box>
        <Grid container columnSpacing={4} sx={{ my: 2 }}>
          <Grid item xs={12} sm={11.5}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                      <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                          Current Insurer
                        </Typography>
                      </Box>
                    </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.currentInsurer && formik.errors.currentInsurer)}
                        helperText={formik.touched.currentInsurer && formik.errors.currentInsurer}
                        disabled={
                          !!isProposalPurchased && !(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor)
                        }
                        fullWidth
                        label="Current Insurer"
                        name="currentInsurer"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.currentInsurer}
                        select
                        SelectProps={{ native: true }}
                      >
                        <option value=""></option>
                        {insuranceCompany?.map((option, idx) => {
                          return <option value={option.value}>{option.label}</option>;
                        })}
                      </TextField>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                      <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                          Insurance Type
                        </Typography>
                      </Box>
                    </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.insureType && formik.errors.insureType)}
                        helperText={formik.touched.insureType && formik.errors.insureType}
                        disabled={
                          !!isProposalPurchased && !(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor)
                        }
                        fullWidth
                        label="Insurance Type"
                        name="insureType"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.insureType}
                      >
                        <option value=""></option>
                        <option value="thirdparty">Third Party</option>
                        <option value="comprehensive">Comprehensive</option>
                      </TextField>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                      <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                          Current Insurance expiry
                        </Typography>
                      </Box>
                    </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        label="Current Insurance expiry"
                        onChange={(value) => {
                          formik.setFieldValue("insuranceExpiryDate", value);
                        }}
                        disabled={
                          !!isProposalPurchased && !(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor)
                        }
                        renderInput={(params) => (
                          <TextField
                            name="insuranceExpiryDate"
                            fullWidth
                            {...params}
                            error={Boolean(formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate)}
                            helperText={formik.touched.insuranceExpiryDate && formik.errors.insuranceExpiryDate}
                          />
                        )}
                        value={formik.values.insuranceExpiryDate}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.policyNumber && formik.errors.policyNumber)}
                        fullWidth
                        disabled={!!isProposalPurchased}
                        helperText={formik.touched.policyNumber && formik.errors.policyNumber}
                        label="Current Insurance Policy Number"
                        name="policyNumber"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.policyNumber}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                  {/* <Grid item xs={12} md={3}>
                      <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                          Claim history
                        </Typography>
                      </Box>
                    </Grid> */}

                  <Grid item xs={12} md={12} sx={{ mt: { xs: 2, md: "unset" } }}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.claimHistory && formik.errors.claimHistory)}
                        helperText={formik.touched.claimHistory && formik.errors.claimHistory}
                        disabled={
                          !!isProposalPurchased && !(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor)
                        }
                        fullWidth
                        label="Claim history"
                        name="claimHistory"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.claimHistory}
                      >
                        <option value=""></option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </TextField>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} md={3}>
                      <Box sx={{ display: "inline-block", width: "100%", ml: 2 }}>
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
                          Claim Count
                        </Typography>
                      </Box>
                    </Grid> */}

                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.yearOfNoClaim && formik.errors.yearOfNoClaim)}
                        helperText={formik.touched.yearOfNoClaim && formik.errors.yearOfNoClaim}
                        disabled={formik.values.claimHistory == "false" ? true : false}
                        fullWidth
                        label="Claim Count"
                        name="yearOfNoClaim"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.yearOfNoClaim}
                      >
                        <option value=""></option>
                        <option value={"Claimed Last Year"}>Claimed Last Year</option>
                        <option value={"No Claims for One Year"}>No Claims for 1 Years</option>
                        <option value={"No Claims for Two Years"}>No Claims for 2 Years</option>
                        <option value={"No Claims for Three Years"}>No Claims for 3 Years</option>
                        <option value={"No Claims for Four Years"}>No Claims for 4 Years</option>
                        {/* <option value={"No Claims for Five Years"}>
                        No Claims for 5 Years
                        </option> */}
                        {formik?.values?.claimHistory != "true" && (
                          <option value={"No Claims for Five Years"}>Never Claimed</option>
                        )}
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <TextField
                        error={Boolean(formik.touched.typeOfIssues && formik.errors.typeOfIssues)}
                        helperText={formik.touched.typeOfIssues && formik.errors.typeOfIssues}
                        fullWidth
                        disabled={
                          !!isProposalPurchased && !(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor)
                        }
                        label="Type of issues"
                        name="typeOfIssues"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.typeOfIssues}
                      >
                        <option value=""></option>
                        <option value="Renewal">Renewal</option>
                        <option value="New">New</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      {/* {!isProposalPurchased && (
                        <>
                          {(formik?.values?.yearOfNoClaim === "No Claims for One Year" ||
                            formik?.values?.yearOfNoClaim === "No Claims for Two Years" ||
                            formik?.values?.yearOfNoClaim === "No Claims for Three Years" ||
                            formik?.values?.yearOfNoClaim === "No Claims for Four Years" ||
                            formik?.values?.yearOfNoClaim === "No Claims for Five Years") && (
                            <>
                              <Grid item xs={12} md={4}>
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    width: "100%",
                                    ml: 1,
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
                                    NCD Proof Document
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={8}>
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
                                    Allowed file type (.pdf)
                                  </Typography>
                                </Box>
                                {selectedIdFile?.[0] && formik?.values?.ncdProofDocument && (
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
                                    Selected File: {selectedIdFile?.[0]?.name || formik?.values?.ncdProofDocument?.name}
                                  </Typography>
                                )}
                                {formik?.errors?.ncdProofDocument && formik?.touched?.ncdProofDocument && (
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: "red",
                                      fontSize: { xs: "13px", sm: "14px" },
                                    }}
                                  >
                                    {formik?.errors?.ncdProofDocument}
                                  </Typography>
                                )}
                              </Grid>
                            </>
                          )}
                        </>
                      )} */}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {formik?.values?.isInsuranceExpired && proposalDetail?.car?.expiredCarPhotos?.length < 3 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Typography sx={{ fontSize: "16px", fontWeight: 600, width: "100px", ml: 1 }}>Car images</Typography>

              <Divider sx={{ width: { xs: "50%", sm: "60%", md: "70%" } }} />
            </Box>
            <CarImagesForm formik={formik} />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "end",
          }}
          mt={3}
        >
          <Button
            // disabled={formik.isSubmitting}
            type="submit"
            variant="contained"
          >
            Update
          </Button>

          <Button variant="outlined" type="button" onClick={() => setIsCarEdit(false)}>
            Cancel
          </Button>
        </Box>
      </form>
      <ModalComp open={missMatch} handleClose={() => {}} widths={{ xs: "95%", sm: 550 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle" sx={{ fontWeight: 600, textAlign: "center" }}>
            Changing the basic information may effect the policy price and this proposal will be regenerated. Are you
            sure, you want to continue?
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={onPayloadSubmit}>
              Okay
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </ModalComp>
    </Box>
  );
};

export default EditCarDetailsForm;
