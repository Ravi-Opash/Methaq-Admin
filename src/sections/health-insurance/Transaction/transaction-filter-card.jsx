import React, { useState } from "react";
import { Box, Card, OutlinedInput, TextField, InputAdornment, SvgIcon, Grid, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import format from "date-fns/format";
import { toast } from "react-toastify";
import { addMilliseconds } from "date-fns";

const TransactionHealthFilterCard = ({
  searchFilter,
  searchFilterHandler,
  inputPlaceHolder,
  FilterDataHandler,
  exportCSVFile,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(searchFilter?.toDate || "");
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
        <Grid item xs={12} md={2} />
        <Grid item xs={12} md={7}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: 1 }}>
            <Box sx={{ display: "flex", width: "190px" }}>
              <DatePicker
                inputFormat="dd-MM-yyyy"
                label="From"
                onChange={(value) => {
                  if (value != "Invalid Date" && value) {
                    setStartDate(value);
                    FilterDataHandler("fromDate", value.toISOString());
                  }
                }}
                renderInput={(params) => <TextField name="fromDate" fullWidth {...params} error={false} />}
                value={searchFilter?.fromDate}
              />
            </Box>

            <Box sx={{ display: "flex", width: "190px" }}>
              <DatePicker
                inputFormat="dd-MM-yyyy"
                label="To"
                onChange={(value) => {
                  if (value != "Invalid Date" && value) {
                    setEndDate(value.toISOString());
                    const newDate = addMilliseconds(new Date(value), 24 * 60 * 60 * 1000 - 1);
                    FilterDataHandler("toDate", newDate.toISOString());
                  }
                }}
                renderInput={(params) => <TextField name="toDate" fullWidth {...params} error={false} />}
                value={new Date(endDate)}
              />
            </Box>

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

            {exportCSVFile && (
              <Box>
                <Button
                  sx={{ fontSize: "14px" }}
                  variant="contained"
                  onClick={() => {
                    if (startDate > endDate) {
                      toast("Invalid selected date", {
                        type: "error",
                      });
                    } else {
                      exportCSVFile();
                    }
                  }}
                  disabled={searchFilter?.fromDate === "" || searchFilter?.toDate === ""}
                >
                  Export
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TransactionHealthFilterCard;
