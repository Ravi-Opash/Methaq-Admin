import React, { useEffect, useRef } from "react";
import { Box, Grid, Link, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import HealthBenefitsTable from "src/sections/health-insurance/health-insurance-companies/Forms/health-coverage-benefits/health-benefits-table";
import {
  getHealthBenefitsList,
  getHealthBenefitsValueById,
} from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";

const HealthCoverageBenefits = () => {
  const dispatch = useDispatch();
  const { healthcoveragesList, healthBenefitsValues, benefitNetworkList } = useSelector(
    (state) => state.healthInsuranceCompany
  );
  const router = useRouter();
  const { planId } = router.query;
  const benefitsAndCoverage = useRef(false);

  // API calling - get master benefits list and benefits value by planId
  useEffect(() => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (planId) {
      if (benefitsAndCoverage.current) {
        return;
      }
      benefitsAndCoverage.current = true;

      dispatch(getHealthBenefitsList({}))
        .unwrap()
        .then((res) => {
        })
        .catch((err) => {
          console.log(err, "err");
        });
      dispatch(getHealthBenefitsValueById({ planId }))
        .unwrap()
        .then((res) => {
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }
  }, [planId]);

  return (
    <>
      <Box sx={{ p: 3 }}>
        {" "}
        <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
          <Box>
            <Box onClick={() => router.back()} sx={{ cursor: "pointer", mb: 4 }}>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Back</Typography>
              </Link>
            </Box>

            <Stack spacing={1} mb={3} sx={{ mb: 5 }}>
              <Typography variant="h4">Company Coverage and Benefits</Typography>
            </Stack>
            <Box sx={{ width: "100%" }}>
              <Grid spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    List of Benefits / Health
                  </Typography>
                  <Box sx={{ borderBottom: "1px solid #707070", width: "inherit" }}></Box>
                </Box>
              </Grid>
              <Grid>
                <HealthBenefitsTable
                  items={healthcoveragesList}
                  healthBenefitsValues={healthBenefitsValues}
                  benefitNetworkList={benefitNetworkList}
                />
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

HealthCoverageBenefits.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthCoverageBenefits;
