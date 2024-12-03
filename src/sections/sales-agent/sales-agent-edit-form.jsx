import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { toast } from "react-toastify";
import { VisibilityOffIcon } from "src/Icons/VisibilityOffIcon";
import { VisibilityIcon } from "src/Icons/VisibilityIcon";
import ModalComp from "src/components/modalComp";
import { Stack } from "@mui/system";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Scrollbar } from "src/components/scrollbar";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { addNewSalesAdmin, updateSalesAdminById } from "./action/salesAdminAction";
import AnimationLoader from "src/components/amimated-loader";

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
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

const SalesAgentEditForm = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [statusChange, setIsStatusChange] = useState("Motor Insurance");
  const [isAggentRoll, setIsAgnetRoll] = useState("");
  const { salesAdminDetail } = useSelector((state) => state.salesAdmins);
  const handleIsClose = () => {
    setIsOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  const { agentId } = router.query;
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: salesAdminDetail?.userId?.fullName || "",
      mobileNumber: salesAdminDetail?.userId?.mobileNumber || "",
      email: salesAdminDetail?.userId?.email || "",
      motorInsurance: salesAdminDetail?.motorInsurance || {},
    },
    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      fullName: Yup.string().required("Agent name is required"),
      // contactNo: Yup.string()
      //   // .matches(/^(50|51|52|55|56|58|2|3|4|6|7|9)\d{9}$/, "Contact number is not valid")
      //   .required("Contact number is required"),
      email: Yup.string().email().required("Agent email is required"),
    }),

    onSubmit: (values) => {
      // console.log("values", values);
      if (agentId) {
        dispatch(updateSalesAdminById({ id: agentId, data: values }))
          .unwrap()
          .then((res) => {
            toast?.success(res?.message || "Agent successfully created");
            router.push("/sales-agent");
          })
          .catch((err) => {
            console.log(err, "err");
            toast.error(err);
          });
      } else {
        dispatch(addNewSalesAdmin(values))
          .unwrap()
          .then((res) => {
            toast?.success(res?.message || "Agent successfully created");
            router.push("/sales-agent");
          })
          .catch((err) => {
            console.log(err, "err");
            toast.error(err);
          });
      }
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      if (document.getElementById(Object.keys(formik.errors)[0]))
        document.getElementById(Object.keys(formik.errors)[0]).focus();
    }
  }, [formik]);

  return (
    <>
      {loading ? (
        <AnimationLoader open={true} />
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontSize: "22px", width: "180px" }}>
                  Personal Info
                </Typography>
                <Box
                  sx={{
                    width: "-webkit-fill-available",
                    borderBottom: "1px solid #B2B2B2",
                  }}
                ></Box>
              </Box>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(formik.touched.fullName && formik.errors.fullName)}
                    fullWidth
                    helperText={formik.touched.fullName && formik.errors.fullName}
                    label="Agent Name"
                    name="fullName"
                    id="fullName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.fullName}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  {" "}
                  <Box>
                    <TextField
                      error={Boolean(formik.touched.email && formik.errors.email)}
                      fullWidth
                      helperText={formik.touched.email && formik.errors.email}
                      label="Agent Email"
                      name="email"
                      id="email"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      type="email"
                    />
                  </Box>
                </Grid>
                <Grid item md={6} xs={12}>
                  {" "}
                  <Box>
                    <TextField
                      error={Boolean(formik.touched.mobileNumber && formik.errors.mobileNumber)}
                      fullWidth
                      helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                      label="Contact No"
                      name="mobileNumber"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="number"
                      value={formik.values.mobileNumber}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 4,
                }}
              >
                <Typography variant="h6" sx={{ fontSize: "22px", mb: 2, width: "190px" }}>
                  Insurance Info
                </Typography>
                <Box
                  sx={{
                    width: "-webkit-fill-available",
                    borderTop: "1px solid #B2B2B2",
                  }}
                ></Box>
              </Box>
              <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, mt: 1 }}>
                <Chip
                  icon={<DirectionsCarIcon color="white" />}
                  label="Motor"
                  sx={{
                    height: 40,
                    borderRadius: 20,
                    fontWeight: 600,
                    backgroundColor: statusChange == "Motor Insurance" ? "#60176F" : "#60176F20",
                    color: statusChange == "Motor Insurance" ? "white" : "#60176F",
                    padding: "10px",
                    "&:hover": {
                      backgroundColor: statusChange == "Motor Insurance" ? "#60176F80" : "#60176F30",
                    },
                  }}
                  onClick={() => {
                    setIsStatusChange("Motor Insurance");
                  }}
                />
                <Chip
                  icon={<LocalHospitalIcon color="white" />}
                  label="Health"
                  sx={{
                    height: 40,
                    borderRadius: 20,
                    fontWeight: 600,
                    backgroundColor: statusChange == "Health Insurance" ? "#60176F" : "#60176F20",
                    color: statusChange == "Health Insurance" ? "white" : "#60176F",
                    padding: "10px",
                    "&:hover": {
                      backgroundColor: statusChange == "Health Insurance" ? "#60176F80" : "#60176F30",
                    },
                  }}
                  onClick={() => {
                    setIsStatusChange("Health Insurance");
                  }}
                />
                <Chip
                  icon={<TravelExploreIcon color="white" />}
                  label="Travel"
                  sx={{
                    height: 40,
                    borderRadius: 20,
                    fontWeight: 600,
                    backgroundColor: statusChange == "Travel Insurance" ? "#60176F" : "#60176F20",
                    color: statusChange == "Travel Insurance" ? "white" : "#60176F",
                    padding: "10px",
                    "&:hover": {
                      backgroundColor: statusChange == "Travel Insurance" ? "#60176F80" : "#60176F30",
                    },
                  }}
                  onClick={() => {
                    setIsStatusChange("Travel Insurance");
                  }}
                />
              </Stack>
              <Grid container mt={2}>
                {statusChange === "Motor Insurance" && (
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(
                        formik.touched?.motorInsurance?.commission && formik.errors?.motorInsurance?.commission
                      )}
                      fullWidth
                      helperText={
                        formik.touched?.motorInsurance?.commission && formik.errors?.motorInsurance?.commission
                      }
                      label="Motor Commission"
                      name={`motorInsurance.commission`}
                      type="number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      value={formik.values?.motorInsurance?.commission}
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
            <NextLink href={`/sub-admins`} passHref>
              <Button sx={{ m: 1 }} variant="outlined">
                Cancel
              </Button>
            </NextLink>

            <Button sx={{ m: 1 }} type="submit" variant="contained">
              {agentId ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      )}
    </>
  );
};

export default SalesAgentEditForm;
