import React, { useState, useRef, useEffect, useCallback } from "react";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Breadcrumbs, Button, Container, Skeleton, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SearchInput } from "src/components/search-input";
import ModalComp from "src/components/modalComp";
import { moduleAccess } from "src/utils/module-access";
import HealthInsuranceCompanyCityTable from "src/sections/health-insurance/health-insurance-companies/health-companies-city-table";
import {
  deleteHealthInsuranceCompanyCityById,
  getHealthInsuranceCompanyCityList,
  getHealthInsuranceCompanyDetailById,
  getHealthInsuranceCompanyNetworkDetailById,
  getHealthInsuranceCompanyTpaDetailById,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import {
  clearHealthInsuranceDetailsData,
  setHealthInsuranceCompanyCityListPagination,
} from "src/sections/health-insurance/health-insurance-companies/Reducer/healthInsuranceCompanySlice";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/router";
import AnimationLoader from "src/components/amimated-loader";

const CompaniesCity = () => {
  const dispatch = useDispatch();
  const {
    healthInsuranceCompanyCityList,
    healthInsuranceCompanyCityListPagination,
    healthInsuranceCompanyCityPagination,
    healthInsuranceCompanyCityListLoader,
    healthInsuranceCompanyDetails,
    healthInsuranceCompanyNetworkDetails,
  } = useSelector((state) => state.healthInsuranceCompany);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { companyId, tpaId, networkId } = router.query;

  // Breadcrumbs to show on top
  const breadcrumbs = [
    <Typography key="1" sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mr: -1 }}>
      List
    </Typography>,
    <Link style={{ textDecoration: "none" }} key="2" href={`/companies/${companyId}/health-insurance`}>
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mx: -1 }}>Company</Typography>
    </Link>,
    <Link style={{ textDecoration: "none" }} key="2" href={`/companies/${companyId}/health-insurance/tpa`}>
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mx: -1 }}>TPA</Typography>
    </Link>,
    <Link
      style={{ textDecoration: "none" }}
      key="2"
      href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network`}
    >
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mx: -1 }}>Network</Typography>
    </Link>,
    <Typography key="3" sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mx: -1 }}>
      City
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
        getHealthInsuranceCompanyCityList({
          page: healthInsuranceCompanyCityPagination?.page,
          size: healthInsuranceCompanyCityPagination?.size,
          networkId: networkId,
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
  const getHealthInsuranceCompanyDetail = () => {
    if (initialized1.current) {
      return;
    }
    initialized1.current = true;
    dispatch(getHealthInsuranceCompanyTpaDetailById(tpaId));
    dispatch(getHealthInsuranceCompanyDetailById(companyId));
    dispatch(getHealthInsuranceCompanyNetworkDetailById(networkId));
  };

  useEffect(() => {
    getCompanyListHandler();
    getHealthInsuranceCompanyDetail();

    return () => {};
  }, []);

  // Page change handler
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setHealthInsuranceCompanyCityListPagination({
          page: value + 1,
          size: healthInsuranceCompanyCityPagination?.size,
        })
      );
      dispatch(
        getHealthInsuranceCompanyCityList({
          page: value + 1,
          size: healthInsuranceCompanyCityPagination?.size,
          networkId: networkId,
        })
      );
    },
    [healthInsuranceCompanyCityPagination?.size]
  );

  // Rows per page change handler
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setHealthInsuranceCompanyCityListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getHealthInsuranceCompanyCityList({
          page: 1,
          size: event.target.value,
          networkId: networkId,
        })
      );
    },
    [healthInsuranceCompanyCityPagination?.page]
  );

  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [healthInsuranceCompanyCityPagination]
  );

  // Delete city handler 
  const deleteByIdHandler = (id) => {
    dispatch(deleteHealthInsuranceCompanyCityById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getHealthInsuranceCompanyCityList({
              page: healthInsuranceCompanyCityPagination?.page,
              size: healthInsuranceCompanyCityPagination?.size,
              networkId: networkId,
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
                {healthInsuranceCompanyDetails && healthInsuranceCompanyNetworkDetails ? (
                  <Typography variant="h4">
                    {`Networks: ${healthInsuranceCompanyNetworkDetails?.networkName} - ${healthInsuranceCompanyDetails?.companyName}`}
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Skeleton height={40} width={120} animation="wave" />
                    <Skeleton height={40} width={120} animation="wave" />
                    <Skeleton height={40} width={120} animation="wave" />
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
                  href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/create`}
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

            {healthInsuranceCompanyCityListLoader ? (
              <AnimationLoader open={true} />
            ) : (
              <>
                {healthInsuranceCompanyCityList && (
                  <HealthInsuranceCompanyCityTable
                    count={healthInsuranceCompanyCityListPagination?.totalItems}
                    items={healthInsuranceCompanyCityList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={healthInsuranceCompanyCityPagination?.page - 1}
                    rowsPerPage={healthInsuranceCompanyCityPagination?.size}
                    searchFilter={searchFilter}
                    deleteByIdHandler={deleteModalByIdHandler}
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
