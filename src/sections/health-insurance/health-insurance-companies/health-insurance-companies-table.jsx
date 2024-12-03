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

const items = [
  {
    _id: "64c7705b37ada531fa60f99c",
    companyName: "Al Dhafra Insurance Company P.S.C",
    contactNo: "97126949444",
    headquarters: "Abu Dhabi",
    companyEmail: "info@aldhafrainsurance.ae",
    companyWebsite: "https://www.aldhafrainsurance.ae",
    dec: "<p>is a Public Shareholding Company entirely owned by the U.A.E. nationals. It is incorporated in Abu Dhabi by Emiri Decree No. 8 of 1979 and registered under the provisions of The UAE Insurance Law (Federal Law No. (6) of 2007 enacted in February 2007).</p>",
    logoImg: {
      fieldname: "file",
      originalname: "dhafra.png",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "public/images/companies/2023-07",
      filename: "1690792027512-dhafra.png",
      path: "images/companies/2023-07/1690792027512-dhafra.png",
      size: 32235,
    },
    bannerImg: {
      fieldname: "banner",
      originalname: "2021-01-30.png",
      encoding: "7bit",
      mimetype: "image/png",
      destination: "public/images/companies/2023-07",
      filename: "1690792027514-2021-01-30.png",
      path: "images/companies/2023-07/1690792027514-2021-01-30.png",
      size: 596625,
    },
    googleReviews: [
      {
        author_name: "omar Altenaiji",
        author_url: "https://www.google.com/maps/contrib/112400154510152668502/reviews",
        language: "en",
        original_language: "en",
        profile_photo_url:
          "https://lh3.googleusercontent.com/a-/ALV-UjXWTr5gm8VCAFVARMZP_bxX_I7B68muWOcYyd-iVy69qnVdQCQ8=s128-c0x00000000-cc-rp-mo-ba3",
        rating: 5,
        relative_time_description: "3 years ago",
        text: "Lovely staff",
        time: 1609318307,
        translated: false,
      },
      {
        author_name: "abdulla alkhaili",
        author_url: "https://www.google.com/maps/contrib/106912284875370947069/reviews",
        language: "en",
        original_language: "en",
        profile_photo_url:
          "https://lh3.googleusercontent.com/a-/ALV-UjUpYiaJqpKQHo3dx85bLvbR9sLRWR6cpTLXnw_p4iOHhkGEezQ=s128-c0x00000000-cc-rp-mo-ba4",
        rating: 5,
        relative_time_description: "3 years ago",
        text: "Good people",
        time: 1622094546,
        translated: false,
      },
      {
        author_name: "Kawlah Ebrahim",
        author_url: "https://www.google.com/maps/contrib/106220163319223678076/reviews",
        language: "en-US",
        original_language: "ar",
        profile_photo_url:
          "https://lh3.googleusercontent.com/a/ACg8ocJdJFoTx7K2_VWF1RREpPmnddg7rEUjpDIkAm1XX2RpC2ITqg=s128-c0x00000000-cc-rp-mo",
        rating: 2,
        relative_time_description: "2 months ago",
        text: "Their laws and conditions are impossible, but their prices are reasonable",
        time: 1709288939,
        translated: true,
      },
      {
        author_name: "mustafa al aklouk",
        author_url: "https://www.google.com/maps/contrib/117778954771322698375/reviews",
        language: "en-US",
        original_language: "ar",
        profile_photo_url:
          "https://lh3.googleusercontent.com/a/ACg8ocIWWr0TYONZMMc9xbnxhQkVcjKnYIFtk-EMQwmEz7iiOF94WA=s128-c0x00000000-cc-rp-mo",
        rating: 5,
        relative_time_description: "10 months ago",
        text: "Fast and wonderful service and wonderful treatment from the staff, especially Mr. Ahmed Marwan",
        time: 1689055401,
        translated: true,
      },
      {
        author_name: "Jaber Alobeidli",
        author_url: "https://www.google.com/maps/contrib/102136623304726923690/reviews",
        language: "en-US",
        original_language: "ar",
        profile_photo_url:
          "https://lh3.googleusercontent.com/a/ACg8ocJvnvHe6KjMPSRkoA78HpDUi7E3FvoRTj8p5pKXTxNVkFi-BQ=s128-c0x00000000-cc-rp-mo",
        rating: 1,
        relative_time_description: "a year ago",
        text: "It is too bad to advise you, and the day you ask for help, it arrives after 3 hours",
        time: 1674561807,
        translated: true,
      },
    ],
    startedYear: "1979",
    createdAt: "2023-07-31T08:27:07.527Z",
    updatedAt: "2024-05-27T19:00:01.338Z",
    googlePlaceId: "ChIJq0TumfRJXj4RDpw4deqQYU4",
    googleRating: "3.7",
    carValueReduction: {
      reductionType: "percentage",
      reductionValue: 25,
    },
    eSanadRecommendation: false,
    isActive: false,
    id: "64c7705b37ada531fa60f99c",
  },
];

