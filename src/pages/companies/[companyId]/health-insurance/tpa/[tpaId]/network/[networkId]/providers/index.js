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
import ProviderSelectedTable from "src/sections/health-insurance/health-insurance-companies/health-provider-select-table";
import {
  clearHealthProviderSelectedList,
  setAllHealthNetworkProviderListCustomPagination,
} from "src/sections/health-insurance/Providers/Reducer/healthProviderSlice";
import {
  getHealthNetworkProviderById,
} from "src/sections/health-insurance/Providers/Action/healthProviderAction";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { debounce } from "src/utils/debounce-search";
import {
  updateHealthInsuranceCompanyNetworkById,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";

const CoverageBenefits = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { companyId, tpaId, networkId } = router.query;

  const {
    healthNetworkProviderListCustomPagination,
    healthProviderSelectedListLoader,
    healthProviderSelectedList,
  } = useSelector((state) => state.healthProvider);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [searchFilter, setSearchFilter] = useState({
    name: "",
  });

  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);

  const [selectedProvider, setSelectedProvider] = useState([]);

  useEffect(() => {
    if (healthProviderSelectedList?.length > 0) {
      setSelectedProvider(healthProviderSelectedList);
    }
  }, [healthProviderSelectedList]);

  const leadsListFilter = useRef(false);

  // Search Provider handler
  const searchProviderFilterHandler = (name, value) => {
    leadsListFilter.current = false;

    dispatch(
      setAllHealthNetworkProviderListCustomPagination({
        page: 1,
        size: 10,
      })
    );

    setSearchFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const debounceLeadsHandler = debounce(searchProviderFilterHandler, 1000);

  // get health network provider list API
  const getHealthNetworkProviderListFilterHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (leadsListFilter.current) {
      return;
    }
    leadsListFilter.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getHealthNetworkProviderById({
          networkId: networkId,
          page: healthNetworkProviderListCustomPagination?.page,
          size: healthNetworkProviderListCustomPagination?.size,
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
    getHealthNetworkProviderListFilterHandler();
    return () => {
      // Clear out values when leave this page
      dispatch(
        setAllHealthNetworkProviderListCustomPagination({
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
        setAllHealthNetworkProviderListCustomPagination({
          page: value + 1,
          size: healthNetworkProviderListCustomPagination?.size,
        })
      );
      dispatch(
        getHealthNetworkProviderById({
          networkId: networkId,
          page: value + 1,
          size: healthNetworkProviderListCustomPagination?.size,
          search: searchFilter?.name,
        })
      );
    },
    [healthNetworkProviderListCustomPagination?.size, searchFilter]
  );

  // Row per page change handler
  const handleLeadsRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAllHealthNetworkProviderListCustomPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getHealthNetworkProviderById({
          networkId: networkId,
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [healthNetworkProviderListCustomPagination?.page, searchFilter]
  );

  // Remove Provider from particular network API
  const deleteByIdHandler = (item) => {
    const filterdArray = selectedProvider?.filter((i) => i?._id != item?._id);
    setSelectedProvider(filterdArray || []);
    const arr = [];
    filterdArray?.map((i) => {
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
          toast("Successfully deleted!", {
            type: "success",
          });
        }
        handleCloseVerifymodal();
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        handleCloseVerifymodal();
      });
  };

  // Add Providers to particular network by API
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
            <Box
              onClick={() => router.push(`/companies/${companyId}/health-insurance/tpa/${tpaId}/network`)}
              sx={{ cursor: "pointer", mb: 4 }}
            >
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h4">Network's Providers</Typography>
                {moduleAccess(user, "companies.create") && (
                  <Button
                    size="large"
                    onClick={() =>
                      router?.push(
                        `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/providers/edit`
                      )
                    }
                    variant="contained"
                  >
                    Add Providers
                  </Button>
                )}
              </Box>
            </Stack>
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
            <Box sx={{ width: "100%", mb: 10 }}>
              <Grid spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    List of Selected providers
                  </Typography>
                  <Box sx={{ borderBottom: "1px solid #707070", width: "inherit" }}></Box>
                </Box>
              </Grid>
              <Grid>
                {!healthProviderSelectedListLoader ? (
                  <ProviderSelectedTable
                    items={selectedProvider}
                    // Search logic to find count of searched result
                    count={
                      [...selectedProvider]?.filter((item) => {
                        const regex = new RegExp(searchFilter?.name, "i");
                        return (
                          regex.test(item?.refNo || "") ||
                          regex.test(item?.providerCode || "") ||
                          regex.test(item?.providerName || "") ||
                          regex.test(item?.emirate || "")
                        );
                      })?.length || 0
                    }
                    onPageChange={handleLeadsPageChange}
                    onRowsPerPageChange={handleLeadsRowsPerPageChange}
                    page={healthNetworkProviderListCustomPagination?.page - 1}
                    rowsPerPage={healthNetworkProviderListCustomPagination?.size}
                    deleteByIdHandler={deleteByIdHandler}
                    onSubmitSelectedProviderList={onSubmitSelectedProviderList}
                    setVerifyModal={setVerifyModal}
                    verifyModal={verifyModal}
                    handleCloseVerifymodal={handleCloseVerifymodal}
                    searchFilter={searchFilter?.name}
                  />
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: "5rem !important" }}>
                    <CircularProgress />
                  </Box>
                )}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

CoverageBenefits.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CoverageBenefits;
