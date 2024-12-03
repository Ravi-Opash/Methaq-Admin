import React, { useState } from "react";
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
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
  Divider,
} from "@mui/material";
import { MenuIcon } from "src/Icons/MenuIcon";
import { Matrix } from "src/Icons/Matrix";
import { ArrowRight } from "src/Icons/ArrowRight";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { PencilAlt } from "src/Icons/PencilAlt";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import NextLink from "next/link";
import NextImage from "next/image";
import { format, parseISO } from "date-fns";
import { ConditionsSvg } from "src/Icons/Conditions";
import { ExcessSvg } from "src/Icons/Excess";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import { moduleAccess } from "src/utils/module-access";
import { useSelector } from "react-redux";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useRouter } from "next/router";
import { formatNumber } from "src/utils/formatNumber";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const Accordions = styled(Accordion)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  boxShadow: "none",
  backgroundColor: "unset",
  cursor: "unset",
}));
const TableCells = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  padding: "0 !important",
  //   maxWidth: 200,
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  //   whiteSpace: 'nowrap',
}));
const AccordionSummarys = styled(AccordionSummary)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {},
  px: "0 !important",
}));

const HealthInsuranceCompanyMatrixTable = (props) => {
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
  const { companyId, tpaId, networkId, cityId, planId, matrixId } = router.query;

  const { loginUserData: user } = useSelector((state) => state.auth);

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>REF</TableCell>
                  <TableCell>Visa type</TableCell>
                  <TableCell>Age band</TableCell>
                  <TableCell>Salary Range</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Premium</TableCell>
                  <TableCell>Maternity Premium</TableCell>
                  <TableCell>Relation</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items.map((company, idx) => {
                    const isSelected = selected.includes(company?._id);
                    const createdAt = format(parseISO(company?.createdAt), "dd/MM/yyyy");
                    // console.log(company)
                    return (
                      <TableRow hover key={company?._id} selected={isSelected}>
                        <TableCells
                          sx={{
                            width: 150,
                          }}
                        >
                          <Accordions
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                          >
                            <AccordionSummarys aria-controls="panel1-content" id="panel1-header">
                              {company?.refNo}
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {"Vista Type 1"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {"Vista Type 1"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {"Vista Type 1"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {"Vista Type 1"}
                              </Typography>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
                        <TableCells
                          sx={{
                            width: { xs: 180, xl: 250 },
                          }}
                        >
                          <Accordions
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                          >
                            <AccordionSummarys aria-controls="panel1-content" id="panel1-header">
                              {company?.visaType}
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {"Vista Type 1"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {"Vista Type 1"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {"Vista Type 1"}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  height: 32,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {"Vista Type 1"}
                              </Typography>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
                        <TableCells
                          sx={{
                            width: {
                              xs: 100,
                              xl: 100,
                            },
                          }}
                        >
                          <Accordions
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                          >
                            <AccordionSummarys aria-controls="panel1-content" id="panel1-header">
                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  maxWidth: {
                                    xs: 165,
                                    lg: 165,
                                    xl: 300,
                                  },
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {`${company?.ageFrom || company?.ageFrom == 0 ? company?.ageFrom : "-"} - ${
                                  company?.ageTo || company?.ageTo == 0 ? company?.ageTo : "-"
                                }`}
                              </Typography>
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  height: 32,
                                }}
                              >
                                <Typography sx={{ fontSize: "13px" }}>{"AED 5000"}</Typography>
                                <IconButton>
                                  <PencilAlt
                                    sx={{
                                      color: "#707070",
                                      fontSize: "18px",
                                    }}
                                  />
                                </IconButton>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  height: 32,
                                }}
                              >
                                <Typography sx={{ fontSize: "13px" }}>{"AED 5000"}</Typography>
                                <IconButton>
                                  <PencilAlt
                                    sx={{
                                      color: "#707070",
                                      fontSize: "18px",
                                    }}
                                  />
                                </IconButton>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  height: 32,
                                }}
                              >
                                <Typography sx={{ fontSize: "13px" }}>{"AED 5000"}</Typography>
                                <IconButton>
                                  <PencilAlt
                                    sx={{
                                      color: "#707070",
                                      fontSize: "18px",
                                    }}
                                  />
                                </IconButton>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  height: 32,
                                }}
                              >
                                <Typography sx={{ fontSize: "13px" }}>{"AED 5000"}</Typography>
                                <IconButton>
                                  <PencilAlt
                                    sx={{
                                      color: "#707070",
                                      fontSize: "18px",
                                    }}
                                  />
                                </IconButton>
                              </Box>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
                        <TableCells
                          sx={{
                            width: { xs: 150, lg: 160, xl: 170 },
                          }}
                        >
                          <Accordions
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                          >
                            <AccordionSummarys aria-controls="panel1-content" id="panel1-header">
                              {`${
                                company?.salaryFrom || company?.salaryFrom == 0
                                  ? formatNumber(company?.salaryFrom)
                                  : "-"
                              } - ${
                                company?.salaryTo || company?.salaryTo == 0 ? formatNumber(company?.salaryTo) : "-"
                              }`}
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
                        <TableCells
                          sx={{
                            width: { xs: 120, lg: 140, xl: 150 },
                          }}
                        >
                          <Accordions
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                          >
                            <AccordionSummarys
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {company?.gender || "-"}
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
                        <TableCells
                          sx={{
                            width: { xs: 150, lg: 160, xl: 170 },
                          }}
                        >
                          <Accordions
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                          >
                            <AccordionSummarys
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {`${formatNumber(company?.premium)} AED`}
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
                        <TableCells
                          sx={{
                            width: { xs: 150, lg: 160, xl: 170 },
                          }}
                        >
                          <Accordions
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                          >
                            <AccordionSummarys
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {`${formatNumber(company?.maternityAmount)} AED`}
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
                        <TableCells
                          sx={{
                            width: { xs: 150, lg: 160, xl: 170 },
                          }}
                        >
                          <Accordions
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                          >
                            <AccordionSummarys
                              aria-controls="panel1-content"
                              id="panel1-header"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {company?.relation || "-"}
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
                        <TableCells>
                          <Accordions
                            sx={{
                              width: "100%",
                            }}
                            expanded={expanded === `panel${idx + 1}`}
                            // onChange={handleChange(`panel${idx + 1}`)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <AccordionSummarys
                              aria-controls="panel1-content"
                              id="panel1-header"
                              // expandIcon={
                              //   <IconButton component="a">
                              //     <ArrowDownwardIcon />
                              //   </IconButton>
                              // }
                              sx={{
                                px: "0 !important",
                                mr: 1,
                                // width: "max-content",
                                // marginLeft: "auto",
                                height: "100%",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "end",
                                  alignItems: "center",
                                  height: "100%",
                                  width: "100%",
                                  mr: 1,
                                }}
                              >
                                {moduleAccess(user, "companies.update") && (
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(
                                        `/companies/${companyId}/health-insurance/tpa/${tpaId}/network/${networkId}/city/${cityId}/plans/${planId}/matrix/${company?._id}/edit`
                                      );
                                    }}
                                    component="a"
                                  >
                                    <PencilAlt fontSize="small" />
                                  </IconButton>
                                )}
                                {moduleAccess(user, "companies.delete") && (
                                  <IconButton
                                    sx={{ ml: 1, mr: -0.5 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteByIdHandler(company?._id);
                                    }}
                                    component="a"
                                  >
                                    <DeleteSvg fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </AccordionSummarys>
                            <AccordionDetails>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                              <Typography sx={{ fontSize: "13px", height: 32 }}>{/* {"5 Plans"} */}</Typography>
                            </AccordionDetails>
                          </Accordions>
                        </TableCells>
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

export default HealthInsuranceCompanyMatrixTable;
