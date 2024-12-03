import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import NextLink from "next/link";
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
import { ArrowRight } from "src/Icons/ArrowRight";
import ModalComp from "src/components/modalComp";
import { useSelector } from "react-redux";
import { formatNumber } from "src/utils/formatNumber";

const CustomerPoliciesTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
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
                  <TableCell>Company</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Expired At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items
                    // ?.filter((item) => {
                    //   return searchFilter.toLowerCase() === ""
                    //     ? item?.response?.PolicyNumber
                    //     : item?.response?.PolicyNumber.toLowerCase().includes(searchFilter);
                    // })
                    ?.map((poly) => {
                      const isSelected = selected.includes(poly?._id);

                      let policyIssueDate = "";

                      if (isValid(parseISO(poly?.policyEffectiveDate))) {
                        policyIssueDate = format(parseISO(poly?.policyEffectiveDate), "dd/MM/yyyy");
                      }

                      let expireDate = "";

                      if (isValid(parseISO(poly?.policyExpiryDate))) {
                        expireDate = format(parseISO(poly?.policyExpiryDate), "dd/MM/yyyy");
                      }

                      return (
                        <TableRow hover key={poly?._id} selected={isSelected}>
                          <TableCell>{poly?.quote?.proposalNo}</TableCell>
                          <TableCell>{poly?.quote?.companyData?.companyName}</TableCell>
                          <TableCell>{poly?.healthInfoId?.insurerType}</TableCell>
                          <TableCell>{`AED ${formatNumber(poly?.quote?.price)}`}</TableCell>
                          <TableCell>{policyIssueDate}</TableCell>
                          <TableCell>{expireDate}</TableCell>

                          <TableCell align="right">
                            <NextLink href={`/health-insurance/policies/${poly?._id}`} passHref>
                              <IconButton component="a">
                                <ArrowRight fontSize="small" />
                              </IconButton>
                            </NextLink>
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

      <ModalComp open={open} handleClose={handleClose}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to delete ?
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
          mt={3}
        >
          <Button
            variant="contained"
            sx={{
              marginRight: "10px",
            }}
            // onClick={() => deleteByIdHandler(deleteId)}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
    </>
  );
};

export default CustomerPoliciesTable;
