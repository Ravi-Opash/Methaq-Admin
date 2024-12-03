import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Link } from "@mui/material";
import NextLink from "next/link";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalComp from "src/components/modalComp";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import { useRouter } from "next/router";
import { setDiscountListPagination, setdiscountDetail } from "src/sections/partners/reducer/partnerSlice";
import {
  changeDiscountStatusById,
  deleteDiscountById,
  getDiscountList,
} from "src/sections/partners/action/partnerAction";
import PartnerDiscountTable from "src/sections/partners/partner-discount-table";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import AnimationLoader from "src/components/amimated-loader";

const Discounts = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { discountList, discountListPagination, discountPagination, discountListLoader } = useSelector(
    (state) => state.partners
  );
  const { loginUserData: user } = useSelector((state) => state.auth);

  const { partnerId } = router.query;

  const [deleteId, setDeleteId] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const initialized = useRef(false);

  // Function to Get discount API
  const getDiscountListHandler = async (search) => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(
        getDiscountList({
          page: discountPagination?.page,
          size: discountPagination?.size,
          id: partnerId,
        })
      )
        .unwrap()
        .then((res) => {
          // console.log("res", res);
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

  // Function to Get discount API
  useEffect(() => {
    getDiscountListHandler();

    return () => {
      dispatch(
        setDiscountListPagination({
          page: 1,
          size: 5,
        })
      );
    };
  }, []);

  // Function to handle pagination
  const handlePageChange = useCallback(
    (event, value) => {
      // setPage(value);
      dispatch(setDiscountListPagination({ page: value + 1, size: discountPagination?.size }));
      dispatch(getDiscountList({ page: value + 1, size: discountPagination?.size, id: partnerId }));
    },
    [discountPagination?.size]
  );

  // Function to handle rows per page
  const handleRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setDiscountListPagination({
          page: 1,
          size: event.target.value,
        })
      );

      dispatch(
        getDiscountList({
          page: 1,
          size: event.target.value,
          id: partnerId,
        })
      );
    },
    [discountPagination?.page]
  );

  // Function to change status
  const changeStatusHandler = useCallback(
    (data) => {
      if (moduleAccess(user, "partners.update")) {
        dispatch(changeDiscountStatusById(data))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              dispatch(
                getDiscountList({
                  page: discountPagination?.page,
                  size: discountPagination?.size,
                  id: partnerId,
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
    [discountPagination]
  );

  // Function to delete
  const deleteModalByIdHandler = useCallback(
    (id) => {
      setOpen(true);
      setDeleteId(id);
    },
    [discountPagination]
  );

  // Function to delete
  const deleteByIdHandler = (id) => {
    dispatch(deleteDiscountById(id))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          dispatch(
            getDiscountList({
              page: discountPagination?.page,
              size: discountPagination?.size,
              id: partnerId,
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
            <NextLink href={`/partners`} passHref>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Partners</Typography>
              </Link>
            </NextLink>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1} mb={4}>
                <Typography variant="h4">Discounts and offers of {discountList?.[0]?.partner?.companyName}</Typography>
              </Stack>

              {moduleAccess(user, "partners.create") && (
                <NextLink
                  href={`/partners/${partnerId}/discount-offers/create`}
                  passHref
                  onClick={() => dispatch(setdiscountDetail(null))}
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

            {/* <SearchInput placeHolder="Search discount" searchFilterHandler={debounceHandler} /> */}

            {discountListLoader ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                {/* <CircularProgress /> */}
                <AnimationLoader open={!!discountListLoader} />
              </Box>
            ) : (
              <>
                {discountList && (
                  <PartnerDiscountTable
                    count={discountListPagination?.totalItems}
                    items={discountList}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={discountPagination?.page - 1}
                    rowsPerPage={discountPagination?.size}
                    // searchFilter={searchFilter}
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

Discounts.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Discounts;
