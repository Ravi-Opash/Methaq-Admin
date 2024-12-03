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

function BooleanComditionForm({ item, formik, setArrayofDataToMap, arrayofDataToMap, _field, field }) {
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

      <Grid container key={item._id} spacing={3} padding={1}>
        <Grid item md={9} sm={12}>
          <TextField
            error={Boolean(formik.touched?.[item.group]?.[item.condition] && formik.errors?.[item.group]?.[item.condition])}
            fullWidth
            defaultValue={"true"}
            helperText={formik.touched?.[item.group]?.[item.condition] && formik.errors?.[item.group]?.[item.condition]}
            label={item.label}
            name={`${item.group}.${item.condition}`}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={
              formik.values && formik.values[item.group] && formik.values[item.group][item.condition]
                ? formik.values[item.group][item.condition]
                : ""
            }
            select
            type={item.dType}
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

export default BooleanComditionForm;
