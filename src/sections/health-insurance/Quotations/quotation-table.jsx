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
import Link from "next/link";
import { sethealthQuotationsSearchFilter } from "src/sections/health-insurance/Quotations/Reducer/healthQuotationSlice";

const HealthQuotationTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    healthquoteSearchFiltter = {},
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();
  const [editable, setEditable] = useState("");

  const onSubmit = () => {
    dispatch(sethealthQuotationsSearchFilter({ ...healthquoteSearchFiltter, scrollPosition: window?.scrollY }));
  };

  return (
    <>
      <Card>
        {/* Table with Scrollbar */}

        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>REF</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>insurer Type</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Premium</TableCell>
                  <TableCell>Is Referral</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              {/* Table Body (Dynamic Rows) */}
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
                        component={Link}
                        href={`/health-insurance/quotations/${quo?._id}`}
                        hover
                        key={quo?.quote?._id}
                        selected={isSelected}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                        onClick={() => {
                          onSubmit();
                        }}
                      >
                        <TableCell
                          onClick={(e) => {
                            e?.stopPropagation();
                            e?.preventDefault();
                          }}
                        >
                          {quo?.proposalNo}
                        </TableCell>
                        <TableCell>{quo?.companyData?.companyName}</TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>{quo?.healthInfo?.insurerType}</TableCell>

                        <TableCell>{quo?.healthInfo?.fullName}</TableCell>
                        <TableCell>{`AED ${formatNumber(quo?.totalPrice)}`}</TableCell>
                        <TableCell>
                          <SeverityPill color={quo?.isReferral ? "success" : "error"}>
                            {quo?.isReferral ? "Yes " : "No "}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>{createDate}</TableCell>

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

        {/* Pagination Controls */}
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

export default HealthQuotationTable;
