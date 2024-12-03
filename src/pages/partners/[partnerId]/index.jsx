import React, { useRef, useEffect } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PencilAlt } from "src/Icons/PencilAlt";
import { moduleAccess } from "src/utils/module-access";
import { getPartnerDetailsById } from "src/sections/partners/action/partnerAction";
import PartnerSummary from "src/sections/partners/partner-summary";
import AnimationLoader from "src/components/amimated-loader";

const PartnerDetails = () => {
  const router = useRouter();
  const { partnerId } = router.query;

  const dispatch = useDispatch();
  const { partnerDetail, partnerDetailLoader } = useSelector((state) => state.partners);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const initialized = useRef(false);

  // Function to get partner details
  const getPartnerDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getPartnerDetailsById(partnerId))
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

  // Call get partner details
  useEffect(
    () => {
      if (partnerId) {
        getPartnerDetailsHandler();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partnerId]
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
          {partnerDetailLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
              {/* <CircularProgress /> */}
              <AnimationLoader open={!!partnerDetailLoader} />
            </Box>
          ) : (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href="/partners" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Partners</Typography>
                  </Link>
                </NextLink>
              </Box>

              {partnerDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Partner Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        {moduleAccess(user, "partners.update") && (
                          <NextLink href={`/partners/${partnerDetail?._id}/edit`} passHref>
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

                  <PartnerSummary partnerDetail={partnerDetail} />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

PartnerDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PartnerDetails;
