import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Fade,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { formatNumber } from "src/utils/formatNumber";
import { CircleFill } from "src/Icons/CircleFill";
import { CrossSvg } from "src/Icons/CrossSvg";
import { SeverityPill } from "src/components/severity-pill";
import { useDispatch } from "react-redux";
import { setAdminProposalVisitHistory } from "./Action/proposalsAction";
import { styled } from "@mui/system";
import { setProposalDetailsFromTable, setProposalSerchFilter } from "./Reducer/proposalsSlice";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Link from "next/link";

const ToBeStyledTooltip = ({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ tooltip: className }}
    slotProps={{
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -10],
            },
          },
        ],
      },
    }}
  />
);
const StyledTooltip = styled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: "#f5f5f9",
  color: "#fff",
  fontWeight: 600,
  border: "1px solid white",
}));
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

const ProposalsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    handleExportUserInfoToBot = () => {},
    onRowsPerPageChange,
    onHistorySelect,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    proposalSearchFilter = {},
  } = props;

  const dispatch = useDispatch();

  const onClickHandler = (id, detail) => {
    dispatch(setProposalDetailsFromTable(detail));
    dispatch(setAdminProposalVisitHistory(id))
      .unwrap()
      .then((res) => {
      })
      .catch((err) => {
        console.log(err, "err");
      });
    dispatch(setProposalSerchFilter({ ...proposalSearchFilter, scrollPosition: window?.scrollY }));
  };
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCells>REF</TableCells>
                  <TableCells>Customer</TableCells>
                  <TableCells>Mobile No.</TableCells>
                  <TableCells>Car</TableCells>
                  <TableCells>Value</TableCells>
                  <TableCells>Created By / Assign to</TableCells>
                  <TableCells>Export User</TableCells>
                  <TableCells>Source</TableCells>
                  <TableCells>Is Paid</TableCells>
                  <TableCells>Status</TableCells>
                  <TableCells>Created At</TableCells>
                  <TableCells align="right"></TableCells>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((item) => {
                    const isSelected = selected.includes(item?.proposalId);
                    const IssueDate = format(parseISO(item?.quotesCreatedAt), "dd/MM/yyyy HH:mm");

                    return (
                      <TableRow
                        component={Link}
                        href={`/proposals/${item?.proposalId}`}
                        hover
                        key={item?.proposalId}
                        selected={isSelected}
                        sx={{
                          textDecoration: "none",
                          cursor: "pointer",
                          backgroundColor:
                            item?.policies?.[0]?.status == "Active"
                              ? "rgba(0, 0, 255, 0.1)"
                              : item?.policies?.length > 0
                              ? "rgba(255,165,0, 0.15)"
                              : item?.proposalStatus === "Un Attended"
                              ? "rgba(255, 0, 0, 0.1)"
                              : item?.proposalStatus === "Customer contacted" && item?.reason === "Didn’t pick up"
                              ? "rgba(255,255,0,0.15)"
                              : item?.proposalStatus === "Referred to insurance company" ||
                                item?.proposalStatus === "Customer contacted" ||
                                item?.proposalStatus === "Customer Didn't picked up" ||
                                item?.proposalStatus === "Document Requested" ||
                                item?.proposalStatus === "Under Process" ||
                                item?.proposalStatus === "Customer Picked"
                              ? "rgba(255,165,0, 0.15)"
                              : item?.proposalStatus === "Lost"
                              ? "rgba(255, 0, 0, 0.1)"
                              : "rgba(255, 0, 0, 0.1)",
                          "&:hover": {
                            backgroundColor:
                              item?.policies?.[0]?.status == "Active"
                                ? "rgba(0, 0, 255, 0.2) !important"
                                : item?.policies?.length > 0
                                ? "rgba(255,165,0, 0.25) !important"
                                : item?.proposalStatus === "Un Attended"
                                ? "rgba(255, 0, 0, 0.2) !important"
                                : item?.proposalStatus === "Customer contacted" && item?.reason === "Didn’t pick up"
                                ? "rgba(255,255,0,0.3) !important"
                                : item?.proposalStatus === "Referred to insurance company" ||
                                  item?.proposalStatus === "Customer contacted" ||
                                  item?.proposalStatus === "Customer Didn't picked up" ||
                                  item?.proposalStatus === "Document Requested" ||
                                  item?.proposalStatus === "Under Process" ||
                                  item?.proposalStatus === "Customer Picked"
                                ? "rgba(255,165,0, 0.25) !important"
                                : item?.proposalStatus === "Lost"
                                ? "rgba(255, 0, 0, 0.2) !important"
                                : "rgba(255, 0, 0, 0.2) !important",
                          },
                        }}
                        onClick={() => {
                          onClickHandler(item?.proposalId, item);
                        }}
                      >
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
                                e?.stopPropagation();
                                e?.preventDefault();
                                onHistorySelect(item?.proposalId, item?.car?._id, item?.user?._id);
                              }}
                            >
                              {item?.proposalId}
                            </Typography>
                          </Tooltip>
                        </TableCelles>
                        <TableCelles>{item?.user?.fullName}</TableCelles>
                        <TableCelles>{item?.user?.mobileNumber}</TableCelles>
                        <TableCelles>{`${item?.car?.make} ${item?.car?.model}`}</TableCelles>
                        <TableCelles>{`AED ${formatNumber(item?.car?.price)}`}</TableCelles>
                        <TableCelles>{item?.admin?.fullName || "-"}</TableCelles>
                        <TableCelles>
                          <IconButton
                            onClick={(e) => {
                              e?.stopPropagation();
                              e?.preventDefault();
                              handleExportUserInfoToBot(item?.user, item?.admin);
                            }}
                          >
                            <ExitToAppIcon sx={{ color: "#60176F", fontSize: { xl: 25, xs: 20 } }} />
                          </IconButton>
                        </TableCelles>
                        <TableCelles>{item?.source || "-"}</TableCelles>
                        <TableCelles>
                          <SeverityPill sx={{ fontSize: "10px" }} color={item?.paymentId ? "success" : "error"}>
                            {item?.paymentId ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCelles>

                        <TableCelles>
                          {item?.policies?.[0]?.status == "Active" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(0, 0, 255, 0.8)",
                              }}
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="Policy Issued"
                            >
                              <CircleFill
                                sx={{
                                  color: "rgba(0, 0, 255, 0.8)",
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          ) : item?.policies?.length > 0 ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#FFA500",
                              }}
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="Policy Generated"
                            >
                              <CircleFill
                                sx={{
                                  color: "#FFA500",
                                  opacity: 0.8,
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          ) : item?.proposalStatus === "Un Attended" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="Un Attended"
                            >
                              <CircleFill
                                sx={{
                                  color: "rgba(255, 0, 0, 0.8)",
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          ) : item?.proposalStatus === "Customer contacted" && item?.reason === "Didn’t pick up" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#ffff00",
                                color: "#000",
                              }}
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title={`${item?.proposalStatus} - ${item?.reason}`}
                            >
                              <CircleFill
                                sx={{
                                  color: "#ffff00",
                                  opacity: 1,
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          ) : item?.proposalStatus === "Referred to insurance company" ||
                            item?.proposalStatus === "Customer contacted" ||
                            item?.proposalStatus === "Customer Didn't picked up" ||
                            item?.proposalStatus === "Document Requested" ||
                            item?.proposalStatus === "Under Process" ||
                            item?.proposalStatus === "Customer Picked" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#FFA500",
                              }}
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title={
                                item?.reason ? `${item?.proposalStatus} - ${item?.reason}` : `${item?.proposalStatus}`
                              }
                            >
                              <CircleFill
                                sx={{
                                  color: "#FFA500",
                                  opacity: 0.8,
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          ) : item?.proposalStatus === "Lost" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title={`${item?.proposalStatus} - ${item?.reason}`}
                            >
                              <CrossSvg
                                sx={{
                                  color: "red",
                                  opacity: 0.8,
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          ) : (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${item?.proposalStatus || "Un Attended"}`}
                            >
                              <CircleFill
                                sx={{
                                  color: "rgba(255, 0, 0, 0.8)",
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          )}
                        </TableCelles>
                        <TableCelles>{IssueDate}</TableCelles>

                        <TableCelles align="right">
                          <ArrowRight fontSize="small" sx={{ color: "#707070" }} />
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

export default ProposalsTable;
