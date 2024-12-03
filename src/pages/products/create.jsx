import { Box, Container, Link, Typography } from "@mui/material";
import Head from "next/head";
import React from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import ProductEditForm from "src/sections/products/product-edit-form";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const CreateProduct = () => {
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
              <NextLink href="/products" passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Products</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Create a new product
            </Typography>

            <Box mt={3}>
              <ProductEditForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CreateProduct.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateProduct;
