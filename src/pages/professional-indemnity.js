import { CircularProgress, Typography, debounce } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { id } from "date-fns/locale";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimationLoader from "src/components/amimated-loader";
import { SearchInput } from "src/components/search-input";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getProfessionIndemnityList } from "src/sections/commercial/professional-indemnity/Action/professionalIndemnityAction";
import {
  setProfessionIndemnityListPagination,
  setProfessionIndemnitySearchFilter,
} from "src/sections/commercial/professional-indemnity/Reducer/professionalIndemnitySlice";
import ProfessionalIndemnityListTable from "src/sections/commercial/professional-indemnity/professional-indemnity-table";

const ProfessionalIndemnity = () => {
  const dispatch = useDispatch();
  const {
    professionIndemnityList,
    pagination,
    professionIndemnityLoader,
    professionIndemnityPagination,
    profssionIndemnitySearchFilter,
  } = useSelector((state) => state.professionIndemnity);

  // Search filter
  const [searchFilter, setSearchFilter] = useState({
    name: profssionIndemnitySearchFilter?.name || "",
    scrollPosition: profssionIndemnitySearchFilter?.scrollPosition || 0,
  });

  useEffect(() => {
    if (searchFilter) {
      dispatch(setProfessionIndemnitySearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when salesAdmin list is loaded or updated
  useEffect(() => {
    if (profssionIndemnitySearchFilter && !professionIndemnityLoader && professionIndemnityList?.length > 0) {
      window.scrollTo({ top: parseInt(profssionIndemnitySearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [professionIndemnityList]);

  const professionIndemnityFilter = useRef(false);

  // Search handler to update filter state and trigger data fetch
  const searchProfessionIndemnityFilterHandler = (value) => {
    professionIndemnityFilter.current = false;

    dispatch(
      setProfessionIndemnityListPagination({
        page: 1,
        size: 10,
      })
    );
    getProfessionIndemnityFilterHandler({ name: value }, 1, 10);
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // Debounce search handler
  const debounceContractorAllRisksHandler = debounce(searchProfessionIndemnityFilterHandler, 1000);

  // Function to fetch salesAdmin data with the given filter, page, and size
  const getProfessionIndemnityFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (professionIndemnityFilter.current) {
      return;
    }
    professionIndemnityFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getProfessionIndemnityList({
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

  // Get salesAdmin list
  useEffect(() => {
    getProfessionIndemnityFilterHandler(profssionIndemnitySearchFilter?.name);
    return () => {
      // dispatch(
      //   setProfessionIndemnityListPagination({
      //     page: 1,
      //     size: 10,
      //   })
      // );
    };
  }, []);

  // Function to handle page change
  const handleContractorAllRiskPageChange = useCallback(
    (event, value) => {
      dispatch(
        setProfessionIndemnityListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getProfessionIndemnityList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Function to handle rows per page change
  const handleContractorAllRiskRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setProfessionIndemnityListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getProfessionIndemnityList({
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
              <Typography variant="h4">Professional Indemnity</Typography>
            </Stack>
          </Stack>
          <SearchInput
            placeHolder="Search Professional Indemnity"
            searchFilterHandler={debounceContractorAllRisksHandler}
            defaultValue={profssionIndemnitySearchFilter?.name || ""}
          />
          {professionIndemnityLoader ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={professionIndemnityLoader} />
              </Box>
            </>
          ) : (
            <>
              {professionIndemnityList && (
                <ProfessionalIndemnityListTable
                  item={professionIndemnityList}
                  count={professionIndemnityPagination?.totalItems}
                  onPageChange={handleContractorAllRiskPageChange}
                  onRowsPerPageChange={handleContractorAllRiskRowsPerPageChange}
                  page={pagination?.page - 1}
                  rowsPerPage={pagination?.size}
                  profssionIndemnitySearchFilter={profssionIndemnitySearchFilter}
                />
              )}
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

ProfessionalIndemnity.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProfessionalIndemnity;
