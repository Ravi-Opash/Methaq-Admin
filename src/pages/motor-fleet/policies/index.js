import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Button, CircularProgress, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "src/utils/debounce-search";
import FilterCard from "src/components/filterCard";
import { getAllMotorFleetPoliciesList } from "src/sections/motor-fleet/Policies/action/motorFleetPoliciesAction";
import { setAllMotorFleetPoliciesListCustomPagination } from "src/sections/motor-fleet/Policies/reducer/motorFleetPoliciesSlice";
import MotorFleetPolicesTable from "src/sections/motor-fleet/Policies/motor-fleet-policies-table";

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

const MotorFleetPolicies = () => {
  const {
    allMotorFleetPoliciesListCustomPagination,
    allMotorFleetPoliciesListLoader,
    allMotorFleetPoliciesList,
    allMotorFleetPoliciesListPagination,
  } = useSelector((state) => state.motorFleetPolicies);
  const dispatch = useDispatch();

  // Local state to manage the search filter
  const [searchFilter, setSearchFilter] = useState({
    name: "",
    type: "all",
    fromDate: ``,
    toDate: ``,
  });

  // Update the Redux store whenever searchFilter changes
  const FilterDataHandler = (name, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle search filter
  const policyListFilter = useRef(false);
  const searchFilterHandler = (name, value) => {
    policyListFilter.current = false;
    dispatch(
      setAllMotorFleetPoliciesListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getAllPolicyListFilterHandler({ [name]: value });
      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getAllPolicyListFilterHandler();
    }
  };

  // Function to handle PDF download
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Function to handle CSV export
  const exportCSVFileHandler = () => {
    dispatch(
      exportPolicyCSVFile({
        startDate: searchFilter?.fromDate,
        endDate: searchFilter?.toDate,
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

  // Function to debounce the search filter
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Function to get all policy list
  const getAllPolicyListFilterHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (policyListFilter.current) {
      return;
    }
    policyListFilter.current = true;
    let payload = { ...searchFilter, ...otherProps };
    try {
      dispatch(
        getAllMotorFleetPoliciesList({
          page: allMotorFleetPoliciesListCustomPagination?.page,
          size: allMotorFleetPoliciesListCustomPagination?.size,
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

  // Function to get all policy list
  useEffect(() => {
    getAllPolicyListFilterHandler();
    return () => {
      dispatch(
        setAllMotorFleetPoliciesListCustomPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []);

  // Function to handle pagination
  const handlePageChange = useCallback(
    (event, value) => {
      // console.log("value", value);

      dispatch(
        setAllMotorFleetPoliciesListCustomPagination({
          page: value + 1,
          size: allMotorFleetPoliciesListCustomPagination?.size,
        })
      );

      dispatch(
        getAllMotorFleetPoliciesList({
          page: value + 1,
          size: allMotorFleetPoliciesListCustomPagination?.size,
          search: searchFilter?.name,
          payloadData: {
            pType: searchFilter?.type,
            startDate: searchFilter?.fromDate,
            endDate: searchFilter?.toDate,
          },
        })
      );
    },
    [allMotorFleetPoliciesListCustomPagination?.size, searchFilter]
  );

  // Function to handle rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllMotorFleetPoliciesListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getAllMotorFleetPoliciesList({
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
    [allMotorFleetPoliciesListCustomPagination?.page, searchFilter]
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
                <Typography variant="h4">Motor Fleet Policies</Typography>
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
              />

              {allMotorFleetPoliciesListLoader ? (
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
                  {allMotorFleetPoliciesList && (
                    <MotorFleetPolicesTable
                      count={allMotorFleetPoliciesListPagination?.totalItems}
                      items={allMotorFleetPoliciesList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={allMotorFleetPoliciesListCustomPagination?.page - 1}
                      rowsPerPage={allMotorFleetPoliciesListCustomPagination?.size}
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

MotorFleetPolicies.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MotorFleetPolicies;
