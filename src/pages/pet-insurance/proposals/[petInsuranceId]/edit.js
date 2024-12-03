import { Box, Container, Link, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import EditMedicalMalpracticeDetailForm from "src/sections/commercial/medical-malpractice/medical-malpractice-edit-form";
import { useDispatch, useSelector } from "react-redux";
import { getMedicalMalPracticeDetailById } from "src/sections/commercial/medical-malpractice/Action/medicalmalepracticeAction";
import { getPetDetailsById } from "src/sections/pet-insurance/Action/petInsuranceAction";
import EditPetInsuranceDetailForm from "src/sections/pet-insurance/pet-insurance-edit-form";

const EditPetInsurance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { petInsuranceId } = router?.query;
  const { petDetails } = useSelector((state) => state.petInsurance);

  const petInsuranceListFilter = useRef(false);

  const getPetInsuranceDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (petInsuranceListFilter.current) {
      return;
    }
    petInsuranceListFilter.current = true;

    try {
      dispatch(getPetDetailsById(petInsuranceId))
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

  useEffect(() => {
    if (petInsuranceId) {
      getPetInsuranceDetailsHandler();
    }
  }, [petInsuranceId]);

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
              <NextLink href={`/pet-insurance/proposals/${petInsuranceId}`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Pet Insurance</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Pet Insurance
            </Typography>

            <Box mt={3}>
              {" "}
              <EditPetInsuranceDetailForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditPetInsurance.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default EditPetInsurance;
