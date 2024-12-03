import { useCallback, useState, useEffect, useRef } from "react";
import { Box, Button, CircularProgress, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import NextLink from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { BlackListTable } from "src/sections/black-list/black-list-table";
import { deleteBlackList, editBlackList, getBlackList } from "src/sections/black-list/action/blackListAction";
import { setBlackListPagination, setBlackListsearchFilter } from "src/sections/black-list/reducer/blackListSlice";
import { moduleAccess } from "src/utils/module-access";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ModalComp from "src/components/modalComp";
import AnimationLoader from "src/components/amimated-loader";

const Page = () => {
  const dispatch = useDispatch();
  const { blackList, blackPagination, pagination, blackListLoader, blackListsearchFilter } = useSelector(
    (state) => state.black
  );
  const { loginUserData: user } = useSelector((state) => state.auth);
  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // Local state for managing search filter and scroll position
  const [searchFilter, setSearchFilter] = useState({
    name: blackListsearchFilter?.name || "",
    scrollPosition: blackListsearchFilter?.scrollPosition || 0,
  });

  // Effect to set the search filter in Redux when the search filter state changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setBlackListsearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Scroll handling logic to restore previous scroll position after reloading the black list
  useEffect(() => {
    if (blackListsearchFilter && !blackListLoader && blackList?.length > 0) {
      const scrollPosition = parseInt(blackListsearchFilter?.scrollPosition, 10);

      // Timeout to give enough time for DOM updates before scrolling
      const timeoutScroll = setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      }, 200);

      return () => clearTimeout(timeoutScroll);
    }
  }, [blackList, blackListLoader]);

  // Ref to track the first render to prevent double API calls in development mode
  const initialized = useRef(false);

  // Function to handle the search input change and reset pagination
  const searchFilterHandler = (value) => {
    initialized.current = false;

    // Reset pagination to page 1 and size 10 when search changes
    dispatch(
      setBlackListPagination({
        page: 1,
        size: 10,
      })
    );
    getBlackListHandler(value, 1, 5);
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // Debounced version of the search handler to reduce API calls during typing
  const debounceSearchHandler = debounce(searchFilterHandler, 1000);

  // Function to fetch the black list based on the search string, page, and size
  const getBlackListHandler = async (searchString = "", page, size) => {
    if (initialized.current) {
      return; // Prevent fetching data if already fetched
    }
    initialized.current = true;

    try {
      // Dispatch action to get the black list data from the backend
      dispatch(
        getBlackList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: searchString, // Search filter value
        })
      )
        .unwrap() // Handle the success response
        .then((res) => {})
        .catch((err) => {
          toast(err, { type: "error" }); // Show error toast if API call fails
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch the black list when the page loads
  useEffect(() => {
    getBlackListHandler();

    return () => {
      // Reset pagination on component unmount
      dispatch(
        setBlackListPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Handle page change event for pagination
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(setBlackListPagination({ page: value + 1, size: pagination?.size }));
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0, // Reset scroll position when page changes
      }));
      // Fetch black list data with updated pagination
      dispatch(getBlackList({ page: value + 1, size: pagination?.size, search: blackListsearchFilter?.name }));
    },
    [pagination?.size, blackListsearchFilter]
  );

  // Handle rows per page change event for pagination
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setBlackListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0, // Reset scroll position
      }));

      // Fetch black list data with updated pagination and rows per page
      dispatch(
        getBlackList({
          page: 1,
          size: event.target.value,
          search: blackListsearchFilter?.name,
        })
      );
    },
    [pagination?.page, blackListsearchFilter]
  );

  // Function to open the modal for deleting a black list item by its ID
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
    },
    [pagination]
  );

  // Function to delete the black list item by its ID
  const deleteByIdHandler = (id) => {
    dispatch(deleteBlackList({ id }))
      .unwrap()
      .then((res) => {
        // Refresh the black list data after deletion
        dispatch(
          getBlackList({
            page: pagination?.page,
            size: pagination?.size,
          })
        );
        toast("Successfully deleted", { type: "success" });
        setOpen(false);
      })
      .catch((err) => {
        toast(err, { type: "error" });
        setOpen(false);
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
                <Typography variant="h4">Black List</Typography>
              </Stack>

              {/* Button to navigate to the "create black list" page, based on user permission */}
              {moduleAccess(user, "blacklist.create") && (
                <NextLink href={`/black-list/create`} passHref>
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

            {/* Component to render the search bar */}
            <CustomersSearch searchFilterHandler={debounceSearchHandler} placeHolder={"Search black list"} />

            {/* Loader to show while the black list is loading */}
            {blackListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                <AnimationLoader open={true} />
              </Box>
            ) : (
              <>
                {/* Render black list table if the data is available */}
                {blackList !== null && (
                  <BlackListTable
                    count={blackPagination?.totalItems}
                    items={blackList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    deleteBlackHandler={deleteModalByIdHandler}
                    searchFilter={searchFilter}
                    blackListsearchFilter={blackListsearchFilter}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Modal for confirming deletion */}
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
