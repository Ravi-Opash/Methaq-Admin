import { CircularProgress, Link, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import NextLink from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { debounce } from "src/utils/debounce-search";
import { getSponsorsDetailById } from "src/sections/sponsors/action/sponsorAction";
import { setSponsorsDetailsListPagination } from "src/sections/sponsors/reducer/sponsorSlice";
import SponsorsDetailsTable from "src/sections/sponsors/sponsors-details-table";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/router";

const SponsorsDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { sponsorsDetailsList, sponsorsDetailsListPagination, sponsorsDetailsPagination, sponsorsDetailsLoader } =
    useSelector((state) => state.sponsors);

  // Local state to manage search filter input
  const [searchFilter, setSearchFilter] = useState("");

  // Fetching the sponsorsId from the query parameters in the URL
  const { sponsorsId } = router.query;

  // Function to handle the search input and trigger fetching filtered data
  const searchFilterHandler = (value) => {
    dispatch(
      getSponsorsDetailById({
        page: sponsorsDetailsPagination?.page,
        size: sponsorsDetailsPagination?.size,
        search: value || "",
        id: sponsorsId,
      })
    );
    setSearchFilter(value);
  };

  // Debouncing function to limit the number of API calls while typing
  const debounceLeadsHandler = debounce(searchFilterHandler, 1000);

  // Ref to ensure API call is made only once during component mount
  const initialized = useRef(false);

  // Function to fetch sponsors' details list when the component is mounted
  const getSponsorsListHandler = async () => {
    // Prevent multiple API calls in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(
        getSponsorsDetailById({
          page: sponsorsDetailsPagination?.page,
          size: sponsorsDetailsPagination?.size,
          search: searchFilter || "",
          id: sponsorsId,
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

  // Effect to fetch sponsors' details when the component is mounted
  useEffect(() => {
    getSponsorsListHandler();

    // Reset pagination when component unmounts
    return () => {
      dispatch(
        setSponsorsDetailsListPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []);

  // Function to handle page change for pagination
  const handlePageChange = useCallback(
    (event, value) => {
      // Update pagination state in Redux store
      dispatch(
        setSponsorsDetailsListPagination({
          page: value + 1,
          size: sponsorsDetailsPagination?.size,
        })
      );

      // Fetch sponsors' details based on new page
      dispatch(
        getSponsorsDetailById({
          page: value + 1,
          size: sponsorsDetailsPagination?.size,
          search: searchFilter || "",
          id: sponsorsId,
        })
      );
    },
    [sponsorsDetailsPagination?.size]
  );

  // Function to handle changes in the number of rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      // Update the page size in Redux store
      dispatch(
        setSponsorsDetailsListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      // Fetch sponsors' details based on new page size
      dispatch(
        getSponsorsDetailById({
          page: 1,
          size: event.target.value,
          search: searchFilter || "",
          id: sponsorsId,
        })
      );
    },
    [sponsorsDetailsPagination?.page]
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
            {/* Link to navigate back to the sponsors list */}
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <NextLink href="/sponsors" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Affiliate Links</Typography>
                </Link>
              </NextLink>
            </Box>

            {/* Title for the page */}
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1} mb={2}>
                <Typography variant="h4">Affiliate Links Details</Typography>
              </Stack>
            </Stack>

            {/* Show loading spinner while data is being fetched */}
            {sponsorsDetailsLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Render the table with sponsor details if data is available */}
                {sponsorsDetailsList && (
                  <SponsorsDetailsTable
                    count={sponsorsDetailsListPagination?.totalItems} // Total number of items for pagination
                    items={sponsorsDetailsList} // The list of sponsors' details
                    onPageChange={handlePageChange} // Pagination page change handler
                    onRowsPerPageChange={handleRowsPerPageChange} // Rows per page change handler
                    page={sponsorsDetailsPagination?.page - 1} // Adjust page to 0-based index
                    rowsPerPage={sponsorsDetailsPagination?.size} // Number of rows per page
                    searchFilter={searchFilter} // Pass the current search filter
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

SponsorsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SponsorsDetails;
