import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { formatNumber } from "src/utils/formatNumber";
import { Box } from "@mui/system";
import { formateWithoutDasimal } from "src/utils/formateWithoutDasimal";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const TravelDashBoardPromoCode = ({ dateStatus, travelPromoCodeOverviewData, loading }) => {
  const [data, setdata] = useState([]);

  useEffect(() => {
    const agentMap = new Map();

    if (travelPromoCodeOverviewData) {
      // Applied
      travelPromoCodeOverviewData?.promoCodeUtilization?.forEach((promo) => {
        const { voucher, noOfUseage } = promo;
        const agentKey = voucher?._id;

        if (!agentMap.has(agentKey)) {
          agentMap.set(agentKey, {
            codeName: voucher?.promoCode,
            codeUsed: 0,
            codeApplied: 0,
          });
        }

        const agentInfo = agentMap.get(agentKey);
        agentInfo.codeApplied = noOfUseage;
      });

      // Process agentPolicies
      travelPromoCodeOverviewData?.promoCodeApplied?.forEach((promo) => {
        const { voucherApplied, noOfUseage } = promo;
        const agentKey = voucherApplied?._id;

        if (!agentMap.has(agentKey)) {
          agentMap.set(agentKey, {
            codeName: voucherApplied?.promoCode,
            codeUsed: 0,
            codeApplied: 0,
          });
        }

        const agentInfo = agentMap.get(agentKey);
        agentInfo.codeUsed = noOfUseage;
      });
    }

    const resultArray = Array.from(agentMap.values());
    setdata(resultArray);
  }, [travelPromoCodeOverviewData]);

  return (
    <Card>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <CardHeader title="Promo code"></CardHeader>
        {loading && <CircularProgress size={20} sx={{ mb: -2 }} />}
      </Box>
      <CardContent sx={{ pt: 0 }}></CardContent>

      <Scrollbar>
        <Box sx={{ minWidth: 360 }}>
          {!loading ? (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Used</TableCell>
                    <TableCell>Applied</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.length > 0 ? (
                    data?.map((ele, key) => {
                      return (
                        <TableRow hover key={key}>
                          <TableCell>{ele?.codeName}</TableCell>
                          <TableCell>{`${formateWithoutDasimal(ele?.codeApplied)}`}</TableCell>
                          <TableCell>{`${formateWithoutDasimal(ele?.codeUsed)}`}</TableCell>
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
  );
};

export default TravelDashBoardPromoCode;
