import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import FilterCard from "src/components/filterCard";
import {
  getAllTravelPoliciesList,
  exportTravelPolicyCSVFile,
} from "src/sections/travel-insurance/Policies/action/travelPoliciesAction";
import {
  setAllTravelPoliciesListCustomPagination,
  setAllTravelPoliciesListSearchFilter,
} from "src/sections/travel-insurance/Policies/reducer/travelPoliciesSlice";
import TravelPolicesTable from "src/sections/travel-insurance/Policies/health-policies-table";
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

const TravelPoliciesComp = () => {
  const {
    allTravelPoliciesListCustomPagination,
    allTravelPoliciesListLoader,
    allTravelPoliciesList,
    allTravelPoliciesListPagination,
    alltravelPoliciesListSearchFilter,
  } = useSelector((state) => state.travelPolicies);
  const dispatch = useDispatch();

  const [searchFilter, setSearchFilter] = useState({
    name: alltravelPoliciesListSearchFilter?.name || "",
    type: alltravelPoliciesListSearchFilter?.type || "all",
    fromDate: alltravelPoliciesListSearchFilter?.fromDate || ``,
    toDate: alltravelPoliciesListSearchFilter?.toDate || ``,
    scrollPosition: alltravelPoliciesListSearchFilter?.scrollPosition || 0,
    agent: alltravelPoliciesListSearchFilter?.agent || "",
  });

  // function to handle search and date filter
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
      scrollPosition: 0,
    }));
  };

  // useEffect to set search filter
  useEffect(() => {
    if (searchFilter) {
      dispatch(setAllTravelPoliciesListSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // useEffect to scroll to top
  useEffect(() => {
    if (alltravelPoliciesListSearchFilter && !allTravelPoliciesListLoader && allTravelPoliciesList?.length > 0) {
      window.scrollTo({ top: parseInt(alltravelPoliciesListSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [allTravelPoliciesList]);

  // function to get all policy list
  const policyListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    policyListFilter.current = false;
    dispatch(
      setAllTravelPoliciesListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    // filter data
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

  // function to download pdf
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // function to export csv
  const exportCSVFileHandler = () => {
    dispatch(
      exportTravelPolicyCSVFile({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
        agentId: searchFilter?.agent,
      })
    )
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data);
        toast.success("successfully exported!");
      })
      .catch((err) => {
        toast.error(err);
        console.log(err, "err");
      });
  };

  // function to handle debounce for delay of 1 second
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // function to get all policy list
  const getAllPolicyListFilterHandler = async (otherProps, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (policyListFilter.current) {
      return;
    }
    policyListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllTravelPoliciesList({
          page: page || allTravelPoliciesListCustomPagination?.page,
          size: size || allTravelPoliciesListCustomPagination?.size,
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
      toast(err, {
        type: "error",
      });
    }
  };

  // useEffect to get all policy list
  useEffect(() => {
    getAllPolicyListFilterHandler();
    return () => {
      // dispatch(
      //   setAllTravelPoliciesListCustomPagination({
      //     page: 1,
      //     size: 10,
      //   })
      // );
    };
  }, []);

  // function to handle page change
  const handlePageChange = useCallback(
    (event, value) => {
      // console.log("value", value);

      dispatch(
        setAllTravelPoliciesListCustomPagination({
          page: value + 1,
          size: allTravelPoliciesListCustomPagination?.size,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllTravelPoliciesList({
          page: value + 1,
          size: allTravelPoliciesListCustomPagination?.size,
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
    [allTravelPoliciesListCustomPagination?.size, searchFilter]
  );

  // function to handle rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllTravelPoliciesListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAllTravelPoliciesList({
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
    [allTravelPoliciesListCustomPagination?.page, searchFilter]
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
                <Typography variant="h4">Travel Insurance Policies</Typography>
              </Stack>
            </Stack>

            <Stack spacing={3}>
              <FilterCard
                searchFilter={searchFilter}
                searchFilterHandler={debounceHandler}
                inputPlaceHolder="Search policy"
                selectOptions={options}
                FilterDataHandler={FilterDataHandler}
                exportCSVFile={exportCSVFileHandler}
                Flag={true}
              />

              {allTravelPoliciesListLoader ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "10rem !important",
                  }}
                >
                  <AnimationLoader open={allTravelPoliciesListLoader} />
                </Box>
              ) : (
                <>
                  {allTravelPoliciesList && (
                    <TravelPolicesTable
                      count={allTravelPoliciesListPagination?.totalItems}
                      items={allTravelPoliciesList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allTravelPoliciesListCustomPagination?.page - 1}
                      rowsPerPage={allTravelPoliciesListCustomPagination?.size}
                      alltravelPoliciesListSearchFilter={alltravelPoliciesListSearchFilter}
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

TravelPoliciesComp.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelPoliciesComp;
