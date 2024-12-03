import React, { useEffect, useRef } from "react";
import NextLink from "next/link";
import { Box, Container, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getVoucherDetailsById } from "src/sections/voucher/action/voucherAction";
import VoucherEditForm from "src/sections/voucher/voucher-edit-form";
import { toast } from "react-toastify";

const VoucherEdit = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { voucherId } = router.query;
  const { voucherDetail } = useSelector((state) => state.voucher);


  const initialized = useRef(false);
  const getVoucherDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getVoucherDetailsById(voucherId))
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

  useEffect(
    () => {
      getVoucherDetailsHandler();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
          {voucherDetail ? (
            <>
              <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
                <Box
                  sx={{
                    display: "inline-block",
                  }}
                >
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
              </Box>

              <Box mt={3}>
                <VoucherEditForm />
              </Box>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </Container>
      </Box>
    </>
  );
};

VoucherEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default VoucherEdit;
