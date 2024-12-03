import React, { useState } from "react";
import { Stack } from "@mui/material";
import CustomerProposalsTable from "./customer-proposals-table";
import FilterCard from "src/components/filterCard";
import format from "date-fns/format";

const CustomerProposals = () => {
  const [searchFilter, setSearchFilter] = useState({
    name: "",
    type: "All",
    fromDate: `${format(new Date(), "dd-MM-yyyy")}`,
    toDate: `${format(new Date().getTime() + 24 * 60 * 60 * 1000, "dd-MM-yyyy")}`,
  });

  const searchFilterHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log("searchFilter", searchFilter);

  // const options = ["All", "Active Quotation", "Expired Quotation"];

  const options = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Active Quotation",
      value: "Active Quotation",
    },
    {
      label: "Expired Quotation",
      value: "Expired Quotation",
    },
  ];

  return (
    <>
      <Stack spacing={3}>
        <FilterCard
          searchFilter={searchFilter}
          searchFilterHandler={searchFilterHandler}
          inputPlaceHolder="Search proposals"
          selectOptions={options}
        />

        <CustomerProposalsTable searchFilter={searchFilter} />
      </Stack>
    </>
  );
};

export default CustomerProposals;
