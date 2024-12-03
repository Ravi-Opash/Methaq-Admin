"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import dynamic from "next/dynamic";
import { formatNumber } from "src/utils/formatNumber";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const AveragePremium = ({ dateStatus, data, avgPremiumPerthirdPartyType, avgPremiumPerComprehensiveType }) => {
  const [sourceName, setSourceName] = useState([]);
  const [sourceCount, setSourceCount] = useState([]);
  const [countInPr, setCountPercent] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (data?.averagePremium) {
      let name = [
        `Comprehensive (${formatNumber(avgPremiumPerComprehensiveType?.totalPremium || 0)} AED)`,
        `Third Party (${formatNumber(avgPremiumPerthirdPartyType?.totalPremium || 0)} AED)`,
      ];
      let count = [avgPremiumPerComprehensiveType?.totalPremium || 0, avgPremiumPerthirdPartyType?.totalPremium || 0];
      let countPercent = [];

      let max = Math.max(...count);
      let sum = (avgPremiumPerComprehensiveType?.totalPremium || 0) + (avgPremiumPerthirdPartyType?.totalPremium || 0);

      count?.map((item) => {
        countPercent = [...countPercent, ((item * 100) / sum).toFixed(2)];
      });

      setSourceName(name);
      setSourceCount(count);
      setCountPercent(countPercent);
      setTotal(`${formatNumber(data?.averagePremium)} AED`);
    } else {
      setSourceName([]);
      setSourceCount([]);
      setCountPercent([]);
      setTotal(``);
    }
  }, [avgPremiumPerthirdPartyType, avgPremiumPerComprehensiveType]);

  const barChartData = {
    series: countInPr || [],
    options: {
      chart: {
        height: 400,
        type: "radialBar",
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            show: true,
            name: {
              fontSize: "22px",
              fontWeight: 600,
              fontFamily: "Inter",
            },
            value: {
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "Inter",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return total;
              },
              colors: "black",
            },
          },
        },
      },
      colors: ["#60176F", "#8f5c9a", "#bb9dc2", "#561463", "#a058af"],
      labels: sourceName || [],
      legend: {
        show: true,
        fontSize: "14px",
        fontFamily: "Inter",
        fontWeight: 600,
        position: "bottom",
      },
      title: {
        text: "Average Premium",
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
      // subtitle: {
      //   text: `(${dateStatus})`,
      //   align: "left",
      //   margin: 10,
      //   offsetX: 0,
      //   offsetY: 30,
      //   floating: false,
      //   style: {
      //     fontSize: "14px",
      //     fontWeight: "500",
      //     fontFamily: "Inter",
      //     color: "#707070",
      //   },
      // },
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
          type="radialBar"
          height={450}
          width="100%"
        />
      </Card>
    </>
  );
};

export default AveragePremium;
