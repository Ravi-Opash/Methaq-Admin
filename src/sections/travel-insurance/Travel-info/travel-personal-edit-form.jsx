import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CardActions,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { DatePicker } from "@mui/x-date-pickers";
import PhoneNumberInput from "src/components/phoneInput-field";
import { updateTravelProposalDetails } from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getTravelRelationList } from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";
import { differenceInYears, startOfDay } from "date-fns";
import { getNationalities } from "src/sections/Proposals/Action/proposalsAction";
import { dateFormate } from "src/utils/date-formate";

const TravelPersonalEditForm = ({ setLoading, HandlePersonalModalClose, proposalTravelInfo, fetchSummary }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const inref = useRef(false);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [relationList, setReletionList] = useState([]);

  const Span = styled("span")(({ theme }) => ({
    [theme.breakpoints.up("xs")]: {},
    color: "red",
  }));

  // fetch relation list
  useEffect(() => {
    if (inref.current) {
      return;
    }
    inref.current = true;
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

  // fetch nationality
  useEffect(() => {
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
  }, []);

  // formik
  const formik = useFormik({
    initialValues: {
      email: proposalTravelInfo?.[0]?.contact?.email || "",
      travellers: proposalTravelInfo || [],
    },

    // validation
    onSubmit: async (values, helpers) => {
      let travellers = [];
      values?.travellers?.map((i, idx) => {
        travellers?.push({
          travellerId: i?._id,
          dateOfBirth: i?.dateOfBirth ? dateFormate(i?.dateOfBirth) : "-",
          mobileNumber: values?.mobileNumber,
          mobile: values?.mobile,
          countryCode: values?.countryCode,
          email: values?.email,
          firstName: i?.firstName,
          lastName: i?.lastName,
          relation: i?.relation,
          nationality: i?.nationality,
          passportNumber: i?.passportNumber,
          gender: i?.gender,
          age: i?.age,
        });
      });

      const payload = {
        travellers: travellers,
      };

      // update Travel Proposal Details
      dispatch(updateTravelProposalDetails(payload))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          fetchSummary();
          toast.success("Successfully updated!");
          HandlePersonalModalClose(false);
          setLoading(true);
        })
        .catch((err) => {
          console.log(err, "err");
          setLoading(true);
          toast.error(err);
        });
    },
  });

  // calculate age
  const ageCalculationhandler = (value, index) => {
    const dob = startOfDay(new Date(value));
    const currentDate = startOfDay(new Date());
    const age = differenceInYears(currentDate, dob);
    formik.setFieldValue(`travellers[${index}].age`, age);
  };

  // phone number
  useEffect(() => {
    if (proposalTravelInfo?.[0]?.contact?.mobileNumber) {
      formik.setFieldValue("mobile", `971${proposalTravelInfo?.[0]?.contact?.mobileNumber}`);
      formik.setFieldValue("countryCode", "971");
      formik.setFieldValue("mobileNumber", proposalTravelInfo?.[0]?.contact?.mobileNumber);
    }
  }, [proposalTravelInfo?.[0]?.contact?.mobileNumber]);

  // phone number
  const handleNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

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
              ></Box>
              <Typography
                variant="subtitle1"
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
                Edit Personal Details
              </Typography>
              <Box sx={{ p: 1, px: 2 }}>
                <Grid container columnSpacing={2} rowSpacing={2}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ color: "#60176F", marginTop: "10px", fontWeight: "600", fontSize: "18px", color: "#60176F" }}
                  >
                    Traveller 1
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
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
                        First Name <Span> *</Span>
                      </Typography>
                      <TextField
                        fullWidth
                        name={`travellers[0].firstName`}
                        label="First Name"
                        value={formik?.values?.travellers?.[0]?.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.travellers?.[0]?.firstName && formik.errors.travellers?.[0]?.firstName && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.travellers?.[0]?.firstName}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                        Last Name <Span> *</Span>
                      </Typography>
                      <TextField
                        fullWidth
                        name={`travellers[0].lastName`}
                        label="Last Name"
                        value={formik?.values?.travellers?.[0]?.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.travellers?.[0]?.lastName && formik.errors.travellers?.[0]?.lastName && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.travellers?.[0]?.lastName}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                        Date of Birth <Span> *</Span>
                      </Typography>
                      <DatePicker
                        inputFormat="dd-MM-yyyy"
                        id={`travellers[0].dateOfBirth`}
                        name={`dateOfBirth`}
                        label="Date of Birth"
                        maxDate={new Date()}
                        onChange={(value) => {
                          formik.setFieldValue("travellers[0].dateOfBirth", value, true);
                          if (value != "Invalid Date" && value) {
                            ageCalculationhandler(value, 0);
                          } else {
                            formik.setFieldValue(`travellers[0].age`, "");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            name="dateOfBirth"
                            fullWidth
                            {...params}
                            error={formik.touched.dateOfBirth && !!formik.errors.travellers?.[0]?.dateOfBirth}
                          />
                        )}
                        value={formik.values.travellers?.[0]?.dateOfBirth || null}
                      />
                      {formik.touched.dateOfBirth && formik.errors.travellers?.[0]?.dateOfBirth && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.travellers?.[0]?.dateOfBirth}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <TextField
                          fullWidth
                          disabled
                          label="Age (Years)"
                          name={`travellers[0].age`}
                          value={formik.values.travellers?.[0]?.age || ""}
                          type="number"
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <TextField
                          error={Boolean(formik.touched.nationality && !!formik.errors.travellers?.[0]?.nationality)}
                          helperText={formik.touched.nationality && !!formik.errors.travellers?.[0]?.nationality}
                          fullWidth
                          label="Nationality"
                          name="travellers[0].nationality"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={formik.values.travellers?.[0]?.nationality || null}
                        >
                          <option value=""></option>
                          {nationalityOptions?.map((n) => {
                            return <option value={n}>{n}</option>;
                          })}
                        </TextField>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl component="fieldset">
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          mt={2}
                          sx={{
                            fontWeight: "700",
                            fontSize: "14px",
                            display: "inline-block",
                            color: "#707070",
                          }}
                        >
                          Gender <Span> *</Span>
                        </Typography>
                        <RadioGroup
                          row
                          aria-label={`travellers[0]?.gender`}
                          name={`travellers[0].gender`}
                          value={formik?.values?.travellers?.[0]?.gender}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabel value="Male" control={<Radio />} label="Male" />
                          <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        </RadioGroup>
                        {formik?.touched?.travellers?.[0]?.gender && formik?.errors?.travellers?.[0]?.gender && (
                          <Typography variant="caption" color="error">
                            {formik?.errors?.travellers?.[0]?.gender}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        mb={1}
                        sx={{
                          fontWeight: "700",
                          fontSize: "14px",
                          display: "inline-block",
                          color: "#707070",
                        }}
                      >
                        Mobile Number <Span> *</Span>
                      </Typography>
                      <PhoneNumberInput
                        label="Mobile Number"
                        handleMobileNumberChange={handleNumberChange}
                        formik={formik}
                        setIsError={setIsError}
                        isError={isError}
                      />
                      {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontSize: "12px",
                            display: "inline-block",
                            color: "red",
                          }}
                        >
                          {formik.errors.mobileNumber}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        mb={1}
                        sx={{
                          fontWeight: "700",
                          fontSize: "14px",
                          display: "inline-block",
                          color: "#707070",
                        }}
                      >
                        Email <Span> *</Span>
                      </Typography>
                      <TextField
                        fullWidth
                        id={`email`}
                        name={`email`}
                        label="Email"
                        value={formik?.values?.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        mt={1}
                        sx={{
                          fontWeight: "700",
                          fontSize: "14px",
                          display: "inline-block",
                          color: "#707070",
                        }}
                      >
                        Passport Number <Span> *</Span>
                      </Typography>
                      <TextField
                        fullWidth
                        id={`travellers[0]?.passportNumber`}
                        name={`travellers[0].passportNumber`}
                        label="Passport Number"
                        value={formik?.values?.travellers?.[0]?.passportNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} mt={2}>
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
                        Select Relation
                      </Typography>
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
                          name="travellers[0].relation"
                          onBlur={formik.handleBlur}
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
                  </Grid>
                </Grid>
              </Box>
              <Box>
                {formik?.values?.travellers.slice(0, formik?.values?.travellers?.length - 1).map((traveller, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{
                        color: "#60176F",
                        marginTop: "10px",
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "#60176F",
                      }}
                    >
                      Traveller {index + 2}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
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
                          Full Name <Span> *</Span>
                        </Typography>
                        <TextField
                          fullWidth
                          id={`firstName-${index + 1}`}
                          name={`travellers[${index + 1}].firstName`}
                          label="Fist Name"
                          value={formik?.values?.travellers[index + 1]?.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              fontSize: "12px",
                              display: "inline-block",
                              color: "red",
                            }}
                          >
                            {formik.errors.fullName}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
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
                          Last Name <Span> *</Span>
                        </Typography>
                        <TextField
                          fullWidth
                          id={`lastName-${index + 1}`}
                          name={`travellers[${index + 1}].lastName`}
                          label="Last Name"
                          value={formik?.values?.travellers[index + 1]?.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              fontSize: "12px",
                              display: "inline-block",
                              color: "red",
                            }}
                          >
                            {formik.errors.fullName}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                          Date of Birth <Span> *</Span>
                        </Typography>
                        <DatePicker
                          inputFormat="dd-MM-yyyy"
                          id={`dateOfBirth-${index + 1}`}
                          name={`travellers[${index + 1}].dateOfBirth`}
                          label="Date of Birth"
                          maxDate={new Date()}
                          onChange={(value) => {
                            formik.setFieldValue(`travellers[${index + 1}].dateOfBirth`, value);
                            if (value != "Invalid Date" && value) {
                              ageCalculationhandler(value, index + 1);
                            } else {
                              formik.setFieldValue(`travellers[${index + 1}].age`, "");
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              name={`travellers[${index + 1}].dateOfBirth`}
                              fullWidth
                              {...params}
                              error={
                                formik.touched[`travellers[${index + 1}].dateOfBirth`] &&
                                !!formik.errors.travellers?.[index + 1]?.dateOfBirth
                              }
                            />
                          )}
                          value={formik.values.travellers[index + 1]?.dateOfBirth || null}
                        />
                        {formik.touched[`travellers[${index + 1}].dateOfBirth`] &&
                          formik.errors.travellers?.[index + 1]?.dateOfBirth && (
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                fontSize: "12px",
                                display: "inline-block",
                                color: "red",
                              }}
                            >
                              {formik.errors.travellers?.[index + 1]?.dateOfBirth}
                            </Typography>
                          )}
                      </Grid>

                      <Grid item xs={12} md={6}>
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
                        <Box sx={{ display: "inline-block", width: "100%" }}>
                          <TextField
                            fullWidth
                            disabled
                            label="Age (Years)"
                            id={`travellers${index + 1}`}
                            name={`travellers[${index}].age`}
                            value={formik.values.travellers?.[index + 1]?.age || ""}
                            type="number"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl component="fieldset">
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            mt={2}
                            sx={{
                              fontWeight: "700",
                              fontSize: "14px",
                              display: "inline-block",
                              color: "#707070",
                            }}
                          >
                            Gender <Span> *</Span>
                          </Typography>
                          <RadioGroup
                            row
                            aria-label={`gender-${index + 1}`}
                            name={`travellers[${index + 1}].gender`}
                            value={formik?.values?.travellers[index + 1]?.gender}
                            onChange={formik.handleChange}
                          >
                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                          </RadioGroup>
                          {formik?.touched?.travellers?.[index + 1]?.gender &&
                            formik?.errors?.travellers?.[index + 1]?.gender && (
                              <Typography variant="caption" color="error">
                                {formik?.errors?.travellers[index]?.gender}
                              </Typography>
                            )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          mt={2}
                          sx={{
                            fontWeight: "700",
                            fontSize: "14px",
                            display: "inline-block",
                            color: "#707070",
                          }}
                        >
                          Passport Number <Span> *</Span>
                        </Typography>
                        <TextField
                          fullWidth
                          id={`passportNumber-${index + 1}`}
                          name={`travellers[${index + 1}].passportNumber`}
                          label="Passport Number"
                          value={formik?.values?.travellers?.[index + 1]?.passportNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
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
                              mt={1}
                              sx={{
                                fontWeight: "700",
                                fontSize: "14px",
                                display: "inline-block",
                                color: "#707070",
                              }}
                            >
                              Select Relation
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
                              label="Select Relation"
                              name={`travellers[${index + 1}].relation`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              select
                              SelectProps={{ native: true }}
                              value={formik.values.travellers?.[index + 1]?.relation}
                            >
                              <option value={""}></option>
                              {relationList?.map((ele) => {
                                return <option value={ele}>{ele}</option>;
                              })}
                            </TextField>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        <CardActions>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
            Update
          </Button>
          <Button variant="outlined" onClick={() => HandlePersonalModalClose(true)} disabled={formik.isSubmitting}>
            Cancel
          </Button>
        </CardActions>
      </form>
    </div>
  );
};

export default TravelPersonalEditForm;
