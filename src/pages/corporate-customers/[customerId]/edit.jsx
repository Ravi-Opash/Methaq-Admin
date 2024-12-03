import { Box, Container } from "@mui/material";
import { useRouter } from "next/router";
import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import CreateProposals from "../create";
import { toast } from "react-toastify";
import { getCorporateCustomerDetailsById } from "src/sections/corporate-customer/action/corporateCustomerAction";

const CorpotrateCustomerEdit = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { customerId } = router.query;
  const { corporateCustomerDetails, loading } = useSelector((state) => state.corporateCustomer);

  const initialized = useRef(false);

  // Get corporate customer details API for default value
  const getCorporateCustomerDetailsHandler = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    try {
      dispatch(getCorporateCustomerDetailsById(customerId))
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
    if (customerId) {
      getCorporateCustomerDetailsHandler();
    }
  }, [customerId]);

  return (
    <>
      <Box component="main">
        <Container maxWidth={false} sx={{ px: "0 !important" }}>
          {corporateCustomerDetails ? (
            <Box>
              <CreateProposals />
            </Box>
          ) : (
            <></>
          )}
        </Container>
      </Box>
    </>
  );
};

CorpotrateCustomerEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CorpotrateCustomerEdit;
