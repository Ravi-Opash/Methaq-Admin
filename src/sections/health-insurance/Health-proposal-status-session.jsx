import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { addHealthProposalsStatus } from "./Proposals/Action/healthInsuranceAction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DateTimePicker } from "@mui/x-date-pickers";
import { addMinutes } from "date-fns";
import { getNotificationNumbers } from "../overview/action/overviewAction";
import { setNotificationNumber } from "../overview/reducer/overviewSlice";

// Define options for reasons based on the proposal status
const customer_Contacted_subOption = ["Quoted", "Didn’t pick up", "Asked for discount", "Requested a call back later"];
const insurance_Company_subOption = [
  "NON GCC",
  "New license",
  "Requesting further discount",
  "Further information requested.",
];
const lost_subOption = [
  "Fake inquiry",
  "Couldn’t meet CX premium expectation",
  "Loss of follow up – Late action",
  "Duplicate Proposal",
  "Just a query",
  "Not Interested in purchasing",
  "Already Purchased",
  "Wrong Number",
];

export default function HealthProposalStatusSession({
  proposalId,
  items,
  fetchProposalSummary,
  isPolicyGenerated,
  policyIssued,
}) {
  const dispatch = useDispatch();
  const [showInputField, setShowInputField] = useState(false);
  const [showCalendars, setShowCalendars] = useState(false);
  const [showQuotedCalendars, setShowQuotedCalendars] = useState(false);
  const [subOption, setSubOption] = useState([]);
  const [timer, setTimer] = useState([1]);
  const [quotedTimer, setQuotedTimer] = useState([1]);
  const [customerQuotedCallbacked, setCustomerQuotedCallbacked] = useState(items?.quotedCallBackDone || false);
  const [customerCallbacked, setCustomerCallbacked] = useState(items?.callBackDone || false);

  // Default callback times
  let obj = {
    callbackTimeArray: items?.callbackTimeArray?.length > 0 ? items?.callbackTimeArray : [addMinutes(new Date(), 60)],
    quotedCallbackTimeArray:
      items?.quotedCallbackTimeArray?.length > 0 ? items?.quotedCallbackTimeArray : [addMinutes(new Date(), 120)],
  };

  // Formik initialization with validation and submission logic
  const formik = useFormik({
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
            value === "Customer Picked" ||
            value === "Document Requested" ||
            value === "Customer Didn't picked up",
          then: (schema) => Yup.string(),
          otherwise: (schema) => Yup.string().required("Required"),
        }),
    }),
    onSubmit: async (values, helpers) => {
      // Transform callback times to ISO string format
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
        callbackTimeArray: dateArr,
        callbackTime: dateArr[dateArr?.length - 1],
        proposalStatus: values?.proposalStatus,
        reason: values?.reason || null,
        quotedCallbackTimeArray: dateArr2,
        quotedCallbackTime: dateArr2[dateArr2?.length - 1],
      };

      // Dispatch action to update proposal status
      dispatch(
        addHealthProposalsStatus({
          data: payload,
          healthInsuranceId: proposalId,
        })
      )
        .unwrap()
        .then((res) => {
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
    },
  });

  // Handle reason-based visibility for calendar inputs
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

  // Logic to show/hide input fields based on proposal status
  useEffect(() => {
    if (
      formik.values.proposalStatus === "Un Attended" ||
      formik.values.proposalStatus === "Quote generated" ||
      formik.values.proposalStatus === "Customer Picked" ||
      formik.values.proposalStatus === "Document Requested" ||
      formik.values.proposalStatus === "Customer Didn't picked up"
    ) {
      setShowInputField(false);
      setShowCalendars(false);
      formik.setFieldValue("reason", "");
    } else {
      setShowInputField(true);
      formik.setFieldValue("reason", "");
      if (formik.values.proposalStatus === "Customer contacted") {
        setSubOption(customer_Contacted_subOption);
      } else if (formik.values.proposalStatus === "Referred to insurance company") {
        setSubOption(insurance_Company_subOption);
      } else if (formik.values.proposalStatus === "Lost") {
        setSubOption(lost_subOption);
        setShowCalendars(false);
      } else if (
        formik.values.proposalStatus === "Policy paid and Issued" ||
        formik.values.proposalStatus === "Policy paid and Pending issue"
      ) {
        setShowInputField(false);
      }
    }
  }, [formik.values.proposalStatus]);

  // Handle updates to reason field from existing items
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

  // Handle automatic status change if policy is generated and issued
  useEffect(() => {
    if (isPolicyGenerated && policyIssued) {
      formik.setFieldValue("proposalStatus", "Policy paid and Issued");
      setShowInputField(false);
    } else if (isPolicyGenerated) {
      formik.setFieldValue("proposalStatus", "Policy paid and Pending issue");
      setShowInputField(false);
    }
  }, [policyIssued, isPolicyGenerated]);

  // Add new callback timer for customer contact
  const addTimer = () => {
    const array = timer;
    array.push(1);
    setTimer([...array]);
    formik.setFieldValue(`[callbackTimeArray][${array?.length - 1}]`, addMinutes(new Date(), 60));
  };

  // Add new callback timer for quoted status
  const addQuotaedTimer = () => {
    const array = quotedTimer;
    array.push(1);
    setQuotedTimer([...array]);
    formik.setFieldValue(`[quotedCallbackTimeArray][${array?.length - 1}]`, addMinutes(new Date(), 120));
  };

  // Update timer state based on callback time array changes
  useEffect(() => {
    if (formik?.values?.callbackTimeArray?.length > 0) {
      const array = [];
      for (let i = 0; i < formik?.values?.callbackTimeArray?.length; i++) {
        array.push(1);
      }
      setTimer([...array]);
    }
  }, [formik?.values?.callbackTimeArray?.length]);

  // Update quoted timer state based on quoted callback time array changes
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
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderRadius: "10px",
          mb: 3,
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
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
          Status
        </Typography>

        <Box sx={{ padding: "10px" }}>
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

          {/* Display calendar for callbacks based on reason */}
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

          {/* Display quoted calendar for callback times */}
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

          {/* Submit Button */}
          <Box sx={{ padding: "20px 0" }}>
            <Button type="submit" variant="contained" disabled={!!isPolicyGenerated}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
}
