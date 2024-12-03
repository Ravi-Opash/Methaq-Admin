import { Box, Container, Link, Typography } from "@mui/material";
import React from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import EditProfessionalIndemnityDetailForm from "src/sections/commercial/professional-indemnity/professional-indemnity-edit-form";

const EditProfessionalIndemnity = () => {
  const router = useRouter();
  const { professionalIndemnityId } = router.query;

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
              <NextLink href={`/professional-indemnity/${professionalIndemnityId}`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Professional Indemnity</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Professional Indemnity
            </Typography>

            <Box mt={3}>
              <EditProfessionalIndemnityDetailForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditProfessionalIndemnity.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditProfessionalIndemnity;
