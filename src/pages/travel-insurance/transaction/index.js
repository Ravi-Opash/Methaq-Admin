import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  exportTravelTransactionCSVFile,
  getAllTravelTransactionsList,
} from "src/sections/travel-insurance/Transaction/Action/travelTransactionAction";
import {
  setAllTravelTransactionsListCustomPagination,
  setTravelTransactionSearchFilter,
} from "src/sections/travel-insurance/Transaction/Reducer/travelTransactionSlice";
import TransactionTravelFilterCard from "src/sections/travel-insurance/Transaction/transaction-filter-card";
import TravelTransactionTable from "src/sections/travel-insurance/Transaction/travel-transactions-table";
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

// Function to handle CSV download
const TravelTransactions = () => {
  const {
    allTravelTransactionsListCustomPagination,
    allTravelTransactionsListLoader,
    allTravelTransactionsList,
    allTravelTransactionsListPagination,
    TravelTransactionsSearchFilter,
  } = useSelector((state) => state.travelTransactions);

  const dispatch = useDispatch();

  // Function to handle PDF download
  const [searchFilter, setSearchFilter] = useState({
    name: TravelTransactionsSearchFilter?.name || "",
    type: TravelTransactionsSearchFilter?.type || "all",
    fromDate: TravelTransactionsSearchFilter?.fromDate || ``,
    toDate: TravelTransactionsSearchFilter?.toDater || ``,
    scrollPosition: TravelTransactionsSearchFilter?.scrollPosition || 0,
  });

  // Function to set the search filter
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Function to set the search filter
  useEffect(() => {
    if (searchFilter) {
      dispatch(setTravelTransactionSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Function to set the scroll position
  useEffect(() => {
    if (TravelTransactionsSearchFilter && !allTravelTransactionsListLoader && allTravelTransactionsList?.length > 0) {
      window.scrollTo({ top: parseInt(TravelTransactionsSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allTravelTransactionsList]);

  // Function to set the scroll position
  const transactionListFilter = useRef(false);

  // Function to handle search
  const searchFilterHandler = (name, value) => {
    transactionListFilter.current = false;
    dispatch(
      setAllTravelTransactionsListCustomPagination({
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

  // Function to handle search and delay 1 sec
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Function to get the travel transaction list
  const getAllTransactionListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (transactionListFilter.current) {
      return;
    }
    transactionListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllTravelTransactionsList({
          page: page || allTravelTransactionsListCustomPagination?.page,
          size: size || allTravelTransactionsListCustomPagination?.size,
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


  // Function to get the travel transaction list
  useEffect(() => {
    getAllTransactionListFilterHandler();
    return () => {
      // dispatch(
      //   setAllTravelTransactionsListCustomPagination({
      //     page: 1,
      //     size: 10,
      //   })
      // );
    };
  }, []);

  // Function to handle pagination
  const handleTransactionsListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllTravelTransactionsListCustomPagination({
          page: value + 1,
          size: allTravelTransactionsListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllTravelTransactionsList({
          page: value + 1,
          size: allTravelTransactionsListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            tType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allTravelTransactionsListCustomPagination?.size, searchFilter]
  );
  
  // Function to handle pagination
  const handleTransactionsListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllTravelTransactionsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllTravelTransactionsList({
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
    [allTravelTransactionsListCustomPagination?.page, searchFilter]
  );

  // export csv
  const exportCSVFileHandler = () => {
    dispatch(
      exportTravelTransactionCSVFile({
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
                <Typography variant="h4">Travel Transactions</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <TransactionTravelFilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search transactions"
                FilterDataHandler={FilterDataHandler}
                exportCSVFile={exportCSVFileHandler}
              />

              {allTravelTransactionsListLoader ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <AnimationLoader open={allTravelTransactionsListLoader} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                  {allTravelTransactionsList && (
                    <TravelTransactionTable
                      count={allTravelTransactionsListPagination?.totalItems}
                      items={allTravelTransactionsList}
                      onPageChange={handleTransactionsListPageChange}
                      onRowsPerPageChange={handleTransactionsListRowsPerPageChange}
                      page={allTravelTransactionsListCustomPagination?.page - 1}
                      rowsPerPage={allTravelTransactionsListCustomPagination?.size}
                      TravelTransactionsSearchFilter={TravelTransactionsSearchFilter}
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
TravelTransactions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelTransactions;
