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

function StringNumberComditionForm({ item, formik, setArrayofDataToMap, arrayofDataToMap, _field, field }) {
  if (item.multiple === false) {
    return (
      <>
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
              {item.groupLabel}
            </Typography>
            <Box
              sx={{
                width: "-webkit-fill-available",
                borderBottom: "1px solid #B2B2B2",
              }}
            ></Box>
          </Box>
        </Grid>

        <Grid container key={item._id} spacing={3} padding={1}>
          <Grid item md={9} sm={12}>
            <TextField
              error={Boolean(
                formik.touched?.[item.group]?.[item.condition] && formik.errors?.[item.group]?.[item.condition]
              )}
              fullWidth
              helperText={
                formik.touched?.[item.group]?.[item.condition] && formik.errors?.[item.group]?.[item.condition]
              }
              label={item.label}
              name={`${item.group}.${item.condition}`}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={
                formik.values && formik.values[item.group] && formik.values[item.group][item.condition]
                  ? formik.values[item.group][item.condition]
                  : ""
              }
              type={item.dType}
            />
          </Grid>
          <Grid item md={3} sm={12}>
            <Button
              sx={{ m: 1 }}
              type="button"
              variant="contained"
              onClick={async () => {
                let arrayData = [...arrayofDataToMap];

                const selectedGroup = arrayData?.findIndex((i) => i.condition === item.condition);

                arrayData.splice(selectedGroup, 1);

                await formik.setFieldValue(`${item.group}.${item.condition}`, []);
                const updatedValues = {
                  ...formik.values[item.group],
                };
                updatedValues[item.condition] = undefined;
                delete updatedValues[item.condition];
                formik.unregisterField(`${item.group}.${item.condition}`);
                await formik.setValues({
                  ...formik.values,
                  [item.group]: updatedValues,
                });
                const update = field.filter((field) => field !== item.condition);
                _field(update);

                if (arrayData[0] === undefined) {
                  setArrayofDataToMap([]);
                } else {
                  setArrayofDataToMap(arrayData);
                }
              }}
            >
              DELETE
            </Button>
          </Grid>
        </Grid>
      </>
    );
  } else if (item.multiple) {
    return (
      <>
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
              {item.groupLabel}
            </Typography>
            <Box
              sx={{
                width: "-webkit-fill-available",
                borderBottom: "1px solid #B2B2B2",
              }}
            ></Box>
          </Box>
        </Grid>

        <Grid key={item._id} container spacing={3} padding={1}>
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
                  formik.touched?.[item.group]?.[item.condition] && formik.errors?.[item.group]?.[item.condition]
                )}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                value={
                  formik.values && formik.values[item.group] && formik.values[item.group][item.condition]
                    ? formik.values[item.group][item.condition]
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
              {formik.touched?.[item.group]?.[item.condition] && formik.errors?.[item.group]?.[item.condition] && (
                <div
                  style={{
                    color: "red",
                    fontSize: "0.8rem",
                    paddingLeft: "1rem",
                  }}
                >
                  {formik.errors?.[item.group]?.[item.condition]}
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
                let arrayData = [...arrayofDataToMap];

                const selectedGroup = arrayData?.findIndex((i) => i.condition === item.condition);

                arrayData.splice(selectedGroup, 1);

                await formik.setFieldValue(`${item.group}.${item.condition}`, []);
                const updatedValues = {
                  ...formik.values[item.group],
                };
                updatedValues[item.condition] = undefined;
                delete updatedValues[item.condition];
                formik.unregisterField(`${item.group}.${item.condition}`);
                await formik.setValues({
                  ...formik.values,
                  [item.group]: updatedValues,
                });
                const update = field.filter((field) => field !== item.condition);
                _field(update);

                if (arrayData[0] === undefined) {
                  setArrayofDataToMap([]);
                } else {
                  setArrayofDataToMap(arrayData);
                }
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

export default StringNumberComditionForm;
