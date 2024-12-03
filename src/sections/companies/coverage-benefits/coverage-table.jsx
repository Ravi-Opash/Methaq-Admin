import React, { useEffect, useState } from "react";
import { Box, Button, Divider, FormControlLabel, Grid, Switch, TextField, Typography, styled } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import * as Yup from "yup";
import { EditIcon } from "src/Icons/EditIcon";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { getCoverageValueById, postCoverageById } from "../action/companyAcrion";
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

const CoverageTable = (props) => {
  const { items = [], coveragesValues = [] } = props;
  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loginUserData: user } = useSelector((state) => state.auth);

  const { companyId } = router.query;

  const init = {
    ...items?.reduce((acc, e) => {
      const match = coveragesValues && coveragesValues?.coverages?.filter((item) => item.coverage._id == e._id);
      return {
        ...acc,
        [e._id]: {
          isEnabled: match?.[0]?.isEnabled || false,
          value:
            match?.[0]?.coverage?.name === "Loss & Damage"
              ? "Vehicle Value"
              // : match?.[0]?.coverage?.name === "Third Party Bodily Injury"
              // ? "Policy Value"
              : match?.[0]?.value || 0,
          thirdparty: match?.[0]?.thirdparty || false,
          comprehensive: match?.[0]?.comprehensive || false,
        },
      };
    }, {}),
  };

  const schemaObj = {
    ...items?.reduce((acc, coverage) => {
      return {
        ...acc,
        [`${coverage?._id}`]: Yup.object({ value: Yup[coverage?.dType]().required("Required") }),
      };
    }, {}),
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: init,

    validationSchema: Yup.object(schemaObj),

    onSubmit: async (values, helpers) => {
      console.log("values in submit", values);
      let array = [];

      Object.entries(values).map(([key, value]) => {
        const match = items?.filter((a) => a._id === key);
        array.push({
          coverage: key,
          isEnabled: value.isEnabled,
          value: value.value,
          comprehensive: value.comprehensive,
          thirdparty: value.thirdparty,
        });
      });

      const data = {
        company: companyId,
        coverages: array,
      };

      dispatch(postCoverageById(data))
        .then(() => {
          // console.log(res, "res");
          dispatch(getCoverageValueById({ companyId }))
            .unwrap()
            .then((res) => {
              // console.log(res, "res");
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

  useEffect(() => {
    if (items) {
      items?.map((coverage, idx) => {
        if (!formik.values[coverage?._id]?.isEnabled) {
          formik?.setFieldError([coverage?._id].value, "");
        }
      });
    }
  }, [formik?.values, items]);

  useEffect(() => {
    {
      items?.map((coverage, idx) => {
        if (coverage?.name == "Loss & Damage") {
          formik.setFieldValue(coverage?._id + `.value`, "Vehicle Value");
        }
        // if (coverage?.name == "Third Party Bodily Injury") {
        //   formik.setFieldValue(coverage?._id + `.value`, "Policy Value");
        // }
      });
    }
  }, []);

  return (
    <>
      <Box sx={{ my: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Grid container xs={12} sx={{ backgroundColor: "#f5f5f5", p: 1, borderRadius: "10px" }}>
                <Grid item xs={4}>
                  Item
                </Grid>
                <Grid item xs={1.5}>
                  Enable
                </Grid>
                <Grid item xs={5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>Value</Box>
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
                <Grid item xs={1.5}>
                  TP / Comp
                </Grid>
              </Grid>

              {items?.map((coverage, idx) => {
                const match =
                  coveragesValues && coveragesValues?.coverages?.filter((item) => item.coverage._id == coverage._id);
                return (
                  <>
                    <Grid container xs={12} sx={{ p: 1, py: 2 }}>
                      <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
                        <Typography>{coverage?.name}</Typography>
                      </Grid>
                      <Grid item xs={1.5} sx={{ display: "flex", alignItems: "center" }}>
                        <FormControlLabel
                          control={
                            <IOSSwitch
                              name={`${coverage?._id}.isEnabled`}
                              onChange={(value, e) => {
                                value.target.checked && setIsEditable(true);
                                formik.setFieldValue(`${coverage?._id}.isEnabled`, value.target.checked);
                                formik.setFieldValue(`${coverage?._id}.thirdparty`, value.target.checked);
                                formik.setFieldValue(`${coverage?._id}.comprehensive`, value.target.checked);
                              }}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values && formik.values[coverage?._id] && formik.values[coverage?._id].isEnabled
                              }
                            />
                          }
                        />
                      </Grid>
                      <Grid item xs={5} sx={{ display: "flex", gap: "10px" }}>
                        <Grid item xs={10}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {!isEditable ? (
                              <Box sx={{ textTransform: "capitalize" }}>
                                {match?.[0]?.value
                                  ? coverage?.dType === "string"
                                    ? match?.[0].value
                                    : "AED " + formatNumber(match?.[0]?.value)
                                  : "-"}
                              </Box>
                            ) : formik.values[coverage?._id].isEnabled ? (
                              <Box>
                                <Grid item xs={12}>
                                  <TextField
                                    error={
                                      formik.touched[`${coverage?._id}`]?.["value"] &&
                                      formik.errors[`${coverage?._id}`]?.["value"]
                                    }
                                    helperText={
                                      formik.touched[`${coverage?._id}`]?.["value"] &&
                                      formik.errors[`${coverage?._id}`]?.["value"]
                                    }
                                    label={"Value"}
                                    name={`${coverage?._id}[value]`}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    disabled={
                                      coverage?.name == "Loss & Damage" 
                                      // || coverage?.name == "Third Party Bodily Injury"
                                    }
                                    value={
                                      coverage?.name == "Loss & Damage"
                                        ? "Vehicle Value"
                                        // : coverage?.name == "Third Party Bodily Injury"
                                        // ? "Policy Value"
                                        : formik.values &&
                                          formik.values[coverage?._id] &&
                                          formik.values[`${coverage?._id}`]?.["value"]
                                    }
                                    type={coverage?.dType}
                                  />
                                </Grid>
                              </Box>
                            ) : (
                              <Box>
                                <Grid item xs={12}>
                                  <TextField
                                    error={
                                      formik.touched[`${coverage?._id}`]?.["value"] &&
                                      formik.errors[`${coverage?._id}`]?.["value"]
                                    }
                                    helperText={
                                      formik.touched[`${coverage?._id}`]?.["value"] &&
                                      formik.errors[`${coverage?._id}`]?.["value"]
                                    }
                                    label={"Value"}
                                    name={`${coverage?._id}[value]`}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    disabled={true}
                                    value={""}
                                    type={coverage?.dType}
                                  />
                                </Grid>
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid item xs={1.5} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControlLabel
                          control={
                            <IOSSwitch
                              name={`${coverage?._id}.thirdparty`}
                              // `${coverage?.name}.${e.condition}`
                              onChange={(value, e) => {
                                formik.setFieldValue(`${coverage?._id}.thirdparty`, value.target.checked);
                              }}
                              // onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values && formik.values[coverage?._id] && formik.values[coverage?._id].thirdparty
                              }
                            />
                          }
                        />

                        <FormControlLabel
                          control={
                            <IOSSwitch
                              name={`${coverage?._id}.comprehensive`}
                              // `${coverage?.name}.${e.condition}`
                              onChange={(value, e) => {
                                formik.setFieldValue(`${coverage?._id}.comprehensive`, value.target.checked);
                              }}
                              // onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              checked={
                                formik.values &&
                                formik.values[coverage?._id] &&
                                formik.values[coverage?._id].comprehensive
                              }
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                    <Divider />
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

export default CoverageTable;
