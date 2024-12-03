import { Box, Container, Link, Typography } from "@mui/material";
import Head from "next/head";
import React, { useRef, useEffect } from "react";
import NextLink from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import PartnerEditForm from "src/sections/partners/company-partner-edit-form";
import { getPartnerDetailsById } from "src/sections/partners/action/partnerAction";

const PartnerEdit = () => {
  const dispatch = useDispatch();
  const { partnerDetail } = useSelector((state) => state.partners);
  const router = useRouter();
  const { partnerId } = router.query;

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

  // Get partner details
  useEffect(() => {
    getPartnerDetailsHandler();
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
          {partnerDetail ? (
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

              <Typography mt={2} variant="h4">
                Edit partner
              </Typography>

              <Box mt={3}>
                <PartnerEditForm />
              </Box>
            </Box>
          ) : (
            <div>Loading...</div>
          )}
        </Container>
      </Box>
    </>
  );
};

PartnerEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PartnerEdit;
