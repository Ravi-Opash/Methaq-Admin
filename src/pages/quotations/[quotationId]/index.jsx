import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import NextImage from "next/image";
import { getCustomerQuotationDetailById, updateExtrafeatures } from "src/sections/customer/action/customerAction";
import { toast } from "react-toastify";
import CustomerQuotationDetails from "src/sections/customer/customer-quotation-details";
import { EditIcon } from "src/Icons/EditIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  applyDiscountToProposals,
  checkoutPayment,
  editQuotationProcessingFees,
  getBankListCompanyWise,
  getCarColorListByCompanyId,
  getQuotationListByProposalId,
  getQuotesPaybles,
  payByLink,
  payByTamara,
  purchaseConfirm,
} from "src/sections/Proposals/Action/proposalsAction";
import ModalComp from "src/components/modalComp";
import BuyPolicyModal from "src/sections/customer/BuyPolicyModal";
import { formatNumber } from "src/utils/formatNumber";
import VerifyModal from "src/components/verifyModal";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import Image from "next/image";
import TamaraLogo from "../../../../public/assets/logos/tamara.png";
import NetworkLogo from "../../../../public/assets/logos/NetworkLogo.svg";
import { CrossSvg } from "src/Icons/CrossSvg";
import { moduleAccess } from "src/utils/module-access";
import { SeverityPill } from "src/components/severity-pill";
import { editCustomerQuotationDetails } from "src/sections/customer/reducer/customerSlice";
import TransactionInfoModal from "src/sections/Proposals/transaction-Info-modal";
import NcdDocumentUpload from "src/sections/Proposals/car-ncd-document-mode";
import CarImagesUpload from "src/sections/Proposals/car-images-upload";
import { compareAsc, startOfDay } from "date-fns";
import AnimationLoader from "src/components/amimated-loader";

const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Coverages", value: "coverages" },
];

const Img = styled(NextImage)(({ theme }) => ({
  height: "max-content !important",
}));

