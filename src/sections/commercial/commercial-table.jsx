import { ArrowRight } from "src/Icons/ArrowRight";
import { Card, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import NextLink from "next/link";

import { Scrollbar } from "src/components/scrollbar";
import { format, parseISO } from "date-fns";

export default function CommercialTable(props) {
  const { item = [] } = props;
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Commercial No</TableCell>
                <TableCell>Name Of project</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item?.map((commercial) => {
                const createdAt = format(parseISO(commercial?.createdAt), "dd/MM/yyyy");
                return (
                  <>
                    <TableRow>
                      <TableCell>{commercial?.commercialNumber}</TableCell>
                      <TableCell>{commercial?.principalName}</TableCell>
                      <TableCell>{commercial?.email}</TableCell>
                      <TableCell>{commercial?.mobileNumber}</TableCell>
                      <TableCell>{createdAt}</TableCell>
                      <TableCell>
                        <NextLink href={`/commercial/${commercial?._id}`}>
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
                        </NextLink>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
}
