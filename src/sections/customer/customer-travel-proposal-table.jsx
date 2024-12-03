import React, { useState, useMemo, useEffect } from "react";
import { Box, Chip, CircularProgress, InputAdornment, OutlinedInput, Stack, SvgIcon } from "@mui/material";
import CustomerQuotationsTable from "./customer-quotations-table";
import { useSelector } from "react-redux";
import FilterCard from "src/components/filterCard";
import format from "date-fns/format";
import { useSelection } from "src/hooks/use-selection";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";

const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active Quotation",
    value: "ACTIVE",
  },
  {
    label: "Expired Quotation",
    value: "EXPIRED",
  },
];

const CustomerTravelProposalTable = ({ searchFilterHandler, handlePageChange, handleRowsPerPageChange }) => {
  const {
    customerTravelProposalsList,
    customerTravelProposalsListPagination,
    customerTravelProposalsListCustomPagination,
    setCustomerTravelProposalsListLoader,
  } = useSelector((state) => state.customer);

  return (
    <>
      <Stack spacing={3}>
        <OutlinedInput
          defaultValue=""
          fullWidth
          name="name"
          placeholder={"Search Proposals" || ""}
          onChange={(e) => searchFilterHandler(e.target.name, e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500 }}
        />

        {setCustomerTravelProposalsListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {customerTravelProposalsList && (
              <CustomerQuotationsTable
                items={customerTravelProposalsList}
                count={customerTravelProposalsListPagination?.totalItems}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={customerTravelProposalsListCustomPagination?.page - 1}
                rowsPerPage={customerTravelProposalsListCustomPagination?.size}
              />
            )}
          </>
        )}
      </Stack>
    </>
  );
};

export default CustomerTravelProposalTable;
