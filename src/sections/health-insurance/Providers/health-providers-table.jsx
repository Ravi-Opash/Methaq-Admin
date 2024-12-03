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
  Button,
  styled,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { PencilAlt } from "src/Icons/PencilAlt";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import Link from "next/link";
import {
  setHealthProviderSearchFilter
} from "src/sections/health-insurance/Providers/Reducer/healthProviderSlice";

const TableCells = styled(TableCell)(({ theme }) => ({
  fontSize: "11px !important",
  [theme.breakpoints.up("xl")]: {
    fontSize: "11.5px !important",
  },
}));
const TableCelles = styled(TableCell)(({ theme }) => ({
  fontSize: "11.5px !important",
  [theme.breakpoints.up("xl")]: {
    fontSize: "12.5px !important",
  },
}));

const HealthProviderTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    deleteByIdHandler,
    allHealthProviderSearchFilter = {},
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setHealthProviderSearchFilter({ ...allHealthProviderSearchFilter, scrollPosition: window?.scrollY }));
  };
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCells>Provider No</TableCells>
                  <TableCells>Code</TableCells>
                  <TableCells>Name</TableCells>
                  <TableCells>Type</TableCells>
                  <TableCells>Contact No</TableCells>
                  <TableCells>License Number</TableCells>
                  <TableCells>Emirate</TableCells>
                  <TableCells align="right">Actions</TableCells>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((ele) => {
                    return (
                      <TableRow
                        component={Link}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                        href={`/health-insurance/providers/${ele?._id}`}
                        onClick={() => {
                          onClickHandler();
                        }}
                      >
                        <TableCelles
                          onClick={(e) => {
                            e?.stopPropagation();
                            e?.preventDefault();
                          }}
                        >
                          {ele?.refNo}
                        </TableCelles>
                        <TableCelles>{ele?.providerCode}</TableCelles>
                        <TableCelles>{ele?.providerName}</TableCelles>
                        <TableCelles>{ele?.providerType}</TableCelles>
                        <TableCelles>{ele?.providerContactNumber}</TableCelles>
                        <TableCelles>{ele?.providerLicenseNumber}</TableCelles>
                        <TableCelles>{ele?.emirate}</TableCelles>

                        <TableCelles align="right">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                            {moduleAccess(user, "healthQuote.update") && (
                              <Box
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e?.preventDefault();
                                  router?.push(`/health-insurance/providers/${ele?._id}/edit`);
                                }}
                                sx={{ mr: 1 }}
                              >
                                <IconButton component="a">
                                  <PencilAlt fontSize="small" />
                                </IconButton>
                              </Box>
                            )}

                            {moduleAccess(user, "healthQuote.delete") && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e?.preventDefault();
                                  deleteByIdHandler(ele?._id);
                                }}
                              >
                                <IconButton component="a">
                                  <DeleteSvg fontSize="small" />
                                </IconButton>
                              </Button>
                            )}

                            <Button>
                              <IconButton component="a">
                                <ArrowRight fontSize="small" />
                              </IconButton>
                            </Button>
                          </Box>
                        </TableCelles>
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

export default HealthProviderTable;