const HealthInsuranceCompanyTable = (props) => {
  const {
    count = 0,
    // items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteByIdHandler,
    searchFilter,
    page = 0,
    changeStatusHandler,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const router = useRouter();
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
                  <TableCell>Reduction value</TableCell>
                  <TableCell>Third Party Commission</TableCell>
                  <TableCell>Comprehensive Commission</TableCell>
                  <TableCell>eSanad Recommendation</TableCell>
                  <TableCell>is Active</TableCell>
                  {/* <TableCell>Number of conditions</TableCell> */}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((company, idx) => {
                    // console.log(company, "company");
                    const isSelected = selected.includes(company?._id);
                    const createdAt = format(parseISO(company?.createdAt), "dd/MM/yyyy");
                    return (
                      <TableRow hover key={company?._id} selected={isSelected}>
                        <TableCell>
                          {company?.carValueReduction?.reductionValue
                            ? `${company?.carValueReduction?.reductionValue} ${
                                company?.carValueReduction?.reductionType == "percentage" ? "%" : "AED"
                              }`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {company?.thirdPartyCommission ? company?.thirdPartyCommission || "-" : "-"}
                        </TableCell>
                        <TableCell>
                          {company?.comprehensiveCommission ? company?.comprehensiveCommission || "-" : "-"}
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={company?.eSanadRecommendation ? "success" : "error"}>
                            {company?.eSanadRecommendation ? (company?.eSanadRecommendation ? "Yes" : "No") : "-"}
                          </SeverityPill>
                        </TableCell>
                        <TableCell>
                          <SeverityPill color={company?.isActive ? "success" : "error"}>
                            {company?.isActive ? (company?.isActive ? "Yes" : "No") : "-"}
                          </SeverityPill>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? "long-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-haspopup="true"
                            onClick={(event) => handleClick(event, company._id)}
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

        {/* <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        /> */}
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
        <NextLink href={`/companies/${comId}/excess`} passHref>
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
                {/* <PencilAlt fontSize="small" /> */}
                <ExcessSvg fontSize="small" />
                {/* <Matrix fontSize="small" /> */}
              </IconButton>
              <Typography sx={{ textDecoration: "none" }}>Excess</Typography>
            </Link>
          </MenuItem>
        </NextLink>

        <NextLink href={`/companies/${comId}/conditions`} passHref>
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
                {/* <PencilAlt fontSize="small" /> */}
                <ConditionsSvg fontSize="small" />
              </IconButton>
              <Typography sx={{ textDecoration: "none" }}>Conditions</Typography>
            </Link>
          </MenuItem>
        </NextLink>

        <NextLink href={`/companies/${comId}/coverage-benefits`} passHref>
          <MenuItem key={"coverage-benefits-" + comId} sx={{ textDecoration: "none" }} onClick={handleClose}>
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
                <AddModeratorIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ textDecoration: "none" }}>Coverage & Benefits</Typography>
            </Link>
          </MenuItem>
        </NextLink>

        <NextLink href={`/companies/${comId}/matrix`} passHref>
          <MenuItem key={"matrix-" + comId} sx={{ textDecoration: "none" }} onClick={handleClose}>
            <Link
              color="textPrimary"
              component="a"
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <IconButton component="a">
                <Matrix fontSize="small" />
              </IconButton>
              <Typography sx={{ textDecoration: "none" }}>Matrix</Typography>
            </Link>
          </MenuItem>
        </NextLink>

        {moduleAccess(user, "companies.update") && (
          <NextLink href={`/companies/${comId}/edit`} passHref>
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
                <DeleteSvg fontSize="small" />
              </IconButton>
              <Typography color="black" sx={{ textDecoration: "none" }}>
                Delete
              </Typography>
            </Link>
          </MenuItem>
        )}

        <NextLink href={`/companies/${comId}`} passHref>
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

export default HealthInsuranceCompanyTable;
