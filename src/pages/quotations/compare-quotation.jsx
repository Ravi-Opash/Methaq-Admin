import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  Stack,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight } from "src/Icons/chevron-right";
import { CheckSvg } from "src/Icons/CheckSvg";
import { CrossSvg } from "src/Icons/CrossSvg";
import NextImage from "next/image";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { downloadCopmareQuotePDF, getComparisonQuotations } from "src/sections/Proposals/Action/proposalsAction";
import { Scrollbar } from "src/components/scrollbar";
import AddIcon from "@mui/icons-material/Add";
import GenerateComparisonModal from "src/sections/Proposals/generate-comparison-modal";
import ModalComp from "src/components/modalComp";
import AddComparisonModal from "src/sections/Proposals/add-comparison-modal"; // Check that Monday
import { formatNumber } from "src/utils/formatNumber";
import SharePDFModal from "src/sections/Proposals/share-compare-PDF-modal";
import ShareIcon from "@mui/icons-material/Share";
import RemoveIcon from "@mui/icons-material/Remove";
import AnimationLoader from "src/components/amimated-loader";
import { features } from "process";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const Img = styled(NextImage)(({ theme }) => ({
  objectFit: "cover",
  maxWidth: "75px",
  maxHeight: "75px",
}));

function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

const CompareQuotation = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [pdfLink, setPDFLink] = useState(null);
  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);

  const { QuotationComparisonList } = useSelector((state) => state.proposals);

  // console.log(QuotationComparisonList, "QuotationComparisonList");

  const initialized = useRef(false);

  const motorPlanIds = JSON.parse(sessionStorage?.getItem("motorComparePlan"));

  // function to compare plans
  const handleCompare = () => {
    let selectedPlans = [];
    if (!!QuotationComparisonList) {
      QuotationComparisonList?.data?.map((ele) => {
        selectedPlans?.push(ele?._id);
      });
    } else {
      selectedPlans = motorPlanIds?.ids;
    }
    setIsLoading(true);
    dispatch(getComparisonQuotations({ ids: selectedPlans }))
      .unwrap()
      .then((res) => {
        // console.log("res", res);
        setIsLoading(false);
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
        setIsLoading(false);
      });
  };

  // function to compare plans
  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    if (!QuotationComparisonList?.data) {
      handleCompare();
    }
  }, [QuotationComparisonList?.data?.length]);

  // function to compare plans
  useEffect(() => {
    if (QuotationComparisonList?.data) {
      let selectedPlans = [];
      QuotationComparisonList?.data?.map((ele) => {
        selectedPlans?.push(ele?._id);
      });
      sessionStorage.setItem(
        "motorComparePlan",
        JSON.stringify({ ids: selectedPlans, ref: QuotationComparisonList?.data?.[0]?.internalRef })
      );
    }
    return () => {
      sessionStorage?.removeItem("motorComparePlan");
    };
  }, [QuotationComparisonList]);

  const [isLoading, setIsLoading] = useState(false);

  // function to download pdf
  const downloadPdf = async () => {
    let ids;
    if (QuotationComparisonList) {
      ids = QuotationComparisonList?.data.map((i) => {
        return i._id;
      });
    }

    dispatch(
      downloadCopmareQuotePDF({
        ids,
        pId:
          QuotationComparisonList?.data?.[0]?.QuoteReferenceNo ||
          QuotationComparisonList?.data?.[0]?.quoteInfo?.internalRef,
      })
    )
      .unwrap()
      .then((res) => {
        // console.log(res, "res1");
        let pdfUrl = process.env.NEXT_PUBLIC_BASE_URL + res.data.link;
        setPDFLink(pdfUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {isLoading && (
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

          <Stack direction="row" justifyContent="space-between" spacing={1} mb={3}>
            <Typography variant="h4">Compare Quotations</Typography>
            <Button
              disableRipple
              variant="contained"
              onClick={() => {
                // setIsLoading(true);
                downloadPdf();
                setSharePDFModal(true);
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
            <Box sx={{ minWidth: 800, mt: 2 }}>
              {QuotationComparisonList && (
                <Box sx={{ display: "inline-block", width: "100%" }} id="capturee">
                  <Box sx={{ display: "inline-block", width: "100%" }} id="capturee">
                    <Container>
                      <TableContainer component={Paper}>
                        <Table sx={{ borderCollapse: "collapse", minWidth: 650 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{
                                  border: "2px solid rgb(0 0 0 / 12%)",
                                  backgroundColor: "#F4F4F4",
                                  textAlign: "center",
                                  py: 2,
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  color: "#000",
                                }}
                              ></TableCell>
                              {QuotationComparisonList?.data?.map((item, index) => (
                                <TableCell
                                  align="center"
                                  key={index}
                                  sx={{
                                    border: "2px solid rgb(0 0 0 / 12%)",
                                    backgroundColor: "#F4F4F4",
                                    textAlign: "center",
                                    py: 2,
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#000",
                                  }}
                                >
                                  <Box sx={{ cursor: "pointer" }}>
                                    <Img
                                      width={75}
                                      src={!!item?.company && baseURL + "/" + item?.company?.logoImg?.path}
                                      height={75}
                                      alt="logo"
                                    />
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        color: "#000",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        marginTop: 1,
                                      }}
                                    >
                                      {item?.company?.companyName}
                                    </Typography>
                                  </Box>
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid rgb(0 0 0 / 12%)", py: 2, backgroundColor: "#FAF7FA" }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Original Price
                                </Typography>
                              </TableCell>
                              {QuotationComparisonList?.data?.map((item, index) => (
                                <TableCell
                                  key={index}
                                  align="center"
                                  sx={{
                                    border: "2px solid rgb(0 0 0 / 12%)",
                                    py: 2,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    backgroundColor: "#FAF7FA",
                                  }}
                                >
                                  <del>
                                    {item?.quoteInfo?.isWithoutMatrixOrApi
                                      ? "-"
                                      : `AED ${formatNumber(parseInt(item?.quoteInfo?.esanadPrice * 100) / 100)}`}
                                  </del>
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid rgb(0 0 0 / 12%)", py: 2, backgroundColor: "#FAF7FA" }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  eSanad Price
                                </Typography>
                              </TableCell>
                              {QuotationComparisonList?.data?.[0]?.quoteInfo?.discountPrice != 0 ? (
                                <>
                                  {QuotationComparisonList?.data?.map((item, index) => (
                                    <TableCell
                                      key={index}
                                      align="center"
                                      sx={{
                                        border: "2px solid rgb(0 0 0 / 12%)",
                                        py: 2,
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        backgroundColor: "#FAF7FA",
                                      }}
                                    >
                                      <del>
                                        {item?.quoteInfo?.isWithoutMatrixOrApi
                                          ? "--"
                                          : `AED ${formatNumber(parseInt(item?.quoteInfo?.totalPrice * 100) / 100)}`}
                                      </del>
                                    </TableCell>
                                  ))}
                                </>
                              ) : (
                                <>
                                  {QuotationComparisonList?.data?.map((item, index) => (
                                    <TableCell
                                      key={index}
                                      align="center"
                                      sx={{
                                        border: "2px solid rgb(0 0 0 / 12%)",
                                        py: 2,
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        backgroundColor: "#FAF7FA",
                                      }}
                                    >
                                      <del>
                                        {item?.quoteInfo?.isWithoutMatrixOrApi
                                          ? "--"
                                          : `AED ${formatNumber(parseInt(item?.quoteInfo?.esanadPrice * 100) / 100)}`}
                                      </del>
                                    </TableCell>
                                  ))}
                                </>
                              )}
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid rgb(0 0 0 / 12%)", py: 2, backgroundColor: "#FAF7FA" }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Premium (Exl. Vat)
                                </Typography>
                              </TableCell>
                              {QuotationComparisonList?.data?.map((item, index) => (
                                <TableCell
                                  key={index}
                                  align="center"
                                  sx={{
                                    border: "2px solid rgb(0 0 0 / 12%)",
                                    py: 2,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    backgroundColor: "#FAF7FA",
                                  }}
                                >
                                  {"AED " + formatNumber(item?.quoteInfo?.discountPrice || item?.quoteInfo?.totalPrice)}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell align="center" sx={{ border: "2px solid rgb(0 0 0 / 12%)", py: 2 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Type
                                </Typography>
                              </TableCell>
                              {QuotationComparisonList?.data?.map((item, index) => (
                                <TableCell
                                  key={index}
                                  align="center"
                                  sx={{
                                    border: "2px solid rgb(0 0 0 / 12%)",
                                    py: 2,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {item?.medicalNetwork}{" "}
                                  {item?.insuranceType === "thirdparty"
                                    ? "Third Party"
                                    : item?.insuranceType === "comprehensive"
                                    ? "Comprehensive"
                                    : ""}
                                  {item?.insuranceType === "comprehensive" && (
                                    <Typography
                                      variant="h4"
                                      gutterBottom
                                      sx={{
                                        fontSize: {
                                          xl: "13px",
                                          lg: "15px",
                                          md: "15px",
                                          sm: "14px",
                                          xs: "13px",
                                        },
                                        fontWeight: "500",
                                      }}
                                    >
                                      {item?.repairType
                                        ? item?.repairType === "nonagency"
                                          ? "(Non Agency)"
                                          : "(Agency)"
                                        : ""}
                                    </Typography>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid rgb(0 0 0 / 12%)", py: 2, backgroundColor: "#FAF7FA" }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Excess
                                </Typography>
                              </TableCell>
                              {QuotationComparisonList?.data?.map((item, index) => (
                                <TableCell
                                  key={index}
                                  align="center"
                                  sx={{
                                    border: "2px solid rgb(0 0 0 / 12%)",
                                    py: 2,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    backgroundColor: "#FAF7FA",
                                  }}
                                >
                                  <span>
                                    {item?.insuranceType === "thirdparty" || item?.quoteInfo?.isWithoutMatrixOrApi ? (
                                      "-"
                                    ) : item?.Offers[0]?.ExcessAmount === 0 ? (
                                      <CrossSvg sx={{ color: "#FC6767", fontSize: "30px" }} />
                                    ) : !item?.Offers[0]?.ExcessAmount ? (
                                      <RemoveIcon />
                                    ) : (
                                      "AED" + " " + formatNumber(item?.Offers[0]?.ExcessAmount)
                                    )}
                                  </span>
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell align="center" sx={{ border: "2px solid rgb(0 0 0 / 12%)", py: 2 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Repair Type
                                </Typography>
                              </TableCell>
                              {QuotationComparisonList?.data?.map((item, index) => (
                                <TableCell
                                  key={index}
                                  align="center"
                                  sx={{
                                    border: "2px solid rgb(0 0 0 / 12%)",
                                    py: 2,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  <span>
                                    {!item?.insuranceType
                                      ? "-"
                                      : item?.repairType
                                      ? item?.repairType === "nonagency"
                                        ? `Non Agency ${
                                            item?.quoteInfo?.companyResponse?.vehicleRepairs
                                              ? `(${item?.quoteInfo?.companyResponse?.vehicleRepairs})`
                                              : ""
                                          }`
                                        : `Agency ${
                                            item?.quoteInfo?.companyResponse?.vehicleRepairs
                                              ? `(${item?.quoteInfo?.companyResponse?.vehicleRepairs})`
                                              : ""
                                          }`
                                      : "-"}
                                  </span>
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={5}
                                sx={{
                                  border: "2px solid rgb(0 0 0 / 12%)",
                                  backgroundColor: "#E5D6E6",
                                  textAlign: "center",
                                  py: 2,
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  color: "#000",
                                }}
                              >
                                Coverages Guide
                              </TableCell>
                            </TableRow>
                            {QuotationComparisonList?.coverages?.map((fetures, index) => {
                              const isEvenRow = index % 2 === 1;
                              return (
                                <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#fff" : "#FAF7FA" }}>
                                  <TableCell align="center" sx={{ border: "2px solid rgb(0 0 0 / 12%)", py: 2 }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        color: "#000",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {fetures?.Title}
                                    </Typography>
                                  </TableCell>{" "}
                                  {fetures?.values?.map((item, i) => {
                                    return (
                                      <>
                                        <TableCell
                                          key={index}
                                          align="center"
                                          sx={{
                                            border: "2px solid rgb(0 0 0 / 12%)",
                                            py: 2,
                                            fontSize: "14px",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {item !== undefined && item !== null ? (
                                            fetures?.Title === "Loss & Damage" || item === "Vehicle Value" ? (
                                              fetures?.carValues?.[i] ? (
                                                `AED ${formatNumber(fetures?.carValues?.[i])}`
                                              ) : (
                                                `AED ${formatNumber(
                                                  QuotationComparisonList?.data?.[0]?.Offers?.[0]?.MaximumCarValue
                                                )}`
                                              )
                                            ) : !isNumber(+item) && item ? (
                                              item
                                            ) : item == "0" ? (
                                              <CheckSvg
                                                sx={{
                                                  color: "#00AF3D",
                                                  fontSize: "30px",
                                                }}
                                              />
                                            ) : (
                                              "AED " + formatNumber(item || 0)
                                            )
                                          ) : (
                                            <CrossSvg
                                              sx={{
                                                color: "#FC6767",
                                                fontSize: "30px",
                                              }}
                                            />
                                          )}
                                        </TableCell>
                                      </>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={5}
                                sx={{
                                  border: "2px solid rgb(0 0 0 / 12%)",
                                  backgroundColor: "#E5D6E6",
                                  textAlign: "center",
                                  py: 2,
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  color: "#000",
                                }}
                              >
                                Benefits Guide
                              </TableCell>
                            </TableRow>
                            {QuotationComparisonList?.benefits?.map((fetures, index) => {
                              const isEvenRow = index % 2 === 1;
                              return (
                                <TableRow sx={{ backgroundColor: index % 2 === 0 ? "#fff" : "#FAF7FA" }}>
                                  <TableCell align="center" sx={{ border: "2px solid rgb(0 0 0 / 12%)", py: 2 }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        color: "#000",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {fetures?.Title}
                                    </Typography>
                                  </TableCell>{" "}
                                  {fetures?.values?.map((item, index) => {
                                    return (
                                      <>
                                        <TableCell
                                          key={index}
                                          align="center"
                                          sx={{
                                            border: "2px solid rgb(0 0 0 / 12%)",
                                            py: 2,
                                            fontSize: "14px",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {item === undefined || item === null ? (
                                            <CrossSvg
                                              sx={{
                                                color: "#FC6767",
                                                fontSize: "30px",
                                              }}
                                            />
                                          ) : item?.limitValues?.[index].limitAmount > 0 && !item ? (
                                            `${item?.limitValues?.[index].limitAmount} ${item?.limitValues?.[index].limitUnit}`
                                          ) : item?.limitValues?.[index].limitAmount > 0 ? (
                                            `${item?.limitValues?.[index].limitAmount} ${item?.limitValues?.[index].limitUnit} ${item}`
                                          ) : item && typeof item == "string" && item?.startsWith("AED") ? (
                                            `${item}`
                                          ) : item ? (
                                            item && /\d/.test(item) ? (
                                              ` ${item}`
                                            ) : (
                                              item
                                            )
                                          ) : (
                                            <CheckSvg
                                              sx={{
                                                color: "#00AF3D",
                                                fontSize: "30px",
                                              }}
                                            />
                                          )}
                                        </TableCell>
                                      </>
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
                  <TableContainer component={Paper}>
                    <Table sx={{ borderCollapse: "collapse" }}></Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          </Scrollbar>
        </Container>
      </Box>
      <ModalComp open={sharePDFModal} handleClose={handleClosePDFShareModal} widths={{ xs: "95%", sm: "500px" }}>
        <SharePDFModal
          handleClosePDFShareModal={handleClosePDFShareModal}
          QuotationComparisonList={QuotationComparisonList?.data}
          refId={
            QuotationComparisonList?.data?.[0]?.QuoteReferenceNo ||
            QuotationComparisonList?.data?.[0]?.quoteInfo?.internalRef
          }
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          pdfLink={pdfLink}
          handleClose={handleClosePDFShareModal}
        />
      </ModalComp>
    </>
  );
};

CompareQuotation.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CompareQuotation;
