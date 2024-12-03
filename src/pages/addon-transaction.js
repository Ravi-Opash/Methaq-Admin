import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import FilterCard from "src/components/filterCard";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getAllAddonTransactionsList } from "src/sections/transactions/action/transactionAction";
import AllAddonTransactionTable from "src/sections/transactions/all-addon-transaction-table";
import {
  setAllAddonTransactionsListCustomPagination,
  setAddonTransactionSearchFilter,
} from "src/sections/transactions/reducer/transactionSlice";
import { debounce } from "src/utils/debounce-search";

// Options for transaction status filtering
const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Expired",
    value: "EXPIRED",
  },
];

const Transactions = () => {
  const {
    allAddonTransactionsListCustomPagination,
    allAddonTransactionsListLoader,
    allAddonTransactionsList,
    allAddonTransactionsListPagination,
    addonTransactionSearchFilter,
  } = useSelector((state) => state.transactions);

  const dispatch = useDispatch();

  // Local state to manage the search filter
  const [searchFilter, setSearchFilter] = useState({
    name: addonTransactionSearchFilter?.name || "",
    type: addonTransactionSearchFilter?.type || "all",
    fromDate: addonTransactionSearchFilter?.fromDate || "",
    toDate: addonTransactionSearchFilter?.toDate || "",
    scrollPosition: addonTransactionSearchFilter?.scrollPosition || 0,
  });

  // Update the Redux store whenever searchFilter changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setAddonTransactionSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when transaction list is loaded or updated
  useEffect(() => {
    if (addonTransactionSearchFilter && !allAddonTransactionsListLoader && allAddonTransactionsList?.length > 0) {
      window.scrollTo({ top: parseInt(addonTransactionSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allAddonTransactionsList]);

  // Handler for filtering data based on filter card
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Ref to prevent multiple calls to fetch data when component is re-rendered
  const addonTransactionListFilter = useRef(false);

  // Handler to search and apply filter values (debounced to reduce API calls)
  const searchFilterHandler = (name, value) => {
    addonTransactionListFilter.current = false;

    // Reset pagination to first page when filter changes
    dispatch(
      setAllAddonTransactionsListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    // If a filter value is provided, update search and trigger fetching filtered data
    if (name && (value === "" || value)) {
      getAllAddonTransactionListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getAllAddonTransactionListFilterHandler();
    }
  };

  // Debounced handler to avoid making API calls too frequently during typing
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Function to fetch filtered addon transactions based on the current search filters
  const getAllAddonTransactionListFilterHandler = async (otherProps, page, size) => {
    if (addonTransactionListFilter.current) return;

    addonTransactionListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };
    try {
      // Dispatch action to get filtered transactions
      dispatch(
        getAllAddonTransactionsList({
          page: page || allAddonTransactionsListCustomPagination?.page,
          size: size || allAddonTransactionsListCustomPagination?.size,
          search: payload?.name,
          payloadData: {
            aType: payload?.type,
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
          },
        })
      );
    } catch (err) {
      toast(err, { type: "error" });
    }
  };

  // Fetch all addon transactions on initial load or whenever the filter is applied
  useEffect(() => {
    getAllAddonTransactionListFilterHandler();
    return () => {};
  }, []);

  // Page change handler for pagination
  const handleAddonTransactionsListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllAddonTransactionsListCustomPagination({
          page: value + 1,
          size: allAddonTransactionsListCustomPagination?.size,
        })
      );

      // Reset scroll position on page change
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch data for the new page
      dispatch(
        getAllAddonTransactionsList({
          page: value + 1,
          size: allAddonTransactionsListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            aType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allAddonTransactionsListCustomPagination?.size, searchFilter]
  );

  // Handler for changing rows per page (pagination size)
  const handleAddonTransactionsListRowsPerPageChange = useCallback(
    (event) => {
      // Update pagination size and reset to the first page
      dispatch(
        setAllAddonTransactionsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch data with the new page size
      dispatch(
        getAllAddonTransactionsList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            aType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allAddonTransactionsListCustomPagination?.page, searchFilter]
  );

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Add ons purchases</Typography>
              </Stack>
            </Stack>

            {/* Filters and transaction table */}
            <Stack spacing={3}>
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search transactions"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
              />

              {/* Loader while data is being fetched */}
              {allAddonTransactionsListLoader ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <AnimationLoader open={!!allAddonTransactionsListLoader} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                  {/* Display transaction table */}
                  {allAddonTransactionsList && (
                    <AllAddonTransactionTable
                      count={allAddonTransactionsListPagination?.totalItems}
                      items={allAddonTransactionsList}
                      onPageChange={handleAddonTransactionsListPageChange}
                      onRowsPerPageChange={handleAddonTransactionsListRowsPerPageChange}
                      page={allAddonTransactionsListCustomPagination?.page - 1}
                      rowsPerPage={allAddonTransactionsListCustomPagination?.size}
                      addonTransactionSearchFilter={addonTransactionSearchFilter}
                    />
                  )}
                </Box>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Transactions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Transactions;
