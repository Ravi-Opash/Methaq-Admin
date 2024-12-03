import React from "react";
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { moduleAccess } from "src/utils/module-access";
import { setTravelTransactionSearchFilter } from "./Reducer/travelTransactionSlice";
import Link from "next/link";

const TravelTransactionTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    TravelTransactionsSearchFilter = {},
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();

  // Function to handle page change
  const onClickHandler = () => {
    dispatch(setTravelTransactionSearchFilter({ ...TravelTransactionsSearchFilter, scrollPosition: window?.scrollY }));
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction No</TableCell>
                  <TableCell>Reference No</TableCell>
                  <TableCell>Date</TableCell>
                  {/* <TableCell>Source</TableCell> */}
                  {/* <TableCell>Type</TableCell> */}
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items?.length > 0 ? (
                  items?.map((item) => {
                    const createdAt = format(parseISO(item?.createdAt), "dd/MM/yyyy");
                    return (
                      <TableRow
                        hover
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                        component={Link}
                        href={`/travel-insurance/transaction/${item?._id}`}
                        onClick={() => {
                          onClickHandler();
                        }}
                      >
                        <TableCell>{item?.transactionNumber}</TableCell>
                        <TableCell>{item?.paymentRefNo ? item?.paymentRefNo : "-"}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                        {/* <TableCell>
                          {item?.isAdmin
                            ? `Agent: ${item?.admin?.fullName ? item?.admin?.fullName : ""}`
                            : `Direct: ${item?.user?.fullName ? item?.user?.fullName : ""} (website)`}
                        </TableCell> */}
                        {/* <TableCell>{transactionType}</TableCell> */}
                        <TableCell>
                          {item?.billAmount ? "AED " + formatNumber(parseInt(item?.billAmount * 100) / 100) : "-"}
                        </TableCell>
                        <TableCell align="right">
                          {moduleAccess(user, "travelQuote.read") && (
                            <IconButton component="a">
                              <ArrowRight fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>No data found!</Box>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>

        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

export default TravelTransactionTable;
