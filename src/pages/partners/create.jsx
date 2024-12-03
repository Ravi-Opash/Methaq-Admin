import { Box, Container, Link, Typography } from "@mui/material";
import React from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import PartnerEditForm from "src/sections/partners/company-partner-edit-form";

const CreatePartner = () => {
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
              <NextLink href="/partners" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Partner</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new partner
            </Typography>

            <Box mt={3}>
              <PartnerEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreatePartner.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreatePartner;
