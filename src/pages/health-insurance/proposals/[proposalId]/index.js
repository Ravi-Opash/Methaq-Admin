import { Box, Container, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  getContactedProposals,
  getHealthInfoByproposalId,
  getHealthInsuranceCompany,
  getHealthProposalCommentsList,
  getHealthProposalQuotesById,
  getHealthQuotesPaybles,
  getPaidProposals,
  healthCheckoutPayment,
  healthInsurancePayByLink,
  healthPayByTamara,
  healthPurchaseConfirm,
  helathPolicyDocsUpload,
  reGenerateHealthProposalByProposalId,
} from "src/sections/health-insurance/Proposals/Action/healthInsuranceAction";
import NextLink from "next/link";
import {
  Button,
  Grid,
  Link,
  Tooltip,
  Typography,
  Card,
  CircularProgress,
  Divider,
  List,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ListItem,
  ListItemButton,
  Backdrop,
  Skeleton,
  SvgIcon,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { EditIcon } from "src/Icons/EditIcon";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import ListItemComp from "src/components/ListItemComp";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { format, intervalToDuration, isValid, parseISO } from "date-fns";
import { Scrollbar } from "src/components/scrollbar";
import { moduleAccess } from "src/utils/module-access";
import HealthProposalQuotationTable from "src/sections/health-insurance/Proposals/proposal-quotation-table";
import ModalComp from "src/components/modalComp";
import { CrossSvg } from "src/Icons/CrossSvg";
import TamaraLogo from "../../../../../public/assets/logos/tamara.png";
import NetworkLogo from "../../../../../public/assets/logos/NetworkLogo.svg";
import { toast } from "react-toastify";
import Image from "next/image";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import { payByLink } from "src/sections/Proposals/Action/proposalsAction";
import {
  setHealthInfoId,
  setHealthProposalPaymentInfo,
  setHealthProposalQuotationList,
  setHealthProposalQuotationListPagination,
  setHealthQuoteCount,
  sethealthInfoDetails,
} from "src/sections/health-insurance/Proposals/Reducer/healthInsuranceSlice";
import HealthInsuranceDocsUpload from "src/sections/health-insurance/Proposals/health-proposal-docs-upload";
import { getHealthComparePlans } from "src/sections/health-insurance/compare-plans/Action/healthComparePlanAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { socket } from "src/utils/socket";
import HealthPlanPaybleDetails from "src/sections/health-insurance/Proposals/health-plan-payble-details";
import HealthProposalAssignTask from "src/sections/health-insurance/Proposals/health-proposal-assign-task";
import HealthPromoCodeSession from "src/sections/health-insurance/Proposals/health-apply-promo-code";
import VerifyModal from "src/components/verifyModal";
import TransactionInfoModal from "src/sections/Proposals/transaction-Info-modal";
import PersonInfoEditModal from "src/sections/health-insurance/health-info/person-inf0-edit-form";
import InsuranceInfoEditModal from "src/sections/health-insurance/health-info/health-insurance-edit-form";
import PreferanceInfoEditModal from "src/sections/health-insurance/health-info/health-prefrence-edit-form";
import MoreInfoEditModal from "src/sections/health-insurance/health-info/health-more-info-form";
import KidsInfoEditModal from "src/sections/health-insurance/health-info/health-kids-info-form";
import SpouseInfoEditModal from "src/sections/health-insurance/health-info/health-spouse-edit-form";
import { debounce } from "src/utils/debounce-search";
import HealthProposalCommentsTable from "src/sections/health-insurance/Proposals/health-proposal-comments-table";
import AddCommentModal from "src/sections/customer/CustomerComments/add-comment-modal";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import AnimationLoader from "src/components/amimated-loader";
import { SeverityPill } from "src/components/severity-pill";
import CreditDebitUpload from "src/sections/health-insurance/Proposals/health-credit-debit-upload";

// Styling a custom span component to highlight text in red
const Span = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  color: "red",
}));

// Define an object that holds different document upload requirements based on user types
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
};

