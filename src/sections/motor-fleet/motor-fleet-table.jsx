import React, { useState } from "react";
import {
  Box,
  Card,
  Fade,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { CircleFill } from "src/Icons/CircleFill";
import { CrossSvg } from "src/Icons/CrossSvg";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { SeverityPill } from "src/components/severity-pill";
import { setMotorFleetAdminProposalVisitHistory } from "./Policies/action/motorFleetPoliciesAction";

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
    TransitionComponent={Fade}
    TransitionProps={{ timeout: 600 }}
  />
);
const StyledTooltip = styled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: "#f5f5f9",
  color: "#fff",
  fontWeight: 600,
  border: "1px solid white",
}));

const MotorFleetTable = (props) => {
  const dispatch = useDispatch();
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    searchFilter,
    selected = [],
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);

  const router = useRouter();

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal No</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Is Paid</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((ele) => {
                    const isSelected = selected.includes(ele?._id);
                    const createdAt = format(parseISO(ele?.createdAt), "dd/MM/yyyy HH:mm");
                    return (
                      <TableRow
                        sx={{
                          backgroundColor:
                            ele?.policyId?.status == "Active"
                              ? "rgba(0, 0, 255, 0.1)"
                              : ele?.policyId
                              ? "rgba(255,165,0, 0.15)"
                              : ele?.proposalId?.proposalStatus === "Un Attended"
                              ? "rgba(255, 0, 0, 0.1)"
                              : ele?.proposalId?.proposalStatus === "Customer contacted" && ele?.proposalId?.reason === "Didn’t pick up"
                              ? "rgba(255,255,0,0.15)"
                              : ele?.proposalId?.proposalStatus === "Referred to insurance company" ||
                                ele?.proposalId?.proposalStatus === "Customer contacted" ||
                                ele?.proposalId?.proposalStatus === "Customer Didn't picked up" ||
                                ele?.proposalId?.proposalStatus === "Document Requested" ||
                                ele?.proposalId?.proposalStatus === "Under Process" ||
                                ele?.proposalId?.proposalStatus === "Customer Picked"
                              ? "rgba(255,165,0, 0.15)"
                              : ele?.proposalId?.proposalStatus === "Lost"
                              ? "rgba(255, 0, 0, 0.1)"
                              : "rgba(255, 0, 0, 0.1)",
                          "&:hover": {
                            backgroundColor:
                              ele?.policyId?.status == "Active"
                                ? "rgba(0, 0, 255, 0.2) !important"
                                : ele?.policyId
                                ? "rgba(255,165,0, 0.25) !important"
                                : ele?.proposalId?.proposalStatus === "Un Attended"
                                ? "rgba(255, 0, 0, 0.2)"
                                : ele?.proposalId?.proposalStatus === "Customer contacted" && ele?.proposalId?.reason === "Didn’t pick up"
                                ? "rgba(255,255,0,0.30)"
                                : ele?.proposalId?.proposalStatus === "Referred to insurance company" ||
                                  ele?.proposalId?.proposalStatus === "Customer contacted" ||
                                  ele?.proposalId?.proposalStatus === "Customer Didn't picked up" ||
                                  ele?.proposalId?.proposalStatus === "Document Requested" ||
                                  ele?.proposalId?.proposalStatus === "Under Process" ||
                                  ele?.proposalId?.proposalStatus === "Customer Picked"
                                ? "rgba(255,165,0, 0.25)"
                                : ele?.proposalId?.proposalStatus === "Lost"
                                ? "rgba(255, 0, 0, 0.2)"
                                : "rgba(255, 0, 0, 0.2)",
                          },
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          router.push(`/motor-fleet/proposals/${ele?.proposalId?.proposalId}`);
                          dispatch(setMotorFleetAdminProposalVisitHistory(ele?.proposalId?.proposalId));
                        }}
                      >
                        <TableCell>{ele?.proposalId?.proposalId}</TableCell>
                        <TableCell>{ele?.companyName}</TableCell>
                        <TableCell>
                          <SeverityPill sx={{ fontSize: "10px" }} color={ele?.proposalId?.isPaid ? "success" : "error"}>
                            {ele?.proposalId?.isPaid ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>

                        <TableCell>
                          {ele?.policyId?.status == "Active" ? (
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
                          ) : ele?.policyId ? (
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
                          ) : ele?.proposalId?.proposalStatus === "Un Attended" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalId?.proposalStatus}`}
                            >
                              <CircleFill sx={{ color: "rgba(255, 0, 0, 0.8)", fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalId?.proposalStatus === "Customer contacted" && ele?.proposalId?.reason === "Didn’t pick up" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#ffff00",
                                color: "#000",
                              }}
                              title={`${ele?.proposalId?.proposalStatus} - ${ele?.proposalId?.reason}`}
                            >
                              <CircleFill sx={{ color: "#ffff00", opacity: 1, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalId?.proposalStatus === "Referred to insurance company" ||
                            ele?.proposalId?.proposalStatus === "Customer contacted" ||
                            ele?.proposalId?.proposalStatus === "Customer Didn't picked up" ||
                            ele?.proposalId?.proposalStatus === "Document Requested" ||
                            ele?.proposalId?.proposalStatus === "Under Process" ||
                            ele?.proposalId?.proposalStatus === "Customer Picked" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#FFA500",
                              }}
                              title={ele?.proposalId?.reason ? `${ele?.proposalId?.proposalStatus} - ${ele?.proposalId?.reason}` : `${ele?.proposalId?.proposalStatus}`}
                            >
                              <CircleFill sx={{ color: "#FFA500", opacity: 0.8, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalId?.proposalStatus === "Lost" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalId?.proposalStatus} - ${ele?.proposalId?.reason}`}
                            >
                              <CrossSvg sx={{ color: "red", opacity: 0.8, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalId?.proposalStatus || "Un Attended"}`}
                            >
                              <CircleFill sx={{ color: "rgba(255, 0, 0, 0.8)", fontSize: "22px" }} />
                            </StyledTooltip>
                          )}
                        </TableCell>
                        <TableCell>{createdAt}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "travelQuote.read") && (
                            <NextLink href={`/motor-fleet/proposals/${ele?.proposalId?.proposalId}`} passHref>
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

export default MotorFleetTable;
