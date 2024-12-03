import { Box, Container, Link, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import EditContractorPlantMachineryDetailForm from "src/sections/commercial/contractor-plant-machinery/contractor-plant-machinery-edit-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getcontractorPlantMachineryDetailById } from "src/sections/commercial/contractor-plant-machinery/Action/contractorPlantMachineryAction";

const EditContractorPlantMachinery = () => {
  const router = useRouter();
  const { commercialId } = router.query;

  const dispatch = useDispatch();

  const commercialFilter = useRef(false);

  // Get contractor plant machinery detail API
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (commercialFilter.current) {
      return;
    }
    commercialFilter.current = true;

    try {
      dispatch(getcontractorPlantMachineryDetailById(commercialId))
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
              <NextLink href={`/contractor-plant-machinery/${commercialId}`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Contractor Plant & Machinery</Typography>
                </Link>
              </NextLink>
            </Box>

            <Typography mt={2} variant="h4">
              Edit Contractor Plant & Machinery
            </Typography>

            <Box mt={3}>
              <EditContractorPlantMachineryDetailForm />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

EditContractorPlantMachinery.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EditContractorPlantMachinery;
