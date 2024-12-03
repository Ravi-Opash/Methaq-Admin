import React, { useState, useMemo } from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import CustomerPoliciesTable from "./customer-policies-table";
import { useSelector } from "react-redux";
import FilterCard from "src/components/filterCard";
import { useSelection } from "src/hooks/use-selection";

const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active Policies",
    value: "ACTIVE",
  },
  {
    label: "Expired Policies",
    value: "EXPIRING",
  },
  {
    label: "Expiring Policies",
    value: "EXPIRED",
  },
  {
    label: "Cancelled Policies",
    value: "CANCELLED",
  },
];

const CustomerHealthPoliciesTable = ({
  searchFilter,
  searchFilterHandler,
  handlePageChange,
  handleRowsPerPageChange,
  FilterDataHandler,
}) => {
  const {
    customerHealthPolicyListPagination,
    customerHealthPolicyList,
    customerHealthPolicyListCustomPagination,
    customerHealthPolicyListLoader,
  } = useSelector((state) => state.customer);

  return (
    <>
      <Stack spacing={3}>
        <FilterCard
          searchFilter={searchFilter}
          searchFilterHandler={searchFilterHandler}
          inputPlaceHolder="Search policy"
          selectOptions={options}
          FilterDataHandler={FilterDataHandler}
        />

        {customerHealthPolicyListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {customerHealthPolicyList && (
              <CustomerPoliciesTable
                count={customerHealthPolicyListPagination?.totalItems}
                items={customerHealthPolicyList}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={customerHealthPolicyListCustomPagination?.page - 1}
                rowsPerPage={customerHealthPolicyListCustomPagination?.size}
              />
            )}
          </>
        )}
      </Stack>
    </>
  );
};

export default CustomerHealthPoliciesTable;
