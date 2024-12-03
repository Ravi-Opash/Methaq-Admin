import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { format, parseISO, isValid, compareAsc, startOfDay } from "date-fns";
import { useRouter } from "next/router";
import NextImage from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  Stack,
  SvgIcon,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
  FormControlLabel,
  Alert,
  LinearProgress,
} from "@mui/material";
import { AddIcon } from "src/Icons/AddIcon";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ListItemComp from "src/components/ListItemComp";
import ModalComp from "src/components/modalComp";
import TamaraLogo from "../../../../public/assets/logos/tamara.png";
import NetworkLogo from "../../../../public/assets/logos/NetworkLogo.svg";
import { SlideshowLightbox } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";
import {
  EditInProposalCustomerDetailsById,
  applyDiscountToProposals,
  checkoutPayment,
  deletecarImages,
  downloadQuotePDF,
  editQuotationProcessingFees,
  getBankListCompanyWise,
  getCarColorListByCompanyId,
  getCarProposalCommentsList,
  getComparisonQuotations,
  getDrivingLicenceByImage,
  getEmiratesByImage,
  getMotorLiveErrorsList,
  getNextPreviousProposal,
  getProposalsDetailsById,
  getQuotationListByProposalId,
  getQuotesPaybles,
  getRegistraionAByImage,
  getThirdPartyApiPayloads,
  payByLink,
  payByTamara,
  purchaseConfirm,
  reGenerateProposalByProposalId,
  removeDrivingLicences,
  removeEmiratesId,
  removeRegistartionCards,
} from "src/sections/Proposals/Action/proposalsAction";
import ProposalQuotationTable from "src/sections/Proposals/proposal-quotation-table";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import {
  addQuoateToProposalQuotationList,
  resetProposalQuotationList,
  setPath,
  setProposalDetail,
  setProposalDetailsFromTable,
  setProposalQuotationListPagination,
  setQuoteCount,
} from "src/sections/Proposals/Reducer/proposalsSlice";
import NextLink from "next/link";
import EditDetailsModal from "src/sections/Proposals/edit-details-modal";
import EditCarDetailsModal from "src/sections/Proposals/edit-car-details-modal";
import GenerateComparisonModal from "src/sections/Proposals/generate-comparison-modal";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import ProposalHistoryTable from "src/sections/Proposals/proposal-history-table";
import ProposalStatusSession from "src/sections/Proposals/proposal-status-session";
import { Scrollbar } from "src/components/scrollbar";
import EditCarDetailsForm from "src/sections/Proposals/edit-car-detail-form";
import EditCustomerDetailsForm from "src/sections/Proposals/edit-customer-details-form";
import PromoCodeSession from "src/sections/Proposals/apply-promo-code";
import { socket } from "src/utils/socket";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { clearLeadsDetails } from "src/sections/Leads/Reducer/leadsSlice";
import { AlertIcon } from "src/Icons/AlertIcon";
import { PreviousArrow } from "src/Icons/PreviousArrow";
import { NextArrow } from "src/Icons/NextArrow";
import CustomerCommentsTable from "src/sections/customer/CustomerComments/customer-comments-table";
import AddCommentModal from "src/sections/customer/CustomerComments/add-comment-modal";
import VerifyModal from "src/components/verifyModal";
import SharePaymentLinkModal from "src/sections/Proposals/share-payment-link-modal";
import ProposalAssignTask from "src/sections/Proposals/proposal-assign-task";
import Image from "next/image";
import { CrossSvg } from "src/Icons/CrossSvg";
import { EditIcon } from "src/Icons/EditIcon";
import TransactionInfoModal from "src/sections/Proposals/transaction-Info-modal";
import LivePolicyErrorsTable from "src/sections/Proposals/live-policy-errors-table";
import CarImagesUpload from "src/sections/Proposals/car-images-upload";
import ViewPayloadModal from "src/sections/Proposals/view-payload-modal";
import NcdDocumentUpload from "src/sections/Proposals/car-ncd-document-mode";
import AnimationLoader from "src/components/amimated-loader";
import { SeverityPill } from "src/components/severity-pill";
import PdfViewer from "src/components/pdf-as-image";
import ViewPolicyErrorModal from "src/sections/Proposals/view-policy-error-modal";
import MigrateQuotes from "src/sections/Proposals/migrate-quotes-modal";
import CarColorSelect from "src/sections/Proposals/car-color-select";
import MotorKYCForm from "src/sections/Proposals/motor-kyc-form";
import ExtraDetailForm from "src/sections/Proposals/extra-detail-form";
import ShareQuoteModal from "src/sections/Proposals/share-quote-PDF-modal";
import ProposalTransferTable from "src/sections/Proposals/proposal-transfer-table";

const Img = styled(NextImage)(({ theme }) => ({
  margin: "auto",
  width: "auto !important",
  objectFit: "cover",
  maxWidth: "100% !important",
  [theme.breakpoints.up("md")]: {
    height: "150px",
  },
  [theme.breakpoints.down("md")]: {
    height: "200px",
  },
}));

const CarImg = styled("img")(({ theme }) => ({
  width: "auto !important",
  maxWidth: "180px !important",
  objectFit: "cover",
  height: "140px !important",
}));
const SlideshowLightBox = styled(SlideshowLightbox)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: 2,
}));

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const BoxCustom = styled(Box)(({ theme }) => ({
  padding: "0 24px",

  [theme.breakpoints.up("sm")]: {
    padding: 0,
    paddingRight: "24px",
  },
}));

