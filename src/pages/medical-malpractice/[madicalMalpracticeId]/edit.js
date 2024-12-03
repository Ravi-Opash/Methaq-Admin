import { Box, Container, Link, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import EditMedicalMalpracticeDetailForm from "src/sections/commercial/medical-malpractice/medical-malpractice-edit-form";
import { useDispatch } from "react-redux";
import { getMedicalMalPracticeDetailById } from "src/sections/commercial/medical-malpractice/Action/medicalmalepracticeAction";

const EditContractorPlantMachinery = () => {
  const router = useRouter();
  const { madicalMalpracticeId } = router.query;

  const dispatch = useDispatch();

  const commercialFilter = useRef(false);

  // get Medical malpractice details for default value from API
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (commercialFilter.current) {
      return;
    }
    commercialFilter.current = true;

    try {
      dispatch(getMedicalMalPracticeDetailById(madicalMalpracticeId))
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
    if (madicalMalpracticeId) {
      getCommercialyDetailsHandler();
    }
  }, [madicalMalpracticeId]);
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
              <NextLink
                href={`/medical-malpractice/${madicalMalpracticeId}`}
                passHref
              >
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    Medical Malpractice
                  </Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Medical Malpractice
            </Typography>

            <Box mt={3}>
              {/* Edit form component */}
              <EditMedicalMalpracticeDetailForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditContractorPlantMachinery.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default EditContractorPlantMachinery;
