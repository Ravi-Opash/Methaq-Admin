"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, CircularProgress, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { numberToMonth } from "src/utils/numberToMonth";
import { Box } from "@mui/system";
import { dateToShortDate } from "src/utils/dateToShortDate";
import { eachDayOfInterval, format, startOfMonth, subMonths } from "date-fns";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const SalesMovement = ({ dateStatus, data, changeSalesMovmentHandler, calendar, totalSalesMovementListLoader }) => {
  const theme = useTheme();
  const [policyCount, setPolicyCount] = useState([]);
  const [months, setmonths] = useState([]);

  useEffect(() => {
    if (data?.length > 0) {
      let aa = [];
      let bb = [];

      let arr = [];

      if (calendar == "day") {
        const lastSixMonthDates = eachDayOfInterval({
          start: new Date(startOfMonth(subMonths(new Date(), 5))),
          end: new Date(),
        });

        lastSixMonthDates?.map((date) => {
          const formatedDate = format(date, "yyyy-MM-dd");
          const match = [...data]?.find((i) => i?._id == formatedDate);
          arr?.push({ _id: date, count: match?.count || 0 });
        });
      } else {
        arr = data;
      }

      arr?.map((ele) => {
        if (calendar == "day") {
          aa?.push(ele?._id);
        } else {
          aa?.push(numberToMonth(ele?._id));
        }
        bb?.push(ele?.count);
      });
      setPolicyCount(bb);
      setmonths(aa);
    } else {
      setPolicyCount([]);
      setmonths([]);
    }
  }, [data]);

  const findDate = (number) => {
    const lastSixMonthDates = eachDayOfInterval({
      start: new Date(startOfMonth(subMonths(new Date(), 5))),
      end: new Date(),
    });

    return dateToShortDate(lastSixMonthDates?.at(number - 1));
  };

  var barChartData = {
    options: {
      chart: {
        fontFamily: "Inter",
        type: "line",
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        background: "#f9f9f9",
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      colors: ["#60176F", "#FF5733", "#28B463"],
      legend: {
        show: true,
        fontSize: "14px",
        fontFamily: "Inter",
        fontWeight: 600,
        position: "bottom",
      },
      stroke: {
        show: true,
        curve: calendar === "day" ? "smooth" : "straight",
        lineCap: "round",
        width: calendar === "day" ? 2 : 4,
        dashArray: 0,
      },
      title: {
        text: "Sales Movement",
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 20,
        floating: false,
        style: {
          fontSize: "1.125rem",
          fontWeight: 700,
          fontFamily: "Inter",
          color: "#111927",
        },
      },
      xaxis: {
        axisBorder: {
          color: theme.palette.divider,
          show: true,
        },
        axisTicks: {
          color: theme.palette.divider,
          show: true,
        },
        categories: months || [],
        labels: {
          formatter: function (value) {
            if (calendar === "day") {
              if ((new Date(value)?.getDate() + 1) % 15 === 1) {
                return dateToShortDate(value);
              } else {
                return "";
              }
            } else {
              return value;
            }
          },
          style: {
            colors: "#6c757d",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: {
          style: {
            color: "#6c757d",
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        labels: {
          style: {
            colors: "#6c757d",
          },
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        style: {
          fontSize: "12px",
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x:
          calendar == "day"
            ? {
                formatter: function (val) {
                  return findDate(val);
                },
              }
            : "",
      },
      grid: {
        borderColor: "#e0e0e0",
        row: {
          colors: ["transparent", "transparent"],
        },
      },
    },
    series: [
      {
        name: "No. of Policy Issued",
        data: policyCount || [],
      },
    ],
  };

  const handleMonthWise = () => {
    changeSalesMovmentHandler("month");
  };

  const handleDayWise = () => {
    changeSalesMovmentHandler("day");
  };

  return (
    <Card
      sx={{
        padding: "1rem",
        width: "full",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={handleMonthWise} sx={{ backgroundColor: calendar == "month" ? "#60176F20" : "unset" }}>
          Month Wise
        </Button>
        <Button onClick={handleDayWise} sx={{ backgroundColor: calendar == "day" ? "#60176F20" : "unset" }}>
          Day Wise
        </Button>
      </Box>
      {totalSalesMovementListLoader ? (
        <Box sx={{ height: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {" "}
          <CircularProgress />
        </Box>
      ) : (
        <ReactApexChart
          options={barChartData.options}
          series={barChartData.series}
          type="line"
          width="100%"
          height={500}
        />
      )}
    </Card>
  );
};

export default SalesMovement;
