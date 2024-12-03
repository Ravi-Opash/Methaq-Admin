import React, { useEffect } from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import HealthInsuranceConditionsEditForm from "src/sections/health-insurance/health-insurance-companies/Forms/health-companies-edit-condition-form";
import { useDispatch } from "react-redux";
import { getHealthInsuranceCompanyConditionsDetailsByConditionId } from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";

const EditConditions = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { companyId, conditionId } = router.query;

  // get health company conditions API
  useEffect(() => {
    dispatch(getHealthInsuranceCompanyConditionsDetailsByConditionId(conditionId))
      .unwrap()
      .then((res) => {
      })
      .catch((err) => {
        console.log(err, "err");
      });
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
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <NextLink href={`/companies/${companyId}/health-insurance/conditions`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Condition</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Condition
            </Typography>

            <Box mt={3}>
              {/* Health - Condition edit component */}
              <HealthInsuranceConditionsEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditConditions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditConditions;
