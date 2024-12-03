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
  MenuItem,
  Typography,
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
import { SeverityPill } from "src/components/severity-pill";
import AddModeratorIcon from "@mui/icons-material/AddModerator";

const HealthInsuranceCompanyPlansTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    page = 0,
    rowsPerPage = 0,
    changeStatusHandler,
  } = props;
  const router = useRouter();
  const { companyId, tpaId, networkId, cityId, planId, matrixId } = router.query;
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
                  <TableCell>Plan</TableCell>
                  <TableCell>co pay</TableCell>
                  <TableCell>Number of Matrix</TableCell>
                  <TableCell>Is Basic</TableCell>
                  <TableCell>Is Active</TableCell>
                  <TableCell>No Price</TableCell>

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
                            `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${company?._id}/matrix`
                          )
                        }
                      >
                        <TableCell>{company?.refNo}</TableCell>
                        <TableCell>{company?.planName}</TableCell>
                        <TableCell>{company?.coPay ? `${company?.coPay} %` : "-"}</TableCell>
                        <TableCell>{company?.matrixCount}</TableCell>
                        <TableCell>
                          <SeverityPill
                            color={company?.isBasic ? "success" : "error"}
                            onClick={(e) => {
                              e.stopPropagation();
                              changeStatusHandler({
                                id: company?._id,
                                data: { isBasic: !company?.isBasic },
                              });
                            }}
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            {company?.isBasic ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <SeverityPill
                            color={company?.isEnable ? "success" : "error"}
                            onClick={(e) => {
                              e.stopPropagation();
                              changeStatusHandler({
                                id: company?._id,
                                data: { isEnable: !company?.isEnable },
                              });
                            }}
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            {company?.isEnable ? "enable" : "disable"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={company?.isPremiumRequestUpon ? "success" : "error"} fontSize={10}>
                            {company?.isPremiumRequestUpon ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              router?.push(
                                `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${company?._id}/benefits`
                              );
                            }}
                            passHref
                          >
                            <IconButton component="a">
                              <AddModeratorIcon fontSize="small" />
                            </IconButton>
                          </Button>
                          {moduleAccess(user, "companies.update") && (
                            <NextLink
                              onClick={(e) => e.stopPropagation()}
                              href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${company?._id}/edit`}
                              passHref
                            >
                              <IconButton component="a">
                                <PencilAlt fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}

                          {moduleAccess(user, "companies.delete") && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteByIdHandler(company?._id);
                              }}
                            >
                              <IconButton component="a">
                                <DeleteSvg fontSize="small" />
                              </IconButton>
                            </Button>
                          )}

                          <NextLink
                            onClick={(e) => e.stopPropagation()}
                            href={`/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${company?._id}/matrix`}
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

export default HealthInsuranceCompanyPlansTable;
