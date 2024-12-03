import { useCallback, useState, useEffect, useRef } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCustomerStatusById,
  deleteCustomerById,
  exportUserListCsv,
  getCustomerList,
} from "src/sections/customer/action/customerAction";
import { setCustomerListPagination, setCustomerSearchFilter } from "src/sections/customer/reducer/customerSlice";
import ModalComp from "src/components/modalComp";
import { debounce } from "src/utils/debounce-search";
import AnimationLoader from "src/components/amimated-loader";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = () => {
  const dispatch = useDispatch();
  const { customerList, customerPagination, pagination, customerListLoader, customerSearchFilter } = useSelector(
    (state) => state.customer
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    name: customerSearchFilter?.name || "",
    scrollPosition: customerSearchFilter?.scrollPosition || 0,
  });

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // Effect to update search filter in Redux whenever it changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setCustomerSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Effect to handle scroll position after the customer list loads
  useEffect(() => {
    if (customerSearchFilter && !customerListLoader && customerList?.length > 0) {
      window.scrollTo({ top: parseInt(customerSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [customerList]);

  const initialized = useRef(false);

  // Function to handle search filter changes
  const searchFilterHandler = (value) => {
    initialized.current = false;

    // Reset pagination when search filter changes
    dispatch(
      setCustomerListPagination({
        page: 1,
        size: 10,
      })
    );

    getCustomerListHandler(value, 1, 10);
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // Debounced version of the search handler to prevent excessive API calls
  const debounceSearchHandler = debounce(searchFilterHandler, 1000);

  // Function to fetch the customer list with pagination and search filters
  const getCustomerListHandler = async (searchString = "", page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(
        getCustomerList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: searchString,
        })
      )
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(
    () => {
      getCustomerListHandler(customerSearchFilter?.name);

      return () => {};
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Pagination handler for page change
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setCustomerListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getCustomerList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Handler for change in rows per page (pagination size change)
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setCustomerListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getCustomerList({
          page: 1,
          size: event.target.value,
          search: searchFilter,
        })
      );
    },
    [pagination?.page]
  );

  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [pagination]
  );

  // Function to open the delete confirmation modal
  const deleteByIdHandler = (id) => {
    dispatch(deleteCustomerById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getCustomerList({
              page: pagination?.page,
              size: pagination?.size,
              search: searchFilter?.name,
            })
          );

          setOpen(false);

          toast("Successfully Deleted", {
            type: "success",
          });
        }
      })
      .catch(() => {});
  };

  // Function to handle changing customer status
  const changeStatusHandler = useCallback(
    (data) => {
      dispatch(changeCustomerStatusById(data))
        .unwrap()
        .then((res) => {
          if (res?.success) {
            dispatch(
              getCustomerList({
                page: pagination?.page,
                size: pagination?.size,
                search: searchFilter?.name,
              })
            );

            toast("Successfully Changed", {
              type: "success",
            });
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    },
    [pagination]
  );

  // Function to handleExport CSV
  const onExportCSVHandler = () => {
    setIsLoading(true);
    dispatch(exportUserListCsv({}))
      .unwrap()
      .then((res) => {
        setIsLoading(false);
        location.href = baseURL + res;
      })
      .catch((err) => {
        console.log(err, "err");
        setIsLoading(false);
        toast.error(err);
      });
  };

  return (
    <>
      {isLoading && <AnimationLoader open={true} />}
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
                <Typography variant="h4">Customers</Typography>
              </Stack>
            </Stack>
            <CustomersSearch
              defaultValue={customerSearchFilter?.name || ""}
              searchFilterHandler={debounceSearchHandler}
              isButton={true}
              onButtonClick={onExportCSVHandler}
            />

            {customerListLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={!!customerListLoader} />
              </Box>
            ) : (
              <>
                {customerList !== null && (
                  <CustomersTable
                    count={customerPagination?.totalItems}
                    items={customerList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    deleteCustomerHandler={deleteModalByIdHandler}
                    changeStatusHandler={changeStatusHandler}
                    customerSearchFilter={customerSearchFilter}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>

      <ModalComp open={open} handleClose={handleClose}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to delete ?
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
          mt={3}
        >
          <Button
            variant="contained"
            sx={{
              marginRight: "10px",
            }}
            onClick={() => deleteByIdHandler(deleteId)}
          >
            Yes
          </Button>
          <Button data-cy="close-modal" variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
