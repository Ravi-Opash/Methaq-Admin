import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ModalComp from "src/components/modalComp";
import { Scrollbar } from "src/components/scrollbar";
import VerifyModal from "src/components/verifyModal";
import { formatNumber } from "src/utils/formatNumber";
import AgentPerfomance from "./AgentPerfomance";
import { getAgentWiseInfoList, getInsuranceCompanyPolicyList } from "../action/overviewAction";
import { useDispatch, useSelector } from "react-redux";
import { formateWithoutDasimal } from "src/utils/formateWithoutDasimal";

export default function AgentWiseInfo({ agentWiseOverviewData, dateStatus, startDate, endDate, loading = true }) {
  const [data, setData] = useState([]);
  const [agentData, setAgentData] = useState();
  const [verifyModal, setVerifyModal] = useState(false);
  const dispatch = useDispatch();
  const { agentWiseList } = useSelector((state) => state.overview);
  const isPraktora = localStorage.getItem("isPraktora") ? JSON.parse(localStorage.getItem("isPraktora")) : false;

  const handleCloseVerifymodal = () => setVerifyModal(false);
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
            conversionRatio: "",
            id: agentKey,
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
            conversionRatio: "",
            id: agentKey,
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
            conversionRatio: "",
            id: agentKey,
          });
        }

        const agentInfo = agentMap.get(agentKey);
        agentInfo.totalPremium = totalPremium;
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
            conversionRatio: "",
            id: agentKey,
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
              conversionRatio: "",
              id: agentKey,
            });
          }

          const agentInfo = agentMap.get(agentKey);
          agentInfo.noOfProposals = Math.floor(noOfProposals);
        }
      });
      // agents conversion ratio
      agentWiseOverviewData?.agentConversionRatios?.forEach((proposals) => {
        const { admin, conversionRatio } = proposals;
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
              conversionRatio: "",
              id: agentKey,
            });
          }

          const agentInfo = agentMap.get(agentKey);
          agentInfo.conversionRatio = formatNumber(conversionRatio);
        }
      });
    }

    const resultArray = Array.from(agentMap.values());

    setData(resultArray);
  }, [agentWiseOverviewData]);

  const agentWiseInfoHandler = (id) => {
    setVerifyModal(true);
    dispatch(getAgentWiseInfoList({ adminId: id, startDate, endDate, isPraktora })).then((res) =>
      console.log(res, "res")
    );
  };

  return (
    <>
      <Card
        sx={{
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <CardHeader title="Agent wise Information"></CardHeader>
          {loading && <CircularProgress size={20} sx={{ mb: -2 }} />}
        </Box>
        <CardContent sx={{ pt: 0 }}></CardContent>

        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            {!loading ? (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Agent</TableCell>
                      <TableCell>Number of proposals</TableCell>
                      <TableCell>Number of policies</TableCell>
                      <TableCell>Conversion Ratio</TableCell>
                      <TableCell>Premium</TableCell>
                      <TableCell>over due</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.length > 0 ? (
                      data?.map((ele, key) => {
                        return (
                          <TableRow
                            hover
                            key={key}
                            onClick={() => {
                              agentWiseInfoHandler(ele?.id), setAgentData(ele);
                            }}
                          >
                            <TableCell>
                              <Tooltip title={"Check Performanace per policy"}>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    cursor: "pointer",
                                    width: "max-content",
                                    fontWeight: 600,
                                  }}
                                >
                                  {ele?.fullName}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>{formateWithoutDasimal(ele?.noOfProposals)}</TableCell>
                            <TableCell>{formateWithoutDasimal(ele?.noOfPolicies)}</TableCell>
                            <TableCell>{`${formatNumber(ele?.conversionRatio)}%`}</TableCell>
                            <TableCell>{`${formatNumber(ele?.totalPremium)} AED`}</TableCell>
                            <TableCell>{formateWithoutDasimal(ele?.totalOverDue)}</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <Typography sx={{ m: 1, ml: 2, fontSize: "14px" }}>No any data to show!</Typography>
                    )}
                  </TableBody>
                </Table>
              </>
            ) : (
              <Box sx={{ px: 2, pb: 4 }}>
                <Skeleton height={50} />
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Card>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: "95%", md: 800 }}>
        <AgentPerfomance
          handleClose={handleCloseVerifymodal}
          onSubmit={() => onSubmitChange(newValue, quotationId)}
          agentWiseList={agentWiseList}
          agentData={agentData}
        />
      </ModalComp>
    </>
  );
}
