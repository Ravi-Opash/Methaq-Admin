import React, { useRef, useEffect } from "react";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Breadcrumbs, Button, CircularProgress, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import {
  getHealthInsuranceCompanyConditionsList,
  getHealthInsuranceCompanyDetailById,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import { clearHealthInsuranceConditionDetails } from "src/sections/health-insurance/health-insurance-companies/Reducer/healthInsuranceCompanySlice";
import HealthInsuranceCompanyConditionTable from "src/sections/health-insurance/health-insurance-companies/health-companies-conditions-table";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import { useRouter } from "next/router";

const CompaniesConditions = () => {
  const dispatch = useDispatch();
  const {
    healthInsuranceCompanyDetails,
    healthInsuranceCompanyConditionsList,
    healthInsuranceCompanyConditionsPagination,
    healthInsuranceCompanyConditionsListLoader,
  } = useSelector((state) => state.healthInsuranceCompany);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const router = useRouter();
  const { companyId } = router?.query;

  const initialized = useRef(false);

  // Health - get company condition list 
  const getCompanyListHandler = async () => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(
        getHealthInsuranceCompanyConditionsList({
          id: companyId,
          page: healthInsuranceCompanyConditionsPagination?.page,
          size: healthInsuranceCompanyConditionsPagination?.size,
        })
      )
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
      dispatch(getHealthInsuranceCompanyDetailById(companyId))
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
  
  useEffect(() => {
    getCompanyListHandler();
    return () => {};
  }, []);

  const breadcrumbs = [
    <Typography key="1" sx={{ color: "#60186F", fontWeight: 600, fontSize: "22px" }}>
      List
    </Typography>,
    <Link style={{ textDecoration: "none" }} key="2" href="/companies">
      <Typography sx={{ color: "#60186F", fontWeight: 600, fontSize: "22px" }}>Company</Typography>
    </Link>,
    <Typography key="3" sx={{ color: "#60186F", fontWeight: 600, fontSize: "22px" }}>
      Conditions
    </Typography>,
  ];

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
                <Typography variant="h4" sx={{ fontSize: "28px" }}>
                  Conditions Of {`${healthInsuranceCompanyDetails?.companyName}`}
                </Typography>
                <Breadcrumbs
                  sx={{
                    mt: 1,
                    color: "#60186F",
                    fontWeight: 600,
                    fontSize: "20px",
                    textDecoration: "none",
                  }}
                  separator={<NavigateNextIcon sx={{ fontSize: "30px" }} />}
                  aria-label="breadcrumb"
                >
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack>

              {healthInsuranceCompanyConditionsList && healthInsuranceCompanyConditionsList.length > 0 ? (
                <>
                  {moduleAccess(user, "companies.update") && (
                    <NextLink
                      href={`/companies/${companyId}/health-insurance/conditions/${healthInsuranceCompanyConditionsList?.[0]?._id}/edit`}
                      passHref
                      onClick={() => dispatch(clearHealthInsuranceConditionDetails())}
                    >
                      <Button
                        startIcon={
                          <SvgIcon fontSize="small">
                            <PlusIcon />
                          </SvgIcon>
                        }
                        variant="contained"
                      >
                        Edit
                      </Button>
                    </NextLink>
                  )}
                </>
              ) : (
                <>
                  {moduleAccess(user, "companies.create") && (
                    <NextLink
                      href={`/companies/${companyId}/health-insurance/conditions/create`}
                      passHref
                      onClick={() => dispatch(clearHealthInsuranceConditionDetails())}
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
                </>
              )}
            </Stack>

            {healthInsuranceCompanyConditionsListLoader ? (
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
                {healthInsuranceCompanyConditionsList && (
                  // Health - company condition table
                  <HealthInsuranceCompanyConditionTable items={healthInsuranceCompanyConditionsList} />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CompaniesConditions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CompaniesConditions;
