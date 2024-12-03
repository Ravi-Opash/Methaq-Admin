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
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearBlackListInfo, setBlackListsearchFilter } from "./reducer/blackListSlice";

export const BlackListTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteBlackHandler,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    blackListsearchFilter = {},
  } = props;

  const dispatch = useDispatch();
  const { loginUserData: user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearBlackListInfo());
  }, []);

  const onClickhandler = () => {
    dispatch(setBlackListsearchFilter({ ...blackListsearchFilter, scrollPosition: window?.scrollY }));
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 400 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Mobile no.</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items?.length > 0 &&
                items?.map((backList) => {
                  const isSelected = selected.includes(backList?._id);

                  return (
                    <TableRow hover key={backList?._id} selected={isSelected}>
                      <TableCell>{backList?.email || "-"}</TableCell>
                      <TableCell>{backList?.mobileNumber || "-"}</TableCell>

                      <TableCell align="right">
                        {moduleAccess(user, "blacklist.delete") && (
                          <Button
                            onClick={() => {
                              deleteBlackHandler(backList?._id);
                              onClickhandler();
                            }}
                          >
                            <IconButton component="a">
                              <DeleteSvg fontSize="small" />
                            </IconButton>
                          </Button>
                        )}
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
  );
};
