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
import { setAdminListsearchFilter } from "./reducer/adminsSlice";
import { useDispatch } from "react-redux";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const AdminTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    page = 0,
    rowsPerPage = 0,
    adminListSearchFilter = {},
  } = props;
  const [comId, _comId] = useState("");
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleClick = (event, companyId) => {
    setAnchorEl(event.currentTarget);
    _comId(companyId);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onclickHandler = () => {
    dispatch(setAdminListsearchFilter({ ...adminListSearchFilter, scrollPosition: window?.scrollY }));
  };
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Admin Name</TableCell>
                  <TableCell>Admin Email</TableCell>
                  <TableCell>Contact No</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((admin, index) => {
                    return (
                      <TableRow hover key={admin?._id}>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            {admin.logoImg && (
                              <>
                                <NextImage
                                  alt="image"
                                  src={baseURL + "/" + admin?.logoImg?.path || "/assets/products/product-1.png"}
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
                              <Typography variant="subtitle2">{admin?.userId?.fullName}</Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>{admin?.userId?.email}</TableCell>
                        <TableCell>{admin?.userId?.mobileNumber}</TableCell>
                        <TableCell>
                          {admin?.isSupervisor
                            ? "Supervisor"
                            : admin?.isSalesAgent
                            ? "Sales Agent"
                            : admin?.userId?.role === "Sub-Admin"
                            ? "Agent"
                            : admin?.userId?.role}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={(event) => {
                              handleClick(event, admin._id);
                              onclickHandler();
                            }}
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
            width: "20ch",
          },
        }}
      >
        <NextLink href={`/sub-admins/${comId}/edit`} passHref>
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

        <NextLink href={`/sub-admins/${comId}`} passHref>
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

export default AdminTable;
