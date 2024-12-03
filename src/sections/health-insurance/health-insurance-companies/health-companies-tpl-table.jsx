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
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { PencilAlt } from "src/Icons/PencilAlt";
import { Scrollbar } from "src/components/scrollbar";
import { format, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { moduleAccess } from "src/utils/module-access";
import { ArrowRight } from "src/Icons/ArrowRight";
import { ImportIcon } from "src/Icons/ImportIcon";
import { ExportIcon } from "src/Icons/ExportIcon";
import { setTpaId } from "./Reducer/healthInsuranceCompanySlice";
import { exportHealthPlanFile, importHealthPlanFile } from "./Action/healthinsuranceCompanyAction";
import { toast } from "react-toastify";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import AnimationLoader from "src/components/amimated-loader";
const HealthInsuranceCompanyTplTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    searchFilter,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const { companyId, tpaId } = router.query;
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleExport = (id) => {
    setLoading(true);
    dispatch(exportHealthPlanFile({ id: id }))
      .unwrap()
      .then((res) => {
        const link = document.createElement("a");
        link.href = baseURL + "/" + res.data;
        // link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast?.error(err);
        setLoading(false);
      });
  };

  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      event.target.value = null;
      return;
    }
    let payload = {
      tpa: file,
    };

    const formData = jsonToFormData(payload);
    setLoading(true);
    dispatch(importHealthPlanFile(formData))
      .unwrap()
      .then((res) => {
        setLoading(false);
        toast.success("Successfully imported!");
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
    event.target.value = null; // Clear the file input value
  };

  return (
    <>
      {loading && (
        <>
        <AnimationLoader open={true}/>
        </>
      )}
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>REF</TableCell>
                  <TableCell>TPA</TableCell>
                  <TableCell>Number of Networks</TableCell>
                  <TableCell>import/export</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((company, idx) => {
                    // console.log(company, "ele");
                    // dispatch(setTpaId(company?._id));
                    const isSelected = selected.includes(company?._id);
                    const createdAt = format(parseISO(company?.createdAt), "dd/MM/yyyy");
                    return (
                      <TableRow
                        sx={{ cursor: "pointer" }}
                        hover
                        key={company?._id}
                        selected={isSelected}
                        onClick={() => {
                          router?.push(`/companies/${companyId}/health-insurance/tpa/${company?._id}/network`);
                        }}
                      >
                        <TableCell>{company?.refNo}</TableCell>
                        <TableCell>{company?.TPAName}</TableCell>
                        <TableCell>{company?.networkCount}</TableCell>
                        <TableCell>
                          <Box sx={{ gap: 0.5, display: "flex" }}>
                            <Button
                              aria-label="upload picture"
                              component="label"
                              variant="contained"
                              sx={{ fontSize: "12px", padding: "5px 14px" }}
                              endIcon={<ImportIcon />}
                              onClick={(e) => {
                                e?.stopPropagation();
                              }}
                            >
                              <input
                                accept=".xlsx"
                                id="file-upload"
                                type="file"
                                onChange={(event) => handleUploadFile(event)}
                                style={{
                                  display: "none",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                              Import
                            </Button>
                            <Button
                              variant="contained"
                              sx={{ fontSize: "12px", padding: "5px 14px" }}
                              endIcon={<ExportIcon />}
                              onClick={(e) => {
                                e?.stopPropagation();
                                handleExport(company?._id);
                              }}
                            >
                              Export
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {moduleAccess(user, "companies.update") && (
                            <NextLink
                              href={`/companies/${companyId}/health-insurance/tpa/${company?._id}/edit`}
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
                            href={`/companies/${companyId}/health-insurance/tpa/${company?._id}/network`}
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

export default HealthInsuranceCompanyTplTable;
