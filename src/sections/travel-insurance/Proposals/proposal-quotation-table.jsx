import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
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
import { useDispatch, useSelector } from "react-redux";
import { setGetGroupTravelQuoteByCompanyPagination } from "./Reducer/travelInsuranceSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { getGroupTravelQuoteByCompany } from "./Action/travelInsuranceAction";

const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: 13,
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: 14,
  },
}));

const Accordions = styled(Accordion)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  boxShadow: "none",
  backgroundColor: "unset",
  cursor: "unset",
}));

const AccordionSummarys = styled(AccordionSummary)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  px: "0 !important",
}));

const TravelProposalQuotationTable = ({ handleCheckboxChange, checkSelect, onPlanSelectHandler }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { proposalId } = router.query;
  const [newValue, setNewValue] = useState("");
  const [isPaidArray, setIsPaidArray] = useState([]);
  const {
    travelCompanyList,
    groupTravelQuoteList,
    groupTravelQuoteCompanyLoader,
    paidTravelProposalsList,
    getTravelPaidProposalsLoader,
    groupTravelQuoteByCompanyPagination,
    getGroupTravelQuoteByCompanyPaginationApi,
  } = useSelector((state) => state.travelInsurance);
  const [editable, setEditable] = useState("");

  // for paid proposals
  useEffect(() => {
    if (paidTravelProposalsList?.paidProposals || paidTravelProposalsList?.contactProposals) {
      const combinedArray = [...paidTravelProposalsList?.paidProposals, ...paidTravelProposalsList?.contactProposals];
      const uniqueArray = combinedArray?.filter(
        (item, index, self) => index === self?.findIndex((t) => t?._id === item?._id)
      );
      setIsPaidArray(uniqueArray);
    }
  }, [paidTravelProposalsList?.paidProposals && paidTravelProposalsList?.contactProposals]);

  const [expanded, setExpanded] = useState(false);

  //  Function for Accordion
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Function for group travel quote
  const onClickHandler = (id, idx) => {
    if (expanded !== `panel${idx + 1}`) {
      dispatch(getGroupTravelQuoteByCompany({ id: proposalId, page: 1, size: 10, data: { companyId: id } }))
        .unwrap()
        .then((res) => {
          // console.log(res, "res");
          dispatch(
            setGetGroupTravelQuoteByCompanyPagination({
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

  // Function for pagination for page change
  const onPageChange = useCallback(
    (event, value, id) => {
      dispatch(
        setGetGroupTravelQuoteByCompanyPagination({
          page: value + 1,
          size: groupTravelQuoteByCompanyPagination?.size,
        })
      );
      dispatch(
        getGroupTravelQuoteByCompany({
          id: proposalId,
          page: value + 1,
          size: groupTravelQuoteByCompanyPagination?.size,
          data: { companyId: id },
        })
      );
    },
    [groupTravelQuoteByCompanyPagination?.size]
  );

  // Function for pagination for rows per page
  const onRowsPerPageChange = useCallback(
    (event, id) => {
      dispatch(
        getGroupTravelQuoteByCompany({
          id: proposalId,
          page: groupTravelQuoteByCompanyPagination?.page,
          size: event.target.value,
          data: { companyId: id },
        })
      );
      dispatch(
        setGetGroupTravelQuoteByCompanyPagination({
          page: 1,
          size: event.target.value,
        })
      );
    },
    [groupTravelQuoteByCompanyPagination?.page]
  );

  return (
    <>
      {((paidTravelProposalsList && paidTravelProposalsList?.paidProposals?.length > 0) ||
        paidTravelProposalsList?.contactProposals?.length > 0) && (
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
              py: 1,
              width: "100%",
              borderRadius: "10px",
              // boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              fontWeight: "600",
              fontSize: "14px",
              display: "inline-block",
              px: "14px",
            }}
          >
            {`Paid & Contacted Plans (${paidTravelProposalsList?.paidProposals?.[0]?.company?.companyName})`}
          </Typography>
          <Card>
            <Grid container>
              <Grid item xs={12} md={12}>
                <Scrollbar>
                  <Box sx={{ minWidth: 800 }}>
                    {!getTravelPaidProposalsLoader ? (
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCells></TableCells>
                            <TableCells>No.</TableCells>
                            <TableCells>Plan</TableCells>
                            <TableCells>Insurance Type</TableCells>
                            {/* <TableCells>Is Referral</TableCells> */}
                            {/* <TableCells>Applied for Contact</TableCells> */}
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
                                  let isEditable;
                                  if (editable === item?._id) {
                                    isEditable = true;
                                  } else {
                                    isEditable = false;
                                  }
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
                                      <TableCells>{item?.proposalId}</TableCells>
                                      <TableCells>{`${item?.planName}`}</TableCells>
                                      <TableCells>{`${item?.insuranceType}`}</TableCells>
                                      {/* <TableCells>
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
                                      </TableCells> */}
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
                                            {!isEditable ? (
                                              <Typography sx={{ fontSize: "14px", fontFamily: "Inter" }}>
                                                {`AED ${formatNumber(parseInt(item?.price * 100) / 100)}`}
                                              </Typography>
                                            ) : (
                                              <TextField
                                                sx={{ width: "140px" }}
                                                label="Edit Premium"
                                                name="premium"
                                                type="number"
                                                defaultValue={item?.price}
                                                onChange={(e) => {
                                                  setNewValue(e.target.value);
                                                }}
                                              />
                                            )}
                                          </Box>
                                        </Box>
                                      </TableCells>
                                      <TableCells>
                                        {" "}
                                        <NextLink href={`/travel-insurance/quotations/${item?._id}`} passHref>
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
          {travelCompanyList?.length > 0 &&
            [...travelCompanyList]?.map((item, idx) => {
              return (
                <Grid
                  item
                  xs={12}
                  md={12}
                  key={idx}
                  sx={{
                    borderBottom: travelCompanyList?.length - 1 > +idx ? "1px solid #f5f5f5" : "",
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
                          <Typography sx={{ fontSize: "14px", fontWeight: "400", ml: 1 }}>
                            {item?.companyName}
                          </Typography>
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
                                {!groupTravelQuoteCompanyLoader ? (
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCells></TableCells>
                                        <TableCells>No.</TableCells>
                                        <TableCells>Plan</TableCells>
                                        <TableCells>Insurance Type</TableCells>
                                        <TableCells>Is paid</TableCells>
                                        <TableCells>Is Policy Issued</TableCells>
                                        <TableCells>Premium</TableCells>
                                        <TableCells>Action</TableCells>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <>
                                        {groupTravelQuoteList?.length > 0 &&
                                          [...groupTravelQuoteList]
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
                                              let isEditable;
                                              if (editable === item?._id) {
                                                isEditable = true;
                                              } else {
                                                isEditable = false;
                                              }
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
                                                  <TableCells>{item?.proposalId}</TableCells>
                                                  <TableCells>{item?.planName}</TableCells>
                                                  <TableCells>{`${item?.travelId?.insuranceType}`}</TableCells>
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
                                                        {!isEditable ? (
                                                          <Typography sx={{ fontSize: "14px", fontFamily: "Inter" }}>
                                                            {item?.isPremiumRequestUpon && item?.editPrice?.length <= 0
                                                              ? "-"
                                                              : `AED ${formatNumber(
                                                                  parseInt(item?.price * 100) / 100
                                                                )}`}
                                                          </Typography>
                                                        ) : (
                                                          <TextField
                                                            sx={{ width: "140px" }}
                                                            label="Edit Premium"
                                                            name="premium"
                                                            type="number"
                                                            defaultValue={item?.price}
                                                            onChange={(e) => {
                                                              setNewValue(e.target.value);
                                                            }}
                                                          />
                                                        )}
                                                      </Box>
                                                    </Box>
                                                  </TableCells>
                                                  <TableCells>
                                                    {" "}
                                                    <NextLink
                                                      href={`/travel-insurance/quotations/${item?._id}`}
                                                      passHref
                                                    >
                                                      <IconButton component="a">
                                                        <ArrowRight fontSize="small" />
                                                      </IconButton>
                                                    </NextLink>
                                                  </TableCells>
                                                </TableRow>
                                              );
                                            })}{" "}
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
                                      height: `${groupTravelQuoteByCompanyPagination?.size * 75 + 20}px`,
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
                          count={getGroupTravelQuoteByCompanyPaginationApi?.totalItems}
                          onPageChange={(e, value) => onPageChange(e, value, item?._id)}
                          onRowsPerPageChange={(e) => onRowsPerPageChange(e, item?._id)}
                          page={groupTravelQuoteByCompanyPagination?.page - 1}
                          rowsPerPage={groupTravelQuoteByCompanyPagination?.size}
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
    </>
  );
};

export default TravelProposalQuotationTable;
