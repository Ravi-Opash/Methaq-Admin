import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
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
import NextImage from "next/image";
import Image from "next/image";
import { MenuIcon } from "src/Icons/MenuIcon";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import { DiscountSvg } from "src/Icons/DiscountIcon";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const CompanyPartnersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [comId, _comId] = useState("");
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, partnerId) => {
    setAnchorEl(event.currentTarget);
    _comId(partnerId);
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
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Discount Code</TableCell>
                  <TableCell>Locations</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((partner) => {
                    const isSelected = selected.includes(partner?._id);

                    return (
                      <TableRow hover key={partner?._id} selected={isSelected}>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            {partner.logoImg && (
                              <>
                                <Image
                                  alt="logo"
                                  src={baseURL + "/" + partner?.logoImg?.path}
                                  height={80}
                                  width={80}
                                  style={{
                                    borderRadius: "0.75rem",
                                    // objectFit: "fit-content",
                                  }}
                                />
                              </>
                            )}
                            <Box
                              sx={{
                                ml: 2,
                              }}
                            >
                              <Typography variant="subtitle2">{partner?.companyName}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{partner?.category}</TableCell>
                        <TableCell>{partner?.discountCode}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {partner?.locations.map((location) => {
                              return <Chip key={location.location} label={location.location} />;
                            })}
                          </Box>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={(event) => handleClick(event, partner._id)}
                          >
                            <MenuIcon />
                          </IconButton>
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
        <NextLink href={`/partners/${comId}/discount-offers`} passHref>
          <MenuItem
            key={"coverage-benefits-" + comId}
            sx={{ textDecoration: "none" }}
            onClick={handleClose}
          >
            <Link
              color="textPrimary"
              component="a"
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <IconButton component="a">
                {/* <PencilAlt fontSize="small" /> */}
                <DiscountSvg fontSize="small" />
              </IconButton>
              <Typography sx={{ textDecoration: "none" }}>Discount & Offers</Typography>
            </Link>
          </MenuItem>
        </NextLink>

        {moduleAccess(user, "partners.update") && (
          <NextLink href={`/partners/${comId}/edit`} passHref>
            <MenuItem key={"edit" + comId} onClick={handleClose}>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <IconButton component="a">
                  <PencilAlt fontSize="small" />
                </IconButton>
                <Typography sx={{ textDecoration: "none" }}>Edit</Typography>
              </Link>
            </MenuItem>
          </NextLink>
        )}

        {moduleAccess(user, "partners.delete") && (
          <MenuItem on key={"delete" + comId} onClick={handleClose}>
            <Link
              color="textPrimary"
              component="a"
              sx={{
                alignItems: "center",
                display: "flex",
              }}
              onClick={() => deleteByIdHandler(comId)}
            >
              <IconButton component="a">
                <DeleteSvg fontSize="small" />
              </IconButton>
              <Typography color="black" sx={{ textDecoration: "none" }}>
                Delete
              </Typography>
            </Link>
          </MenuItem>
        )}

        <NextLink href={`/partners/${comId}`} passHref>
          <MenuItem key={"view" + comId} onClick={handleClose}>
            <Link
              color="textPrimary"
              component="a"
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <IconButton component="a">
                <ArrowRight fontSize="small" />
              </IconButton>
              <Typography>View</Typography>
            </Link>
          </MenuItem>
        </NextLink>
      </Menu>
    </>
  );
};

export default CompanyPartnersTable;
