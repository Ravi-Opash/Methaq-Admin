"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Box,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import dynamic from "next/dynamic";
import { Scrollbar } from "src/components/scrollbar";
import { formateWithoutDasimal } from "src/utils/formateWithoutDasimal";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const TravelQuoteSource = ({ dateStatus, travelQuoteSourceData, loading }) => {
  const [quotesSourceInfo, setQuotesSourceInfo] = useState([]);
  useEffect(() => {
    if (travelQuoteSourceData) {
      const arr = [...travelQuoteSourceData].find((i) => i.source == null);
      const isIncludeWeb = [...travelQuoteSourceData].find((i) => i.source == "Web");

      const array = [];
      travelQuoteSourceData?.map((item) => {
        let obj = item;
        if (item?.source == "Web" && arr) {
          obj = {
            ...obj,
            noOfProposals: +item?.noOfProposals + +arr?.noOfProposals,
          };
        } else if (!item?.source && arr) {
          obj = { ...obj, source: "Web" };
        }
        if (!item?.source && isIncludeWeb) {
          return;
        }
        array.push(obj);
      });
      setQuotesSourceInfo(array);
    }
  }, [travelQuoteSourceData]);
  return (
    <>
      <Card>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <CardHeader title="Proposal source"></CardHeader>
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
                      <TableCell>Source Name</TableCell>
                      <TableCell>No. of proposal</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {quotesSourceInfo?.length > 0 ? (
                      quotesSourceInfo?.map((ele, key) => {
                        return (
                          <TableRow hover key={key}>
                            <TableCell>
                              {ele?.source && ele?.source == "Source" ? "Admin portal" : ele?.source || "Web"}
                            </TableCell>
                            <TableCell>{`${formateWithoutDasimal(ele?.noOfProposals)}`}</TableCell>
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
    </>
  );
};

export default TravelQuoteSource;
