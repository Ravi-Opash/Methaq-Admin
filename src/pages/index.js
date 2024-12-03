import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import React, { useEffect, useRef, useState } from "react";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Grid,
  Hidden,
  MenuItem,
  MenuList,
  Popover,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import {
  getAgentWiseHealthOverview,
  getAgentWiseOverview,
  getAgentWiseTravelOverview,
  getAvgAttendTimeOverview,
  getDashBordCounterData,
  getHealthAvgAttendTimeOverview,
  getHealthDashBordCounterData,
  getHealthInsuranceCompanyPolicy,
  getHealthInsuranceCompanyPoposal,
  getHealthListOfPremium,
  getHealthPolicyCommissionAnalysis,
  getHealthPomoCodeOverview,
  getHealthQuoteSource,
  getInsuranceCompanyPolicy,
  getInsuranceCompanyPoposal,
  getListOfPremium,
  getPolicyCommissionAnalysis,
  getPomoCodeOverview,
  getQuoteSource,
  getTravelDashBordCounterData,
  getTravelInsuranceCompanyPolicy,
  getTravelInsuranceCompanyPoposal,
  getTravelListOfPremium,
  getTravelQuoteSource,
  getTravelPromoCodeOverview,
  getListOfSalesMovement,
  getHealthListOfSalesMovement,
  getTravelListOfSalesMovement,
  getAgentNetCommission,
  getHealthAgentNetCommission,
  getTravelAgentNetCommission,
  getTravelPolicyCommissionAnalysis,
} from "src/sections/overview/action/overviewAction";
import {
  addMilliseconds,
  eachWeekOfInterval,
  endOfMonth,
  endOfToday,
  endOfYear,
  endOfYesterday,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfYear,
  startOfYesterday,
  subMonths,
  subYears,
} from "date-fns";
import { endOfDay } from "date-fns";
import { Box, Container, Stack } from "@mui/system";
import { FilterIcon } from "src/Icons/FilterIcon";
import { DatePicker } from "@mui/x-date-pickers";
import { toast } from "react-toastify";
import { getAllAgentlist } from "src/sections/Proposals/Action/proposalsAction";
import MotorInsuranceDashboard from "src/sections/overview/MotorDashboard/MotorInsuranceDashboard";
import HealthInsuranceDashboard from "src/sections/overview/HealthDashboard/HealthInsuranceDashboard";
import TravelInsuranceDashboard from "src/sections/overview/TravelDashboard/TravelInsuranceDashboard";
import { moduleAccess } from "src/utils/module-access";

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px !important",
    marginTop: "5px !important",
  },
  fontSize: "16px !important",
  fontWeight: 600,
  color: "#707070",
}));

const FilterList = [
  "All",
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "This Year",
  "Last Year",
];

