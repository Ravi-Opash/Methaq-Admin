import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ExcessEditForm from "src/sections/companies/excess/excess-edit-form";

const CreateExcess = () => {
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
              <NextLink href={`/companies/${companyId}/motor-insurance/excess`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Excess</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new Excess
            </Typography>

            <Box mt={3}>
              {/* // Excess edit form component */}
              <ExcessEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateExcess.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateExcess;
