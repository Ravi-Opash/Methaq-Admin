import { Card, CircularProgress, Divider, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon } from "src/Icons/EditIcon";
import { formatNumber } from "src/utils/formatNumber";
import { moduleAccess } from "src/utils/module-access";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";
import {
  applyAgentDiscountToTravelProposals,
  getTravelQuotesPaybles,
} from "src/sections/travel-insurance/Proposals/Action/travelInsuranceAction";

function TravelPlanPaybleDetails({ selectedCheckboxes, quotePayableDetails, policyFeeLoader = false }) {
  const dispatch = useDispatch();
  const [editableFees, setEditableFees] = useState(false);
  const [editedPolicyFeeValue, serEditedPolicyFeeValue] = useState("");

  const [editableSellingPrice, setEditableSellingPrice] = useState(false);
  const [sellingPriceValue, setSellingPriceValue] = useState("");

  const { loginUserData: user } = useSelector((state) => state.auth);

  // edit policy fee
  const onChnageEditSellingPrice = () => {
    dispatch(
      applyAgentDiscountToTravelProposals({
        id: selectedCheckboxes?.[0],
        data: { discountPrice: +sellingPriceValue },
      })
    )
      .unwrap()
      .then((data) => {
        toast.success(data?.message || "Successfully Updated!");
        setEditableSellingPrice(false);
        dispatch(getTravelQuotesPaybles(selectedCheckboxes?.[0]));
        setSellingPriceValue(data?.data?.discountPrice);
      })
      .catch((err) => {
        console.log(err);
        toast(err, {
          type: "error",
        });
        setEditableSellingPrice(false);
      });
  };

  return (
    <>
      {selectedCheckboxes?.length === 1 && (
        <Card sx={{ my: 1, maxWidth: 450 }}>
          <Box sx={{ display: "inline-block", width: "100%" }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                width: "100%",
                py: 1.5,
                backgroundColor: "#f5f5f5",
                fontWeight: "600",
                fontSize: "18px",
                display: "inline-block",
                color: "#60176F",
                px: "14px",
              }}
            >
              Plan payable details
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                width: "100%",
                mb: 2,
              }}
            >
              <Grid container spacing={1} px={3}>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: { xs: "14px", md: "15px" },
                      }}
                    >
                      Insurance company premium
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      sx={{
                        color: "#707070",
                        fontSize: { xs: "14px", md: "15px" },
                      }}
                    >
                      {`AED ${formatNumber(quotePayableDetails?.quote?.price)}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: { xs: "14px", md: "15px" },
                      }}
                    >
                      {`Vat (${5} %)`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      sx={{
                        color: "#707070",
                        fontSize: { xs: "14px", md: "15px" },
                      }}
                    >
                      {`AED ${formatNumber(quotePayableDetails?.vatAmount)}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: { xs: "14px", md: "15px" },
                      }}
                    >
                      Agent Selling Price
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {!editableSellingPrice ? (
                        <>
                          {!policyFeeLoader ? (
                            <Typography
                              sx={{
                                color: "#707070",
                                fontSize: { xs: "14px", md: "15px" },
                              }}
                            >
                              {quotePayableDetails?.quote?.discountPrice
                                ? `AED ${formatNumber(quotePayableDetails?.quote?.discountPrice)}`
                                : `AED ${formatNumber(quotePayableDetails?.quote?.price * 1.05)}`}
                            </Typography>
                          ) : (
                            <CircularProgress size={13} />
                          )}
                        </>
                      ) : (
                        <>
                          {!policyFeeLoader ? (
                            <TextField
                              size="small"
                              sx={{ width: "140px" }}
                              label="Edit Price"
                              name="premium"
                              type="number"
                              defaultValue={
                                quotePayableDetails?.quote?.discountPrice || quotePayableDetails?.quote?.price * 1.05
                              }
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setSellingPriceValue(newValue);
                              }}
                              inputProps={{
                                min: 0,
                                max: 50000,
                              }}
                            />
                          ) : (
                            <CircularProgress size={13} />
                          )}
                        </>
                      )}
                      {moduleAccess(user, "proposals.update") && (
                        <>
                          {!quotePayableDetails?.quote?.voucher ? (
                            <>
                              {!editableSellingPrice ? (
                                <EditIcon
                                  onClick={() => setEditableSellingPrice(true)}
                                  sx={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: "#707070",
                                    "&:hover": {
                                      color: "#60176F",
                                    },
                                  }}
                                />
                              ) : (
                                <CheckCircleIcon
                                  onClick={() => {
                                    if (sellingPriceValue < 0 || sellingPriceValue > 50000) {
                                      toast.error("Selling price must be between 0 and 50,000!");
                                      return;
                                    }
                                    onChnageEditSellingPrice();
                                  }}
                                  sx={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: "#707070",
                                    "&:hover": {
                                      color: "#60176F",
                                    },
                                  }}
                                />
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </Box>
                  </Grid>
                  {quotePayableDetails?.quote?.discountPrice ? (
                    <>
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            color: "black",
                            fontSize: { xs: "14px", md: "15px" },
                          }}
                        >
                          Discount Price
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            color: "#707070",
                            fontSize: { xs: "14px", md: "15px" },
                          }}
                        >
                          {`AED ${formatNumber(
                            quotePayableDetails?.quote?.price * 1.05 +
                              (quotePayableDetails?.quote?.fineCharges || 0) -
                              quotePayableDetails?.quote?.discountPrice
                          )}`}
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}
                  <Grid item xs={8}>
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: { xs: "14px", md: "15px" },
                      }}
                    >
                      Processing Fees
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {!editableFees ? (
                        <>
                          {!policyFeeLoader ? (
                            <Typography
                              sx={{
                                color: "#707070",
                                fontSize: { xs: "14px", md: "15px" },
                              }}
                            >
                              AED 0
                            </Typography>
                          ) : (
                            <CircularProgress size={13} />
                          )}
                        </>
                      ) : (
                        <>
                          {!policyFeeLoader ? (
                            <TextField
                              size="small"
                              sx={{ width: "140px" }}
                              label="Edit Fees"
                              name="premium"
                              type="number"
                              defaultValue={quotePayableDetails?.quote?.policyFee}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                serEditedPolicyFeeValue(newValue);
                              }}
                            />
                          ) : (
                            <CircularProgress size={13} />
                          )}
                        </>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: { xs: "14px", md: "15px" },
                        fontWeight: 600,
                      }}
                    >
                      Grand Total
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      sx={{
                        color: "#707070",
                        fontSize: { xs: "14px", md: "15px" },
                        fontWeight: 600,
                      }}
                    >
                      {`AED ${formatNumber(quotePayableDetails?.totalPrice)}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Card>
      )}
    </>
  );
}

export default TravelPlanPaybleDetails;
