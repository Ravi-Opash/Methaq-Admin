import { Box, Table, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";
import { Scrollbar } from "src/components/scrollbar";

const CreateProposalQuotationTabel = () => {
  return (
    <>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                mb: 0,
                pl: 1,
                fontWeight: "600",
                fontSize: "18px",
                display: "inline-block",
                color: "#8D8E8D",
              }}
            >
              Fill up the information below to get quotations
            </Typography>
          </Box>
        </Box>
      </Scrollbar>
    </>
  );
};

export default CreateProposalQuotationTabel;
