import React from "react";
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { ArrowRight } from "src/Icons/ArrowRight";
import { SeverityPill } from "src/components/severity-pill";
import { useSelector } from "react-redux";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";

const VoucherTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    changeStatusHandler,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const { loginUserData: user } = useSelector((state) => state.auth);

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>PromoCode</TableCell>
                  <TableCell>Discount Type</TableCell>
                  <TableCell>Discount Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((voucher) => {
                    const isSelected = selected.includes(voucher?._id);
                    const createdAt = format(parseISO(voucher?.createdAt), "dd/MM/yyyy");
                    const expiryDate = format(parseISO(voucher?.expiryDate), "dd/MM/yyyy");

                    return (
                      <TableRow hover key={voucher?._id} selected={isSelected}>
                        <TableCell>
                          <Stack alignItems="center" direction="row" spacing={2}>
                            <Typography variant="subtitle2">{voucher?.promoCode}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{voucher?.discountType == "fixedPrice" ? "Fixed Price" : "Percentage"}</TableCell>
                        <TableCell>
                          {formatNumber(voucher?.discountValue)} {voucher?.discountType === "percentage" ? "%" : "AED"}
                        </TableCell>

                        <TableCell>
                          <SeverityPill
                            color={voucher?.isActive ? "success" : "error"}
                            onClick={() => {
                              moduleAccess(user, "vouchers.update") &&
                                changeStatusHandler({
                                  voucherId: voucher?._id,
                                  isActive: !voucher?.isActive,
                                });
                            }}
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            {voucher?.isActive ? "enable" : "disable"}
                          </SeverityPill>
                        </TableCell>

                        <TableCell>{createdAt}</TableCell>
                        <TableCell>{expiryDate}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "vouchers.update") && (
                            <NextLink href={`/vouchers/${voucher?._id}/edit`} passHref>
                              <IconButton component="a">
                                <PencilAlt fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}

                          {moduleAccess(user, "vouchers.delete") && (
                            <Button onClick={() => deleteByIdHandler(voucher?._id)}>
                              <IconButton component="a">
                                <DeleteSvg fontSize="small" />
                              </IconButton>
                            </Button>
                          )}

                          <NextLink href={`/vouchers/${voucher?._id}`} passHref>
                            <IconButton component="a">
                              <ArrowRight fontSize="small" />
                            </IconButton>
                          </NextLink>
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

export default VoucherTable;
