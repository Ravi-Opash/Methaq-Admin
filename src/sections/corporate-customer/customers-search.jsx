import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Button, Card, Grid, InputAdornment, OutlinedInput, SvgIcon, TextField } from "@mui/material";
import { setCorporateCustomerDetails } from "./reducer/corpotateCustomerSlice";
import { useDispatch } from "react-redux";
import { getAllAgentlist } from "../Proposals/Action/proposalsAction";
import { useEffect, useRef, useState } from "react";

export const CorporateCustomersSearch = ({
  searchFilterHandler,
  placeHolder,
  searchFilter,
  statusOptions = [],
  filterLabel = "Option",
  defaultValue =''
}) => {
  const dispatch = useDispatch();

  const [agentList, setAgentList] = useState([]);

  const initial = useRef(false);

  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    dispatch(getAllAgentlist({}))
      .unwrap()
      .then((res) => {
        setAgentList(res?.data);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        gap: 1,
        flexDirection: { md: "row", xs: "column" },
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={5} xl={4}>
          <OutlinedInput
            defaultValue={defaultValue || ''}
            fullWidth
            name="name"
            placeholder={placeHolder || "Search customer"}
            onChange={(e) => searchFilterHandler(e.target.name, e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
            sx={{ maxWidth: 500 }}
          />
        </Grid>
        <Grid item xs={0} sm={2} md={2} xl={4}></Grid>
        <Grid item xs={12} sm={4} md={2} xl={2}>
          <TextField
            fullWidth
            label="Filter by agent"
            name="agentId"
            onChange={(e) => {
              searchFilterHandler(e.target.name, e.target.value);
            }}
            select
            SelectProps={{ native: true }}
            value={searchFilter?.agentId}
          >
            <option value=""></option>
            {agentList.map((agent, idx) => {
              if (!agent?.userId?._id) {
                return;
              }
              return (
                <option key={idx} value={agent?.userId?._id}>
                  {agent?.userId?.fullName}
                </option>
              );
            })}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} md={3} xl={2}>
          <TextField
            fullWidth
            label={filterLabel}
            name="type"
            onChange={(e) => {
              searchFilterHandler(e.target.name, e.target.value);
            }}
            select
            SelectProps={{ native: true }}
            value={searchFilter?.type}
          >
            <option value={""}></option>
            {statusOptions.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Card>
  );
};
