// This is a top nav search component for company portal

import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllCarCompanies } from "src/sections/companies/action/companyAcrion";
import SearchIcon from "@mui/icons-material/Search";

function PortalSearch() {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [allData, setAllData] = useState([]);
  const [value, setValue] = useState("");

  const initialized = useRef(false);

  // Function to fetch all companies
  const getCompniesNameList = () => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    // get all companies
    dispatch(getAllCarCompanies({ key: "", search: "" }))
      .unwrap()
      .then((res) => {
        setAllData(res);
        const arr = [];
        const filterRes = res.filter((r) => r.companyPortal);
        filterRes.map((i) => {
          arr.push(i?.companyName);
        });
        setOptions(arr);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // useEffect to fetch all companies
  useEffect(() => {
    getCompniesNameList();
  }, []);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      ListboxProps={{ style: { maxHeight: 250 } }}
      options={options}
      // value={value}
      size="small"
      sx={{
        width: { xs: 150, sm: 300 },
        "& .MuiAutocomplete-popupIndicator": { transform: "none" },
        mr: { xs: 0, sm: 5 },
      }}
      popupIcon={<SearchIcon />}
      onChange={(e, newValue) => {
        if (!newValue) {
          setValue("");
          return;
        }
        setValue(newValue);
        const aa = allData.find((item) => item?.companyName === newValue);
        if (!aa?.companyPortal) {
          return;
        }
        let pdfUrl = aa?.companyPortal;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }}
      onSelect={() => {
        setValue("");
      }}
      renderInput={(params) => <TextField size="small" {...params} label="Portals" />}
    />
  );
}

export default PortalSearch;
