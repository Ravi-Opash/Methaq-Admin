import { Box, Container, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import NetworkLogo from "../../../../../public/assets/logos/NetworkLogo.svg";
import {
  getHealthQuotesPaybles,
  getPaidProposals,
  healthCheckoutPayment,
  healthInsurancePayByLink,
  healthPayByTamara,
  healthPurchaseConfirm,
  helathPolicyDocsUpload,
} from "src/sections/health-insurance/Proposals/Action/healthInsuranceAction";
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
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { EditIcon } from "src/Icons/EditIcon";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { format, isValid, parseISO } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";
import ModalComp from "src/components/modalComp";
import { CrossSvg } from "src/Icons/CrossSvg";
import TamaraLogo from "../../../../../public/assets/logos/tamara.png";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import Image from "next/image";
import { getHealthQuoationDetails } from "src/sections/health-insurance/Quotations/Action/healthQuotationAction";
import HealthInsuranceDocsUpload from "src/sections/health-insurance/Proposals/health-proposal-docs-upload";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { sethealthQuotationInfoDetails } from "src/sections/health-insurance/Quotations/Reducer/healthQuotationSlice";
import { HeartPuls } from "src/Icons/HeartPuls";
import HealthPromoCodeSession from "src/sections/health-insurance/Proposals/health-apply-promo-code";
import { formatNumber } from "src/utils/formatNumber";
import PremiumHistoryTable from "src/sections/quotations/premium-history-table";
import HealthPlanPaybleDetails from "src/sections/health-insurance/Proposals/health-plan-payble-details";
import TransactionInfoModal from "src/sections/Proposals/transaction-Info-modal";
import EditPremiumModal from "src/sections/health-insurance/Proposals/health-edit-premium-modal";
import AnimationLoader from "src/components/amimated-loader";
import CreditDebitUpload from "src/sections/health-insurance/Proposals/health-credit-debit-upload";

// Styled components for customizing the layout
const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

const Img = styled(Image)(({ theme }) => ({
  height: "max-content !important",
}));

// Data structure for different document requirements based on user types and visa statuses
const docsUploadData = {
  Self: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: "Certificate Of Continuity", key: "continuityCertificate", require: true },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: "Cancellation of Visa", key: "cancellationOfVisa", require: true },
      { label: "Change Status", key: "changeStatus", require: true },
    ],
    New: [
      { label: "Passport", key: "passport", require: true },
      { label: "Entry Stamp", key: "entryStamp", require: true },
      { label: "Change Status", key: "changeStatus", require: true },
    ],
  },
  [`Self (Investor)`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: "Certificate Of Continuity", key: "continuityCertificate", require: true },
      { label: "Trade license", key: "tradeLicense", require: true },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
      { label: "Trade license", key: "tradeLicense", require: true },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: "Cancellation of Visa", key: "cancellationOfVisa", require: true },
      { label: "Change Status", key: "changeStatus", require: true },
      { label: "Trade license", key: "tradeLicense", require: true },
    ],
    New: [
      { label: "Passport", key: "passport", require: true },
      { label: "Entry Stamp", key: "entryStamp", require: true },
      { label: "Change Status", key: "changeStatus", require: true },
      { label: "Trade license", key: "tradeLicense", require: true },
    ],
  },
  [`Dependent only`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      {
        label: "Certificate Of Continuity",
        key: "continuityCertificate",
        require: false,
        ownerRequire: true,
        requireCity: ["Abu Dhabi"],
      },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
    ],
    New: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: false, ownerRequire: true },
      { label: "Emirate Id", key: "emiratesId", require: false, ownerRequire: true },
    ],
  },
  [`Investor’s Dependent only`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      {
        label: "Certificate Of Continuity",
        key: "continuityCertificate",
        require: false,
        ownerRequire: true,
        requireCity: ["Abu Dhabi"],
      },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    New: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: false, ownerRequire: true },
      { label: "Emirate Id", key: "emiratesId", require: false, ownerRequire: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
  },
  [`Self and Dependent`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      {
        label: "Certificate Of Continuity",
        key: "continuityCertificate",
        require: false,
        ownerRequire: true,
        requireCity: ["Abu Dhabi"],
      },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
    ],
    New: [
      { label: "Passport", key: "passport", require: true, ownerRequire: true },
      { label: "Visa", key: "visaDoc", require: false, ownerRequire: true },
      { label: "Emirate Id", key: "emiratesId", require: false, ownerRequire: true },
    ],
  },
  [`Self (Investor) and Dependent`]: {
    Renewal: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      {
        label: "Certificate Of Continuity",
        key: "continuityCertificate",
        require: false,
        ownerRequire: true,
        requireCity: ["Abu Dhabi"], // require in Abu Dhabi for all
      },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    ["Tourist/visit visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa with change status stamp", key: "visaWithChangeStatusStamp", require: true },
      { label: "Tourist visa/Visit visa", key: "touristVisa", require: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    ["Cancelled Visa"]: [
      { label: "Passport", key: "passport", require: true },
      { label: "Visa", key: "visaDoc", require: true },
      { label: "Emirate Id", key: "emiratesId", require: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
    New: [
      { label: "Passport", key: "passport", require: true, ownerRequire: true },
      { label: "Visa", key: "visaDoc", require: false, ownerRequire: true },
      { label: "Emirate Id", key: "emiratesId", require: false, ownerRequire: true },
      { label: " Trade license", key: "tradeLicense", require: false, ownerRequire: true, onlyOwner: ["ownerDetails"] },
    ],
  },
};

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Tab options for the health quotation details page
const tabs = [
  { label: "Overview", value: "overview" },
  { label: "Coverages", value: "coverages" },
];

// Main component for the Health Quotation Details page
const HealthQuotationDetails = () => {
  const dispatch = useDispatch();
  const { healthQuotationDetails, loading } = useSelector((state) => state.healthQuotation);
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const { quotationId } = router.query;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const { policyFeeLoader, quotePayableDetails, paidProposalsList } = useSelector((state) => state.healthInsurance);

  // States for handling different modals and UI elements
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const [paymentOptionModal, setPaymentOptionModal] = useState(false);
  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);
  const [transactionRefNo, setTransactionRefNo] = useState("");
  const [fileDocsLoader, setFileDocsLoader] = useState({});

  const [newValue, setNewValue] = useState(healthQuotationDetails?.price);
  const [startBlink, setStartBlink] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [editCount, setEditCount] = useState("");
  const handleClosePaymentOptionmodal = () => setPaymentOptionModal(false);
  const [requireArray, setrequireArray] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const [viewCreditDebitModal, setViewCreditDebitModal] = useState(false);

  const [currentTab, setCurrentTab] = useState("overview");
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  // Function to download the document (PDF)
  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + "/" + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    if (quotationId) {
      dispatch(getHealthQuotesPaybles(quotationId));
    }
  }, [quotationId]);

  // Function to check if all required documents are uploaded
  const checkAllDocsHandler = () => {
    let obj = {
      isValid: true,
      key: "",
    };
    if (healthQuotationDetails) {
      docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
        healthQuotationDetails?.healthInfo?.visaStatus
      ]?.map((ele) => {
        // Checking if required documents are present in healthQuotationDetails
        if (!healthQuotationDetails?.healthInfo?.[ele?.key] && ele?.require) {
          obj = { isValid: false, key: `ownerDetails` };
        }
        // Checking other document conditions based on city or owner status
        if (
          !healthQuotationDetails?.healthInfo?.[ele?.key] &&
          !ele?.require &&
          ele?.requireCity?.length > 0 &&
          ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
        ) {
          obj = { isValid: false, key: `ownerDetails` };
        }
        if (!healthQuotationDetails?.healthInfo?.[ele?.key] && !ele?.require && ele?.ownerRequire) {
          obj = { isValid: false, key: `ownerDetails` };
        }

        //for kids document
        if (healthQuotationDetails?.healthInfo?.kidsDetails?.length > 0) {
          healthQuotationDetails?.healthInfo?.kidsDetails?.map((item) => {
            if (!item?.[ele?.key] && ele?.require) {
              obj = {
                isValid: false,
                key: `kidsDetails`,
              };
            }
            if (
              !item?.[ele?.key] &&
              !ele?.require &&
              ele?.requireCity?.length > 0 &&
              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `kidsDetails`,
              };
            }
          });
        }
        // for spouse document
        if (healthQuotationDetails?.healthInfo?.spouseDetails?.length > 0) {
          healthQuotationDetails?.healthInfo?.spouseDetails?.map((item) => {
            if (!item?.[ele?.key] && ele?.require) {
              obj = {
                isValid: false,
                key: `spouseDetails`,
              };
            }
            if (
              !item?.[ele?.key] &&
              !ele?.require &&
              ele?.requireCity?.length > 0 &&
              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `spouseDetails`,
              };
            }
          });
        }
        // for domestic worker document
        if (healthQuotationDetails?.healthInfo?.domesticWorkerDetails?.length > 0) {
          healthQuotationDetails?.healthInfo?.domesticWorkerDetails?.map((item) => {
            if (!item?.[ele?.key] && ele?.require) {
              obj = {
                isValid: false,
                key: `domesticWorkerDetails`,
              };
            }
            if (
              !item?.[ele?.key] &&
              !ele?.require &&
              ele?.requireCity?.length > 0 &&
              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `domesticWorkerDetails`,
              };
            }
          });
        }
        //for other famliy and dependents
        if (healthQuotationDetails?.healthInfo?.otherFamilyDependentsDetails?.length > 0) {
          healthQuotationDetails?.healthInfo?.otherFamilyDependentsDetails?.map((item) => {
            if (!item?.[ele?.key] && ele?.require) {
              obj = {
                isValid: false,
                key: `otherFamilyDependentsDetails`,
              };
            }
            if (
              !item?.[ele?.key] &&
              !ele?.require &&
              ele?.requireCity?.length > 0 &&
              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `otherFamilyDependentsDetails`,
              };
            }
          });
        }
        //for parents
        if (healthQuotationDetails?.healthInfo?.parentsDetails?.length > 0) {
          healthQuotationDetails?.healthInfo?.parentsDetails?.map((item) => {
            if (!item?.[ele?.key] && ele?.require) {
              obj = {
                isValid: false,
                key: `parentsDetails`,
              };
            }
            if (
              !item?.[ele?.key] &&
              !ele?.require &&
              ele?.requireCity?.length > 0 &&
              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `parentsDetails`,
              };
            }
          });
        }
      });
    }

    return obj;
  };

  // Function to generate payment link using CRM (via Link option)
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(healthCheckoutPayment({ quoteId: quotationId, paidBy: "CRM - Link" }))
      .unwrap()
      .then((data) => {
        handleClosePaymentOptionmodal();
        setPaymentLinkInfo(data);
        setPaymentLinkShareModal(true);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
        toast(err, { type: "error" });
        setLoading(true);
        handleClosePaymentOptionmodal();
      });
  };

  // Function to handle payment via Tamara (buy now, pay later option)
  const onPayByTamara = () => {
    setLoading(false);
    dispatch(healthPayByTamara({ quoteId: quotationId, paidBy: "CRM - Tamara" }))
      .unwrap()
      .then((data) => {
        handleClosePaymentOptionmodal();
        setPaymentLinkInfo(data);
        setPaymentLinkShareModal(true);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
        toast(err, { type: "error" });
        setLoading(true);
        handleClosePaymentOptionmodal();
      });
  };

  // Function to handle submission of transaction reference number after payment
  const handleSubmitRefNo = (data) => {
    setLoading(false);
    dispatch(
      healthInsurancePayByLink({
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
          fetchProposalSummary();
        }
        setLoading(true);
        HandleTransactionRefModalClose(false);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setLoading(true);
      });
  };

  // Function to handle document upload (such as policy documents)
  const handleFileUpload = (event, personKey, personId, docsKey) => {
    setFileDocsLoader({ ...fileDocsLoader, [`${personId}-${docsKey}`]: true });

    if (event?.target?.files?.[0]) {
      const file = event?.target?.files?.[0];
      const payload = {
        healthInfoId: healthQuotationDetails?.healthInfo?._id,
        detailsToUpdate: personKey,
        detailsId: personId,
        [`${docsKey}`]: file,
      };
      const formdata = jsonToFormData(payload);

      // Dispatch action to upload the document
      dispatch(helathPolicyDocsUpload(formdata))
        ?.unwrap()
        .then((res) => {
          toast?.success("Successfully Uploaded!");
          dispatch(sethealthQuotationInfoDetails({ ...healthQuotationDetails, healthInfo: res?.data }));
          setFileDocsLoader({ ...fileDocsLoader, [`${personId}-${docsKey}`]: false });
        })
        .catch((err) => {
          console.log(err, "err");
          toast?.error(err);
          setFileDocsLoader({ ...fileDocsLoader, [`${personId}-${docsKey}`]: false });
        });
    }

    event.target.value = "";
  };

  // Transaction Reference Modal open/close
  const [transactionRefModalOpen, setTransactionRefModalOpen] = useState(false);
  const HandleTransactionRefModalClose = () => setTransactionRefModalOpen(false);
  const [paidByMethod, setPaidByMethod] = useState("");

  const initialized = useRef(false);
  // Fetch proposal summary on page load or when the quote ID is available
  const fetchProposalSummary = () => {
    dispatch(getHealthQuoationDetails({ id: quotationId }))
      .unwrap()
      .then((res) => {
        setNewValue(res?.data?.price);
        dispatch(getPaidProposals(res?.data?.proposalNo))
          .unwrap()
          .then((res) => {})
          .catch((err) => {
            toast.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  // useEffect hook to initialize data once when component is mounted
  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    fetchProposalSummary();
  }, []);

  // Function to handle payment method selection and document validation
  const payByLinkHandler = (paidBy) => {
    let validation = checkAllDocsHandler();
    if (!validation?.isValid) {
      toast.error("Please upload all required documents!");
      setStartBlink(true);
      const delay = setTimeout(() => {
        setStartBlink(false);
      }, 5000);
      if (validation?.key) {
        const element = document.getElementById(`${validation?.key}`);
        element.scrollIntoView({
          behavior: "smooth",
        });
      }

      return () => clearTimeout(delay);
    }

    // Show different modals depending on the payment method selected
    if (
      (paidBy?.paidBy === "CRM - Bank transfer" ||
        paidBy?.paidBy === "user" ||
        paidBy?.paidBy === "CRM - Direct to insurance company") &&
      !quotePayableDetails?.quoteInfo?.debitFile &&
      !quotePayableDetails?.quoteInfo?.taxInfo
    ) {
      setViewCreditDebitModal(true);
      return;
    }

    if (paidBy?.paidBy == "link") {
      setPaymentOptionModal(true);
      return;
    }

    if (paidBy?.paidBy == "CRM - Direct to insurance company") {
      setrequireArray(["proofAmount", "proofOfPayment", "transactionRefNo"]); // Require proof of payment and transaction reference for direct payments
    }

    if (paidBy?.paidBy == "CRM - Bank transfer") {
      setrequireArray(["transactionRefNo"]);
    }
    setTransactionRefModalOpen(true);
    setPaidByMethod(paidBy?.paidBy);
  };

  // Function to confirm the payment and finalize the proposal
  const onClickOnConfirm = (paidBy) => {
    let validation = checkAllDocsHandler();
    if (!validation?.isValid) {
      toast.error("Please upload all required documents!");
      setStartBlink(true);
      const delay = setTimeout(() => {
        setStartBlink(false);
      }, 5000);
      if (validation?.key) {
        const element = document.getElementById(`${validation?.key}`);
        element.scrollIntoView({
          behavior: "smooth",
        });
      }

      return () => clearTimeout(delay);
    }

    setLoading(false);
    // Dispatch action to confirm the payment
    dispatch(healthPurchaseConfirm({ id: quotationId, data: { paidBy: paidBy } }))
      .then((res) => {
        if (res?.error?.message) {
          toast.error(res.payload);
        } else {
          toast.success("Payment confirmed successfully!");
          fetchProposalSummary();
        }
        setLoading(true);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setLoading(true);
      });
  };

  return (
    <>
      <AnimationLoader open={!isLoading} />
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
              <Link
                color="textPrimary"
                component="a"
                onClick={() => router.back()}
                sx={{
                  alignItems: "center",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Health insurace quotation</Typography>
              </Link>
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
                <Typography variant="h5">Health Plan Details</Typography>
              </Box>
            </Stack>
            {healthQuotationDetails?.paymentId ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  p: 2.5,
                  mx: 1,
                  mb: 2,
                  backgroundColor: "#e5f7e5",
                  boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px $e5f7e5",
                  borderRadius: "10px 10px 10px 10px",
                }}
              >
                <Typography sx={{ ml: 0, fontWeight: 600, color: "#111927" }}>
                  {" "}
                  {healthQuotationDetails?.policyIssued
                    ? "Policy already issued for this quotation!"
                    : healthQuotationDetails?.isBought
                    ? "This quotation has been done and paid for, click view policy to go to the policy to finish the process."
                    : healthQuotationDetails?.paymentId
                    ? "Payment received for this quotation, confirm payment and generate policy."
                    : "-"}
                </Typography>
                {(healthQuotationDetails?.isBought || healthQuotationDetails?.policyIssued) && (
                  <Button
                    type="button"
                    variant="contained"
                    sx={{ minWidth: 130 }}
                    onClick={() => router?.push(`/health-insurance/policies/${healthQuotationDetails?.policyId}`)}
                  >
                    View Policy
                  </Button>
                )}
              </Box>
            ) : paidProposalsList?.[0]?.paymentId ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  p: 2.5,
                  mx: 1,
                  mb: 2,
                  backgroundColor: "#e5f7e5",
                  boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px $e5f7e5",
                  borderRadius: "10px 10px 10px 10px",
                }}
              >
                <Typography sx={{ ml: 0, fontWeight: 600, color: "#111927" }}>
                  {" "}
                  {paidProposalsList?.[0]?.policyIssued
                    ? "Policy already issued for this proposal!"
                    : paidProposalsList?.[0]?.isBought
                    ? "This proposal has been done and paid for, click view policy to go to the policy to finish the process."
                    : paidProposalsList?.[0]?.paymentId
                    ? "Payment received for this proposal, confirm payment and generate policy."
                    : "-"}
                </Typography>
                {(paidProposalsList?.[0]?.isBought || paidProposalsList?.[0]?.policyIssued) && (
                  <Button
                    type="button"
                    variant="contained"
                    sx={{ minWidth: 130 }}
                    onClick={() => router?.push(`/health-insurance/policies/${paidProposalsList?.[0]?.policyId}`)}
                  >
                    View Policy
                  </Button>
                )}
              </Box>
            ) : (
              <></>
            )}
            {!loading ? (
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
                      {currentTab === "overview" && (
                        <>
                          <HealthPromoCodeSession
                            proposalId={healthQuotationDetails?.proposalNo}
                            items={healthQuotationDetails}
                            fetchProposalSummary={fetchProposalSummary}
                            isPurchased={!!healthQuotationDetails?.paymentId}
                          />
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
                              Quotation details
                            </Typography>

                            <Grid container columnSpacing={8}>
                              <Grid item xs={12} sm={12}>
                                <List sx={{ py: 0 }}>
                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Insurer Type"}
                                        value={healthQuotationDetails?.healthInfo?.insurerType || "-"}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Company Name"}
                                        value={healthQuotationDetails?.companyData?.companyName || "-"}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"TPA"}
                                        value={healthQuotationDetails?.TPA?.TPAName || "=-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Network"}
                                        value={healthQuotationDetails?.network?.networkName || "-"}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"City"}
                                        value={healthQuotationDetails?.healthInfo?.city || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Plan"}
                                        value={healthQuotationDetails?.plan?.planName || "-"}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Co-Pay"}
                                        value={
                                          healthQuotationDetails?.plan?.coPay
                                            ? `${healthQuotationDetails?.plan?.coPay} %`
                                            : "-"
                                        }
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItem disablePadding>
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
                                                  fontSize: "16px",
                                                  display: "inline-block",
                                                  // textAlign: "end",
                                                }}
                                              >
                                                Insurance company premium
                                              </Typography>
                                            </Box>
                                            <Box
                                              sx={{
                                                width: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                              }}
                                            >
                                              {!isEditable ? (
                                                <Typography
                                                  variant="subtitle2"
                                                  gutterBottom
                                                  sx={{
                                                    fontWeight: "400",
                                                    fontSize: "14px",
                                                    // display: "inline-block",
                                                    color: "#707070",
                                                    textAlign: { xs: "end", sm: "left" },
                                                  }}
                                                >
                                                  {healthQuotationDetails?.isPremiumRequestUpon &&
                                                  healthQuotationDetails?.editPrice?.length <= 0
                                                    ? "-"
                                                    : `AED ${formatNumber(
                                                        parseInt(healthQuotationDetails?.price * 100) / 100
                                                      )}`}
                                                </Typography>
                                              ) : (
                                                <TextField
                                                  sx={{ width: "140px" }}
                                                  label="Edit Premium"
                                                  name="premium"
                                                  type="number"
                                                  defaultValue={healthQuotationDetails?.price}
                                                  onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    setNewValue(newValue);
                                                  }}
                                                />
                                              )}
                                              {!healthQuotationDetails?.isPaid && (
                                                <>
                                                  {!isEditable ? (
                                                    <EditIcon
                                                      onClick={() => {
                                                        setEditCount(healthQuotationDetails?.editPrice?.length);
                                                        if (healthQuotationDetails?.editPrice?.length >= 3) {
                                                          toast.error("Maximum editable limit exceeded!");
                                                          return;
                                                        }
                                                        setOpenEditModal(true);
                                                      }}
                                                      sx={{
                                                        fontSize: "20px",
                                                        cursor: "pointer",
                                                        color: "#707070",
                                                        mt: -1,
                                                        "&:hover": {
                                                          color: "#60176F",
                                                        },
                                                      }}
                                                    />
                                                  ) : (
                                                    <CheckCircleIcon
                                                      onClick={() => {
                                                        setVerifyModal(true);
                                                      }}
                                                      sx={{
                                                        fontSize: "20px",
                                                        cursor: "pointer",
                                                        color: "#707070",
                                                        mt: -1,
                                                        "&:hover": {
                                                          color: "#60176F",
                                                        },
                                                      }}
                                                    />
                                                  )}
                                                </>
                                              )}
                                            </Box>
                                          </Box>
                                        </ListItemButton>
                                      </ListItem>
                                    </Grid>
                                  </Grid>
                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Current visa status"}
                                        value={healthQuotationDetails?.healthInfo?.visaStatus || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                  </Grid>
                                </List>
                              </Grid>
                            </Grid>
                          </Box>
                          <Box
                            id={"ownerDetails"}
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
                              Personal Details
                            </Typography>

                            <Grid container columnSpacing={8}>
                              <Grid item xs={12} sm={12}>
                                <List sx={{ py: 0 }}>
                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Full Name"}
                                        value={healthQuotationDetails?.healthInfo?.fullName || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Email"}
                                        value={healthQuotationDetails?.healthInfo?.email || "-"}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Mobile Number"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.mobileNumber
                                            ? `+971 ${healthQuotationDetails?.healthInfo?.mobileNumber}`
                                            : "-"
                                        }
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Date of Birth"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.dateOfBirth
                                            ? format(
                                                parseISO(healthQuotationDetails?.healthInfo?.dateOfBirth),
                                                "dd/MM/yyyy"
                                              )
                                            : "-"
                                        }
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Gender"}
                                        value={healthQuotationDetails?.healthInfo?.gender || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Salary"}
                                        value={healthQuotationDetails?.healthInfo?.salary || "-"}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Marital Status"}
                                        value={healthQuotationDetails?.healthInfo?.maritalStatus || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Nationality"}
                                        value={healthQuotationDetails?.healthInfo?.nationality || "-"}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"City"}
                                        value={healthQuotationDetails?.healthInfo?.city || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Age"}
                                        value={healthQuotationDetails?.healthInfo?.age || "-"}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />
                                  <Grid container>
                                    <Grid item xs={12} md={6}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Insurer Name"}
                                        value={healthQuotationDetails?.healthInfo?.insurerName || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container columnSpacing={0}>
                                    {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                      healthQuotationDetails?.healthInfo?.visaStatus
                                    ]?.map((ele, i) => {
                                      if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("ownerDetails")) {
                                        return;
                                      }
                                      let isRequire = false;
                                      if (ele?.ownerRequire) {
                                        isRequire = true;
                                      } else if (
                                        !ele?.require &&
                                        ele?.requireCity?.length > 0 &&
                                        ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                      ) {
                                        isRequire = true;
                                      } else if (ele?.require) {
                                        isRequire = true;
                                      } else {
                                        isRequire = false;
                                      }
                                      return (
                                        <>
                                          <Grid item xs={12} md={6} key={i}>
                                            <ListItem disablePadding>
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
                                                        // textAlign: "end",
                                                      }}
                                                    >
                                                      {ele?.label}
                                                      {ele?.ownerRequire ? (
                                                        <Span>*</Span>
                                                      ) : !ele?.require &&
                                                        ele?.requireCity?.length > 0 &&
                                                        ele?.requireCity?.includes(
                                                          healthQuotationDetails?.healthInfo?.city
                                                        ) ? (
                                                        <Span>*</Span>
                                                      ) : ele?.require ? (
                                                        <Span>*</Span>
                                                      ) : (
                                                        ""
                                                      )}
                                                    </Typography>
                                                  </Box>
                                                  <Box sx={{ width: "50%" }}>
                                                    <HealthInsuranceDocsUpload
                                                      onDocumentDowmload={onDocumentDowmload}
                                                      keyName={ele?.key}
                                                      info={healthQuotationDetails?.healthInfo}
                                                      handleFileUpload={handleFileUpload}
                                                      fileDocsLoader={fileDocsLoader}
                                                      personKey={`ownerDetails`}
                                                      isRequire={isRequire}
                                                      startBlink={startBlink}
                                                    />
                                                  </Box>
                                                </Box>
                                              </ListItemButton>
                                            </ListItem>
                                          </Grid>
                                        </>
                                      );
                                    })}
                                  </Grid>
                                </List>
                              </Grid>
                            </Grid>
                          </Box>
                          {/* {"Spouse details"} */}
                          {healthQuotationDetails?.healthInfo?.spouseDetails?.length > 0 && (
                            <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                              <Box
                                id={`spouseDetails`}
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
                                  Spouse Details
                                </Typography>

                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Full Name</TableCell>
                                      {/* <TableCell>Policy No</TableCell> */}
                                      <TableCell>DOB</TableCell>
                                      <TableCell>Age</TableCell>
                                      <TableCell>Gender</TableCell>
                                      {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                        healthQuotationDetails?.healthInfo?.visaStatus
                                      ]?.map((ele, i) => {
                                        if (
                                          ele?.requireCity?.length > 0 &&
                                          !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                        ) {
                                          return <></>;
                                        }
                                        if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("spouseDetails")) {
                                          return;
                                        }
                                        return (
                                          <TableCell key={i}>
                                            {ele?.label}
                                            {!ele?.require &&
                                            ele?.requireCity?.length > 0 &&
                                            ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city) ? (
                                              <Span>*</Span>
                                            ) : ele?.require ? (
                                              <Span>*</Span>
                                            ) : (
                                              ""
                                            )}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {healthQuotationDetails?.healthInfo?.spouseDetails?.map((item, idx) => {
                                      return (
                                        <TableRow
                                          hover
                                          // sx={{ cursor: "pointer" }}
                                        >
                                          <TableCell>{item?.fullName}</TableCell>
                                          <TableCell>
                                            {isValid(parseISO(item?.dateOfBirth))
                                              ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                              : "Start date"}
                                          </TableCell>
                                          <TableCell>{item?.age}</TableCell>
                                          <TableCell>{item?.gender}</TableCell>
                                          {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                            healthQuotationDetails?.healthInfo?.visaStatus
                                          ]?.map((ele, i) => {
                                            if (
                                              ele?.requireCity?.length > 0 &&
                                              !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                            ) {
                                              return <></>;
                                            }
                                            if (
                                              ele?.onlyOwner?.length > 0 &&
                                              !ele?.onlyOwner?.includes("spouseDetails")
                                            ) {
                                              return;
                                            }
                                            let isRequire = false;
                                            if (
                                              !ele?.require &&
                                              ele?.requireCity?.length > 0 &&
                                              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                            ) {
                                              isRequire = true;
                                            } else if (ele?.require) {
                                              isRequire = true;
                                            } else {
                                              isRequire = false;
                                            }
                                            return (
                                              <TableCell>
                                                <HealthInsuranceDocsUpload
                                                  onDocumentDowmload={onDocumentDowmload}
                                                  keyName={ele?.key}
                                                  info={item}
                                                  handleFileUpload={handleFileUpload}
                                                  fileDocsLoader={fileDocsLoader}
                                                  personKey={`spouseDetails`}
                                                  isRequire={isRequire}
                                                  startBlink={startBlink}
                                                />
                                              </TableCell>
                                            );
                                          })}
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Box>
                          )}
                          {/* {"kids details"} */}
                          {healthQuotationDetails?.healthInfo?.kidsDetails?.length > 0 && (
                            <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                              <Box
                                id={"kidsDetails"}
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
                                  Kids Details
                                </Typography>

                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Full Name</TableCell>
                                      <TableCell>DOB</TableCell>
                                      <TableCell>Age</TableCell>
                                      <TableCell>Gender</TableCell>
                                      {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                        healthQuotationDetails?.healthInfo?.visaStatus
                                      ]?.map((ele, i) => {
                                        if (
                                          ele?.requireCity?.length > 0 &&
                                          !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                        ) {
                                          return <></>;
                                        }
                                        if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("kidsDetails")) {
                                          return;
                                        }
                                        return (
                                          <TableCell key={i}>
                                            {ele?.label}
                                            {!ele?.require &&
                                            ele?.requireCity?.length > 0 &&
                                            ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city) ? (
                                              <Span>*</Span>
                                            ) : ele?.require ? (
                                              <Span>*</Span>
                                            ) : (
                                              ""
                                            )}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {healthQuotationDetails?.healthInfo?.kidsDetails?.map((item, idx) => {
                                      return (
                                        <TableRow hover>
                                          <TableCell>{item?.fullName}</TableCell>
                                          <TableCell>
                                            {isValid(parseISO(item?.dateOfBirth))
                                              ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                              : "Start date"}
                                          </TableCell>
                                          <TableCell>{item?.age}</TableCell>
                                          <TableCell>{item?.gender}</TableCell>
                                          {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                            healthQuotationDetails?.healthInfo?.visaStatus
                                          ]?.map((ele, i) => {
                                            if (
                                              ele?.requireCity?.length > 0 &&
                                              !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                            ) {
                                              return <></>;
                                            }
                                            if (
                                              ele?.onlyOwner?.length > 0 &&
                                              !ele?.onlyOwner?.includes("kidsDetails")
                                            ) {
                                              return;
                                            }
                                            let isRequire = false;
                                            if (
                                              !ele?.require &&
                                              ele?.requireCity?.length > 0 &&
                                              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                            ) {
                                              isRequire = true;
                                            } else if (ele?.require) {
                                              isRequire = true;
                                            } else {
                                              isRequire = false;
                                            }
                                            return (
                                              <TableCell>
                                                <HealthInsuranceDocsUpload
                                                  onDocumentDowmload={onDocumentDowmload}
                                                  keyName={ele?.key}
                                                  info={item}
                                                  handleFileUpload={handleFileUpload}
                                                  fileDocsLoader={fileDocsLoader}
                                                  personKey={`kidsDetails`}
                                                  isRequire={isRequire}
                                                  startBlink={startBlink}
                                                />
                                              </TableCell>
                                            );
                                          })}
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Box>
                          )}
                          {/* {"Parents details"} */}
                          {healthQuotationDetails?.healthInfo?.parentDetails?.length > 0 && (
                            <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                              <Box
                                id={"parentDetails"}
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
                                  Patents Details
                                </Typography>

                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Full Name</TableCell>
                                      <TableCell>DOB</TableCell>
                                      <TableCell>Gender</TableCell>
                                      {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                        healthQuotationDetails?.healthInfo?.visaStatus
                                      ]?.map((ele, i) => {
                                        if (
                                          ele?.requireCity?.length > 0 &&
                                          !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                        ) {
                                          return <></>;
                                        }
                                        if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("parentDetails")) {
                                          return;
                                        }
                                        return (
                                          <TableCell key={i}>
                                            {ele?.label}
                                            {!ele?.require &&
                                            ele?.requireCity?.length > 0 &&
                                            ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city) ? (
                                              <Span>*</Span>
                                            ) : ele?.require ? (
                                              <Span>*</Span>
                                            ) : (
                                              ""
                                            )}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {healthQuotationDetails?.healthInfo?.parentDetails?.map((item, idx) => {
                                      return (
                                        <TableRow hover>
                                          <TableCell>{item?.fullName}</TableCell>
                                          <TableCell>
                                            {isValid(parseISO(item?.dateOfBirth))
                                              ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                              : "Start date"}
                                          </TableCell>
                                          <TableCell>{item?.gender}</TableCell>
                                          {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                            healthQuotationDetails?.healthInfo?.visaStatus
                                          ]?.map((ele, i) => {
                                            if (
                                              ele?.requireCity?.length > 0 &&
                                              !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                            ) {
                                              return <></>;
                                            }
                                            if (
                                              ele?.onlyOwner?.length > 0 &&
                                              !ele?.onlyOwner?.includes("parentDetails")
                                            ) {
                                              return;
                                            }
                                            let isRequire = false;
                                            if (
                                              !ele?.require &&
                                              ele?.requireCity?.length > 0 &&
                                              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                            ) {
                                              isRequire = true;
                                            } else if (ele?.require) {
                                              isRequire = true;
                                            } else {
                                              isRequire = false;
                                            }
                                            return (
                                              <TableCell>
                                                <HealthInsuranceDocsUpload
                                                  onDocumentDowmload={onDocumentDowmload}
                                                  keyName={ele?.key}
                                                  info={item}
                                                  handleFileUpload={handleFileUpload}
                                                  fileDocsLoader={fileDocsLoader}
                                                  personKey={`parentDetails`}
                                                  isRequire={isRequire}
                                                  startBlink={startBlink}
                                                />
                                              </TableCell>
                                            );
                                          })}
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Box>
                          )}
                          {/* {"other family memners details"} */}
                          {healthQuotationDetails?.healthInfo?.otherFamilyDependentsDetails?.length > 0 && (
                            <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                              <Box
                                id={"otherFamilyDependentsDetails"}
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
                                  Other Dependents Details
                                </Typography>

                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Full Name</TableCell>
                                      <TableCell>DOB</TableCell>
                                      <TableCell>Gender</TableCell>
                                      {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                        healthQuotationDetails?.healthInfo?.visaStatus
                                      ]?.map((ele, i) => {
                                        if (
                                          ele?.requireCity?.length > 0 &&
                                          !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                        ) {
                                          return <></>;
                                        }
                                        if (
                                          ele?.onlyOwner?.length > 0 &&
                                          !ele?.onlyOwner?.includes("otherFamilyDependentsDetails")
                                        ) {
                                          return;
                                        }
                                        return (
                                          <TableCell key={i}>
                                            {ele?.label}
                                            {!ele?.require &&
                                            ele?.requireCity?.length > 0 &&
                                            ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city) ? (
                                              <Span>*</Span>
                                            ) : ele?.require ? (
                                              <Span>*</Span>
                                            ) : (
                                              ""
                                            )}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {healthQuotationDetails?.healthInfo?.otherFamilyDependentsDetails?.map(
                                      (item, idx) => {
                                        return (
                                          <TableRow hover>
                                            <TableCell>{item?.fullName}</TableCell>
                                            <TableCell>
                                              {isValid(parseISO(item?.dateOfBirth))
                                                ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                                : "Start date"}
                                            </TableCell>
                                            <TableCell>{item?.gender}</TableCell>
                                            {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                              healthQuotationDetails?.healthInfo?.visaStatus
                                            ]?.map((ele, i) => {
                                              if (
                                                ele?.requireCity?.length > 0 &&
                                                !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                              ) {
                                                return <></>;
                                              }
                                              if (
                                                ele?.onlyOwner?.length > 0 &&
                                                !ele?.onlyOwner?.includes("otherFamilyDependentsDetails")
                                              ) {
                                                return;
                                              }
                                              let isRequire = false;
                                              if (
                                                !ele?.require &&
                                                ele?.requireCity?.length > 0 &&
                                                ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                              ) {
                                                isRequire = true;
                                              } else if (ele?.require) {
                                                isRequire = true;
                                              } else {
                                                isRequire = false;
                                              }
                                              return (
                                                <TableCell>
                                                  <HealthInsuranceDocsUpload
                                                    onDocumentDowmload={onDocumentDowmload}
                                                    keyName={ele?.key}
                                                    info={item}
                                                    handleFileUpload={handleFileUpload}
                                                    fileDocsLoader={fileDocsLoader}
                                                    personKey={`otherFamilyDependentsDetails`}
                                                    isRequire={isRequire}
                                                    startBlink={startBlink}
                                                  />
                                                </TableCell>
                                              );
                                            })}
                                          </TableRow>
                                        );
                                      }
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Box>
                          )}
                          {/* {"Workers details"} */}
                          {healthQuotationDetails?.healthInfo?.domesticWorkerDetails?.length > 0 && (
                            <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                              <Box
                                id={"domesticWorkerDetails"}
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
                                  Workers Details
                                </Typography>

                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Full Name</TableCell>
                                      <TableCell>DOB</TableCell>
                                      <TableCell>Gender</TableCell>
                                      {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                        healthQuotationDetails?.healthInfo?.visaStatus
                                      ]?.map((ele, i) => {
                                        if (
                                          ele?.requireCity?.length > 0 &&
                                          !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                        ) {
                                          return <></>;
                                        }
                                        if (
                                          ele?.onlyOwner?.length > 0 &&
                                          !ele?.onlyOwner?.includes("domesticWorkerDetails")
                                        ) {
                                          return;
                                        }
                                        return (
                                          <TableCell key={i}>
                                            {ele?.label}
                                            {!ele?.require &&
                                            ele?.requireCity?.length > 0 &&
                                            ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city) ? (
                                              <Span>*</Span>
                                            ) : ele?.require ? (
                                              <Span>*</Span>
                                            ) : (
                                              ""
                                            )}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  </TableHead>

                                  <TableBody>
                                    {healthQuotationDetails?.healthInfo?.domesticWorkerDetails?.map((item, idx) => {
                                      return (
                                        <TableRow hover>
                                          <TableCell>{item?.fullName}</TableCell>
                                          <TableCell>
                                            {isValid(parseISO(item?.dateOfBirth))
                                              ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                              : "Start date"}
                                          </TableCell>
                                          <TableCell>{item?.gender}</TableCell>
                                          {docsUploadData?.[healthQuotationDetails?.healthInfo?.insurerType]?.[
                                            healthQuotationDetails?.healthInfo?.visaStatus
                                          ]?.map((ele, i) => {
                                            if (
                                              ele?.requireCity?.length > 0 &&
                                              !ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                            ) {
                                              return <></>;
                                            }
                                            if (
                                              ele?.onlyOwner?.length > 0 &&
                                              !ele?.onlyOwner?.includes("domesticWorkerDetails")
                                            ) {
                                              return;
                                            }
                                            let isRequire = false;
                                            if (
                                              !ele?.require &&
                                              ele?.requireCity?.length > 0 &&
                                              ele?.requireCity?.includes(healthQuotationDetails?.healthInfo?.city)
                                            ) {
                                              isRequire = true;
                                            } else if (ele?.require) {
                                              isRequire = true;
                                            } else {
                                              isRequire = false;
                                            }
                                            return (
                                              <TableCell>
                                                <HealthInsuranceDocsUpload
                                                  onDocumentDowmload={onDocumentDowmload}
                                                  keyName={ele?.key}
                                                  info={item}
                                                  handleFileUpload={handleFileUpload}
                                                  fileDocsLoader={fileDocsLoader}
                                                  personKey={`domesticWorkerDetails`}
                                                  isRequire={isRequire}
                                                  startBlink={startBlink}
                                                />
                                              </TableCell>
                                            );
                                          })}
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Box>
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
                              Preference Details
                            </Typography>

                            <Grid container columnSpacing={8}>
                              <Grid item xs={12} sm={12}>
                                <List sx={{ py: 0 }}>
                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Dental Coverage"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.preferenceDetails?.dentalCoverage === true
                                            ? "Yes"
                                            : "No" || "-"
                                        }
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Optical Coverage"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.preferenceDetails?.opticalCoverage ===
                                          true
                                            ? "Yes"
                                            : "No" || "-"
                                        }
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Preferred Co Pay"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.preferenceDetails?.preferredCoPay || "-"
                                        }
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Preferred Hospital"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.preferenceDetails?.preferredHospital ||
                                          "-"
                                        }
                                      />
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
                              More Info
                            </Typography>

                            <Grid container columnSpacing={8}>
                              <Grid item xs={12} sm={12}>
                                <List sx={{ py: 0 }}>
                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Existing Medical Condition"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.regularMedication === true
                                            ? "Yes"
                                            : "No" || "-"
                                        }
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Optical Coverage"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.preferenceDetails?.opticalCoverage ===
                                          true
                                            ? "Yes"
                                            : "No" || "-"
                                        }
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />

                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Smoke"}
                                        value={healthQuotationDetails?.healthInfo?.smoke === true ? "Yes" : "No" || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Hypertension"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.hypertension === true
                                            ? "Yes"
                                            : "No" || "-"
                                        }
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />
                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Diabetes"}
                                        value={
                                          healthQuotationDetails?.healthInfo?.diabetes === true ? "Yes" : "No" || "-"
                                        }
                                      />
                                      <DividerCustom />
                                    </Grid>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Weight"}
                                        value={healthQuotationDetails?.healthInfo?.weight || "-"}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Divider />
                                  <Grid container>
                                    <Grid item xs={12} md={6} columnSpacing={4}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Height"}
                                        value={healthQuotationDetails?.healthInfo?.height || "-"}
                                      />
                                      <DividerCustom />
                                    </Grid>
                                  </Grid>

                                  <Divider />
                                </List>
                              </Grid>
                            </Grid>
                          </Box>

                          {(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor) && (
                            <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  width: "100%",
                                  py: 1.5,
                                  backgroundColor: "#f5f5f5",
                                  mb: 1,
                                  mt: 2,
                                  fontWeight: "600",
                                  fontSize: "18px",
                                  display: "inline-block",
                                  color: "#60176F",
                                  px: "14px",
                                }}
                              >
                                Edited Premium History
                              </Typography>
                              <Box>
                                <PremiumHistoryTable items={healthQuotationDetails?.editPrice} />
                              </Box>
                            </Box>
                          )}
                          {quotePayableDetails?.quoteInfo?.isPremiumRequestUpon &&
                          quotePayableDetails?.quoteInfo?.editPrice?.length <= 0 ? (
                            <></>
                          ) : (
                            <Box sx={{ mb: 2 }}>
                              <HealthPlanPaybleDetails
                                quotePayableDetails={quotePayableDetails}
                                selectedCheckboxes={[quotationId]}
                                policyFeeLoader={policyFeeLoader}
                              />
                            </Box>
                          )}
                          {moduleAccess(user, "healthQuote.update") && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 3,
                                flexWrap: "wrap",
                              }}
                            >
                              {paidProposalsList?.[0]?.paymentId && (
                                <Button
                                  type="button"
                                  variant="contained"
                                  onClick={() => onClickOnConfirm({ paidBy: "user" })}
                                  disabled={!!paidProposalsList?.[0]?.isBought}
                                  sx={{ minWidth: "140px" }}
                                >
                                  Complete
                                </Button>
                              )}
                              {!paidProposalsList?.[0]?.paymentId && (
                                <>
                                  <Button
                                    type="button"
                                    variant="contained"
                                    disabled={!!paidProposalsList?.[0]?.isBought}
                                    onClick={() => payByLinkHandler({ paidBy: "CRM - Direct to insurance company" })}
                                    sx={{ minWidth: "140px" }}
                                  >
                                    Paid to the company
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="contained"
                                    disabled={!!paidProposalsList?.[0]?.isBought}
                                    onClick={() => payByLinkHandler({ paidBy: "link" })}
                                    sx={{ minWidth: "140px" }}
                                  >
                                    Pay by link
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="contained"
                                    disabled={!!paidProposalsList?.[0]?.isBought}
                                    onClick={() => payByLinkHandler({ paidBy: "CRM - Bank transfer" })}
                                    sx={{ minWidth: "140px" }}
                                  >
                                    Pay by bank transfer
                                  </Button>
                                </>
                              )}
                            </Box>
                          )}
                        </>
                      )}

                      {currentTab === "coverages" && (
                        <>
                          {healthQuotationDetails ? (
                            <Box sx={{ display: "inline-block", width: "100%" }}>
                              {healthQuotationDetails?.includedCovers?.length > 0 && (
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
                                    {healthQuotationDetails?.includedCovers.length > 0 &&
                                      healthQuotationDetails?.includedCovers?.map((val, idx) => {
                                        return (
                                          <>
                                            <Grid item xs={12} md={6} sx={{ my: 2 }}>
                                              <Box sx={{ display: "flex", gap: 1 }}>
                                                <HeartPuls sx={{ fontSize: 40 }} />

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
                                                          xl: "14px",
                                                        },
                                                        lineHeight: {
                                                          xs: "13px",
                                                          sm: "16px",
                                                          xl: "19px",
                                                        },
                                                        fontWeight: "500",
                                                      }}
                                                    >
                                                      {val?.benefit?.name}
                                                    </Typography>
                                                  </Box>
                                                  <>
                                                    {val?.benefit?.valueType == "object" ? (
                                                      <Box>
                                                        <>
                                                          {val?.isEnabled
                                                            ? Object.entries(val?.[val?.benefit?.group] || {}).map(
                                                                ([key, value]) => (
                                                                  <>
                                                                    {key != "description" ? (
                                                                      <></>
                                                                    ) : (
                                                                      <Box key={key}>
                                                                        <Box sx={{ px: 1, ml: -4 }}>
                                                                          <Typography
                                                                            sx={{ fontSize: "14px" }}
                                                                            color="textSecondary"
                                                                            variant="body2"
                                                                            dangerouslySetInnerHTML={{
                                                                              __html: value,
                                                                            }}
                                                                          ></Typography>
                                                                        </Box>
                                                                      </Box>
                                                                    )}
                                                                  </>
                                                                )
                                                              )
                                                            : "-"}
                                                        </>
                                                      </Box>
                                                    ) : (
                                                      <Box sx={{ fontSize: "14px" }}>
                                                        {val?.value && val?.isEnabled ? val?.value : "-"}
                                                      </Box>
                                                    )}
                                                  </>
                                                </Box>
                                              </Box>
                                            </Grid>
                                          </>
                                        );
                                      })}
                                  </Grid>
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
              </>
            ) : (
              <>
                <AnimationLoader open={true} />
              </>
            )}
            {/* <HealthHistoryTable /> */}
          </Box>
        </Container>
        {
          // Modal for credit/debit upload (used when required documents like debit/credit info are missing)
        }{" "}
        <ModalComp
          open={viewCreditDebitModal}
          handleClose={() => {
            setViewCreditDebitModal(false);
          }}
          widths={{ xs: "95%", sm: "95%", md: 900 }}
        >
          <Box>
            <CreditDebitUpload
              handleClose={() => setViewCreditDebitModal(false)}
              quoteId={quotationId}
              insurerName={healthQuotationDetails?.healthInfo?.insurerName}
            />
          </Box>
        </ModalComp>
        {
          // Modal to select payment option (allows user to choose between payment methods like link or Tamara)
        }{" "}
        <ModalComp
          open={paymentOptionModal}
          handleClose={handleClosePaymentOptionmodal}
          widths={{ xs: "95%", sm: 500 }}
        >
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
              {/* Close button */}
              <Box onClick={handleClosePaymentOptionmodal} sx={{ display: "inline-block", mt: 0.6, cursor: "pointer" }}>
                <CrossSvg color="#60176F" />
              </Box>
            </Box>
            <Typography sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}>
              Select Payment option to generate payment link
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Grid container spacing={2}>
                {/* Payment option for generating payment link via CRM - Link */}
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

                {/* Payment option for payment via Tamara */}
                <Grid item xs={6}>
                  <Card
                    onClick={onPayByTamara} // Trigger Tamara payment option on click
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
        {
          // Modal for sharing the generated payment link (provides options to share via email or other methods)
        }{" "}
        <ModalComp
          open={paymentLinkShareModal}
          handleClose={() => setPaymentLinkShareModal(false)}
          widths={{ xs: "95%", sm: 500 }}
        >
          <SharePaymentLinkModal
            handleClose={() => setPaymentLinkShareModal(false)}
            paymentLink={paymentLinkOnfo?.paymentLink}
            setLoading={setLoading}
            credential={healthQuotationDetails}
            email={healthQuotationDetails?.healthInfo?.email}
            mobileNumber={healthQuotationDetails?.healthInfo?.mobileNumber}
          />
        </ModalComp>
        {
          // Modal for submitting transaction reference (used when user needs to provide a reference for payment)
        }{" "}
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
        {/* Edit Premium Modal */}
        <ModalComp open={openEditModal} handleClose={handleCloseEditModal} widths={{ xs: "95%", sm: "95%", md: 600 }}>
          {healthQuotationDetails && (
            <EditPremiumModal handleClose={handleCloseEditModal} quote={healthQuotationDetails} keyValue={"quote"} />
          )}
        </ModalComp>
      </Box>
    </>
  );
};

HealthQuotationDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthQuotationDetails;
