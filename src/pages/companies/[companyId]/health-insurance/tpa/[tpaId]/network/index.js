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
import HealthInsuranceCompanyNetworkTable from "src/sections/health-insurance/health-insurance-companies/health-companies-network-table";
import {
  deleteHealthInsuranceCompanyNetworkById,
  getHealthInsuranceCompanyNetworkList,
  getHealthInsuranceCompanyTpaDetailById,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import {
  clearHealthInsuranceDetailsData,
  setHealthInsuranceCompanyNetworkListPagination,
} from "src/sections/health-insurance/health-insurance-companies/Reducer/healthInsuranceCompanySlice";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/router";
import AnimationLoader from "src/components/amimated-loader";

const Companies = () => {
  const dispatch = useDispatch();
  const {
    healthInsuranceCompanyNetworkList,
    healthInsuranceCompanyNetworkListPagination,
    healthInsuranceCompanyNetworkPagination,
    setHealthInsuranceCompanyNetworkListLoader,
    healthInsuranceCompanyTpaDetails,
  } = useSelector((state) => state.healthInsuranceCompany);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { companyId, tpaId } = router.query;

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
    <Typography key="3" sx={{ color: "#60186F", fontWeight: 600, fontSize: "24px", mx: -1 }}>
      Network
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
        getHealthInsuranceCompanyNetworkList({
          page: healthInsuranceCompanyNetworkPagination?.page,
          size: healthInsuranceCompanyNetworkPagination?.size,
          tpaId: tpaId,
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
  };

  useEffect(() => {
    getCompanyListHandler();
    getHealthInsuranceCompanyDetail();

    return () => {};
  }, []);

  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(
        setHealthInsuranceCompanyNetworkListPagination({
          page: value + 1,
          size: healthInsuranceCompanyNetworkPagination?.size,
        })
      );
      dispatch(
        getHealthInsuranceCompanyNetworkList({
          page: value + 1,
          size: healthInsuranceCompanyNetworkPagination?.size,
          tpaId: tpaId,
        })
      );
    },
    [healthInsuranceCompanyNetworkPagination?.size]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setHealthInsuranceCompanyNetworkListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getHealthInsuranceCompanyNetworkList({
          page: 1,
          size: event.target.value,
          tpaId: tpaId,
        })
      );
    },
    [healthInsuranceCompanyNetworkPagination?.page]
  );

  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [healthInsuranceCompanyNetworkPagination]
  );

  const deleteByIdHandler = (id) => {
    dispatch(deleteHealthInsuranceCompanyNetworkById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getHealthInsuranceCompanyNetworkList({
              page: healthInsuranceCompanyNetworkPagination?.page,
              size: healthInsuranceCompanyNetworkPagination?.size,
              tpaId: tpaId,
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
                {healthInsuranceCompanyTpaDetails ? (
                  <Typography variant="h4">{`Networks: ${healthInsuranceCompanyTpaDetails?.TPAName}`}</Typography>
                ) : (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Skeleton height={40} width={140} animation="wave" />
                    <Skeleton height={40} width={140} animation="wave" />
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
                  href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/create`}
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

            {setHealthInsuranceCompanyNetworkListLoader ? (
              <AnimationLoader open={true} />
            ) : (
              <>
                {healthInsuranceCompanyNetworkList && (
                  <HealthInsuranceCompanyNetworkTable
                    count={healthInsuranceCompanyNetworkListPagination?.totalItems}
                    items={healthInsuranceCompanyNetworkList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={healthInsuranceCompanyNetworkPagination?.page - 1}
                    rowsPerPage={healthInsuranceCompanyNetworkPagination?.size}
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
            // onClick={()=>{console.log(deleteId)}}
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
