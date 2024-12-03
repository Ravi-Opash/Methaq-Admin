import { Alert, Box, Card, Divider, Grid, IconButton, Typography, styled } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileDropzone } from "src/components/file-dropzone";

const Img = styled(Image)(({ theme }) => ({
  width: "auto !important",
  maxHight: "200px !important",
  objectFit: "contain",
  height: "150px !important",
}));

function CarImagesForm({ formik }) {
  const [files, setFiles] = useState([]);
  const [filesPreview, setFilesPreview] = useState([]);
  // const [isValid, setIsValid] = useState(false);

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
      formik.setFieldValue("expiredCarPhotos", filesArray);
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
      formik.setFieldValue("expiredCarPhotos", filesArray);
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
    formik.setFieldValue("expiredCarPhotos", array);
    setFilesPreview(arrayOfImages);
  };

  return (
    <Box key="car-images">
      <Alert severity="error">
        Current insurance is expired before policy start date, Please Upload at least 3 Images of car to proceed
        further.{" "}
      </Alert>
      <Grid container p={3} spacing={2}>
        <Grid item xs={12} sm={6} md={4} xl={3}>
          <FileDropzone
            accept={{
              "image/*": [],
            }}
            onDrop={handleFileChange}
          />
        </Grid>

        {filesPreview?.length > 0 && (
          <Grid item xs={12} sm={6} md={8} xl={9}>
            <Typography variant="subtitle1" sx={{ fontSize: 14 }}>
              {" "}
              Selected Images{" "}
            </Typography>

            <Grid container mt={1} spacing={1}>
              {[...filesPreview]?.map((item, idx) => {
                return (
                  <Grid item xs={6} sm={6} md={4} lg={4} xl={3}>
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
      </Grid>
      {formik?.errors?.expiredCarPhotos && (
        <Typography variant="subtitle1" sx={{ fontSize: 14, color: "red", mx: 1 }}>
          {`${formik?.errors?.expiredCarPhotos}`}
        </Typography>
      )}
    </Box>
  );
}

export default CarImagesForm;
