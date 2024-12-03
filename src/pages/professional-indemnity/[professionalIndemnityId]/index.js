import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import {
  Button,
  Card,
  Divider,
  Grid,
  Link,
  List,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { EditIcon } from "src/Icons/EditIcon";
import ShareIcon from "@mui/icons-material/Share";
import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getProfessionIndemnityById } from "src/sections/commercial/professional-indemnity/Action/professionalIndemnityAction";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
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

const ProfessionalIndemnity = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { professionalIndemnityId } = router.query;
  const { loading, professionIndemnityDetails } = useSelector((state) => state.professionIndemnity);

  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);

  const professionIndemnityListFilter = useRef(false);

  // Helper function to download a PDF file from a URL
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", professionIndemnityDetails?.professionalIndemnityPdf?.filename);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Helper function to get commercial details
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (professionIndemnityListFilter.current) {
      return;
    }
    professionIndemnityListFilter.current = true;

    try {
      // Function for getting commercial details
      dispatch(getProfessionIndemnityById(professionalIndemnityId))
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

  // useEffect to get commercial details
  useEffect(() => {
    if (professionalIndemnityId) {
      getCommercialyDetailsHandler();
    }
  }, [professionalIndemnityId]);
  const { loginUserData: user } = useSelector((state) => state.auth);

  // Function to fetch proposal summary
  const fetchProposalSummary = () => {
    professionIndemnityListFilter.current = false;
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
                onClick={() => router.push("/professional-indemnity")}
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
                <Typography variant="h4">Professional Indemnity</Typography>
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
                            router?.push(`/professional-indemnity/${professionalIndemnityId}/edit`);
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
                        downloadPdf(
                          process.env.NEXT_PUBLIC_BASE_URL + professionIndemnityDetails?.professionalIndemnityPdf?.link
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
                {professionIndemnityDetails && (
                  <ProposalStatusSession
                    proposalId={professionalIndemnityId}
                    items={professionIndemnityDetails?.proposalId}
                    fetchProposalSummary={fetchProposalSummary}
                    flag={"Commercials"}
                    url={"professionalindemnity"}
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
                            <ListItemComp label={"Plan Type."} value={professionIndemnityDetails?.planType} />
                            <DividerCustom />
                          </Grid>
                          {professionIndemnityDetails?.planType === "Engineering Consultant" && (
                            <Grid item xs={12} md={6} columnSpacing={4}>
                              <ListItemComp
                                label={"Policy Sub Type."}
                                value={professionIndemnityDetails?.policySubType}
                              />
                              <DividerCustom />
                            </Grid>
                          )}
                        </Grid>

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Proposer's Full Name"} value={professionIndemnityDetails?.fullName} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Estimated Gross Fees (AED)"}
                              value={professionIndemnityDetails?.estimatedGrossFees}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Business Address"}
                              value={professionIndemnityDetails?.businessAddress}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Proposer's Emirates"} value={professionIndemnityDetails?.emirates} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Office Tel No (971XXXXXXXX)"}
                              value={professionIndemnityDetails?.telephoneNo}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Email ID"} value={professionIndemnityDetails?.email} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Mobile # * (971XXXXXXXXX)"}
                              value={professionIndemnityDetails?.mobileNumber}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Business Activity "}
                              value={professionIndemnityDetails?.businessActivity}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Law / Jurisdiction - UAE"} value={professionIndemnityDetails?.law} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Territorial Limit"}
                              value={professionIndemnityDetails?.territorialLimit}
                            />
                          </Grid>
                        </Grid>

                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Retroactive date"}
                              value={
                                professionIndemnityDetails?.retroactiveDate
                                  ? format(parseISO(professionIndemnityDetails?.retroactiveDate), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Proposer's Remarks"} value={professionIndemnityDetails?.remarks} />
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
                    Limit Of Liability
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={10}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Any one Occurrence"}
                              value={professionIndemnityDetails?.anyOneOccurrence}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"In the Aggregate"} value={professionIndemnityDetails?.inAggregate} />
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
                                professionIndemnityDetails?.policyFrom
                                  ? format(parseISO(professionIndemnityDetails?.policyFrom), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy End Date"}
                              value={
                                professionIndemnityDetails?.policyTo
                                  ? format(parseISO(professionIndemnityDetails?.policyTo), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Total Days"} value={professionIndemnityDetails?.policyDays} />
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
                    Declarations
                  </Typography>

                  <Card>
                    <Scrollbar>
                      <Box sx={{ minWidth: 800 }}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                Are you connected or associated (financially or otherwise) with any other practice,
                                company or organization?
                              </TableCell>
                              <TableCell>
                                {professionIndemnityDetails?.connectedWithOrgYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{professionIndemnityDetails?.connectedWithOrg}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Are you taking cover for all the employees in your firm?</TableCell>
                              <TableCell>
                                {professionIndemnityDetails?.takingCoverInFirmYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{professionIndemnityDetails?.takingCoverInFirm}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Has any Claim (s) been made against you in Past or Current?</TableCell>
                              <TableCell>{professionIndemnityDetails?.policyClaimYN === true ? "Yes" : "No"}</TableCell>
                              <TableCell>{professionIndemnityDetails?.policyClaim}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Was your application for this policy been declined any time in the past?
                              </TableCell>
                              <TableCell>
                                {professionIndemnityDetails?.policyDeclinedYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{professionIndemnityDetails?.policyDeclined}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Scrollbar>
                  </Card>
                </Box>
                {professionIndemnityDetails?.tradeLicense && (
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
                              process.env.NEXT_PUBLIC_BASE_URL + "/" + professionIndemnityDetails.tradeLicense.path
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
              pdfLink={process.env.NEXT_PUBLIC_BASE_URL + professionIndemnityDetails?.professionalIndemnityPdf?.link}
              handleClose={handleClosePDFShareModal}
              info={professionIndemnityDetails}
              commercialName={"professional"}
            />
          </ModalComp>
        </Box>
      )}
    </>
  );
};
ProfessionalIndemnity.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProfessionalIndemnity;
