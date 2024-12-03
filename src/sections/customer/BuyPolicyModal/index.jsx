import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import Loader from "src/components/Loader";
import { useDispatch } from "react-redux";
import { checkoutPayment } from "src/sections/Proposals/Action/proposalsAction";
import { toast } from "react-toastify";

const PaymentCard = ({ src }) => {
  const iframeRef = useRef(null);
  const PaymentCardStyled = styled((props) => <iframe {...props} ref={iframeRef} />)(({}) => ({
    border: 0,
    width: "100%",
    height: "75vh",
    "-ms-overflow-style": "none" /* IE and Edge */,
    scrollbarWidth: "none" /* Firefox */,
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }));

  useEffect(() => {
    // console.log({ src });
    if (src && iframeRef.current) {
      iframeRef.current.src = src;
    }
  }, [src]);
  return <PaymentCardStyled />;
  // return <PaymentCardStyled ref={iframeRef} />;
};

const BuyPolicyModal = ({ quoteId, setPaymentModel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentLink, setPaymentLink] = useState("");
  const isLoaded = useRef(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoaded.current) return;
    if (quoteId) {
      isLoaded.current = true;
      dispatch(checkoutPayment({ quoteId }))
        .unwrap()
        .then((data) => {
          // console.log("checkoutPayment", data);
          setIsLoading(false);
          setPaymentLink(`${data?.paymentLink}&slim=true`);
        })
        .catch((err) => {
          console.log(err);
          toast(err, {
            type: "error",
          });
          setPaymentModel();
        });
    } else {
      toast("QuoteId is missing", {
        type: "error",
      });
      setPaymentModel();
    }
  }, [quoteId]);

  return (
    <>
      {isLoading && <Loader />}
      <Typography id="modal-modal-title" variant="h5" component="h2">
        Buy Policy
      </Typography>

      <Box sx={{ display: "inline-block", width: "100%", mt: 4 }}>
        {paymentLink && <PaymentCard src={paymentLink} width="100%" />}
      </Box>
    </>
  );
};

export default BuyPolicyModal;
