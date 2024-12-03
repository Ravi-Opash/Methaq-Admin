import React, { useEffect, useRef } from "react";
import NextLink from "next/link";
import { Box, Container, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import PrividerEditForm from "src/sections/health-insurance/Providers/health-provider-edit-form";
import { getHealthProviderDetailById } from "src/sections/health-insurance/Providers/Action/healthProviderAction";

const ProviderEdit = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { providerId } = router.query;

  const initialized = useRef(false);
  const getHealthProviderDetailsHandler = async () => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getHealthProviderDetailById(providerId))
        .unwrap()
        .then((res) => {
          console.log("res", res);
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
    getHealthProviderDetailsHandler();
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
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <NextLink href={`/health-insurance/providers`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Provider Details</Typography>
                </Link>
              </NextLink>
            </Box>
          </Box>

          <Box mt={3}>
            <PrividerEditForm />
          </Box>
        </Container>
      </Box>
    </>
  );
};

ProviderEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProviderEdit;
