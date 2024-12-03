import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Link,
} from "@mui/material";
import { MenuIcon } from "src/Icons/MenuIcon";
import { Matrix } from "src/Icons/Matrix";
import { ArrowRight } from "src/Icons/ArrowRight";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { PencilAlt } from "src/Icons/PencilAlt";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import NextLink from "next/link";
import NextImage from "next/image";
import { format, parseISO } from "date-fns";
import { ConditionsSvg } from "src/Icons/Conditions";
import { ExcessSvg } from "src/Icons/Excess";
import { setSalesadminSearchFilter } from "./reducer/salesAdminSlice";
import { useDispatch } from "react-redux";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const SalesAdminTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    deleteByIdHandler,
    salesAdminSearchFilter = {},
  } = props;

  const dispatch = useDispatch();

  const onclickHandler = () => {
    dispatch(setSalesadminSearchFilter({ ...salesAdminSearchFilter, scrollPosition: window?.scrollY }));
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Contact No</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((admin, index) => {
                    const isSelected = selected.includes(admin?._id);

                    return (
                      <TableRow hover key={admin?._id} selected={isSelected}>
                        <TableCell>{admin?.userId?.fullName}</TableCell>

                        <TableCell>{admin?.userId?.email}</TableCell>
                        <TableCell>{admin?.userId?.mobileNumber}</TableCell>

                        <TableCell align="right">
                          {/* {moduleAccess(user, "companies.update") && ( */}
                          <NextLink href={`/sales-agent/${admin?._id}/edit`} passHref>
                            <IconButton component="a" onClick={() => onclickHandler()}>
                              <PencilAlt fontSize="small" />
                            </IconButton>
                          </NextLink>
                          {/* )} */}

                          {/* {moduleAccess(user, "companies.delete") && ( */}
                          <Button
                            onClick={() => {
                              deleteByIdHandler(admin?._id);

                              onclickHandler();
                            }}
                          >
                            <IconButton component="a">
                              <DeleteSvg fontSize="small" />
                            </IconButton>
                          </Button>
                          {/* )} */}

                          <NextLink href={`/sales-agent/${admin?._id}`} passHref>
                            <IconButton component="a" onClick={() => onclickHandler()}>
                              <ArrowRight fontSize="small" />
                            </IconButton>
                          </NextLink>
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

export default SalesAdminTable;
