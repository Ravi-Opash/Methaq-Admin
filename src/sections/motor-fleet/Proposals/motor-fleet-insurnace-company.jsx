import {
  Autocomplete,
  Backdrop,
  Button,
  Card,
  Checkbox,
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
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import NextLink from "next/link";
import React, { useState } from "react";
import { FileDropzone } from "src/components/file-dropzone";
import { Scrollbar } from "src/components/scrollbar";
import { bytesToSize } from "src/utils/bytes-to-size";
import SearchIcon from "@mui/icons-material/Search";
import ModalComp from "src/components/modalComp";
import MotorFleetAddMotorDetails from "./MotorFleetAddMotorDetails";
import { PencilAlt } from "src/Icons/PencilAlt";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { ArrowRight } from "src/Icons/ArrowRight";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  addInsuranceCompanyToMotorFleet,
  editMotorFleetQuotationPremium,
  getInsuranceCompanyList,
} from "./Action/motorFleetProposalsAction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { EditIcon } from "src/Icons/EditIcon";
import { formatNumber } from "src/utils/formatNumber";
import { SeverityPill } from "src/components/severity-pill";

const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: 13,
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: 14,
  },
}));
export default function MotorFleetInsuranceCompaniesDetails({
  checkSelect,
  onPlanSelectHandler,
  handleCheckboxChange,
  fleetDetail,
  companyArray,
  setCompanyArray,
  options,
  setValue,
  value,
  disableCompanyAdd,
  companyData,
  onCompareQuoteHandler,
}) {
  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);
  const [editable, setEditable] = useState("");
  const [newValue, setNewValue] = useState("");
  const [currentId, setCurrentId] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleCompanyAdd = () => {
    // setLoading(true);
    const match2 = companyArray?.find((o) => o?.company?.companyName == value);
    if (!!match2) {
      toast.error("company already added");
      return;
    }

    const match = companyData?.find((i) => i?.companyName == value);

    dispatch(addInsuranceCompanyToMotorFleet({ fleetdDetailsId: fleetDetail?._id, companyId: match?._id }))
      .unwrap()
      .then((res) => {
        dispatch(getInsuranceCompanyList(fleetDetail?._id))
          .unwrap()
          .then((res) => {
            // console.log(res, "res");
            setCompanyArray(res?.data);
          })
          .catch((err) => {
            toast.error(err);
          });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast?.error(err);
      });

    setValue("");
  };

  const onEditPremiumHandler = (id) => {
    setEditable(id);
  };

  const onSubmitChange = (value, quote_Id) => {
    dispatch(editMotorFleetQuotationPremium({ price: value, quoteId: quote_Id }))
      .unwrap()
      .then((res) => {
        dispatch(getInsuranceCompanyList(fleetDetail?._id)).then((res) => {
          setCompanyArray(res?.data);
        });
        toast.success("SuccessFully Updated");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setEditable("");
  };

  return (
    <>
      {loading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      <Card>
        <Grid container columnSpacing={4}>
          <Grid item xs={12} sm={12}>
            <Box
              sx={{
                display: "inline-block",
                width: "100%",
                borderRadius: "10px",
                background: "white",
                boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
              }}
            >
              <Scrollbar>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "space-between" }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      py: 1.5,
                      fontWeight: "600",
                      fontSize: "16px",
                      display: "inline-block",
                      color: "#60176F",
                      px: "14px",
                    }}
                  >
                    Select Insurance Company
                  </Typography>
                  <Box sx={{ display: "inline-block" }}>
                    <Button
                      sx={{
                        textDecoration: "underline",
                        textDecorationColor: "#60176F !important",
                      }}
                      onClick={() => onCompareQuoteHandler()}
                    >
                      Generate a comparison
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
                              <TableCells>Select</TableCells>
                              <TableCells>Company name</TableCells>
                              <TableCells>Is Paid</TableCells>
                              <TableCells>Is Policy Issued</TableCells>
                              <TableCells>Premium</TableCells>
                              <TableCells align="right">Actions</TableCells>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <>
                              {companyArray?.map((ele, idx) => {
                                // console.log(ele, "ele");
                                let isEditable;
                                if (editable === ele?._id) {
                                  isEditable = true;
                                } else {
                                  isEditable = false;
                                }
                                const match = checkSelect?.find((item) => item?._id === ele?._id);
                                return (
                                  <TableRow
                                    sx={{
                                      backgroundColor: ele?.isPaid ? "#e5f7e5" : "",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <TableCells>
                                      <Checkbox
                                        size="small"
                                        checked={!!match}
                                        onChange={(e) => {
                                          handleCheckboxChange(ele);
                                          onPlanSelectHandler(e.target.value, ele?._id);
                                        }}
                                      />
                                    </TableCells>
                                    <TableCells>{ele?.company?.companyName}</TableCells>
                                    <TableCell>
                                      <SeverityPill sx={{ fontSize: "10px" }} color={ele?.isPaid ? "success" : "error"}>
                                        {ele?.isPaid ? "Yes" : "No"}
                                      </SeverityPill>
                                    </TableCell>
                                    <TableCell>
                                      <SeverityPill
                                        sx={{ fontSize: "10px" }}
                                        color={ele?.policyIssued === true ? "success" : "error"}
                                      >
                                        {ele?.policyIssued === true ? "Yes" : "No"}
                                      </SeverityPill>
                                    </TableCell>
                                    <TableCell>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Box>
                                          {!isEditable ? (
                                            <Typography sx={{ fontSize: "14px", fontFamily: "Inter" }}>
                                              {ele?.price ? `AED ${formatNumber(ele?.price)}` : "-"}
                                            </Typography>
                                          ) : (
                                            <TextField
                                              sx={{ width: "140px" }}
                                              label="Edit Premium"
                                              name="premium"
                                              type="number"
                                              defaultValue={ele?.price}
                                              onChange={(e) => {
                                                setNewValue(e.target.value);
                                              }}
                                            />
                                          )}
                                        </Box>

                                        {!isEditable ? (
                                          <EditIcon
                                            onClick={() => {
                                              onEditPremiumHandler(ele?._id);
                                              setCurrentId(ele?._id);
                                              setNewValue(ele?.price);
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
                                        ) : (
                                          <CheckCircleIcon
                                            onClick={() => {
                                              onSubmitChange(newValue, currentId);
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
                                      </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                      <NextLink href={`/motor-fleet/quotations/${ele?._id}`} passHref>
                                        <IconButton component="a">
                                          <ArrowRight fontSize="small" />
                                        </IconButton>
                                      </NextLink>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </>
                          </TableBody>
                        </Table>
                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 4,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Autocomplete
                              id="combo-box-demo"
                              ListboxProps={{ style: { maxHeight: 350, zIndex: 9999 } }}
                              options={options}
                              value={value}
                              size="small"
                              sx={{
                                width: { xs: 350, sm: 350 },
                                "& .MuiAutocomplete-popupIndicator": { transform: "none" },
                                // mr: { xs: 0, sm: 5 },
                              }}
                              popupIcon={<SearchIcon />}
                              onChange={(e, newValue) => {
                                setValue(newValue);
                              }}
                              renderInput={(params) => (
                                <TextField size="small" {...params} label="Select Insurance Company" />
                              )}
                            />
                            <Button
                              type="button"
                              variant="contained"
                              disabled={!!disableCompanyAdd || !value}
                              sx={{ fontSize: 12 }}
                              onClick={() => {
                                handleCompanyAdd();
                              }}
                            >
                              Add
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Scrollbar>
            </Box>
          </Grid>
        </Grid>
      </Card>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: "95%", md: 800 }}>
        <MotorFleetAddMotorDetails handleClose={handleCloseVerifymodal} fleetDetail={fleetDetail} />
      </ModalComp>
    </>
  );
}
