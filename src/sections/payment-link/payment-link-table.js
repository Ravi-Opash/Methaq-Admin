import React from "react";
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  TableCell,
  styled,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { formatNumber } from "src/utils/formatNumber";
import { SeverityPill } from "src/components/severity-pill";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { toast } from "react-toastify";
import Link from "next/link";
import { setPaymentLinkSerchFilter } from "./Reducer/paymentLinkSlice";

const TableCells = styled(TableCell)(({ theme }) => ({
  fontSize: "11px !important",
  [theme.breakpoints.up("xl")]: {
    fontSize: "11.5px !important",
  },
}));

const TableCelles = styled(TableCell)(({ theme }) => ({
  fontSize: "11.5px !important",
  [theme.breakpoints.up("xl")]: {
    fontSize: "12.5px !important",
  },
}));

const PaymentLinksTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    onHistorySelect,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    paymentLinkSearchFilter = {},
  } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const onClickHandler = () => {
    dispatch(setPaymentLinkSerchFilter({ ...paymentLinkSearchFilter, scrollPosition: window?.scrollY }));
  };
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCells>Transaction No.</TableCells>
                  <TableCells>REF</TableCells>
                  <TableCells>Auth Pref No.</TableCells>
                  <TableCells>Agent</TableCells>
                  <TableCells>Bill Amount</TableCells>
                  <TableCells>Payment link</TableCells>
                  <TableCells>Status</TableCells>
                  <TableCells>Created At</TableCells>
                  <TableCells align="right"></TableCells>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((item) => {
                    const isSelected = selected.includes(item?.proposalId);
                    const createdAt = format(parseISO(item?.createdAt), "dd/MM/yyyy HH:mm");

                    return (
                      <TableRow
                        hover
                        key={item?.proposalId}
                        selected={isSelected}
                        sx={{
                          cursor: "pointer",
                          textDecoration: "none",
                        }}
                        component={Link}
                        href={`/payment-link/${item?._id}`}
                        onClick={() => {
                          onClickHandler();
                        }}
                      >
                        <TableCelles>{item?.customTransactionId?.transactionNumber || "-"}</TableCelles>
                        <TableCelles>
                          <Tooltip title={"Check history"}>
                            <Typography
                              sx={{
                                fontSize: { xl: "12.5px", xs: "11.5px" },
                                cursor: "pointer",
                                width: "max-content",
                                fontWeight: 700,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onHistorySelect(item?._id, item?.user?._id);
                              }}
                            >
                              {item?.orderRef}
                            </Typography>
                          </Tooltip>{" "}
                        </TableCelles>
                        <TableCelles>{item?.authReferenceNumber || "-"}</TableCelles>
                        <TableCelles>{item?.userId?.fullName}</TableCelles>
                        <TableCelles>{`AED ${formatNumber(item?.billAmount)}`}</TableCelles>
                        <TableCelles>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 0.8, width: "max-content" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (item?.paymentLink) {
                                navigator.clipboard.writeText(item?.paymentLink);
                                toast.success("Copy-link To Clipboard", {
                                  position: "top-center",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                });
                              } else {
                                toast.error("Link not available!", {
                                  position: "top-center",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                                });
                              }
                            }}
                          >
                            <InsertLinkIcon /> Copy
                          </Box>
                        </TableCelles>
                        <TableCelles>
                          <SeverityPill
                            sx={{ fontSize: "10px" }}
                            color={item?.status == "SUCCESS" ? "success" : "error"}
                          >
                            {item?.status == "SUCCESS" ? "Success" : "Pending"}
                          </SeverityPill>
                        </TableCelles>
                        <TableCelles>{createdAt}</TableCelles>

                        <TableCelles align="right">
                          <IconButton
                            onClick={(e) => {
                              router.push(`/payment-link/${item?._id}`);
                            }}
                          >
                            <ArrowRight fontSize="small" />
                          </IconButton>
                        </TableCelles>
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

export default PaymentLinksTable;
