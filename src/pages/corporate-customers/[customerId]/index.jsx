import {
  Box,
  Button,
  CardHeader,
  Container,
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
import React, { useEffect, useRef } from "react";
import { DownloadSvg } from "src/Icons/DownloadSvg";
import { useRouter } from "next/router";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { EditIcon } from "src/Icons/EditIcon";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { moduleAccess } from "src/utils/module-access";
import { toast } from "react-toastify";
import { getCorporateCustomerDetailsById } from "src/sections/corporate-customer/action/corporateCustomerAction";
import { Stack } from "@mui/system";
import ListItemComp from "src/components/ListItemComp";
import { format, parseISO } from "date-fns";
import AnimationLoader from "src/components/amimated-loader";
import { Scrollbar } from "src/components/scrollbar";
import { updateCorporateCustomerById } from "src/sections/corporate-customer/action/corporateCustomerAction";
import { insertInArray, jsonToFormData } from "src/utils/convert-to-form-data";

const DividerCustom = styled(Divider)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const CustomerDetails = () => {
  const dispatch = useDispatch();
  const { corporateCustomerDetails, loading } = useSelector((state) => state.corporateCustomer);
  const { loginUserData: user } = useSelector((state) => state.auth);
  const router = useRouter();
  const { customerId } = router.query;

  const initialized = useRef(false);

  const handleStatusChange = async (e, index, field) => {
    const { value } = e.target;

    let payload = corporateCustomerDetails?.data;
    let motorFleet = corporateCustomerDetails?.data?.carFleetInsurance?.carFleet || [];
    let healthGroup = corporateCustomerDetails?.data?.healthInsurance?.health || [];
    let generalInsurance = corporateCustomerDetails?.data?.generalInsurance?.general || [];

    // update status 
    if (field === "motorFleetStatus") {
      motorFleet = insertInArray(motorFleet, index, {
        ...corporateCustomerDetails?.data?.carFleetInsurance?.carFleet?.[index],
        motorFleetStatus: value,
      });
    }
    if (field === "groupHealthStatus") {
      healthGroup = insertInArray(healthGroup, index, {
        ...corporateCustomerDetails?.data?.healthInsurance?.health?.[index],
        groupHealthStatus: value,
      });
    }
    if (field === "generalStatus") {
      generalInsurance = insertInArray(generalInsurance, index, {
        ...corporateCustomerDetails?.data?.generalInsurance?.general?.[index],
        generalStatus: value,
      });
    }

    payload = {
      ...payload,
      carFleetInsurance: { ...corporateCustomerDetails?.data?.carFleetInsurance, carFleet: motorFleet },
      healthInsurance: { ...corporateCustomerDetails?.data?.healthInsurance, health: healthGroup },
      generalInsurance: { ...corporateCustomerDetails?.data?.generalInsurance, general: generalInsurance },
    };
    const formDatas = jsonToFormData(payload);
    try {
      const response = await dispatch(updateCorporateCustomerById({ id: customerId, data: formDatas })).unwrap();
      toast.success("Status updated successfully", { type: "success" });
      dispatch(getCorporateCustomerDetailsById(customerId));
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err?.message || "Error updating status", { type: "error" });
    }
    return;
  };

  const getCustomerDetailsHandler = async () => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getCorporateCustomerDetailsById(customerId));
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
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

  useEffect(() => {
    getCustomerDetailsHandler();
  }, []);

  return (
    <>
      <AnimationLoader opern={loading} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
            <Box
              onClick={() => router.push("/corporate-customers")}
              sx={{
                display: "inline-block",
                alignItems: "center",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">
                <u>Back</u>
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1} mb={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Typography variant="h4">Corporate Customer Details</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "start", md: "center" },
                  alignItems: "cener",
                  gap: 1,
                }}
              >
                {" "}
                {moduleAccess(user, "corporateCustomer.update") && (
                  <Tooltip title="Edit Commercial">
                    <Button
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        alignItems: "center",
                        color: "#FFF",
                        backgroundColor: "#60176F",
                        "&:hover": {
                          backgroundColor: "#60176F",
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => {
                        router?.push(`/corporate-customers/${customerId}/edit`);
                      }}
                    >
                      <EditIcon sx={{ fontSize: "25px" }} />
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Stack>

          <Box sx={{ display: "inline-block", width: "100%" }}>
            <Box sx={{ display: "inline-block", width: "100%" }} id="capture">
              <Box
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
                  Corporate Details
                </Typography>

                <Grid container columnSpacing={8}>
                  <Grid item xs={12} sm={12}>
                    <List sx={{ py: 0 }}>
                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp
                            label={"Proposer's Full Name"}
                            value={corporateCustomerDetails?.data?.fullName}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Emirates ID."} value={corporateCustomerDetails?.data?.emirates} />
                          <DividerCustom />
                        </Grid>
                      </Grid>

                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <ListItemComp label={"Source of business"} value={corporateCustomerDetails?.data?.source} />
                          <DividerCustom />
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
                          <ListItemComp label={"Industry"} value={corporateCustomerDetails?.data?.industry} />
                        </Grid>
                      </Grid>

                      <Divider />

                      <Grid container>
                        <Grid item xs={12} md={6} columnSpacing={4}>
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
                                      // textAlign: "end",
                                    }}
                                  >
                                    Trade License File
                                  </Typography>
                                </Box>
                                <Box sx={{ width: "50%" }}>
                                  {corporateCustomerDetails?.data?.tradeLicense?.path ? (
                                    <Box
                                      onClick={() => {
                                        onDocumentDowmload(corporateCustomerDetails?.data?.tradeLicense?.path);
                                      }}
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                        p: 0.5,
                                        px: 1.5,
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        border: "1px solid #707070",
                                        backgroundColor: "#70707010",
                                        width: "max-content",
                                      }}
                                    >
                                      <DownloadSvg />
                                      <Typography sx={{ fontSize: 14 }}>Download File</Typography>
                                    </Box>
                                  ) : (
                                    "-"
                                  )}
                                </Box>
                              </Box>
                            </ListItemButton>
                          </ListItem>
                        </Grid>
                        <Grid item xs={12} md={6} columnSpacing={4}>
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
                                      // textAlign: "end",
                                    }}
                                  >
                                    BOR File
                                  </Typography>
                                </Box>
                                <Box sx={{ width: "50%" }}>
                                  {corporateCustomerDetails?.data?.businessOfRecord?.path ? (
                                    <Box
                                      onClick={() => {
                                        onDocumentDowmload(corporateCustomerDetails?.data?.businessOfRecord?.path);
                                      }}
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                        p: 0.5,
                                        px: 1.5,
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        border: "1px solid #707070",
                                        backgroundColor: "#70707010",
                                        width: "max-content",
                                      }}
                                    >
                                      <DownloadSvg />
                                      <Typography sx={{ fontSize: 14 }}>Download File</Typography>
                                    </Box>
                                  ) : (
                                    "-"
                                  )}
                                </Box>
                              </Box>
                            </ListItemButton>
                          </ListItem>
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
                  Contact Persons
                </Typography>
                <Scrollbar>
                  <Box sx={{ minWidth: 800 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Mobile Number</TableCell>
                          <TableCell>Position</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {corporateCustomerDetails?.data?.contactPersons?.map((item, index) => {
                          return (
                            <>
                              <TableRow hover key={index}>
                                <TableCell>{item?.personName || "-"}</TableCell>
                                <TableCell>{item?.email || "-"}</TableCell>
                                <TableCell>{item?.mobileNumber || "-"}</TableCell>
                                <TableCell>{item?.position || "-"}</TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                </Scrollbar>
              </Box>
              <Box
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
                  Line of Business
                </Typography>

                <Grid container columnSpacing={8}>
                  {corporateCustomerDetails?.data?.carFleetInsurance?.carFleet &&
                    corporateCustomerDetails?.data?.carFleetInsurance?.carFleet?.length > 0 && (
                      <Grid item xs={12} sm={12}>
                        <CardHeader title="Motor Fleet" sx={{ p: 2 }} />
                        <Scrollbar>
                          <Box sx={{ minWidth: 800 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Current Insurer</TableCell>
                                  <TableCell>Current Insurer Years</TableCell>
                                  <TableCell>Existing Broker</TableCell>
                                  <TableCell>Existing Broker Years</TableCell>
                                  <TableCell>No Of Cars</TableCell>
                                  <TableCell>Renewal Date</TableCell>
                                  <TableCell>Probability</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {corporateCustomerDetails?.data.carFleetInsurance?.carFleet?.map((item, index) => {
                                  return (
                                    <>
                                      <TableRow hover key={index}>
                                        <TableCell>{item?.currentInsurer}</TableCell>
                                        <TableCell>{item?.currentInsurernoOfYears}</TableCell>
                                        <TableCell>{item?.existingBroker}</TableCell>
                                        <TableCell>{item?.existingBrokernoOfYears}</TableCell>
                                        <TableCell>{item?.noOfCars || "-"}</TableCell>
                                        <TableCell>
                                          {item?.renewalDate ? format(parseISO(item?.renewalDate), "dd/MM/yyyy") : "-"}
                                        </TableCell>
                                        <TableCell>{`${item?.probability} Star`}</TableCell>
                                        <TableCell>
                                          <TextField
                                            size={"small"}
                                            select
                                            SelectProps={{ native: true }}
                                            name={`motorFleetStatus-${index}`}
                                            value={item?.motorFleetStatus || ""}
                                            onChange={(e) => handleStatusChange(e, index, "motorFleetStatus")}
                                            fullWidth
                                          >
                                            <option value="">Select Status</option>
                                            <option value="Lost">Lost</option>
                                            <option value="Quoting">Quoting</option>
                                            <option value="Converted">Converted</option>
                                          </TextField>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Scrollbar>
                      </Grid>
                    )}
                  {corporateCustomerDetails?.data?.carFleetInsurance?.customFiles &&
                    corporateCustomerDetails?.data?.carFleetInsurance?.customFiles?.length > 0 && (
                      <Grid item xs={12} sm={12}>
                        <CardHeader title="Motor Fleet Files" sx={{ p: 2 }} />
                        <Scrollbar>
                          <Box sx={{ minWidth: 800 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>File Name</TableCell>
                                  <TableCell>File</TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {corporateCustomerDetails?.data.carFleetInsurance?.customFiles?.map((item, index) => {
                                  return (
                                    <>
                                      <TableRow hover key={index}>
                                        <TableCell>{item?.originalname}</TableCell>
                                        <TableCell>
                                          <Box
                                            onClick={() => {
                                              onDocumentDowmload(item?.path);
                                            }}
                                            sx={{
                                              display: "flex",
                                              gap: 1,
                                              alignItems: "center",
                                              p: 0.5,
                                              px: 1.5,
                                              cursor: "pointer",
                                              borderRadius: "5px",
                                              border: "1px solid #707070",
                                              backgroundColor: "#70707010",
                                              width: "max-content",
                                            }}
                                          >
                                            <DownloadSvg />
                                            <Typography sx={{ fontSize: 14 }}>Download File</Typography>
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Scrollbar>
                      </Grid>
                    )}
                  {corporateCustomerDetails?.data?.healthInsurance?.health &&
                    corporateCustomerDetails?.data?.healthInsurance?.health?.length > 0 && (
                      <Grid item xs={12} sm={12}>
                        <CardHeader title="Group Health" sx={{ p: 2 }} />
                        <Scrollbar>
                          <Box sx={{ minWidth: 800 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Current Insurer</TableCell>
                                  <TableCell>Current Insurer Years</TableCell>
                                  <TableCell>Existing Broker</TableCell>
                                  <TableCell>Existing Broker Years</TableCell>
                                  <TableCell>Renewal Date</TableCell>
                                  <TableCell>Probability</TableCell>
                                  <TableCell>No of Groups</TableCell>
                                  <TableCell>No of People</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {corporateCustomerDetails?.data.healthInsurance?.health?.map((item, index) => {
                                  return (
                                    <>
                                      <TableRow hover key={index}>
                                        <TableCell>{item?.currentInsurer}</TableCell>
                                        <TableCell>{item?.currentInsurernoOfYears}</TableCell>
                                        <TableCell>{item?.existingBroker}</TableCell>
                                        <TableCell>{item?.existingBrokernoOfYears}</TableCell>
                                        <TableCell>
                                          {item?.renewalDate ? format(parseISO(item?.renewalDate), "dd/MM/yyyy") : "-"}
                                        </TableCell>
                                        <TableCell>{`${item?.probability} Star`}</TableCell>
                                        <TableCell>{item?.groupSize}</TableCell>
                                        <TableCell>{item?.noOfPeople || "-"}</TableCell>
                                        <TableCell>{item?.type}</TableCell>
                                        <TableCell>
                                          <TextField
                                            size={"small"}
                                            select
                                            SelectProps={{ native: true }}
                                            name={`groupHealthStatus-${index}`}
                                            value={item?.groupHealthStatus || ""}
                                            onChange={(e) => handleStatusChange(e, index, "groupHealthStatus")}
                                            fullWidth
                                          >
                                            <option value="">Select Status</option>
                                            <option value="Lost">Lost</option>
                                            <option value="Quoting">Quoting</option>
                                            <option value="Converted">Converted</option>
                                          </TextField>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Scrollbar>
                      </Grid>
                    )}
                  {corporateCustomerDetails?.data?.healthInsurance?.customFiles &&
                    corporateCustomerDetails?.data?.healthInsurance?.customFiles?.length > 0 && (
                      <Grid item xs={12} sm={12}>
                        <CardHeader title="Group Health Files" sx={{ p: 2 }} />
                        <Scrollbar>
                          <Box sx={{ minWidth: 800 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>File Name</TableCell>
                                  <TableCell>File</TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {corporateCustomerDetails?.data.healthInsurance?.customFiles?.map((item, index) => {
                                  return (
                                    <>
                                      <TableRow hover key={index}>
                                        <TableCell>{item?.originalname}</TableCell>
                                        <TableCell>
                                          <Box
                                            onClick={() => {
                                              onDocumentDowmload(item?.path);
                                            }}
                                            sx={{
                                              display: "flex",
                                              gap: 1,
                                              alignItems: "center",
                                              p: 0.5,
                                              px: 1.5,
                                              cursor: "pointer",
                                              borderRadius: "5px",
                                              border: "1px solid #707070",
                                              backgroundColor: "#70707010",
                                              width: "max-content",
                                            }}
                                          >
                                            <DownloadSvg />
                                            <Typography sx={{ fontSize: 14 }}>Download File</Typography>
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Scrollbar>
                      </Grid>
                    )}
                  {corporateCustomerDetails?.data?.generalInsurance?.general &&
                    corporateCustomerDetails?.data?.generalInsurance?.general?.length > 0 && (
                      <Grid item xs={12} sm={12}>
                        <CardHeader title="General Insurance" sx={{ p: 2 }} />
                        <Scrollbar>
                          <Box sx={{ minWidth: 800 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Current Insurer</TableCell>
                                  <TableCell>Current Insurer Years</TableCell>
                                  <TableCell>Existing Broker</TableCell>
                                  <TableCell>Existing Broker Years</TableCell>
                                  <TableCell>Renewal Date</TableCell>
                                  <TableCell>Sub Product</TableCell>
                                  <TableCell>Probability</TableCell>
                                  <TableCell>Status</TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {corporateCustomerDetails?.data.generalInsurance?.general?.map((item, index) => {
                                  return (
                                    <>
                                      <TableRow hover key={index}>
                                        <TableCell>{item?.currentInsurer}</TableCell>
                                        <TableCell>{item?.currentInsurernoOfYears}</TableCell>
                                        <TableCell>{item?.existingBroker}</TableCell>
                                        <TableCell>{item?.existingBrokernoOfYears}</TableCell>
                                        <TableCell>
                                          {item?.renewalDate ? format(parseISO(item?.renewalDate), "dd/MM/yyyy") : "-"}
                                        </TableCell>
                                        <TableCell>{item?.subProduct}</TableCell>
                                        <TableCell>{`${item?.probability} Star`}</TableCell>
                                        <TableCell>
                                          <TableCell>
                                            <TextField
                                              size={"small"}
                                              select
                                              SelectProps={{ native: true }}
                                              name={`generalStatus-${index}`}
                                              value={item?.generalStatus || ""}
                                              onChange={(e) => handleStatusChange(e, index, "generalStatus")}
                                              fullWidth
                                            >
                                              <option value="">Select Status</option>
                                              <option value="Lost">Lost</option>
                                              <option value="Quoting">Quoting</option>
                                              <option value="Converted">Converted</option>
                                            </TextField>
                                          </TableCell>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Scrollbar>
                      </Grid>
                    )}
                  {corporateCustomerDetails?.data?.generalInsurance?.customFiles &&
                    corporateCustomerDetails?.data?.generalInsurance?.customFiles?.length > 0 && (
                      <Grid item xs={12} sm={12}>
                        <CardHeader title="General Insurance Files" sx={{ p: 2 }} />
                        <Scrollbar>
                          <Box sx={{ minWidth: 800 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>File Name</TableCell>
                                  <TableCell>File</TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {corporateCustomerDetails?.data.generalInsurance?.customFiles?.map((item, index) => {
                                  return (
                                    <>
                                      <TableRow hover key={index}>
                                        <TableCell>{item?.originalname}</TableCell>
                                        <TableCell>
                                          <Box
                                            onClick={() => {
                                              onDocumentDowmload(item?.path);
                                            }}
                                            sx={{
                                              display: "flex",
                                              gap: 1,
                                              alignItems: "center",
                                              p: 0.5,
                                              px: 1.5,
                                              cursor: "pointer",
                                              borderRadius: "5px",
                                              border: "1px solid #707070",
                                              backgroundColor: "#70707010",
                                              width: "max-content",
                                            }}
                                          >
                                            <DownloadSvg />
                                            <Typography sx={{ fontSize: 14 }}>Download File</Typography>
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Scrollbar>
                      </Grid>
                    )}
                </Grid>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

CustomerDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CustomerDetails;
