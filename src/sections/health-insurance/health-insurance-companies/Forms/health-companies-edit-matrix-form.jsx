import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  addNewHealthInsuranceCompanyMatrix,
  updateHealthInsuranceCompanyMatrixById,
} from "../Action/healthinsuranceCompanyAction";

let items = [
  "all",
  "Self",
  "Self (Investor)",
  "Self and Dependent",
  "Dependent only",
  "Self (Investor) and Dependent",
  "Investor’s Dependent only",
  "Parent",
  "Domestic worker",
];

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

const HealthInsuranceCompanyMatrixEditForm = () => {
  const dispatch = useDispatch();
  const { healthInsuranceCompanyMatrixDetails } = useSelector((state) => state.healthInsuranceCompany);
  const router = useRouter();
  const { companyId, tpaId, networkId, cityId, planId, matrixId } = router.query;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      visaType: healthInsuranceCompanyMatrixDetails ? healthInsuranceCompanyMatrixDetails?.visaType : ["all"],
      ageFrom: healthInsuranceCompanyMatrixDetails ? healthInsuranceCompanyMatrixDetails?.ageFrom : "",
      ageTo: healthInsuranceCompanyMatrixDetails ? healthInsuranceCompanyMatrixDetails?.ageTo : "",
      gender: healthInsuranceCompanyMatrixDetails?.gender ? healthInsuranceCompanyMatrixDetails?.gender : "all",
      relation: healthInsuranceCompanyMatrixDetails?.relation ? healthInsuranceCompanyMatrixDetails?.relation : "",
      // maritalStatus: healthInsuranceCompanyMatrixDetails
      //   ? healthInsuranceCompanyMatrixDetails?.maritalStatus
      //   : "",
      salaryFrom: healthInsuranceCompanyMatrixDetails ? healthInsuranceCompanyMatrixDetails?.salaryFrom : "",
      salaryTo: healthInsuranceCompanyMatrixDetails ? healthInsuranceCompanyMatrixDetails?.salaryTo : "",
      premium: healthInsuranceCompanyMatrixDetails ? healthInsuranceCompanyMatrixDetails?.premium : "",
      maternityAmount: healthInsuranceCompanyMatrixDetails ? healthInsuranceCompanyMatrixDetails?.maternityAmount : 0,
      // isMaternity: healthInsuranceCompanyMatrixDetails
      //   ? healthInsuranceCompanyMatrixDetails?.isMaternity
      //   : false,
    },

    validationSchema: Yup.object({
      visaType: matrixId
        ? Yup.string().required("Visa type is required")
        : Yup.array().required("Visa type is required"),
      // ageFrom: Yup.number().required("Age from year is required"),
      // ageTo: Yup.number().required("Age to year is required"),
      gender: Yup.string().required("Gender is required"),
      // maritalStatus: Yup.string().required("Marital status is required"),
      // salaryFrom: Yup.number().required("Salaray from amount is required"),
      // salaryTo: Yup.number().required("Salary to amount is required"),
      premium: Yup.number().required("Premium is required"),
    }),

    onSubmit: (values, helpers) => {
      // console.log("values", values);
      const payload = {
        visaType: values?.visaType,
        ageFrom: values?.ageFrom || 0,
        ageTo: values?.ageTo || 99,
        gender: values?.gender,
        relation: values?.relation,
        salaryFrom: values?.salaryFrom || 0,
        salaryTo: values?.salaryTo || 9999999,
        premium: values?.premium,
        maternityAmount: values?.maternityAmount,
      };
      if (matrixId) {
        dispatch(
          updateHealthInsuranceCompanyMatrixById({
            id: matrixId,
            data: payload,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push(
                `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${planId}/matrix`
              );
              toast("Successfully Edited", {
                type: "success",
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
      } else {
        dispatch(
          addNewHealthInsuranceCompanyMatrix({
            ...payload,
            plan: planId,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(
                `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${planId}/matrix`
              );
              toast("Successfully Created", {
                type: "success",
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
      }
    },
  });
  const ITEM_HEIGHT = 40;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              {matrixId && (
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.visaType && formik.errors.visaType)}
                    helperText={formik.touched.visaType && formik.errors.visaType}
                    fullWidth
                    label="Visa Type"
                    name="visaType"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={formik.values.visaType}
                  >
                    <option value="all">All</option>
                    <option value="Self"> Self </option>
                    <option value="Self (Investor)"> Self (Investor)</option>
                    <option value="Self and Dependent"> Self and Dependent</option>
                    <option value="Self (Investor) and Dependent">Self (Investor) and Dependent</option>
                    <option value="Dependent only"> Dependent only </option>
                    <option value="Investor’s Dependent only">Investor’s Dependent only</option>
                    <option value="Parent"> Parent </option>
                    <option value="Domestic worker"> Domestic worker </option>
                  </TextField>
                </Grid>
              )}
              {!matrixId && (
                <Grid item md={6} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        transform: "translate(12px, 20px) scale(1)",
                        background: "#FFF",
                        padding: "0 5px",
                      }}
                      id="demo-multiple-chip-label"
                    >
                      Visa Type
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      name="visaType"
                      label={"Visa Type"}
                      multiple
                      fullWidth
                      error={Boolean(formik.touched.visaType && formik.errors.visaType)}
                      helperText={formik.touched.visaType && formik.errors.visaType}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      value={formik.values.visaType}
                      onChange={(e) => {
                        const { value } = e.target;
                        // console.log(value, "dd");
                        if (value.includes("all") && value[value?.length - 1] == "all") {
                          formik.setFieldValue("visaType", ["all"]);
                        } else {
                          if (value.includes("all")) {
                            const arr = value.filter((d) => d !== "all");
                            formik.setFieldValue("visaType", arr || []);
                          } else {
                            formik.setFieldValue("visaType", value);
                          }
                        }
                      }}
                      MenuProps={{
                        ...MenuProps,
                        PaperProps: {
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                            width: 250,
                          },
                        },
                      }}
                      renderValue={(selected) => {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {(selected || []).map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        );
                      }}
                    >
                      {items?.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.premium && formik.errors.premium)}
                  fullWidth
                  helperText={formik.touched.premium && formik.errors.premium}
                  label="Premium"
                  name="premium"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.premium}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{"AED"}</InputAdornment>,
                  }}
                />
              </Grid>
              {/* <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(
                    formik.touched.maritalStatus && formik.errors.maritalStatus
                  )}
                  helperText={
                    formik.touched.maritalStatus && formik.errors.maritalStatus
                  }
                  fullWidth
                  label="Marital status"
                  name="maritalStatus"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.maritalStatus}
                >
                  <option value=""></option>
                  <option value="Married"> Married </option>
                  <option value="Single"> Single </option>
                  <option value="Divorced"> Divorced </option>
                  <option value="Widow"> Widow </option>
                </TextField>
              </Grid> */}
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.ageFrom && formik.errors.ageFrom)}
                  fullWidth
                  helperText={formik.touched.ageFrom && formik.errors.ageFrom}
                  label="From Age"
                  name="ageFrom"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.ageFrom}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{"Year"}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.ageTo && formik.errors.ageTo)}
                  fullWidth
                  helperText={formik.touched.ageTo && formik.errors.ageTo}
                  label="To Age"
                  name="ageTo"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.ageTo}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{"Year"}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.salaryFrom && formik.errors.salaryFrom)}
                  fullWidth
                  helperText={formik.touched.salaryFrom && formik.errors.salaryFrom}
                  label="From Salary"
                  name="salaryFrom"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.salaryFrom}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{"AED"}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  error={Boolean(formik.touched.salaryTo && formik.errors.salaryTo)}
                  fullWidth
                  helperText={formik.touched.salaryTo && formik.errors.salaryTo}
                  label="To Salaray"
                  name="salaryTo"
                  type="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.salaryTo}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{"AED"}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#707070" }}>Gender</Typography>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="gender"
                    value={formik?.values?.gender}
                    onChange={formik.handleChange}
                    onBlur={formik?.handleBlur}
                  >
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel
                      value="all"
                      control={
                        <Radio
                          onChange={() => {
                            formik.setFieldValue("relation", "");
                          }}
                        />
                      }
                      label="All"
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
              {matrixId ? (
                <>
                  {formik?.values?.visaType !== "Self" &&
                    formik?.values?.visaType !== "Self (Investor)" &&
                    formik?.values?.visaType !== "Domestic worker" &&
                    formik.values.gender !== "all" && (
                      <>
                        <Grid item md={6} xs={12}>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "cemter" }}>
                            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#707070" }}>
                              Relation
                            </Typography>
                            <Tooltip title={"Don`t fill any if apply to all"}>
                              <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                            </Tooltip>
                          </Box>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="relation"
                              value={formik?.values?.relation}
                              onChange={formik.handleChange}
                              onBlur={formik?.handleBlur}
                            >
                              {formik?.values?.gender === "Male" && (
                                <>
                                  <FormControlLabel value="Son" control={<Radio />} label="Son" />
                                  <FormControlLabel value="Husband" control={<Radio />} label="Husband" />
                                  <FormControlLabel value="Father" control={<Radio />} label="Father" />
                                </>
                              )}
                              {formik?.values?.gender === "Female" && (
                                <>
                                  <FormControlLabel value="Daughter" control={<Radio />} label="Daughter" />
                                  <FormControlLabel value="Wife" control={<Radio />} label="Wife" />
                                  <FormControlLabel value="Mother" control={<Radio />} label="Mother" />
                                </>
                              )}
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                </>
              ) : (
                <>
                  {formik?.values.visaType?.includes("Self") === false &&
                    formik?.values.visaType?.includes("Self (Investor)") === false &&
                    formik?.values.visaType?.includes("Domestic worker") === false &&
                    formik.values.gender !== "all" && (
                      <>
                        <Grid item md={6} xs={12}>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "cemter" }}>
                            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#707070" }}>
                              Relation
                            </Typography>
                            <Tooltip title={"Don`t fill any if apply to all"}>
                              <InfoIcon sx={{ color: "#7B2281", fontSize: "18px", mt: "2px", cursor: "pointer" }} />
                            </Tooltip>
                          </Box>
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="relation"
                              value={formik?.values?.relation}
                              onChange={formik.handleChange}
                              onBlur={formik?.handleBlur}
                            >
                              {formik?.values?.gender === "Male" && (
                                <>
                                  <FormControlLabel value="Son" control={<Radio />} label="Son" />
                                  <FormControlLabel value="Husband" control={<Radio />} label="Husband" />
                                  <FormControlLabel value="Father" control={<Radio />} label="Father" />
                                </>
                              )}
                              {formik?.values?.gender === "Female" && (
                                <>
                                  <FormControlLabel value="Daughter" control={<Radio />} label="Daughter" />
                                  <FormControlLabel value="Wife" control={<Radio />} label="Wife" />
                                  <FormControlLabel value="Mother" control={<Radio />} label="Mother" />
                                </>
                              )}
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                </>
              )}
              {(formik?.values?.gender === "Female" || formik?.values?.gender === "all") && (
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.maternityAmount && formik.errors.maternityAmount)}
                    fullWidth
                    helperText={formik.touched.maternityAmount && formik.errors.maternityAmount}
                    label="Maternity Premium"
                    name="maternityAmount"
                    type="number"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.maternityAmount}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{"AED"}</InputAdornment>,
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            mx: -1,
            mb: -1,
            mt: 3,
          }}
        >
          <NextLink
            href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${planId}/matrix`}
            passHref
          >
            <Button sx={{ m: 1 }} variant="outlined">
              Cancel
            </Button>
          </NextLink>

          <Button sx={{ m: 1 }} type="submit" variant="contained" disabled={formik?.isSubmitting}>
            {matrixId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default HealthInsuranceCompanyMatrixEditForm;
