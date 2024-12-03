import React from "react";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { format, parseISO } from "date-fns";

const HealthProposalCommentsTable = (props) => {
  const { items = [] } = props;

  return (
    <>
      <Card
      >
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Comment</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 ? (
                  items?.map((item) => {
                    const createdAt = format(parseISO(item?.createdAt), "dd/MM/yyyy");
                    return (
                      <TableRow hover key={item?.key}>
                        <TableCell>{item?.adminName}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                        <TableCell>{item?.comment}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>No data found!</Box>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default HealthProposalCommentsTable;
