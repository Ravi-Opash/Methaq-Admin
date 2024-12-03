import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import FilterCard from "src/components/filterCard";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getAllLandTransactionsList } from "src/sections/Land-insurance/Transaction/Action/landTransactionAction";
import {
  setAlllandtransactionSearchFilter,
  setAllLandTransactionsListCustomPagination,
} from "src/sections/Land-insurance/Transaction/Reducer/landTransactionSlice";
import LandTransactionTable from "src/sections/Land-insurance/Transaction/land-transactions-table";
import { debounce } from "src/utils/debounce-search";

const HealthTransactions = () => {
  const {
    allLandTransactionsListCustomPagination,
    allLandTransactionsListLoader,
    allLandTransactionsList,
    allLandTransactionsListPagination,
    allLandTransectionsearchFilter,
  } = useSelector((state) => state.landTransactions);

  const dispatch = useDispatch();

  const [searchFilter, setSearchFilter] = useState({
    name: allLandTransectionsearchFilter?.name || "",
    type: allLandTransectionsearchFilter?.type || "all",
    fromDate: allLandTransectionsearchFilter?.fromDate || ``,
    toDate: allLandTransectionsearchFilter?.toDate || ``,
    scrollPosition: allLandTransectionsearchFilter?.scrollPosition || 0,
  });

  // Update filter state handler
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  useEffect(() => {
    // Upldate redux as per state chnage ( to Applay same state when user come back )
    if (searchFilter) {
      dispatch(setAlllandtransactionSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  useEffect(() => {
    // set scroll position
    if (allLandTransectionsearchFilter && !allLandTransactionsListLoader && allLandTransactionsList?.length > 0) {
      window.scrollTo({ top: parseInt(allLandTransectionsearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allLandTransactionsList]);

  const transactionListFilter = useRef(false);
  // Filter handler
  const searchFilterHandler = (name, value) => {
    transactionListFilter.current = false;
    dispatch(
      setAllLandTransactionsListCustomPagination({
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

  const debounceHandler = debounce(searchFilterHandler, 1000);
  // Transaction filter handler.
  const getAllTransactionListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (transactionListFilter.current) {
      return;
    }
    transactionListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllLandTransactionsList({
          page: page || allLandTransactionsListCustomPagination?.page,
          size: size || allLandTransactionsListCustomPagination?.size,
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

  useEffect(() => {
    getAllTransactionListFilterHandler();
    return () => {};
  }, []);

  // Page chnage handler 
  const handleTransactionsListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllLandTransactionsListCustomPagination({
          page: value + 1,
          size: allLandTransactionsListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllLandTransactionsList({
          page: value + 1,
          size: allLandTransactionsListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            tType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allLandTransactionsListCustomPagination?.size, searchFilter]
  );

  // Rows per page chnage handler.
  const handleTransactionsListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllLandTransactionsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllLandTransactionsList({
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
    [allLandTransactionsListCustomPagination?.page, searchFilter]
  );
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
                <Typography variant="h4">Land Transactions</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              {/* Filter form */}
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search transactions"
                selectOptions={null}
                FilterDataHandler={FilterDataHandler}
              />

              {allLandTransactionsListLoader ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <AnimationLoader open={true} />
                </Box>
              ) : (
                <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                  {allLandTransactionsList && (
                    <LandTransactionTable
                      count={allLandTransactionsListPagination?.totalItems}
                      items={allLandTransactionsList}
                      onPageChange={handleTransactionsListPageChange}
                      onRowsPerPageChange={handleTransactionsListRowsPerPageChange}
                      page={allLandTransactionsListCustomPagination?.page - 1}
                      rowsPerPage={allLandTransactionsListCustomPagination?.size}
                      allLandTransectionsearchFilter={allLandTransectionsearchFilter}
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
