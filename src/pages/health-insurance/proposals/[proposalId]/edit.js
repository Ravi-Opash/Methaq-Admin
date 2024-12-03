import { Box, Container, Link, Typography } from "@mui/material"; 
import React from "react";  
import { ArrowLeft } from "src/Icons/ArrowLeft";  
import NextLink from "next/link"; 
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout"; 
import { useRouter } from "next/router";
import EditHealthInsuranceInfoForm from "src/sections/health-insurance/health-info/health-info-edit-form";

// The EditHealthInsurance component handles the page for editing a health insurance proposal
const EditHealthInsurance = () => {
  const router = useRouter(); 
  const { proposalId } = router.query;  

  return (
    <>
      {/* Main content box for the page */}
      <Box
        component="main"  
        sx={{
          flexGrow: 1, 
          py: 3,  
        }}
      >
        <Container maxWidth={false}> 
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            {/* Link to navigate back to the health insurance proposal */}
            <Box sx={{ display: "inline-block" }}>
              <NextLink href={`/health-insurance/proposals/${proposalId}`} passHref>
                <Link
                  color="textPrimary"  
                  component="a"  
                  sx={{
                    alignItems: "center",  
                    display: "flex",  
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Health Insurance</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Health Insurance Info  
            </Typography>

            {/* Form to edit health insurance info */}
            <Box mt={3}>
              <EditHealthInsuranceInfoForm /> 
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditHealthInsurance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditHealthInsurance;
