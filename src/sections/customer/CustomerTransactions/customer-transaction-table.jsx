import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { formatNumber } from "src/utils/formatNumber";
import { useSelector } from "react-redux";

const CustomerTransactionTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteCustomerHandler,
    changeStatusHandler,
    searchFilter,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const { customerPolicyDetails } = useSelector((state) => state.customer);

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
                            <NextLink href={`/policy_transactions/${item?._id}`} passHref>
                              <IconButton component="a">
                                <ArrowRight fontSize="small" />
                              </IconButton>
                            </NextLink>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {customerPolicyDetails?.commission && (
                      <TableRow>
                        <TableCell>{`Commission From Insurance Company (${customerPolicyDetails?.commission}%)`}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>
                          {customerPolicyDetails?.quoteId?.insuranceType == "thirdparty"
                            ? "Thirty Party Comission"
                            : "Comprehensive Comission"}
                        </TableCell>
                        <TableCell>{`${formatNumber(
                          customerPolicyDetails?.commissionAmountBeforeDiscount
                        )} AED`}</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    )}
                    {customerPolicyDetails?.salesAgentCommissionAmount && (
                      <TableRow>
                        <TableCell>{`Sales agent commission`}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{`${formatNumber(
                          customerPolicyDetails?.salesAgentCommissionAmount
                        )} AED`}</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    )}
                    {customerPolicyDetails?.commission && (
                      <TableRow>
                        <TableCell>Net Commission</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>{"-"}</TableCell>
                        <TableCell>
                          {customerPolicyDetails?.netCommission
                            ? `${formatNumber(customerPolicyDetails?.netCommission)} AED`
                            : "-"}
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

        {/* <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        /> */}
      </Card>
    </>
  );
};

export default CustomerTransactionTable;
