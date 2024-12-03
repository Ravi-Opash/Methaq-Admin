import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { Grid, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import {
  getDashBordData,
  getOverviewData,
} from "src/sections/overview/action/overviewAction";
import ComapnayProposals from "./ComapnayProposals";
import MiniSingleBox from "../MiniSingleBox";
import {
  endOfMonth,
  endOfToday,
  endOfYear,
  endOfYesterday,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfYear,
  startOfYesterday,
  subMonths,
  subYears,
} from "date-fns";
import { endOfDay } from "date-fns";
import ComapnayPolicie from "./CompanyPolicies";
import QuoteSource from "./Quotesource";
import TimelineIcon from "@mui/icons-material/Timeline";
import Chart from "./Chart";
import AgentInfoChart from "./AgentInfoChart";
import { Box } from "@mui/system";
import { FilterIcon } from "src/Icons/FilterIcon";

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

const Dashboard = () => {
  const dispatch = useDispatch();
  //
  const [valueR, setValueR] = React.useState([null, null]);
  //
  const { overviewData } = useSelector((state) => state.overview);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [filterDateRange, setFilterDateRange] = useState({
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
  });
  const [filterText, setFilterText] = useState("");

  const handleFilterName = (filterTypeName) => {
    let startDate, endDate;

    switch (filterTypeName) {
      case "All":
        startDate = null;
        endDate = null;
        setFilterDateRange({ startDate, endDate });
        break;

      case "Today":
        startDate = startOfToday();
        endDate = endOfToday();
        setFilterDateRange({ startDate, endDate });
        break;

      case "Yesterday":
        startDate = startOfYesterday();
        endDate = endOfYesterday();
        setFilterDateRange({ startDate, endDate });
        break;

      case "Last 7 Days":
        startDate = startOfDay(Date.now() - 7 * 24 * 60 * 60 * 1000);
        endDate = endOfToday();
        setFilterDateRange({ startDate, endDate });
        break;

      case "Last 30 Days":
        startDate = startOfDay(Date.now() - 30 * 24 * 60 * 60 * 1000);
        endDate = endOfToday();
        setFilterDateRange({ startDate, endDate });
        break;

      case "This Month":
        startDate = startOfMonth(new Date());
        endDate = endOfToday();
        setFilterDateRange({ startDate, endDate });
        break;

      case "Last Month":
        [startDate, endDate] = [
          startOfMonth(subMonths(new Date(), 1)),
          endOfMonth(new Date(subMonths(new Date(), 1))),
        ];
        setFilterDateRange({ startDate, endDate });
        break;

      case "This Year":
        [startDate, endDate] = [startOfYear(new Date()), endOfToday()];
        setFilterDateRange({ startDate, endDate });
        break;

      case "Last Year":
        [startDate, endDate] = [
          startOfYear(subYears(new Date(), 1)),
          endOfYear(subYears(new Date(), 1)),
        ];
        setFilterDateRange({ startDate, endDate });
        break;

      default:
        // Set default values to today's date
        startDate: startOfDay(new Date());
        endDate: endOfDay(new Date());
        console.error(
          `Filter type "${filterTypeName}" not found. Setting default to today.`
        );
        setFilterDateRange({ startDate, endDate });
        break;
    }
    // console.log("i am start date :-", startDate);
    // console.log("i am end date :-", endDate);
    setFilterText(filterTypeName);
  };

  const getAllDashBordData = () => {
    dispatch(getDashBordData(filterDateRange))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "er");
      });
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    getAllDashBordData();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", m: 2 }}>
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
          PaperProps={{ sx: { width: 200 } }}
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
            {FilterList?.map((item, idx) => {
              return (
                <MenuItem key={idx} onClick={() => handleFilterName(item)}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "14px" }}>{item}</Typography>
                  </Box>
                </MenuItem>
              );
            })}
          </MenuList>
        </Popover>
      </Box>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ md: 12 }}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={1}>
            <Grid item xs={6} md={3}>
              <MiniSingleBox
                tittle="No. of Active Quotations"
                totalNumber={overviewData?.quotes}
                dateStatus={filterText || "this month"}
                icon={<UsersIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <MiniSingleBox
                tittle="No. of Health Insurance Whatsapp Counter"
                totalNumber={overviewData?.healthWhatsappCount}
                dateStatus={filterText || "this month"}
                icon={<WhatsAppIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <MiniSingleBox
                tittle="Leads"
                totalNumber={overviewData?.healthWhatsappCount}
                dateStatus={filterText || "this month"}
                icon={<WhatsAppIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <MiniSingleBox
                tittle="Average time to Attend"
                totalNumber={overviewData?.healthWhatsappCount}
                dateStatus={filterText || "this month"}
                icon={<TimelineIcon />}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: "100%" }}>
          <ComapnayProposals dateStatus={filterText} />
        </Grid>
        {/* <Grid item xs={12} md={6} sx={{ width: "100%" }}>
          <ComapnayPolicie dateStatus={filterText} />
        </Grid> */}
        <Grid item xs={12} sx={{ width: "100%" }}>
          <AgentInfoChart />
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: "100%" }}>
          <QuoteSource dateStatus={filterText} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: "100%" }}>
          <Chart />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
