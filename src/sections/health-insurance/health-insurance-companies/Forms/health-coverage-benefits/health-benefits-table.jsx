import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { EditIcon } from "src/Icons/EditIcon";
import styled from "@emotion/styled";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  edithealthInsuranceBenefits,
  getHealthBenefitsValueById,
  getNetworkListByCompanyId,
} from "../../Action/healthinsuranceCompanyAction";
import { toast } from "react-toastify";
import { formatNumber } from "src/utils/formatNumber";
import { useRouter } from "next/router";
import { camelCaseToTitleCase, capitalizeWords } from "src/utils/capitalize-words";
import { QuillEditor } from "src/components/quill-editor";
import { moduleAccess } from "src/utils/module-access";

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

const HealthBenefitsTable = (props) => {
  const { items = [], healthBenefitsValues = [], benefitNetworkList = [] } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);
  const [isEditable, setIsEditable] = useState(false);
  const router = useRouter();
  const { companyId, planId } = router.query;

  const dispatch = useDispatch();
  const initial = useRef(false);

  useEffect(() => {
    if (companyId) {
      if (initial.current) {
        return;
      }
      initial.current = true;

      dispatch(getNetworkListByCompanyId({ id: companyId }));
    }
  }, [companyId]);

  const init = {
    ...items?.reduce((acc, e) => {
      const match =
        healthBenefitsValues && healthBenefitsValues?.benefits?.filter((item) => item.benefit?._id == e._id);
      if (e?.valueType == "object") {
        return {
          ...acc,
          [e._id]: {
            [e?.group]: {
              noOfVisits: match?.[0]?.[e?.group]?.noOfVisits,
              reimbursement: match?.[0]?.[e?.group]?.reimbursement,
              timePeriod: match?.[0]?.[e?.group]?.timePeriod,
              coPayType: match?.[0]?.[e?.group]?.coPayType,
              coPayValue: match?.[0]?.[e?.group]?.coPayValue,
              noOfSessions: match?.[0]?.[e?.group]?.noOfSessions,
              deductibleType: match?.[0]?.[e?.group]?.deductibleType,
              deductibleValue: match?.[0]?.[e?.group]?.deductibleValue,
              maxValue: match?.[0]?.[e?.group]?.maxValue,
              coPayLimit: match?.[0]?.[e?.group]?.coPayLimit,
              description: match?.[0]?.[e?.group]?.description,
              limit: match?.[0]?.[e?.group]?.limitAmount,
              value: match?.[0]?.[e?.group]?.value,
            },
            isEnabled: match?.[0]?.isEnabled || false,
            limit: match?.[0]?.limitAmount || 0,
            value: match?.[0]?.value || "",
            description: match?.[0]?.description,
          },
        };
      } else {
        return {
          ...acc,
          [e._id]: {
            isEnabled: match?.[0]?.isEnabled || false,
            limit: match?.[0]?.limitAmount || 0,
            value: match?.[0]?.value || "",
            description: match?.[0]?.description,
          },
        };
      }
    }, {}),
  };

  // const schemaObj = {
  //   ...items?.reduce((acc, benefit) => {
  //     return {
  //       ...acc,
  //       [`${benefit?._id}`]: Yup.object({
  //         charge: Yup.number().required("Required"),
  //         value: Yup.string().required("Required"),
  //         limit: Yup.number().required("Required"),
  //       }),
  //     };
  //   }, {}),
  // };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: init,

    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      // console.log("values in submit", values);

      let array = [];

      Object.entries(values).map(([key, value]) => {
        const match = items?.filter((a) => a._id === key);
        let dd = value?.detail?.description
          ? value?.detail?.description
          : value?.coverage?.description
          ? value?.coverage?.description
          : value?.coPay?.description
          ? value?.coPay?.description
          : "";
        let descriptionArr = dd?.split("<p><br></p>");
        let finalDescription = descriptionArr?.join("");

        array.push({
          benefit: key,
          isEnabled: value.isEnabled,
          ...value?.detail,
          coverage: {
            ...value?.coverage,
            description: value?.coverage?.description?.split("<p><br></p>")?.join("") || undefined,
          },
          detail: {
            ...value?.detail,
            limitAmount: value?.detail?.limit || undefined,
            description: value?.detail?.description?.split("<p><br></p>")?.join("") || undefined,
          },
          coPay: {
            ...value?.coPay,
            description: value?.coPay?.description?.split("<p><br></p>")?.join("") || undefined,
          },
          value: value.value || undefined,
          limitAmount: value.limit
            ? value?.limit
            : value?.detail?.limit
            ? value?.detail?.limit
            : value?.coverage?.limit
            ? value?.coverage?.limit
            : value?.coPay?.limit
            ? value?.coPay?.limit
            : undefined,
          description: finalDescription || undefined,
          limitUnit: match[0].limitUnit || undefined,
        });
      });

      // console.log(array, "array");

      dispatch(edithealthInsuranceBenefits({ company: companyId, plan: planId, benefits: array }))
        .then((res) => {
          // console.log(res, "res");
          toast.success("successfully updated!");
          setIsEditable(false);
          dispatch(getHealthBenefitsValueById({ planId }));
        })
        .catch((err) => {
          console.log(err, "err");
        });
    },
  });

  return (
    <>
      <Box sx={{ my: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <Scrollbar>
              <Box sx={{ minWidth: 850 }}>
                <Grid container spacing={1} sx={{ backgroundColor: "#f5f5f5", p: 1 }}>
                  <Grid item xs={5}>
                    Item
                  </Grid>
                  <Grid item xs={5.5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box>Chargable</Box>
                      <EditIcon
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsEditable(!isEditable);
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={1.5} sx={{ display: "flex", justifyContent: "end" }}>
                    <Box sx={{ mr: 1 }}>Enable</Box>
                  </Grid>
                </Grid>

                {items?.map((benefit, idx) => {
                  if (benefit?.isDeleted) {
                    return;
                  }
                  const match =
                    healthBenefitsValues &&
                    healthBenefitsValues?.benefits?.filter((item) => item?.benefit?._id == benefit?._id);
                  return (
                    <>
                      <Grid container xs={12} spacing={1} sx={{ p: 1, py: 2, display: "flex", alignContent: "center" }}>
                        <Grid item xs={5} sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ fontSize: "14px" }}>{benefit?.name}</Typography>
                        </Grid>
                        <Grid item xs={5.5} sx={{ display: "flex", gap: "10px" }}>
                          <Grid item xs={12}>
                            {benefit?.hasLimit ? (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                                {!isEditable ? (
                                  <Box sx={{ fontSize: "14px" }}>
                                    {benefit?.limitUnit &&
                                    match?.[0]?.isEnabled &&
                                    (match?.[0]?.limitAmount || match?.[0]?.limitAmount == 0)
                                      ? benefit?.limitUnit + " " + match?.[0]?.limitAmount
                                      : "-"}
                                  </Box>
                                ) : (
                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      error={
                                        formik.touched[`${benefit?._id}`]?.["limit"] &&
                                        formik.errors[`${benefit?._id}`]?.["limit"]
                                      }
                                      helperText={
                                        formik.touched[`${benefit?._id}`]?.["limit"] &&
                                        formik.errors[`${benefit?._id}`]?.["limit"]
                                      }
                                      disabled={!formik.values[benefit?._id].isEnabled}
                                      label={"limit in " + benefit?.limitUnit}
                                      name={`${benefit?._id}[limit]`}
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      InputLabelProps={{ shrink: true }}
                                      value={
                                        formik.values &&
                                        formik.values[benefit?._id] &&
                                        formik.values[benefit?._id].limit
                                      }
                                      type={benefit?.limitType}
                                    />
                                  </Grid>
                                )}
                              </Box>
                            ) : (
                              <>
                                {isEditable ? (
                                  <>
                                    {benefit?.name == "Medical Network" ? (
                                      <>
                                        {benefit?.options?.[0]?.fields?.map((ele, index) => {
                                          if (ele?.dType == "textArea") {
                                            return (
                                              <QuillEditor
                                                onChange={(content) => {
                                                  formik.setFieldValue(
                                                    `${benefit?._id}.${ele?.group}.${ele?.condition}`,
                                                    content
                                                  );
                                                }}
                                                disabled={!formik.values[benefit?._id].isEnabled}
                                                placeholder="Write something"
                                                sx={{ height: 150, mt: 1 }}
                                                value={formik.values[benefit?._id]?.[ele?.group]?.[ele?.condition]}
                                              />
                                            );
                                          }
                                        })}
                                      </>
                                    ) : benefit?.options?.length > 0 && benefit?.valueType == "object" ? (
                                      <>
                                        {benefit?.options?.[0]?.fields?.map((ele, index) => {
                                          if (ele?.dType == "textArea") {
                                            return (
                                              <QuillEditor
                                                onChange={(content) => {
                                                  formik.setFieldValue(
                                                    `${benefit?._id}.${ele?.group}.${ele?.condition}`,
                                                    content
                                                  );
                                                }}
                                                disabled={!formik.values[benefit?._id].isEnabled}
                                                placeholder="Write something"
                                                sx={{ height: 150, mt: 1 }}
                                                value={formik.values[benefit?._id]?.[ele?.group]?.[ele?.condition]}
                                              />
                                            );
                                          }
                                        })}
                                      </>
                                    ) : benefit?.valueType == "string" && benefit?.options?.length > 0 ? (
                                      <TextField
                                        fullWidth
                                        error={Boolean(
                                          formik.touched[`${benefit?._id}`]?.["value"] &&
                                            formik.errors[`${benefit?._id}`]?.["value"]
                                        )}
                                        helperText={
                                          formik.touched[`${benefit?._id}`]?.["value"] &&
                                          formik.errors[`${benefit?._id}`]?.["value"]
                                        }
                                        disabled={!formik.values[benefit?._id].isEnabled}
                                        label={"Value"}
                                        name={`${benefit?._id}[value]`}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        value={
                                          formik.values &&
                                          formik.values[benefit?._id] &&
                                          formik.values[benefit?._id].value
                                        }
                                        select
                                        SelectProps={{ native: true }}
                                      >
                                        <option></option>
                                        {benefit?.options?.map((e) => {
                                          return <option value={e}>{`${e}`}</option>;
                                        })}
                                      </TextField>
                                    ) : benefit?.valueType == "string" ? (
                                      <TextField
                                        fullWidth
                                        error={Boolean(
                                          formik.touched[`${benefit?._id}`]?.["value"] &&
                                            formik.errors[`${benefit?._id}`]?.["value"]
                                        )}
                                        helperText={
                                          formik.touched[`${benefit?._id}`]?.["value"] &&
                                          formik.errors[`${benefit?._id}`]?.["value"]
                                        }
                                        disabled={!formik.values[benefit?._id].isEnabled}
                                        InputLabelProps={{ shrink: true }}
                                        label={"Value"}
                                        name={`${benefit?._id}[value]`}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={
                                          formik.values &&
                                          formik.values[benefit?._id] &&
                                          formik.values[benefit?._id].value
                                        }
                                        type="string"
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {benefit?.valueType == "object" ? (
                                      <Box>
                                        <>
                                          {match?.[0]?.isEnabled
                                            ? Object.entries(match?.[0]?.[benefit?.group] || {}).map(([key, value]) => (
                                                <>
                                                  {key != "description" ? (
                                                    // <Box sx={{ display: "flex", gap: 1 }} key={key}>
                                                    //   <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                                                    //     {`${camelCaseToTitleCase(key)} :`}{" "}
                                                    //   </Typography>
                                                    //   <Typography sx={{ fontSize: "14px" }}>{`${camelCaseToTitleCase(
                                                    //     value
                                                    //   )}`}</Typography>
                                                    // </Box>
                                                    <></>
                                                  ) : (
                                                    <Box key={key}>
                                                      <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                                                        {/* {`${camelCaseToTitleCase(key)} :`}{" "} */}
                                                      </Typography>
                                                      <Box sx={{ px: 1 }}>
                                                        <Typography
                                                          sx={{ fontSize: "13px", color: "black" }}
                                                          color="textSecondary"
                                                          variant="body2"
                                                          dangerouslySetInnerHTML={{
                                                            __html: value,
                                                          }}
                                                        ></Typography>
                                                      </Box>
                                                    </Box>
                                                  )}
                                                </>
                                              ))
                                            : "-"}
                                        </>
                                      </Box>
                                    ) : (
                                      <Box sx={{ fontSize: "14px" }}>
                                        {match?.[0]?.value && match?.[0]?.isEnabled ? match?.[0]?.value : "-"}
                                      </Box>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </Grid>
                        </Grid>
                        <Grid item xs={1.5} sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                name={`${benefit?._id}.isEnabled`}
                                onChange={(value, e) => {
                                  value.target.checked && setIsEditable(true);
                                  formik.setFieldValue(`${benefit?._id}.isEnabled`, value.target.checked);
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
                      </Grid>
                      <Divider />
                    </>
                  );
                })}
              </Box>
            </Scrollbar>
          </Card>
          {moduleAccess(user, "companies.update") && (
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Update
              </Button>
            </Box>
          )}
        </form>
      </Box>
    </>
  );
};

export default HealthBenefitsTable;
