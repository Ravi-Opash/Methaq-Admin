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
import { SortIcon } from "src/Icons/SortIcon";
import NextLink from "next/link";
import { PencilAlt } from "src/Icons/PencilAlt";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { ArrowRight } from "src/Icons/ArrowRight";
import { useRouter } from "next/router";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber } from "src/utils/formatNumber";
import { getMatrixListByCompanyId } from "../action/companyAcrion";
import { toggleIsRevert } from "src/sections/health-insurance/Proposals/Reducer/checkStatusSlice";

const CompanyMatrixTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const { isRevert } = useSelector((state) => state.isRevert);

  const router = useRouter();

  const { companyId } = router.query;
  const dispatch = useDispatch();
  const { matrixList } = useSelector((state) => state.company);

  // Sort matrix handler API
  const onSortCtoTList = async () => {
    dispatch(toggleIsRevert());
    dispatch(
      getMatrixListByCompanyId({
        page: page + 1,
        size: rowsPerPage,
        id: companyId,
        search: "",
        body: {
          sort: {
            insuranceType: isRevert ? 1 : -1,
          },
        },
      })
    )
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 900 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box> Insurance Type</Box>
                    <SortIcon
                      onClick={(e) => {
                        onSortCtoTList();
                      }}
                      sx={{ cursor: "pointer", transform: isRevert ? "none" : "rotate(180deg)" }}
                    />
                  </TableCell>
                  <TableCell>Vehicle Type</TableCell>
                  <TableCell>Vehicle Valuation From</TableCell>
                  <TableCell>Vehicle Valuation To</TableCell>
                  <TableCell>Minimum Premium</TableCell>
                  <TableCell>No Of Cylinders</TableCell>
                  <TableCell>Repair Condition</TableCell>
                  <TableCell>Rate In Percentage</TableCell>
                  <TableCell>Car Age</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {matrixList?.length > 0 &&
                  matrixList?.map((matrix) => {

                    return (
                      <TableRow hover key={matrix?._id}>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {matrix?.insuranceType === "thirdparty" ? "Third Party" : matrix?.insuranceType}
                        </TableCell>
                        <TableCell>{matrix?.vehicleType}</TableCell>
                        <TableCell>
                          {matrix?.vehicleValuationFrom && formatNumber(matrix?.vehicleValuationFrom)}
                        </TableCell>
                        <TableCell>{matrix?.vehicleValuationTo && formatNumber(matrix?.vehicleValuationTo)}</TableCell>
                        <TableCell>{matrix?.minimumPremium && formatNumber(matrix?.minimumPremium)}</TableCell>
                        <TableCell>{matrix?.noOfCylinders}</TableCell>
                        <TableCell>{matrix?.repairCondition}</TableCell>
                        <TableCell>{matrix?.rateInPercentage}</TableCell>
                        <TableCell>
                          {!!matrix?.carAge && matrix?.carAge === ">2"
                            ? "2+ year"
                            : matrix?.carAge
                            ? matrix?.carAge + " year"
                            : "-"}
                        </TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "companies.update") && (
                            <NextLink
                              href={`/companies/${companyId}/motor-insurance/matrix/${matrix?._id}/editMatrix`}
                              passHref
                            >
                              <IconButton component="a">
                                <PencilAlt fontSize="small" />
                              </IconButton>
                            </NextLink>
                          )}

                          {moduleAccess(user, "companies.delete") && (
                            <Button onClick={() => deleteByIdHandler(matrix?._id)}>
                              <IconButton component="a">
                                <DeleteSvg fontSize="small" />
                              </IconButton>
                            </Button>
                          )}

                          <NextLink href={`/companies/${companyId}/motor-insurance/matrix/${matrix?._id}`} passHref>
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

export default CompanyMatrixTable;
