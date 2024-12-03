import React, { useRef, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import Head from "next/head";
import NextLink from "next/link";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { getProductDetailsById } from "src/sections/products/action/productAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PencilAlt } from "src/Icons/PencilAlt";
import ProductSummary from "src/sections/products/product-summary";
import { moduleAccess } from "src/utils/module-access";
import AnimationLoader from "src/components/amimated-loader";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const ProductDetails = () => {
  const router = useRouter();
  const { productId } = router.query;

  const dispatch = useDispatch();
  const { productDetail, productDetailLoader } = useSelector((state) => state.products);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const initialized = useRef(false);

  // Function to get product details
  const getProductDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
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

  // Call function to get product details
  useEffect(
    () => {
      if (productId) {
        getProductDetailsHandler();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productId]
  );

  // console.log("productDetail", productDetail);

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
          {productDetailLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
              {/* <CircularProgress /> */}
              <AnimationLoader open={!!productDetailLoader} />
            </Box>
          ) : (
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

              {productDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Product Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        {moduleAccess(user, "product.update") && (
                          <NextLink href={`/products/${productDetail?._id}/edit`} passHref>
                            <Button
                              component="a"
                              endIcon={<PencilAlt fontSize="small" />}
                              sx={{ m: 1 }}
                              variant="contained"
                            >
                              Edit
                            </Button>
                          </NextLink>
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  <ProductSummary productDetail={productDetail} />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

ProductDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductDetails;
