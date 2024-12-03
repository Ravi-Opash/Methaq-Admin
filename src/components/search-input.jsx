// This is the search input field

import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

export const SearchInput = ({ searchFilterHandler, placeHolder, defaultValue = "" }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      defaultValue={defaultValue}
      fullWidth
      placeholder={placeHolder || ""}
      onChange={(e) => searchFilterHandler(e.target.value)}
      startAdornment={
        <InputAdornment position="start">
          <SvgIcon color="action" fontSize="small">
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      }
      sx={{ maxWidth: 500 }}
    />
  </Card>
);
