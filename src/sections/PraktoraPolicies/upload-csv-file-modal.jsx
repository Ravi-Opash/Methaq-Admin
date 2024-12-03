import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EastIcon from "@mui/icons-material/East";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { CrossSvg } from "src/Icons/CrossSvg";
import { FileDropzone } from "src/components/file-dropzone";
import { bytesToSize } from "src/utils/bytes-to-size";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { getAllPraktoraPoliciesList, praktoraUploadPolicyIssue } from "./action/praktoraPoliciesAction";
import { toast } from "react-toastify";

const UploadPraktoraPoliciesModal = ({ handleClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [praktoraUploadFile, setPraktoraUploadFile] = useState(null);
  const [uploadOraktoraListFile, setUploadPraktoraListFile] = useState();

  const handlePraktoraPoliciesUpload = async ([file]) => {
    formik.setFieldValue("OfflineSheet", file);
    setPraktoraUploadFile(file);
    setUploadPraktoraListFile({
      filename: file?.name,
      size: file?.size,
    });
  };

  const formik = useFormik({
    initialValues: {
      //   email: info?.email || "",
    },
    validationSchema: Yup.object({
      OfflineSheet: Yup.mixed().required("Required"),
    }),
    onSubmit: async (values, helpers) => {
      setIsLoading(true);
      console.log("values", values);
      let payload = {
        OfflineSheet: values?.OfflineSheet,
      };

      const formDatas = jsonToFormData(payload);
      dispatch(praktoraUploadPolicyIssue({ data: formDatas }))
        .unwrap()
        .then((res) => {
          setIsLoading(false);
          if (res?.success) {
            dispatch(getAllPraktoraPoliciesList({})).then(() => {
              setIsLoading(false);
              toast.success("Successfully uploaded!");
              handleClose();
            });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(err);
        });
    },
  });

  return (
    <>
      {isLoading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            cursor: "pointer",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
            <Typography variant="h6">Upload Praktora Policies</Typography>
            <Box onClick={() => handleClose()}>
              <CrossSvg />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", flexFlow: "column", width: "100%" }}>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Box>
                  <form onSubmit={formik.handleSubmit}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        width: "100%",
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <FileDropzone
                          accept={{
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
                            "application/vnd.ms-excel": [],
                          }}
                          maxFiles={1}
                          onDrop={handlePraktoraPoliciesUpload}
                          name="OfflineSheet"
                        />
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        color: "#F04438",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      {Boolean(formik.errors.OfflineSheet)}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#F04438",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        pl: 2,
                      }}
                      mt={1}
                    >
                      {formik.errors.OfflineSheet}
                    </Typography>
                    {uploadOraktoraListFile && uploadOraktoraListFile?.filename && (
                      <ListItem
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,

                          "& + &": {
                            mt: 1,
                          },
                        }}
                      >
                        <ListItemText
                          primary={uploadOraktoraListFile?.filename ? uploadOraktoraListFile?.filename : ""}
                          primaryTypographyProps={{
                            color: "textPrimary",
                            variant: "subtitle2",
                          }}
                          secondary={uploadOraktoraListFile?.size ? bytesToSize(uploadOraktoraListFile?.size) : ""}
                        />
                      </ListItem>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        textAlign: "center",
                        gap: 1,
                        mt: 2,
                        pl: 1,
                        //   width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          color: "#fff",
                          cursor: "pointer",
                          gap: 1,
                        }}
                      >
                        Upload CSV <EastIcon />
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default UploadPraktoraPoliciesModal;
