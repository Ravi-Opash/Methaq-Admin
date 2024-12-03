import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import NextLink from "next/link";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComp from "src/components/modalComp";
import { SearchInput } from "src/components/search-input";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { changeProductStatusById, deleteProductById, getProductList } from "src/sections/products/action/productAction";
import ProductsTable from "src/sections/products/products-table";
import { setProductListPagination, setproductDetail } from "src/sections/products/reducer/productSlice";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import AnimationLoader from "src/components/amimated-loader";

const Products = () => {
  const dispatch = useDispatch();
  const { productList, productListPagination, pagination, productListLoader } = useSelector((state) => state.products);
  const { loginUserData: user } = useSelector((state) => state.auth);

  const [searchFilter, setSearchFilter] = useState("");

  // Search handler
  const searchFilterHandler = (value) => {
    setSearchFilter(value);
  };

  const [deleteId, setDeleteId] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // all customer ids
  const useProductsIds = (products) => {
    return useMemo(() => {
      if (products !== null) {
        return products?.map((product) => product._id);
      }
    }, [products]);
  };

  // all customer ids
  const productsIds = useProductsIds(productList);
  // checkbox selection
  const productsSelection = useSelection(productsIds);

  const initialized = useRef(false);

  // Get customer list
  const getProductListHandler = async (page, size) => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getProductList({ page: page || pagination?.page, size: size || pagination?.size }))
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

  // Get customer list
  useEffect(
    () => {
      getProductListHandler();

      return () => {};
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Pagination - page change
  const handlePageChange = useCallback(
    (event, value) => {
      // setPage(value);
      dispatch(setProductListPagination({ page: value + 1, size: pagination?.size }));
      dispatch(getProductList({ page: value + 1, size: pagination?.size }));
    },
    [pagination?.size]
  );

  // Pagination - rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      // console.log("handleRowsPerPageChange", event.target.value);
      // setRowsPerPage(event.target.value);
      dispatch(
        setProductListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getProductList({
          page: 1,
          size: event.target.value,
        })
      );
    },
    [pagination?.page]
  );

  // Change Status
  const changeStatusHandler = useCallback(
    (data) => {
      if (moduleAccess(user, "product.update")) {
        dispatch(changeProductStatusById(data))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              dispatch(
                getProductList({
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
            if (err) {
              toast(err, {
                type: "error",
              });
            }
          });
      }
    },
    [pagination]
  );

  // Delete
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [pagination]
  );

  //  Delete
  const deleteByIdHandler = (id) => {
    dispatch(deleteProductById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getProductList({
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
                <Typography variant="h4">Products</Typography>
              </Stack>

              {moduleAccess(user, "product.create") && (
                <NextLink href={`/products/create`} passHref onClick={() => dispatch(setproductDetail(null))}>
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

            <SearchInput placeHolder="Search product" searchFilterHandler={searchFilterHandler} />

            {productListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                {/* <CircularProgress /> */}
                <AnimationLoader open={!!productListLoader} />
              </Box>
            ) : (
              <>
                {productList && (
                  <ProductsTable
                    count={productListPagination?.totalItems}
                    items={productList}
                    onDeselectAll={productsSelection.handleDeselectAll}
                    onDeselectOne={productsSelection.handleDeselectOne}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    onSelectAll={productsSelection.handleSelectAll}
                    onSelectOne={productsSelection.handleSelectOne}
                    page={pagination?.page - 1}
                    rowsPerPage={pagination?.size}
                    selected={productsSelection.selected}
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

Products.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Products;
