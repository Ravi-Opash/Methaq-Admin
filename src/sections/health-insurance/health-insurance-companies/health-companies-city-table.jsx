import React, { useState } from "react";
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
  Button,
  Chip,
} from "@mui/material";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { PencilAlt } from "src/Icons/PencilAlt";
import { Scrollbar } from "src/components/scrollbar";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { moduleAccess } from "src/utils/module-access";
import { ArrowRight } from "src/Icons/ArrowRight";

const HealthInsuranceCompanyCityTable = (props) => {
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
  const { companyId, tpaId, networkId, cityId } = router.query;
  const { loginUserData: user } = useSelector((state) => state.auth);

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>REF</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Number of plans</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((company, idx) => {
                    return (
                      <TableRow
                        sx={{ cursor: "pointer" }}
                        hover
                        key={company?._id}
                        onClick={() =>
                          router?.push(
                            `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${company?._id}/plans`
                          )
                        }
                      >
                        <TableCell>{company?.refNo}</TableCell>
                        <TableCell>
                          <Box sx={{display: "flex", gap:"3px"}}>
                            {company?.cityName?.map((ele, idx) => {
                              return <Chip key={idx} label={ele} />;
                            })}
                          </Box>
                        </TableCell>
                        <TableCell>{company?.planCount}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "companies.update") && (
                            <NextLink
                              onClick={(e) => e.stopPropagation()}
                              href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${company?._id}/edit`}
                              passHref
                            >
                              <IconButton component="a">
                                <PencilAlt fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}

                          {moduleAccess(user, "companies.delete") && (
                            <Button
                              onClick={(event) => {
                                event?.stopPropagation();
                                deleteByIdHandler(company?._id);
                              }}
                            >
                              <IconButton component="a">
                                <DeleteSvg fontSize="small" />
                              </IconButton>
                            </Button>
                          )}

                          <NextLink
                            href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${company?._id}/plans`}
                            onClick={(event) => {
                              event?.stopPropagation();
                            }}
                            passHref
                          >
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

export default HealthInsuranceCompanyCityTable;
