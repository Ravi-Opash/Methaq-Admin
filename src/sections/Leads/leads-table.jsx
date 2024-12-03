import React, { useState } from "react";
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
import Link from "next/link";
import { useDispatch } from "react-redux";

import { setLeadsSearchFilter } from "../Leads/Reducer/leadsSlice";
const LeadsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    leadSearchFilter = {},
  } = props;

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setLeadsSearchFilter({ ...leadSearchFilter, scrollPosition: window?.scrollY }));
  };
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal No</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile No</TableCell>
                  <TableCell>Car</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((item) => {
                    const isSelected = selected.includes(item?._id);
                    let createdAt;
                    try {
                      const dateObject = parseISO(item?.createdAt);
                      createdAt = format(dateObject, "dd/MM/yyyy");
                    } catch (error) {
                      createdAt = "Invalid date";
                    }

                    return (
                      <TableRow
                        component={Link}
                        hover
                        href={`/leads/${item?._id}`}
                        key={item?._id}
                        selected={isSelected}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                        onClick={() => {
                          onClickHandler();
                        }}
                      >
                        <TableCell
                          onClick={(e) => {
                            e?.stopPropagation();
                            e?.preventDefault();
                          }}
                        >
                          {item?.proposalId}
                        </TableCell>
                        <TableCell>{item?.user?.fullName}</TableCell>
                        <TableCell>{item?.user?.email}</TableCell>
                        <TableCell>{item?.user?.mobileNumber}</TableCell>
                        <TableCell>
                          {item?.car?.make && item?.car?.model ? `${item?.car?.make} ${item?.car?.model}` : "-"}
                        </TableCell>
                        <TableCell>{createdAt}</TableCell>

                        <TableCell align="right">
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

export default LeadsTable;
