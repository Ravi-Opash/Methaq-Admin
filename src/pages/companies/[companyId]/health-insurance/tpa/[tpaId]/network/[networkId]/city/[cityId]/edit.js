import { Box, Container } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextLink from "next/link";
import { Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import HealthInsuranceCompanyCityEditForm from "src/sections/health-insurance/health-insurance-companies/Forms/health-companies-edit-city-form";
import { getHealthInsuranceCompanyCityDetailById } from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";

function Edit() {
  const dispatch = useDispatch();
  const { healthInsuranceCompanyCityDetails } = useSelector((state) => state.healthInsuranceCompany);
  const router = useRouter();
  const { tpaId, companyId, networkId, cityId } = router.query;

  const initialized = useRef(false);

  // get city details API
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getHealthInsuranceCompanyCityDetailById(cityId))
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
          {healthInsuranceCompanyCityDetails ? (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink
                  href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city`}
                  passHref
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
                    <Typography variant="subtitle2">City</Typography>
                  </Link>
                </NextLink>
              </Box>

              <Typography mt={2} variant="h4">
                Edit City
              </Typography>

              <Box mt={3}>
                {/* Health - City form component */}
                <HealthInsuranceCompanyCityEditForm />
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
