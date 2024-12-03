import React from "react";
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { moduleAccess } from "src/utils/module-access";
import Link from "next/link";
import { setPetInsuranceSearchFilter } from "./Reducer/petInsuranceSlice";

const PetInsuranceTable = (props) => {
  const {
    count = 0,
    item = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    petInsuranceSearchFilter = {},
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setPetInsuranceSearchFilter({ ...petInsuranceSearchFilter, scrollPosition: window?.scrollY }));
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal No</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Pet Type</TableCell>
                  <TableCell>Breed</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {item?.length > 0 &&
                  item?.map((ele) => {
                    const createdAt = format(parseISO(ele?.createdAt), "dd/MM/yyyy");
                    return (
                      <TableRow
                        href={`/pet-insurance/proposals/${ele?.petInfoNumber}`}
                        component={Link}
                        onClick={() => onClickHandler()}
                        sx={{ cursor: "pointer", textDecoration: "none" }}
                      >
                        <TableCell>{ele?.petInfoNumber}</TableCell>
                        <TableCell>{ele?.fullName}</TableCell>
                        <TableCell>{ele?.email}</TableCell>
                        <TableCell>{ele?.mobileNumber}</TableCell>
                        <TableCell>{ele?.petType}</TableCell>
                        <TableCell>{ele?.breed}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                        <TableCell align="right">
                          {moduleAccess(user, "petQuote.read") && (
                            <NextLink href={`/pet-insurance/proposals/${ele?.petInfoNumber}`} passHref>
                              <IconButton component="a">
                                <ArrowRight fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}
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
    </>
  );
};

export default PetInsuranceTable;
