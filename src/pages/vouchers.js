import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, debounce, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SearchInput } from "src/components/search-input";
import { useSelector, useDispatch } from "react-redux";
import { changeVoucherStatusById, deleteVoucherById, getVoucherList } from "src/sections/voucher/action/voucherAction";
import VoucherTable from "src/sections/voucher/voucher-table";
import { useSelection } from "src/hooks/use-selection";
import ModalComp from "src/components/modalComp";
import NextLink from "next/link";
import { toast } from "react-toastify";
import {
  setVoucherDetail,
  setVoucherListPagination,
  setVoucherDetailsSearchFilter,
} from "src/sections/voucher/reducer/voucherSlice";
import { moduleAccess } from "src/utils/module-access";
import AnimationLoader from "src/components/amimated-loader";

const Voucher = () => {
  const { voucherList, voucherListPagination, pagination, voucherListLoader, voucherSearchfilter } = useSelector(
    (state) => state.voucher
  );
  const { loginUserData: user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // all customer ids
  const useCustomerIds = (customers) => {
    return useMemo(() => {
      if (customers !== null) {
        return customers?.map((customer) => customer._id);
      }
    }, [customers]);
  };

  // all customer ids
  const voucherIds = useCustomerIds(voucherList);
  // checkbox selection
  const voucherSelection = useSelection(voucherIds);

  // console.log("voucherList", voucherList);
  // console.log("pagination", pagination);

  const [searchFilter, setSearchFilter] = useState({
    name: voucherSearchfilter?.name || "",
  });

  // Update the Redux store whenever searchFilter changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setVoucherDetailsSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Search filter
  const searchFilterHandler = (name) => {
    initialized.current = false;
    dispatch(
      setVoucherListPagination({
        page: 1,
        size: 5,
      })
    );

    getVoucherListHandler(name, 1, 10);
    setSearchFilter((prevState) => ({ ...prevState, name }));
  };

  // Search filter add debounce for 1 second delay
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Get voucher list
  const initialized = useRef(false);
  const getVoucherListHandler = async (search, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getVoucherList({ page: page || pagination?.page, size: size || pagination?.size, search: search || "" }))
        .unwrap()
        .then((res) => {
          // console.log("res- getCustomerListHandler", res);
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Get voucher list
  useEffect(() => {
    getVoucherListHandler(voucherSearchfilter?.name);

      return () => {
        // dispatch(
        //   setVoucherListPagination({
        //     page: 1,
        //     size: 5,
        //   })
        // );
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(setVoucherListPagination({ page: value + 1, size: pagination?.size }));
      dispatch(getVoucherList({ page: value + 1, size: pagination?.size, search: searchFilter }));
    },
    [pagination?.size, searchFilter]
  );

  // Pagination - rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setVoucherListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getVoucherList({
          page: 1,
          size: event.target.value,
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  // Change status by id
  const changeStatusHandler = useCallback(
    (data) => {
      // console.log("changeStatusHandler", data);

      dispatch(changeVoucherStatusById(data))
        .unwrap()
        .then((res) => {
          if (res?.success) {
            dispatch(
              getVoucherList({
                page: pagination?.page,
                size: pagination?.size,
              })
            );

            toast("Successfully Changed", {
              type: "success",
            });
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    },
    [pagination]
  );

  // Delete modal
  const deleteModalByIdHandler = useCallback(
    (id) => {
      // console.log("delete id", id);
      setOpen(true);
      setDeleteId(id);
    },
    [pagination]
  );

  // Delete voucher
  const deleteByIdHandler = (id) => {
    // console.log("id", id);
    dispatch(deleteVoucherById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getVoucherList({
              page: pagination?.page,
              size: pagination?.size,
            })
          );
          setOpen(false);

          toast("Successfully Deleted", {
            type: "success",
          });
        }
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Vouchers</Typography>
              </Stack>

              <NextLink href={`/vouchers/create`} passHref onClick={() => dispatch(setVoucherDetail(null))}>
                {moduleAccess(user, "vouchers.create") && (
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Add
                  </Button>
                )}
              </NextLink>
            </Stack>

            <SearchInput
              placeHolder="Search voucher"
              searchFilterHandler={debounceHandler}
              defaultValue={voucherSearchfilter?.name || ""}
            />

            {voucherListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                {/* <CircularProgress /> */}
                <AnimationLoader open={!!voucherListLoader} />
              </Box>
            ) : (
              <>
                {voucherList && (
                  <VoucherTable
                    count={voucherListPagination?.totalItems}
                    items={voucherList}
                    onDeselectAll={voucherSelection.handleDeselectAll}
                    onDeselectOne={voucherSelection.handleDeselectOne}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onSelectAll={voucherSelection.handleSelectAll}
                    onSelectOne={voucherSelection.handleSelectOne}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    selected={voucherSelection.selected}
                    searchFilter={searchFilter}
                    changeStatusHandler={changeStatusHandler}
                    deleteByIdHandler={deleteModalByIdHandler}
                  />
                )}
              </>
            )}
          </Stack>
        </Container>
      </Box>

      <ModalComp open={open} handleClose={handleClose}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to delete ?
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
          mt={3}
        >
          <Button
            variant="contained"
            sx={{
              marginRight: "10px",
            }}
            onClick={() => deleteByIdHandler(deleteId)}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </ModalComp>
    </>
  );
};

Voucher.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Voucher;
