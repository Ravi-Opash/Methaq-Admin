import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import MatrixEditForm from "src/sections/companies/matrix/company-matrix-edit-form";

const CreateMatrix = () => {
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
              <NextLink href={`/companies/${companyId}/motor-insurance/matrix`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Matrix</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new Matrix
            </Typography>

            <Box mt={3}>
              {/* Motor Matrix edit form component */}
              <MatrixEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateMatrix.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateMatrix;
