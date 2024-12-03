import { CircularProgress, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import SponsorsTable from "src/sections/sponsors/sponsors-table";
import { getSponsorsList } from "src/sections/sponsors/action/sponsorAction";
import { setSponsorsListPagination } from "src/sections/sponsors/reducer/sponsorSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { debounce } from "src/utils/debounce-search";
import AnimationLoader from "src/components/amimated-loader";

const Sponsors = () => {
  const dispatch = useDispatch();
  const { sponsorsList, sponsorsListPagination, sponsorsPagination, sponsorsListLoader } = useSelector(
    (state) => state.sponsors
  );
  const [searchFilter, setSearchFilter] = useState("");

  const initialized = useRef(false);

  // Sponsors List
  const getSponsorsListHandler = async (page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(
        getSponsorsList({
          page: page || sponsorsPagination?.page,
          size: size || sponsorsPagination?.size,
          search: searchFilter || "",
        })
      )
        .unwrap()
        .then((res) => {
          // console.log("res- getCustomerListHandler", res);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Sponsors List
  useEffect(() => {
    getSponsorsListHandler();

    return () => {};
  }, []);

  // Pagination - page change
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(setSponsorsListPagination({ page: value + 1, size: sponsorsPagination?.size }));
      dispatch(
        getSponsorsList({
          page: value + 1,
          size: sponsorsPagination?.size,
          search: searchFilter || "",
        })
      );
    },
    [sponsorsPagination?.size]
  );

  // Pagination - rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setSponsorsListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getSponsorsList({
          page: 1,
          size: event.target.value,
          search: searchFilter || "",
        })
      );
    },
    [sponsorsPagination?.page]
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
              <Stack spacing={1} mb={2}>
                <Typography variant="h4">Affiliate Links</Typography>
              </Stack>
            </Stack>

            {/* <SearchInput placeHolder="Search sponsors" searchFilterHandler={debounceLeadsHandler} /> */}

            {sponsorsListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                {/* <CircularProgress /> */}
                <AnimationLoader open={true} />
              </Box>
            ) : (
              <>
                {sponsorsList && (
                  <SponsorsTable
                    count={sponsorsListPagination?.totalItems}
                    items={sponsorsList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={sponsorsPagination?.page - 1}
                    rowsPerPage={sponsorsPagination?.size}
                    searchFilter={searchFilter}
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
Sponsors.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Sponsors;
