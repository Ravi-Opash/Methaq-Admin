import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";
import { useContext } from "react";
import { AuthContext } from "src/contexts/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "src/utils/socket";
import { debounce } from "src/utils/debounce-search";
import ModalComp from "src/components/modalComp";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import IdleModal from "src/sections/account/idle-modal";
import { setIsAgentOnline } from "src/redux/slices/authSlice";

const SIDE_NAV_WIDTH = 280; // left nav width

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
});

export const Layout = withAuthGuard((props) => {
  const value = useContext(AuthContext);
  const dispatch = useDispatch();

  const { loginUserData: user } = useSelector((state) => state.auth);

  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(() => {
    handlePathnameChange();
  }, [pathname]);

  const [idleMessage, setIdleMessage] = useState("");
  const [temp, setTemp] = useState(false);
  const handleClose = () => {
    setIdleMessage("");
    dispatch(setIsAgentOnline(true));
    myFunction();
  };

  const myFunction = (e) => {
    setTemp(!temp);
    if (socket) {
      if (socket.disconnected) socket.connect();

      let idleTimeout;

      const resetIdleTimer = () => {
        if (idleTimeout) {
          clearTimeout(idleTimeout);
        }
        idleTimeout = setTimeout(() => {
          socket.emit("activity", { room: user?._id });
        }, 500); // Check activity every 5 seconds
      };

      resetIdleTimer();

      socket.off("idle");
      socket.on("idle", (message) => {
        setIdleMessage(message);
        dispatch(setIsAgentOnline(false));
      });
    }
  };
  const debounceHandler = debounce(myFunction, 2000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document?.getElementById("main-body")?.addEventListener("mousemove", (event) => {
        debounceHandler(event);
      });
    }
  }, [temp]);

  return (
    <Box id="main-body">
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
      <ModalComp open={!!idleMessage} handleClose={() => {}} widths={{ xs: "450px" }}>
        <IdleModal handleClose={handleClose} idleMessage={idleMessage} />
      </ModalComp>
    </Box>
  );
});
