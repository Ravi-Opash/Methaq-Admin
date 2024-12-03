import React from "react";
import {
  Box,
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
import { SeverityPill } from "src/components/severity-pill";

const SponsorsDetailsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Promo code</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>User Info</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((item) => {
                    const createdAt = format(
                      parseISO(item?.createdAt),
                      "dd/MM/yyyy HH:mm"
                    );
                    return (
                      <TableRow>
                        <TableCell>{item?.promoCode}</TableCell>
                        <TableCell>
                          <SeverityPill
                            color={item?.isRedeem ? "success" : "error"}
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            {item?.isRedeem ? "Redeem" : "No Claim"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>{item?.ipAddress}</TableCell>
                        <TableCell>{item?.userAgent}</TableCell>
                        <TableCell>{createdAt}</TableCell>
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

export default SponsorsDetailsTable;
