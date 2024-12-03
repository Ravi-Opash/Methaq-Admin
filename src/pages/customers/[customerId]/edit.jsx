import { Avatar, Box, Chip, Container, Grid, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getCustomerDetailsById } from "src/sections/customer/action/customerAction";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import CustomerEditForm from "src/sections/customer/customer-edit-form";
import { toast } from "react-toastify";

const CustomerEdit = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { customerId } = router.query;
  const { customerDetails } = useSelector((state) => state.customer);

  const initialized = useRef(false);

  // Get Customer details API
  const getCustomerDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getCustomerDetailsById(customerId))
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
    getCustomerDetailsHandler();
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
          {customerDetails !== null ? (
            <>
              <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
                <Box
                  sx={{
                    display: "inline-block",
                  }}
                >
                  <NextLink href="/customers" passHref>
                    <Link
                      color="textPrimary"
                      component="a"
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">Customers</Typography>
                    </Link>
                  </NextLink>
                </Box>
              </Box>

              <Grid container justifyContent="space-between" spacing={3}>
                <Grid
                  item
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  <Avatar
                    src="/assets/avatars/avatar-anika-visser.png"
                    sx={{
                      height: 64,
                      mr: 2,
                      width: 64,
                    }}
                  >
                    {customerDetails?.data?.fullName}
                  </Avatar>

                  <div>
                    <Typography
                      variant="h5"
                      sx={{
                        marginBottom: "10px",
                      }}
                    >
                      {customerDetails?.data?.email}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">user_id:</Typography>
                      <Chip
                        label={
                          customerDetails?.data?.customer?.customerId
                            ? customerDetails?.data?.customer?.customerId
                            : "-"
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </div>
                </Grid>
              </Grid>
              <Box mt={3}>
                <CustomerEditForm />
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

CustomerEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CustomerEdit;
