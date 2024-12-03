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
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { editQuotationPremium } from "src/sections/Proposals/Action/proposalsAction";
import { updateQuotationList } from "src/sections/Policies/reducer/policiesSlice";

const MotorFleetQuotationTable = (props) => {
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
  } = props;

  // const { allQuotationsList } = useSelector((state) => state.policies);
  const { loginUserData: user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [editable, setEditable] = useState("");

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
                  <TableCell>Insurance Company</TableCell>
                  <TableCell>Corporate Company</TableCell>
                  <TableCell>Purchased</TableCell>
                  <TableCell>Premium</TableCell>
                  {/* <TableCell>Is Referral</TableCell> */}
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((quo) => {
                    // console.log(quo, "quo");
                    const isSelected = selected.includes(quo?._id);

                    let createDate = "";

                    if (isValid(parseISO(quo?.createdAt))) {
                      createDate = format(parseISO(quo?.createdAt), "MM/dd/yyyy");
                    }

                    // let expireDate = "";

                    // if (isValid(parseISO(quo?.end))) {
                    //   expireDate = format(parseISO(quo?.end), "MM/dd/yyyy");
                    // }

                    // let isEditable;
                    // if (editable === quo?.quote?._id) {
                    //   isEditable = true;
                    // } else {
                    //   isEditable = false;
                    // }

                    // let newValue = quo?.quote?.price;
                    return (
                      <TableRow
                        hover
                        key={quo?.quote?._id}
                        selected={isSelected}
                        onClick={() => router.push(`/motor-fleet/quotations/${quo?._id}`)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{quo?.proposalId}</TableCell>
                        <TableCell>{quo?.company?.companyName}</TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>{quo?.fleetdDetailsId?.companyName}</TableCell>
                        <TableCell>
                          <SeverityPill color={quo?.isBought ? "success" : "error"}>
                            {quo?.isBought ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>{`AED ${formatNumber(quo?.price || 0)}`}</TableCell>
                        {/* <TableCell>
                          <SeverityPill color={quo?.isReferral ? "success" : "error"}>
                            {quo?.isReferral ? "Yes " : "No "}
                          </SeverityPill>
                        </TableCell> */}
                        <TableCell>{createDate}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "travelQuote.read") && (
                            <NextLink href={`/motor-fleet/quotations/${quo?._id}`} passHref>
                              <IconButton component="a">
                                <ArrowRight fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}
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

export default MotorFleetQuotationTable;
