import { Box, Button, CardHeader, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllProposalQuotationTable from "./all-proposal-quotation-table";
import { getComparisonQuotations } from "./Action/proposalsAction";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const GenerateComparisonModal = ({ handleComparisonModalClose }) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { proposalQuotationFullList, proposalQuotationFullListLoader } = useSelector(
    (state) => state.proposals
  );

  //   console.log("proposalQuotationFullList", proposalQuotationFullList);

  //   const [selectItem, setSelectItem] = useState("");
  //   const selectItemHandler = useCallback((value) => {
  //     setSelectItem(value);
  //   }, []);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleCheckboxChange = (value) => {
    if (selectedCheckboxes.includes(value)) {
      // Checkbox already selected, remove it from the selected checkboxes
      setSelectedCheckboxes(selectedCheckboxes.filter((item) => item !== value));
    } else {
      // Limit the selection to four checkboxes
      if (selectedCheckboxes.length < 4) {
        setSelectedCheckboxes([...selectedCheckboxes, value]);
      }
    }
  };

  //   console.log("selectedCheckboxes", selectedCheckboxes);

  const submitHandler = () => {
    if (selectedCheckboxes.length >= 2) {
      dispatch(getComparisonQuotations({ ids: selectedCheckboxes }))
        .unwrap()
        .then((res) => {
          // console.log("res", res);
          if (res?.success) {
            router.push("/quotations/compare-quotation");
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    } else {
      toast("Please select atleast 2 quotation", {
        type: "error",
      });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexFlow: "column", mb: 2 }}>
        <CardHeader title="Compare plans" sx={{ p: 0, mb: 2 }} />
        <Typography variant="subtitle2">Select up to 4 plans to compare</Typography>
      </Box>

      <Box sx={{ display: "inline-block", width: "100%" }}>
        {/* <AllProposalQuotationTable /> */}

        {proposalQuotationFullList && (
          <AllProposalQuotationTable
            items={proposalQuotationFullList}
            selectItemHandler={handleCheckboxChange}
            selectItem={selectedCheckboxes}
          />
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
        mt={3}
      >
        <Button type="button" variant="contained" onClick={() => submitHandler()}>
          Submit
        </Button>

        <Button variant="outlined" type="button" onClick={() => handleComparisonModalClose()}>
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default GenerateComparisonModal;
