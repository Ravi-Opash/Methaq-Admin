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

const CustomerHealthProposalTable = ({
  searchFilterHandler,
  handlePageChange,
  handleRowsPerPageChange,
}) => {
  const {
    customerHealthProposalsList,
    customerHealthProposalsListPagination,
    customerHealthProposalsListCustomPagination,
    setCustomerHealthProposalsListLoader,
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

        {setCustomerHealthProposalsListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {customerHealthProposalsList && (
              <CustomerQuotationsTable
                items={customerHealthProposalsList}
                count={customerHealthProposalsListPagination?.totalItems}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={customerHealthProposalsListCustomPagination?.page - 1}
                rowsPerPage={customerHealthProposalsListCustomPagination?.size}
              />
            )}
          </>
        )}
      </Stack>
    </>
  );
};

export default CustomerHealthProposalTable;
