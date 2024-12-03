import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyDetailById } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { Box, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import CompanyEditForm from "src/sections/companies/company-edit-form";
import AnimationLoader from "src/components/amimated-loader";

const CompanyEdit = () => {
  const dispatch = useDispatch();
  const { companyDetail } = useSelector((state) => state.company);
  const router = useRouter();
  const { companyId } = router.query;

  const initialized = useRef(false);
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getCompanyDetailById(companyId))
        .unwrap()
        .then((res) => {
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
          {companyDetail ? (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href="/companies" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Companies</Typography>
                  </Link>
                </NextLink>
              </Box>

              <Typography mt={2} variant="h4">
                Edit company
              </Typography>

              <Box mt={3}>
                {/* Company edit form component */}
                <CompanyEditForm />
              </Box>
            </Box>
          ) : (
            <AnimationLoader open={true} />
          )}
        </Container>
      </Box>
    </>
  );
};

CompanyEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CompanyEdit;
