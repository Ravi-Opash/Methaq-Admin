import React, { useState } from "react";
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
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
import { SeverityPill } from "src/components/severity-pill";
import NextLink from "next/link";
import { format, parseISO } from "date-fns";
import { ConditionsSvg } from "src/Icons/Conditions";
import { ExcessSvg } from "src/Icons/Excess";
import { moduleAccess } from "src/utils/module-access";
import { useSelector } from "react-redux";

const items = [
  {
    _id: "660256d23d140e37978aea55",
    refNo: "HEC00017",
    companyName: "Takaful Emarat",
    contactNo: "",
    headquarters: "Dubai",
    companyEmail: "",
    companyWebsite: "https://takafulemarat.com/",
    companyPortal: "",
    dec: "<p>xyz</p>",
    googleReviews: [],
    googlePlaceId: "xyz",
    startedYear: "",
    eSanadRecommendation: false,
    commission: null,
    createdAt: "2024-03-26T05:02:10.878Z",
    updatedAt: "2024-05-21T05:30:17.223Z",
    bannerImg: {
      fieldname: "bannerImg",
      originalname: "TakafulEmarat.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: "public/images/companies/2024-04",
      filename: "1712034258529-TakafulEmarat.jpg",
      path: "images/companies/2024-04/1712034258529-TakafulEmarat.jpg",
      size: 19778,
    },
    logoImg: {
      fieldname: "logoImg",
      originalname: "TakafulEmarat.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: "public/images/companies/2024-04",
      filename: "1712034258530-TakafulEmarat.jpg",
      path: "images/companies/2024-04/1712034258530-TakafulEmarat.jpg",
      size: 19778,
    },
    isActive: true,
  },
];

const CompanyTable = (props) => {
  const router = useRouter();
  const {
    count = 0,
    // items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    searchFilter,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const [comId, _comId] = useState("");
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, companyId) => {
    setAnchorEl(event.currentTarget);
    _comId(companyId);
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
                  <TableCell>Commission</TableCell>
                  <TableCell>eSanad Recommendation</TableCell>
                  <TableCell>is Active</TableCell>
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
                        <TableCell>{company?.commission ? company?.commission + "%" : "-"}</TableCell>
                        <TableCell>
                          <SeverityPill color={company?.eSanadRecommendation ? "success" : "error"}>
                            {company?.eSanadRecommendation ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={company?.isActive ? "success" : "error"}>
                            {company?.isActive ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
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
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={(event) => {
                                event?.stopPropagation();
                                handleClick(event, company._id);
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
        <NextLink href={`/companies/${comId}/health-insurance/tpa`} passHref>
          <MenuItem key={"excess-" + comId} sx={{ textDecoration: "none" }} onClick={handleClose}>
            <Link
              color="textPrimary"
              component="a"
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <IconButton component="a">
                <ExcessSvg sx={{ fontSize: "20px" }} />
              </IconButton>
              <Typography sx={{ textDecoration: "none", fontSize: "15px" }}>TPA</Typography>
            </Link>
          </MenuItem>
        </NextLink>

        <NextLink href={`/companies/${comId}/health-insurance/conditions`} passHref>
          <MenuItem key={"conditions-" + comId} sx={{ textDecoration: "none" }} onClick={handleClose}>
            <Link
              color="textPrimary"
              component="a"
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <IconButton component="a">
                <ConditionsSvg sx={{ fontSize: "20px" }} />
              </IconButton>
              <Typography sx={{ textDecoration: "none", fontSize: "15px" }}>Conditions</Typography>
            </Link>
          </MenuItem>
        </NextLink>

        {moduleAccess(user, "companies.update") && (
          <NextLink href={`/companies/${comId}/health-insurance/edit`} passHref>
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
                  <PencilAlt sx={{ fontSize: "20px" }} />
                </IconButton>
                <Typography sx={{ textDecoration: "none", fontSize: "15px" }}>Edit</Typography>
              </Link>
            </MenuItem>
          </NextLink>
        )}

        {moduleAccess(user, "companies.delete") && (
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
                <DeleteSvg sx={{ fontSize: "20px" }} />
              </IconButton>
              <Typography color="black" sx={{ textDecoration: "none", fontSize: "15px" }}>
                Delete
              </Typography>
            </Link>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default CompanyTable;
