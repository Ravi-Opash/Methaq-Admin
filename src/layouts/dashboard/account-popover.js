import { useCallback, useContext, useState } from "react";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { AuthContext } from "src/contexts/auth-context";
import ModalComp from "src/components/modalComp";
import { ChangePassword } from "src/sections/account/change-password";
import { ChangePasswordIcon } from "src/Icons/ChangePssword";
import { LogOutIcon } from "src/Icons/LogOutIcon";
import Link from "next/link";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const auth = useAuth();
  const userData = useContext(AuthContext);

  const [openModal, setOpenModal] = useState(false);

  const handleSignOut = useCallback(() => {
    onClose?.();
    auth.signOut();
  }, [onClose, auth]);

  const handlePasswordChange = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        onClose={onClose}
        open={open}
        PaperProps={{ sx: { width: 200 } }}
      >
        <Box
          sx={{
            py: 1.5,
            px: 2,
            cursor: userData?.user?.role == "Admin" ? "pointer" : "unset",
            "&:hover": {
              backgroundColor: userData?.user?.role == "Admin" ? "action.hover" : "unset",
            },
          }}
        >
          {userData?.user?.role == "Admin" ? (
            <Link href="/account" style={{ textDecoration: "none", color: "#707070" }} onClick={() => onClose()}>
              <Typography variant="overline">Account</Typography>
              <Typography color="text.secondary" variant="body2">
                {userData?.user?.email}
              </Typography>
            </Link>
          ) : (
            <>
              <Typography variant="overline">Account</Typography>
              <Typography color="text.secondary" variant="body2">
                {userData?.user?.email}
              </Typography>
            </>
          )}
        </Box>
        <Divider />
        <MenuList
          disablePadding
          dense
          sx={{
            p: "8px",
            "& > *": {
              borderRadius: 1,
            },
          }}
        >
          <MenuItem onClick={handlePasswordChange}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChangePasswordIcon sx={{ color: "#707070" }} />
              <Typography sx={{ fontSize: "14px" }}> Change Password</Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LogOutIcon sx={{ color: "#707070" }} />
              <Typography sx={{ fontSize: "14px" }}> Sign out</Typography>
            </Box>
          </MenuItem>
        </MenuList>
      </Popover>
      <ModalComp open={openModal} handleClose={handleClose} widths={{ xs: "95%", sm: 550 }}>
        <ChangePassword handleClose={handleClose} />
      </ModalComp>
    </>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
