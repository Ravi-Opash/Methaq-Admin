import React, { useRef, useEffect } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getBenifitsDetailById } from "src/sections/benifits/action/benifitsAction";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import BenifitsSummary from "src/sections/benifits/benifits-summary";

const BenifitsDetails = () => {
  const dispatch = useDispatch();
  const { benifitsDetail, benifitsDetailLoader } = useSelector((state) => state.benifits);
  const router = useRouter();
  const { benifitsId } = router.query;

  const initialized = useRef(false);

  // Get benefits details API calling function
  const getBenifitsDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getBenifitsDetailById(benifitsId))
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

  useEffect(() => {
    getBenifitsDetailsHandler();
  }, []);

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
          {benifitsDetailLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href="/benifits" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Benifits</Typography>
                  </Link>
                </NextLink>
              </Box>

              {benifitsDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Benifits Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        <NextLink href={`/benifits/${benifitsDetail?._id}/edit`} passHref>
                          <Button
                            component="a"
                            endIcon={<PencilAlt fontSize="small" />}
                            sx={{ m: 1 }}
                            variant="contained"
                          >
                            Edit
                          </Button>
                        </NextLink>
                      </Grid>
                    </Grid>
                  </Box>

                  <BenifitsSummary benifitsDetail={benifitsDetail} />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

BenifitsDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BenifitsDetails;
