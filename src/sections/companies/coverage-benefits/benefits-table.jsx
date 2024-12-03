import React, { useState } from "react";
import { Box, Button, Divider, FormControlLabel, Grid, Switch, TextField, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { EditIcon } from "src/Icons/EditIcon";
import styled from "@emotion/styled";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getBenefitsValueById, postBenefitsById } from "../action/companyAcrion";
import { toast } from "react-toastify";
import { moduleAccess } from "src/utils/module-access";
import { formatNumber } from "src/utils/formatNumber";

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    margin: "0 !important",
    marginLeft: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#60176F",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

const BenefitsTable = (props) => {
  const dispatch = useDispatch();
  const { items = [], benefitsValues = [], selected = [] } = props;
  const [isEditable, setIsEditable] = useState(false);
  const router = useRouter();
  const { loginUserData: user } = useSelector((state) => state.auth);

  const { companyId } = router.query;

  // initial value set
  const init = {
    ...items?.reduce((acc, e) => {
      const match = benefitsValues && benefitsValues?.benifits?.filter((item) => item.benifit._id == e._id);
      return {
        ...acc,
        [e._id]: {
          isEnabled: match?.[0]?.isEnabled || false,
          isMandatory: match?.[0]?.isMandatory || false,
          thirdparty: match?.[0]?.thirdparty || false,
          comprehensive: match?.[0]?.comprehensive || false,
          charge: match?.[0]?.charge || 0,
          limit: match?.[0]?.limitAmount || 0,
        },
      };
    }, {}),
  };

  // validation schema
  const schemaObj = {
    ...items?.reduce((acc, benefit) => {
      return {
        ...acc,
        [`${benefit?._id}`]: Yup.object({
          charge: Yup.number().required("Required"),
          limit: Yup.number().required("Required"),
        }),
      };
    }, {}),
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: init,

    validationSchema: Yup.object(schemaObj),

    onSubmit: async (values, helpers) => {
      let array = [];

      Object.entries(values).map(([key, value]) => {
        const match = items?.filter((a) => a._id === key);
        array.push({
          benifit: key,
          isEnabled: value.isEnabled,
          isMandatory: value.isMandatory,
          comprehensive: value.comprehensive,
          thirdparty: value.thirdparty,
          charge: value.charge,
          limitAmount: value.limit,
          limitUnit: match[0].limitUnit,
        });
      });

      const data = {
        company: companyId,
        benifits: array,
      };

      dispatch(postBenefitsById(data))
        .then(() => {
          // Get benefits by Id
          dispatch(getBenefitsValueById({ companyId }))
            .unwrap()
            .then((res) => {
              toast.success("successfully updated!");
              setIsEditable(false);
            })
            .catch((err) => {
              toast(err, {
                type: "error",
              });
              console.log(err, "err");
            });
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
          console.log(err, "err");
        });
    },
  });

  return (
    <>
      <Box sx={{ my: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Scrollbar>
            <Box sx={{ minWidth: 850 }}>
              <Grid container xs={12} sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: "10px" }}>
                <Grid item xs={4}>
                  Item
                </Grid>
                <Grid item xs={1.2}>
                  Enable
                </Grid>
                <Grid item xs={3.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>Chargable</Box>
                    {moduleAccess(user, "companies.update") && (
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsEditable(!isEditable);
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={1.8}>
                  isMandatory
                </Grid>
                <Grid item xs={1.5}>
                  TP / Comp
                </Grid>
              </Grid>

              {items?.map((benefit, idx) => {
                const match =
                  benefitsValues && benefitsValues?.benifits?.filter((item) => item.benifit._id == benefit._id);
                return (
                  <>
                    <Grid container xs={12} sx={{ p: 1, py: 2, display: "flex", alignContent: "center" }}>
                      <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
                        <Typography>{benefit?.name}</Typography>
                      </Grid>
                      <Grid item xs={1.2} sx={{ display: "flex", alignItems: "center" }}>
                        <FormControlLabel
                          control={
                            <IOSSwitch
                              name={`${benefit?._id}.isEnabled`}
                              // `${benefit?.name}.${e.condition}`
                              onChange={(value, e) => {
                                value.target.checked && setIsEditable(true);
                                formik.setFieldValue(`${benefit?._id}.isEnabled`, value.target.checked);
                                formik.setFieldValue(`${benefit?._id}.thirdparty`, value.target.checked);
                                formik.setFieldValue(`${benefit?._id}.comprehensive`, value.target.checked);
                              }}
                              // onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values && formik.values[benefit?._id] && formik.values[benefit?._id].isEnabled
                              }
                            />
                          }
                        />
                      </Grid>
                      <Grid item xs={3.5} sx={{ display: "flex", gap: "10px" }}>
                        <Grid item xs={5}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {!isEditable ? (
                              <Box sx={{ textTransform: "capitalize" }}>
                                {benefit?.limitUnit ? benefit?.limitUnit + " " + (match?.[0]?.limitAmount || "0") : "-"}
                              </Box>
                            ) : benefit?.hasLimit && formik.values[benefit?._id].isEnabled ? (
                              <Box>
                                <Grid item xs={12}>
                                  <TextField
                                    error={
                                      formik.touched[`${benefit?._id}`]?.["limit"] &&
                                      formik.errors[`${benefit?._id}`]?.["limit"]
                                    }
                                    helperText={
                                      formik.touched[`${benefit?._id}`]?.["limit"] &&
                                      formik.errors[`${benefit?._id}`]?.["limit"]
                                    }
                                    label={"limit in " + benefit?.limitUnit}
                                    name={`${benefit?._id}[limit]`}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={
                                      formik.values && formik.values[benefit?._id] && formik.values[benefit?._id].limit
                                    }
                                    type={benefit?.limitType}
                                  />
                                </Grid>
                              </Box>
                            ) : (
                              "-"
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={5}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {!isEditable ? (
                              <Box sx={{ textTransform: "capitalize" }}>
                                {"AED " + formatNumber(match?.[0]?.charge || "0")}
                              </Box>
                            ) : formik.values[benefit?._id].isEnabled ? (
                              <Box>
                                <Grid item xs={12}>
                                  <TextField
                                    error={Boolean(
                                      formik.touched[`${benefit?._id}`]?.["charge"] &&
                                        formik.errors[`${benefit?._id}`]?.["charge"]
                                    )}
                                    helperText={
                                      formik.touched[`${benefit?._id}`]?.["charge"] &&
                                      formik.errors[`${benefit?._id}`]?.["charge"]
                                    }
                                    label={"Charges"}
                                    name={`${benefit?._id}[charge]`}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={
                                      formik.values && formik.values[benefit?._id] && formik.values[benefit?._id].charge
                                    }
                                    type={benefit?.limitType}
                                  />
                                </Grid>
                              </Box>
                            ) : (
                              <Box>
                                <Grid item xs={12}>
                                  <TextField
                                    disabled={true}
                                    label={"Charges"}
                                    name={`${benefit?._id}[charge]`}
                                    type={benefit?.limitType}
                                  />
                                </Grid>
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={1.8} sx={{ display: "flex", alignItems: "center" }}>
                        <FormControlLabel
                          control={
                            <IOSSwitch
                              name={`${benefit?._id}.isMandatory`}
                              onChange={(value, e) => {
                                formik.setFieldValue(`${benefit?._id}.isMandatory`, value.target.checked);
                              }}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values && formik.values[benefit?._id] && formik.values[benefit?._id].isMandatory
                              }
                            />
                          }
                        />
                      </Grid>

                      <Grid item xs={1.5} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControlLabel
                          control={
                            <IOSSwitch
                              name={`${benefit?._id}.thirdparty`}
                              // `${benefit?.name}.${e.condition}`
                              onChange={(value, e) => {
                                formik.setFieldValue(`${benefit?._id}.thirdparty`, value.target.checked);
                              }}
                              // onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values && formik.values[benefit?._id] && formik.values[benefit?._id].thirdparty
                              }
                            />
                          }
                        />

                        <FormControlLabel
                          control={
                            <IOSSwitch
                              name={`${benefit?._id}.comprehensive`}
                              // `${benefit?.name}.${e.condition}`
                              onChange={(value, e) => {
                                formik.setFieldValue(`${benefit?._id}.comprehensive`, value.target.checked);
                              }}
                              // onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values &&
                                formik.values[benefit?._id] &&
                                formik.values[benefit?._id].comprehensive
                              }
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                    <Divider />{" "}
                  </>
                );
              })}
            </Box>
          </Scrollbar>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            {moduleAccess(user, "companies.update") && (
              <Button size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Update
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </>
  );
};

export default BenefitsTable;
