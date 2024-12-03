import React, { useState, useRef, useEffect, useCallback } from "react";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SearchInput } from "src/components/search-input";
import ModalComp from "src/components/modalComp";
import { debounce } from "src/utils/debounce-search";
import { deleteSalesAdminById, getSalesAdminsList } from "src/sections/sales-agent/action/salesAdminAction";
import {
  setSalesAdminDetail,
  setSalesAdminListPagination,
  setSalesadminSearchFilter,
} from "src/sections/sales-agent/reducer/salesAdminSlice";
import SalesAdminTable from "src/sections/sales-agent/sales-agent-table";
import AnimationLoader from "src/components/amimated-loader";

const SalesAdmin = () => {
  const dispatch = useDispatch();
  const { salesAdminList, salesAdminListPagination, pagination, salesAdminListLoader, salesAdminSearchFilter } =
    useSelector((state) => state.salesAdmins);

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // all customer ids
  const [searchFilter, setSearchFilter] = useState({
    name: salesAdminSearchFilter?.name || "",
    scrollPosition: salesAdminSearchFilter?.scrollPosition || 0,
  });

  // search filter
  useEffect(() => {
    if (searchFilter) {
      dispatch(setSalesadminSearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when salesAdmin list is loaded or updated
  useEffect(() => {
    if (salesAdminSearchFilter && !salesAdminListLoader && salesAdminList?.length > 0) {
      window.scrollTo({ top: parseInt(salesAdminSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [salesAdminList]);

  // Search filter handler
  const searchFilterHandler = (name) => {
    initialized.current = false;
    dispatch(
      setSalesAdminListPagination({
        page: 1,
        size: 5,
      })
    );

    getSalesAdminListHandler(name, 1, 5);
    setSearchFilter({ name: name, scrollPosition: 0 });
  };

  // Debounce handler
  const debounceHandler = debounce(searchFilterHandler, 1000);

  const initialized = useRef(false);

  // Get salesAdmin list
  const getSalesAdminListHandler = async (search = "", page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(
        getSalesAdminsList({ page: page || pagination?.page, size: size || pagination?.size, search: search || "" })
      )
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

  // Get salesAdmin list
  useEffect(
    () => {
      getSalesAdminListHandler(salesAdminSearchFilter?.name);

      return () => {
        // dispatch(
        //   setSalesAdminListPagination({
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
      dispatch(setSalesAdminListPagination({ page: value + 1, size: pagination?.size }));

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(getSalesAdminsList({ page: value + 1, size: pagination?.size, search: searchFilter?.name }));
    },
    [pagination?.size, searchFilter]
  );

  // Pagination - handle rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setSalesAdminListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getSalesAdminsList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  // Delete admin
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [pagination]
  );

  // Delete admin
  const deleteByIdHandler = (id) => {
    dispatch(deleteSalesAdminById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getSalesAdminsList({
              page: pagination?.page,
              size: pagination?.size,
              search: searchFilter?.name,
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
                <Typography variant="h4">Sales Agent</Typography>
              </Stack>

              <NextLink href={`/sales-agent/create`} passHref onClick={() => dispatch(setSalesAdminDetail(null))}>
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
              </NextLink>
            </Stack>

            <SearchInput
              placeHolder="Search Admins"
              searchFilterHandler={debounceHandler}
              defaultValue={salesAdminSearchFilter?.name || ""}
            />

            {salesAdminListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                {/* <CircularProgress /> */}
                <AnimationLoader open={true} />
              </Box>
            ) : (
              <>
                {salesAdminList && (
                  <SalesAdminTable
                    count={salesAdminListPagination?.totalItems}
                    items={salesAdminList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    searchFilter={searchFilter}
                    deleteByIdHandler={deleteModalByIdHandler}
                    salesAdminSearchFilter={salesAdminSearchFilter}
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
            // onClick={()=>{console.log(deleteId)}}
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

SalesAdmin.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SalesAdmin;
