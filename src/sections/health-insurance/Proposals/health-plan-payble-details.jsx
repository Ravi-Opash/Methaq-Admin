import { Card, CircularProgress, Divider, Grid, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditIcon } from "src/Icons/EditIcon";
import { formatNumber } from "src/utils/formatNumber";
import { moduleAccess } from "src/utils/module-access";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { applyAgentDiscountToHealthProposals, getHealthQuotesPaybles } from "./Action/healthInsuranceAction";
import { toast } from "react-toastify";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AddLoadingPremiumNoteModal from "./health-loading-premium-note-modal";
import ModalComp from "src/components/modalComp";
import PremiumTooltip from "./premium-tooltip";

function HealthPlanPaybleDetails({ selectedCheckboxes, quotePayableDetails, policyFeeLoader = false }) {
  const dispatch = useDispatch();
  const [editableSellingPrice, setEditableSellingPrice] = useState(false);
  const [sellingPriceValue, setSellingPriceValue] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const handleCloseNoteModal = () => setNoteOpen(false);

  const { loginUserData: user } = useSelector((state) => state.auth);

  // Function to handle selling price changes (edit discount/selling price)
  const onChnageEditSellingPrice = () => {
    dispatch(
      applyAgentDiscountToHealthProposals({
        id: selectedCheckboxes?.[0],
        data: { discountPrice: +sellingPriceValue },
      })
    )
      .unwrap()
      .then((data) => {
        toast.success(data?.message || "Successfully Updated!");
        setEditableSellingPrice(false);
        dispatch(getHealthQuotesPaybles(selectedCheckboxes?.[0]));
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
        <Card sx={{ my: 1, maxWidth: 470, overflow: "unset" }}>
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
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
                      <Typography
                        sx={{
                          color: "#707070",
                          fontSize: { xs: "14px", md: "15px" },
                        }}
                      >
                        {`AED ${formatNumber(quotePayableDetails?.quoteInfo?.price)}`}
                      </Typography>
                      <PremiumTooltip plan={quotePayableDetails?.quoteInfo} />
                    </Box>
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
                      {`AED ${formatNumber(quotePayableDetails?.vat)}`}
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
                              {quotePayableDetails?.quoteInfo?.discountPrice
                                ? `AED ${formatNumber(quotePayableDetails?.quoteInfo?.discountPrice)}`
                                : `AED ${formatNumber(
                                    quotePayableDetails?.quoteInfo?.price * 1.05 +
                                      (quotePayableDetails?.quoteInfo?.fineCharges || 0)
                                  )}`}
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
                                quotePayableDetails?.quoteInfo?.discountPrice ||
                                quotePayableDetails?.quoteInfo?.price * 1.05
                              }
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setSellingPriceValue(newValue);
                              }}
                            />
                          ) : (
                            <CircularProgress size={13} />
                          )}
                        </>
                      )}
                      {moduleAccess(user, "proposals.update") && (
                        <>
                          {!quotePayableDetails?.quoteInfo?.voucher ? (
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
                  <Grid item xs={8}>
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: { xs: "14px", md: "15px" },
                      }}
                    >
                      Fine Charges
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      sx={{
                        color: "#707070",
                        fontSize: { xs: "14px", md: "15px" },
                      }}
                    >
                      {`AED ${formatNumber(quotePayableDetails?.quoteInfo?.fineCharges)}`}
                    </Typography>
                  </Grid>
                  {quotePayableDetails?.quoteInfo?.ICPFee && (
                    <>
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            color: "black",
                            fontSize: { xs: "14px", md: "15px" },
                          }}
                        >
                          ICP Fee
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            color: "#707070",
                            fontSize: { xs: "14px", md: "15px" },
                          }}
                        >
                          {`AED ${formatNumber(quotePayableDetails?.quoteInfo?.ICPFee)}`}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  {quotePayableDetails?.quoteInfo?.bashmahFee && (
                    <>
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            color: "black",
                            fontSize: { xs: "14px", md: "15px" },
                          }}
                        >
                          Bashmah Fee
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          sx={{
                            color: "#707070",
                            fontSize: { xs: "14px", md: "15px" },
                          }}
                        >
                          {`AED ${formatNumber(quotePayableDetails?.quoteInfo?.bashmahFee)}`}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  {quotePayableDetails?.quoteInfo?.discountPrice && !quotePayableDetails?.quoteInfo?.loadingAmount ? (
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
                            quotePayableDetails?.quoteInfo?.price * 1.05 +
                              (quotePayableDetails?.quoteInfo?.fineCharges || 0) -
                              quotePayableDetails?.quoteInfo?.discountPrice
                          )}`}
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}
                  {quotePayableDetails?.quoteInfo?.loadingAmount ? (
                    <>
                      <Grid item xs={8}>
                        <Typography
                          sx={{
                            color: "black",
                            fontSize: { xs: "14px", md: "15px" },
                          }}
                        >
                          Loading premium
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography
                            sx={{
                              color: "#707070",
                              fontSize: { xs: "14px", md: "15px" },
                            }}
                          >
                            {`AED ${formatNumber(quotePayableDetails?.quoteInfo?.loadingAmount)}`}
                          </Typography>
                          <Tooltip title={"Add reason about loading price"}>
                            <EventNoteIcon
                              onClick={() => setNoteOpen(true)}
                              sx={{
                                color: "#707070",
                                cursor: "pointer",
                                "&:hover": {
                                  color: "#60176F",
                                },
                              }}
                            />
                          </Tooltip>
                        </Box>
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}
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
      <ModalComp open={noteOpen} handleClose={handleCloseNoteModal} widths={{ xs: "95%", sm: 500 }}>
        <AddLoadingPremiumNoteModal
          handleClose={handleCloseNoteModal}
          id={selectedCheckboxes?.[0]}
          defaultValue={quotePayableDetails?.quoteInfo?.loadingReason || ""}
        />
      </ModalComp>
    </>
  );
}

export default HealthPlanPaybleDetails;
