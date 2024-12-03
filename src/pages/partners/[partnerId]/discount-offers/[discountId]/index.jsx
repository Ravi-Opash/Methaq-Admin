import React, { useRef, useEffect, useCallback } from "react";
import NextLink from "next/link";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PencilAlt } from "src/Icons/PencilAlt";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import { getDiscountDetailsById, getValidatedOffersDetailsById } from "src/sections/partners/action/partnerAction";
import DiscountSummary from "src/sections/partners/discount-offers/discout-summary";
import ValidatedOffersTable from "src/sections/partners/discount-offers/validated-offers-table";
import { setVlidatedOffersListPagination } from "src/sections/partners/reducer/partnerSlice";
import AnimationLoader from "src/components/amimated-loader";

const DiscountDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { discountId, partnerId } = router.query;
  const {
    discountDetail,
    discountDetailLoader,
    validatedOffersList,
    validatedOffersListLoader,
    validatedOffersListPagination,
    validatedOffersPagination,
  } = useSelector((state) => state.partners);

  const { loginUserData: user } = useSelector((state) => state.auth);

  const initialized = useRef(false);

  // Get discount details
  const getDiscountDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      // Function use to get discount details
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

  // Function use to get validated offers
  const getValidatedOffersDetailsHandler = () => {
    dispatch(getValidatedOffersDetailsById({ id: discountId }))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // Function use to handle page change
  const handlePageChange = useCallback(
    (event, value) => {
      // setPage(value);
      dispatch(setVlidatedOffersListPagination({ page: value + 1, size: validatedOffersPagination?.size }));
      dispatch(
        getValidatedOffersDetailsById({
          page: value + 1,
          size: validatedOffersPagination?.size,
          id: discountId,
        })
      );
    },
    [validatedOffersPagination?.size]
  );

  // Function use to handle rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setVlidatedOffersListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getValidatedOffersDetailsById({
          page: 1,
          size: event.target.value,
          id: discountId,
        })
      );
    },
    [validatedOffersPagination?.page]
  );

  // Get discount details amd validated offers
  useEffect(
    () => {
      getDiscountDetailsHandler();
      getValidatedOffersDetailsHandler();

      return () => {
        dispatch(
          setVlidatedOffersListPagination({
            page: 1,
            size: 5,
          })
        );
      };
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
          {discountDetailLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
              <CircularProgress />
              <AnimationLoader open={!!discountDetailLoader} />
            </Box>
          ) : (
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
                    <Typography variant="subtitle2">Discounts</Typography>
                  </Link>
                </NextLink>
              </Box>

              {discountDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Discount Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        {moduleAccess(user, "partners.update") && (
                          <NextLink
                            href={`/partners/${partnerId}/discount-offers/${discountDetail?._id}/edit`}
                            passHref
                          >
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

                  <DiscountSummary discountDetail={discountDetail} />
                </>
              )}

              <Box sx={{ display: "inline-block", width: "100%", mt: 4 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    width: "100%",
                    py: 1.5,
                    backgroundColor: "#f5f5f5",
                    mb: 1,
                    mt: 2,
                    fontWeight: "600",
                    fontSize: "18px",
                    display: "inline-block",
                    color: "#60176F",
                    px: "14px",
                  }}
                >
                  List of validated offers
                </Typography>

                {validatedOffersListLoader ? (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box>
                    <ValidatedOffersTable
                      count={validatedOffersListPagination?.totalItems}
                      items={validatedOffersList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={validatedOffersPagination?.page - 1}
                      rowsPerPage={validatedOffersPagination?.size}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

DiscountDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DiscountDetails;
