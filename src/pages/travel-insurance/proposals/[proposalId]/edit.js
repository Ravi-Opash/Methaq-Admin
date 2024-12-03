import { Box, Container, Link, Typography } from "@mui/material";
import React from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";

const EditTravelInsurance = () => {
  const router = useRouter();
  const { proposalId } = router.query;
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
              <NextLink href={`/travel-insurance/proposals/${proposalId}`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Travel Insurance</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Travel Insurance Info
            </Typography>

            <Box mt={3}></Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditTravelInsurance.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditTravelInsurance;
