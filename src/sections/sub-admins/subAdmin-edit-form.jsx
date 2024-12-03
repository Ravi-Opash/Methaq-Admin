import React, { useEffect, useRef, useState } from "react";
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
  Chip,
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
import { addNewAdmin, fetchMotorSuperwiserAgentList, getAdminDetailById, updateAdminById } from "./action/adminAcrion";
import { toast } from "react-toastify";
import { VisibilityOffIcon } from "src/Icons/VisibilityOffIcon";
import { VisibilityIcon } from "src/Icons/VisibilityIcon";
import ModalComp from "src/components/modalComp";
import { Stack } from "@mui/system";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Scrollbar } from "src/components/scrollbar";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AnimationLoader from "src/components/amimated-loader";

//ios switch
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

const AdminEditForm = () => {
  const dispatch = useDispatch();
  const { adminDetail } = useSelector((state) => state.admins);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [statusChange, setIsStatusChange] = useState("Motor Insurance");
  const [isAggentRoll, setIsAgnetRoll] = useState("");
  const [alwayson, setAlwayson] = useState(false);
  const handleIsClose = () => {
    setIsOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  const { adminId } = router.query;
  const [loading, setLoading] = useState(true);
  const [superWiserList, serSuperWiserList] = useState([]);

  // Get Superwiser Agent List to show in drop down
  const fetchListOfLeadAgents = () => {
    dispatch(fetchMotorSuperwiserAgentList({}))
      .unwrap()
      .then((res) => {
        serSuperWiserList(res?.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // useEffect to initialize data on component mount
  const initial = useRef(false);

  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    fetchListOfLeadAgents();
  }, []);

  const formik = useFormik({
    initialValues: {
      adminName: adminDetail ? adminDetail?.userId?.fullName : "",
      contactNo: adminDetail ? adminDetail?.userId?.mobileNumber : "",
      teamLeaderId: adminDetail?.teamLeaderId ? adminDetail?.teamLeaderId : "",
      adminEmail: adminDetail ? adminDetail?.userId?.email : "",
      maxDiscount: adminDetail ? adminDetail?.maxDiscount : "",
      autoCommission: adminDetail ? adminDetail?.autoCommission : "",
      maxHealthDiscount: adminDetail ? adminDetail?.maxHealthDiscount : "",
      healthCommission: adminDetail ? adminDetail?.healthCommission : "",
      maxTravelDiscount: adminDetail ? adminDetail?.maxTravelDiscount : "",
      travelCommission: adminDetail ? adminDetail?.travelCommission : "",
      password: adminDetail ? adminDetail?.userId?.password : "",
      isAutoProposalAssignAllowed: adminDetail?.isAutoProposalAssignAllowed
        ? !!adminDetail?.isAutoProposalAssignAllowed
        : false,
      isHealthProposalAssignAllowed: adminDetail?.isHealthProposalAssignAllowed
        ? !!adminDetail?.isHealthProposalAssignAllowed
        : false,
      isTravelProposalAssignAllowed: adminDetail?.isTravelProposalAssignAllowed
        ? !!adminDetail?.isTravelProposalAssignAllowed
        : false,
      isAutoAgentMatrixAllowed: adminDetail?.isAutoAgentMatrixAllowed ? !!adminDetail?.isAutoAgentMatrixAllowed : false,
      isSupervisor: adminDetail?.isSupervisor ? !!adminDetail?.isSupervisor : false,
      isSalesAgent: adminDetail?.isSalesAgent ? !!adminDetail?.isSalesAgent : false,
      dasRead: adminDetail ? adminDetail?.dashboard?.read : false,
      dasCreate: adminDetail ? adminDetail?.dashboard?.create : false,
      dasUpdate: adminDetail ? adminDetail?.dashboard?.update : false,
      dasDelete: adminDetail ? adminDetail?.dashboard?.delete : false,
      //customer
      cusRead: adminDetail ? adminDetail?.customer?.read : false,
      cusCreate: adminDetail ? adminDetail?.customer?.create : false,
      cusUpdate: adminDetail ? adminDetail?.customer?.update : false,
      cusDelete: adminDetail ? adminDetail?.customer?.delete : false,
      //corporate customer
      corporateCustomerRead: adminDetail ? adminDetail?.corporateCustomer?.read : false,
      corporateCustomerCreate: adminDetail ? adminDetail?.corporateCustomer?.create : false,
      corporateCustomerUpdate: adminDetail ? adminDetail?.corporateCustomer?.update : false,
      corporateCustomerDelete: adminDetail ? adminDetail?.corporateCustomer?.delete : false,
      //lead
      leaRead: adminDetail ? adminDetail?.lead?.read : false,
      leaCreate: adminDetail ? adminDetail?.lead?.create : false,
      leaUpdate: adminDetail ? adminDetail?.lead?.update : false,
      leaDelete: adminDetail ? adminDetail?.lead?.delete : false,
      //policy
      polRead: adminDetail ? adminDetail?.policy?.read : false,
      polCreate: adminDetail ? adminDetail?.policy?.create : false,
      polUpdate: adminDetail ? adminDetail?.policy?.update : false,
      polDelete: adminDetail ? adminDetail?.policy?.delete : false,
      //product
      productRead: adminDetail ? adminDetail?.product?.read : false,
      productCreate: adminDetail ? adminDetail?.product?.create : false,
      productUpdate: adminDetail ? adminDetail?.product?.update : false,
      productDelete: adminDetail ? adminDetail?.product?.delete : false,
      //health quote
      healthRead: adminDetail?.healthQuote ? adminDetail?.healthQuote?.read : false,
      healthCreate: adminDetail?.healthQuote ? adminDetail?.healthQuote?.create : false,
      healthUpdate: adminDetail?.healthQuote ? adminDetail?.healthQuote?.update : false,
      healthDelete: adminDetail?.healthQuote ? adminDetail?.healthQuote?.delete : false,
      // travel quote
      travelRead: adminDetail?.travelQuote ? adminDetail?.travelQuote?.read : false,
      travelCreate: adminDetail?.travelQuote ? adminDetail?.travelQuote?.create : false,
      travelUpdate: adminDetail?.travelQuote ? adminDetail?.travelQuote?.update : false,
      travelDelete: adminDetail?.travelQuote ? adminDetail?.travelQuote?.delete : false,
      //pet insurance
      petRead: adminDetail?.petQuote ? adminDetail?.petQuote?.read : false,
      petCreate: adminDetail?.petQuote ? adminDetail?.petQuote?.create : false,
      petUpdate: adminDetail?.petQuote ? adminDetail?.petQuote?.update : false,
      petDelete: adminDetail?.petQuote ? adminDetail?.petQuote?.delete : false,
      //land insurance
      landRead: adminDetail?.landQuote ? adminDetail?.landQuote?.read : false,
      landCreate: adminDetail?.landQuote ? adminDetail?.landQuote?.create : false,
      landUpdate: adminDetail?.landQuote ? adminDetail?.landQuote?.update : false,
      landDelete: adminDetail?.landQuote ? adminDetail?.landQuote?.delete : false,
      //voucherr
      vouRead: adminDetail ? adminDetail?.voucher?.read : false,
      vouCreate: adminDetail ? adminDetail?.voucher?.create : false,
      vouUpdate: adminDetail ? adminDetail?.voucher?.update : false,
      vouDelete: adminDetail ? adminDetail?.voucher?.delete : false,
      //qutations
      quaRead: adminDetail ? adminDetail?.quote?.read : false,
      quaCreate: adminDetail ? adminDetail?.quote?.create : false,
      quaUpdate: adminDetail ? adminDetail?.quote?.update : false,
      quaDelete: adminDetail ? adminDetail?.quote?.delete : false,
      //proposals
      proRead: adminDetail ? adminDetail?.proposal?.read : false,
      proCreate: adminDetail ? adminDetail?.proposal?.create : false,
      proUpdate: adminDetail ? adminDetail?.proposal?.update : false,
      proDelete: adminDetail ? adminDetail?.proposal?.delete : false,
      //company
      comRead: adminDetail ? adminDetail?.company?.read : false,
      comCreate: adminDetail ? adminDetail?.company?.create : false,
      comUpdate: adminDetail ? adminDetail?.company?.update : false,
      comDelete: adminDetail ? adminDetail?.company?.delete : false,
      //partner
      partnerRead: adminDetail ? adminDetail?.partner?.read : false,
      partnerCreate: adminDetail ? adminDetail?.partner?.create : false,
      partnerUpdate: adminDetail ? adminDetail?.partner?.update : false,
      partnerDelete: adminDetail ? adminDetail?.partner?.delete : false,
      //transection
      traRead: adminDetail ? adminDetail?.transaction?.read : false,
      traCreate: adminDetail ? adminDetail?.transaction?.create : false,
      traUpdate: adminDetail ? adminDetail?.transaction?.update : false,
      traDelete: adminDetail ? adminDetail?.transaction?.delete : false,
      //blacklist
      blacklistRead: adminDetail ? adminDetail?.blacklist?.read : false,
      blacklistCreate: adminDetail ? adminDetail?.blacklist?.create : false,
      blacklistUpdate: adminDetail ? adminDetail?.blacklist?.update : false,
      blacklistDelete: adminDetail ? adminDetail?.blacklist?.delete : false,
      //sponsorpartner
      sponsorPartnerRead: adminDetail ? adminDetail?.sponsorPartner?.read : false,
      sponsorPartnerCreate: adminDetail ? adminDetail?.sponsorPartner?.create : false,
      sponsorPartnerUpdate: adminDetail ? adminDetail?.sponsorPartner?.update : false,
      sponsorPartnerDelete: adminDetail ? adminDetail?.sponsorPartner?.delete : false,
      // commercial
      commercialRead: adminDetail ? adminDetail?.commercial?.read : false,
      commercialCreate: adminDetail ? adminDetail?.commercial?.create : false,
      commercialUpdate: adminDetail ? adminDetail?.commercial?.update : false,
      commercialDelete: adminDetail ? adminDetail?.commercial?.delete : false,
    },
    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      adminName: Yup.string().required("Agent name is required"),
      adminEmail: Yup.string().email().required("Agent email is required"),
      ...(adminId
        ? {}
        : {
            password: Yup.string().required("Password is required"),
          }),
    }),

    onSubmit: (values) => {
      const getPermission = (category) => ({
        create: !!values[`${category}Create`],
        read: !!values[`${category}Read`],
        update: !!values[`${category}Update`],
        delete: !!values[`${category}Delete`],
      });
      if (!!adminId) {
        const updatedData = {
          email: values.adminEmail.toLowerCase(),
          mobileNumber: values.contactNo,
          teamLeaderId: values.teamLeaderId,
          fullName: values.adminName,
          maxDiscount: values.maxDiscount,
          autoCommission: values.autoCommission,
          maxHealthDiscount: values.maxHealthDiscount,
          healthCommission: values.healthCommission,
          maxTravelDiscount: values.maxTravelDiscount,
          travelCommission: values.travelCommission,
          isAutoProposalAssignAllowed: values.isAutoProposalAssignAllowed,
          isHealthProposalAssignAllowed: values.isHealthProposalAssignAllowed,
          isTravelProposalAssignAllowed: values.isTravelProposalAssignAllowed,
          isAutoAgentMatrixAllowed: values.isAutoAgentMatrixAllowed,
          isSalesAgent: values.isSalesAgent,
          isSupervisor: values.isSupervisor,
          dashboard: getPermission("das"),
          landQuote: getPermission("land"),
          customer: getPermission("cus"),
          corporateCustomer: getPermission("corporateCustomer"),
          lead: getPermission("lea"),
          proposal: getPermission("pro"),
          policy: getPermission("pol"),
          quote: getPermission("qua"),
          product: getPermission("product"),
          voucher: getPermission("vou"),
          company: getPermission("com"),
          partner: getPermission("partner"),
          transaction: getPermission("tra"),
          blacklist: getPermission("blacklist"),
          healthQuote: getPermission("health"),
          travelQuote: getPermission("travel"),
          sponsorPartner: getPermission("sponsorPartner"),
          commercial: getPermission("commercial"),
          petQuote: getPermission("pet"),
          landQuote: getPermission("land"),
        };

        setLoading(true);
        //update permison api
        dispatch(updateAdminById({ id: adminId, data: updatedData }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push("/sub-admins");
              toast("Successfully Edited", { type: "success" });
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            toast(err, { type: "error" });
          });
      } else {
        const updatedData = {
          email: values.adminEmail.toLowerCase(),
          password: values.password,
          mobileNumber: values.contactNo,
          teamLeaderId: values.teamLeaderId,
          fullName: values.adminName,
          maxDiscount: values.maxDiscount,
          autoCommission: values.autoCommission,
          maxHealthDiscount: values.maxHealthDiscount,
          healthCommission: values.healthCommission,
          maxTravelDiscount: values.maxTravelDiscount,
          travelCommission: values.travelCommission,
          isAutoProposalAssignAllowed: values.isAutoProposalAssignAllowed,
          isHealthProposalAssignAllowed: values.isHealthProposalAssignAllowed,
          isTravelProposalAssignAllowed: values.isTravelProposalAssignAllowed,
          isAutoAgentMatrixAllowed: values.isAutoAgentMatrixAllowed,
          isSalesAgent: values.isSalesAgent,
          isSupervisor: values.isSupervisor,
          dashboard: getPermission("das"),
          customer: getPermission("cus"),
          corporateCustomer: getPermission("corporateCustomer"),
          lead: getPermission("lea"),
          proposal: getPermission("pro"),
          policy: getPermission("pol"),
          quote: getPermission("qua"),
          product: getPermission("product"),
          voucher: getPermission("vou"),
          company: getPermission("com"),
          partner: getPermission("partner"),
          transaction: getPermission("tra"),
          blacklist: getPermission("blacklist"),
          healthQuote: getPermission("health"),
          travelQuote: getPermission("travel"),
          sponsorPartner: getPermission("sponsorPartner"),
          commercial: getPermission("commercial"),
          petQuote: getPermission("pet"),
          landQuote: getPermission("land"),
        };

        dispatch(addNewAdmin(updatedData))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push("/sub-admins");
              toast("Successfully Created", { type: "success" });
            }
          })
          .catch((err) => {
            toast(err, { type: "error" });
          });
      }
    },
  });

  //handle role
  const handleClick = () => {
    formik.setFieldValue("isAutoProposalAssignAllowed", false);
    formik.setFieldValue("isSupervisor", false);
    formik.setFieldValue("isSalesAgent", true);
    handleClose();
  };

  const handleIsChange = (isAggentRoll) => {
    formik.setFieldValue(`${isAggentRoll}`, true);
    formik.setFieldValue("isSalesAgent", false);
    handleIsClose();
  };

  useEffect(() => {
    let loadingDelay;

    if (!!adminId) {
      loadingDelay = setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }

    return () => {
      clearTimeout(loadingDelay);
    };
  }, [adminDetail]);

  //set password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onAllOptionSelect = (value) => {
    formik.setFieldValue("blacklistRead", value);
    formik.setFieldValue("blacklistCreate", value);
    formik.setFieldValue("blacklistUpdate", value);
    formik.setFieldValue("blacklistDelete", value);
    formik.setFieldValue("sponsorPartnerRead", value);
    formik.setFieldValue("sponsorPartnerCreate", value);
    formik.setFieldValue("sponsorPartnerUpdate", value);
    formik.setFieldValue("sponsorPartnerDelete", value);
    formik.setFieldValue("traRead", value);
    formik.setFieldValue("traCreate", value);
    formik.setFieldValue("traUpdate", value);
    formik.setFieldValue("traDelete", value);
    formik.setFieldValue("partnerRead", value);
    formik.setFieldValue("partnerCreate", value);
    formik.setFieldValue("partnerUpdate", value);
    formik.setFieldValue("partnerDelete", value);
    formik.setFieldValue("comDelete", value);
    formik.setFieldValue("comUpdate", value);
    formik.setFieldValue("comCreate", value);
    formik.setFieldValue("comRead", value);
    formik.setFieldValue("proDelete", value);
    formik.setFieldValue("proUpdate", value);
    formik.setFieldValue("proCreate", value);
    formik.setFieldValue("proRead", value);
    formik.setFieldValue("quaDelete", value);
    formik.setFieldValue("quaUpdate", value);
    formik.setFieldValue("quaCreate", value);
    formik.setFieldValue("quaRead", value);
    formik.setFieldValue("vouDelete", value);
    formik.setFieldValue("vouUpdate", value);
    formik.setFieldValue("vouCreate", value);
    formik.setFieldValue("vouRead", value);
    formik.setFieldValue("productDelete", value);
    formik.setFieldValue("productUpdate", value);
    formik.setFieldValue("productCreate", value);
    formik.setFieldValue("productRead", value);
    formik.setFieldValue("healthDelete", value);
    formik.setFieldValue("healthUpdate", value);
    formik.setFieldValue("healthCreate", value);
    formik.setFieldValue("healthRead", value);
    formik.setFieldValue("travelDelete", value);
    formik.setFieldValue("travelUpdate", value);
    formik.setFieldValue("travelCreate", value);
    formik.setFieldValue("travelRead", value);
    formik.setFieldValue("petDelete", value);
    formik.setFieldValue("petUpdate", value);
    formik.setFieldValue("petCreate", value);
    formik.setFieldValue("petRead", value);
    formik.setFieldValue("landDelete", value);
    formik.setFieldValue("landUpdate", value);
    formik.setFieldValue("landCreate", value);
    formik.setFieldValue("landRead", value);
    formik.setFieldValue("polDelete", value);
    formik.setFieldValue("polUpdate", value);
    formik.setFieldValue("polCreate", value);
    formik.setFieldValue("polRead", value);
    formik.setFieldValue("leaDelete", value);
    formik.setFieldValue("leaUpdate", value);
    formik.setFieldValue("leaCreate", value);
    formik.setFieldValue("leaRead", value);
    formik.setFieldValue("cusDelete", value);
    formik.setFieldValue("cusUpdate", value);
    formik.setFieldValue("cusCreate", value);
    formik.setFieldValue("cusRead", value);
    formik.setFieldValue("corporateCustomerDelete", value);
    formik.setFieldValue("corporateCustomerUpdate", value);
    formik.setFieldValue("corporateCustomerCreate", value);
    formik.setFieldValue("corporateCustomerRead", value);
    formik.setFieldValue("dasDelete", value);
    formik.setFieldValue("dasUpdate", value);
    formik.setFieldValue("dasCreate", value);
    formik.setFieldValue("dasRead", value);
    formik.setFieldValue("commercialRead", value);
    formik.setFieldValue("commercialUpdate", value);
    formik.setFieldValue("commercialDelete", value);
    formik.setFieldValue("commercialCreate", value);
  };

  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      if (document.getElementById(Object.keys(formik.errors)[0]))
        document.getElementById(Object.keys(formik.errors)[0]).focus();
    }
  }, [formik]);

  //if all switch on then select all switch on
  useEffect(() => {
    const allRead = [
      formik.values.dasRead,
      formik.values.cusRead,
      formik.values.corporateCustomerRead,
      formik.values.proRead,
      formik.values.leaRead,
      formik.values.polRead,
      formik.values.quaRead,
      formik.values.productRead,
      formik.values.healthRead,
      formik.values.travelRead,
      formik.values.petRead,
      formik.values.landRead,
      formik.values.comRead,
      formik.values.partnerRead,
      formik.values.vouRead,
      formik.values.traRead,
      formik.values.sponsorPartnerRead,
      formik.values.blacklistRead,
      formik.values.commercialRead,
      formik.values.dasCreate,
      formik.values.cusCreate,
      formik.values.corporateCustomerCreate,
      formik.values.proCreate,
      formik.values.leaCreate,
      formik.values.polCreate,
      formik.values.quaCreate,
      formik.values.productCreate,
      formik.values.healthCreate,
      formik.values.travelCreate,
      formik.values.petCreate,
      formik.values.landCreate,
      formik.values.comCreate,
      formik.values.partnerCreate,
      formik.values.vouCreate,
      formik.values.traCreate,
      formik.values.sponsorPartnerCreate,
      formik.values.blacklistCreate,
      formik.values.commercialCreate,
      formik.values.dasUpdate,
      formik.values.cusUpdate,
      formik.values.corporateCustomerUpdate,
      formik.values.proUpdate,
      formik.values.leaUpdate,
      formik.values.polUpdate,
      formik.values.quaUpdate,
      formik.values.productUpdate,
      formik.values.healthUpdate,
      formik.values.travelUpdate,
      formik.values.petUpdate,
      formik.values.landUpdate,
      formik.values.comUpdate,
      formik.values.partnerUpdate,
      formik.values.vouUpdate,
      formik.values.traUpdate,
      formik.values.sponsorPartnerUpdate,
      formik.values.blacklistUpdate,
      formik.values.commercialUpdate,
      formik.values.dasDelete,
      formik.values.cusDelete,
      formik.values.corporateCustomerDelete,
      formik.values.proDelete,
      formik.values.leaDelete,
      formik.values.polDelete,
      formik.values.quaDelete,
      formik.values.productDelete,
      formik.values.healthDelete,
      formik.values.travelDelete,
      formik.values.petDelete,
      formik.values.landDelete,
      formik.values.comDelete,
      formik.values.partnerDelete,
      formik.values.vouDelete,
      formik.values.traDelete,
      formik.values.sponsorPartnerDelete,
      formik.values.blacklistDelete,
      formik.values.commercialDelete,
    ].every(Boolean);

    setAlwayson(allRead);
  }, [formik.values]);

  return (
    <>
      {loading && <AnimationLoader open={true} />}
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
                  error={Boolean(formik.touched.adminName && formik.errors.adminName)}
                  fullWidth
                  helperText={formik.touched.adminName && formik.errors.adminName}
                  label="Agent Name"
                  name="adminName"
                  id="adminName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.adminName}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                {" "}
                <Box>
                  <TextField
                    error={Boolean(formik.touched.adminEmail && formik.errors.adminEmail)}
                    fullWidth
                    helperText={formik.touched.adminEmail && formik.errors.adminEmail}
                    label="Agent Email"
                    name="adminEmail"
                    id="adminEmail"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.adminEmail}
                    type="email"
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box>
                  <TextField
                    error={Boolean(formik.touched.contactNo && formik.errors.contactNo)}
                    fullWidth
                    helperText={formik.touched.contactNo && formik.errors.contactNo}
                    label="Contact No"
                    name="contactNo"
                    id="contactNo"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.contactNo}
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                {!formik.values.isSupervisor && (
                  <Box>
                    <TextField
                      error={Boolean(formik.touched.teamLeaderId && formik.errors.teamLeaderId)}
                      fullWidth
                      helperText={formik.touched.teamLeaderId && formik.errors.teamLeaderId}
                      label="Working under the team of"
                      name="teamLeaderId"
                      id="teamLeaderId"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={formik.values.teamLeaderId}
                    >
                      <option value=""></option>
                      {superWiserList.map((agent) => {
                        return <option value={agent?.userId?._id}>{agent?.userId?.fullName}</option>;
                      })}
                    </TextField>
                  </Box>
                )}
              </Grid>
              {!adminId && (
                <Grid item md={6} xs={12}>
                  <Box>
                    <TextField
                      error={Boolean(formik.touched.password && formik.errors.password)}
                      fullWidth
                      helperText={formik.touched.password && formik.errors.password}
                      label="Password"
                      name="password"
                      id="password"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type={showPassword ? "text" : "password"}
                      value={formik.values.password}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
              )}

              <Grid item md={6} xs={12}>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                      Supervisor :
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            name="isSupervisor"
                            onChange={(e) => {
                              if (formik.values.isSalesAgent) {
                                setIsOpen(true);
                                setIsAgnetRoll("isSupervisor");
                              } else {
                                formik.handleChange(e);
                              }
                            }}
                            onBlur={formik.handleBlur}
                            checked={formik.values.isSupervisor}
                          />
                        }
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                      Sales Agent :
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            name="isSalesAgent"
                            onChange={(e) => {
                              if (
                                e.target.checked &&
                                (formik.values.isAutoProposalAssignAllowed || formik.values.isSupervisor)
                              ) {
                                setOpen(true);
                              } else {
                                formik.handleChange(e);
                              }
                            }}
                            onBlur={formik.handleBlur}
                            checked={formik.values.isSalesAgent}
                          />
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // mt: 4,
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
            <Grid container spacing={3} mt={1} sx={{ display: "flex", alignItems: "center" }}>
              <Grid item md={4} sm={6} xs={12}>
                {statusChange === "Motor Insurance" && (
                  <TextField
                    error={Boolean(formik.touched.maxDiscount && formik.errors.maxDiscount)}
                    fullWidth
                    helperText={formik.touched.maxDiscount && formik.errors.maxDiscount}
                    label="Motor Maximum Discount"
                    name="maxDiscount"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    value={formik.values.maxDiscount}
                  />
                )}
                {statusChange === "Health Insurance" && (
                  <TextField
                    error={Boolean(formik.touched.maxHealthDiscount && formik.errors.maxHealthDiscount)}
                    fullWidth
                    helperText={formik.touched.maxHealthDiscount && formik.errors.maxHealthDiscount}
                    label="Health Maximum Discount"
                    name="maxHealthDiscount"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    value={formik.values.maxHealthDiscount}
                  />
                )}
                {statusChange === "Travel Insurance" && (
                  <TextField
                    error={Boolean(formik.touched.maxTravelDiscount && formik.errors.maxTravelDiscount)}
                    fullWidth
                    helperText={formik.touched.maxTravelDiscount && formik.errors.maxTravelDiscount}
                    label="Travel Maximum Discount"
                    name="maxTravelDiscount"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    value={formik.values.maxTravelDiscount}
                  />
                )}
              </Grid>
              {formik.values.isSalesAgent && (
                <Grid item md={4} sm={6} xs={12}>
                  {statusChange === "Motor Insurance" && (
                    <TextField
                      error={Boolean(formik.touched.autoCommission && formik.errors.autoCommission)}
                      fullWidth
                      helperText={formik.touched.autoCommission && formik.errors.autoCommission}
                      label="Motor Commission ( % from net commission)"
                      name="autoCommission"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      value={formik.values.autoCommission}
                    />
                  )}
                  {statusChange === "Health Insurance" && (
                    <TextField
                      error={Boolean(formik.touched.healthCommission && formik.errors.healthCommission)}
                      fullWidth
                      helperText={formik.touched.healthCommission && formik.errors.healthCommission}
                      label="Health Commission ( % from net commission)"
                      name="healthCommission"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      value={formik.values.healthCommission}
                    />
                  )}
                  {statusChange === "Travel Insurance" && (
                    <TextField
                      error={Boolean(formik.touched.travelCommission && formik.errors.travelCommission)}
                      fullWidth
                      helperText={formik.touched.travelCommission && formik.errors.travelCommission}
                      label="Travel Commission ( % from net commission)"
                      name="travelCommission"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      InputLabelProps={{ shrink: true }}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      value={formik.values.travelCommission}
                    />
                  )}
                </Grid>
              )}
              <Grid item md={4} sm={6} xs={12}>
                <Grid container>
                  {statusChange === "Motor Insurance" && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mx: 1,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontSize: { xs: "14px", xl: "16px" } }}>
                          Auto Assign Proposals :
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                name="isAutoProposalAssignAllowed"
                                onChange={(e) => {
                                  if (formik.values.isSalesAgent) {
                                    setIsOpen(true);
                                    setIsAgnetRoll("isAutoProposalAssignAllowed");
                                  } else {
                                    formik.handleChange(e);
                                  }
                                }}
                                onBlur={formik.handleBlur}
                                checked={formik.values.isAutoProposalAssignAllowed}
                              />
                            }
                          />
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {statusChange === "Health Insurance" && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mx: 1,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                          Auto Assign Health Proposals :
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                name="isHealthProposalAssignAllowed"
                                onChange={(e) => {
                                  if (formik.values.isSalesAgent) {
                                    setIsOpen(true);
                                    setIsAgnetRoll("isHealthProposalAssignAllowed");
                                  } else {
                                    formik.handleChange(e);
                                  }
                                }}
                                onBlur={formik.handleBlur}
                                checked={formik.values.isHealthProposalAssignAllowed}
                              />
                            }
                          />
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  {statusChange === "Travel Insurance" && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mx: 1,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
                          Auto Assign Travel Proposals :
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                name="isTravelProposalAssignAllowed"
                                onChange={(e) => {
                                  if (formik.values.isSalesAgent) {
                                    setIsOpen(true);
                                    setIsAgnetRoll("isTravelProposalAssignAllowed");
                                  } else {
                                    formik.handleChange(e);
                                  }
                                }}
                                onBlur={formik.handleBlur}
                                checked={formik.values.isTravelProposalAssignAllowed}
                              />
                            }
                          />
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Grid container>
                  {statusChange === "Motor Insurance" && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mx: 1,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontSize: { xs: "14px", xl: "16px" } }}>
                          Matrix quotes ON/OFF :
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                name="isAutoAgentMatrixAllowed"
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                                onBlur={formik.handleBlur}
                                checked={formik.values.isAutoAgentMatrixAllowed}
                              />
                            }
                          />
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // mt: 4,
              }}
            >
              <Typography variant="h6" sx={{ fontSize: "22px", width: "170px" }}>
                Permissions
              </Typography>
              <Box
                sx={{
                  width: "-webkit-fill-available",
                  borderBottom: "1px solid #B2B2B2",
                }}
              ></Box>
            </Box>

            <Box sx={{ display: "flex", gap: 3, mx: 1, mt: 3, mb: 3 }}>
              <Typography variant="h6">Permissions :</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle2">Select all</Typography>
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      name="selectall"
                      checked={!!alwayson}
                      onChange={(e) => {
                        onAllOptionSelect(e.target.checked);
                      }}
                    />
                  }
                />
              </Box>
            </Box>

            <Scrollbar>
              <Box sx={{ minWidth: 800 }}>
                <Grid container sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: "10px" }}>
                  <Grid item xs={2.4}>
                    Item
                  </Grid>
                  <Grid item xs={2.4}>
                    View
                  </Grid>
                  <Grid item xs={2.4}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box>Insert</Box>
                    </Box>
                  </Grid>
                  <Grid item xs={2.4}>
                    Update
                  </Grid>
                  <Grid item xs={2.4}>
                    Delete
                  </Grid>
                </Grid>

                {/* {"dashboard"} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Dashboard </Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="dasRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.dasRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="dasCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.dasCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="dasUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.dasUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="dasDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.dasDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"customers"} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Individual Customers</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="cusRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.cusRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="cusCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.cusCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="cusUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.cusUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="cusDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.cusDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Corporate customers"} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Corporate Customers</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="corporateCustomerRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.corporateCustomerRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="corporateCustomerCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.corporateCustomerCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="corporateCustomerUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.corporateCustomerUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="corporateCustomerDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.corporateCustomerDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"proposals"} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Proposals </Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="proRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.proRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="proCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.proCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="proUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.proUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="proDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.proDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Leads "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Leads </Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="leaRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.leaRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="leaCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.leaCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="leaUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.leaUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="leaDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.leaDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Policy  "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Policy </Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="polRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.polRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="polCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.polCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="polUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.polUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="polDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.polDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Quotes   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Quotes </Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="quaRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.quaRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="quaCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.quaCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="quaUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.quaUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="quaDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.quaDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Products   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Products </Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="productRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.productRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="productCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.productCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="productUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.productUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="productDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.productDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Health Insurance   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Health Insurance</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="healthRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.healthRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="healthCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.healthCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="healthUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.healthUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="healthDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.healthDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Travel Insurance   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Travel Insurance</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="travelRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.travelRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="travelCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.travelCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="travelUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.travelUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="travelDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.travelDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Pet Insurance   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Pet Insurance</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="petRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.petRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="petCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.petCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="petUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.petUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="petDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.petDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Land Insurance   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Musataha Insurance</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="landRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.landRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="landCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.landCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="landUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.landUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="landDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.landDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Companies   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Companies</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="comRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.comRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="comCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.comCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="comUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.comUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="comDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.comDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Club   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Club</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="partnerRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.partnerRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="partnerCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.partnerCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="partnerUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.partnerUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="partnerDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.partnerDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Vouchers   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Vouchers</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="vouRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.vouRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="vouCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.vouCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="vouUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.vouUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="vouDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.vouDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Transactions   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Transactions</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="traRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.traRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="traCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.traCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="traUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.traUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="traDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.traDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Affiliates "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Affiliates</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="sponsorPartnerRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.sponsorPartnerRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="sponsorPartnerCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.sponsorPartnerCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="sponsorPartnerUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.sponsorPartnerUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="sponsorPartnerDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.sponsorPartnerDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Black List   "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Black List</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="blacklistRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.blacklistRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="blacklistCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.blacklistCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="blacklistUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.blacklistUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="blacklistDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.blacklistDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>

                {/* {"Commercials "} */}
                <Grid container sx={{ p: 1 }}>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Commercials</Typography>
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="commercialRead"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.commercialRead}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="commercialCreate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.commercialCreate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="commercialUpdate"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.commercialUpdate}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2.4} sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="commercialDelete"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.commercialDelete}
                        />
                      }
                    />
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            </Scrollbar>
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
            {adminId ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
      <ModalComp open={open} handleClose={handleClose}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          If current aggent role is sales agent then he can not be supperviser or have access to auto assign.
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
          mt={3}
        >
          <Button
            variant="contained"
            sx={{
              marginRight: "10px",
            }}
            onClick={() => handleClick()}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
      <ModalComp open={isOpen} handleClose={handleIsClose}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          Suppervisor can not be sales agent or have access to auto assign.
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
          mt={3}
        >
          <Button
            variant="contained"
            sx={{
              marginRight: "10px",
            }}
            onClick={() => handleIsChange(isAggentRoll)}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => handleIsClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
    </>
  );
};

export default AdminEditForm;
