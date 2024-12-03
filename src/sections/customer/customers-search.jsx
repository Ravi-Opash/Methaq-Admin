import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Button, Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

export const CustomersSearch = ({ searchFilterHandler, placeHolder, isButton, onButtonClick, defaultValue = "" }) => (
  <Card
    sx={{
      p: 2,
      display: "flex",
      gap: 1,
      flexDirection: { md: "row", xs: "column" },
      // justifyContent: "center",
      alignItems: "center",
    }}
  >
    <OutlinedInput
      defaultValue={defaultValue || ""}
      fullWidth
      placeholder={placeHolder || "Search customer"}
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
    {isButton && (
      <Button variant="contained" onClick={onButtonClick} sx={{ ml: "auto" }}>
        Export CSV
      </Button>
    )}
  </Card>
);
