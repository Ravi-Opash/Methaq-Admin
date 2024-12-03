import React, { useState } from "react";
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
import { PencilAlt } from "src/Icons/PencilAlt";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { ArrowRight } from "src/Icons/ArrowRight";
import { useRouter } from "next/router";
import { moduleAccess } from "src/utils/module-access";
import { useSelector } from "react-redux";
import { SeverityPill } from "src/components/severity-pill";
import { format, parseISO } from "date-fns";

const PartnerDiscountTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    page = 0,
    rowsPerPage = 0,
    changeStatusHandler,
    selected = [],
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const router = useRouter();

  const { partnerId } = router.query;

  return (
    <>
      <Card> 
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Discount Code</TableCell> */}
                  <TableCell>Discount Type</TableCell>
                  <TableCell>Discount Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start date</TableCell>
                  <TableCell>Expiry date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((discount) => {
                    const isSelected = selected.includes(discount?._id);
                    const createdAt = format(parseISO(discount?.startDate), "dd/MM/yyyy");
                    const expiryDate = format(parseISO(discount?.expiryDate), "dd/MM/yyyy");

                    return (
                      <TableRow hover key={discount?._id} selected={isSelected}>
                        {/* <TableCell>{discount?.discountCode}</TableCell> */}
                        <TableCell>{discount?.discountType}</TableCell>
                        <TableCell>
                          {discount?.discountType === "percentage"
                            ? `${discount?.discountValue} %`
                            : `${discount?.discountValue} AED`}
                        </TableCell>
                        <TableCell>
                          <SeverityPill
                            color={discount?.isActive ? "success" : "error"}
                            onClick={() => {
                              moduleAccess(user, "partners.update") &&
                                changeStatusHandler({
                                  id: discount?._id,
                                  data: { isActive: !discount?.isActive },
                                });
                            }}
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            {discount?.isActive ? "enable" : "disable"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>{createdAt}</TableCell>
                        <TableCell>{expiryDate}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "partners.update") && (
                            <NextLink
                              href={`/partners/${partnerId}/discount-offers/${discount?._id}/edit`}
                              passHref
                            >
                              <IconButton component="a">
                                <PencilAlt fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}

                          {moduleAccess(user, "partners.delete") && (
                            <Button onClick={() => deleteByIdHandler(discount?._id)}>
                              <IconButton component="a">
                                <DeleteSvg fontSize="small" />
                              </IconButton>
                            </Button>
                          )}

                          <NextLink
                            href={`/partners/${partnerId}/discount-offers/${discount?._id}`}
                            passHref
                          >
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

export default PartnerDiscountTable;
