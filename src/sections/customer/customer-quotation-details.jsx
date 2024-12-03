import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
  styled,
  Card,
  Backdrop,
} from "@mui/material";
import ListItemComp from "src/components/ListItemComp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NextImage from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO, isValid } from "date-fns";
import ModalComp from "src/components/modalComp";
import EditCustomerDetailsQuotationModal from "../quotations/edit-customer-details-quotation-modal";
import EditCarDetailsQuotationModal from "../quotations/edit-car-details-quotation-modal";
import EditCarDetailsModal from "../Proposals/edit-car-details-modal";
import { getCustomerQuotationDetailById } from "./action/customerAction";
import { useRouter } from "next/router";
import { AddIcon } from "src/Icons/AddIcon";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  EditCarDetails,
  editQuotationPremium,
  getDrivingLicenceByImage,
  getEmiratesByImage,
  getProposalsDetailsById,
  getQuotesPaybles,
  getRegistraionAByImage,
  removeDrivingLicences,
  removeEmiratesId,
  removeRegistartionCards,
  deletecarImages,
} from "../Proposals/Action/proposalsAction";
import { toast } from "react-toastify";
import PremiumHistoryTable from "../quotations/premium-history-table";
import { EditIcon } from "src/Icons/EditIcon";
import { editCustomerQuotationDetails } from "./reducer/customerSlice";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import EditCarDetailsForm from "../Proposals/edit-car-detail-form";
import EditCustomerDetailsForm from "../Proposals/edit-customer-details-form";
import PromoCodeSession from "../Proposals/apply-promo-code";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import VerifyModal from "src/components/verifyModal";
import ClearIcon from "@mui/icons-material/Clear";
import Image from "next/image";
import PdfViewer from "src/components/pdf-as-image";
import CarColorSelect from "../Proposals/car-color-select";
import MotorKYCForm from "../Proposals/motor-kyc-form";
import AnimationLoader from "src/components/amimated-loader";
import ExtraDetailForm from "../Proposals/extra-detail-form";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

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

