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
import { getworkmenCompensationDetailById } from "src/sections/commercial/workmen-compensation/Action/workmenCompensationAction";
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

const WorkmenCompensation = () => {
  const router = useRouter();
  const { commercialId } = router.query;

  const dispatch = useDispatch();
  const { loading, workmenCompensationDetail } = useSelector((state) => state.workmenCompensation);

  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);

  const commercialFilter = useRef(false);

  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", workmenCompensationDetail?.workmensCompensationPdf?.filename);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getCommercialyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (commercialFilter.current) {
      return;
    }
    commercialFilter.current = true;

    try {
      dispatch(getworkmenCompensationDetailById(commercialId))
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
          <AnimationLoader open={true} />
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
                onClick={() => router.push("/workmen-compensation")}
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
                <Typography variant="h4">Workmen Compensation details</Typography>
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
                            router?.push(`/workmen-compensation/${commercialId}/edit`);
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
                          process.env.NEXT_PUBLIC_BASE_URL + workmenCompensationDetail?.workmensCompensationPdf?.link
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
                {workmenCompensationDetail && (
                  <ProposalStatusSession
                    proposalId={commercialId}
                    items={workmenCompensationDetail?.proposalId}
                    fetchProposalSummary={fetchProposalSummary}
                    flag={"Commercials"}
                    url={"workmenscompensation"}
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
                            <ListItemComp label={"Proposer's Full Name"} value={workmenCompensationDetail?.fullName} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Proposer's Business Addres"}
                              value={workmenCompensationDetail?.businessAddress}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Proposer's Emirates"} value={workmenCompensationDetail?.emirates} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Office Tel No"}
                              value={`971 ${workmenCompensationDetail?.telephoneNo}`}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Email ID"} value={workmenCompensationDetail?.email} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Mobile no."}
                              value={`971 ${workmenCompensationDetail?.mobileNumber}`}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Business Activity"}
                              value={workmenCompensationDetail?.businessActivity}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Law / Jurisdiction - UAE"} value={workmenCompensationDetail?.law} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Territorial Limit"}
                              value={workmenCompensationDetail?.territorialLimit}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Policy Type"} value={workmenCompensationDetail?.policyType} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Basis Of Wages"} value={workmenCompensationDetail?.basisOfWages} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Proposer's Remarks"} value={workmenCompensationDetail?.remark} />
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
                                workmenCompensationDetail?.policyFrom
                                  ? format(parseISO(workmenCompensationDetail?.policyFrom), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              label={"Policy End Date"}
                              value={
                                workmenCompensationDetail?.policyTo
                                  ? format(parseISO(workmenCompensationDetail?.policyTo), "dd/MM/yyyy")
                                  : "-"
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp label={"Total Days"} value={workmenCompensationDetail?.policyDays} />
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
                    Limit Of Liability
                  </Typography>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Medical Expenses (AED)"}
                              value={`AED ${workmenCompensationDetail?.medicalExpenses}`}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Repatriation Expenses (AED)"}
                              value={`AED ${workmenCompensationDetail?.repatriationExpenses}`}
                            />
                          </Grid>
                        </Grid>
                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Employers Liability limit (AED)"}
                              value={`AED ${workmenCompensationDetail?.employeesLiabilityLimit}`}
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
                    Category Details
                  </Typography>
                  {workmenCompensationDetail?.category?.map((ele, idx) => {
                    return (
                      <Box sx={{ p: 2 }} key={idx}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "600",
                            fontSize: "16px",
                          }}
                        >
                          {`Category-${idx + 1}`}
                        </Typography>
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Category Of Employees"} value={ele?.categoryOfEmployees} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"No Of Employees"} value={ele?.noOfEmployees} />
                          </Grid>
                        </Grid>
                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Estimated Wages For The Period (AED)"}
                              value={`AED ${ele?.estimatedWages}`}
                            />
                          </Grid>
                        </Grid>
                        <Divider />
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
                    Employee Details
                  </Typography>

                  <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
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
                      Employees List
                    </Typography>
                    <Tooltip title="View Employees List">
                      <VisibilityIcon
                        sx={{
                          fontSize: "25px",
                          color: "#60176F",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          downloadPdf(
                            process.env.NEXT_PUBLIC_BASE_URL + "/" + workmenCompensationDetail.employeeList.path
                          );
                        }}
                      />
                    </Tooltip>
                  </Box>
                  <Divider />
                  {workmenCompensationDetail?.employee?.map((ele, idx) => {
                    return (
                      <Box sx={{ p: 2 }} key={idx}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "600",
                            fontSize: "16px",
                          }}
                        >
                          {`Employee-${idx + 1}`}
                        </Typography>
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Category Of Employees"} value={ele?.categoryOfEmployees} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Name of Employee"} value={ele?.name} />
                          </Grid>
                        </Grid>
                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp label={"Designation of Employee"} value={ele?.designation} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              label={"Estimated Wages For The Period (AED)"}
                              value={ele?.estimatesPeriod ? `AED ${ele?.estimatesPeriod}` : "-"}
                            />
                          </Grid>
                        </Grid>
                        <Divider />
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
                              <TableCell>Are you involved in offshore activities?</TableCell>
                              <TableCell>{workmenCompensationDetail?.offShoreActivitiesYN ? "Yes" : "No"}</TableCell>
                              <TableCell>{workmenCompensationDetail?.offShoreActivities || "-"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Are you taking cover for all the employees in your firm?</TableCell>
                              <TableCell>{workmenCompensationDetail?.takingCoverInFirmYN ? "Yes" : "No"}</TableCell>
                              <TableCell>{workmenCompensationDetail?.takingCoverInFirm || "-"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Do you have projects related to Oil & Gas sector activities?</TableCell>
                              <TableCell>{workmenCompensationDetail?.oilGasActivitiesYN ? "Yes" : "No"}</TableCell>
                              <TableCell>{workmenCompensationDetail?.oilGasActivities || "-"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                Was your application for this policy been declined any time in the past?
                              </TableCell>
                              <TableCell>{workmenCompensationDetail?.policyDeclinedYN ? "Yes" : "No"}</TableCell>
                              <TableCell>{workmenCompensationDetail?.policyDeclined || "-"}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Did you have any claims for the past 5 years?</TableCell>
                              <TableCell>{workmenCompensationDetail?.claimsLastFiveYearYN ? "Yes" : "No"}</TableCell>
                              <TableCell>{workmenCompensationDetail?.claimsLastFiveYear || "-"}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Scrollbar>
                  </Card>
                </Box>
                {workmenCompensationDetail?.tradeLicense && (
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
                      Trade License
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
                        Trade License
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
                              process.env.NEXT_PUBLIC_BASE_URL + "/" + workmenCompensationDetail.tradeLicense.path
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
            {/*share commercial pdf model*/}
            <ShareCommercialPDFModal
              pdfLink={process.env.NEXT_PUBLIC_BASE_URL + workmenCompensationDetail?.workmensCompensationPdf?.link}
              handleClose={handleClosePDFShareModal}
              info={workmenCompensationDetail}
              commercialName={"workmen"}
            />
          </ModalComp>
        </Box>
      )}
    </>
  );
};
WorkmenCompensation.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default WorkmenCompensation;
