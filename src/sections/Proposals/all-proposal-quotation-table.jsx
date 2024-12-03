import { Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import { Scrollbar } from "src/components/scrollbar";

const AllProposalQuotationTable = (props) => {
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
    selectItemHandler,
    selectItem,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    isActionHide,
  } = props;

  return (
    <>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>No.</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items?.length > 0 &&
                items?.map((item) => {
                  //   const isSelected = selectItem === item?._id ? true : false;
                  return (
                    <TableRow hover key={item?._id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          //   checked={isSelected}
                          //   onChange={(event) => {
                          //     if (event.target.checked) {
                          //       selectItemHandler(item?._id);
                          //     } else {
                          //       selectItemHandler("");
                          //     }
                          //   }}

                          checked={selectItem.includes(item?._id)}
                          onChange={() => selectItemHandler(item?._id)}
                        />
                      </TableCell>

                      <TableCell>{item?.proposalId}</TableCell>
                      <TableCell>{item?.company?.companyName}</TableCell>
                      <TableCell>{item?.insuranceType}</TableCell>
                      <TableCell>{`AED ${item?.price}`}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </>
  );
};

export default AllProposalQuotationTable;
