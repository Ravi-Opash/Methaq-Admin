import React, { useState, useRef, useCallback, useEffect } from "react";
import { Backdrop, Box, Button, CircularProgress, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { FileDropzone } from "src/components/file-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addFrontBackCover } from "src/sections/black-list/action/blackListAction";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { toast } from "react-toastify";
import { bytesToSize } from "src/utils/bytes-to-size";
import AnimationLoader from "src/components/amimated-loader";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const UploadFiles = () => {
  const dispatch = useDispatch();
  const [newUploadFile, setnewUploadFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [uploadFileInfo, setUploadFileInfo] = useState("");

  // console.log("companyDetail", companyDetail);

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      file: "",
    },

    // Validation
    validationSchema: Yup.object({
      file: Yup.mixed().required("Please select file"),
    }),

    // Submit
    onSubmit: (values, helpers) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("fileToBeCovered", values?.file);

      dispatch(addFrontBackCover(formData))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          setTimeout(() => {
            setIsLoading(false);
            downloadPdf(`${baseURL}/${res?.data}`);
          }, 4000);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err, "er");
          toast.error(err);
        });
    },
  });

  // Dropzone for cover
  const handleDropCover = async ([file]) => {
    if (file?.type != "application/pdf") {
      toast.error("Please Upload Pdf File Only");
      return;
    }
    formik.setFieldValue("file", file);
    setnewUploadFile(file);

    setUploadFileInfo({
      filename: file?.name,
      size: file?.size,
    });
  };

  // Download pdf
  const downloadPdf = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      {isLoading && (
        <>
          {/* <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={isLoading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop> */}
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
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Upload Document</Typography>
              </Stack>
            </Stack>
            <form onSubmit={formik.handleSubmit}>
              <Box mt={5}>
                <Typography
                  color="textSecondary"
                  sx={{
                    mb: 1,
                    mt: 3,
                  }}
                  variant="subtitle2"
                >
                  Upload file :
                </Typography>

                <FileDropzone
                  accept={{
                    "application/pdf": [],
                  }}
                  maxFiles={1}
                  onDrop={handleDropCover}
                />
                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {Boolean(formik.touched.file && formik.errors.file)}
                </Typography>
                <Typography
                  sx={{
                    color: "#F04438",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                  mt={1}
                >
                  {formik.touched.file && formik.errors.file}
                </Typography>
              </Box>
              {uploadFileInfo && (
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{`Uploaded Document:- ${uploadFileInfo?.filename} (${bytesToSize(
                    uploadFileInfo?.size
                  )})`}</Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                  mx: -1,
                  mb: -1,
                  mt: 3,
                }}
              >
                <Button sx={{ m: 1 }} type="submit" variant="contained">
                  Set Covers
                </Button>
              </Box>
            </form>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

UploadFiles.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UploadFiles;
