import React from "react";
import { Box, Card, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { formatNumber } from "src/utils/formatNumber";

const HealthPolicyTransactionTable = (props) => {
  const { items, policyData } = props;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction</TableCell>
                  <TableCell>Ref No.</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items?.length > 0 ? (
                  <>
                    {items?.map((item) => {
                      const createdAt = format(parseISO(item?.createdAt), "dd/MM/yyyy");

                      return (
                        <TableRow hover key={item?._id}>
                          <TableCell>{item?.transactionNumber}</TableCell>
                          <TableCell>{item?.paymentRefNo}</TableCell>
                          <TableCell>{createdAt}</TableCell>
                          <TableCell>
                            {item?.isAdmin
                              ? `Agent: ${item?.adminId?.fullName ? item?.adminId?.fullName : ""}`
                              : `Direct: ${item?.userId?.fullName ? item?.userId?.fullName : ""} (website)`}
                          </TableCell>
                          <TableCell>{`${formatNumber(item?.billAmount)} AED`}</TableCell>
                          <TableCell align="right">
                            <NextLink href={`/health-insurance/transaction/${item?._id}`} passHref>
                              <IconButton component="a">
                                <ArrowRight fontSize="small" />
                              </IconButton>
                            </NextLink>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {policyData?.commission && (
                      <TableRow>
                        <TableCell>{`Commission From Insurance Company (${policyData?.commission}%)`}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{`${formatNumber(policyData?.commissionAmountBeforeDiscount)} AED`}</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    )}
                    {policyData?.commission && (
                      <TableRow>
                        <TableCell>Net Commission</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>
                          {policyData?.netCommission ? formatNumber(policyData?.netCommission) : "-"}
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    )}
                  </>
                ) : (
                  <TableRow>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>No data found!</Box>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default HealthPolicyTransactionTable;
