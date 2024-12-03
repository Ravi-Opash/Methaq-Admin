import React from "react";
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
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { CircleFill } from "src/Icons/CircleFill";
import { CrossSvg } from "src/Icons/CrossSvg";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { SeverityPill } from "src/components/severity-pill";
import { setHealthInfoId, setHealthProposalSerchFilter } from "./Proposals/Reducer/healthInsuranceSlice";
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

const HealthTable = (props) => {
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
    onHistorySelect,
    healthProposalSearchFilter = {},
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);

  const router = useRouter();

  const onClickHandler = () => {
    dispatch(setHealthProposalSerchFilter({ ...healthProposalSearchFilter, scrollPosition: window?.scrollY }));
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal No</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile No</TableCell>
                  <TableCell>Insurer Type</TableCell>
                  <TableCell>CREATED BY / ASSIGN TO</TableCell>
                  <TableCell>SOURCE</TableCell>
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
                        component={Link}
                        href={`/health-insurance/proposals/${ele?.proposalId}`}
                        sx={{
                          textDecoration: "none",
                          backgroundColor:
                            ele?.policyId?.[0]?.status == "Active"
                              ? "rgba(0, 0, 255, 0.1)"
                              : ele?.policyId?.length > 0
                              ? "rgba(255,165,0, 0.15)"
                              : ele?.proposalStatus === "Un Attended" && ele?.healthInfo?.city != "Abu Dhabi"
                              ? "#7B228150"
                              : ele?.proposalStatus === "Un Attended" && ele?.healthInfo?.city == "Abu Dhabi"
                              ? "rgba(255, 0, 0, 0.1)"
                              : ele?.proposalStatus === "Customer contacted" && ele?.reason === "Didn’t pick up"
                              ? "rgba(255,255,0,0.15)"
                              : ele?.proposalStatus === "Referred to insurance company" ||
                                ele?.proposalStatus === "Customer contacted" ||
                                ele?.proposalStatus === "Customer Didn't picked up" ||
                                ele?.proposalStatus === "Document Requested" ||
                                ele?.proposalStatus === "Under Process" ||
                                ele?.proposalStatus === "Customer Picked"
                              ? "rgba(255,165,0, 0.15)"
                              : ele?.proposalStatus === "Lost"
                              ? "rgba(255, 0, 0, 0.1)"
                              : ele?.healthInfo?.city != "Abu Dhabi"
                              ? "#7B228150"
                              : "rgba(255, 0, 0, 0.1)",
                          "&:hover": {
                            backgroundColor:
                              ele?.policyId?.[0]?.status == "Active"
                                ? "rgba(0, 0, 255, 0.2) !important"
                                : ele?.policyId?.length > 0
                                ? "rgba(255,165,0, 0.25) !important"
                                : ele?.proposalStatus === "Un Attended" && ele?.healthInfo?.city != "Abu Dhabi"
                                ? "#7B228150"
                                : ele?.proposalStatus === "Un Attended" && ele?.healthInfo?.city == "Abu Dhabi"
                                ? "rgba(255, 0, 0, 0.1)"
                                : ele?.proposalStatus === "Customer contacted" && ele?.reason === "Didn’t pick up"
                                ? "rgba(255,255,0,0.30)"
                                : ele?.proposalStatus === "Referred to insurance company" ||
                                  ele?.proposalStatus === "Customer contacted" ||
                                  ele?.proposalStatus === "Customer Didn't picked up" ||
                                  ele?.proposalStatus === "Document Requested" ||
                                  ele?.proposalStatus === "Under Process" ||
                                  ele?.proposalStatus === "Customer Picked"
                                ? "rgba(255,165,0, 0.25)"
                                : ele?.proposalStatus === "Lost"
                                ? "rgba(255, 0, 0, 0.2)"
                                : ele?.healthInfo?.city != "Abu Dhabi"
                                ? "#7B228150"
                                : "rgba(255, 0, 0, 0.2)",
                          },
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onClickHandler();
                          dispatch(setHealthInfoId(ele?.healthInfo?._id));
                        }}
                      >
                        <TableCell>
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
                                onHistorySelect(ele?.proposalId, ele?.user?._id);
                              }}
                            >
                              {ele?.proposalId}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{ele?.healthInfo?.fullName}</TableCell>
                        <TableCell>{ele?.healthInfo?.email}</TableCell>
                        <TableCell>{ele?.healthInfo?.mobileNumber}</TableCell>
                        <TableCell>{ele?.healthInfo?.insurerType}</TableCell>
                        <TableCell>{ele?.admin?.fullName}</TableCell>
                        <TableCell>{ele?.source}</TableCell>
                        <TableCell>
                          <SeverityPill
                            sx={{ fontSize: "10px" }}
                            color={ele?.paymentId?.length > 0 ? "success" : "error"}
                          >
                            {ele?.paymentId?.length > 0 ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          {ele?.policyId?.[0]?.status == "Active" ? (
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
                          ) : ele?.policyId?.length > 0 ? (
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
                          ) : ele?.proposalStatus === "Un Attended" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalStatus}`}
                            >
                              <CircleFill sx={{ color: "rgba(255, 0, 0, 0.8)", fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalStatus === "Customer contacted" && ele?.reason === "Didn’t pick up" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#ffff00",
                                color: "#000",
                              }}
                              title={`${ele?.proposalStatus} - ${ele?.reason}`}
                            >
                              <CircleFill sx={{ color: "#ffff00", opacity: 1, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalStatus === "Referred to insurance company" ||
                            ele?.proposalStatus === "Customer contacted" ||
                            ele?.proposalStatus === "Customer Didn't picked up" ||
                            ele?.proposalStatus === "Document Requested" ||
                            ele?.proposalStatus === "Under Process" ||
                            ele?.proposalStatus === "Customer Picked" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#FFA500",
                              }}
                              title={ele?.reason ? `${ele?.proposalStatus} - ${ele?.reason}` : `${ele?.proposalStatus}`}
                            >
                              <CircleFill sx={{ color: "#FFA500", opacity: 0.8, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalStatus === "Lost" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalStatus} - ${ele?.reason}`}
                            >
                              <CrossSvg sx={{ color: "red", opacity: 0.8, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalStatus || "Un Attended"}`}
                            >
                              <CircleFill sx={{ color: "rgba(255, 0, 0, 0.8)", fontSize: "22px" }} />
                            </StyledTooltip>
                          )}
                        </TableCell>
                        <TableCell>{createdAt}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "healthQuote.read") && (
                            <IconButton component="a">
                              <ArrowRight fontSize="small" />
                            </IconButton>
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

export default HealthTable;
