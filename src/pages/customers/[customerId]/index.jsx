import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  List,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { useRouter } from "next/router";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { PencilAlt } from "src/Icons/PencilAlt";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerDetailsById,
  getCustomerHealthPolicyListByCustomerId,
  getCustomerHealthProposalsListByCustomerId,
  getCustomerPolicyListByCustomerId,
  getCustomerProposalsListByCustomerId,
  getCustomerTravelPolicyListByCustomerId,
  getCustomerTravelProposalsListByCustomerId,
} from "src/sections/customer/action/customerAction";
import { toast } from "react-toastify";
import CustomerPolicies from "src/sections/customer/customer-policies";
import { format, parseISO } from "date-fns";
import CustomerQuotations from "src/sections/customer/customer-quotations";
import { debounce } from "src/utils/debounce-search";
import {
  setCustomerHealthPolicyListCustomPagination,
  setCustomerHealthProposalsListCustomPagination,
  setCustomerPolicyListCustomPagination,
  setCustomerProposalsListCustomPagination,
  setCustomerTravelProposalsListCustomPagination,
  setCustomerTravelPolicyListCustomPagination,
} from "src/sections/customer/reducer/customerSlice";
import ListItemComp from "src/components/ListItemComp";
import { PreviewSvg } from "src/Icons/Preview";
import { moduleAccess } from "src/utils/module-access";
import { Stack } from "@mui/system";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CustomerHealthPoliciesTable from "src/sections/customer/customer-health-policy-table";
import CustomerHealthProposalTable from "src/sections/customer/customer-health-proposal-table";
import CustomerTravelProposalTable from "src/sections/customer/customer-travel-proposal-table";
import CustomerTravelPoliciesTable from "src/sections/customer/customer-travel-policy-table";
import AnimationLoader from "src/components/amimated-loader";

