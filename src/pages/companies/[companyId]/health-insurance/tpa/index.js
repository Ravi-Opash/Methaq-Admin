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
import HealthInsuranceCompanyTplTable from "src/sections/health-insurance/health-insurance-companies/health-companies-tpl-table";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  deleteHealthInsuranceCompanyTpaById,
  getHealthInsuranceCompanyDetailById,
  getHealthInsuranceCompanyTpaList,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import {
  clearHealthInsuranceDetailsData,
  setHealthInsuranceCompanyTpaListPagination,
} from "src/sections/health-insurance/health-insurance-companies/Reducer/healthInsuranceCompanySlice";
import { useRouter } from "next/router";
import AnimationLoader from "src/components/amimated-loader";

const Companies = () => {
  const dispatch = useDispatch();
  const {
    healthInsuranceCompanyTpaList,
    healthInsuranceCompanyTpaListPagination,
    healthInsuranceCompanyTpaPagination,
    setHealthInsuranceCompanyTpaListLoader,
    healthInsuranceCompanyDetails,
  } = useSelector((state) => state.healthInsuranceCompany);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { companyId } = router.query;

  const breadcrumbs = [
    <Typography key="1" sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mr: -1 }}>
      List
    </Typography>,
    <Link style={{ textDecoration: "none" }} key="2" href={`/companies/${companyId}/health-insurance`}>
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mx: -1 }}>Company</Typography>
    </Link>,
    <Typography key="3" sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mx: -1 }}>
      TPA
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
  const companyIds = useCompanyIds(healthInsuranceCompanyTpaList);
  // checkbox selection
  const companySelection = useSelection(companyIds);

  const [searchFilter, setSearchFilter] = useState("");
  const searchFilterHandler = (value) => {
    setSearchFilter(value);
  };

  const initialized = useRef(false);

  // get health insuarnce company TPA list API
  const getCompanyListHandler = async () => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(
        getHealthInsuranceCompanyTpaList({
          page: healthInsuranceCompanyTpaPagination?.page,
          size: healthInsuranceCompanyTpaPagination?.size,
          companyId: companyId,
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

  // get company details API to show company name in top
  const getHealthInsuranceCompanyDetail = () => {
    if (initialized1.current) {
      return;
    }
    initialized1.current = true;
    dispatch(getHealthInsuranceCompanyDetailById(companyId));
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
        setHealthInsuranceCompanyTpaListPagination({
          page: value + 1,
          size: healthInsuranceCompanyTpaPagination?.size,
        })
      );
      dispatch(
        getHealthInsuranceCompanyTpaList({
          page: value + 1,
          size: healthInsuranceCompanyTpaPagination?.size,
          companyId: companyId,
        })
      );
    },
    [healthInsuranceCompanyTpaPagination?.size]
  );

  // Page per row change handler
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setHealthInsuranceCompanyTpaListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getHealthInsuranceCompanyTpaList({
          page: 1,
          size: event.target.value,
          companyId: companyId,
        })
      );
    },
    [healthInsuranceCompanyTpaPagination?.page]
  );

  // Delete TAP handler
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [healthInsuranceCompanyTpaPagination]
  );

  // Delete TAP API
  const deleteByIdHandler = (id) => {
    dispatch(deleteHealthInsuranceCompanyTpaById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getHealthInsuranceCompanyTpaList({
              page: healthInsuranceCompanyTpaPagination?.page,
              size: healthInsuranceCompanyTpaPagination?.size,
              companyId: companyId,
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
                {healthInsuranceCompanyDetails ? (
                  <Typography variant="h4">{`TPA: ${healthInsuranceCompanyDetails?.companyName}`}</Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Skeleton height={40} width={140} animation="wave" />
                    <Skeleton height={40} width={140} animation="wave" />
                  </Box>
                )}
                <Breadcrumbs
                  sx={{
                    mt: 1,
                    marginLeft: 3,
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
                  onClick={() => dispatch(clearHealthInsuranceDetailsData())}
                  href={`/companies/${companyId}/health-insurance/tpa/create`}
                  passHref
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

            {setHealthInsuranceCompanyTpaListLoader ? (
              <AnimationLoader open={true} />
            ) : (
              <>
                {healthInsuranceCompanyTpaList && (
                  <HealthInsuranceCompanyTplTable
                    count={healthInsuranceCompanyTpaListPagination?.totalItems}
                    items={healthInsuranceCompanyTpaList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={healthInsuranceCompanyTpaPagination?.page - 1}
                    rowsPerPage={healthInsuranceCompanyTpaPagination?.size}
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

Companies.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Companies;
