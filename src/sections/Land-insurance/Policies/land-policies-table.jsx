import React from "react";
import { format, parseISO, isValid } from "date-fns";
import NextLink from "next/link";
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
  styled,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { SeverityPill } from "src/components/severity-pill";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { setAllLandPoliciesSearchFilter } from "./reducer/landPoliciesSlice";

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

const LandPolicesTable = (props) => {
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
    allLandPoliciesSearchFilter={}
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const onsubmithandler=()=>{
dispatch(setAllLandPoliciesSearchFilter({...allLandPoliciesSearchFilter,scrollPosition: window?.scrollY}))
  }

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCells>REF</TableCells>
                  {/* <TableCells>Policy No</TableCells> */}
                  <TableCells>Company</TableCells>
                  <TableCells>Value</TableCells>
                  <TableCells>Status</TableCells>
                  <TableCells>Customer</TableCells>
                  <TableCells>Created At</TableCells>
                  <TableCells>Expired At</TableCells>
                  <TableCells align="right">Actions</TableCells>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((poly) => {
                    const isSelected = selected.includes(poly?._id);

                    let policyIssueDate = "";

                    if (isValid(parseISO(poly?.policyEffectiveDate))) {
                      policyIssueDate = format(parseISO(poly?.policyEffectiveDate), "MM/dd/yyyy");
                    }

                    let expireDate = "";

                    if (isValid(parseISO(poly?.policyExpiryDate))) {
                      expireDate = format(parseISO(poly?.policyExpiryDate), "MM/dd/yyyy");
                    }
                    return (
                      <TableRow
                        hover
                        key={poly?._id}
                        selected={isSelected}
                        component={Link}
                        href={`/land-insurance/policies/${poly?._id}`}
                        onClick={() => onsubmithandler()}
                        sx={{ cursor: "pointer",textDecoration:"none" }}
                      >
                        <TableCelles>{poly?.proposal?.proposalId}</TableCelles>
                        {/* <TableCelles>{poly?.policyNumber}</TableCelles> */}
                        <TableCelles>{poly?.landProposal?.company?.companyName || "-"}</TableCelles>
                        <TableCelles>{`AED ${formatNumber(poly?.totalPrice)}`}</TableCelles>
                        <TableCelles>
                          <SeverityPill color={poly?.status === "Active" ? "success" : "error"}>
                            {poly?.status}
                          </SeverityPill>
                        </TableCelles>
                        <TableCelles>{poly?.userId?.fullName}</TableCelles>
                        <TableCelles>{policyIssueDate}</TableCelles>
                        <TableCelles>{expireDate}</TableCelles>

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

export default LandPolicesTable;
