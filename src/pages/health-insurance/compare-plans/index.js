import {
  Button,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fade,
  IconButton,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { formatNumber } from "src/utils/formatNumber";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import ShareIcon from "@mui/icons-material/Share";
import { toast } from "react-toastify";
import {
  downloadHealthCompareEcxel,
  downloadHealthComparePDF,
} from "src/sections/health-insurance/Proposals/Action/healthInsuranceAction";
import { getHealthComparePlans } from "src/sections/health-insurance/compare-plans/Action/healthComparePlanAction";
import ModalComp from "src/components/modalComp";
import HealthSharePDFModal from "src/sections/health-insurance/Proposals/health-share-compare-PDF-modal";
import EditHealthenefitModal from "src/sections/health-insurance/Proposals/health-edit-benefit-modal";
import { EditIcon } from "src/Icons/EditIcon";
import { edithealthInsuranceBenefitsById } from "src/sections/health-insurance/health-insurance-companies/Action/healthinsuranceCompanyAction";
import { moduleAccess } from "src/utils/module-access";
import AnimationLoader from "src/components/amimated-loader";
import EditPremiumModal from "src/sections/health-insurance/Proposals/health-edit-premium-modal";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const URL = process.env.NEXT_PUBLIC_BASE_URL;

const HealthComparePlan = () => {
  const router = useRouter();
  const { healthCompareDetails } = useSelector((state) => state.healthComparePlan);

  const [benefitsArray, setbenefitList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfLink, setPDFLink] = useState(null);
  const [topToshowList, settopToshowList] = useState([]);
  const [dentalCoveragesList, setDentalCoveragesList] = useState([]);
  const [maternityCoveragesList, setMaternityCoveragesList] = useState([]);
  const [guideCoveragesList, setGuideCoveragesList] = useState([]);
  const [otherCoveragesList, setOtherCoveragesList] = useState([]);
  const [medicalNetwork, setMedicalNetworkList] = useState([]);

  const [hoverCell, setHoverCell] = useState(``);
  const [editbenefitModal, setEditbenefitModal] = useState(false);

  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);
  const dispatch = useDispatch();

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const initialized = useRef(false);

  const { loginUserData: user } = useSelector((state) => state.auth);

  const healthPlanIds = JSON.parse(sessionStorage?.getItem("healthComparePlan"));

  // Handler to fetch health compare plans
  const handleCompare = () => {
    let selectedPlans = [];
    if (!!healthCompareDetails) {
      healthCompareDetails?.map((ele) => {
        selectedPlans?.push(ele?._id);
      });
    } else {
      selectedPlans = healthPlanIds?.ids;
    }

    dispatch(
      //get comapre plans api
      getHealthComparePlans({
        ids: selectedPlans,
        refId: healthCompareDetails?.[0]?.internalRef || healthPlanIds?.ref,
      })
    )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const onEditPremiumHadler = () => {
    handleCompare();
  };

  // useEffect to initialize data on component mount
  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    if (!healthCompareDetails) {
      handleCompare();
    }
  }, [healthCompareDetails?.length]);

  useEffect(() => {
    let array2 = [];

    if (healthCompareDetails) {
      let selectedPlans = [];
      healthCompareDetails?.map((ele) => {
        selectedPlans?.push(ele?._id);
      });
      sessionStorage.setItem(
        "healthComparePlan",
        JSON.stringify({ ids: selectedPlans, ref: healthCompareDetails?.[0]?.internalRef })
      );
    }

    // Process health comparison details and extract benefits data
    healthCompareDetails?.map((quote) => {
      [...quote?.includedCovers, ...quote?.extraCovers]?.map((feature) => {
        const aa = array2?.find((p) => p?.benefit?._id == feature?.benefit?._id);
        if (aa) {
          return;
        } else {
          array2?.push(feature);
        }
      });
    });

    // Categorize benefits into different coverage lists
    let topToShow = [];
    let dentalCoverages = [];
    let maternityCoverages = [];
    let guideCoverages = [];
    let otherCoverages = [];
    let mediCalNetwork = [];

    array2.sort((a, b) => {
      const priorityA = a?.benefit?.priority;
      const priorityB = b?.benefit?.priority;

      // Handle cases where priority is undefined
      if (priorityA === undefined && priorityB === undefined) {
        return 0;
      }
      if (priorityA === undefined) {
        return 1;
      }
      if (priorityB === undefined) {
        return -1;
      }

      return priorityA - priorityB;
    });

    // Categorize benefits based on parent label
    array2?.map((item) => {
      if (item?.benefit?.parentLabel == "Medical Network") {
        topToShow?.push(item);
      } else if (item?.benefit?.parentLabel == "Dental Benefits") {
        dentalCoverages?.push(item);
      } else if (item?.benefit?.name == "Medical Network") {
        mediCalNetwork?.push(item);
      } else if (item?.benefit?.parentLabel == "Maternity Benefits") {
        maternityCoverages?.push(item);
      } else if (item?.benefit?.parentLabel == "Benefits Guide") {
        guideCoverages?.push(item);
      } else {
        otherCoverages?.push(item);
      }
    });

    settopToshowList(topToShow);
    setOtherCoveragesList(otherCoverages);
    setMaternityCoveragesList(maternityCoverages);
    setGuideCoveragesList(guideCoverages);
    setDentalCoveragesList(dentalCoverages);
    setMedicalNetworkList(mediCalNetwork);
    setbenefitList(array2);

    return () => {
      //remove halthcompaeplan id from session storage
      sessionStorage?.removeItem("healthComparePlan");
    };
  }, [healthCompareDetails]);

  const onMouseEnterHandler = (planId = "", benefitId = "") => {
    if (hoverCell != `${planId}/${benefitId}`) {
      setHoverCell(`${planId}/${benefitId}`);
    }
  };

  const onMouseLeaveHandler = (planId = "", benefitId = "") => {
    if (hoverCell == `${planId}/${benefitId}`) {
      setHoverCell("");
    }
  };

  const [selectedBenefitDetail, setSelectedBenefitDetail] = useState(null);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState(null);
  const [selectedBenefitId, setSelectedBenefitId] = useState(null);

  // on edit benefit click
  const onEditBenefitHandler = ({ cell, plan, benefit, benefitId }) => {
    setEditbenefitModal(true);
    setSelectedPlanDetail(plan);
    setSelectedBenefitDetail(benefit);
    setSelectedBenefitId(benefitId);
  };

  //Edit premium Handler
  const onEditPremiumHandler = ({ cell, plan }) => {
    if (plan?.editPrice?.length >= 3) {
      toast.error("Maximum editable limit exceeded!");
      return;
    }
    setSelectedPlanDetail(plan);
    setOpenEditModal(true);
  };

  //Edit Benefits Handler
  const onSubmitBtnHandler = (value) => {
    let payload = {};
    if (selectedBenefitDetail?.coPay?.description) {
      payload = {
        benefit: {
          benefit: selectedBenefitDetail?.benefit?._id || selectedBenefitId,
          isEnabled: true,
          description: value?.benefitValue,
          coPay: {
            description: value?.benefitValue,
          },
        },
        healthQuoteId: selectedPlanDetail?._id,
        plan: selectedPlanDetail?.plan?._id,
      };
    } else if (selectedBenefitDetail?.coverage?.description) {
      payload = {
        benefit: {
          benefit: selectedBenefitDetail?.benefit?._id || selectedBenefitId,
          isEnabled: true,
          description: value?.benefitValue,
          coverage: {
            description: value?.benefitValue,
          },
        },
        healthQuoteId: selectedPlanDetail?._id,
        plan: selectedPlanDetail?.plan?._id,
      };
    } else {
      payload = {
        benefit: {
          benefit: selectedBenefitDetail?.benefit?._id || selectedBenefitId,
          isEnabled: true,
          description: value?.benefitValue,
          detail: {
            description: value?.benefitValue,
          },
        },
        healthQuoteId: selectedPlanDetail?._id,
        plan: selectedPlanDetail?.plan?._id,
      };
    }

    setIsLoading(true);
    //edit Health Insurance Benefits Api
    dispatch(edithealthInsuranceBenefitsById(payload))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success("successfully updated!");
          setEditbenefitModal(false);
          handleCompare();
          setIsLoading(false);
        } else {
          toast?.error("Something went wrong");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setIsLoading(false);
      });
  };

  const downloadPdf = () => {
    setIsLoading(true);
    let ids = [];
    healthCompareDetails?.map((item) => {
      ids?.push(item?._id);
    });

    //Dolonload Comapre Pdf Api
    dispatch(downloadHealthComparePDF({ id: healthCompareDetails?.[0]?.internalRef, data: { ids: ids } }))
      .unwrap()
      .then((res) => {
        setIsLoading(false);
        let pdfUrl = `${baseURL}${res?.data?.link}`;
        setPDFLink(pdfUrl);
        setSharePDFModal(true);
      })
      .catch((err) => {
        console.log(err);
        toast?.error(err);
        setIsLoading(false);
      });
  };
  //Dolonload Comapre Excel handler
  const downloadExcel = () => {
    setIsLoading(true);
    let ids = [];
    healthCompareDetails?.map((item) => {
      ids?.push(item?._id);
    });

    dispatch(downloadHealthCompareEcxel({ id: healthCompareDetails?.[0]?.internalRef, data: { ids: ids } }))
      .unwrap()
      .then((res) => {
        let pdfUrl = `${baseURL}${res?.data}`;

        setIsLoading(false);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(link);
        link.click();
        link.remove();
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
              {healthCompareDetails && (
                <Box sx={{ pt: { xs: 2 } }} id="pdfContent">
                  <Container disableGutters sx={{ backgroundColor: "white", maxWidth: "unset !important" }}>
                    <TableContainer component={Paper}>
                      <Table sx={{ borderCollapse: "collapse" }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ border: "2px solid grey" }}></TableCell>
                            {healthCompareDetails?.map((item, index) => (
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
                                        item?.companyData?.logoImg?.path
                                          ? `${URL}/${item?.companyData?.logoImg?.path}`
                                          : P1
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
                                      {item?.companyData?.companyName}
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
                                  textTransform: "capitalize",
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  color: "#000 ",
                                }}
                              >
                                Premium (Exl. Vat)
                              </Typography>
                            </TableCell>
                            {healthCompareDetails?.map((item, index) => {
                              let isHover = false;
                              if (hoverCell == `${item?._id}/premium`) {
                                isHover = true;
                              }
                              return (
                                <TableCell
                                  onMouseEnter={
                                    moduleAccess(user, "healthQuote.update")
                                      ? () => onMouseEnterHandler(item?._id, "premium")
                                      : undefined
                                  }
                                  onMouseLeave={
                                    moduleAccess(user, "healthQuote.update")
                                      ? () => onMouseLeaveHandler(item?._id, "premium")
                                      : undefined
                                  }
                                  key={index}
                                  align="center"
                                  sx={{ border: "2px solid grey", position: "relative" }}
                                >
                                  <Box>
                                    {isHover && (
                                      <Box
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        sx={{ position: `absolute`, top: 0, right: 0 }}
                                      >
                                        <IconButton
                                          onClick={() =>
                                            onEditPremiumHandler({
                                              cell: `${item?._id}/premium`,
                                              plan: item,
                                            })
                                          }
                                        >
                                          <EditIcon sx={{ color: `#707070`, cursor: `pointer` }} />
                                        </IconButton>
                                      </Box>
                                    )}
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
                                  </Box>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                          {healthCompareDetails?.[0]?.owner?.length > 0 ? (
                            <TableRow sx={{ backgroundColor: "#FAF7FA" }}>
                              <TableCell align="center" sx={{ border: "2px solid grey" }}>
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  sx={{
                                    textTransform: "none",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "#000 ",
                                  }}
                                >
                                  {`Self (${healthCompareDetails?.[0]?.owner?.[0]?.person?.fullName})`}
                                </Typography>
                              </TableCell>
                              {healthCompareDetails?.map((item, index) => (
                                <>
                                  {item?.owner?.map((owner, ownerIndex) => {
                                    let isHover = false;
                                    if (hoverCell == `${item?._id}/self`) {
                                      isHover = true;
                                    }
                                    return (
                                      <TableCell
                                        onMouseEnter={
                                          moduleAccess(user, "healthQuote.update")
                                            ? () => onMouseEnterHandler(item?._id, "self")
                                            : undefined
                                        }
                                        onMouseLeave={
                                          moduleAccess(user, "healthQuote.update")
                                            ? () => onMouseLeaveHandler(item?._id, "self")
                                            : undefined
                                        }
                                        key={index}
                                        align="center"
                                        sx={{ border: "2px solid grey", position: "relative" }}
                                      >
                                        <Box>
                                          {isHover && (
                                            <Box
                                              TransitionComponent={Fade}
                                              TransitionProps={{ timeout: 600 }}
                                              sx={{ position: `absolute`, top: 0, right: 0 }}
                                            >
                                              <IconButton
                                                onClick={() =>
                                                  onEditPremiumHandler({
                                                    cell: `${item?._id}/self`,
                                                    plan: item,
                                                  })
                                                }
                                              >
                                                <EditIcon sx={{ color: `#707070`, cursor: `pointer` }} />
                                              </IconButton>
                                            </Box>
                                          )}
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
                                              : `AED ${formatNumber(owner?.premium + (owner?.loadSum || 0))}`}
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                    );
                                  })}
                                </>
                              ))}
                            </TableRow>
                          ) : (
                            <></>
                          )}
                          {healthCompareDetails?.[0]?.spouse?.length > 0 ? (
                            <TableRow sx={{ backgroundColor: "#FAF7FA" }}>
                              <TableCell align="center" sx={{ border: "2px solid grey" }}>
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  sx={{
                                    textTransform: "none",
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    color: "#000 ",
                                  }}
                                >
                                  {`Spouse (${healthCompareDetails?.[0]?.spouse?.[0]?.person?.fullName})`}
                                </Typography>
                              </TableCell>
                              {healthCompareDetails?.map((item, index) => (
                                <>
                                  {item?.spouse.map((spouse, spouseIndex) => {
                                    let isHover = false;
                                    if (hoverCell == `${item?._id}/spouse`) {
                                      isHover = true;
                                    }
                                    return (
                                      <TableCell
                                        onMouseEnter={
                                          moduleAccess(user, "healthQuote.update")
                                            ? () => onMouseEnterHandler(item?._id, "spouse")
                                            : undefined
                                        }
                                        onMouseLeave={
                                          moduleAccess(user, "healthQuote.update")
                                            ? () => onMouseLeaveHandler(item?._id, "spouse")
                                            : undefined
                                        }
                                        key={spouseIndex}
                                        align="center"
                                        sx={{ border: "2px solid grey", position: "relative" }}
                                      >
                                        <Box>
                                          {isHover && (
                                            <Box
                                              TransitionComponent={Fade}
                                              TransitionProps={{ timeout: 600 }}
                                              sx={{ position: `absolute`, top: 0, right: 0 }}
                                            >
                                              <IconButton
                                                onClick={() =>
                                                  onEditPremiumHandler({
                                                    cell: `${item?._id}/spouse`,
                                                    plan: item,
                                                  })
                                                }
                                              >
                                                <EditIcon sx={{ color: `#707070`, cursor: `pointer` }} />
                                              </IconButton>
                                            </Box>
                                          )}
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
                                              : `AED ${formatNumber(spouse?.premium + (spouse?.loadSum || 0))}`}
                                          </Typography>
                                        </Box>
                                      </TableCell>
                                    );
                                  })}
                                </>
                              ))}
                            </TableRow>
                          ) : (
                            <></>
                          )}
                          {healthCompareDetails?.[0]?.kids?.length > 0 ? (
                            <>
                              {healthCompareDetails?.[0]?.kids?.map((kid, idx) => {
                                return (
                                  <TableRow>
                                    <TableCell align="center" sx={{ border: "2px solid grey" }}>
                                      <Typography
                                        variant="h4"
                                        gutterBottom
                                        sx={{
                                          textTransform: "none",
                                          fontSize: "13px",
                                          fontWeight: "700",
                                          color: "#000 ",
                                        }}
                                      >
                                        {`Kids (${kid?.person?.fullName})`}
                                      </Typography>
                                    </TableCell>
                                    {healthCompareDetails?.map((item, index) => {
                                      let isHover = false;
                                      if (hoverCell == `${item?._id}/kid${idx}`) {
                                        isHover = true;
                                      }
                                      return (
                                        <TableCell
                                          onMouseEnter={
                                            moduleAccess(user, "healthQuote.update")
                                              ? () => onMouseEnterHandler(item?._id, `kid${idx}`)
                                              : undefined
                                          }
                                          onMouseLeave={
                                            moduleAccess(user, "healthQuote.update")
                                              ? () => onMouseLeaveHandler(item?._id, `kid${idx}`)
                                              : undefined
                                          }
                                          key={index}
                                          align="center"
                                          sx={{ border: "2px solid grey", position: "relative" }}
                                        >
                                          {isHover && (
                                            <Box
                                              TransitionComponent={Fade}
                                              TransitionProps={{ timeout: 600 }}
                                              sx={{ position: `absolute`, top: 0, right: 0 }}
                                            >
                                              <IconButton
                                                onClick={() =>
                                                  onEditPremiumHandler({
                                                    cell: `${item?._id}/kid${idx}`,
                                                    plan: item,
                                                  })
                                                }
                                              >
                                                <EditIcon sx={{ color: `#707070`, cursor: `pointer` }} />
                                              </IconButton>
                                            </Box>
                                          )}
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
                                              : `AED ${formatNumber(
                                                  item?.kids?.[idx]?.premium + (item?.kids?.[idx]?.loadSum || 0)
                                                )}`}
                                          </Typography>
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                            </>
                          ) : (
                            <></>
                          )}
                        </TableHead>
                        <TableBody>
                          {medicalNetwork?.length > 0 && (
                            <>
                              {medicalNetwork?.map((ele, idx) => (
                                <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA" }}>
                                  <TableCell
                                    align="center"
                                    sx={{ border: "2px solid grey", color: "#000", fontWeight: 700 }}
                                  >
                                    {ele?.benefit?.name}
                                  </TableCell>
                                  {healthCompareDetails?.map((item, index) => {
                                    const match = [...item?.includedCovers, ...item?.extraCovers]?.find(
                                      (i) => i?.benefit?._id === ele?.benefit?._id
                                    );
                                    return (
                                      <TableCell key={index} align="center" sx={{ border: "2px solid grey" }}>
                                        {match?.isEnabled ? (
                                          <>
                                            {match?.benefit?.valueType === "object" ? (
                                              <Box>
                                                {Object.entries(match?.detail || {}).map(
                                                  ([key, value]) =>
                                                    key === "description" && (
                                                      <Box key={key}>
                                                        <Typography
                                                          sx={{ fontSize: "13px", fontWeight: 550, color: "#000 " }}
                                                          color="textSecondary"
                                                          variant="body2"
                                                          dangerouslySetInnerHTML={{ __html: value }}
                                                        ></Typography>
                                                      </Box>
                                                    )
                                                )}
                                              </Box>
                                            ) : (
                                              <Box>
                                                <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#000 " }}>
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
                            </>
                          )}
                          {guideCoveragesList?.length > 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={healthCompareDetails?.length + 1}
                                sx={{ backgroundColor: "#E5D6E6", border: "2px solid grey" }}
                              >
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontSize: "15px", fontWeight: "bold", color: "#60176F" }}
                                >
                                  Benefits Guide
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <div></div>
                          )}
                          {guideCoveragesList?.map((ele, idx) => (
                            <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA" }}>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid grey", color: "#000", fontWeight: 700 }}
                              >
                                {ele?.benefit?.name}
                              </TableCell>
                              {healthCompareDetails?.map((item, index) => {
                                const match = [...item?.includedCovers, ...item?.extraCovers]?.find(
                                  (i) => i?.benefit?._id === ele?.benefit?._id
                                );
                                let isHover = false;
                                if (hoverCell == `${item?._id}/${ele?.benefit?._id}`) {
                                  isHover = true;
                                }
                                return (
                                  <TableCell
                                    onMouseEnter={
                                      moduleAccess(user, "healthQuote.update")
                                        ? () => onMouseEnterHandler(item?._id, ele?.benefit?._id)
                                        : undefined
                                    }
                                    onMouseLeave={
                                      moduleAccess(user, "healthQuote.update")
                                        ? () => onMouseLeaveHandler(item?._id, ele?.benefit?._id)
                                        : undefined
                                    }
                                    key={index}
                                    align="center"
                                    sx={{ border: "2px solid grey", position: "relative" }}
                                  >
                                    <Box>
                                      {isHover && (
                                        <Box
                                          TransitionComponent={Fade}
                                          TransitionProps={{ timeout: 600 }}
                                          sx={{ position: `absolute`, top: 0, right: 0 }}
                                        >
                                          <IconButton
                                            onClick={() =>
                                              onEditBenefitHandler({
                                                cell: `${item?._id}/${match?.benefit?._id}`,
                                                plan: item,
                                                benefit: match,
                                                benefitId: match?.benefit?._id || ele?.benefit?._id,
                                              })
                                            }
                                          >
                                            <EditIcon sx={{ color: `#707070`, cursor: `pointer` }} />
                                          </IconButton>
                                        </Box>
                                      )}
                                      {match?.isEnabled ? (
                                        <Box>
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
                                                          fontWeight: 700,
                                                          color: "#000 ",
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
                                                  fontWeight: 700,
                                                  color: "#000 ",
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
                                        </Box>
                                      ) : (
                                        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 1 }}>
                                          <ClearIcon sx={{ color: "red" }} />
                                        </Box>
                                      )}
                                    </Box>
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                          <TableRow>
                            {maternityCoveragesList?.length > 0 ? (
                              <TableCell
                                colSpan={healthCompareDetails?.length + 1}
                                sx={{ backgroundColor: "#E5D6E6", border: "2px solid grey" }}
                              >
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontSize: "15px", fontWeight: "bold", color: "#60176F" }}
                                >
                                  Maternity Benefits
                                </Typography>
                              </TableCell>
                            ) : (
                              <div></div>
                            )}
                          </TableRow>
                          {maternityCoveragesList?.map((ele, idx) => (
                            <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA" }}>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid grey", color: "#000", fontWeight: 700 }}
                              >
                                {ele?.benefit?.name}
                              </TableCell>
                              {healthCompareDetails?.map((item, index) => {
                                const match = [...item?.includedCovers, ...item?.extraCovers]?.find(
                                  (i) => i?.benefit?._id === ele?.benefit?._id
                                );
                                let isHover = false;
                                if (hoverCell == `${item?._id}/${ele?.benefit?._id}`) {
                                  isHover = true;
                                }
                                return (
                                  <TableCell
                                    onMouseEnter={
                                      moduleAccess(user, "healthQuote.update")
                                        ? () => onMouseEnterHandler(item?._id, ele?.benefit?._id)
                                        : undefined
                                    }
                                    onMouseLeave={
                                      moduleAccess(user, "healthQuote.update")
                                        ? () => onMouseLeaveHandler(item?._id, ele?.benefit?._id)
                                        : undefined
                                    }
                                    key={index}
                                    align="center"
                                    sx={{ border: "2px solid grey", position: "relative" }}
                                  >
                                    <Box>
                                      {isHover && (
                                        <Box
                                          TransitionComponent={Fade}
                                          TransitionProps={{ timeout: 600 }}
                                          sx={{ position: `absolute`, top: 0, right: 0 }}
                                        >
                                          <IconButton
                                            onClick={() =>
                                              onEditBenefitHandler({
                                                cell: `${item?._id}/${match?.benefit?._id}`,
                                                plan: item,
                                                benefit: match,
                                                benefitId: match?.benefit?._id || ele?.benefit?._id,
                                              })
                                            }
                                          >
                                            <EditIcon sx={{ color: `#707070`, cursor: `pointer` }} />
                                          </IconButton>
                                        </Box>
                                      )}
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
                                                          fontWeight: 550,
                                                          color: "#000 ",
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
                                    </Box>
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                          <TableRow>
                            {dentalCoveragesList?.length > 0 ? (
                              <TableCell
                                colSpan={healthCompareDetails?.length + 1}
                                sx={{ backgroundColor: "#E5D6E6", border: "2px solid grey" }}
                              >
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontSize: "15px", fontWeight: "bold", color: "#60176F" }}
                                >
                                  Dental Benefits
                                </Typography>
                              </TableCell>
                            ) : (
                              <div></div>
                            )}
                          </TableRow>
                          {dentalCoveragesList?.map((ele, idx) => (
                            <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA" }}>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid grey", color: "#000", fontWeight: 700 }}
                              >
                                {ele?.benefit?.name}
                              </TableCell>
                              {healthCompareDetails?.map((item, index) => {
                                const match = [...item?.includedCovers, ...item?.extraCovers]?.find(
                                  (i) => i?.benefit?._id === ele?.benefit?._id
                                );
                                let isHover = false;
                                if (hoverCell == `${item?._id}/${ele?.benefit?._id}`) {
                                  isHover = true;
                                }
                                return (
                                  <TableCell
                                    key={index}
                                    align="center"
                                    sx={{ border: "2px solid grey", position: "relative" }}
                                    onMouseEnter={
                                      moduleAccess(user, "healthQuote.update")
                                        ? () => onMouseEnterHandler(item?._id, ele?.benefit?._id)
                                        : undefined
                                    }
                                    onMouseLeave={
                                      moduleAccess(user, "healthQuote.update")
                                        ? () => onMouseLeaveHandler(item?._id, ele?.benefit?._id)
                                        : undefined
                                    }
                                  >
                                    <Box>
                                      {isHover && (
                                        <Box
                                          TransitionComponent={Fade}
                                          TransitionProps={{ timeout: 600 }}
                                          sx={{ position: `absolute`, top: 0, right: 0 }}
                                        >
                                          <IconButton
                                            onClick={() =>
                                              onEditBenefitHandler({
                                                cell: `${item?._id}/${match?.benefit?._id}`,
                                                plan: item,
                                                benefit: match,
                                                benefitId: match?.benefit?._id || ele?.benefit?._id,
                                              })
                                            }
                                          >
                                            <EditIcon sx={{ color: `#707070`, cursor: `pointer` }} />
                                          </IconButton>
                                        </Box>
                                      )}
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
                                                  fontWeight: 550,
                                                  color: "#000",
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
                                    </Box>
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))}
                          <TableRow>
                            {otherCoveragesList?.length > 0 ? (
                              <TableCell
                                colSpan={healthCompareDetails?.length + 1}
                                sx={{ backgroundColor: "#E5D6E6", border: "2px solid grey" }}
                              >
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontSize: "15px", fontWeight: "bold", color: "#60176F" }}
                                >
                                  Other Benefits
                                </Typography>
                              </TableCell>
                            ) : (
                              <div></div>
                            )}
                          </TableRow>
                          {otherCoveragesList?.map((ele, idx) => (
                            <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#FAF7FA" }}>
                              <TableCell
                                align="center"
                                sx={{ border: "2px solid grey", color: "#000", fontWeight: 700 }}
                              >
                                {ele?.benefit?.name}
                              </TableCell>
                              {healthCompareDetails?.map((item, index) => {
                                const match = [...item?.includedCovers, ...item?.extraCovers]?.find(
                                  (i) => i?.benefit?._id === ele?.benefit?._id
                                );
                                let isHover = false;
                                if (hoverCell == `${item?._id}/${ele?.benefit?._id}`) {
                                  isHover = true;
                                }
                                return (
                                  <TableCell
                                    onMouseEnter={
                                      moduleAccess(user, "healthQuote.update")
                                        ? () => onMouseEnterHandler(item?._id, ele?.benefit?._id)
                                        : undefined
                                    }
                                    onMouseLeave={
                                      moduleAccess(user, "healthQuote.update")
                                        ? () => onMouseLeaveHandler(item?._id, ele?.benefit?._id)
                                        : undefined
                                    }
                                    key={index}
                                    align="center"
                                    sx={{ border: "2px solid grey", position: "relative" }}
                                  >
                                    <Box>
                                      {isHover && (
                                        <Box
                                          TransitionComponent={Fade}
                                          TransitionProps={{ timeout: 600 }}
                                          sx={{ position: `absolute`, top: 0, right: 0 }}
                                        >
                                          <IconButton
                                            onClick={() =>
                                              onEditBenefitHandler({
                                                cell: `${item?._id}/${match?.benefit?._id}`,
                                                plan: item,
                                                benefit: match,
                                                benefitId: match?.benefit?._id || ele?.benefit?._id,
                                              })
                                            }
                                          >
                                            <EditIcon sx={{ color: `#707070`, cursor: `pointer` }} />
                                          </IconButton>
                                        </Box>
                                      )}
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
                                    </Box>
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

      {/* Health Share PDF Modal */}
      <ModalComp open={sharePDFModal} handleClose={handleClosePDFShareModal} widths={{ xs: "95%", sm: "500px" }}>
        <HealthSharePDFModal
          handleClosePDFShareModal={handleClosePDFShareModal}
          healthCompareDetails={healthCompareDetails}
          downloadExcel={downloadExcel}
          refId={healthCompareDetails?.[0]?.internalRef}
          setIsLoading={setIsLoading}
          pdfLink={pdfLink}
          handleClose={handleClosePDFShareModal}
        />
      </ModalComp>

      {/* Edit Benefit Modal */}
      <ModalComp
        open={editbenefitModal}
        handleClose={() => setEditbenefitModal(false)}
        widths={{ xs: "95%", sm: "500px" }}
      >
        <EditHealthenefitModal
          onSubmitHadler={onSubmitBtnHandler}
          defaultValue={
            selectedBenefitDetail?.detail?.description ||
            selectedBenefitDetail?.coPay?.description ||
            selectedBenefitDetail?.coverage?.description ||
            ""
          }
          handleClose={() => setEditbenefitModal(false)}
        />
      </ModalComp>

      {/* Edit Premium Modal */}
      <ModalComp open={openEditModal} handleClose={handleCloseEditModal} widths={{ xs: "95%", sm: "95%", md: 600 }}>
        <EditPremiumModal
          handleClose={handleCloseEditModal}
          quote={selectedPlanDetail}
          keyValue={"compare"}
          onSubmitHadler={onEditPremiumHadler}
        />
      </ModalComp>
    </>
  );
};
HealthComparePlan.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthComparePlan;
