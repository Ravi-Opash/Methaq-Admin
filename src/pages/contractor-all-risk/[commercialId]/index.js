import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import {
  Button,
  Card,
  Divider,
  Grid,
  List,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Scrollbar } from "src/components/scrollbar";
import { format, parseISO } from "date-fns";
import {
  getCommercialDetailById,
} from "src/sections/commercial/contractor-all-risk/Action/commercialAction";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { EditIcon } from "src/Icons/EditIcon";
import ShareIcon from "@mui/icons-material/Share";
import ModalComp from "src/components/modalComp";
import ShareCommercialPDFModal from "src/sections/commercial/share-commercial-pdf-modal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { moduleAccess } from "src/utils/module-access";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const CommercialDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { commercialId } = router.query;
  const { contractorAllRiskDetail, loading } = useSelector((state) => state.contractorAllRisk);

  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);

  const contractorAllRisksListFilter = useRef(false);

  // Download PDF from url
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", contractorAllRiskDetail.commercialPdf.filename);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Get Contractor all risk detail API
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (contractorAllRisksListFilter.current) {
      return;
    }
    contractorAllRisksListFilter.current = true;

    try {
      dispatch(getCommercialDetailById(commercialId))
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
    if (commercialId) {
      getCommercialyDetailsHandler();
    }
  }, [commercialId]);
  const { loginUserData: user } = useSelector((state) => state.auth);

  // To call API when needed
  const fetchProposalSummary = () => {
    contractorAllRisksListFilter.current = false;
    getCommercialyDetailsHandler();
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            alignItems: "center",
          }}
        >
          <AnimationLoader open={loading} />
          </Box>
      ) : (
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
                onClick={() => router.push("/contractor-all-risk")}
                sx={{
                  display: "inline-block",
                  alignItems: "center",
                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  <u>Back</u>
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1} mb={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Typography variant="h4">Commercial details</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "start", md: "center" },
                    alignItems: "cener",
                    gap: 1,
                  }}
                >
                  {moduleAccess(user, "commercial.update") && (
                    <>
                      <Tooltip title="Edit Commercial">
                        <Button
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            alignItems: "center",
                            color: "#FFF",
                            backgroundColor: "#60176F",
                            "&:hover": {
                              backgroundColor: "#60176F",
                              opacity: 0.8,
                            },
                          }}
                          onClick={() => {
                            router?.push(`/contractor-all-risk/${commercialId}/edit`);
                          }}
                        >
                          <EditIcon sx={{ fontSize: "25px" }} />
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip title="Share PDF">
                    <Button
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        alignItems: "center",
                        color: "#FFF",
                        backgroundColor: "#60176F",
                        "&:hover": {
                          backgroundColor: "#60176F",
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => {
                        setSharePDFModal(true);
                      }}
                    >
                      <ShareIcon sx={{ fontSize: "25px" }} />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Download PDF">
                    <Button
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        alignItems: "center",
                        color: "#FFF",
                        backgroundColor: "#60176F",
                        "&:hover": {
                          backgroundColor: "#60176F",
                          opacity: 0.8,
                        },
                      }}
                      onClick={() =>
                        downloadPdf(process.env.NEXT_PUBLIC_BASE_URL + contractorAllRiskDetail.commercialPdf.link)
                      }
                    >
                      <span>Download PDF</span>
                      <DownloadSvg sx={{ mt: 0.5 }} />
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Stack>

            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  {contractorAllRiskDetail && (
                    <ProposalStatusSession
                      proposalId={commercialId}
                      items={contractorAllRiskDetail?.proposalId}
                      fetchProposalSummary={fetchProposalSummary}
                      flag={"Commercials"}
                      url={"contractorallrisk"}
                    />
                  )}
                </Box>
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
                    Proposal Details
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={10}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Commercial No."} value={contractorAllRiskDetail?.commercialNumber} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Contractor Name"}
                              value={contractorAllRiskDetail?.contractorName}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Assured Type"} value={contractorAllRiskDetail?.assuredType} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Trade License No "} value={contractorAllRiskDetail?.tradeLicenseNo} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Consultant Name"}
                              value={contractorAllRiskDetail?.consultantName}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Sub Contractor Names"}
                              value={contractorAllRiskDetail?.subContractorName}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Proposer's Business Address"}
                              value={contractorAllRiskDetail?.businessAddress}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Proposer's Emirates "} value={contractorAllRiskDetail?.emirates} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Office Tel No"} value={contractorAllRiskDetail?.telephoneNo} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Email ID"} value={contractorAllRiskDetail?.email} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Mobile"} value={contractorAllRiskDetail?.mobileNumber} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Business Activity"}
                              value={contractorAllRiskDetail?.businessActivity}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Law / Jurisdiction - UAE"} value={contractorAllRiskDetail?.law} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Territorial Limit"}
                              value={contractorAllRiskDetail?.territorialLimit}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Scope of work"} value={contractorAllRiskDetail?.scopeOfWork} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Proposer's Remarks"} value={contractorAllRiskDetail?.remarks} />
                          </Grid>
                        </Grid>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
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
                    Policy Period
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={10}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy Start Date"}
                              value={
                                contractorAllRiskDetail?.policyFrom
                                  ? format(parseISO(contractorAllRiskDetail?.policyFrom), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy End Date"}
                              value={
                                contractorAllRiskDetail?.policyTo
                                  ? format(parseISO(contractorAllRiskDetail?.policyTo), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Total Days"} value={contractorAllRiskDetail?.policyDays} />
                          </Grid>
                        </Grid>
                        <Divider />
                      </List>
                    </Grid>
                  </Grid>
                </Box>

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
                    Maintenance Period
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={10}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy Start Date"}
                              value={
                                contractorAllRiskDetail?.maintenanceFrom
                                  ? format(parseISO(contractorAllRiskDetail?.maintenanceFrom), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy End Date"}
                              value={
                                contractorAllRiskDetail?.maintenanceTo
                                  ? format(parseISO(contractorAllRiskDetail?.maintenanceTo), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Total Days"} value={contractorAllRiskDetail?.maintenanceDays} />
                          </Grid>
                        </Grid>
                        <Divider />
                      </List>
                    </Grid>
                  </Grid>
                </Box>

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
                    Project Information
                  </Typography>

                  <Box sx={{ p: 2 }}>
                    <Grid container columnSpacing={4} mb={1}>
                      <Grid item xs={12} md={2}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          Project Title
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={10}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.projectTitle || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4} mb={1}>
                      <Grid item xs={12} md={2}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          Project Description
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={10}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.projectDescription || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4} mt={1}>
                      <Grid item xs={12} md={2}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          Project Location
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={10}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.projectLocation || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

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
                    Sum Insured / Limit
                  </Typography>

                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        py: 1.5,
                        width: "100%",
                        fontWeight: "600",
                        fontSize: "18px",
                      }}
                    >
                      Section I – Material Damage:
                    </Typography>
                    <Grid container columnSpacing={4} mb={1} mt={2}>
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          {`1/. Estimated Contract Value (${contractorAllRiskDetail?.sumInsuredCurrency})`}
                        </Typography>
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.estimatedContractValue || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4} mt={1}>
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          {`2/. Principals Existing / Surrounding Property (${contractorAllRiskDetail?.sumInsuredCurrency})`}
                        </Typography>
                        <DividerCustom />
                      </Grid>
                      <Divider />
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.principalsExistingProperty || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4} mt={1}>
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          {`3/. Contractors Plant / Equipment & Machinery (${contractorAllRiskDetail?.sumInsuredCurrency})`}
                        </Typography>
                        <DividerCustom />
                      </Grid>
                      <Divider />
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.contractorsPlantMachinery || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4} mt={1}>
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          {`4/. Temporary Site Facilities (${contractorAllRiskDetail?.sumInsuredCurrency})`}
                        </Typography>
                        <DividerCustom />
                      </Grid>
                      <Divider />
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.temporarySiteFacilities || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4} mt={1}>
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          {`5/. Removal of Debris (${contractorAllRiskDetail?.sumInsuredCurrency})`}
                        </Typography>
                        <DividerCustom />
                      </Grid>
                      <Divider />
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.removalOfDebris || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container columnSpacing={4} mt={1}>
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "700",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          {`Total Sum Insured (${contractorAllRiskDetail?.sumInsuredCurrency})`}
                        </Typography>
                        <DividerCustom />
                      </Grid>
                      <Divider />
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.totalSumInsured || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        py: 1.5,
                        width: "100%",
                        fontWeight: "600",
                        fontSize: "18px",
                      }}
                    >
                      Section I – Material Damage:
                    </Typography>
                    <Grid container columnSpacing={4} mb={1} mt={2}>
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          {`Limit of Indemnity (any one occurrence ${contractorAllRiskDetail?.sumInsuredCurrency})`}
                        </Typography>
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.limitOfIndemnity || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container columnSpacing={4} mb={1} mt={2}>
                      <Grid item xs={12} md={8}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            mb: 1,
                            fontWeight: "500",
                            fontSize: "16px",
                            display: "inline-block",
                          }}
                        >
                          {`Limit of Indemnity in the aggregate (${contractorAllRiskDetail?.sumInsuredCurrency})`}
                        </Typography>
                        <DividerCustom />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            color: "#707070",
                            textAlign: "left",
                          }}
                        >
                          {contractorAllRiskDetail?.limitOfIndemnityAggregate || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

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
                    Declarations
                  </Typography>

                  <Card>
                    <Scrollbar>
                      <Box sx={{ minWidth: 800 }}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Is the project Mid-way?</TableCell>
                              <TableCell>{contractorAllRiskDetail?.projectMidwayYN === true ? "Yes" : "No"}</TableCell>
                              <TableCell>{contractorAllRiskDetail?.projectMidway}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Is the project Offshore?</TableCell>
                              <TableCell>
                                {contractorAllRiskDetail?.projectOffshoreYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorAllRiskDetail?.projectOffshore}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Are wet works involved?</TableCell>
                              <TableCell>
                                {contractorAllRiskDetail?.wetWorksInvolvedYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorAllRiskDetail?.wetWorksInvolved}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Did the project start more than 2 months earlier?</TableCell>
                              <TableCell>
                                {contractorAllRiskDetail?.projectStartedTwoMonthsEarlierYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorAllRiskDetail?.projectStartedTwoMonthsEarlier}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Is the project going to start after more than 2 months?</TableCell>
                              <TableCell>
                                {contractorAllRiskDetail?.projectStartAfterTwoMonthYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorAllRiskDetail?.projectStartAfterTwoMonth}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Scrollbar>
                  </Card>
                </Box>

                {contractorAllRiskDetail?.tradeLicense && (
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
                      Trade License / Contract Copy
                    </Typography>

                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: "500",
                          fontSize: "16px",
                          display: "inline-block",
                          m: 0,
                        }}
                      >
                        Trade License / Contract Copy
                      </Typography>
                      <Tooltip title="View Trade License / Contract Copy File">
                        <VisibilityIcon
                          sx={{
                            fontSize: "25px",
                            color: "#60176F",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            downloadPdf(
                              process.env.NEXT_PUBLIC_BASE_URL + "/" + contractorAllRiskDetail.tradeLicense.path
                            );
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Container>
          <ModalComp open={sharePDFModal} handleClose={handleClosePDFShareModal} widths={{ xs: "95%", sm: "500px" }}>
            <ShareCommercialPDFModal
              pdfLink={process.env.NEXT_PUBLIC_BASE_URL + contractorAllRiskDetail?.commercialPdf?.link}
              handleClose={handleClosePDFShareModal}
              info={contractorAllRiskDetail}
              commercialName={"contractor-all-risk"}
            />
          </ModalComp>
        </Box>
      )}
    </>
  );
};
CommercialDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CommercialDetails;
