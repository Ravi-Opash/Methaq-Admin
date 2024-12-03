import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import BenifitsEditForm from "src/sections/benifits/benifits-edit-form";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const CreateBenifits = () => {
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
              <NextLink href="/benifits" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Benifits</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new Benifit
            </Typography>

            <Box mt={3}>
              {/* Benfits Edit form Component */}
              <BenifitsEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateBenifits.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateBenifits;
