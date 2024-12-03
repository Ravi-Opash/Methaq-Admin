import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  Grid,
  Card,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { SeverityPill } from "src/components/severity-pill";
import { Scrollbar } from "src/components/scrollbar";
import { formatNumber } from "src/utils/formatNumber";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { EditIcon } from "src/Icons/EditIcon";
import ModalComp from "src/components/modalComp";
import { useDispatch, useSelector } from "react-redux";
import { getGroupQuoteByCompany } from "./Action/healthInsuranceAction";
import { setGetGroupQuoteByCompanyPagination } from "./Reducer/healthInsuranceSlice";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import { useRouter } from "next/router";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditPremiumModal from "./health-edit-premium-modal";

// Styled components for customizing MUI components
const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: 13,
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: 14,
  },
}));

const Accordions = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  backgroundColor: "unset",
  cursor: "unset",
}));

const AccordionSummarys = styled(AccordionSummary)(({ theme }) => ({
  px: "0 !important",
}));

// Main component for displaying health proposal quotations in a table format
const HealthProposalQuotationTable = ({
  handleCheckboxChange,
  checkSelect,
  onPlanSelectHandler,
  isPurchased = false,
}) => {
  const { loginUserData: user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();
  const { proposalId } = router.query;

  const [isPaidArray, setIsPaidArray] = useState([]);
  const {
    healthCompanyList,
    groupQuoteList,
    groupQuoteCompanyLoader,
    paidProposalsList,
    getPaidProposalsLoader,
    groupQuoteByCompanyPagination,
    getGroupQuoteByCompanyPaginationApi,
    contactedProposalsList,
  } = useSelector((state) => state.healthInsurance);

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const [selectedQuote, setSelectedQuote] = useState(null);
  const [keyPlan, setkeyPlan] = useState(false);

  // Combine paid and contacted proposals to display unique entries
  useEffect(() => {
    if (paidProposalsList && contactedProposalsList) {
      const combinedArray = [...paidProposalsList, ...contactedProposalsList];
      const uniqueArray = combinedArray?.filter(
        (item, index, self) => index === self?.findIndex((t) => t?._id === item?._id)
      );
      setIsPaidArray(uniqueArray);
    }
  }, [paidProposalsList, contactedProposalsList]);

  const [expanded, setExpanded] = useState(false);

  // Handle accordion expansion
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Fetch group quotes for a specific company when the accordion is expanded
  const onClickHandler = (id, idx) => {
    if (expanded !== `panel${idx + 1}`) {
      // Check if the panel is not already expanded
      dispatch(getGroupQuoteByCompany({ id: proposalId, page: 1, size: 10, data: { company: id } }))
        .unwrap()
        .then((res) => {
          dispatch(
            setGetGroupQuoteByCompanyPagination({
              page: 1,
              size: 10,
            })
          );
        })
        .catch((err) => {
          toast.error(err);
          console.log(err, "err");
        });
    }
  };

  // Handle page change for group quote pagination
  const onPageChange = useCallback(
    (event, value, id) => {
      dispatch(
        setGetGroupQuoteByCompanyPagination({
          page: value + 1,
          size: groupQuoteByCompanyPagination?.size,
        })
      );
      dispatch(
        getGroupQuoteByCompany({
          id: proposalId,
          page: value + 1,
          size: groupQuoteByCompanyPagination?.size,
          data: { company: id },
        })
      );
    },
    [groupQuoteByCompanyPagination?.size]
  );

  // Handle change in rows per page for group quote pagination
  const onRowsPerPageChange = useCallback(
    (event, id) => {
      dispatch(
        getGroupQuoteByCompany({
          id: proposalId,
          page: groupQuoteByCompanyPagination?.page,
          size: event.target.value,
          data: { company: id },
        })
      );
      dispatch(
        setGetGroupQuoteByCompanyPagination({
          page: 1,
          size: event.target.value,
        })
      );
    },
    [groupQuoteByCompanyPagination?.page]
  );
  return (
    <>
      {((paidProposalsList && paidProposalsList?.length > 0) ||
        (contactedProposalsList && contactedProposalsList?.length > 0)) && (
        <Box
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
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                py: 1,
                borderRadius: "10px",
                width: "40%",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-block",
                px: "14px",
              }}
            >
              Paid | Contacted Plans
            </Typography>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                py: 1,
                width: "100%",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-block",
                px: "14px",
              }}
            >
              {isPaidArray?.[0] && (isPaidArray[0]?.isPaid || isPaidArray[0]?.isContact)
                ? `(${isPaidArray[0]?.company?.companyName})`
                : ""}
            </Typography>
          </Box>
          <Card>
            <Grid container>
              <Grid item xs={12} md={12}>
                <Scrollbar>
                  <Box sx={{ minWidth: 800 }}>
                    {!getPaidProposalsLoader ? (
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCells></TableCells>
                            <TableCells>No.</TableCells>
                            <TableCells>TPA</TableCells>
                            <TableCells>Network</TableCells>
                            <TableCells>Plan(Co-pay)</TableCells>
                            <TableCells>Is Referral</TableCells>
                            <TableCells>Applied for Contact</TableCells>
                            <TableCells>Is paid</TableCells>
                            <TableCells>Is Policy Issued</TableCells>
                            <TableCells>Premium</TableCells>
                            <TableCells>Action</TableCells>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <>
                            {isPaidArray?.length > 0 &&
                              isPaidArray
                                ?.sort((a, b) => {
                                  if (a?.isPaid > b?.isPaid) {
                                    return -1;
                                  }
                                  if (a?.isPaid < b?.isPaid) {
                                    return 1;
                                  }
                                  if (a?.isContact || false > b?.isContact || false) {
                                    return -1;
                                  }
                                  if (a?.isContact || false < b?.isContact || false) {
                                    return 1;
                                  }
                                  return 0;
                                })
                                ?.map((item) => {
                                  return (
                                    <TableRow
                                      hover
                                      sx={{
                                        backgroundColor: item?.isPaid
                                          ? "rgba(11, 129, 90, 0.15) !important"
                                          : "rgba(255, 242, 217, 1) !important",
                                        "&:hover": {
                                          backgroundColor: item?.isPaid
                                            ? "rgba(11, 129, 90, 0.15) !important"
                                            : "rgba(255, 242, 217, 0.9) !important",
                                        },
                                        cursor: "pointer",
                                      }}
                                    >
                                      <TableCells padding="checkbox">
                                        <Checkbox
                                          checked={checkSelect.includes(item?._id)}
                                          onChange={(e) => {
                                            handleCheckboxChange(item?._id);
                                            onPlanSelectHandler(e.target.value, item?._id);
                                          }}
                                        />
                                      </TableCells>
                                      <TableCells>{item?.proposalNo}</TableCells>
                                      <TableCells>{item?.TPA?.TPAName}</TableCells>
                                      <TableCells>{item?.network?.networkName}</TableCells>
                                      <TableCells>{`${item?.plan?.planName} (${item?.plan?.coPay}%)`}</TableCells>
                                      <TableCells>
                                        <SeverityPill
                                          sx={{ fontSize: "10px" }}
                                          color={item?.isReferral ? "success" : "error"}
                                        >
                                          {item?.isReferral ? "Yes" : "No"}
                                        </SeverityPill>
                                      </TableCells>
                                      <TableCells>
                                        <SeverityPill
                                          sx={{ fontSize: "10px" }}
                                          color={item?.isContact ? "success" : "error"}
                                        >
                                          {item?.isContact ? "Yes" : "No"}
                                        </SeverityPill>
                                      </TableCells>
                                      <TableCells>
                                        <SeverityPill
                                          sx={{ fontSize: "10px" }}
                                          color={item?.isPaid ? "success" : "error"}
                                        >
                                          {item?.isPaid ? "Yes " : "No "}
                                          {!item?.isPaid & (item?.payAttempts?.length > 0) ? (
                                            <WarningAmberIcon />
                                          ) : (
                                            <></>
                                          )}
                                        </SeverityPill>
                                      </TableCells>
                                      <TableCells>
                                        <SeverityPill
                                          sx={{ fontSize: "10px" }}
                                          color={item?.policyIssued ? "success" : "error"}
                                        >
                                          {item?.policyIssued ? "Yes" : "No"}
                                        </SeverityPill>
                                      </TableCells>
                                      <TableCells>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <Box>
                                            <Typography sx={{ fontSize: "14px", fontFamily: "Inter" }}>
                                              {item?.isPremiumRequestUpon && item?.editPrice?.length <= 0
                                                ? "-"
                                                : `AED ${formatNumber(parseInt(item?.price * 100) / 100)}`}
                                            </Typography>
                                          </Box>
                                          {moduleAccess(user, "healthQuote.update") && (
                                            <>
                                              {isPurchased === false && (
                                                <>
                                                  <EditIcon
                                                    onClick={() => {
                                                      if (item?.editPrice?.length >= 3) {
                                                        toast.error("Maximum editable limit exceeded!");
                                                        return;
                                                      }
                                                      setOpenEditModal(true);
                                                      setSelectedQuote(item);
                                                      setkeyPlan(true);
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
                                                </>
                                              )}
                                            </>
                                          )}
                                        </Box>
                                      </TableCells>
                                      <TableCells>
                                        {" "}
                                        <NextLink href={`/health-insurance/quotations/${item?._id}`} passHref>
                                          <IconButton component="a">
                                            <ArrowRight fontSize="small" />
                                          </IconButton>
                                        </NextLink>
                                      </TableCells>
                                    </TableRow>
                                  );
                                })}
                          </>
                        </TableBody>
                      </Table>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "400px",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>
                </Scrollbar>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}
      <Divider sx={{ borderWidth: "1px", mb: 0.5 }} />
      <Scrollbar>
        <Grid container rowSpacing={1}>
          <Grid item xs={12} md={12}>
            <Card
              sx={{
                p: 1,
                px: 2,
                borderRadius: "10px",
                boxShadow: "none",
              }}
            >
              <Grid container>
                <Grid item xs={7}>
                  <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>Company</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>No Of Plans</Typography>
                </Grid>
                <Grid item xs={3} sx={{ display: "flex", justifyContent: "end" }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>Action</Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          {healthCompanyList?.length > 0 &&
            [...healthCompanyList]?.map((item, idx) => {
              return (
                <Grid
                  item
                  xs={12}
                  md={12}
                  key={idx}
                  sx={{
                    borderBottom: healthCompanyList?.length - 1 > +idx ? "1px solid #f5f5f5" : "",
                    backgroundColor: expanded === `panel${idx + 1}` ? "#f5f5f5" : "",
                  }}
                >
                  <Accordions
                    expanded={expanded === `panel${idx + 1}`}
                    onChange={handleChange(`panel${idx + 1}`)}
                    onClick={() => onClickHandler(item?._id, idx)}
                  >
                    <AccordionSummarys
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{
                        minHeight: 0,
                      }}
                    >
                      <Grid container>
                        <Grid item xs={7}>
                          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>{item?.companyName}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>{item?.quoteCount}</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ display: "flex", justifyContent: "end", pr: 2 }}>
                          {expanded === `panel${idx + 1}` ? (
                            <ArrowUpwardIcon sx={{ color: "#707070", fontSize: 20 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ color: "#707070", fontSize: 20 }} />
                          )}
                        </Grid>
                      </Grid>
                    </AccordionSummarys>
                    <AccordionDetails>
                      <Card>
                        <Grid container>
                          <Grid item xs={12} md={12}>
                            <Scrollbar>
                              <Box sx={{ minWidth: 800 }}>
                                {!groupQuoteCompanyLoader ? (
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCells></TableCells>
                                        <TableCells>No.</TableCells>
                                        <TableCells>TPA</TableCells>
                                        <TableCells>Network</TableCells>
                                        <TableCells>Plan(Co-pay)</TableCells>
                                        <TableCells>Is Referral</TableCells>
                                        <TableCells>Applied for Contact</TableCells>
                                        <TableCells>Is paid</TableCells>
                                        <TableCells>Is Policy Issued</TableCells>
                                        <TableCells>Premium</TableCells>
                                        <TableCells>Action</TableCells>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <>
                                        {groupQuoteList?.length > 0 &&
                                          [...groupQuoteList]
                                            ?.sort((a, b) => {
                                              if (a?.isPaid > b?.isPaid) {
                                                return -1;
                                              }
                                              if (a?.isPaid < b?.isPaid) {
                                                return 1;
                                              }
                                              if (a?.isContact || false > b?.isContact || false) {
                                                return -1;
                                              }
                                              if (a?.isContact || false < b?.isContact || false) {
                                                return 1;
                                              }
                                              return 0;
                                            })
                                            ?.map((item) => {
                                              return (
                                                <TableRow hover>
                                                  <TableCells padding="checkbox">
                                                    <Checkbox
                                                      checked={checkSelect.includes(item?._id)}
                                                      onChange={(e) => {
                                                        handleCheckboxChange(item?._id);
                                                        onPlanSelectHandler(e.target.value, item?._id);
                                                      }}
                                                    />
                                                  </TableCells>
                                                  <TableCells>{item?.proposalNo}</TableCells>
                                                  <TableCells>{item?.TPA?.TPAName}</TableCells>
                                                  <TableCells>{item?.network?.networkName}</TableCells>
                                                  <TableCells>{`${item?.plan?.planName} (${item?.plan?.coPay}%)`}</TableCells>
                                                  <TableCells>
                                                    <SeverityPill
                                                      sx={{ fontSize: "10px" }}
                                                      color={item?.isReferral ? "success" : "error"}
                                                    >
                                                      {item?.isReferral ? "Yes" : "No"}
                                                    </SeverityPill>
                                                  </TableCells>
                                                  <TableCells>
                                                    <SeverityPill
                                                      sx={{ fontSize: "10px" }}
                                                      color={item?.isContact ? "success" : "error"}
                                                    >
                                                      {item?.isContact ? "Yes" : "No"}
                                                    </SeverityPill>
                                                  </TableCells>
                                                  <TableCells>
                                                    <SeverityPill
                                                      sx={{ fontSize: "10px" }}
                                                      color={item?.paymentId ? "success" : "error"}
                                                    >
                                                      {item?.paymentId ? "Yes " : "No "}
                                                      {!item?.paymentId & (item?.payAttempts?.length > 0) ? (
                                                        <WarningAmberIcon />
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </SeverityPill>
                                                  </TableCells>
                                                  <TableCells>
                                                    <SeverityPill
                                                      sx={{ fontSize: "10px" }}
                                                      color={item?.policyIssued ? "success" : "error"}
                                                    >
                                                      {item?.policyIssued ? "Yes" : "No"}
                                                    </SeverityPill>
                                                  </TableCells>
                                                  <TableCells>
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                      }}
                                                    >
                                                      <Box>
                                                        <Typography sx={{ fontSize: "14px", fontFamily: "Inter" }}>
                                                          {item?.isPremiumRequestUpon && item?.editPrice?.length <= 0
                                                            ? "-"
                                                            : `AED ${formatNumber(parseInt(item?.price * 100) / 100)}`}
                                                        </Typography>
                                                      </Box>
                                                      {moduleAccess(user, "healthQuote.update") && (
                                                        <>
                                                          {isPurchased === false && (
                                                            <>
                                                              <EditIcon
                                                                onClick={() => {
                                                                  if (item?.editPrice?.length >= 3) {
                                                                    toast.error("Maximum editable limit exceeded!");
                                                                    return;
                                                                  }
                                                                  setOpenEditModal(true);
                                                                  setSelectedQuote(item);
                                                                  setkeyPlan(false);
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
                                                            </>
                                                          )}
                                                        </>
                                                      )}
                                                    </Box>
                                                  </TableCells>
                                                  <TableCells>
                                                    <NextLink
                                                      href={`/health-insurance/quotations/${item?._id}`}
                                                      passHref
                                                    >
                                                      <IconButton component="a">
                                                        <ArrowRight fontSize="small" />
                                                      </IconButton>
                                                    </NextLink>
                                                  </TableCells>
                                                </TableRow>
                                              );
                                            })}
                                      </>
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <Box
                                    sx={{
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: `${groupQuoteByCompanyPagination?.size * 75 + 20}px`,
                                    }}
                                  >
                                    <CircularProgress />
                                  </Box>
                                )}
                              </Box>
                            </Scrollbar>
                          </Grid>
                        </Grid>
                        <TablePagination
                          component="div"
                          count={getGroupQuoteByCompanyPaginationApi?.totalItems}
                          onPageChange={(e, value) => onPageChange(e, value, item?._id)}
                          onRowsPerPageChange={(e) => onRowsPerPageChange(e, item?._id)}
                          page={groupQuoteByCompanyPagination?.page - 1}
                          rowsPerPage={groupQuoteByCompanyPagination?.size}
                          rowsPerPageOptions={[5, 10, 25]}
                        />
                      </Card>
                    </AccordionDetails>
                  </Accordions>
                </Grid>
              );
            })}
        </Grid>
      </Scrollbar>

      {/* Edit Premium Modal */}
      <ModalComp open={openEditModal} handleClose={handleCloseEditModal} widths={{ xs: "95%", sm: "95%", md: 600 }}>
        {selectedQuote && (
          <EditPremiumModal handleClose={handleCloseEditModal} quote={selectedQuote} isPaid={keyPlan} />
        )}
      </ModalComp>
    </>
  );
};

export default HealthProposalQuotationTable;
