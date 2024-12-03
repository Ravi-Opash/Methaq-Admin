import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  OutlinedInput,
  TextField,
  InputAdornment,
  SvgIcon,
  Grid,
  Button,
  Popover,
  MenuList,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import format from "date-fns/format";
import { toast } from "react-toastify";
import {
  addMilliseconds,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { FilterIcon } from "src/Icons/FilterIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SalesAgentFilter = ({
  searchFilter,
  searchFilterHandler,
  inputPlaceHolder,
  FilterDataHandler,
  statusOptions,
  onMonthSelect,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [monthArray, setMonthArray] = useState([]);

  // console.log(monthArray, "monthArray");

  useEffect(() => {
    const result = eachMonthOfInterval({
      start: startOfYear(new Date()),
      end: endOfDay(new Date()),
    });

    let months = [];
    result.forEach((month, index) => {
      //   let monday = startOfDay(addMilliseconds(new Date(month), 24 * 60 * 60 * 1000)).toISOString();
      //   if (index == 0) {
      //     monday = startOfDay(startOfYear(new Date())).toISOString();
      //   }
      const startDateOfMonth = startOfMonth(new Date(month)).toISOString();
      const endDateOfMonth = endOfDay(endOfMonth(new Date(month))).toISOString();
      months.push({
        name: format(new Date(month), "LLLL"),
        value: { startDate: startDateOfMonth, endDate: endDateOfMonth },
      });
    });

    setMonthArray(months);
  }, []);

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: "inline-block", width: "100%" }}>
            <OutlinedInput
              defaultValue={searchFilter?.name || ""}
              fullWidth
              name="name"
              placeholder={inputPlaceHolder || ""}
              onChange={(e) => searchFilterHandler(e.target.name, e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon color="action" fontSize="small">
                    <MagnifyingGlassIcon />
                  </SvgIcon>
                </InputAdornment>
              }
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box sx={{ display: "flex" }}>
            <Grid container spacing={2}>
              <Grid item xs={0} sm={0} md={2} />

              <Grid item xs={12} sm={4} md={2.5}>
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

              <Grid item xs={12} sm={4} md={2.5}>
                <DatePicker
                  inputFormat="dd-MM-yyyy"
                  label="To"
                  onChange={(value) => {
                    if (value != "Invalid Date" && value) {
                      setEndDate(value.toISOString());
                      // const newDate = addMilliseconds(
                      //   new Date(value),
                      //   24 * 60 * 60 * 1000 - 1
                      // );
                      FilterDataHandler("endDate", value.toISOString());
                    }
                  }}
                  renderInput={(params) => <TextField name="endDate" fullWidth {...params} error={false} />}
                  value={endDate}
                />
              </Grid>

              <Grid item xs={12} sm={2} md={1}>
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
                        searchFilterHandler();
                      }
                    }}
                    disabled={searchFilter?.fromDate === "" || searchFilter?.toDate === ""}
                  >
                    Filter
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <TextField
                  fullWidth
                  label="Status"
                  name="status"
                  onChange={(e) => {
                    searchFilterHandler(e.target.name, e.target.value);
                  }}
                  select
                  SelectProps={{ native: true }}
                  value={searchFilter?.status}
                >
                  {statusOptions.map((option) => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
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
                    <Accordion defaultExpanded sx={{ boxShadow: "none !important" }}>
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
                        Month wise
                      </AccordionSummary>
                      <AccordionDetails>
                        {monthArray?.map((item, idx) => {
                          return (
                            <MenuItem
                              key={idx}
                              onClick={() => {
                                onMonthSelect(item?.value);
                                setEndDate(item?.value?.endDate);
                                setStartDate(item?.value?.startDate);
                                // FilterDataHandler("startDate", item?.value?.startDate);
                                // FilterDataHandler("endDate", item?.value?.endDate);
                                // searchFilterHandler();
                                handleClose();
                              }}
                            >
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
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default SalesAgentFilter;
