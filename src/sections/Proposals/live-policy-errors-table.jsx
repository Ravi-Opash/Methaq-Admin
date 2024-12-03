import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import NextLink from "next/link";
import { Box, Card, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";

const LivePolicyErrorsTable = (props) => {
  const { items = [] } = props;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 ? (
                  items?.map((p, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>{p?.companyName}</TableCell>
                        <TableCell>
                          {p?.autoInsuranceType == "thirdparty"
                            ? "Third Party"
                            : p?.autoInsuranceType == "comprehensive"
                            ? "Comprehensive"
                            : "-"}
                        </TableCell>
                        <TableCell>{p?.errorMessage}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <Typography sx={{ m: 2, fontSize: "15px", color: "#707070" }}>
                    There is no any error in any quotes.
                  </Typography>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default LivePolicyErrorsTable;
