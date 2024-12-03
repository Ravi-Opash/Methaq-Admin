import {
  Button,
  Link,
  Typography,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fade,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Image from "next/image";
import { formatNumber } from "src/utils/formatNumber";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import ShareIcon from "@mui/icons-material/Share";
import { toast } from "react-toastify";
import {
  downloadTravelComparePDF,
  getTravelComparePlans,
} from "src/sections/travel-insurance/compare-plans/Action/travelComparePlanAction";
import ModalComp from "src/components/modalComp";
import TravelSharePDFModal from "src/sections/travel-insurance/Proposals/travel-share-compare-PDF-modal";
import AnimationLoader from "src/components/amimated-loader";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const URL = process.env.NEXT_PUBLIC_BASE_URL;

const TravelComparePlan = () => {
  const router = useRouter();
  const { travelCompareDetails } = useSelector((state) => state.travelComparePlan);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfLink, setPDFLink] = useState(null);
  const [medicalBenefits, setMedicalBenefits] = useState([]);
  const [luggageBenefits, setLuggageBenefits] = useState([]);
  const [passportBenefits, setPassportBenefits] = useState([]);

  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);
  const dispatch = useDispatch();

  const initialized = useRef(false);

  const travelPlanIds = JSON.parse(sessionStorage?.getItem("travelComparePlan"));

  // function to compare plans
  const handleCompare = () => {
    let selectedPlans = [];
    if (!!travelCompareDetails) {
      travelCompareDetails?.map((ele) => {
        selectedPlans?.push(ele?._id);
      });
    } else {
      selectedPlans = travelPlanIds?.ids;
    }
    dispatch(
      getTravelComparePlans({
        companyIds: selectedPlans,
        refId: travelCompareDetails?.[0]?.internalRef || travelPlanIds?.ref,
      })
    )
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };
  // useEffect to compare plans and stop multiple calls
  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    if (!travelCompareDetails) {
      handleCompare();
    }
  }, [travelCompareDetails?.length]);

  // useEffect to set session storage
  useEffect(() => {
    if (travelCompareDetails) {
      let selectedPlans = [];
      travelCompareDetails?.map((ele) => {
        selectedPlans?.push(ele?._id);
      });
      sessionStorage.setItem(
        "travelComparePlan",
        JSON.stringify({ ids: selectedPlans, ref: travelCompareDetails?.[0]?.internalRef })
      );
    }
    let medicalBenefitss = [];
    let luggageBenefitss = [];
    let passportBenefitss = [];

    travelCompareDetails?.forEach((quote) => {
      const medicalBenefits = quote?.issueInfo?.medicalBenefits ?? [];

      [...medicalBenefits].forEach((feature) => {
        const aa = medicalBenefitss.find((p) => p?.benefit?.name == feature?.benefit?.name);
        if (!aa) {
          medicalBenefitss.push(feature);
        }
      });
    });

    travelCompareDetails?.forEach((quote) => {
      const passportBenefits = quote?.issueInfo?.passportBenefits ?? [];

      [...passportBenefits].forEach((feature) => {
        const aa = passportBenefitss.find((p) => p?.benefit?.name == feature?.benefit?.name);
        if (!aa) {
          passportBenefitss.push(feature);
        }
      });
    });

    travelCompareDetails?.forEach((quote) => {
      const luggageBenefits = quote?.issueInfo?.luggageBenefits ?? [];

      [...luggageBenefits].forEach((feature) => {
        const aa = luggageBenefitss.find((p) => p?.benefit?.name == feature?.benefit?.name);
        if (!aa) {
          luggageBenefitss.push(feature);
        }
      });
    });

    setMedicalBenefits(medicalBenefitss);
    setLuggageBenefits(luggageBenefitss);
    setPassportBenefits(passportBenefitss);
    return () => {
      sessionStorage?.removeItem("travelComparePlan");
    };
  }, [travelCompareDetails]);

  // function to download pdf
  const downloadPdf = () => {
    setIsLoading(true);
    let ids = [];
    travelCompareDetails?.map((item) => {
      ids?.push(item?._id);
    });

    dispatch(downloadTravelComparePDF({ id: travelCompareDetails?.[0]?.internalRef, data: { companyIds: ids } }))
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
          <AnimationLoader open={!!isLoading} />
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
              <Typography variant="subtitle2">Travel insurance proposals</Typography>
            </Link>
          </Box>
          <Stack spacing={3}>
            <Typography variant="h4">Compare Quotations</Typography>
            <Button
              disableRipple
              variant="contained"
              onClick={() => {
                downloadPdf();
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
              {travelCompareDetails && (
                <Box sx={{ pt: { xs: 2 } }} id="pdfContent">
                  <Container disableGutters sx={{ backgroundColor: "white", maxWidth: "unset !important" }}>
                    <TableContainer component={Paper}>
                      <Table sx={{ borderCollapse: "collapse" }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ border: "2px solid grey" }}></TableCell>
                            {travelCompareDetails?.map((item, index) => (
                              <TableCell key={index} align="center" sx={{ border: "2px solid grey" }}>
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
                                        item?.company?.logoImg?.path ? `${URL}/${item?.company?.logoImg?.path}` : "P1"
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
                          <TableRow sx={{ backgroundColor: "#FAF7FA" }}>
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
                                Premium (Exl. Vat)
                              </Typography>
                            </TableCell>
                            {travelCompareDetails?.map((item, index) => (
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
                                  {item?.isReferral
                                    ? "Contact us for price"
                                    : item?.isPremiumRequestUpon
                                    ? "Price upon request"
                                    : `AED ${formatNumber(item?.price)}`}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow sx={{ backgroundColor: "#FAF7FA" }}>
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
                                coverage AreaName
                              </Typography>
                            </TableCell>
                            {travelCompareDetails?.map((item, index) => (
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
                                  {item?.issueInfo?.coverageAreaName}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow sx={{ backgroundColor: "#FAF7FA" }}>
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
                                Product Name
                              </Typography>
                            </TableCell>
                            {travelCompareDetails?.map((item, index) => (
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
                                  {item?.productName}
                                </Typography>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {medicalBenefits?.length > 0 && (
                            <>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={5}
                                  sx={{
                                    border: "2px solid gray",
                                    backgroundColor: "#E5D6E6",
                                    textAlign: "center",
                                    py: 2,
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#000",
                                  }}
                                >
                                  Medical Benefits
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                          {medicalBenefits?.map((ele, idx) => {
                            return (
                              <TableRow
                                key={idx}
                                sx={{
                                  backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA",
                                  borderBottom: "2px solid grey",
                                }}
                              >
                                <TableCell align="center" sx={{ border: "2px solid grey", width: "25%" }}>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="h4"
                                      gutterBottom
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        color: "#000 ",
                                      }}
                                    >
                                      {ele?.benefit?.name}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                {travelCompareDetails?.map((item, index) => {
                                  const match = [...item?.issueInfo?.medicalBenefits]?.find(
                                    (i) => i?.benefit?.name === ele?.benefit?.name
                                  );
                                  return (
                                    <TableCell
                                      key={index}
                                      align="center"
                                      sx={{ border: "2px solid grey", width: "18.75%" }}
                                    >
                                      {match?.value ? (
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
                                          {match?.value}
                                        </Typography>
                                      ) : (
                                        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                          <ClearIcon sx={{ color: "red" }} />
                                        </Box>
                                      )}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                          {passportBenefits?.length > 0 && (
                            <>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={5}
                                  sx={{
                                    border: "2px solid gray",
                                    backgroundColor: "#E5D6E6",
                                    textAlign: "center",
                                    py: 2,
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#000",
                                  }}
                                >
                                  Passport Benefits
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                          {passportBenefits?.map((ele, idx) => {
                            return (
                              <TableRow
                                key={idx}
                                sx={{
                                  backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA",
                                  borderBottom: "2px solid grey",
                                }}
                              >
                                <TableCell align="center" sx={{ border: "2px solid grey", width: "25%" }}>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="h4"
                                      gutterBottom
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        color: "#000 ",
                                      }}
                                    >
                                      {ele?.benefit?.name}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                {travelCompareDetails?.map((item, index) => {
                                  const match = [...item?.issueInfo?.passportBenefits]?.find(
                                    (i) => i?.benefit?.name === ele?.benefit?.name
                                  );
                                  return (
                                    <TableCell
                                      key={index}
                                      align="center"
                                      sx={{ border: "2px solid grey", width: "18.75%" }}
                                    >
                                      {match?.value ? (
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
                                          {match?.value}
                                        </Typography>
                                      ) : (
                                        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                          <ClearIcon sx={{ color: "red" }} />
                                        </Box>
                                      )}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                          {luggageBenefits?.length > 0 && (
                            <>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={5}
                                  sx={{
                                    border: "2px solid gray",
                                    backgroundColor: "#E5D6E6",
                                    textAlign: "center",
                                    py: 2,
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#000",
                                  }}
                                >
                                  Luggage Benefits
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                          {luggageBenefits?.map((ele, idx) => {
                            return (
                              <TableRow
                                key={idx}
                                sx={{
                                  backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA",
                                  borderBottom: "2px solid grey",
                                }}
                              >
                                <TableCell align="center" sx={{ border: "2px solid grey", width: "25%" }}>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="h4"
                                      gutterBottom
                                      sx={{
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        color: "#000 ",
                                      }}
                                    >
                                      {ele?.benefit?.name}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                {travelCompareDetails?.map((item, index) => {
                                  const match = [...item?.issueInfo?.luggageBenefits]?.find(
                                    (i) => i?.benefit?.name === ele?.benefit?.name
                                  );
                                  return (
                                    <TableCell
                                      key={index}
                                      align="center"
                                      sx={{ border: "2px solid grey", width: "18.75%" }}
                                    >
                                      {match?.value ? (
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
                                          {match?.value}
                                        </Typography>
                                      ) : (
                                        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                          <ClearIcon sx={{ color: "red" }} />
                                        </Box>
                                      )}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
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
        <TravelSharePDFModal
          handleClosePDFShareModal={handleClosePDFShareModal}
          travelCompareDetails={travelCompareDetails}
          refId={travelCompareDetails?.[0].internalRef}
          setIsLoading={setIsLoading}
          pdfLink={pdfLink}
          handleClose={handleClosePDFShareModal}
        />
      </ModalComp>
    </>
  );
};
TravelComparePlan.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TravelComparePlan;
