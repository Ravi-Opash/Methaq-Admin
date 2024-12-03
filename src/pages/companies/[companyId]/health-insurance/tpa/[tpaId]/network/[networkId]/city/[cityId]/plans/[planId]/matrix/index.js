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
import HealthInsuranceCompanyMatrixTable from "src/sections/health-insurance/health-insurance-companies/health-companies-matrix-table";
import {
  clearHealthInsuranceDetailsData,
  setHealthInsuranceCompanyMatrixListPagination,
} from "src/sections/health-insurance/health-insurance-companies/Reducer/healthInsuranceCompanySlice";
import {
  deleteHealthInsuranceCompanyMatrixById,
  getHealthInsuranceCompanyCityDetailById,
  getHealthInsuranceCompanyDetailById,
  getHealthInsuranceCompanyMatrixList,
  getHealthInsuranceCompanyNetworkDetailById,
  getHealthInsuranceCompanyPlansDetailById,
  getHealthInsuranceCompanyTpaDetailById,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/router";
import AnimationLoader from "src/components/amimated-loader";

const CompaniesMatrix = () => {
  const dispatch = useDispatch();
  const {
    healthInsuranceCompanyMatrixList,
    healthInsuranceCompanyMatrixListPagination,
    healthInsuranceCompanyMatrixPagination,
    healthInsuranceCompanyMatrixListLoader,
    healthInsuranceCompanyDetails,
    healthInsuranceCompanyNetworkDetails,
    healthInsuranceCompanyCityDetails,
    healthInsuranceCompanyPlansDetails,
  } = useSelector((state) => state.healthInsuranceCompany);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { companyId, tpaId, networkId, cityId, planId, matrixId } = router.query;

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
    <Link
      style={{ textDecoration: "none" }}
      key="2"
      href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans`}
    >
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "20px", mx: -1 }}>Plans</Typography>
    </Link>,
    <Typography key="3" sx={{ color: "#60186F", fontWeight: 600, fontSize: "20px", mx: -1 }}>
      Matrix
    </Typography>,
  ];

  const useCompanyIds = (companies) => {
    return useMemo(() => {
      if (companies !== null) {
        return companies?.map((company) => company._id);
      }
    }, [companies]);
  };
  // all customer ids
  const companyIds = useCompanyIds(healthInsuranceCompanyMatrixList);
  // checkbox selection
  const companySelection = useSelection(companyIds);

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
        getHealthInsuranceCompanyMatrixList({
          page: healthInsuranceCompanyMatrixPagination?.page,
          size: healthInsuranceCompanyMatrixPagination?.size,
          planId: planId,
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

  // get matrix all details (plan, network, city, tpa )
  const getHealthInsuranceCompanyDetail = () => {
    if (initialized1.current) {
      return;
    }
    initialized1.current = true;
    dispatch(getHealthInsuranceCompanyTpaDetailById(tpaId));
    dispatch(getHealthInsuranceCompanyDetailById(companyId));
    dispatch(getHealthInsuranceCompanyNetworkDetailById(networkId));
    dispatch(getHealthInsuranceCompanyCityDetailById(cityId));
    dispatch(getHealthInsuranceCompanyPlansDetailById(planId));
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
        setHealthInsuranceCompanyMatrixListPagination({
          page: value + 1,
          size: healthInsuranceCompanyMatrixPagination?.size,
        })
      );
      dispatch(
        getHealthInsuranceCompanyMatrixList({
          page: value + 1,
          size: healthInsuranceCompanyMatrixPagination?.size,
          planId: planId,
        })
      );
    },
    [healthInsuranceCompanyMatrixPagination?.size]
  );

  // Row per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setHealthInsuranceCompanyMatrixListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getHealthInsuranceCompanyMatrixList({
          page: 1,
          size: event.target.value,
          planId: planId,
        })
      );
    },
    [healthInsuranceCompanyMatrixPagination?.page]
  );

  // Delete button click handler
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [healthInsuranceCompanyMatrixPagination]
  );

  // Delete matrix API
  const deleteByIdHandler = (id) => {
    dispatch(deleteHealthInsuranceCompanyMatrixById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getHealthInsuranceCompanyMatrixList({
              page: healthInsuranceCompanyMatrixPagination?.page,
              size: healthInsuranceCompanyMatrixPagination?.size,
              planId: planId,
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
                {healthInsuranceCompanyNetworkDetails?.networkName &&
                healthInsuranceCompanyDetails?.companyName &&
                healthInsuranceCompanyCityDetails?.cityName &&
                healthInsuranceCompanyPlansDetails?.planName ? (
                  <Typography variant="h5">
                    {`Matrix: ${healthInsuranceCompanyNetworkDetails?.networkName} - ${healthInsuranceCompanyDetails?.companyName} - ${healthInsuranceCompanyCityDetails?.cityName} - ${healthInsuranceCompanyPlansDetails?.planName}`}
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Skeleton height={30} width={100} animation="wave" />
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
                  href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${planId}/matrix/create`}
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

            {healthInsuranceCompanyMatrixListLoader ? (
              <AnimationLoader open={true} />
            ) : (
              <>
                {healthInsuranceCompanyMatrixList && (
                  <HealthInsuranceCompanyMatrixTable
                    count={healthInsuranceCompanyMatrixListPagination?.totalItems}
                    items={healthInsuranceCompanyMatrixList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={healthInsuranceCompanyMatrixPagination?.page - 1}
                    rowsPerPage={healthInsuranceCompanyMatrixPagination?.size}
                    selected={companySelection.selected}
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

CompaniesMatrix.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CompaniesMatrix;
