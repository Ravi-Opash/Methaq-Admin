import React from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { PencilAlt } from "src/Icons/PencilAlt";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {setAddonTransactionSearchFilter} from "../transactions/reducer/transactionSlice";

const AllAddonTransactionTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    addonTransactionSearchFilter = {},
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setAddonTransactionSearchFilter({ ...addonTransactionSearchFilter, scrollPosition: window?.scrollY }));
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
                  <TableCell>Add on</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Policy</TableCell>
                  <TableCell>Transaction</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items?.length > 0 ? (
                  items?.map((item) => {
                    const policyEffectiveDate = item?.policyId?.policyEffectiveDate
                      ? format(parseISO(item?.policyId?.policyEffectiveDate), "HH:mm dd/MM/yyyy")
                      : "-";

                    const policyExpiryDate = item?.policyId?.policyExpiryDate
                      ? format(parseISO(item?.policyId?.policyExpiryDate), "HH:mm dd/MM/yyyy")
                      : "-";

                    return (
                      <TableRow
                        component={Link}
                        hover
                        key={item?._id}
                        href={`/addon-transactions/${item?._id}/${item?.addons.code}`}
                        onClick={() => {
                          onClickHandler();
                        }}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                      >
                        <TableCell
                          onClick={(e) => {
                            e?.stopPropagation();
                            e?.preventDefault();
                          }}
                        >
                          {item?.addonNumber}
                        </TableCell>
                        <TableCell>{item?.addons?.productName}</TableCell>
                        <TableCell>{"AED " + formatNumber(item?.addons?.price)}</TableCell>
                        <TableCell>{policyEffectiveDate}</TableCell>
                        <TableCell>{item?.policyId?.policyNumber}</TableCell>
                        <TableCell>{item?.transaction?.transactionNumber}</TableCell>
                        <TableCell>{policyExpiryDate}</TableCell>
                        <TableCell align="right">
                          {/* <NextLink href={""} passHref>
                            <IconButton component="a">
                              <PencilAlt fontSize="small" />
                            </IconButton>
                          </NextLink>

                          <Button>
                            <IconButton component="a">
                              <DeleteSvg fontSize="small" />
                            </IconButton>
                          </Button> */}
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>No data found!</Box>
                  </TableRow>
                )}
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

export default AllAddonTransactionTable;
