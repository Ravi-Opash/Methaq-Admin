import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import NextLink from "next/link";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

const ValidatedOffersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;

  // console.log(items, "items");

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Number of Offers used</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 ? (
                  items?.map((p, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>{p?.fullName}</TableCell>
                        <TableCell>{"+" + p?.countryCode + " " + p?.mobileNumber}</TableCell>
                        <TableCell>{p?.email}</TableCell>
                        <TableCell>{p?.offerUsed}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <Typography sx={{ m: 2, fontSize: "15px", color: "#707070" }}>
                    There is no history to show.
                  </Typography>
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

export default ValidatedOffersTable;
