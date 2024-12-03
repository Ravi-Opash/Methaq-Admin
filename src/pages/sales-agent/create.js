import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import AdminEditForm from "src/sections/sub-admins/subAdmin-edit-form";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import SalesAgentEditForm from "src/sections/sales-agent/sales-agent-edit-form";

const CreateSalesAgent = () => {
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
              <NextLink href="/sales-agent" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Sales Agent</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new sales agent
            </Typography>

            <Box mt={3}>
              <SalesAgentEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateSalesAgent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateSalesAgent;
