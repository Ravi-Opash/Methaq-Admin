import React from "react";
import NextLink from "next/link";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import PrividerEditForm from "src/sections/health-insurance/Providers/health-provider-edit-form";

const ProviderCreate = () => {
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
          {/* Box for the back navigation link */}
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box sx={{ display: "inline-block" }}>
              <NextLink href={`/health-insurance/providers/`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Provider Details</Typography>
                </Link>
              </NextLink>
            </Box>
          </Box>

          {/* Box containing the provider edit form */}
          <Box mt={3}>
            <PrividerEditForm />
          </Box>
        </Container>
      </Box>
    </>
  );
};

ProviderCreate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProviderCreate;
