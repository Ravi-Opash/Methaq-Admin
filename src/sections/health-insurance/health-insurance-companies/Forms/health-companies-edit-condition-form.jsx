import React, { useEffect, useRef, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import NextLink from "next/link";
import {
  creteHealthInsuranceCondition,
  editHealthInsuranceCondition,
  getHealthInsuranceCompanyConditionDynamicList,
  getHealthInsuranceCompanyConditionsDetailsById,
} from "../Action/healthinsuranceCompanyAction";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import StringNumberComditionForm from "./ConditionComponents/string-number-condition";
import BooleanComditionForm from "./ConditionComponents/boolean-condition";
import ObjectComditionForm from "./ConditionComponents/object-condition";

const HealthInsuranceConditionsEditForm = () => {
  const router = useRouter();
  const { companyId, conditionId } = router.query;
  const dispatch = useDispatch();
  const {
    healthInsuranceDynamicConditionListLoader,
    healthInsuranceDynamicConditionList,
    healthInsuranceConditionDetails,
  } = useSelector((state) => state.healthInsuranceCompany);

  // console.log(healthInsuranceConditionDetails, "healthInsuranceConditionDetails");

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    dispatch(getHealthInsuranceCompanyConditionDynamicList())
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
    dispatch(getHealthInsuranceCompanyConditionsDetailsById(conditionId))
      .unwrap()
      .then((res) => {
        // console.log(res, "ressss");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  const [allGroupLabels, setAllGroupLabels] = useState([]);
  const [group, setGroup] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [field, _field] = useState([]);
  const [arrayofDataToMap, setArrayofDataToMap] = useState([]);


  const init = {
    ...healthInsuranceDynamicConditionList?.reduce((acc, e) => {
      if (e.isActive && e.multiple && e.dType !== "object") {
        return {
          ...acc,
          [e.group]: {
            ...acc[e.group],
            [e.condition]: healthInsuranceConditionDetails?.[e.group]?.[e.condition] || [],
          },
        };
      } else if (e.isActive && e.dType === "boolean") {
        return {
          ...acc,
          [e.group]: {
            ...acc[e.group],
            [e.condition]: JSON.stringify(healthInsuranceConditionDetails?.[e.group]?.[e.condition]) || "",
          },
        };
      } else if (e.dType === "object" && e.isActive) {
        const data = e.options[0].fields?.reduce((ac, element) => {
          const ss = healthInsuranceConditionDetails?.[e.group]?.[e.condition]?.reduce((abc, ele) => {
            return [...abc, ele];
          }, []);

          return ss;
        }, {});

        // console.log(data, "data..");
        return {
          ...acc,
          [e.group]: {
            ...acc[e.group],
            [e.condition]: data,
          },
        };
      } else if (e.isActive) {
        return {
          ...acc,
          [e.group]: {
            ...acc[e.group],
            [e.condition]: healthInsuranceConditionDetails?.[e.group]?.[e.condition] || "",
          },
        };
      }
      return acc;
    }, {}),
  };

  function removeEmptyFields(obj) {
    Object.entries(obj).forEach(([keys, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined || value?.length === 0) {
          delete values[key];
          return values;
        }
      });
    });
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0) {
        delete obj[key];
        obj[key] = {};
      }
    });
    return { ...obj, company: companyId };
  }

  useEffect(() => {
    if (healthInsuranceDynamicConditionList?.length > 0 && healthInsuranceDynamicConditionList) {
      const groupArray = healthInsuranceDynamicConditionList
        .filter((e) => e.isActive)
        .reduce((uniqueGroups, currentGroup) => {
          return [
            ...uniqueGroups,
            ...(!uniqueGroups?.find((group) => group.group === currentGroup.group)
              ? [
                  {
                    group: currentGroup.group,
                    label: currentGroup.groupLabel,
                  },
                ]
              : []),
          ];
        }, []);

      setAllGroupLabels(groupArray);
    }
  }, [healthInsuranceDynamicConditionList]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: init,

    // validationSchema: Yup.object().shape(schemaObject),

    onSubmit: (values, helpers) => {
      // console.log(values, "values");

      if (conditionId) {
        dispatch(editHealthInsuranceCondition({ id: conditionId, data: values }))
          .unwrap()
          .then((res) => {
            toast.success(res.message || "condition created!");
            router?.push(`/companies/${companyId}/health-insurance/conditions`);
          })
          .catch((err) => {
            console.log(err, "err");
            toast?.error(err);
          });
      } else {
        const payload = {
          company: companyId,
          ...values,
        };
        dispatch(creteHealthInsuranceCondition(payload))
          .unwrap()
          .then((res) => {
            toast.success(res.message || "condition created!");
            router?.push(`/companies/${companyId}/health-insurance/conditions`);
          })
          .catch((err) => {
            console.log(err, "err");
            toast?.error(err);
          });
      }
    },
  });

  useEffect(() => {
    if (conditionId) {
      if (arrayofDataToMap?.length === 0 && healthInsuranceDynamicConditionList?.length > 0) {
        const filteredConditions = healthInsuranceDynamicConditionList?.reduce((a, b) => {
          if (
            Array?.isArray(healthInsuranceConditionDetails?.[b?.["group"]]?.[b?.["condition"]]) &&
            healthInsuranceConditionDetails?.[b?.["group"]]?.[b?.["condition"]]?.length == 0
          ) {
            return a;
          }
          return [
            ...a,
            ...(healthInsuranceConditionDetails?.[b?.["group"]]?.[b?.["condition"]]
              ? [{ ...b, children: healthInsuranceConditionDetails?.[b?.["group"]]?.[b?.["condition"]]?.length }]
              : []),
          ];
        }, []);

        setArrayofDataToMap(filteredConditions);
      }
    }
  }, [conditionId, healthInsuranceDynamicConditionList, formik.values]);

  const handleGroupChange = (event) => {
    const selectedGroup = event.target.value;
    setGroup(selectedGroup);
    const fields = healthInsuranceDynamicConditionList
      .filter((e) => e.group === selectedGroup && e.isActive)
      .map((e) => e.condition);

    setSelectedFields(fields);
  };

  const selectedConditionHandleChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  return (
    <>
      {healthInsuranceDynamicConditionListLoader ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "10rem !important",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        transform: "translate(12px, 20px) scale(1)",
                        background: "#FFF",
                        padding: "0 5px",
                      }}
                      id="select-group-label"
                    >
                      Select Group
                    </InputLabel>
                    <Select labelId="select-group-label" id="select-group" value={group} onChange={handleGroupChange}>
                      {allGroupLabels?.map((group, idx) => (
                        <MenuItem key={idx} value={group.group}>
                          {group.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        transform: "translate(12px, 20px) scale(1)",
                        background: "#FFF",
                        padding: "0 5px",
                      }}
                      id="select-condition-label"
                    >
                      Select Condition
                    </InputLabel>
                    <Select
                      labelId="select-condition-label"
                      id="select-condition"
                      value={selectedGroup}
                      onChange={selectedConditionHandleChange}
                    >
                      {healthInsuranceDynamicConditionList &&
                        healthInsuranceDynamicConditionList.map((e, idx) => {
                          if (e.isActive && e.group === group && selectedFields.includes(e.condition)) {
                            return (
                              <MenuItem key={idx} value={e.condition}>
                                {e.label}
                              </MenuItem>
                            );
                          }
                        })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12}>
                  <Button
                    sx={{ m: 1 }}
                    type="button"
                    variant="contained"
                    onClick={() => {
                      const addValueToArray = (newValue) => {
                        const selectedGroupLabel = healthInsuranceDynamicConditionList?.find(
                          (item) => item.condition === newValue
                        );

                        if (field.includes(newValue)) {
                          toast.error(
                            selectedGroupLabel.groupLabel + " > " + selectedGroupLabel.label + " is already selected"
                          );
                          return;
                        }

                        // const temp2 = [...allSelectedCondition, ...[{ ...selectedGroupLabel, children: 1 }]];
                        // setAllSelectedCondition(temp2);

                        if (field.indexOf(newValue) === -1) {
                          _field([...field, newValue]);
                        }

                        let arrayData = [...arrayofDataToMap];
                        const selectedGroup = arrayData?.find((item) => item.condition === newValue);
                        if (!selectedGroup) {
                          const newGroup = healthInsuranceDynamicConditionList.find((f) => f.condition === newValue);
                          setArrayofDataToMap((adata) => [...adata, { ...newGroup, children: 1 }]);
                        }
                      };

                      addValueToArray(selectedGroup);
                    }}
                  >
                    ADD
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {arrayofDataToMap &&
                    arrayofDataToMap?.map((e, idx) => {
                      if (e.isActive === true) {
                        if (e.dType == "string" || e.dType == "number") {
                          return (
                            <StringNumberComditionForm
                              item={e}
                              formik={formik}
                              setArrayofDataToMap={setArrayofDataToMap}
                              arrayofDataToMap={arrayofDataToMap}
                              field={field}
                              _field={_field}
                            />
                          );
                        } else if (e.dType == "boolean") {
                          return (
                            <BooleanComditionForm
                              item={e}
                              formik={formik}
                              setArrayofDataToMap={setArrayofDataToMap}
                              arrayofDataToMap={arrayofDataToMap}
                              field={field}
                              _field={_field}
                            />
                          );
                        } else if (e.dType == "object") {
                          return (
                            <ObjectComditionForm
                              ele={e}
                              formik={formik}
                              setArrayofDataToMap={setArrayofDataToMap}
                              arrayofDataToMap={arrayofDataToMap}
                              field={field}
                              _field={_field}
                            />
                          );
                        }
                      }
                    })}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              mx: -1,
              mb: -1,
              mt: 3,
            }}
          >
            <NextLink href={`/companies/${companyId}/health-insurance/conditions`} passHref>
              <Button sx={{ m: 1 }} variant="outlined">
                Cancel
              </Button>
            </NextLink>

            <Button sx={{ m: 1 }} type="submit" variant="contained">
              {conditionId ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      )}
    </>
  );
};

export default HealthInsuranceConditionsEditForm;