const QuatationDetails = () => {
  const router = useRouter();
  const { quotationId } = router.query;
  const dispatch = useDispatch();
  const { customerQuotationDetails, customerQuotationDetailsLoader } = useSelector((state) => state.customer);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const { proposalQuotationList, formLoading, quotePayableDetails, policyFeeLoader, proposalDetail } = useSelector(
    (state) => state.proposals
  );

  const [loading, setLoading] = useState(true);

  const [paymentModel, setPaymentModel] = useState(false);
  const [paidByMethod, setPaidByMethod] = useState("");

  const [isProposalPurchased, setIsProposalPurchased] = useState(false);
  const [transactionRefNo, setTransactionRefNo] = useState("");

  const [transactionRefModalOpen, setTransactionRefModalOpen] = useState(false);
  const HandleTransactionRefModalClose = () => setTransactionRefModalOpen(false);

  const [openNCDddocumentUpload, setOpenNCDddocumentUpload] = useState(false);

  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);

  const [doubleCheckModal, setDoubleCheckModal] = useState(false);
  const handleDoubleCheckModalClose = () => setDoubleCheckModal(false);

  const [editableSellingPrice, setEditableSellingPrice] = useState(false);

  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);

  const [sellingPriceValue, setSellingPriceValue] = useState("");

  const [editableFees, setEditableFees] = useState(false);
  const [editedPolicyFeeValue, serEditedPolicyFeeValue] = useState("");

  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const [requireArray, setrequireArray] = useState([]);

  const [dirctToCompanyModal, setDirctToCompanyModal] = useState(false);
  const handleDirctToCompanyModalClose = () => setDirctToCompanyModal(false);

  const [buttonDisable, setButtonDisable] = useState();
  const [openCarImageUpload, setOpenCarImageUpload] = useState(false);

  const [carImageLeble, setCarImageLeble] = useState("");

  // Function to verify fields
  const verifyFields = () => {
    if (customerQuotationDetails) {
      const missingFields = [];

      // Car require field
      if (!customerQuotationDetails?.carId?.make) missingFields.push("Car Make");
      if (!customerQuotationDetails?.carId?.cylinders) missingFields.push("Car Cylinders");
      if (!customerQuotationDetails?.carId?.model) missingFields.push("Car Model");
      if (!customerQuotationDetails?.carId?.price) missingFields.push("Car Price");
      if (!customerQuotationDetails?.carId?.trim) missingFields.push("Car Trim");
      if (!customerQuotationDetails?.carId?.year) missingFields.push("Car Year");
      if (!customerQuotationDetails?.carId?.bodyType) missingFields.push("Car Body Type");
      if (!customerQuotationDetails?.carId?.regionalSpec) missingFields.push("Car Regional Spec");
      if (!customerQuotationDetails?.carId?.policyEffectiveDate) missingFields.push("Policy Effective Date");
      if (!customerQuotationDetails?.carId?.insuranceExpiryDate) missingFields.push("Insurance Expiry Date");
      if (!customerQuotationDetails?.carId?.currentInsurer) missingFields.push("Current Insurer");
      if (!customerQuotationDetails?.carId?.insureType) missingFields.push("Insure Type");
      if (!customerQuotationDetails?.carId?.typeOfIssues) missingFields.push("Type of Issues");
      if (!customerQuotationDetails?.carId?.registrationEmirate) missingFields.push("Registration Emirate");
      if (!customerQuotationDetails?.carId?.origin) missingFields.push("Car Origin");
      if (!customerQuotationDetails?.carId?.chesisNo) missingFields.push("Chassis Number");
      if (!customerQuotationDetails?.carId?.plateNumber) missingFields.push("Plate Number");
      if (!customerQuotationDetails?.carId?.plateCode) missingFields.push("Plate Code");
      if (!customerQuotationDetails?.carId?.registrationYear) missingFields.push("Registration Year");
      if (!customerQuotationDetails?.carId?.tcNo) missingFields.push("TC Number");
      if (!customerQuotationDetails?.carId?.engineNumber) missingFields.push("Engine Number");
      if (!customerQuotationDetails?.carId?.yearOfNoClaim) missingFields.push("Year of No Claim");
      if (!customerQuotationDetails?.carId?.claimHistory) missingFields.push("Claim History");
      if (!customerQuotationDetails?.carId?.regCardExpiryDate) missingFields.push("Registration Card Expiry Date");
      if (!customerQuotationDetails?.carId?.color) missingFields.push("Car Color");
      if (!customerQuotationDetails?.carId?.noOfPassengers) missingFields.push("Number of Passengers");
      if (!customerQuotationDetails?.carId?.registrationDate) missingFields.push("Registration Issue date");
      // if (!customerQuotationDetails?.carId?.policyNumber) missingFields.push("Current Insurance Policy Number");

      // Customer require field
      if (!customerQuotationDetails?.userId?.fullName) missingFields.push("Customer Full Name");
      if (!customerQuotationDetails?.userId?.arabicName) missingFields.push("Customer Arabic Name");
      if (!customerQuotationDetails?.userId?.gender) missingFields.push("Customer Gender");
      if (!customerQuotationDetails?.userId?.nationality) missingFields.push("Customer Nationality");
      if (!customerQuotationDetails?.userId?.email) missingFields.push("Customer Email");
      if (!customerQuotationDetails?.userId?.dateOfBirth) missingFields.push("Customer Date of Birth");
      if (!customerQuotationDetails?.userId?.maritalStatus) missingFields.push("Customer Marital Status");
      if (!customerQuotationDetails?.userId?.occupation) missingFields.push("Customer Occupation");
      if (!customerQuotationDetails?.userId?.employer) missingFields.push("Customer Employer");
      if (!customerQuotationDetails?.userId?.address) missingFields.push("Driver Address");
      if (!customerQuotationDetails?.userId?.mobileNumber) missingFields.push("Customer Mobile Number");
      if (!customerQuotationDetails?.userId?.emiratesId) missingFields.push("Customer Emirates ID");
      if (!customerQuotationDetails?.userId?.dlTcNo) missingFields.push("Customer DL TC Number");
      if (!customerQuotationDetails?.userId?.emiratesIdExpiryDate) missingFields.push("Emirates ID Expiry Date");
      if (!customerQuotationDetails?.userId?.licenceNo) missingFields.push("Customer Licence Number");
      if (!customerQuotationDetails?.userId?.licenceIssueDate) missingFields.push("Licence Issue Date");
      if (!customerQuotationDetails?.userId?.licenceExpiryDate) missingFields.push("Licence Expiry Date");
      if (!customerQuotationDetails?.userId?.placeOfIssueDL) missingFields.push("Place of Issue DL");

      if (missingFields.length > 0) {
        isFilled = false;
        toast.error(`Please fill in the following fields: ${missingFields.join(", ")}`);
        return false;
      } else {
        isFilled = true;
        return true;
      }
    }
    return false;
  };

  // Check if proposal is purchased
  useEffect(() => {
    if (!!proposalQuotationList) {
      setIsProposalPurchased(false);
      proposalQuotationList.map((quote) => {
        if (quote.isPaid > 0) {
          setIsProposalPurchased(true);
        }
      });
    }
  }, [proposalQuotationList]);

  // Get customer quotation details
  const initializedPolicy = useRef(false);
  const getCustomerQuotationDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedPolicy.current) {
      return;
    }
    initializedPolicy.current = true;
    try {
      dispatch(getCustomerQuotationDetailById(quotationId))
        .unwrap()
        .then((res) => {
          if (!!res?.proposalId) {
            dispatch(
              getQuotationListByProposalId({
                page: "",
                size: "",
                id: res?.proposalId,
              })
            )
              .unwrap()
              .then((res) => {
                // console.log("res", res);
              })
              .catch((err) => {
                toast(err, {
                  type: "error",
                });
              });
          }
          if (res) {
            dispatch(getCarColorListByCompanyId({ companyId: res?.company?._id || res?.companyId?._id }));
          }
        });
      dispatch(getQuotesPaybles({ quoteId: quotationId }));
      dispatch(getBankListCompanyWise(quotationId));
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  // Get customer quotation details
  useEffect(
    () => {
      getCustomerQuotationDetailsHandler();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Tabs
  const [currentTab, setCurrentTab] = useState("overview");
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  // confirm
  const onClickOnConfirm = (paidBy) => {
    if (
      compareAsc(
        new Date(startOfDay(new Date(customerQuotationDetails?.carId?.insuranceExpiryDate))),
        new Date(startOfDay(new Date(customerQuotationDetails?.carId?.policyEffectiveDate)))
      ) === -1 &&
      customerQuotationDetails?.carId?.insuranceExpiryDate &&
      customerQuotationDetails?.carId?.expiredCarPhotos?.length < 3
    ) {
      toast("Current insurance expired! Upload car images to proceed further!", {
        type: "error",
      });
    }
    if (
      !customerQuotationDetails?.carId?.registrationCardP ||
      !customerQuotationDetails?.userId?.drivingLicenseP ||
      !customerQuotationDetails?.userId?.emiratesIdP
    ) {
      toast("Please upload all Documents!", {
        type: "error",
      });
      return;
    }

    if (
      !customerQuotationDetails?.carId?.ncdProofDocument &&
      customerQuotationDetails?.companyId?.companyName === "Fidelity United Motor Insurance" &&
      (customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for One Year" ||
        customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for Two Years" ||
        customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for Three Years" ||
        customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for Four Years" ||
        customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for Five Years")
    ) {
      setOpenNCDddocumentUpload(true);
      return;
    }

    if (
      customerQuotationDetails?.companyId?.companyName === "RAK INSURANCE" &&
      !proposalDetail?.customer?.sourceOfFunds
    ) {
      toast.error("Please Fill KYC form!");
      const element = document.getElementById("motor-kyc-form");
      element?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }

    if (
      customerQuotationDetails?.carId?.insureType === "thirdparty" &&
      customerQuotationDetails?.insuranceType === "comprehensive" &&
      customerQuotationDetails?.carId?.expiredCarPhotos?.length < 3
    ) {
      toast(
        "Please upload at least 3 images of car as your current insurance is Third Party and you want to buy Comprehensive insurance. ",
        {
          type: "error",
        }
      );
      setOpenCarImageUpload(true);
      setCarImageLeble(
        "Please upload at least 3 images of car as your current insurance is Third Party and you want to buy Comprehensive insurance."
      );
      return;
    }

    setLoading(false);
    dispatch(purchaseConfirm({ id: quotationId, data: { paidBy: paidBy } }))
      .then((res) => {
        if (res?.error?.message) {
          toast.error(res.payload);
        } else {
          toast.success("Payment confirmed successfully!");
          dispatch(getCustomerQuotationDetailById(quotationId));
        }
        setLoading(true);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setLoading(true);
      });
  };

  // Selling Price
  const onChnageEditSellingPrice = () => {
    if (sellingPriceValue < 0 || sellingPriceValue > 50000) {
      toast.error("Selling price must be between 0 and 50,000!");
      return;
    }
    dispatch(
      applyDiscountToProposals({
        id: quotationId,
        data: { discountPrice: +sellingPriceValue },
      })
    )
      .unwrap()
      .then((data) => {
        toast.success(data?.message || "Successfully Updated!");
        setEditableSellingPrice(false);
        dispatch(getQuotesPaybles({ quoteId: quotationId }));
        setSellingPriceValue(data?.data?.discountPrice);
      })
      .catch((err) => {
        console.log(err);
        toast(err, {
          type: "error",
        });
        setEditableSellingPrice(false);
      });
  };

  // Pay by link
  const payByLinkHandler = (paidBy) => {
    if (
      compareAsc(
        new Date(startOfDay(new Date(customerQuotationDetails?.carId?.insuranceExpiryDate))),
        new Date(startOfDay(new Date(customerQuotationDetails?.carId?.policyEffectiveDate)))
      ) === -1 &&
      customerQuotationDetails?.carId?.insuranceExpiryDate &&
      customerQuotationDetails?.carId?.expiredCarPhotos?.length < 3
    ) {
      toast("Current insurance expired! Upload car images to proceed further!", {
        type: "error",
      });
      setOpenCarImageUpload(true);
      setCarImageLeble(
        "Current insurance is expired before policy start date, Please Upload at least 3 Images of car to proceed further."
      );
      return;
    }

    if (isProposalPurchased === true) {
      toast("You already bought policy for this proposal!", {
        type: "error",
      });
    } else if (
      !customerQuotationDetails?.carId?.registrationCardP ||
      !customerQuotationDetails?.userId?.drivingLicenseP ||
      !customerQuotationDetails?.userId?.emiratesIdP
    ) {
      toast("Please upload all Documents!", {
        type: "error",
      });
    } else if (!verifyFields()) {
      return;
    } else if (
      !customerQuotationDetails?.carId?.ncdProofDocument &&
      customerQuotationDetails?.companyId?.companyName === "Fidelity United Motor Insurance" &&
      (customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for One Year" ||
        customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for Two Years" ||
        customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for Three Years" ||
        customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for Four Years" ||
        customerQuotationDetails?.carId?.yearOfNoClaim === "No Claims for Five Years")
    ) {
      setOpenNCDddocumentUpload(true);
      return;
    } else if (
      customerQuotationDetails?.companyId?.companyName === "RAK INSURANCE" &&
      !proposalDetail?.customer?.sourceOfFunds
    ) {
      toast.error("Please Fill KYC form!");
      const element = document.getElementById("motor-kyc-form");
      element?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    } else if (
      customerQuotationDetails?.carId?.insureType === "thirdparty" &&
      customerQuotationDetails?.insuranceType === "comprehensive" &&
      customerQuotationDetails?.carId?.expiredCarPhotos?.length < 3
    ) {
      toast(
        "Please upload at least 3 images of car as your current insurance is Third Party and you want to buy Comprehensive insurance. ",
        {
          type: "error",
        }
      );
      setOpenCarImageUpload(true);
      setCarImageLeble(
        "Please upload at least 3 images of car as your current insurance is Third Party and you want to buy Comprehensive insurance."
      );
      return;
    } else {
      if (paidBy?.paidBy == "link") {
        // setVerifyModal(true);
        setPaidByMethod(paidBy?.paidBy);
        setDoubleCheckModal(true);
        return;
      }
      if (paidBy?.paidBy == "CRM - Direct to insurance company" && quotePayableDetails?.policyFee != "0") {
        setDirctToCompanyModal(true);
        setPaidByMethod(paidBy?.paidBy);
        return;
      } else if (paidBy?.paidBy == "CRM - Direct to insurance company") {
        setrequireArray(["proofAmount", "proofOfPayment", "transactionRefNo"]);
      }
      if (paidBy?.paidBy == "CRM - Bank transfer") {
        setDoubleCheckModal(true);
        // setrequireArray(["transactionRefNo"]);
        setPaidByMethod(paidBy?.paidBy);
        return;
      }
      setTransactionRefModalOpen(true);
      setPaidByMethod(paidBy?.paidBy);
    }
  };

  // Submit Transaction Reference
  const handleSubmitRefNo = (data) => {
    setLoading(false);
    dispatch(
      payByLink({
        id: quotationId,
        data: data,
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.error?.message) {
          toast.error(res.payload);
        } else {
          toast.success("Payment confirmed successfully!");
          dispatch(getCustomerQuotationDetailById(quotationId));
        }
        setLoading(true);
        HandleTransactionRefModalClose();
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setLoading(true);
      });
  };

  // Pay by link
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(checkoutPayment({ quoteId: quotationId, paidBy: "CRM - Link" }))
      .unwrap()
      .then((data) => {
        handleCloseVerifymodal();
        setPaymentLinkInfo(data);
        setPaymentLinkShareModal(true);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
        toast(err, {
          type: "error",
        });
        setLoading(true);
        handleCloseVerifymodal();
      });
  };

  // Pay by Tamara
  const onPayByTamara = () => {
    setLoading(false);
    dispatch(payByTamara({ quoteId: quotationId, paidBy: "CRM - Tamara" }))
      .unwrap()
      .then((data) => {
        handleCloseVerifymodal();
        setPaymentLinkInfo(data);
        setPaymentLinkShareModal(true);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
        toast(err, {
          type: "error",
        });
        setLoading(true);
        handleCloseVerifymodal();
      });
  };

  // Edit Processing Fees
  const onChnageEditProcessingFees = () => {
    let policyFees;
    if (!!editedPolicyFeeValue) {
      policyFees = editedPolicyFeeValue;
    } else if (editedPolicyFeeValue === 0) {
      policyFees = editedPolicyFeeValue;
    } else {
      policyFees = quotePayableDetails?.policyFee;
    }

    dispatch(
      editQuotationProcessingFees({
        quoteId: quotationId,
        adminFees: policyFees,
      })
    )
      .unwrap()
      .then((data) => {
        setEditableFees(false);
        dispatch(getQuotesPaybles({ quoteId: quotationId }));
      })
      .catch((err) => {
        console.log(err);
        toast(err, {
          type: "error",
        });
        setEditableFees(false);
      });
  };

  // Edit Extra Features
  const onSelectFeature = (item) => {
    if (item?.Amount == 0) {
      toast.error("It's free coverage/Benefits, You can not remove this!");
      return;
    }
    const match = customerQuotationDetails?.extraFeatures?.find((i) => i?.Code == item?.Code);
    let array = [];
    if (!!match) {
      array = customerQuotationDetails?.extraFeatures?.filter((i) => i?.Code != item?.Code);
      dispatch(updateExtrafeatures({ id: quotationId, data: { addOns: [], extraFeatures: array || [] } }))
        .unwrap()
        .then((res) => {
          toast.success("Successfully removed!");
          dispatch(
            editCustomerQuotationDetails({
              ...customerQuotationDetails,
              ...res,
              carId: customerQuotationDetails?.carId,
              userId: customerQuotationDetails?.userId,
            })
          );
          dispatch(getQuotesPaybles({ quoteId: quotationId }));
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      array = [...customerQuotationDetails?.extraFeatures, item];
      dispatch(updateExtrafeatures({ id: quotationId, data: { addOns: [], extraFeatures: array || [] } }))
        .unwrap()
        .then((res) => {
          toast.success("Successfully added!");
          dispatch(
            editCustomerQuotationDetails({
              ...customerQuotationDetails,
              ...res,
              carId: customerQuotationDetails?.carId,
              userId: customerQuotationDetails?.userId,
            })
          );
          dispatch(getQuotesPaybles({ quoteId: quotationId }));
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    // if()
  };

  // Double Check
  const handleDoubleCheckProceed = () => {
    if (paidByMethod == "CRM - Bank transfer") {
      setrequireArray(["transactionRefNo"]);
      setTransactionRefModalOpen(true);
      setPaidByMethod(paidByMethod);
    }
    if (paidByMethod == "link") {
      setPaidByMethod(paidByMethod);
      setVerifyModal(true);
    }
    handleDoubleCheckModalClose();
  };

  // Duplicate and Fake can't able for any action
  useEffect(() => {
    if (
      proposalDetail?.proposalStatus?.proposalStatus === "Lost" &&
      (proposalDetail?.proposalStatus?.reason === "Fake inquiry" ||
        proposalDetail?.proposalStatus?.reason === "Duplicate Proposal")
    ) {
      setButtonDisable(true);
    } else {
      setButtonDisable(false);
    }
  }, [proposalDetail?.proposalStatus]);

  return (
    <>
      {paymentModel && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={paymentModel}>
            {paymentModel && (
              <Box
                sx={{
                  width: { xs: "95%", sm: "80%", md: "44rem" },
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  borderRadius: "0.75rem",
                  boxShadow: 24,
                  p: { xs: 0, sm: 4 },
                }}
              >
                <BuyPolicyModal quoteId={quotationId} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    p: { xs: 2, sm: "unset" },
                    gap: 1,
                  }}
                  mt={3}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setPaymentModel(false);
                      dispatch(getCustomerQuotationDetailById(quotationId));
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            )}
          </Backdrop>
        </>
      )}
      {(!loading || formLoading) && (
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
              <Box sx={{ cursor: "pointer" }} onClick={() => router.back()}>
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

          {customerQuotationDetailsLoader ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "10rem !important",
              }}
            >
              {/* <CircularProgress /> */}
              <AnimationLoader open={!!customerQuotationDetailsLoader} />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  m: "auto",
                  border: "1px solid #E6E6E6",
                  backgroundColor: "#FFF",
                  borderRadius: "10px",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    // sx={{ mt: 3 }}
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                    sx={{
                      "& button": {
                        padding: { xs: "16px 10px", sm: "16px 20px" },
                        ml: "0 !important",
                      },
                    }}
                  >
                    {tabs.map((tab) => (
                      <Tab key={tab.value} label={tab.label} value={tab.value} />
                    ))}
                  </Tabs>

                  <Box sx={{ mt: 3, display: "inline-block", width: "100%" }}>
                    {currentTab === "overview" &&
                      (customerQuotationDetails ? (
                        <CustomerQuotationDetails
                          setOpenCarImageUpload={setOpenCarImageUpload}
                          setCarImageLeble={setCarImageLeble}
                        />
                      ) : (
                        <div>No data found..</div>
                      ))}

                    {currentTab === "coverages" && (
                      <>
                        {customerQuotationDetails ? (
                          <Box sx={{ display: "inline-block", width: "100%" }}>
                            {customerQuotationDetails?.response?.IncludedFeatures.length > 0 && (
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    mb: 1,
                                    width: "100%",
                                    fontWeight: "600",
                                    fontSize: "18px",
                                    display: "inline-block",
                                    color: "#60176F",
                                    p: 1.5,
                                    px: 2,
                                    backgroundColor: "#f5f5f5",
                                  }}
                                >
                                  Coverage
                                </Typography>

                                <Grid
                                  container
                                  rowSpacing={1}
                                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                  sx={{
                                    px: "14px",
                                    flexDirection: { xs: "column", md: "row" },
                                    width: "100%",
                                  }}
                                >
                                  {customerQuotationDetails?.response?.IncludedFeatures.length > 0 &&
                                    customerQuotationDetails?.response?.IncludedFeatures?.map((val, idx) => {
                                      console.log(val, "val");
                                      return (
                                        <>
                                          <Grid item xs={12} md={6} sx={{ my: 2 }}>
                                            <Box sx={{ display: "flex", gap: 1 }}>
                                              <Img
                                                src={
                                                  val?.coverageDetail?.image?.path
                                                    ? process.env.NEXT_PUBLIC_BASE_URL +
                                                      "/" +
                                                      val?.coverageDetail?.image?.path
                                                    : "/assets/car.png"
                                                }
                                                alt="car"
                                                width={45}
                                                height={45}
                                              />

                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  flexWrap: "wrap",
                                                  gap: 1,
                                                  mt: 1,
                                                }}
                                              >
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                  <Typography
                                                    variant="h4"
                                                    sx={{
                                                      m: 0,
                                                      color: "#000000",
                                                      fontSize: {
                                                        xs: "12px",
                                                        sm: "14px",
                                                        xl: "16px",
                                                      },
                                                      lineHeight: {
                                                        xs: "13px",
                                                        sm: "16px",
                                                        xl: "19px",
                                                      },
                                                      fontWeight: "500",
                                                    }}
                                                  >
                                                    {val?.Title}
                                                  </Typography>
                                                  <SeverityPill
                                                    color={"success"}
                                                    fontSize={10}
                                                    sx={{
                                                      cursor: "pointer",
                                                      mt: 0.2,
                                                    }}
                                                  >
                                                    {"Covered | Free"}
                                                  </SeverityPill>
                                                </Box>
                                                {val?.coverageDetail?.description && (
                                                  <Typography
                                                    variant="h4"
                                                    sx={{
                                                      color: "#8B8E8B",
                                                      fontSize: {
                                                        xs: "12px",
                                                        sm: "14px",
                                                        xl: "16px",
                                                      },
                                                      lineHeight: {
                                                        xs: "15px",
                                                        sm: "19px",
                                                        xl: "24px",
                                                      },
                                                      fontWeight: "300",
                                                    }}
                                                  >
                                                    {val?.coverageDetail?.description
                                                      ? val?.coverageDetail?.description
                                                      : ""}
                                                  </Typography>
                                                )}
                                                <Typography
                                                  variant="h4"
                                                  sx={{
                                                    color: "#60176F",
                                                    fontSize: {
                                                      xs: "10px",
                                                      sm: "12px",
                                                      xl: "12px",
                                                    },
                                                    fontWeight: "300",
                                                  }}
                                                >
                                                  {/* {val?.Value
                                                    ? val?.Value === 0
                                                      ? ""
                                                      : "AED" + " " + formatNumber(val?.Amount)
                                                    : ""} */}
                                                  {val?.Value ? val?.Value : "AED" + " " + formatNumber(val?.Amount)}
                                                </Typography>
                                              </Box>
                                            </Box>
                                          </Grid>
                                        </>
                                      );
                                    })}
                                </Grid>
                              </Box>
                            )}

                            {customerQuotationDetails?.response?.ExtraFeatures.length > 0 && (
                              <Box sx={{ display: "inline-block", width: "100%" }}>
                                <Divider />
                                <Box
                                  sx={{
                                    py: 2,
                                    display: "inline-block",
                                    width: "100%",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                      width: "100%",
                                      mb: 1,
                                      fontWeight: "600",
                                      fontSize: "18px",
                                      display: "inline-block",
                                      color: "#60176F",
                                      p: 1.5,
                                      px: 2,
                                      backgroundColor: "#f5f5f5",
                                    }}
                                  >
                                    Benefits
                                  </Typography>

                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3, xl: 12 }}
                                    sx={{
                                      px: "14px",
                                      flexDirection: {
                                        xs: "column",
                                        md: "row",
                                      },
                                      width: "100%",
                                    }}
                                  >
                                    {customerQuotationDetails?.response?.ExtraFeatures.length > 0 &&
                                      customerQuotationDetails?.response?.ExtraFeatures?.map((val, idx) => {
                                        let isEnable = false;
                                        const match = customerQuotationDetails?.extraFeatures?.find(
                                          (i) => i?.Code == val?.Code
                                        );
                                        if (match) {
                                          isEnable = true;
                                        }
                                        return (
                                          <>
                                            <Grid item xs={12} md={6} sx={{ my: 2 }}>
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "start",
                                                  justifyContent: "space-between",
                                                }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    mt: 1,
                                                  }}
                                                >
                                                  <Img
                                                    src={
                                                      val?.benifitDetail?.image?.path
                                                        ? process.env.NEXT_PUBLIC_BASE_URL +
                                                          "/" +
                                                          val?.benifitDetail?.image?.path
                                                        : "/assets/car.png"
                                                    }
                                                    alt="car"
                                                    width={45}
                                                    height={45}
                                                  />

                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      flexDirection: "column",
                                                      flexWrap: "wrap",
                                                      gap: 1,
                                                    }}
                                                  >
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 0,
                                                        alignItems: "start",
                                                      }}
                                                    >
                                                      <Box
                                                        sx={{
                                                          display: "flex",
                                                          gap: 1,
                                                        }}
                                                      >
                                                        <Typography
                                                          variant="h4"
                                                          sx={{
                                                            m: 0,
                                                            color: "#000000",
                                                            fontSize: {
                                                              xs: "12px",
                                                              sm: "14px",
                                                              xl: "16px",
                                                            },
                                                            lineHeight: {
                                                              xs: "13px",
                                                              sm: "16px",
                                                              xl: "19px",
                                                            },
                                                            fontWeight: "500",
                                                          }}
                                                        >
                                                          {val?.Title}
                                                        </Typography>
                                                      </Box>
                                                      <Typography
                                                        variant="h4"
                                                        sx={{
                                                          color: "#60176F",
                                                          fontSize: {
                                                            xs: "10px",
                                                            sm: "12px",
                                                            xl: "12px",
                                                          },
                                                          lineHeight: {
                                                            xs: "15px",
                                                            sm: "18px",
                                                            xl: "24px",
                                                          },
                                                          fontWeight: "300",
                                                        }}
                                                      >
                                                        {val?.Amount
                                                          ? val?.Amount === 0
                                                            ? ""
                                                            : "AED" + " " + formatNumber(val?.Amount)
                                                          : ""}
                                                        <SeverityPill
                                                          color={isEnable ? "success" : "error"}
                                                          fontSize={10}
                                                          // onClick={() => onSelectFeature(val)}
                                                          sx={{
                                                            cursor: "pointer",
                                                            mt: 0.1,
                                                            ml: 1,
                                                          }}
                                                        >
                                                          {isEnable
                                                            ? val?.Amount != 0
                                                              ? "Covered"
                                                              : "Covered | Free"
                                                            : "Not Covered"}
                                                        </SeverityPill>
                                                      </Typography>
                                                    </Box>

                                                    <Typography
                                                      variant="h4"
                                                      sx={{
                                                        color: "#8B8E8B",
                                                        fontSize: {
                                                          xs: "12px",
                                                          sm: "14px",
                                                          xl: "16px",
                                                        },
                                                        lineHeight: {
                                                          xs: "15px",
                                                          sm: "19px",
                                                          xl: "24px",
                                                        },
                                                        fontWeight: "300",
                                                      }}
                                                    >
                                                      {val?.benifitDetail?.description
                                                        ? val?.benifitDetail?.description
                                                        : ""}
                                                    </Typography>
                                                  </Box>
                                                </Box>
                                                {!customerQuotationDetails?.isBought && val?.value != "Not Covered" && (
                                                  <Box>
                                                    <FormControlLabel
                                                      control={
                                                        <Switch
                                                          checked={isEnable}
                                                          onChange={() => onSelectFeature(val)}
                                                        />
                                                      }
                                                    />
                                                  </Box>
                                                )}
                                              </Box>
                                            </Grid>
                                          </>
                                        );
                                      })}
                                  </Grid>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <div>No data found..</div>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <Card sx={{ my: 1, maxWidth: 420 }}>
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      width: "100%",
                      py: 1.5,
                      backgroundColor: "#f5f5f5",
                      fontWeight: "600",
                      fontSize: "18px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                    }}
                  >
                    Quote payable details
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      mb: 2,
                    }}
                  >
                    <Grid container spacing={1} px={3}>
                      <Grid container spacing={1}>
                        <Grid item xs={8}>
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: { xs: "14px", md: "15px" },
                            }}
                          >
                            Insurance company premium
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography
                            sx={{
                              color: "#707070",
                              fontSize: { xs: "14px", md: "15px" },
                            }}
                          >
                            {/* {quotePayableDetails?.quote?.isMatrix === true
                              ? `AED ${formatNumber(quotePayableDetails?.quote?.price)}`
                              : `AED ${formatNumber(quotePayableDetails?.premiumNonTaxable)}`} */}
                            {`AED ${formatNumber(quotePayableDetails?.premiumNonTaxable)}`}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: { xs: "14px", md: "15px" },
                            }}
                          >
                            {`Vat (${quotePayableDetails?.vat} %)`}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography
                            sx={{
                              color: "#707070",
                              fontSize: { xs: "14px", md: "15px" },
                            }}
                          >
                            {quotePayableDetails?.vatAmount
                              ? `AED ${formatNumber(quotePayableDetails?.vatAmount)}`
                              : `AED ${formatNumber(
                                  (quotePayableDetails?.quote?.discountPrice || quotePayableDetails?.quote?.price) *
                                    0.05
                                )}`}
                          </Typography>
                        </Grid>

                        <Grid item xs={8}>
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: { xs: "14px", md: "15px" },
                            }}
                          >
                            Agent Selling Price
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            {!editableSellingPrice ? (
                              <>
                                {!policyFeeLoader ? (
                                  <Typography
                                    sx={{
                                      color: "#707070",
                                      fontSize: { xs: "14px", md: "15px" },
                                    }}
                                  >
                                    {quotePayableDetails?.quote?.discountPrice
                                      ? `AED ${formatNumber(quotePayableDetails?.quote?.discountPrice)}`
                                      : `AED ${formatNumber(quotePayableDetails?.premiumWithVat)}`}
                                  </Typography>
                                ) : (
                                  <CircularProgress size={13} />
                                )}
                              </>
                            ) : (
                              <>
                                {!policyFeeLoader ? (
                                  <TextField
                                    size="small"
                                    sx={{ width: "140px" }}
                                    label="Edit Fees"
                                    name="premium"
                                    type="number"
                                    defaultValue={
                                      quotePayableDetails?.quote?.discountPrice || quotePayableDetails?.premiumWithVat
                                    }
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setSellingPriceValue(newValue);
                                    }}
                                    inputProps={{
                                      min: 0,
                                      max: 50000,
                                    }}
                                  />
                                ) : (
                                  <CircularProgress size={13} />
                                )}
                              </>
                            )}
                            {moduleAccess(user, "proposals.update") && (
                              <>
                                {!editableSellingPrice ? (
                                  <EditIcon
                                    onClick={() => setEditableSellingPrice(true)}
                                    sx={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      color: "#707070",
                                      "&:hover": {
                                        color: "#60176F",
                                      },
                                    }}
                                  />
                                ) : (
                                  <CheckCircleIcon
                                    onClick={() => {
                                      onChnageEditSellingPrice();
                                    }}
                                    sx={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      color: "#707070",
                                      "&:hover": {
                                        color: "#60176F",
                                      },
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </Box>
                        </Grid>
                        {quotePayableDetails?.quote?.discountPrice ? (
                          <>
                            <Grid item xs={8}>
                              <Typography
                                sx={{
                                  color: "black",
                                  fontSize: { xs: "14px", md: "15px" },
                                }}
                              >
                                Discount Price
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography
                                sx={{
                                  color: "#707070",
                                  fontSize: { xs: "14px", md: "15px" },
                                }}
                              >
                                {/* {quotePayableDetails?.quote?.discountPrice
                                      ? `AED ${formatNumber(quotePayableDetails?.quote?.discountPrice)}`
                                      : `AED ${formatNumber(quotePayableDetails?.quote?.price)}`} */}
                                {`AED ${formatNumber(
                                  quotePayableDetails?.quote?.price * 1.05 - quotePayableDetails?.quote?.discountPrice
                                )}`}
                              </Typography>
                            </Grid>
                          </>
                        ) : (
                          <></>
                        )}
                        <Grid item xs={8}>
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: { xs: "14px", md: "15px" },
                            }}
                          >
                            Processing Fees
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            {!editableFees ? (
                              <>
                                {!policyFeeLoader ? (
                                  <Typography
                                    sx={{
                                      color: "#707070",
                                      fontSize: { xs: "14px", md: "15px" },
                                    }}
                                  >
                                    {`AED ${formatNumber(quotePayableDetails?.policyFee || 0)}`}
                                  </Typography>
                                ) : (
                                  <CircularProgress size={13} />
                                )}
                              </>
                            ) : (
                              <>
                                {!policyFeeLoader ? (
                                  <TextField
                                    size="small"
                                    sx={{ width: "140px" }}
                                    label="Edit Fees"
                                    name="premium"
                                    type="number"
                                    defaultValue={quotePayableDetails?.policyFee}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      serEditedPolicyFeeValue(newValue);
                                    }}
                                  />
                                ) : (
                                  <CircularProgress size={13} />
                                )}
                              </>
                            )}
                            {moduleAccess(user, "quotations.update") && (
                              <>
                                {!editableFees ? (
                                  <EditIcon
                                    onClick={() => setEditableFees(true)}
                                    sx={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      color: "#707070",
                                      "&:hover": {
                                        color: "#60176F",
                                      },
                                    }}
                                  />
                                ) : (
                                  <CheckCircleIcon
                                    onClick={() => {
                                      onChnageEditProcessingFees();
                                    }}
                                    sx={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      color: "#707070",
                                      "&:hover": {
                                        color: "#60176F",
                                      },
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={8}>
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: { xs: "14px", md: "15px" },
                              fontWeight: 600,
                            }}
                          >
                            Grand Total
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography
                            sx={{
                              color: "#707070",
                              fontSize: { xs: "14px", md: "15px" },
                              fontWeight: 600,
                            }}
                          >
                            {`AED ${formatNumber(quotePayableDetails?.totalPrice)}`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Card>

              {customerQuotationDetails && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {isProposalPurchased && (
                    <Button
                      type="button"
                      variant="contained"
                      disabled={!!customerQuotationDetails?.isBought || !!buttonDisable}
                      onClick={() => onClickOnConfirm({ paidBy: "user" })}
                      sx={{ minWidth: "140px" }}
                    >
                      Complete
                    </Button>
                  )}
                  {!isProposalPurchased && (
                    <>
                      {!user?.moduleAccessId?.isSalesAgent && (
                        <Button
                          type="button"
                          disabled={!!customerQuotationDetails?.isBought || !!buttonDisable}
                          variant="contained"
                          onClick={() => payByLinkHandler({ paidBy: "CRM - Direct to insurance company" })}
                          sx={{ minWidth: "140px" }}
                        >
                          Paid to the company
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="contained"
                        disabled={!!customerQuotationDetails?.isBought || !!buttonDisable}
                        onClick={() => payByLinkHandler({ paidBy: "link" })}
                        sx={{ minWidth: "140px" }}
                      >
                        Pay by link
                      </Button>
                      {!user?.moduleAccessId?.isSalesAgent && (
                        <Button
                          type="button"
                          variant="contained"
                          disabled={!!customerQuotationDetails?.isBought || !!buttonDisable}
                          onClick={() => payByLinkHandler({ paidBy: "CRM - Bank transfer" })}
                          sx={{ minWidth: "140px" }}
                        >
                          Pay by bank transfer
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      <ModalComp
        open={transactionRefModalOpen}
        handleClose={HandleTransactionRefModalClose}
        widths={{ xs: "95%", sm: 500 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            sx={{ width: "90%" }}
            label="Transaction Ref Number"
            name="transactionRefNo"
            type="text"
            onChange={(e) => {
              setTransactionRefNo(e.target.value);
            }}
            value={transactionRefNo || ""}
          ></TextField>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              type="button"
              variant="contained"
              onClick={() => handleSubmitRefNo()}
              disabled={!transactionRefNo}
              sx={{ maxWidth: "118px" }}
            >
              Submit
            </Button>
            <Button variant="outlined" type="button" onClick={() => HandleTransactionRefModalClose()}>
              Cancel
            </Button>
          </Box>
        </Box>
      </ModalComp>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
        {/* <VerifyModal
          label={"Are you sure You want to buy this quotation?"}
          handleClose={handleCloseVerifymodal}
          onSubmit={onPaidBylinkgenerate}
        /> */}
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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <Card
                  onClick={onPayByTamara}
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
                  <Image src={TamaraLogo} alt="TamaraLogo" width={120} height={80} />
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
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
          credential={customerQuotationDetails}
        />
      </ModalComp>
      <ModalComp
        open={transactionRefModalOpen}
        handleClose={HandleTransactionRefModalClose}
        widths={{ xs: "95%", sm: 500 }}
      >
        <TransactionInfoModal
          HandleTransactionRefModalClose={HandleTransactionRefModalClose}
          handleSubmitRefNo={handleSubmitRefNo}
          paidBy={paidByMethod}
          requireArray={requireArray}
          totalAmount={quotePayableDetails?.totalPrice}
        />
      </ModalComp>
      <ModalComp
        open={dirctToCompanyModal}
        handleClose={handleDirctToCompanyModalClose}
        widths={{ xs: "95%", sm: 500 }}
      >
        <VerifyModal
          label={"Please set Processing fees to '0' because of mode of payment!"}
          handleClose={handleDirctToCompanyModalClose}
          onSubmit={handleDirctToCompanyModalClose}
        />
      </ModalComp>
      <ModalComp
        open={dirctToCompanyModal}
        handleClose={handleDirctToCompanyModalClose}
        widths={{ xs: "95%", sm: 500 }}
      >
        <VerifyModal
          label={"Please set Processing fees to '0' because of mode of payment!"}
          handleClose={handleDirctToCompanyModalClose}
          onSubmit={handleDirctToCompanyModalClose}
        />
      </ModalComp>
      <ModalComp open={doubleCheckModal} handleClose={handleDoubleCheckModalClose} widths={{ xs: "95%", sm: 500 }}>
        <VerifyModal
          label={`Please double check the proceesing fee, Current fee is ${quotePayableDetails?.policyFee} AED. Are you sure you want to proceed?`}
          handleClose={handleDoubleCheckModalClose}
          onSubmit={handleDoubleCheckProceed}
        />
      </ModalComp>
      <ModalComp
        open={openNCDddocumentUpload}
        handleClose={() => {
          setOpenNCDddocumentUpload(false);
        }}
        widths={{ xs: "95%", sm: "95%", md: 600 }}
      >
        <Box>
          <NcdDocumentUpload
            handleClose={() => {
              setOpenNCDddocumentUpload(false);
            }}
            carId={customerQuotationDetails?.carId?._id}
            proposalDetail={customerQuotationDetails}
            keyItem={"quote"}
          />
        </Box>
      </ModalComp>
      <ModalComp
        open={openCarImageUpload}
        handleClose={() => {
          setOpenCarImageUpload(false);
        }}
        widths={{ xs: "95%", sm: "95%", md: "90%" }}
      >
        <Box>
          <CarImagesUpload
            handleClose={() => {
              setOpenCarImageUpload(false);
            }}
            label={carImageLeble}
            carDetail={customerQuotationDetails?.carId}
            stateDetail={customerQuotationDetails}
            keyItem={"quote"}
          />
        </Box>
      </ModalComp>
    </>
  );
};

QuatationDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default QuatationDetails;
