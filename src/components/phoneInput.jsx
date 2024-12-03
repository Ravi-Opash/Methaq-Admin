// This is a phone input field for flag dropdown

import React, { useState } from "react";
import { Box } from "@mui/system";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Typography, styled } from "@mui/material";

const PhoneInputIntl = styled(PhoneInput)({});

const PhoneInputs = ({
  name = "mobileNumber",
  padding = "18.2px 65px",
  label = "Phone number",
  formik,
  disabled = false,
}) => {
  const [focus, setFocus] = useState(false);
  const keys = name?.split(/[\.\[\]]+/).filter(Boolean);

  let value = formik?.values;
  let errors = formik?.errors;
  let touched = formik?.touched;
  keys?.forEach((key) => {
    value = value?.[key];
    errors = errors?.[key];
    touched = touched?.[key];
  });
  let error = errors && touched;

  return (
    <Box
      sx={{
        display: "inline-block",
        width: "100%",
      }}
    >
      <PhoneInputIntl
        id={name}
        sx={{
          ".special-label": {
            zIndex: "3 !important",
            color: focus ? "#60176f" : error ? "#F04438" : "#707070",
          },
          ".flag-dropdown": {
            margin: "1px !important",
          },
          "&:focus": {
            boxShadow: "0 0 0 1px #60176f !important",
            border: "1px solid #60176f !important",
          },
          ".intl-phone-input": {
            "&:focus": {
              boxShadow: "0 0 0 1px #60176f !important",
              borderColor: "#60176f !important",
            },
            "&:disabled": {
              boxShadow: "rgba(17, 25, 39, 0.15) !important",
              borderColor: "rgba(17, 25, 39, 0.15) !important",
              color: "rgba(17, 25, 39, 0.50) !important",
            },
          },
        }}
        inputProps={{
          name: name,
        }}
        disabled={disabled}
        countryCodeEditable={false}
        value={name ? `971${value}` : ""}
        specialLabel={label}
        onlyCountries={["ae"]}
        masks={{ ae: "... ... ..." }}
        inputClass="intl-phone-input"
        inputStyle={{
          color: "black",
          fontSize: "16px",
          border: focus ? "1px solid #60176f " : error ? "3px solid #F04438" : "1px solid #CACACA80",
          borderRadius: "8px",
          width: "100%",
          padding: padding,
          transition: "box-shadow ease .25s,border-color ease .25s",
        }}
        buttonClass="intl-phone-input-button"
        country={"ae"}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={(e) => {
          formik.handleBlur(e);
          setFocus(false);
        }}
        onChange={(value, data) => {
          if (name) {
            formik.setFieldValue(name, `${value}`?.slice(data?.dialCode?.length));
          }
        }}
      />
      {error && (
        <Typography sx={{ fontSize: 12, color: "#F04438", ml: 1.5, mt: 0.25, fontWeight: 500 }}>{errors}</Typography>
      )}
    </Box>
  );
};

export default PhoneInputs;
