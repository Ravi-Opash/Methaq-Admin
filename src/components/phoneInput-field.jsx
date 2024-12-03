// This is a phone input field for flag dropdown

import React from "react";
import { Box } from "@mui/system";
import PhoneInput from "react-phone-input-2";
import styled from "@emotion/styled";
import "react-phone-input-2/lib/material.css";

const PhoneInputIntl = styled(PhoneInput)({
  ".special-label": {
    zIndex: "3 !important",
  },
  ".flag-dropdown": {
    margin: "1px !important",
  },
  "&:focus": {
    boxShadow: "0 0 0 1px #60176f !important",
    borderColor: "#60176f !important",
  },
  "&:hover": {
  },

  ".intl-phone-input": {
    "&:focus": {
      boxShadow: "0 0 0 1px #60176f !important",
      borderColor: "#60176f !important",
    },
    "&:hover": {
    },
    "&:disabled": {
      boxShadow: "rgba(17, 25, 39, 0.15) !important",
      borderColor: "rgba(17, 25, 39, 0.15) !important",
      color: "rgba(17, 25, 39, 0.50) !important",
    },
  },
});

const PhoneNumberInput = ({
  name,
  padding,
  label,
  handleMobileNumberChange,
  formik,
  setIsError,
  isError,
  isDisabled,
}) => {
  const keys = name?.split(/[\.\[\]]+/).filter(Boolean);

  let value = formik?.values;
  keys?.forEach((key) => {
    value = value?.[key];
  });
  let errors;
  let error = formik?.errors;
  keys?.forEach((key) => {
    errors = error?.[key];
  });

  return (
    <Box
      sx={{
        display: "inline-block",
        width: "100%",
      }}
    >
      <PhoneInputIntl
        inputProps={{
          name: name || "mobile",
        }}
        disabled={isDisabled || false}
        countryCodeEditable={false}
        value={name ? `971${value}` : formik?.values?.mobile}
        specialLabel={label ? label : "Phone number"}
        onlyCountries={["ae"]}
        masks={{ ae: "... ... ..." }}
        inputClass="intl-phone-input"
        inputStyle={{
          color: "black",
          fontSize: "16px",
          border: "1px solid #CACACA",
          borderRadius: "8px",
          width: "100%",
          padding: !!padding ? padding : "18.2px 65px",
          transition: "box-shadow ease .25s,border-color ease .25s",
          borderWidth: isError && (formik?.errors?.mobileNumber || errors) ? "2px" : "1px",
          borderColor: isError && (formik?.errors?.mobileNumber || errors) ? "#d32f2f" : "#CACACA",
        }}
        buttonClass="intl-phone-input-button"
        country={"ae"}
        onBlur={() => setIsError(true)}
        onChange={(value, data, event, formattedValue) => {
          if (name) {
            formik.setFieldValue(name, `${value}`?.slice(data?.dialCode?.length));
          }
          handleMobileNumberChange(value, data?.dialCode, `${value}`?.slice(data?.dialCode?.length));
        }}
      />
    </Box>
  );
};

export default PhoneNumberInput;
