import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getExcessByExcessId } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import ExcessEditForm from "src/sections/companies/excess/excess-edit-form";

const ExcessEdit = () => {
  const dispatch = useDispatch();
  const { excessDetail } = useSelector((state) => state.company);
  const router = useRouter();
  const { excessId, companyId } = router.query;

  const initialized = useRef(false);

  // Get excess detials API
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
          {excessDetail ? (
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

              <Typography mt={2} variant="h4">
                Edit Excess
              </Typography>

              <Box mt={3}>
                {/* Excess Edit form component */}
                <ExcessEditForm />
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

ExcessEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ExcessEdit;
