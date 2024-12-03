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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { editQuotationPremium } from "src/sections/Proposals/Action/proposalsAction";
import { updateQuotationList } from "src/sections/Policies/reducer/policiesSlice";
import Link from "next/link";
import { setTravelQuotationSearchFilter } from "./Reducer/travelQuotationSlice";

const TravelQuotationTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    allTravelQuotationsSearchFilter = {},
  } = props;

  // const { allQuotationsList } = useSelector((state) => state.policies);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // Function to handle page change
  const onClickHandler = () => {
    dispatch(setTravelQuotationSearchFilter({ ...allTravelQuotationsSearchFilter, scrollPosition: window?.scrollY }));
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
                  <TableCell>insurer Type</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Purchased</TableCell>
                  <TableCell>Premium</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((quo) => {
                    const isSelected = selected.includes(quo?._id);

                    let createDate = "";

                    if (isValid(parseISO(quo?.createdAt))) {
                      createDate = format(parseISO(quo?.createdAt), "dd/MM/yyyy");
                    }

                    return (
                      <TableRow
                        hover
                        key={quo?.quote?._id}
                        selected={isSelected}
                        component={Link}
                        href={`/travel-insurance/quotations/${quo?._id}`}
                        onClick={() => onClickHandler()}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                      >
                        <TableCell>{quo?.proposalId}</TableCell>
                        <TableCell>{quo?.company?.companyName}</TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>{quo?.travelId?.insuranceType}</TableCell>
                        <TableCell>{quo?.userId?.fullName}</TableCell>
                        <TableCell>
                          <SeverityPill color={quo?.isBought ? "success" : "error"}>
                            {quo?.isBought ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>{`AED ${formatNumber(quo?.totalPrice)}`}</TableCell>

                        <TableCell>{createDate}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "travelQuote.read") && (
                            <NextLink href={`/travel-insurance/quotations/${quo?._id}`} passHref>
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

export default TravelQuotationTable;
