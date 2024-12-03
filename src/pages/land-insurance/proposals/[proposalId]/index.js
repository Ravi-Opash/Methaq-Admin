import { Box, Container, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  getLandInfoByproposalId,
  updateLandDetails,
} from "src/sections/Land-insurance/Proposals/Action/landInsuranceAction";
import NextLink from "next/link";
import {
  Button,
  Grid,
  Link,
  Typography,
  Card,
  Divider,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import PersonLandInfoEditModal from "src/sections/Land-insurance/personnal-info-edit-form";
import ModalComp from "src/components/modalComp";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import LocationInfoEditModal from "src/sections/Land-insurance/location-info-edit-form";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import MotorPolicyUploadModal from "src/sections/Policies/motor-policy-upload-modal";
import { landInsurancePayByLink } from "src/sections/Land-insurance/Proposals/Action/landInsuranceAction";
import NetworkLogo from "../../../../../public/assets/logos/NetworkLogo.svg";
import Image from "next/image";
import { CrossSvg } from "src/Icons/CrossSvg";
import AnimationLoader from "src/components/amimated-loader";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const LandInsuranceDetails = () => {
  const dispatch = useDispatch();
  const { proposalLandInfo, proposalLandInfoLoader } = useSelector((state) => state.landInsurance);
  const router = useRouter();
  const { proposalId } = router.query;
  const [isLoading, setLoading] = useState(true);
  const [fileDocsLoader, setFileDocsLoader] = useState({});

  const [editPersonalDeatils, setEditPersonalDeatils] = useState(false);
  const HandlePersonalModalClose = () => setEditPersonalDeatils(false);

  const [editLocationDeatils, setEditLocationDeatils] = useState(false);
  const HandleLocationModalClose = () => setEditLocationDeatils(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const handleCloseVerifymodal = () => setVerifyModal(false);

  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);

  const [openEditPolicyNo, setOpenEditPolicyNo] = useState(false);
  const handleEditPolicyNoClose = () => setOpenEditPolicyNo(false);

  const initialized = useRef(false);

  // Function for policy detail API
  const fetchProposalSummary = (changed) => {
    dispatch(getLandInfoByproposalId({ proposalId: proposalId }))
      .then((res) => {})
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    fetchProposalSummary(true);
  }, []);

  // Download document handler
  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + "/" + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Download Policy handler
  const downloadPolicy = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Upload sitemap document API
  const handleFileUpload = (e, proposalId, docsKey) => {
    setFileDocsLoader({ ...fileDocsLoader, [`${proposalId}-${docsKey}`]: true });
    if (e?.target?.files?.[0]) {
      const file = e?.target?.files?.[0];
      const payload = {
        [`${docsKey}`]: file,
      };
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a PDF, JPG, JPEG, or PNG file.");
        event.target.value = null;
        return;
      }
      const formdata = jsonToFormData(payload);
      dispatch(updateLandDetails({ landInfoId: proposalId, data: formdata }))
        ?.unwrap()
        .then((res) => {
          dispatch(getLandInfoByproposalId({ proposalId: proposalId }));
          toast?.success("Successfully Uploaded!");
          setFileDocsLoader({ ...fileDocsLoader, [`${proposalId}-${docsKey}`]: false });
        })
        .catch((err) => {
          console.log(err, "err");
          toast?.error(err);
          setFileDocsLoader({ ...fileDocsLoader, [`${proposalId}-${docsKey}`]: false });
        });
    }
    e.target.value = "";
  };

  // Pay by libk on click handler 
  const payByLinkHandler = () => {
    setVerifyModal(true);
  };

  // generate payment link
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(
      landInsurancePayByLink({
        id: proposalId,
        data: {
          paidBy: "CRM - Link",
          redirectUri: "https://www.esanad.com/",
        },
      })
    )
      .unwrap()
      .then((data) => {
        handleCloseVerifymodal();
        setPaymentLinkInfo(data); // store response in stste
        setPaymentLinkShareModal(true); // Open share link payment modal
        setLoading(true);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        setLoading(true);
        handleCloseVerifymodal();
      });
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
      }}
    >
      {!isLoading && (
        <>
          <AnimationLoader open={!isLoading} />
        </>
      )}
      <Container maxWidth={false}>
        <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
          <Box
            sx={{
              display: "inline-block",
            }}
          >
            <NextLink href="/land-insurance/proposals" passHref>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Musataha Insurance proposals</Typography>
              </Link>
            </NextLink>
          </Box>

          <Stack spacing={1} mb={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
                mt: 3,
              }}
            >
              <Typography variant="h5">Musataha Insurance proposal</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "start", md: "center" },
                  alignItems: "cener",
                  gap: 1,
                }}
              ></Box>
            </Box>
          </Stack>
          {(proposalLandInfo?.policyIssued || proposalLandInfo?.isPaid || proposalLandInfo?.isBought) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                mb: 1,
                p: 2.5,
                justifyContent: "space-between",
                backgroundColor: "#e5f7e5",
                boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px $e5f7e5",
                borderRadius: "10px 10px 10px 10px",
              }}
            >
              <Typography sx={{ ml: 0, fontWeight: 600, color: "#111927" }}>
                {proposalLandInfo?.policyIssued
                  ? `Policy has been created and issued!`
                  : proposalLandInfo?.isBought
                  ? `This proposal has been made into a policy, Please issue a policy.`
                  : "Payment is received for this proposal, Please confirm it!"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {proposalLandInfo?.policyId && (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                      router?.push(`/land-insurance/policies/${proposalLandInfo?.policyId?._id}`);
                    }}
                    sx={{ backgroundColor: "#60167F" }}
                  >
                    View Policy
                  </Button>
                )}
                {proposalLandInfo?.policyId?.companyPolicyPdfUrl && (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                      downloadPolicy(proposalLandInfo?.policyId?.companyPolicyPdfUrl);
                    }}
                    sx={{ backgroundColor: "#60167F" }}
                  >
                    Download Policy
                  </Button>
                )}
              </Box>
            </Box>
          )}
          {!proposalLandInfoLoader ? (
            <Box sx={{ display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <ProposalStatusSession
                  proposalId={proposalId}
                  items={proposalLandInfo}
                  fetchProposalSummary={fetchProposalSummary}
                  isPolicyGenerated={!!proposalLandInfo?.isBought}
                  policyIssued={!!proposalLandInfo?.isPaid}
                  flag={"Land"}
                />
              </Box>
              <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                <Box
                  id={"ownerDetails"}
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    borderRadius: "10px",
                    mt: 2,
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#60176F",
                      px: "14px",
                      borderRadius: "10px 10px 0 0",
                      py: 1.5,
                      width: "100%",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        fontSize: "18px",
                        display: "inline-block",
                      }}
                    >
                      Personal Details
                    </Typography>
                  </Box>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp isCopy={true} label={"Full Name"} value={proposalLandInfo?.fullName?.[0]} />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp isCopy={true} label={"Email"} value={proposalLandInfo?.email || "-"} />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Mobile Number"}
                              value={proposalLandInfo?.mobileNumber ? `+971 ${proposalLandInfo?.mobileNumber}` : "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItem disablePadding sx={{ position: "reletive" }}>
                              <ListItemButton>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: { xs: "space-between", sm: "unset" },
                                    gap: 2,
                                    width: "100%",
                                  }}
                                >
                                  <Box sx={{ width: { xl: "190px", xs: "50%" } }}>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "500",
                                        fontSize: "15px",
                                        display: "inline-block",
                                      }}
                                    >
                                      Owner's Id
                                    </Typography>
                                  </Box>
                                  <Box sx={{ width: "50%" }}>
                                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                      <Typography
                                        onClick={() => onDocumentDowmload(proposalLandInfo?.ownerId?.[0]?.path)}
                                        aria-label="upload picture"
                                        component="label"
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                          fontSize: {
                                            xs: "13px",
                                            sm: "14px",
                                          },
                                          width: "max-content",
                                          cursor: "pointer",
                                          "&:hover": {
                                            color: "#60176f",
                                            textDecoration: "underline",
                                            textUnderlineOffset: "2px",
                                          },
                                        }}
                                      >
                                        <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} /> Download
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          </Grid>
                        </Grid>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
                {proposalLandInfo?.fullName?.length > 1 && (
                  <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        borderRadius: "10px",
                        mb: 3,
                        boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: "#60176F",
                          px: "14px",
                          borderRadius: "10px 10px 0 0",
                          py: 1.5,
                          width: "100%",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            width: "100%",
                            backgroundColor: "#f5f5f5",
                            fontWeight: "600",
                            fontSize: "18px",
                            display: "inline-block",
                            color: "#60176F",
                            borderRadius: "10px 10px 0 0",
                          }}
                        >
                          Other Owners
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: 700 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Full Name</TableCell>
                              <TableCell>ID</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {proposalLandInfo?.fullName
                              ?.slice(0, proposalLandInfo?.fullName?.length - 1)
                              ?.map((item, idx) => {
                                return (
                                  <TableRow hover>
                                    <TableCell>{proposalLandInfo?.fullName?.[idx + 1]}</TableCell>
                                    {proposalLandInfo?.ownerId?.[idx + 1] && (
                                      <TableCell>
                                        <Typography
                                          onClick={() => onDocumentDowmload(proposalLandInfo?.ownerId?.[idx + 1]?.path)}
                                          aria-label="upload picture"
                                          component="label"
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            fontSize: {
                                              xs: "13px",
                                              sm: "14px",
                                            },
                                            width: "max-content",
                                            cursor: "pointer",
                                            "&:hover": {
                                              color: "#60176f",
                                              textDecoration: "underline",
                                              textUnderlineOffset: "2px",
                                            },
                                          }}
                                        >
                                          <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} /> Download
                                        </Typography>
                                      </TableCell>
                                    )}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Box>
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    borderRadius: "10px",
                    my: 2,
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#60176F",
                      px: "14px",
                      borderRadius: "10px 10px 0 0",
                      py: 1.5,
                      width: "100%",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "600",
                        fontSize: "18px",
                        display: "inline-block",
                      }}
                    >
                      Location Details
                    </Typography>
                  </Box>
                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={12} columnSpacing={4}>
                            <ListItemComp
                              fullWidth={true}
                              isCopy={true}
                              label={"Location"}
                              value={proposalLandInfo?.location || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                        </Grid>
                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItem disablePadding sx={{ position: "reletive" }}>
                              <ListItemButton>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: { xs: "space-between", sm: "unset" },
                                    gap: 2,
                                    width: "100%",
                                  }}
                                >
                                  <Box sx={{ width: "190px" }}>
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        mb: 1,
                                        fontWeight: "500",
                                        fontSize: "15px",
                                        display: "inline-block",
                                      }}
                                    >
                                      Site Map
                                    </Typography>
                                  </Box>
                                  <Box sx={{ width: "50%" }}>
                                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                                      <CheckCircleIcon
                                        sx={{
                                          color: proposalLandInfo?.sitemap ? "#00cc00" : "#8c8c8c",
                                          fontSize: 20,
                                          "@keyframes shadow-pulse": {
                                            "0%": {
                                              boxShadow: "0 0 0 0px rgba(96, 23, 111, 0.2)",
                                              borderRadius: "50%",
                                            },
                                            "100%": {
                                              boxShadow: "0 0 0 15px rgba(96, 23, 111, 0)",
                                              borderRadius: "50%",
                                            },
                                          },
                                        }}
                                      />

                                      <Typography
                                        aria-label="upload picture"
                                        component="label"
                                        sx={{
                                          fontSize: {
                                            xs: "13px",
                                            sm: "14px",
                                          },
                                          width: "max-content",
                                          cursor: "pointer",
                                          "&:hover": {
                                            color: "#60176f",
                                            textDecoration: "underline",
                                            textUnderlineOffset: "2px",
                                          },
                                        }}
                                      >
                                        <input
                                          accept=".pdf"
                                          id="image-upload"
                                          type="file"
                                          onChange={(e) => {
                                            handleFileUpload(e, proposalLandInfo?._id, "sitemap");
                                          }}
                                          style={{ display: "none" }}
                                        />
                                        {proposalLandInfo?.sitemap ? "Re-Upload" : "Upload"}
                                      </Typography>
                                      {proposalLandInfo?.sitemap && (
                                        <DownloadSvg
                                          sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }}
                                          onClick={() => onDocumentDowmload(proposalLandInfo?.sitemap?.path)}
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          </Grid>
                        </Grid>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {proposalLandInfo?.isPaid && (
                  <Button
                    type="button"
                    disabled={!!proposalLandInfo?.isBought}
                    variant="contained"
                    sx={{ minWidth: "140px" }}
                  >
                    Complete
                  </Button>
                )}
                {!proposalLandInfo?.isPaid && (
                  <Button
                    type="button"
                    disabled={!!proposalLandInfo?.isBought}
                    variant="contained"
                    onClick={() => payByLinkHandler()}
                    sx={{ minWidth: "140px" }}
                  >
                    Pay by link
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={true} />
              </Box>
            </>
          )}
        </Box>
        <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                position: "absolute",
                top: "-16px",
                right: "-16px",
              }}
            >
              <Box onClick={handleCloseVerifymodal} sx={{ display: "inline-block", mt: 0.6, cursor: "pointer" }}>
                <CrossSvg color="#60176F" />
              </Box>
            </Box>
            <Typography sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}>
              Select Payment option to generate payment link
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card
                    onClick={onPaidBylinkgenerate}
                    sx={{
                      p: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "15",
                      },
                    }}
                  >
                    <Image src={NetworkLogo} alt="NetworkLogo" width={120} height={80} />
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </ModalComp>
        <ModalComp
          open={editPersonalDeatils}
          handleClose={HandlePersonalModalClose}
          widths={{ xs: "95%", sm: "95%", md: 900 }}
        >
          <PersonLandInfoEditModal
            HandlePersonalModalClose={HandlePersonalModalClose}
            setLoading={setLoading}
            isLoading={isLoading}
            landInfo={proposalLandInfo}
            fetchSummary={fetchProposalSummary}
          />
        </ModalComp>
        <ModalComp
          open={editLocationDeatils}
          handleClose={HandleLocationModalClose}
          widths={{ xs: "95%", sm: "95%", md: 900 }}
        >
          <LocationInfoEditModal
            HandleLocationModalClose={HandleLocationModalClose}
            setLoading={setLoading}
            isLoading={isLoading}
            landInfo={proposalLandInfo}
            fetchSummary={fetchProposalSummary}
          />
        </ModalComp>

        <ModalComp open={openEditPolicyNo} handleClose={handleEditPolicyNoClose} width="44rem">
          <MotorPolicyUploadModal
            handleEditPolicyNoClose={handleEditPolicyNoClose}
            customerPolicyDetails={proposalLandInfo?.policyId}
            keyName={"Land-Policy"}
            newPolicyId={proposalLandInfo?.policyId?._id}
            proposalId={proposalId}
          />
        </ModalComp>
        <ModalComp
          open={paymentLinkShareModal}
          handleClose={() => setPaymentLinkShareModal(false)}
          widths={{ xs: "95%", sm: 500 }}
        >
          <SharePaymentLinkModal
            handleClose={() => setPaymentLinkShareModal(false)}
            paymentLink={paymentLinkOnfo?.paymentLink}
            setLoading={setLoading}
            credential={"customerQuotationDetails"}
            email={proposalLandInfo?.email}
            mobileNumber={proposalLandInfo?.mobileNumber}
          />
        </ModalComp>
      </Container>
    </Box>
  );
};

LandInsuranceDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default LandInsuranceDetails;
