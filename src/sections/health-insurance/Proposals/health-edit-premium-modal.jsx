import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Backdrop, Box, Button, CircularProgress, Divider, Grid, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  editHealthQuotePremiumDynamic,
  getContactedProposals,
  getHealthQuotesPaybles,
  getPaidProposals,
} from "./Action/healthInsuranceAction";
import { setUpldatedHealthProposalQuotationList } from "./Reducer/healthInsuranceSlice";
import ModalComp from "src/components/modalComp";
import VerifyModal from "src/components/verifyModal";
import { getHealthQuoationDetails } from "../Quotations/Action/healthQuotationAction";
import { capitalizeWords } from "src/utils/capitalize-words";
import { useRouter } from "next/router";

const EditPremiumModal = ({ handleClose, onSubmitHadler, quote, keyValue = "proposal", isPaid = false }) => {
  const dispatch = useDispatch();
  const [errors, setError] = useState("");
  const [kidPremium, setKidPremium] = useState([]);
  const [premiumCounted, setPremiumCounted] = useState(false);
  const [loading, isLoading] = useState(false);
  const { groupQuoteList } = useSelector((state) => state.healthInsurance);

  const [verifyModal, setVerifyModal] = useState(false);
  const handleCloseVerifymodal = () => setVerifyModal(false);

  const [editCount, setEditCount] = useState(quote?.editPrice?.length);
  const [submitedPayload, setSubmitedPayload] = useState(null);

  const router = useRouter();
  const { proposalId } = router?.query;

  // Populate kids' premium data if any exist
  useEffect(() => {
    if (quote?.kids?.length > 0) {
      let arr = [];
      quote?.kids?.map((kid) => {
        arr?.push(kid?.premium);
      });
      setKidPremium(arr);
    }
  }, [quote?.kids?.length]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // ownerPremium: quote?.owner?.length > 0 ? quote?.owner?.[0]?.premium : "",
      // spousePremium: quote?.spouse?.length > 0 ? quote?.spouse?.[0]?.premium : "",
      // kidsPremium: kidPremium || [],
      owner: quote?.owner || [],
      kids: quote?.kids || [],
      spouse: quote?.spouse || [],
      totalPremium: quote?.price || "",
      isOwner: quote?.owner?.length > 0 ? true : false,
      isKid: quote?.kids?.length > 0 ? true : false,
      isSpouse: quote?.spouse?.length > 0 ? true : false,
    },

    // validationSchema: yup
    //   .object({
    //     benefitValue: yup.string().required("Is required"),
    //   })
    //   .required(),

    onSubmit: async (values, helpers) => {
      let payload = { ...values, price: values?.totalPremium, isPremiumRequestUpon: false };
      delete payload?.isOwner;
      delete payload?.isSpouse;
      delete payload?.isKid;
      delete payload?.totalPremium;
      setVerifyModal(true);
      setSubmitedPayload(payload);
    },
  });

  // Final submission handler when verification is complete
  const onFinalSubmitHandler = () => {
    isLoading(true);
    handleCloseVerifymodal();
    dispatch(editHealthQuotePremiumDynamic({ quoteId: quote?._id, data: submitedPayload }))
      .unwrap()
      .then((res) => {
        // console.log(res);
        if (keyValue == "proposal") {
          if (groupQuoteList) {
            let match = groupQuoteList.find((i) => i._id == quote?._id);
            const index = groupQuoteList.indexOf(match);
            match = res?.data;
            const others = groupQuoteList.filter((i) => i._id != quote?._id);
            const data = [...others?.slice(0, index), match, ...others?.slice(index)];
            dispatch(setUpldatedHealthProposalQuotationList(data));
          }
          if (isPaid) {
            dispatch(getPaidProposals(proposalId))
              .unwrap()
              .then((res) => {})
              .catch((err) => {
                toast.error(err);
              });

            dispatch(getContactedProposals(proposalId))
              .unwrap()
              .then((res) => {})
              .catch((err) => {
                toast.error(err);
              });
          }
        }

        if (keyValue == "quote") {
          dispatch(getHealthQuoationDetails({ id: quote?._id }));
        }
        if (keyValue == "compare") {
          onSubmitHadler();
        }
        dispatch(getHealthQuotesPaybles(quote?._id));

        toast?.success("Successfully updated!");
        isLoading(false);
        handleClose();
      })
      .catch((err) => {
        console.log(err, "err");
        toast?.error(err);
        isLoading(false);
      });
  };

  // Function to calculate total premium by summing premiums for owner, spouse, and kids
  const CalculateTotalPremium = () => {
    let total = 0;
    if (formik?.values?.owner?.length > 0) {
      total += formik?.values?.owner?.[0]?.premium;
      if (formik?.values?.owner?.[0]?.load?.length > 0) {
        let ownerLoadsum = 0;
        formik?.values?.owner?.[0]?.load?.map((i) => {
          if (i?.amount) {
            ownerLoadsum += i?.amount;
            total += i?.amount;
          }
        });
        formik?.setFieldValue("owner[0].loadSum", ownerLoadsum);
      }
    }
    if (formik?.values?.spouse?.length > 0) {
      total += formik?.values?.spouse?.[0]?.premium;
      if (formik?.values?.spouse?.[0]?.load?.length > 0) {
        let spouseLoadsum = 0;
        formik?.values?.spouse?.[0]?.load?.map((i) => {
          if (i?.amount) {
            spouseLoadsum += i?.amount;
            total += i?.amount;
          }
          formik?.setFieldValue("spouse[0].loadSum", spouseLoadsum);
        });
      }
    }
    if (quote?.kids?.length > 0) {
      quote?.kids?.map((kid, idx) => {
        total += formik?.values?.kids?.[idx]?.premium;
        if (formik?.values?.kids?.[idx]?.load?.length > 0) {
          let kidLoadsum = 0;
          formik?.values?.kids?.[idx]?.load?.map((i) => {
            if (i?.amount) {
              kidLoadsum += i?.amount;
              total += i?.amount;
            }
          });
          formik?.setFieldValue(`kids[${idx}].loadsum`, kidLoadsum);
        }
      });
    }
    formik.setFieldValue("totalPremium", total);
    setPremiumCounted(true);
  };

  return (
    <Box sx={{ display: "inline-block", width: "100%" }}>
      {loading && (
        <>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
            <CircularProgress sx={{ color: "#60176F" }} />
          </Backdrop>
        </>
      )}
      <form onSubmit={formik.handleSubmit}>
        {formik?.values?.isOwner && (
          <>
            <Box sx={{ ml: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13 }}
              >{`Self : ${quote?.owner?.[0]?.person?.fullName} (Age ${quote?.owner?.[0]?.person?.age} Years)`}</Typography>
            </Box>
            <Grid container spacing={0.5}>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(formik.touched.owner?.[0]?.premium && formik.errors.owner?.[0]?.premium)}
                  fullWidth
                  helperText={formik.touched.owner?.[0]?.premium && formik.errors.owner?.[0]?.premium}
                  label="Self Premium"
                  name="owner[0].premium"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setPremiumCounted(false);
                  }}
                  value={formik.values.owner?.[0]?.premium}
                  type="number"
                />
              </Grid>
              {quote?.owner?.[0]?.load?.length > 0 && (
                <>
                  {quote?.owner?.[0]?.load?.map((i, idx) => {
                    return (
                      <Grid item xs={6}>
                        <TextField
                          error={Boolean(
                            formik.touched.owner?.[0]?.load?.[idx]?.amount &&
                              formik.errors.owner?.[0]?.load?.[idx]?.amount
                          )}
                          fullWidth
                          helperText={
                            formik.touched.owner?.[0]?.load?.[idx]?.amount &&
                            formik.errors.owner?.[0]?.load?.[idx]?.amount
                          }
                          label={`${capitalizeWords(i?.description)}`}
                          name={`owner[0].load[${idx}].amount`}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            setPremiumCounted(false);
                          }}
                          value={formik.values.owner?.[0]?.load?.[idx]?.amount}
                          type="number"
                        />
                      </Grid>
                    );
                  })}
                  <Grid item xs={6} display={"none"}>
                    <TextField
                      error={Boolean(formik.touched.owner?.[0]?.loadSum && formik.errors.owner?.[0]?.loadSum)}
                      fullWidth
                      helperText={formik.touched.owner?.[0]?.loadSum && formik.errors.owner?.[0]?.loadSum}
                      disabled
                      name={`owner[0].loadSum`}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setPremiumCounted(false);
                      }}
                      value={formik.values.owner?.[0]?.loadSum}
                      type="number"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </>
        )}
        {formik?.values?.isSpouse && (
          <>
            <Box sx={{ mt: 1, ml: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 13 }}
              >{`Spouse : ${quote?.spouse?.[0]?.person?.fullName} (Age ${quote?.spouse?.[0]?.person?.age} Years)`}</Typography>
            </Box>

            <Grid container spacing={0.5}>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(formik.touched.spouse?.[0]?.premium && formik.errors.spouse?.[0]?.premium)}
                  fullWidth
                  helperText={formik.touched.spouse?.[0]?.premium && formik.errors.spouse?.[0]?.premium}
                  label="Self Premium"
                  name="spouse[0].premium"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setPremiumCounted(false);
                  }}
                  value={formik.values.spouse?.[0]?.premium}
                  type="number"
                />
              </Grid>
              {quote?.spouse?.[0]?.load?.length > 0 && (
                <>
                  {quote?.spouse?.[0]?.load?.map((i, idx) => {
                    return (
                      <Grid item xs={6}>
                        <TextField
                          error={Boolean(
                            formik.touched.spouse?.[0]?.load?.[idx]?.amount &&
                              formik.errors.spouse?.[0]?.load?.[idx]?.amount
                          )}
                          fullWidth
                          helperText={
                            formik.touched.spouse?.[0]?.load?.[idx]?.amount &&
                            formik.errors.spouse?.[0]?.load?.[idx]?.amount
                          }
                          label={`${capitalizeWords(i?.description)}`}
                          name={`spouse[0].load[${idx}].amount`}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            setPremiumCounted(false);
                          }}
                          value={formik.values.spouse?.[0]?.load?.[idx]?.amount}
                          type="number"
                        />
                      </Grid>
                    );
                  })}
                  <Grid item xs={6} display={"none"}>
                    <TextField
                      error={Boolean(formik.touched.spouse?.[0]?.loadSum && formik.errors.spouse?.[0]?.loadSum)}
                      fullWidth
                      disabled
                      helperText={formik.touched.spouse?.[0]?.loadSum && formik.errors.spouse?.[0]?.loadSum}
                      name={`spouse[0].loadSum`}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setPremiumCounted(false);
                      }}
                      value={formik.values.spouse?.[0]?.loadSum}
                      type="number"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </>
        )}
        {formik?.values?.isKid && (
          <>
            {quote?.kids?.map((kid, index) => {
              return (
                <Box key={index}>
                  <Box sx={{ mt: 1, ml: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontSize: 13 }}>{`Kid-${index + 1} : ${
                      kid?.person?.fullName
                    } (Age ${kid?.person?.age} Years)`}</Typography>
                  </Box>
                  <Grid container spacing={0.5}>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(formik.touched.kids?.[index]?.premium && formik.errors.kids?.[index]?.premium)}
                        fullWidth
                        helperText={formik.touched.kids?.[index]?.premium && formik.errors.kids?.[index]?.premium}
                        label="Self Premium"
                        name={`kids[${index}].premium`}
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setPremiumCounted(false);
                        }}
                        value={formik.values.kids?.[index]?.premium}
                        type="number"
                      />
                    </Grid>
                    {quote?.kids?.[index]?.load?.length > 0 && (
                      <>
                        {quote?.kids?.[index]?.load?.map((i, idx) => {
                          return (
                            <Grid item xs={6}>
                              <TextField
                                error={Boolean(
                                  formik.touched.kids?.[index]?.load?.[idx]?.amount &&
                                    formik.errors.kids?.[index]?.load?.[idx]?.amount
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.kids?.[index]?.load?.[idx]?.amount &&
                                  formik.errors.kids?.[index]?.load?.[idx]?.amount
                                }
                                label={`${capitalizeWords(i?.description)}`}
                                name={`kids[${index}].load[${idx}].amount`}
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  setPremiumCounted(false);
                                }}
                                value={formik.values.kids?.[index]?.load?.[idx]?.amount}
                                type="number"
                              />
                            </Grid>
                          );
                        })}
                        <Grid item xs={6} display={"none"}>
                          <TextField
                            error={Boolean(
                              formik.touched.kids?.[index]?.loadSum && formik.errors.kids?.[index]?.loadSum
                            )}
                            fullWidth
                            disabled
                            helperText={formik.touched.kids?.[index]?.loadSum && formik.errors.kids?.[index]?.loadSum}
                            name={`kids[${index}].loadSum`}
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              formik.handleChange(e);
                              setPremiumCounted(false);
                            }}
                            value={formik.values.kids?.[index]?.loadSum}
                            type="number"
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              );
            })}
          </>
        )}

        <Box sx={{ my: 2 }}>
          <Divider />
          {!premiumCounted ? (
            <Box sx={{ mt: 1 }}>
              <Typography
                onClick={() => CalculateTotalPremium()}
                sx={{ color: "#60176f", fontSize: 13, fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}
              >
                Calculate Total Premium
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ mt: 1, ml: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontSize: 15, fontWeight: 600 }}>
                  Total Premium
                </Typography>
              </Box>
              <TextField
                error={Boolean(formik.touched.totalPremium && formik.errors.totalPremium)}
                fullWidth
                disabled
                helperText={formik.touched.totalPremium && formik.errors.totalPremium}
                label="Total Premium"
                name={`totalPremium`}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.totalPremium}
                type="number"
              />
            </>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button disabled={formik.isSubmitting || !premiumCounted} type="submit" variant="contained">
            Submit
          </Button>

          <Button variant="outlined" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </form>
      <ModalComp open={verifyModal} handleClose={handleCloseVerifymodal} widths={{ xs: "95%", sm: 500 }}>
        <VerifyModal
          label={`The adjustment can only be done 3 times and MUST match premium without vat that proposed by the insurance company. Are you sure to make changes? current change count ${
            editCount + 1
          }/3`}
          handleClose={handleCloseVerifymodal}
          onSubmit={() => onFinalSubmitHandler()}
        />
      </ModalComp>
    </Box>
  );
};

export default EditPremiumModal;
