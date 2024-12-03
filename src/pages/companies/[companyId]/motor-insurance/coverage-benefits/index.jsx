import React, { useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import CoverageTable from "src/sections/companies/coverage-benefits/coverage-table";
import BenefitsTable from "src/sections/companies/coverage-benefits/benefits-table";
import {
  getBenefitsList,
  getBenefitsValueById,
  getCoverageList,
  getCoverageValueById,
} from "src/sections/companies/action/companyAcrion";

const CoverageBenefits = () => {
  const dispatch = useDispatch();
  const { benefitsList, benefitsValues, coveragesValues, coveragesList } = useSelector(
    (state) => state.company
  );
  const router = useRouter();
  const { companyId } = router.query;
  const benefitsAndCoverage = useRef(false);

  useEffect(() => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (benefitsAndCoverage.current) {
      return;
    }
    benefitsAndCoverage.current = true;

    // Coverage APIs
    dispatch(getCoverageList())
      .unwrap()
      .then((res) => {
      })
      .catch((err) => {
        console.log(err, "err");
      });
    dispatch(getCoverageValueById({ companyId }))
      .unwrap()
      .then((res) => {
      })
      .catch((err) => {
        console.log(err, "err");
      });

    // Benifits APIs
    dispatch(getBenefitsList())
      .unwrap()
      .then((res) => {
      })
      .catch((err) => {
        console.log(err, "err");
      });
    dispatch(getBenefitsValueById({ companyId }))
      .unwrap()
      .then((res) => {
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  return (
    <>
      <Box sx={{ p: 3 }}>
        {" "}
        <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
          <Box>
            <Box onClick={() => router.back()} sx={{ cursor: "pointer", mb: 4 }}>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Back</Typography>
              </Link>
            </Box>

            <Stack spacing={1} mb={3} sx={{ mb: 5 }}>
              <Typography variant="h4">Company Coverage and Benefits</Typography>
            </Stack>

            <Box sx={{ width: "100%", mb: 10 }}>
              <Grid spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    List of Coverage / Motor
                  </Typography>
                  <Box sx={{ borderBottom: "1px solid #707070", width: "inherit" }}></Box>
                </Box>
              </Grid>
              <Grid>
                {/* Coverage table */}
                <CoverageTable items={coveragesList} coveragesValues={coveragesValues} />
              </Grid>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Grid spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                    List of Benefits / Motor
                  </Typography>
                  <Box sx={{ borderBottom: "1px solid #707070", width: "inherit" }}></Box>
                </Box>
              </Grid>
              <Grid>
                {/* Benifits table */}
                <BenefitsTable items={benefitsList} benefitsValues={benefitsValues} />
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

CoverageBenefits.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CoverageBenefits;
