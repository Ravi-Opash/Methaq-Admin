import React, { useEffect, useRef } from "react";
import NextLink from "next/link";
import { Box, Container, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import DiscountEditForm from "src/sections/partners/discount-offers/discout-offers-form";
import { getDiscountDetailsById } from "src/sections/partners/action/partnerAction";

const DiscountEdit = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { discountId, partnerId } = router.query;
  const { discountDetail } = useSelector((state) => state.partners);

  const initialized = useRef(false);

  // Get discount details
  const getDiscountDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      // get discount details
      dispatch(getDiscountDetailsById(discountId))
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

  // Get discount details
  useEffect(
    () => {
      getDiscountDetailsHandler();
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
          {discountDetail ? (
            <>
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
                      <Typography variant="subtitle2">Discount and Offers</Typography>
                    </Link>
                  </NextLink>
                </Box>
              </Box>

              <Box mt={3}>
                <DiscountEditForm />
              </Box>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </Container>
      </Box>
    </>
  );
};

DiscountEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DiscountEdit;
