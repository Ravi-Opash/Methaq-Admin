import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import HealthInsuranceConditionsEditForm from "src/sections/health-insurance/health-insurance-companies/Forms/health-companies-edit-condition-form";

const CreateConditions = () => {
  const router = useRouter();
  const { companyId } = router.query;
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
              Create a new Condition
            </Typography>

            <Box mt={3}>
              {/* Health - condition edit form */}
              <HealthInsuranceConditionsEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateConditions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateConditions;
