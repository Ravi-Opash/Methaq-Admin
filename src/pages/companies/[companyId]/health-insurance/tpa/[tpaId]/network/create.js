import { Box, Container } from "@mui/system";
import React from "react";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import HealthInsuranceCompanyNetworkEditForm from "src/sections/health-insurance/health-insurance-companies/Forms/health-companies-network-edit-form";
import { Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/router";

function Create() {
  const router = useRouter();
  const { companyId, tpaId } = router.query;
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
                href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network`}
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
                  <Typography variant="subtitle2">Network</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new Network
            </Typography>

            <Box mt={3}>
              {/* Health - Network edit form component */}
              <HealthInsuranceCompanyNetworkEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

Create.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Create;
