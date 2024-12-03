import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Chip,
  OutlinedInput,
  Fade,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import {
  getFormdataOfConditions,
  addNewConditions,
  updateConditionsById,
  getMakeAndModelData,
} from "../action/companyAcrion";
import companyAPI from "src/services/api/companies";

const ConditionsEditForm = () => {
  const dispatch = useDispatch();
  const { conditionsDetail, conditionsFormData, loading } = useSelector((state) => state.company);
  const router = useRouter();
  const { companyId, conditionId } = router.query;

  const [field, _field] = useState([]);
  const [group, setGroup] = useState("");
  const [addedGroup, setAddedGroup] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [allGroupLabels, setAllGroupLabels] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState("");
  const [model, setModel] = useState("car:make");
  const [body, setBody] = useState({});
  const [selectedMakeForCarModel, setSelectedMakeForCarModel] = useState();
  const [selectedMakeForModel, setSelectedMakeForModel] = useState();
  const [selectedMakeForBody, setSelectedMakeForBody] = useState();
  const [makeAndModelMake, setMakeAndModelMake] = useState();
  const [makeAndModelModel, setMakeAndModelModel] = useState();
  const [makeAndBodyMake, setMakeAndBodyMake] = useState();
  const [makeAndBodyModel, setMakeAndBodyModel] = useState();
  const [nationality, setNationality] = useState();

  const [makeAndBodyModelOption, setMakeAndBodyModelOption] = useState([]);
  const [makeAndModelOption, setMakeAndModelOption] = useState([]);
  const [excludedMakeAndModelOption, setExcludedMakeAndModelOption] = useState([]);

  const [addBtnEnable, setAddBtnEnable] = useState(true);

  const [arrayofDataToMap, setArrayofDataToMap] = useState([]);

  const [allSelectedCondition, setAllSelectedCondition] = useState([]);

  const initialized = useRef(false);

  // On edit - Get all values from API
  useEffect(() => {
    if (conditionsDetail) {
      if (initialized.current) {
        return;
      }

      initialized.current = true;

      if (conditionsDetail?.amount?.makeAndModel?.make) {
        setSelectedMakeForModel(conditionsDetail?.amount?.makeAndModel?.make);
        companyAPI
          .getMakeAndModelData({
            model: "car:model",
            body: {
              make: conditionsDetail?.amount?.makeAndModel?.make,
            },
          })
          .then((res) => {
            setMakeAndModelModel(res.data.data);
          });
      }
      if (conditionsDetail?.amount?.country) {
        companyAPI
          .getMakeAndModelData({
            model: "country:name",
            body: {},
          })
          .then((res) => {
            setNationality(res.data.data);
          });
      }
      if (conditionsDetail?.amount?.makeAndBodyType?.make) {
        setSelectedMakeForBody(conditionsDetail?.amount?.makeAndBodyType?.make);
        companyAPI
          .getMakeAndModelData({
            model: "car:bodyType",
            body: {
              make: conditionsDetail?.amount?.makeAndBodyType?.make,
            },
          })
          .then((res) => {
            setMakeAndBodyModel(res.data.data);
          });
      }
      if (conditionsDetail?.cars?.excludedCarMakeModel) {
        conditionsDetail?.cars?.excludedCarMakeModel?.map((item, idx) => {
          excludedMakeAndModelArrayCall(item?.make, idx);
        });
      }
      if (conditionsDetail?.amount?.makeAndBodyType) {
        conditionsDetail?.amount?.makeAndBodyType?.map((item, idx) => {
          onMakeAndBodyTypeArrayCall(item?.make, idx, conditionsDetail?.amount?.makeAndBodyType);
        });
      }
      if (conditionsDetail?.amount?.makeAndModel) {
        conditionsDetail?.amount?.makeAndModel?.map((item, idx) => {
          onMakeAndModelArrayCall(item?.make, idx);
        });
      }
    }
  }, [conditionsDetail]);

  useEffect(() => {
    dispatch(getFormdataOfConditions());
    companyAPI
      .getMakeAndModelData({
        model: model,
        body: body,
      })
      .then((res) => {
        setMakeAndModelMake(res.data.data);
        setMakeAndBodyMake(res.data.data);
      });
  }, []);

  useEffect(() => {
    if (selectedMakeForCarModel) {
      companyAPI
        .getMakeAndModelData({
          model: "car:model",
          body: { make: selectedMakeForCarModel },
        })
        .then((res) => {
          setCarModels(res.data.data);
        });
    }
  }, [selectedMakeForCarModel]);

  useEffect(() => {
    companyAPI
      .getMakeAndModelData({
        model: model,
        body: body,
      })
      .then((res) => {
        if (model === "car:model") {
          setMakeAndModelModel(res.data.data);
        } else if (model === "car:bodyType") {
          setMakeAndBodyModel(res.data.data);
        } else if (model === "country:name") {
          setNationality(res.data.data);
        }
      });
  }, [model, body]);

  const handleChange = (event) => {
    const selectedGroup = event.target.value;
    setGroup(selectedGroup);
    // Filter the conditionsFormData to get the fields corresponding to the selected group
    const fields = conditionsFormData.filter((e) => e.group === selectedGroup && e.isActive).map((e) => e.condition);

    setSelectedFields(fields);
  };
  const selectedGroupHandleChange = (event) => {
    setSelectedGroup(event.target.value);

    if (event.target.value === "country") {
      companyAPI
        .getMakeAndModelData({
          model: "country:name",
          body: {},
        })
        .then((res) => {
          setNationality(res.data.data);
        });
    }
  };

  // Get make and bodytype condition options API
  const onMakeAndBodyTypeArrayCall = (make, index, arrayData) => {
    if (arrayData?.length > 0) {
      let aa = [];

      arrayData?.map((item, idx) => {
        companyAPI
          .getMakeAndModelData({
            model: "car:bodyType",
            body: {
              make: item?.make,
            },
          })
          .then((res) => {
            if (aa?.length > 0) {
              const match = aa?.find((e) => e.index === idx);
              if (match) {
                aa.map((q) => {
                  if (q.index === idx) {
                    const countIndex = aa.idxOf(match);
                    if (countIndex > -1) {
                      aa.splice(countIndex, 1);
                    }
                  }
                });
                const arr = [...aa, { index: idx, options: res.data.data }];
                aa = arr;
              } else {
                const arr = [...aa, { index: idx, options: res.data.data }];
                aa = arr;
              }
            } else {
              const arr = [...aa, { index: idx, options: res.data.data }];
              aa = arr;
            }
            setMakeAndBodyModelOption(aa);
          });
      });
    } else {
      companyAPI
        .getMakeAndModelData({
          model: "car:bodyType",
          body: {
            make: make,
          },
        })
        .then((res) => {
          if (makeAndBodyModelOption?.length > 0) {
            const match = makeAndBodyModelOption?.find((e) => e.index === index);
            if (match) {
              const array = makeAndBodyModelOption;
              makeAndBodyModelOption.map((q) => {
                if (q.index === index) {
                  const countIndex = array.indexOf(match);
                  if (countIndex > -1) {
                    array.splice(countIndex, 1);
                  }
                }
              });
              const arr = [...array, { index: index, options: res.data.data }];
              setMakeAndBodyModelOption(arr);
            } else {
              const arr = [...makeAndBodyModelOption, { index: index, options: res.data.data }];
              setMakeAndBodyModelOption(arr);
            }
          } else {
            const arr = [...makeAndBodyModelOption, { index: index, options: res.data.data }];
            setMakeAndBodyModelOption(arr);
          }
        });
    }
  };

  // Get make and model condition options API
  const onMakeAndModelArrayCall = (make, index) => {
    companyAPI
      .getMakeAndModelData({
        model: "car:model",
        body: {
          make: make,
        },
      })
      .then((res) => {
        if (makeAndModelOption?.length > 0) {
          const match = makeAndModelOption?.find((e) => e.index === index);
          if (match) {
            const array = makeAndModelOption;
            makeAndModelOption.map((q) => {
              if (q.index === index) {
                const countIndex = array.indexOf(match);
                if (countIndex > -1) {
                  array.splice(countIndex, 1);
                }
              }
            });
            const arr = [...array, { index: index, options: res.data.data }];
            setMakeAndModelOption(arr);
          } else {
            const arr = [...makeAndModelOption, { index: index, options: res.data.data }];
            setMakeAndModelOption(arr);
          }
        } else {
          const arr = [...makeAndModelOption, { index: index, options: res.data.data }];
          setMakeAndModelOption(arr);
        }
      });
  };

  // Get make and model condition options API
  const excludedMakeAndModelArrayCall = (make, index) => {
    companyAPI
      .getMakeAndModelData({
        model: "car:model",
        body: {
          make: make,
        },
      })
      .then((res) => {
        if (excludedMakeAndModelOption?.length > 0) {
          const match = excludedMakeAndModelOption?.find((e) => e.index === index);
          if (match) {
            const array = excludedMakeAndModelOption;
            excludedMakeAndModelOption.map((q) => {
              if (q.index === index) {
                const countIndex = array.indexOf(match);
                if (countIndex > -1) {
                  array.splice(countIndex, 1);
                }
              }
            });
            const arr = [...array, { index: index, options: res.data.data }];
            setExcludedMakeAndModelOption(arr);
          } else {
            const arr = [...excludedMakeAndModelOption, { index: index, options: res.data.data }];
            setExcludedMakeAndModelOption(arr);
          }
        } else {
          const arr = [...excludedMakeAndModelOption, { index: index, options: res.data.data }];
          setExcludedMakeAndModelOption(arr);
        }
      });
  };

  const ITEM_HEIGHT = 40;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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

  const init = {
    ...conditionsFormData?.reduce((acc, e) => {
      if (e.isActive && e.multiple && e.dType !== "object") {
        return {
          ...acc,
          [e.group]: {
            ...acc[e.group],
            [e.condition]: conditionsDetail?.[e.group]?.[e.condition] || [],
          },
        };
      } else if (e.isActive && e.dType === "boolean") {
        return {
          ...acc,
          [e.group]: {
            ...acc[e.group],
            [e.condition]: JSON.stringify(conditionsDetail?.[e.group]?.[e.condition]) || "",
          },
        };
      } else if (e.dType === "object" && e.isActive) {
        const data = e.options[0].fields?.reduce((ac, element) => {
          const ss = conditionsDetail?.[e.group]?.[e.condition]?.reduce((abc, ele) => {
            return [...abc, ele];
          }, []);

          return ss;
        }, {});

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
            [e.condition]: conditionsDetail?.[e.group]?.[e.condition] || "",
          },
        };
      }
      return acc;
    }, {}),
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: init,

    onSubmit: (values, helpers) => {
      let payload = removeEmptyFields(values);

      if (conditionId) {
        dispatch(updateConditionsById({ id: conditionId, data: payload }))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              router.push(`/companies/${companyId}/motor-insurance/conditions`);
              toast("Successfully Edited", {
                type: "success",
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
      } else {
        dispatch(addNewConditions(payload))
          .unwrap()
          .then((res) => {
            if (res?.success) {
              formik.resetForm();
              router.push(`/companies/${companyId}/motor-insurance/conditions`);
              toast("Successfully Created", {
                type: "success",
              });
            }
          })
          .catch((err) => {
            toast(err, {
              type: "error",
            });
          });
      }
    },
  });

  useEffect(() => {
    if (conditionsDetail != null) {
      const keys = Object.keys(conditionsDetail).reduce((acc, key) => {
        if (typeof conditionsDetail[key] === "object" && !Array.isArray(conditionsDetail[key])) {
          acc.push(...Object.keys(conditionsDetail[key]));
        }
        return acc;
      }, []);
      _field(keys);
    }
  }, [conditionsDetail]);

  useEffect(() => {
    setSelectedMakeForBody(formik.values?.amount?.makeAndBodyType?.make);
    setSelectedMakeForModel(formik.values?.amount?.makeAndModel?.make);
  }, [formik.values?.amount?.makeAndBodyType?.make, formik.values?.amount?.makeAndModel?.make]);

  // Update group labels 
  useEffect(() => {
    if (arrayofDataToMap && arrayofDataToMap.length) {
      const grplabels = arrayofDataToMap
        .filter((e) => e.isActive)
        .reduce((a, b) => {
          return [...a, ...(a.map((aa) => aa.group).includes(b.group) ? [] : [{ ...b }])];
        }, [])
        .map((g) => g._id);
      setAllGroupLabels(grplabels);
    }
  }, [arrayofDataToMap]);

  useEffect(() => {
    if (conditionId) {
      setAllSelectedCondition(conditionsFormData);
      let arrayofDataToMapClone = [...arrayofDataToMap];

      if (arrayofDataToMap?.length === 0 && conditionsFormData?.length > 0) {
        const filteredConditions = conditionsFormData?.reduce((a, b) => {
          return [...a, ...(conditionsDetail?.[b?.["group"]]?.[b?.["condition"]] ? [b] : [])];
        }, []);

        setArrayofDataToMap(filteredConditions);
      } else if (arrayofDataToMap?.length > 0 && conditionsFormData?.length > 0 && field?.length > 0) {
        const filteredConditions = conditionsFormData?.reduce((a, b) => {
          return [...a, ...(field.includes(b["condition"]) ? [b] : [])];
        }, []);

        let filterConditionClone = [...filteredConditions];

        arrayofDataToMapClone?.forEach((i) => {
          if (i?.options?.[0]?.fields?.length > 0 && i.dType == "object") {
            const objectToAdd = filterConditionClone.findIndex((e) => e.condition === i.condition);

            filterConditionClone[objectToAdd] = {
              ...filterConditionClone[objectToAdd],
              children: i?.children || formik.values?.[i.group]?.[i.condition]?.length || 1,
            };
          }
        });

        setArrayofDataToMap(filterConditionClone);
      }
    } else {
      setArrayofDataToMap(allSelectedCondition);
    }
  }, [conditionId, field, conditionsFormData, formik.values]);

  // find empty values 
  useEffect(() => {
    if (arrayofDataToMap) {
      let foundEmpty = false;
      arrayofDataToMap.map((e, idx) => {
        let value;
        if (e?.dType === "object" && !e.multiple) {
          e?.options[0]?.fields?.map((item) => {
            value = formik.values?.[e.group]?.[e.condition]?.[item.condition];

            if (value && value?.length === 0) {
              value = null;
            }
          });
        } else if (e.dType === "object" && e.multiple) {
          e?.options[0]?.fields?.map((item) => {
            value = formik.values?.[e.group]?.[e.condition];

            if (value && value?.length === 0) {
              value = null;
            }
          });
        } else {
          value = formik.values?.[e.group]?.[e.condition];
          if (value && value.length === 0) {
            value = null;
          }
        }
        if (!value) {
          foundEmpty = true;
        } else {
        }
      });
      if (foundEmpty) {
        setAddBtnEnable(false);
      } else {
        setAddBtnEnable(true);
      }
    }
  }, [formik.values, arrayofDataToMap]);

  return (
    <>
      {loading ? (
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
                {/* <Grid item md={4} xs={12}>
                                <Typography variant="h6">Basic details</Typography>
                            </Grid> */}

                <Grid item md={5} xs={12}>
                  {/* <Box mt={3}> */}
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
                    <Select labelId="select-group-label" id="select-group" value={group} onChange={handleChange}>
                      {conditionsFormData &&
                        conditionsFormData
                          .filter((e) => e.isActive)
                          .reduce((uniqueGroups, currentGroup) => {
                            //   if (!uniqueGroups.find((group) => group === currentGroup.group)) {
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
                            // uniqueGroups.push({group: currentGroup.group});
                            //   }
                            //   return uniqueGroups;
                          }, [])
                          .map((group, idx) => (
                            <MenuItem key={idx} value={group.group}>
                              {group.label}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                  {/* </Box> */}
                </Grid>
                {/* <Box mt={3}> */}
                <Grid item md={5} xs={12}>
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
                      onChange={selectedGroupHandleChange}
                    >
                      {conditionsFormData &&
                        conditionsFormData.map((e, idx) => {
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
                  {/* </Box> */}
                </Grid>
                <Grid item md={2} xs={12}>
                  <Button
                    sx={{ m: 1 }}
                    type="button"
                    variant="contained"
                    onClick={() => {
                      const addValueToArray = (newValue) => {
                        const selectedGroupLabel = conditionsFormData?.find((item) => item.condition === newValue);

                        if (field.includes(newValue)) {
                          toast.error(
                            selectedGroupLabel.groupLabel + " > " + selectedGroupLabel.label + " is already selected"
                          );
                          return;
                        }

                        const temp2 = [...allSelectedCondition, ...[{ ...selectedGroupLabel, children: 1 }]];
                        setAllSelectedCondition(temp2);

                        const temp = [...addedGroup, group];

                        setAddedGroup(temp);

                        if (field.indexOf(newValue) === -1) {
                          _field([...field, newValue]);
                        }

                        let arrayData = [...arrayofDataToMap];
                        const selectedGroup = arrayData?.find((item) => item.condition === newValue);

                        if (!selectedGroup) {
                          const newGroup = conditionsFormData.find((f) => f.condition === newValue);
                          setArrayofDataToMap((adata) => [...adata, { ...newGroup, children: 1 }]);
                        }
                      };

                      addValueToArray(selectedGroup);
                    }}
                  >
                    ADD
                  </Button>
                </Grid>
                <Grid item md={12} xs={12}>
                  {arrayofDataToMap &&
                    arrayofDataToMap?.map((e, idx) => {
                      // if (selectedFields.includes(e.condition)) {
                      if (e.isActive === true) {
                        const isFirstGroup = allSelectedCondition.slice(0, idx).every((item) => item.group !== e.group);
                        // const capitalizedGroup = e.group.charAt(0).toUpperCase() + e.group.slice(1).toLowerCase();
                        if (e.multiple === false) {
                          if (e.dType === "boolean") {
                            if (field.includes(e.condition)) {
                              // await formik.setValues({ ...formik.values, [e.group]: "true" });
                              return (
                                <>
                                  <Fade in={allGroupLabels.includes(e._id)} unmountOnExit timeout={1000}>
                                    <Grid item md={9} sm={12} spacing={3} sx={{ mt: 2 }}>
                                      <Box
                                        sx={{
                                          px: 2,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          gap: 3,
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        <Typography
                                          variant="h4"
                                          gutterBottom
                                          sx={{
                                            fontWeight: "500",
                                            fontSize: {
                                              md: "20px",
                                              sm: "16px",
                                              xs: "14px",
                                            },
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {e.groupLabel}
                                        </Typography>
                                        <Box
                                          sx={{
                                            width: "-webkit-fill-available",
                                            borderBottom: "1px solid #B2B2B2",
                                          }}
                                        ></Box>
                                      </Box>
                                    </Grid>
                                  </Fade>

                                  <Grid container key={e._id} spacing={3} padding={1}>
                                    <Grid item md={9} sm={12}>
                                      <TextField
                                        error={Boolean(
                                          formik.touched?.[e.group]?.[e.condition] &&
                                            formik.errors?.[e.group]?.[e.condition]
                                        )}
                                        fullWidth
                                        defaultValue={"true"}
                                        helperText={
                                          formik.touched?.[e.group]?.[e.condition] &&
                                          formik.errors?.[e.group]?.[e.condition]
                                        }
                                        label={e.label}
                                        name={`${e.group}.${e.condition}`}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={
                                          formik.values && formik.values[e.group] && formik.values[e.group][e.condition]
                                            ? formik.values[e.group][e.condition]
                                            : ""
                                        }
                                        select
                                        type={e.dType}
                                        SelectProps={{ native: true }}
                                      >
                                        <option value="" disabled></option>
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                      </TextField>
                                    </Grid>
                                    <Grid item md={3} sm={12}>
                                      <Button
                                        sx={{ m: 1 }}
                                        type="button"
                                        variant="contained"
                                        onClick={async () => {
                                          await formik.setFieldValue(`${e.group}.${e.condition}`, "");
                                          const updatedValues = {
                                            ...formik.values[e.group],
                                          };
                                          updatedValues[e.condition] = undefined;
                                          delete updatedValues[e.condition];
                                          formik.unregisterField(`${e.group}.${e.condition}`);
                                          await formik.setValues({
                                            ...formik.values,
                                            [e.group]: updatedValues,
                                          });
                                          const update = field.filter((field) => field !== e.condition);
                                          _field(update);

                                          setAllSelectedCondition((allSelectedCondition) =>
                                            allSelectedCondition.filter((item) => item._id !== e._id)
                                          );
                                        }}
                                      >
                                        DELETE
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            }
                          } else {
                            if (field.includes(e.condition)) {
                              if (e.dType === "object") {
                                return (
                                  <>
                                    <Fade in={allGroupLabels.includes(e._id)} unmountOnExit timeout={1000}>
                                      <Grid item md={9} sm={12} spacing={3} sx={{ mt: 2 }}>
                                        <Box
                                          sx={{
                                            px: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 3,
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          <Typography
                                            variant="h4"
                                            gutterBottom
                                            sx={{
                                              fontWeight: "500",
                                              fontSize: {
                                                md: "20px",
                                                sm: "16px",
                                                xs: "14px",
                                              },
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {e.groupLabel}
                                          </Typography>
                                          <Box
                                            sx={{
                                              width: "-webkit-fill-available",
                                              borderBottom: "1px solid #B2B2B2",
                                            }}
                                          ></Box>
                                        </Box>
                                      </Grid>
                                    </Fade>
                                    {e.options[0].fields.map((item, idx) => {
                                      if (item.options.length > 0 && !Object.keys(item).includes("isDynamic")) {
                                        return (
                                          <>
                                            <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                              <Grid item md={9} sm={12}>
                                                <TextField
                                                  error={Boolean(
                                                    formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                      formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                  )}
                                                  fullWidth
                                                  helperText={
                                                    formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                    formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                  }
                                                  label={e.label + " - " + item.label}
                                                  name={`${e.group}.${e.condition}.${item.condition}`}
                                                  onBlur={formik.handleBlur}
                                                  onChange={formik.handleChange}
                                                  value={
                                                    formik.values?.[e.group]?.[e.condition]?.[item.condition] ?? ""
                                                  }
                                                  select
                                                  type={item.dType}
                                                  SelectProps={{ native: true }}
                                                >
                                                  <option value="" disabled></option>
                                                  {item.options.map((i) => (
                                                    <option value={i} key={i}>
                                                      {i}
                                                    </option>
                                                  ))}
                                                </TextField>
                                              </Grid>

                                              {
                                                <Grid item md={3} sm={12}>
                                                  <Button
                                                    sx={{ m: 1 }}
                                                    type="button"
                                                    variant="contained"
                                                    onClick={async () => {
                                                      await formik.setFieldValue(
                                                        `${e.group}.${e.condition}.${e.condition}`,
                                                        ""
                                                      );
                                                      const updatedValues = {
                                                        ...formik.values[e.group],
                                                      };
                                                      updatedValues[e.condition] = undefined;
                                                      delete updatedValues[e.condition];
                                                      formik.unregisterField(
                                                        `${e.group}.${e.condition}.${e.condition}`
                                                      );
                                                      await formik.setValues({
                                                        ...formik.values,
                                                        [e.group]: updatedValues,
                                                      });
                                                      const update = field.filter((field) => field !== e.condition);
                                                      _field(update);

                                                      const updateConditionArray = allSelectedCondition.filter(
                                                        (item) => item._id !== e._id
                                                      );
                                                      setAllSelectedCondition(updateConditionArray);
                                                    }}
                                                  >
                                                    DELETE
                                                  </Button>
                                                </Grid>
                                              }
                                            </Grid>
                                          </>
                                        );
                                      } else if (
                                        Object.keys(item).includes("isDynamic") &&
                                        !Object.keys(item).includes("dependsOn") &&
                                        item?.multiple === false
                                      ) {
                                        return (
                                          <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                            <Grid item md={9} sm={12}>
                                              <TextField
                                                error={Boolean(
                                                  formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                    formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                )}
                                                fullWidth
                                                helperText={
                                                  formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                }
                                                label={e.label + " - " + item.label}
                                                name={`${e.group}.${e.condition}.${item.condition}`}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                onClick={(event) => {
                                                  setModel(item.model);
                                                  if (e.condition === "makeAndBodyType") {
                                                    setSelectedMakeForBody(event.target.value);
                                                    setModel("car:bodyType");
                                                    // setBody({ make: selectedMakeForBody });
                                                    setBody({
                                                      make: event.target.value,
                                                    });
                                                  } else if (e.condition === "excludedCarMakeModel") {
                                                    setSelectedMakeForCarModel(event.target.value);
                                                  } else {
                                                    setSelectedMakeForModel(event.target.value);
                                                    setModel("car:model");
                                                    setBody({
                                                      make: event.target.value,
                                                    });
                                                  }
                                                  if (item.condition === "nationality") {
                                                    setBody({});
                                                  }
                                                }}
                                                value={formik.values?.[e.group]?.[e.condition]?.[item.condition] ?? ""}
                                                select
                                                type={item.dType}
                                                SelectProps={{ native: true }}
                                              >
                                                <option value="" disabled></option>
                                                {e.condition === "makeAndModel" && item.condition === "make"
                                                  ? makeAndModelMake?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))
                                                  : e.condition === "excludedCarMakeModel" && item.condition === "make"
                                                  ? makeAndModelMake?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))
                                                  : item.condition === "nationality"
                                                  ? nationality?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))
                                                  : makeAndBodyMake?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))}
                                              </TextField>
                                            </Grid>
                                            {e.condition === "excludedCarMakeModel" && (
                                              <Grid item md={3} sm={12}>
                                                <Button
                                                  sx={{ m: 1 }}
                                                  type="button"
                                                  variant="contained"
                                                  onClick={async () => {
                                                    await formik.setFieldValue(
                                                      `${e.group}.${e.condition}.${e.condition}`,
                                                      ""
                                                    );
                                                    const updatedValues = {
                                                      ...formik.values[e.group],
                                                    };
                                                    updatedValues[e.condition] = undefined;
                                                    delete updatedValues[e.condition];
                                                    formik.unregisterField(`${e.group}.${e.condition}.${e.condition}`);
                                                    await formik.setValues({
                                                      ...formik.values,
                                                      [e.group]: updatedValues,
                                                    });
                                                    const update = field.filter((field) => field !== e.condition);
                                                    _field(update);

                                                    const updateConditionArray = allSelectedCondition.filter(
                                                      (item) => item._id !== e._id
                                                    );
                                                    setAllSelectedCondition(updateConditionArray);
                                                  }}
                                                >
                                                  DELETE
                                                </Button>
                                              </Grid>
                                            )}
                                          </Grid>
                                        );
                                      } else if (
                                        Object.keys(item).includes("isDynamic") &&
                                        !Object.keys(item).includes("dependsOn") &&
                                        item?.multiple === true
                                      ) {
                                        return (
                                          <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                            <Grid item md={9} sm={12}>
                                              <FormControl key={e._id} fullWidth>
                                                <InputLabel
                                                  sx={{
                                                    transform: "translate(12px, 20px) scale(1)",
                                                    background: "#FFF",
                                                    padding: "0 5px",
                                                  }}
                                                  id="demo-multiple-chip-label"
                                                >
                                                  {e.label}
                                                </InputLabel>
                                                <Select
                                                  labelId="demo-multiple-chip-label"
                                                  id="demo-multiple-chip"
                                                  name={`${e.group}.${e.condition}.${item.condition}`}
                                                  label={e.label + " - " + item.label}
                                                  multiple
                                                  fullWidth
                                                  error={Boolean(
                                                    formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                      formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                  )}
                                                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                                  value={
                                                    formik.values?.[e.group]?.[e.condition]?.[item.condition] ?? []
                                                  }
                                                  onBlur={formik.handleBlur}
                                                  onChange={formik.handleChange}
                                                  MenuProps={MenuProps}
                                                  renderValue={(selected) => {
                                                    return (
                                                      <Box
                                                        sx={{
                                                          display: "flex",
                                                          flexWrap: "wrap",
                                                          gap: 0.5,
                                                        }}
                                                      >
                                                        {selected.map((value) => (
                                                          <Chip key={value} label={value} />
                                                        ))}
                                                      </Box>
                                                    );
                                                  }}
                                                >
                                                  {nationality?.map((d) => (
                                                    <MenuItem key={d} value={d}>
                                                      {d}
                                                    </MenuItem>
                                                  ))}
                                                </Select>
                                                {formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[item.condition] && (
                                                    <div
                                                      style={{
                                                        color: "red",
                                                        fontSize: "0.8rem",
                                                        paddingLeft: "1rem",
                                                      }}
                                                    >
                                                      {formik.errors?.[e.group]?.[e.condition]?.[item.condition]}
                                                    </div>
                                                  )}
                                              </FormControl>
                                            </Grid>
                                          </Grid>
                                        );
                                      } else if (Object.keys(item).includes("dependsOn")) {
                                        return (
                                          <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                            <Grid item md={9} sm={12}>
                                              <TextField
                                                error={Boolean(
                                                  formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                    formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                )}
                                                fullWidth
                                                helperText={
                                                  formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                }
                                                label={e.label + " - " + item.label}
                                                name={`${e.group}.${e.condition}.${item.condition}`}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                onClick={(event) => {
                                                  setModel(item.model);
                                                  if (item.condition === "nationality") {
                                                    setBody({});
                                                  } else if (e.condition === "makeAndBodyType") {
                                                    setBody({
                                                      make: selectedMakeForBody,
                                                    });
                                                    // setModel({ model: "car:bodyType" });
                                                  } else {
                                                    setBody({
                                                      make: selectedMakeForModel,
                                                    });
                                                    // setModel({ model: "car:bodyType" });
                                                  }
                                                }}
                                                value={formik.values?.[e.group]?.[e.condition]?.[item.condition] ?? ""}
                                                select
                                                type={item.dType}
                                                SelectProps={{ native: true }}
                                              >
                                                <option value="" disabled></option>
                                                {e.condition === "makeAndModel"
                                                  ? makeAndModelModel?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))
                                                  : item.condition === "nationality"
                                                  ? nationality?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))
                                                  : e.condition === "excludedCarMakeModel"
                                                  ? carModels?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))
                                                  : makeAndBodyModel?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))}
                                              </TextField>
                                            </Grid>
                                          </Grid>
                                        );
                                      } else {
                                        return (
                                          <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                            <Grid item md={9} sm={12}>
                                              <TextField
                                                error={Boolean(
                                                  formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                    formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                )}
                                                fullWidth
                                                helperText={
                                                  formik.touched?.[e.group]?.[e.condition]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[item.condition]
                                                }
                                                label={e.label + " - " + item.label}
                                                name={`${e.group}.${e.condition}.${item.condition}`}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                value={formik.values?.[e.group]?.[e.condition]?.[item.condition] ?? ""}
                                                type={item.dType}
                                              ></TextField>
                                            </Grid>
                                          </Grid>
                                        );
                                      }
                                    })}
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <Fade in={allGroupLabels.includes(e._id)} unmountOnExit timeout={1000}>
                                      <Grid item md={9} sm={12} spacing={3} sx={{ mt: 2 }}>
                                        <Box
                                          sx={{
                                            px: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 3,
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          <Typography
                                            variant="h4"
                                            gutterBottom
                                            sx={{
                                              fontWeight: "500",
                                              fontSize: {
                                                md: "20px",
                                                sm: "16px",
                                                xs: "14px",
                                              },
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {e.groupLabel}
                                          </Typography>
                                          <Box
                                            sx={{
                                              width: "-webkit-fill-available",
                                              borderBottom: "1px solid #B2B2B2",
                                            }}
                                          ></Box>
                                        </Box>
                                      </Grid>
                                    </Fade>

                                    <Grid container key={e._id} spacing={3} padding={1}>
                                      <Grid item md={9} sm={12}>
                                        <TextField
                                          error={Boolean(
                                            formik.touched?.[e.group]?.[e.condition] &&
                                              formik.errors?.[e.group]?.[e.condition]
                                          )}
                                          fullWidth
                                          helperText={
                                            formik.touched?.[e.group]?.[e.condition] &&
                                            formik.errors?.[e.group]?.[e.condition]
                                          }
                                          label={e.label}
                                          name={`${e.group}.${e.condition}`}
                                          onBlur={formik.handleBlur}
                                          onChange={formik.handleChange}
                                          value={
                                            formik.values &&
                                            formik.values[e.group] &&
                                            formik.values[e.group][e.condition]
                                              ? formik.values[e.group][e.condition]
                                              : ""
                                          }
                                          type={e.dType}
                                        ></TextField>
                                      </Grid>
                                      <Grid item md={3} sm={12}>
                                        <Button
                                          sx={{ m: 1 }}
                                          type="button"
                                          variant="contained"
                                          onClick={async () => {
                                            await formik.setFieldValue(`${e.group}.${e.condition}`, "");
                                            const updatedValues = {
                                              ...formik.values[e.group],
                                            };
                                            updatedValues[e.condition] = undefined;
                                            delete updatedValues[e.condition];
                                            formik.unregisterField(`${e.group}.${e.condition}`);
                                            await formik.setValues({
                                              ...formik.values,
                                              [e.group]: updatedValues,
                                            });
                                            const update = field.filter((field) => field !== e.condition);
                                            _field(update);

                                            const updateConditionArray = allSelectedCondition.filter(
                                              (item) => item._id !== e._id
                                            );
                                            setAllSelectedCondition(updateConditionArray);
                                          }}
                                        >
                                          DELETE
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </>
                                );
                              }
                            }
                          }
                        } else if (e.multiple) {
                          if (field.includes(e.condition) && e.dType !== "object") {
                            return (
                              <>
                                <Fade in={allGroupLabels.includes(e._id)} unmountOnExit timeout={1000}>
                                  <Grid item md={9} sm={12} spacing={3} sx={{ mt: 2 }}>
                                    <Box
                                      sx={{
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 3,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      <Typography
                                        variant="h4"
                                        gutterBottom
                                        sx={{
                                          fontWeight: "500",
                                          fontSize: {
                                            md: "20px",
                                            sm: "16px",
                                            xs: "14px",
                                          },
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {e.groupLabel}
                                      </Typography>
                                      <Box
                                        sx={{
                                          width: "-webkit-fill-available",
                                          borderBottom: "1px solid #B2B2B2",
                                        }}
                                      ></Box>
                                    </Box>
                                  </Grid>
                                </Fade>

                                <Grid key={e._id} container spacing={3} padding={1}>
                                  <Grid item md={9} sm={12}>
                                    <FormControl key={e._id} fullWidth>
                                      <InputLabel
                                        sx={{
                                          transform: "translate(12px, 20px) scale(1)",
                                          background: "#FFF",
                                          padding: "0 5px",
                                        }}
                                        id="demo-multiple-chip-label"
                                      >
                                        {e.label}
                                      </InputLabel>
                                      <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        name={`${e.group}.${e.condition}`}
                                        label={e.label}
                                        multiple
                                        fullWidth
                                        error={Boolean(
                                          formik.touched?.[e.group]?.[e.condition] &&
                                            formik.errors?.[e.group]?.[e.condition]
                                        )}
                                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                        value={
                                          formik.values && formik.values[e.group] && formik.values[e.group][e.condition]
                                            ? formik.values[e.group][e.condition]
                                            : []
                                        }
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        MenuProps={MenuProps}
                                        renderValue={(selected) => (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              gap: 0.5,
                                            }}
                                          >
                                            {selected.map((value) => (
                                              <Chip key={value} label={value} />
                                            ))}
                                          </Box>
                                        )}
                                      >
                                        {e.options?.map((d) => (
                                          <MenuItem key={d} value={d}>
                                            {d}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {formik.touched?.[e.group]?.[e.condition] &&
                                        formik.errors?.[e.group]?.[e.condition] && (
                                          <div
                                            style={{
                                              color: "red",
                                              fontSize: "0.8rem",
                                              paddingLeft: "1rem",
                                            }}
                                          >
                                            {formik.errors?.[e.group]?.[e.condition]}
                                          </div>
                                        )}
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={3} sm={12}>
                                    <Button
                                      sx={{ m: 1 }}
                                      type="button"
                                      variant="contained"
                                      onClick={async () => {
                                        await formik.setFieldValue(`${e.group}.${e.condition}`, []);
                                        const updatedValues = {
                                          ...formik.values[e.group],
                                        };
                                        updatedValues[e.condition] = undefined;
                                        delete updatedValues[e.condition];
                                        formik.unregisterField(`${e.group}.${e.condition}`);
                                        await formik.setValues({
                                          ...formik.values,
                                          [e.group]: updatedValues,
                                        });
                                        const update = field.filter((field) => field !== e.condition);
                                        _field(update);

                                        const updateConditionArray = allSelectedCondition.filter(
                                          (item) => item._id !== e._id
                                        );
                                        setAllSelectedCondition(updateConditionArray);
                                      }}
                                    >
                                      DELETE
                                    </Button>
                                  </Grid>
                                </Grid>
                              </>
                            );
                          } else if (e.dType === "object") {
                            // TODO: object type + multiple
                            return (
                              <>
                                <Fade in={allGroupLabels.includes(e._id)} unmountOnExit timeout={1000}>
                                  <Grid item md={9} sm={12} spacing={3} sx={{ mt: 2 }}>
                                    <Box
                                      sx={{
                                        px: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 3,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      <Typography
                                        variant="h4"
                                        gutterBottom
                                        sx={{
                                          fontWeight: "500",
                                          fontSize: {
                                            md: "20px",
                                            sm: "16px",
                                            xs: "14px",
                                          },
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {e.groupLabel}
                                      </Typography>
                                      <Box
                                        sx={{
                                          width: "-webkit-fill-available",
                                          borderBottom: "1px solid #B2B2B2",
                                        }}
                                      ></Box>
                                    </Box>
                                  </Grid>
                                </Fade>
                                {[...Array(e.children || 0).keys()].map((child, index) => {
                                  return e.options[0].fields.map((item, ii) => {
                                    if (item.options.length > 0 && !Object.keys(item).includes("isDynamic")) {
                                      return (
                                        <>
                                          <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                            <Grid item md={9} sm={12}>
                                              <TextField
                                                error={Boolean(
                                                  formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                    formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                                )}
                                                fullWidth
                                                helperText={
                                                  formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                                }
                                                label={e.label + " - " + item.label}
                                                name={`${e.group}.${e.condition}.${index}.${item.condition}`}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                value={
                                                  formik.values?.[e.group]?.[e.condition]?.[index]?.[item.condition] ??
                                                  ""
                                                }
                                                select
                                                type={item.dType}
                                                SelectProps={{
                                                  native: true,
                                                }}
                                              >
                                                <option value="" disabled></option>
                                                {item.options.map((i) => (
                                                  <option value={i} key={i}>
                                                    {i}
                                                  </option>
                                                ))}
                                              </TextField>
                                            </Grid>

                                            {
                                              <Grid item md={3} sm={12}>
                                                <Button
                                                  sx={{ m: 1 }}
                                                  type="button"
                                                  variant="contained"
                                                  onClick={async () => {
                                                    const removeValueToArray = async (newValue) => {
                                                      let arrayData = [...arrayofDataToMap];
                                                      const selectedGroup = arrayData?.findIndex(
                                                        (item) => item.condition === newValue
                                                      );
                                                      if ((arrayData[selectedGroup].children || 0) > 1) {
                                                        await formik.setFieldValue(
                                                          `${e.group}.${e.condition}`,
                                                          formik.values?.[`${e.group}`]?.[`${e.condition}`]?.filter(
                                                            (c, cidx) => cidx !== index
                                                          )
                                                        );

                                                        arrayData[selectedGroup].children =
                                                          (arrayData[selectedGroup]?.["children"] || 0) - 1;
                                                      } else {
                                                        arrayData.splice(selectedGroup, 1);

                                                        await formik.setFieldValue(
                                                          `${e.group}.${e.condition}`,
                                                          undefined
                                                        );
                                                        formik.unregisterField(`${e.group}.${e.condition}`);
                                                        const update = field.filter((field) => field !== e.condition);
                                                        _field(update);
                                                      }
                                                      // console.log(
                                                      //   "======>",
                                                      //   arrayData,
                                                      //   selectedGroup,
                                                      //   "Remove",
                                                      //   field
                                                      // );
                                                      if (arrayData[0] === undefined) {
                                                        setArrayofDataToMap([]);
                                                        setAllSelectedCondition([]);
                                                      } else {
                                                        setArrayofDataToMap(arrayData);
                                                      }
                                                    };
                                                    await removeValueToArray(e.condition);
                                                  }}
                                                >
                                                  DELETE
                                                </Button>

                                                {index === 0 && (
                                                  <Button
                                                    sx={{ m: 1 }}
                                                    type="button"
                                                    variant="contained"
                                                    onClick={() => {
                                                      const addValueToArray = (newValue) => {
                                                        let arrayData = [...arrayofDataToMap];
                                                        const selectedGroup = arrayData?.findIndex(
                                                          (item) => item.condition === newValue
                                                        );

                                                        arrayData[selectedGroup].children =
                                                          (arrayData[selectedGroup]?.["children"] || 0) + 1;
                                                        setArrayofDataToMap(arrayData);
                                                      };
                                                      addValueToArray(e.condition);
                                                    }}
                                                  >
                                                    <AddIcon />
                                                  </Button>
                                                )}
                                              </Grid>
                                            }
                                          </Grid>
                                        </>
                                      );
                                    } else if (
                                      Object.keys(item).includes("isDynamic") &&
                                      !Object.keys(item).includes("dependsOn") &&
                                      item?.multiple === false
                                    ) {
                                      return (
                                        <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                          <Grid item md={9} sm={12}>
                                            <TextField
                                              error={Boolean(
                                                formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                              )}
                                              fullWidth
                                              helperText={
                                                formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                              }
                                              label={e.label + " - " + item.label}
                                              name={`${e.group}.${e.condition}.${index}.${item.condition}`}
                                              onBlur={(event) => {
                                                formik.handleBlur;
                                                setModel(item.model);
                                                if (e.condition === "makeAndBodyType") {
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${"bodyType"}`,
                                                    null
                                                  );
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${item.condition}`,
                                                    event.target.value
                                                  );
                                                  setSelectedMakeForBody(event.target.value);
                                                  setModel("car:bodyType");
                                                  // setBody({ make: selectedMakeForBody });
                                                  event.target.value &&
                                                    onMakeAndBodyTypeArrayCall(event.target.value, index);
                                                  setBody({
                                                    make: event.target.value,
                                                  });
                                                } else if (e.condition === "excludedCarMakeModel") {
                                                  formik.setFieldValue(`${e.group}.${e.condition}.${index}`, null);
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${item.condition}`,
                                                    event.target.value
                                                  );
                                                  setSelectedMakeForCarModel(event.target.value);
                                                  event.target.value &&
                                                    excludedMakeAndModelArrayCall(event.target.value, index);
                                                } else {
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${"model"}`,
                                                    null
                                                  );
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${item.condition}`,
                                                    event.target.value
                                                  );
                                                  setSelectedMakeForModel(event.target.value);
                                                  setModel("car:model");
                                                  setBody({
                                                    make: event.target.value,
                                                  });
                                                  event.target.value &&
                                                    onMakeAndModelArrayCall(event.target.value, index);
                                                }
                                                if (item.condition === "nationality") {
                                                  setBody({});
                                                }
                                              }}
                                              onChange={formik.handleChange}
                                              onClick={(event) => {
                                                setModel(item.model);
                                                if (e.condition === "makeAndBodyType") {
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${"bodyType"}`,
                                                    null
                                                  );
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${item.condition}`,
                                                    event.target.value
                                                  );
                                                } else if (e.condition === "excludedCarMakeModel") {
                                                  formik.setFieldValue(`${e.group}.${e.condition}.${index}`, null);
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${item.condition}`,
                                                    event.target.value
                                                  );
                                                } else {
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${"model"}`,
                                                    null
                                                  );
                                                  formik.setFieldValue(
                                                    `${e.group}.${e.condition}.${index}.${item.condition}`,
                                                    event.target.value
                                                  );
                                                }
                                                if (item.condition === "nationality") {
                                                  setBody({});
                                                }
                                              }}
                                              value={
                                                formik.values?.[e.group]?.[e.condition]?.[index]?.[item.condition] ?? ""
                                              }
                                              select
                                              type={item.dType}
                                              SelectProps={{ native: true }}
                                            >
                                              <option value="" disabled></option>
                                              {e.condition === "makeAndModel" && item.condition === "make"
                                                ? makeAndModelMake?.map((i) => (
                                                    <option key={i} value={i}>
                                                      {i}
                                                    </option>
                                                  ))
                                                : e.condition === "excludedCarMakeModel" && item.condition === "make"
                                                ? makeAndModelMake?.map((i) => (
                                                    <option key={i} value={i}>
                                                      {i}
                                                    </option>
                                                  ))
                                                : item.condition === "nationality"
                                                ? nationality?.map((i) => (
                                                    <option key={i} value={i}>
                                                      {i}
                                                    </option>
                                                  ))
                                                : makeAndBodyMake?.map((i) => (
                                                    <option key={i} value={i}>
                                                      {i}
                                                    </option>
                                                  ))}
                                            </TextField>
                                          </Grid>
                                          {e.condition === "excludedCarMakeModel" && (
                                            <Grid item md={3} sm={12}>
                                              <Button
                                                sx={{ m: 1 }}
                                                type="button"
                                                variant="contained"
                                                onClick={async () => {
                                                  const removeValueToArray = async (newValue) => {
                                                    let arrayData = [...arrayofDataToMap];
                                                    const selectedGroup = arrayData?.findIndex(
                                                      (item) => item.condition === newValue
                                                    );
                                                    if ((arrayData[selectedGroup].children || 0) > 1) {
                                                      arrayData[selectedGroup].children =
                                                        (arrayData[selectedGroup]?.["children"] || 0) - 1;

                                                      await formik.setFieldValue(
                                                        `${e.group}.${e.condition}`,
                                                        formik.values?.[`${e.group}`]?.[`${e.condition}`]?.filter(
                                                          (c, cidx) => cidx !== index
                                                        )
                                                      );

                                                      formik.unregisterField(`${e.group}.${e.condition}.${index}`);
                                                    } else {
                                                      delete arrayData[selectedGroup];
                                                      await formik.setFieldValue(
                                                        `${e.group}.${e.condition}`,
                                                        undefined
                                                      );
                                                      formik.unregisterField(`${e.group}.${e.condition}`);
                                                      const update = field.filter((field) => field !== e.condition);
                                                      _field(update);
                                                    }

                                                    if (arrayData[0] === undefined) {
                                                      setArrayofDataToMap([]);
                                                      setAllSelectedCondition([]);
                                                    } else {
                                                      setArrayofDataToMap(arrayData);
                                                    }
                                                  };
                                                  await removeValueToArray(e.condition);
                                                }}
                                              >
                                                DELETE
                                              </Button>
                                              {index === 0 && (
                                                <Button
                                                  sx={{ m: 1 }}
                                                  type="button"
                                                  variant="contained"
                                                  onClick={async () => {
                                                    const addValueToArray = (newValue) => {
                                                      let arrayData = [...arrayofDataToMap];
                                                      const selectedGroup = arrayData?.findIndex(
                                                        (item) => item.condition === newValue
                                                      );

                                                      arrayData[selectedGroup].children =
                                                        (arrayData[selectedGroup]?.["children"] || 0) + 1;
                                                      setArrayofDataToMap(arrayData);
                                                    };
                                                    addValueToArray(e.condition);
                                                  }}
                                                >
                                                  <AddIcon />
                                                </Button>
                                              )}
                                            </Grid>
                                          )}
                                        </Grid>
                                      );
                                    } else if (
                                      Object.keys(item).includes("isDynamic") &&
                                      !Object.keys(item).includes("dependsOn") &&
                                      item?.multiple === true
                                    ) {
                                      return (
                                        <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                          <Grid item md={9} sm={12}>
                                            <FormControl key={e._id} fullWidth>
                                              <InputLabel
                                                sx={{
                                                  transform: "translate(12px, 20px) scale(1)",
                                                  background: "#FFF",
                                                  padding: "0 5px",
                                                }}
                                                id="demo-multiple-chip-label"
                                              >
                                                {e.label}
                                              </InputLabel>
                                              <Select
                                                labelId="demo-multiple-chip-label"
                                                id="demo-multiple-chip"
                                                name={`${e.group}.${e.condition}.${index}.${item.condition}`}
                                                label={e.label + " - " + item.label}
                                                multiple
                                                fullWidth
                                                error={Boolean(
                                                  formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                    formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                                )}
                                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                                value={
                                                  formik.values?.[e.group]?.[e.condition]?.[index]?.[item.condition] ||
                                                  []
                                                }
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                MenuProps={MenuProps}
                                                renderValue={(selected) => {
                                                  return (
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: 0.5,
                                                      }}
                                                    >
                                                      {(selected || []).map((value) => (
                                                        <Chip key={value} label={value} />
                                                      ))}
                                                    </Box>
                                                  );
                                                }}
                                              >
                                                {nationality?.map((d) => (
                                                  <MenuItem key={d} value={d}>
                                                    {d}
                                                  </MenuItem>
                                                ))}
                                              </Select>
                                              {formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition] && (
                                                  <div
                                                    style={{
                                                      color: "red",
                                                      fontSize: "0.8rem",
                                                      paddingLeft: "1rem",
                                                    }}
                                                  >
                                                    {formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]}
                                                  </div>
                                                )}
                                            </FormControl>
                                          </Grid>
                                        </Grid>
                                      );
                                    } else if (Object.keys(item).includes("dependsOn")) {
                                      return (
                                        <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                          <Grid item md={9} sm={12}>
                                            {item.multiple ? (
                                              <FormControl key={e._id} fullWidth>
                                                <InputLabel
                                                  sx={{
                                                    transform: "translate(12px, 20px) scale(1)",
                                                    background: "#FFF",
                                                    padding: "0 5px",
                                                  }}
                                                  id="demo-multiple-chip-label"
                                                >
                                                  {e.label}
                                                </InputLabel>
                                                <Select
                                                  labelId="demo-multiple-chip-label"
                                                  id="demo-multiple-chip"
                                                  name={`${e.group}.${e.condition}.${index}.${item.condition}`}
                                                  label={e.label + " - " + item.label}
                                                  multiple
                                                  fullWidth
                                                  error={Boolean(
                                                    formik.touched?.[e.group]?.[e.condition]?.[index]?.[
                                                      item.condition
                                                    ] &&
                                                      formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                                  )}
                                                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                                  value={
                                                    formik.values?.[e.group]?.[e.condition]?.[index]?.[
                                                      item.condition
                                                    ] ?? []
                                                  }
                                                  onBlur={formik.handleBlur}
                                                  onChange={formik.handleChange}
                                                  MenuProps={MenuProps}
                                                  renderValue={(selected) => {
                                                    return (
                                                      <Box
                                                        sx={{
                                                          display: "flex",
                                                          flexWrap: "wrap",
                                                          gap: 0.5,
                                                        }}
                                                      >
                                                        {(selected || []).map((value) => (
                                                          <Chip key={value} label={value} />
                                                        ))}
                                                      </Box>
                                                    );
                                                  }}
                                                >
                                                  {e.condition === "makeAndModel"
                                                    ? makeAndModelOption?.map((i) => {
                                                        if (i.index === index) {
                                                          return i?.options?.map((o) => {
                                                            return (
                                                              <MenuItem key={o} value={o}>
                                                                {o}
                                                              </MenuItem>
                                                            );
                                                          });
                                                        }
                                                      })
                                                    : item.condition === "nationality"
                                                    ? nationality?.map((i) => (
                                                        <MenuItem key={i} value={i}>
                                                          {i}
                                                        </MenuItem>
                                                      ))
                                                    : e.condition === "excludedCarMakeModel"
                                                    ? excludedMakeAndModelOption?.map((i) => {
                                                        if (i.index === index) {
                                                          return i?.options?.map((o) => {
                                                            return (
                                                              <MenuItem key={o} value={o}>
                                                                {o}
                                                              </MenuItem>
                                                            );
                                                          });
                                                        }
                                                      })
                                                    : makeAndBodyModelOption?.map((i) => {
                                                        if (i.index === index) {
                                                          return i?.options?.map((o) => {
                                                            return (
                                                              <MenuItem key={o} value={o}>
                                                                {o}
                                                              </MenuItem>
                                                            );
                                                          });
                                                        }
                                                      })}
                                                </Select>
                                                {formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[index]?.[
                                                    item.condition
                                                  ] && (
                                                    <div
                                                      style={{
                                                        color: "red",
                                                        fontSize: "0.8rem",
                                                        paddingLeft: "1rem",
                                                      }}
                                                    >
                                                      {
                                                        formik.errors?.[e.group]?.[e.condition]?.[index]?.[
                                                          item.condition
                                                        ]
                                                      }
                                                    </div>
                                                  )}
                                              </FormControl>
                                            ) : (
                                              <TextField
                                                error={Boolean(
                                                  formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                    formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                                )}
                                                fullWidth
                                                helperText={
                                                  formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                                }
                                                label={e.label + " - " + item.label}
                                                name={`${e.group}.${e.condition}.${index}.${item.condition}`}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                onClick={(event) => {
                                                  setModel(item.model);
                                                  if (item.condition === "nationality") {
                                                    setBody({});
                                                  } else if (e.condition === "makeAndBodyType") {
                                                    setBody({
                                                      make:
                                                        selectedMakeForBody ||
                                                        formik.values?.amount?.makeAndBodyType?.[index]?.make,
                                                    });
                                                    // setModel({ model: "car:bodyType" });
                                                  } else {
                                                    setBody({
                                                      make: selectedMakeForModel,
                                                    });
                                                    // setModel({ model: "car:bodyType" });
                                                  }
                                                }}
                                                value={
                                                  formik.values?.[e.group]?.[e.condition]?.[index]?.[item.condition] ??
                                                  ""
                                                }
                                                select
                                                type={item.dType}
                                                SelectProps={{
                                                  native: true,
                                                }}
                                              >
                                                <option value="" disabled></option>
                                                {e.condition === "makeAndModel"
                                                  ? makeAndModelOption?.map((i) => {
                                                      if (i.index === index) {
                                                        return i?.options?.map((o) => {
                                                          return (
                                                            <option key={o} value={o}>
                                                              {o}
                                                            </option>
                                                          );
                                                        });
                                                      }
                                                    })
                                                  : item.condition === "nationality"
                                                  ? nationality?.map((i) => (
                                                      <option key={i} value={i}>
                                                        {i}
                                                      </option>
                                                    ))
                                                  : e.condition === "excludedCarMakeModel"
                                                  ? excludedMakeAndModelOption?.map((i) => {
                                                      if (i.index === index) {
                                                        return i?.options?.map((o) => {
                                                          return (
                                                            <option key={o} value={o}>
                                                              {o}
                                                            </option>
                                                          );
                                                        });
                                                      }
                                                    })
                                                  : makeAndBodyModelOption?.map((i) => {
                                                      if (i.index === index) {
                                                        return i?.options?.map((o) => {
                                                          return (
                                                            <option key={o} value={o}>
                                                              {o}
                                                            </option>
                                                          );
                                                        });
                                                      }
                                                    })}
                                              </TextField>
                                            )}
                                          </Grid>
                                        </Grid>
                                      );
                                    } else {
                                      return (
                                        <Grid container key={e.group + item.condition} spacing={3} padding={1}>
                                          <Grid item md={9} sm={12}>
                                            <TextField
                                              error={Boolean(
                                                formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                  formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                              )}
                                              fullWidth
                                              helperText={
                                                formik.touched?.[e.group]?.[e.condition]?.[index]?.[item.condition] &&
                                                formik.errors?.[e.group]?.[e.condition]?.[index]?.[item.condition]
                                              }
                                              label={e.label + " - " + item.label}
                                              name={`${e.group}.${e.condition}.${index}.${item.condition}`}
                                              onBlur={formik.handleBlur}
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values?.[e.group]?.[e.condition]?.[index]?.[item.condition] ?? ""
                                              }
                                              type={item.dType}
                                            ></TextField>
                                          </Grid>
                                        </Grid>
                                      );
                                    }
                                  });
                                })}
                              </>
                            );
                          }
                        }
                      }
                      // }
                    })}

                  <Box mt={3}>
                    <Typography
                      sx={{
                        color: "#F04438",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      {Boolean(formik.touched.file && formik.errors.file)}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#F04438",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                      mt={1}
                    >
                      {formik.touched.file && formik.errors.file}
                    </Typography>
                  </Box>
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
            <NextLink href={`/companies/${companyId}/motor-insurance/conditions`} passHref>
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

export default ConditionsEditForm;
