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

const CustomerAddOnsTable = (props) => {
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

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 ? (
                  items?.map((item) => {
                    const createdAt = format(parseISO(item?.createdAt), "dd/MM/yyyy");
                    return (
                      <TableRow hover key={item?.key}>
                        <TableCell>{item?._id}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                        <TableCell>{item?.productName}</TableCell>
                        <TableCell align="right">
                          {/* <NextLink href={`/`} passHref> */}
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
                          {/* </NextLink> */}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                      No data found!
                    </Box>
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

export default CustomerAddOnsTable;
