import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { EditCarDetails } from "./Action/proposalsAction";
import { useDispatch } from "react-redux";
import { setProposalDetail } from "./Reducer/proposalsSlice";
import { editCustomerQuotationDetails } from "../customer/reducer/customerSlice";

function CarColorSelect({ options = [], proposalDetail, customerQuotationDetails = {} }) {
  const dispatch = useDispatch();
  const [focusMsg, setFocusMsg] = useState(![...options].includes(proposalDetail?.car?.color));
  const [selectedValue, setSelectedValue] = useState(
    [...options].includes(proposalDetail?.car?.color) ? proposalDetail?.car?.color : ``
  );
  const onSelectCarColorHandler = (value) => {
    setSelectedValue(value);
    const payload = {
      color: value,
    };
    const formData = jsonToFormData(payload);
    dispatch(
      EditCarDetails({
        id: proposalDetail?.car?._id,
        data: formData,
      })
    )
      .unwrap()
      .then((res) => {
        toast.success("Sucessfully color updated");
        dispatch(setProposalDetail({ ...proposalDetail, car: res?.data }));
        dispatch(editCustomerQuotationDetails({ ...customerQuotationDetails, carId: res?.data }));
      })
      .catch((err) => {
        toast(err, {
          type: "error",
        });
      });
  };
  return (
    <Box sx={{ my: 1, mx: 2, display: "flex", alignItems: "center" }}>
      <Box sx={{ position: "relative" }}>
        <Autocomplete
          sx={{ width: 250 }}
          id="color"
          options={options.map((str) => str.charAt(0).toUpperCase() + str.slice(1))}
          loading={options?.length == 0}
          onChange={(e, value) => {
            onSelectCarColorHandler(value?.toLowerCase());
          }}
          value={selectedValue || ``}
          ListboxProps={{ style: { maxHeight: 250 } }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Car Color"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {options?.length == 0 ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        {focusMsg && !selectedValue && (
          <Box
            sx={{
              bottom: "35px",
              transform: { xs: "translate(-88%, 0%)", md: "translate(0%, -35%)" },
              zIndex: 999,
              height: "max-content",
              p: 1,
              position: "absolute",
              backgroundColor: "rgba(96,23,111, 0.89)",
              color: "#FFFFFF",
              minWidth: 280,
              fontSize: "14px",
              borderRadius: "10px",
              "&:after": {
                content: '""',
                position: "absolute",
                top: "100%", // Changed from bottom to top
                left: { xs: "unset", md: "calc(47% + 2px)" },
                right: { xs: "10px", md: "unset" },
                background: "rgba(96,23,111, 0.89)",
                width: "14px",
                height: "14px",
                clipPath: "polygon(50% 100%, 0 0, 100% 0)", // Changed clipPath to point downward
              },
            }}
          >
            <Box sx={{ position: "relative", pt: 1 }}>
              <CancelIcon
                sx={{ color: "#fff", position: "absolute", top: -4, right: -4, cursor: "pointer" }}
                onClick={() => {
                  setFocusMsg(false);
                }}
              />
              <Typography
                gutterBottom
                sx={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: {
                    xs: "13px",
                    sm: "14px",
                    md: "14px",
                  },
                  textAlign: "center",
                }}
              >
                Select Car Color. It is important because wrong color may cause isuue with linking motor policy to RTA.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CarColorSelect;
