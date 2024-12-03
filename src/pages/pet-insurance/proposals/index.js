import { Typography, debounce } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimationLoader from "src/components/amimated-loader";
import { SearchInput } from "src/components/search-input";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getPetInsuranceList } from "src/sections/pet-insurance/Action/petInsuranceAction";
import {
  setPetInsuranceListPagination,
  setPetInsuranceSearchFilter,
} from "src/sections/pet-insurance/Reducer/petInsuranceSlice";
import PetInsuranceTable from "src/sections/pet-insurance/pet-insurance-table";
const PetInsurance = () => {
  const dispatch = useDispatch();
  const { petInsuranceList, pagination, petInsurancePagination, petInsuranceLoader, petInsuranceSearchFilter } =
    useSelector((state) => state.petInsurance);

  // console.log("petInsuranceList", petInsuranceList);

  // Filter state
  const [searchFilter, setSearchFilter] = useState({
    name: petInsuranceSearchFilter?.name || "",
    scrollPosition: petInsuranceSearchFilter?.scrollPosition || "",
  });

  // Set initial search filter state from redux state or default
  useEffect(() => {
    if (searchFilter) {
      dispatch(setPetInsuranceSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Scroll to top
  useEffect(() => {
    if (petInsuranceSearchFilter && !petInsuranceLoader && petInsuranceList?.length > 0) {
      window.scrollTo({ top: parseInt(petInsuranceSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [petInsuranceList]);

  const petInsuranceListFilter = useRef(false);

  // Function to get pet insurance list
  const searchPetInsuranceFilterHandler = (value) => {
    petInsuranceListFilter.current = false;

    dispatch(
      setPetInsuranceListPagination({
        page: 1,
        size: 10,
      })
    );
    getPetInsuranceListFilterHandler({ name: value });
    setSearchFilter({ name: value, scrollPosition: 0 });
  };

  // Debounce search handler
  const debounceContractorAllRisksHandler = debounce(searchPetInsuranceFilterHandler, 1000);

  // Function to get pet insurance list
  const getPetInsuranceListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (petInsuranceListFilter.current) {
      return;
    }
    petInsuranceListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getPetInsuranceList({
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

  // Get pet insurance list
  useEffect(() => {
    getPetInsuranceListFilterHandler(petInsuranceSearchFilter?.name);
    return () => {
      // dispatch(
      //   setPetInsuranceListPagination({
      //     page: 1,
      //     size: 10,
      //   })
      // );
    };
  }, []);

  // Pagination
  const handleContractorAllRiskPageChange = useCallback(
    (event, value) => {
      dispatch(
        setPetInsuranceListPagination({
          page: value + 1,
          size: pagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getPetInsuranceList({
          page: value + 1,
          size: pagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size, searchFilter]
  );

  // Rows per page
  const handleContractorAllRiskRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setPetInsuranceListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));
      dispatch(
        getPetInsuranceList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.page, searchFilter]
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
                <Typography variant="h4">Pet Insurance</Typography>
              </Stack>
            </Stack>

            <SearchInput
              placeHolder="Search Pet Insurance"
              searchFilterHandler={debounceContractorAllRisksHandler}
              defaultValue={petInsuranceSearchFilter?.name || ""}
            />

            {petInsuranceLoader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={!!petInsuranceLoader} />
              </Box>
            ) : (
              <>
                {petInsuranceList && (
                  <PetInsuranceTable
                    item={petInsuranceList}
                    count={petInsurancePagination?.totalItems}
                    onPageChange={handleContractorAllRiskPageChange}
                    onRowsPerPageChange={handleContractorAllRiskRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    petInsuranceSearchFilter={petInsuranceSearchFilter}
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
PetInsurance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PetInsurance;
