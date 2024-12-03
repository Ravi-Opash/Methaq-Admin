import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import { Box, Button, Container, Link, Typography } from "@mui/material";
import { ArrowLeft } from "src/Icons/ArrowLeft";
import NextLink from "next/link";
import AdminEditForm from "src/sections/sub-admins/subAdmin-edit-form";
import { getAdminDetailById } from "src/sections/sub-admins/action/adminAcrion";
import ModalComp from "src/components/modalComp";
import { ChangePassword } from "src/sections/account/change-password";
import { ChangePasswordByAdmin } from "src/sections/sub-admins/change-sunAdmin-password";
import SalesAgentEditForm from "src/sections/sales-agent/sales-agent-edit-form";
import { getSalesAdminDetailById } from "src/sections/sales-agent/action/salesAdminAction";

const AdminEdit = () => {
  const dispatch = useDispatch();
  const { salesAdminDetail } = useSelector((state) => state.salesAdmins);
  const router = useRouter();
  const { agentId } = router.query;

  // console.log("salesAdminDetail", salesAdminDetail);

  const initialized = useRef(false);

  // Function to get company details
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      // Function to get company details
      dispatch(getSalesAdminDetailById(agentId))
        .unwrap()
        .then((res) => {
          // console.log("res", res);
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

  // useEffect to get company details
  useEffect(
    () => {
      getCompanyDetailsHandler();
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
          {salesAdminDetail ? (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href="/sales-agent" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Sales Agents</Typography>
                  </Link>
                </NextLink>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography mt={2} variant="h4">
                  Edit Agent
                </Typography>
              </Box>

              <Box mt={3}>
                <SalesAgentEditForm />
              </Box>
            </Box>
          ) : (
            <div>Loading...</div>
          )}
        </Container>
      </Box>
    </>
  );
};

AdminEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AdminEdit;
