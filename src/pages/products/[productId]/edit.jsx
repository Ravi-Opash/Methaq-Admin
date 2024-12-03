import { Box, Container, Link, Typography } from "@mui/material";
import Head from "next/head";
import React, { useRef, useEffect } from "react";
import NextLink from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import ProductEditForm from "src/sections/products/product-edit-form";
import { useRouter } from "next/router";
import { getProductDetailsById } from "src/sections/products/action/productAction";
import { toast } from "react-toastify";

const ProductEdit = () => {
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state) => state.products);
  const router = useRouter();
  const { productId } = router.query;

  const initialized = useRef(false);
  const getProductDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      // Function to get product details
      dispatch(getProductDetailsById(productId))
        .unwrap()
        .then((res) => {
          // console.log("res", res);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to fetch product details by productId
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    () => {
      getProductDetailsHandler();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
          {productDetail ? (
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
                Edit product
              </Typography>

              <Box mt={3}>
                <ProductEditForm />
              </Box>
            </Box>
          ) : (
            <div>Loading...</div>
          )}
        </Container>
      </Box>
    </>
  );
};

ProductEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductEdit;