const tabs = [
  { label: "Details", value: "details" },
  { label: "Policies", value: "policies" },
  { label: "Proposals", value: "proposals" },
];

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const CustomerDetails = () => {
  const dispatch = useDispatch();
  const {
    customerDetails,
    customerPolicyListCustomPagination,
    customerProposalsListCustomPagination,
    customerHealthPolicyListCustomPagination,
    customerHealthProposalsListCustomPagination,
    customerTravelPolicyListCustomPagination,
    customerTravelProposalsListCustomPagination,
  } = useSelector((state) => state.customer);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [dashboardChange, setIsDashboardChange] = useState("Motor Insurance");

  const router = useRouter();
  const { customerId } = router.query;

  const [currentTab, setCurrentTab] = useState("details");

  const initialized = useRef(false);

  // Get customer details API
  const getCustomerDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getCustomerDetailsById(customerId));
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  useEffect(() => {
    getCustomerDetailsHandler();
  }, []);

  const [searchProposalsFilter, setSearchProposalsFilter] = useState({
    name: "",
  });

  const [searchFilter, setSearchFilter] = useState({
    name: "",
    type: "all",
    fromDate: ``,
    toDate: ``,
  });

  //  policy filter start
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const policyListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    policyListFilter.current = false;

    if (dashboardChange == "Motor Insurance") {
      dispatch(
        setCustomerPolicyListCustomPagination({
          page: 1,
          size: 10,
        })
      );
    }
    if (dashboardChange == "Health Insurance") {
      dispatch(
        setCustomerHealthPolicyListCustomPagination({
          page: 1,
          size: 10,
        })
      );
    }

    if (dashboardChange == "Travel Insurance") {
      dispatch(
        setCustomerTravelPolicyListCustomPagination({
          page: 1,
          size: 10,
        })
      );
    }

    if (name && (value === "" || value)) {
      getCustomerPolicyListFilterHandler({ [name]: value });
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getCustomerPolicyListFilterHandler();
    }
  };

  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Get Customer Policy list API
  const getCustomerPolicyListFilterHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (policyListFilter.current) {
      return;
    }
    policyListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      if (dashboardChange == "Motor Insurance") {
        dispatch(
          getCustomerPolicyListByCustomerId({
            page: customerPolicyListCustomPagination?.page,
            size: customerPolicyListCustomPagination?.size,
            id: customerId,
            search: payload?.name,
            payloadData: {
              pType: payload?.type,
              startDate: payload?.fromDate,
              endDate: payload?.toDate,
            },
          })
        );
      }
      if (dashboardChange == "Health Insurance") {
        dispatch(
          getCustomerHealthPolicyListByCustomerId({
            page: customerHealthPolicyListCustomPagination?.page,
            size: customerHealthPolicyListCustomPagination?.size,
            id: customerId,
            search: payload?.name,
            payloadData: {
              pType: payload?.type,
              startDate: payload?.fromDate,
              endDate: payload?.toDate,
            },
          })
        );
      }
      if (dashboardChange == "Travel Insurance") {
        dispatch(
          getCustomerTravelPolicyListByCustomerId({
            page: customerTravelPolicyListCustomPagination?.page,
            size: customerTravelPolicyListCustomPagination?.size,
            id: customerId,
            search: payload?.name,
            payloadData: {
              pType: payload?.type,
              startDate: payload?.fromDate,
              endDate: payload?.toDate,
            },
          })
        );
      }
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  useEffect(() => {
    getCustomerPolicyListFilterHandler();
    return () => {
      dispatch(
        setCustomerPolicyListCustomPagination({
          page: 1,
          size: 10,
        })
      );
      dispatch(
        setCustomerHealthPolicyListCustomPagination({
          page: 1,
          size: 10,
        })
      );
      dispatch(
        setCustomerTravelPolicyListCustomPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, [dashboardChange, currentTab]);

  // Handle page change API
  const handlePageChange = useCallback(
    (event, value) => {
      if (dashboardChange == "Motor Insurance") {
        dispatch(
          setCustomerPolicyListCustomPagination({
            page: value + 1,
            size: customerPolicyListCustomPagination?.size,
          })
        );

        dispatch(
          getCustomerPolicyListByCustomerId({
            page: value + 1,
            size: customerPolicyListCustomPagination?.size,
            id: customerId,
            search: searchFilter?.name,
            payloadData: {
              pType: searchFilter?.type,
              startDate: searchFilter?.fromDate,
              endDate: searchFilter?.toDate,
            },
          })
        );
      }
      if (dashboardChange == "Health Insurance") {
        dispatch(
          setCustomerHealthPolicyListCustomPagination({
            page: value + 1,
            size: customerHealthPolicyListCustomPagination?.size,
          })
        );

        dispatch(
          getCustomerHealthPolicyListByCustomerId({
            page: value + 1,
            size: customerHealthPolicyListCustomPagination?.size,
            id: customerId,
            search: searchFilter?.name,
            payloadData: {
              pType: searchFilter?.type,
              startDate: searchFilter?.fromDate,
              endDate: searchFilter?.toDate,
            },
          })
        );
      }
      if (dashboardChange == "Travel Insurance") {
        dispatch(
          setCustomerTravelPolicyListCustomPagination({
            page: value + 1,
            size: customerTravelPolicyListCustomPagination?.size,
          })
        );

        dispatch(
          getCustomerTravelPolicyListByCustomerId({
            page: value + 1,
            size: customerTravelPolicyListCustomPagination?.size,
            id: customerId,
            search: searchFilter?.name,
            payloadData: {
              pType: searchFilter?.type,
              startDate: searchFilter?.fromDate,
              endDate: searchFilter?.toDate,
            },
          })
        );
      }
    },
    [
      customerPolicyListCustomPagination?.size,
      customerHealthPolicyListCustomPagination?.size,
      customerTravelPolicyListCustomPagination?.size,
      searchFilter,
    ]
  );

  // Rows per page change API
  const handleRowsPerPageChange = useCallback(
    (event) => {
      if (dashboardChange == "Motor Insurance") {
        dispatch(
          setCustomerPolicyListCustomPagination({
            page: 1,
            size: event.target.value,
          })
        );

        dispatch(
          getCustomerPolicyListByCustomerId({
            page: 1,
            size: event.target.value,
            id: customerId,
            search: searchFilter?.name,
            payloadData: {
              pType: searchFilter?.type,
              startDate: searchFilter?.fromDate,
              endDate: searchFilter?.toDate,
            },
          })
        );
      }
      if (dashboardChange == "Health Insurance") {
        dispatch(
          setCustomerHealthPolicyListCustomPagination({
            page: 1,
            size: event.target.value,
          })
        );

        dispatch(
          getCustomerHealthPolicyListByCustomerId({
            page: 1,
            size: event.target.value,
            id: customerId,
            search: searchFilter?.name,
            payloadData: {
              pType: searchFilter?.type,
              startDate: searchFilter?.fromDate,
              endDate: searchFilter?.toDate,
            },
          })
        );
      }
      if (dashboardChange == "Travel Insurance") {
        dispatch(
          setCustomerTravelPolicyListCustomPagination({
            page: 1,
            size: event.target.value,
          })
        );

        dispatch(
          getCustomerTravelPolicyListByCustomerId({
            page: 1,
            size: event.target.value,
            id: customerId,
            search: searchFilter?.name,
            payloadData: {
              pType: searchFilter?.type,
              startDate: searchFilter?.fromDate,
              endDate: searchFilter?.toDate,
            },
          })
        );
      }
    },
    [
      customerPolicyListCustomPagination?.page,
      customerHealthPolicyListCustomPagination?.page,
      customerTravelPolicyListCustomPagination?.page,
      searchFilter,
    ]
  );

  // proposals filter start
  const proposalsListFilter = useRef(false);

  // Search proposal handler
  const searchProposalsFilterHandler = (name, value) => {
    proposalsListFilter.current = false;

    if (dashboardChange == "Motor Insurance") {
      dispatch(
        setCustomerProposalsListCustomPagination({
          page: 1,
          size: 5,
        })
      );
    }
    if (dashboardChange == "Health Insurance") {
      dispatch(
        setCustomerHealthProposalsListCustomPagination({
          page: 1,
          size: 5,
        })
      );
    }
    if (dashboardChange == "Travel Insurance") {
      dispatch(
        setCustomerTravelProposalsListCustomPagination({
          page: 1,
          size: 5,
        })
      );
    }

    getCustomerProposalsListFilterHandler({ [name]: value });

    setSearchProposalsFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const debounceProposalsHandler = debounce(searchProposalsFilterHandler, 1000);

  // Get customer proposal list API 
  const getCustomerProposalsListFilterHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (proposalsListFilter.current) {
      return;
    }
    proposalsListFilter.current = true;
    let payload = { ...searchProposalsFilter, ...otherProps };

    try {
      if (dashboardChange == "Motor Insurance") {
        dispatch(
          getCustomerProposalsListByCustomerId({
            page: customerProposalsListCustomPagination?.page,
            size: customerProposalsListCustomPagination?.size,
            id: customerId,
            search: payload?.name,
          })
        );
      }
      if (dashboardChange == "Health Insurance") {
        dispatch(
          getCustomerHealthProposalsListByCustomerId({
            page: customerHealthProposalsListCustomPagination?.page,
            size: customerHealthProposalsListCustomPagination?.size,
            id: customerId,
            search: payload?.name,
          })
        );
      }
      if (dashboardChange == "Travel Insurance") {
        dispatch(
          getCustomerTravelProposalsListByCustomerId({
            page: customerTravelProposalsListCustomPagination?.page,
            size: customerTravelProposalsListCustomPagination?.size,
            id: customerId,
            search: payload?.name,
          })
        );
      }
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  useEffect(() => {
    getCustomerProposalsListFilterHandler();
    return () => {
      dispatch(
        setCustomerProposalsListCustomPagination({
          page: 1,
          size: 5,
        })
      );
      dispatch(
        setCustomerHealthProposalsListCustomPagination({
          page: 1,
          size: 5,
        })
      );
      dispatch(
        setCustomerTravelProposalsListCustomPagination({
          page: 1,
          size: 5,
        })
      );
    };
  }, [dashboardChange, currentTab]);

  // Prposal page change API
  const handleProposalsPageChange = useCallback(
    (event, value) => {
      if (dashboardChange == "Motor Insurance") {
        dispatch(
          setCustomerProposalsListCustomPagination({
            page: value + 1,
            size: customerProposalsListCustomPagination?.size,
          })
        );

        dispatch(
          getCustomerProposalsListByCustomerId({
            page: value + 1,
            size: customerProposalsListCustomPagination?.size,
            id: customerId,
            search: searchProposalsFilter?.name,
          })
        );
      }
      if (dashboardChange == "Health Insurance") {
        dispatch(
          setCustomerHealthProposalsListCustomPagination({
            page: value + 1,
            size: customerHealthProposalsListCustomPagination?.size,
          })
        );

        dispatch(
          getCustomerHealthProposalsListByCustomerId({
            page: value + 1,
            size: customerHealthProposalsListCustomPagination?.size,
            id: customerId,
            search: searchProposalsFilter?.name,
          })
        );
      }
      if (dashboardChange == "Travel Insurance") {
        dispatch(
          setCustomerTravelProposalsListCustomPagination({
            page: value + 1,
            size: customerTravelProposalsListCustomPagination?.size,
          })
        );

        dispatch(
          getCustomerTravelProposalsListByCustomerId({
            page: value + 1,
            size: customerTravelProposalsListCustomPagination?.size,
            id: customerId,
            search: searchProposalsFilter?.name,
          })
        );
      }
    },
    [
      customerProposalsListCustomPagination?.size,
      customerHealthProposalsListCustomPagination?.size,
      customerTravelProposalsListCustomPagination?.size,
    ]
  );

  // Proposal rows per page change API
  const handleProposalsRowsPerPageChange = useCallback(
    (event) => {
      if (dashboardChange == "Motor Insurance") {
        dispatch(
          setCustomerProposalsListCustomPagination({
            page: 1,
            size: event.target.value,
          })
        );

        dispatch(
          getCustomerProposalsListByCustomerId({
            page: 1,
            size: event.target.value,
            id: customerId,
            search: searchProposalsFilter?.name,
          })
        );
      }
      if (dashboardChange == "Health Insurance") {
        dispatch(
          setCustomerHealthProposalsListCustomPagination({
            page: 1,
            size: event.target.value,
          })
        );

        dispatch(
          getCustomerHealthProposalsListByCustomerId({
            page: 1,
            size: event.target.value,
            id: customerId,
            search: searchProposalsFilter?.name,
          })
        );
      }
      if (dashboardChange == "Travel Insurance") {
        dispatch(
          setCustomerTravelProposalsListCustomPagination({
            page: 1,
            size: event.target.value,
          })
        );

        dispatch(
          getCustomerTravelProposalsListByCustomerId({
            page: 1,
            size: event.target.value,
            id: customerId,
            search: searchProposalsFilter?.name,
          })
        );
      }
    },
    [
      customerProposalsListCustomPagination?.page,
      customerHealthProposalsListCustomPagination?.size,
      customerTravelProposalsListCustomPagination?.size,
    ]
  );
  // proposals filter end

  const handleTabsChange = (event, value) => {
    policyListFilter.current = false;
    proposalsListFilter.current = false;
    setCurrentTab(value);
  };

  const pdfViewer = (e, index) => {
    e.preventDefault();

    let url = "";

    // Document view url bassed on documents response / open in new tab.
    if (index === 1) {
      const registrationCardPath = customerDetails?.data?.customer?.cars[0]?.registrationCardP?.path;
      url = baseURL + "/" + registrationCardPath;
    } else if (index === 2) {
      const drivingLicensePath = customerDetails?.data?.customer?.drivingLicenseP?.path;
      url = baseURL + "/" + drivingLicensePath;
    } else {
      const emiratesIdPath = customerDetails?.data?.customer?.emiratesIdP?.path;
      url = baseURL + "/" + emiratesIdPath;
    }

    if (url === "" || url.includes("https://esanad-api.opash.in/undefined")) {
      toast.error("Invalid index or missing data");
      return;
    }

    const filename = url.split("/").pop();
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const onPdfDownload = async (e, index) => {
    e.preventDefault();

    let url = "";

    // Document download url bassed on documents response.
    if (index === 1) {
      const registrationCardPath = customerDetails?.data?.customer?.cars[0]?.registrationCardP?.path;
      url = baseURL + "/" + registrationCardPath;
    } else if (index === 2) {
      const drivingLicensePath = customerDetails?.data?.customer?.drivingLicenseP?.path;
      url = baseURL + "/" + drivingLicensePath;
    } else {
      const emiratesIdPath = customerDetails?.data?.customer?.emiratesIdP?.path;
      url = baseURL + "/" + emiratesIdPath;
    }

    if (url === "" || url.includes("https://esanad-api.opash.in/undefined")) {
      toast.error("Invalid index or missing data");
      return;
    }

    // Download document...
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const filename = url.split("/").pop();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download PDF", error);
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          {customerDetails !== null ? (
            <>
              <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
                <Box
                  sx={{
                    display: "inline-block",
                  }}
                >
                  <NextLink href="/customers" passHref>
                    <Link
                      color="textPrimary"
                      component="a"
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">Customers</Typography>
                    </Link>
                  </NextLink>
                </Box>
              </Box>

              <Grid container justifyContent="space-between" spacing={3}>
                <Grid
                  item
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  <Avatar
                    src="/assets/avatars/avatar-anika-visser.png"
                    sx={{
                      height: 64,
                      mr: 2,
                      width: 64,
                    }}
                  >
                    {customerDetails?.data?.customer?.fullName}
                  </Avatar>

                  <div>
                    <Typography
                      variant="h5"
                      sx={{
                        marginBottom: "10px",
                      }}
                    >
                      {customerDetails?.data?.customer?.email}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">customer_id:</Typography>
                      <Chip
                        label={
                          customerDetails?.data?.customer?.customerId
                            ? customerDetails?.data?.customer?.customerId
                            : "-"
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </div>
                </Grid>
                {moduleAccess(user, "customers.update") && (
                  <Grid item sx={{ m: -1 }}>
                    <NextLink href={`/customers/${customerDetails?.data?.customer?._id}/edit`} passHref>
                      <Button component="a" endIcon={<PencilAlt fontSize="small" />} sx={{ m: 1 }} variant="contained">
                        Edit
                      </Button>
                    </NextLink>
                  </Grid>
                )}
              </Grid>

              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                sx={{ mt: 3 }}
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>

              <Divider />

              <Box sx={{ mt: 3 }}>
                {currentTab === "details" && (
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      mb: 3,
                    }}
                  >
                    <Grid container columnSpacing={4}>
                      <Grid item xs={12} sm={9}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "600",
                            fontSize: "18px",
                            display: "inline-block",
                            color: "#60176F",
                            px: "14px",
                            mt: 1,
                          }}
                        >
                          Customer details
                        </Typography>

                        <List>
                          <Grid container columnSpacing={4}>
                            <Grid item xs={12} md={6}>
                              <ListItemComp label={"Full name"} value={customerDetails?.data?.customer?.fullName} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <ListItemComp
                                label={"Nationality"}
                                value={
                                  customerDetails?.data?.customer?.nationality
                                    ? customerDetails?.data?.customer?.nationality
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>

                          <Divider />

                          <Grid container columnSpacing={4}>
                            <Grid item xs={12} md={6}>
                              <ListItemComp label={"Email"} value={customerDetails?.data?.customer?.email} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <ListItemComp
                                label={"Role"}
                                value={
                                  customerDetails?.data?.customer?.role ? customerDetails?.data?.customer?.role : ""
                                }
                              />
                            </Grid>
                          </Grid>

                          <Divider />

                          <Grid container columnSpacing={4}>
                            <Grid item xs={12} md={6}>
                              <ListItemComp
                                label={"Date of birth"}
                                value={
                                  !!customerDetails?.data?.customer?.dateOfBirth
                                    ? format(parseISO(customerDetails?.data?.customer?.dateOfBirth), "dd-MM-yyyy")
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              {" "}
                              <ListItemComp
                                label={"Mobile Number"}
                                value={
                                  customerDetails?.data?.customer?.mobileNumber
                                    ? `+971 ${customerDetails?.data?.customer?.mobileNumber}`
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>

                          <Divider />

                          <Grid container columnSpacing={4}>
                            <Grid item xs={12} md={6}>
                              <ListItemComp
                                label={"Driving license no."}
                                value={
                                  customerDetails?.data?.customer?.licenceNo
                                    ? customerDetails?.data?.customer?.licenceNo
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <ListItemComp
                                label={"Driving license Issue"}
                                value={
                                  !!customerDetails?.data?.customer?.licenceIssueDate
                                    ? format(parseISO(customerDetails?.data?.customer?.licenceIssueDate), "dd-MM-yyyy")
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>

                          <Divider />

                          <Grid container columnSpacing={4}>
                            <Grid item xs={12} md={6}>
                              <ListItemComp
                                label={"Driving license expiry"}
                                value={
                                  customerDetails?.data?.customer?.licenceExpiryDate
                                    ? format(parseISO(customerDetails?.data?.customer?.licenceExpiryDate), "dd-MM-yyyy")
                                    : ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <ListItemComp
                                label={"Emirates ID Number"}
                                value={
                                  customerDetails?.data?.customer?.emiratesId
                                    ? customerDetails?.data?.customer?.emiratesId
                                    : ""
                                }
                              />
                            </Grid>
                          </Grid>
                        </List>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <List
                          sx={{
                            mb: 1,
                            fontWeight: "600",
                            fontSize: "18px",
                            display: "inline-block",
                            px: "14px",
                            mt: 5,
                          }}
                        >
                          <Grid container columnSpacing={4}>
                            <Grid item xs={12}>
                              {!!customerDetails?.data?.customer?.cars[0]?.registrationCardP?.path && (
                                <Grid container columnSpacing={2} sx={{ alignItems: "end" }}>
                                  <Grid item xs={8}>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "500",
                                        fontSize: "16px",
                                        display: "inline-block",
                                        px: "14px",
                                        mt: 1,
                                      }}
                                    >
                                      Registartion Card Pdf
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={4}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                        gap: 2,
                                        color: "#60176F",
                                      }}
                                    >
                                      <Box sx={{ cursor: "pointer" }} onClick={(e) => onPdfDownload(e, 1)}>
                                        <DownloadSvg />
                                      </Box>

                                      <Box sx={{ cursor: "pointer" }} onClick={(e) => pdfViewer(e, 1)}>
                                        <PreviewSvg />
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              )}
                            </Grid>
                            <Grid item xs={12}>
                              {customerDetails?.data?.customer?.drivingLicenseP?.path && (
                                <Grid container columnSpacing={2} sx={{ alignItems: "end" }}>
                                  <Grid item xs={8}>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "500",
                                        fontSize: "16px",
                                        display: "inline-block",
                                        px: "14px",
                                        mt: 1,
                                      }}
                                    >
                                      Driving Licence Pdf
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                        gap: 2,
                                        color: "#60176F",
                                      }}
                                    >
                                      <Box sx={{ cursor: "pointer" }} onClick={(e) => onPdfDownload(e, 2)}>
                                        <DownloadSvg />
                                      </Box>

                                      <Box sx={{ cursor: "pointer" }} onClick={(e) => pdfViewer(e, 2)}>
                                        <PreviewSvg />
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              )}
                            </Grid>

                            <Grid item xs={12}>
                              {customerDetails?.data?.customer?.emiratesIdP?.path && (
                                <Grid container columnSpacing={2} sx={{ alignItems: "end" }}>
                                  <Grid item xs={8}>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "500",
                                        fontSize: "16px",
                                        display: "inline-block",
                                        px: "14px",
                                        mt: 1,
                                      }}
                                    >
                                      Emirates Id Pdf
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                        gap: 2,
                                        color: "#60176F",
                                      }}
                                    >
                                      <Box sx={{ cursor: "pointer" }} onClick={(e) => onPdfDownload(e, 3)}>
                                        <DownloadSvg />
                                      </Box>

                                      <Box sx={{ cursor: "pointer" }} onClick={(e) => pdfViewer(e, 3)}>
                                        <PreviewSvg />
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        </List>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {currentTab === "policies" && (
                  <>
                    <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 1 }}>
                      <Chip
                        icon={<DirectionsCarIcon color="white" />}
                        label="Motor"
                        sx={{
                          height: 40,
                          borderRadius: 20,
                          fontWeight: 600,
                          backgroundColor: dashboardChange == "Motor Insurance" ? "#60176F" : "#60176F20",
                          color: dashboardChange == "Motor Insurance" ? "white" : "#60176F",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: dashboardChange == "Motor Insurance" ? "#60176F80" : "#60176F30",
                          },
                        }}
                        onClick={() => {
                          setIsDashboardChange("Motor Insurance");
                          policyListFilter.current = false;
                        }}
                      />
                      <Chip
                        icon={<LocalHospitalIcon color="white" />}
                        label="Health"
                        sx={{
                          height: 40,
                          borderRadius: 20,
                          fontWeight: 600,
                          backgroundColor: dashboardChange == "Health Insurance" ? "#60176F" : "#60176F20",
                          color: dashboardChange == "Health Insurance" ? "white" : "#60176F",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: dashboardChange == "Health Insurance" ? "#60176F80" : "#60176F30",
                          },
                        }}
                        onClick={() => {
                          setIsDashboardChange("Health Insurance");
                          policyListFilter.current = false;
                        }}
                      />
                      <Chip
                        icon={<TravelExploreIcon color="white" />}
                        label="Travel"
                        sx={{
                          height: 40,
                          borderRadius: 20,
                          fontWeight: 600,
                          backgroundColor: dashboardChange == "Travel Insurance" ? "#60176F" : "#60176F20",
                          color: dashboardChange == "Travel Insurance" ? "white" : "#60176F",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: dashboardChange == "Travel Insurance" ? "#60176F80" : "#60176F30",
                          },
                        }}
                        onClick={() => {
                          setIsDashboardChange("Travel Insurance");
                          policyListFilter.current = false;
                        }}
                      />
                    </Stack>
                    {dashboardChange == "Motor Insurance" && (
                      <CustomerPolicies
                        searchFilter={searchFilter}
                        searchFilterHandler={debounceHandler}
                        handlePageChange={handlePageChange}
                        handleRowsPerPageChange={handleRowsPerPageChange}
                        FilterDataHandler={FilterDataHandler}
                      />
                    )}
                    {dashboardChange == "Health Insurance" && (
                      <CustomerHealthPoliciesTable
                        searchFilter={searchFilter}
                        searchFilterHandler={debounceHandler}
                        handlePageChange={handlePageChange}
                        handleRowsPerPageChange={handleRowsPerPageChange}
                        FilterDataHandler={FilterDataHandler}
                      />
                    )}
                    {dashboardChange == "Travel Insurance" && (
                      <CustomerTravelPoliciesTable
                        searchFilter={searchFilter}
                        searchFilterHandler={debounceHandler}
                        handlePageChange={handlePageChange}
                        handleRowsPerPageChange={handleRowsPerPageChange}
                        FilterDataHandler={FilterDataHandler}
                      />
                    )}
                  </>
                )}

                {currentTab === "proposals" && (
                  <>
                    <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, mb: 1.5 }}>
                      <Chip
                        icon={<DirectionsCarIcon color="white" />}
                        label="Motor"
                        sx={{
                          height: 40,
                          borderRadius: 20,
                          fontWeight: 600,
                          backgroundColor: dashboardChange == "Motor Insurance" ? "#60176F" : "#60176F20",
                          color: dashboardChange == "Motor Insurance" ? "white" : "#60176F",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: dashboardChange == "Motor Insurance" ? "#60176F80" : "#60176F30",
                          },
                        }}
                        onClick={() => {
                          setIsDashboardChange("Motor Insurance");
                          proposalsListFilter.current = false;
                        }}
                      />
                      <Chip
                        icon={<LocalHospitalIcon color="white" />}
                        label="Health"
                        sx={{
                          height: 40,
                          borderRadius: 20,
                          fontWeight: 600,
                          backgroundColor: dashboardChange == "Health Insurance" ? "#60176F" : "#60176F20",
                          color: dashboardChange == "Health Insurance" ? "white" : "#60176F",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: dashboardChange == "Health Insurance" ? "#60176F80" : "#60176F30",
                          },
                        }}
                        onClick={() => {
                          setIsDashboardChange("Health Insurance");
                          proposalsListFilter.current = false;
                        }}
                      />
                      <Chip
                        icon={<TravelExploreIcon color="white" />}
                        label="Travel"
                        sx={{
                          height: 40,
                          borderRadius: 20,
                          fontWeight: 600,
                          backgroundColor: dashboardChange == "Travel Insurance" ? "#60176F" : "#60176F20",
                          color: dashboardChange == "Travel Insurance" ? "white" : "#60176F",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: dashboardChange == "Travel Insurance" ? "#60176F80" : "#60176F30",
                          },
                        }}
                        onClick={() => {
                          setIsDashboardChange("Travel Insurance");
                          proposalsListFilter.current = false;
                        }}
                      />
                    </Stack>
                    {dashboardChange == "Motor Insurance" && (
                      <CustomerQuotations
                        searchFilter={searchProposalsFilter}
                        searchFilterHandler={debounceProposalsHandler}
                        handlePageChange={handleProposalsPageChange}
                        handleRowsPerPageChange={handleProposalsRowsPerPageChange}
                        FilterDataHandler={setSearchProposalsFilter}
                      />
                    )}
                    {dashboardChange == "Health Insurance" && (
                      <CustomerHealthProposalTable
                        searchFilter={searchProposalsFilter}
                        searchFilterHandler={debounceProposalsHandler}
                        handlePageChange={handleProposalsPageChange}
                        handleRowsPerPageChange={handleProposalsRowsPerPageChange}
                        FilterDataHandler={setSearchProposalsFilter}
                      />
                    )}
                    {dashboardChange == "Travel Insurance" && (
                      <CustomerTravelProposalTable
                        searchFilter={searchProposalsFilter}
                        searchFilterHandler={debounceProposalsHandler}
                        handlePageChange={handleProposalsPageChange}
                        handleRowsPerPageChange={handleProposalsRowsPerPageChange}
                        FilterDataHandler={setSearchProposalsFilter}
                      />
                    )}
                  </>
                )}
              </Box>
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
              <AnimationLoader open={true} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

CustomerDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CustomerDetails;
