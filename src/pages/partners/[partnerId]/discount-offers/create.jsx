import React from "react";
import NextLink from "next/link";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import DiscountEditForm from "src/sections/partners/discount-offers/discout-offers-form";
import { useRouter } from "next/router";

const CreateDiscountOffers = () => {
  const router = useRouter();
  const { partnerId } = router.query;

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
              <NextLink href={`/partners/${partnerId}/discount-offers`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Discount And Offers</Typography>
                </Link>
              </NextLink>
            </Box>
          </Box>

          <Box mt={3}>
            <DiscountEditForm />
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateDiscountOffers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateDiscountOffers;
