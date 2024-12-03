import PropTypes from "prop-types";
import {
  Box,
  Button,
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
import { PencilAlt } from "src/Icons/PencilAlt";
import { ArrowRight } from "src/Icons/ArrowRight";
import { DeleteSvg } from "src/Icons/DeleteSvg";
import { SeverityPill } from "src/components/severity-pill";
import { format, parseISO, isValid } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setCustomerSearchFilter } from "./reducer/customerSlice";
import Link from "next/link";

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onPageChange = () => {},
    onRowsPerPageChange,
    deleteCustomerHandler,
    changeStatusHandler,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    customerSearchFilter = {},
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const { loginUserData: user } = useSelector((state) => state.auth);

  const onClickhandler = () => {
    dispatch(setCustomerSearchFilter({ ...customerSearchFilter, scrollPosition: window?.scrollY }));
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Signed Up</TableCell>
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
                      key={customer?._id}
                      selected={isSelected}
                      href={`/customers/${customer?._id}`}
                      component={Link}
                      onClick={() => onClickhandler()}
                      sx={{ cursor: "pointer", textDecoration: "none" }}
                    >
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Typography variant="subtitle2">{customer?.fullName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{customer?.email}</TableCell>
                      <TableCell>{customer?.role}</TableCell>
                      <TableCell>
                        {isValid(parseISO(customer?.dateOfBirth))
                          ? format(parseISO(customer?.dateOfBirth), "dd/MM/yyyy")
                          : customer?.dateOfBirth}
                      </TableCell>
                      <TableCell>
                        <SeverityPill
                          color={customer?.isBlock ? "error" : "success"}
                          onClick={() =>
                            changeStatusHandler({
                              coustomerId: customer?._id,
                              isBlock: !customer?.isBlock,
                            })
                          }
                          sx={{
                            cursor: "pointer",
                          }}
                        >
                          {customer?.isBlock ? "Inactive" : "Active"}
                        </SeverityPill>
                      </TableCell>
                      <TableCell>{customer?.mobileNumber}</TableCell>
                      <TableCell>{createdAt}</TableCell>

                      <TableCell align="right">
                        {moduleAccess(user, "customers.update") && (
                          <IconButton
                            component="a"
                            onClick={(e) => {
                              e?.stopPropagation();
                              e.preventDefault();
                              router.push(`/customers/${customer?._id}/edit`);
                            }}
                          >
                            <PencilAlt fontSize="small" />
                          </IconButton>
                        )}

                        {moduleAccess(user, "customers.delete") && (
                          <Button
                            data-cy="open-modal"
                            onClick={(e) => {
                              e?.stopPropagation();
                              e?.preventDefault();
                              deleteCustomerHandler(customer?._id);
                            }}
                          >
                            <IconButton component="a">
                              <DeleteSvg fontSize="small" />
                            </IconButton>
                          </Button>
                        )}

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

CustomersTable.propTypes = {
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
