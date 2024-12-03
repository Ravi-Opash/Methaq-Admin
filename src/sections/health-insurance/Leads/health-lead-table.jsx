import React from "react";
import { Box, Card, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { format, isValid, parseISO } from "date-fns";

const HealthLeadsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile No</TableCell>
                  <TableCell>Nationality</TableCell>
                  <TableCell>Date Of Birth</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((ele) => {
                    const isSelected = selected.includes(ele?._id);
                    const createdAt = format(parseISO(ele?.createdAt), "dd/MM/yyyy");
                    return (
                      <TableRow>
                        <TableCell>{ele?.userId?.fullName}</TableCell>
                        <TableCell>{ele?.userId?.email}</TableCell>
                        <TableCell>{ele?.userId?.mobileNumber}</TableCell>
                        <TableCell>{ele?.userId?.nationality}</TableCell>
                        <TableCell>
                          {isValid(parseISO(ele?.userId?.dateOfBirth))
                            ? format(parseISO(ele?.userId?.dateOfBirth), "dd-MM-yyy")
                            : ""}
                        </TableCell>
                        <TableCell>{createdAt}</TableCell>
                      </TableRow>
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
    </>
  );
};

export default HealthLeadsTable;
