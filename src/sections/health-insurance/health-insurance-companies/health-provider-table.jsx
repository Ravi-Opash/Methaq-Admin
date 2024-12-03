import React from "react";
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

const ProviderSelectTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    handleProviderSelect,
    selectedProvider = [],
  } = props;

  return (
    <>
      <Box sx={{ my: 3 }}>
        <Card>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ref No.</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Provider name</TableCell>
                    <TableCell>Emirate</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell sx={{ textAlign: "end" }}>Select</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items?.map((provider) => {
                    let match = selectedProvider?.find((i) => i?._id == provider?._id);

                    return (
                      <TableRow hover>
                        <TableCell>{provider?.refNo}</TableCell>
                        <TableCell>{provider?.providerCode}</TableCell>
                        <TableCell sx={{ minWidth: 500 }}>{provider?.providerName}</TableCell>
                        <TableCell>{provider?.emirate}</TableCell>
                        <TableCell>{provider?.providerType}</TableCell>
                        <TableCell sx={{ textAlign: "end" }}>
                          <Checkbox
                            checked={match ? true : false}
                            onChange={(e) => {
                              handleProviderSelect(provider);
                            }}
                          />
                        </TableCell>
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
      </Box>
    </>
  );
};

export default ProviderSelectTable;
