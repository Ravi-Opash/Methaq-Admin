import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import FilterCard from "src/components/filterCard";
import { getAllLandPoliciesList } from "src/sections/Land-insurance/Policies/action/landPoliciesAction";
import {
  setAllLandPoliciesListCustomPagination,
  setAllLandPoliciesSearchFilter,
} from "src/sections/Land-insurance/Policies/reducer/landPoliciesSlice";
import LandPolicesTable from "src/sections/Land-insurance/Policies/land-policies-table";
import { exportLandPolicyCSVFile } from "src/sections/Land-insurance/Policies/action/landPoliciesAction";
import AnimationLoader from "src/components/amimated-loader";

const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active Policies",
    value: "ACTIVE",
  },
  {
    label: "Pending Policies",
    value: "PENDING",
  },
  {
    label: "Expired Policies",
    value: "EXPIRING",
  },
  {
    label: "Expiring Policies",
    value: "EXPIRED",
  },
  {
    label: "Cancelled Policies",
    value: "CANCELLED",
  },
  {
    label: "Cancelled Policies",
    value: "CANCELLED",
  },
];

const HealthPoliciesComp = () => {
  const {
    allLandPoliciesListCustomPagination,
    allLandPoliciesListLoader,
    allLandPoliciesList,
    allLandPoliciesListPagination,
    allLandPoliciesSearchFilter,
  } = useSelector((state) => state.landPolicies);
  const dispatch = useDispatch();

  const [searchFilter, setSearchFilter] = useState({
    name: allLandPoliciesSearchFilter?.name || "",
    type: allLandPoliciesSearchFilter?.type || "all",
    fromDate: allLandPoliciesSearchFilter?.fromDate || ``,
    toDate: allLandPoliciesSearchFilter?.toDate || ``,
    scrollPosition: allLandPoliciesSearchFilter?.scrollPosition || 0,
  });

  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  useEffect(() => {
    if (searchFilter) {
      dispatch(setAllLandPoliciesSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  useEffect(() => {
    if (allLandPoliciesSearchFilter && !allLandPoliciesListLoader && allLandPoliciesList?.length > 0) {
      window.scrollTo({ top: parseInt(allLandPoliciesSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allLandPoliciesList]);

  const policyListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    policyListFilter.current = false;
    dispatch(
      setAllLandPoliciesListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllPolicyListFilterHandler({ [name]: value }, 1, 10);
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
        scrollPosition: 0,
      }));
    } else {
      getAllPolicyListFilterHandler();
    }
  };

  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Export CSV file handler
  const exportCSVFileHandler = () => {
    dispatch(
      exportLandPolicyCSVFile({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
      })
    )
      .unwrap()
      .then((res) => {
        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data);
        toast.success("successfully exported!");
      })
      .catch((err) => {
        toast.error(err);
        console.log(err, "err");
      });
  };

  const debounceHandler = debounce(searchFilterHandler, 1000);

  // get all land insurance policy list API
  const getAllPolicyListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (policyListFilter.current) {
      return;
    }
    policyListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllLandPoliciesList({
          page: page || allLandPoliciesListCustomPagination?.page,
          size: size || allLandPoliciesListCustomPagination?.size,
          search: payload?.name,
          payloadData: {
            pType: payload?.type,
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

  useEffect(() => {
    getAllPolicyListFilterHandler();
    return () => {};
  }, []);

  // Page change handler
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllLandPoliciesListCustomPagination({
          page: value + 1,
          size: allLandPoliciesListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllLandPoliciesList({
          page: value + 1,
          size: allLandPoliciesListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allLandPoliciesListCustomPagination?.size, searchFilter]
  );

  // Rows per Page change handler
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllLandPoliciesListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllLandPoliciesList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allLandPoliciesListCustomPagination?.page, searchFilter]
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
                <Typography variant="h5">Musataha Insurance Policies</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              {/* // Filter form */}
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search policy"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
                exportCSVFile={exportCSVFileHandler}
              />

              {allLandPoliciesListLoader ? (
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
                  {allLandPoliciesList && (
                    <LandPolicesTable
                      count={allLandPoliciesListPagination?.totalItems}
                      items={allLandPoliciesList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allLandPoliciesListCustomPagination?.page - 1}
                      rowsPerPage={allLandPoliciesListCustomPagination?.size}
                      allLandPoliciesSearchFilter={allLandPoliciesSearchFilter}
                    />
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

HealthPoliciesComp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthPoliciesComp;
