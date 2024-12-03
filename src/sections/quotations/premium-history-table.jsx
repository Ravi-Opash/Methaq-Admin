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

const PremiumHistoryTable = (props) => {
  const { items = [] } = props;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Admin Name</TableCell>
                  <TableCell>Admin Email</TableCell>
                  <TableCell>Previous Price</TableCell>
                  <TableCell>Edited Price</TableCell>
                  <TableCell>Edited At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 ? (
                  items?.map((p, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>{p?.editedPriceBy?.fullName}</TableCell>
                        <TableCell>{p?.editedPriceBy?.email}</TableCell>
                        <TableCell>{"AED " + p?.beforeEditPrice}</TableCell>
                        <TableCell>{"AED " + p?.editedPrice}</TableCell>
                        <TableCell>{format(parseISO(p?.createdAt), "MM-dd-yyyy HH:mm")}</TableCell>
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

export default PremiumHistoryTable;
