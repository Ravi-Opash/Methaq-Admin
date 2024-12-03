import { Box, Container } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import NextLink from "next/link";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getHealthInsuranceCompanyTpaDetailById } from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import { Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import HealthInsuranceCompanyTPAEditForm from "src/sections/health-insurance/health-insurance-companies/Forms/health-companies-tpa-edit-form";
import { toast } from "react-toastify";

function Edit() {
  const dispatch = useDispatch();
  const { healthInsuranceCompanyTpaDetails } = useSelector(
    (state) => state.healthInsuranceCompany
  );
  const router = useRouter();
  const { tpaId, companyId } = router.query;

  const initialized = useRef(false);

  // Health - get TPA details API
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getHealthInsuranceCompanyTpaDetailById(tpaId))
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

  useEffect(() => {
    getCompanyDetailsHandler();
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
          {healthInsuranceCompanyTpaDetails ? (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href={`/companies/${companyId}/health-insurance/tpa`} passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">TPA</Typography>
                  </Link>
                </NextLink>
              </Box>

              <Typography mt={2} variant="h4">
                Edit company
              </Typography>

              <Box mt={3}>
                {/* Health - company TAP edit form component  */}
                <HealthInsuranceCompanyTPAEditForm />
              </Box>
            </Box>
          ) : (
            <div>Loading...</div>
          )}
        </Container>
      </Box>
    </>
  );
}

Edit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Edit;
