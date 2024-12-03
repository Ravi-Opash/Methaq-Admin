import { Box, Container, Link, Typography } from "@mui/material";
import React from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import EditContractorAllRiskDetailForm from "src/sections/commercial/contractor-all-risk/contractor-all-risk-edit-form";
import { useRouter } from "next/router";

const EditContractorAllRisk = () => {
  const router = useRouter();
  const { commercialId } = router.query;
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
              <NextLink href={`/contractor-all-risk/${commercialId}`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Contractor All Risk</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Contractor all risk detail
            </Typography>

            <Box mt={3}>
               {/* Contractor all risk form component */}
              <EditContractorAllRiskDetailForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditContractorAllRisk.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditContractorAllRisk;
