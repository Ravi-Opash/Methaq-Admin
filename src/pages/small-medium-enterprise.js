import { Typography, debounce } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimationLoader from "src/components/amimated-loader";
import { SearchInput } from "src/components/search-input";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getSmallMediumEnterpriseList } from "src/sections/commercial/small-medium-enterrise/Action/smallMediumEnterpriseAction";
import {
  setSmallMediumEnterpriseListPagination,
  setSmallMediumEnterpriseSearchFilter,
} from "src/sections/commercial/small-medium-enterrise/Reducer/smallMediumEnterpriseSlice";
import SmallMediumBusinessEnterpriseListTable from "src/sections/commercial/small-medium-enterrise/small-medium-enterprise-table";

const SmallMediumBusinessEnterprise = () => {
  const dispatch = useDispatch();
  const {
    smallMediumEnterpriseList,
    pagination,
    smallMediumEnterpriseLoader,
    smallMediumEnterprisePagination,
    smallMediumEnterpriseSearchFilter,
  } = useSelector((state) => state.smallMediumEnterprise);
  // console.log("smallMediumEnterpriseList", smallMediumEnterpriseList);
  const [searchFilter, setSearchFilter] = useState({
    name: smallMediumEnterpriseSearchFilter?.name || "",
    scrollPosition: smallMediumEnterpriseSearchFilter?.scrollPosition || 0,
  });

  // set search filter
  useEffect(() => {
    if (searchFilter) {
      dispatch(setSmallMediumEnterpriseSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when smallMediumEnterprise list is loaded or updated
  useEffect(() => {
    if (smallMediumEnterpriseSearchFilter && !smallMediumEnterpriseLoader && smallMediumEnterpriseList?.length > 0) {
      window.scrollTo({ top: parseInt(smallMediumEnterpriseSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [smallMediumEnterpriseList]);

  const smallMediumEnterpriseFilter = useRef(false);

  // search filter
  const searchSmallMediumEnterpriseFilterHandler = (value) => {
    smallMediumEnterpriseFilter.current = false;

    dispatch(
      setSmallMediumEnterpriseListPagination({
        page: 1,
        size: 10,
      })
    );
    getSmallMediumEnterpriseFilterHandler({ name: value }, 1, 10);
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // Debounce search
  const debounceContractorAllRisksHandler = debounce(searchSmallMediumEnterpriseFilterHandler, 1000);

  // Function to fetch smallMediumEnterprise data with the given filter, page, and size
  const getSmallMediumEnterpriseFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (smallMediumEnterpriseFilter.current) {
      return;
    }
    smallMediumEnterpriseFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getSmallMediumEnterpriseList({
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

  // Fetch smallMediumEnterprise data
  useEffect(() => {
    getSmallMediumEnterpriseFilterHandler(smallMediumEnterpriseSearchFilter?.name);
    return () => {};
  }, []);

  // Pagination - Change page
  const handleContractorAllRiskPageChange = useCallback(
    (event, value) => {
      dispatch(
        setSmallMediumEnterpriseListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getSmallMediumEnterpriseList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Pagination - Change rows per page
  const handleContractorAllRiskRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setSmallMediumEnterpriseListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getSmallMediumEnterpriseList({
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
              <Typography variant="h4">Small & Medium Business Enterprise</Typography>
            </Stack>
          </Stack>
          <SearchInput
            placeHolder="Search Small & Medium Business Enterprise"
            searchFilterHandler={debounceContractorAllRisksHandler}
            defaultValue={smallMediumEnterpriseSearchFilter?.name || ""}
          />
          {smallMediumEnterpriseLoader ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={true} />
              </Box>
            </>
          ) : (
            <>
              {smallMediumEnterpriseList && (
                <SmallMediumBusinessEnterpriseListTable
                  item={smallMediumEnterpriseList}
                  count={smallMediumEnterprisePagination?.totalItems}
                  onPageChange={handleContractorAllRiskPageChange}
                  onRowsPerPageChange={handleContractorAllRiskRowsPerPageChange}
                  page={pagination?.page - 1}
                  rowsPerPage={pagination?.size}
                  smallMediumEnterpriseSearchFilter={smallMediumEnterpriseSearchFilter}
                />
              )}
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

SmallMediumBusinessEnterprise.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SmallMediumBusinessEnterprise;
