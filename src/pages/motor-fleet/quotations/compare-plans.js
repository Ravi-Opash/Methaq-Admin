import {
  Backdrop,
  Button,
  CircularProgress,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { formatNumber } from "src/utils/formatNumber";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import ShareIcon from "@mui/icons-material/Share";
import { toast } from "react-toastify";
import ModalComp from "src/components/modalComp";
import HealthSharePDFModal from "src/sections/health-insurance/Proposals/health-share-compare-PDF-modal";
import MotorFleetSharePDFModal from "src/sections/motor-fleet/Proposals/motor-fleet-share-compare-pdf-modal";
import { downloadMotorFleetComparePDF } from "src/sections/motor-fleet/Proposals/Action/motorFleetProposalsAction";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const MotorFleetComparePlan = () => {
  const router = useRouter();
  const { motorFleetCompareDetails } = useSelector((state) => state.motorFleetProposals);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfLink, setPDFLink] = useState(null);
  const [coveragesList, setCoveragesList] = useState([]);

  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);
  const dispatch = useDispatch();

  // useEffect for getting coverages
  useEffect(() => {
    const array2 = [];

    motorFleetCompareDetails?.forEach((quote) => {
      const covers = [...(quote?.includedCovers || []), ...(quote?.extraCovers || [])];

      covers.forEach((feature) => {
        const aa = array2.find((p) => p?.benefit?._id === feature?.benefit?._id);
        if (!aa) {
          array2.push(feature);
        }
      });
    });
  }, [motorFleetCompareDetails]);

  // Function to download PDF
  const downloadPdf = () => {
    setIsLoading(true);
    let ids = [];
    motorFleetCompareDetails?.map((item) => {
      ids?.push(item?._id);
    });

    dispatch(
      downloadMotorFleetComparePDF({
        fleetQuoteIds: ids,
        pId: motorFleetCompareDetails?.[0]?.quoteInfo?.fleetdDetailsId?._id,
      })
    )
      .unwrap()
      .then((res) => {
        setIsLoading(false);
        let pdfUrl = `${baseURL}${res?.data?.link}`;
        setPDFLink(pdfUrl);
        setSharePDFModal(true);

        // const link = document.createElement("a");
        // link.href = pdfUrl;
        // link.setAttribute("rel", "noopener noreferrer");
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
      })
      .catch((err) => {
        console.log(err);
        toast?.error(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={isLoading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
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
          <Box
            sx={{
              display: "inline-block",
            }}
          >
            <Link
              color="textPrimary"
              component="a"
              sx={{
                alignItems: "center",
                display: "flex",
                cursor: "pointer",
              }}
              onClick={() => router.back()}
            >
              <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Health insurance proposals</Typography>
            </Link>
          </Box>
          <Stack spacing={3}>
            <Typography variant="h4">Compare Quotations</Typography>
            <Button
              disableRipple
              variant="contained"
              onClick={() => {
                // setIsLoading(true);
                downloadPdf();
                // setSharePDFModal(true);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "flex-start", sm: "flex-end" },
                color: "#60176F",
                fontSize: { xs: "12px", sm: "14px", lg: "18px" },
                lineHeight: { xs: "13px", sm: "16px", lg: "19px" },
                fontWeight: 400,
                height: "50px",
                background: "none",
                textTransform: "capitalize",
                cursor: "pointer",
                boxShadow: "none",
                "&:hover": {
                  background: "none",
                  color: "none",
                  boxShadow: "none",
                },
                "&:focus": {
                  background: "none",
                  color: "none",
                  boxShadow: "none",
                },
              }}
              startIcon={<ShareIcon sx={{ color: "#60176F" }} />}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  m: 0,
                  fontSize: {
                    xl: "14px",
                    lg: "13px",
                    md: "13px",
                    sm: "12px",
                    xs: "11px",
                  },
                  fontWeight: "500",
                }}
              >
                Share PDF
              </Typography>
            </Button>
          </Stack>
          <Scrollbar>
            <Box sx={{ minWidth: 900 }}>
              {motorFleetCompareDetails && (
                <Box sx={{ pt: { xs: 7, md: 7 } }} id="pdfContent">
                  <Container disableGutters sx={{ backgroundColor: "white", maxWidth: "unset !important" }}>
                    <TableContainer component={Paper}>
                      <Table sx={{ borderCollapse: "collapse" }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ border: "2px solid grey" }}></TableCell>
                            {motorFleetCompareDetails?.map((item, index) => (
                              <TableCell key={index} align="center" sx={{ border: "2px solid grey" }}>
                                {/* {console.log(item, "ff")} */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 1,
                                    height: "150px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      height: "100px",
                                    }}
                                  >
                                    <img
                                      width={100}
                                      src={
                                        item?.company?.logoImg?.path
                                          ? `${baseURL}/${item?.company?.logoImg?.path}`
                                          : "P1"
                                      }
                                      height={100}
                                      alt="logo"
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="h4"
                                      gutterBottom
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        textAlign: "center",
                                        maxWidth: "180px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        color: "#000 ",
                                      }}
                                    >
                                      {item?.company?.companyName}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell align="center" sx={{ border: "2px solid grey" }}>
                              <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  color: "#000 ",
                                }}
                              >
                                Premium
                              </Typography>
                            </TableCell>
                            {motorFleetCompareDetails?.map((item, index) => (
                              <TableCell key={index} align="center" sx={{ border: "2px solid grey" }}>
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  sx={{
                                    textTransform: "capitalize",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "#000",
                                  }}
                                >
                                  {item?.quoteInfo?.isReferral
                                    ? "Contact us for price"
                                    : item?.quoteInfo?.isPremiumRequestUpon
                                    ? "Price upon request"
                                    : `AED ${formatNumber(item?.quoteInfo?.price)}`}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            {motorFleetCompareDetails?.length > 0 ? (
                              <TableCell
                                colSpan={motorFleetCompareDetails?.length + 1}
                                sx={{ backgroundColor: "#E5D6E6", border: "2px solid grey" }}
                              >
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontSize: "15px", fontWeight: "bold", color: "#60176F" }}
                                >
                                  Benefits
                                </Typography>
                              </TableCell>
                            ) : (
                              <div></div>
                            )}
                          </TableRow>
                          {coveragesList?.map((ele, idx) => (
                            <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA" }}>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid grey", color: "#000", fontWeight: 700 }}
                              >
                                {ele?.benefit?.name}
                              </TableCell>
                              {motorFleetCompareDetails.map((item, index) => {
                                const match = [...item?.includedCovers, ...item?.extraCovers]?.find(
                                  (i) => i?.benefit?._id === ele?.benefit?._id
                                );
                                return (
                                  <TableCell key={index} align="center" sx={{ border: "2px solid grey" }}>
                                    {match?.isEnabled ? (
                                      <>
                                        {match?.benefit?.valueType === "object" ? (
                                          <Box>
                                            {Object.entries(
                                              match?.coverage ||
                                                match?.coPay ||
                                                match?.deductible ||
                                                match?.detail ||
                                                {}
                                            ).map(
                                              ([key, value]) =>
                                                key === "description" && (
                                                  <Box key={key}>
                                                    <Typography
                                                      sx={{
                                                        fontSize: "13px",
                                                        color: "#000",
                                                        fontWeight: 550,
                                                      }}
                                                      color="textSecondary"
                                                      variant="body2"
                                                      dangerouslySetInnerHTML={{
                                                        __html: value,
                                                      }}
                                                    ></Typography>
                                                  </Box>
                                                )
                                            )}
                                          </Box>
                                        ) : (
                                          <Box>
                                            <Typography
                                              sx={{
                                                fontSize: "13px",
                                                fontWeight: 500,
                                                color: "#707070",
                                              }}
                                            >
                                              <li>
                                                {match?.value
                                                  ? match?.value
                                                  : match?.limitAmount && match?.limitAmount !== 0
                                                  ? `${match?.limitAmount} AED`
                                                  : ""}
                                              </li>
                                            </Typography>
                                          </Box>
                                        )}
                                      </>
                                    ) : (
                                      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 1 }}>
                                        <ClearIcon sx={{ color: "red" }} />
                                      </Box>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Container>
                </Box>
              )}
            </Box>
          </Scrollbar>
        </Container>
      </Box>
      <ModalComp open={sharePDFModal} handleClose={handleClosePDFShareModal} widths={{ xs: "95%", sm: "500px" }}>
        <MotorFleetSharePDFModal
          handleClosePDFShareModal={handleClosePDFShareModal}
          motorFleetCompareDetails={motorFleetCompareDetails}
          refId={motorFleetCompareDetails?.[0]?.quoteInfo?.fleetdDetailsId?._id}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          pdfLink={pdfLink}
          handleClose={handleClosePDFShareModal}
        />
      </ModalComp>
    </>
  );
};
MotorFleetComparePlan.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MotorFleetComparePlan;
