import React, { useRef, useEffect } from "react";
import { Box, Container, Divider, Grid, Link, List, Typography, styled } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import AnimationLoader from "src/components/amimated-loader";
import { getPraktoraPolicyDetailById } from "src/sections/PraktoraPolicies/action/praktoraPoliciesAction";
import ListItemComp from "src/components/ListItemComp";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const PolicyDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { praktorapolicyid } = router.query;

  const { allPraktoraPolicyDetailsById, allPraktoraPolicyDetailsByIdLoader } = useSelector(
    (state) => state.PraktoraPolicies
  );
  const initializedPolicy = useRef(false);

  // Customer Policy Details
  const getCustomerPolicyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedPolicy.current) {
      return;
    }
    initializedPolicy.current = true;
    try {
      dispatch(getPraktoraPolicyDetailById(praktorapolicyid));
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  // Get Customer Policy Details
  useEffect(() => {
    getCustomerPolicyDetailsHandler();
  }, [praktorapolicyid]);

  return (
    <>
      {allPraktoraPolicyDetailsByIdLoader && (
        <>
          <AnimationLoader open={true} />
        </>
      )}

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
                cursor: "pointer",
              }}
            >
              <Box onClick={() => router.back()}>
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
            </Box>
          </Box>

          <Box sx={{ display: "inline-block", width: "100%" }} id="policy_details_capture">
            <Box
              sx={{
                display: "inline-block",
                width: "100%",
                borderRadius: "10px",
                mb: 3,
                boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  py: 1.5,
                  width: "100%",
                  backgroundColor: "#f5f5f5",
                  fontWeight: "600",
                  fontSize: "18px",
                  display: "inline-block",
                  color: "#60176F",
                  px: "14px",
                  borderRadius: "10px 10px 0 0",
                }}
              >
                Praktora Policies Details
              </Typography>
              <Grid container columnSpacing={8}>
                <Grid item xs={12} sm={12}>
                  <List sx={{ py: 0 }}>
                    <Grid container>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"AGCODE"} value={allPraktoraPolicyDetailsById?.AGCODE} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"BCBASMAFEE"} value={allPraktoraPolicyDetailsById?.BCBASMAFEE} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"BCBASMAFEE"} value={allPraktoraPolicyDetailsById?.BILLID} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"BILLINGMODE"} value={allPraktoraPolicyDetailsById?.BILLINGMODE} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"BRKTAXINVOICENO"} value={allPraktoraPolicyDetailsById?.BRKTAXINVOICENO} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"BRPOLICYNO"} value={allPraktoraPolicyDetailsById?.BRPOLICYNO} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"BUSINESSTYPE"} value={allPraktoraPolicyDetailsById?.BUSINESSTYPE} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"CENTERID"} value={allPraktoraPolicyDetailsById?.CENTERID} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"COMPANYID"} value={allPraktoraPolicyDetailsById?.COMPANYID} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp
                          label={"CREATEDATE"}
                          value={
                            allPraktoraPolicyDetailsById?.CREATEDATE
                              ? format(parseISO(allPraktoraPolicyDetailsById?.CREATEDATE), "dd/MM/yyyy")
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"CREATEUSER"} value={allPraktoraPolicyDetailsById?.CREATEUSER} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"CSCODE"} value={allPraktoraPolicyDetailsById?.CSCODE} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"CSGROUP"} value={allPraktoraPolicyDetailsById?.CSGROUP} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6} columnSpacing={4}>
                        <ListItemComp label={"CURRENCY"} value={allPraktoraPolicyDetailsById?.CURRENCY} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"CUSTOMERNAME"} value={allPraktoraPolicyDetailsById?.CUSTOMERNAME} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"CUSTOMERPRIMARY"} value={allPraktoraPolicyDetailsById?.CUSTOMERPRIMARY} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"CUSTOMERTYPE"} value={allPraktoraPolicyDetailsById?.CUSTOMERTYPE} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"DISCOUNT"} value={allPraktoraPolicyDetailsById?.DISCOUNT} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"EMAIL"} value={allPraktoraPolicyDetailsById?.EMAIL} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"EXPIRYDATE"}
                          value={
                            allPraktoraPolicyDetailsById?.EXPIRYDATE
                              ? format(parseISO(allPraktoraPolicyDetailsById?.EXPIRYDATE), "dd/MM/yyyy")
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"FCPREMIUM"} value={allPraktoraPolicyDetailsById?.FCPREMIUM} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"GOVFEE"} value={allPraktoraPolicyDetailsById?.GOVFEE} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"INSCODE"} value={allPraktoraPolicyDetailsById?.INSCODE} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"INSCOMMVAT"} value={allPraktoraPolicyDetailsById?.INSCOMMVAT} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"INSNAME"} value={allPraktoraPolicyDetailsById?.INSNAME} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"INSTAXINVOICE"} value={allPraktoraPolicyDetailsById?.INSTAXINVOICE} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"INSTOTALCOMMAMOUNT"}
                          value={allPraktoraPolicyDetailsById?.INSTOTALCOMMAMOUNT}
                        />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"INSURED"} value={allPraktoraPolicyDetailsById?.INSURED} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"MIC"} value={allPraktoraPolicyDetailsById?.MIC} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"NARRATION"} value={allPraktoraPolicyDetailsById?.NARRATION} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"POLICYSUBGROUP"} value={allPraktoraPolicyDetailsById?.POLICYSUBGROUP} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"POLICYCLASS"} value={allPraktoraPolicyDetailsById?.POLICYCLASS} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"POLICYDATE"}
                          value={
                            allPraktoraPolicyDetailsById?.POLICYDATE
                              ? format(parseISO(allPraktoraPolicyDetailsById?.POLICYDATE), "dd/MM/yyyy")
                              : ""
                          }
                        />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"POLICYFEE"} value={allPraktoraPolicyDetailsById?.POLICYFEE} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"POLICYGROUP"} value={allPraktoraPolicyDetailsById?.POLICYGROUP} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"POLICYNO"} value={allPraktoraPolicyDetailsById?.POLICYNO} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"POLICYTYPE"} value={allPraktoraPolicyDetailsById?.POLICYTYPE} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"POLICYTYPEID"} value={allPraktoraPolicyDetailsById?.POLICYTYPEID} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"PRIMARYAGENT"} value={allPraktoraPolicyDetailsById?.PRIMARYAGENT} />
                        <DividerCustom />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"PRODUCTNAME"} value={allPraktoraPolicyDetailsById?.PRODUCTNAME} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"Renewal"} value={allPraktoraPolicyDetailsById?.Renewal} />
                        <DividerCustom />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"SLCATEGORY"} value={allPraktoraPolicyDetailsById?.SLCATEGORY} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"SORTDT"}
                          value={
                            allPraktoraPolicyDetailsById?.SORTDT
                              ? format(parseISO(allPraktoraPolicyDetailsById?.SORTDT), "dd/MM/yyyy")
                              : ""
                          }
                        />
                        <DividerCustom />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"STARTDATE"}
                          value={
                            allPraktoraPolicyDetailsById?.STARTDATE
                              ? format(parseISO(allPraktoraPolicyDetailsById?.STARTDATE), "dd/MM/yyyy")
                              : ""
                          }
                        />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"SYSPOLICYNO"} value={allPraktoraPolicyDetailsById?.SYSPOLICYNO} />
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"SYSVNO"} value={allPraktoraPolicyDetailsById?.SYSVNO} />
                      </Grid>{" "}
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"TAXVDATE"}
                          value={
                            allPraktoraPolicyDetailsById?.TAXVDATE
                              ? format(parseISO(allPraktoraPolicyDetailsById?.TAXVDATE), "dd/MM/yyyy")
                              : ""
                          }
                        />
                        <DividerCustom />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"TAXVNO"} value={allPraktoraPolicyDetailsById?.TAXVNO} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"TELEPHONE1"} value={allPraktoraPolicyDetailsById?.TELEPHONE1} />
                        <DividerCustom />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"TOTPREMIUMINCLUDINGVAT"}
                          value={allPraktoraPolicyDetailsById?.TOTPREMIUMINCLUDINGVAT}
                        />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"VAT"} value={allPraktoraPolicyDetailsById?.VAT} />
                        <DividerCustom />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"VATRATE"} value={allPraktoraPolicyDetailsById?.VATRATE} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"VCREATEDATE"}
                          value={
                            allPraktoraPolicyDetailsById?.VCREATEDATE
                              ? format(parseISO(allPraktoraPolicyDetailsById?.VCREATEDATE), "dd/MM/yyyy")
                              : ""
                          }
                        />
                        <DividerCustom />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          label={"VDATE"}
                          value={
                            allPraktoraPolicyDetailsById?.VDATE
                              ? format(parseISO(allPraktoraPolicyDetailsById?.VDATE), "dd/MM/yyyy")
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"VITYPE"} value={allPraktoraPolicyDetailsById?.VITYPE} />
                        <DividerCustom />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"VNO"} value={allPraktoraPolicyDetailsById?.VNO} />
                      </Grid>
                      <Grid item xs={12} columnSpacing={4}>
                        <Divider />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ListItemComp label={"VTYPE"} value={allPraktoraPolicyDetailsById?.VTYPE} />
                        <DividerCustom />
                      </Grid>
                    </Grid>
                  </List>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

PolicyDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PolicyDetails;
