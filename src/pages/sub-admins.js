import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SearchInput } from "src/components/search-input";
import AdminTable from "src/sections/sub-admins/admin-table";
import { useSelection } from "src/hooks/use-selection";
import ModalComp from "src/components/modalComp";
import { deleteAdminById, getAdminsList } from "src/sections/sub-admins/action/adminAcrion";
import {
  setAdminDetail,
  setAdminListPagination,
  setAdminListsearchFilter,
} from "src/sections/sub-admins/reducer/adminsSlice";
import { debounce } from "src/utils/debounce-search";
import AnimationLoader from "src/components/amimated-loader";

const SubAdmins = () => {
  const dispatch = useDispatch();
  const { adminList, adminListPagination, pagination, adminListLoader, adminListSearchFilter } = useSelector(
    (state) => state.admins
  );

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // all customer ids
  const useCompanyIds = (admins) => {
    return useMemo(() => {
      if (admins !== null) {
        return admins?.map((admin) => admin._id);
      }
    }, [admins]);
  };
  // console.log(adminList, "adminList");
  // all customer ids
  const companyIds = useCompanyIds(adminList);
  // checkbox selection
  const adminSelection = useSelection(companyIds);

  // search filter
  const [searchFilter, setSearchFilter] = useState({
    name: adminListSearchFilter?.name || "",
    scrollPosition: adminListSearchFilter?.scrollPosition || 0,
  });

  // Update the Redux store whenever searchFilter changes
  useEffect(() => {
    if (searchFilter) {
      dispatch(setAdminListsearchFilter(searchFilter));
    }
  }, [searchFilter]);

  // Restore scroll position when transaction list is loaded or updated
  useEffect(() => {
    if (adminListSearchFilter && !adminListLoader && adminList?.length > 0) {
      window.scrollTo({ top: parseInt(adminListSearchFilter?.scrollPosition, 10), behavior: "smooth" });
    }
  }, [adminList]);

  // Search filter
  const searchFilterHandler = (name) => {
    initialized.current = false;
    dispatch(
      setAdminListPagination({
        page: 1,
        size: 5,
      })
    );

    getAdminListHandler(name, 1, 5);
    setSearchFilter({ name: name, scrollPosition: 0 });
  };

  // Search handler with debounce
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Pagination
  const initialized = useRef(false);
  const getAdminListHandler = async (search = "", page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getAdminsList({ page: page || pagination?.page, size: size || pagination?.size, search: search || "" }))
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

  // useEffect to get admin list
  useEffect(() => {
    getAdminListHandler(adminListSearchFilter?.name);

      return () => {
        // dispatch(
        //   setAdminListPagination({
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
      dispatch(setAdminListPagination({ page: value + 1, size: pagination?.size }));

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(getAdminsList({ page: value + 1, size: pagination?.size, search: searchFilter?.name }));
    },
    [pagination?.size, searchFilter]
  );

  // Pagination - rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setAdminListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      setSearchFilter((prev) => ({
        ...prev,
        scrollPosition: 0,
      }));

      dispatch(
        getAdminsList({
          page: 1,
          size: event.target.value,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  // Delete modal
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [pagination]
  );

  // Delete admin
  const deleteByIdHandler = (id) => {
    dispatch(deleteAdminById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getAdminsList({
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
                <Typography variant="h4">Admins and Agents</Typography>
              </Stack>

              <NextLink href={`/sub-admins/create`} passHref onClick={() => dispatch(setAdminDetail(null))}>
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
              defaultValue={adminListSearchFilter?.name || ""}
            />

            {adminListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                {/* <CircularProgress /> */}
                <AnimationLoader open={true} />
              </Box>
            ) : (
              <>
                {adminList && (
                  <AdminTable
                    count={adminListPagination?.totalItems}
                    items={adminList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    deleteByIdHandler={deleteModalByIdHandler}
                    adminListSearchFilter={adminListSearchFilter}
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

SubAdmins.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SubAdmins;
