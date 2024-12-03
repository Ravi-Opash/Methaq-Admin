import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { deleteExcessbyExcessId, getExcessByCompanyId } from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { Box, Button, Container, Link, Stack, Typography, SvgIcon, CircularProgress } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import { SearchInput } from "src/components/search-input";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { setExcessDetail, setExcessListPagination } from "src/sections/companies/reducer/companySlice";
import ModalComp from "src/components/modalComp";
import CompanyExcessTable from "src/sections/companies/excess/excess-table";
import { getCompanyDetailById } from "src/sections/companies/action/companyAcrion";
import { moduleAccess } from "src/utils/module-access";
const Matrix = () => {
  const dispatch = useDispatch();
  const { pagination, excessList, excessListPagination, companyDetail, excessListLoader } = useSelector(
    (state) => state.company
  );
  const { loginUserData: user } = useSelector((state) => state.auth);
  const router = useRouter();
  const { companyId } = router.query;

  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(getCompanyDetailById(companyId));
  }, []);

  const [searchFilter, setSearchFilter] = useState("");
  const searchFilterHandler = (value) => {
    setSearchFilter(value);
  };

  const initialized = useRef(false);

  // Get excess API
  const getExcessListHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    try {
      dispatch(getExcessByCompanyId({ page: pagination?.page, size: pagination?.size, id: companyId }))
        .unwrap()
        .then((res) => {})
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getExcessListHandler();

    return () => {
      dispatch(
        setExcessListPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []);

  // Page change handler
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(setExcessListPagination({ page: value + 1, size: pagination?.size }));
      dispatch(getExcessByCompanyId({ page: value + 1, size: pagination?.size, id: companyId }));
    },
    [pagination?.size]
  );

  // Rows per page change handler
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setExcessListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getExcessByCompanyId({
          page: 1,
          size: event.target.value,
          id: companyId,
        })
      );
    },
    [pagination?.page]
  );

  // Delete button click handler
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [pagination]
  );

  // Delete Excess API
  const deleteByIdHandler = (id) => {
    dispatch(deleteExcessbyExcessId({ id: companyId, excessId: id }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getExcessByCompanyId({
              page: pagination?.page,
              size: pagination?.size,
              id: companyId,
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
            <Stack direction="row">
              <NextLink href={`/companies/${companyId}/motor-insurance`} passHref>
                <Link
                  color="textPrimary"
                  component="a"
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">Companies</Typography>
                </Link>
              </NextLink>
            </Stack>

            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Excess of {companyDetail?.companyName}</Typography>
              </Stack>

              {moduleAccess(user, "companies.create") && (
                <NextLink
                  href={`/companies/${companyId}/motor-insurance/excess/create`}
                  passHref
                  onClick={() => dispatch(setExcessDetail(null))}
                >
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

            <SearchInput placeHolder="Search Excess" searchFilterHandler={searchFilterHandler} />

            {excessListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {excessList && (
                  <CompanyExcessTable
                    count={excessListPagination?.totalItems}
                    items={excessList}
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

Matrix.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Matrix;
