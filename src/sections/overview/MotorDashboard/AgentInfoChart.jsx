import { Autocomplete, Card, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function AgentInfoChart({ dateStatus, agentWiseOverviewData }) {
  const [agentName, setAgentName] = useState([]);
  const [agentQuotes, setAgentQuotes] = useState([]);
  const [agentPolicy, setAgentPolicy] = useState([]);
  const [agentPremium, setAgentPremium] = useState([]);
  const [agentOverDue, setAgentOverDue] = useState([]);
  const [agentProposals, setAgentProposals] = useState([]);

  useEffect(() => {
    const agentMap = new Map();

    if (agentWiseOverviewData) {
      // Process agentQuotes
      agentWiseOverviewData?.agentQuotes?.forEach((quote) => {
        const { admin, noOfQuotes } = quote;
        const agentKey = admin?._id;

        if (!agentMap.has(agentKey)) {
          agentMap.set(agentKey, {
            fullName: admin?.fullName,
            noOfQuotes: 0,
            noOfPolicies: 0,
            totalPremium: 0,
            totalOverDue: 0,
            noOfProposals: 0,
          });
        }

        const agentInfo = agentMap.get(agentKey);
        agentInfo.noOfQuotes = noOfQuotes;
      });

      // Process agentPolicies
      agentWiseOverviewData?.agentPolicies?.forEach((policy) => {
        const { admin, noOfPolicies } = policy;
        const agentKey = admin?._id;

        if (!agentMap.has(agentKey)) {
          agentMap.set(agentKey, {
            fullName: admin?.fullName,
            noOfQuotes: 0,
            noOfPolicies: 0,
            totalPremium: 0,
            totalOverDue: 0,
            noOfProposals: 0,
          });
        }

        const agentInfo = agentMap.get(agentKey);
        agentInfo.noOfPolicies = noOfPolicies;
      });

      // Process agentPremiums
      agentWiseOverviewData?.agentPremiums?.forEach((premium) => {
        const { admin, totalPremium } = premium;
        const agentKey = admin?._id;

        if (!agentMap.has(agentKey)) {
          agentMap.set(agentKey, {
            fullName: admin?.fullName,
            noOfQuotes: 0,
            noOfPolicies: 0,
            totalPremium: 0,
            totalOverDue: 0,
            noOfProposals: 0,
          });
        }

        const agentInfo = agentMap.get(agentKey);
        agentInfo.totalPremium = Math.floor(totalPremium / 100);
      });

      // Process Call back over due
      agentWiseOverviewData?.agnetWiseCallBackDue?.forEach((overDue) => {
        const { admin, totalOverDue } = overDue;
        const agentKey = admin?._id;

        if (!agentMap.has(agentKey)) {
          agentMap.set(agentKey, {
            fullName: admin?.fullName,
            noOfQuotes: 0,
            noOfPolicies: 0,
            totalPremium: 0,
            totalOverDue: 0,
            noOfProposals: 0,
          });
        }

        const agentInfo = agentMap.get(agentKey);
        agentInfo.totalOverDue = Math.floor(totalOverDue);
      });

      // number of proposal agents
      agentWiseOverviewData?.agentProposals?.forEach((proposals) => {
        const { admin, noOfProposals } = proposals;
        if (admin) {
          const agentKey = admin?._id;

          if (!agentMap.has(agentKey)) {
            agentMap.set(agentKey, {
              fullName: admin?.fullName,
              noOfQuotes: 0,
              noOfPolicies: 0,
              totalPremium: 0,
              totalOverDue: 0,
              noOfProposals: 0,
            });
          }

          const agentInfo = agentMap.get(agentKey);
          agentInfo.noOfProposals = Math.floor(noOfProposals);
        }
      });
    }

    const resultArray = Array.from(agentMap.values());

    let name = [];
    let quotes = [];
    let policy = [];
    let premium = [];
    let overDue = [];
    let proposals = [];

    resultArray?.map((item) => {
      name = [...name, item?.fullName];
      quotes = [...quotes, item?.noOfQuotes];
      policy = [...policy, item?.noOfPolicies];
      premium = [...premium, `${item?.totalPremium}`];
      overDue = [...overDue, item?.totalOverDue];
      proposals = [...proposals, item?.noOfProposals];
    });

    setAgentName(name);
    setAgentQuotes(quotes);
    setAgentPolicy(policy);
    setAgentPremium(premium);
    setAgentOverDue(overDue);
    setAgentProposals(proposals);
  }, [
    agentWiseOverviewData?.agentQuotes,
    agentWiseOverviewData?.agentPolicies,
  ]);

  const barChartData = {
    series: [
      // {
      //   name: "Quotes",
      //   data: agentQuotes || [],
      // },
      {
        name: "proposals",
        data: agentProposals || [],
      },
      {
        name: "Polices",
        data: agentPolicy || [],
      },
      // {
      //   name: "Premium (In 0.1k)",
      //   data: agentPremium || [],
      // },
      {
        name: "Over Due",
        data: agentOverDue || [],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: `${
            agentName?.length < 5 ? agentName?.length * 10 : "55%"
          }`,
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: agentName || [],
        labels: {
          style: {
            fontSize: "13px",
            fontFamily: "Inter",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      yaxis: {
        title: {
          text: "No Of Count",
        },
        labels: {
          style: {
            fontSize: "13px",
            fontFamily: "Inter",
            fontWeight: 600,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      fill: {
        // colors: ["#6f2e7d", "#8f5c9a", "#bb9dc2", "#561463", "#a058af"],
        colors: ["#6f2e7d", "#8f5c9a", "#bb9dc2"],
        opacity: 1,
      },
      // colors: ["#6f2e7d", "#8f5c9a", "#bb9dc2", "#561463", "#a058af"],
      colors: ["#6f2e7d", "#8f5c9a", "#bb9dc2"],
      title: {
        text: "Agent wise Information",
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
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 200,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      legend: {
        fontSize: "14px",
        fontFamily: "Inter",
        fontWeight: 600,
      },
    },
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
      <ReactApexChart
        options={barChartData.options}
        series={barChartData.series}
        type="bar"
        width="100%"
        height={500}
      />
    </Card>
  );
}

export default AgentInfoChart;
