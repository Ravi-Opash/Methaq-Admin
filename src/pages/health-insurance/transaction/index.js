import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  exportHealthTransactionCSVFile,
  getAllHealthTransactionsList,
} from "src/sections/health-insurance/Transaction/Action/healthTransactionAction";
import {
  setAllHealthTransactionsListCustomPagination,
  setAllHealthTransactionListSearchFilter,
} from "src/sections/health-insurance/Transaction/Reducer/healthTransactionSlice";
import HealthTransactionTable from "src/sections/health-insurance/Transaction/health-transactions-table";
import TransactionHealthFilterCard from "src/sections/health-insurance/Transaction/transaction-filter-card";
import { debounce } from "src/utils/debounce-search";

// Filter options for transaction types
const options = [
  { label: "All", value: "all" },
  { label: "Add-on Transactions", value: "ADDON" },
  { label: "Policy Transactions", value: "POLICY" },
];

// Function to download PDF from a given URL
const downloadPdf = (pdfUrl) => {
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.setAttribute("rel", "noopener noreferrer");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const HealthTransactions = () => {
  // Get data from Redux store
  const {
    allHealthTransactionsListCustomPagination,
    allHealthTransactionsListLoader,
    allHealthTransactionsList,
    allHealthTransactionsListPagination,
    allHealthTransactionListSearchFilter,
  } = useSelector((state) => state.healthTransactions);

  const dispatch = useDispatch();

  // Local state for filter inputs
  const [searchFilter, setSearchFilter] = useState({
    name: allHealthTransactionListSearchFilter?.name || "",
    type: allHealthTransactionListSearchFilter?.type || "all",
    fromDate: allHealthTransactionListSearchFilter?.fromDate || "",
    toDate: allHealthTransactionListSearchFilter?.toDate || "",
    scrollPosition: allHealthTransactionListSearchFilter?.scrollPosition || 0,
  });

  // Handle changes to the search filters
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Store the filter values in Redux state
  useEffect(() => {
    if (searchFilter) {
      dispatch(setAllHealthTransactionListSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Scroll to the previous position after the list is updated
  useEffect(() => {
    if (
      allHealthTransactionListSearchFilter &&
      !allHealthTransactionsListLoader &&
      allHealthTransactionsList?.length > 0
    ) {
      window.scrollTo({ top: parseInt(allHealthTransactionListSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allHealthTransactionsList]);

  // Handle the filtering of the transaction list (debounced)
  const transactionListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    transactionListFilter.current = false;
    dispatch(
      setAllHealthTransactionsListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllTransactionListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getAllTransactionListFilterHandler();
    }
  };

  // Debounced version of the searchFilterHandler
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Fetch the filtered transaction list based on search filters
  const getAllTransactionListFilterHandler = async (otherProps, page, size) => {
    if (transactionListFilter.current) {
      return;
    }
    transactionListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllHealthTransactionsList({
          page: page || allHealthTransactionsListCustomPagination?.page,
          size: size || allHealthTransactionsListCustomPagination?.size,
          search: payload?.name,
          payloadData: {
            tType: payload?.type,
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
          },
        })
      );
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  // Fetch the initial list when component mounts
  useEffect(() => {
    getAllTransactionListFilterHandler();
    return () => {};
  }, []);

  // Pagination handlers for page changes
  const handleTransactionsListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllHealthTransactionsListCustomPagination({
          page: value + 1,
          size: allHealthTransactionsListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllHealthTransactionsList({
          page: value + 1,
          size: allHealthTransactionsListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            tType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allHealthTransactionsListCustomPagination?.size, searchFilter]
  );

  // Handle rows per page change
  const handleTransactionsListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllHealthTransactionsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllHealthTransactionsList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            tType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allHealthTransactionsListCustomPagination?.page, searchFilter]
  );

  // Export the transaction list to CSV
  const exportCSVFileHandler = () => {
    dispatch(
      exportHealthTransactionCSVFile({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
      })
    )
      .unwrap()
      .then((res) => {
        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data);
        toast.success("Successfully exported!");
      })
      .catch((err) => {
        toast.error(err);
        console.log(err, "err");
      });
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Health Transactions</Typography>
              </Stack>
            </Stack>

            {/* Filter card and table */}
            <Stack spacing={3}>
              <TransactionHealthFilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search transactions"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
                exportCSVFile={exportCSVFileHandler}
              />

              {/* Loading or Transaction List */}
              {allHealthTransactionsListLoader ? (
                <AnimationLoader open={!!allHealthTransactionsListLoader} />
              ) : (
                <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                  {allHealthTransactionsList && (
                    <HealthTransactionTable
                      count={allHealthTransactionsListPagination?.totalItems}
                      items={allHealthTransactionsList}
                      onPageChange={handleTransactionsListPageChange}
                      onRowsPerPageChange={handleTransactionsListRowsPerPageChange}
                      page={allHealthTransactionsListCustomPagination?.page - 1}
                      rowsPerPage={allHealthTransactionsListCustomPagination?.size}
                      allHealthTransactionListSearchFilter={allHealthTransactionListSearchFilter}
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

HealthTransactions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthTransactions;
