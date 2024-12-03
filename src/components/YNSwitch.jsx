// This is a switch component for yes and no

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

function YNSwitch({ formik, name }) {
  const [switchValue, setSwitchValue] = useState(formik.values[name]);
  useEffect(() => {
    setSwitchValue(formik.values[name]);
  }, [formik.values[name]]);
  return (
    <Box
      onClick={() => {
        setSwitchValue(!switchValue);
        formik.setFieldValue(name, !switchValue);
      }}
      sx={{ display: "flex", borderRadius: "15px", cursor: "pointer", border: "1px solid #707070", width: "100px" }}
    >
      <Box
        sx={{
          width: "50px",
          borderRadius: "15px 0px 0px 15px",
          cursor: "pointer",
          background: switchValue ? "#60176F" : "white",
          color: "white",
          py: 1,
          px: 2,
          fontWeight: 600,
        }}
      >
        Yes
      </Box>
      <Box
        sx={{
          width: "50px",
          borderRadius: "0px 15px 15px 0px",
          cursor: "pointer",
          background: switchValue ? "white" : "#70707012",
          color: switchValue ? "white" : "#707070",
          py: 1,
          px: 1.5,
          fontWeight: 600,
        }}
      >
        No
      </Box>
    </Box>
  );
}

export default YNSwitch;
