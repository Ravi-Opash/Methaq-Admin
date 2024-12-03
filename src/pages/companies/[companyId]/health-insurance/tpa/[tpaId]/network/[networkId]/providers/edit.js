import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  Grid,
  InputAdornment,
  Link,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import ProviderSelectTable from "src/sections/health-insurance/health-insurance-companies/health-provider-table";
import {
  clearHealthProviderSelectedList,
  setAllHealthProviderListCustomPagination,
} from "src/sections/health-insurance/Providers/Reducer/healthProviderSlice";
import {
  getAllHealthProviderList,
  getHealthNetworkProviderById,
} from "src/sections/health-insurance/Providers/Action/healthProviderAction";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { debounce } from "src/utils/debounce-search";
import {
  updateHealthInsuranceCompanyNetworkById,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import { toast } from "react-toastify";

const CoverageBenefits = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { companyId, tpaId, networkId } = router.query;

  const {
    allHealthProviderListLoader,
    allHealthProviderList,
    allHealthProviderListPagination,
    allHelathProviderListCustomPagination,
    healthProviderSelectedList,
  } = useSelector((state) => state.healthProvider);

  const [searchFilter, setSearchFilter] = useState({
    name: "",
  });

  const [selectedProvider, setSelectedProvider] = useState([]);

  useEffect(() => {
    if (healthProviderSelectedList) {
      setSelectedProvider(healthProviderSelectedList);
    } else {
      setSelectedProvider([]);
    }
  }, [healthProviderSelectedList]);

  const initialized = useRef(false);

  // Health - Network provider detail by id API
  const getCompanyDetailsHandler = async () => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getHealthNetworkProviderById({networkId}))
        .unwrap()
        .then((res) => {
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

  const leadsListFilter = useRef(false);

  // Search provider handler
  const searchProviderFilterHandler = (name, value) => {
    leadsListFilter.current = false;

    dispatch(
      setAllHealthProviderListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getHealthProviderListFilterHandler({ [name]: value });

      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getHealthProviderListFilterHandler();
    }
  };

  const debounceLeadsHandler = debounce(searchProviderFilterHandler, 1000);

  // Get provider list API
  const getHealthProviderListFilterHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (leadsListFilter.current) {
      return;
    }
    leadsListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getAllHealthProviderList({
          page: allHelathProviderListCustomPagination?.page,
          size: allHelathProviderListCustomPagination?.size,
          search: payload?.name,
        })
      );
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  useEffect(() => {
    getHealthProviderListFilterHandler();
    getCompanyDetailsHandler();
    return () => {
      dispatch(
        setAllHealthProviderListCustomPagination({
          page: 1,
          size: 10,
        })
      );
      dispatch(clearHealthProviderSelectedList());
    };
  }, []);

  // Page change handler
  const handleLeadsPageChange = useCallback(
    (event, value) => {
      dispatch(
        setAllHealthProviderListCustomPagination({
          page: value + 1,
          size: allHelathProviderListCustomPagination?.size,
        })
      );

      dispatch(
        getAllHealthProviderList({
          page: value + 1,
          size: allHelathProviderListCustomPagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [allHelathProviderListCustomPagination?.size, searchFilter]
  );

  // row per page change handler
  const handleLeadsRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllHealthProviderListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getAllHealthProviderList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [allHelathProviderListCustomPagination?.page, searchFilter]
  );

  // Select Provider via checkbox handler
  const handleProviderSelect = (item) => {
    const match = selectedProvider?.find((i) => i?._id == item?._id);
    if (match) {
      const filterdArray = selectedProvider?.filter((i) => i?._id != item?._id);
      setSelectedProvider(filterdArray || []);
    } else {
      setSelectedProvider([...selectedProvider, item]);
    }
  };

  // Send selected provider list to API
  const onSubmitSelectedProviderList = () => {
    const arr = [];
    selectedProvider?.map((i) => {
      arr?.push(i?._id);
    });
    dispatch(
      updateHealthInsuranceCompanyNetworkById({
        id: networkId,
        data: { providers: arr },
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.success) {
          router.push(`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/providers`);
          toast("Successfully updated!", {
            type: "success",
          });
        }
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        {" "}
        <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
          <Box>
            <Box onClick={() => router.back()} sx={{ cursor: "pointer", mb: 4 }}>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Networks</Typography>
              </Link>
            </Box>

            <Stack spacing={1} mb={3} sx={{ mb: 5 }}>
              <Typography variant="h4">Network's Providers</Typography>
            </Stack>

            <Box sx={{ width: "100%", mb: 10 }}>
              <Grid spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    Select providers from below
                  </Typography>
                  <Box sx={{ borderBottom: "1px solid #707070", width: "inherit" }}></Box>
                </Box>
              </Grid>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <Card sx={{ p: 2 }}>
                  <OutlinedInput
                    defaultValue=""
                    fullWidth
                    name="name"
                    placeholder={"Search Providers" || ""}
                    onChange={(e) => debounceLeadsHandler(e.target.name, e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <MagnifyingGlassIcon />
                        </SvgIcon>
                      </InputAdornment>
                    }
                    sx={{ maxWidth: 500 }}
                  />
                </Card>
              </Box>
              <Grid>
                {!allHealthProviderListLoader ? (
                  <ProviderSelectTable
                    count={allHealthProviderListPagination?.totalItems}
                    items={allHealthProviderList}
                    onPageChange={handleLeadsPageChange}
                    onRowsPerPageChange={handleLeadsRowsPerPageChange}
                    page={allHelathProviderListCustomPagination?.page - 1}
                    rowsPerPage={allHelathProviderListCustomPagination?.size}
                    handleProviderSelect={handleProviderSelect}
                    selectedProvider={selectedProvider}
                  />
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                    <CircularProgress />
                  </Box>
                )}
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button size="large" onClick={onSubmitSelectedProviderList} variant="contained">
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

CoverageBenefits.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CoverageBenefits;
