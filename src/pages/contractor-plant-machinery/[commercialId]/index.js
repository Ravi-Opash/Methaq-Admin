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
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { EditIcon } from "src/Icons/EditIcon";
import ShareIcon from "@mui/icons-material/Share";
import { Scrollbar } from "src/components/scrollbar";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getcontractorPlantMachineryDetailById } from "src/sections/commercial/contractor-plant-machinery/Action/contractorPlantMachineryAction";
import { toast } from "react-toastify";
import ModalComp from "src/components/modalComp";
import ShareCommercialPDFModal from "src/sections/commercial/share-commercial-pdf-modal";
import { format, parseISO } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { moduleAccess } from "src/utils/module-access";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const ContractorPlantMachineryDetails = () => {
  const router = useRouter();
  const { commercialId } = router.query;

  const dispatch = useDispatch();
  const { loading, contractorPlantMachinerykDetail } = useSelector((state) => state.contractorPlantMachinery);

  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);

  const commercialFilter = useRef(false);

  // Download file from url
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", contractorPlantMachinerykDetail?.contractorPlantPdf?.filename);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Contractor plant and machinery detail; API
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
  const { loginUserData: user } = useSelector((state) => state.auth);

  const fetchProposalSummary = () => {
    commercialFilter.current = false;
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
                onClick={() => router.push("/contractor-plant-machinery")}
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
                  Contractor Plant & Machinery details
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
                            router?.push(`/contractor-plant-machinery/${commercialId}/edit`);
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
                          process.env.NEXT_PUBLIC_BASE_URL + contractorPlantMachinerykDetail?.contractorPlantPdf?.link
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
                {contractorPlantMachinerykDetail && (
                  <ProposalStatusSession
                    proposalId={commercialId}
                    items={contractorPlantMachinerykDetail?.proposalId}
                    fetchProposalSummary={fetchProposalSummary}
                    flag={"Commercials"}
                    url={"contractorplant"}
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
                              label={"Assured Type."}
                              value={contractorPlantMachinerykDetail?.assuredType}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Full Name"}
                              value={contractorPlantMachinerykDetail?.fullName}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Business Address"}
                              value={contractorPlantMachinerykDetail?.businessAddress}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Emirates"}
                              value={contractorPlantMachinerykDetail?.emirates}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Office Tel No (971XXXXXXXX)"}
                              value={`971 ${contractorPlantMachinerykDetail?.telephoneNo}`}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Email ID"} value={contractorPlantMachinerykDetail?.email} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Mobile # * (971XXXXXXXXX)"}
                              value={`971 ${contractorPlantMachinerykDetail?.mobileNumber}`}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Business Activity "}
                              value={contractorPlantMachinerykDetail?.businessActivity}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Law / Jurisdiction - UAE"}
                              value={contractorPlantMachinerykDetail?.law}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Territorial Limit"}
                              value={contractorPlantMachinerykDetail?.territorialLimit}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Policy Type"} value={contractorPlantMachinerykDetail?.policyType} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"No of Equipment"}
                              value={contractorPlantMachinerykDetail?.noOfEquipment}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Is the equipment Mortgaged ?"}
                              value={contractorPlantMachinerykDetail?.isMortagaged ? "Yes" : "No"}
                            />

                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Mortgage Bank Details"}
                              value={contractorPlantMachinerykDetail?.mortagageBankDetails}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Proposer's Remarks"}
                              value={contractorPlantMachinerykDetail?.remarks}
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
                    On Site Third Party Liability
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"On Site TPL Limit"}
                              value={contractorPlantMachinerykDetail?.tplLimit}
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
                                contractorPlantMachinerykDetail?.policyFrom
                                  ? format(parseISO(contractorPlantMachinerykDetail?.policyFrom), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy End Date"}
                              value={
                                contractorPlantMachinerykDetail?.policyTo
                                  ? format(parseISO(contractorPlantMachinerykDetail?.policyTo), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Total Days"} value={contractorPlantMachinerykDetail?.policyDays} />
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
                    Equipment Details
                  </Typography>
                  {contractorPlantMachinerykDetail?.equipmentDetail && (
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
                          Equipment Detail
                        </Typography>
                        <Tooltip title="Equipment Detail File">
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
                                  contractorPlantMachinerykDetail.equipmentDetail.path
                              );
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                  {contractorPlantMachinerykDetail?.equipment?.map((ele, index) => {
                    return (
                      <Box sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            // py: 1.5,
                            width: "100%",
                            fontWeight: "600",
                            fontSize: "18px",
                          }}
                        >
                          {`Equipment-${index + 1}`}
                        </Typography>
                        <Grid container columnSpacing={8}>
                          <Grid item xs={12} sm={12}>
                            <List sx={{ py: 0 }}>
                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp label={"Type."} value={ele?.equipmentType} />
                                  <DividerCustom />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp label={"Description"} value={ele?.equipmentDescription} />
                                </Grid>
                              </Grid>

                              <Divider />

                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp label={"MFG Year"} value={ele?.mfgYear} />
                                  <DividerCustom />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp label={"Engine Number"} value={ele?.equipmentEngineNumber} />
                                </Grid>
                              </Grid>

                              <Divider />

                              <Grid container>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp label={"Chassis No"} value={ele?.equipmentChassisNo} />
                                  <DividerCustom />
                                </Grid>
                                <Grid item xs={12} md={6} columnSpacing={4}>
                                  <ListItemComp label={"Plate No"} value={ele?.equipmentPlateNo} />
                                </Grid>
                              </Grid>

                              <Divider />

                              <Grid container>
                                <Grid item xs={12} md={6}>
                                  <ListItemComp label={"Color"} value={ele?.equipmentColor} />
                                  <DividerCustom />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <ListItemComp label={"Value"} value={ele?.equipmentValue} />
                                </Grid>
                              </Grid>
                            </List>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
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
                              <TableCell>Are you using these Equipment for offshore activities?</TableCell>
                              <TableCell>
                                {contractorPlantMachinerykDetail?.offshoreActivityYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorPlantMachinerykDetail?.offshoreActivity}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>The Equipment is purely related to Civil Construction works</TableCell>
                              <TableCell>
                                {contractorPlantMachinerykDetail?.relatedConstructionYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorPlantMachinerykDetail?.relatedConstruction}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Are these Equipment directly involved in Oil & Gas activities?</TableCell>
                              <TableCell>
                                {contractorPlantMachinerykDetail?.oilGasActivityYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorPlantMachinerykDetail?.oilGasActivity}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Has your application for this policy been declined in the past few years?
                              </TableCell>
                              <TableCell>
                                {contractorPlantMachinerykDetail?.policyDeclinedYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorPlantMachinerykDetail?.policyDeclined}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>In past 3 years has your loss ratio exceeded 60% in any given year?</TableCell>
                              <TableCell>
                                {contractorPlantMachinerykDetail?.lossRatioExceededYN === true ? "Yes" : "No"}
                              </TableCell>
                              <TableCell>{contractorPlantMachinerykDetail?.lossRatioExceeded}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Scrollbar>
                  </Card>
                </Box>
                {contractorPlantMachinerykDetail?.tradeLicense && (
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
                              process.env.NEXT_PUBLIC_BASE_URL + "/" + contractorPlantMachinerykDetail.tradeLicense.path
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
              pdfLink={process.env.NEXT_PUBLIC_BASE_URL + contractorPlantMachinerykDetail?.contractorPlantPdf?.link}
              handleClose={handleClosePDFShareModal}
              info={contractorPlantMachinerykDetail}
              commercialName={"contractor-palnt"}
            />
          </ModalComp>
        </Box>
      )}
    </>
  );
};
ContractorPlantMachineryDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ContractorPlantMachineryDetails;