// Custom Divider styling for responsive layouts
const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const HealthInsuranceDetails = () => {
  const dispatch = useDispatch();
  const {
    healthProposalQuotationlist,
    healthProposalPaymentInfo,
    proposalHealthInfo,
    proposalHealthInfoLoader,
    healthProposalCommentListLoader,
    getHelathCompanyLoader,
    healthProposalCommentList,
    healthInfoId,
    policyFeeLoader,
    quotePayableDetails,
    paidProposalsList,
    healthSocketLoader,
  } = useSelector((state) => state.healthInsurance);
  const router = useRouter();
  const { proposalId } = router.query;
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [fileDocsLoader, setFileDocsLoader] = useState({});
  const [startBlink, setStartBlink] = useState(false);

  const [countPlanLoader, setCountPlanLoader] = useState(healthSocketLoader || false);
  const [commentModal, setCommentModal] = useState(false);

  // re-generate button disabled condition
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!healthSocketLoader) {
      tiggerCompletionOfRegenerate(!healthSocketLoader && countPlanLoader);
    }
  }, [healthSocketLoader]);

  const [isProposalPurchased, setIsProposalPurchased] = useState(false);
  const [isPolicyGenerated, setIsPolicyGenerated] = useState(false);
  const [policyIssued, setPolicyIssued] = useState(false);
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);
  const [policyId, setPolicyId] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);

  const [requireArray, setrequireArray] = useState([]);

  const [confirmPopup, setConfirmPopup] = useState(false);
  const handleConfirmModalClose = () => {
    setConfirmPopup(false);
  };

  const onSubmitChange = (value, quote_Id) => {
    const element = document.getElementById("regenerate");
    element.scrollIntoView({
      behavior: "smooth",
    });
    setConfirmPopup(false);
  };

  const [dirctToCompanyModal, setDirctToCompanyModal] = useState(false);
  const handleDirctToCompanyModalClose = () => setDirctToCompanyModal(false);
  const [isLoading, setLoading] = useState(true);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [viewCreditDebitModal, setViewCreditDebitModal] = useState(false);
  const [transactionRefModalOpen, setTransactionRefModalOpen] = useState(false);
  const HandleTransactionRefModalClose = () => setTransactionRefModalOpen(false);
  const [paidByMethod, setPaidByMethod] = useState("");
  const [transactionRefNo, setTransactionRefNo] = useState("");
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [isFromSocket, setIsFromSocket] = useState(false);

  const [editPersonalDeatils, setEditPersonalDeatils] = useState(false);
  const HandlePersonalModalClose = () => setEditPersonalDeatils(false);
  const [editInsurancelDeatils, setEditInsurancelDeatils] = useState(false);
  const HandleInsuranceModalClose = () => setEditInsurancelDeatils(false);
  const [editPreferencelDeatils, setEditPreferancelDeatils] = useState(false);
  const HandlePreferanceModalClose = () => setEditPreferancelDeatils(false);
  const [editMoreInfoDeatils, setEditMoreInfoDeatils] = useState(false);
  const HandleMoreInfoModalClose = () => setEditMoreInfoDeatils(false);
  const [editKidsInfoDeatils, setEditKidsInfoDeatils] = useState(false);
  const HandleKidsInfoModalClose = () => setEditKidsInfoDeatils(false);
  const [editSpouseInfoDeatils, setEditSpouseInfoDeatils] = useState(false);
  const HandleSpouseInfoModalClose = () => setEditSpouseInfoDeatils(false);
  const [copyText, setCopyText] = useState("");

  //Handle Check Box for select Quote
  const handleCheckboxChange = (value) => {
    if (selectedCheckboxes.includes(value)) {
      // Checkbox already selected, remove it from the selected checkboxes
      setSelectedCheckboxes(selectedCheckboxes.filter((item) => item !== value));
    } else {
      // Limit the selection to four checkboxes
      if (selectedCheckboxes.length < 4) {
        setSelectedCheckboxes([...selectedCheckboxes, value]);
      }
    }
  };

  useEffect(() => {
    if (selectedCheckboxes && selectedCheckboxes?.length == 1) {
      dispatch(getHealthQuotesPaybles(selectedCheckboxes?.[0]));
    }
  }, [selectedCheckboxes?.length]);

  //Check Documnet Hanlder
  const checkAllDocsHandler = () => {
    let obj = {
      isValid: true,
      key: "",
    };
    if (proposalHealthInfo) {
      docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
        proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
      ]?.map((ele) => {
        if (!proposalHealthInfo?.HealthProposal?.healthInfo?.[ele?.key] && ele?.require) {
          obj = {
            isValid: false,
            key: `ownerDetails`,
          };
        }

        if (
          !proposalHealthInfo?.HealthProposal?.healthInfo?.[ele?.key] &&
          !ele?.require &&
          ele?.requireCity?.length > 0 &&
          ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
        ) {
          obj = {
            isValid: false,
            key: `ownerDetails`,
          };
        }

        if (!proposalHealthInfo?.HealthProposal?.healthInfo?.[ele?.key] && !ele?.require && ele?.ownerRequire) {
          obj = {
            isValid: false,
            key: `ownerDetails`,
          };
        }

        //for kids document
        if (proposalHealthInfo?.HealthProposal?.healthInfo?.kidsDetails?.length > 0) {
          proposalHealthInfo?.HealthProposal?.healthInfo?.kidsDetails?.map((item) => {
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
              ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `kidsDetails`,
              };
            }
          });
        }
        // for spouse document
        if (proposalHealthInfo?.HealthProposal?.healthInfo?.spouseDetails?.length > 0) {
          proposalHealthInfo?.HealthProposal?.healthInfo?.spouseDetails?.map((item) => {
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
              ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `spouseDetails`,
              };
            }
          });
        }
        // for domestic worker document
        if (proposalHealthInfo?.HealthProposal?.healthInfo?.domesticWorkerDetails?.length > 0) {
          proposalHealthInfo?.HealthProposal?.healthInfo?.domesticWorkerDetails?.map((item) => {
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
              ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `domesticWorkerDetails`,
              };
            }
          });
        }
        //for other famliy and dependents
        if (proposalHealthInfo?.HealthProposal?.healthInfo?.otherFamilyDependentsDetails?.length > 0) {
          proposalHealthInfo?.HealthProposal?.healthInfo?.otherFamilyDependentsDetails?.map((item) => {
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
              ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
            ) {
              obj = {
                isValid: false,
                key: `otherFamilyDependentsDetails`,
              };
            }
          });
        }
        //for parents
        if (proposalHealthInfo?.HealthProposal?.healthInfo?.parentsDetails?.length > 0) {
          proposalHealthInfo?.HealthProposal?.healthInfo?.parentsDetails?.map((item) => {
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
              ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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

  // Function to update the status based on a list of quotes
  const setStatusByListOfQuotes = (list = [], changed) => {
    // Prevent updates if proposalId matches and there's no change
    if (healthProposalPaymentInfo?.proposalId == proposalId && !changed) {
      return;
    }

    // Initializing flags to track the status of the proposal
    let pPurchased = false;
    let pGenerated = false;
    let pIssued = false;
    let policyId = "";

    // Iterate through the list of quotes to update the statuses
    list?.map((quote) => {
      if (quote.isPaid > 0) {
        setIsProposalPurchased(true); // Set proposal as purchased if payment is made
        pPurchased = true;
      }
      if (quote.isBought) {
        setIsPolicyGenerated(true); // Mark the policy as generated
        pGenerated = true;
        setPolicyId(quote?.policy?._id); // Store the policy ID
        policyId = quote?.policy?._id;
      }
      if (quote.policyIssued) {
        setPolicyIssued(true); // Mark the policy as issued
        pIssued = true;
        setPolicyId(quote?.policy?._id); // Store the policy ID
        policyId = quote?.policy?._id;
      }
    });

    // Reset status flags if conditions aren't met
    if (!pPurchased) {
      setIsProposalPurchased(false);
    }
    if (!pGenerated) {
      setIsPolicyGenerated(false);
    }
    if (!pIssued) {
      setPolicyIssued(false);
    }

    // Dispatch action to update the health proposal payment info in the store
    dispatch(
      setHealthProposalPaymentInfo({
        proposalId: proposalId,
        policyIssued: pIssued,
        isPolicyGenerated: pGenerated,
        isProposalPurchased: pPurchased,
        policyId: policyId,
      })
    );
  };

  // Function to open the proposal link in a new tab based on the current domain
  const onViewProposalOnline = () => {
    let temp;
    const domainName = window.location.origin;

    // Determine the environment and set the correct base URL for the proposal link
    if (domainName === "https://admin.dev.esanad.com") {
      temp = "https://dev.esanad.com";
    } else if (domainName === "https://admin.esanad.com") {
      temp = "https://esanad.com";
    } else if (domainName === "http://localhost:3000") {
      temp = "https://dev.esanad.com";
    }

    // Construct the full proposal link using the internal reference of the first quotation
    const plink = temp + "/health-insurance/getQuote?ref=" + healthProposalQuotationlist[0]?.internalRef;

    // Create a new link element, set its href to the proposal link, and trigger a click to open it
    const link = document.createElement("a");
    link.href = plink;
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Function to download the PDF file related to the health proposal
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", proposalHealthInfo?.HealthProposal?.healthInfo?.healthPdf?.filename);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Using a ref to prevent multiple initializations
  const initialized = useRef(false);

  // Function to fetch proposal summary information
  const fetchProposalSummary = (changed) => {
    dispatch(
      getHealthProposalQuotesById({
        id: proposalId,
        page: 1,
        size: 1,
      })
    )
      .unwrap()
      .then((res) => {
        setIsFromSocket(false);
      })
      .catch((err) => {
        // console.log(err);
      });

    dispatch(getHealthInfoByproposalId({ proposalId: proposalId, healthInfoId: healthInfoId }))
      .then((res) => {})
      .catch((err) => {
        toast.error(err);
      });

    dispatch(getHealthInsuranceCompany(proposalId))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        toast.error(err);
      });

    dispatch(getPaidProposals(proposalId))
      .unwrap()
      .then((res) => {
        setStatusByListOfQuotes([...res?.data], changed);
      })
      .catch((err) => {
        toast.error(err);
      });

    dispatch(getContactedProposals(proposalId))
      .unwrap()
      .then((res) => {
        // setStatusByListOfQuotes([...res?.data?.paidProposals, res?.data?.contactProposals], changed);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // Function to fetch health proposal comments
  const healthCommentlisthandler = () => {
    dispatch(getHealthProposalCommentsList(proposalId));
  };

  // useEffect to fetch proposal summary and comments on component mount or healthInfoId change
  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    fetchProposalSummary(true);
    healthCommentlisthandler();
  }, [healthInfoId]);

  // Clean up on component unmount: reset the store data for pagination and proposal payment info
  useEffect(() => {
    return () => {
      dispatch(setHealthProposalQuotationListPagination({ page: 1, size: 10 }));
      dispatch(setHealthProposalPaymentInfo(null));
    };
  }, []);

  // Handler for initiating payment via link (CRM or user bank transfer)
  const payByLinkHandler = (paidBy) => {
    let validation = checkAllDocsHandler();
    if (!validation?.isValid) {
      toast.error("Please upload all documents!");
      setStartBlink(true); // Start the blinking effect to indicate missing documents
      const delay = setTimeout(() => {
        setStartBlink(false); // Stop blinking after a timeout
      }, 5000);

      if (validation?.key) {
        // Scroll to the document input element that is missing
        const element = document.getElementById(`${validation?.key}`);
        element.scrollIntoView({ behavior: "smooth" });
      }

      return () => clearTimeout(delay); // Clear timeout if the validation fails
    }

    // Additional checks to ensure only one quote is selected and handle payments
    if (isProposalPurchased === true) {
      toast("You already bought policy for this proposal!", { type: "error" });
    } else if (selectedCheckboxes.length === 0) {
      toast("Please select quotation which you want to buy!", { type: "error" });
      const element = document.getElementById("health-quotation-list");
      element.scrollIntoView({ behavior: "smooth" });
    } else if (selectedCheckboxes.length >= 2) {
      toast("Please select only one quotation!", { type: "error" });
    } else if (
      (paidBy?.paidBy === "CRM - Bank transfer" ||
        paidBy?.paidBy === "user" ||
        paidBy?.paidBy === "CRM - Direct to insurance company") &&
      !quotePayableDetails?.quoteInfo?.debitFile &&
      !quotePayableDetails?.quoteInfo?.taxInfo
    ) {
      setViewCreditDebitModal(true);
      return;
    } else {
      // Handle different payment methods
      if (paidBy?.paidBy == "link") {
        setVerifyModal(true);
        return;
      }
      if (paidBy?.paidBy == "CRM - Direct to insurance company") {
        setrequireArray(["proofAmount", "proofOfPayment", "transactionRefNo"]); // Set required fields for direct payment
      }
      if (paidBy?.paidBy == "CRM - Bank transfer") {
        setrequireArray(["transactionRefNo"]); // Set required fields for bank transfer payment
      }
      setTransactionRefModalOpen(true); // Open transaction reference modal
      setPaidByMethod(paidBy?.paidBy); // Set the selected payment method
    }
  };

  // Handler for generating the payment link for CRM or user
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(healthCheckoutPayment({ quoteId: selectedCheckboxes[0], paidBy: "CRM - Link" }))
      .unwrap()
      .then((data) => {
        handleCloseVerifymodal();
        setPaymentLinkInfo(data); // Store payment link info
        setPaymentLinkShareModal(true); // Open the payment link share modal
        setLoading(true);
      })
      .catch((err) => {
        toast(err, { type: "error" });
        setLoading(true);
        handleCloseVerifymodal(); // Close the modal if an error occurs
      });
  };

  // Handler for payment via Tamara (alternative payment method)
  const onPayByTamara = () => {
    setLoading(false);
    dispatch(healthPayByTamara({ quoteId: selectedCheckboxes[0], paidBy: "CRM - Tamara" }))
      .unwrap()
      .then((data) => {
        handleCloseVerifymodal();
        setPaymentLinkInfo(data); // Store the payment link info
        setPaymentLinkShareModal(true); // Open the share modal for payment link
        setLoading(true);
      })
      .catch((err) => {
        toast(err, { type: "error" });
        setLoading(true);
        handleCloseVerifymodal();
      });
  };

  // Handler for confirming the payment after selecting a quote
  const onClickOnConfirm = (paidBy) => {
    let validation = checkAllDocsHandler(); // Validate if all documents are uploaded
    if (!validation?.isValid) {
      toast.error("Please upload all required documents!");
      setStartBlink(true);
      const delay = setTimeout(() => {
        setStartBlink(false);
      }, 5000);

      if (validation?.key) {
        // Scroll to the missing document input element
        const element = document.getElementById(`${validation?.key}`);
        element.scrollIntoView({ behavior: "smooth" });
      }

      return () => clearTimeout(delay);
    }

    // Handle multiple quotation selection validation
    if (selectedCheckboxes.length === 0) {
      toast("Please select quotation which you want to Confirm!", { type: "error" });
    } else if (selectedCheckboxes.length >= 2) {
      toast("Please select only one quotation!", { type: "error" });
    } else {
      setLoading(false);
      dispatch(healthPurchaseConfirm({ id: selectedCheckboxes[0], data: { paidBy: paidBy } }))
        .then((res) => {
          if (res?.error?.message) {
            toast.error(res.payload);
          } else {
            toast.success("Payment confirmed successfully!");
            fetchProposalSummary(true);
          }
          setLoading(true);
        })
        .catch((err) => {
          toast.error(err);
          setLoading(true);
        });
    }
  };

  // Handle submitting the transaction reference number after payment
  const handleSubmitRefNo = (data) => {
    setLoading(false);
    dispatch(
      healthInsurancePayByLink({
        id: selectedCheckboxes[0],
        data: data,
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.error?.message) {
          toast.error(res.payload);
        } else {
          toast.success("Payment confirmed successfully!");
          fetchProposalSummary(true);
        }
        setLoading(true);
        HandleTransactionRefModalClose(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(true);
      });
  };

  // Function to handle downloading documents via a given PDF URL
  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a"); // Create a temporary anchor element
    link.href = baseURL + "/" + pdfUrl; // Set the URL to the file path
    link.setAttribute("target", "_blank"); // Open the file in a new tab
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link); // Add the anchor element to the DOM
    link.click(); // Simulate a click to trigger the download
    link.remove(); // Clean up by removing the temporary anchor element
  };

  // Function to handle selecting a plan (up to 4 plans) for comparison
  const onPlanSelectHandler = (value, id) => {
    if (selectedPlans?.length >= 4 && !selectedPlans?.includes(id)) {
      toast.error("You can select 4 plans maximum!"); // Show error if more than 4 plans are selected
      return;
    }
    let arr = selectedPlans;
    if (selectedPlans?.includes(id)) {
      // Deselect the plan if it was already selected
      let filterArray = arr?.filter((i) => i !== id);
      setSelectedPlans(filterArray);
    } else {
      // Add the selected plan to the list
      arr = [...arr, id];
      setSelectedPlans(arr);
    }
  };

  // Function to trigger a comparison of selected plans
  const handleCompare = () => {
    if (selectedCheckboxes.length <= 1) {
      toast.error("Please select at least 2 quotes to compare"); // Ensure that at least 2 plans are selected
      return;
    }
    dispatch(
      getHealthComparePlans({
        ids: selectedPlans,
        refId: healthProposalQuotationlist?.[0]?.internalRef || proposalHealthInfo?.HealthProposal?.refId,
      })
    )
      .then((res) => {
        // Navigate to the comparison page once data is fetched
        router.push("/health-insurance/compare-plans");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  // Function to copy a proposal ID to the clipboard
  const copyToClipboard = (proposalId) => {
    navigator.clipboard
      .writeText(proposalId)
      .then(() => {
        toast.success("Copied to clipboard!");
        setTimeout(() => {
          setCopyText("");
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Function to handle file uploads (such as uploading policy documents)
  const handleFileUpload = (event, personKey, personId, docsKey) => {
    setFileDocsLoader({ ...fileDocsLoader, [`${personId}-${docsKey}`]: true });
    if (event?.target?.files?.[0]) {
      const file = event?.target?.files?.[0];
      const payload = {
        healthInfoId: proposalHealthInfo?.HealthProposal?.healthInfo?._id,
        detailsToUpdate: personKey,
        detailsId: personId,
        [`${docsKey}`]: file, // Attach the file to the payload
      };
      const formdata = jsonToFormData(payload);

      dispatch(helathPolicyDocsUpload(formdata))
        ?.unwrap()
        .then((res) => {
          toast?.success("Successfully Uploaded!");
          let resultData = proposalHealthInfo?.HealthProposal;
          if (resultData) {
            resultData = { ...resultData, healthInfo: res?.data };
          }
          dispatch(sethealthInfoDetails({ ...proposalHealthInfo, HealthProposal: resultData }));
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

  // Function to trigger completion of the regeneration process (with debounce)
  const tiggerCompletionOfRegenerate = (value) => {
    if (value) {
      setCountPlanLoader(false);
      toast?.success("Proposal Regenerated Successfully!");
      setIsDisabled(false);
      fetchProposalSummary(true);
    }
  };

  // Debounced version of the regenerate trigger function
  const debounceProposalsHandler = debounce(tiggerCompletionOfRegenerate, 2000);

  // Function to handle the regeneration of a health proposal
  const ReGenerateHandler = useCallback(
    (healthProposalQuotationlist) => {
      setIsDisabled(true);
      setLoading(false);
      if (socket && (healthProposalQuotationlist?.[0]?.reqId || proposalHealthInfo?.HealthProposal?.reqId)) {
        if (socket.disconnected) socket.connect();
        socket.off("health-quote-created");
        socket.emit("join", {
          room: healthProposalQuotationlist?.[0]?.reqId || proposalHealthInfo?.HealthProposal?.reqId,
        });

        socket.on("health-quote-created", (quote) => {
          if (quote?.Errors?.length > 0) {
          } else {
            setCountPlanLoader(true);
            dispatch(setHealthProposalQuotationList(quote));
            setIsFromSocket(true);
            dispatch(setHealthQuoteCount(-1));
            debounceProposalsHandler(true);
          }
        });

        socket.off("quote-counter");
        socket.on("quote-counter", (count) => {
          dispatch(setHealthQuoteCount(count));
        });
      }

      setSelectedCheckboxes([]);
      dispatch(
        reGenerateHealthProposalByProposalId({
          healthInfoId: proposalHealthInfo?.HealthProposal?.healthInfo?._id,
          proposalNo: proposalId,
          refId: healthProposalQuotationlist?.[0]?.internalRef || proposalHealthInfo?.HealthProposal?.refId,
          reqId: healthProposalQuotationlist?.[0]?.reqId || proposalHealthInfo?.HealthProposal?.reqId,
        })
      )
        .unwrap()
        .then((res) => {
          // toast?.success("Proposal Regenerated Successfully!");
          setLoading(true);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          setLoading(true);
        });
    },
    [proposalHealthInfo]
  );

  // Function to fetch health info by proposal ID
  const getHealthInfoByPrposalIdHandler = () => {
    dispatch(
      getHealthInfoByproposalId({
        proposalId: proposalId,
        healthInfoId: proposalHealthInfo?.HealthProposal?.healthInfo?._id,
      })
    )
      .then((res) => {})
      .catch((err) => {
        toast.error(err);
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
          <AnimationLoader open={true} />
        </>
      )}
      {countPlanLoader && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }} open={countPlanLoader}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, fontWeight: 700 }}>
            <Typography variant="h4" sx={{ fontSize: 24, color: "#60176F" }}>{`Getting Plans .... ${
              healthProposalQuotationlist?.length || 0
            }`}</Typography>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Box>
        </Backdrop>
      )}

      <Container maxWidth={false}>
        <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
          <Box
            sx={{
              display: "inline-block",
            }}
          >
            <NextLink href="/health-insurance/proposals" passHref>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Health insurance proposals</Typography>
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
                mt: 5,
              }}
            >
              {" "}
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Typography variant="h4">Health Proposal Details</Typography>
                <SeverityPill color={"success"} fontSize={16} onClick={() => copyToClipboard(proposalId)}>
                  {`#${proposalId}`}
                </SeverityPill>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "start", md: "center" },
                  alignItems: "cener",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "inline-block" }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                      setCommentModal(true);
                    }}
                    startIcon={
                      <SvgIcon fontSize="small">
                        <SpeakerNotesIcon />
                      </SvgIcon>
                    }
                  >
                    Comments
                  </Button>
                </Box>
                <Tooltip title="Download PDF">
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                      proposalHealthInfo?.HealthProposal?.healthInfo?.healthPdf?.link
                        ? downloadPdf(
                            process.env.NEXT_PUBLIC_BASE_URL +
                              proposalHealthInfo?.HealthProposal?.healthInfo?.healthPdf?.link
                          )
                        : downloadPdf(
                            process.env.NEXT_PUBLIC_BASE_URL +
                              "/" +
                              proposalHealthInfo?.HealthProposal?.healthInfo?.healthPdf?.path
                          );
                    }}
                    startIcon={
                      <SvgIcon fontSize="small">
                        <DownloadSvg />
                      </SvgIcon>
                    }
                  >
                    <span>Download PDF</span>
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
          {!proposalHealthInfoLoader ? (
            <Box sx={{ display: "inline-block", width: "100%" }}>
              {isPolicyGenerated && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 1,
                    p: 2.5,
                    backgroundColor: "#e5f7e5",
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px $e5f7e5",
                    borderRadius: "10px 10px 10px 10px",
                  }}
                >
                  <Typography sx={{ ml: 0, fontWeight: 600, color: "#111927" }}>
                    This proposal has been made into a policy, Click here to view policy.
                  </Typography>
                  <Button
                    type="button"
                    sx={{ mr: 1 }}
                    variant="contained"
                    onClick={() => router.push(`/health-insurance/policies/${policyId}`)}
                  >
                    View Policy
                  </Button>
                </Box>
              )}
              {(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor) && (
                <>
                  {healthProposalQuotationlist?.length > 0 ? (
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <HealthProposalAssignTask
                        proposalId={proposalId}
                        assignedAgent={healthProposalQuotationlist?.[0]?.adminId}
                      />
                    </Box>
                  ) : (
                    <Box>
                      <Skeleton height={50} />
                      <Skeleton height={30} />
                      <Skeleton height={30} width={300} />
                      <Skeleton height={30} />
                    </Box>
                  )}
                </>
              )}

              {healthProposalQuotationlist?.length > 0 ? (
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <HealthPromoCodeSession
                    proposalId={healthProposalQuotationlist?.[0]?.proposalNo}
                    items={healthProposalQuotationlist?.[0]}
                    fetchProposalSummary={fetchProposalSummary}
                    isPurchased={!!paidProposalsList?.[0]?.isPaid}
                  />
                </Box>
              ) : (
                <Box>
                  <Skeleton height={30} />
                  <Skeleton height={130} />
                </Box>
              )}
              <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <ProposalStatusSession
                    proposalId={proposalId}
                    items={proposalHealthInfo?.HealthProposal}
                    fetchProposalSummary={() => fetchProposalSummary(false)}
                    isPolicyGenerated={isPolicyGenerated}
                    policyIssued={policyIssued}
                    flag={"Health"}
                  />
                </Box>
                <Box
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    mb: 3,
                    borderRadius: "10px",
                    background: "white",
                    boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Scrollbar>
                    <Box
                      sx={{
                        display: "flex",
                        minWidth: 700,
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f5f5f5",
                        p: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          mb: 0,
                          pl: 1,
                          fontWeight: "600",
                          fontSize: "18px",
                          display: "inline-block",
                          color: "#60176F",
                        }}
                      >
                        Quotations
                      </Typography>
                      <Box>
                        <Box sx={{ display: "inline-block" }}>
                          <Button
                            onClick={onViewProposalOnline}
                            sx={{
                              textDecoration: "underline",
                              textDecorationColor: "#60176F !important",
                            }}
                          >
                            View online
                          </Button>
                        </Box>
                        <Button
                          // href="#text-buttons"
                          sx={{
                            textDecoration: "underline",
                            textDecorationColor: "#60176F !important",
                          }}
                          onClick={handleCompare}
                        >
                          Generate a comparison
                        </Button>
                      </Box>
                    </Box>
                  </Scrollbar>
                  {getHelathCompanyLoader ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "500px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box id={"health-quotation-list"} sx={{ display: "inline-block", width: "100%" }}>
                      <HealthProposalQuotationTable
                        handleCheckboxChange={handleCheckboxChange}
                        checkSelect={selectedCheckboxes}
                        onPlanSelectHandler={onPlanSelectHandler}
                        isFromSocket={isFromSocket}
                        isPurchased={isProposalPurchased}
                        setSelectedCheckboxes={setSelectedCheckboxes}
                      />
                    </Box>
                  )}
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
                      Insurance Details
                    </Typography>
                    {moduleAccess(user, "healthQuote.update") && (
                      <>
                        {!isPolicyGenerated && (
                          <EditIcon
                            onClick={() => setEditInsurancelDeatils(true)}
                            sx={{ fontSize: 30, cursor: "pointer" }}
                          />
                        )}
                      </>
                    )}
                  </Box>
                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={10}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Insurance Type"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Current Visa Status"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus || "-"}
                            />
                          </Grid>
                        </Grid>
                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Current Insurer"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.currentInsurer || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Current Insurer Expiry Date"}
                              value={
                                proposalHealthInfo?.HealthProposal?.healthInfo?.currentInsurerExpiryDate
                                  ? format(
                                      parseISO(
                                        proposalHealthInfo?.HealthProposal?.healthInfo?.currentInsurerExpiryDate
                                      ),
                                      "dd/MM/yyyy"
                                    )
                                  : "-"
                              }
                            />
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
                    {moduleAccess(user, "healthQuote.update") && (
                      <>
                        {!isPolicyGenerated && (
                          <EditIcon
                            onClick={() => setEditPersonalDeatils(true)}
                            sx={{ fontSize: 30, cursor: "pointer" }}
                          />
                        )}
                      </>
                    )}
                  </Box>

                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Full Name"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.fullName || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Email"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.email || "-"}
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
                                proposalHealthInfo?.HealthProposal?.healthInfo?.mobileNumber
                                  ? `+971 ${proposalHealthInfo?.HealthProposal?.healthInfo?.mobileNumber}`
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
                                proposalHealthInfo?.HealthProposal?.healthInfo?.dateOfBirth
                                  ? format(
                                      parseISO(proposalHealthInfo?.HealthProposal?.healthInfo?.dateOfBirth),
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
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.gender || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Insurer Type"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType || "-"}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              isCopy={true}
                              label={"Marital Status"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.maritalStatus || "-"}
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              isCopy={true}
                              label={"Nationality"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.nationality || "-"}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              isCopy={true}
                              label={"Salary"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.salary || "-"}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              isCopy={true}
                              label={"Current visa status"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus || "-"}
                            />
                          </Grid>
                        </Grid>
                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              isCopy={true}
                              label={"City"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.city || "-"}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              isCopy={true}
                              label={"Age"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.age || "-"}
                            />
                          </Grid>
                        </Grid>

                        <Divider />
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <ListItemComp
                              isCopy={true}
                              label={"Insurer Name"}
                              value={proposalHealthInfo?.HealthProposal?.healthInfo?.insurerName || "-"}
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container columnSpacing={0}>
                          {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                            proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
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
                              ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                                                proposalHealthInfo?.HealthProposal?.healthInfo?.city
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
                                            info={proposalHealthInfo?.HealthProposal?.healthInfo}
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

                        <Divider />

                        <Grid container>
                          <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mt: 2,
                                  py: 1,
                                  fontWeight: "600",
                                  fontSize: "15px",
                                  display: "inline-block",
                                  color: "#60176F",
                                  px: "14px",
                                }}
                              >
                                Age Calculator
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid container>
                            <Grid item xs={12} md={12}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Date of birth</TableCell>
                                    <TableCell>Current Date</TableCell>
                                    <TableCell>Years</TableCell>
                                    <TableCell>Months</TableCell>
                                    <TableCell>Days</TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  <TableRow hover>
                                    <TableCell>
                                      {proposalHealthInfo?.HealthProposal?.healthInfo?.dateOfBirth
                                        ? format(
                                            parseISO(proposalHealthInfo?.HealthProposal?.healthInfo?.dateOfBirth),
                                            "dd/MM/yyyy"
                                          )
                                        : "-"}
                                    </TableCell>
                                    <TableCell>{format(parseISO(new Date().toISOString()), "dd/MM/yyyy")}</TableCell>
                                    {proposalHealthInfo?.HealthProposal?.healthInfo?.dateOfBirth && (
                                      <>
                                        <TableCell>
                                          {
                                            intervalToDuration({
                                              start: new Date(),
                                              end: new Date(
                                                proposalHealthInfo?.HealthProposal?.healthInfo?.dateOfBirth
                                              ),
                                            })?.years
                                          }
                                        </TableCell>
                                        <TableCell>
                                          {
                                            intervalToDuration({
                                              start: new Date(),
                                              end: new Date(
                                                proposalHealthInfo?.HealthProposal?.healthInfo?.dateOfBirth
                                              ),
                                            })?.months
                                          }
                                        </TableCell>
                                        <TableCell>
                                          {
                                            intervalToDuration({
                                              start: new Date(),
                                              end: new Date(
                                                proposalHealthInfo?.HealthProposal?.healthInfo?.dateOfBirth
                                              ),
                                            })?.days
                                          }
                                        </TableCell>
                                      </>
                                    )}
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Grid>
                          </Grid>
                        </Grid>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
                {/* {"Spouse details"} */}
                {proposalHealthInfo?.HealthProposal?.healthInfo?.spouseDetails?.length > 0 && (
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
                        <EditIcon
                          onClick={() => setEditSpouseInfoDeatils(true)}
                          sx={{ fontSize: 30, cursor: "pointer" }}
                        />
                      </Box>

                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell>DOB</TableCell>
                            <TableCell>Age (Years/Months/Days)</TableCell>
                            <TableCell>Gender</TableCell>
                            {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                              proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                            ]?.map((ele, i) => {
                              if (
                                ele?.requireCity?.length > 0 &&
                                !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                                  ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city) ? (
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
                          {proposalHealthInfo?.HealthProposal?.healthInfo?.spouseDetails?.map((item, idx) => {
                            return (
                              <TableRow hover>
                                <TableCell>{item?.fullName}</TableCell>
                                <TableCell>
                                  {isValid(parseISO(item?.dateOfBirth))
                                    ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                    : "Start date"}
                                </TableCell>
                                <TableCell>
                                  {`${item?.age} (${
                                    intervalToDuration({
                                      start: new Date(),
                                      end: new Date(item?.dateOfBirth),
                                    })?.years
                                  }/${
                                    intervalToDuration({
                                      start: new Date(),
                                      end: new Date(item?.dateOfBirth),
                                    })?.months
                                  }/${
                                    intervalToDuration({
                                      start: new Date(),
                                      end: new Date(item?.dateOfBirth),
                                    })?.days
                                  })`}
                                </TableCell>
                                <TableCell>{item?.gender}</TableCell>
                                {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                                  proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                                ]?.map((ele, i) => {
                                  if (
                                    ele?.requireCity?.length > 0 &&
                                    !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
                                  ) {
                                    return <></>;
                                  }
                                  if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("spouseDetails")) {
                                    return;
                                  }
                                  let isRequire = false;
                                  if (
                                    !ele?.require &&
                                    ele?.requireCity?.length > 0 &&
                                    ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
                                  ) {
                                    isRequire = true;
                                  } else if (ele?.require) {
                                    isRequire = true;
                                  } else {
                                    isRequire = false;
                                  }
                                  return (
                                    <TableCell key={i}>
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
                {proposalHealthInfo?.HealthProposal?.healthInfo?.kidsDetails?.length > 0 && (
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
                            px: "14px",
                            borderRadius: "10px 10px 0 0",
                          }}
                        >
                          Kids Details
                        </Typography>
                        <EditIcon
                          onClick={() => setEditKidsInfoDeatils(true)}
                          sx={{ fontSize: 30, cursor: "pointer" }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 700 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Full Name</TableCell>
                              <TableCell>DOB</TableCell>
                              <TableCell>Age (Years/Months/Days)</TableCell>
                              <TableCell>Gender</TableCell>
                              {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                                proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                              ]?.map((ele, i) => {
                                if (
                                  ele?.requireCity?.length > 0 &&
                                  !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                                    ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city) ? (
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
                            {[...proposalHealthInfo?.HealthProposal?.healthInfo?.kidsDetails]
                              ?.sort((a, b) => {
                                if (b?._id > a?._id) {
                                  return -1;
                                }
                                if (b?._id <= a?._id) {
                                  return 1;
                                }
                              })
                              ?.map((item, idx) => {
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
                                    <TableCell>
                                      {`${item?.age} (${
                                        intervalToDuration({
                                          start: new Date(),
                                          end: new Date(item?.dateOfBirth),
                                        })?.years
                                      }/${
                                        intervalToDuration({
                                          start: new Date(),
                                          end: new Date(item?.dateOfBirth),
                                        })?.months
                                      }/${
                                        intervalToDuration({
                                          start: new Date(),
                                          end: new Date(item?.dateOfBirth),
                                        })?.days
                                      })`}
                                    </TableCell>
                                    <TableCell>{item?.gender}</TableCell>
                                    {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                                      proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                                    ]?.map((ele, i) => {
                                      if (
                                        ele?.requireCity?.length > 0 &&
                                        !ele?.requireCity?.includes(
                                          proposalHealthInfo?.HealthProposal?.healthInfo?.city
                                        )
                                      ) {
                                        return <></>;
                                      }
                                      if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("kidsDetails")) {
                                        return;
                                      }
                                      let isRequire = false;
                                      if (
                                        !ele?.require &&
                                        ele?.requireCity?.length > 0 &&
                                        ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                  </Box>
                )}
                {/* {"Parents details"} */}
                {proposalHealthInfo?.HealthProposal?.healthInfo?.parentDetails?.length > 0 && (
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
                            {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                              proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                            ]?.map((ele, i) => {
                              if (
                                ele?.requireCity?.length > 0 &&
                                !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                                  ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city) ? (
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
                          {[...proposalHealthInfo?.HealthProposal?.healthInfo?.parentDetails]
                            ?.sort((a, b) => {
                              if (b?._id > a?._id) {
                                return -1;
                              }
                              if (b?._id <= a?._id) {
                                return 1;
                              }
                            })
                            ?.map((item, idx) => {
                              return (
                                <TableRow hover>
                                  <TableCell>{item?.fullName}</TableCell>
                                  <TableCell>
                                    {isValid(parseISO(item?.dateOfBirth))
                                      ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                      : "Start date"}
                                  </TableCell>
                                  <TableCell>{item?.gender}</TableCell>
                                  {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                                    proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                                  ]?.map((ele, i) => {
                                    if (
                                      ele?.requireCity?.length > 0 &&
                                      !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
                                    ) {
                                      return <></>;
                                    }
                                    if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("parentDetails")) {
                                      return;
                                    }
                                    let isRequire = false;
                                    if (
                                      !ele?.require &&
                                      ele?.requireCity?.length > 0 &&
                                      ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                {proposalHealthInfo?.HealthProposal?.healthInfo?.otherFamilyDependentsDetails?.length > 0 && (
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
                            {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                              proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                            ]?.map((ele, i) => {
                              if (
                                ele?.requireCity?.length > 0 &&
                                !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                                  ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city) ? (
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
                          {proposalHealthInfo?.HealthProposal?.healthInfo?.otherFamilyDependentsDetails
                            ?.sort((a, b) => {
                              if (b?._id > a?._id) {
                                return -1;
                              }
                              if (b?._id <= a?._id) {
                                return 1;
                              }
                            })
                            ?.map((item, idx) => {
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
                                  <TableCell>{item?.gender}</TableCell>
                                  {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                                    proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                                  ]?.map((ele, i) => {
                                    if (
                                      ele?.requireCity?.length > 0 &&
                                      !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                                      ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                            })}
                        </TableBody>
                      </Table>
                    </Box>
                  </Box>
                )}
                {/* {"Workers details"} */}
                {proposalHealthInfo?.HealthProposal?.healthInfo?.domesticWorkerDetails?.length > 0 && (
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
                            {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                              proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                            ]?.map((ele, i) => {
                              if (
                                ele?.requireCity?.length > 0 &&
                                !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
                              ) {
                                return <></>;
                              }
                              if (ele?.onlyOwner?.length > 0 && !ele?.onlyOwner?.includes("domesticWorkerDetails")) {
                                return;
                              }
                              return (
                                <TableCell key={i}>
                                  {ele?.label}
                                  {!ele?.require &&
                                  ele?.requireCity?.length > 0 &&
                                  ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city) ? (
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
                          {[...proposalHealthInfo?.HealthProposal?.healthInfo?.domesticWorkerDetails]
                            ?.sort((a, b) => {
                              if (b?._id > a?._id) {
                                return -1;
                              }
                              if (b?._id <= a?._id) {
                                return 1;
                              }
                            })
                            ?.map((item, idx) => {
                              let isRequire = false;
                              if (
                                !ele?.require &&
                                ele?.requireCity?.length > 0 &&
                                ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
                              ) {
                                isRequire = true;
                              } else if (ele?.require) {
                                isRequire = true;
                              } else {
                                isRequire = false;
                              }
                              return (
                                <TableRow hover>
                                  <TableCell>{item?.fullName}</TableCell>
                                  <TableCell>
                                    {isValid(parseISO(item?.dateOfBirth))
                                      ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                                      : "Start date"}
                                  </TableCell>
                                  <TableCell>{item?.gender}</TableCell>
                                  {docsUploadData?.[proposalHealthInfo?.HealthProposal?.healthInfo?.insurerType]?.[
                                    proposalHealthInfo?.HealthProposal?.healthInfo?.visaStatus
                                  ]?.map((ele, i) => {
                                    if (
                                      ele?.requireCity?.length > 0 &&
                                      !ele?.requireCity?.includes(proposalHealthInfo?.HealthProposal?.healthInfo?.city)
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
                        px: "14px",
                        borderRadius: "10px 10px 0 0",
                      }}
                    >
                      Preference Details
                    </Typography>
                    {moduleAccess(user, "healthQuote.update") && (
                      <>
                        {!isPolicyGenerated && (
                          <EditIcon
                            onClick={() => setEditPreferancelDeatils(true)}
                            sx={{ fontSize: 30, cursor: "pointer" }}
                          />
                        )}
                      </>
                    )}
                  </Box>
                  <Grid container columnSpacing={8}>
                    <Grid item xs={12} sm={12}>
                      <List sx={{ py: 0 }}>
                        <Grid container>
                          <Grid item xs={12} md={5} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Dental Coverage"}
                              value={
                                proposalHealthInfo?.HealthProposal?.healthInfo?.preferenceDetails?.dentalCoverage ===
                                true
                                  ? "Yes"
                                  : "No" || "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={7} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Optical Coverage"}
                              value={
                                proposalHealthInfo?.HealthProposal?.healthInfo?.preferenceDetails?.opticalCoverage ===
                                true
                                  ? "Yes"
                                  : "No" || "-"
                              }
                            />
                          </Grid>
                        </Grid>

                        <Divider />

                        <Grid container>
                          <Grid item xs={12} md={5} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Preferred Co Pay"}
                              value={
                                proposalHealthInfo?.HealthProposal?.healthInfo?.preferenceDetails?.preferredCoPay || "-"
                              }
                            />
                            <DividerCustom />
                          </Grid>
                          <Grid item xs={12} md={7} columnSpacing={4}>
                            <ListItemComp
                              isCopy={true}
                              label={"Preferred Hospital"}
                              value={
                                proposalHealthInfo?.HealthProposal?.healthInfo?.preferenceDetails?.preferredHospital ||
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#60176F",
                    px: "14px",
                    borderRadius: "10px 10px 0 0",
                    // py: 1.5,
                    width: "100%",
                    backgroundColor: "#f5f5f5",
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
                  {moduleAccess(user, "healthQuote.update") && (
                    <>
                      {!isPolicyGenerated && (
                        <EditIcon
                          onClick={() => setEditMoreInfoDeatils(true)}
                          sx={{ fontSize: 30, cursor: "pointer" }}
                        />
                      )}
                    </>
                  )}
                </Box>
                <Grid container columnSpacing={8}>
                  <Grid item xs={12} sm={10}>
                    <List sx={{ py: 0 }}>
                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Existing Medical Condition"}
                            value={
                              proposalHealthInfo?.HealthProposal?.healthInfo?.regularMedication === true
                                ? "Yes"
                                : "No" || "-"
                            }
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Diabetes"}
                            value={
                              proposalHealthInfo?.HealthProposal?.healthInfo?.diabetes === true ? "Yes" : "No" || "-"
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
                            value={proposalHealthInfo?.HealthProposal?.healthInfo?.smoke === true ? "Yes" : "No" || "-"}
                          />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            isCopy={true}
                            label={"Hypertension"}
                            value={
                              proposalHealthInfo?.HealthProposal?.healthInfo?.hypertension === true
                                ? "Yes"
                                : "No" || "-"
                            }
                          />
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
                  borderBottom: "1px solid #E6E6E6",
                  mt: 3,
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      py: 1.5,
                      mb: 0,
                      fontWeight: "600",
                      fontSize: "18px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                    }}
                  >
                    Comments
                  </Typography>

                  <Box sx={{ display: "inline-block", mr: 2 }}>
                    {moduleAccess(user, "healthQuote.update") && (
                      <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                        Add a Comment
                      </Button>
                    )}
                  </Box>
                </Box>

                {healthProposalCommentListLoader ? (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                    {healthProposalCommentList && <HealthProposalCommentsTable items={healthProposalCommentList} />}
                  </Box>
                )}
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
                  Proposal History
                </Typography>
                <Box>
                  <ProposalHistoryTable items={proposalHealthInfo?.proposalHistory} />
                </Box>
              </Box>

              {quotePayableDetails?.quoteInfo?.isPremiumRequestUpon &&
              quotePayableDetails?.quoteInfo?.editPrice?.length <= 0 ? (
                <></>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <HealthPlanPaybleDetails
                    quotePayableDetails={quotePayableDetails}
                    selectedCheckboxes={selectedCheckboxes}
                    policyFeeLoader={policyFeeLoader}
                  />
                </Box>
              )}
              {moduleAccess(user, "healthQuote.update") && (
                <Box
                  id={"regenerate"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {/* {!isProposalPurchased && ( */}
                  <Button
                    type="button"
                    disabled={!!isProposalPurchased || isDisabled}
                    variant="contained"
                    sx={{ minWidth: "140px" }}
                    onClick={() => ReGenerateHandler(healthProposalQuotationlist)}
                  >
                    Re-generate
                  </Button>
                  {/* )} */}
                  {isProposalPurchased && (
                    <Button
                      type="button"
                      disabled={!!isPolicyGenerated}
                      variant="contained"
                      onClick={() => onClickOnConfirm({ paidBy: "user" })}
                      sx={{ minWidth: "140px" }}
                    >
                      Complete
                    </Button>
                  )}
                  {!isProposalPurchased && (
                    <>
                      <Button
                        type="button"
                        disabled={!!isPolicyGenerated}
                        variant="contained"
                        onClick={() => payByLinkHandler({ paidBy: "CRM - Direct to insurance company" })}
                        sx={{ minWidth: "140px" }}
                      >
                        Paid to the company
                      </Button>
                      <Button
                        type="button"
                        disabled={!!isPolicyGenerated}
                        variant="contained"
                        onClick={() => payByLinkHandler({ paidBy: "link" })}
                        sx={{ minWidth: "140px" }}
                      >
                        Pay by link
                      </Button>
                      <Button
                        type="button"
                        disabled={!!isPolicyGenerated}
                        variant="contained"
                        onClick={() => payByLinkHandler({ paidBy: "CRM - Bank transfer" })}
                        sx={{ minWidth: "140px" }}
                      >
                        Pay by bank transfer
                      </Button>
                    </>
                  )}
                </Box>
              )}
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
          {/* <HealthHistoryTable /> */}
        </Box>
      </Container>
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
        open={viewCreditDebitModal}
        handleClose={() => {
          setViewCreditDebitModal(false);
        }}
        widths={{ xs: "95%", sm: "95%", md: 900 }}
      >
        <Box>
          <CreditDebitUpload
            handleClose={() => setViewCreditDebitModal(false)}
            proposalId={proposalId}
            quoteId={selectedCheckboxes?.[0]}
            insurerName={proposalHealthInfo?.HealthProposal?.healthInfo?.insurerName}
          />
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
          credential={proposalHealthInfo}
          email={proposalHealthInfo?.HealthProposal?.healthInfo?.email}
          mobileNumber={proposalHealthInfo?.HealthProposal?.healthInfo?.mobileNumber}
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

      {/* Personal Deatils Edit Modal */}
      <ModalComp
        open={editPersonalDeatils}
        handleClose={HandlePersonalModalClose}
        widths={{ xs: "95%", sm: "95%", md: 900 }}
      >
        <PersonInfoEditModal
          HandlePersonalModalClose={HandlePersonalModalClose}
          setLoading={setLoading}
          isLoading={isLoading}
          setConfirmPopup={setConfirmPopup}
          healthInfo={proposalHealthInfo?.HealthProposal?.healthInfo}
          fetchSummary={getHealthInfoByPrposalIdHandler}
        />
      </ModalComp>

      {/* Insurer Deatils Edit Modal */}
      <ModalComp
        open={editInsurancelDeatils}
        handleClose={HandleInsuranceModalClose}
        widths={{ xs: "95%", sm: "95%", md: 900 }}
      >
        <InsuranceInfoEditModal
          HandleInsuranceModalClose={HandleInsuranceModalClose}
          setLoading={setLoading}
          isLoading={isLoading}
          setConfirmPopup={setConfirmPopup}
          healthInfo={proposalHealthInfo?.HealthProposal?.healthInfo}
          fetchSummary={getHealthInfoByPrposalIdHandler}
        />
      </ModalComp>

      {/* Preference Details Edit Modal */}
      <ModalComp
        open={editPreferencelDeatils}
        handleClose={HandlePreferanceModalClose}
        widths={{ xs: "95%", sm: "95%", md: 900 }}
      >
        <PreferanceInfoEditModal
          setLoading={setLoading}
          setConfirmPopup={setConfirmPopup}
          HandlePreferanceModalClose={HandlePreferanceModalClose}
          isLoading={isLoading}
          healthInfo={proposalHealthInfo?.HealthProposal?.healthInfo}
          fetchSummary={getHealthInfoByPrposalIdHandler}
        />
      </ModalComp>

      {/* More Info Details Edit Modal */}
      <ModalComp
        open={editMoreInfoDeatils}
        handleClose={HandleMoreInfoModalClose}
        widths={{ xs: "95%", sm: "95%", md: 900 }}
      >
        <MoreInfoEditModal
          setLoading={setLoading}
          setConfirmPopup={setConfirmPopup}
          HandleMoreInfoModalClose={HandleMoreInfoModalClose}
          isLoading={isLoading}
          healthInfo={proposalHealthInfo?.HealthProposal?.healthInfo}
          fetchSummary={getHealthInfoByPrposalIdHandler}
        />
      </ModalComp>

      {/* Kids Details Edit Modal */}
      <ModalComp
        open={editKidsInfoDeatils}
        handleClose={HandleKidsInfoModalClose}
        widths={{ xs: "95%", sm: "95%", md: 900 }}
      >
        <KidsInfoEditModal
          setLoading={setLoading}
          HandleKidsInfoModalClose={HandleKidsInfoModalClose}
          isLoading={isLoading}
          setConfirmPopup={setConfirmPopup}
          healthInfo={proposalHealthInfo?.HealthProposal?.healthInfo}
          fetchSummary={getHealthInfoByPrposalIdHandler}
        />
      </ModalComp>
      {/* Kids Details Edit Modal */}
      <ModalComp
        open={editSpouseInfoDeatils}
        handleClose={HandleSpouseInfoModalClose}
        widths={{ xs: "95%", sm: "95%", md: 900 }}
      >
        <SpouseInfoEditModal
          setLoading={setLoading}
          isLoading={isLoading}
          setConfirmPopup={setConfirmPopup}
          HandleSpouseInfoModalClose={HandleSpouseInfoModalClose}
          healthInfo={proposalHealthInfo?.HealthProposal?.healthInfo}
          fetchSummary={getHealthInfoByPrposalIdHandler}
        />
      </ModalComp>
      <ModalComp open={open} handleClose={handleClose} widths={{ xs: "95%", sm: 500 }}>
        <AddCommentModal handleClose={handleClose} id={proposalId} flag={"health-proposal"} />
      </ModalComp>
      <ModalComp
        open={commentModal}
        handleClose={() => setCommentModal(false)}
        widths={{ xs: "95%", sm: "95%", md: "880px" }}
      >
        <Box>
          <Typography
            sx={{
              color: "#60176F",
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "center",
              mt: -3,
            }}
          >
            Click out side or on close button to close pop up*
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
            <CrossSvg
              sx={{
                cursor: "pointer",
                fontSize: "20px",
                "&:hover": {
                  color: "#60176F",
                },
              }}
              onClick={() => setCommentModal(false)}
            />
          </Box>
          <Box
            sx={{
              display: "inline-block",
              width: "100%",
              mt: 1,
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  py: 1.5,
                  mb: 0,
                  fontWeight: "600",
                  fontSize: "18px",
                  display: "inline-block",
                  color: "#60176F",
                  px: "14px",
                }}
              >
                Comments
              </Typography>

              <Box sx={{ display: "inline-block", mr: 2 }}>
                {moduleAccess(user, "healthQuote.update") && (
                  <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                    Add a Comment
                  </Button>
                )}
              </Box>
            </Box>

            {healthProposalCommentListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                {healthProposalCommentList && <HealthProposalCommentsTable items={healthProposalCommentList} />}
              </Box>
            )}
          </Box>
        </Box>
      </ModalComp>
      <ModalComp open={confirmPopup} handleClose={handleConfirmModalClose} widths={{ xs: "95%", sm: 500 }}>
        <VerifyModal
          label={"Please Re-generate proposal because quotes might get change with updated information"}
          handleClose={handleConfirmModalClose}
          onSubmit={() => onSubmitChange()}
        />
      </ModalComp>
    </Box>
  );
};

HealthInsuranceDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default HealthInsuranceDetails;
