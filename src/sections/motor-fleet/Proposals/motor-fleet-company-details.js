import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  List,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { useFormik } from "formik";
import React, { useState } from "react";
import { EditIcon } from "src/Icons/EditIcon";
import ListItemComp from "src/components/ListItemComp";
import PhoneNumberInput from "src/components/phoneInput-field";
import * as Yup from "yup";
import { getfleetdetails, updateFleetDetails } from "./Action/motorFleetProposalsAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const proposerEm = ["Abu Dhabi", "Ajman", "Fujairah", "Sharjah", "Dubai", "Ras Al Khaimah", "Umm Al Quwain"];

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

function MotorFleetCompanyDetails({ fleetDetail }) {
  const dispatch = useDispatch();
  const [editCompanyDetails, setEditCompanyDetails] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [ownerId, setOwnerId] = useState([1]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: fleetDetail ? fleetDetail?.companyName : "",
      email: fleetDetail ? fleetDetail?.email : "",
      emiratesOfCompany: fleetDetail ? fleetDetail?.emiratesOfCompany : "",
      currentInsurer: fleetDetail ? fleetDetail?.currentInsurer : "",
      tcfNumber: fleetDetail ? fleetDetail?.tcfNumber : "",
      mobileNumber: fleetDetail?.mobileNumber ? `${fleetDetail?.mobileNumber}` : "",
      mobile:
        fleetDetail?.mobileNumber && fleetDetail?.countryCode
          ? `${fleetDetail?.countryCode}${fleetDetail?.mobileNumber}`
          : "",
      countryCode: `${fleetDetail?.countryCode}` ? `${fleetDetail?.countryCode}` : "971",
    },

    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      email: Yup.string().required("email is required"),
      emiratesOfCompany: Yup.string().required("emirates of company is required"),
      mobileNumber: Yup.mixed().required("Mobile number file is required"),
      currentInsurer: Yup.mixed().required("current insurer is required"),
      tcfNumber: Yup.mixed().required("TCF number file is required"),
    }),

    onSubmit: async (values, helpers) => {
      // console.log(values , "values")
      setIsLoading(true);
      const formData = jsonToFormData(values);

      dispatch(
        updateFleetDetails({
          id: fleetDetail?._id,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          dispatch(getfleetdetails({ id: fleetDetail?.proposalId }));
          toast.success("uploaded successfully");
          setIsLoading(false);
          setEditCompanyDetails(false);
        })
        .catch((err) => {
          console.log(err, "err");
          setIsLoading(false);
          toast.error(err);
        });
    },
  });

  const handleMobileNumberChange = (mobile, countryCode, mobileNumber) => {
    setIsError(false);
    formik.setFieldValue("mobile", mobile);
    formik.setFieldValue("countryCode", countryCode);
    formik.setFieldValue("mobileNumber", mobileNumber);
  };

  const addPerson = () => {
    const array = ownerId;
    array.push(1);
    setOwnerId([...array]);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={isLoading}>
          <CircularProgress sx={{ color: "#60176F" }} />
        </Backdrop>
      )}
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderRadius: "10px",
          mt: 3,
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#60176F",
            px: "14px",
            borderRadius: "10px 10px 0 0",
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
            }}
          >
            Corporate Company Details
          </Typography>
          <EditIcon onClick={() => setEditCompanyDetails(true)} sx={{ fontSize: 30, cursor: "pointer" }} />
        </Box>

        <Grid container columnSpacing={8}>
          <Grid item xs={12} sm={12}>
            <List sx={{ py: 0 }}>
              <Grid container>
                <Grid item xs={12} md={6} columnSpacing={4}>
                  {editCompanyDetails ? (
                    <Box sx={{ p: 1.5 }}>
                      <TextField
                        error={Boolean(formik.touched?.companyName && formik.errors?.companyName)}
                        fullWidth
                        helperText={formik.touched?.companyName && formik.errors?.companyName}
                        label="Company Name"
                        name="companyName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.companyName}
                      />
                    </Box>
                  ) : (
                    <ListItemComp isCopy={true} label={"Company Name"} value={fleetDetail?.companyName} />
                  )}
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6} columnSpacing={4}>
                  {editCompanyDetails ? (
                    <Box sx={{ p: 1.5 }}>
                      <TextField
                        error={Boolean(formik.touched?.email && formik.errors?.email)}
                        fullWidth
                        helperText={formik.touched?.email && formik.errors?.email}
                        label="Email address"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.email}
                        type="email"
                      />
                    </Box>
                  ) : (
                    <ListItemComp isCopy={true} label={"Email"} value={fleetDetail?.email} />
                  )}
                </Grid>
              </Grid>

              <Divider />

              <Grid container>
                <Grid item xs={12} md={6} columnSpacing={4}>
                  {editCompanyDetails ? (
                    <Box sx={{ p: 1.5 }}>
                      <PhoneNumberInput
                        handleMobileNumberChange={handleMobileNumberChange}
                        formik={formik}
                        setIsError={setIsError}
                        isError={isError}
                      />
                    </Box>
                  ) : (
                    <ListItemComp isCopy={true} label={"Mobile Number"} value={fleetDetail?.mobileNumber} />
                  )}
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6} columnSpacing={4}>
                  {editCompanyDetails ? (
                    <Box sx={{ p: 1.5 }}>
                      <TextField
                        error={Boolean(formik.touched.emiratesOfCompany && formik.errors.emiratesOfCompany)}
                        helperText={formik.touched.emiratesOfCompany && formik.errors.emiratesOfCompany}
                        fullWidth
                        label="Emirates of Company"
                        name="emiratesOfCompany"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.emiratesOfCompany}
                      >
                        <option value=""></option>
                        {proposerEm?.map((i) => (
                          <option value={i}>{i}</option>
                        ))}
                      </TextField>
                    </Box>
                  ) : (
                    <ListItemComp isCopy={true} label={"Emirates of Company"} value={fleetDetail?.emiratesOfCompany} />
                  )}
                  <DividerCustom />
                </Grid>
              </Grid>

              <Divider />
              <Grid container>
                <Grid item xs={12} md={6} columnSpacing={4}>
                  {editCompanyDetails ? (
                    <Box sx={{ p: 1.5 }}>
                      <TextField
                        error={Boolean(formik.touched.currentInsurer && formik.errors.currentInsurer)}
                        helperText={formik.touched.currentInsurer && formik.errors.currentInsurer}
                        fullWidth
                        label="Who is your current insurer"
                        name="currentInsurer"
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
                  ) : (
                    <ListItemComp
                      isCopy={true}
                      label={"Who is your current insurer"}
                      value={fleetDetail?.currentInsurer}
                    />
                  )}
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6} columnSpacing={4}>
                  {editCompanyDetails ? (
                    <Box sx={{ p: 1.5 }}>
                      <TextField
                        error={Boolean(formik.touched?.tcfNumber && formik.errors?.tcfNumber)}
                        fullWidth
                        helperText={formik.touched?.tcfNumber && formik.errors?.tcfNumber}
                        label="TC Number"
                        name="tcfNumber"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.tcfNumber}
                        type="number"
                      />
                    </Box>
                  ) : (
                    <ListItemComp isCopy={true} label={"TC Number"} value={fleetDetail?.tcfNumber} />
                  )}
                  <DividerCustom />
                </Grid>
              </Grid>
              <Divider />
            </List>
          </Grid>
          {editCompanyDetails && (
            <Grid item xs={12} sm={12}>
              <Box sx={{ p: 2, width: "100%", display: "flex", justifyContent: "end", gap: 2 }}>
                <Button
                  sx={{ fontSize: "12px", minWidth: 100 }}
                  variant="outlined"
                  type="button"
                  onClick={() => setEditCompanyDetails(false)}
                >
                  Cancel
                </Button>
                <Button sx={{ fontSize: "12px", minWidth: 100 }} type="submit" variant="contained">
                  Submit
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      {/* <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
          mb: 3,
          mt: 3,
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
            Other Id
          </Typography>
          <Box sx={{ display: "flex", gap: 1, pr: 2 }}>
            <AddCircleIcon onClick={() => addPerson()} sx={{ color: "#60176F" }} />
          </Box>
        </Box>

        <Grid container columnSpacing={4} sx={{ mt: 2 }}>
          <>
            {ownerId?.map((ele, index) => {
              return (
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
                                Owner's Id
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={9}>
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              <TextField
                                error={Boolean(formik.touched.ownerIds && formik.errors.ownerIds)}
                                fullWidth
                                helperText={formik.touched.ownerIds && formik.errors.ownerIds}
                                label="Owner's Id"
                                type="number"
                                name={`ownerIds`}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.ownerIds}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              );
            })}
          </>
        </Grid>
      </Box> */}
    </form>
  );
}

export default MotorFleetCompanyDetails;
