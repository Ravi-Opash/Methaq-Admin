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
import Link from "next/link";
import { useDispatch } from "react-redux";
import { SeverityPill } from "src/components/severity-pill";
import { setCancelRequestsSearchFilter } from "./reducer/cancelReducerSlice";

const CancelRequestsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    cancelRequestSearchFilter = {},
  } = props;

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setCancelRequestsSearchFilter({ ...cancelRequestSearchFilter, scrollPosition: window?.scrollY }));
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
                  <TableCell>Policy Number</TableCell>
                  <TableCell>Company Policy Number</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Insurance Company</TableCell>
                  <TableCell>Cancellation Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((poly) => {
                    const isSelected = selected.includes(poly?._id);
                    let createdAt;
                    try {
                      const dateObject = parseISO(poly?.cancellationRequestTime);
                      createdAt = format(dateObject, "dd/MM/yyyy");
                    } catch (error) {
                      createdAt = "-";
                    }

                    return (
                      <TableRow
                        component={Link}
                        hover
                        href={`/cancel-request/${poly?._id}`}
                        key={poly?._id}
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
                          {poly?.quoteId?.proposalId}
                        </TableCell>
                        <TableCell>{poly?.policyNumber}</TableCell>
                        <TableCell>{poly?.companyPolicyNumber}</TableCell>
                        <TableCell>{poly?.userId?.fullName}</TableCell>
                        <TableCell>{poly?.quoteId?.company?.companyName}</TableCell>
                        <TableCell>
                          <SeverityPill fontSize="10" color={poly?.cancellationStatus ? "success" : "error"}>
                            {poly?.cancellationStatus ? "Cancelled" : "Pending"}
                          </SeverityPill>
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

export default CancelRequestsTable;
