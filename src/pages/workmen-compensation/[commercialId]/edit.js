import { Box, Container, Link, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import EditWorkmenCompensationDetailForm from "src/sections/commercial/workmen-compensation/workmen-compensation-edit-form";
import { useDispatch } from "react-redux";
import { getworkmenCompensationDetailById } from "src/sections/commercial/workmen-compensation/Action/workmenCompensationAction";

const WorkmenCompensation = () => {
  const router = useRouter();
  const { commercialId } = router.query;

  const dispatch = useDispatch();

  const commercialFilter = useRef(false);
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (commercialFilter.current) {
      return;
    }
    commercialFilter.current = true;

    try {
      //get workmens details Api
      dispatch(getworkmenCompensationDetailById(commercialId))
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
    if (commercialId) {
      getCommercialyDetailsHandler();
    }
  }, [commercialId]);

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
              <NextLink href={`/workmen-compensation/${commercialId}`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Workmen Compensation</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Workmen Compensation
            </Typography>

            <Box mt={3}>
              <EditWorkmenCompensationDetailForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

WorkmenCompensation.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WorkmenCompensation;
