import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import * as Yup from "yup";
import { EditIcon } from "src/Icons/EditIcon";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import ModalComp from "src/components/modalComp";
import VerifyModal from "src/components/verifyModal";

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    margin: "0 !important",
    marginLeft: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#60176F",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

const ProviderSelectedTable = (props) => {
  const {
    items = [],
    coveragesValues = [],
    deleteByIdHandler,
    onSubmitSelectedProviderList,
    handleCloseVerifymodal,
    verifyModal,
    setVerifyModal,
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    searchFilter,
  } = props;
  const [selectedProvider, setSelectedProvider] = useState();
  const { loginUserData: user } = useSelector((state) => state.auth);

  return (
    <>
      <Box sx={{ my: 3 }}>
        <Card>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ref No.</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Provider name</TableCell>
                    <TableCell>Emirate</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell sx={{ textAlign: "end" }}>Remove</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items?.length > 0 ? (
                    [...items]
                      ?.filter((item) => {
                        const regex = new RegExp(searchFilter, "i");
                        return (
                          regex.test(item?.refNo || "") ||
                          regex.test(item?.providerCode || "") ||
                          regex.test(item?.providerName || "") ||
                          regex.test(item?.emirate || "")
                        );
                      })
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map((provider) => {
                        return (
                          <TableRow hover>
                            <TableCell>{provider?.refNo}</TableCell>
                            <TableCell>{provider?.providerCode}</TableCell>
                            <TableCell sx={{ minWidth: 500 }}>{provider?.providerName}</TableCell>
                            <TableCell>{provider?.emirate}</TableCell>
                            <TableCell>{provider?.providerType}</TableCell>
                            <TableCell sx={{ textAlign: "end" }}>
                              {moduleAccess(user, "companies.delete") && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVerifyModal(true);
                                    setSelectedProvider(provider);
                                  }}
                                  component="a"
                                >
                                  <DeleteSvg fontSize="small" />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <Typography sx={{ fontSize: "14px", p: 2 }}>No any provider selected!</Typography>
                  )}
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
      </Box>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
        <VerifyModal
          label={"Are you sure, you want to delete this provider?"}
          handleClose={handleCloseVerifymodal}
          onSubmit={() => deleteByIdHandler(selectedProvider)}
        />
      </ModalComp>
    </>
  );
};

export default ProviderSelectedTable;
