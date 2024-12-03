"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Divider, Box, Chip, Avatar } from "@mui/material";
import { BorderLinearProgress } from "./BorderLinearProgress";
import { companyProposals } from "./dashboradInfo";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ComapnayProposals = ({
  dateStatus,
  policies,
  proposals,
  insuranceCompanies,
  policyCount = 0,
  proposalCount = 0,
}) => {
  const [maxLength, setMaxLength] = useState(4);

  useEffect(() => {
    if (proposals && proposals?.length > 0) {
      const array = [...proposals];
      array.sort(function (a, b) {
        return a - b;
      });
      setMaxLength(array[array?.length - 1]);
    }
  }, proposals);

  const barChartData = {
    series: [
      {
        name: "Proposals",
        data: proposals || [],
      },
      {
        name: "Policy",
        data: policies || [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
      },
      title: {
        text: "Insurance company proposal and policies",
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 30,
        floating: false,
        style: {
          fontSize: "1.125rem",
          fontWeight: 700,
          fontFamily: "Inter",
          color: "#111927",
        },
      },
      subtitle: {
        text: `(${dateStatus})`,
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 40,
        floating: false,
        style: {
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Inter",
          color: "#707070",
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      colors: ["#6f2e7d", "#bb9dc2"],
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: insuranceCompanies || [],
        labels: {
          style: {
            fontSize: "14px",
            fontFamily: "Inter",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
        labels: {
          style: {
            fontSize: "14px",
            fontFamily: "Inter",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        fontSize: '14px',
        fontFamily: 'Inter',
        fontWeight: 600,
      },
    },
  };

  return (
    <>
      <Card
        sx={{
          padding: "1rem",
          width: "full",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <ReactApexChart
          options={barChartData?.options}
          series={barChartData?.series}
          type="bar"
          height={800}
          width="100%"
        />
      </Card>
    </>
  );
};

export default ComapnayProposals;
