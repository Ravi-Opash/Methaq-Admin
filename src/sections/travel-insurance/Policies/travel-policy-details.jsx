import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import ListItemComp from "src/components/ListItemComp";
import { format, parseISO, isValid } from "date-fns";
import ModalComp from "src/components/modalComp";
import { DocumentSvg } from "src/Icons/DocumentSvg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import * as Yup from "yup";
import { moduleAccess } from "src/utils/module-access";
import { EditIcon } from "src/Icons/EditIcon";
import CustomerHistoryTable from "src/sections/customer/CustomerHistory/customer-history-table";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import TravelPolicyUploadModal from "./travel-policy-upload-modal";
import TravelPolicyFinanceTable from "./travel-policy-finance-table";
import AddCommentModal from "src/sections/customer/CustomerComments/add-comment-modal";
import TravelPolicyCommentsTable from "./travel-policy-comment-table";
import TravelPolicyTransactionTable from "./travel-policy-transaction-table";
import { getTravelPolicyDetailById, updatetravelPolicyFinanceDetails } from "./action/travelPoliciesAction";

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

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const TravelPolicyDetail = ({ policyData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { policyId } = router?.query;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const {
    travelPolicyCommentList,
    travelPolicyCommentLoader,
    travelPolicyTransactionList,
    travelPolicyTransactionLoader,
  } = useSelector((state) => state.travelPolicies);

  const [openEditPolicyNo, setOpenEditPolicyNo] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const handleEditPolicyNoClose = () => setOpenEditPolicyNo(false);
  const [newValue, setNewValue] = useState(policyData?.companyPolicyNumber || "-");

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required("Please select a file"),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      file: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {},
  });

  // Function to handle file upload
  const onSubmitChange = (value) => {
    const payload = {
      data: {
        companyPolicyNumber: value,
      },
      id: policyId,
    };
    dispatch(updatetravelPolicyFinanceDetails(payload))
      .unwrap()
      .then((res) => {
        dispatch(getTravelPolicyDetailById(policyId));
        toast.success("SuccessFully Updated");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setIsEditable(false);
  };
  return (
    <Box sx={{ display: "flex", flexFlow: "column" }}>
      {/* {"personal detail"} */}
      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          mt: 3,
          borderBottom: "1px solid #E6E6E6",
        }}
      >
        <Grid container columnSpacing={4}>
          <Grid item xs={12} sm={12}>
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
                mb: 0,
              }}
            >
              Destination Details
            </Typography>

            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Insurance Type"} value={policyData?.quote?.insuranceType} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Departure Country"} value={policyData?.travelId?.country} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Destination"} value={policyData?.travelId?.destination} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Start Date"}
                    value={
                      isValid(parseISO(policyData?.travelId?.inceptionDate))
                        ? format(parseISO(policyData?.travelId?.inceptionDate), "dd-MM-yyy")
                        : "Start date"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Period"} value={policyData?.travelId?.period} />
                </Grid>
              </Grid>

              <Divider />
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
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 1,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                mb: 1,
                fontWeight: "600",
                fontSize: "18px",
                display: "inline-block",
                color: "#60176F",
                px: "14px",
                mt: 2,
              }}
            >
              Personal Details
            </Typography>
          </Box>
        </Box>

        <Grid container columnSpacing={3}>
          <Grid item xs={12} sm={12}>
            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Full Name"}
                    value={`${policyData?.travellersId?.[0]?.firstName} ${policyData?.travellersId?.[0]?.lastName}`}
                  />
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Email"} value={policyData?.travellersId?.[0]?.contact?.email || "-"} />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Mobile Number"} value={policyData?.travellersId?.[0]?.contact?.mobileNumber} />
                  <DividerCustom />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Date Of Birth"}
                    value={
                      policyData?.travellersId?.[0]?.dateOfBirth
                        ? format(parseISO(policyData?.travellersId?.[0]?.dateOfBirth), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Gender"} value={policyData?.travellersId?.[0]?.gender || "-"} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Passport Number"}
                    value={policyData?.travellersId?.[0]?.passportNumber || "-"}
                  />
                </Grid>
              </Grid>
              <Divider />
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Age"} value={policyData?.travellersId?.[0]?.age || "-"} />
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
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 1,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                mb: 1,
                fontWeight: "600",
                fontSize: "18px",
                display: "inline-block",
                color: "#60176F",
                px: "14px",
                mt: 2,
              }}
            >
              Current policy
            </Typography>
          </Box>
        </Box>

        <Grid container columnSpacing={3}>
          <Grid item xs={12} sm={9}>
            <List>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy issue"}
                    value={
                      policyData?.policyEffectiveDate
                        ? format(parseISO(policyData?.policyEffectiveDate), "dd-MM-yyyy")
                        : "-"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Policy expiry"}
                    value={
                      policyData?.policyExpiryDate ? format(parseISO(policyData?.policyExpiryDate), "dd-MM-yyyy") : "-"
                    }
                  />
                  <DividerCustom />
                </Grid>
              </Grid>

              <Divider />
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp
                    label={"Ref No"}
                    value={policyData?.policyNumber || policyData?.response?.PolicyNumber}
                  />
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
                              fontSize: "15px",
                              display: "inline-block",
                            }}
                          >
                            Insurance Company Policy Number
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
                              {policyData?.companyPolicyNumber || "-"}
                            </Typography>
                          ) : (
                            <TextField
                              sx={{ width: "140px" }}
                              label="Policy No"
                              name="premium"
                              defaultValue={policyData?.companyPolicyNumber || ""}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setNewValue(newValue);
                              }}
                            />
                          )}
                          <>
                            {!isEditable ? (
                              <EditIcon
                                onClick={() => setIsEditable(true)}
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
                                onClick={() => onSubmitChange(newValue)}
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
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </Grid>
              </Grid>

              <Divider />

              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={6}>
                  <ListItemComp label={"Source"} value={policyData?.quote?.source || "-"} />
                </Grid>
              </Grid>

              <Divider />
            </List>
          </Grid>

          <Grid item xs={12} sm={3}>
            <BoxCustom
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: "#707070",
                    cursor: "pointer",
                    flexFlow: "column",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    if (!moduleAccess(user, "travelQuote.update")) {
                      toast.error("You don't have permission to Update!");
                      return;
                    }
                    setOpenEditPolicyNo(true);
                  }}
                >
                  <Tooltip title="Click to udpate policy pdf" arrow>
                    <DocumentSvg sx={{ fontSize: "70px" }} />
                  </Tooltip>
                  {moduleAccess(user, "travelQuote.update") && (
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
                      Upload
                    </Typography>
                  )}
                </Box>

                {policyData?.policyFile && (
                  <a
                    href={baseURL + "/" + policyData?.policyFile?.path}
                    download={policyData?.policyFile?.filename}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "inline-block",
                      fontSize: "1rem",
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
                      View
                    </Typography>
                  </a>
                )}
              </Box>

              {formik.touched.file && formik.errors.file && <div>{formik.errors.file}</div>}
            </BoxCustom>
          </Grid>
        </Grid>
      </Box>

      {policyData?.travellersId?.length > 1 && (
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
              Other Travelers Details
            </Typography>
            {/* <EditIcon onClick={() => setEditPersonalDeatils(true)} sx={{ fontSize: 30, cursor: "pointer" }} /> */}
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Relation</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Passport Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policyData?.travellersId?.slice(1, policyData?.travellersId?.length)?.map((item, idx) => {
                return (
                  <TableRow
                    hover
                    // sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{item?.firstName + " " + item?.lastName}</TableCell>
                    <TableCell>
                      {isValid(parseISO(item?.dateOfBirth))
                        ? format(parseISO(item?.dateOfBirth), "dd-MM-yyy")
                        : "Start date"}
                    </TableCell>
                    <TableCell>{item?.age}</TableCell>
                    <TableCell>{item?.relation || "-"}</TableCell>
                    <TableCell>{item?.gender || "-"}</TableCell>
                    <TableCell>{item?.passportNumber || "-"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
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
            Comments
          </Typography>

          <Box sx={{ display: "inline-block", mr: 2 }}>
            {moduleAccess(user, "travelQuote.update") && (
              <Button type="button" variant="contained" onClick={() => setOpen(true)}>
                Add a Comment
              </Button>
            )}
          </Box>
        </Box>

        {travelPolicyCommentLoader ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
            {travelPolicyCommentList && <TravelPolicyCommentsTable items={travelPolicyCommentList} />}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "inline-block",
          width: "100%",
          borderBottom: "1px solid #E6E6E6",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mt: 3,
            backgroundColor: "#f5f5f5",
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
            }}
          >
            Transactions
          </Typography>
        </Box>

        <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
          {travelPolicyTransactionLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
              {travelPolicyTransactionList && (
                <TravelPolicyTransactionTable items={travelPolicyTransactionList} policyData={policyData} />
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "inline-block", width: "100%", my: 2 }}>
        <Grid container columnSpacing={4}>
          <Grid item xs={12} sm={12}>
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
                mb: 0,
              }}
            >
              Policy history
            </Typography>
            {policyData && <CustomerHistoryTable items={policyData} />}
          </Grid>
        </Grid>
      </Box>

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
            Finance
          </Typography>
        </Box>

        <Box sx={{ display: "inline-block", width: "100%", mb: 2 }}>
          {policyData && <TravelPolicyFinanceTable travelPolicyDeatils={policyData} />}
        </Box>
      </Box>
      {/*  edit policy number modal add  */}
      <ModalComp open={open} handleClose={handleClose} width="44rem">
        <AddCommentModal handleClose={handleClose} id={policyId} flag={"travel-policy"} />
      </ModalComp>

      {/*  upload policy number modal add  */}
      <ModalComp open={openEditPolicyNo} handleClose={handleEditPolicyNoClose} width="44rem">
        <TravelPolicyUploadModal
          handleEditPolicyNoClose={handleEditPolicyNoClose}
          customerPolicyDetails={policyData}
          keyName={`travel-Policy`}
        />
      </ModalComp>
    </Box>
  );
};

export default TravelPolicyDetail;
