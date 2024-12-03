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
  Typography,
  Menu,
  MenuItem,
  Link,
} from "@mui/material";
import { MenuIcon } from "src/Icons/MenuIcon";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { PencilAlt } from "src/Icons/PencilAlt";
import { Scrollbar } from "src/components/scrollbar";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import NextLink from "next/link";
import NextImage from "next/image";
import { format, parseISO } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { PetInsurance } from "src/Icons/PetIcon";
import { CompanySvg } from "src/Icons/Company";
import { setCompanySearchFilter } from "./reducer/companySlice";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const CommonCompanyTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    companyListSearchFilter = {},
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const [comId, _comId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const onClickHandler = () => {
    dispatch(setCompanySearchFilter({ ...companyListSearchFilter, scrollPosition: window?.scrollY }));
  };

  const handleClick = (event, companyId, company) => {
    setAnchorEl(event.currentTarget);
    _comId(companyId);
    setSelectedCompany(company);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Company Email</TableCell>
                  <TableCell>Headquarters</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((company) => {
                    const isSelected = selected.includes(company?._id);
                    const createdAt = format(parseISO(company?.createdAt), "dd/MM/yyyy");
                    return (
                      <TableRow hover key={company?._id} selected={isSelected}>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            {company.logoImg && (
                              <>
                                <NextImage
                                  alt="image"
                                  src={baseURL + "/" + company?.logoImg?.path || "/assets/products/product-1.png"}
                                  height={80}
                                  width={80}
                                  style={{
                                    borderRadius: "0.75rem",
                                    objectFit: "fit-content",
                                  }}
                                />
                              </>
                            )}
                            <Box
                              sx={{
                                cursor: "pointer",
                                ml: 2,
                              }}
                            >
                              <Typography variant="subtitle2">{company?.companyName}</Typography>

                              <Typography
                                color="textSecondary"
                                variant="body2"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: "3",
                                  lineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: company?.dec,
                                }}
                              ></Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{company?.companyEmail}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{company?.headquarters}</TableCell>

                        <TableCell align="right">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {moduleAccess(user, "companies.update") && (
                              <NextLink
                                href={`/companies/${company._id}/edit`}
                                passHref
                                onClick={() => {
                                  onClickHandler();
                                }}
                              >
                                <IconButton component="a">
                                  <PencilAlt fontSize="medium" />
                                </IconButton>
                              </NextLink>
                            )}
                            {moduleAccess(user, "companies.delete") && (
                              <NextLink
                                href={``}
                                passHref
                                onClick={() => {
                                  deleteByIdHandler(company._id);
                                  onClickHandler();
                                }}
                              >
                                <IconButton component="a">
                                  <DeleteSvg fontSize="medium" />
                                </IconButton>
                              </NextLink>
                            )}
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={(event) => {
                                handleClick(event, company._id, company);
                                onClickHandler();
                              }}
                            >
                              <MenuIcon />
                            </IconButton>
                          </Box>
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
      {(selectedCompany?.healthInsurance ||
        selectedCompany?.motorInsurance ||
        selectedCompany?.petInsurance ||
        selectedCompany?.landInsurance ||
        selectedCompany?.travelInsurance) && (
        <Menu
          id={"long-menu-"}
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "25ch",
            },
          }}
        >
          {selectedCompany?.motorInsurance && (
            <NextLink href={`/companies/${comId}/motor-insurance`} passHref>
              <MenuItem sx={{ textDecoration: "none" }} onClick={handleClose}>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <IconButton component="a">
                    <DirectionsCarIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ textDecoration: "none" }}>Manage Motor</Typography>
                </Link>
              </MenuItem>
            </NextLink>
          )}

          {selectedCompany?.travelInsurance && (
            <NextLink href={`/companies/${comId}/travel-insurance`} passHref>
              <MenuItem sx={{ textDecoration: "none" }} onClick={handleClose}>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <IconButton component="a">
                    <TravelExploreIcon />
                  </IconButton>
                  <Typography sx={{ textDecoration: "none" }}>Manage Travel</Typography>
                </Link>
              </MenuItem>
            </NextLink>
          )}

          {selectedCompany?.healthInsurance && (
            <NextLink href={`/companies/${comId}/health-insurance`} passHref>
              <MenuItem sx={{ textDecoration: "none" }} onClick={handleClose}>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <IconButton component="a">
                    <HealthAndSafetyIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ textDecoration: "none" }}>Manage Health</Typography>
                </Link>
              </MenuItem>
            </NextLink>
          )}
          {selectedCompany?.petInsurance && (
            <NextLink href={`/companies/${comId}/pet-insurance`} passHref>
              <MenuItem sx={{ textDecoration: "none" }} onClick={handleClose}>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <IconButton component="a">
                    <PetInsurance fontSize="small" />
                  </IconButton>
                  <Typography sx={{ textDecoration: "none" }}>Manage Pet</Typography>
                </Link>
              </MenuItem>
            </NextLink>
          )}
          {selectedCompany?.landInsurance && (
            <NextLink href={`/companies/${comId}/land-insurance`} passHref>
              <MenuItem sx={{ textDecoration: "none" }} onClick={handleClose}>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <IconButton component="a">
                    <CompanySvg fontSize="small" />
                  </IconButton>
                  <Typography sx={{ textDecoration: "none" }}>Manage Land</Typography>
                </Link>
              </MenuItem>
            </NextLink>
          )}
        </Menu>
      )}
    </>
  );
};

export default CommonCompanyTable;
