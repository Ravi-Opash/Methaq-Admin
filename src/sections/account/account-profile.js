import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Switch,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    margin: "0 !important",
    marginLeft: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#60176F",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);

export const AccountProfile = ({ user }) => {
  const isPraktora = localStorage.getItem("isPraktora") ? JSON.parse(localStorage.getItem("isPraktora")) : false;
  const [selected, SetSelected] = useState(isPraktora);

  return (
    <>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              src={"/assets/avatars/avatar-anika-visser.png"}
              sx={{
                height: 80,
                mb: 2,
                width: 80,
              }}
            />
            <Typography gutterBottom variant="h5">
              {user?.fullName}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.email}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.timezone}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 3, maxWidth: 400 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="h6">Access</Typography>
            <Divider sx={{ border: "2px solid #60176F", width: 65 }} />
            <Box sx={{ display: "flex", gap: 7, mt: 2 }}>
              <Typography>Proktora : </Typography>
              <IOSSwitch
                name="switch"
                id="switch"
                onChange={(e) => {
                  localStorage?.setItem("isPraktora", e?.target?.checked);
                  SetSelected(e?.target?.checked);
                }}
                checked={selected}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