const CarImg = styled(Image)(({ theme }) => ({
  width: "auto !important",
  maxWidth: "180px !important",
  objectFit: "cover",
  height: "140px !important",
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

const CustomerQuotationDetails = ({ setOpenCarImageUpload, setCarImageLeble }) => {
  const router = useRouter();
  const { quotationId } = router.query;
  const dispatch = useDispatch();
  const { customerQuotationDetails } = useSelector((state) => state.customer);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isCustomerEdit, setIsCustomerEdit] = useState(false);

  const [newValue, setNewValue] = useState(customerQuotationDetails?.discountPrice || customerQuotationDetails?.price);
  const [isCarValueEditable, setIsCarValueEditable] = useState(false);
  const [newCarValue, setNewCarValue] = useState(
    customerQuotationDetails?.carValue || customerQuotationDetails?.carId?.price
  );
  const handleEditModalClose = () => setOpenEditModal(false);

  const [openCarEditModal, setOpenCarEditModal] = useState(false);
  const handleCarEditModalClose = () => setOpenCarEditModal(false);

  const [emiratesSelectedImage, setEmiratesSelectedImage] = useState(null);
  const [drivingSelectedImage, setDrivingSelectedImage] = useState(null);
  const [registrationCardSelectedImage, setRegistrationCardSelectedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isCarEdit, setIsCarEdit] = useState(false);

  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);

  const [isLoading, setIsLoading] = useState(false);

  const { proposalDetail, carColorList, bankListCompanyWise } = useSelector((state) => state.proposals);

  const handleEmiratesImageChange = async (event) => {
    const file1 = event.target.files[0];
    const file2 = event.target.files[1];

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    }

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    } else if (customerQuotationDetails?.userId?.isEmiratesIdMerge) {
      toast.error("Remove old files to upload new files!");
      return;
    } else if (event.target.files?.length > 1 && customerQuotationDetails?.userId?.emiratesIdP) {
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
      const response = await dispatch(
        getEmiratesByImage({
          formData,
          userId: customerQuotationDetails?.userId?._id,
        })
      );
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
        toast.success("Emirates ID Image Uploaded");
        fetchProposalSummary();
      }
    } catch (error) {
      console.log(error, "error");
      setLoading(true);
      toast.error(error);
    }
  };

  const handleDrivingImageChange = async (event) => {
    const file1 = event.target.files[0];
    const file2 = event.target.files[1];

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    }

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    } else if (customerQuotationDetails?.userId?.isDrivingLicenseMerge) {
      toast.error("Remove old files to upload new files!");
      return;
    } else if (event.target.files?.length > 1 && customerQuotationDetails?.userId?.drivingLicenseP) {
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
          userId: customerQuotationDetails?.userId?._id,
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
        toast.success("Driving Licence Uploaded");
        fetchProposalSummary();
      }
    } catch (error) {
      setLoading(true);
      toast.error(error);
    }
  };

  const handleRegistrationCardImageChange = async (event) => {
    const file1 = event.target.files[0];
    const file2 = event.target.files[1];

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    }

    if (event.target.files?.length > 2) {
      toast.error("You can select maximum two files only!");
      return;
    } else if (customerQuotationDetails?.carId?.isRCmerge) {
      toast.error("Remove old files to upload new files!");
      return;
    } else if (event.target.files?.length > 1 && customerQuotationDetails?.carId?.registrationCardP) {
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
          carId: customerQuotationDetails?.carId?._id,
          userId: customerQuotationDetails?.userId?._id,
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
        toast.success("Registration card uploaded.");
      }
    } catch (error) {
      console.log(error, "error");
      setLoading(true);
      toast.error(error.message || "An error occurred.");
    }
  };

  const fetchProposalSummary = () => {
    if (quotationId) {
      try {
        dispatch(getCustomerQuotationDetailById(quotationId));
      } catch (err) {
        toast(err, {
          type: "error",
        });
      }
    }
  };

  const onEditPremiumHandler = (id) => {
    setIsEditable(true);
  };

  const onSubmitChange = (value, quote_Id) => {
    dispatch(editQuotationPremium({ price: value, quoteId: quote_Id }))
      .unwrap()
      .then((res) => {
        toast.success("SuccessFully Updated");
        fetchProposalSummary();
        dispatch(getQuotesPaybles({ quoteId: quotationId }));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setIsEditable(false);
  };

  const onSubmitCarValueChange = (value, quote_Id) => {
    dispatch(
      EditCarDetails({
        id: customerQuotationDetails?.carId?._id,
        data: { price: value, quoteId: quote_Id, updateType: "quote" },
      })
    )
      .unwrap()
      .then((res) => {
        toast.success("SuccessFully Updated");
        dispatch(getCustomerQuotationDetailById(quotationId));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setIsCarValueEditable(false);
  };

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

  const initialized = useRef(false);

  const getProposalDetail = () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    dispatch(getProposalsDetailsById({ id: customerQuotationDetails?.proposalId }));
  };

  useEffect(() => {
    getProposalDetail();
  }, [customerQuotationDetails?.proposalId]);

  const removeEmirateId = () => {
    dispatch(removeEmiratesId(customerQuotationDetails?.userId?._id))
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

  const removeRegistartionCard = () => {
    dispatch(removeRegistartionCards(customerQuotationDetails?.carId?._id))
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

  const removeDrivingLicence = () => {
    dispatch(removeDrivingLicences(customerQuotationDetails?.userId?._id))
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

  const onDocumentDowmload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = baseURL + "/" + pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Delete Cars Images API
  const onDeleteUploadedImage = (value) => {
    setIsLoading(true);
    dispatch(deletecarImages({ id: customerQuotationDetails?.carId?._id, data: { filePathToDelete: value } }))
      .unwrap()
      .then((res) => {
        dispatch(editCustomerQuotationDetails({ ...customerQuotationDetails, carId: res?.data }));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        toast?.error(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {!loading && (
        <>
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              transform: "-webkit-translate(-50%, -50%)",
              transform: "-moz-translate(-50%, -50%)",
              transform: "-ms-translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            <CircularProgress sx={{ color: "#60176F" }} />
          </Box>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 9998,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
            }}
          ></div>
        </>
      )}
      <Box sx={{ display: "flex", flexFlow: "column" }}>
        {customerQuotationDetails?.isPaid == 1 && (
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
              {customerQuotationDetails?.policyIssued
                ? "Policy already issued for this quotation!"
                : customerQuotationDetails?.isBought
                ? "This quotation has been done and paid for, click view policy to go to the policy to finish the process."
                : customerQuotationDetails?.isPaid
                ? "Payment received for this quotation, confirm payment and generate policy."
                : "-"}
            </Typography>
            {(customerQuotationDetails?.isBought || customerQuotationDetails?.policyIssued) && (
              <Button
                type="button"
                variant="contained"
                sx={{ minWidth: 130 }}
                onClick={() => router?.push(`/policies/${customerQuotationDetails?.policy?._id}`)}
              >
                View Policy
              </Button>
            )}
          </Box>
        )}

        <Box sx={{ display: "inline-block", width: "100%" }}>
          <PromoCodeSession
            proposalId={customerQuotationDetails?.proposalId}
            items={customerQuotationDetails}
            fetchProposalSummary={fetchProposalSummary}
            isPurchased={customerQuotationDetails?.isPaid}
          />
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
              fontWeight: "600",
              fontSize: "18px",
              display: "inline-block",
              color: "#60176F",
              px: "14px",
            }}
          >
            Quotation details
          </Typography>

          <List>
            <Grid container columnSpacing={4}>
              <Grid item xs={12} md={6}>
                <ListItemComp label={"No"} value={customerQuotationDetails?.response?.QuotationNo} />
                <DividerCustom />
              </Grid>

              <Grid item xs={12} md={6}>
                <ListItemComp
                  label={"Issued Date"}
                  value={
                    isValid(parseISO(customerQuotationDetails?.response?.PolicyEffectiveDate))
                      ? format(parseISO(customerQuotationDetails?.response?.PolicyEffectiveDate), "dd-MM-yyyy")
                      : "Issued Date"
                  }
                />
              </Grid>
            </Grid>

            <Divider />

            <Grid container columnSpacing={4}>
              <Grid item xs={12} md={6}>
                <ListItemComp
                  label={"Expiry"}
                  value={
                    isValid(parseISO(customerQuotationDetails?.response?.PolicyExpiryDate))
                      ? format(parseISO(customerQuotationDetails?.response?.PolicyExpiryDate), "dd-MM-yyyy")
                      : "Expiry Date"
                  }
                />
                <DividerCustom />
              </Grid>
              <Grid item xs={12} md={6}>
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
                              color: "#707070",
                              textAlign: { xs: "end", sm: "left" },
                            }}
                          >
                            {"AED " + formatNumber(parseInt(customerQuotationDetails?.price * 100) / 100)}
                          </Typography>
                        ) : (
                          <TextField
                            sx={{ width: "140px" }}
                            label="Edit Premium"
                            name="premium"
                            type="number"
                            defaultValue={customerQuotationDetails?.price}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setNewValue(newValue);
                            }}
                            inputProps={{
                              min: 0,
                              max: 50000,
                            }}
                          />
                        )}
                        {moduleAccess(user, "quotations.update") &&
                          !customerQuotationDetails?.isBought &&
                          customerQuotationDetails?.isMatrix && (
                            <>
                              {!isEditable ? (
                                <EditIcon
                                  onClick={() => {
                                    if (customerQuotationDetails?.editPrice?.length >= 1) {
                                      toast.error("Maximum editable limit exceeded!");
                                      return;
                                    }
                                    onEditPremiumHandler(customerQuotationDetails?._id);
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
                                    if (!newValue || newValue < 0 || newValue > 50000) {
                                      toast.error("Value must be between 0 and 50,000!");
                                      return;
                                    }
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

            <Grid container columnSpacing={4}>
              <Grid item xs={12} md={6}>
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
                            fontSize: "16px",
                            display: "inline-block",
                            // textAlign: "end",
                          }}
                        >
                          {"Company"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "50%",
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
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
                          {customerQuotationDetails?.response?.QuatationCompanyName || "-"}
                        </Typography>
                        {customerQuotationDetails?.companyId?.companyPortal && (
                          <>
                            <Link
                              onClick={() => {
                                let pdfUrl = customerQuotationDetails?.companyId?.companyPortal;
                                const link = document.createElement("a");
                                link.href = pdfUrl;
                                link.setAttribute("target", "_blank");
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                              }}
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <OpenInNewIcon fontSize="small" />
                            </Link>
                          </>
                        )}
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
                <DividerCustom />
              </Grid>
              <Grid item xs={12} md={6}>
                <ListItemComp
                  label={"Type"}
                  value={
                    (customerQuotationDetails?.response?.QuatationType === "thirdparty"
                      ? "Third Party"
                      : "Comprehensive") + (customerQuotationDetails?.basicQuote ? " (Basic)" : "")
                  }
                />
              </Grid>
            </Grid>

            <Divider />
          </List>
        </Box>

        <Box sx={{ display: "flex", my: 2, justifyContent: "end", px: 2 }}>
          {moduleAccess(user, "quotations.update") && (
            <Button
              type="button"
              variant="contained"
              disabled={!!customerQuotationDetails?.isBought}
              onClick={() => {
                // setOpenCarEditModal(true);
                setIsCarEdit(true);
              }}
            >
              Edit car details
            </Button>
          )}
        </Box>

        <Box sx={{ display: "inline-block", width: "100%" }} id="carDetails">
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              width: "100%",
              py: 1.5,
              backgroundColor: "#f5f5f5",
              mb: 1,
              fontWeight: "600",
              fontSize: "18px",
              display: "inline-block",
              color: "#60176F",
              px: "14px",
            }}
          >
            Car details
          </Typography>

          <Grid container columnSpacing={4} p={2.5}>
            <Grid item xs={12} sm={isCarEdit ? 12 : 9}>
              {!isCarEdit ? (
                <List>
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp isCopy={true} label={"Brand"} value={customerQuotationDetails?.carId?.make} />
                      <DividerCustom />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"No. of clynders"}
                        value={
                          customerQuotationDetails?.carId?.cylinders ? customerQuotationDetails?.carId?.cylinders : ""
                        }
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp isCopy={true} label={"Model"} value={customerQuotationDetails?.carId?.model} />

                      <DividerCustom />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: {
                                xs: "space-between",
                                sm: "unset",
                              },
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
                                {customerQuotationDetails?.isMatrix
                                  ? "Value (e-Data)"
                                  : `Value (${customerQuotationDetails?.companyId?.companyName})`}
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
                              {customerQuotationDetails?.insuranceType === "comprehensive" ? (
                                <>
                                  {!isCarValueEditable ? (
                                    <Typography
                                      variant="subtitle2"
                                      gutterBottom
                                      sx={{
                                        fontWeight: "400",
                                        fontSize: "14px",
                                        color: "#707070",
                                        textAlign: { xs: "end", sm: "left" },
                                      }}
                                    >
                                      {"AED " +
                                        formatNumber(
                                          parseInt(
                                            (customerQuotationDetails?.carValue ||
                                              customerQuotationDetails?.carId?.price) * 100
                                          ) / 100
                                        )}
                                    </Typography>
                                  ) : (
                                    <TextField
                                      sx={{ width: "140px" }}
                                      label="Edit Car value"
                                      name="price"
                                      type="number"
                                      defaultValue={
                                        customerQuotationDetails?.carValue || customerQuotationDetails?.carId?.price
                                      }
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        setNewCarValue(newValue);
                                      }}
                                    />
                                  )}
                                  {moduleAccess(user, "quotations.update") && (
                                    <>
                                      {customerQuotationDetails?.isMatrix && (
                                        <>
                                          {!isCarValueEditable ? (
                                            <EditIcon
                                              onClick={() => setIsCarValueEditable(true)}
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
                                              onClick={() =>
                                                onSubmitCarValueChange(newCarValue, customerQuotationDetails?._id)
                                              }
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
                                          )}{" "}
                                        </>
                                      )}
                                    </>
                                  )}
                                </>
                              ) : (
                                "---"
                              )}
                            </Box>
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Trim"}
                        value={customerQuotationDetails?.carId?.trim ? customerQuotationDetails?.carId?.trim : ""}
                      />

                      <DividerCustom />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp isCopy={true} label={"Year"} value={customerQuotationDetails?.carId?.year} />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Body type"}
                        value={
                          customerQuotationDetails?.carId?.bodyType ? customerQuotationDetails?.carId?.bodyType : ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Regional space"}
                        value={customerQuotationDetails?.carId?.regionalSpec || "-"}
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
                          isValid(parseISO(customerQuotationDetails?.carId?.policyEffectiveDate))
                            ? format(parseISO(customerQuotationDetails?.carId?.policyEffectiveDate), "dd-MM-yyyy")
                            : "-"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label="Insurance Expiry Date"
                        value={
                          isValid(parseISO(customerQuotationDetails?.carId?.insuranceExpiryDate))
                            ? format(parseISO(customerQuotationDetails?.carId?.insuranceExpiryDate), "dd-MM-yyyy")
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
                        value={customerQuotationDetails?.carId?.currentInsurer || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Insure type"}
                        value={
                          customerQuotationDetails?.carId?.insureType?.toLowerCase() === "comprehensive"
                            ? "Comprehensive"
                            : customerQuotationDetails?.carId?.insureType?.toLowerCase() === "thirdparty"
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
                        value={customerQuotationDetails?.carId?.typeOfIssues || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Registration emirate"}
                        value={customerQuotationDetails?.carId?.registrationEmirate || "-"}
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Origin"}
                        value={customerQuotationDetails?.carId?.origin || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Chassis No."}
                        value={customerQuotationDetails?.carId?.chesisNo || "-"}
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Plate Number"}
                        value={customerQuotationDetails?.carId?.plateNumber || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Plate code"}
                        value={customerQuotationDetails?.carId?.plateCode || "-"}
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Year of first Registration"}
                        value={customerQuotationDetails?.carId?.registrationYear || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Reg. Card TC No."}
                        value={customerQuotationDetails?.carId?.tcNo || "-"}
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Engine number"}
                        value={customerQuotationDetails?.carId?.engineNumber || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Year of no claim"}
                        value={customerQuotationDetails?.carId?.yearOfNoClaim || "-"}
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Claim history"}
                        value={customerQuotationDetails?.carId?.claimHistory}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Reg. card expiry date"}
                        value={
                          isValid(parseISO(customerQuotationDetails?.carId?.regCardExpiryDate))
                            ? format(parseISO(customerQuotationDetails?.carId?.regCardExpiryDate), "dd-MM-yyyy")
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
                        value={customerQuotationDetails?.carId?.color || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Reg card issue date"}
                        value={
                          isValid(parseISO(customerQuotationDetails?.carId?.registrationDate))
                            ? format(parseISO(customerQuotationDetails?.carId?.registrationDate), "dd-MM-yyyy")
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
                        value={customerQuotationDetails?.carId?.useOfVehicle || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Current Insurance Policy Number"}
                        value={customerQuotationDetails?.carId?.policyNumber || "-"}
                      />
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"No Of Passengers"}
                        value={customerQuotationDetails?.carId?.noOfPassengers || "-"}
                      />
                    </Grid>
                    {customerQuotationDetails?.carId?.bank && (
                      <Grid item xs={12} md={6}>
                        <ListItemComp
                          isCopy={true}
                          label={"Bank"}
                          value={customerQuotationDetails?.carId?.bank || "-"}
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Divider />
                  <Grid container>
                    {customerQuotationDetails?.carId?.ncdProofDocument?.path ? (
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => onDocumentDowmload(customerQuotationDetails?.carId?.ncdProofDocument?.path)}
                      >
                        <ListItemComp label={"NCD proof document"} value={"Downlaod"} />
                        <DownloadSvg sx={{ mt: 0.5, color: "#60176f", cursor: "pointer" }} />
                      </Grid>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </List>
              ) : (
                <EditCarDetailsForm
                  setIsCarEdit={setIsCarEdit}
                  nationality={customerQuotationDetails?.userId?.nationality}
                  p_Id={customerQuotationDetails?.proposalId}
                  setLoading={setLoading}
                  fetchProposalSummary={fetchProposalSummary}
                  isProposalPurchased={customerQuotationDetails?.isPaid}
                />
              )}
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
                      // height: { xs: "200px", md: "150px" },
                      display: "flex",
                      border: "1px solid #E6E6E6",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {!registrationCardSelectedImage && !customerQuotationDetails?.carId?.registrationCardP ? (
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
                        pdfUrl={baseURL + "/" + customerQuotationDetails?.carId?.registrationCardP?.path}
                        onClick={() =>
                          onPdfDownload(baseURL + "/" + customerQuotationDetails?.carId?.registrationCardP?.path)
                        }
                        Component={Img}
                        imgHeight={200}
                        imgWidth={200}
                      />
                    )}
                  </Box>

                  {customerQuotationDetails?.carId?.registrationCardP && (
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
                          href={baseURL + "/" + customerQuotationDetails?.carId?.registrationCardP?.path}
                          download={customerQuotationDetails?.carId?.registrationCardP?.filename}
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
          {customerQuotationDetails?.carId?.expiredCarPhotos?.length > 0 && (
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
                  {customerQuotationDetails?.carId?.expiredCarPhotos?.map((item, idx) => {
                    return (
                      <Box
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
                          <ClearIcon sx={{ fontSize: 20 }} onClick={() => onDeleteUploadedImage(item?.path)} />
                        </IconButton>
                        <CarImg src={`${baseURL}/${item?.path}`} alt="Preview" width={200} height={150} />
                      </Box>
                    );
                  })}
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
            !customerQuotationDetails?.policyIssued &&
            moduleAccess(user, "quotations.update") && (
              <CarColorSelect
                options={carColorList}
                proposalDetail={proposalDetail}
                customerQuotationDetails={customerQuotationDetails}
              />
            )}
        </Box>

        {bankListCompanyWise?.length > 0 && (
          <ExtraDetailForm setIsLoading={setIsLoading} options={bankListCompanyWise} />
        )}

        <Box sx={{ display: "flex", my: 2, justifyContent: "end", px: 2 }}>
          {moduleAccess(user, "quotations.update") && (
            <Button
              type="button"
              variant="contained"
              disabled={!!customerQuotationDetails?.isBought}
              onClick={() => {
                setIsCustomerEdit(true);
              }}
            >
              Edit customer
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "inline-block",
            width: "100%",
          }}
        >
          <Grid container spacing={3} id="customerDetails">
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
                    onClick={() => router.push(`/customers/${customerQuotationDetails?.userId?._id}`)}
                  >
                    Go to profile
                  </Button>
                )}
              </Box>

              {!isCustomerEdit ? (
                <List>
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Full name"}
                        value={customerQuotationDetails?.userId?.fullName}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Arabic name"}
                        value={customerQuotationDetails?.userId?.arabicName}
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp isCopy={true} label={"Gender"} value={customerQuotationDetails?.userId?.gender} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Nationality"}
                        value={
                          customerQuotationDetails?.userId?.nationality
                            ? customerQuotationDetails?.userId?.nationality
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
                        value={customerQuotationDetails?.userId?.email}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Date of birth"}
                        value={
                          isValid(parseISO(customerQuotationDetails?.userId?.dateOfBirth))
                            ? format(parseISO(customerQuotationDetails?.userId?.dateOfBirth), "dd-MM-yyyy")
                            : "-"
                        }
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp isCopy={true} label={"Age"} value={customerQuotationDetails?.userId?.age || "-"} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Occupation"}
                        value={customerQuotationDetails?.userId?.occupation || "-"}
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Driver address"}
                        value={customerQuotationDetails?.userId?.address || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Mobile no."}
                        value={
                          customerQuotationDetails?.userId?.mobileNumber &&
                          customerQuotationDetails?.userId?.countryCode
                            ? "+" +
                              customerQuotationDetails?.userId?.countryCode +
                              " " +
                              customerQuotationDetails?.userId?.mobileNumber
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
                          customerQuotationDetails?.userId?.emiratesId
                            ? customerQuotationDetails?.userId?.emiratesId
                            : "-"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"TC Number"}
                        value={
                          customerQuotationDetails?.userId?.dlTcNo ? customerQuotationDetails?.userId?.dlTcNo : "-"
                        }
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
                          isValid(parseISO(customerQuotationDetails?.userId?.emiratesIdExpiryDate))
                            ? format(parseISO(customerQuotationDetails?.userId?.emiratesIdExpiryDate), "dd-MM-yyyy")
                            : "-"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Driving licence no."}
                        value={
                          customerQuotationDetails?.userId?.licenceNo
                            ? customerQuotationDetails?.userId?.licenceNo
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
                        label={"Driving licence Issue"}
                        value={
                          isValid(parseISO(customerQuotationDetails?.userId?.licenceIssueDate))
                            ? format(parseISO(customerQuotationDetails?.userId?.licenceIssueDate), "dd-MM-yyyy")
                            : "-"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Driving licence expiry"}
                        value={
                          isValid(parseISO(customerQuotationDetails?.userId?.licenceExpiryDate))
                            ? format(parseISO(customerQuotationDetails?.userId?.licenceExpiryDate), "dd-MM-yyyy")
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
                          customerQuotationDetails?.userId?.placeOfIssue
                            ? customerQuotationDetails?.userId?.placeOfIssue
                            : "-"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"Marital status"}
                        value={customerQuotationDetails?.userId?.maritalStatus || "-"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} />
                  </Grid>
                  <Divider />

                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <ListItemComp
                        isCopy={true}
                        label={"employer"}
                        value={
                          customerQuotationDetails?.userId?.employer ? customerQuotationDetails?.userId?.employer : "-"
                        }
                      />
                    </Grid>
                  </Grid>
                </List>
              ) : (
                <EditCustomerDetailsForm setIsCustomerEdit={setIsCustomerEdit} isQuote={true} />
              )}
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
                    pr: "0 !important",
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
                      px: 1,
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
                        display: "flex",
                        border: "1px solid #E6E6E6",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {!emiratesSelectedImage && !customerQuotationDetails?.userId?.emiratesIdP ? (
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
                          pdfUrl={baseURL + "/" + customerQuotationDetails?.userId?.emiratesIdP?.path}
                          onClick={() =>
                            onPdfDownload(baseURL + "/" + customerQuotationDetails?.userId?.emiratesIdP?.path)
                          }
                          Component={Img}
                          imgHeight={200}
                          imgWidth={200}
                        />
                      )}
                    </Box>

                    {customerQuotationDetails?.userId?.emiratesIdP && (
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
                            href={baseURL + "/" + customerQuotationDetails?.userId?.emiratesIdP?.path}
                            download={customerQuotationDetails?.userId?.emiratesIdP?.filename}
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
                      px: 1,
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
                      {!drivingSelectedImage && !customerQuotationDetails?.userId?.drivingLicenseP ? (
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
                          pdfUrl={baseURL + "/" + customerQuotationDetails?.userId?.drivingLicenseP?.path}
                          onClick={() =>
                            onPdfDownload(baseURL + "/" + customerQuotationDetails?.userId?.drivingLicenseP?.path)
                          }
                          Component={Img}
                          imgHeight={200}
                          imgWidth={200}
                        />
                      )}
                    </Box>
                    {customerQuotationDetails?.userId?.drivingLicenseP && (
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
                            href={baseURL + "/" + customerQuotationDetails?.userId?.drivingLicenseP?.path}
                            download={customerQuotationDetails?.userId?.drivingLicenseP?.filename}
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

        {(user?.role == "Admin" || user?.moduleAccessId?.isSupervisor) && (
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
              Edited Premium History
            </Typography>
            <Box>
              <PremiumHistoryTable items={customerQuotationDetails?.editPrice} />
            </Box>
          </Box>
        )}

        {/* KYC form */}
        {customerQuotationDetails?.companyId?.companyName == "RAK INSURANCE" && (
          <MotorKYCForm setIsLoading={setIsLoading} />
        )}
      </Box>

      <AnimationLoader open={isLoading} />

      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
        <VerifyModal
          label={
            "The adjustment can only be done once and MUST match premium without vat that proposed by the insurance company. Are you sure to make changes?"
          }
          handleClose={handleCloseVerifymodal}
          onSubmit={() => onSubmitChange(newValue, quotationId)}
        />
      </ModalComp>
      <ModalComp open={openEditModal} handleClose={handleEditModalClose} width="44rem">
        <EditCustomerDetailsQuotationModal handleEditModalClose={handleEditModalClose} />
      </ModalComp>

      <ModalComp open={openCarEditModal} handleClose={handleCarEditModalClose} widths={{ xs: "95%", sm: "560px" }}>
        <EditCarDetailsModal
          handleCarEditModalClose={handleCarEditModalClose}
          nationality={customerQuotationDetails?.userId?.nationality}
          dateOfBirth={customerQuotationDetails?.userId?.dateOfBirth}
          p_Id={customerQuotationDetails?.proposalId}
          isQuote={true}
          customerQuotationDetails={customerQuotationDetails}
        />
      </ModalComp>
    </>
  );
};

export default CustomerQuotationDetails;
