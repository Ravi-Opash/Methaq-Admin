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

const CustomerTravelPoliciesTable = ({
  searchFilter,
  searchFilterHandler,
  handlePageChange,
  handleRowsPerPageChange,
  FilterDataHandler,
}) => {
  const {
    customerTravelPolicyListPagination,
    customerTravelPolicyList,
    customerTravelPolicyListCustomPagination,
    customerTravelPolicyListLoader,
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

        {customerTravelPolicyListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {customerTravelPolicyList && (
              <CustomerPoliciesTable
                count={customerTravelPolicyListPagination?.totalItems}
                items={customerTravelPolicyList}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={customerTravelPolicyListCustomPagination?.page - 1}
                rowsPerPage={customerTravelPolicyListCustomPagination?.size}
              />
            )}
          </>
        )}
      </Stack>
    </>
  );
};

export default CustomerTravelPoliciesTable;
