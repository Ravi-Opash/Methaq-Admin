import PropTypes from "prop-types";
import NextLink from "next/link";
import {
  Box,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO, isValid } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setCorporteCustomerSearchlist } from "./reducer/corpotateCustomerSlice";
import Link from "next/link";

export const CorporateCustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    corporateCustomerSearchFilter = {},
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const { loginUserData: user } = useSelector((state) => state.auth);

  const onclickhandler = () => {
    dispatch(setCorporteCustomerSearchlist({ ...corporateCustomerSearchFilter, scrollPosition: window?.scrollY }));
  };
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Bussiness source</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>CREATED AT</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items?.length > 0 &&
                items?.map((customer) => {
                  const isSelected = selected.includes(customer?._id);
                  const createdAt = format(parseISO(customer?.createdAt), "dd-MM-yyyy");

                  return (
                    <TableRow
                      hover
                      component={Link}
                      href={`/corporate-customers/${customer?._id}`}
                      key={customer?._id}
                      selected={isSelected}
                      onClick={() => onclickhandler()}
                      sx={{ cursor: "pointer", textDecoration: "none" }}
                    >
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{customer?.fullName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{customer?.source}</TableCell>
                      <TableCell>{customer?.industry}</TableCell>
                      <TableCell>{createdAt}</TableCell>

                      <TableCell align="right">
                        {moduleAccess(user, "customers.read") && (
                          <IconButton component="a">
                            <ArrowRight fontSize="small" />
                          </IconButton>
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

CorporateCustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