const Page = () => {
  const dispatch = useDispatch();
  const [dashboardChange, setIsDashboardChange] = useState("Motor Insurance");
  const [weekArray, setWeekArray] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const { loginUserData: user } = useSelector((state) => state.auth);
  const [calendar, setCalendar] = useState("month");

  const isPraktora = localStorage.getItem("isPraktora") ? JSON.parse(localStorage.getItem("isPraktora")) : false;

  const initial = useRef(false);

  useEffect(() => {
    // This effect runs only once when the component is mounted
    if (initial.current) {
      return;
    }
    initial.current = true;

    // Fetching the agent list when the component mounts
    dispatch(getAllAgentlist({}))
      .unwrap()
      .then((res) => {
        setAgentList(res?.data);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  // State for handling the popover
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Handle popover click
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing of the popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Boolean to check if the popover is open
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined; // Conditional ID based on popover state

  // State for filter date range and filter text
  const [filterDateRange, setFilterDateRange] = useState({
    startDate: startOfDay(new Date()), // Default to today
    endDate: endOfDay(new Date()), // Default to today
    agentId: !moduleAccess(user, "dashboard.read") ? user?.moduleAccessId?.userId || user?._id : "",
    moduleAccessRole: "All", // Default filter for role
    isPraktora: isPraktora,
  });

  // States for individual filter controls
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [filterText, setFilterText] = useState("Today"); // Default filter text

  // Handles changing the filter based on the selected filter name
  const handleFilterName = (filterTypeName, value) => {
    if (value) {
      // When custom date range is selected
      setEndDate(value?.endDate);
      setStartDate(value?.startDate);

      // Update the dashboard data with the new filter values
      getAllDashBordData({ ...filterDateRange, ...value }, dashboardChange);

      // Update the filter range state
      setFilterDateRange({ ...filterDateRange, ...value });

      // Format the filter text for display
      setFilterText(
        `${filterTypeName} | ${format(parseISO(value?.startDate), "dd LLL")} - ${format(
          parseISO(value?.endDate),
          "dd LLL"
        )}`
      );
      handleClose(); // Close the popover after selection
      return;
    } else {
      let startDate, endDate;

      // Clear previous date range values
      setEndDate("");
      setStartDate("");

      // Switch case for predefined filter types
      switch (filterTypeName) {
        case "All":
          startDate = null;
          endDate = null;
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        case "Today":
          startDate = startOfToday();
          endDate = endOfToday();
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        case "Yesterday":
          startDate = startOfYesterday();
          endDate = endOfYesterday();
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        case "Last 7 Days":
          startDate = startOfDay(Date.now() - 7 * 24 * 60 * 60 * 1000);
          endDate = endOfToday();
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        case "Last 30 Days":
          startDate = startOfDay(Date.now() - 30 * 24 * 60 * 60 * 1000);
          endDate = endOfToday();
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        case "This Month":
          startDate = startOfMonth(new Date());
          endDate = endOfToday();
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        case "Last Month":
          [startDate, endDate] = [
            startOfMonth(subMonths(new Date(), 1)),
            endOfMonth(new Date(subMonths(new Date(), 1))),
          ];
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        case "This Year":
          [startDate, endDate] = [startOfYear(new Date()), endOfToday()];
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        case "Last Year":
          [startDate, endDate] = [startOfYear(subYears(new Date(), 1)), endOfYear(subYears(new Date(), 1))];
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;

        default:
          // Set default values to today's date
          startDate: startOfDay(new Date());
          endDate: endOfDay(new Date());
          console.error(`Filter type "${filterTypeName}" not found. Setting default to today.`);
          setFilterDateRange({
            startDate,
            endDate,
            agentId: filterDateRange?.agentId,
            moduleAccessRole: filterDateRange?.moduleAccessRole,
          });
          break;
      }

      // Update the end and start date states
      setEndDate(endDate);
      setStartDate(startDate);

      // Update filter text
      setFilterText(filterTypeName);

      // Fetch dashboard data with the updated filter values
      getAllDashBordData(
        {
          startDate,
          endDate,
          agentId: filterDateRange?.agentId,
          moduleAccessRole: filterDateRange?.moduleAccessRole,
          isPraktora: isPraktora,
        },
        dashboardChange
      );
      handleClose();
    }
  };

  // Function to fetch dashboard data based on the selected filter range and type
  const getAllDashBordData = (dateValues, dashboardType) => {
    // Logic to fetch data based on the "Motor Insurance" type
    if (dashboardType == "Motor Insurance") {
      dispatch(getDashBordCounterData(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });
      // Not being used anymore
      // dispatch(getInsuranceCompanyPolicy(dateValues))
      //   .unwrap()
      //   .then((res) => {})
      //   .catch((err) => {
      //     console.log(err, "err");
      //   });
      // Moved this to on click Company API
      // dispatch(getInsuranceCompanyPoposal(dateValues))
      //   .unwrap()
      //   .then((res) => {})
      //   .catch((err) => {
      //     console.log(err, "err");
      //   });
      dispatch(getQuoteSource(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getPomoCodeOverview(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getAgentWiseOverview(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getAvgAttendTimeOverview(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getListOfPremium(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getListOfSalesMovement({ ...dateValues, timePeriod: calendar }))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getPolicyCommissionAnalysis(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      if (dateValues?.agentId) {
        dispatch(getAgentNetCommission(dateValues))
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.log(err, "err");
          });
      }
    }

    // Logic to fetch data for "Health Insurance"
    if (dashboardType == "Health Insurance") {
      dispatch(getHealthDashBordCounterData(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });
      // Not used
      // dispatch(getHealthInsuranceCompanyPolicy(dateValues))
      //   .unwrap()
      //   .then((res) => {})
      //   .catch((err) => {
      //     console.log(err, "err");
      //   });

      // Moved to onclick company
      // dispatch(getHealthInsuranceCompanyPoposal(dateValues))
      //   .unwrap()
      //   .then((res) => {})
      //   .catch((err) => {
      //     console.log(err, "err");
      //   });
      dispatch(getAgentWiseHealthOverview(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getHealthListOfPremium(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getHealthAvgAttendTimeOverview(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getHealthPomoCodeOverview(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getHealthQuoteSource(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getHealthPolicyCommissionAnalysis(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getHealthListOfSalesMovement({ ...dateValues, timePeriod: calendar }))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      if (dateValues?.agentId) {
        dispatch(getHealthAgentNetCommission(dateValues))
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.log(err, "err");
          });
      }
    }

    // Logic to fetch data for "Travel Insurance"
    if (dashboardType == "Travel Insurance") {
      dispatch(getTravelDashBordCounterData(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });
      // Not used
      // dispatch(getTravelInsuranceCompanyPolicy(dateValues))
      //   .unwrap()
      //   .then((res) => {})
      //   .catch((err) => {
      //     console.log(err, "err");
      //   });
      dispatch(getTravelInsuranceCompanyPoposal(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getTravelQuoteSource(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getAgentWiseTravelOverview(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getTravelListOfPremium(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getTravelPromoCodeOverview(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getTravelPolicyCommissionAnalysis(dateValues))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      dispatch(getTravelListOfSalesMovement({ ...dateValues, timePeriod: calendar }))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });

      if (dateValues?.agentId) {
        dispatch(getTravelAgentNetCommission(dateValues))
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            console.log(err, "err");
          });
      }
    }
  };

  const initialized = useRef(false);

  useEffect(() => {
    // This effect will only run once when the component mounts.
    if (initialized.current) {
      return;
    }

    initialized.current = true; // Mark the component as initialized.
    getAllDashBordData(filterDateRange, dashboardChange);
  }, []);

  const FilterDataHandler = (name, value) => {
    // Update the filterDateRange state whenever a filter value is changed.
    setFilterDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // This effect runs once to calculate the weeks for the current year.
    const result = eachWeekOfInterval({
      start: startOfYear(new Date(), { weekStartsOn: 1 }),
      end: endOfDay(new Date()),
    });

    let weeks = [];
    result.forEach((week, index) => {
      // Calculate the start and end date for each week.
      let monday = startOfDay(addMilliseconds(new Date(week), 24 * 60 * 60 * 1000)).toISOString(); // Start of the week (Monday).
      if (index == 0) {
        monday = startOfDay(startOfYear(new Date())).toISOString(); // Special handling for the first week, using the start of the year.
      }
      const sunday = endOfDay(addMilliseconds(new Date(week), 7 * 24 * 60 * 60 * 1000)).toISOString(); // End of the week (Sunday).

      // Add the week details to the weeks array.
      weeks.push({
        name: `Week ${index + 1}`,
        value: { startDate: monday, endDate: sunday },
      });
    });

    // Set the calculated weeks into the state (weekArray).
    setWeekArray(weeks);
  }, []);

  const changeSalesMovmentHandler = (value) => {
    // This function handles changes in the sales movement time period.
    setCalendar(value);

    // Dispatch the sales movement data fetching action with the updated filter and calendar value.
    dispatch(getListOfSalesMovement({ ...filterDateRange, timePeriod: value }))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const changeHealthSalesMovmentHandler = (value) => {
    // This function handles changes in the health insurance sales movement time period.
    setCalendar(value);

    // Dispatch the health sales movement data fetching action with the updated filter and calendar value.
    dispatch(getHealthListOfSalesMovement({ ...filterDateRange, timePeriod: value }))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const changeTravelSalesMovmentHandler = (value) => {
    // This function handles changes in the travel insurance sales movement time period.
    setCalendar(value);

    // Dispatch the travel insurance sales movement data fetching action with the updated filter and calendar value.
    dispatch(getTravelListOfSalesMovement({ ...filterDateRange, timePeriod: value }))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
      });
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" spacing={4}>
              <Stack spacing={1} sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Typography variant="h4" sx={{ fontSize: { sm: "2rem", xs: "1.2rem" } }}>
                  {dashboardChange == "Motor Insurance"
                    ? "Motor Dashboard"
                    : dashboardChange == "Health Insurance"
                    ? "Health Dashboard"
                    : dashboardChange == "Travel Insurance"
                    ? "Travel Dashboard"
                    : "Dashboard"}{" "}
                </Typography>
                <Span>{`( ${filterText} )`}</Span>
              </Stack>
              <Stack sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                {/* Chip for Motor Insurance */}
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
                    // Set the dashboard to Motor Insurance and clear moduleAccessRole filter
                    setIsDashboardChange("Motor Insurance");
                    setFilterDateRange({ ...filterDateRange, moduleAccessRole: "" });
                    getAllDashBordData({ ...filterDateRange, moduleAccessRole: "" }, "Motor Insurance");
                  }}
                />

                {/* Chip for Health Insurance */}
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
                    // Set the dashboard to Health Insurance and clear moduleAccessRole filter
                    setIsDashboardChange("Health Insurance");
                    setFilterDateRange({ ...filterDateRange, moduleAccessRole: "" });
                    getAllDashBordData({ ...filterDateRange, moduleAccessRole: "" }, "Health Insurance");
                  }}
                />

                {/* Chip for Travel Insurance */}
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
                    // Set the dashboard to Travel Insurance and clear moduleAccessRole filter
                    setIsDashboardChange("Travel Insurance");
                    setFilterDateRange({ ...filterDateRange, moduleAccessRole: "" });
                    getAllDashBordData({ ...filterDateRange, moduleAccessRole: "" }, "Travel Insurance");
                  }}
                />
              </Stack>
            </Stack>
          </Stack>

          <Grid container spacing={2} mt={1}>
            {/* Agent List */}
            <Grid item xs={12} sm={5} md={2} xl={2}>
              <TextField
                fullWidth
                label="Agents"
                name="agent"
                onChange={(e) => {
                  getAllDashBordData(
                    {
                      ...filterDateRange,
                      agentId: e.target.value,
                      moduleAccessRole: "All",
                    },
                    dashboardChange
                  );
                  setFilterDateRange({
                    ...filterDateRange,
                    agentId: e.target.value,
                    moduleAccessRole: "All",
                  });
                }}
                disabled={!moduleAccess(user, "dashboard.read")}
                select
                SelectProps={{ native: true }}
                value={filterDateRange?.agentId}
              >
                <option value=""></option>
                <option value="">All</option>
                {agentList.map((agent) => {
                  if (!agent?.userId?._id) {
                    return;
                  }
                  return <option value={agent?.userId?._id}>{agent?.userId?.fullName}</option>;
                })}
              </TextField>
            </Grid>

            {/* Buttons */}

            <Grid item xs={12} sm={6} md={4} xl={4.5} sx={{ display: "flex", alignItems: "center" }}>
              <Hidden xlDown>
                {/* Render buttons only for "Motor Insurance" dashboard if user has read access */}
                {dashboardChange == "Motor Insurance" && moduleAccess(user, "dashboard.read") && (
                  <Stack spacing={3}>
                    <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" spacing={4}>
                      <Stack sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                        {/* Chip for "All" module access role */}
                        <Chip
                          label="All"
                          sx={{
                            height: 40,
                            borderRadius: 1,
                            fontWeight: 600,
                            backgroundColor: filterDateRange?.moduleAccessRole == "All" ? "#60176F" : "#60176F20",
                            color: filterDateRange?.moduleAccessRole == "All" ? "white" : "#60176F",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: filterDateRange?.moduleAccessRole == "All" ? "#60176F80" : "#60176F30",
                            },
                          }}
                          onClick={() => {
                            // Update filterDateRange and call getAllDashBordData with new filters
                            setFilterDateRange({ ...filterDateRange, moduleAccessRole: "All", agentId: "" });
                            getAllDashBordData(
                              { ...filterDateRange, moduleAccessRole: "All", agentId: "" },
                              dashboardChange
                            );
                          }}
                        />

                        {/* Chip for "Agent" module access role */}
                        <Chip
                          label="Agent"
                          sx={{
                            height: 40,
                            borderRadius: 1,
                            fontWeight: 600,
                            backgroundColor: filterDateRange?.moduleAccessRole == "Agent" ? "#60176F" : "#60176F20",
                            color: filterDateRange?.moduleAccessRole == "Agent" ? "white" : "#60176F",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: filterDateRange?.moduleAccessRole == "Agent" ? "#60176F80" : "#60176F30",
                            },
                          }}
                          onClick={() => {
                            // Update filterDateRange and call getAllDashBordData with new filters
                            setFilterDateRange({ ...filterDateRange, moduleAccessRole: "Agent", agentId: "" });
                            getAllDashBordData(
                              { ...filterDateRange, moduleAccessRole: "Agent", agentId: "" },
                              dashboardChange
                            );
                          }}
                        />

                        {/* Chip for "Sales Agent" module access role */}
                        <Chip
                          label="Sales Agent"
                          sx={{
                            height: 40,
                            borderRadius: 1,
                            fontWeight: 600,
                            backgroundColor:
                              filterDateRange?.moduleAccessRole == "Sales Agent" ? "#60176F" : "#60176F20",
                            color: filterDateRange?.moduleAccessRole == "Sales Agent" ? "white" : "#60176F",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor:
                                filterDateRange?.moduleAccessRole == "Sales Agent" ? "#60176F80" : "#60176F30",
                            },
                          }}
                          onClick={() => {
                            // Update filterDateRange and call getAllDashBordData with new filters
                            setFilterDateRange({ ...filterDateRange, moduleAccessRole: "Sales Agent", agentId: "" });
                            getAllDashBordData(
                              { ...filterDateRange, moduleAccessRole: "Sales Agent", agentId: "" },
                              dashboardChange
                            );
                          }}
                        />

                        {/* Conditionally render the "My Team" chip for supervisors */}
                        {user?.moduleAccessId?.isSupervisor && (
                          <Chip
                            label="My Team"
                            sx={{
                              height: 40,
                              borderRadius: 1,
                              fontWeight: 600,
                              backgroundColor: filterDateRange?.moduleAccessRole == user?._id ? "#60176F" : "#60176F20",
                              color: filterDateRange?.moduleAccessRole == user?._id ? "white" : "#60176F",
                              padding: "10px",
                              "&:hover": {
                                backgroundColor:
                                  filterDateRange?.moduleAccessRole == user?._id ? "#60176F80" : "#60176F30",
                              },
                            }}
                            onClick={() => {
                              // Set filterDateRange to "My Team" role and call getAllDashBordData with new filters
                              setFilterDateRange({ ...filterDateRange, moduleAccessRole: user?._id, agentId: "" });
                              getAllDashBordData(
                                { ...filterDateRange, moduleAccessRole: user?._id, agentId: "" },
                                dashboardChange
                              );
                            }}
                          />
                        )}

                        {/* Conditionally render the Team Of dropdown for Admin role */}
                        {user?.role == "Admin" && (
                          <TextField
                            sx={{ width: { lg: 200, xl: 120 } }}
                            label="Team Of"
                            name="team"
                            onChange={(e) => {
                              // Update filterDateRange and call getAllDashBordData with new filters
                              getAllDashBordData(
                                {
                                  ...filterDateRange,
                                  moduleAccessRole: e.target.value,
                                },
                                dashboardChange
                              );
                              setFilterDateRange({
                                ...filterDateRange,
                                moduleAccessRole: e.target.value,
                              });
                            }}
                            disabled={!moduleAccess(user, "dashboard.read")}
                            select
                            SelectProps={{ native: true }}
                            value={
                              filterDateRange?.moduleAccessRole != "All" ||
                              filterDateRange?.moduleAccessRole != "Sales Agent" ||
                              filterDateRange?.moduleAccessRole != "Agent"
                                ? filterDateRange?.moduleAccessRole
                                : ""
                            }
                          >
                            <option value=""></option>
                            {/* Map over the agent list and display supervisors as options */}
                            {agentList
                              ?.filter((i) => i?.isSupervisor)
                              .map((agent) => {
                                if (!agent?.userId?._id) {
                                  return;
                                }
                                return <option value={agent?.userId?._id}>{agent?.userId?.fullName}</option>;
                              })}
                          </TextField>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                )}
              </Hidden>
            </Grid>

            {/* From date  */}
            <Grid item xs={12} sm={4} md={2}>
              <Box sx={{ display: "flex" }}>
                <DatePicker
                  inputFormat="dd-MM-yyyy"
                  label="From"
                  onChange={(value) => {
                    if (value != "Invalid Date" && value) {
                      setStartDate(value.toISOString());
                      FilterDataHandler("startDate", value.toISOString());
                    }
                  }}
                  renderInput={(params) => <TextField name="startDate" fullWidth {...params} error={false} />}
                  value={startDate}
                />
              </Box>
            </Grid>

            {/* To date  */}
            <Grid item xs={12} sm={4} md={2}>
              <DatePicker
                inputFormat="dd-MM-yyyy"
                label="To"
                onChange={(value) => {
                  if (value != "Invalid Date" && value) {
                    setEndDate(value.toISOString());
                    FilterDataHandler("endDate", value.toISOString());
                  }
                }}
                renderInput={(params) => <TextField name="endDate" fullWidth {...params} error={false} />}
                value={endDate}
              />
            </Grid>

            {/* Filter Button  */}
            <Grid item xs={6} sm={2} md={1} xl={0.75}>
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    if (startDate > endDate) {
                      toast("Invalid selected date", {
                        type: "error",
                      });
                    } else {
                      getAllDashBordData(filterDateRange, dashboardChange);
                      setFilterText(
                        `${format(parseISO(filterDateRange?.startDate), "dd LLL yyyy")} - ${format(
                          parseISO(filterDateRange?.endDate),
                          "dd LLL yyyy"
                        )}`
                      );
                    }
                  }}
                  disabled={startDate === "" || endDate === ""}
                >
                  Filter
                </Button>
              </Box>
            </Grid>

            {/* Filter option day wise  */}
            <Grid
              item
              xs={6}
              sm={1}
              md={1}
              xl={0.75}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  height: 40,
                  width: 40,
                  background: "#60176F",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleClick}
              >
                <FilterIcon sx={{ color: "white" }} />
              </Box>
              <Popover
                id={id}
                anchorEl={anchorEl}
                anchorOrigin={{
                  horizontal: "left",
                  vertical: "bottom",
                }}
                onClose={handleClose}
                open={open}
                PaperProps={{ sx: { width: 200, maxHeight: 480 } }}
              >
                <MenuList
                  disablePadding
                  dense
                  sx={{
                    p: "8px",
                    "& > *": {
                      borderRadius: 1,
                    },
                  }}
                >
                  <Accordion sx={{ boxShadow: "none !important" }} defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{
                        mb: "0 !important",
                        "& .MuiAccordionSummary-content.Mui-expanded": {
                          my: "5px !important",
                        },
                        minHeight: "30px !important",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Default Filters
                    </AccordionSummary>
                    <AccordionDetails>
                      {FilterList?.map((item, idx) => {
                        return (
                          <MenuItem key={idx} onClick={() => handleFilterName(item)}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography sx={{ fontSize: "14px" }}>{item}</Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion sx={{ boxShadow: "none !important" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{
                        mb: "0 !important",
                        "& .MuiAccordionSummary-content.Mui-expanded": {
                          my: "5px !important",
                        },
                        minHeight: "30px !important",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Week wise
                    </AccordionSummary>
                    <AccordionDetails>
                      {weekArray?.map((item, idx) => {
                        return (
                          <MenuItem key={idx} onClick={() => handleFilterName(item?.name, item?.value)}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography sx={{ fontSize: "14px" }}>{item?.name}</Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                </MenuList>
              </Popover>
            </Grid>

            {/* Button Section for filtering the dashboard */}
            <Hidden xlUp>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                {/* Render buttons only for "Motor Insurance" dashboard if user has read access */}
                {dashboardChange == "Motor Insurance" && moduleAccess(user, "dashboard.read") && (
                  <Stack spacing={3}>
                    <Stack direction={{ md: "row", xs: "column" }} justifyContent="space-between" spacing={4}>
                      <Stack sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                        {/* Chip for "All" module access role */}
                        <Chip
                          label="All"
                          sx={{
                            height: 40,
                            "& .MuiChip-label": { fontSize: 12 },
                            borderRadius: 1,
                            fontWeight: 600,
                            backgroundColor: filterDateRange?.moduleAccessRole == "All" ? "#60176F" : "#60176F20",
                            color: filterDateRange?.moduleAccessRole == "All" ? "white" : "#60176F",
                            padding: "5px",
                            "&:hover": {
                              backgroundColor: filterDateRange?.moduleAccessRole == "All" ? "#60176F80" : "#60176F30",
                            },
                          }}
                          onClick={() => {
                            // Update filterDateRange and call getAllDashBordData with new filters
                            setFilterDateRange({ ...filterDateRange, moduleAccessRole: "All", agentId: "" });
                            getAllDashBordData(
                              { ...filterDateRange, moduleAccessRole: "All", agentId: "" },
                              dashboardChange
                            );
                          }}
                        />

                        {/* Chip for "Agent" module access role */}
                        <Chip
                          label="Agent"
                          sx={{
                            height: 40,
                            "& .MuiChip-label": { fontSize: 12 },
                            borderRadius: 1,
                            fontWeight: 600,
                            backgroundColor: filterDateRange?.moduleAccessRole == "Agent" ? "#60176F" : "#60176F20",
                            color: filterDateRange?.moduleAccessRole == "Agent" ? "white" : "#60176F",
                            padding: "5px",
                            "&:hover": {
                              backgroundColor: filterDateRange?.moduleAccessRole == "Agent" ? "#60176F80" : "#60176F30",
                            },
                          }}
                          onClick={() => {
                            // Update filterDateRange and call getAllDashBordData with new filters
                            setFilterDateRange({ ...filterDateRange, moduleAccessRole: "Agent", agentId: "" });
                            getAllDashBordData(
                              { ...filterDateRange, moduleAccessRole: "Agent", agentId: "" },
                              dashboardChange
                            );
                          }}
                        />

                        {/* Chip for "Sales Agent" module access role */}
                        <Chip
                          label="Sales Agent"
                          sx={{
                            height: 40,
                            "& .MuiChip-label": { fontSize: 12 },
                            borderRadius: 1,
                            fontWeight: 600,
                            backgroundColor:
                              filterDateRange?.moduleAccessRole == "Sales Agent" ? "#60176F" : "#60176F20",
                            color: filterDateRange?.moduleAccessRole == "Sales Agent" ? "white" : "#60176F",
                            padding: "5px",
                            "&:hover": {
                              backgroundColor:
                                filterDateRange?.moduleAccessRole == "Sales Agent" ? "#60176F80" : "#60176F30",
                            },
                          }}
                          onClick={() => {
                            // Update filterDateRange and call getAllDashBordData with new filters
                            setFilterDateRange({ ...filterDateRange, moduleAccessRole: "Sales Agent", agentId: "" });
                            getAllDashBordData(
                              { ...filterDateRange, moduleAccessRole: "Sales Agent", agentId: "" },
                              dashboardChange
                            );
                          }}
                        />

                        {/* Conditionally render the "My Team" chip for supervisors */}
                        {user?.moduleAccessId?.isSupervisor && (
                          <Chip
                            label="My Team"
                            sx={{
                              height: 40,
                              "& .MuiChip-label": { fontSize: 12 },
                              borderRadius: 1,
                              fontWeight: 600,
                              backgroundColor: filterDateRange?.moduleAccessRole == user?._id ? "#60176F" : "#60176F20",
                              color: filterDateRange?.moduleAccessRole == user?._id ? "white" : "#60176F",
                              padding: "5px",
                              "&:hover": {
                                backgroundColor:
                                  filterDateRange?.moduleAccessRole == user?._id ? "#60176F80" : "#60176F30",
                              },
                            }}
                            onClick={() => {
                              // Set filterDateRange to "My Team" role and call getAllDashBordData with new filters
                              setFilterDateRange({ ...filterDateRange, moduleAccessRole: user?._id, agentId: "" });
                              getAllDashBordData(
                                { ...filterDateRange, moduleAccessRole: user?._id, agentId: "" },
                                dashboardChange
                              );
                            }}
                          />
                        )}

                        {/* Conditionally render the Team Of dropdown for Admin role */}
                        {user?.role == "Admin" && (
                          <TextField
                            sx={{ width: { lg: 200, xl: 120 } }}
                            label="Team Of"
                            name="team"
                            onChange={(e) => {
                              // Update filterDateRange and call getAllDashBordData with new filters
                              getAllDashBordData(
                                {
                                  ...filterDateRange,
                                  moduleAccessRole: e.target.value,
                                },
                                dashboardChange
                              );
                              setFilterDateRange({
                                ...filterDateRange,
                                moduleAccessRole: e.target.value,
                              });
                            }}
                            disabled={!moduleAccess(user, "dashboard.read")}
                            select
                            SelectProps={{ native: true }}
                            value={
                              filterDateRange?.moduleAccessRole != "All" ||
                              filterDateRange?.moduleAccessRole != "Sales Agent" ||
                              filterDateRange?.moduleAccessRole != "Agent"
                                ? filterDateRange?.moduleAccessRole
                                : ""
                            }
                          >
                            <option value=""></option>
                            {/* Map over the agent list and display supervisors as options */}
                            {agentList
                              ?.filter((i) => i?.isSupervisor)
                              .map((agent) => {
                                if (!agent?.userId?._id) {
                                  return;
                                }
                                return <option value={agent?.userId?._id}>{agent?.userId?.fullName}</option>;
                              })}
                          </TextField>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                )}
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </Box>
      {
        /* Conditionally render the Motor Insurance dashboard if the dashboardChange is set to "Motor Insurance" */
        dashboardChange === "Motor Insurance" && (
          <MotorInsuranceDashboard
            filterText={filterText}
            endDate={endDate}
            startDate={startDate}
            agentId={filterDateRange?.agentId}
            agentList={agentList}
            calendar={calendar}
            changeSalesMovmentHandler={changeSalesMovmentHandler}
          />
        )
      }

      {
        /* Conditionally render the Health Insurance dashboard if the dashboardChange is set to "Health Insurance" */
        dashboardChange === "Health Insurance" && (
          <HealthInsuranceDashboard
            filterText={filterText}
            endDate={endDate}
            startDate={startDate}
            agentId={filterDateRange?.agentId}
            agentList={agentList}
            calendar={calendar}
            changeHealthSalesMovmentHandler={changeHealthSalesMovmentHandler}
          />
        )
      }

      {
        /* Conditionally render the Travel Insurance dashboard if the dashboardChange is set to "Travel Insurance" */
        dashboardChange === "Travel Insurance" && (
          <TravelInsuranceDashboard
            filterText={filterText}
            endDate={endDate}
            startDate={startDate}
            agentId={filterDateRange?.agentId}
            agentList={agentList}
            calendar={calendar}
            changeTravelSalesMovmentHandler={changeTravelSalesMovmentHandler}
          />
        )
      }
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
