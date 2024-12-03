import { Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";
import { SearchInput } from "src/components/search-input";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getworkmenCompensationList } from "src/sections/commercial/workmen-compensation/Action/workmenCompensationAction";
import {
  setWorkmenCompensationListPagination,
  setWorkmenCompensationSearchfilter,
} from "src/sections/commercial/workmen-compensation/Reducer/workmenCompensationSlice";
import WorkmenCompensationListTable from "src/sections/commercial/workmen-compensation/workmen-compensation-table";
import { debounce } from "src/utils/debounce-search";

const WorkmenCompensation = () => {
  const dispatch = useDispatch();
  const {
    workmenCompensationList,
    pagination,
    workmenCompensationPagination,
    workmenCompensationLoader,
    workmenCompensationSearchFilter,
  } = useSelector((state) => state.workmenCompensation);

  // Search filter
  const [searchFilter, setSearchFilter] = useState({
    name: workmenCompensationSearchFilter?.name || "",
    scrollPosition: workmenCompensationSearchFilter?.scrollPosition || 0,
  });

  // Update the Redux store whenever searchFilter changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setWorkmenCompensationSearchfilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when workmenCompensation list is loaded or updated
  useEffect(() => {
    if (workmenCompensationSearchFilter && !workmenCompensationLoader && workmenCompensationList?.length > 0) {
      window.scrollTo({ top: parseInt(workmenCompensationSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [workmenCompensationList]);

  const workmenCompensationListFilter = useRef(false);

  // Function to handle search filter changes
  const searchWorkmenCompensationFilterHandler = (value) => {
    workmenCompensationListFilter.current = false;

    dispatch(
      setWorkmenCompensationListPagination({
        page: 1,
        size: 10,
      })
    );

    getWorkmenCompensationListFilterHandler({ name: value }, 1, 10);
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // Debounce the search handler
  const debounceWorkmenCompensationHandler = debounce(searchWorkmenCompensationFilterHandler, 1000);

  // Function to fetch workmen compensation data with the given filter, page, and size
  const getWorkmenCompensationListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (workmenCompensationListFilter.current) {
      return;
    }
    workmenCompensationListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getworkmenCompensationList({
          page: page || pagination?.page,
          size: size || pagination?.size,
          search: payload?.name,
        })
      );
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  // Fetch workmen compensation data when the component mounts
  useEffect(() => {
    getWorkmenCompensationListFilterHandler(workmenCompensationSearchFilter?.name);
    return () => {
      // dispatch(
      //   setWorkmenCompensationListPagination({
      //     page: 1,
      //     size: 10,
      //   })
      // );
    };
  }, []);

  // Pagination - page change
  const handleWorkmenCompensationPageChange = useCallback(
    (event, value) => {
      dispatch(
        setWorkmenCompensationListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getworkmenCompensationList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Pagination - rows per page
  const handleWorkmenCompensationRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setWorkmenCompensationListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getworkmenCompensationList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  return (
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
              <Typography variant="h4">Workmen Compensation</Typography>
            </Stack>
          </Stack>
          <SearchInput
            placeHolder="Search commercials"
            searchFilterHandler={debounceWorkmenCompensationHandler}
            defaultValue={workmenCompensationSearchFilter?.name || ""}
          />

          {workmenCompensationLoader ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "10rem !important",
              }}
            >
              <AnimationLoader open={true} />
            </Box>
          ) : (
            <>
              {workmenCompensationList && (
                <WorkmenCompensationListTable
                  item={workmenCompensationList}
                  count={workmenCompensationPagination?.totalItems}
                  onPageChange={handleWorkmenCompensationPageChange}
                  onRowsPerPageChange={handleWorkmenCompensationRowsPerPageChange}
                  page={pagination?.page - 1}
                  rowsPerPage={pagination?.size}
                  workmenCompensationSearchFilter={workmenCompensationSearchFilter}
                />
              )}
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

WorkmenCompensation.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WorkmenCompensation;
