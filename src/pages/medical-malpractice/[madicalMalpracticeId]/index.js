import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Link,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { EditIcon } from "src/Icons/EditIcon";
import ShareIcon from "@mui/icons-material/Share";
import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getMedicalMalPracticeDetailById } from "src/sections/commercial/medical-malpractice/Action/medicalmalepracticeAction";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import ModalComp from "src/components/modalComp";
import ShareCommercialPDFModal from "src/sections/commercial/share-commercial-pdf-modal";
import { moduleAccess } from "src/utils/module-access";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const MedicalMalpracticeDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { madicalMalpracticeId } = router.query;
  const { loading, medicalMalPracticeDetails } = useSelector((state) => state.medicalMalPractice);
  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);

  const medicalMalPracticeListFilter = useRef(false);

  // Download file function
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", medicalMalPracticeDetails?.medicalMalpracticePdf?.filename);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // get Medical malpractice details
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (medicalMalPracticeListFilter.current) {
      return;
    }
    medicalMalPracticeListFilter.current = true;

    try {
      dispatch(getMedicalMalPracticeDetailById(madicalMalpracticeId))
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
    if (madicalMalpracticeId) {
      getCommercialyDetailsHandler();
    }
  }, [madicalMalpracticeId]);
  const { loginUserData: user } = useSelector((state) => state.auth);

  // Function to call detail API when ever require
  const fetchProposalSummary = () => {
    medicalMalPracticeListFilter.current = false;
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
                onClick={() => router.push("/medical-malpractice")}
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
                <Typography variant="h4">Medical Malpractice details</Typography>
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
                            router?.push(`/medical-malpractice/${madicalMalpracticeId}/edit`);
                          }}
                        >
                          <EditIcon sx={{ fontSize: "25px" }} />
                        </Button>
                      </Tooltip>
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
                    </>
                  )}
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
                        downloadPdf(
                          process.env.NEXT_PUBLIC_BASE_URL + medicalMalPracticeDetails?.medicalMalpracticePdf?.link
                        )
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
                {medicalMalPracticeDetails && (
                  <ProposalStatusSession
                    proposalId={madicalMalpracticeId}
                    items={medicalMalPracticeDetails?.proposalId}
                    fetchProposalSummary={fetchProposalSummary}
                    flag={"Commercials"}
                    url={"medicalmalpractice"}
                  />
                )}
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
                            <ListItemComp label={"Proposer's Full Name"} value={medicalMalPracticeDetails?.fullName} />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Policy Type."} value={medicalMalPracticeDetails?.policyType || "-"} />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Business Address"}
                              value={medicalMalPracticeDetails?.businessAddress}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Proposer's Emirates"} value={medicalMalPracticeDetails?.emirates} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Office Tel No"} value={medicalMalPracticeDetails?.telephoneNo} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Email ID"} value={medicalMalPracticeDetails?.email} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Mobile No"} value={medicalMalPracticeDetails?.mobileNumber} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Assured Type."} value={medicalMalPracticeDetails?.assuredType} />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Law / Jurisdiction - UAE"} value={medicalMalPracticeDetails?.law} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Territorial Limit"}
                              value={medicalMalPracticeDetails?.territorialLimit}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"No Of Staff"} value={medicalMalPracticeDetails?.noOfStaff} />
                            <DividerCustom />
                          </Grid>
                          {medicalMalPracticeDetails?.policyType === "Individual" && (
                            <Grid item xs={12} md={6}>
                              <ListItemComp
                                label={"Emirates ID"}
                                value={medicalMalPracticeDetails?.emiratesId || "-"}
                              />
                              <DividerCustom />
                            </Grid>
                          )}
                        </Grid>

                        <Divider />
                        {medicalMalPracticeDetails?.policyType === "Individual" && (
                          <Grid container>
                            <Grid item xs={12} md={6}>
                              <ListItemComp label={"Proposer's Remarks"} value={medicalMalPracticeDetails?.remarks} />
                              <DividerCustom />
                            </Grid>
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemComp
                                label={"Name Of Clinics."}
                                value={medicalMalPracticeDetails?.clinicsName || "-"}
                              />
                              <DividerCustom />
                            </Grid>
                          </Grid>
                        )}
                        <Divider />
                        {medicalMalPracticeDetails?.policyType === "Individual" && (
                          <>
                            <Grid container>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Emirates ID Expiry"}
                                  value={
                                    medicalMalPracticeDetails?.emiratesIdExpiryDate
                                      ? format(parseISO(medicalMalPracticeDetails?.emiratesIdExpiryDate), "dd/MM/yyyy")
                                      : "-"
                                  }
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"License Authority"}
                                  value={medicalMalPracticeDetails?.licenseAuthority}
                                />
                                <DividerCustom />
                              </Grid>
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Staff Speciality"}
                                  value={medicalMalPracticeDetails?.staffSpeciality || "-"}
                                />
                                <DividerCustom />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Staff License Code "}
                                  value={medicalMalPracticeDetails?.staffLicenseCode || "-"}
                                />
                                <DividerCustom />
                              </Grid>
                            </Grid>
                            <Grid container>
                              <Grid item xs={12} md={6}>
                                <ListItemComp
                                  label={"Retroactive date"}
                                  value={
                                    medicalMalPracticeDetails?.retroactiveDate
                                      ? format(parseISO(medicalMalPracticeDetails?.retroactiveDate), "dd/MM/yyyy")
                                      : "-"
                                  }
                                />
                                <DividerCustom />
                              </Grid>
                            </Grid>
                            <Grid container>
                              <Grid item xs={12}>
                                {medicalMalPracticeDetails?.emiratesIdFile && (
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      width: "100%",
                                      borderRadius: "10px",
                                    }}
                                  >
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
                                        Emirate Id File
                                      </Typography>
                                      <Tooltip title="download Emirates Id File">
                                        <VisibilityIcon
                                          sx={{
                                            fontSize: "25px",
                                            color: "#60176F",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            downloadPdf(
                                              process.env.NEXT_PUBLIC_BASE_URL +
                                                "/" +
                                                medicalMalPracticeDetails.emiratesIdFile.path
                                            );
                                          }}
                                        />
                                      </Tooltip>
                                    </Box>
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          </>
                        )}
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
                    Policy Limit
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={10}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Any one Claim(AED)"}
                              value={medicalMalPracticeDetails?.anyOneClaim || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"In the Aggregate(AED)"}
                              value={medicalMalPracticeDetails?.inAggregate || "-"}
                            />
                            <DividerCustom />
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
                                medicalMalPracticeDetails?.policyFrom
                                  ? format(parseISO(medicalMalPracticeDetails?.policyFrom), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy End Date"}
                              value={
                                medicalMalPracticeDetails?.policyTo
                                  ? format(parseISO(medicalMalPracticeDetails?.policyTo), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Total Days"} value={medicalMalPracticeDetails?.policyDays} />
                          </Grid>
                        </Grid>
                        <Divider />
                      </List>
                    </Grid>
                  </Grid>
                </Box>
                {medicalMalPracticeDetails?.policyType === "Individual" && (
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
                      Individual Insured Details
                    </Typography>
                    <Card>
                      <Scrollbar>
                        <Box sx={{ minWidth: 800 }}>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  At what medical school/University did the proposer graduated and when ?
                                </TableCell>
                                <TableCell>{medicalMalPracticeDetails?.schoolUniversityName || "-"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  Where and when has the proposer practiced his profession since graduation ?
                                </TableCell>
                                <TableCell>{medicalMalPracticeDetails?.practicePlaceTime || "-"}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Scrollbar>
                    </Card>
                  </Box>
                )}
                {medicalMalPracticeDetails?.policyType === "Clinics" && (
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
                      Clinics Insured Details
                    </Typography>
                    <Card>
                      <Scrollbar>
                        <Box sx={{ minWidth: 800 }}>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell>Establishment(s) is owned by</TableCell>
                                <TableCell>{medicalMalPracticeDetails?.establishmentOwnedBy || "-"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  How long had the Establishment(s) been operated by the present owners? If
                                  change,when&nbs?
                                </TableCell>
                                <TableCell>{medicalMalPracticeDetails?.operationTimeByOwneres || "-"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Number of patients per year</TableCell>
                                <TableCell>{medicalMalPracticeDetails?.patientsPerYear || "-"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>State the main procedures carried on the clinic</TableCell>
                                <TableCell>{medicalMalPracticeDetails?.mainProductOnClinic || "-"}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Scrollbar>
                    </Card>
                  </Box>
                )}
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
                              <TableCell>Is the proposer involved in any cosmetic/aesthetic procedures?</TableCell>
                              <TableCell>
                                {medicalMalPracticeDetails?.involvedInProceduresYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{medicalMalPracticeDetails?.involvedInProcedures}</TableCell>
                            </TableRow>
                            {medicalMalPracticeDetails?.policyType === "Clinics" && (
                              <TableRow>
                                <TableCell>
                                  Does the Proposer own or operate x-ray machine or laser? If so,please give number,type
                                  and whether they?
                                </TableCell>
                                <TableCell>
                                  {medicalMalPracticeDetails?.operateMachineYN === true ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>{medicalMalPracticeDetails?.operateMachine}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>Has a previous application been declined?</TableCell>
                              <TableCell>
                                {medicalMalPracticeDetails?.previousApplicationDeclinedYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{medicalMalPracticeDetails?.previousApplicationDeclined}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Has a previous insurer required increased premium or special restrictions?
                              </TableCell>
                              <TableCell>
                                {medicalMalPracticeDetails?.premiumOrRestrictionsYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{medicalMalPracticeDetails?.premiumOrRestrictions}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Has a previous insurance been terminated/not been renewed by insurer?
                              </TableCell>
                              <TableCell>
                                {medicalMalPracticeDetails?.previousInsuranceTerminatedYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{medicalMalPracticeDetails?.previousInsuranceTerminated}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Have any Claims or suits for malpractice been made against the proposer or any of the
                                partners,assistants,nurses or technicians during the past five years?
                              </TableCell>
                              <TableCell>
                                {medicalMalPracticeDetails?.lastFiveYearMalpracticeYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{medicalMalPracticeDetails?.lastFiveYearMalpractice}</TableCell>
                            </TableRow>
                            {medicalMalPracticeDetails?.policyType === "Clinics" && (
                              <TableRow>
                                <TableCell>State the main procedures carried on the clinic?</TableCell>
                                <TableCell>
                                  {medicalMalPracticeDetails?.proceduresOnClinicYN === true ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>{medicalMalPracticeDetails?.proceduresOnClinic}</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Scrollbar>
                  </Card>
                </Box>
                {medicalMalPracticeDetails?.medicalLicense && (
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
                      Medical License
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
                        Medical License
                      </Typography>
                      <Tooltip title="View Medical License File">
                        <VisibilityIcon
                          sx={{
                            fontSize: "25px",
                            color: "#60176F",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            downloadPdf(
                              process.env.NEXT_PUBLIC_BASE_URL + "/" + medicalMalPracticeDetails.medicalLicense.path
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
              pdfLink={process.env.NEXT_PUBLIC_BASE_URL + medicalMalPracticeDetails?.medicalMalpracticePdf?.link}
              handleClose={handleClosePDFShareModal}
              info={medicalMalPracticeDetails}
              commercialName={"medical"}
            />
          </ModalComp>
        </Box>
      )}
    </>
  );
};
MedicalMalpracticeDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MedicalMalpracticeDetails;
