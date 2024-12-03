import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Scrollbar } from "src/components/scrollbar";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import Link from "next/link";
function HealthAgentPerfomance({ handleClose, healthAgentWiseList, agentData }) {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          cursor: "pointer",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
          <Typography variant="h6">Agent wise Information</Typography>
          <Box onClick={() => handleClose()}>
            <CloseIcon />
          </Box>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Agent Name</TableCell>
              <TableCell>No of Proposals</TableCell>
              <TableCell>No of Quotations</TableCell>
              <TableCell>No of Policies</TableCell>
              <TableCell>Conversion Ratio</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <>
              <TableRow sx={{ cursor: "default" }}>
                <TableCell>{agentData?.fullName || "-"}</TableCell>
                <TableCell>{agentData?.noOfProposals || "0"}</TableCell>
                <TableCell>{agentData?.noOfQuotes || "0"}</TableCell>
                <TableCell>{agentData?.noOfPolicies || "0"}</TableCell>
                <TableCell>{agentData?.conversionRatio ? `${agentData?.conversionRatio}%` : "0%"}</TableCell>
              </TableRow>
            </>
          </TableBody>
        </Table>
        <Scrollbar>
          <Box sx={{ minWidth: 700, mt: 3 }}>
            {healthAgentWiseList?.proposalsPolicy ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Proposals No</TableCell>
                    <TableCell>Policy No</TableCell>
                    <TableCell>Time (H:M)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <>
                    {healthAgentWiseList?.proposalsPolicy?.map((ele, index) => {
                      return (
                        <TableRow key={index} sx={{ cursor: "default" }}>
                          <TableCell>
                            <Tooltip title="Visit Proposal">
                              <Typography
                                component={Link}
                                href={`/health-insurance/proposals/${ele?.policy?.quote?.proposalNo}`}
                                sx={{
                                  fontSize: 14,
                                  cursor: "pointer",
                                  width: "max-content",
                                  textDecoration: "none",
                                  color: "black",
                                  "&:hover": {
                                    color: "#60176F",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "3px",
                                  },
                                }}
                              >
                                {ele?.policy?.quote?.proposalNo || "-"}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Visit Policy">
                              <Typography
                                component={Link}
                                href={`/health-insurance/policies/${ele?.policy?._id}`}
                                sx={{
                                  fontSize: 14,
                                  cursor: "pointer",
                                  width: "max-content",
                                  textDecoration: "none",
                                  color: "black",
                                  "&:hover": {
                                    color: "#60176F",
                                    textDecoration: "underline",
                                    textUnderlineOffset: "3px",
                                  },
                                }}
                              >
                                {ele?.policy?.companyPolicyNumber || ele?.policy?.policyNumber || "-"}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {`${ele?.hours || 0} h `} {`${ele?.minues} m`}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                </TableBody>
              </Table>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Card>
    </Box>
  );
}

export default HealthAgentPerfomance;
