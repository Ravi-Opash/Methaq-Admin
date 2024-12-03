import { Button, Card, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { addProposalsStatus } from "./Action/proposalsAction";
import { toast } from "react-toastify";
import { DateTimePicker } from "@mui/x-date-pickers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addMinutes } from "date-fns";
import { getNotificationNumbers } from "../overview/action/overviewAction";
import { setNotificationNumber } from "../overview/reducer/overviewSlice";
import { addHealthProposalsStatus } from "../health-insurance/Proposals/Action/healthInsuranceAction";
import { addTravelProposalsStatus } from "../travel-insurance/Proposals/Action/travelInsuranceAction";
import { commercialStatusChange } from "../commercial/contractor-all-risk/Action/commercialAction";
import {
  addMotorFleetProposalsStatus,
  getMotorFleetProposalsStatus,
} from "../motor-fleet/Proposals/Action/motorFleetProposalsAction";

import { updateLandDetails } from "../Land-insurance/Proposals/Action/landInsuranceAction";

const customer_Contacted_subOption = ["Quoted", "Didn’t pick up", "Asked for discount", "Requested a call back later"];

const lost_subOption = [
  "Fake inquiry",
  "Couldn’t meet CX premium expectation",
  "Loss of follow up – Late action",
  "Duplicate Proposal",
  "Just a query",
  "Not Interested in purchasing",
  "Already Purchased",
  "Wrong Number",
  "No Response from customer",
  "Freelancer/Dealer",
];

export default function ProposalStatusSession({
  proposalId,
  items,
  fetchProposalSummary,
  isPolicyGenerated = false,
  policyIssued = false,
  flag,
  url = "",
}) {
  const dispatch = useDispatch();
  const [showInputField, setShowInputField] = useState(false);
  const [showCalendars, setShowCalendars] = useState(false);
  const [showQuotedCalendars, setShowQuotedCalendars] = useState(false);
  const [customerCallbacked, setCustomerCallbacked] = useState(items?.callBackDone || false);
  const [customerQuotedCallbacked, setCustomerQuotedCallbacked] = useState(items?.quotedCallBackDone || false);
  const [subOption, setSubOption] = useState([]);
  const [timer, setTimer] = useState([1]);
  const [quotedTimer, setQuotedTimer] = useState([1]);
  let insurance_Company_subOption = [];

  if (flag == "Motor") {
    insurance_Company_subOption = [
      "NON GCC",
      "New license",
      "Requesting further discount",
      "Further information requested.",
    ];
  } else {
    insurance_Company_subOption = ["Requesting further discount", "Further information requested."];
  }

  let obj = {
    callbackTimeArray: items?.callbackTimeArray?.length > 0 ? items?.callbackTimeArray : [addMinutes(new Date(), 60)],
    quotedCallbackTimeArray:
      items?.quotedCallbackTimeArray?.length > 0 ? items?.quotedCallbackTimeArray : [addMinutes(new Date(), 120)],
  };

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      proposalStatus: items?.proposalStatus || "Un Attended",
      reason: items?.reason || "",
      ...obj,
    },
    validationSchema: Yup.object({
      proposalStatus: Yup.string().required("Required"),
      reason: Yup.string()
        .required("Required")
        .when(["proposalStatus"], {
          is: (value) =>
            value === "Un Attended" ||
            value === "Quote generated" ||
            value == "Customer Picked" ||
            value == "Document Requested" ||
            value == "Under Process" ||
            value == "Customer Didn't picked up",
          then: (schema) => Yup.string(),
          otherwise: (schema) => Yup.string().required("Required"),
        }),
    }),
    onSubmit: async (values, helpers) => {
      // const formData = jsonToFormData(values);
      // console.log("-----values", values);
      const a1 = values?.callbackTimeArray;
      const dateArr = [];
      [...a1]?.map((item) => {
        const aa = new Date(item).toISOString();
        dateArr?.push(aa);
      });

      const a2 = values?.quotedCallbackTimeArray;
      const dateArr2 = [];
      [...a2]?.map((item) => {
        const aa = new Date(item).toISOString();
        dateArr2?.push(aa);
      });

      const payload = {
        quotedCallbackTimeArray: dateArr2,
        quotedCallbackTime: dateArr2[dateArr2?.length - 1],
        callbackTimeArray: dateArr,
        callbackTime: dateArr[dateArr?.length - 1],
        proposalStatus: values?.proposalStatus,
        reason: values?.reason || null,
      };

      if (flag == "Motor") {
        dispatch(
          addProposalsStatus({
            data: payload,
            propId: proposalId,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("add propsal status ", res);
            fetchProposalSummary();
            toast.success("Status updated successfully");
            dispatch(getNotificationNumbers({}))
              .unwrap()
              .then((res) => {
                dispatch(setNotificationNumber(res?.data));
              })
              .catch((err) => {
                console.log(err, "err");
              });
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      }
      if (flag == "Health") {
        dispatch(
          addHealthProposalsStatus({
            data: payload,
            healthInsuranceId: proposalId,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("add propsal status ", res);
            fetchProposalSummary();
            toast.success("Status updated successfully");
            dispatch(getNotificationNumbers({}))
              .unwrap()
              .then((res) => {
                dispatch(setNotificationNumber(res?.data));
              })
              .catch((err) => {
                console.log(err, "err");
              });
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      }
      if (flag == "Travel") {
        dispatch(
          addTravelProposalsStatus({
            data: payload,
            travelInsuranceId: proposalId,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("add propsal status ", res);
            fetchProposalSummary();
            toast.success("Status updated successfully");
            dispatch(getNotificationNumbers({}))
              .unwrap()
              .then((res) => {
                dispatch(setNotificationNumber(res?.data));
              })
              .catch((err) => {
                console.log(err, "err");
              });
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      }
      if (flag == "Land") {
        dispatch(
          updateLandDetails({
            data: payload,
            landInfoId: proposalId,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("add propsal status ", res);
            fetchProposalSummary();
            toast.success("Status updated successfully");
            dispatch(getNotificationNumbers({}))
              .unwrap()
              .then((res) => {
                dispatch(setNotificationNumber(res?.data));
              })
              .catch((err) => {
                console.log(err, "err");
              });
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      }
      if (flag == "Commercials") {
        dispatch(
          commercialStatusChange({
            data: payload,
            commercialId: proposalId,
            url: url,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("add propsal status ", res);
            fetchProposalSummary();
            toast.success("Status updated successfully");
            dispatch(getNotificationNumbers({}))
              .unwrap()
              .then((res) => {
                dispatch(setNotificationNumber(res?.data));
              })
              .catch((err) => {
                console.log(err, "err");
              });
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      }
      if (flag == "MotorFleet") {
        dispatch(
          addMotorFleetProposalsStatus({
            data: payload,
            id: proposalId,
            url: url,
          })
        )
          .unwrap()
          .then((res) => {
            // console.log("add propsal status ", res);
            fetchProposalSummary();
            toast.success("Status updated successfully");
            dispatch(getNotificationNumbers({}))
              .unwrap()
              .then((res) => {
                dispatch(setNotificationNumber(res?.data));
                dispatch(getMotorFleetProposalsStatus({ id: proposalId }));
              })
              .catch((err) => {
                console.log(err, "err");
              });
          })
          .catch((err) => {
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      }
    },
  });

  useEffect(() => {
    if (formik.values.reason === "Requested a call back later" || formik.values.reason === "Didn’t pick up") {
      setShowCalendars(true);
    } else if (formik.values.reason) {
      setShowCalendars(false);
    }
    if (formik.values.reason === "Quoted" && !isPolicyGenerated) {
      setShowQuotedCalendars(true);
    } else if (formik.values.reason) {
      setShowQuotedCalendars(false);
    }
  }, [formik.values.reason]);

  // show input feild
  useEffect(() => {
    if (
      formik.values.proposalStatus === "Un Attended" ||
      formik.values.proposalStatus === "Quote generated" ||
      formik.values.proposalStatus === "Customer Picked" ||
      formik.values.proposalStatus === "Document Requested" ||
      formik.values.proposalStatus === "Under Process" ||
      formik.values.proposalStatus === "Customer Didn't picked up"
    ) {
      setShowInputField(false);
      setShowCalendars(false);
      setShowQuotedCalendars(false);
      formik.setFieldValue("reason", "");
    } else {
      setShowInputField(true);
      formik.setFieldValue("reason", "");
      if (formik.values.proposalStatus == "Customer contacted") {
        setSubOption(customer_Contacted_subOption);
      } else if (formik.values.proposalStatus == "Referred to insurance company") {
        setSubOption(insurance_Company_subOption);
      } else if (formik.values.proposalStatus == "Lost") {
        setSubOption(lost_subOption);
        setShowCalendars(false);
        setShowQuotedCalendars(false);
      } else if (
        formik.values.proposalStatus == "Policy paid and Issued" ||
        formik.values.proposalStatus == "Policy paid and Pending issue"
      ) {
        setShowInputField(false);
      }
    }
  }, [formik.values.proposalStatus]);

  useEffect(() => {
    if (items?.reason) {
      formik.setFieldValue("reason", items?.reason);
      if (items?.reason === "Requested a call back later" || items?.reason === "Didn’t pick up") {
        setShowCalendars(true);
      } else {
        setShowCalendars(false);
      }
      if (items?.reason === "Quoted" && !isPolicyGenerated) {
        setShowQuotedCalendars(true);
      } else {
        setShowQuotedCalendars(false);
      }
    }
  }, [items?.reason, isPolicyGenerated]);

  useEffect(() => {
    if (isPolicyGenerated && policyIssued) {
      formik.setFieldValue("proposalStatus", "Policy paid and Issued");
      setShowInputField(false);
    } else if (isPolicyGenerated) {
      formik.setFieldValue("proposalStatus", "Policy paid and Pending issue");
      setShowInputField(false);
    }
  }, [policyIssued, isPolicyGenerated]);

  const addTimer = () => {
    const array = timer;
    array.push(1);
    setTimer([...array]);
    formik.setFieldValue(`[callbackTimeArray][${array?.length - 1}]`, addMinutes(new Date(), 60));
  };

  const addQuotaedTimer = () => {
    const array = quotedTimer;
    array.push(1);
    setQuotedTimer([...array]);
    formik.setFieldValue(`[quotedCallbackTimeArray][${array?.length - 1}]`, addMinutes(new Date(), 120));
  };

  useEffect(() => {
    if (formik?.values?.callbackTimeArray?.length > 0) {
      const array = [];
      for (let i = 0; i < formik?.values?.callbackTimeArray?.length; i++) {
        array.push(1);
      }
      setTimer([...array]);
    }
  }, [formik?.values?.callbackTimeArray?.length]);

  useEffect(() => {
    if (formik?.values?.quotedCallbackTimeArray?.length > 0) {
      const array = [];
      for (let i = 0; i < formik?.values?.quotedCallbackTimeArray?.length; i++) {
        array.push(1);
      }
      setQuotedTimer([...array]);
    }
  }, [formik?.values?.quotedCallbackTimeArray?.length]);

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            width: "100%",
            py: 1.5,
            backgroundColor: "#f5f5f5",
            mb: 1,
            fontWeight: "600",
            fontSize: "18px",
            display: "inline-block",
            color: "#60176F",
            px: "14px",
          }}
        >
          Status
        </Typography>
        <Box sx={{ p: 2 }}>
          <Grid container columnSpacing={4} sx={{ display: "flex", gap: 2 }}>
            <Grid item xs={12} sm={5.8}>
              <Box>
                <Box>
                  <TextField
                    error={Boolean(formik.touched.proposalStatus && formik.errors.proposalStatus)}
                    helperText={formik.touched.proposalStatus && formik.errors.proposalStatus}
                    disabled={!!isPolicyGenerated}
                    fullWidth
                    label="Source"
                    name="proposalStatus"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.proposalStatus}
                  >
                    <option value="Un Attended">Un Attended</option>
                    <option value="Quote generated">Quote generated</option>
                    <option value="Under Process">Under Process</option>
                    <option value="Customer contacted">Customer contacted</option>
                    <option value="Customer Picked">Customer Picked</option>
                    <option value="Customer Didn't picked up">Customer Didn't picked up</option>
                    <option value="Document Requested">Document Requested</option>
                    <option value="Referred to insurance company">Referred to insurance company</option>
                    <option value="Lost">Lost</option>
                    {isPolicyGenerated && (
                      <>
                        <option value="Policy paid and Pending issue">Policy paid and Pending issue</option>
                        <option value="Policy paid and Issued">Policy paid and Issued</option>
                      </>
                    )}
                  </TextField>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={5.8}>
              {showInputField && (
                <>
                  <Grid item xs={12}>
                    <Box>
                      <Box>
                        <TextField
                          error={Boolean(formik.touched.reason && formik.errors.reason)}
                          helperText={formik.touched.reason && formik.errors.reason}
                          fullWidth
                          label="Reason"
                          name="reason"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={formik.values.reason || items?.reason}
                        >
                          <option value=""></option>
                          {subOption?.map((option) => (
                            <option value={option}>{option}</option>
                          ))}
                        </TextField>
                      </Box>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          {showCalendars && (
            <>
              {timer?.map((i, idx) => {
                return (
                  <Box
                    key={idx}
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <DateTimePicker
                      inputFormat="dd-MM-yyyy hh:mm:ss aa"
                      label="Date and Time"
                      value={
                        formik?.values?.callbackTimeArray?.[`${idx}`]
                          ? formik?.values?.callbackTimeArray?.[`${idx}`]
                          : ""
                      }
                      onChange={(value) => {
                        formik.setFieldValue(`[callbackTimeArray][${idx}]`, value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 300 }}
                          name={`[callbackTimeArray][${idx}]`}
                          fullWidth
                          {...params}
                          error={false}
                        />
                      )}
                    />
                    {idx == timer?.length - 1 ? (
                      <>
                        <CheckCircleIcon
                          sx={{ color: "#00FF00", cursor: "pointer" }}
                          onClick={() => {
                            if (flag == "Motor") {
                              dispatch(
                                addProposalsStatus({
                                  data: { callBackDone: true },
                                  propId: proposalId,
                                })
                              )
                                .unwrap()
                                .then((res) => {
                                  toast.success("Change the proposal status!");
                                  setCustomerCallbacked(true);
                                })
                                .catch((err) => {
                                  if (err) {
                                    toast(err, {
                                      type: "error",
                                    });
                                  }
                                });
                            }
                            if (flag == "Health") {
                              dispatch(
                                addHealthProposalsStatus({
                                  data: { callBackDone: true },
                                  healthInsuranceId: proposalId,
                                })
                              )
                                .unwrap()
                                .then((res) => {
                                  toast.success("Change the proposal status!");
                                  setCustomerCallbacked(true);
                                })
                                .catch((err) => {
                                  if (err) {
                                    toast(err, {
                                      type: "error",
                                    });
                                  }
                                });
                            }
                            if (flag == "Travel") {
                              dispatch(
                                addTravelProposalsStatus({
                                  data: { callBackDone: true },
                                  travelInsuranceId: proposalId,
                                })
                              )
                                .unwrap()
                                .then((res) => {
                                  toast.success("Change the proposal status!");
                                  setCustomerCallbacked(true);
                                })
                                .catch((err) => {
                                  if (err) {
                                    toast(err, {
                                      type: "error",
                                    });
                                  }
                                });
                            }
                            if (flag == "Commercials") {
                              dispatch(
                                commercialStatusChange({
                                  data: { callBackDone: true },
                                  commercialId: proposalId,
                                  url: url,
                                })
                              )
                                .unwrap()
                                .then((res) => {
                                  toast.success("Change the proposal status!");
                                  setCustomerCallbacked(true);
                                })
                                .catch((err) => {
                                  if (err) {
                                    toast(err, {
                                      type: "error",
                                    });
                                  }
                                });
                            }
                          }}
                        />
                        {!customerCallbacked && (
                          <CheckCircleIcon sx={{ color: "#8c8c8c", cursor: "pointer" }} onClick={addTimer} />
                        )}
                      </>
                    ) : (
                      <CheckCircleIcon sx={{ color: "#8c8c8c", cursor: "pointer" }} />
                    )}
                  </Box>
                );
              })}
            </>
          )}
          {showQuotedCalendars && (
            <>
              {quotedTimer?.map((i, idx) => {
                return (
                  <Box
                    key={idx}
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <DateTimePicker
                      inputFormat="dd-MM-yyyy hh:mm:ss aa"
                      label="Date and Time"
                      value={
                        formik?.values?.quotedCallbackTimeArray?.[`${idx}`]
                          ? formik?.values?.quotedCallbackTimeArray?.[`${idx}`]
                          : ""
                      }
                      onChange={(value) => {
                        formik.setFieldValue(`[quotedCallbackTimeArray][${idx}]`, value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 300 }}
                          name={`[quotedCallbackTimeArray][${idx}]`}
                          fullWidth
                          {...params}
                          error={false}
                        />
                      )}
                    />
                    {idx == quotedTimer?.length - 1 ? (
                      <>
                        <CheckCircleIcon
                          sx={{ color: "#00FF00", cursor: "pointer" }}
                          onClick={() => {
                            if (flag == "Motor") {
                              dispatch(
                                addProposalsStatus({
                                  data: { quotedCallBackDone: true },
                                  propId: proposalId,
                                })
                              )
                                .unwrap()
                                .then((res) => {
                                  toast.success("Change the proposal status!");
                                  setCustomerQuotedCallbacked(true);
                                })
                                .catch((err) => {
                                  if (err) {
                                    toast(err, {
                                      type: "error",
                                    });
                                  }
                                });
                            }
                            if (flag == "Health") {
                              dispatch(
                                addHealthProposalsStatus({
                                  data: { quotedCallBackDone: true },
                                  propId: proposalId,
                                })
                              )
                                .unwrap()
                                .then((res) => {
                                  toast.success("Change the proposal status!");
                                  setCustomerQuotedCallbacked(true);
                                })
                                .catch((err) => {
                                  if (err) {
                                    toast(err, {
                                      type: "error",
                                    });
                                  }
                                });
                            }
                            if (flag == "Travel") {
                              dispatch(
                                addTravelProposalsStatus({
                                  data: { quotedCallBackDone: true },
                                  travelInsuranceId: proposalId,
                                })
                              )
                                .unwrap()
                                .then((res) => {
                                  toast.success("Change the proposal status!");
                                  setCustomerQuotedCallbacked(true);
                                })
                                .catch((err) => {
                                  if (err) {
                                    toast(err, {
                                      type: "error",
                                    });
                                  }
                                });
                            }
                            if (flag == "Commercials") {
                              dispatch(
                                commercialStatusChange({
                                  data: { quotedCallBackDone: true },
                                  commercialId: proposalId,
                                  url: url,
                                })
                              )
                                .unwrap()
                                .then((res) => {
                                  toast.success("Change the proposal status!");
                                  setCustomerQuotedCallbacked(true);
                                })
                                .catch((err) => {
                                  if (err) {
                                    toast(err, {
                                      type: "error",
                                    });
                                  }
                                });
                            }
                          }}
                        />
                        {!customerQuotedCallbacked && (
                          <CheckCircleIcon sx={{ color: "#8c8c8c", cursor: "pointer" }} onClick={addQuotaedTimer} />
                        )}
                      </>
                    ) : (
                      <CheckCircleIcon sx={{ color: "#8c8c8c", cursor: "pointer" }} />
                    )}
                  </Box>
                );
              })}
            </>
          )}
          {
            <Box sx={{ padding: "20px 0" }}>
              <Button type="submit" variant="contained" disabled={!!isPolicyGenerated}>
                Submit
              </Button>
            </Box>
          }
        </Box>
      </Card>
    </form>
  );
}
