import React from "react";
import { format, parseISO, isValid } from "date-fns";
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
  styled,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { SeverityPill } from "src/components/severity-pill";
import { formatNumber } from "src/utils/formatNumber";
import { setAllHealthPoliciesListSearchFilter } from "src/sections/health-insurance/Policies/reducer/healthPoliciesSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";

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

const HealthPolicesTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    allHealthPoliciesListSearchFilter = {},
  } = props;

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(
      setAllHealthPoliciesListSearchFilter({ ...allHealthPoliciesListSearchFilter, scrollPosition: window?.scrollY })
    );
  };
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCells>REF</TableCells>
                  <TableCells>Company</TableCells>
                  <TableCells>Insure Type</TableCells>
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
                      policyIssueDate = format(parseISO(poly?.policyEffectiveDate), "dd/MM/yyyy");
                    }

                    let expireDate = "";

                    if (isValid(parseISO(poly?.policyExpiryDate))) {
                      expireDate = format(parseISO(poly?.policyExpiryDate), "dd/MM/yyyy");
                    }
                    return (
                      <TableRow
                        hover
                        key={poly?._id}
                        href={`/health-insurance/policies/${poly?._id}`}
                        component={Link}
                        selected={isSelected}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
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
                          {poly?.quoteId?.proposalNo}
                        </TableCelles>
                        <TableCelles>{poly?.quoteId?.companyData?.companyName || "-"}</TableCelles>
                        <TableCelles sx={{ textTransform: "capitalize" }}>
                          {poly?.healthInfoId?.insurerType}
                        </TableCelles>
                        <TableCelles>{`AED ${formatNumber(poly?.quoteId?.price)}`}</TableCelles>
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

export default HealthPolicesTable;
