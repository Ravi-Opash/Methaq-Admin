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
import { setContractorPlantMachinerySearchFilter } from "./Reducer/contractorPlantMachinerySlice";

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

export default function ContractorPlantMachineryListTable(props) {
  const {
    count = 0,
    item = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    contractorePlanetMachinerySearchFilter = {},
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // store scroll position
  const onClickHandler = () => {
    dispatch(
      setContractorPlantMachinerySearchFilter({
        ...contractorePlanetMachinerySearchFilter,
        scrollPosition: window?.scrollY,
      })
    );
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Commercial No</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item?.map((commercial) => {
                const createdAt = format(parseISO(commercial?.createdAt), "dd/MM/yyyy HH:mm");
                return (
                  <>
                    <TableRow
                      sx={{
                        textDecoration: "none",
                        backgroundColor:
                          commercial?.proposalId?.proposalStatus === "Un Attended"
                            ? "rgba(255, 0, 0, 0.1)"
                            : commercial?.proposalId?.proposalStatus === "Customer contacted" &&
                              commercial?.proposalId?.reason === "Didn’t pick up"
                            ? "rgba(255,255,0,0.15)"
                            : commercial?.proposalId?.proposalStatus === "Referred to insurance company" ||
                              commercial?.proposalId?.proposalStatus === "Customer contacted" ||
                              commercial?.proposalId?.proposalStatus === "Customer Didn't picked up" ||
                              commercial?.proposalId?.proposalStatus === "Document Requested" ||
                              commercial?.proposalId?.proposalStatus === "Under Process" ||
                              commercial?.proposalId?.proposalStatus === "Customer Picked"
                            ? "rgba(255,165,0, 0.15)"
                            : commercial?.proposalId?.proposalStatus === "Lost"
                            ? "rgba(255, 0, 0, 0.1)"
                            : "rgba(255, 0, 0, 0.1)",
                        "&:hover": {
                          backgroundColor:
                            commercial?.proposalId?.proposalStatus === "Un Attended"
                              ? "rgba(255, 0, 0, 0.2) !important"
                              : commercial?.proposalId?.proposalStatus === "Customer contacted" &&
                                commercial?.proposalId?.reason === "Didn’t pick up"
                              ? "rgba(255,255,0,0.3) !important"
                              : commercial?.proposalId?.proposalStatus === "Referred to insurance company" ||
                                commercial?.proposalId?.proposalStatus === "Customer contacted" ||
                                commercial?.proposalId?.proposalStatus === "Customer Didn't picked up" ||
                                commercial?.proposalId?.proposalStatus === "Document Requested" ||
                                commercial?.proposalId?.proposalStatus === "Under Process" ||
                                commercial?.proposalId?.proposalStatus === "Customer Picked"
                              ? "rgba(255,165,0, 0.25) !important"
                              : commercial?.proposalId?.proposalStatus === "Lost"
                              ? "rgba(255, 0, 0, 0.2) !important"
                              : "rgba(255, 0, 0, 0.2) !important",
                        },
                        cursor: "pointer",
                      }}
                      href={`/contractor-plant-machinery/${commercial?.contractorPlantNumber}`}
                      onClick={() => onClickHandler()}
                      component={Link}
                    >
                      <TableCell>{commercial?.contractorPlantNumber}</TableCell>
                      <TableCell>{commercial?.fullName}</TableCell>
                      <TableCell>{commercial?.email}</TableCell>
                      <TableCell>{commercial?.mobileNumber}</TableCell>
                      <TableCell>
                        {commercial?.proposalId?.proposalStatus === "Un Attended" ? (
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
                        ) : commercial?.proposalId?.proposalStatus === "Customer contacted" &&
                          commercial?.proposalId?.reason === "Didn’t pick up" ? (
                          <StyledTooltip
                            sx={{
                              backgroundColor: "#ffff00",
                              color: "#000",
                            }}
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={`${commercial?.proposalId?.proposalStatus} - ${commercial?.proposalId?.reason}`}
                          >
                            <CircleFill
                              sx={{
                                color: "#ffff00",
                                opacity: 1,
                                fontSize: "22px",
                              }}
                            />
                          </StyledTooltip>
                        ) : commercial?.proposalId?.proposalStatus === "Referred to insurance company" ||
                          commercial?.proposalId?.proposalStatus === "Customer contacted" ||
                          commercial?.proposalId?.proposalStatus === "Customer Didn't picked up" ||
                          commercial?.proposalId?.proposalStatus === "Document Requested" ||
                          commercial?.proposalId?.proposalStatus === "Under Process" ||
                          commercial?.proposalId?.proposalStatus === "Customer Picked" ? (
                          <StyledTooltip
                            sx={{
                              backgroundColor: "#FFA500",
                            }}
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={
                              commercial?.proposalId?.reason
                                ? `${commercial?.proposalId?.proposalStatus} - ${commercial?.proposalId?.reason}`
                                : `${commercial?.proposalId?.proposalStatus}`
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
                        ) : commercial?.proposalId?.proposalStatus === "Lost" ? (
                          <StyledTooltip
                            sx={{
                              backgroundColor: "rgba(255, 0, 0, 0.8)",
                            }}
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={`${commercial?.proposalId?.proposalStatus} - ${commercial?.proposalId?.reason}`}
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
                            title={`${commercial?.proposalId?.proposalStatus || "Un Attended"}`}
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
