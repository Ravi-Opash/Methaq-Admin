import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComp from "src/components/modalComp";
import { SearchInput } from "src/components/search-input";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import CompanyPartnersTable from "src/sections/partners/company-partner-table";
import { setPartnerListPagination, setpartnerDetail } from "src/sections/partners/reducer/partnerSlice";
import { deletePartnerById, getPartnerList } from "src/sections/partners/action/partnerAction";
import { debounce } from "src/utils/debounce-search";
import AnimationLoader from "src/components/amimated-loader";

const Partners = () => {
  const dispatch = useDispatch();
  const { partnerList, partnerListPagination, pagination, partnerListLoader } = useSelector((state) => state.partners);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [searchFilter, setSearchFilter] = useState("");

  const [deleteId, setDeleteId] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const initialized = useRef(false);

  // Function to get partner details
  const searchFilterHandler = (name) => {
    initialized.current = false;
    dispatch(
      setPartnerListPagination({
        page: 1,
        size: 5,
      })
    );

    getPartnerListHandler(name, 1, 10);
    setSearchFilter(name);
  };

  // Function to get partner details
  const debounceHandler = debounce(searchFilterHandler, 1000);

  // Function to get partner details
  const getPartnerListHandler = async (search, page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getPartnerList({ page: page || pagination?.page, size: size || pagination?.size, search: search || "" }))
        .unwrap()
        .then((res) => {
          // console.log("res- getCustomerListHandler", res);
        })
        .catch((err) => {
          if (err) {
            toast(err, {
              type: "error",
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Function to get partner list details
  useEffect(() => {
    getPartnerListHandler();

    return () => {
      // dispatch(
      //   setPartnerListPagination({
      //     page: 1,
      //     size: 5,
      //   })
      // );
    };
  }, []);

  // Function to page change
  const handlePageChange = useCallback(
    (event, value) => {
      // setPage(value);
      dispatch(setPartnerListPagination({ page: value + 1, size: pagination?.size }));
      dispatch(getPartnerList({ page: value + 1, size: pagination?.size, search: searchFilter }));
    },
    [pagination?.size, searchFilter]
  );

  // Function to rows per page change
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setPartnerListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getPartnerList({
          page: 1,
          size: event.target.value,
        })
      );
    },
    [pagination?.page, searchFilter]
  );

  // Function to delete
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [pagination]
  );

  // Function to delete
  const deleteByIdHandler = (id) => {
    dispatch(deletePartnerById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getPartnerList({
              page: pagination?.page,
              size: pagination?.size,
              search: searchFilter,
            })
          );

          setOpen(false);

          toast("Successfully Deleted", {
            type: "success",
          });
        }
      })
      .catch((err) => {
        if (err) {
          toast(err, {
            type: "error",
          });
        }
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
                <Typography variant="h4">Partners</Typography>
              </Stack>

              {moduleAccess(user, "partners.create") && (
                <NextLink href={`/partners/create`} passHref onClick={() => dispatch(setpartnerDetail(null))}>
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
              )}
            </Stack>

            <SearchInput placeHolder="Search partner" searchFilterHandler={debounceHandler} />

            {partnerListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                {/* <CircularProgress /> */}
                <AnimationLoader open={!!partnerListLoader} />
              </Box>
            ) : (
              <>
                {partnerList && (
                  <CompanyPartnersTable
                    count={partnerListPagination?.totalItems}
                    items={partnerList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    searchFilter={searchFilter}
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

Partners.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Partners;
