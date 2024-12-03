import { useCallback, useState, useEffect, useRef } from "react";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CorporateCustomersTable } from "src/sections/corporate-customer/customers-table";
import { CorporateCustomersSearch } from "src/sections/corporate-customer/customers-search";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCustomerStatusById,
  deleteCustomerById,
  getCorporateCustomerList,
} from "src/sections/corporate-customer/action/corporateCustomerAction";
import {
  setCorporateCustomerDetails,
  setCorporateCustomerListPagination,
  setCorporteCustomerSearchlist,
} from "src/sections/corporate-customer/reducer/corpotateCustomerSlice";
import ModalComp from "src/components/modalComp";
import { debounce } from "src/utils/debounce-search";
import AnimationLoader from "src/components/amimated-loader";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { moduleAccess } from "src/utils/module-access";

// Options for filtering corporate customers by insurance type
const options = [
  { value: "carFleetInsurance", label: "Car Fleet Insurance" },
  { value: "healthInsurance", label: "Health insurance" },
  { value: "generalInsurance", label: "General Insurance" },
];

const Page = () => {
  const dispatch = useDispatch();

  // Accessing Redux state for corporate customers and pagination
  const {
    corporateCustomerList,
    corporateCustomerPagination,
    corporatePagination,
    corporateCustomerListLoader,
    corporateCustomerSearchFilter,
  } = useSelector((state) => state.corporateCustomer);

  // Accessing logged-in user data for module access control
  const { loginUserData: user } = useSelector((state) => state.auth);

  // Local state to manage the search filter applied
  const [searchFilter, setSearchFilter] = useState({
    name: corporateCustomerSearchFilter?.name || "",
    type: corporateCustomerSearchFilter?.type || "",
    scrollPosition: corporateCustomerSearchFilter?.scrollPosition || 0,
  });

  // Effect to update search filter in Redux whenever it changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setCorporteCustomerSearchlist(searchFilter));
    }
  }, [searchFilter]);

  // Effect to handle scroll position after the customer list loads
  useEffect(() => {
    if (corporateCustomerSearchFilter && !corporateCustomerListLoader && corporateCustomerList?.length > 0) {
      window.scrollTo({ top: parseInt(corporateCustomerSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [corporateCustomerList]);

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // Ref to prevent multiple API calls in development mode due to React.StrictMode
  const initialized = useRef(false);

  // Function to handle search filter changes
  const searchFilterHandler = (name, value) => {
    initialized.current = false;

    // Reset pagination when search filter changes
    dispatch(
      setCorporateCustomerListPagination({
        page: 1,
        size: 10,
      })
    );

    // Apply search filter and fetch new customer list
    if (name && (value === "" || value)) {
      getCustomerListHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getCustomerListHandler();
    }
  };

  // Debounced version of the search handler to prevent excessive API calls
  const debounceSearchHandler = debounce(searchFilterHandler, 1000);

  // Function to fetch the customer list with pagination and search filters
  const getCustomerListHandler = async (otherProps, page, size) => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getCorporateCustomerList({
          page: page || corporatePagination?.page,
          size: size || corporatePagination?.size,
          search: payload?.name,
          payloadData: {
            insuranceType: payload?.type,
            agentId: payload?.agentId,
          },
        })
      )
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, { type: "error" });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch customer list when the component mounts
  useEffect(() => {
    getCustomerListHandler(corporateCustomerSearchFilter?.name);

    return () => {};
  }, []);

  // Pagination handler for page change
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setCorporateCustomerListPagination({
          page: value + 1,
          size: corporatePagination?.size,
        })
      );

      // Reset scroll position on page change
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch new customer list based on updated page
      dispatch(
        getCorporateCustomerList({
          page: value + 1,
          size: corporatePagination?.size,
          search: searchFilter?.name,
          payloadData: {
            insuranceType: searchFilter?.type,
            agentId: searchFilter?.agentId,
          },
        })
      );
    },
    [corporatePagination?.size, searchFilter]
  );

  // Handler for change in rows per page (pagination size change)
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setCorporateCustomerListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      // Reset scroll position when rows per page changes
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      // Fetch customer list based on new page size
      dispatch(
        getCorporateCustomerList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            insuranceType: searchFilter?.type,
            agentId: searchFilter?.agentId,
          },
        })
      );
    },
    [corporatePagination?.page]
  );

  // Function to open the delete confirmation modal
  const deleteModalByIdHandler = useCallback((id) => {
    setOpen(true);
    setDeleteId(id);
  }, []);

  // Function to delete customer by ID
  const deleteByIdHandler = (id) => {
    dispatch(deleteCustomerById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          // Fetch updated customer list after deletion
          dispatch(
            getCorporateCustomerList({
              page: corporatePagination?.page,
              size: corporatePagination?.size,
              search: searchFilter?.name,
              payloadData: {
                insuranceType: searchFilter?.type,
                agentId: searchFilter?.agentId,
              },
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
            // Fetch updated customer list after status change
            dispatch(
              getCorporateCustomerList({
                page: corporatePagination?.page,
                size: corporatePagination?.size,
                search: searchFilter?.name,
                payloadData: {
                  insuranceType: searchFilter?.type,
                  agentId: searchFilter?.agentId,
                },
              })
            );

            toast("Successfully Changed", {
              type: "success",
            });
          }
        })
        .catch((err) => {
          toast(err, { type: "error" });
        });
    },
    [corporatePagination]
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
                <Typography variant="h4">Corporate Customers</Typography>
              </Stack>
              {moduleAccess(user, "corporateCustomer.create") && (
                <NextLink
                  href={`/corporate-customers/create`}
                  passHref
                  onClick={() => dispatch(setCorporateCustomerDetails(null))}
                >
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Add
                  </Button>
                </NextLink>
              )}
            </Stack>
            <CorporateCustomersSearch
              searchFilterHandler={debounceSearchHandler}
              statusOptions={options}
              filterLabel="Line of Business"
              defaultValue={corporateCustomerSearchFilter?.name || ""}
            />

            {corporateCustomerListLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={corporateCustomerListLoader} />
              </Box>
            ) : (
              <>
                {corporateCustomerList !== null && (
                  <CorporateCustomersTable
                    count={corporateCustomerPagination?.totalItems}
                    items={corporateCustomerList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={corporatePagination?.page - 1}
                    rowsPerPage={corporatePagination?.size}
                    deleteCustomerHandler={deleteModalByIdHandler}
                    changeStatusHandler={changeStatusHandler}
                    corporateCustomerSearchFilter={corporateCustomerSearchFilter}
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
          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
