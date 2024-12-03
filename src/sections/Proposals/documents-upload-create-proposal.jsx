import React, { useState } from "react";
import { Backdrop, Box, Button, CircularProgress, Grid, IconButton, Tooltip, Typography, styled } from "@mui/material";
import {
  carRegistrationUploadOnCreateProposal,
  drivingLicenceUploadOnCreateProposal,
  emiratesIdUploadOnCreateProposal,
  getCarInfoByVinNo,
} from "./Action/proposalsAction";
import Image from "next/image";
import UploadDocs from "src/Icons/UploadDocs";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearDrivingLicenceData, clearEmiratesIdData, clearRegistrationData } from "./Reducer/proposalsSlice";
import VerifiedIcon from "@mui/icons-material/Verified";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import AnimationLoader from "src/components/amimated-loader";
import PdfViewer from "src/components/pdf-as-image";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const Img = styled(Image)(({ theme }) => ({
  width: "100% !important",
  objectFit: "cover",
  height: "161px !important",
}));

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const DocsUploadOnCreate = ({ setRegistrationCarCard, setDrivingLicence, setEmiratesID, resetEmiratesValue }) => {
  const dispatch = useDispatch();
  const { emiratesIdDetails, drivingLicenceDetails, carRegistrationDetails } = useSelector((state) => state.proposals);
  const [loading, setLoading] = useState(false);
  const [eIdLoading, setEIdLoading] = useState(false);
  const [DLLoading, setDLLoading] = useState(false);
  const [RCLoading, setRCLoading] = useState(false);
  const [emiratesSelectedImage, setEmiratesSelectedImage] = useState(null);
  const [drivingSelectedImage, setDrivingSelectedImage] = useState(null);
  const [registrationCardSelectedImage, setRegistrationCardSelectedImage] = useState(null);

  const [emirateIdStatus, setEmirateIdStatus] = useState(null);
  const [drivingStatus, setDrivingStatus] = useState(null);
  const [registrationCardStatus, setRegistrationCardStatus] = useState(null);

  const [licenseDragActive, setLicenseDragActive] = useState(false);
  const [emirateDragActive, setEmirateDragActive] = useState(false);
  const [registartionCardDragActive, setRegistartionCardDragActive] = useState(false);

  //   const [registrationPDFValue, setRegistrationPDFValue] = useState(null);
  // console.log(emiratesIdDetails, "aaa");

  // const fetchCarInfoByVinNo = (vinNo) => {
  //   dispatch(getCarInfoByVinNo({ vinNo: vinNo }))
  //     .unwrap()
  //     .then((res) => {
  //       console.log(res, "res");
  //     })
  //     .catch((err) => {
  //       console.log(err, "err");
  //     });
  // };

  const dropEmiratesId = React.useRef(null);

  // handle drag events
  const handleEmirateIdDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setEmirateDragActive(true);
    } else if (e.type === "dragleave") {
      setEmirateDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleEmirateIdDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setEmirateDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleEmiratesImageChange(e.dataTransfer.files);
    }
  };

  const handleEmiratesImageChange = async (event) => {
    if (event.length > 2 || event?.target?.files?.length > 2) {
      toast.error("You can not upload more than two files!");
      return;
    } else if (emiratesSelectedImage && emiratesSelectedImage?.length >= 2) {
      toast.error("You can not upload more than two files!");
      return;
    } else if ((event.length > 1 || event?.target?.files?.length > 1) && emiratesSelectedImage?.length === 1) {
      toast.error("You can not upload more than two files!");
      return;
    }

    let file1, file2;
    if (event?.target) {
      file1 = event?.target?.files[0];
      file2 = event?.target?.files[1];
      event.target.value = null; // Clear the file input value
    } else {
      file1 = event[0];
      file2 = event[1];
    }

    if (!file1) {
      return;
    }

    // uploadEmiratesImage(file1, file2);
    if (file1 && file2) {
      setEmiratesSelectedImage([file1, file2]);
      setEmirateIdStatus("pendding");
      setEmiratesID([file1, file2]);
    } else {
      if (emiratesSelectedImage?.length === 1) {
        setEmiratesSelectedImage([...emiratesSelectedImage, file1]);
        setEmirateIdStatus("pendding");
        setEmiratesID([...emiratesSelectedImage, file1]);
      } else {
        setEmiratesSelectedImage([file1]);
        setEmirateIdStatus("pendding");
        setEmiratesID([file1]);
      }
    }
  };

  const uploadEmiratesImage = async (file1, file2) => {
    const formData = new FormData();
    formData.append("emiratesId", file1);
    if (file2) {
      formData.append("emiratesId", file2);
    }
    // else if (emiratesSelectedImage?.length === 1) {
    //   formData.append("emiratesId", emiratesSelectedImage[0]);
    // }

    try {
      setLoading(true);
      setEIdLoading(true);
      await dispatch(
        emiratesIdUploadOnCreateProposal({
          formData,
        })
      )
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          if (file1 && file2) {
            // setEmiratesSelectedImage([file1, file2]);
            // setEmiratesID([file1, file2]);
          } else {
            if (emiratesSelectedImage?.length === 1) {
              // setEmiratesSelectedImage([...emiratesSelectedImage, file1]);
              // setEmiratesID([...emiratesSelectedImage, file1]);
            } else {
              // setEmiratesSelectedImage([file1]);
              // setEmiratesID([file1]);
            }
          }
          setLoading(false);
          setEIdLoading(false);
          if (isEmpty(res?.data?.data)) {
            setEmirateIdStatus("error");
            toast.error("Can not read, File uploaded, Fill up information manually");
          } else {
            setEmirateIdStatus("success");
            toast.success("EmiratesId uploaded successfully");
          }
        })
        .catch((err) => {
          console.log(err, "err");
          setLoading(false);
          setEIdLoading(false);
          toast.error(err);
        });
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
      setEIdLoading(false);
      // toast.error(error);
    }
  };

  // handle drag events
  const handleDrivingLicenseDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setLicenseDragActive(true);
    } else if (e.type === "dragleave") {
      setLicenseDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrivingLicenseDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setLicenseDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDrivingImageChange(e.dataTransfer.files);
    }
  };

  const handleDrivingImageChange = async (event) => {
    if (event.length > 2 || event?.target?.files?.length > 2) {
      toast.error("You can not upload more than two files!");
      return;
    } else if (drivingSelectedImage && drivingSelectedImage?.length >= 2) {
      toast.error("You can not upload more than two files!");
      return;
    } else if ((event.length > 1 || event?.target?.files?.length > 1) && drivingSelectedImage?.length === 1) {
      toast.error("You can not upload more than two files!");
      return;
    }

    let file1, file2;
    if (event?.target) {
      file1 = event?.target.files[0];
      file2 = event?.target.files[1];
      event.target.value = null; // Clear the file input value
    } else {
      file1 = event[0];
      file2 = event[1];
    }

    if (!file1) {
      return;
    }

    // uploadDrivingImage(file1, file2);
    if (file1 && file2) {
      setDrivingSelectedImage([file1, file2]);
      setDrivingStatus("pendding");
      setDrivingLicence([file1, file2]);
    } else {
      if (drivingSelectedImage?.length === 1) {
        setDrivingSelectedImage([...drivingSelectedImage, file1]);
        setDrivingStatus("pendding");
        setDrivingLicence([...drivingSelectedImage, file1]);
      } else {
        setDrivingSelectedImage([file1]);
        setDrivingStatus("pendding");
        setDrivingLicence([file1]);
      }
    }
  };

  const uploadDrivingImage = async (file1, file2) => {
    const formData = new FormData();
    formData.append("drivingLicense", file1);
    if (file2) {
      formData.append("drivingLicense", file2);
    }
    // else if (drivingSelectedImage?.length === 1) {
    //   formData.append("drivingLicense", drivingSelectedImage[0]);
    // }

    try {
      setLoading(true);
      setDLLoading(true);
      await dispatch(
        drivingLicenceUploadOnCreateProposal({
          formData,
        })
      )
        .unwrap()
        .then((res) => {
          if (file1 && file2) {
            // setDrivingSelectedImage([file1, file2]);
            // setDrivingLicence([file1, file2]);
          } else {
            if (drivingSelectedImage?.length === 1) {
              // setDrivingSelectedImage([...drivingSelectedImage, file1]);
              // setDrivingLicence([...drivingSelectedImage, file1]);
            } else {
              // setDrivingSelectedImage([file1]);
              // setDrivingLicence([file1]);
            }
          }
          setLoading(false);
          setDLLoading(false);
          if (isEmpty(res?.data?.data)) {
            toast.error("Can not read, File uploaded, Fill up information manually");
            setDrivingStatus("error");
          } else {
            toast.success("Driving Licence uploaded successfully");
            setDrivingStatus("success");
          }
        })
        .catch((err) => {
          setLoading(false);
          setDLLoading(false);
          toast.error(err);
        });
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
      setDLLoading(false);
      // toast.error(error);
    }
  };

  // handle drag events
  const handleRegistrationCardDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setRegistartionCardDragActive(true);
    } else if (e.type === "dragleave") {
      setRegistartionCardDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleRegistrationCardDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setRegistartionCardDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleRegistrationCardImageChange(e.dataTransfer.files);
    }
  };

  const handleRegistrationCardImageChange = async (event) => {
    if (event.length > 2 || event?.target?.files?.length > 2) {
      toast.error("You can not upload more than two files!");
      return;
    } else if (registrationCardSelectedImage && registrationCardSelectedImage?.length >= 2) {
      toast.error("You can not upload more than two files!");
      return;
    } else if ((event.length > 1 || event?.target?.files?.length > 1) && registrationCardSelectedImage?.length === 1) {
      toast.error("You can not upload more than two files!");
      return;
    }

    let file1, file2;
    if (event?.target) {
      file1 = event?.target.files[0];
      file2 = event?.target.files[1];
      event.target.value = null; // Clear the file input value
    } else {
      file1 = event[0];
      file2 = event[1];
    }

    if (!file1) {
      return;
    }
    // uploadRegistrationCartdImage(file1, file2);
    if (file1 && file2) {
      setRegistrationCardSelectedImage([file1, file2]);
      setRegistrationCardStatus("pendding");
      setRegistrationCarCard([file1, file2]);
    } else {
      if (registrationCardSelectedImage?.length === 1) {
        setRegistrationCardSelectedImage([...registrationCardSelectedImage, file1]);
        setRegistrationCardStatus("pendding");
        setRegistrationCarCard([...registrationCardSelectedImage, file1]);
      } else {
        setRegistrationCardSelectedImage([file1]);
        setRegistrationCardStatus("pendding");
        setRegistrationCarCard([file1]);
      }
    }
  };

  const uploadRegistrationCartdImage = async (file1, file2) => {
    const formData = new FormData();
    formData.append("isCarCreate", false);
    formData.append("registrationCard", file1);
    if (file2) {
      formData.append("registrationCard", file2);
    }
    // else if (registrationCardSelectedImage?.length === 1) {
    //   formData.append("registrationCard", registrationCardSelectedImage[0]);
    // }

    try {
      setLoading(true);
      setRCLoading(true);
      await dispatch(
        carRegistrationUploadOnCreateProposal({
          formData,
        })
      )
        .unwrap()
        .then((res) => {
          if (file1 && file2) {
            // setRegistrationCardSelectedImage([file1, file2]);
            // setRegistrationCarCard([file1, file2]);
          } else {
            if (registrationCardSelectedImage?.length === 1) {
              // setRegistrationCardSelectedImage([...registrationCardSelectedImage, file1]);
              // setRegistrationCarCard([...registrationCardSelectedImage, file1]);
            } else {
              // setRegistrationCardSelectedImage([file1]);
              // setRegistrationCarCard([file1]);
            }
          }
          setLoading(false);
          setRCLoading(false);
          if (isEmpty(res?.data?.data)) {
            toast.error("Can not read, File uploaded, Fill up information manually");
            setRegistrationCardStatus("error");
          } else {
            toast.success("Registration card uploaded successfully");
            setRegistrationCardStatus("success");
          }
        })
        .catch((err) => {
          setLoading(false);
          setRCLoading(false);
          toast.error(err);
        });
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
      setRCLoading(false);
      // toast.error(error);
    }
  };

  const ScanAllAtOnceHandler = () => {
    if (emiratesSelectedImage?.[0]) {
      uploadEmiratesImage(emiratesSelectedImage?.[0], emiratesSelectedImage?.[1]);
    }
    if (drivingSelectedImage?.[0]) {
      uploadDrivingImage(drivingSelectedImage?.[0], drivingSelectedImage?.[1]);
    }
    if (registrationCardSelectedImage?.[0]) {
      uploadRegistrationCartdImage(registrationCardSelectedImage?.[0], registrationCardSelectedImage?.[1]);
    }
  };

  return (
    <>
      {(loading || RCLoading || DLLoading || eIdLoading) && (
        <>
          {/* <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading || RCLoading || DLLoading || eIdLoading}
          >
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop> */}
          <AnimationLoader open={true} />
        </>
      )}
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
          mb: 3,
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
          Upload Documents
        </Typography>
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
          {/* To Upload multiple files at once, please select or drag and drop
          multiple files. You can not upload more than two files. */}
          To Upload multiple files, please select or drag and drop files one after another.
        </Typography>

        <Grid container columnSpacing={1} sx={{ my: 2 }}>
          <Grid item xs={0} xl={0.5}></Grid>

          <Grid item xs={12} sm={3.8} xl={3}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
              <Typography
                variant="subtitle2"
                // gutterBottom
                sx={{
                  fontWeight: "400",
                  color: "#656A67",
                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                    lg: "14px",
                    xl: "16px",
                  },
                  lineHeight: {
                    xs: "16px",
                    sm: "20px",
                    xl: "22px",
                  },
                }}
              >
                Emirates ID
              </Typography>

              {emirateIdStatus == "success" ? (
                <Tooltip title="File uploaded, Data fetched">
                  <VerifiedIcon sx={{ fontSize: "20px", color: "#008000" }} />
                </Tooltip>
              ) : emirateIdStatus == "error" ? (
                <Tooltip title="File uploaded, Data not fetched">
                  <NewReleasesIcon sx={{ fontSize: "20px", color: "#EE4B2B" }} />
                </Tooltip>
              ) : (
                ""
              )}
            </Box>
            <Box
              sx={{
                textAlign: "left",
                borderColor: "#707070",
                backgroundImage: ` ${
                  emirateDragActive
                    ? `url(
                                    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%237B2281FF' strokeWidth='5' stroke-dasharray='15%2c 15%2c 1' stroke-dashoffset='0' strokeLinecap='square'/%3e%3c/svg%3e"
                                  )`
                    : `url(
                                      "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' strokeWidth='2' stroke-dasharray='12%2c 20' stroke-dashoffset='0' strokeLinecap='square'/%3e%3c/svg%3e"
                                    )`
                }`,
                width: "100%",
                height: "161px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!emiratesIdDetails?.fileUrl?.path ? (
                <IconButton
                  color="#707070"
                  backgroundColor="none"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  ref={dropEmiratesId}
                  onDragEnter={handleEmirateIdDrag}
                  onDragLeave={handleEmirateIdDrag}
                  onDragOver={handleEmirateIdDrag}
                  onDrop={handleEmirateIdDrop}
                  sx={{
                    width: "100%",
                    cursor: "auto",
                    flexDirection: "column",
                    gap: 0,
                    "&:hover": {
                      background: "none",
                    },
                  }}
                >
                  <input
                    accept=".pdf, .png, .jpeg, .jpg"
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleEmiratesImageChange}
                    style={{ display: "none" }}
                  />

                  <Box
                    sx={{
                      width: "48px",
                      height: "48px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <IconImg src={UploadDocs} alt="Preview" width={60} height={60} /> */}
                    <UploadDocs sx={{ fontSize: "40px !important" }} />
                  </Box>

                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Drag and Drop Your ID
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Or
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#7B2281",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      cursor: "pointer",
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Browse files
                  </Typography>
                </IconButton>
              ) : (
                <IconButton
                  color="#707070"
                  backgroundColor="none"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  ref={dropEmiratesId}
                  onDragEnter={handleEmirateIdDrag}
                  onDragLeave={handleEmirateIdDrag}
                  onDragOver={handleEmirateIdDrag}
                  onDrop={handleEmirateIdDrop}
                  sx={{
                    width: "100%",
                    cursor: "auto",
                    flexDirection: "column",
                    gap: 0,
                    "&:hover": {
                      background: "none",
                    },
                    width: "100%",
                    height: "161px",
                  }}
                >
                  <input
                    accept=".pdf, .png, .jpeg, .jpg"
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleEmiratesImageChange}
                    style={{ display: "none" }}
                  />
                  {/* <Img
                    src={baseURL + "/" + emiratesIdDetails?.fileUrl?.path}
                    alt="Preview EmiratesID"
                    width={300}
                    height={300}
                  /> */}
                  <PdfViewer
                    pdfUrl={baseURL + "/" + emiratesIdDetails?.fileUrl?.path}
                    Component={Img}
                    imgHeight={300}
                    imgWidth={300}
                  />
                </IconButton>
              )}
            </Box>

            {emiratesSelectedImage && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
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
                      fontWeight: "600",
                      textDecoration: "underline",
                      mt: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    Upload new
                    <input
                      accept=".pdf, .png, .jpeg, .jpg"
                      id="image-upload"
                      type="file"
                      multiple
                      onChange={handleEmiratesImageChange}
                      style={{ display: "none" }}
                    />
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#707070",
                      fontSize: "12px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setEmiratesSelectedImage(null);
                      setEmirateIdStatus(null);
                      setEmiratesID(null);
                      dispatch(clearEmiratesIdData());
                    }}
                  >
                    Remove All
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {emiratesSelectedImage?.map((file, idx) => {
                    return (
                      <Typography
                        key={idx}
                        variant="subtitle2"
                        sx={{
                          color: "#707070",
                          fontSize: "13px",
                          fontWeight: "500",
                          mt: 0.5,
                          textAlign: "left",
                          // cursor: "pointer",
                        }}
                      >
                        {`${idx + 1}. ${file?.name}`}
                      </Typography>
                    );
                  })}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => uploadEmiratesImage(emiratesSelectedImage?.[0], emiratesSelectedImage?.[1])}
                  >
                    Scan
                  </Button>
                </Box>
              </>
            )}
          </Grid>

          <Grid item xs={0} xl={1}></Grid>

          <Grid item xs={12} sm={3.8} xl={3} sx={{ mt: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
              <Typography
                variant="subtitle2"
                // gutterBottom
                sx={{
                  fontWeight: "400",
                  color: "#656A67",
                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                    lg: "14px",
                    xl: "16px",
                  },
                  lineHeight: {
                    xs: "16px",
                    sm: "20px",
                    xl: "22px",
                  },
                }}
              >
                Driving License
              </Typography>
              {drivingStatus == "success" ? (
                <Tooltip title="File uploaded, Data fetched">
                  <VerifiedIcon sx={{ fontSize: "20px", color: "#008000" }} />
                </Tooltip>
              ) : drivingStatus == "error" ? (
                <Tooltip title="File uploaded, Data not fetched">
                  <NewReleasesIcon sx={{ fontSize: "20px", color: "#EE4B2B" }} />
                </Tooltip>
              ) : (
                ""
              )}
            </Box>
            <Box
              onDragEnter={handleDrivingLicenseDrag}
              onDragLeave={handleDrivingLicenseDrag}
              onDragOver={handleDrivingLicenseDrag}
              onDrop={handleDrivingLicenseDrop}
              sx={{
                textAlign: "left",
                borderColor: "#707070",

                backgroundImage: ` ${
                  licenseDragActive
                    ? `url(
                                      "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%237B2281FF' strokeWidth='5' stroke-dasharray='15%2c 15%2c 1' stroke-dashoffset='0' strokeLinecap='square'/%3e%3c/svg%3e"
                                    )`
                    : `url(
                                      "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' strokeWidth='2' stroke-dasharray='12%2c 20' stroke-dashoffset='0' strokeLinecap='square'/%3e%3c/svg%3e"
                                    )`
                }`,
                width: "100%",
                height: "161px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!drivingLicenceDetails?.fileUrl?.path ? (
                <IconButton
                  color="#707070"
                  backgroundColor="none"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  sx={{
                    width: "100%",
                    flexDirection: "column",
                    cursor: "auto",
                    gap: 0,
                    "&:hover": {
                      background: "none",
                    },
                  }}
                >
                  <input
                    accept=".pdf, .png, .jpeg, .jpg"
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleDrivingImageChange}
                    style={{ display: "none" }}
                  />

                  <Box
                    sx={{
                      width: "48px",
                      height: "48px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <UploadDocs sx={{ fontSize: "40px !important" }} />
                  </Box>

                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Drag and Drop Your license
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Or
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#7B2281",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      cursor: "pointer",
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Browse files
                  </Typography>
                </IconButton>
              ) : (
                <IconButton
                  color="#707070"
                  backgroundColor="none"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  sx={{
                    width: "100%",
                    cursor: "auto",
                    flexDirection: "column",
                    gap: 0,
                    "&:hover": {
                      background: "none",
                    },
                    width: "100%",
                    height: "161px",
                  }}
                >
                  <input
                    accept=".pdf, .png, .jpeg, .jpg"
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleDrivingImageChange}
                    style={{ display: "none" }}
                  />
                  {/* <Img
                    src={baseURL + "/" + drivingLicenceDetails?.fileUrl?.path}
                    alt="Preview"
                    width={100}
                    height={100}
                  /> */}
                  <PdfViewer
                    pdfUrl={baseURL + "/" + drivingLicenceDetails?.fileUrl?.path}
                    Component={Img}
                    imgHeight={100}
                    imgWidth={100}
                  />
                </IconButton>
              )}
            </Box>

            {drivingSelectedImage && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
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
                      fontWeight: "600",
                      textDecoration: "underline",
                      mt: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    Upload new
                    <input
                      accept=".pdf, .png, .jpeg, .jpg"
                      id="image-upload"
                      type="file"
                      // multiple
                      onChange={handleDrivingImageChange}
                      style={{ display: "none" }}
                    />
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#707070",
                      fontSize: "12px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setDrivingSelectedImage(null);
                      setDrivingStatus(null);
                      setDrivingLicence(null);
                      dispatch(clearDrivingLicenceData());
                    }}
                  >
                    Remove All
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {drivingSelectedImage?.map((file, idx) => {
                    return (
                      <Typography
                        key={idx}
                        variant="subtitle2"
                        sx={{
                          color: "#707070",
                          fontSize: "13px",
                          fontWeight: "500",
                          mt: 0.5,
                          textAlign: "left",
                          // cursor: "pointer",
                        }}
                      >
                        {`${idx + 1}. ${file?.name}`}
                      </Typography>
                    );
                  })}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => uploadDrivingImage(drivingSelectedImage?.[0], drivingSelectedImage?.[1])}
                  >
                    Scan
                  </Button>
                </Box>
              </>
            )}
          </Grid>

          <Grid item xs={0} xl={1}></Grid>

          <Grid item xs={12} sm={3.8} xl={3} sx={{ mt: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
              <Typography
                variant="subtitle2"
                // gutterBottom
                sx={{
                  fontWeight: "400",
                  color: "#656A67",
                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                    lg: "14px",
                    xl: "16px",
                  },
                  lineHeight: {
                    xs: "16px",
                    sm: "20px",
                    xl: "22px",
                  },
                }}
              >
                Car Registration Card
              </Typography>
              {registrationCardStatus == "success" ? (
                <Tooltip title="File uploaded, Data fetched">
                  <VerifiedIcon sx={{ fontSize: "20px", color: "#008000" }} />
                </Tooltip>
              ) : registrationCardStatus == "error" ? (
                <Tooltip title="File uploaded, Data not fetched">
                  <NewReleasesIcon sx={{ fontSize: "20px", color: "#EE4B2B" }} />
                </Tooltip>
              ) : (
                ""
              )}
            </Box>
            <Box
              sx={{
                textAlign: "left",
                borderColor: "#707070",
                backgroundImage: ` ${
                  registartionCardDragActive
                    ? `url(
                                    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%237B2281FF' strokeWidth='5' stroke-dasharray='15%2c 15%2c 1' stroke-dashoffset='0' strokeLinecap='square'/%3e%3c/svg%3e"
                                  )`
                    : `url(
                                      "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' strokeWidth='2' stroke-dasharray='12%2c 20' stroke-dashoffset='0' strokeLinecap='square'/%3e%3c/svg%3e"
                                    )`
                }`,
                width: "100%",
                height: "161px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!carRegistrationDetails?.fileUrl?.path ? (
                <IconButton
                  color="#707070"
                  backgroundColor="none"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  onDragEnter={handleRegistrationCardDrag}
                  onDragLeave={handleRegistrationCardDrag}
                  onDragOver={handleRegistrationCardDrag}
                  onDrop={handleRegistrationCardDrop}
                  sx={{
                    width: "100%",
                    flexDirection: "column",
                    cursor: "auto",
                    gap: 0,
                    "&:hover": {
                      background: "none",
                    },
                  }}
                >
                  <input
                    accept=".pdf, .png, .jpeg, .jpg"
                    id="image-upload"
                    type="file"
                    //   value={registrationPDFValue}
                    multiple
                    onChange={handleRegistrationCardImageChange}
                    style={{ display: "none" }}
                  />

                  <Box
                    sx={{
                      width: "48px",
                      height: "48px",
                      opacity: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <IconImg src={Upload} alt="Preview" width={60} height={60} /> */}
                    <UploadDocs sx={{ fontSize: "40px !important" }} />
                  </Box>

                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Drag and Drop Your ID
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#707070",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Or
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      color: "#7B2281",
                      fontSize: {
                        xs: "11px",
                        sm: "12px",
                        lg: "13px",
                      },
                      cursor: "pointer",
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    Browse files
                  </Typography>
                </IconButton>
              ) : (
                <IconButton
                  color="#707070"
                  backgroundColor="none"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  onDragEnter={handleRegistrationCardDrag}
                  onDragLeave={handleRegistrationCardDrag}
                  onDragOver={handleRegistrationCardDrag}
                  onDrop={handleRegistrationCardDrop}
                  sx={{
                    width: "100%",
                    cursor: "auto",
                    flexDirection: "column",
                    gap: 0,
                    "&:hover": {
                      background: "none",
                    },
                    width: "100%",
                    height: "161px",
                  }}
                >
                  <input
                    accept=".pdf, .png, .jpeg, .jpg"
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleRegistrationCardImageChange}
                    style={{ display: "none" }}
                  />
                  {/* <Img
                    src={baseURL + "/" + carRegistrationDetails?.fileUrl?.path}
                    alt="Preview"
                    width={100}
                    height={100}
                  /> */}
                  <PdfViewer
                    pdfUrl={baseURL + "/" + carRegistrationDetails?.fileUrl?.path}
                    Component={Img}
                    imgHeight={100}
                    imgWidth={100}
                  />
                </IconButton>
              )}
            </Box>

            {registrationCardSelectedImage && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
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
                      fontWeight: "600",
                      textDecoration: "underline",
                      mt: 0.5,
                      cursor: "pointer",
                    }}
                  >
                    Upload new
                    <input
                      accept=".pdf, .png, .jpeg, .jpg"
                      id="image-upload"
                      type="file"
                      // multiple
                      onChange={handleRegistrationCardImageChange}
                      style={{ display: "none" }}
                    />
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#707070",
                      fontSize: "12px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setRegistrationCardSelectedImage(null);
                      setRegistrationCardStatus(null);
                      setRegistrationCarCard(null);
                      dispatch(clearRegistrationData());
                    }}
                  >
                    Remove All
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {registrationCardSelectedImage?.map((file, idx) => {
                    return (
                      <Typography
                        key={idx}
                        variant="subtitle2"
                        sx={{
                          color: "#707070",
                          fontSize: "13px",
                          fontWeight: "500",
                          mt: 0.5,
                          textAlign: "left",
                          // cursor: "pointer",
                        }}
                      >
                        {`${idx + 1}. ${file?.name}`}
                      </Typography>
                    );
                  })}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      uploadRegistrationCartdImage(
                        registrationCardSelectedImage?.[0],
                        registrationCardSelectedImage?.[1]
                      )
                    }
                  >
                    Scan
                  </Button>
                </Box>
              </>
            )}
          </Grid>
          <Grid item xs={0} xl={0.5}></Grid>
        </Grid>
        {emiratesSelectedImage && drivingSelectedImage && registrationCardSelectedImage && (
          <Box sx={{ display: "flex", justifyContent: "end", p: 1, mr: 2 }}>
            <Button variant="contained" size="small" onClick={() => ScanAllAtOnceHandler()}>
              Scan all cards at once
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default DocsUploadOnCreate;
