import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  exportMotorTransactionCSVFile,
  getAllTransactionsList,
} from "src/sections/transactions/action/transactionAction";
import AllTransactionTable from "src/sections/transactions/all-transactions-table";
import {
  setAllTransactionsListCustomPagination,
  setPolicyTransactionSearchFilter,
} from "src/sections/transactions/reducer/transactionSlice";
import TransactionFilterCard from "src/sections/transactions/transaction-filter-card";
import { debounce } from "src/utils/debounce-search";

// Function to handle PDF download
const downloadPdf = (pdfUrl) => {
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.setAttribute("rel", "noopener noreferrer");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const Transactions = () => {
  const {
    allTransactionsListCustomPagination,
    allTransactionsListLoader,
    allTransactionsList,
    allTransactionsListPagination,
    policyTransactionSearchFilter,
  } = useSelector((state) => state.transactions);

  const dispatch = useDispatch();

  // Local state to manage the search filter
  const [searchFilter, setSearchFilter] = useState({
    name: policyTransactionSearchFilter?.name || "",
    type: policyTransactionSearchFilter?.type || "all",
    fromDate: policyTransactionSearchFilter?.fromDate || ``,
    toDate: policyTransactionSearchFilter?.toDate || ``,
    scrollPosition: policyTransactionSearchFilter?.scrollPosition || 0,
  });

  // Filter data handler
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Search filter handler
  useEffect(() => {
    if (searchFilter) {
      dispatch(setPolicyTransactionSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when salesAdmin list is loaded or updated
  useEffect(() => {
    if (policyTransactionSearchFilter && !allTransactionsListLoader && allTransactionsList?.length > 0) {
      window.scrollTo({ top: parseInt(policyTransactionSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allTransactionsList]);

  const transactionListFilter = useRef(false);

  // Function to handle search
  const searchFilterHandler = (name, value) => {
    transactionListFilter.current = false;
    dispatch(
      setAllTransactionsListCustomPagination({
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

  // Debounce search
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // get all transactions list api
  const getAllTransactionListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (transactionListFilter.current) {
      return;
    }
    transactionListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllTransactionsList({
          page: page || allTransactionsListCustomPagination?.page,
          size: size || allTransactionsListCustomPagination?.size,
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

  // useEffect to get the transaction list
  useEffect(() => {
    getAllTransactionListFilterHandler();
    return () => {};
  }, []);

  // Function to handle page change
  const handleTransactionsListPageChange = useCallback(
    (event, value) => {
      // console.log("value", value);

      dispatch(
        setAllTransactionsListCustomPagination({
          page: value + 1,
          size: allTransactionsListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllTransactionsList({
          page: value + 1,
          size: allTransactionsListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            tType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allTransactionsListCustomPagination?.size, searchFilter]
  );

  // Function to handle rows per page change
  const handleTransactionsListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllTransactionsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllTransactionsList({
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
    [allTransactionsListCustomPagination?.page, searchFilter]
  );

  // Function to handle export
  const exportCSVFileHandler = () => {
    dispatch(
      exportMotorTransactionCSVFile({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
      })
    )
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data);
        toast.success("successfully exported!");
      })
      .catch((err) => {
        toast.error(err);
        console.log(err, "err");
      });
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Transactions</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <TransactionFilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search transactions"
                FilterDataHandler={FilterDataHandler}
                exportCSVFile={exportCSVFileHandler}
              />

              {allTransactionsListLoader ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress /> */}
                  <AnimationLoader open={!!allTransactionsListLoader} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                  {allTransactionsList && (
                    <AllTransactionTable
                      count={allTransactionsListPagination?.totalItems}
                      items={allTransactionsList}
                      onPageChange={handleTransactionsListPageChange}
                      onRowsPerPageChange={handleTransactionsListRowsPerPageChange}
                      page={allTransactionsListCustomPagination?.page - 1}
                      rowsPerPage={allTransactionsListCustomPagination?.size}
                      policyTransactionSearchFilter={policyTransactionSearchFilter}
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
