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
  Tooltip,
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
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const HealthInsuranceCompanyNetworkTable = (props) => {
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
  const { companyId, tpaId, networkId } = router.query;
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
                  <TableCell>Network name</TableCell>
                  <TableCell>Number of city</TableCell>
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
                        onClick={() => {
                          router?.push(
                            `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${company?._id}/city`
                          );
                        }}
                      >
                        <TableCell>{company?.refNo}</TableCell>
                        <TableCell>{company?.networkName}</TableCell>
                        <TableCell>{company?.cityCount}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "companies.update") && (
                            <Tooltip title={"Select providers Hospitals and Clinics for network."}>
                              <Button
                                onClick={(event) => {
                                  event?.stopPropagation();
                                  router?.push(
                                    `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${company?._id}/providers`
                                  );
                                }}
                              >
                                <IconButton component="a">
                                  <LocalHospitalIcon fontSize="small" />
                                </IconButton>
                              </Button>
                            </Tooltip>
                          )}
                          {moduleAccess(user, "companies.update") && (
                            <NextLink
                              href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${company?._id}/edit`}
                              onClick={(event) => {
                                event?.stopPropagation();
                              }}
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
                            href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${company?._id}/city`}
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

export default HealthInsuranceCompanyNetworkTable;
