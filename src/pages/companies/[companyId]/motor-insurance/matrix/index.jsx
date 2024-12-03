import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMatrixById,
  getCompanyDetailById,
  getMatrixListByCompanyId,
} from "src/sections/companies/action/companyAcrion";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  Typography,
  SvgIcon,
  CircularProgress,
  Grid,
  OutlinedInput,
  InputAdornment,
  Card,
} from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import CompanyMatrixTable from "src/sections/companies/matrix/company-matrix-table";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { setMatrixDetail, setMatrixListPagination } from "src/sections/companies/reducer/companySlice";
import ModalComp from "src/components/modalComp";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { debounce } from "src/utils/debounce-search";
import { moduleAccess } from "src/utils/module-access";

const Matrix = () => {
  const dispatch = useDispatch();
  const { pagination, matrixList, matrixListPagination, companyDetail, matrixListLoader } = useSelector(
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

  const [searchFilter, setSearchFilter] = useState({
    name: "",
  });

  const searchFilterHandler = (value) => {
    setSearchFilter(value);
  };

  const initialized = useRef(false);

  // Search matrix handler
  const searchMatrixFilterHandler = (name, value) => {
    initialized.current = false;

    dispatch(
      setMatrixListPagination({
        page: 1,
        size: 10,
      })
    );

    if (name && (value === "" || value)) {
      getMatrixListHandler({ [name]: value });

      setSearchFilter((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      getMatrixListHandler();
    }
  };

  const debounceMatrixHandler = debounce(searchMatrixFilterHandler, 1000);

  // Get motor matrix list API
  const getMatrixListHandler = async (otherProps) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    let payload = { ...searchFilter, ...otherProps };

    try {
      dispatch(
        getMatrixListByCompanyId({
          page: pagination?.page,
          size: pagination?.size,
          id: companyId,
          search: payload?.name,
        })
      )
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
    getMatrixListHandler();

    return () => {
      dispatch(
        setMatrixListPagination({
          page: 1,
          size: 10,
        })
      );
    };
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (event, value) => {
      dispatch(setMatrixListPagination({ page: value + 1, size: pagination?.size }));
      dispatch(
        getMatrixListByCompanyId({
          page: value + 1,
          size: pagination?.size,
          id: companyId,
          search: searchFilter?.name,
        })
      );
    },
    [pagination?.size]
  );

  // Rows per page change API
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setMatrixListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getMatrixListByCompanyId({
          page: 1,
          size: event.target.value,
          id: companyId,
          search: searchFilter?.name,
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

  // Delete Matrix API
  const deleteByIdHandler = (id) => {
    dispatch(deleteMatrixById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getMatrixListByCompanyId({
              page: pagination?.page,
              size: pagination?.size,
              id: companyId,
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

            {companyDetail && (
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Matrix of {companyDetail?.companyName}</Typography>
                </Stack>

                {moduleAccess(user, "companies.create") && (
                  <NextLink
                    href={`/companies/${companyId}/motor-insurance/matrix/createMatrix`}
                    passHref
                    onClick={() => dispatch(setMatrixDetail(null))}
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
            )}

            <Grid item xs={12} md={3}>
              <Box sx={{ display: "inline-block", width: "100%" }}>
                <Card sx={{ p: 2 }}>
                  <OutlinedInput
                    defaultValue=""
                    fullWidth
                    name="name"
                    placeholder={"Search Matrix" || ""}
                    onChange={(e) => debounceMatrixHandler(e.target.name, e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <MagnifyingGlassIcon />
                        </SvgIcon>
                      </InputAdornment>
                    }
                    sx={{ maxWidth: 500 }}
                  />
                </Card>
              </Box>
            </Grid>

            {matrixListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {matrixList && (
                  <>
                    <CompanyMatrixTable
                      count={matrixListPagination?.totalItems}
                      items={matrixList}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      page={pagination?.page - 1}
                      rowsPerPage={pagination?.size}
                      searchFilter={searchFilter}
                      deleteByIdHandler={deleteModalByIdHandler}
                    />
                  </>
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
