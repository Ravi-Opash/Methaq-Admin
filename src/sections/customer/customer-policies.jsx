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

const CustomerPolicies = ({
  searchFilter,
  searchFilterHandler,
  handlePageChange,
  handleRowsPerPageChange,
  FilterDataHandler,
}) => {
  const {
    customerPolicyListPagination,
    customerPolicyList,
    customerPolicyListCustomPagination,
    customerPolicyListLoader,
  } = useSelector((state) => state.customer);

  // console.log("customerPolicyList", customerPolicyList);
  // console.log("customerPolicyListLoader", customerPolicyListLoader);

  const usePoliciesIds = (policies) => {
    return useMemo(() => {
      if (policies !== null) {
        return policies?.map((poly) => poly._id);
      }
    }, [policies]);
  };

  // all customer ids
  const policiesIds = usePoliciesIds(customerPolicyList);
  // checkbox selection
  const policySelection = useSelection(policiesIds);

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

        {customerPolicyListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {customerPolicyList && (
              <CustomerPoliciesTable
                count={customerPolicyListPagination?.totalItems}
                items={customerPolicyList}
                onDeselectAll={policySelection.handleDeselectAll}
                onDeselectOne={policySelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={policySelection.handleSelectAll}
                onSelectOne={policySelection.handleSelectOne}
                page={customerPolicyListCustomPagination?.page - 1}
                rowsPerPage={customerPolicyListCustomPagination?.size}
                selected={policySelection.selected}
              />
            )}
          </>
        )}
      </Stack>
    </>
  );
};

export default CustomerPolicies;
