import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import HealthPolicesTable from "src/sections/health-insurance/Policies/health-policies-table";
import {
  setAllHealthPoliciesListCustomPagination,
  setAllHealthPoliciesListSearchFilter,
} from "src/sections/health-insurance/Policies/reducer/healthPoliciesSlice";
import {
  getAllHealthPoliciesList,
  exportHealthPolicyCSVFile,
  exportHealthPolicyCSVFilePraktora,
} from "src/sections/health-insurance/Policies/action/healthPoliciesAction";
import AnimationLoader from "src/components/amimated-loader";
import HealthPolicyFilterCard from "src/sections/health-insurance/Policies/health-policy-filter-card";

// Predefined options for policy types
const options = [
  { label: "All", value: "all" },
  { label: "Active Policies", value: "ACTIVE" },
  { label: "Pending Policies", value: "PENDING" },
  { label: "Expired Policies", value: "EXPIRING" },
  { label: "Expiring Policies", value: "EXPIRED" },
  { label: "Cancelled Policies", value: "CANCELLED" },
];

const HealthPoliciesComp = () => {
  // Redux state selectors
  const {
    allHealthPoliciesListCustomPagination,
    allHealthPoliciesListLoader,
    allHealthPoliciesList,
    allHealthPoliciesListPagination,
    allHealthPoliciesListSearchFilter,
  } = useSelector((state) => state.healthPolicies);
  const dispatch = useDispatch();

  // Local component state
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState({
    name: allHealthPoliciesListSearchFilter?.name || "",
    type: allHealthPoliciesListSearchFilter?.type || "all",
    fromDate: allHealthPoliciesListSearchFilter?.fromDate || "",
    toDate: allHealthPoliciesListSearchFilter?.toDate || "",
    scrollPosition: allHealthPoliciesListSearchFilter?.scrollPosition || 0,
    agent: allHealthPoliciesListSearchFilter?.agent || "",
  });

  // Updates search filter state when the filter changes
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Store the search filter in Redux
  useEffect(() => {
    if (searchFilter) {
      dispatch(setAllHealthPoliciesListSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Handle scroll position when the health policies list is updated
  useEffect(() => {
    if (allHealthPoliciesListSearchFilter && !allHealthPoliciesListLoader && allHealthPoliciesList?.length > 0) {
      window.scrollTo({ top: parseInt(allHealthPoliciesListSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allHealthPoliciesList]);

  // Prevent duplicate API calls while filtering policies
  const policyListFilter = useRef(false);

  // Search handler with debounce
  const searchFilterHandler = (name, value) => {
    policyListFilter.current = false;
    dispatch(
      setAllHealthPoliciesListCustomPagination({
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

  // Download the PDF file after CSV export
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Export health policy data as CSV
  const exportCSVFileHandler = () => {
    setIsLoading(true);
    dispatch(
      exportHealthPolicyCSVFile({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
        agentId: searchFilter?.agent,
      })
    )
      .unwrap()
      .then((res) => {
        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data);
        toast.success("Successfully exported!");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setIsLoading(false);
      });
  };

  // Export health policy data as CSV for Praktora
  const exportCSVFilePraktoraHandler = () => {
    setIsLoading(true);
    dispatch(
      exportHealthPolicyCSVFilePraktora({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
      })
    )
      .unwrap()
      .then((res) => {
        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data);
        toast.success("Successfully exported!");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setIsLoading(false);
      });
  };

  // Debounced version of searchFilterHandler to delay API calls
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Fetch filtered health policies from the API
  const getAllPolicyListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (policyListFilter.current) {
      return;
    }
    policyListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllHealthPoliciesList({
          page: page || allHealthPoliciesListCustomPagination?.page,
          size: size || allHealthPoliciesListCustomPagination?.size,
          search: payload?.name,
          payloadData: {
            pType: payload?.type,
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
            agentId: payload?.agent,
          },
        })
      );
    } catch (err) {
      toast.error(err);
    }
  };

  // Initialize the health policies list when the component mounts
  useEffect(() => {
    getAllPolicyListFilterHandler();
  }, []);

  // Handle pagination changes (page change)
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllHealthPoliciesListCustomPagination({
          page: value + 1,
          size: allHealthPoliciesListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllHealthPoliciesList({
          page: value + 1,
          size: allHealthPoliciesListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            agentId: searchFilter?.agent,
          },
        })
      );
    },
    [allHealthPoliciesListCustomPagination?.size, searchFilter]
  );

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllHealthPoliciesListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllHealthPoliciesList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
            agentId: searchFilter?.agent,
          },
        })
      );
    },
    [allHealthPoliciesListCustomPagination?.page, searchFilter]
  );

  return (
    <>
      {isLoading && (
        <>
          {/* AnimationLoader component */}
          <AnimationLoader open={!!isLoading} />
        </>
      )}
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
                <Typography variant="h4">Health Insurance Policies</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              {/* Health Policy Filter Card */}
              <HealthPolicyFilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search policy"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
                exportCSVFile={exportCSVFileHandler}
                exportCSVFilePraktora={exportCSVFilePraktoraHandler}
              />

              {allHealthPoliciesListLoader ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "10rem !important",
                  }}
                >
                  <AnimationLoader open={!!allHealthPoliciesListLoader} />
                </Box>
              ) : (
                <>
                  {/* Health Policies Table */}
                  {allHealthPoliciesList && (
                    <HealthPolicesTable
                      count={allHealthPoliciesListPagination?.totalItems}
                      items={allHealthPoliciesList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allHealthPoliciesListCustomPagination?.page - 1}
                      rowsPerPage={allHealthPoliciesListCustomPagination?.size}
                      allHealthPoliciesListSearchFilter={allHealthPoliciesListSearchFilter}
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
