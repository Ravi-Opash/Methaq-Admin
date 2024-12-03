import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Breadcrumbs, Button, Container, Skeleton, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SearchInput } from "src/components/search-input";
import { useSelection } from "src/hooks/use-selection";
import ModalComp from "src/components/modalComp";
import { moduleAccess } from "src/utils/module-access";
import HealthInsuranceCompanyPlansTable from "src/sections/health-insurance/health-insurance-companies/health-compnaies-pans-table";
import {
  clearHealthInsuranceDetailsData,
  setHealthInsuranceCompanyPlansListPagination,
} from "src/sections/health-insurance/health-insurance-companies/Reducer/healthInsuranceCompanySlice";
import {
  deleteHealthInsuranceCompanyPlansById,
  getHealthInsuranceCompanyCityDetailById,
  getHealthInsuranceCompanyDetailById,
  getHealthInsuranceCompanyNetworkDetailById,
  getHealthInsuranceCompanyPlansList,
  getHealthInsuranceCompanyTpaDetailById,
  updateHealthInsuranceCompanyPlansById,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/router";
import AnimationLoader from "src/components/amimated-loader";

const CompaniesCity = () => {
  const dispatch = useDispatch();
  const {
    healthInsuranceCompanyPlansList,
    healthInsuranceCompanyPlansListPagination,
    healthInsuranceCompanyPlansPagination,
    healthInsuranceCompanyPlansListLoader,
    healthInsuranceCompanyDetails,
    healthInsuranceCompanyNetworkDetails,
    healthInsuranceCompanyCityDetails,
  } = useSelector((state) => state.healthInsuranceCompany);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { companyId, tpaId, networkId, cityId } = router.query;

  // Breadcrumbs to show on top
  const breadcrumbs = [
    <Typography key="1" sx={{ color: "#60186F", fontWeight: 600, fontSize: "20px", mr: -1 }}>
      List
    </Typography>,
    <Link style={{ textDecoration: "none" }} key="2" href={`/companies/${companyId}/health-insurance`}>
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "20px", mx: -1 }}>Company</Typography>
    </Link>,
    <Link style={{ textDecoration: "none" }} key="2" href={`/companies/${companyId}/health-insurance/tpa`}>
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "20px", mx: -1 }}>TPA</Typography>
    </Link>,
    <Link
      style={{ textDecoration: "none" }}
      key="2"
      href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network`}
    >
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "20px", mx: -1 }}>Network</Typography>
    </Link>,
    <Link
      style={{ textDecoration: "none" }}
      key="2"
      href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city`}
    >
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "20px", mx: -1 }}>City</Typography>
    </Link>,
    <Typography key="3" sx={{ color: "#60186F", fontWeight: 600, fontSize: "20px", mx: -1 }}>
      Plans
    </Typography>,
  ];

  const [searchFilter, setSearchFilter] = useState("");
  const searchFilterHandler = (value) => {
    setSearchFilter(value);
  };

  const initialized = useRef(false);
  const getCompanyListHandler = async () => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(
        getHealthInsuranceCompanyPlansList({
          page: healthInsuranceCompanyPlansPagination?.page,
          size: healthInsuranceCompanyPlansPagination?.size,
          cityId: cityId,
        })
      )
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  const initialized1 = useRef(false);

  // Get all details of health matrix function
  const getHealthInsuranceCompanyDetail = () => {
    if (initialized1.current) {
      return;
    }
    initialized1.current = true;
    dispatch(getHealthInsuranceCompanyTpaDetailById(tpaId));
    dispatch(getHealthInsuranceCompanyDetailById(companyId));
    dispatch(getHealthInsuranceCompanyNetworkDetailById(networkId));
    dispatch(getHealthInsuranceCompanyCityDetailById(cityId));
  };

  useEffect(() => {
    getCompanyListHandler();
    getHealthInsuranceCompanyDetail();

    return () => {};
  }, []);

  // handle page chnage 
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setHealthInsuranceCompanyPlansListPagination({
          page: value + 1,
          size: healthInsuranceCompanyPlansPagination?.size,
        })
      );
      dispatch(
        getHealthInsuranceCompanyPlansList({
          page: value + 1,
          size: healthInsuranceCompanyPlansPagination?.size,
          cityId: cityId,
        })
      );
    },
    [healthInsuranceCompanyPlansPagination?.size]
  );

  // Row per page chnage handler 
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setHealthInsuranceCompanyPlansListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getHealthInsuranceCompanyPlansList({
          page: 1,
          size: event.target.value,
          cityId: cityId,
        })
      );
    },
    [healthInsuranceCompanyPlansPagination?.page]
  );

  // Delete Plan handler
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [healthInsuranceCompanyPlansPagination]
  );

  const deleteByIdHandler = (id) => {
    dispatch(deleteHealthInsuranceCompanyPlansById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getHealthInsuranceCompanyPlansList({
              page: healthInsuranceCompanyPlansPagination?.page,
              size: healthInsuranceCompanyPlansPagination?.size,
              cityId: cityId,
            })
          );
          setOpen(false);
          toast("Successfully Deleted", {
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

  // Change Enable / Disable handler
  const changeStatusHandler = (data) => {
    dispatch(updateHealthInsuranceCompanyPlansById(data))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getHealthInsuranceCompanyPlansList({
              page: healthInsuranceCompanyPlansPagination?.page,
              size: healthInsuranceCompanyPlansPagination?.size,
              cityId: cityId,
            })
          );
          toast("Successfully Chnaged!", {
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="end" spacing={4}>
              <Stack spacing={1}>
                {healthInsuranceCompanyNetworkDetails &&
                healthInsuranceCompanyDetails &&
                healthInsuranceCompanyCityDetails ? (
                  <Typography variant="h5">
                    {`Plans: ${healthInsuranceCompanyNetworkDetails?.networkName} - ${healthInsuranceCompanyDetails?.companyName} - ${healthInsuranceCompanyCityDetails?.cityName}`}
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Skeleton height={30} width={100} animation="wave" />
                    <Skeleton height={30} width={100} animation="wave" />
                    <Skeleton height={30} width={100} animation="wave" />
                    <Skeleton height={30} width={100} animation="wave" />
                  </Box>
                )}
                <Breadcrumbs
                  sx={{
                    mt: 1,
                    color: "#60186F",
                    fontWeight: 600,
                    fontSize: "24px",
                    textDecoration: "none",
                  }}
                  separator={<NavigateNextIcon sx={{ fontSize: "30px" }} />}
                  aria-label="breadcrumb"
                >
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack>

              {moduleAccess(user, "companies.create") && (
                <NextLink
                  href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/create`}
                  passHref
                  onClick={() => dispatch(clearHealthInsuranceDetailsData())}
                >
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Add
                  </Button>
                </NextLink>
              )}
            </Stack>

            <SearchInput placeHolder="Search" searchFilterHandler={searchFilterHandler} />

            {healthInsuranceCompanyPlansListLoader ? (
              <AnimationLoader open={true} />
            ) : (
              <>
                {healthInsuranceCompanyPlansList && (
                  <HealthInsuranceCompanyPlansTable
                    count={healthInsuranceCompanyPlansListPagination?.totalItems}
                    items={healthInsuranceCompanyPlansList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={healthInsuranceCompanyPlansPagination?.page - 1}
                    rowsPerPage={healthInsuranceCompanyPlansPagination?.size}
                    searchFilter={searchFilter}
                    deleteByIdHandler={deleteModalByIdHandler}
                    changeStatusHandler={changeStatusHandler}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>

      <ModalComp open={open} handleClose={handleClose}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to delete ?
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
          mt={3}
        >
          <Button
            variant="contained"
            sx={{
              marginRight: "10px",
            }}
            onClick={() => deleteByIdHandler(deleteId)}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
    </>
  );
};

CompaniesCity.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CompaniesCity;
