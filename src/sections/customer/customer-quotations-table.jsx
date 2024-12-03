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

const CustomerQuotationsTable = (props) => {
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
                  <TableCell>MOBILE NO</TableCell>
                  <TableCell>SOURCE</TableCell>
                  <TableCell>CREATED AT</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items
                    // ?.filter((item) => {
                    //   return searchFilter.toLowerCase() === ""
                    //     ? item?.QuotationNo
                    //     : item?.QuotationNo.toLowerCase().includes(searchFilter);
                    // })
                    ?.map((quo) => {
                      console.log(quo, "quo");
                      const isSelected = selected.includes(quo?._id);

                      // const createDate = format(parseISO(quo?.start), "MM/dd/yyyy");
                      // const expireDate = format(parseISO(quo?.end), "MM/dd/yyyy");

                      let createDate = "";

                      if (isValid(parseISO(quo?.createdAt))) {
                        createDate = format(parseISO(quo?.createdAt), "dd/MM/yyyy");
                      }

                      let expireDate = "";

                      if (isValid(parseISO(quo?.end))) {
                        expireDate = format(parseISO(quo?.end), "dd/MM/yyyy");
                      }

                      return (
                        <TableRow hover key={quo?.proposalId} selected={isSelected}>
                          <TableCell>{quo?.proposalId}</TableCell>
                          {/* <TableCell>{quo?.}</TableCell> */}
                          <TableCell>{quo?.user?.mobileNumber}</TableCell>

                          <TableCell>{quo?.source}</TableCell>
                          <TableCell>{createDate}</TableCell>

                          <TableCell align="right">
                            <NextLink href={`/health-insurance/proposals/${quo?.proposalId}`} passHref>
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

export default CustomerQuotationsTable;
