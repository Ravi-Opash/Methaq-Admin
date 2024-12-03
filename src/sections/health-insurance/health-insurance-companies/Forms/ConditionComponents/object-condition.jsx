import {
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { AddIcon } from "src/Icons/AddIcon";

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

function ObjectComditionForm({ ele, formik, setArrayofDataToMap, arrayofDataToMap, _field, field }) {
  if (ele.multiple === false) {
    return (
      <>
        <Grid ele md={9} sm={12} spacing={3} sx={{ mt: 2 }}>
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
              {ele.groupLabel}
            </Typography>
            <Box
              sx={{
                width: "-webkit-fill-available",
                borderBottom: "1px solid #B2B2B2",
              }}
            ></Box>
          </Box>
        </Grid>

        <Grid container key={ele._id} spacing={3} padding={1}>
          <Grid ele md={9} sm={12}>
            <TextField
              error={Boolean(
                formik.touched?.[ele.group]?.[ele.condition] && formik.errors?.[ele.group]?.[ele.condition]
              )}
              fullWidth
              helperText={formik.touched?.[ele.group]?.[ele.condition] && formik.errors?.[ele.group]?.[ele.condition]}
              label={ele.label}
              name={`${ele.group}.${ele.condition}`}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={
                formik.values && formik.values[ele.group] && formik.values[ele.group][ele.condition]
                  ? formik.values[ele.group][ele.condition]
                  : ""
              }
              type={ele.dType}
            />
          </Grid>
          <Grid ele md={3} sm={12}>
            <Button
              sx={{ m: 1 }}
              type="button"
              variant="contained"
              onClick={async () => {
                await formik.setFieldValue(`${ele.group}.${ele.condition}`, "");
                const updatedValues = {
                  ...formik.values[ele.group],
                };
                updatedValues[ele.condition] = undefined;
                delete updatedValues[ele.condition];
                formik.unregisterField(`${ele.group}.${ele.condition}`);
                await formik.setValues({
                  ...formik.values,
                  [ele.group]: updatedValues,
                });
                const update = field.filter((field) => field !== ele.condition);
                _field(update);

                // const updateConditionArray = allSelectedCondition.filter((ele) => ele._id !== ele._id);
                // setAllSelectedCondition(updateConditionArray);
              }}
            >
              DELETE
            </Button>
          </Grid>
        </Grid>
      </>
    );
  } else if (ele.multiple) {
    return (
      <>
        <Grid ele md={9} sm={12} spacing={3} sx={{ mt: 2 }}>
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
              {ele.groupLabel}
            </Typography>
            <Box
              sx={{
                width: "-webkit-fill-available",
                borderBottom: "1px solid #B2B2B2",
              }}
            ></Box>
          </Box>
        </Grid>

        {[...Array(ele.children || 0).keys()].map((child, index) => {
          return ele.options[0].fields.map((item, ii) => {
            if (item.options.length > 0 && !item.multiple) {
              return (
                <>
                  <Grid container key={ele.group + item.condition} spacing={3} padding={1}>
                    <Grid item md={9} sm={12}>
                      <TextField
                        error={Boolean(
                          formik.touched?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] &&
                            formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition]
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] &&
                          formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition]
                        }
                        label={ele.label + " - " + item.label}
                        name={`${ele.group}.${ele.condition}.${index}.${item.condition}`}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] ?? ""}
                        select
                        type={item.dType}
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="" disabled></option>
                        {item.options.map((i) => (
                          <option value={i} key={i}>
                            {`${i}`}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    {ii == 0 && (
                      <Grid item md={3} sm={12}>
                        <Button
                          sx={{ m: 1 }}
                          type="button"
                          variant="contained"
                          onClick={async () => {
                            const removeValueToArray = async (newValue) => {
                              let arrayData = [...arrayofDataToMap];
                              const selectedGroup = arrayData?.findIndex((item) => item.condition === newValue);
                              if ((arrayData[selectedGroup].children || 0) > 1) {
                                await formik.setFieldValue(
                                  `${ele.group}.${ele.condition}`,
                                  formik.values?.[`${ele.group}`]?.[`${ele.condition}`]?.filter(
                                    (c, cidx) => cidx !== index
                                  )
                                );

                                arrayData[selectedGroup].children = (arrayData[selectedGroup]?.["children"] || 0) - 1;
                              } else {
                                arrayData.splice(selectedGroup, 1);

                                await formik.setFieldValue(`${ele.group}.${ele.condition}`, undefined);
                                formik.unregisterField(`${ele.group}.${ele.condition}`);
                                const update = field.filter((field) => field !== ele.condition);
                                _field(update);
                              }
                              if (arrayData[0] === undefined) {
                                setArrayofDataToMap([]);
                                // setAllSelectedCondition([]);
                              } else {
                                setArrayofDataToMap(arrayData);
                              }
                            };
                            await removeValueToArray(ele.condition);
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
                                const selectedGroup = arrayData?.findIndex((item) => item.condition === newValue);

                                arrayData[selectedGroup].children = (arrayData[selectedGroup]?.["children"] || 0) + 1;
                                setArrayofDataToMap(arrayData);
                              };
                              addValueToArray(ele.condition);
                            }}
                          >
                            <AddIcon />
                          </Button>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </>
              );
            } else if (item?.multiple) {
              return (
                <Grid container key={ele.group + item.condition} spacing={3} padding={1}>
                  <Grid item md={9} sm={12}>
                    <FormControl key={item._id} fullWidth>
                      <InputLabel
                        sx={{
                          transform: "translate(12px, 20px) scale(1)",
                          background: "#FFF",
                          padding: "0 5px",
                        }}
                        id="demo-multiple-chip-label"
                      >
                        {item.label}
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        name={`${item.group}.${item.condition}`}
                        label={item.label}
                        multiple
                        fullWidth
                        error={Boolean(
                          formik.touched?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] &&
                            formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition]
                        )}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        value={
                          formik.values &&
                          formik.values[item.group] &&
                          formik.values[ele.group][ele.condition][index][item.condition]
                            ? formik.values[ele.group][ele.condition][index][item.condition]
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
                        {item.options?.map((d) => (
                          <MenuItem key={d} value={d}>
                            {d}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] &&
                        formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] && (
                          <div
                            style={{
                              color: "red",
                              fontSize: "0.8rem",
                              paddingLeft: "1rem",
                            }}
                          >
                            {formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition]}
                          </div>
                        )}
                    </FormControl>
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
                            const selectedGroup = arrayData?.findIndex((item) => item.condition === newValue);
                            if ((arrayData[selectedGroup].children || 0) > 1) {
                              await formik.setFieldValue(
                                `${ele.group}.${ele.condition}`,
                                formik.values?.[`${ele.group}`]?.[`${ele.condition}`]?.filter(
                                  (c, cidx) => cidx !== index
                                )
                              );

                              arrayData[selectedGroup].children = (arrayData[selectedGroup]?.["children"] || 0) - 1;
                            } else {
                              arrayData.splice(selectedGroup, 1);

                              await formik.setFieldValue(`${ele.group}.${ele.condition}`, undefined);
                              formik.unregisterField(`${ele.group}.${ele.condition}`);
                              const update = field.filter((field) => field !== ele.condition);
                              _field(update);
                            }
                            if (arrayData[0] === undefined) {
                              setArrayofDataToMap([]);
                              // setAllSelectedCondition([]);
                            } else {
                              setArrayofDataToMap(arrayData);
                            }
                          };
                          await removeValueToArray(ele.condition);
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
                              const selectedGroup = arrayData?.findIndex((item) => item.condition === newValue);

                              arrayData[selectedGroup].children = (arrayData[selectedGroup]?.["children"] || 0) + 1;
                              setArrayofDataToMap(arrayData);
                            };
                            addValueToArray(ele.condition);
                          }}
                        >
                          <AddIcon />
                        </Button>
                      )}
                    </Grid>
                  }
                </Grid>
              );
            } else if (item?.dType == "string" || item?.dType == "number") {
              if (
                item.dependsOn &&
                formik.values?.[ele.group]?.[ele.condition]?.[index]?.[item.dependsOn] == item?.dependsValue
              ) {
                return (
                  <Grid container key={ele.group + item.condition} spacing={3} padding={1}>
                    <Grid item md={9} sm={12}>
                      <TextField
                        error={Boolean(
                          formik.touched?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] &&
                            formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition]
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] &&
                          formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition]
                        }
                        label={ele.label + " - " + item.label}
                        name={`${ele.group}.${ele.condition}.${index}.${item.condition}`}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] ?? ""}
                        type={item.dType}
                      ></TextField>
                    </Grid>
                  </Grid>
                );
              } else if (
                item.dependsOn &&
                formik.values?.[ele.group]?.[ele.condition]?.[index]?.[item.dependsOn] != item?.dependsValue
              ) {
                return <></>;
              } else {
                return (
                  <Grid container key={ele.group + item.condition} spacing={3} padding={1}>
                    <Grid item md={9} sm={12}>
                      <TextField
                        error={Boolean(
                          formik.touched?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] &&
                            formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition]
                        )}
                        fullWidth
                        helperText={
                          formik.touched?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] &&
                          formik.errors?.[ele.group]?.[ele.condition]?.[index]?.[item.condition]
                        }
                        label={ele.label + " - " + item.label}
                        name={`${ele.group}.${ele.condition}.${index}.${item.condition}`}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values?.[ele.group]?.[ele.condition]?.[index]?.[item.condition] ?? ""}
                        type={item.dType}
                      ></TextField>
                    </Grid>
                  </Grid>
                );
              }
            }
          });
        })}
      </>
    );
  }
}

export default ObjectComditionForm;
