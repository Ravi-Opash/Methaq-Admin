import {
  Autocomplete,
  Backdrop,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import NextLink from "next/link";
import React, { useCallback, useState } from "react";
import { FileDropzone } from "src/components/file-dropzone";
import { Scrollbar } from "src/components/scrollbar";
import { bytesToSize } from "src/utils/bytes-to-size";
import SearchIcon from "@mui/icons-material/Search";
import ModalComp from "src/components/modalComp";
import MotorFleetAddMotorDetails from "./MotorFleetAddMotorDetails";
import { PencilAlt } from "src/Icons/PencilAlt";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { ArrowRight } from "src/Icons/ArrowRight";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { useDispatch, useSelector } from "react-redux";
import { deleteFleetMotorById, fetchCarFromExcel, getAllMotorFleetList } from "./Action/motorFleetProposalsAction";
import { useRouter } from "next/router";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";

const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: 13,
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: 14,
  },
}));
export default function MotorFleetCarDetails(props) {
  const { count = 0, fleetDetail, onPageChange = () => {}, onRowsPerPageChange, page = 0, rowsPerPage = 0 } = props;
  const [verifyModal, setVerifyModal] = useState(false);
  const { motorFetchExellList } = useSelector((state) => state.motorFleetProposals);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [carListUploadFile, setCarListUploadFile] = useState(null);
  const [uploadCarListFile, setCarListFile] = useState();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const handleConfirmClose = () => setConfirmAdd(false);
  const handleCarListUpload = async ([file]) => {
    setIsLoading(true);
    setCarListUploadFile(file);
    setCarListFile({
      filename: file?.name,
      size: file?.size,
    });
    const formData = jsonToFormData({ fleetCar: file });
    for (var pair of formData.entries()) {
    }
    dispatch(fetchCarFromExcel({ id: fleetDetail?._id, data: formData }))
      .then((res) => {
        // console.log(res, "res");
        toast.success("Successfully uploaded");
        setIsLoading(false);
        dispatch(getAllMotorFleetList({ id: fleetDetail?._id }));
      })
      .catch((err) => {
        toast.error(err);
        console.log(err, "err");
        setIsLoading(false);
      });
  };

  const deleteModalByIdHandler = useCallback((id) => {
    setOpen(true);
    setDeleteId(id);
  }, []);

  const deleteByIdHandler = (id) => {
    dispatch(deleteFleetMotorById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          setOpen(false);

          toast.success("Successfully Deleted", {
            type: "success",
          });

          dispatch(getAllMotorFleetList({ id: fleetDetail?._id }));
        }
      })
      .catch((err) => {
        if (err) {
          toast(err, {
            type: "error",
          });
        }
      });
  };

  return (
    <>
      {isLoading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={isLoading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
          my: 3,
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
          Car Details
        </Typography>

        <Grid container columnSpacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={5.8}>
            <Box sx={{ display: "inline-block", width: "100%", pb: 2 }}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12} md={12}>
                  <Grid container rowSpacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
                    <Grid item xs={12} md={3}>
                      <Box
                        sx={{
                          display: "inline-block",
                          width: "100%",
                          ml: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: "600",
                            fontSize: "14px",
                            display: "inline-block",
                            color: "#707070",
                          }}
                        >
                          Car List File
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={9}>
                      <Box sx={{ display: "inline-block", width: "100%" }}>
                        <FileDropzone
                          accept={{ "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] }}
                          maxFiles={1}
                          onDrop={handleCarListUpload}
                        />
                      </Box>
                    </Grid>
                    {uploadCarListFile && uploadCarListFile?.filename && (
                      <List>
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
                            primary={uploadCarListFile?.filename ? uploadCarListFile?.filename : ""}
                            primaryTypographyProps={{
                              color: "textPrimary",
                              variant: "subtitle2",
                            }}
                            secondary={uploadCarListFile?.size ? bytesToSize(uploadCarListFile?.size) : ""}
                          />
                        </ListItem>
                      </List>
                    )}
                    {/* <Typography
                                sx={{
                                  color: "#F04438",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                {Boolean(formik.touched.carList && formik.errors.carList)}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#F04438",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                                mt={1}
                              >
                                {formik.touched.carList && formik.errors.carList}
                              </Typography> */}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box
              sx={{
                display: "inline-block",
                width: "100%",
                mb: 3,
                mt: 3,
                borderRadius: "10px",
                background: "white",
                boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
              }}
            >
              <Scrollbar>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      py: 1.5,
                      width: "100%",
                      fontWeight: "600",
                      fontSize: "15px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                    }}
                  >
                    Fetched Cars
                  </Typography>
                  <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{ fontSize: 12 }}
                      onClick={() => {
                        if (!!fleetDetail?.mailSent) {
                          setConfirmAdd(true);
                        } else {
                          setVerifyModal(true);
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
                <Card>
                  <Grid container>
                    <Grid item xs={12} md={12}>
                      <Box sx={{ minWidth: 800 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCells>VIN number</TableCells>
                              <TableCells>Make/Year/Modal</TableCells>
                              <TableCells>PlactCode/Plat Number</TableCells>
                              <TableCells>Created At</TableCells>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <>
                              {motorFetchExellList?.length > 0 ? (
                                motorFetchExellList?.map((ele, index) => {
                                  const createdAt = format(parseISO(ele?.createdAt), "dd/MM/yyyy");

                                  return (
                                    <>
                                      <TableRow
                                        hover
                                        sx={{
                                          backgroundColor: "rgba(255, 242, 217, 0) !important",
                                          "&:hover": {
                                            backgroundColor: "rgba(255, 242, 217, 0.9) !important",
                                          },
                                          cursor: "pointer",
                                        }}
                                      >
                                        <TableCells>{ele?.chesisNo || "-"}</TableCells>
                                        <TableCells>
                                          {ele?.make || "-"} / {ele?.year || "-"} / {ele?.model || "-"}
                                        </TableCells>
                                        <TableCells>
                                          {ele?.plateCode || "-"} / {ele?.plateNumber || "-"}
                                        </TableCells>
                                        <TableCells>{createdAt || "-"}</TableCells>
                                        <TableCells align="right">
                                          <Button onClick={() => deleteModalByIdHandler(ele?._id)}>
                                            <IconButton component="a">
                                              <DeleteSvg fontSize="small" />
                                            </IconButton>
                                          </Button>
                                        </TableCells>
                                      </TableRow>
                                    </>
                                  );
                                })
                              ) : (
                                <Typography sx={{ m: 2, fontSize: "15px", color: "#707070" }}>
                                  No data found..
                                </Typography>
                              )}
                            </>
                          </TableBody>
                        </Table>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Scrollbar>
              <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Grid>
        </Grid>
        <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: "95%", md: 800 }}>
          <MotorFleetAddMotorDetails handleClose={handleCloseVerifymodal} fleetDetail={fleetDetail} />
        </ModalComp>
        <ModalComp open={open} handleClose={handleClose}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete ?
          </Typography>

          <Box
            sx={{
              display: "flex",
            }}
            mt={3}
          >
            <Button
              variant="contained"
              sx={{
                marginRight: "10px",
              }}
              onClick={() => deleteByIdHandler(deleteId)}
            >
              Yes
            </Button>
            <Button variant="outlined" onClick={() => handleClose()}>
              Cancel
            </Button>
          </Box>
        </ModalComp>
        <ModalComp open={confirmAdd} handleClose={handleConfirmClose} widths={{ xs: "95%", sm: 580 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to add new car, As email already sent to Insurance companies ?
          </Typography>

          <Box
            sx={{
              display: "flex",
            }}
            mt={3}
          >
            <Button
              variant="contained"
              sx={{
                marginRight: "10px",
              }}
              onClick={() => {
                setVerifyModal(true);
                handleConfirmClose(true);
              }}
            >
              Yes
            </Button>
            <Button variant="outlined" onClick={() => handleConfirmClose()}>
              Cancel
            </Button>
          </Box>
        </ModalComp>
      </Box>
    </>
  );
}
