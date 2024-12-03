import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { PropertyList } from "src/components/property-list";
import { PropertyListItem } from "src/components/property-list-item";
import { Scrollbar } from "src/components/scrollbar";
import { Box, width } from "@mui/system";
import { SeverityPill } from "src/components/severity-pill";
import { ArrowRight } from "src/Icons/ArrowRight";
import { debounce } from "src/utils/debounce-search";
import SalesAgentFilter from "./sales-agent-filter";
import { endOfDay, startOfDay } from "date-fns";
import { setSalesAdminProposalListPagination } from "./reducer/salesAdminSlice";
import { getSalesAdminproposalList } from "./action/salesAdminAction";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { formatNumber } from "src/utils/formatNumber";

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Sold",
    value: "sold",
  },
  {
    label: "Un-Sold",
    value: "un-sold",
  },
];

const SalesAgentSummary = ({
  FilterDataHandler,
  debounceProposalsHandler,
  searchFilter,
  handleRowsPerPageChange,
  handlePageChange,
  onMonthSelect,
}) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const align = smDown ? "vertical" : "horizontal";

  const {
    salesAdminDetail,
    loading,
    salesAgentProposalListApiPagination,
    salesAgentProposalList,
    salesAgentProposalListLoader,
    salesAgentProposalListPagination,
  } = useSelector((state) => state.salesAdmins);

  return (
    <>
      {salesAdminDetail ? (
        <>
          <Card sx={{ mb: 2 }}>
            {/* <CardHeader title="Agent info" /> */}
            <PropertyList>
              <PropertyListItem align={align} label="Admin Name" value={salesAdminDetail?.userId?.fullName} />
              <Divider />

              <PropertyListItem align={align} label="Admin Email" value={salesAdminDetail?.userId?.email} />
              <Divider />

              <PropertyListItem align={align} label="Contact No" value={salesAdminDetail?.userId?.mobileNumber} />
            </PropertyList>
          </Card>
          <SalesAgentFilter
            searchFilter={searchFilter}
            statusOptions={statusOptions}
            searchFilterHandler={debounceProposalsHandler}
            inputPlaceHolder="Search proposals"
            FilterDataHandler={FilterDataHandler}
            onMonthSelect={onMonthSelect}
          />
          <Card sx={{ mt: 2 }}>
            <Scrollbar>
              <Box sx={{ minWidth: 800 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Proposal Number</TableCell>
                      <TableCell>Sold Status</TableCell>
                      <TableCell>Commission (AED)</TableCell>
                      <TableCell align="right">Visit proposal</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {!salesAgentProposalListLoader ? (
                      <>
                        {salesAgentProposalList?.length > 0 &&
                          salesAgentProposalList?.map((item, index) => {
                            return (
                              <TableRow hover>
                                <TableCell>{item?.proposalId || "-"}</TableCell>
                                <TableCell>
                                  <SeverityPill color={item?.policyId ? "success" : "error"} fontSize={10}>
                                    {item?.policyId ? "Sold" : "Un-Sold"}
                                  </SeverityPill>
                                </TableCell>
                                <TableCell>
                                  {`AED ${formatNumber(item?.policy?.salesAgentCommissionAmount || 0)}`}
                                </TableCell>

                                <TableCell align="right">
                                  <IconButton component="a" href={`/proposals/${item?.proposalId}`}>
                                    <ArrowRight fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </>
                    ) : (
                      <Box sx={{ width: 200, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Scrollbar>

            <TablePagination
              component="div"
              count={salesAgentProposalListApiPagination?.totalItems}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={salesAgentProposalListPagination?.page}
              rowsPerPage={salesAgentProposalListPagination?.size}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Card>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default SalesAgentSummary;
