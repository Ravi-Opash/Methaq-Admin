import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Link, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import HealthInsuranceCompanyTPAEditForm from "src/sections/health-insurance/health-insurance-companies/Forms/health-companies-tpa-edit-form";
import { useRouter } from "next/router";

function Create() {
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
              <NextLink
                href={`/companies/${companyId}/health-insurance/tpa`}
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
                  <Typography variant="subtitle2">TPA</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new TPA
            </Typography>

            <Box mt={3}>
              {/* health - TAP edit from component */}
              <HealthInsuranceCompanyTPAEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

Create.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Create;
