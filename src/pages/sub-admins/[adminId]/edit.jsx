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
import { ChangePasswordByAdmin } from "src/sections/sub-admins/change-sunAdmin-password";
import AnimationLoader from "src/components/amimated-loader";

const AdminEdit = () => {
  const dispatch = useDispatch();
  const { adminDetail } = useSelector((state) => state.admins);
  const router = useRouter();
  const { adminId } = router.query;

  const [openModal, setOpenModal] = useState(false);

  const handlePasswordChange = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const initialized = useRef(false);
  const getCompanyDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getAdminDetailById(adminId))
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
          {adminDetail ? (
            <Box sx={{ mb: 4, display: "inline-block", width: "100%" }}>
              <Box
                sx={{
                  display: "inline-block",
                }}
              >
                <NextLink href="/sub-admins" passHref>
                  <Link
                    color="textPrimary"
                    component="a"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ArrowLeft fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Admins and Agents</Typography>
                  </Link>
                </NextLink>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography mt={2} variant="h4">
                  Edit admin
                </Typography>

                <Button
                  sx={{ m: 1, mr: { xs: 0, sm: 5 }, mt: 2 }}
                  type="submit"
                  variant="contained"
                  onClick={handlePasswordChange}
                >
                  Change Password
                </Button>
              </Box>

              <Box mt={3}>
                <AdminEditForm />
              </Box>
            </Box>
          ) : (
           <AnimationLoader open={true}/>
          )}
        </Container>
      </Box>
      <ModalComp open={openModal} handleClose={handleClose} widths={{ xs: "95%", sm: 550 }}>
        <ChangePasswordByAdmin handleClose={handleClose} />
      </ModalComp>
    </>
  );
};

AdminEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AdminEdit;
