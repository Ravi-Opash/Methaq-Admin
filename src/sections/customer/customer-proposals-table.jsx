import React, { useState } from "react";
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

const CustomerProposalsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteCustomerHandler,
    changeStatusHandler,
    searchFilter,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>REF</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>No. of quotes</TableCell>
                  <TableCell>Car</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Expired At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default CustomerProposalsTable;
