import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import NextLink from "next/link";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { SeverityPill } from "src/components/severity-pill";
import { EditIcon } from "src/Icons/EditIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { editQuotationPremium } from "../Proposals/Action/proposalsAction";
import { updateQuotationList } from "../Policies/reducer/policiesSlice";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { setQuotationsSearchFilter } from "../Policies/reducer/policiesSlice";
import Link from "next/link";

const AllQoutationTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteCustomerHandler,
    changeStatusHandler,
    searchFilter,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    quotationsSearchFilter = {},
  } = props;

  const { allQuotationsList } = useSelector((state) => state.policies);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();
  const [editable, setEditable] = useState("");

  const onClickHandler = () => {
    dispatch(setQuotationsSearchFilter({ ...quotationsSearchFilter, scrollPosition: window?.scrollY }));
  };

  const onEditPremiumHandler = (id) => {
    setEditable(id);
  };

  const onSubmitChange = (value, quote_Id) => {
    dispatch(editQuotationPremium({ price: value, quoteId: quote_Id }))
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        toast.success("SuccessFully Updated");
        let match = allQuotationsList.find((i) => i.quote._id == quote_Id);
        const index = allQuotationsList.indexOf(match);
        let match_quote = match.quote;
        match_quote = { ...match_quote, price: value };
        match = { ...match, quote: match_quote };
        const others = allQuotationsList.filter((i) => i.quote._id != quote_Id);
        const data = [...others.slice(0, index), match, ...others.slice(index)];
        dispatch(updateQuotationList(data));
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
    setEditable("");
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>REF</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Premium</TableCell>
                  <TableCell>Purchased</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Expried At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((quo) => {
                    const isSelected = selected.includes(quo?._id);

                    let createDate = "";

                    if (isValid(parseISO(quo?.start))) {
                      createDate = format(parseISO(quo?.start), "dd/MM/yyyy");
                    }

                    let expireDate = "";

                    if (isValid(parseISO(quo?.end))) {
                      expireDate = format(parseISO(quo?.end), "dd/MM/yyyy");
                    }

                    let isEditable;
                    if (editable === quo?.quote?._id) {
                      isEditable = true;
                    } else {
                      isEditable = false;
                    }

                    let newValue = quo?.quote?.price;

                    return (
                      <TableRow
                        component={Link}
                        hover
                        href={`/quotations/${quo?.quote?._id}`}
                        key={quo?.quote?._id}
                        selected={isSelected}
                        // onClick={() => router.push(`/quotations/${quo?.quote?._id}`)}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                        onClick={() => {
                          onClickHandler();
                        }}
                      >
                        <TableCell
                          onClick={(e) => {
                            e?.stopPropagation();
                            e?.preventDefault();
                          }}
                        >
                          {quo?.quote?.proposalId}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">{quo?.quote?.response?.QuatationCompanyName}</Typography>
                            {!quo?.quote?.isMatrix && (
                              <SeverityPill color={"success"} fontSize={9}>
                                {"Real Time Policy"}
                              </SeverityPill>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {quo?.quote?.response?.QuatationType === "thirdparty"
                            ? "Third Party"
                            : quo?.quote?.response?.QuatationType}
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
                                  {quo?.quote?.price && `AED ${formatNumber(parseInt(quo?.quote?.price * 100) / 100)}`}
                                </Typography>
                              ) : (
                                <TextField
                                  sx={{ width: "140px" }}
                                  label="Edit Premium"
                                  name="premium"
                                  type="number"
                                  defaultValue={quo?.quote?.price}
                                  onChange={(e) => {
                                    newValue = e.target.value;
                                  }}
                                  onClick={(e) => {
                                    e?.stopPropagation();
                                    e?.preventDefault();
                                  }}
                                  inputProps={{
                                    min: 0,
                                    max: 50000,
                                  }}
                                />
                              )}
                            </Box>

                            {moduleAccess(user, "quotations.update") && (
                              <>
                                {!isEditable ? (
                                  <EditIcon
                                    onClick={(e) => {
                                      e?.stopPropagation();
                                      e?.preventDefault();
                                      onEditPremiumHandler(quo?.quote?._id);
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
                                    onClick={(e) => {
                                      e?.stopPropagation();
                                      e?.preventDefault();
                                      if (!newValue || newValue < 0 || newValue > 50000) {
                                        toast.error("Value must be between 0 and 50,000!");
                                        return;
                                      }

                                      onSubmitChange(newValue, quo?.quote?._id);
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
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={quo?.quote?.isBought ? "success" : "error"}>
                            {quo?.quote?.isBought ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>{quo?.quote?.userId?.fullName}</TableCell>

                        <TableCell>{createDate}</TableCell>
                        <TableCell>{expireDate}</TableCell>

                        <TableCell align="right">
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
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
      </Card>
    </>
  );
};

export default AllQoutationTable;
