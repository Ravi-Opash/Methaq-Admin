import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import AllPoliciesTable from "src/sections/Policies/all-policies-table";
import FilterCard from "src/components/filterCard";
import {
  setAllPoliciesListCustomPagination,
  setPoliciesSearchFilter,
} from "src/sections/Policies/reducer/policiesSlice";
import { exportPolicyCSVFile, getAllPoliciesList } from "src/sections/Policies/action/policiesAction";
import AnimationLoader from "src/components/amimated-loader";

// Options for policy types filter (Active, Pending, Expired, etc.)
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
];

const PoliciesComp = () => {
  const {
    allPoliciesListCustomPagination,
    allPoliciesListLoader,
    allPoliciesList,
    allPoliciesListPagination,
    policiesSearchFilter,
  } = useSelector((state) => state.policies);
  const dispatch = useDispatch();

  // Local state for search filters
  const [searchFilter, setSearchFilter] = useState({
    name: policiesSearchFilter?.name || "",
    type: policiesSearchFilter?.type || "all",
    fromDate: policiesSearchFilter?.fromDate || ``,
    toDate: policiesSearchFilter?.toDate || ``,
    scrollPosition: policiesSearchFilter?.scrollPosition || 0,
    agent: policiesSearchFilter?.agent || "",
  });

  const [isloading, setisloading] = useState(false);

  // Update the global state with the search filter whenever it changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setPoliciesSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Handler for filter data updates (like agent or policy type)
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // Prevents duplicate API calls in development mode due to React Strict Mode
  const policyListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    policyListFilter.current = false;
    dispatch(
      setAllPoliciesListCustomPagination({
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

  // Scroll to the last saved position when policy list is updated
  useEffect(() => {
    if (policiesSearchFilter && !allPoliciesListLoader && allPoliciesList?.length > 0) {
      window.scrollTo({ top: parseInt(policiesSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allPoliciesList]);

  // Download the PDF from the URL
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Handle CSV export
  const exportCSVFileHandler = () => {
    setisloading(true);
    dispatch(
      exportPolicyCSVFile({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
        agentId: searchFilter?.agent,
      })
    )
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        setisloading(false);
        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data);
        toast.success("successfully exported!");
      })
      .catch((err) => {
        toast.error(err);
        console.log(err, "err");
        setisloading(false);
      });
  };

  const debounceHandler = debounce(searchFilterHandler, 1000);
  const getAllPolicyListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (policyListFilter.current) {
      return;
    }
    policyListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllPoliciesList({
          page: page || allPoliciesListCustomPagination?.page,
          size: size || allPoliciesListCustomPagination?.size,
          search: payload?.name,
          payloadData: {
            pType: payload?.type,
            startDate: payload?.fromDate,
            endDate: payload?.toDate,
            agentId: searchFilter?.agent,
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

  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllPoliciesListCustomPagination({
          page: value + 1,
          size: allPoliciesListCustomPagination?.size,
        })
      );
      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllPoliciesList({
          page: value + 1,
          size: allPoliciesListCustomPagination?.size,
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
    [allPoliciesListCustomPagination?.size, searchFilter]
  );

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllPoliciesListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllPoliciesList({
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
    [allPoliciesListCustomPagination?.page, searchFilter]
  );

  return (
    <>
      {isloading ? <AnimationLoader open={true} /> : <></>}
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
                <Typography variant="h4">Policies</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              {/* Filter Card for policy search and export */}
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search policy"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
                exportCSVFile={exportCSVFileHandler}
                Flag={true}
              />

              {/* Loading or Policy List Display */}
              {allPoliciesListLoader ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "10rem !important",
                  }}
                >
                  <AnimationLoader open={allPoliciesListLoader} />
                </Box>
              ) : (
                <>
                  {allPoliciesList && (
                    <AllPoliciesTable
                      count={allPoliciesListPagination?.totalItems}
                      items={allPoliciesList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allPoliciesListCustomPagination?.page - 1}
                      rowsPerPage={allPoliciesListCustomPagination?.size}
                      policiesSearchFilter={policiesSearchFilter}
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

PoliciesComp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PoliciesComp;
