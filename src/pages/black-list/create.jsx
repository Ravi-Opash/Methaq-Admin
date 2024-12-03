import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import BlackListEditForm from "src/sections/black-list/black-list-form";

const CreateExcess = () => {
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
              <NextLink href={`/black-list`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Black List</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={4} variant="h4" sx={{ fontSize: { xs: "22px", sm: "30px" } }}>
              Create a new black list
            </Typography>

            <Box mt={3}>
              {/* Black List Edit form Component */}
              <BlackListEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateExcess.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateExcess;
