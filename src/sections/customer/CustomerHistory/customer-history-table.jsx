import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";

const CustomerHistoryTable = (props) => {
  const { items = [] } = props;


  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Activity Name</TableCell>
                  <TableCell>Activity Time</TableCell>
                  {/* <TableCell align="right">Actions</TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.policyHistory?.[0]?.activityType?.length > 0 ? (
                  items?.policyHistory?.[0]?.activityType?.map((item) => {
                    const createdAt = format(
                      parseISO(item?.activityTime),
                      "dd/MM/yyyy HH:mm"
                    );

                    return (
                      <TableRow hover key={item?._id}>
                        <TableCell>{item?.activityName}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                        {/* <TableCell align="right">
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", my: 2 }}
                    >
                      No data found!
                    </Box>
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

export default CustomerHistoryTable;
