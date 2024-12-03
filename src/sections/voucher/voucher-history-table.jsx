import React from "react";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { Scrollbar } from "src/components/scrollbar";

const VoucherHistoryTable = (props) => {
  const { count = 0, items = [], onPageChange = () => {}, onRowsPerPageChange, page = 0, rowsPerPage = 0 } = props;

  return (
    <>
      <Card sx={{ mb: 8 }}>
        <CardHeader title="Voucher History" />
        <Divider />
        <Scrollbar>
          <Box sx={{ minWidth: 600, mx: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal No</TableCell>
                  <TableCell>Applied By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((history) => {
                    const createdAt = format(parseISO(history?.createdAt), "dd/MM/yyyy HH:mm");
                    return (
                      <TableRow hover key={history?._id}>
                        <TableCell>{history?.proposalId}</TableCell>
                        <TableCell>
                          {history?.admin
                            ? `${history?.admin?.fullName} (Admin)`
                            : history?.user
                            ? `${history?.user?.fullName} (Web)`
                            : "-"}
                        </TableCell>
                        <TableCell>{history?.policy ? "Added and Used" : "Added Only"}</TableCell>
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

export default VoucherHistoryTable;
