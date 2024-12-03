import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileDropzone } from "src/components/file-dropzone";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deletecarImages, uploadCarImages } from "./Action/proposalsAction";
import { setProposalDetail } from "./Reducer/proposalsSlice";
import ClearIcon from "@mui/icons-material/Clear";
import { editCustomerQuotationDetails } from "../customer/reducer/customerSlice";
import AnimationLoader from "src/components/amimated-loader";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const CarImg = styled(Image)(({ theme }) => ({
  width: "auto !important",
  maxWidth: "180px !important",
  objectFit: "cover",
  height: "140px !important",
}));

const Img = styled(Image)(({ theme }) => ({
  width: "auto !important",
  maxHight: "200px !important",
  objectFit: "contain",
  height: "150px !important",
}));

function CarImagesUpload({ handleClose, carDetail, keyItem, stateDetail, label }) {
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [filesPreview, setFilesPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleFileChange = async (event) => {
    if (event?.target) {
      let filesArray = [...files, ...event?.target?.files];
      setFiles(filesArray);
      let array = [];
      if ([...filesArray]?.length > 0) {
        [...filesArray]?.map((i) => {
          array?.push(URL.createObjectURL(i));
        });
      }
      setFilesPreview(array);
    } else {
      let filesArray = [...files, ...event];
      setFiles(filesArray);
      let array = [];
      if ([...filesArray]?.length > 0) {
        [...filesArray]?.map((i) => {
          array?.push(URL.createObjectURL(i));
        });
      }
      setFilesPreview(array);
    }
  };

  const RemoveImageHandler = (index) => {
    let array = [...files];
    let arrayOfImages = [...filesPreview];

    if (index > -1) {
      // only splice array when item is found
      array.splice(index, 1); // 2nd parameter means remove one item only
      arrayOfImages.splice(index, 1); // 2nd parameter means remove one item only
    }

    setFiles(array);
    setFilesPreview(arrayOfImages);
  };

  const handleFileSubmit = () => {
    const formData = new FormData();
    if (files?.length > 0) {
      files?.map((i) => {
        formData.append("expiredCarPhotos", i);
      });
    }
    setLoading(true);
    dispatch(uploadCarImages({ id: carDetail?._id, data: formData }))
      .unwrap()
      .then((res) => {
        if (keyItem == "proposal") {
          dispatch(setProposalDetail({ ...stateDetail, car: res?.data }));
        }
        if (keyItem == "quote") {
          dispatch(editCustomerQuotationDetails({ ...stateDetail, carId: res?.data }));
        }
        setLoading(false);
        handleClose();
      })
      .catch((err) => {
        console.log(err, "err");
        toast?.error(err);
        setLoading(false);
      });
  };

  const onDeleteUploadedImage = (value) => {
    setLoading(true);
    dispatch(deletecarImages({ id: carDetail?._id, data: { filePathToDelete: value } }))
      .unwrap()
      .then((res) => {
        if (keyItem == "proposal") {
          dispatch(setProposalDetail({ ...stateDetail, car: res?.data }));
        }
        if (keyItem == "quote") {
          dispatch(editCustomerQuotationDetails({ ...stateDetail, carId: res?.data }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        toast?.error(err);
        setLoading(false);
      });
  };

  const isDisabledHandler = () => {
    let valid = false;
    if (carDetail?.expiredCarPhotos?.length > 0) {
      if ([...carDetail?.expiredCarPhotos, ...files]?.length >= 3) {
        valid = true;
      }
    } else {
      if ([...files]?.length >= 3) {
        valid = true;
      }
    }
    setIsValid(valid);
  };

  useEffect(() => {
    isDisabledHandler();
  }, [carDetail?.expiredCarPhotos?.length, files?.length]);

  return (
    <>
      {loading && (
        <>
          <AnimationLoader open={true} />
        </>
      )}
      <Alert severity="error">{label} </Alert>
      <Grid container p={3} spacing={2}>
        <Grid item xs={12} sm={6} md={5} xl={4}>
          <FileDropzone
            accept={{
              "image/*": [],
            }}
            onDrop={handleFileChange}
          />
        </Grid>
        {carDetail?.expiredCarPhotos?.length > 0 && (
          <Grid item xs={12} sm={6} md={7} xl={8} p={1}>
            <Typography variant="subtitle1"> Already uploaded Images </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
              {carDetail?.expiredCarPhotos?.map((item, idx) => {
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
            </Box>
          </Grid>
        )}
        {filesPreview?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle1"> Selected Images to upload </Typography>
            <Grid container mt={1} spacing={1}>
              {[...filesPreview]?.map((item, idx) => {
                return (
                  <Grid item xs={6} sm={4} md={3} lg={2.38} xl={2}>
                    <Card>
                      <IconButton
                        color="#707070"
                        backgroundColor="none"
                        aria-label="upload picture"
                        component="label"
                        disableRipple
                        sx={{
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
                        <Img src={item} alt="Preview" width={100} height={100} />
                      </IconButton>
                      <Divider />
                      <Box
                        sx={{ px: 1, py: 0.4, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {files?.[idx]?.name}
                        </Typography>
                        <IconButton onClick={() => RemoveImageHandler(idx)}>
                          <DeleteIcon sx={{ color: "#7B2281", fontSize: 16, cursor: "pointer" }} />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        )}
        <Box sx={{ display: "flex", justifyContent: "end", gap: 2, width: "100%", mt: 2 }}>
          <Button type="button" variant="outlined" onClick={() => handleClose()} sx={{ minWidth: "140px" }}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!isValid}
            variant="contained"
            onClick={() => handleFileSubmit()}
            sx={{ minWidth: "140px" }}
          >
            Submit
          </Button>
        </Box>
      </Grid>
    </>
  );
}

export default CarImagesUpload;
