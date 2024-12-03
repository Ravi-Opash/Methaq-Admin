import { Button, CardActions, Autocomplete, Grid, TextField, Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { getTravelDestinationList } from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import { updateTravelDesinationDetails } from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import { DatePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { dateFormate } from "src/utils/date-formate";
import * as Yup from "yup";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

function editDesinationDetails({ setLoading, HandleDesinationModalClose, proposalTravelInfo, fetchSummary }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [destinationPlace, setDestination] = useState([]);
  const inref = useRef(false);

  // get destination list
  useEffect(() => {
    if (inref.current) {
      return;
    }
    inref.current = true;

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
  }, []);

  // formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      inceptionDate: proposalTravelInfo?.travelId?.inceptionDate || "",
      destination: proposalTravelInfo?.travelId?.destination || "",
      period: proposalTravelInfo?.travelId?.period || "",
    },

    validationSchema: Yup.object({
      inceptionDate: Yup.string().required("Required"),
      destination: Yup.string().required("Required"),
      period: Yup.string().required("Required"),
    }),

    // on submit
    onSubmit: async (values, helpers) => {
      const payload = {
        travelInfo: {
          ...values,
          inceptionDate: values?.inceptionDate ? dateFormate(values?.inceptionDate) : "-",
        },
      };

      const travelInfoId = proposalTravelInfo?.travelId?._id;
      dispatch(updateTravelDesinationDetails({ travelInfoId: travelInfoId, data: payload }))
        .unwrap()
        .then((res) => {
          fetchSummary();
          toast.success("Successfully updated!");
          HandleDesinationModalClose(false);
          setLoading(true);
        })
        .catch((err) => {
          console.log(err, "err");
          setLoading(true);
          toast.error(err);
        });
    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: "inline-block", width: "100%" }}>
          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            <Box sx={{ display: "inline-block", width: "100%" }}>
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
                    color: "#60176F",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: "14px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  Edit Destination Details
                </Typography>
                <Box sx={{ p: 1, px: 2 }}>
                  <Grid container columnSpacing={2} rowSpacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box>
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
                            Start Date <Span> *</Span>
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
                            label="Start Date"
                            minDate={startOfDay(addDays(new Date(), 1))}
                            onChange={(value) => {
                              formik.setFieldValue("inceptionDate", value, true);
                            }}
                            renderInput={(params) => (
                              <TextField name="inceptionDate" fullWidth {...params} error={false} />
                            )}
                            value={formik.values.inceptionDate}
                          />

                          {formik.touched.inceptionDate && formik.errors.inceptionDate && (
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
                      </Box>
                      <Grid item xs={12} md={6}></Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "inline-block", width: "100%" }}>
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
                            Destination <Span> *</Span>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
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
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "inline-block", width: "100%" }}>
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
                            Period <Span> *</Span>
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
                            error={Boolean(formik.touched.period && formik.errors.period)}
                            helperText={formik.touched.period && formik.errors.period}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.period}
                            InputProps={{ inputProps: { min: 1 } }}
                            label="Period"
                            name="period"
                            type="Number"
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <CardActions
          sx={{
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "end",
          }}
        >
          <Button disabled={formik.isSubmitting} type="submit" variant="contained">
            Update
          </Button>
          <Button
            onClick={() => HandleDesinationModalClose(true)}
            component="a"
            disabled={formik.isSubmitting}
            sx={{
              m: 1,
              mr: "auto",
            }}
            variant="outlined"
          >
            Cancel
          </Button>
        </CardActions>
      </form>
    </div>
  );
}

export default editDesinationDetails;