const options = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Comprehensive",
    value: "comprehensive",
  },
  {
    label: "Third Party",
    value: "thirdparty",
  },
];

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const ProposalDetails = () => {
  const dispatch = useDispatch();
  const {
    proposalDetail,
    proposalQuotationCustomePagination,
    proposalQuotationList,
    proposalDetailLoader,
    proposalQuotationListLoader,
    proposalQuotationFullList,
    path,
    quoteCounter,
    socketRoomId,
    createProposalDetail,
    carProposalCommentListLoader,
    carProposalCommentList,
    quotePayableDetails,
    proposalDetailsFromTable,
    proposalNextPreviousId,
    policyFeeLoader,
    livePolicyErrorsList,
    policyErrorResponse,
    livePolicyErrorsLoader,
    thirdPartyDetails,
    carColorList,
    bankListCompanyWise,
    thirdPartyLoading,
  } = useSelector((state) => state.proposals);
  const { leadDetails } = useSelector((state) => state.leads);
  const router = useRouter();
  const { proposalId } = router.query;

  const { loginUserData: user } = useSelector((state) => state.auth);

  const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
    ({ theme }) => ({
      width: 42,
      height: 26,
      padding: 0,
      margin: "0 !important",
      marginLeft: 0,
      "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + .MuiSwitch-track": {
            backgroundColor: "#60176F",
            opacity: 1,
            border: 0,
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.5,
          },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
          color: "#33cf4d",
          border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
          color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
        },
      },
      "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
      },
      "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
          duration: 500,
        }),
      },
    })
  );

  const [commentModal, setCommentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requireArray, setrequireArray] = useState([]);

  const [isAdminConflict, setIsAdminConflict] = useState(false);
  const [workingAdmin, setWorkingAdmin] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [isProposalPurchased, setIsProposalPurchased] = useState(false);
  const [isPolicyGenerated, setIsPolicyGenerated] = useState(false);
  const [policyIssued, setPolicyIssued] = useState(false);
  const [policyId, setPolicyId] = useState("");
  const [paidByMethod, setPaidByMethod] = useState("");
  const [paymentLinkOnfo, setPaymentLinkInfo] = useState("");
  const [paymentLinkShareModal, setPaymentLinkShareModal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [transactionRefModalOpen, setTransactionRefModalOpen] = useState(false);
  const HandleTransactionRefModalClose = () => setTransactionRefModalOpen(false);
  const [viewPayloadModal, setViewPayloadModal] = useState(false);
  const [viewPolicyErrorModal, setViewPolicyErrorModal] = useState(false);
  const [carImageLeble, setCarImageLeble] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [isCarEdit, setIsCarEdit] = useState(false);
  const [isCustomerEdit, setIsCustomerEdit] = useState(false);

  const [editableFees, setEditableFees] = useState(false);
  const [editedPolicyFeeValue, serEditedPolicyFeeValue] = useState("");

  const [editableSellingPrice, setEditableSellingPrice] = useState(false);
  const [sellingPriceValue, setSellingPriceValue] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleEditModalClose = () => setOpenEditModal(false);

  const [openCarEditModal, setOpenCarEditModal] = useState(false);
  const handleCarEditModalClose = () => setOpenCarEditModal(false);

  const [openComparisonModal, setOpenComparisonModal] = useState(false);
  const handleComparisonModalClose = () => setOpenComparisonModal(false);

  const [dirctToCompanyModal, setDirctToCompanyModal] = useState(false);
  const handleDirctToCompanyModalClose = () => setDirctToCompanyModal(false);

  const [doubleCheckModal, setDoubleCheckModal] = useState(false);
  const handleDoubleCheckModalClose = () => setDoubleCheckModal(false);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const [openCarImageUpload, setOpenCarImageUpload] = useState(false);
  const [openNCDddocumentUpload, setOpenNCDddocumentUpload] = useState(false);
  const [checkBoxCompanyName, setCheckBoxCompanyName] = useState("");

  const [enableLivePolicy, setEnableLivePolicy] = useState(true);
  const [disableButton, setDisableButton] = useState(false);

  const [pdfLink, setPDFLink] = useState(null);
  const [quotePdfLink, setQuotePDFLink] = useState(null);
  const [sharePDFModal, setSharePDFModal] = useState(false);
  const handleClosePDFShareModal = () => setSharePDFModal(false);

  // Function to handle checkbox change and limit selection
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

  const initialized = useRef(false);

  // Function to handle checkbox change
  useEffect(() => {
    if (selectedCheckboxes && selectedCheckboxes?.length == 1) {
      dispatch(getQuotesPaybles({ quoteId: selectedCheckboxes?.[0] }));
      const quote = [...proposalQuotationList]?.find((i) => i?._id === selectedCheckboxes?.[0]);
      if (quote) {
        setCheckBoxCompanyName(quote?.company?.companyName || quote?.companyId?.companyName);
      }
      dispatch(getCarColorListByCompanyId({ companyId: quote?.company?._id || quote?.companyId?._id }))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      setCheckBoxCompanyName("");
    }
  }, [selectedCheckboxes?.length]);

  const [emiratesSelectedImage, setEmiratesSelectedImage] = useState(null);
  const [drivingSelectedImage, setDrivingSelectedImage] = useState(null);
  const [registrationCardSelectedImage, setRegistrationCardSelectedImage] = useState(null);

  // Function to handle Emirates image change
  const handleEmiratesImageChange = async (event) => {
    const file1 = event.target.files[0];
    const file2 = event.target.files[1];

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    } else if (proposalDetail?.customer?.isEmiratesIdMerge) {
      toast.error("Remove old files to upload new files!");
      return;
    } else if (event.target.files?.length > 1 && proposalDetail?.customer?.emiratesIdP) {
      toast.error("You can upload maximum two files only!");
      return;
    }

    setLoading(false);
    event.target.value = null;

    if (!file1) {
      setLoading(true);
      return;
    }

    const formData = new FormData();
    formData.append("emiratesId", file1);
    if (file2) {
      formData.append("emiratesId", file2);
    }

    try {
      const response = await dispatch(getEmiratesByImage({ formData, userId: proposalDetail?.customer?._id }));

      if (response?.type.endsWith("/rejected")) {
        toast.error(response?.payload);
        setLoading(true);
      } else {
        if (file1 && file2) {
          setEmiratesSelectedImage([file1, file2]);
        } else {
          setEmiratesSelectedImage([file1]);
        }
        setLoading(true);
        fetchProposalSummary();
        if (isEmpty(response?.payload?.data?.data)) {
          toast.error("Can not read, File uploaded, Fill up information manually");
        } else {
          toast.success("Emirates ID Image Uploaded");
        }
      }
    } catch (error) {
      console.log(error, "error");
      setLoading(true);
      toast.error(error);
    }
  };

  // Function to handle Driving image change
  const handleDrivingImageChange = async (event) => {
    const file1 = event.target.files[0];
    const file2 = event.target.files[1];

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    } else if (proposalDetail?.customer?.isDrivingLicenseMerge) {
      toast.error("Remove old files to upload new files!");
      return;
    } else if (event.target.files?.length > 1 && proposalDetail?.customer?.drivingLicenseP) {
      toast.error("You can upload maximum two files only!");
      return;
    }

    event.target.value = null;
    setLoading(false);

    if (!file1) {
      setLoading(true);
      return;
    }

    const formData = new FormData();
    formData.append("drivingLicense", file1);
    if (file2) {
      formData.append("drivingLicense", file2);
    }
    try {
      const response = await dispatch(
        getDrivingLicenceByImage({
          formData,
          userId: proposalDetail?.customer?._id,
        })
      );
      if (response?.type.endsWith("/rejected")) {
        toast.error(response?.payload);
        setLoading(true);
      } else {
        if (file1 && file2) {
          setDrivingSelectedImage([file1, file2]);
        } else {
          setDrivingSelectedImage([file1]);
        }
        setLoading(true);
        fetchProposalSummary();
        if (isEmpty(response?.payload?.data?.data)) {
          toast.error("Can not read, File uploaded, Fill up information manually");
        } else {
          toast.success("Driving Licence Uploaded");
        }
      }
    } catch (error) {
      console.log(error, "error");
      setLoading(true);
      toast.error(error);
    }
  };

  // Function to handle Registration Card image change
  const copyToClipboard = (proposalId) => {
    navigator.clipboard
      .writeText(proposalId)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Function to handle Registration Card image change
  const handleRegistrationCardImageChange = async (event) => {
    const file1 = event.target.files[0];
    const file2 = event.target.files[1];

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    } else if (proposalDetail?.car?.isRCmerge) {
      toast.error("Remove old files to upload new files!");
      return;
    } else if (event.target.files?.length > 1 && proposalDetail?.car?.registrationCardP) {
      toast.error("You can upload maximum two files only!");
      return;
    }

    event.target.value = null;
    setLoading(false);
    if (!file1) {
      setLoading(true);
      return;
    }

    const formData = new FormData();
    formData.append("registrationCard", file1);
    if (file2) {
      formData.append("registrationCard", file2);
    }

    try {
      const response = await dispatch(
        getRegistraionAByImage({
          formData,
          carId: proposalDetail?.car?._id,
          userId: proposalDetail?.customer?._id,
        })
      );
      if (response?.type.endsWith("/rejected")) {
        toast.error(response?.payload);
        setLoading(true);
      } else {
        if (file1 && file2) {
          setRegistrationCardSelectedImage([file1, file2]);
        } else {
          setRegistrationCardSelectedImage([file1]);
        }
        setLoading(true);
        fetchProposalSummary();
        if (isEmpty(response?.payload?.data?.data)) {
          toast.error("Can not read, File uploaded, Fill up information manually");
        } else {
          toast.success("Registration card uploaded.");
        }
      }
    } catch (error) {
      console.log(error, "error");
      setLoading(true);
      toast.error(error.message || "An error occurred.");
    }
  };

  // Function to fetch proposal summary
  const fetchProposalSummary = () => {
    if (proposalId) {
      dispatch(
        getProposalsDetailsById({
          id: proposalId,
          userId: proposalDetail?.customer?._id,
          carId: proposalDetail?.car?._id,
        })
      )
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
  };

  // Function to download a PDF file from a URL
  const onPdfDownload = (url) => {
    const filename = url.split("/");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename[filename.length - 1]);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Function to download a PDF file from a URL
  useEffect(() => {
    if (!!proposalQuotationList) {
      let pPurchased = false;
      let pGenerated = false;
      let pIssued = false;
      proposalQuotationList.map((quote) => {
        if (quote.isPaid > 0) {
          setIsProposalPurchased(true);
          pPurchased = true;
        }
        if (quote.isBought) {
          setIsPolicyGenerated(true);
          pGenerated = true;
          setPolicyId(quote?.policy?._id);
        }
        if (quote.policyIssued) {
          setPolicyIssued(true);
          pIssued = true;
          setPolicyId(quote?.policy?._id);
        }
      });

      if (!pPurchased) {
        setIsProposalPurchased(false);
      }
      if (!pGenerated) {
        setIsPolicyGenerated(false);
      }
      if (!pIssued) {
        setPolicyIssued(false);
      }
    }
  }, [proposalQuotationList, proposalId]);

  // Function to handle socket connection
  useEffect(() => {
    if (socket && proposalId && user) {
      if (socket.disconnected) socket.connect();
      socket.off("usersInRoom");
      socket.emit("join", { room: proposalId, userId: user?._id });

      socket.on("usersInRoom", (info) => {
        if (!info?.firstUser) {
          setIsAdminConflict(false);
          return;
        }
        if (info?.firstUser?.email !== user?.email) {
          setIsAdminConflict(true);
        } else {
          setIsAdminConflict(false);
        }
        setWorkingAdmin(info?.firstUser);
      });
    }
    return () => {
      socket.off("usersInRoom");
      socket.disconnect();
    };
  }, [proposalId, user]);

  // Function to handle socket connection
  useEffect(() => {
    if (socket && socketRoomId) {
      if (socket.disconnected) socket.connect();
      socket.off("admin-proposal-created");
      socket.emit("join", { room: socketRoomId });

      socket.on("admin-proposal-created", (quote) => {
        if (quote?.Errors?.length > 0) {
        } else {
          dispatch(addQuoateToProposalQuotationList(quote));
          dispatch(setQuoteCount(-1));
        }
      });
    }
    return () => {
      socket.off("admin-proposal-created");
      socket.off("quote-counter");
      dispatch(setPath(null));
    };
  }, [proposalId, socketRoomId]);

  // Function to get proposal details
  const getProposalDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(
        getProposalsDetailsById({
          id: proposalId,
          userId:
            leadDetails?.customer?._id || createProposalDetail?.userId || proposalDetailsFromTable?.user?._id || null,
          carId: leadDetails?.car?._id || createProposalDetail?.carId || proposalDetailsFromTable?.car?._id || null,
        })
      )
        .unwrap()
        .then((res) => {
          dispatch(setProposalDetailsFromTable(null));
          dispatch(clearLeadsDetails());
          dispatch(
            getMotorLiveErrorsList({
              id: proposalId,
            })
          );
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to get proposal details
  useEffect(
    () => {
      if (proposalId) {
        getProposalDetailsHandler();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [proposalId]
  );

  // quotation list start
  const initializedQuotationList = useRef(false);

  // Function to get quotation list
  const getQuotationListByProposalIdHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initializedQuotationList.current) {
      return;
    }
    initializedQuotationList.current = true;

    try {
      dispatch(
        getQuotationListByProposalId({
          page: proposalQuotationCustomePagination?.page,
          size: proposalQuotationCustomePagination?.size,
          id: proposalId,
        })
      )
        .unwrap()
        .then((res) => {
          dispatch(getNextPreviousProposal({ proposalId }));
          dispatch(
            getCarProposalCommentsList({
              id: proposalId,
            })
          );
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to verify fields
  const verifyFields = () => {
    let isFilled = false;
    if (proposalDetail) {
      const missingFields = [];

      // Car require field
      if (!proposalDetail?.car?.make) missingFields.push("Car Make");
      if (!proposalDetail?.car?.cylinders) missingFields.push("Car Cylinders");
      if (!proposalDetail?.car?.model) missingFields.push("Car Model");
      if (!proposalDetail?.car?.price) missingFields.push("Car Price");
      if (!proposalDetail?.car?.trim) missingFields.push("Car Trim");
      if (!proposalDetail?.car?.year) missingFields.push("Car Year");
      if (!proposalDetail?.car?.bodyType) missingFields.push("Car Body Type");
      if (!proposalDetail?.car?.regionalSpec) missingFields.push("Car Regional Spec");
      if (!proposalDetail?.car?.policyEffectiveDate) missingFields.push("Policy Effective Date");
      if (!proposalDetail?.car?.insuranceExpiryDate) missingFields.push("Insurance Expiry Date");
      if (!proposalDetail?.car?.currentInsurer) missingFields.push("Current Insurer");
      if (!proposalDetail?.car?.insureType) missingFields.push("Insure Type");
      if (!proposalDetail?.car?.typeOfIssues) missingFields.push("Type of Issues");
      if (!proposalDetail?.car?.registrationEmirate) missingFields.push("Registration Emirate");
      if (!proposalDetail?.car?.origin) missingFields.push("Car Origin");
      if (!proposalDetail?.car?.chesisNo) missingFields.push("Chassis Number");
      if (!proposalDetail?.car?.plateNumber) missingFields.push("Plate Number");
      if (!proposalDetail?.car?.plateCode) missingFields.push("Plate Code");
      if (!proposalDetail?.car?.registrationYear) missingFields.push("Registration Year");
      if (!proposalDetail?.car?.tcNo) missingFields.push("TC Number");
      if (!proposalDetail?.car?.engineNumber) missingFields.push("Engine Number");
      if (!proposalDetail?.car?.yearOfNoClaim) missingFields.push("Year of No Claim");
      if (!proposalDetail?.car?.claimHistory) missingFields.push("Claim History");
      if (!proposalDetail?.car?.regCardExpiryDate) missingFields.push("Registration Card Expiry Date");
      if (!proposalDetail?.car?.color) missingFields.push("Car Color");
      if (!proposalDetail?.car?.noOfPassengers) missingFields.push("Number of Passengers");
      if (!proposalDetail?.car?.registrationDate) missingFields.push("Registration Issue date");
      // if (!proposalDetail?.car?.policyNumber) missingFields.push("Current Insurance Policy Number");

      // Customer require field
      if (!proposalDetail?.customer?.fullName) missingFields.push("Customer Full Name");
      if (!proposalDetail?.customer?.arabicName) missingFields.push("Customer Arabic Name");
      if (!proposalDetail?.customer?.gender) missingFields.push("Customer Gender");
      if (!proposalDetail?.customer?.nationality) missingFields.push("Customer Nationality");
      if (!proposalDetail?.customer?.email) missingFields.push("Customer Email");
      if (!proposalDetail?.customer?.dateOfBirth) missingFields.push("Customer Date of Birth");
      if (!proposalDetail?.customer?.maritalStatus) missingFields.push("Customer Marital Status");
      if (!proposalDetail?.customer?.occupation) missingFields.push("Customer Occupation");
      if (!proposalDetail?.customer?.employer) missingFields.push("Customer Employer");
      if (!proposalDetail?.customer?.address) missingFields.push("Driver Address");
      if (!proposalDetail?.customer?.mobileNumber) missingFields.push("Customer Mobile Number");
      if (!proposalDetail?.customer?.emiratesId) missingFields.push("Customer Emirates ID");
      if (!proposalDetail?.customer?.dlTcNo) missingFields.push("Customer DL TC Number");
      if (!proposalDetail?.customer?.emiratesIdExpiryDate) missingFields.push("Emirates ID Expiry Date");
      if (!proposalDetail?.customer?.licenceNo) missingFields.push("Customer Licence Number");
      if (!proposalDetail?.customer?.licenceIssueDate) missingFields.push("Licence Issue Date");
      if (!proposalDetail?.customer?.licenceExpiryDate) missingFields.push("Licence Expiry Date");
      if (!proposalDetail?.customer?.placeOfIssueDL) missingFields.push("Place of Issue DL");

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

  // get quotation list
  useEffect(() => {
    if (proposalId && !path) {
      getQuotationListByProposalIdHandler();
    }

    return () => {
      dispatch(
        setProposalQuotationListPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, [proposalId]);

  // Function to re-generate
  const ReGenerateHandler = useCallback(
    (proposalQuotationList) => {
      if (socket && proposalQuotationList?.[0]?.reqId) {
        if (socket.disconnected) socket.connect();
        socket.off("admin-proposal-created");
        socket.emit("join", { room: proposalQuotationList?.[0]?.reqId });

        socket.on("admin-proposal-created", (quote) => {
          if (quote?.Errors?.length > 0) {
          } else {
            dispatch(addQuoateToProposalQuotationList(quote));
            dispatch(setQuoteCount(-1));
          }
        });

        socket.off("quote-counter");

        socket.on("quote-counter", (count) => {
          dispatch(setQuoteCount(count));
        });
      }

      dispatch(resetProposalQuotationList());

      dispatch(
        reGenerateProposalByProposalId({
          carId: proposalDetail?.car?._id,
          userId: proposalDetail?.customer?._id,
          pId: proposalId,
          refId: proposalQuotationList?.[0]?.internalRef || "",
          reqId: proposalQuotationList?.[0]?.reqId || "",
        })
      )
        .unwrap()
        .then((res) => {
          if (res) {
            initialized.current = false;
            initializedQuotationList.current = false;

            dispatch(
              getProposalsDetailsById({
                id: res?.data?.proposalNo,
                userId: proposalDetail?.customer?._id,
                carId: proposalDetail?.car?._id,
              })
            );

            setTimeout(() => {
              dispatch(
                getQuotationListByProposalId({
                  page: proposalQuotationCustomePagination?.page,
                  size: proposalQuotationCustomePagination?.size,
                  id: res?.data?.proposalNo,
                })
              );
              dispatch(
                getMotorLiveErrorsList({
                  id: proposalId,
                })
              );
            }, 2000);

            setSelectedCheckboxes([]);
            toast("Successfully re-generated", {
              type: "success",
            });
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    },
    [proposalDetail]
  );

  // Function to handle payment method selection
  const payByLinkHandler = (paidBy) => {
    if (isProposalPurchased === true) {
      toast("You already bought policy for this proposal!", {
        type: "error",
      });
    } else if (
      !proposalDetail?.car?.registrationCardP ||
      !proposalDetail?.customer?.drivingLicenseP ||
      !proposalDetail?.customer?.emiratesIdP
    ) {
      toast("Please upload all Documents!", {
        type: "error",
      });
    } else if (!verifyFields()) {
      return;
    } else if (!proposalDetail?.car?.regenerate) {
      toast.error("Re-generate proposal before you go further!");
      return;
    } else if (selectedCheckboxes.length === 0) {
      toast("Please select quotation which you want to buy!", {
        type: "error",
      });
      const element = document.getElementById("car-quotation-list");
      element.scrollIntoView({
        behavior: "smooth",
      });
    } else if (selectedCheckboxes.length >= 2) {
      toast("Please select only one qutation!", {
        type: "error",
      });
      const element = document.getElementById("car-quotation-list");
      element.scrollIntoView({
        behavior: "smooth",
      });
    } else if (
      !proposalDetail?.car?.ncdProofDocument &&
      checkBoxCompanyName === "Fidelity United Motor Insurance" &&
      (proposalDetail?.car?.yearOfNoClaim === "No Claims for One Year" ||
        proposalDetail?.car?.yearOfNoClaim === "No Claims for Two Years" ||
        proposalDetail?.car?.yearOfNoClaim === "No Claims for Three Years" ||
        proposalDetail?.car?.yearOfNoClaim === "No Claims for Four Years" ||
        proposalDetail?.car?.yearOfNoClaim === "No Claims for Five Years")
    ) {
      setOpenNCDddocumentUpload(true);
    } else if (checkBoxCompanyName === "RAK INSURANCE" && !proposalDetail?.customer?.sourceOfFunds) {
      toast.error("Please Fill KYC form!");
      const element = document.getElementById("motor-kyc-form");
      element?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    } else if (
      proposalDetail?.car?.insureType === "thirdparty" &&
      quotePayableDetails?.quote?.insuranceType === "comprehensive" &&
      proposalDetail?.car?.expiredCarPhotos?.length < 3
    ) {
      {
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
      }
    } else if (
      compareAsc(
        new Date(startOfDay(new Date(proposalDetail?.car?.insuranceExpiryDate))),
        new Date(startOfDay(new Date(proposalDetail?.car?.policyEffectiveDate)))
      ) === -1 &&
      proposalDetail?.car?.insuranceExpiryDate &&
      proposalDetail?.car?.expiredCarPhotos?.length < 3
    ) {
      toast("Current insurance expired! Upload car images to proceed further!", {
        type: "error",
      });
      setOpenCarImageUpload(true);
      setCarImageLeble(
        "Current insurance is expired before policy start date, Please Upload at least 3 Images of car to proceed further."
      );
      return;
    } else {
      if (paidBy?.paidBy == "link") {
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
        setPaidByMethod(paidBy?.paidBy);
        return;
      }
      setTransactionRefModalOpen(true);
      setPaidByMethod(paidBy?.paidBy);
    }
  };

  // double check modal
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

  // double check modal
  const onViewProposalOnline = () => {
    let temp;
    const domainName = window.location.origin;
    if (domainName === "https://admin.dev.esanad.com") {
      temp = "https://dev.esanad.com";
    } else if (domainName === "https://admin.esanad.com") {
      temp = "https://esanad.com";
    } else if (domainName === "http://localhost:3000") {
      temp = "https://dev.esanad.com";
    }

    const plink = temp + "/insurance/getQuote?ref=" + proposalQuotationList?.[0]?.internalRef;

    const link = document.createElement("a");
    link.href = plink;
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // compare quote
  const onCompareQuoteHandler = () => {
    if (selectedCheckboxes.length >= 2) {
      setIsLoading(true);
      dispatch(getComparisonQuotations({ ids: selectedCheckboxes }))
        .unwrap()
        .then((res) => {
          router.push("/quotations/compare-quotation");
          setIsLoading(false);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          setIsLoading(false);
        });
    } else {
      toast("Please select atleast 2 quotation", {
        type: "error",
      });
      setIsLoading(false);
    }
  };

  // download pdf
  const downloadPdf = async () => {
    setIsQuoteLoading(true);
    if (selectedCheckboxes?.length > 1) {
      toast("Please select only one quotation", {
        type: "error",
      });
      setIsQuoteLoading(false);
      return;
    } else if (selectedCheckboxes?.length < 1) {
      toast("Please select atleast one quotation", {
        type: "error",
      });
      setIsQuoteLoading(false);
      return;
    } else if (selectedCheckboxes?.length === 1) {
      setSharePDFModal(true);
      dispatch(downloadQuotePDF(selectedCheckboxes?.[0]))
        .unwrap()
        .then((res) => {
          // console.log(res, "res1");
          setIsQuoteLoading(false);
          let pdfUrl = process.env.NEXT_PUBLIC_BASE_URL + res.data.link;
          setQuotePDFLink(pdfUrl);
        })
        .catch((err) => {
          setIsQuoteLoading(false);
          console.log(err);
        });
    }
  };

  /// share quote
  const onShareQuoteHandler = () => {
    if (selectedCheckboxes.length === 1) {
      // setIsLoading(true);
      setSharePDFModal(true);
    } else {
      toast("Please select 1 quotation", {
        type: "error",
      });
      setIsLoading(false);
    }
  };

  // search filter
  const searchFilterHandler = (value) => {
    dispatch(
      getQuotationListByProposalId({
        page: "",
        size: "",
        id: proposalId,
        insuranceType: value,
      })
    );
  };

  // confirm
  const onClickOnConfirm = (paidBy) => {
    if (
      !proposalDetail?.car?.registrationCardP ||
      !proposalDetail?.customer?.drivingLicenseP ||
      !proposalDetail?.customer?.emiratesIdP
    ) {
      toast("Please upload all Documents!", {
        type: "error",
      });
    } else if (
      compareAsc(
        new Date(startOfDay(new Date(proposalDetail?.car?.insuranceExpiryDate))),
        new Date(startOfDay(new Date(proposalDetail?.car?.policyEffectiveDate)))
      ) === -1 &&
      proposalDetail?.car?.insuranceExpiryDate &&
      proposalDetail?.car?.expiredCarPhotos?.length < 3
    ) {
      toast("Current insurance expired! Upload car images to proceed further!", {
        type: "error",
      });
      setOpenCarImageUpload(true);
      setCarImageLeble(
        "Current insurance is expired before policy start date, Please Upload at least 3 Images of car to proceed further."
      );
      return;
    } else if (selectedCheckboxes.length === 0) {
      toast("Please select quotation which you want to Confirm!", {
        type: "error",
      });
      const element = document.getElementById("car-quotation-list");
      element.scrollIntoView({
        behavior: "smooth",
      });
    } else if (selectedCheckboxes.length >= 2) {
      toast("Please select only one qutation!", {
        type: "error",
      });
      const element = document.getElementById("car-quotation-list");
      element.scrollIntoView({
        behavior: "smooth",
      });
    } else if (
      proposalDetail?.car?.insureType === "thirdparty" &&
      quotePayableDetails?.quote?.insuranceType === "comprehensive" &&
      proposalDetail?.car?.expiredCarPhotos?.length < 3
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
    } else if (
      !proposalDetail?.car?.ncdProofDocument &&
      checkBoxCompanyName === "Fidelity United Motor Insurance" &&
      (proposalDetail?.car?.yearOfNoClaim === "No Claims for One Year" ||
        proposalDetail?.car?.yearOfNoClaim === "No Claims for Two Years" ||
        proposalDetail?.car?.yearOfNoClaim === "No Claims for Three Years" ||
        proposalDetail?.car?.yearOfNoClaim === "No Claims for Four Years" ||
        proposalDetail?.car?.yearOfNoClaim === "No Claims for Five Years")
    ) {
      setOpenNCDddocumentUpload(true);
    } else if (checkBoxCompanyName === "RAK INSURANCE" && !proposalDetail?.customer?.sourceOfFunds) {
      toast.error("Please Fill KYC form!");
      const element = document.getElementById("motor-kyc-form");
      element?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    } else {
      setIsLoading(true);
      dispatch(purchaseConfirm({ id: selectedCheckboxes?.[0], data: { paidBy: paidBy } }))
        .then((res) => {
          if (res?.error?.message) {
            toast.error(res.payload);
          } else {
            toast.success("Payment confirmed successfully!");
            fetchProposalSummary();
            dispatch(
              getQuotationListByProposalId({
                page: "",
                size: "",
                id: proposalId,
              })
            );
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err, "err");
          toast.error(err);
          setIsLoading(false);
        });
    }
  };

  // remove emirate id
  const removeEmirateId = () => {
    dispatch(removeEmiratesId(proposalDetail?.customer?._id))
      .unwrap()
      .then((res) => {
        toast.success("successfully removed files!");
        fetchProposalSummary();
        setEmiratesSelectedImage(null);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
  };

  // remove registeration card
  const removeRegistartionCard = () => {
    dispatch(removeRegistartionCards(proposalDetail?.car?._id))
      .unwrap()
      .then((res) => {
        toast.success("successfully removed files!");
        fetchProposalSummary();
        setRegistrationCardSelectedImage(null);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
  };

  // remove driving licence
  const removeDrivingLicence = () => {
    dispatch(removeDrivingLicences(proposalDetail?.customer?._id))
      .unwrap()
      .then((res) => {
        toast.success("successfully removed files!");
        fetchProposalSummary();
        setDrivingSelectedImage(null);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
  };

  // Ref number submit
  const handleSubmitRefNo = (data) => {
    setIsLoading(true);
    dispatch(
      payByLink({
        id: selectedCheckboxes?.[0],
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
          dispatch(
            getQuotationListByProposalId({
              page: "",
              size: "",
              id: proposalId,
            })
          );
        }
        setIsLoading(false);
        HandleTransactionRefModalClose(false);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setIsLoading(false);
      });
  };

  // defalut access
  const defalutAccessSwitch = () => {
    if (proposalDetail?.customer?.isParent) {
      return true;
    } else {
      return false;
    }
  };

  // download Document
  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + "/" + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // go to proposal
  const onProposalGoToHabdler = (IdNumber) => {
    if (!IdNumber) {
      return;
    } else {
      initializedQuotationList.current = false;
      initialized.current = false;
      router?.push(`/proposals/${IdNumber}`);
    }
  };

  // Pay by link handler
  const onPaidBylinkgenerate = () => {
    setLoading(false);
    dispatch(checkoutPayment({ quoteId: selectedCheckboxes?.[0], paidBy: "CRM - Link" }))
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

  // Pay by tamara button
  const onPayByTamara = () => {
    setLoading(false);
    dispatch(payByTamara({ quoteId: selectedCheckboxes?.[0], paidBy: "CRM - Tamara" }))
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

  // edit processing fees
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
        quoteId: selectedCheckboxes[0],
        adminFees: policyFees,
      })
    )
      .unwrap()
      .then((data) => {
        setEditableFees(false);
        dispatch(getQuotesPaybles({ quoteId: selectedCheckboxes?.[0] }));
      })
      .catch((err) => {
        console.log(err);
        toast(err, {
          type: "error",
        });
        setEditableFees(false);
      });
  };

  // edit selling price
  const onChnageEditSellingPrice = () => {
    if (sellingPriceValue < 0 || sellingPriceValue > 50000) {
      toast.error("Selling price must be between 0 and 50,000!");
      return;
    }

    dispatch(
      applyDiscountToProposals({
        id: selectedCheckboxes?.[0],
        data: { discountPrice: +sellingPriceValue },
      })
    )
      .unwrap()
      .then((data) => {
        toast.success(data?.message || "Successfully Updated!");
        setEditableSellingPrice(false);
        dispatch(getQuotesPaybles({ quoteId: selectedCheckboxes?.[0] }));
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

  // Delete Cars Images API
  const onDeleteUploadedImage = (value) => {
    setIsLoading(true);
    dispatch(deletecarImages({ id: proposalDetail?.car?._id, data: { filePathToDelete: value } }))
      .unwrap()
      .then((res) => {
        dispatch(setProposalDetail({ ...proposalDetail, car: res?.data }));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        toast?.error(err);
        setIsLoading(false);
      });
  };

  // GET Third Party APIs payload API call
  const SavedThirdPartyPayload = () => {
    dispatch(getThirdPartyApiPayloads({ id: proposalId }))
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
      });
  };

  // Duplicate and Fake can't do action
  useEffect(() => {
    if (
      proposalDetail?.proposalStatus?.proposalStatus === "Lost" &&
      (proposalDetail?.proposalStatus?.reason === "Fake inquiry" ||
        proposalDetail?.proposalStatus?.reason === "Duplicate Proposal")
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [proposalDetail?.proposalStatus]);

  const [openMigateModal, setOpenMigrateModal] = useState();

  // Migrate Payment
  const onMigratePaymentHandler = () => {
    setOpenMigrateModal(true);
  };

  return (
    <>
      {quoteCounter > 0 && (
        <Alert
          sx={{
            position: "fixed",
            left: "50%",
            transform: "translate(-50%, -50%)",
            top: "100px",
            zIndex: "10000",
            "@keyframes move-up": {
              "0%": {
                opacity: 0,
                top: "30px",
              },
              "100%": {
                opacity: 1,
                top: "100px",
              },
            },
            animation: "move-up 1s ease-in-out 0s 0.7 normal none running",
          }}
          icon={false}
          severity="success"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: 320 }}>
            <Typography sx={{ fontWeight: 600 }}>Loading more Quotes, Please wait...</Typography>
          </Box>
          <LinearProgress sx={{ mt: 2 }} color="success" />
        </Alert>
      )}

      {(!loading || thirdPartyLoading) && (
        <>
          <AnimationLoader open={true} />
        </>
      )}

      {selectedCheckboxes && selectedCheckboxes.length == 1 && (
        <>
          <AnimationLoader open={isQuoteLoading} />
        </>
      )}

      {isLoading && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
            <AnimationLoader open={isLoading} />
          </Box>
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
          <Box sx={{ mb: 1, display: "inline-block", width: "100%" }}>
            <Box
              sx={{
                display: "inline-block",
              }}
            >
              <NextLink href="/proposals">
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
              </NextLink>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              my: 1.5,
            }}
          >
            <Tooltip title="Go To Previous Proposal">
              <Box
                sx={{
                  width: 38,
                  height: 35,
                  borderRadius: "10px",
                  backgroundColor: proposalNextPreviousId?.previous ? "#60176F" : "#707070",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: proposalNextPreviousId?.previous ? "pointer" : "not-allowed",
                }}
                onClick={() => onProposalGoToHabdler(proposalNextPreviousId?.previous)}
              >
                <PreviousArrow
                  sx={{
                    color: "#60176F",
                    fontSize: "20px",
                  }}
                />
              </Box>
            </Tooltip>
            <Tooltip title="Go To Next Proposal">
              <Box
                sx={{
                  width: 38,
                  height: 35,
                  borderRadius: "10px",
                  backgroundColor: proposalNextPreviousId?.next ? "#60176F" : "#707070",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: proposalNextPreviousId?.next ? "pointer" : "not-allowed",
                }}
                onClick={() => onProposalGoToHabdler(proposalNextPreviousId?.next)}
              >
                <NextArrow sx={{ color: "#60176F", fontSize: "20px" }} />
              </Box>
            </Tooltip>
          </Box>

          <Stack spacing={1} mb={3}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Typography variant="h4">Proposal details</Typography>
                <SeverityPill
                  color={"success"}
                  cursor={"pointer"}
                  fontSize={16}
                  onClick={() => copyToClipboard(proposalId)}
                >
                  {`#${proposalId}`}
                </SeverityPill>
              </Box>
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
            </Box>
          </Stack>

          {proposalDetailLoader ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "10rem !important",
                }}
              >
                <AnimationLoader open={!!proposalDetailLoader} />
              </Box>
            </>
          ) : (
            <>
              {proposalDetail && (
                <Box sx={{ display: "inline-block", width: "100%" }}>
                  <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
                    {isAdminConflict && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 2.5,
                          backgroundColor: "#ffe4b2",
                          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px $e5f7e5",
                          borderRadius: "10px 10px 10px 10px",
                        }}
                      >
                        <AlertIcon sx={{ fontSize: "30px" }} />
                        <Typography sx={{ ml: 0, fontWeight: 600, color: "#111927" }}>
                          {`Agent ${workingAdmin?.fullName} is currently working on this proposal and you
                          not allowed to make changes.`}
                        </Typography>
                      </Box>
                    )}
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
                          onClick={() => router.push(`/policies/${policyId}`)}
                        >
                          View Policy
                        </Button>
                      </Box>
                    )}
                    {(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor) && (
                      <Box sx={{ display: "inline-block", width: "100%", mt: 1 }}>
                        <ProposalAssignTask
                          proposalId={proposalId}
                          assignedAgent={proposalDetail?.proposalStatus?.adminId || proposalQuotationList?.[0]?.adminId}
                        />
                      </Box>
                    )}
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <ProposalStatusSession
                        proposalId={proposalId}
                        items={proposalDetail?.proposalStatus}
                        fetchProposalSummary={fetchProposalSummary}
                        isPolicyGenerated={isPolicyGenerated}
                        policyIssued={policyIssued}
                        flag={"Motor"}
                      />
                    </Box>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
                      <PromoCodeSession
                        proposalId={proposalId}
                        items={proposalQuotationList?.[0]}
                        fetchProposalSummary={fetchProposalSummary}
                        isPurchased={isProposalPurchased}
                        setSelectedCheckboxes={setSelectedCheckboxes}
                      />
                    </Box>
                    <Box
                      id={"car-quotation-list"}
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

                          <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", ml: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontSize: 14 }}>
                                Live Policy
                              </Typography>
                              <FormControlLabel
                                sx={{ ml: 0 }}
                                control={
                                  <IOSSwitch
                                    name="livepolicy"
                                    onChange={(value, e) => {
                                      setEnableLivePolicy(value.target.checked);
                                    }}
                                    checked={!!enableLivePolicy}
                                  />
                                }
                              />
                            </Box>
                            <Box>
                              <TextField
                                sx={{ width: "200px" }}
                                label="Quotation Type"
                                name="type"
                                onChange={(e) => {
                                  searchFilterHandler(e.target.value);
                                }}
                                select
                                SelectProps={{ native: true }}
                              >
                                {options.map((option) => (
                                  <option key={option?.value} value={option?.value}>
                                    {option?.label}
                                  </option>
                                ))}
                              </TextField>
                            </Box>
                          </Box>

                          <Box sx={{ display: "flex" }}>
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

                            <Box sx={{ display: "inline-block" }}>
                              <Button
                                sx={{
                                  textDecoration: "underline",
                                  textDecorationColor: "#60176F !important",
                                }}
                                onClick={onCompareQuoteHandler}
                              >
                                Generate a comparison PDF
                              </Button>
                            </Box>

                            <Box sx={{ display: "inline-block" }}>
                              <Button
                                sx={{
                                  textDecoration: "underline",
                                  textDecorationColor: "#60176F !important",
                                }}
                                onClick={() => {
                                  // onShareQuoteHandler();
                                  downloadPdf();
                                }}
                              >
                                Share Quote
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Scrollbar>

                      {proposalQuotationListLoader ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            minHeight: 300,
                            alignItems: "center",
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Box sx={{ display: "inline-block", width: "100%" }}>
                          {proposalQuotationList && (
                            <ProposalQuotationTable
                              items={proposalQuotationList}
                              selectItemHandler={handleCheckboxChange}
                              checkSelect={selectedCheckboxes}
                              isPurchased={isProposalPurchased}
                              isPolicyGenerated={isPolicyGenerated}
                              proposalId={proposalId}
                              enableLivePolicy={enableLivePolicy}
                              onMigratePaymentHandler={onMigratePaymentHandler}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", my: 2, justifyContent: "end" }}>
                      {moduleAccess(user, "proposals.update") && (
                        <Button
                          type="button"
                          disabled={!!isPolicyGenerated}
                          variant="contained"
                          onClick={() => {
                            setIsCarEdit(true);
                          }}
                        >
                          Edit car details
                        </Button>
                      )}
                    </Box>
                    <Box
                      id="carDetails"
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
                        Car details
                      </Typography>

                      <Grid container columnSpacing={2} p={2.5}>
                        <Grid item xs={12} sm={isCarEdit ? 12 : 9}>
                          <List sx={{ py: 0 }}>
                            {!isCarEdit ? (
                              <>
                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp isCopy={true} label={"Brand"} value={proposalDetail?.car?.make} />
                                    <DividerCustom />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"No. of clynders"}
                                      value={proposalDetail?.car?.cylinders}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp isCopy={true} label={"Model"} value={proposalDetail?.car?.model} />
                                    <DividerCustom />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Value (e-Data)"}
                                      value={`AED ${formatNumber(proposalDetail?.car?.price)}`}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp isCopy={true} label={"Trim"} value={proposalDetail?.car?.trim} />
                                    <DividerCustom />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp isCopy={true} label={"Year"} value={proposalDetail?.car?.year} />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Body type"}
                                      value={proposalDetail?.car?.bodyType || ""}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Regional space"}
                                      value={proposalDetail?.car?.regionalSpec || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label="Policy Start Date"
                                      value={
                                        isValid(parseISO(proposalDetail?.car?.policyEffectiveDate))
                                          ? format(parseISO(proposalDetail?.car?.policyEffectiveDate), "dd-MM-yyyy")
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label="Insurance Expiry Date"
                                      value={
                                        isValid(parseISO(proposalDetail?.car?.insuranceExpiryDate))
                                          ? format(parseISO(proposalDetail?.car?.insuranceExpiryDate), "dd-MM-yyyy")
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Current insurer"}
                                      value={proposalDetail?.car?.currentInsurer?.replace(/[^\x00-\x7F]/g, "") || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Insure type"}
                                      value={
                                        proposalDetail?.car?.insureType?.toLowerCase() === "comprehensive"
                                          ? "Comprehensive"
                                          : proposalDetail?.car?.insureType?.toLowerCase() === "thirdparty"
                                          ? "Third party"
                                          : ""
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Type of issues"}
                                      value={proposalDetail?.car?.typeOfIssues || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Registration emirate"}
                                      value={proposalDetail?.car?.registrationEmirate || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Origin"}
                                      value={proposalDetail?.car?.origin || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Chassis No."}
                                      value={
                                        proposalDetail?.car?.chesisStatus === "random"
                                          ? "-"
                                          : proposalDetail?.car?.chesisNo
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Plate Number"}
                                      value={proposalDetail?.car?.plateNumber || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Plate code"}
                                      value={proposalDetail?.car?.plateCode || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Year of first Registration"}
                                      value={proposalDetail?.car?.registrationYear || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Reg. Card TC No."}
                                      value={proposalDetail?.car?.tcNo || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Engine number"}
                                      value={proposalDetail?.car?.engineNumber || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Year of no claim"}
                                      value={proposalDetail?.car?.yearOfNoClaim || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Claim history"}
                                      value={proposalDetail?.car?.claimHistory || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Reg. card expiry date"}
                                      value={
                                        isValid(parseISO(proposalDetail?.car?.regCardExpiryDate))
                                          ? format(parseISO(proposalDetail?.car?.regCardExpiryDate), "dd-MM-yyyy")
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Color"}
                                      value={proposalDetail?.car?.color || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Reg card issue date"}
                                      value={
                                        isValid(parseISO(proposalDetail?.car?.registrationDate))
                                          ? format(parseISO(proposalDetail?.car?.registrationDate), "dd-MM-yyyy")
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Use Of Vehicle"}
                                      value={proposalDetail?.car?.useOfVehicle || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Current Insurance Policy Number"}
                                      value={proposalDetail?.car?.policyNumber || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />
                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"No Of Passengers"}
                                      value={proposalDetail?.car?.noOfPassengers || "-"}
                                    />
                                  </Grid>
                                  {proposalDetail?.car?.bank && (
                                    <Grid item xs={12} md={6}>
                                      <ListItemComp
                                        isCopy={true}
                                        label={"Bank"}
                                        value={proposalDetail?.car?.bank || "-"}
                                      />
                                    </Grid>
                                  )}
                                </Grid>
                                <Divider />

                                <Grid container>
                                  {proposalDetail?.car?.ncdProofDocument?.path ? (
                                    <Grid
                                      item
                                      xs={12}
                                      md={4}
                                      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                                      onClick={() => onDocumentDowmload(proposalDetail?.car?.ncdProofDocument?.path)}
                                    >
                                      <ListItemComp label={"NCD proof document"} value={"Downlaod"} />
                                      <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} />
                                    </Grid>
                                  ) : (
                                    <></>
                                  )}
                                </Grid>

                                <Divider />
                              </>
                            ) : (
                              <EditCarDetailsForm
                                ReGenerateHandler={ReGenerateHandler}
                                setIsCarEdit={setIsCarEdit}
                                nationality={proposalDetail?.customer?.nationality}
                                fetchProposalSummary={fetchProposalSummary}
                                isProposalPurchased={isProposalPurchased}
                              />
                            )}
                          </List>
                        </Grid>

                        {!isCarEdit && (
                          <Grid item xs={12} sm={3}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                height: "100%",
                                alignItems: "center",
                                mb: 2,
                                pr: "24px",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  mt: 1,
                                  fontWeight: "600",
                                  fontSize: "13px",
                                  color: "#60176F",
                                  px: "14px",
                                }}
                              >
                                To Upload multiple files, please upload files one after another.
                              </Typography>
                              <Box
                                sx={{
                                  width: "100%",
                                  height: { xs: "200px", md: "150px" },
                                  display: "flex",
                                  border: "1px solid #E6E6E6",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {!registrationCardSelectedImage && !proposalDetail?.car?.registrationCardP ? (
                                  <IconButton
                                    color="#707070"
                                    backgroundColor="none"
                                    aria-label="upload picture"
                                    component="label"
                                    disableRipple
                                    sx={{
                                      flexDirection: "column",
                                      cursor: "pointer",
                                      gap: 3,
                                      "&:hover": {
                                        background: "none",
                                      },
                                    }}
                                  >
                                    <input
                                      accept=".pdf, .png, .jpeg, .jpg"
                                      id="image-upload"
                                      // multiple
                                      type="file"
                                      onChange={handleRegistrationCardImageChange}
                                      style={{ display: "none" }}
                                    />

                                    <Box
                                      sx={{
                                        width: "48px",
                                        height: "48px",
                                        opacity: 1,
                                        border: "1px solid #E6E6E6",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "0.50rem",
                                      }}
                                    >
                                      <AddIcon sx={{ fontSize: "30px" }} />
                                    </Box>

                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        color: "#707070",
                                        fontSize: {
                                          xs: "11px",
                                          sm: "14px",
                                          lg: "16px",
                                        },
                                        lineHeight: {
                                          xs: "13px",
                                          sm: "16px",
                                          lg: "19px",
                                        },
                                        fontWeight: "400",
                                        fontFamily: "Inter",
                                        textAlign: "center",
                                      }}
                                    >
                                      Upload registration card
                                    </Typography>
                                  </IconButton>
                                ) : (
                                  <PdfViewer
                                    pdfUrl={baseURL + "/" + proposalDetail?.car?.registrationCardP?.path}
                                    Component={Img}
                                    onClick={() =>
                                      onPdfDownload(baseURL + "/" + proposalDetail?.car?.registrationCardP?.path)
                                    }
                                    imgHeight={200}
                                    imgWidth={200}
                                  />
                                )}
                              </Box>
                              {proposalDetail?.car?.registrationCardP && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    aria-label="upload picture"
                                    component="label"
                                    gutterBottom
                                    sx={{
                                      color: "#707070",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      fontFamily: "Inter",
                                      textDecoration: "underline",
                                      mt: 0.5,
                                      cursor: "pointer",
                                    }}
                                  >
                                    Upload new Registration Card
                                    <input
                                      accept=".pdf, .png, .jpeg, .jpg"
                                      id="image-upload"
                                      // multiple
                                      type="file"
                                      onChange={handleRegistrationCardImageChange}
                                      style={{ display: "none" }}
                                    />
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "end",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Box
                                      component={Link}
                                      href={baseURL + "/" + proposalDetail?.car?.registrationCardP?.path}
                                      download={proposalDetail?.car?.registrationCardP?.filename}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <DownloadSvg
                                        sx={{
                                          mt: 1.2,
                                          fontSize: "20px",
                                          color: "#707070",
                                          "&:hover": {
                                            color: "#60176F",
                                          },
                                        }}
                                      />
                                    </Box>
                                    <DeleteSvg
                                      onClick={removeRegistartionCard}
                                      sx={{
                                        color: "#707070",
                                        fontSize: "16px",
                                        "&:hover": {
                                          color: "#60176F",
                                        },
                                        cursor: "pointer",
                                      }}
                                    />
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                      {proposalDetail?.car?.expiredCarPhotos?.length > 0 && (
                        <Grid item xs={12} px={{ xs: 1, md: 2 }}>
                          <Card sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                width: "100%",
                                backgroundColor: "#f5f5f5",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                  py: 1,
                                  fontWeight: "600",
                                  fontSize: "16px",
                                  display: "inline-block",
                                  color: "#60176F",
                                  px: "14px",
                                  mb: 0,
                                  borderRadius: "10px 0 0 0",
                                }}
                              >
                                Cars Images
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, p: 2 }}>
                              <SlideshowLightBox
                                lightboxIdentifier="lightbox1"
                                images={proposalDetail?.car?.expiredCarPhotos}
                                // showThumbnails
                              >
                                {proposalDetail?.car?.expiredCarPhotos?.map((item, idx) => {
                                  console.log(item, "item");
                                  return (
                                    <Box
                                      sx={{
                                        width: 200,
                                        height: 150,
                                        position: "relative",
                                        // border: "1px solid #E8E8E8",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 0.5,
                                        flexDirection: "column",
                                        // borderRadius: "10px",
                                        p: 1,
                                      }}
                                    >
                                      <IconButton
                                        color="#707070"
                                        backgroundColor="#fff"
                                        component="label"
                                        disableRipple
                                        sx={{
                                          position: "absolute",
                                          top: -8,
                                          right: -8,
                                          border: "1px solid #707070",
                                          borderRadius: "50%",
                                          cursor: "pointer",
                                          zIndex: 2,
                                          background: "#fff",
                                          padding: 0,
                                        }}
                                      >
                                        <ClearIcon
                                          sx={{ fontSize: 20 }}
                                          onClick={() => onDeleteUploadedImage(item?.path)}
                                        />
                                      </IconButton>
                                      <img
                                        style={{
                                          margin: "5px",
                                          border: "2px solid #E8E8E8",
                                          borderRadius: "10px",
                                          cursor: "pointer",
                                          width: 190,
                                          height: 150,
                                          // objectFit: "cover",
                                        }}
                                        src={`${baseURL}/${item?.path}`}
                                        alt="e"
                                        data-lightboxjs="lightbox1"
                                      />
                                    </Box>
                                  );
                                })}
                              </SlideshowLightBox>

                              <Box
                                onClick={() => {
                                  setOpenCarImageUpload(true);
                                  setCarImageLeble("At least 3 car images require.");
                                }}
                                sx={{
                                  width: 200,
                                  height: 150,
                                  position: "relative",
                                  border: "1px solid #E8E8E8",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: 0.5,
                                  flexDirection: "column",
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                  p: 1,
                                }}
                              >
                                <AddIcon sx={{ color: `#60176F`, fontSize: 70 }} />
                                <Typography variant="subtitle1">Add more images</Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )}
                      {carColorList?.length > 0 &&
                        !policyIssued &&
                        moduleAccess(user, "proposals.update") &&
                        selectedCheckboxes?.length == 1 && (
                          <CarColorSelect options={carColorList} proposalDetail={proposalDetail} />
                        )}
                    </Box>

                    {/* Customer Details */}
                    <Box sx={{ display: "flex", my: 2, justifyContent: "end" }}>
                      {moduleAccess(user, "proposals.update") && (
                        <Button
                          type="button"
                          disabled={!!isPolicyGenerated}
                          variant="contained"
                          onClick={() => {
                            setIsCustomerEdit(true);
                          }}
                        >
                          Edit customer
                        </Button>
                      )}
                    </Box>
                    <Box
                      id="customerDetails"
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        borderRadius: "10px",
                        boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
                        mb: 3,
                      }}
                    >
                      <Grid container columnSpacing={2}>
                        <Grid item xs={12} sm={isCustomerEdit ? 12 : 9}>
                          <Box
                            sx={{
                              width: "100%",
                              backgroundColor: "#f5f5f5",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              gutterBottom
                              sx={{
                                py: 1.5,
                                fontWeight: "600",
                                fontSize: "18px",
                                display: "inline-block",
                                color: "#60176F",
                                px: "14px",
                                mb: 0,
                                borderRadius: "10px 0 0 0",
                              }}
                            >
                              Customer details
                            </Typography>

                            {moduleAccess(user, "customers.read") && (
                              <Button
                                type="button"
                                variant="contained"
                                onClick={() => router.push(`/customers/${proposalDetail?.customer?._id}`)}
                              >
                                Go to profile
                              </Button>
                            )}
                          </Box>

                          <List>
                            {!isCustomerEdit ? (
                              <>
                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Full name"}
                                      value={proposalDetail?.customer?.fullName}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Arabic name"}
                                      value={proposalDetail?.customer?.arabicName}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Gender"}
                                      value={proposalDetail?.customer?.gender}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Nationality"}
                                      value={
                                        proposalDetail?.customer?.nationality
                                          ? proposalDetail?.customer?.nationality
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Email Address"}
                                      value={proposalDetail?.customer?.email}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Date of birth"}
                                      value={
                                        isValid(parseISO(proposalDetail?.customer?.dateOfBirth))
                                          ? format(parseISO(proposalDetail?.customer?.dateOfBirth), "dd-MM-yyyy")
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Marital status"}
                                      value={proposalDetail?.customer?.maritalStatus || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Occupation"}
                                      value={proposalDetail?.customer?.occupation || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Age"}
                                      value={proposalDetail?.customer?.age || "-"}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Mobile no."}
                                      value={
                                        proposalDetail?.customer?.mobileNumber && proposalDetail?.customer?.countryCode
                                          ? "+" +
                                            proposalDetail?.customer?.countryCode +
                                            " " +
                                            proposalDetail?.customer?.mobileNumber
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    {" "}
                                    <ListItemComp
                                      isCopy={true}
                                      label={"ID Number"}
                                      value={
                                        proposalDetail?.customer?.emiratesId
                                          ? proposalDetail?.customer?.emiratesId
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"TC Number"}
                                      value={proposalDetail?.customer?.dlTcNo ? proposalDetail?.customer?.dlTcNo : "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"ID Expiry"}
                                      value={
                                        isValid(parseISO(proposalDetail?.customer?.emiratesIdExpiryDate))
                                          ? format(
                                              parseISO(proposalDetail?.customer?.emiratesIdExpiryDate),
                                              "dd-MM-yyyy"
                                            )
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Driving licence no."}
                                      value={
                                        proposalDetail?.customer?.licenceNo ? proposalDetail?.customer?.licenceNo : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Driving licence Issue"}
                                      value={
                                        isValid(parseISO(proposalDetail?.customer?.licenceIssueDate))
                                          ? format(parseISO(proposalDetail?.customer?.licenceIssueDate), "dd-MM-yyyy")
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Driving licence expiry"}
                                      value={
                                        isValid(parseISO(proposalDetail?.customer?.licenceExpiryDate))
                                          ? format(parseISO(proposalDetail?.customer?.licenceExpiryDate), "dd-MM-yyyy")
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />

                                <Grid container>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Place of issue"}
                                      value={
                                        proposalDetail?.customer?.placeOfIssueDL
                                          ? proposalDetail?.customer?.placeOfIssueDL
                                          : "-"
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Driver address"}
                                      value={proposalDetail?.customer?.address || "-"}
                                    />
                                  </Grid>
                                </Grid>

                                <Divider />
                                <Grid container>
                                  <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    sx={{
                                      alignItems: "center",
                                      display: "flex",
                                      width: "100%",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        width: "100%",
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                        sx={{
                                          width: { xl: "190px", xs: "50%" },
                                          mb: 1,
                                          fontWeight: "500",
                                          fontSize: "16px",
                                          display: "inline-block",
                                        }}
                                      >
                                        Web access
                                      </Typography>
                                      <IOSSwitch
                                        defaultChecked={defalutAccessSwitch()}
                                        onChange={(e) => {
                                          dispatch(
                                            EditInProposalCustomerDetailsById({
                                              id: proposalDetail?.customer?._id,
                                              data: {
                                                isParent: e.target.checked,
                                              },
                                            })
                                          )
                                            .unwrap()
                                            .then((res) => {
                                              fetchProposalSummary();
                                              toast.success("successfully edited!");
                                            })
                                            .catch((err) => {
                                              console.log(err);
                                              toast.error(err);
                                            });
                                        }}
                                      />
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <ListItemComp
                                      isCopy={true}
                                      label={"Employer"}
                                      value={proposalDetail?.customer?.employer || "-"}
                                    />
                                  </Grid>
                                </Grid>
                              </>
                            ) : (
                              <EditCustomerDetailsForm setIsCustomerEdit={setIsCustomerEdit} isQuote={false} />
                            )}
                          </List>
                        </Grid>

                        {!isCustomerEdit && (
                          <Grid item xs={12} sm={3}>
                            <BoxCustom
                              sx={{
                                display: "flex",
                                flexFlow: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                gap: 4,
                              }}
                            >
                              <Box
                                sx={{
                                  textAlign: "left",
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    mt: 1,
                                    fontWeight: "600",
                                    fontSize: "13px",
                                    color: "#60176F",
                                    px: "14px",
                                  }}
                                >
                                  To Upload multiple files, please upload files one after another.
                                </Typography>
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: { xs: "200px", md: "150px" },
                                    display: "flex",
                                    border: "1px solid #E6E6E6",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {!emiratesSelectedImage && !proposalDetail?.customer?.emiratesIdP ? (
                                    <IconButton
                                      color="#707070"
                                      backgroundColor="none"
                                      aria-label="upload picture"
                                      component="label"
                                      disableRipple
                                      sx={{
                                        flexDirection: "column",
                                        cursor: "pointer",
                                        gap: 3,
                                        "&:hover": {
                                          background: "none",
                                        },
                                      }}
                                    >
                                      <input
                                        accept=".pdf, .png, .jpeg, .jpg"
                                        id="image-upload"
                                        type="file"
                                        onChange={handleEmiratesImageChange}
                                        style={{ display: "none" }}
                                      />

                                      <Box
                                        sx={{
                                          width: "48px",
                                          height: "48px",
                                          opacity: 1,
                                          border: "1px solid #E6E6E6",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          borderRadius: "0.50rem",
                                        }}
                                      >
                                        <AddIcon sx={{ fontSize: "30px" }} />
                                      </Box>

                                      <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                        sx={{
                                          color: "#707070",
                                          fontSize: {
                                            xs: "11px",
                                            sm: "14px",
                                            lg: "16px",
                                          },
                                          lineHeight: {
                                            xs: "13px",
                                            sm: "16px",
                                            lg: "19px",
                                          },
                                          fontWeight: "400",
                                          fontFamily: "Inter",
                                          textAlign: "center",
                                        }}
                                      >
                                        Upload Emirates ID
                                      </Typography>
                                    </IconButton>
                                  ) : (
                                    <PdfViewer
                                      pdfUrl={baseURL + "/" + proposalDetail?.customer?.emiratesIdP?.path}
                                      onClick={() =>
                                        onPdfDownload(baseURL + "/" + proposalDetail?.customer?.emiratesIdP?.path)
                                      }
                                      Component={Img}
                                      imgHeight={200}
                                      imgWidth={200}
                                    />
                                  )}
                                </Box>

                                {proposalDetail?.customer?.emiratesIdP && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      aria-label="upload picture"
                                      component="label"
                                      gutterBottom
                                      sx={{
                                        color: "#707070",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        fontFamily: "Inter",
                                        textDecoration: "underline",
                                        mt: 0.5,
                                        cursor: "pointer",
                                      }}
                                    >
                                      Upload new Emirates ID
                                      <input
                                        accept=".pdf, .png, .jpeg, .jpg"
                                        id="image-upload"
                                        type="file"
                                        // multiple
                                        onChange={handleEmiratesImageChange}
                                        style={{ display: "none" }}
                                      />
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Box
                                        component={Link}
                                        href={baseURL + "/" + proposalDetail?.customer?.emiratesIdP?.path}
                                        download={proposalDetail?.customer?.emiratesIdP?.filename}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <DownloadSvg
                                          sx={{
                                            mt: 1.2,
                                            fontSize: "20px",
                                            color: "#707070",
                                            "&:hover": {
                                              color: "#60176F",
                                            },
                                          }}
                                        />
                                      </Box>
                                      <DeleteSvg
                                        onClick={removeEmirateId}
                                        sx={{
                                          color: "#707070",
                                          fontSize: "16px",
                                          "&:hover": {
                                            color: "#60176F",
                                          },
                                          cursor: "pointer",
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                )}
                              </Box>

                              <Box
                                sx={{
                                  textAlign: "left",
                                  width: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    border: "1px solid #E6E6E6",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {!drivingSelectedImage && !proposalDetail?.customer?.drivingLicenseP ? (
                                    <IconButton
                                      color="#707070"
                                      backgroundColor="none"
                                      aria-label="upload picture"
                                      component="label"
                                      disableRipple
                                      sx={{
                                        flexDirection: "column",
                                        cursor: "pointer",
                                        gap: 3,
                                        "&:hover": {
                                          background: "none",
                                        },
                                      }}
                                    >
                                      <input
                                        accept=".pdf, .png, .jpeg, .jpg"
                                        id="image-upload"
                                        type="file"
                                        // multiple
                                        onChange={handleDrivingImageChange}
                                        style={{ display: "none" }}
                                      />

                                      <Box
                                        sx={{
                                          width: "48px",
                                          height: "48px",
                                          opacity: 1,
                                          border: "1px solid #E6E6E6",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          borderRadius: "0.50rem",
                                        }}
                                      >
                                        <AddIcon sx={{ fontSize: "30px" }} />
                                      </Box>

                                      <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                        sx={{
                                          color: "#707070",
                                          fontSize: {
                                            xs: "11px",
                                            sm: "14px",
                                            lg: "16px",
                                          },
                                          lineHeight: {
                                            xs: "13px",
                                            sm: "16px",
                                            lg: "19px",
                                          },
                                          fontWeight: "400",
                                          fontFamily: "Inter",
                                          textAlign: "center",
                                        }}
                                      >
                                        Upload Driving licence
                                      </Typography>
                                    </IconButton>
                                  ) : (
                                    <PdfViewer
                                      pdfUrl={baseURL + "/" + proposalDetail?.customer?.drivingLicenseP?.path}
                                      onClick={() =>
                                        onPdfDownload(baseURL + "/" + proposalDetail?.customer?.drivingLicenseP?.path)
                                      }
                                      Component={Img}
                                      imgHeight={200}
                                      imgWidth={200}
                                    />
                                  )}
                                </Box>
                                {proposalDetail?.customer?.drivingLicenseP && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      aria-label="upload picture"
                                      component="label"
                                      gutterBottom
                                      sx={{
                                        color: "#707070",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        fontFamily: "Inter",
                                        textDecoration: "underline",
                                        mt: 0.5,
                                        cursor: "pointer",
                                      }}
                                    >
                                      Upload new Driving License
                                      <input
                                        accept=".pdf, .png, .jpeg, .jpg"
                                        id="image-upload"
                                        type="file"
                                        // multiple
                                        onChange={handleDrivingImageChange}
                                        style={{ display: "none" }}
                                      />
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <Box
                                        component={Link}
                                        href={baseURL + "/" + proposalDetail?.customer?.drivingLicenseP?.path}
                                        download={proposalDetail?.customer?.drivingLicenseP?.filename}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <DownloadSvg
                                          sx={{
                                            mt: 1.2,
                                            fontSize: "20px",
                                            color: "#707070",
                                            "&:hover": {
                                              color: "#60176F",
                                            },
                                          }}
                                        />
                                      </Box>
                                      <DeleteSvg
                                        onClick={removeDrivingLicence}
                                        sx={{
                                          color: "#707070",
                                          fontSize: "16px",
                                          "&:hover": {
                                            color: "#60176F",
                                          },
                                          cursor: "pointer",
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </BoxCustom>
                          </Grid>
                        )}
                      </Grid>
                    </Box>

                    {/* KYC form */}
                    {checkBoxCompanyName == "RAK INSURANCE" && <MotorKYCForm setIsLoading={setIsLoading} />}
                    {/* Adamjee Insurance form */}
                    {bankListCompanyWise?.length > 0 && selectedCheckboxes?.length == 1 && (
                      <ExtraDetailForm setIsLoading={setIsLoading} options={bankListCompanyWise || []} />
                    )}

                    {/* Transaction Details  */}
                    {proposalDetail?.payment && (
                      <>
                        <ProposalTransferTable
                          proposalDetail={proposalDetail}
                          setIsLoading={setIsLoading}
                          proposalId={proposalId}
                        />
                      </>
                    )}
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
                        borderBottom: "1px solid #E6E6E6",
                        mt: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          backgroundColor: "#f5f5f5",
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
                          Live policy errors
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              setViewPayloadModal(true);
                              SavedThirdPartyPayload();
                            }}
                            sx={{ ml: "auto" }}
                          >
                            Quote Payload
                          </Button>
                          {isProposalPurchased && (
                            <Button
                              variant="contained"
                              onClick={() => {
                                setViewPolicyErrorModal(true);
                                SavedThirdPartyPayload();
                              }}
                              sx={{ ml: "auto" }}
                            >
                              Policy Payload/Error
                            </Button>
                          )}
                        </Box>
                      </Box>

                      {livePolicyErrorsLoader ? (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                          <LivePolicyErrorsTable items={livePolicyErrorsList} />
                        </Box>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "inline-block",
                        width: "100%",
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
                          {moduleAccess(user, "proposals.update") && (
                            <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                              Add a Comment
                            </Button>
                          )}
                        </Box>
                      </Box>

                      {carProposalCommentListLoader ? (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                          {carProposalCommentList && <CustomerCommentsTable items={carProposalCommentList} />}
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: "inline-block", width: "100%" }}>
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
                        Proposal History
                      </Typography>
                      <Box>
                        <ProposalHistoryTable items={proposalDetail?.proposalHistory} />
                      </Box>
                    </Box>
                    {selectedCheckboxes?.length === 1 && (
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
                                    Insurance Company Premium
                                  </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography
                                    sx={{
                                      color: "#707070",
                                      fontSize: { xs: "14px", md: "15px" },
                                    }}
                                  >
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
                                          (quotePayableDetails?.quote?.discountPrice ||
                                            quotePayableDetails?.quote?.price) * 0.05
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
                                            label="Edit Price"
                                            name="premium"
                                            type="number"
                                            defaultValue={
                                              quotePayableDetails?.quote?.discountPrice ||
                                              quotePayableDetails?.premiumWithVat
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
                                        {!quotePayableDetails?.quote?.voucher ? (
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
                                        ) : (
                                          <></>
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
                                        {`AED ${formatNumber(
                                          quotePayableDetails?.quote?.price * 1.05 -
                                            quotePayableDetails?.quote?.discountPrice
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
                                    {moduleAccess(user, "proposals.update") && (
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
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      type="button"
                      disabled={!!isPolicyGenerated || !!disableButton}
                      variant="contained"
                      sx={{ minWidth: "140px" }}
                      onClick={() => ReGenerateHandler(proposalQuotationList)}
                    >
                      Re-generate
                    </Button>
                    {isProposalPurchased && (
                      <Button
                        type="button"
                        disabled={!!isPolicyGenerated || !!disableButton}
                        variant="contained"
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
                            disabled={!!isPolicyGenerated || !!disableButton}
                            variant="contained"
                            onClick={() => payByLinkHandler({ paidBy: "CRM - Direct to insurance company" })}
                            sx={{ minWidth: "140px" }}
                          >
                            Paid to the company
                          </Button>
                        )}
                        <Button
                          type="button"
                          disabled={!!isPolicyGenerated || !!disableButton}
                          variant="contained"
                          onClick={() => payByLinkHandler({ paidBy: "link" })}
                          sx={{ minWidth: "140px" }}
                        >
                          Pay by link
                        </Button>
                        {!user?.moduleAccessId?.isSalesAgent && (
                          <Button
                            type="button"
                            disabled={!!isPolicyGenerated || !!disableButton}
                            variant="contained"
                            onClick={() => payByLinkHandler({ paidBy: "CRM - Bank transfer" })}
                            sx={{ minWidth: "140px" }}
                          >
                            Pay by bank transfer
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      <ModalComp open={openEditModal} handleClose={handleEditModalClose} width="44rem">
        <EditDetailsModal handleEditModalClose={handleEditModalClose} />
      </ModalComp>

      <ModalComp open={openCarEditModal} handleClose={handleCarEditModalClose} width="44rem">
        <EditCarDetailsModal
          handleCarEditModalClose={handleCarEditModalClose}
          ReGenerateHandler={ReGenerateHandler}
          proposalQuotationList={proposalQuotationList}
          nationality={proposalDetail?.customer?.nationality}
          dateOfBirth={proposalDetail?.customer?.dateOfBirth}
        />
      </ModalComp>

      <ModalComp open={openComparisonModal} handleClose={handleComparisonModalClose} width="60rem">
        <GenerateComparisonModal
          handleComparisonModalClose={handleComparisonModalClose}
          proposalQuotationFullList={proposalQuotationFullList}
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
      <ModalComp open={open} handleClose={handleClose} widths={{ xs: "95%", sm: 500 }}>
        <AddCommentModal handleClose={handleClose} id={proposalId} flag={"car-proposal"} />
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
          credential={proposalDetail}
          email={proposalDetail?.customer?.email || proposalDetail?.userId?.email}
          mobileNumber={proposalDetail?.customer?.mobileNumber || proposalDetail?.userId?.mobileNumber}
        />
      </ModalComp>
      <ModalComp open={viewPayloadModal} handleClose={() => setViewPayloadModal(false)} widths={{ xs: "95%", sm: 800 }}>
        <ViewPayloadModal
          handleClose={() => setViewPayloadModal(false)}
          thirdPartyDetails={thirdPartyDetails}
          thirdPartyLoading={thirdPartyLoading}
        />
      </ModalComp>
      <ModalComp
        open={viewPolicyErrorModal}
        handleClose={() => setViewPolicyErrorModal(false)}
        widths={{ xs: "95%", sm: 800 }}
      >
        <ViewPolicyErrorModal
          handleClose={() => setViewPolicyErrorModal(false)}
          errorDetails={policyErrorResponse}
          payloadDetail={thirdPartyDetails}
          loading={thirdPartyLoading}
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
                {moduleAccess(user, "proposals.update") && (
                  <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                    Add a Comment
                  </Button>
                )}
              </Box>
            </Box>

            {carProposalCommentListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
                {carProposalCommentList && <CustomerCommentsTable items={carProposalCommentList} />}
              </Box>
            )}
          </Box>
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
            carDetail={proposalDetail?.car}
            label={carImageLeble}
            keyItem="proposal"
            stateDetail={proposalDetail}
          />
        </Box>
      </ModalComp>
      <ModalComp
        open={openNCDddocumentUpload}
        handleClose={() => {
          setOpenNCDddocumentUpload(false);
        }}
        widths={{ xs: "95%", sm: "95%", md: "40%" }}
      >
        <Box>
          <NcdDocumentUpload
            handleClose={() => {
              setOpenNCDddocumentUpload(false);
            }}
            carId={proposalDetail?.car?._id}
            proposalDetail={proposalDetail}
          />
        </Box>
      </ModalComp>
      <ModalComp open={sharePDFModal} handleClose={handleClosePDFShareModal} widths={{ xs: "95%", sm: "500px" }}>
        <ShareQuoteModal
          proposalDetail={proposalDetail}
          refId={proposalQuotationList?.[0]?._id}
          setIsLoading={setIsLoading}
          quotePdfLink={quotePdfLink}
          handleClose={handleClosePDFShareModal}
          quoteId={selectedCheckboxes?.[0]}
        />
      </ModalComp>
      {proposalQuotationList?.length > 0 && (
        <ModalComp
          open={openMigateModal}
          handleClose={() => {
            setOpenMigrateModal(false);
          }}
          widths={{ xs: "95%", sm: "95%", md: "98%", lg: 1200 }}
        >
          <MigrateQuotes
            setOpenMigrateModal={setOpenMigrateModal}
            setIsLoading={setIsLoading}
            proposalId={proposalId}
            setPaymentLinkShareModal={setPaymentLinkShareModal}
            setPaymentLinkInfo={setPaymentLinkInfo}
            fetchProposalSummary={fetchProposalSummary}
          />
        </ModalComp>
      )}
    </>
  );
};

ProposalDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProposalDetails;
