import { Box, Container, Link, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSmallBusinessEnterpriseById } from "src/sections/commercial/small-medium-enterrise/Action/smallMediumEnterpriseAction";
import EditSmallMediumEnterpriseDetailForm from "src/sections/commercial/small-medium-enterrise/small-medium-enterprise-edit-form";

const EditSmallMediumEnterprise = () => {
  const router = useRouter();
  const { smallMediumId } = router.query;

  const dispatch = useDispatch();

  const commercialFilter = useRef(false);

  // Function to get company details
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    // console.log("sss");
    if (commercialFilter.current) {
      return;
    }
    commercialFilter.current = true;

    try {
      dispatch(getSmallBusinessEnterpriseById(smallMediumId))
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

  // useEffect to get commercial details
  useEffect(() => {
    if (smallMediumId) {
      getCommercialyDetailsHandler();
    }
  }, [smallMediumId]);

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
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <NextLink href={`/small-medium-enterprise/${smallMediumId}`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Small & Medium Enterprise</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Small & Medium Enterprise
            </Typography>

            <Box mt={3}>
              <EditSmallMediumEnterpriseDetailForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditSmallMediumEnterprise.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditSmallMediumEnterprise;
