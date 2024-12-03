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
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { getSmallBusinessEnterpriseById } from "src/sections/commercial/small-medium-enterrise/Action/smallMediumEnterpriseAction";
import { pascalCase } from "src/utils/pascalCase";
import { moduleAccess } from "src/utils/module-access";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import AnimationLoader from "src/components/amimated-loader";
import ModalComp from "src/components/modalComp";
import ShareCommercialPDFModal from "src/sections/commercial/share-commercial-pdf-modal";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const SmallMediumEnterpriseDetails = () => {
  const router = useRouter();
  const { smallMediumId } = router.query;

  const dispatch = useDispatch();
  const { smallMediumEnterpriseDetail, loading } = useSelector((state) => state.smallMediumEnterprise);

  // const { loading } = useSelector((state) => state.contractorAllRisk);

  // function to download pdf
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", smallMediumEnterpriseDetail?.smallMediumEnterprisePdf?.filename);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);

  const commercialFilter = useRef(false);

  // Function to get commercial details
  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    // console.log("sss");
    if (commercialFilter.current) {
      return;
    }
    commercialFilter.current = true;

    try {
      dispatch(getSmallBusinessEnterpriseById(smallMediumId))
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
    if (smallMediumId) {
      getCommercialyDetailsHandler();
    }
  }, [smallMediumId]);
  const { loginUserData: user } = useSelector((state) => state.auth);

  // Function to fetch proposal summary
  const fetchProposalSummary = () => {
    commercialFilter.current = false;
    getCommercialyDetailsHandler();
  };

  return (
    <>
      {!!loading ? (
        <AnimationLoader open={true} />
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
                onClick={() => router.push("/small-medium-enterprise")}
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
                <Typography variant="h4" sx={{ fontSize: { xs: "20px", sm: "30px" } }}>
                  Small & Medium Business Enterprise
                </Typography>
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
                            router?.push(`/small-medium-enterprise/${smallMediumId}/edit`);
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
                          process.env.NEXT_PUBLIC_BASE_URL + smallMediumEnterpriseDetail?.smallMediumEnterprisePdf?.link
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
                {smallMediumEnterpriseDetail && (
                  <ProposalStatusSession
                    proposalId={smallMediumId}
                    items={smallMediumEnterpriseDetail?.proposalId}
                    fetchProposalSummary={fetchProposalSummary}
                    flag={"Commercials"}
                    url={"smallmediumenterprise"}
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
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Full Name"}
                              value={smallMediumEnterpriseDetail?.fullName}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Business Address"}
                              value={smallMediumEnterpriseDetail?.businessAddress}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Proposer's Emirates"} value={smallMediumEnterpriseDetail?.emirates} />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Email ID"} value={smallMediumEnterpriseDetail?.email} />
                          </Grid>
                        </Grid>

                        <Divider />
                        {/* {console.log("testing", smallMediumEnterpriseDetail?.telephoneNo)} */}
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Office Tel No (971XXXXXXXX)"}
                              value={`971 ${smallMediumEnterpriseDetail?.telephoneNo}`}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Mobile # * (971XXXXXXXXX)"}
                              value={`971 ${smallMediumEnterpriseDetail?.mobileNumber}`}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Law / Jurisdiction - UAE"} value={smallMediumEnterpriseDetail?.law} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Territorial Limit"}
                              value={smallMediumEnterpriseDetail?.territorialLimit}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Proposer's Remarks"} value={smallMediumEnterpriseDetail?.remarks} />
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
                    Business Details
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Business Insured Name"}
                              value={smallMediumEnterpriseDetail?.businessInsuredName}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Nature of Business at Insured Premises"}
                              value={smallMediumEnterpriseDetail?.natureInsuredPremises}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Address of insured premises"}
                              value={smallMediumEnterpriseDetail?.addressInsuredPremises}
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Business Area"} value={smallMediumEnterpriseDetail?.businessArea} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Business Tel No (971 XXXXXXXX)"}
                              value={`971 ${smallMediumEnterpriseDetail?.teleNoBusiness}`}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Mobile # * (971XXXXXXXXX)"}
                              value={`971 ${smallMediumEnterpriseDetail?.businessMobileNumber}`}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Business Email ID"}
                              value={smallMediumEnterpriseDetail?.businessEmail || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Business City"}
                              value={smallMediumEnterpriseDetail?.businessCity || "-"}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Business Website"}
                              value={smallMediumEnterpriseDetail?.businessWebsite}
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
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy Start Date"}
                              value={
                                smallMediumEnterpriseDetail?.policyFrom
                                  ? format(parseISO(smallMediumEnterpriseDetail?.policyFrom), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy End Date"}
                              value={
                                smallMediumEnterpriseDetail?.policyTo
                                  ? format(parseISO(smallMediumEnterpriseDetail?.policyTo), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Total Days"} value={smallMediumEnterpriseDetail?.policyDays} />
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
                                Are you taking anyone or more from the given fire protection measures:(Sprinkler,
                                Extinguisher, Hose Reel, Alarm, Smoke Detectors)?
                              </TableCell>
                              <TableCell>
                                {smallMediumEnterpriseDetail?.protectionMeasuresYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{smallMediumEnterpriseDetail?.protectionMeasures}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Are you taking anyone or more from the given Security measures: (Grills / Roller
                                Shutters, 24 Hour Security, Burglar Alarm, CCTV Recording)?
                              </TableCell>
                              <TableCell>
                                {smallMediumEnterpriseDetail?.protectionMeasures24HourseYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{smallMediumEnterpriseDetail?.protectionMeasures24Hourse}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Does your business utilize the insured premises for warehousing purpose?
                              </TableCell>
                              <TableCell>
                                {smallMediumEnterpriseDetail?.businessUtilizeYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{smallMediumEnterpriseDetail?.businessUtilize}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Does your business engage in any manufacturing activities?</TableCell>
                              <TableCell>
                                {smallMediumEnterpriseDetail?.businessEngageYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{smallMediumEnterpriseDetail?.businessEngage}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Are the insured premises, namely floors, external walls and roof are constructed 100%
                                Reinforced Cement Concrete (RCC) or 100% of bricks/tile/concrete?
                              </TableCell>
                              <TableCell>
                                {smallMediumEnterpriseDetail?.constructedRccYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{smallMediumEnterpriseDetail?.constructedRcc}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Have you ever had a proposal for insurance or renewal declined by an insurance compnay?
                              </TableCell>
                              <TableCell>
                                {smallMediumEnterpriseDetail?.declinedInsuranceYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{smallMediumEnterpriseDetail?.declinedInsurance}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Have you had any incidents causing loss or damage and/or actual insurance claims in the
                                last 3 years?
                              </TableCell>
                              <TableCell>
                                {smallMediumEnterpriseDetail?.lossOrDamageYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{smallMediumEnterpriseDetail?.lossOrDamage}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Scrollbar>
                  </Card>
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
                  <Box sx={{ mt: 1, p: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "500",
                        fontSize: { sm: "22px", xs: "16px" },
                        color: "inherit",
                        mx: 1,
                      }}
                    >
                      {pascalCase(smallMediumEnterpriseDetail?.smeType)}
                    </Typography>
                    {/* {"Property All Risks"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]?.propertyAllRiskYN && (
                      <>
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
                          Property All Risks
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Contents, FFF, Dأ©cor and Improvements"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.propertyAllRiskImprovements
                                    }
                                  />
                                </Grid>
                                {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                  ?.propertyAllRiskEqpmt && (
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      label={"Portable/ Mobile Eqpmt"}
                                      value={
                                        smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                          ?.propertyAllRiskEqpmt
                                      }
                                    />
                                    <DividerCustom />
                                  </Grid>
                                )}
                                {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                  ?.propertyAllRiskFreezer && (
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      label={"DOS - Stock in Freezer"}
                                      value={
                                        smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                          ?.propertyAllRiskFreezer
                                      }
                                    />
                                    <DividerCustom />
                                  </Grid>
                                )}
                              </Grid>

                              <Divider />
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* {"Business Interruption"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                      ?.businessInterruptionYN && (
                      <>
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
                          Business Interruption
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Loss of Profit"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.lossOfProfit
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Loss of Rent"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.lossOfRent
                                    }
                                  />
                                  <DividerCustom />
                                </Grid>
                              </Grid>

                              <Divider />
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Increased Cost of Working"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.costOfWorking
                                    }
                                  />
                                </Grid>
                              </Grid>

                              <Divider />
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* {"Goods in Transit"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]?.goodsInTransitYN && (
                      <>
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
                          Goods in Transit
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Loss due to Fire, Collusion, Overturning"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.lossDueFire
                                    }
                                  />
                                </Grid>
                              </Grid>
                              <Divider />
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* {"Money"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]?.moneyYN && (
                      <>
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
                          Money
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Money in Transit"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.moneyInTransit
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Money in locked Safe out of business hours"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.moneyPremisesBusinessHours
                                    }
                                  />
                                  <DividerCustom />
                                </Grid>
                              </Grid>

                              <Divider />
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Money in premises during business hours"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.moneyPremisesBusinessHours
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Money in Employee's Residence"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.moneyEmployeeResidence
                                    }
                                  />
                                </Grid>
                              </Grid>

                              <Divider />
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Damage to Safe"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.moneyDamageToSafe
                                    }
                                  />
                                </Grid>
                              </Grid>

                              <Divider />
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* {"Fixed Glass/Signage"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]?.fixedGlassSignageYN && (
                      <>
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
                          Fixed Glass/Signage
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Fixed Glass"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.fixedGlass
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Signage"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.fixedSignage
                                    }
                                  />
                                  <DividerCustom />
                                </Grid>
                              </Grid>
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* {" Fidelity Guarantee"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]?.fidelityGuaranteeYN && (
                      <>
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
                          Fidelity Guarantee
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Fidelity Guarantee"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.fidelityGuaranteeGlass
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* {"Public Liability"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]?.publicLiabilityYN && (
                      <>
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
                          Public Liability
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Public Liability"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.publicLiabilty
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Tenant's Liability"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.tenantLiability
                                    }
                                  />
                                  <DividerCustom />
                                </Grid>
                              </Grid>

                              <Divider />
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Non Manual overseas business trips"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.overseasBusinessTrips
                                    }
                                  />
                                </Grid>
                                {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                  ?.foodPoisoning && (
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      label={"Food and Drink Poisoning"}
                                      value={
                                        smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                          ?.foodPoisoning
                                      }
                                    />
                                  </Grid>
                                )}
                              </Grid>
                              <Divider />
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* {"Workmen Compensation / Employer's Liability"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                      ?.workmenCompensationLiabilityYN && (
                      <>
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
                          Workmen Compensation / Employer's Liability
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Employer's Liability"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.employerLiability
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Medical Expenses"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.medicalExpenses
                                    }
                                  />
                                  <DividerCustom />
                                </Grid>
                              </Grid>

                              <Divider />
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"Repatriation Expenses"}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.repatriationExpenses
                                    }
                                  />
                                </Grid>
                              </Grid>
                              <Divider />
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {/* {"Personal Accident"} */}
                    {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]?.personalAccidentYN && (
                      <>
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
                          Personal Accident
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp
                                    label={"For 5 named employees - per emp."}
                                    value={
                                      smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                        ?.namedEmployees
                                    }
                                  />
                                </Grid>
                                {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                  ?.perStudent && (
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      label={"For Students - per student"}
                                      value={
                                        smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                          ?.perStudent
                                      }
                                    />
                                    <DividerCustom />
                                  </Grid>
                                )}
                              </Grid>
                              <Divider />
                              {smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]?.perEvent && (
                                <Grid container>
                                  <Grid item xs={12} md={6} columnSpacing={4}>
                                    <ListItemComp
                                      label={"PA - per event"}
                                      value={
                                        smallMediumEnterpriseDetail?.[`${smallMediumEnterpriseDetail?.smeType}`]
                                          ?.perEvent
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              )}
                              <Divider />
                            </List>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
          {/* {console.log(smallMediumEnterpriseDetail,"smallMediumEnterpriseDetail")} */}
          <ModalComp open={sharePDFModal} handleClose={handleClosePDFShareModal} widths={{ xs: "95%", sm: "500px" }}>
            <ShareCommercialPDFModal
              pdfLink={process.env.NEXT_PUBLIC_BASE_URL + smallMediumEnterpriseDetail?.smallMediumEnterprisePdf?.link}
              handleClose={handleClosePDFShareModal}
              info={smallMediumEnterpriseDetail}
              commercialName={"SME"}
            />
          </ModalComp>
        </Box>
      )}
    </>
  );
};
SmallMediumEnterpriseDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SmallMediumEnterpriseDetails;
