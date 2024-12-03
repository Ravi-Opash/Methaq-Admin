import { ArrowRight } from "src/Icons/ArrowRight";
import {
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
  styled,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

import { Scrollbar } from "src/components/scrollbar";
import { format, parseISO } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { CircleFill } from "src/Icons/CircleFill";
import { CrossSvg } from "src/Icons/CrossSvg";
import Link from "next/link";
import { setMedicalMalPracticeSearchFilter } from "./Reducer/medicalmalepracticeSlice";

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

export default function MedicalMalpracticeListTable(props) {
  const {
    count = 0,
    item = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    medicalMalPracticeSearchFilter = {},
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setMedicalMalPracticeSearchFilter({ ...medicalMalPracticeSearchFilter, scrollPosition: window?.scrollY }));
  };
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Commercial No</TableCell>
                <TableCell>Policy Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item?.map((ele) => {
                const createdAt = format(parseISO(ele?.createdAt), "dd/MM/yyyy");
                return (
                  <>
                    <TableRow
                      sx={{
                        textDecoration: "none",
                        // conditions bassed status
                        backgroundColor:
                          ele?.proposalId?.proposalStatus === "Un Attended"
                            ? "rgba(255, 0, 0, 0.1)"
                            : ele?.proposalId?.proposalStatus === "Customer contacted" &&
                              ele?.proposalId?.reason === "Didn’t pick up"
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
                            ele?.proposalId?.proposalStatus === "Un Attended"
                              ? "rgba(255, 0, 0, 0.2) !important"
                              : ele?.proposalId?.proposalStatus === "Customer contacted" &&
                                ele?.proposalId?.reason === "Didn’t pick up"
                              ? "rgba(255,255,0,0.3) !important"
                              : ele?.proposalId?.proposalStatus === "Referred to insurance company" ||
                                ele?.proposalId?.proposalStatus === "Customer contacted" ||
                                ele?.proposalId?.proposalStatus === "Customer Didn't picked up" ||
                                ele?.proposalId?.proposalStatus === "Document Requested" ||
                                ele?.proposalId?.proposalStatus === "Under Process" ||
                                ele?.proposalId?.proposalStatus === "Customer Picked"
                              ? "rgba(255,165,0, 0.25) !important"
                              : ele?.proposalId?.proposalStatus === "Lost"
                              ? "rgba(255, 0, 0, 0.2) !important"
                              : "rgba(255, 0, 0, 0.2) !important",
                        },
                        cursor: "pointer",
                      }}
                      href={`/medical-malpractice/${ele?.medicalMalpracticeNumber}`}
                      component={Link}
                      onClick={() => onClickHandler()}
                    >
                      <TableCell>{ele?.medicalMalpracticeNumber}</TableCell>
                      <TableCell>{ele?.policyType}</TableCell>
                      <TableCell>{ele?.email}</TableCell>
                      <TableCell>{ele?.mobileNumber}</TableCell>
                      <TableCell>
                        {ele?.proposalId?.proposalStatus === "Un Attended" ? (
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
                        ) : ele?.proposalId?.proposalStatus === "Customer contacted" &&
                          ele?.proposalId?.reason === "Didn’t pick up" ? (
                          <StyledTooltip
                            sx={{
                              backgroundColor: "#ffff00",
                              color: "#000",
                            }}
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={`${ele?.proposalId?.proposalStatus} - ${ele?.proposalId?.reason}`}
                          >
                            <CircleFill
                              sx={{
                                color: "#ffff00",
                                opacity: 1,
                                fontSize: "22px",
                              }}
                            />
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
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={
                              ele?.proposalId?.reason
                                ? `${ele?.proposalId?.proposalStatus} - ${ele?.proposalId?.reason}`
                                : `${ele?.proposalId?.proposalStatus}`
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
                        ) : ele?.proposalId?.proposalStatus === "Lost" ? (
                          <StyledTooltip
                            sx={{
                              backgroundColor: "rgba(255, 0, 0, 0.8)",
                            }}
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={`${ele?.proposalId?.proposalStatus} - ${ele?.proposalId?.reason}`}
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
                            title={`${ele?.proposalId?.proposalStatus || "Un Attended"}`}
                          >
                            <CircleFill
                              sx={{
                                color: "rgba(255, 0, 0, 0.8)",
                                fontSize: "22px",
                              }}
                            />
                          </StyledTooltip>
                        )}
                      </TableCell>
                      <TableCell>{createdAt}</TableCell>
                      <TableCell>
                        {moduleAccess(user, "commercial.read") && (
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  </>
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
  );
}
