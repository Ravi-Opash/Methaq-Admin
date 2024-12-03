import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { updateHealthLeadDetailsById } from "../Leads/Action/healthInsuranceLeadAction";
import { DatePicker } from "@mui/x-date-pickers";
import PhoneNumberInput from "src/components/phoneInput-field";
import { getNationalities } from "src/sections/Proposals/Action/proposalsAction";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { JavascriptRounded } from "@mui/icons-material";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));
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
const preferredCoPayList = [
  { label: "0%", value: "0" },
  { label: "10%", value: "10" },
  { label: "15%", value: "15" },
  { label: "20%", value: "20" },
  { label: "30%", value: "30" },
];
export const hospitalList = [
  {
    NAME: "BURJEEL HOSPITALS LLC - Abu Dhabi",
  },
  {
    NAME: "BURJEEL DAY SURGERY CENTER LLC / ALREEM - Abu Dhabi",
  },
  {
    NAME: "MEDICLINIC HOSPITAL L.L.C. / Airport road - Abu Dhabi",
  },
  {
    NAME: "MEDICLINIC HOSPITAL L.L.C. / Khalifa Street - Abu Dhabi",
  },
  {
    NAME: "CLEVELAND CLINIC ABU DHABI LLC - Abu Dhabi",
  },
  {
    NAME: "MEDEOR 24X7 HOSPITAL LLC - Abu Dhabi",
  },
  {
    NAME: "SAUDI GERMAN HOSPITAL - Duabi",
  },
  {
    NAME: "AMERICAN HOSPITAL - Duabi",
  },
  {
    NAME: "AL JALILA CHILDREN'S SPECIALTY HOSPITAL - Duabi",
  },
  {
    NAME: "Medcare Hospitals - Duabi",
  },
  {
    NAME: "DR.SULAIMAN AL HABIB HOSPITAL - Duabi",
  },
  {
    NAME: "IRANIAN HOSPITAL - Duabi",
  },
  {
    NAME: "AL ZAHRA HOSPITAL - Duabi",
  },
  {
    NAME: "SAUDI GERMAN HOSPITAL - Ajman",
  },
  {
    NAME: "EMIRATES HOSPITAL - Duabi",
  },
  {
    NAME: "Aster Clinics",
  },
  {
    NAME: "ZULEKHA HOSPITAL - Sharjah",
  },
  {
    NAME: "SUNNY SHARQAN MEDICAL CENTRE LLC - Sharjah",
  },
  {
    NAME: "ZAHRAWI HOSPITAL - RAK",
  },
  {
    NAME: "THUMBAY HOSPITAL LLC",
  },
];
const salaries = ["Up to 4000", "4000 - 12000", "12000+"];
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

function PreferanceInfoEditModal({
  setLoading,
  HandlePreferanceModalClose,
  healthInfo,
  fetchSummary,
  setConfirmPopup,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { proposalId } = router.query;
  const [isError, setIsError] = useState(false);
  const [nationalityList, setNationalityList] = useState([]);
  const inref = useRef(false);
  console.log(healthInfo?.preferenceDetails?.opticalCoverage?.toString() == "true" ? true : false, "preferredCoPay");
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      preferredCoPay: healthInfo?.preferenceDetails?.preferredCoPay || "",
      dentalCoverage: healthInfo?.preferenceDetails?.dentalCoverage || false,
      opticalCoverage: healthInfo?.preferenceDetails?.opticalCoverage || false,
    },

    // validationSchema: schema,

    onSubmit: async (values, helpers) => {
      const payload = {
        ...values,
        preferenceDetails: {
          preferredCoPay: values?.preferredCoPay,
          dentalCoverage: values?.dentalCoverage,
          opticalCoverage: values?.opticalCoverage,
        },
      };

      setLoading(false);
      dispatch(updateHealthLeadDetailsById({ id: healthInfo?._id, data: payload }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          fetchSummary();
          toast.success("Successfully updated!");
          setLoading(true);
          HandlePreferanceModalClose(false);
          setConfirmPopup(true);
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
      {" "}
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
                  Edit Preferance Details
                </Typography>
                <Box sx={{ p: 1, px: 2 }}>
                  <Grid container columnSpacing={2} rowSpacing={2}>
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
                            Preferred Co Pay
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <FormControl
                            fullWidth
                            sx={{
                              "& label.Mui-focused": {
                                color: "#60176F",
                              },
                            }}
                          >
                            <InputLabel
                              sx={{
                                transform: "translate(12px, 20px) scale(1)",
                                background: "#FFF",
                                padding: "0 4px",
                              }}
                              id="demo-multiple-chip-label"
                            >
                              Preferred Co Pay
                            </InputLabel>
                            <Select
                              labelId="demo-multiple-chip-label"
                              id="demo-multiple-chip"
                              name="preferredCoPay"
                              multiple
                              fullWidth
                              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                              value={formik.values.preferredCoPay || []}
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
                              {preferredCoPayList.map((h) => {
                                return <MenuItem value={h?.value}>{h?.label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
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
                            Dental Coverage
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "inline-block",
                            width: "100%",
                            marginTop: "5px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              width: "100%",
                            }}
                          >
                            <FormControlLabel
                              control={<Checkbox checked={formik.values.dentalCoverage} />}
                              label="Dental Coverage"
                              name="dentalCoverage"
                              onChange={formik.handleChange}
                            />
                            <FormControlLabel
                              control={<Checkbox checked={formik.values.opticalCoverage} />}
                              name="opticalCoverage"
                              label="Optical Coverage"
                              onChange={formik.handleChange}
                            />
                          </Box>
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
            onClick={() => HandlePreferanceModalClose(true)}
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

export default PreferanceInfoEditModal;
