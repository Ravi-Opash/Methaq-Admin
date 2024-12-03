import React, { useRef, useEffect } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import AdminSummary from "src/sections/sub-admins/admin-summary";
import { getAdminDetailById } from "src/sections/sub-admins/action/adminAcrion";
import AnimationLoader from "src/components/amimated-loader";

const AdminDetails = () => {
  const dispatch = useDispatch();
  const { adminDetailLoader, adminDetail } = useSelector((state) => state.admins);
  const router = useRouter();
  const { adminId } = router.query;

  // useEffect to initialize data on component mount
  const initialized = useRef(false);
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      //get admindetails api
      dispatch(getAdminDetailById(adminId))
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

  useEffect(
    () => {
      getCompanyDetailsHandler();
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
          {adminDetailLoader ? (
           <AnimationLoader open={true}/>
          ) : (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href="/sub-admins" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Admins</Typography>
                  </Link>
                </NextLink>
              </Box>

              {adminDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Admin Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        <NextLink href={`/sub-admins/${adminDetail?._id}/edit`} passHref>
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
                  <AdminSummary adminDetail={adminDetail} />
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

AdminDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AdminDetails;
