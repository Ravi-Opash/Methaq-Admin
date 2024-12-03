import React from "react";
import {
  Box,
  Button,
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
import { PencilAlt } from "src/Icons/PencilAlt";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { ArrowRight } from "src/Icons/ArrowRight";
import { useRouter } from "next/router";
import { moduleAccess } from "src/utils/module-access";
import { useSelector } from "react-redux";
import { formatNumber } from "src/utils/formatNumber";

const CompanyExcessTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const router = useRouter();
  const { loginUserData: user } = useSelector((state) => state.auth);
  const { companyId } = router.query;
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle Type</TableCell>
                  <TableCell>Charge</TableCell>
                  <TableCell>Vehicle Valuation From</TableCell>
                  <TableCell>Vehicle Valuation To</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((excess) => {
                    return (
                      <TableRow hover key={excess?._id}>
                        <TableCell>
                          {excess?.vehicleType.map((e) => (
                            <Box key={e}>{e}</Box>
                          ))}
                        </TableCell>
                        <TableCell>{formatNumber(excess?.charge)}</TableCell>
                        <TableCell>{formatNumber(excess?.vehicleValuationFrom)}</TableCell>
                        <TableCell>{formatNumber(excess?.vehicleValuationTo)}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "companies.update") && (
                            <NextLink
                              href={`/companies/${companyId}/motor-insurance/excess/${excess?._id}/edit`}
                              passHref
                            >
                              <IconButton component="a">
                                <PencilAlt fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}

                          {moduleAccess(user, "companies.delete") && (
                            <Button onClick={() => deleteByIdHandler(excess?._id)}>
                              <IconButton component="a">
                                <DeleteSvg fontSize="small" />
                              </IconButton>
                            </Button>
                          )}

                          <NextLink href={`/companies/${companyId}/motor-insurance/excess/${excess?._id}`} passHref>
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
    </>
  );
};

export default CompanyExcessTable;
