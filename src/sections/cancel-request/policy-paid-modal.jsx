import { Button, Divider, Grid, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { refundPaymentNetwork } from "./action/cancelRequestAction";
import { formatNumber } from "src/utils/formatNumber";
import { CrossSvg } from "src/Icons/CrossSvg";
import { getCustomerPolicyDetailById } from "../customer/action/customerAction";
import { useRouter } from "next/router";

const tabs = [
  { label: "Full Refund", value: "fullRefund" },
  { label: "Parcial Refund", value: "parcialRefund" },
];

function PolicyPaidModel({ policyNumber, handleClose, totalPrice, isNetwork, paymentId, setLoading }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { requestId } = router.query;
  const [currentTab, setCurrentTab] = useState("fullRefund");
  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const [amount, setAmount] = useState();

  const sendFullRefundHamdler = () => {
    if (isNetwork) {
      onSubmit(totalPrice);
    } else {
      toast.error("Only for Network payment gateway");
    }
  };

  const sendParcialRefundHamdler = () => {
    if (isNetwork) {
      onSubmit(amount);
    } else {
      toast.error("Only for Network payment gateway");
    }
  };

  const onSubmit = (value) => {
    const payload = {
      paymentId: paymentId,
      amountToRefund: +value,
    };
    setLoading(true);
    dispatch(refundPaymentNetwork(payload))
      .unwrap()
      .then((res) => {
        setLoading(true);
        setTimeout(() => {
          dispatch(getCustomerPolicyDetailById(requestId)).then((res) => {
            toast.success("Successfully Refunded!");
            setLoading(false);
            handleClose();
          });
        }, 2000);
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error(err);
        setLoading(false);
      });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography sx={{ fontWeight: 500 }}>
            Refund: Only for Policies which get paid from Network payment gateway
          </Typography>
          <IconButton sx={{ position: "absolute", right: 10, top: 10 }} onClick={handleClose}>
            <CrossSvg />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="primary"
        value={currentTab}
        variant="scrollable"
        sx={{
          "& button": {
            padding: { xs: "16px 10px", sm: "16px 20px" },
            ml: "0 !important",
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      <Box sx={{ mt: 3, display: "inline-block", width: "100%" }}>
        {currentTab === "fullRefund" && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  width: "100%",
                  fontWeight: "500",
                  fontSize: "16px",
                  display: "inline-block",
                }}
              >
                {`Customer paid the policy No. ${policyNumber} with Amount of : ${formatNumber(totalPrice)} AED`}
              </Typography>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  width: "100%",
                  fontWeight: "500",
                  fontSize: "16px",
                  display: "inline-block",
                }}
              >
                {`Refundable Amount : ${formatNumber(totalPrice)} AED`}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
              }}
              mt={3}
            >
              <Button
                onClick={() => sendFullRefundHamdler()}
                variant="contained"
                sx={{
                  marginRight: "10px",
                }}
              >
                Send Refund
              </Button>
            </Box>
          </>
        )}
        {currentTab === "parcialRefund" && (
          <>
            {" "}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  width: "100%",
                  fontWeight: "500",
                  fontSize: "16px",
                  display: "inline-block",
                }}
              >
                {`Customer paid the policy No. ${policyNumber} with Amount of : ${formatNumber(totalPrice)} AED`}
              </Typography>
              <Grid container spacing={2} sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                      ml: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: "700",
                        fontSize: "14px",
                        display: "inline-block",
                        color: "#707070",
                      }}
                    >
                      Refundable Amount :
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Refundable Amount"
                      name="amount"
                      type="number"
                      id="amount"
                      onChange={(e) => {
                        setAmount(e?.target.value);
                      }}
                      value={amount}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                display: "flex",
              }}
              mt={3}
            >
              <Button
                disabled={!amount}
                variant="contained"
                sx={{
                  marginRight: "10px",
                }}
                onClick={() => sendParcialRefundHamdler()}
              >
                Send Refund
              </Button>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default PolicyPaidModel;
