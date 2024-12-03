import React, { useRef, useEffect } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getExcessByExcessId } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ExcessSummary from "src/sections/companies/excess/excess-summary";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";

const ExcessDetails = () => {
  const dispatch = useDispatch();
  const { excessDetail, excessDetailLoader } = useSelector((state) => state.company);
  const { loginUserData: user } = useSelector((state) => state.auth);
  const router = useRouter();
  const { excessId, companyId } = router.query;
  const initialized = useRef(false);

  // Get excess details
  const getExcessDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getExcessByExcessId({ id: companyId, excessId: excessId }))
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

  useEffect(() => {
    getExcessDetailsHandler();
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
          {excessDetailLoader ? (
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
                <NextLink href={`/companies/${companyId}/motor-insurance/excess`} passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Excess</Typography>
                  </Link>
                </NextLink>
              </Box>

              {excessDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Excess Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        {moduleAccess(user, "companies.update") && (
                          <NextLink
                            href={`/companies/${companyId}/motor-insurance/excess/${excessDetail?._id}/edit`}
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

                  <ExcessSummary excessDetail={excessDetail} />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

ExcessDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ExcessDetails;
