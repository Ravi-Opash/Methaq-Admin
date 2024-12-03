import React, { useRef, useEffect } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getConditionsByConditionsId } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ConditionsSummary from "src/sections/companies/conditions/conditions.summary";
import { toast } from "react-toastify";

const ConditionDetails = () => {
  const dispatch = useDispatch();
  const { conditionsDetail, conditionsDetailLoader } = useSelector((state) => state.company);
  const router = useRouter();
  const { conditionId, companyId } = router.query;
  const initialized = useRef(false);

  // get condition details API
  const getConditionsDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getConditionsByConditionsId(conditionId))
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
    getConditionsDetailsHandler();
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
          {conditionsDetailLoader ? (
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
                <NextLink href={`/companies/${companyId}/motor-insurance/conditions`} passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Condition</Typography>
                  </Link>
                </NextLink>
              </Box>

              {conditionsDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Condition Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        <NextLink
                          href={`/companies/${companyId}/motor-insurance/conditions/${conditionsDetail?._id}/edit`}
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

                  <ConditionsSummary conditionsDetail={conditionsDetail} />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

ConditionDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ConditionDetails;
