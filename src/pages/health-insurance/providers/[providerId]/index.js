import React, { useRef, useEffect } from "react";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PrviderSummary from "src/sections/health-insurance/Providers/provider-summary";
import { getHealthProviderDetailById } from "src/sections/health-insurance/Providers/Action/healthProviderAction";
import AnimationLoader from "src/components/amimated-loader";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const ProviderDetails = () => {
  const router = useRouter();
  const { healthProviderDetails, healthProviderDetailLoader } = useSelector((state) => state.healthProvider);

  const { providerId } = router.query;

  const dispatch = useDispatch();

  const initialized = useRef(false);

  // Function to fetch provider details by providerId
  const getProductDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getHealthProviderDetailById(providerId))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };
  // Dispatch the action to fetch health provider details by ID

  useEffect(
    () => {
      if (providerId) {
        getProductDetailsHandler();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [providerId]
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
          {healthProviderDetailLoader ? (
            <AnimationLoader open={!!healthProviderDetailLoader} />
          ) : (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href={`/health-insurance/providers`} passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Providers</Typography>
                  </Link>
                </NextLink>
              </Box>

              {healthProviderDetails && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Provider Details</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <PrviderSummary healthProviderDetails={healthProviderDetails} />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

ProviderDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProviderDetails;
