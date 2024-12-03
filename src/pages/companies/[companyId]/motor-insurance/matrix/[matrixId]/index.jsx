import React, { useRef, useEffect } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getMatrixbyMatrixId } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import MatrixSummary from "src/sections/companies/matrix/company-matrix-summury";
import { toast } from "react-toastify";

const MatrixDetails = () => {
  const dispatch = useDispatch();
  const { matrixDetail, matrixDetailLoader } = useSelector((state) => state.company);
  const router = useRouter();
  const { matrixId, companyId } = router.query;
  const initialized = useRef(false);

  // Gwt Matrix details API
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getMatrixbyMatrixId(matrixId))
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
    getCompanyDetailsHandler();
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
          {matrixDetailLoader ? (
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
                <NextLink href={`/companies/${companyId}/motor-insurance/matrix`} passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Matrix</Typography>
                  </Link>
                </NextLink>
              </Box>

              {matrixDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Matrix Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        <NextLink
                          href={`/companies/${companyId}/motor-insurance/matrix/${matrixDetail?._id}/editMatrix`}
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
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Show matrix details */}
                  <MatrixSummary matrixDetail={matrixDetail} />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

MatrixDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MatrixDetails;
