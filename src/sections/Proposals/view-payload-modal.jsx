import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { CrossSvg } from "src/Icons/CrossSvg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyIcon } from "src/Icons/CopyIcon";
import AnimationLoader from "src/components/amimated-loader";

const ViewPayloadModal = ({ handleClose, thirdPartyDetails, thirdPartyLoading }) => {
  // console.log(thirdPartyDetails, "thirdPartyDetails");
  const [copyText, setCopyText] = useState("");

  const copyToClipboard = (item, idx) => {
    const textToCopy = JSON.stringify(item.payload, null, 2);
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopyText(idx);
        // console.log("Copied to clipboard!");
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
            <Typography variant="h6">Third Party Details</Typography>
            <Box onClick={() => handleClose()}>
              <CloseIcon />
            </Box>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Copy</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <>
                {thirdPartyDetails?.companyPayloads?.map((item, idx) => {
                  let match = false;
                  if (idx === copyText) {
                    match = true;
                  }
                  // console.log(copyText, "pp");

                  return (
                    <TableRow key={idx} sx={{ cursor: "default" }}>
                      <TableCell>{item?.companyName}</TableCell>
                      <TableCell>
                        {item?.autoInsuranceType == "thirdparty"
                          ? "Third Party"
                          : item?.autoInsuranceType == "comprehensive"
                          ? "Comprehensive"
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ cursor: "pointer" }} onClick={() => copyToClipboard(item, idx)}>
                        <Box sx={{ display: "flex" }}>
                          <Box sx={{ width: "max-content" }}>
                            <IconButton>
                              <CopyIcon sx={{ position: "relative" }} />
                              {match && (
                                <Card
                                  sx={{
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
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            </TableBody>
          </Table>
        </Card>
      </Box>
    </>
  );
};

export default ViewPayloadModal;
