import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FilterCard from "src/components/filterCard";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getAllMotorFleetTransactionsList } from "src/sections/motor-fleet/Transaction/Action/motorFleetTransactionAction";
import { setAllMotorFleetTransactionsListCustomPagination } from "src/sections/motor-fleet/Transaction/Reducer/motorFleetTransactionSlice";
import TravelTransactionTable from "src/sections/motor-fleet/Transaction/motor-fleet-transactions-table";
import { debounce } from "src/utils/debounce-search";

const TravelTransactions = () => {
  const {
    allMotorFleetTransactionsListCustomPagination,
    allMotorFleetTransactionsListLoader,
    allMotorFleetTransactionsList,
    allMotorFleetTransactionsListPagination,
  } = useSelector((state) => state.motorFleetTransactions);

  const dispatch = useDispatch();

  // Filter for search
  const [searchFilter, setSearchFilter] = useState({
    name: "",
    type: "all",
    fromDate: ``,
    toDate: ``,
  });

  // Filter for search
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function for transaction list
  const transactionListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    transactionListFilter.current = false;
    dispatch(
      setAllMotorFleetTransactionsListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllTransactionListFilterHandler({ [name]: value });
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getAllTransactionListFilterHandler();
    }
  };

  // Function for transaction list
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Function for transaction list
  const getAllTransactionListFilterHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (transactionListFilter.current) {
      return;
    }
    transactionListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllMotorFleetTransactionsList({
          page: allMotorFleetTransactionsListCustomPagination?.page,
          size: allMotorFleetTransactionsListCustomPagination?.size,
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

  // Function for transaction list
  useEffect(() => {
    getAllTransactionListFilterHandler();
    return () => {
      dispatch(
        setAllMotorFleetTransactionsListCustomPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []);

  // Function for transaction list page change
  const handleTransactionsListPageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllMotorFleetTransactionsListCustomPagination({
          page: value + 1,
          size: allMotorFleetTransactionsListCustomPagination?.size,
        })
      );

      dispatch(
        getAllMotorFleetTransactionsList({
          page: value + 1,
          size: allMotorFleetTransactionsListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            tType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allMotorFleetTransactionsListCustomPagination?.size, searchFilter]
  );

  // Function for transaction list rows per page
  const handleTransactionsListRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllMotorFleetTransactionsListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getAllMotorFleetTransactionsList({
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
    [allMotorFleetTransactionsListCustomPagination?.page, searchFilter]
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
                <Typography variant="h4">Motor Fleet Transactions</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search transactions"
                selectOptions={null}
                FilterDataHandler={FilterDataHandler}
              />

              {allMotorFleetTransactionsListLoader ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                  {allMotorFleetTransactionsList && (
                    <TravelTransactionTable
                      count={allMotorFleetTransactionsListPagination?.totalItems}
                      items={allMotorFleetTransactionsList}
                      onPageChange={handleTransactionsListPageChange}
                      onRowsPerPageChange={handleTransactionsListRowsPerPageChange}
                      page={allMotorFleetTransactionsListCustomPagination?.page - 1}
                      rowsPerPage={allMotorFleetTransactionsListCustomPagination?.size}
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
