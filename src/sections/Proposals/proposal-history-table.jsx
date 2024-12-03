import React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

const ProposalHistoryTable = (props) => {
  const { items = [] } = props;
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 700 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Done By</TableCell>
                  <TableCell>Activity Name</TableCell>
                  <TableCell>Activity Time</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 ? (
                  items?.map((p, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>{p?.doneBy?.fullName}</TableCell>
                        <TableCell>{p?.activityName}</TableCell>
                        <TableCell>
                          {isValid(parseISO(p?.activityTime))
                            ? format(parseISO(p?.activityTime), "dd-MM-yyyy HH:mm")
                            : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <Typography sx={{ m: 2, fontSize: "15px", color: "#707070" }}>
                    There is no history to show.
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

export default ProposalHistoryTable;
