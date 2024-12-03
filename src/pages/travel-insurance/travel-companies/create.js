import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import CompanyEditForm from "src/sections/companies/company-edit-form";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CreateMotorCompanies from "src/sections/create-motor-companies/CreateMotorCompanies";

const CreateCompany = () => {
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
              <NextLink href="/travel-insurance/travel-companies" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Portals</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new Portal
            </Typography>

            <Box mt={3}>
              <CreateMotorCompanies 
              Flag={"travel-insurance"}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateCompany.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateCompany;
