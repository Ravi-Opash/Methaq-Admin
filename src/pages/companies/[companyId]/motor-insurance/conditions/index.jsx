import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyDetailById, getConditionsByCompanyId } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { Box, Button, Container, Link, Stack, Typography, SvgIcon, CircularProgress } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { setConditionsDetail, setConditionsListPagination } from "src/sections/companies/reducer/companySlice";
import CompanyConditionsTable from "src/sections/companies/conditions/conditions-table";
import { moduleAccess } from "src/utils/module-access";

const Conditions = () => {
  const dispatch = useDispatch();
  const { pagination, companyDetail, conditionsList, conditionsListPagination, conditionsListLoader } = useSelector(
    (state) => state.company
  );
  const router = useRouter();
  const { loginUserData: user } = useSelector((state) => state.auth);
  const { companyId } = router.query;

  useEffect(() => {
    dispatch(getCompanyDetailById(companyId));
  }, []);

  const initialized = useRef(false);

  // Get Motor Conditions
  const getConditionsListHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(getConditionsByCompanyId({ page: pagination?.page, size: pagination?.size, id: companyId }))
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
    getConditionsListHandler();

    return () => {
      dispatch(
        setConditionsListPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []);

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
            <Stack direction="row">
              <NextLink href={`/companies/${companyId}/motor-insurance`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Companies</Typography>
                </Link>
              </NextLink>
            </Stack>

            {conditionsListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {conditionsList && (
                  <>
                    <Stack direction="row" justifyContent="space-between" spacing={4}>
                      <Stack spacing={1}>
                        <Typography variant="h4">Conditions of {companyDetail?.companyName}</Typography>
                      </Stack>
                      {conditionsList && conditionsList.length > 0
                        ? moduleAccess(user, "companies.update") && (
                            <NextLink
                              href={`/companies/${companyId}/motor-insurance/conditions/${conditionsList[0]?._id}/edit`}
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
                                Edit
                              </Button>
                            </NextLink>
                          )
                        : moduleAccess(user, "companies.create") && (
                            <NextLink
                              href={`/companies/${companyId}/motor-insurance/conditions/create`}
                              passHref
                              onClick={() => dispatch(setConditionsDetail(null))}
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

                    <CompanyConditionsTable items={conditionsList} />
                  </>
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Conditions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Conditions;
