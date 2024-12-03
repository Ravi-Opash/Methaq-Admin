import React from "react";
import NextLink from "next/link";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import VoucherEditForm from "src/sections/voucher/voucher-edit-form";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const CreateVoucher = () => {
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
              <NextLink href="/vouchers" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Vouchers</Typography>
                </Link>
              </NextLink>
            </Box>
          </Box>

          <Box mt={3}>
            <VoucherEditForm />
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateVoucher.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateVoucher;
