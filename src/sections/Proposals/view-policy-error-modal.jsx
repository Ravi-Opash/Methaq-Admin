import {
  Box,
  Card,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { CopyIcon } from "src/Icons/CopyIcon";
import { convertObjToHtml } from "src/utils/object-to-html";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";

const ViewPolicyErrorModal = ({ handleClose, errorDetails, payloadDetail, loading }) => {
  const [copyText, setCopyText] = useState("");

  const copyToClipboard = (item, key) => {
    const textToCopy = JSON.stringify(item, null, 2);
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopyText(key);
        setTimeout(() => {
          setCopyText("");
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Card
          sx={{
            cursor: "pointer",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
            <Typography variant="h6">Policy Payload/Error</Typography>
            <Box onClick={() => handleClose()}>
              <CloseIcon />
            </Box>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payload/Error</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {errorDetails || payloadDetail?.companyPolicyPayloads ? (
                <>
                  {errorDetails && (
                    <TableRow sx={{ cursor: "default" }}>
                      <TableCell>
                        <Typography
                          sx={{ fontSize: "14px", color: "black", lineHeight: "9px", fontWeight: 600 }}
                          color="textSecondary"
                          variant="body2"
                        >
                          Error{" "}
                          <IconButton onClick={() => copyToClipboard(errorDetails, "error")}>
                            <CopyIcon sx={{ position: "relative" }} />
                            {copyText == "error" && (
                              <Card
                                sx={{
                                  zIndex: 3,
                                  fontSize: "12px",
                                  color: "#707070",
                                  position: "absolute",
                                  right: "-50px",
                                  borderRadius: "3px",
                                  boxShadow: "2px",
                                  p: 0.5,
                                }}
                              >
                                copied!
                              </Card>
                            )}
                          </IconButton>
                        </Typography>
                        <Box sx={{ maxHeight: 400, overflowY: "scroll", overflowX: "hidden" }}>
                          <JsonView data={errorDetails} shouldExpandNode={allExpanded} style={defaultStyles} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  {payloadDetail?.companyPolicyPayloads && (
                    <TableRow sx={{ cursor: "default" }}>
                      <TableCell>
                        <Typography
                          sx={{ fontSize: "14px", color: "black", lineHeight: "9px", fontWeight: 600 }}
                          color="textSecondary"
                          variant="body2"
                        >
                          Payload{" "}
                          <IconButton
                            onClick={() => copyToClipboard(payloadDetail?.companyPolicyPayloads || "", "payload")}
                          >
                            <CopyIcon sx={{ position: "relative" }} />
                            {copyText == "payload" && (
                              <Card
                                sx={{
                                  zIndex: 3,
                                  fontSize: "12px",
                                  color: "#707070",
                                  position: "absolute",
                                  right: "-50px",
                                  borderRadius: "3px",
                                  boxShadow: "2px",
                                  p: 0.5,
                                }}
                              >
                                copied!
                              </Card>
                            )}
                          </IconButton>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <Typography sx={{ fontSize: 14, py: 1, px: 2 }}> No data to show! </Typography>
              )}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </>
  );
};

export default ViewPolicyErrorModal;
