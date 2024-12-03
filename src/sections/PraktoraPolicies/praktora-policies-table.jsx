import React from "react";
import { format, parseISO, isValid } from "date-fns";
import NextLink from "next/link";
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  styled,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { setPraktoraPoliciesSearchFilter } from "./reducer/praktoraPoliciesSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

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

const PraktoraPoliciesTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    PraktoraPoliciesSearchFilter = {},
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setPraktoraPoliciesSearchFilter({ ...PraktoraPoliciesSearchFilter, scrollPosition: window?.scrollY }));
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCells>POLICY NO</TableCells>
                  <TableCells>VEHICLE No</TableCells>
                  <TableCells>CUSTOMER NAME </TableCells>
                  <TableCells>MOBILE NO </TableCells>
                  <TableCells>INSURANCE NAME</TableCells>
                  <TableCells>CUSTOMER TYPE </TableCells>
                  <TableCells> PREMIUM</TableCells>
                  <TableCells>POLICY CLASS</TableCells>
                  <TableCells>START DATE</TableCells>
                  <TableCells>EXPIRY DATE</TableCells>
                  <TableCells align="right">Actions</TableCells>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((poly) => {
                    const isSelected = selected.includes(poly?._id);

                    let policyIssueDate = "";

                    if (isValid(parseISO(poly?.STARTDATE))) {
                      policyIssueDate = format(parseISO(poly?.STARTDATE), "dd/MM/yyyy");
                    }

                    let expireDate = "";

                    if (isValid(parseISO(poly?.EXPIRYDATE))) {
                      expireDate = format(parseISO(poly?.EXPIRYDATE), "dd/MM/yyyy");
                    }
                    return (
                      <TableRow
                        component={Link}
                        hover
                        href={`/Praktorapolicies/${poly?._id}`}
                        key={poly?._id}
                        selected={isSelected}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                        onClick={() => {
                          onClickHandler();
                        }}
                      >
                        <TableCelles>{poly?.POLICYNO || "-"}</TableCelles>

                        <TableCelles>{poly?.VNO || "-"}</TableCelles>
                        <TableCelles>{poly?.CUSTOMERNAME || "-"}</TableCelles>
                        <TableCelles>{poly?.TELEPHONE1 || "-"}</TableCelles>
                        <TableCelles>{poly?.INSNAME || "-"}</TableCelles>
                        <TableCelles sx={{ textTransform: "capitalize" }}>{poly?.CUSTOMERTYPE || "-"}</TableCelles>
                        <TableCelles>{poly?.FCPREMIUM ? `AED ${formatNumber(poly?.FCPREMIUM)}` : "-"}</TableCelles>
                        <TableCelles>{poly?.POLICYCLASS || "-"}</TableCelles>
                        <TableCelles>{policyIssueDate || "-"}</TableCelles>
                        <TableCelles>{expireDate || "-"}</TableCelles>

                        <TableCelles align="right">
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
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

export default PraktoraPoliciesTable;
