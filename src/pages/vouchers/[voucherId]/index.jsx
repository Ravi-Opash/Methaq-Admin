import React, { useRef, useEffect, useCallback } from "react";
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import {
  getVoucherDetailsById,
  getVoucherHistoryList,  
} from "src/sections/voucher/action/voucherAction";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ArrowLeft } from "src/Icons/ArrowLeft"; 
import NextLink from "next/link"; 
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout"; 
import { PencilAlt } from "src/Icons/PencilAlt"; 
import VoucherSummary from "src/sections/voucher/voucher-summary"; 
import { toast } from "react-toastify"; 
import { moduleAccess } from "src/utils/module-access"; 
import VoucherHistoryTable from "src/sections/voucher/voucher-history-table"; 
import { setVoucherHistoryListPagination } from "src/sections/voucher/reducer/voucherSlice"; 
import AnimationLoader from "src/components/amimated-loader"; 

const VoucherDetails = () => {
  const dispatch = useDispatch(); 
  const router = useRouter();
  const { voucherId } = router.query; 

  // Selectors to get state from Redux store
  const {
    voucherDetail,
    voucherDetailLoader,
    voucherHistoryList,
    voucherHistoryListLoader,
    voucherHistoryListPagination,
    voucherHistoryPagination,
  } = useSelector((state) => state.voucher);

  const { loginUserData: user } = useSelector((state) => state.auth); 

  // Ref to track if voucher details have been initialized to avoid duplicate API calls
  const initialized = useRef(false);

  // Function to fetch voucher details by ID (if not already fetched)
  const getVoucherDetailsHandler = async () => {
    if (initialized.current) {
      return; 
    }
    initialized.current = true;

    try {
      dispatch(getVoucherDetailsById(voucherId)) // Dispatch action to fetch voucher details
        .unwrap()
        .then((res) => {
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

  // Fetch voucher details when the component mounts
  useEffect(() => {
    getVoucherDetailsHandler();
  }, []); 

  // Ref to track if voucher history has been fetched to avoid duplicate fetches
  const voucherHitoryListFilter = useRef(false);

  // Function to fetch voucher history list with pagination
  const getVouchersHistoryListFilterHandler = async (otherProps) => {
    if (voucherHitoryListFilter.current) {
      return; 
    }
    voucherHitoryListFilter.current = true;

    try {
      dispatch(
        getVoucherHistoryList({
          id: voucherId, 
          page: voucherHistoryPagination?.page,
          size: voucherHistoryPagination?.size,
        })
      );
    } catch (err) {
      toast(err, {
        type: "error",
      });
    }
  };

  // Fetch voucher history list when the component mounts
  useEffect(() => {
    getVouchersHistoryListFilterHandler();
    return () => {
      // Reset pagination when the component is unmounted
      dispatch(
        setVoucherHistoryListPagination({
          page: 1,
          size: 10, 
        })
      );
    };
  }, []); 

  // Function to handle page changes in the voucher history table
  const handleVoucherHistoryPageChange = useCallback(
    (event, value) => {
      dispatch(
        setVoucherHistoryListPagination({
          page: value + 1, 
          size: voucherHistoryPagination?.size, 
        })
      );

      dispatch(
        getVoucherHistoryList({
          id: voucherId,
          page: value + 1, 
          size: voucherHistoryPagination?.size,
        })
      );
    },
    [voucherHistoryPagination?.size] 
  );

  // Function to handle change in the number of rows per page for voucher history
  const handleVoucherHistoryRowsPerPageChange = useCallback(
    (event) => {
      dispatch(
        setVoucherHistoryListPagination({
          page: 1,
          size: event.target.value, 
        })
      );

      dispatch(
        getVoucherHistoryList({
          id: voucherId,
          page: 1,
          size: event.target.value,
        })
      );
    },
    [voucherHistoryPagination?.page] 
  );

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
          {voucherDetailLoader ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
              <AnimationLoader open={!!voucherDetailLoader} /> 
            </Box>
          ) : (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box sx={{ display: "inline-block" }}>
                {/* Back link to voucher list */}
                <NextLink href="/vouchers" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} /> 
                    <Typography variant="subtitle2">Vouchers</Typography> 
                  </Link>
                </NextLink>
              </Box>

              {voucherDetail && (
                <>
                  <Box sx={{ my: 3, display: "inline-block", width: "100%" }}>
                    <Grid container justifyContent="space-between" spacing={3}>
                      <Grid item>
                        <Typography variant="h4">Voucher Details</Typography>
                      </Grid>
                      <Grid item sx={{ ml: -2 }}>
                        {moduleAccess(user, "vouchers.update") && (
                          <NextLink href={`/vouchers/${voucherDetail?._id}/edit`} passHref>
                            {/* Edit button if the user has permission */}
                            <Button
                              component="a"
                              endIcon={<PencilAlt fontSize="small" />}
                              sx={{ m: 1 }}
                              variant="contained"
                            >
                              Edit
                            </Button>
                          </NextLink>
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Display voucher summary */}
                  <VoucherSummary voucherDetail={voucherDetail} />

                  {voucherHistoryListLoader ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: "10rem !important" }}>
                      <CircularProgress /> 
                    </Box>
                  ) : (
                    <>
                      {voucherHistoryList && (
                        <VoucherHistoryTable
                          count={voucherHistoryListPagination?.totalItems} 
                          items={voucherHistoryList} 
                          onPageChange={handleVoucherHistoryPageChange}
                          onRowsPerPageChange={handleVoucherHistoryRowsPerPageChange}
                          page={voucherHistoryPagination?.page - 1}
                          rowsPerPage={voucherHistoryPagination?.size} 
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

VoucherDetails.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default VoucherDetails;
