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

const CustomerQuotations = ({
  searchFilter,
  searchFilterHandler,
  handlePageChange,
  handleRowsPerPageChange,
  FilterDataHandler,
}) => {
  const {
    customerDetails,
    customerProposalsList,
    customerProposalsListPagination,
    customerProposalsListCustomPagination,
    setCustomerProposalsListLoader,
  } = useSelector((state) => state.customer);

  const [filteredQuotes, setFilteredQuotes] = useState([]);

  // console.log("filteredQuotes", filteredQuotes);

  useEffect(() => {
    if (!!customerProposalsList) {
      const shortedQuotesArray = customerProposalsList.filter((quote) => quote?.isPaid === 0);
      setFilteredQuotes(shortedQuotesArray);
    }
  }, [customerProposalsList]);

  const useQuotationsIds = (quotations) => {
    return useMemo(() => {
      if (quotations !== null) {
        return quotations?.map((quotation) => quotation._id);
      }
    }, [quotations]);
  };

  // all customer ids
  const quotationsIds = useQuotationsIds(filteredQuotes);
  // checkbox selection
  const quotationSelection = useSelection(quotationsIds);

  return (
    <>
      <Stack spacing={3}>
        {/* <FilterCard
          searchFilter={searchFilter}
          searchFilterHandler={searchFilterHandler}
          inputPlaceHolder="Search proposals"
          selectOptions={options}
          FilterDataHandler={FilterDataHandler}
        /> */}

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

        {setCustomerProposalsListLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {customerProposalsList && (
              <CustomerQuotationsTable
                items={customerProposalsList}
                count={customerProposalsListPagination?.totalItems}
                onDeselectAll={quotationSelection.handleDeselectAll}
                onDeselectOne={quotationSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={quotationSelection.handleSelectAll}
                onSelectOne={quotationSelection.handleSelectOne}
                page={customerProposalsListCustomPagination?.page - 1}
                rowsPerPage={customerProposalsListCustomPagination?.size}
                selected={quotationSelection.selected}
              />
            )}
          </>
        )}
      </Stack>
    </>
  );
};

export default CustomerQuotations;
